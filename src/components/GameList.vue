<template>
  <div class="game-list">
    <div class="header">
      <h2>Список игр</h2>
      <div class="stats" v-if="stats">
        <span>Создано: {{ stats.totalGamesCreated }}</span>
        <span>Завершено: {{ stats.totalGamesFinished }}</span>
      </div>
    </div>

    <div class="filters">
      <button
        v-for="(status, index) in statusFilters"
        :key="index"
        :class="{ active: selectedStatus === status.value }"
        @click="selectedStatus = status.value"
      >
        {{ status.label }}
      </button>
    </div>

    <div v-if="loading" class="loading">Загрузка игр...</div>

    <div v-else-if="error" class="error">
      Ошибка загрузки: {{ error }}
    </div>

    <div v-else-if="filteredGames.length === 0" class="empty">
      Игры не найдены
    </div>

    <div v-else class="games-grid">
      <GameCard
        v-for="game in filteredGames"
        :key="game.gameId.toString()"
        :game="game"
        :user-address="userAddress"
        @join="$emit('join', $event)"
        @open-bid="$emit('openBid', $event)"
        @cancel="$emit('cancel', $event)"
      />
    </div>

    <div v-if="hasMore" class="load-more">
      <button @click="loadMore" :disabled="loadingMore">
        {{ loadingMore ? 'Загрузка...' : 'Загрузить еще' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Address } from '@ton/core';
import GameCard from './GameCard.vue';
import type { GameInfo, FactoryStats } from '../types/contract';
import { GAME_STATUS_WAITING_FOR_OPPONENT, GAME_STATUS_WAITING_FOR_OPEN_BIDS } from '../types/contract';

interface Props {
  games: GameInfo[];
  loading: boolean;
  error: string | null;
  stats: FactoryStats | null;
  userAddress?: Address;
  hasMore: boolean;
  loadingMore: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  join: [gameId: bigint];
  openBid: [gameId: bigint];
  cancel: [gameId: bigint];
  loadMore: [];
}>();

const selectedStatus = ref<number | null>(null);

const statusFilters = [
  { value: null as number | null, label: 'Все' },
  { value: GAME_STATUS_WAITING_FOR_OPPONENT, label: 'Ожидают оппонента' },
  { value: GAME_STATUS_WAITING_FOR_OPEN_BIDS, label: 'Ожидают раскрытия' },
];

const filteredGames = computed(() => {
  if (selectedStatus.value === null) {
    return props.games;
  }
  return props.games.filter(game => Number(game.status) === selectedStatus.value);
});

const loadMore = () => {
  emit('loadMore');
};
</script>

<style scoped>
.game-list {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color, #999);
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--tg-theme-button-color, #2481cc);
  background: transparent;
  color: var(--tg-theme-button-color, #2481cc);
  border-radius: 1rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.filters button.active {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--tg-theme-hint-color, #999);
}

.error {
  color: #f44336;
}

.games-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more button {
  padding: 0.75rem 2rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.load-more button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
}
</style>
