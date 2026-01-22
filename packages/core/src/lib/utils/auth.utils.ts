import { ResolvedSdkConfig } from '../configs/sdk.config.js';
import { SdkState } from '../types/sdk.state.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';

/**
 * Clears all authentication and session-related storage.
 * This includes access token, refresh token, and optionally cart token and nonce.
 *
 * @param config - The resolved SDK configuration
 * @param state - The SDK state to update
 * @param events - The event bus to emit auth change events
 */
export const clearAuthSession = async (
  config: ResolvedSdkConfig,
  state: SdkState,
  events: EventBus<SdkEvent>
): Promise<void> => {
  // Clear access and refresh tokens
  const accessTokenStorage = config.auth?.accessToken?.storage;
  const refreshTokenStorage = config.auth?.refreshToken?.storage;

  if (accessTokenStorage) {
    await accessTokenStorage.clear();
  }
  if (refreshTokenStorage) {
    await refreshTokenStorage.clear();
  }

  // Clear session data (cart token and nonce) if configured (default: true)
  if (config.auth?.clearSessionOnAuthChange !== false) {
    const cartTokenStorage = config.cartToken?.storage;
    const nonceStorage = config.nonce?.storage;

    if (cartTokenStorage) {
      await cartTokenStorage.clear();
    }
    if (nonceStorage) {
      await nonceStorage.clear();
    }
  }

  state.authenticated = false;
  events.emit('auth:changed', false);
};
