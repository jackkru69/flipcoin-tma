<template>
  <div class="referral-stats">
    <!-- Stats Grid -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card">
        <span class="stat-value">{{ stats.total_referrals }}</span>
        <span class="stat-label">Рефералов</span>
      </div>
      <div class="stat-card earnings">
        <span class="stat-value">{{ formattedEarnings }}</span>
        <span class="stat-label">Заработано</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ stats.games_referred }}</span>
        <span class="stat-label">Игр</span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasReferrals" class="empty-state">
      <div class="empty-icon">🤝</div>
      <h3>Пригласите друзей</h3>
      <p>Получайте бонусы за каждую игру ваших рефералов!</p>
    </div>

    <!-- Share Section -->
    <div class="share-section" v-if="walletAddress">
      <p class="share-label">Ваш реферальный адрес:</p>
      <div class="share-box">
        <code class="referral-code">{{ shortenAddress(walletAddress) }}</code>
        <button @click="copyAddress" class="btn-copy" :class="{ copied: justCopied }">
          {{ justCopied ? '✓' : '📋' }}
        </button>
      </div>
      <p class="share-hint">Друзья должны указать ваш адрес при создании игры</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Referral statistics component
 * Shows referral count, earnings, and share functionality
 * @component ReferralStats
 */

import { ref } from 'vue';
import type { ReferralStats } from '@/types/user';

interface Props {
  stats: ReferralStats | null | undefined;
  hasReferrals: boolean;
  formattedEarnings: string;
  walletAddress: string | null;
}

const props = defineProps<Props>();

const justCopied = ref(false);

/**
 * Shorten address for display
 */
function shortenAddress(address: string): string {
  if (address.length <= 20) return address;
  return `${address.slice(0, 10)}...${address.slice(-10)}`;
}

/**
 * Copy wallet address to clipboard
 */
async function copyAddress() {
  if (!props.walletAddress) return;

  try {
    await navigator.clipboard.writeText(props.walletAddress);
    justCopied.value = true;
    setTimeout(() => {
      justCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}
</script>

<style scoped>
.referral-stats {
  padding: 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 0.75rem;
  border-radius: 0.75rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--tg-theme-text-color, #000);
}

.stat-label {
  display: block;
  font-size: 0.625rem;
  color: var(--tg-theme-hint-color, #999);
  margin-top: 0.25rem;
  text-transform: uppercase;
}

.stat-card.earnings .stat-value {
  color: #28a745;
  font-size: 1rem;
}

.empty-state {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--tg-theme-text-color, #000);
  font-size: 1rem;
}

.empty-state p {
  margin: 0;
  color: var(--tg-theme-hint-color, #999);
  font-size: 0.875rem;
}

.share-section {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 1rem;
  border-radius: 0.75rem;
}

.share-label {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--tg-theme-text-color, #000);
}

.share-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--tg-theme-bg-color, #fff);
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.referral-code {
  flex: 1;
  font-family: monospace;
  font-size: 0.875rem;
  color: var(--tg-theme-text-color, #000);
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-copy {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-copy.copied {
  background: #28a745;
}

.share-hint {
  margin: 0.75rem 0 0 0;
  font-size: 0.75rem;
  color: var(--tg-theme-hint-color, #999);
}
</style>
