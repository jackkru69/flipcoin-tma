/**
 * Composable for WebSocket connection management
 * @module composables/useWebSocket
 */

import { ref, computed, onUnmounted, watch, type Ref } from 'vue';
import {
  getWebSocketService,
  type MessageHandler,
} from '../services/websocket';
import type {
  WebSocketConnectionStatus,
  WebSocketState,
} from '../types/websocket';

/**
 * Composable for managing WebSocket connection to a game
 * @param gameId - Reactive ref to the game ID (null to disconnect)
 * @param initData - Telegram Mini App initData for authentication
 */
export function useWebSocket(
  gameId: Ref<number | null>,
  initData?: string
) {
  const service = getWebSocketService();

  // Reactive state
  const status = ref<WebSocketConnectionStatus>('disconnected');
  const error = ref<string | null>(null);
  const lastConnectedAt = ref<Date | null>(null);
  const reconnectAttempts = ref(0);

  // State change handler
  const handleStateChange = (state: WebSocketState) => {
    status.value = state.status;
    error.value = state.error;
    lastConnectedAt.value = state.lastConnectedAt;
    reconnectAttempts.value = state.reconnectAttempts;
  };

  // Register state handler
  const unsubscribeState = service.onStateChange(handleStateChange);

  // Get initData from Telegram WebApp if not provided
  const getInitData = (): string => {
    if (initData) return initData;
    // Try to get from Telegram WebApp
    try {
      const tg = (window as Window & { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
      return tg?.WebApp?.initData ?? '';
    } catch {
      return '';
    }
  };

  // Watch gameId changes
  watch(
    gameId,
    (newGameId, oldGameId) => {
      if (newGameId === oldGameId) return;

      if (newGameId) {
        service.connect(newGameId, getInitData());
      } else {
        service.disconnect();
      }
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribeState();
    // Don't disconnect - allow other components to maintain connection
  });

  // Computed properties
  const isConnected = computed(() => status.value === 'connected');
  const isConnecting = computed(() => status.value === 'connecting' || status.value === 'reconnecting');
  const isDisconnected = computed(() => status.value === 'disconnected');
  const hasFailed = computed(() => status.value === 'failed');

  /**
   * Register a message handler
   * @param handler - Handler function for incoming messages
   * @returns Unsubscribe function
   */
  function onMessage(handler: MessageHandler): () => void {
    return service.onMessage(handler);
  }

  /**
   * Send a sync request to server
   */
  function sendSyncRequest(lastEventTimestamp?: string): boolean {
    return service.sendSyncRequest(lastEventTimestamp);
  }

  /**
   * Manually disconnect
   */
  function disconnect(): void {
    service.disconnect();
  }

  /**
   * Manually reconnect
   */
  function reconnect(): void {
    if (gameId.value) {
      service.connect(gameId.value, getInitData());
    }
  }

  return {
    // State
    status,
    error,
    lastConnectedAt,
    reconnectAttempts,

    // Computed
    isConnected,
    isConnecting,
    isDisconnected,
    hasFailed,

    // Methods
    onMessage,
    sendSyncRequest,
    disconnect,
    reconnect,
  };
}

/**
 * Composable for global WebSocket state (without connecting)
 * Useful for displaying connection status in UI
 */
export function useWebSocketStatus() {
  const service = getWebSocketService();

  const status = ref<WebSocketConnectionStatus>('disconnected');
  const error = ref<string | null>(null);
  const gameId = ref<number | null>(null);

  const handleStateChange = (state: WebSocketState) => {
    status.value = state.status;
    error.value = state.error;
    gameId.value = state.gameId;
  };

  const unsubscribe = service.onStateChange(handleStateChange);

  onUnmounted(() => {
    unsubscribe();
  });

  return {
    status,
    error,
    gameId,
    isConnected: computed(() => status.value === 'connected'),
    isConnecting: computed(() => status.value === 'connecting' || status.value === 'reconnecting'),
  };
}
