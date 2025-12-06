/**
 * WebSocket message types for real-time game updates
 * @module types/websocket
 */

import type { APIGame } from './api';
import type { Reservation } from './reservation';

/**
 * WebSocket connection status enum
 */
export type WebSocketConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'failed'; // After max retries

/**
 * WebSocket connection state for tracking
 */
export interface WebSocketState {
  status: WebSocketConnectionStatus;
  gameId: number | null;
  clientId: string | null;
  lastConnectedAt: Date | null;
  reconnectAttempts: number;
  error: string | null;
}

/**
 * Base WebSocket message structure
 */
export interface WebSocketMessage {
  type: WebSocketMessageType;
  timestamp: string; // ISO 8601
}

/**
 * All WebSocket message types
 * Note: game_joined and game_completed are represented as game_state_update
 * with different status values:
 * - game_joined: status transitions from 1 (WAITING_FOR_OPPONENT) to 2 (WAITING_FOR_OPEN_BIDS)
 * - game_completed: status transitions to 3 (ENDED) or 4 (PAID)
 * - game_created: new game appears with status 1 (WAITING_FOR_OPPONENT)
 */
export type WebSocketMessageType =
  | 'game_state_update'
  | 'reservation_created'
  | 'reservation_released'
  | 'sync_response'
  | 'error';

/**
 * Game state update message
 */
export interface GameStateUpdateMessage extends WebSocketMessage {
  type: 'game_state_update';
  game_id: number;
  status: number;
  player_two_address?: string;
  winner_address?: string;
}

/**
 * Reservation created message
 */
export interface ReservationCreatedMessage extends WebSocketMessage {
  type: 'reservation_created';
  game_id: number;
  reserved_by: string;
  expires_at: string; // ISO 8601
}

/**
 * Reservation released message
 */
export interface ReservationReleasedMessage extends WebSocketMessage {
  type: 'reservation_released';
  game_id: number;
  reason: 'expired' | 'cancelled' | 'joined';
}

/**
 * Sync response after reconnection
 */
export interface SyncResponseMessage extends WebSocketMessage {
  type: 'sync_response';
  game: APIGame;
  reservation?: Reservation | null;
}

/**
 * Error message from server
 */
export interface ErrorMessage extends WebSocketMessage {
  type: 'error';
  code: string;
  message: string;
}

/**
 * Union type for all WebSocket messages
 */
export type WSMessage =
  | GameStateUpdateMessage
  | ReservationCreatedMessage
  | ReservationReleasedMessage
  | SyncResponseMessage
  | ErrorMessage;

/**
 * Client to server message types
 */
export interface ClientSyncRequest {
  type: 'sync_request';
  last_event_timestamp?: string; // ISO 8601
}

export type ClientMessage = ClientSyncRequest;

/**
 * Type guard for game state update message
 */
export function isGameStateUpdate(msg: WSMessage): msg is GameStateUpdateMessage {
  return msg.type === 'game_state_update';
}

/**
 * Type guard for reservation created message
 */
export function isReservationCreated(msg: WSMessage): msg is ReservationCreatedMessage {
  return msg.type === 'reservation_created';
}

/**
 * Type guard for reservation released message
 */
export function isReservationReleased(msg: WSMessage): msg is ReservationReleasedMessage {
  return msg.type === 'reservation_released';
}

/**
 * Type guard for sync response message
 */
export function isSyncResponse(msg: WSMessage): msg is SyncResponseMessage {
  return msg.type === 'sync_response';
}

/**
 * Type guard for error message
 */
export function isErrorMessage(msg: WSMessage): msg is ErrorMessage {
  return msg.type === 'error';
}
