/**
 * WebSocket service for real-time game updates
 * @module services/websocket
 *
 * Implements:
 * - Native WebSocket with custom reconnection logic
 * - Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s (5 retries max)
 * - Client ID persistence for session continuity (FR-011)
 * - Telegram Mini App initData authentication
 */

import type {
  WebSocketState,
  WSMessage,
  ClientMessage,
} from '../types/websocket';

// Configuration
const WS_BASE_URL = import.meta.env.VITE_BACKEND_WS_URL || 'ws://localhost:8090';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds
const CLIENT_ID_STORAGE_KEY = 'pod_ws_client_id';

/**
 * Generate a unique client ID
 */
function generateClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Get or create persistent client ID (FR-011)
 */
function getOrCreateClientId(): string {
  try {
    let clientId = localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (!clientId) {
      clientId = generateClientId();
      localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId);
    }
    return clientId;
  } catch {
    // localStorage not available (e.g., private browsing)
    return generateClientId();
  }
}

/**
 * Event handler types
 */
export type MessageHandler = (message: WSMessage) => void;
export type StateChangeHandler = (state: WebSocketState) => void;

/**
 * WebSocket service class for managing game connections
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  private gameId: number | null = null; // null = global subscription, number = specific game
  private initData: string = '';
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private stateHandlers: Set<StateChangeHandler> = new Set();
  private clientId: string;

  private state: WebSocketState = {
    status: 'disconnected',
    gameId: null,
    clientId: null,
    lastConnectedAt: null,
    reconnectAttempts: 0,
    error: null,
  };

  constructor() {
    this.clientId = getOrCreateClientId();
    this.state.clientId = this.clientId;
  }

  /**
   * Get current connection state
   */
  getState(): Readonly<WebSocketState> {
    return { ...this.state };
  }

  /**
   * Connect to a game's WebSocket endpoint or global endpoint
   * @param gameId - The game ID to connect to, or null/0 for global subscription
   * @param initData - Telegram Mini App initData for authentication
   */
  connect(gameId: number | null, initData: string): void {
    // Clean up any existing connection
    this.disconnect();

    this.gameId = gameId;
    this.initData = initData;
    this.reconnectAttempts = 0;

    this.updateState({
      status: 'connecting',
      gameId,
      error: null,
    });

    this.createConnection();
  }

  /**
   * Connect to global WebSocket for all game updates
   * @param initData - Telegram Mini App initData for authentication
   */
  connectGlobal(initData: string = ''): void {
    this.connect(null, initData);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.clearReconnectTimeout();

    if (this.ws) {
      // Remove listeners to prevent reconnection attempts
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws.close();
      this.ws = null;
    }

    this.gameId = null;
    this.initData = '';
    this.reconnectAttempts = 0;

    this.updateState({
      status: 'disconnected',
      gameId: null,
      error: null,
    });
  }

  /**
   * Send a message to the server
   */
  send(message: ClientMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] Cannot send - connection not open');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('[WebSocket] Send error:', error);
      return false;
    }
  }

  /**
   * Send sync request after reconnection
   */
  sendSyncRequest(lastEventTimestamp?: string): boolean {
    return this.send({
      type: 'sync_request',
      last_event_timestamp: lastEventTimestamp,
    });
  }

  /**
   * Register a message handler
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Register a state change handler
   */
  onStateChange(handler: StateChangeHandler): () => void {
    this.stateHandlers.add(handler);
    // Immediately call with current state
    handler(this.getState());
    return () => this.stateHandlers.delete(handler);
  }

  /**
   * Create WebSocket connection
   */
  private createConnection(): void {
    const url = this.buildConnectionUrl();
    console.log(`[WebSocket] Connecting to ${url}`);

    try {
      this.ws = new WebSocket(url);
      this.setupEventHandlers();
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
      this.handleConnectionError(error);
    }
  }

  /**
   * Build WebSocket URL with authentication
   * Supports both global (/ws/games) and per-game (/ws/games/:id) endpoints
   */
  private buildConnectionUrl(): string {
    const params = new URLSearchParams();
    if (this.initData) {
      params.set('initData', this.initData);
    }
    params.set('clientId', this.clientId);

    // Normalize base URL - remove trailing /ws if present to avoid duplication
    const baseUrl = WS_BASE_URL.replace(/\/ws\/?$/, '');
    
    // Global subscription (gameId is null or 0)
    if (!this.gameId) {
      return `${baseUrl}/ws/games?${params.toString()}`;
    }
    
    // Per-game subscription
    return `${baseUrl}/ws/games/${this.gameId}?${params.toString()}`;
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('[WebSocket] Connected');
      this.reconnectAttempts = 0;

      this.updateState({
        status: 'connected',
        lastConnectedAt: new Date(),
        reconnectAttempts: 0,
        error: null,
      });

      // Send sync request if this was a reconnection
      if (this.state.lastConnectedAt) {
        this.sendSyncRequest();
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WSMessage;
        this.notifyMessageHandlers(message);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log(`[WebSocket] Closed: code=${event.code}, reason=${event.reason}`);
      this.handleDisconnect(event);
    };

    this.ws.onerror = (error) => {
      console.error('[WebSocket] Error:', error);
      this.handleConnectionError(error);
    };
  }

  /**
   * Handle WebSocket disconnect
   */
  private handleDisconnect(event: CloseEvent): void {
    this.ws = null;

    // Don't reconnect if explicitly disconnected (code 1000)
    // For global connections, gameId is null, so we check if we were connected
    if (event.code === 1000) {
      this.updateState({
        status: 'disconnected',
        error: null,
      });
      return;
    }

    // Attempt reconnection for both global and per-game connections
    // For global: gameId is null, for per-game: gameId is set
    if (this.state.status !== 'disconnected') {
      this.attemptReconnect();
    }
  }

  /**
   * Handle connection error
   */
  private handleConnectionError(error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Connection error';

    this.updateState({
      error: errorMessage,
    });

    // Attempt reconnection if we're in connecting/reconnecting state
    if (this.state.status === 'connecting' || this.state.status === 'reconnecting') {
      this.attemptReconnect();
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   * Timing: 1s, 2s, 4s, 8s, 16s, max 30s (5 retries)
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('[WebSocket] Max reconnection attempts reached');
      this.updateState({
        status: 'failed',
        error: 'Failed to reconnect after maximum attempts',
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1),
      MAX_RECONNECT_DELAY
    );

    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);

    this.updateState({
      status: 'reconnecting',
      reconnectAttempts: this.reconnectAttempts,
    });

    this.reconnectTimeout = setTimeout(() => {
      this.createConnection();
    }, delay);
  }

  /**
   * Clear reconnection timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Update internal state and notify handlers
   */
  private updateState(partial: Partial<WebSocketState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyStateHandlers();
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: WSMessage): void {
    for (const handler of this.messageHandlers) {
      try {
        handler(message);
      } catch (error) {
        console.error('[WebSocket] Message handler error:', error);
      }
    }
  }

  /**
   * Notify all state handlers
   */
  private notifyStateHandlers(): void {
    const stateCopy = this.getState();
    for (const handler of this.stateHandlers) {
      try {
        handler(stateCopy);
      } catch (error) {
        console.error('[WebSocket] State handler error:', error);
      }
    }
  }
}

/**
 * Singleton instance for global access
 */
let serviceInstance: WebSocketService | null = null;

/**
 * Get or create the WebSocket service singleton
 */
export function getWebSocketService(): WebSocketService {
  if (!serviceInstance) {
    serviceInstance = new WebSocketService();
  }
  return serviceInstance;
}

/**
 * Reset the WebSocket service (for testing)
 */
export function resetWebSocketService(): void {
  if (serviceInstance) {
    serviceInstance.disconnect();
    serviceInstance = null;
  }
}
