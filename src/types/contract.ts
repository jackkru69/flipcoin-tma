import { Address } from '@ton/core';

// Contract constants
export const COIN_SIDE_NONE = 0;
export const COIN_SIDE_CLOSED = 1;
export const COIN_SIDE_HEADS = 2;
export const COIN_SIDE_TAILS = 3;

export const GAME_STATUS_UNINITIALIZED = 0;
export const GAME_STATUS_WAITING_FOR_OPPONENT = 1;
export const GAME_STATUS_WAITING_FOR_OPEN_BIDS = 2;
export const GAME_STATUS_ENDED = 3;
export const GAME_STATUS_PAID = 4;

export const GAME_STATUS_LABELS: Record<number, string> = {
  [GAME_STATUS_UNINITIALIZED]: 'Не инициализирована',
  [GAME_STATUS_WAITING_FOR_OPPONENT]: 'Ожидание оппонента',
  [GAME_STATUS_WAITING_FOR_OPEN_BIDS]: 'Ожидание раскрытия ставок',
  [GAME_STATUS_ENDED]: 'Завершена',
  [GAME_STATUS_PAID]: 'Оплачена',
};

export const COIN_SIDE_LABELS: Record<number, string> = {
  [COIN_SIDE_NONE]: 'Нет',
  [COIN_SIDE_CLOSED]: 'Скрыта',
  [COIN_SIDE_HEADS]: 'Орёл',
  [COIN_SIDE_TAILS]: 'Решка',
};

// Game info from contract
export interface GameInfo {
  gameId: bigint;
  status: bigint;
  playerOne: Address;
  playerTwo: Address;
  bidValue: bigint;
  totalGainings: bigint;
  playerOneChosenSide: bigint;
  playerTwoChosenSide: bigint;
  gameCreatedTimestamp: bigint;
  gameStartedTimestamp: bigint;
  winner: Address;
  configReceived: boolean;
}

// Factory config
export interface FactoryConfig {
  serviceFeeNumerator: bigint;
  referrerFeeNumerator: bigint;
  waitingForOpenBidSeconds: bigint;
  feeReceiver: Address;
  stopped: boolean;
  lowestBid?: bigint;
  highestBid?: bigint;
}

// Factory statistics
export interface FactoryStats {
  totalGamesCreated: bigint;
  totalGamesInitialized: bigint;
  totalGamesFinished: bigint;
  totalGamesCancelled: bigint;
  totalGamesDrawn: bigint;
}
