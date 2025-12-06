/**
 * Centralized exports for all application types
 * This provides a single import point for type definitions
 */

// API response types
export * from './api';

// Smart contract types
export * from './contract';

// Reservation system types - exclude GameWithReservation to avoid conflict with api.ts
export {
  RESERVATION_STATUS_ACTIVE,
  RESERVATION_STATUS_RELEASED,
  RESERVATION_STATUS_EXPIRED,
  type ReservationStatus,
  type Reservation,
  type ReserveGameRequest,
  type ReserveGameResponse,
  type ListReservationsResponse,
  type ReservationEventType,
  type ReservationCreatedEvent,
  type ReservationReleaseReason,
  type ReservationReleasedEvent,
  type ReservationEvent,
  // GameWithReservation in reservation.ts has different shape - use the one from api.ts
  isReservationActive,
  getReservationTimeRemaining,
  isReservationCreatedEvent,
  isReservationReleasedEvent,
} from './reservation';

// User profile types
export * from './user';

// WebSocket types
export * from './websocket';
