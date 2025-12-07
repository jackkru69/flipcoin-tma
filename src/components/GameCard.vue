<template>
  <div class="game-card" :class="[statusClass, { 'is-reserved': isReserved && !isReservedByMe }]">
    <div class="card-header">
      <span class="game-id">Игра #{{ game.gameId }}</span>
      <span class="status-badge">{{ statusLabel }}</span>
    </div>

    <!-- Reservation indicator -->
    <div v-if="isReserved" class="reservation-info" :class="{ 'my-reservation': isReservedByMe }">
      <span v-if="isReservedByMe">
        🔒 Забронировано вами ({{ timeRemainingText }})
      </span>
      <span v-else>
        🔒 Забронировано другим игроком
      </span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">Ставка:</span>
        <span class="value">{{ formatTon(game.bidValue) }} TON</span>
      </div>

      <div class="info-row" v-if="game.totalGainings > 0">
        <span class="label">Выигрыш:</span>
        <span class="value highlight">{{ formatTon(game.totalGainings) }} TON</span>
      </div>

      <div class="players">
        <div class="player">
          <span class="player-label">Игрок 1:</span>
          <span class="player-address">{{ shortenAddress(game.playerOne) }}</span>
          <span v-if="game.playerOneChosenSide > 1" class="coin-choice">
            {{ getCoinLabel(game.playerOneChosenSide) }}
          </span>
        </div>

        <div class="player" v-if="!isWaitingForOpponent">
          <span class="player-label">Игрок 2:</span>
          <span class="player-address">{{ shortenAddress(game.playerTwo) }}</span>
          <span v-if="game.playerTwoChosenSide > 1" class="coin-choice">
            {{ getCoinLabel(game.playerTwoChosenSide) }}
          </span>
        </div>
      </div>

      <div class="timestamps">
        <div v-if="game.gameCreatedTimestamp > 0">
          Создана: {{ formatTimestamp(game.gameCreatedTimestamp) }}
        </div>
        <div v-if="game.gameStartedTimestamp > 0">
          Начата: {{ formatTimestamp(game.gameStartedTimestamp) }}
        </div>
      </div>

      <div v-if="isEnded && game.winner" class="winner">
        🏆 Победитель: {{ shortenAddress(game.winner) }}
      </div>
    </div>

    <div class="card-actions">
      <!-- Join button - disabled if reserved by another player (T024.1) -->
      <button
        v-if="canJoin"
        @click="handleJoinClick"
        :disabled="isReserved && !isReservedByMe"
        class="btn-primary"
        :class="{ 'btn-disabled': isReserved && !isReservedByMe }"
      >
        {{ isReservedByMe ? 'Продолжить' : 'Присоединиться' }}
      </button>

      <button
        v-if="canOpenBid"
        @click="$emit('openBid', game.gameId)"
        class="btn-success"
      >
        Раскрыть ставку
      </button>

      <button
        v-if="canCancel"
        @click="$emit('cancel', game.gameId)"
        class="btn-danger"
      >
        Отменить игру
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { Address } from '@ton/core';
import type { GameInfo } from '../types/contract';
import type { Reservation } from '../types/reservation';
import { isReservationActive, getReservationTimeRemaining } from '../types/reservation';
import {
  GAME_STATUS_LABELS,
  COIN_SIDE_LABELS,
  GAME_STATUS_WAITING_FOR_OPPONENT,
  GAME_STATUS_WAITING_FOR_OPEN_BIDS,
  GAME_STATUS_ENDED,
  GAME_STATUS_PAID,
  COIN_SIDE_CLOSED
} from '../types/contract';
import { formatTon, shortenAddress } from '../utils/contract';

interface Props {
  game: GameInfo;
  userAddress?: Address;
  reservation?: Reservation | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  join: [gameId: bigint];
  openBid: [gameId: bigint];
  cancel: [gameId: bigint];
}>();

// Timer for countdown
const timeRemaining = ref(0);
let countdownInterval: ReturnType<typeof setInterval> | null = null;

