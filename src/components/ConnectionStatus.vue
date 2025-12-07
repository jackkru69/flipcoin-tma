<script setup lang="ts">
/**
 * Connection status indicator component
 * Shows WebSocket connection state with appropriate visual feedback
 * Automatically connects to global WebSocket for real-time updates
 * Also handles global WebSocket messages (reservations, game updates)
 * @component ConnectionStatus
 */

import { computed, onMounted, onUnmounted } from 'vue';
import { getWebSocketService } from '@/services/websocket';
import type { WebSocketState, WSMessage } from '@/types/websocket';
import { isReservationCreated, isReservationReleased, isGameStateUpdate } from '@/types/websocket';
import { useReservation } from '@/composables/useReservation';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

const wsService = getWebSocketService();
const queryClient = useQueryClient();

// Get reservation handlers
const { handleReservationCreated, handleReservationReleased } = useReservation();

// Reactive state from WebSocket
const status = ref<WebSocketState['status']>('disconnected');
const error = ref<string | null>(null);

// Subscribe to WebSocket state changes
let unsubscribeState: (() => void) | null = null;
let unsubscribeMessages: (() => void) | null = null;

/**
 * Handle incoming WebSocket messages
 */
function handleMessage(message: WSMessage): void {
  console.log('[ConnectionStatus] WebSocket message:', message.type, message);

  if (isReservationCreated(message)) {
    handleReservationCreated({
      type: 'reservation_created',
      game_id: message.game_id,
      reserved_by: message.reserved_by,
      expires_at: message.expires_at,
    });
    // Invalidate games query to refresh UI
    queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
  } else if (isReservationReleased(message)) {
    handleReservationReleased({
      type: 'reservation_released',
      game_id: message.game_id,
      reason: message.reason,
    });
    // Invalidate games query to refresh UI
    queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
  } else if (isGameStateUpdate(message)) {
    // Invalidate games query on game state updates
    queryClient.invalidateQueries({ queryKey: ['api', 'games'] });
  }
}

/**
 * Get Telegram initData for WebSocket auth
 */
function getInitData(): string {
  try {
    const tg = (window as Window & { Telegram?: { WebApp?: { initData?: string } } }).Telegram;
    return tg?.WebApp?.initData ?? '';
  } catch {
    return '';
  }
}

onMounted(() => {
  // Subscribe to state changes
  unsubscribeState = wsService.onStateChange((state) => {
    status.value = state.status;
    error.value = state.error;
  });

  // Subscribe to messages
  unsubscribeMessages = wsService.onMessage(handleMessage);

  // Connect to global WebSocket if not already connected
  const currentState = wsService.getState();
  if (currentState.status === 'disconnected') {
    wsService.connectGlobal(getInitData());
  }
});

onUnmounted(() => {
  if (unsubscribeState) {
    unsubscribeState();
  }
  if (unsubscribeMessages) {
    unsubscribeMessages();
  }
  // Don't disconnect - other components may be using the connection
});

// Status display configuration
const statusConfig = computed(() => {
  switch (status.value) {
    case 'connected':
      return {
        color: 'var(--tg-theme-button-color, #28a745)',
        icon: '●',
        text: 'Live',
        show: false, // Hide when connected for non-intrusive UX
      };
    case 'connecting':
      return {
        color: 'var(--tg-theme-hint-color, #ffc107)',
        icon: '◐',
        text: 'Connecting...',
        show: true,
      };
    case 'reconnecting':
      return {
        color: 'var(--tg-theme-hint-color, #ffc107)',
        icon: '↻',
        text: 'Reconnecting...',
        show: true,
      };
    case 'disconnected':
      return {
        color: 'var(--tg-theme-destructive-text-color, #dc3545)',
        icon: '○',
        text: 'Offline',
        show: true,
      };
    case 'failed':
      return {
        color: 'var(--tg-theme-destructive-text-color, #dc3545)',
        icon: '✕',
        text: 'Connection Failed',
        show: true,
      };
    default:
      return {
        color: 'var(--tg-theme-hint-color, #6c757d)',
        icon: '○',
        text: 'Unknown',
        show: false,
      };
  }
});

const isConnecting = computed(() => status.value === 'connecting' || status.value === 'reconnecting');

// Always show prop for debugging/explicit display
defineProps<{
  alwaysShow?: boolean;
}>();
</script>

<template>
  <div
    v-if="alwaysShow || statusConfig.show"
    class="connection-status"
    :style="{ '--status-color': statusConfig.color }"
    :title="`WebSocket: ${status}${error ? ' - ' + error : ''}`"
  >
    <span class="connection-status__icon" :class="{ 'connection-status__icon--spinning': isConnecting }">
      {{ statusConfig.icon }}
    </span>
    <span class="connection-status__text">
      {{ statusConfig.text }}
    </span>
  </div>
</template>

<style scoped>
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 12px;
  color: var(--status-color);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  user-select: none;
}

.connection-status__icon {
  font-size: 10px;
  line-height: 1;
}

.connection-status__icon--spinning {
  animation: spin 1s linear infinite;
}

.connection-status__text {
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
