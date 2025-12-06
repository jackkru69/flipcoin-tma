<template>
  <div class="user-profile">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      <span class="loading-spinner">⏳</span>
      <span>Загрузка профиля...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="isError" class="error">
      <span class="error-icon">❌</span>
      <span>{{ error?.message || 'Ошибка загрузки профиля' }}</span>
      <button @click="refetch" class="retry-button">Повторить</button>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile" class="profile-content">
      <!-- Header with wallet info -->
      <div class="profile-header">
        <div class="avatar">
          {{ avatarEmoji }}
        </div>
        <div class="user-info">
          <h2 v-if="profile.telegram_username" class="username">
            @{{ profile.telegram_username }}
          </h2>
          <p class="wallet-address" :title="profile.wallet_address">
            {{ shortenAddress(profile.wallet_address) }}
          </p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ stats?.totalGames || 0 }}</span>
          <span class="stat-label">Всего игр</span>
        </div>
        <div class="stat-card wins">
          <span class="stat-value">{{ stats?.wins || 0 }}</span>
          <span class="stat-label">Побед</span>
        </div>
        <div class="stat-card losses">
          <span class="stat-value">{{ stats?.losses || 0 }}</span>
          <span class="stat-label">Поражений</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ stats?.winRate || 0 }}%</span>
          <span class="stat-label">Винрейт</span>
        </div>
      </div>

      <!-- Empty State for New Users -->
      <div v-if="isNewUser" class="empty-state">
        <div class="empty-icon">🎮</div>
        <h3>Добро пожаловать!</h3>
        <p>Вы еще не сыграли ни одной игры. Создайте игру или присоединитесь к существующей!</p>
      </div>

      <!-- Win Rate Progress Bar -->
      <div v-if="!isNewUser" class="win-rate-bar">
        <div class="bar-label">
          <span>Винрейт</span>
          <span>{{ stats?.winRate || 0 }}%</span>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${stats?.winRate || 0}%` }"
            :class="winRateClass"
          ></div>
        </div>
      </div>
    </div>

    <!-- No Wallet Connected -->
    <div v-else class="no-wallet">
      <div class="empty-icon">🔗</div>
      <h3>Подключите кошелек</h3>
      <p>Для просмотра профиля необходимо подключить TON кошелек</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * User profile stats display component
 * Shows game statistics and account information
 * @component UserProfile
 */

import { computed } from 'vue';
import type { User, UserStats } from '@/types/user';

interface Props {
  profile: User | null | undefined;
  stats: UserStats | null | undefined;
  isNewUser: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null | undefined;
  refetch: () => void;
}

const props = defineProps<Props>();

/**
 * Generate avatar emoji based on win rate
 */
const avatarEmoji = computed(() => {
  if (!props.stats || props.stats.totalGames === 0) return '🎮';
  const winRate = props.stats.winRate;
  if (winRate >= 70) return '🏆';
  if (winRate >= 50) return '⭐';
  if (winRate >= 30) return '🎯';
  return '🎲';
});

/**
 * Get CSS class for win rate color
 */
const winRateClass = computed(() => {
  if (!props.stats) return '';
  const winRate = props.stats.winRate;
  if (winRate >= 60) return 'high';
  if (winRate >= 40) return 'medium';
  return 'low';
});

/**
 * Shorten wallet address for display
 */
function shortenAddress(address: string): string {
  if (address.length <= 16) return address;
  return `${address.slice(0, 8)}...${address.slice(-8)}`;
}
</script>

<style scoped>
.user-profile {
  padding: 1rem;
}

.loading,
.error,
.no-wallet {
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

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 64px;
  height: 64px;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 50%;
}

.user-info {
  flex: 1;
}

.username {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  color: var(--tg-theme-text-color, #000);
}

.wallet-address {
  margin: 0;
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color, #999);
  font-family: monospace;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--tg-theme-text-color, #000);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--tg-theme-hint-color, #999);
  margin-top: 0.25rem;
}

.stat-card.wins .stat-value {
  color: #28a745;
}

.stat-card.losses .stat-value {
  color: #dc3545;
}

.empty-state {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 2rem;
  border-radius: 0.75rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--tg-theme-text-color, #000);
}

.empty-state p {
  margin: 0;
  color: var(--tg-theme-hint-color, #999);
}

.no-wallet {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 2rem;
  border-radius: 0.75rem;
}

.no-wallet h3 {
  margin: 0.5rem 0;
  color: var(--tg-theme-text-color, #000);
}

.no-wallet p {
  margin: 0;
  color: var(--tg-theme-hint-color, #999);
}

.win-rate-bar {
  margin-top: 1rem;
}

.bar-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color, #999);
}

.progress-bar {
  height: 8px;
  background: var(--tg-theme-secondary-bg-color, #e9ecef);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-fill.high {
  background: #28a745;
}

.progress-fill.medium {
  background: #ffc107;
}

.progress-fill.low {
  background: #dc3545;
}
</style>