// Start countdown timer when there's a reservation
onMounted(() => {
  if (props.reservation && isReservationActive(props.reservation)) {
    updateTimeRemaining();
    countdownInterval = setInterval(updateTimeRemaining, 1000);
  }
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

function updateTimeRemaining() {
  if (props.reservation) {
    timeRemaining.value = getReservationTimeRemaining(props.reservation);
    if (timeRemaining.value <= 0 && countdownInterval) {
      clearInterval(countdownInterval);
    }
  }
}

// Reservation computed properties
const isReserved = computed(() => {
  return isReservationActive(props.reservation);
});

const isReservedByMe = computed(() => {
  if (!props.userAddress || !props.reservation) return false;
  if (!isReservationActive(props.reservation)) return false;

  // Normalize addresses for comparison - both to raw format
  try {
    const reservationAddr = Address.parse(props.reservation.wallet_address).toRawString();
    const userAddr = props.userAddress.toRawString();
    return reservationAddr === userAddr;
  } catch {
    // Fallback to string comparison if parsing fails
    return props.reservation.wallet_address === props.userAddress.toString();
  }
});

const timeRemainingText = computed(() => {
  const seconds = timeRemaining.value;
  if (seconds <= 0) return '0с';
  return `${seconds}с`;
});

// Debounce flag to prevent rapid clicks (T024.2)
const isJoinClicked = ref(false);

function handleJoinClick() {
  if (isJoinClicked.value) return;
  isJoinClicked.value = true;

  emit('join', props.game.gameId);

  // Reset after 500ms
  setTimeout(() => {
    isJoinClicked.value = false;
  }, 500);
}

const statusLabel = computed(() => {
  return GAME_STATUS_LABELS[Number(props.game.status)] || 'Неизвестно';
});

const statusClass = computed(() => {
  const status = Number(props.game.status);
  switch (status) {
    case GAME_STATUS_WAITING_FOR_OPPONENT:
      return 'status-waiting';
    case GAME_STATUS_WAITING_FOR_OPEN_BIDS:
      return 'status-active';
    case GAME_STATUS_ENDED:
    case GAME_STATUS_PAID:
      return 'status-ended';
    default:
      return '';
  }
});

const isWaitingForOpponent = computed(() => {
  return Number(props.game.status) === GAME_STATUS_WAITING_FOR_OPPONENT;
});

const isEnded = computed(() => {
  const status = Number(props.game.status);
  return status === GAME_STATUS_ENDED || status === GAME_STATUS_PAID;
});

const canJoin = computed(() => {
  if (!props.userAddress) return false;
  return isWaitingForOpponent.value &&
         props.game.playerOne.toString() !== props.userAddress.toString();
});

const canOpenBid = computed(() => {
  if (!props.userAddress) {
    console.log('[GameCard] No user address - canOpenBid = false');
    return false;
  }

  const status = Number(props.game.status);
  console.log('[GameCard] Game', props.game.gameId, 'status:', status, 'Expected:', GAME_STATUS_WAITING_FOR_OPEN_BIDS);

  // Game must be in WAITING_FOR_OPEN_BIDS status (status 2)
  if (status !== GAME_STATUS_WAITING_FOR_OPEN_BIDS) {
    console.log('[GameCard] Wrong status - canOpenBid = false');
    return false;
  }

  // Check if user is one of the players
  const userAddrStr = props.userAddress.toString();
  const isPlayerOne = props.game.playerOne.toString() === userAddrStr;
  const isPlayerTwo = props.game.playerTwo.toString() === userAddrStr;

  console.log('[GameCard] User check - isPlayerOne:', isPlayerOne, 'isPlayerTwo:', isPlayerTwo);
  console.log('[GameCard] Addresses - P1:', props.game.playerOne.toString(), 'P2:', props.game.playerTwo.toString(), 'User:', userAddrStr);

  if (!isPlayerOne && !isPlayerTwo) {
    console.log('[GameCard] Not a player - canOpenBid = false');
    return false;
  }

  // Check if this player hasn't opened their bid yet
  // COIN_SIDE_CLOSED (1) means bid is not yet revealed
  if (isPlayerOne) {
    const playerOneChoice = Number(props.game.playerOneChosenSide);
    console.log('[GameCard] Player 1 choice:', playerOneChoice, 'CLOSED:', COIN_SIDE_CLOSED, 'canOpenBid:', playerOneChoice === COIN_SIDE_CLOSED);
    return playerOneChoice === COIN_SIDE_CLOSED;
  }
  if (isPlayerTwo) {
    const playerTwoChoice = Number(props.game.playerTwoChosenSide);
    console.log('[GameCard] Player 2 choice:', playerTwoChoice, 'CLOSED:', COIN_SIDE_CLOSED, 'canOpenBid:', playerTwoChoice === COIN_SIDE_CLOSED);
    return playerTwoChoice === COIN_SIDE_CLOSED;
  }

  console.log('[GameCard] Fallback - canOpenBid = false');
  return false;
});

const canCancel = computed(() => {
  if (!props.userAddress) return false;
  return isWaitingForOpponent.value &&
         props.game.playerOne.toString() === props.userAddress.toString();
});

const getCoinLabel = (side: bigint): string => {
  return COIN_SIDE_LABELS[Number(side)] || '';
};

const formatTimestamp = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.game-card {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 1rem;
  padding: 1rem;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.game-card.status-waiting {
  border-color: #ff9800;
}

.game-card.status-active {
  border-color: #4caf50;
}

.game-card.status-ended {
  opacity: 0.7;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.game-id {
  font-weight: bold;
  font-size: 1.1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.card-body {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  color: var(--tg-theme-hint-color, #999);
}

.value {
  font-weight: 600;
}

.value.highlight {
  color: #4caf50;
  font-size: 1.1rem;
}

.players {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
}

.player {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.player:last-child {
  margin-bottom: 0;
}

.player-label {
  font-weight: 600;
  min-width: 70px;
}

.player-address {
  font-family: monospace;
  color: var(--tg-theme-hint-color, #999);
}

.coin-choice {
  padding: 0.125rem 0.5rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  border-radius: 0.5rem;
  font-size: 0.75rem;
}

.timestamps {
  font-size: 0.75rem;
  color: var(--tg-theme-hint-color, #999);
  margin-top: 0.75rem;
}

.timestamps > div {
  margin-bottom: 0.25rem;
}

.winner {
  margin-top: 1rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #000;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.card-actions button:active {
  opacity: 0.7;
}

.btn-primary {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.btn-success {
  background: #4caf50;
  color: #fff;
}

.btn-danger {
  background: #f44336;
  color: #fff;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Reservation styles */
.game-card.is-reserved {
  opacity: 0.8;
  border-color: #9e9e9e;
}

.reservation-info {
  padding: 0.5rem 0.75rem;
  background: rgba(158, 158, 158, 0.2);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--tg-theme-hint-color, #999);
}

.reservation-info.my-reservation {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}
</style>
