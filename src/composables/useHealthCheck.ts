/**
 * Composable for monitoring backend health status
 * @module composables/useHealthCheck
 */

import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { HealthStatus } from '../types/api';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

// Health check polling interval (10 seconds)
const HEALTH_CHECK_INTERVAL = 10000;

/**
 * Fetch health status from backend
 */
async function fetchHealthStatus(): Promise<HealthStatus> {
  const response = await fetch(`${API_BASE_URL}/api/v1/health`, {
    // Short timeout for health checks
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

/**
 * Health status type for UI
 */
export type HealthLevel = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

/**
 * Composable for backend health monitoring
 * Polls the health endpoint periodically
 */
export function useHealthCheck() {
  // Track consecutive failures for detecting prolonged outages
  const consecutiveFailures = ref(0);
  const MAX_FAILURES_BEFORE_UNHEALTHY = 3;

  // Health query with polling
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      try {
        const result = await fetchHealthStatus();
        consecutiveFailures.value = 0;
        return result;
      } catch (error) {
        consecutiveFailures.value++;
        throw error;
      }
    },
    staleTime: HEALTH_CHECK_INTERVAL / 2, // 5 seconds
    refetchInterval: HEALTH_CHECK_INTERVAL, // 10 seconds
    retry: 1,
    retryDelay: 1000,
  });

  // Computed health level
  const healthLevel = computed<HealthLevel>(() => {
    // If query failed multiple times, consider unhealthy
    if (consecutiveFailures.value >= MAX_FAILURES_BEFORE_UNHEALTHY) {
      return 'unhealthy';
    }

    // If we have health data, use it
    if (healthQuery.data.value) {
      return healthQuery.data.value.status;
    }

    // If loading or error but not enough failures, unknown
    if (healthQuery.isError.value || healthQuery.isLoading.value) {
      return 'unknown';
    }

    return 'healthy';
  });

  // Computed: Is the system healthy enough for operations
  const isOperational = computed(() => {
    return healthLevel.value === 'healthy' || healthLevel.value === 'degraded';
  });

  // Computed: Should show warning banner
  const showWarning = computed(() => {
    return healthLevel.value === 'degraded' || healthLevel.value === 'unhealthy';
  });

  // Computed: Should disable critical actions (like creating games)
  const shouldDisableActions = computed(() => {
    return healthLevel.value === 'unhealthy';
  });

  // Get human-readable status message
  const statusMessage = computed(() => {
    switch (healthLevel.value) {
      case 'healthy':
        return 'Все системы работают нормально';
      case 'degraded':
        return 'Некоторые сервисы работают с ограничениями';
      case 'unhealthy':
        return 'Сервис временно недоступен';
      case 'unknown':
        return 'Проверка статуса...';
      default:
        return '';
    }
  });

  // Get detailed status for debugging
  const detailedStatus = computed(() => {
    if (!healthQuery.data.value) return null;

    const health = healthQuery.data.value;
    return {
      database: health.database,
      eventSource: health.event_source_status,
      eventSourceType: health.event_source_type,
      tonCenter: health.ton_center_api ?? 'unknown',
    };
  });

  // Manual refresh
  const refresh = () => healthQuery.refetch();

  return {
    // Query
    healthQuery,

    // Status
    healthLevel,
    healthStatus: healthQuery.data,
    statusMessage,
    detailedStatus,

    // Flags
    isOperational,
    showWarning,
    shouldDisableActions,
    consecutiveFailures,

    // States
    isLoading: computed(() => healthQuery.isLoading.value),
    isError: computed(() => healthQuery.isError.value),
    error: computed(() => healthQuery.error.value),

    // Actions
    refresh,
  };
}

/**
 * Get CSS class for health level
 */
export function getHealthLevelClass(level: HealthLevel): string {
  switch (level) {
    case 'healthy':
      return 'health-healthy';
    case 'degraded':
      return 'health-degraded';
    case 'unhealthy':
      return 'health-unhealthy';
    default:
      return 'health-unknown';
  }
}

/**
 * Get icon for health level
 */
export function getHealthLevelIcon(level: HealthLevel): string {
  switch (level) {
    case 'healthy':
      return '✓';
    case 'degraded':
      return '⚠';
    case 'unhealthy':
      return '✕';
    default:
      return '?';
  }
}
