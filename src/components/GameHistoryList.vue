<template>
  <div class="game-history-list">
    <!-- Loading State -->
    <div v-if="isLoading && !hasHistory" class="loading">
      <span class="loading-spinner">⏳</span>
      <span>Загрузка истории...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="error">
      <span class="error-icon">❌</span>
      <span>{{ error?.message || 'Ошибка загрузки истории' }}</span>
      <button @click="refetch" class="retry-button">Повторить</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasHistory" class="empty-state">
      <div class="empty-icon">📜</div>
      <h3>История пуста</h3>
      <p>У вас пока нет сыгранных игр</p>
    </div>

    <!-- Game History List -->
    <div v-else class="history-content">
      <!-- Stats Summary -->
      <div class="stats-summary">
        <span class="stat win">🏆 {{ historyStats.wins }}</span>
        <span class="stat loss">❌ {{ historyStats.losses }}</span>
        <span class="stat draw">🤝 {{ historyStats.draws }}</span>
        <span class="stat pending" v-if="historyStats.pending > 0">
          ⏳ {{ historyStats.pending }}
        </span>
      </div>

      <!-- History Items -->
      <div class="history-items">
        <div
          v-for="entry in games"
          :key="entry.game.game_id"
          class="history-item"
          :class="getOutcomeClass(entry.outcome)"
        >
          <div class="item-header">
            <span class="outcome-badge">
              {{ getOutcomeEmoji(entry.outcome) }}
              {{ getOutcomeText(entry.outcome) }}
            </span>
            <span class="game-id">#{{ entry.game.game_id }}</span>
          </div>

          <div class="item-details">
            <div class="detail">
              <span class="label">Ставка:</span>
              <span class="value">{{ entry.formattedBetAmount }}</span>
            </div>
            <div class="detail" v-if="entry.opponentAddress">
              <span class="label">Оппонент:</span>
              <span class="value address">{{ shortenAddress(entry.opponentAddress) }}</span>
            </div>
            <div class="detail">
              <span class="label">Дата:</span>
              <span class="value">{{ entry.formattedDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More / Infinite Scroll Trigger -->
      <div
        v-if="hasNextPage"
        ref="loadMoreTrigger"
        class="load-more"
      >
        <button
          @click="fetchNextPage"
          :disabled="isFetchingNextPage"
          class="load-more-button"
        >
          {{ isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё' }}
        </button>
      </div>

      <!-- End of List -->
      <div v-else-if="games.length > 0" class="end-of-list">
        <span>Вы просмотрели все {{ totalGames }} игр</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Game history list component with infinite scroll
 * @component GameHistoryList
 */

import { ref, onMounted, onUnmounted } from 'vue';
import type { GameHistoryEntry } from '@/types/user';
import {
  getOutcomeClass,
  getOutcomeText,
  getOutcomeEmoji
} from '@/composables/useGameHistory';

interface HistoryStats {
  wins: number;
  losses: number;
  draws: number;
  pending: number;
  total: number;
}

interface Props {
  games: GameHistoryEntry[];
  totalGames: number;
  historyStats: HistoryStats;
  hasHistory: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null | undefined;
  fetchNextPage: () => void;
  refetch: () => void;
}

const props = defineProps<Props>();

// Ref for intersection observer
const loadMoreTrigger = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

/**
 * Shorten address for display
 */
function shortenAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

/**
 * Setup intersection observer for infinite scroll
 */
function setupIntersectionObserver() {
  if (!loadMoreTrigger.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && props.hasNextPage && !props.isFetchingNextPage) {
        props.fetchNextPage();
      }
    },
    {
      rootMargin: '100px',
    }
  );

  observer.observe(loadMoreTrigger.value);
}

onMounted(() => {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    setupIntersectionObserver();
  }, 100);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<style scoped>
.game-history-list {
  padding: 0;
}

.loading,
.error,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: var(--tg-theme-hint-color, #999);
}

.loading-spinner {
  font-size: 2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error {
  color: var(--tg-theme-destructive-text-color, #dc3545);
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--tg-theme-text-color, #000);
}

.empty-state p {
  margin: 0;
}

.stats-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 0.5rem;
}

.stats-summary .stat {
  font-size: 0.875rem;
  font-weight: 500;
}

.stats-summary .stat.win {
  color: #28a745;
}

.stats-summary .stat.loss {
  color: #dc3545;
}

.stats-summary .stat.draw {
  color: #6c757d;
}

.stats-summary .stat.pending {
  color: #ffc107;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 0.75rem;
  padding: 1rem;
  border-left: 4px solid transparent;
}

.history-item.outcome-win {
  border-left-color: #28a745;
}

.history-item.outcome-loss {
  border-left-color: #dc3545;
}

.history-item.outcome-draw {
  border-left-color: #6c757d;
}

.history-item.outcome-pending {
  border-left-color: #ffc107;
}

.history-item.outcome-cancelled {
  border-left-color: #6c757d;
  opacity: 0.7;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.outcome-badge {
  font-weight: 600;
  font-size: 0.875rem;
}

.game-id {
  font-size: 0.75rem;
  color: var(--tg-theme-hint-color, #999);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
}

.detail .label {
  color: var(--tg-theme-hint-color, #999);
}

.detail .value {
  color: var(--tg-theme-text-color, #000);
}

.detail .value.address {
  font-family: monospace;
  font-size: 0.75rem;
}

.load-more {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

.load-more-button {
  padding: 0.75rem 2rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.load-more-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.end-of-list {
  text-align: center;
  padding: 1rem;
  color: var(--tg-theme-hint-color, #999);
  font-size: 0.8125rem;
}
</style>
