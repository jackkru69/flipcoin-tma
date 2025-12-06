/**
 * Composable for fetching games from API with reservation status
 * @module composables/useGamesAPI
 *
 * Integrates with:
 * - TanStack Query for data fetching and caching
 * - WebSocket for real-time updates when watching a specific game
 */

import { computed, ref, watch, onUnmounted, type Ref } from 'vue';
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/vue-query';
import { Address } from '@ton/core';
import type { GameListResponse, APIGame } from '../types/api';
import type { GameInfo } from '../types/contract';
import type { Reservation } from '../types/reservation';
import { GAME_STATUS_WAITING_FOR_OPPONENT } from '../types/contract';
import { getWebSocketService } from '../services/websocket';
import type { WSMessage } from '../types/websocket';
import {
  isGameStateUpdate,
  isReservationCreated,
  isReservationReleased,
} from '../types/websocket';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';
const DEFAULT_PAGE_SIZE = 20;

/**
 * Fetch games from API with pagination
 */
async function fetchGames(
  status: number = GAME_STATUS_WAITING_FOR_OPPONENT,
  limit: number = DEFAULT_PAGE_SIZE,
  offset: number = 0
): Promise<GameListResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/games`);
  url.searchParams.set('status', String(status));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch games');
  }

  return response.json();
}

/**
 * Convert API game to GameInfo format compatible with existing components
 */
export function apiGameToGameInfo(game: APIGame): GameInfo {
  // Parse addresses - handle null/undefined for optional fields
  const playerTwo = game.player_two_address
    ? Address.parse(game.player_two_address)
    : Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'); // Zero address as placeholder

  const winner = game.winner_address
    ? Address.parse(game.winner_address)
    : Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

  return {
    gameId: BigInt(game.game_id),
    status: BigInt(game.status),
    playerOne: Address.parse(game.player_one_address),
    playerTwo: playerTwo,
    bidValue: BigInt(game.bet_amount),
    totalGainings: BigInt(game.payout_amount || 0),
    playerOneChosenSide: BigInt(game.player_one_choice),
    playerTwoChosenSide: BigInt(game.player_two_choice || 0),
    gameCreatedTimestamp: BigInt(Math.floor(new Date(game.created_at).getTime() / 1000)),
    gameStartedTimestamp: game.joined_at ? BigInt(Math.floor(new Date(game.joined_at).getTime() / 1000)) : BigInt(0),
    winner: winner,
    configReceived: true, // Always true for games from API
  };
}

/**
 * Composable for fetching games from API
 * Replaces usePODContract for game listing with API-based approach
 */
export function useGamesAPI(status: number = GAME_STATUS_WAITING_FOR_OPPONENT) {
  // Local state for reservations (updated via WebSocket)
  const reservationUpdates = ref<Map<number, Reservation | null>>(new Map());

  // Simple query for games list
  const gamesQuery = useQuery({
    queryKey: ['api', 'games', status],
    queryFn: () => fetchGames(status, 100, 0), // Fetch up to 100 games
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Infinite query for paginated games
  const paginatedGamesQuery = useInfiniteQuery({
    queryKey: ['api', 'games', 'paginated', status],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchGames(status, DEFAULT_PAGE_SIZE, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.games.length, 0);
      if (totalFetched >= lastPage.total) {
        return undefined;
      }
      return totalFetched;
    },
  });

  // Computed: All games from paginated query as GameInfo with merged reservation updates
  const allGames = computed((): GameInfo[] => {
    if (!paginatedGamesQuery.data.value) return [];

    const result: GameInfo[] = [];
    for (const page of paginatedGamesQuery.data.value.pages) {
      for (const gameWithRes of page.games) {
        result.push(apiGameToGameInfo(gameWithRes.game));
      }
    }
    return result;
  });

  // Simple games list as GameInfo for basic usage
  const games = computed((): GameInfo[] => {
    if (!gamesQuery.data.value) return [];
    return gamesQuery.data.value.games.map((gwr) => apiGameToGameInfo(gwr.game));
  });

  // Reservations map (gameId -> Reservation)
  const reservations = computed((): ReadonlyMap<number, Reservation> => {
    const map = new Map<number, Reservation>();

    // First add from API response
    if (gamesQuery.data.value) {
      for (const gwr of gamesQuery.data.value.games) {
        if (gwr.reservation && gwr.reservation.status === 'active') {
          map.set(gwr.game.game_id, gwr.reservation);
        }
      }
    }

    // Then override with WebSocket updates
    for (const [gameId, reservation] of reservationUpdates.value) {
      if (reservation && reservation.status === 'active') {
        map.set(gameId, reservation);
      } else {
        map.delete(gameId);
      }
    }

    return map;
  });

  // Check if a specific game is reserved
  function isGameReserved(gameId: number): boolean {
    return reservations.value.has(gameId);
  }

  // Get reservation for a specific game
  function getReservation(gameId: number): Reservation | null {
    return reservations.value.get(gameId) ?? null;
  }

  // Check if a game is reserved by a specific wallet
  function isReservedByWallet(gameId: number, walletAddress: string): boolean {
    const reservation = getReservation(gameId);
    if (!reservation || reservation.status !== 'active') {
      return false;
    }

    // Normalize addresses for comparison - both to raw format
    try {
      const reservationAddr = Address.parse(reservation.wallet_address).toRawString();
      const userAddr = Address.parse(walletAddress).toRawString();
      return reservationAddr === userAddr;
    } catch {
      // Fallback to lowercase comparison if parsing fails
      return reservation.wallet_address.toLowerCase() === walletAddress.toLowerCase();
    }
  }

  // Update reservation from WebSocket event
  function updateReservation(gameId: number, reservation: Reservation | null): void {
    reservationUpdates.value.set(gameId, reservation);
  }

  // Clear reservation update (e.g., after a full refresh)
  function clearReservationUpdate(gameId: number): void {
    reservationUpdates.value.delete(gameId);
  }

  // Clear all reservation updates
  function clearAllReservationUpdates(): void {
    reservationUpdates.value.clear();
  }

  return {
    // Queries
    gamesQuery,
    paginatedGamesQuery,

    // Computed data - GameInfo[] format compatible with existing components
    games,
    allGames,
    reservations,
    isLoading: computed(() => gamesQuery.isLoading.value || paginatedGamesQuery.isLoading.value),
    isError: computed(() => gamesQuery.isError.value || paginatedGamesQuery.isError.value),
    error: computed(() => gamesQuery.error.value || paginatedGamesQuery.error.value),

    // Reservation helpers
    isGameReserved,
    getReservation,
    isReservedByWallet,
    updateReservation,
    clearReservationUpdate,
    clearAllReservationUpdates,

    // Refetch functions
    refetch: () => {
      clearAllReservationUpdates();
      return gamesQuery.refetch();
    },
    fetchNextPage: () => paginatedGamesQuery.fetchNextPage(),
    hasNextPage: computed(() => paginatedGamesQuery.hasNextPage.value),
    isFetchingNextPage: computed(() => paginatedGamesQuery.isFetchingNextPage.value),
  };
}

/**
 * Composable that extends useGamesAPI with WebSocket integration for a specific game
 * Use this when you need real-time updates for a particular game (e.g., join flow)
 *
 * @param watchedGameId - Reactive ref to the game ID to watch (null to disconnect)
 * @param status - Game status filter for the list
 */
export function useGamesAPIWithWebSocket(
  watchedGameId: Ref<number | null>,
  status: number = GAME_STATUS_WAITING_FOR_OPPONENT
) {
  const queryClient = useQueryClient();
  const gamesApi = useGamesAPI(status);
  const wsService = getWebSocketService();

  // Track unsubscribe function
  let unsubscribeMessage: (() => void) | null = null;

  /**
   * Handle incoming WebSocket message
   */
  const handleWebSocketMessage = (message: WSMessage): void => {
    if (isGameStateUpdate(message)) {
      // Game state changed - invalidate queries to refresh data
      console.log('[useGamesAPIWithWebSocket] Game state update:', message.game_id, 'status:', message.status);

      // Invalidate all games queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
    } else if (isReservationCreated(message)) {
      // Handle reservation creation
      console.log('[useGamesAPIWithWebSocket] Reservation created for game:', message.game_id);

      const reservation: Reservation = {
        game_id: message.game_id,
        wallet_address: message.reserved_by,
        created_at: message.timestamp,
        expires_at: message.expires_at,
        status: 'active',
      };
      gamesApi.updateReservation(message.game_id, reservation);
    } else if (isReservationReleased(message)) {
      // Handle reservation release
      console.log('[useGamesAPIWithWebSocket] Reservation released for game:', message.game_id, 'reason:', message.reason);

      gamesApi.updateReservation(message.game_id, null);

      // If reason is 'joined', invalidate queries as the game state changed
      if (message.reason === 'joined') {
        queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
      }
    }
  };

  /**
   * Get Telegram initData for WebSocket auth
   */
  const getInitData = (): string => {
    try {
      const tg = (window as Window & { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
      return tg?.WebApp?.initData ?? '';
    } catch {
      return '';
    }
  };

  // Watch for game ID changes to connect/disconnect WebSocket
  watch(
    watchedGameId,
    (newGameId, oldGameId) => {
      if (newGameId === oldGameId) return;

      // Clean up previous subscription
      if (unsubscribeMessage) {
        unsubscribeMessage();
        unsubscribeMessage = null;
      }

      if (newGameId) {
        // Connect to the game's WebSocket
        wsService.connect(newGameId, getInitData());

        // Subscribe to messages
        unsubscribeMessage = wsService.onMessage(handleWebSocketMessage);

        console.log('[useGamesAPIWithWebSocket] Connected to game:', newGameId);
      } else {
        // Disconnect
        wsService.disconnect();
        console.log('[useGamesAPIWithWebSocket] Disconnected');
      }
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribeMessage) {
      unsubscribeMessage();
      unsubscribeMessage = null;
    }
    // Don't disconnect WebSocket here - other components may be using it
  });

  /**
   * Force refresh of games list
   */
  const forceRefresh = (): void => {
    queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
  };

  return {
    ...gamesApi,

    // Additional methods for WebSocket integration
    forceRefresh,
  };
}
