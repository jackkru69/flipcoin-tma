/**
 * Composable for fetching user profile data
 * @module composables/useUserProfile
 */

import { computed, type Ref, type ComputedRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import type { User, UserStats, ReferralStats } from '../types/user';
import { computeUserStats, formatTON } from '../types/user';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

/**
 * Fetch user profile from backend
 */
async function fetchUserProfile(walletAddress: string): Promise<User> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/users/${encodeURIComponent(walletAddress)}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      // Return a "new user" profile for 404
      return createEmptyUserProfile(walletAddress);
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  return response.json();
}

/**
 * Fetch referral stats from backend
 */
async function fetchReferralStats(walletAddress: string): Promise<ReferralStats> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/users/${encodeURIComponent(walletAddress)}/referrals`
  );

  if (!response.ok) {
    if (response.status === 404) {
      // Return empty referral stats for 404
      return createEmptyReferralStats(walletAddress);
    }
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch referral stats');
  }

  return response.json();
}

/**
 * Create empty user profile for new users
 */
function createEmptyUserProfile(walletAddress: string): User {
  return {
    id: 0,
    telegram_user_id: null,
    telegram_username: '',
    wallet_address: walletAddress,
    total_games_played: 0,
    total_wins: 0,
    total_losses: 0,
    total_referrals: 0,
    total_referral_earnings: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Create empty referral stats for new users
 */
function createEmptyReferralStats(walletAddress: string): ReferralStats {
  return {
    wallet_address: walletAddress,
    total_referrals: 0,
    total_referral_earnings: 0,
    games_referred: 0,
  };
}

/**
 * Composable for fetching and managing user profile data
 * @param walletAddress - Reactive ref to the wallet address (null when not connected)
 */
export function useUserProfile(walletAddress: Ref<string | null>) {
  // Query for user profile
  const profileQuery = useQuery({
    queryKey: ['user', 'profile', walletAddress],
    queryFn: () => {
      if (!walletAddress.value) {
        throw new Error('Wallet not connected');
      }
      return fetchUserProfile(walletAddress.value);
    },
    enabled: computed(() => !!walletAddress.value),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  // Query for referral stats
  const referralQuery = useQuery({
    queryKey: ['user', 'referrals', walletAddress],
    queryFn: () => {
      if (!walletAddress.value) {
        throw new Error('Wallet not connected');
      }
      return fetchReferralStats(walletAddress.value);
    },
    enabled: computed(() => !!walletAddress.value),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  // Computed user stats
  const stats: ComputedRef<UserStats | null> = computed(() => {
    if (!profileQuery.data.value) return null;
    return computeUserStats(profileQuery.data.value);
  });

  // Computed formatted values
  const formattedEarnings = computed(() => {
    if (!stats.value) return '0.00 TON';
    return formatTON(stats.value.totalEarnings);
  });

  const formattedReferralEarnings = computed(() => {
    if (!referralQuery.data.value) return '0.00 TON';
    return formatTON(referralQuery.data.value.total_referral_earnings);
  });

  // Check if user is new (no games played)
  const isNewUser = computed(() => {
    return !profileQuery.data.value || profileQuery.data.value.total_games_played === 0;
  });

  // Check if user has any referrals
  const hasReferrals = computed(() => {
    return Boolean(referralQuery.data.value && referralQuery.data.value.total_referrals > 0);
  });

  return {
    // Profile data
    profile: profileQuery.data,
    stats,
    isNewUser,

    // Referral data
    referralStats: referralQuery.data,
    hasReferrals,

    // Formatted values
    formattedEarnings,
    formattedReferralEarnings,

    // Query states
    isLoading: computed(() => profileQuery.isLoading.value || referralQuery.isLoading.value),
    isError: computed(() => profileQuery.isError.value || referralQuery.isError.value),
    error: computed(() => profileQuery.error.value || referralQuery.error.value),

    // Refetch functions
    refetch: () => {
      profileQuery.refetch();
      referralQuery.refetch();
    },
    refetchProfile: () => profileQuery.refetch(),
    refetchReferrals: () => referralQuery.refetch(),
  };
}
