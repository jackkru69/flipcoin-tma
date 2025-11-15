import { computed } from 'vue';
import { useQuery, useInfiniteQuery } from '@tanstack/vue-query';
import { Address, TonClient } from '@ton/ton';
import type { GameInfo, FactoryConfig, FactoryStats } from '../types/contract';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { FlipCoinGameFactory } from '../wrappers/FlipCoinGameFactory_FlipCoinGameFactory';
import { Game } from '../wrappers/FlipCoinGameFactory_Game';

const BATCH_SIZE = 10;

// Create TonClient instance
async function createTonClient() {
  return new TonClient({
    endpoint: await getHttpEndpoint({ network: 'testnet' }),
    apiKey: import.meta.env.VITE_TONCENTER_API_KEY || undefined,
  });
}

// Fetch factory statistics
async function fetchFactoryStats(factoryAddress: string): Promise<FactoryStats> {
  const client = await createTonClient();
  const address = Address.parse(factoryAddress);
  const factory = client.open(FlipCoinGameFactory.fromAddress(address));

  const stats = await factory.getStatistics();

  return {
    totalGamesCreated: stats.totalGamesCreated,
    totalGamesInitialized: stats.totalGamesInitialized,
    totalGamesFinished: stats.totalGamesFinished,
    totalGamesCancelled: stats.totalGamesCancelled,
    totalGamesDrawn: stats.totalGamesDrawn,
  };
}

// Fetch factory configuration
async function fetchFactoryConfig(factoryAddress: string): Promise<FactoryConfig> {
  const client = await createTonClient();
  const address = Address.parse(factoryAddress);
  const factory = client.open(FlipCoinGameFactory.fromAddress(address));

  const config = await factory.getConfig();

  // Return config with default bid limits
  return {
    serviceFeeNumerator: config.serviceFeeNumerator,
    referrerFeeNumerator: config.referrerFeeNumerator,
    waitingForOpenBidSeconds: config.waitingForOpenBidSeconds,
    feeReceiver: config.feeReceiver,
    stopped: config.stopped,
    lowestBid: BigInt(100_000_000), // 0.1 TON default
    highestBid: BigInt(100_000_000_000), // 100 TON default
  };
}

// Fetch single game info
async function fetchGameInfo(factoryAddress: string, gameId: number): Promise<GameInfo | null> {
  const client = await createTonClient();
  const address = Address.parse(factoryAddress);
  const factory = client.open(FlipCoinGameFactory.fromAddress(address));

  try {
    // Calculate game address
    const gameAddress = await factory.getCalculateGameAddress(BigInt(gameId));

    // Open game contract
    const game = client.open(Game.fromAddress(gameAddress));

    // Get game info
    const gameInfo = await game.getGameInfo();

    return {
      gameId: gameInfo.gameId,
      status: gameInfo.status,
      playerOne: gameInfo.playerOne,
      playerTwo: gameInfo.playerTwo,
      bidValue: gameInfo.bidValue,
      totalGainings: gameInfo.totalGainings,
      playerOneChosenSide: gameInfo.playerOneChosenSide,
      playerTwoChosenSide: gameInfo.playerTwoChosenSide,
      gameCreatedTimestamp: gameInfo.gameCreatedTimestamp,
      gameStartedTimestamp: gameInfo.gameStartedTimestamp,
      winner: gameInfo.winner,
      configReceived: gameInfo.configReceived,
    };
  } catch (e) {
    console.error(`Failed to load game ${gameId}:`, e);
    return null;
  }
}

// Fetch batch of games
async function fetchGamesBatch(
  factoryAddress: string,
  startId: number,
  count: number
): Promise<GameInfo[]> {
  const gameInfos: GameInfo[] = [];

  // Fetch games in parallel
  const promises = [];
  for (let i = 0; i < count; i++) {
    const gameId = startId + i;
    promises.push(fetchGameInfo(factoryAddress, gameId));
  }

  const results = await Promise.all(promises);

  // Filter out null results
  for (const result of results) {
    if (result) {
      gameInfos.push(result);
    }
  }

  return gameInfos;
}

interface GamesPageParam {
  startId: number;
  totalGames: number;
}

export function useFlipCoinContract(factoryAddress: string) {
  // Query for factory statistics
  const statsQuery = useQuery({
    queryKey: ['flipcoin', 'stats', factoryAddress],
    queryFn: () => fetchFactoryStats(factoryAddress),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });

  // Query for factory configuration
  const configQuery = useQuery({
    queryKey: ['flipcoin', 'config', factoryAddress],
    queryFn: () => fetchFactoryConfig(factoryAddress),
    staleTime: 300000, // 5 minutes (config rarely changes)
  });

  // Infinite query for games
  const gamesQuery = useInfiniteQuery({
    queryKey: ['flipcoin', 'games', factoryAddress],
    queryFn: async ({ pageParam }) => {
      const param = pageParam as GamesPageParam;

      if (!param.totalGames || param.startId < 1) {
        return [];
      }

      const count = Math.min(BATCH_SIZE, param.startId);
      const games = await fetchGamesBatch(factoryAddress, param.startId, count);

      return games;
    },
    initialPageParam: { startId: 0, totalGames: 0 } as GamesPageParam,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const param = lastPageParam as GamesPageParam;

      if (!param.totalGames || param.startId <= 1) {
        return undefined;
      }

      const remainingStart = param.startId - lastPage.length;

      if (remainingStart < 1) {
        return undefined;
      }

      return {
        startId: remainingStart,
        totalGames: param.totalGames,
      } as GamesPageParam;
    },
    enabled: computed(() => {
      // Enable only when stats are loaded and there are games
      return !!statsQuery.data.value && Number(statsQuery.data.value.totalGamesCreated) > 0;
    }),
    staleTime: 10000, // 10 seconds
  });

  // Computed properties
  const stats = computed(() => statsQuery.data.value ?? null);
  const config = computed(() => configQuery.data.value ?? null);

  const games = computed(() => {
    if (!gamesQuery.data.value?.pages) return [];

    // Flatten all pages and reverse to show newest first
    const allGames = gamesQuery.data.value.pages.flat();
    return allGames.reverse();
  });

  const loading = computed(() =>
    statsQuery.isPending.value ||
    configQuery.isPending.value ||
    (gamesQuery.isPending.value && !gamesQuery.isFetchingNextPage.value)
  );

  const loadingMore = computed(() => gamesQuery.isFetchingNextPage.value);

  const error = computed(() => {
    if (statsQuery.error.value) return (statsQuery.error.value as Error).message;
    if (configQuery.error.value) return (configQuery.error.value as Error).message;
    if (gamesQuery.error.value) return (gamesQuery.error.value as Error).message;
    return null;
  });

  const hasMore = computed(() => gamesQuery.hasNextPage.value ?? false);

  // Functions
  const loadGames = async () => {
    await Promise.all([
      statsQuery.refetch(),
      configQuery.refetch(),
    ]);

    if (statsQuery.data.value) {
      const totalGames = Number(statsQuery.data.value.totalGamesCreated);

      if (totalGames > 0) {
        // Refetch games to trigger reload with updated stats
        await gamesQuery.refetch();
      }
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loadingMore.value) {
      await gamesQuery.fetchNextPage();
    }
  };

  const refreshGames = async () => {
    await loadGames();
  };

  return {
    games,
    loading,
    loadingMore,
    error,
    stats,
    config,
    hasMore,
    loadGames,
    loadMore,
    refreshGames,

    // Expose query objects for advanced usage
    statsQuery,
    configQuery,
    gamesQuery,
  };
}
