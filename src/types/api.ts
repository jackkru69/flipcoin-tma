/**
 * API types for backend responses
 * @module types/api
 */

import type { Reservation } from './reservation';

/**
 * Game entity from the backend API
 * Matches pod-backend/internal/entity/game.go
 */
export interface APIGame {
  game_id: number;
  status: number;
  player_one_address: string;
  player_two_address?: string | null;
  player_one_choice: number;
  player_two_choice?: number | null;
  player_one_referrer?: string | null;
  player_two_referrer?: string | null;
  bet_amount: number;
  winner_address?: string | null;
  payout_amount?: number | null;
  service_fee_numerator: number;
  referrer_fee_numerator: number;
  waiting_timeout_seconds: number;
  lowest_bid_allowed: number;
  highest_bid_allowed: number;
  fee_receiver_address: string;
  created_at: string;
  joined_at?: string | null;
  revealed_at?: string | null;
  completed_at?: string | null;
  init_tx_hash: string;
  join_tx_hash?: string | null;
  reveal_tx_hash?: string | null;
  result_tx_hash?: string | null;
  cancelled: boolean;
}

/**
 * Game with reservation status from API
 */
export interface GameWithReservation {
  game: APIGame;
  reservation?: Reservation | null;
}

/**
 * Response from GET /api/v1/games
 */
export interface GameListResponse {
  games: GameWithReservation[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * API error response
 */
export interface APIError {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Connection status for health check
 */
export type ConnectionStatus = 'connected' | 'disconnected' | 'not_configured';

/**
 * TON Center API status
 */
export type TonCenterStatus = 'connected' | 'recovering' | 'circuit_breaker_open' | 'not_configured';

/**
 * Backend health status from GET /api/v1/health
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: ConnectionStatus;
  event_source_status: ConnectionStatus;
  event_source_type: 'websocket' | 'http' | 'not_configured';
  ton_center_api: TonCenterStatus;
  timestamp: string; // ISO 8601
}
