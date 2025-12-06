<template>
  <div class="profile-page">
    <div class="header">
      <button @click="goBack" class="btn-back">
        ← Назад
      </button>
      <h1>👤 Профиль</h1>
      <button @click="refetch" class="btn-refresh" :disabled="isLoading">
        🔄
      </button>
    </div>

    <!-- User Profile Stats -->
    <UserProfile
      :profile="profile"
      :stats="stats"
      :is-new-user="isNewUser"
      :is-loading="isLoading"
      :is-error="isError"
      :error="error"
      :refetch="refetch"
    />

    <!-- Referral Stats Section -->
    <div class="section" v-if="wallet && !isLoading">
      <h2>📊 Реферальная программа</h2>
      <ReferralStats
        v-if="referralStats || hasReferrals"
        :stats="referralStats"
        :has-referrals="hasReferrals"
        :formatted-earnings="formattedReferralEarnings"
        :wallet-address="wallet"
      />
      <div v-else class="empty-referrals">
        <p>У вас пока нет рефералов</p>
        <p class="hint">Поделитесь своим адресом кошелька с друзьями, чтобы получать бонусы с их игр!</p>
      </div>
    </div>

    <!-- Game History Section -->
    <div class="section" v-if="wallet && !isLoading">
      <h2>🎮 История игр</h2>
      <GameHistoryList
        :games="historyGames"
        :total-games="historyTotalGames"
        :history-stats="historyStats"
        :has-history="hasHistory"
        :has-next-page="historyHasNextPage"
        :is-fetching-next-page="historyIsFetchingNextPage"
        :is-loading="historyIsLoading"
        :is-error="historyIsError"
        :error="historyError"
        :fetch-next-page="historyFetchNextPage"
        :refetch="historyRefetch"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Profile page - shows user stats, referrals, and game history
 * @page ProfilePage
 */

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTonWallet } from '../tonconnect/useTonWallet';
import { useUserProfile } from '@/composables/useUserProfile';
import { useGameHistory } from '@/composables/useGameHistory';
import UserProfile from '@/components/UserProfile.vue';
import ReferralStats from '@/components/ReferralStats.vue';
import GameHistoryList from '@/components/GameHistoryList.vue';

const router = useRouter();
const { wallet: tonWallet } = useTonWallet();
const wallet = computed(() => tonWallet.value?.account.address ?? null);

// Use user profile composable
const {
  profile,
  stats,
  referralStats,
  isNewUser,
  hasReferrals,
  formattedReferralEarnings,
  isLoading,
  isError,
  error,
  refetch,
} = useUserProfile(wallet);

// Use game history composable
const {
  games: historyGames,
  totalGames: historyTotalGames,
  historyStats,
  hasHistory,
  hasNextPage: historyHasNextPage,
  isFetchingNextPage: historyIsFetchingNextPage,
  isLoading: historyIsLoading,
  isError: historyIsError,
  error: historyError,
  fetchNextPage: historyFetchNextPage,
  refetch: historyRefetch,
} = useGameHistory(wallet);

/**
 * Navigate back to the main game page
 */
function goBack() {
  router.push('/pod');
}
</script>

<style scoped>
.profile-page {
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-color, #2481cc);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn-refresh {
  padding: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.2s;
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--tg-theme-hint-color, #e0e0e0);
}

.section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  color: var(--tg-theme-text-color, #000);
}

.empty-referrals {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
}

.empty-referrals p {
  margin: 0 0 0.5rem 0;
  color: var(--tg-theme-text-color, #000);
}

.empty-referrals .hint {
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color, #999);
}
</style>
