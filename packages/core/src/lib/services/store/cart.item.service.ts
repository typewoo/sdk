import { BaseService } from '../base.service.js';
import { doDelete, doGet, doPost, doPut } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { CartItemResponse, CartItemAddRequest } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Cart Items API
 */
export class CartItemService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/cart/items';

  /**
   * List Cart Items
   * @returns {CartItemResponse[]}
   */
  async list(
    options?: RequestOptions
  ): Promise<ApiPaginationResult<CartItemResponse[]>> {
    const url = `/${this.endpoint}`;

    const { data, error, headers } = await doGet<CartItemResponse[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get a single cart item by its key.
   * @param key The key of the cart item to retrieve.
   * @returns {CartItemResponse}
   */
  async single(
    key: string,
    options?: RequestOptions
  ): Promise<ApiResult<CartItemResponse>> {
    const url = `/${this.endpoint}/${key}`;

    const { data, error } = await doGet<CartItemResponse>(url, options);

    return { data, error };
  }

  /**
   * Add Cart Item
   * @param params
   * @returns {CartItemResponse}
   */
  async add(
    params: CartItemAddRequest,
    options?: RequestOptions
  ): Promise<ApiResult<CartItemResponse>> {
    const query = qs.stringify(params, { encode: true });
    const url = `/${this.endpoint}?${query}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doPost<CartItemResponse, unknown>(
      url,
      undefined,
      options
    );

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }

  /**
   * Edit Single Cart Item
   * @param key The key of the cart item to edit.
   * @param quantity Quantity of this item in the cart.
   * @returns {CartItemResponse}
   */
  async update(
    key: string,
    quantity: number,
    options?: RequestOptions
  ): Promise<ApiResult<CartItemResponse>> {
    const query = qs.stringify({ quantity: quantity }, { encode: true });
    const url = `/${this.endpoint}/${key}?${query}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doPut<CartItemResponse, unknown>(
      url,
      undefined,
      options
    );

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }

  /**
   * Delete Single Cart Item
   * @param key The key of the cart item to edit.
   * @returns {unknown}
   */
  async remove(
    key: string,
    options?: RequestOptions
  ): Promise<ApiResult<unknown>> {
    const url = `/${this.endpoint}/${key}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doDelete<unknown>(url, options);

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }

  /**
   * Delete All Cart Items
   * @returns {CartItemResponse[]}
   */
  async clear(
    options?: RequestOptions
  ): Promise<ApiResult<CartItemResponse[]>> {
    const url = `/${this.endpoint}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doDelete<CartItemResponse[]>(url, options);

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }
}
