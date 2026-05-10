import type { ResolvedSdkConfig } from '../../configs/sdk.config.js';
import type { SdkState } from '../../types/sdk.state.js';
import { EventBus } from '../../bus/event.bus.js';
import type { SdkEvent } from '../../sdk.events.js';

const DEFAULT_CONFIG: ResolvedSdkConfig = {
  baseUrl: 'https://store.test',
  uniqueIdentifier: 'test-sdk',
  request: {
    retry: {
      enabled: false,
    },
  },
};

export function makeTestDeps(overrides?: Partial<ResolvedSdkConfig>) {
  const state: SdkState = {};
  const config: ResolvedSdkConfig = { ...DEFAULT_CONFIG, ...overrides };
  const events = new EventBus<SdkEvent>();
  return { state, config, events };
}
