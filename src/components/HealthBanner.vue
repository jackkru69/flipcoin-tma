<template>
  <Transition name="slide">
    <div
      v-if="showWarning"
      class="health-banner"
      :class="healthLevelClass"
    >
      <div class="banner-content">
        <span class="icon">{{ healthIcon }}</span>
        <span class="message">{{ statusMessage }}</span>
        <button
          v-if="healthLevel === 'unhealthy'"
          @click="refresh"
          class="retry-button"
          :disabled="isLoading"
        >
          {{ isLoading ? '...' : '🔄' }}
        </button>
      </div>
      <button @click="dismissed = true" class="dismiss-button" v-if="healthLevel === 'degraded'">
        ✕
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/**
 * Health status banner component
 * Shows warnings when backend is degraded or unhealthy
 * @component HealthBanner
 */

import { ref, computed, watch } from 'vue';
import {
  useHealthCheck,
  getHealthLevelClass,
  getHealthLevelIcon,
} from '@/composables/useHealthCheck';

const {
  healthLevel,
  statusMessage,
  showWarning: shouldShowWarning,
  isLoading,
  refresh,
} = useHealthCheck();

// Allow dismissing degraded warnings
const dismissed = ref(false);

// Re-show banner if status changes
watch(healthLevel, (newLevel, oldLevel) => {
  if (newLevel !== oldLevel) {
    dismissed.value = false;
  }
});

// Show warning unless dismissed (only for degraded)
const showWarning = computed(() => {
  if (healthLevel.value === 'unhealthy') {
    return true; // Always show unhealthy
  }
  return shouldShowWarning.value && !dismissed.value;
});

// CSS class for banner
const healthLevelClass = computed(() => getHealthLevelClass(healthLevel.value));

// Icon for status
const healthIcon = computed(() => getHealthLevelIcon(healthLevel.value));
</script>

<style scoped>
.health-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.health-degraded {
  background: #fff3cd;
  color: #856404;
  border-bottom: 2px solid #ffc107;
}

.health-unhealthy {
  background: #f8d7da;
  color: #721c24;
  border-bottom: 2px solid #dc3545;
}

.health-unknown {
  background: #e2e3e5;
  color: #383d41;
  border-bottom: 2px solid #6c757d;
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.icon {
  font-size: 1.25rem;
}

.message {
  flex: 1;
}

.retry-button {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.retry-button:hover:not(:disabled) {
  opacity: 1;
}

.retry-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dismiss-button {
  padding: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.dismiss-button:hover {
  opacity: 1;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
