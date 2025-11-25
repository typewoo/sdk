import { Sdk } from '../sdk.js';
import { EventBus } from '../bus/event.bus.js';
import { StoreSdkEvent } from '../sdk.events.js';
import { StoreSdkConfig } from '../configs/sdk.config.js';
import { StoreSdkState } from '../types/sdk.state.js';

export interface StoreSdkPlugin<T> {
  id: string;
  init(): void;
  extend(sdk: Sdk): void;
  getConfig(): T;
  /**
   * Optional method to register event handlers and plugin-specific logic
   * Called after init() but before extend()
   */
  registerEventHandlers?(
    events: EventBus<StoreSdkEvent>,
    state: StoreSdkState,
    config: StoreSdkConfig,
    sdk: Sdk
  ): void;
}
