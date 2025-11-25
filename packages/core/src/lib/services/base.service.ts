import { SdkState } from '../types/sdk.state.js';
import { SdkConfig } from '../configs/sdk.config.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';

export class BaseService {
  protected NONCE_HEADER = 'nonce';
  protected CART_TOKEN_HEADER = 'cart-token';

  protected readonly state: SdkState;
  protected readonly config: SdkConfig;
  protected readonly events: EventBus<SdkEvent>;

  constructor(state: SdkState, config: SdkConfig, events: EventBus<SdkEvent>) {
    this.state = state;
    this.events = events;
    this.config = config;
  }
}
