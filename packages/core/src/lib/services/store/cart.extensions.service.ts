import { BaseService } from '../base.service.js';
import { doPost } from '../../http/http.js';
import { ApiResult } from '../../types/api.js';
import {
  CartExtensionsRequest,
  CartExtensionsResponse,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Cart Extensions API
 *
 * The cart extensions API allows third-party plugins to store and retrieve data during the cart and checkout processes.
 */
export class CartExtensionsService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/cart/extensions';

  /**
   * Store Extension Data
   * Store data from third-party extensions in the cart
   * @param params - Extension data to store
   * @returns {CartExtensionsResponse} - Response indicating success/failure
   */
  async store(
    params: CartExtensionsRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<CartExtensionsResponse>> {
    const url = `/${this.endpoint}`;

    this.events.emit('cart:extensions:loading', true);
    this.events.emit('cart:extensions:request:start');

    const { data, error } = await doPost<
      CartExtensionsResponse,
      CartExtensionsRequest
    >(url, params, options);

    this.events.emitIf(!!data, 'cart:extensions:request:success');
    this.events.emitIf(!!error, 'cart:extensions:request:error', { error });
    this.events.emit('cart:extensions:loading', false);

    return { data, error };
  }
}
