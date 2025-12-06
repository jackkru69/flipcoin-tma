<script setup lang="ts">
import { useBackButton } from '@/composables/useBackButton';
import HealthBanner from '@/components/HealthBanner.vue';

useBackButton();
</script>

<template>
  <HealthBanner />
  <RouterView />
</template>
