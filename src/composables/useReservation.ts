import { ref, computed, readonly } from 'vue';
import type {
  Reservation,
  ReservationCreatedEvent,
  ReservationReleasedEvent,
  ReserveGameResponse,
  ListReservationsResponse
} from '../types/reservation';
import { isReservationActive, getReservationTimeRemaining } from '../types/reservation';

// API base URL - should be configured via environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// State
const reservations = ref<Map<number, Reservation>>(new Map());
const loading = ref(false);
const error = ref<string | null>(null);
const lastReserveTime = ref<number>(0);

// Debounce configuration
const DEBOUNCE_MS = 500;

/**
 * Composable for managing game reservations
 */
export function useReservation() {
  /**
   * Reserve a game for a wallet
   * @param gameId - The game ID to reserve
   * @param walletAddress - The wallet address making the reservation
   * @returns The created reservation or null if failed
   */
  async function reserveGame(gameId: number, walletAddress: string): Promise<Reservation | null> {
    // Debounce protection (T024.2)
    const now = Date.now();
    if (now - lastReserveTime.value < DEBOUNCE_MS) {
      console.warn('Reserve request debounced');
      return null;
    }
    lastReserveTime.value = now;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error.value = errorData.message || 'Failed to reserve game';

        // Handle specific error cases
        if (response.status === 409) {
          // Game already reserved or too many reservations
          error.value = errorData.error === 'too_many_reservations'
            ? 'You have too many active reservations'
            : 'Game is already reserved by another player';
        } else if (response.status === 403) {
          error.value = 'You cannot reserve your own game';
        } else if (response.status === 404) {
          error.value = 'Game is not available for reservation';
        }

        return null;
      }

      const data: ReserveGameResponse = await response.json();
      const reservation = data.reservation;

      // Update local state
      reservations.value.set(gameId, reservation);

      return reservation;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Network error';
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Cancel a game reservation
   * @param gameId - The game ID to cancel reservation for
   * @param walletAddress - The wallet address that holds the reservation
   */
  async function cancelReservation(gameId: number, walletAddress: string): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/reserve`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        error.value = errorData.message || 'Failed to cancel reservation';
        return false;
      }

      // Remove from local state
      reservations.value.delete(gameId);

      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Network error';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get current reservation for a game
   * @param gameId - The game ID to check
   */
  async function getReservation(gameId: number): Promise<Reservation | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/games/${gameId}/reservation`);

      if (response.status === 204) {
        // No reservation exists
        reservations.value.delete(gameId);
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const data: ReserveGameResponse = await response.json();
      const reservation = data.reservation;

      // Update local state
      reservations.value.set(gameId, reservation);

      return reservation;
    } catch {
      return null;
    }
  }

  /**
   * Fetch all reservations for a wallet
   * @param walletAddress - The wallet address to fetch reservations for
   */
  async function fetchWalletReservations(walletAddress: string): Promise<Reservation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/reservations?wallet=${encodeURIComponent(walletAddress)}`
      );

      if (!response.ok) {
        return [];
      }

      const data: ListReservationsResponse = await response.json();

      // Update local state
      for (const reservation of data.reservations) {
        reservations.value.set(reservation.game_id, reservation);
      }

      return data.reservations;
    } catch {
      return [];
    }
  }

  /**
   * Handle WebSocket reservation created event
   */
  function handleReservationCreated(event: ReservationCreatedEvent): void {
    const reservation: Reservation = {
      game_id: event.game_id,
      wallet_address: event.reserved_by,
      created_at: new Date().toISOString(),
      expires_at: event.expires_at,
      status: 'active',
    };
    reservations.value.set(event.game_id, reservation);
  }

  /**
   * Handle WebSocket reservation released event
   */
  function handleReservationReleased(event: ReservationReleasedEvent): void {
    reservations.value.delete(event.game_id);
  }

  /**
   * Check if a game is reserved
   */
  function isGameReserved(gameId: number): boolean {
    const reservation = reservations.value.get(gameId);
    return isReservationActive(reservation);
  }

  /**
   * Check if a game is reserved by a specific wallet
   */
  function isReservedByWallet(gameId: number, walletAddress: string): boolean {
    const reservation = reservations.value.get(gameId);
    if (!isReservationActive(reservation)) return false;
    return reservation!.wallet_address === walletAddress;
  }

  /**
   * Get remaining time for a reservation in seconds
   */
  function getTimeRemaining(gameId: number): number {
    const reservation = reservations.value.get(gameId);
    return getReservationTimeRemaining(reservation);
  }

  /**
   * Get reservation holder for a game
   */
  function getReservationHolder(gameId: number): string | null {
    const reservation = reservations.value.get(gameId);
    if (!isReservationActive(reservation)) return null;
    return reservation!.wallet_address;
  }

  // Computed helpers
  const activeReservationsCount = computed(() => {
    let count = 0;
    for (const reservation of reservations.value.values()) {
      if (isReservationActive(reservation)) {
        count++;
      }
    }
    return count;
  });

  return {
    // State (readonly)
    reservations: readonly(reservations),
    loading: readonly(loading),
    error: readonly(error),
    activeReservationsCount,

    // Actions
    reserveGame,
    cancelReservation,
    getReservation,
    fetchWalletReservations,

    // WebSocket handlers
    handleReservationCreated,
    handleReservationReleased,

    // Helpers
    isGameReserved,
    isReservedByWallet,
    getTimeRemaining,
    getReservationHolder,
  };
}
