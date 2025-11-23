import { getHttpEndpoint, } from '@orbs-network/ton-access';
import { TonClient } from '@ton/ton';

// Create TonClient instance
export async function createTonClient() {
  return new TonClient({
    endpoint: import.meta.env.MODE === "development" ? "/jsonRPC" : await getHttpEndpoint({ network: 'testnet', }),
    apiKey: import.meta.env.MODE === "development" ? import.meta.env.VITE_TONCENTER_API_KEY : undefined,
  });
}
