import { CartResponse } from './types';

export type SdkEvent = {
  'auth:changed': boolean;
  'auth:login:start': void;
  'auth:login:success': void;
  'auth:login:error': unknown;

  'auth:token:refresh:start': void;
  'auth:token:refresh:success': void;
  'auth:token:refresh:error': unknown;
  'auth:token:revoke:start': void;
  'auth:token:revoke:success': void;
  'auth:token:revoke:error': unknown;

  'cart:request:start': void;
  'cart:request:success': void;
  'cart:request:error'?: unknown;
  'cart:updated'?: CartResponse;
  'cart:loading': boolean;

  'batch:request:start': void;
  'batch:request:success': void;
  'batch:request:error'?: unknown;
  'batch:loading': boolean;

  'cart:extensions:request:start': void;
  'cart:extensions:request:success': void;
  'cart:extensions:request:error'?: unknown;
  'cart:extensions:loading': boolean;

  'nonce:changed': string;
  'cart:hash:changed': string;
  'cart:token:changed': string;
};
