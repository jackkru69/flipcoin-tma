<template>
  <div class="pod-page">
    <div class="header">
      <h1>🪙 Pod Game</h1>
      <div class="wallet-info" v-if="wallet">
        <span class="wallet-address">{{ shortenAddress(Address.parse(wallet)) }}</span>
        <button @click="goToProfile" class="btn-profile" title="Профиль">
          👤
        </button>
        <button @click="showExportSeedModal = true" class="btn-export" title="Экспорт seed-фразы">
          🔑
        </button>
        <button @click="disconnect" class="btn-disconnect">Отключить</button>
      </div>
      <button v-else @click="connect" class="btn-connect">
        Подключить кошелек
      </button>
    </div>

    <div class="actions" v-if="wallet">
      <button
        @click="showCreateModal = true"
        class="btn-create"
        :disabled="shouldDisableActions"
        :title="shouldDisableActions ? 'Сервис временно недоступен' : ''"
      >
        + Создать новую игру
      </button>
      <button @click="refreshGames" class="btn-refresh" :disabled="loading">
        🔄 Обновить
      </button>
    </div>

    <GameList
      :games="games"
      :loading="loading"
      :loading-more="loadingMore"
      :error="error"
      :stats="stats"
      :user-address="wallet ? Address.parse(wallet) : undefined"
      :has-more="hasMore"
      :reservations="reservations"
      @join="handleJoinGame"
      @open-bid="handleOpenBid"
      @cancel="handleCancelGame"
      @load-more="loadMore"
      @status-change="handleStatusChange"
    />

    <!-- Create Game Modal -->
    <Teleport to="body">
      <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Создать новую игру</h3>
            <button @click="showCreateModal = false" class="btn-close">×</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Выберите сторону:</label>
              <div class="coin-buttons">
                <button
                  :class="{ active: newGame.coinSide === COIN_SIDE_HEADS }"
                  @click="newGame.coinSide = COIN_SIDE_HEADS"
                >
                  🦅 Орёл
                </button>
                <button
                  :class="{ active: newGame.coinSide === COIN_SIDE_TAILS }"
                  @click="newGame.coinSide = COIN_SIDE_TAILS"
                >
                  🔰 Решка
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Ставка (TON):</label>
              <input
                v-model="newGame.bidValue"
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                placeholder="Введите сумму"
              />
              <div class="hint" v-if="config && config.lowestBid && config.highestBid">
                Минимум: {{ formatTon(config.lowestBid) }} TON,
                Максимум: {{ formatTon(config.highestBid) }} TON
              </div>
              <div class="hint info-hint" style="margin-top: 0.5rem; color: #4a9eff;">
                💡 Общая сумма = ставка + 0.25 TON (комиссии сети и развертывание контракта)
              </div>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" v-model="newGame.hasReferrer" />
                У меня есть реферальный код
              </label>
              <input
                v-if="newGame.hasReferrer"
                v-model="newGame.referrerAddress"
                type="text"
                placeholder="Адрес реферера"
              />
            </div>

            <div class="total-cost" v-if="newGame.bidValue">
              Общая стоимость:
              <strong>{{ formatTon(calculateCreateGameValue(newGame.bidValue)) }} TON</strong>
              <div class="hint">
                = {{ newGame.bidValue }} TON (ставка)<br>
                + 0.15 TON (развертывание контракта)<br>
                + 0.05 TON (резерв фабрики)<br>
                + 0.05 TON (газ)
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showCreateModal = false" class="btn-secondary">
              Отмена
            </button>
            <button
              @click="handleCreateGame"
              class="btn-primary"
              :disabled="!canCreateGame || creating"
            >
              {{ creating ? 'Создание...' : 'Создать игру' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Join Game Modal -->
    <Teleport to="body">
      <div v-if="showJoinModal" class="modal-overlay" @click.self="closeJoinModal">
        <div class="modal">
          <div class="modal-header">
            <h3>Присоединиться к игре #{{ joinGameData?.gameId }}</h3>
            <button @click="closeJoinModal" class="btn-close">×</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Выберите сторону:</label>
              <div class="coin-buttons">
                <button
                  :class="{ active: joinGame.coinSide === COIN_SIDE_HEADS }"
                  @click="joinGame.coinSide = COIN_SIDE_HEADS"
                >
                  🦅 Орёл
                </button>
                <button
                  :class="{ active: joinGame.coinSide === COIN_SIDE_TAILS }"
                  @click="joinGame.coinSide = COIN_SIDE_TAILS"
                >
                  🔰 Решка
                </button>
              </div>
            </div>

            <div class="game-info" v-if="joinGameData">
              <div>Ставка: <strong>{{ formatTon(joinGameData.bidValue) }} TON</strong></div>
              <div>Создатель: {{ shortenAddress(joinGameData.playerOne) }}</div>
            </div>

            <div class="form-group">
              <label>
                <input type="checkbox" v-model="joinGame.hasReferrer" />
                У меня есть реферальный код
              </label>
              <input
                v-if="joinGame.hasReferrer"
                v-model="joinGame.referrerAddress"
                type="text"
                placeholder="Адрес реферера"
              />
            </div>

            <div class="total-cost" v-if="joinGameData">
              Общая стоимость:
              <strong>{{ formatTon(calculateJoinGameValue(joinGameData.bidValue)) }} TON</strong>
              <div class="hint">
                = {{ formatTon(joinGameData.bidValue) }} TON (ставка)<br>
                + 0.05 TON (резерв фабрики)<br>
                + 0.05 TON (газ)
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="closeJoinModal" class="btn-secondary">
              Отмена
            </button>
            <button
              @click="confirmJoinGame"
              class="btn-primary"
              :disabled="!canJoinGame || joining"
            >
              {{ joining ? 'Присоединение...' : 'Присоединиться' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Open Bid Modal -->
    <Teleport to="body">
      <div v-if="showOpenBidModal" class="modal-overlay" @click.self="showOpenBidModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>Раскрыть ставку в игре #{{ openBidGameId }}</h3>
            <button @click="showOpenBidModal = false" class="btn-close">×</button>
          </div>

          <div class="modal-body">
            <p>Ваша ставка будет автоматически раскрыта с использованием вашего кошелька.</p>
            <div class="hint">
              Система автоматически определит какую сторону вы выбрали при создании/присоединении к игре.
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showOpenBidModal = false" class="btn-secondary">
              Отмена
            </button>
            <button
              @click="confirmOpenBid"
              class="btn-primary"
              :disabled="openingBid"
            >
              {{ openingBid ? 'Раскрытие...' : 'Раскрыть ставку' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Export Seed Phrase Modal -->
    <Teleport to="body">
      <div v-if="showExportSeedModal" class="modal-overlay" @click.self="showExportSeedModal = false">
        <div class="modal modal-seed">
          <div class="modal-header">
            <h3>🔑 Экспорт seed-фразы</h3>
            <button @click="showExportSeedModal = false" class="btn-close">×</button>
          </div>

          <div class="modal-body">
            <div class="warning-box">
              <div class="warning-icon">⚠️</div>
              <div class="warning-text">
                <strong>Важно!</strong> Никогда не делитесь своей seed-фразой с кем-либо.
                Любой, у кого есть эта фраза, может получить доступ к вашим играм и средствам.
              </div>
            </div>

            <div v-if="userSeedPhrase" class="seed-phrase-container">
              <div class="seed-phrase-grid">
                <div
                  v-for="(word, index) in userSeedPhrase"
                  :key="index"
                  class="seed-word"
                >
                  <span class="word-number">{{ index + 1 }}.</span>
                  <span class="word-text">{{ word }}</span>
                </div>
              </div>

              <button @click="copySeedPhrase" class="btn-copy">
                {{ seedCopied ? '✓ Скопировано' : '📋 Скопировать фразу' }}
              </button>
            </div>

            <div v-else class="no-seed">
              Seed-фраза не найдена. Пожалуйста, перезагрузите приложение.
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showExportSeedModal = false" class="btn-primary">
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Address, toNano } from '@ton/core';
import { useTonConnectUI } from '../tonconnect/useTonConnectUI';
import { useTonWallet } from '../tonconnect/useTonWallet';
import GameList from '../components/GameList.vue';
import { usePODContract } from '../composables/usePODContract';
import { useGamesAPI } from '../composables/useGamesAPI';
import { useReservation } from '../composables/useReservation';
import { useHealthCheck } from '../composables/useHealthCheck';
import {
  generateSeedPhrase,
  getSignatureFromSeed,
  generateSecretKey,
  formatTon,
  shortenAddress,
  calculateCreateGameValue,
  calculateJoinGameValue,
  createTonConnectSender,
} from '../utils/contract';
import { COIN_SIDE_HEADS, COIN_SIDE_TAILS, GAME_STATUS_WAITING_FOR_OPPONENT, type GameInfo } from '../types/contract';
import { PODGameFactory } from '../wrappers/PODGameFactory_PODGameFactory';
import { Game } from '../wrappers/PODGameFactory_Game';
import { createTonClient } from '@/lib/tonClient';

const factoryAddress = import.meta.env.VITE_POD_FACTORY_ADDRESS;

if (!factoryAddress) {
  console.error('Factory address not configured! Add VITE_POD_FACTORY_ADDRESS to .env');
}

// Reactive status filter for games - allows switching between "waiting for opponent" and "waiting for reveal"
const gameStatusFilter = ref<number | null>(GAME_STATUS_WAITING_FOR_OPPONENT);

// Use API for games list with reservation status
const {
  games,
  reservations,
  isLoading: apiLoading,
  isGameReserved,
  isReservedByWallet,
  refetch: refetchGames,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  error: gamesError,
} = useGamesAPI(gameStatusFilter);

// Use contract for stats and config (needed for creating games)
// NOTE: Don't destructure 'games' from usePODContract - we use games from useGamesAPI instead
const {
  stats,
  config,
  loadGames: loadContractData,
} = usePODContract(factoryAddress);

// Computed properties for template compatibility
const loading = computed(() => apiLoading.value);
const loadingMore = computed(() => isFetchingNextPage.value);
const error = computed(() => gamesError.value ? String(gamesError.value) : null);
const hasMore = computed(() => hasNextPage.value ?? false);

// Functions for compatibility
function loadMore() {
  fetchNextPage();
}

function refreshGames() {
  refetchGames();
  loadContractData(); // Also refresh stats/config
}

function handleStatusChange(status: number | null) {
  gameStatusFilter.value = status;
}

const { tonConnectUI } = useTonConnectUI();
const { wallet: tonWallet } = useTonWallet();
const wallet = computed(() => tonWallet.value?.account.address);

// Reservation composable (for reserve/cancel actions)
const {
  reserveGame,
  cancelReservation,
  error: reservationError,
} = useReservation();

// Health check for graceful degradation
const { shouldDisableActions } = useHealthCheck();

// Storage for user's seed phrase (in production, use secure storage)
const userSeedPhrase = ref<string[] | null>(null);

// Initialize or load seed phrase
onMounted(async () => {
  if (factoryAddress) {
    loadContractData(); // Load stats and config from contract
    // Games are automatically fetched by useGamesAPI
  }

  // Try to load seed phrase from localStorage
  const stored = localStorage.getItem('pod_seed');
  if (stored) {
    try {
      userSeedPhrase.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load seed phrase:', e);
    }
  }

  // Generate new seed phrase if not exists
  if (!userSeedPhrase.value) {
    userSeedPhrase.value = await generateSeedPhrase();
    localStorage.setItem('pod_seed', JSON.stringify(userSeedPhrase.value));
    console.log('Generated new seed phrase:', userSeedPhrase.value.join(' '));
  }

  // Handle page unload/visibility change to cancel reservations (T039)
  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'hidden' && wallet.value && joinGameData.value) {
      // Cancel reservation when page becomes hidden (user switches tab/minimizes)
      const gameIdNum = Number(joinGameData.value.gameId);
      if (isReservedByWallet(gameIdNum, wallet.value)) {
        await cancelReservation(gameIdNum, wallet.value);
        joinGameData.value = null;
        showJoinModal.value = false;
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Also handle beforeunload for page close/refresh
  const handleBeforeUnload = () => {
    if (wallet.value && joinGameData.value) {
      const gameIdNum = Number(joinGameData.value.gameId);
      if (isReservedByWallet(gameIdNum, wallet.value)) {
        // Use sendBeacon for reliable cancellation on page unload
        const url = `/api/v1/games/${gameIdNum}/reserve`;
        navigator.sendBeacon(url, JSON.stringify({ wallet: wallet.value }));
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
});



// Create game modal
const showCreateModal = ref(false);
const creating = ref(false);
const newGame = ref({
  coinSide: COIN_SIDE_HEADS,
  bidValue: '0.1',
  hasReferrer: false,
  referrerAddress: '',
  key: BigInt(0),
});

const canCreateGame = computed(() => {
  const bidValue = parseFloat(newGame.value.bidValue);
  if (!bidValue || bidValue <= 0) return false;
  if (!config.value || !config.value.lowestBid || !config.value.highestBid) return false;
  const bid = toNano(newGame.value.bidValue);
  return bid >= config.value.lowestBid && bid <= config.value.highestBid;
});

// Join game modal
const showJoinModal = ref(false);
const joining = ref(false);
const joinGameData = ref<GameInfo | null>(null);
const joinGame = ref({
  coinSide: COIN_SIDE_HEADS,
  hasReferrer: false,
  referrerAddress: '',
  key: BigInt(0),
});

const canJoinGame = computed(() => {
  return joinGame.value.coinSide > 0;
});

// Open bid modal
const showOpenBidModal = ref(false);
const openingBid = ref(false);
const openBidGameId = ref<bigint>(BigInt(0));

// Export seed phrase modal
const showExportSeedModal = ref(false);
const seedCopied = ref(false);

async function connect() {
  if (tonConnectUI.connected) {
    console.warn('Wallet is already connected');
    return;
  }
  await tonConnectUI.openModal();
}

async function disconnect() {
  await tonConnectUI.disconnect();
}

const router = useRouter();

function goToProfile() {
  router.push('/profile');
}

async function copySeedPhrase() {
  if (!userSeedPhrase.value) return;

  try {
    const seedText = userSeedPhrase.value.join(' ');
    await navigator.clipboard.writeText(seedText);
    seedCopied.value = true;

    // Reset the copied state after 3 seconds
    setTimeout(() => {
      seedCopied.value = false;
    }, 3000);
  } catch (error) {
    console.error('Failed to copy seed phrase:', error);
    alert('Не удалось скопировать seed-фразу');
  }
}

async function handleCreateGame() {
  if (!wallet.value || !canCreateGame.value || !userSeedPhrase.value) return;

  creating.value = true;
  try {
    // Get next game ID (approximate)
    const nextGameId = stats.value ? stats.value.totalGamesCreated + BigInt(1) : BigInt(1);

    // Generate signature from seed phrase
    const signature = getSignatureFromSeed(nextGameId, userSeedPhrase.value);

    // Store signature as key (for opening bid later)
    newGame.value.key = signature;

    // Generate secret key (hash of coinSide + signature + playerAddress)
    const secret = generateSecretKey(
      BigInt(newGame.value.coinSide),
      signature,
      Address.parse(wallet.value)
    );

    // Prepare referrer address
    const referrerAddress = newGame.value.hasReferrer && newGame.value.referrerAddress
      ? Address.parse(newGame.value.referrerAddress)
      : null;

    // Get TonClient and open factory contract
    const client = await createTonClient();
    const factory = client.open(
      PODGameFactory.fromAddress(Address.parse(factoryAddress))
    );

    // Create sender
    const sender = createTonConnectSender(tonConnectUI);

    // Calculate total value needed
    const totalValue = calculateCreateGameValue(newGame.value.bidValue);
    console.log('Creating game with:', {
      bidValue: newGame.value.bidValue,
      totalValue: totalValue.toString(),
      totalValueTON: formatTon(totalValue),
    });

    // Send CreateGameMsg through wrapper
    await factory.send(
      sender,
      {
        value: totalValue,
        bounce: true,
      },
      {
        $$type: 'CreateGameMsg',
        bidValue: toNano(newGame.value.bidValue),
        secret: secret,
        referrer: referrerAddress,
      }
    );

    alert('Игра создана! Теперь ждите, когда другой игрок присоединится.');

    showCreateModal.value = false;

    // Wait a bit for the transaction to be processed, then refresh
    setTimeout(() => refreshGames(), 3000);
  } catch (e) {
    console.error('Failed to create game:', e);
    alert('Ошибка при создании игры: ' + (e instanceof Error ? e.message : 'Unknown error'));
  } finally {
    creating.value = false;
  }
}

async function handleJoinGame(gameId: bigint) {
  const game = games.value.find(g => g.gameId === gameId);
  if (!game || !wallet.value) return;

  // Check if game is already reserved by someone else
  const gameIdNum = Number(gameId);
  if (isGameReserved(gameIdNum) && !isReservedByWallet(gameIdNum, wallet.value)) {
    alert('Эта игра уже забронирована другим игроком');
    return;
  }

  // Try to reserve the game first (T025)
  if (!isReservedByWallet(gameIdNum, wallet.value)) {
    const reservation = await reserveGame(gameIdNum, wallet.value);
    if (!reservation) {
      // Show error from reservation
      if (reservationError.value) {
        alert(reservationError.value);
      }
      return;
    }
  }

  joinGameData.value = game;
  showJoinModal.value = true;
}

// Close join modal and cancel reservation if exists (T025)
async function closeJoinModal() {
  if (joinGameData.value && wallet.value) {
    const gameIdNum = Number(joinGameData.value.gameId);
    if (isReservedByWallet(gameIdNum, wallet.value)) {
      await cancelReservation(gameIdNum, wallet.value);
    }
  }
  joinGameData.value = null;
  showJoinModal.value = false;
}

async function confirmJoinGame() {
  if (!wallet.value || !joinGameData.value || !canJoinGame.value || !userSeedPhrase.value) return;

  joining.value = true;
  try {
    // Generate signature from seed phrase
    const signature = getSignatureFromSeed(joinGameData.value.gameId, userSeedPhrase.value);

    // Store signature as key (for opening bid later)
    joinGame.value.key = signature;

    // Generate secret key (hash of coinSide + signature + playerAddress)
    const secret = generateSecretKey(
      BigInt(joinGame.value.coinSide),
      signature,
      Address.parse(wallet.value)
    );

    // Prepare referrer address
    const referrerAddress = joinGame.value.hasReferrer && joinGame.value.referrerAddress
      ? Address.parse(joinGame.value.referrerAddress)
      : null;

    // Get TonClient and open factory contract
    const client = await createTonClient();
    const factory = client.open(
      PODGameFactory.fromAddress(Address.parse(factoryAddress))
    );

    // Create sender
    const sender = createTonConnectSender(tonConnectUI);

    // Calculate total value needed
    const totalValue = calculateJoinGameValue(joinGameData.value.bidValue);
    console.log('Joining game with:', {
      gameId: joinGameData.value.gameId.toString(),
      bidValue: joinGameData.value.bidValue.toString(),
      totalValue: totalValue.toString(),
      totalValueTON: formatTon(totalValue),
    });

    // Send ForwardJoinGameMsg through wrapper
    await factory.send(
      sender,
      {
        value: totalValue,
        bounce: true,
      },
      {
        $$type: 'ForwardJoinGameMsg',
        gameId: joinGameData.value.gameId,
        bidValue: joinGameData.value.bidValue,
        secret: secret,
        referrer: referrerAddress,
      }
    );

    alert('Вы присоединились к игре! Ожидайте завершения игры.');

    showJoinModal.value = false;

    // Wait a bit for the transaction to be processed, then refresh
    setTimeout(() => refreshGames(), 3000);
  } catch (e) {
    console.error('Failed to join game:', e);
    alert('Ошибка при присоединении: ' + (e instanceof Error ? e.message : 'Unknown error'));
  } finally {
    joining.value = false;
  }
}

async function handleOpenBid(gameId: bigint) {
  openBidGameId.value = gameId;
  showOpenBidModal.value = true;
}

async function confirmOpenBid() {
  if (!wallet.value || !userSeedPhrase.value) return;

  openingBid.value = true;
  try {
    // Get TonClient
    const client = await createTonClient();

    // Get factory and calculate game address
    const factory = client.open(
      PODGameFactory.fromAddress(Address.parse(factoryAddress))
    );
    const gameAddress = await factory.getCalculateGameAddress(openBidGameId.value);

    // Open game contract
    const game = client.open(Game.fromAddress(gameAddress));

    // Create sender
    const sender = createTonConnectSender(tonConnectUI);

    // Try both coin sides - the contract will accept the correct one
    // Generate signatures for both HEADS and TAILS from seed phrase

    // Try HEADS first
    try {
      const signatureHeads = getSignatureFromSeed(openBidGameId.value, userSeedPhrase.value);

      await game.send(
        sender,
        {
          value: toNano('0.1'), // 0.1 TON for gas
          bounce: true,
        },
        {
          $$type: 'OpenBidMsg',
          key: signatureHeads,
        }
      );

      alert('Ставка раскрыта!');
      showOpenBidModal.value = false;
      setTimeout(() => refreshGames(), 3000);
      return;
    } catch (headsError) {
      console.log('HEADS failed, trying TAILS...', headsError);

      // Since signature is the same for both sides (based on gameId + seed),
      // and the secret was generated as hash(coinSide + signature),
      // we need to try sending with the same signature
      // The contract will validate against the stored secret

      // Actually, with seed-based approach, we use the same signature
      // The contract checks hash(HEADS, signature, player) and hash(TAILS, signature, player)
      const signatureTails = getSignatureFromSeed(openBidGameId.value, userSeedPhrase.value);

      await game.send(
        sender,
        {
          value: toNano('0.1'), // 0.1 TON for gas
          bounce: true,
        },
        {
          $$type: 'OpenBidMsg',
          key: signatureTails,
        }
      );

      alert('Ставка раскрыта!');
      showOpenBidModal.value = false;
      setTimeout(() => refreshGames(), 3000);
    }
  } catch (e) {
    console.error('Failed to open bid:', e);
    alert('Ошибка при раскрытии ставки: ' + (e instanceof Error ? e.message : 'Unknown error'));
  } finally {
    openingBid.value = false;
  }
}

async function handleCancelGame(gameId: bigint) {
  if (!confirm('Вы уверены, что хотите отменить игру?')) return;

  try {
    // Get TonClient
    const client = await createTonClient();

    // Get factory and calculate game address
    const factory = client.open(
      PODGameFactory.fromAddress(Address.parse(factoryAddress))
    );
    const gameAddress = await factory.getCalculateGameAddress(gameId);

    // Open game contract
    const game = client.open(Game.fromAddress(gameAddress));

    // Create sender
    const sender = createTonConnectSender(tonConnectUI);

    // Send CancelGameMsg through wrapper
    await game.send(
      sender,
      {
        value: toNano('0.05'), // Small amount for gas
        bounce: true,
      },
      {
        $$type: 'CancelGameMsg',
        gameId: gameId,
      }
    );

    alert('Игра отменена');

    // Wait a bit for the transaction to be processed, then refresh
    setTimeout(() => refreshGames(), 3000);
  } catch (e) {
    console.error('Failed to cancel game:', e);
    alert('Ошибка при отмене игры: ' + (e instanceof Error ? e.message : 'Unknown error'));
  }
}
</script>

<style scoped>
.pod-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  margin: 0;
  font-size: 2rem;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wallet-address {
  font-family: monospace;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
}

.btn-export {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  background: #ff9800;
  transition: opacity 0.2s;
}

.btn-export:hover {
  opacity: 0.8;
}

.btn-profile {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem;
  background: var(--tg-theme-button-color, #2481cc);
  transition: opacity 0.2s;
}

.btn-profile:hover {
  opacity: 0.8;
}

.btn-connect,
.btn-disconnect {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-connect {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.btn-disconnect {
  background: #f44336;
  color: #fff;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-create,
.btn-refresh {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-create {
  background: #4caf50;
  color: #fff;
}

.btn-refresh {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: var(--tg-theme-bg-color, #fff);
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--tg-theme-hint-color, #999);
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-group input[type="checkbox"] {
  margin-right: 0.5rem;
}

.coin-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.coin-buttons button {
  padding: 1rem;
  border: 2px solid var(--tg-theme-button-color, #2481cc);
  background: transparent;
  color: var(--tg-theme-text-color, #000);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
}

.coin-buttons button.active {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--tg-theme-hint-color, #999);
}

.total-cost {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  text-align: center;
}

.total-cost strong {
  font-size: 1.25rem;
  color: #4caf50;
}

.game-info {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.game-info > div {
  margin-bottom: 0.5rem;
}

.game-info > div:last-child {
  margin-bottom: 0;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-primary {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  border: 1px solid var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-color, #2481cc);
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .wallet-info {
    flex-direction: column;
  }

  .actions {
    flex-direction: column;
  }
}

/* Export Seed Modal Styles */
.modal-seed {
  max-width: 600px;
}

.warning-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border: 2px solid #ffc107;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.warning-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.warning-text {
  line-height: 1.5;
}

.warning-text strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #856404;
}

.seed-phrase-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seed-phrase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 0.5rem;
  border: 2px dashed rgba(0, 0, 0, 0.2);
}

.seed-word {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--tg-theme-bg-color, #fff);
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.word-number {
  color: var(--tg-theme-hint-color, #999);
  min-width: 1.5rem;
}

.word-text {
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
}

.btn-copy {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  transition: all 0.2s;
}

.btn-copy:hover {
  opacity: 0.8;
}

.no-seed {
  padding: 2rem;
  text-align: center;
  color: var(--tg-theme-hint-color, #999);
}

@media (max-width: 640px) {
  .seed-phrase-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>
