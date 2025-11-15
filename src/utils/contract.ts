import { Address, beginCell, toNano } from '@ton/core';
import type { Sender, SenderArguments } from '@ton/core';
import type { TonConnectUI } from '@tonconnect/ui';
import { mnemonicNew } from '@ton/crypto';

/**
 * Generate new seed phrase (24 words) using TON crypto library
 */
export async function generateSeedPhrase(): Promise<string[]> {
  return await mnemonicNew(24);
}/**
 * Generate signature from seed phrase and game ID
 * @param gameId Game ID as bigint
 * @param seedPhrase Array of 24 words
 * @returns 256-bit signature as bigint
 */
export function getSignatureFromSeed(gameId: bigint, seedPhrase: string[]): bigint {
  // Join seed phrase into single string
  const seedString = seedPhrase.join(' ');

  // First, hash the seed phrase to get a 256-bit value
  const seedCell = beginCell()
    .storeStringTail(seedString)
    .endCell();
  const seedHash = seedCell.hash();

  // Then combine gameId with hashed seed phrase
  const message = beginCell()
    .storeUint(gameId, 256)
    .storeBuffer(seedHash)
    .endCell();

  // Use sha256 hash as signature
  const hash = message.hash();

  // Convert to bigint (256-bit number)
  return BigInt('0x' + hash.toString('hex'));
}

/**
 * Generate secret key for the game (this is what gets sent to contract as "secret")
 * This must match the contract's calculateHash function exactly
 * @param coinSide 2 for HEADS, 3 for TAILS
 * @param signature Signature from getSignatureFromSeed (this is the "key" for opening)
 * @param playerAddress Player's address
 * @returns Secret key (hash of coinSide + signature + playerAddress)
 */
export function generateSecretKey(coinSide: bigint, signature: bigint, playerAddress: Address): bigint {
  const builder = beginCell()
    .storeUint(coinSide, 8)
    .storeUint(signature, 256)
    .storeAddress(playerAddress)
    .endCell();

  return BigInt('0x' + builder.hash().toString('hex'));
}

/**
 * Calculate hash for encrypted bet (matches contract's calculateHash function)
 * This is used to verify the player's choice when opening the bid
 * @param coinSide 2 for HEADS, 3 for TAILS
 * @param key Secret signature (256-bit integer from getSignatureFromSeed)
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
 * Create a Sender implementation using TonConnect UI
 */
export function createTonConnectSender(tonConnectUI: TonConnectUI): Sender {
  return {
    get address() {
      const address = tonConnectUI.account?.address;
      return address ? Address.parse(address) : undefined;
    },
    async send(args: SenderArguments): Promise<void> {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360, // 6 minutes
        messages: [
          {
            address: args.to.toString(),
            amount: args.value.toString(),
            payload: args.body ? args.body.toBoc().toString('base64') : undefined,
          },
        ],
      });
    },
  };
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

