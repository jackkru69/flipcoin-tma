/**
 * Composable for fetching user game history with infinite scroll
 * @module composables/useGameHistory
 */

import { computed, type Ref, type ComputedRef } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
import type { APIGame } from '../types/api';
import type { GameHistoryEntry, GameHistoryResponse, GameOutcome } from '../types/user';
import { getGameOutcome, formatTON } from '../types/user';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';
const DEFAULT_PAGE_SIZE = 20;

/**
 * Fetch game history page from backend
 */
async function fetchGameHistory(
  walletAddress: string,
  limit: number,
  offset: number
): Promise<GameHistoryResponse> {
  const url = new URL(`${API_BASE_URL}/api/v1/users/${encodeURIComponent(walletAddress)}/history`);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('offset', String(offset));

  const response = await fetch(url.toString());

  if (!response.ok) {
    if (response.status === 404) {
      // Return empty history for new users
      return {
        games: [],
        total: 0,
        limit,
        offset,
      };
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch game history');
  }

  return response.json();
}

/**
 * Convert API game to GameHistoryEntry with computed display properties
 */
function toGameHistoryEntry(game: APIGame, userAddress: string): GameHistoryEntry {
  const outcome = getGameOutcome(game, userAddress);

  // Determine opponent address
  const isPlayerOne = game.player_one_address.toLowerCase() === userAddress.toLowerCase();
  const opponentAddress = isPlayerOne
    ? (game.player_two_address ?? null)
    : game.player_one_address;

  // Format bet amount
  const formattedBetAmount = formatTON(game.bet_amount);

  // Format date
  const date = new Date(game.created_at);
  const formattedDate = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate duration if game is completed
  let duration: number | null = null;
  if (game.completed_at && game.joined_at) {
    const startTime = new Date(game.joined_at).getTime();
    const endTime = new Date(game.completed_at).getTime();
    duration = Math.floor((endTime - startTime) / 1000);
  }

  return {
    game,
    outcome,
    opponentAddress,
    formattedBetAmount,
    formattedDate,
    duration,
  };
}

/**
 * Composable for fetching game history with infinite scroll
 * @param walletAddress - Reactive ref to the wallet address (null when not connected)
 * @param pageSize - Number of games per page (default: 20)
 */
export function useGameHistory(
  walletAddress: Ref<string | null>,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  // Infinite query for paginated game history
  const historyQuery = useInfiniteQuery({
    queryKey: ['user', 'history', walletAddress],
    queryFn: async ({ pageParam = 0 }) => {
      if (!walletAddress.value) {
        throw new Error('Wallet not connected');
      }
      return fetchGameHistory(walletAddress.value, pageSize, pageParam);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce((sum, page) => sum + page.games.length, 0);
      if (totalFetched >= lastPage.total) {
        return undefined;
      }
      return totalFetched;
    },
    enabled: computed(() => !!walletAddress.value),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  // Computed: All game history entries with display properties
  const games: ComputedRef<GameHistoryEntry[]> = computed(() => {
    if (!historyQuery.data.value || !walletAddress.value) return [];

    const entries: GameHistoryEntry[] = [];
    for (const page of historyQuery.data.value.pages) {
      for (const game of page.games) {
        entries.push(toGameHistoryEntry(game, walletAddress.value));
      }
    }
    return entries;
  });

  // Total games count
  const totalGames = computed(() => {
    if (!historyQuery.data.value || historyQuery.data.value.pages.length === 0) return 0;
    return historyQuery.data.value.pages[0].total;
  });

  // Stats computed from history
  const historyStats = computed(() => {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let pending = 0;

    for (const entry of games.value) {
      switch (entry.outcome) {
        case 'win':
          wins++;
          break;
        case 'loss':
          losses++;
          break;
        case 'draw':
          draws++;
          break;
        case 'pending':
          pending++;
          break;
      }
    }

    return { wins, losses, draws, pending, total: games.value.length };
  });

  // Check if has any history
  const hasHistory = computed(() => games.value.length > 0);

  return {
    // Query
    historyQuery,

    // Data
    games,
    totalGames,
    historyStats,
    hasHistory,

    // Pagination
    hasNextPage: computed(() => historyQuery.hasNextPage.value),
    isFetchingNextPage: computed(() => historyQuery.isFetchingNextPage.value),
    fetchNextPage: () => historyQuery.fetchNextPage(),

    // States
    isLoading: computed(() => historyQuery.isLoading.value),
    isError: computed(() => historyQuery.isError.value),
    error: computed(() => historyQuery.error.value),

    // Refetch
    refetch: () => historyQuery.refetch(),
  };
}

/**
 * Get CSS class for game outcome
 */
export function getOutcomeClass(outcome: GameOutcome): string {
  switch (outcome) {
    case 'win':
      return 'outcome-win';
    case 'loss':
      return 'outcome-loss';
    case 'draw':
      return 'outcome-draw';
    case 'pending':
      return 'outcome-pending';
    case 'cancelled':
      return 'outcome-cancelled';
    default:
      return '';
  }
}

/**
 * Get display text for game outcome
 */
export function getOutcomeText(outcome: GameOutcome): string {
  switch (outcome) {
    case 'win':
      return 'Победа';
    case 'loss':
      return 'Поражение';
    case 'draw':
      return 'Ничья';
    case 'pending':
      return 'В процессе';
    case 'cancelled':
      return 'Отменена';
    default:
      return 'Неизвестно';
  }
}

/**
 * Get emoji for game outcome
 */
export function getOutcomeEmoji(outcome: GameOutcome): string {
  switch (outcome) {
    case 'win':
      return '🏆';
    case 'loss':
      return '❌';
    case 'draw':
      return '🤝';
    case 'pending':
      return '⏳';
    case 'cancelled':
      return '🚫';
    default:
      return '❓';
  }
}
