import { AxiosInstance } from 'axios';
import type { ResolvedSdkConfig } from '../configs/sdk.config.js';

/**
 * The axios client and resolved configuration owned by a single
 * `TypewooClient`. Every request made on behalf of an instance runs through
 * its own context, so instances never share interceptors, base URLs or config.
 */
export interface HttpContext {
  client: AxiosInstance;
  config: ResolvedSdkConfig;
}

let _defaultContext: HttpContext | null = null;

/**
 * Registers the context used by the free HTTP helpers (`doGet`, `doPost`, …)
 * when they are called without an explicit context. The first instance
 * created wins; later instances never replace it.
 *
 * @internal Called by `TypewooClient`.
 */
export function setDefaultHttpContext(context: HttpContext): void {
  _defaultContext ??= context;
}

/**
 * Returns the given context, or the default one when none is passed.
 */
export function resolveHttpContext(context?: HttpContext): HttpContext {
  const resolved = context ?? _defaultContext;
  if (!resolved) {
    throw new Error(
      'No Typewoo instance found. Call createTypewoo(config) before making requests.'
    );
  }
  return resolved;
}

/**
 * Axios client of the first Typewoo instance created.
 *
 * @deprecated Use `typewoo.http.client` so you target a specific instance.
 */
export const httpClient: AxiosInstance = new Proxy({} as AxiosInstance, {
  get(_t, prop: string | symbol) {
    const client = resolveHttpContext().client;
    // Forward property access; TypeScript doesn't allow generic index on AxiosInstance
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
