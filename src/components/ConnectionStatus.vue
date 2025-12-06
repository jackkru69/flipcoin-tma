<script setup lang="ts">
/**
 * Connection status indicator component
 * Shows WebSocket connection state with appropriate visual feedback
 * @component ConnectionStatus
 */

import { computed } from 'vue';
import { useWebSocketStatus } from '@/composables/useWebSocket';

const { status, isConnecting } = useWebSocketStatus();

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
    :title="`Connection: ${status}`"
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
