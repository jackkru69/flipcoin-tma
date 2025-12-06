/**
 * User profile types for backend API integration
 * @module types/user
 */

/**
 * User profile from backend API
 * Matches pod-backend/internal/entity/user.go
 */
export interface User {
  id: number;
  telegram_user_id?: number | null; // Nullable for blockchain-only users
  telegram_username: string;
  wallet_address: string;
  total_games_played: number;
  total_wins: number;
  total_losses: number;
  total_referrals: number;
  total_referral_earnings: number; // nanotons
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * Computed profile statistics for display
 */
export interface UserStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number; // totalGames - wins - losses
  winRate: number; // percentage 0-100
  totalEarnings: bigint; // nanotons
}

/**
 * Referral statistics from backend API
 * Matches pod-backend/internal/entity/user.go ReferralStats
 */
export interface ReferralStats {
  wallet_address: string;
  total_referrals: number; // Total unique referrals made
  total_referral_earnings: number; // Total earnings in nanotons
  games_referred: number; // Total games where this wallet was referrer
}

/**
 * Response from GET /api/v1/users/{address}/history
 */
export interface GameHistoryResponse {
  games: import('./api').APIGame[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Game outcome type for display
 */
export type GameOutcome = 'win' | 'loss' | 'draw' | 'pending' | 'cancelled';

/**
 * Game history entry with computed display properties
 */
export interface GameHistoryEntry {
  game: import('./api').APIGame;
  outcome: GameOutcome;
  opponentAddress: string | null;
  formattedBetAmount: string; // e.g., "1.5 TON"
  formattedDate: string; // Localized date string
  duration: number | null; // Game duration in seconds (if completed)
}

/**
 * Compute user stats from User entity
 */
export function computeUserStats(user: User): UserStats {
  const totalGames = user.total_games_played;
  const wins = user.total_wins;
  const losses = user.total_losses;
  const draws = totalGames - wins - losses;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  return {
    totalGames,
    wins,
    losses,
    draws,
    winRate,
    totalEarnings: BigInt(user.total_referral_earnings),
  };
}

/**
 * Format nanotons to TON string
 * @param nanotons - Amount in nanotons
 * @returns Formatted string like "1.5 TON"
 */
export function formatTON(nanotons: number | bigint): string {
  const ton = Number(nanotons) / 1_000_000_000;
  return `${ton.toFixed(2)} TON`;
}

/**
 * Determine game outcome for a user
 * @param game - The game API response
 * @param userAddress - The user's wallet address
 * @returns The game outcome from the user's perspective
 */
export function getGameOutcome(
  game: import('./api').APIGame,
  userAddress: string
): GameOutcome {
  // Game cancelled
  if (game.cancelled) {
    return 'cancelled';
  }

  // Game in progress (status < 3 means not ended)
  if (game.status < 3) {
    return 'pending';
  }

  // Game ended - check winner
  if (!game.winner_address) {
    return 'draw';
  }

  // Normalize addresses for comparison
  const winnerNormalized = game.winner_address.toLowerCase();
  const userNormalized = userAddress.toLowerCase();

  return winnerNormalized === userNormalized ? 'win' : 'loss';
}
