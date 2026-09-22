import { SdkState } from '../types/sdk.state.js';
import { ResolvedSdkConfig } from '../configs/sdk.config.js';
import { EventBus } from '../bus/event.bus.js';
import { SdkEvent } from '../sdk.events.js';
import type { TypewooHttp } from '../http/http.js';

export class BaseService {
  protected NONCE_HEADER = 'nonce';
  protected CART_TOKEN_HEADER = 'cart-token';

  protected readonly state: SdkState;
  protected readonly config: ResolvedSdkConfig;
  protected readonly events: EventBus<SdkEvent>;
  /** HTTP helpers bound to the owning SDK instance's client and config. */
  protected readonly http: TypewooHttp;

  constructor(
    state: SdkState,
    config: ResolvedSdkConfig,
    events: EventBus<SdkEvent>,
    http: TypewooHttp
  ) {
    this.state = state;
    this.events = events;
    this.config = config;
    this.http = http;
  }
}
