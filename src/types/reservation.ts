/**
 * Reservation types for game reservation system
 * @module types/reservation
 */

// Reservation status constants
export const RESERVATION_STATUS_ACTIVE = 'active';
export const RESERVATION_STATUS_RELEASED = 'released';
export const RESERVATION_STATUS_EXPIRED = 'expired';

export type ReservationStatus = 'active' | 'released' | 'expired';

/**
 * Represents a game reservation from the backend API
 */
export interface Reservation {
  game_id: number;
  wallet_address: string;
  created_at: string;  // ISO 8601 timestamp
  expires_at: string;  // ISO 8601 timestamp
  status: ReservationStatus;
}

/**
 * Request payload for creating a reservation
 */
export interface ReserveGameRequest {
  wallet_address: string;
}

/**
 * Response from reserve game endpoint
 */
export interface ReserveGameResponse {
  reservation: Reservation;
}

/**
 * Response from list reservations endpoint
 */
export interface ListReservationsResponse {
  reservations: Reservation[];
}

/**
 * WebSocket event types for reservation updates
 */
export type ReservationEventType = 'reservation_created' | 'reservation_released';

/**
 * WebSocket event for reservation created
 */
export interface ReservationCreatedEvent {
  type: 'reservation_created';
  game_id: number;
  reserved_by: string;
  expires_at: string;  // ISO 8601 timestamp
}

/**
 * Reason for reservation release
 */
export type ReservationReleaseReason = 'expired' | 'cancelled' | 'joined';

/**
 * WebSocket event for reservation released
 */
export interface ReservationReleasedEvent {
  type: 'reservation_released';
  game_id: number;
  reason: ReservationReleaseReason;
}

/**
 * Union type for all reservation WebSocket events
 */
export type ReservationEvent = ReservationCreatedEvent | ReservationReleasedEvent;

/**
 * Extended game info with reservation data
 */
export interface GameWithReservation {
  game_id: number;
  status: number;
  player_one_address: string;
  player_two_address?: string;
  bet_amount: number;
  reserved_by?: string;
  reserved_until?: string;  // ISO 8601 timestamp
}

/**
 * Helper to check if a reservation is active
 */
export function isReservationActive(reservation: Reservation | null | undefined): boolean {
  if (!reservation) return false;
  if (reservation.status !== RESERVATION_STATUS_ACTIVE) return false;
  return new Date(reservation.expires_at) > new Date();
}

/**
 * Helper to get remaining time in seconds for a reservation
 */
export function getReservationTimeRemaining(reservation: Reservation | null | undefined): number {
  if (!reservation) return 0;
  const remaining = new Date(reservation.expires_at).getTime() - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Type guard for ReservationCreatedEvent
 */
export function isReservationCreatedEvent(event: unknown): event is ReservationCreatedEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    (event as ReservationCreatedEvent).type === 'reservation_created'
  );
}

/**
 * Type guard for ReservationReleasedEvent
 */
export function isReservationReleasedEvent(event: unknown): event is ReservationReleasedEvent {
  return (
    typeof event === 'object' &&
    event !== null &&
    'type' in event &&
    (event as ReservationReleasedEvent).type === 'reservation_released'
  );
}
