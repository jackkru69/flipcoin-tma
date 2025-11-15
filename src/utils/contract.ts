import { Address, beginCell, toNano } from '@ton/core';

/**
 * Calculate hash for encrypted bet (matches contract's calculateHash function)
 * @param coinSide 2 for HEADS, 3 for TAILS
 * @param key Random secret key (256-bit integer)
 * @param playerAddress Player's address
 */
export function calculateHash(coinSide: bigint, key: bigint, playerAddress: Address): bigint {
  const builder = beginCell();
  builder.storeUint(coinSide, 8);
  builder.storeUint(key, 256);
  builder.storeAddress(playerAddress);
  return BigInt('0x' + builder.endCell().hash().toString('hex'));
}

/**
 * Generate random 256-bit key for bet encryption
 */
export function generateRandomKey(): bigint {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let hex = '0x';
  bytes.forEach(byte => {
    hex += byte.toString(16).padStart(2, '0');
  });
  return BigInt(hex);
}

/**
 * Format TON amount from nanotons
 */
export function formatTon(nanotons: bigint): string {
  const tons = Number(nanotons) / 1e9;
  return tons.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  });
}

/**
 * Calculate required value for creating a game
 * bidValue + deployValue + factoryReserve + gasBuffer
 */
export function calculateCreateGameValue(bidValue: string): bigint {
  const bid = toNano(bidValue);
  const deployValue = toNano('0.15');
  const factoryReserve = toNano('0.05');
  const gasBuffer = toNano('0.05');
  return bid + deployValue + factoryReserve + gasBuffer;
}

/**
 * Calculate required value for joining a game
 * bidValue + gasBuffer
 */
export function calculateJoinGameValue(bidValue: bigint): bigint {
  const gasBuffer = toNano('0.05');
  return bidValue + gasBuffer;
}

/**
 * Shorten address for display
 */
export function shortenAddress(address: Address | string): string {
  const addrStr = typeof address === 'string' ? address : address.toString();
  if (addrStr.length < 10) return addrStr;
  return `${addrStr.slice(0, 6)}...${addrStr.slice(-4)}`;
}
