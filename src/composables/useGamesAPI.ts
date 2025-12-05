/**
 * Composable for fetching games from API with reservation status
 * @module composables/useGamesAPI
 */

import { computed, ref } from 'vue';
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query';
import { Address } from '@ton/core';
import type { GameListResponse, APIGame } from '../types/api';
import type { GameInfo } from '../types/contract';
import type { Reservation } from '../types/reservation';
import { GAME_STATUS_WAITING_FOR_OPPONENT } from '../types/contract';

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
