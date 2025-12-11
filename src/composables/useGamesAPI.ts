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
import type { GameListResponse, APIGame, GameWithReservation } from '../types/api';
import type { GameInfo } from '../types/contract';
import type { Reservation } from '../types/reservation';
import { GAME_STATUS_WAITING_FOR_OPPONENT, GAME_STATUS_ENDED } from '../types/contract';
import { getWebSocketService } from '../services/websocket';
import type { WSMessage, GameStateUpdateMessage } from '../types/websocket';
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
 * @param status - Reactive ref to game status filter, or a number (will be converted to ref)
 */
export function useGamesAPI(status: Ref<number | null> | number | null = GAME_STATUS_WAITING_FOR_OPPONENT) {
  // Convert status to ref if it's not already
  const statusRef = typeof status === 'number' || status === null
    ? ref(status)
    : status;

  // Local state for reservations (updated via WebSocket)
  const reservationUpdates = ref<Map<number, Reservation | null>>(new Map());

  // Simple query for games list
  const gamesQuery = useQuery({
    queryKey: ['api', 'games', statusRef],
    queryFn: () => fetchGames(statusRef.value ?? GAME_STATUS_WAITING_FOR_OPPONENT, 100, 0), // Fetch up to 100 games
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Infinite query for paginated games
  const paginatedGamesQuery = useInfiniteQuery({
    queryKey: ['api', 'games', 'paginated', statusRef],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchGames(statusRef.value ?? GAME_STATUS_WAITING_FOR_OPPONENT, DEFAULT_PAGE_SIZE, pageParam);
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
    const gamesList = gamesQuery.data.value.games.map((gwr) => apiGameToGameInfo(gwr.game));
    console.log('[useGamesAPI] Returning games from API:', gamesList.length, 'games');
    if (gamesList.length > 0) {
      console.log('[useGamesAPI] First game playerOneChosenSide:', Number(gamesList[0].playerOneChosenSide));
    }
    return gamesList;
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

  // Optimistic update for game join - immediately update UI when transaction is sent
  function optimisticJoinGame(gameId: number, playerTwoAddress: string): void {
    const queryClient = useQueryClient();

    queryClient.setQueriesData<GameListResponse>(
      { queryKey: ['api', 'games'] },
      (oldData) => {
        if (!oldData) return oldData;

        const gameIndex = oldData.games.findIndex(gwr => gwr.game.game_id === gameId);
        if (gameIndex === -1) return oldData;

        const updatedGames = [...oldData.games];
        const currentGame = updatedGames[gameIndex];

        updatedGames[gameIndex] = {
          ...currentGame,
          game: {
            ...currentGame.game,
            player_two_address: playerTwoAddress,
            status: 2, // WAITING_FOR_OPEN_BIDS
            joined_at: new Date().toISOString(),
          },
          reservation: null, // Clear reservation on join
        };

        return {
          ...oldData,
          games: updatedGames,
        };
      }
    );

    console.log('[useGamesAPI] Optimistic join applied for game:', gameId);
  }

  // Optimistic update for game cancel - remove from waiting games
  function optimisticCancelGame(gameId: number): void {
    const queryClient = useQueryClient();

    queryClient.setQueriesData<GameListResponse>(
      { queryKey: ['api', 'games'] },
      (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          games: oldData.games.filter(gwr => gwr.game.game_id !== gameId),
          total: Math.max(0, oldData.total - 1),
        };
      }
    );

    console.log('[useGamesAPI] Optimistic cancel applied for game:', gameId);
  }

  // Rollback optimistic update on error
  function rollbackOptimisticUpdate(): void {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
    console.log('[useGamesAPI] Rolled back optimistic update');
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

    // Optimistic updates
    optimisticJoinGame,
    optimisticCancelGame,
    rollbackOptimisticUpdate,

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
 * @param status - Game status filter for the list (can be reactive ref or number)
 */
export function useGamesAPIWithWebSocket(
  watchedGameId: Ref<number | null>,
  status: Ref<number | null> | number | null = GAME_STATUS_WAITING_FOR_OPPONENT
) {
  const queryClient = useQueryClient();
  const gamesApi = useGamesAPI(status);
  const wsService = getWebSocketService();

  // Track unsubscribe function
  let unsubscribeMessage: (() => void) | null = null;

  /**
   * Convert WebSocket game data to APIGame format
   */
  const wsDataToAPIGame = (wsData: GameStateUpdateMessage['data']): APIGame => {
    return {
      game_id: wsData.game_id,
      status: wsData.status,
      player_one_address: wsData.player_one_address,
      player_two_address: wsData.player_two_address,
      player_one_choice: wsData.player_one_choice,
      player_two_choice: wsData.player_two_choice,
      bet_amount: wsData.bet_amount,
      winner_address: wsData.winner_address,
      payout_amount: wsData.payout_amount,
      created_at: wsData.created_at,
      joined_at: wsData.joined_at,
      revealed_at: wsData.revealed_at,
      completed_at: wsData.completed_at,
      // Default values for fields not in WebSocket message
      service_fee_numerator: 0,
      referrer_fee_numerator: 0,
      waiting_timeout_seconds: 0,
      lowest_bid_allowed: 0,
      highest_bid_allowed: 0,
      fee_receiver_address: '',
      init_tx_hash: '',
      cancelled: wsData.status === GAME_STATUS_ENDED && !wsData.winner_address,
    };
  };

  /**
   * Update a specific game in the cache
   */
  const updateGameInCache = (gameId: number, updater: (game: GameWithReservation) => GameWithReservation): void => {
    // Update in all games list queries
    queryClient.setQueriesData<GameListResponse>(
      { queryKey: ['api', 'games'] },
      (oldData) => {
        if (!oldData) return oldData;

        const gameIndex = oldData.games.findIndex(gwr => gwr.game.game_id === gameId);
        if (gameIndex === -1) return oldData;

        const updatedGames = [...oldData.games];
        updatedGames[gameIndex] = updater(updatedGames[gameIndex]);

        return {
          ...oldData,
          games: updatedGames,
        };
      }
    );
  };

  /**
   * Handle incoming WebSocket message with granular cache updates
   */
  const handleWebSocketMessage = (message: WSMessage): void => {
    if (isGameStateUpdate(message)) {
      const gameId = message.data.game_id;
      const eventType = message.event_type;

      console.log('[useGamesAPIWithWebSocket] Game state update:', gameId, 'status:', message.data.status, 'event:', eventType);

      // Convert WebSocket data to API game format
      const updatedGame = wsDataToAPIGame(message.data);

      // Handle different event types
      switch (eventType) {
        case 'game_initialized':
          // New game created - need to refetch to get the new game
          // Since this game doesn't exist in cache, invalidate to fetch it
          queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
          break;

        case 'game_started':
        case 'secret_opened':
        case 'game_finished':
        case 'draw':
        case 'game_cancelled':
          // Game state changed - update the specific game in cache
          updateGameInCache(gameId, (gwr) => ({
            ...gwr,
            game: {
              ...gwr.game,
              ...updatedGame,
            },
          }));

          // For finished/cancelled games, also remove from waiting list if filtered
          if (eventType === 'game_finished' || eventType === 'draw' || eventType === 'game_cancelled') {
            // Remove game from cache if current filter is for waiting games
            queryClient.setQueriesData<GameListResponse>(
              { queryKey: ['api', 'games', { value: GAME_STATUS_WAITING_FOR_OPPONENT }] },
              (oldData) => {
                if (!oldData) return oldData;
                return {
                  ...oldData,
                  games: oldData.games.filter(gwr => gwr.game.game_id !== gameId),
                  total: oldData.total - 1,
                };
              }
            );
          }
          break;

        case 'insufficient_balance':
          // Just log, no state change needed
          console.warn('[useGamesAPIWithWebSocket] Insufficient balance for game:', gameId);
          break;

        default:
          // Unknown event type or no event type - fallback to invalidation
          console.log('[useGamesAPIWithWebSocket] Unknown event type, falling back to invalidation');
          queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
      }
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

      // Note: If reason is 'joined', game_state_update with event_type='game_started'
      // will follow and handle the game state update
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
