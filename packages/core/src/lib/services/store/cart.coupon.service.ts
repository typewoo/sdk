import { BaseService } from '../base.service.js';
import { doDelete, doGet, doPost } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { CartCouponResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Cart Coupons API
 */
export class CartCouponService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/cart/coupons';

  /**
   * List Cart Coupons
   * @returns {CartCouponResponse[]}
   */
  async list(
    options?: RequestOptions
  ): Promise<ApiPaginationResult<CartCouponResponse[]>> {
    const url = `/${this.endpoint}`;
    const { data, error, headers } = await doGet<CartCouponResponse[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get a single cart coupon.
   * @param code The coupon code of the cart coupon to retrieve.
   * @returns {CartCouponResponse}
   */
  async single(
    code: string,
    options?: RequestOptions
  ): Promise<ApiResult<CartCouponResponse>> {
    const url = `/${this.endpoint}/${code}`;
    const { data, error } = await doGet<CartCouponResponse>(url, options);

    return { data, error };
  }

  /**
   * Apply a coupon to the cart. Returns the new coupon object that was applied, or an error if it was not applied.
   * @param code The coupon code you wish to apply to the cart.
   * @returns {CartCouponResponse}
   */
  async add(
    code: string,
    options?: RequestOptions
  ): Promise<ApiResult<CartCouponResponse>> {
    const url = `/${this.endpoint}?code=${code}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doPost<CartCouponResponse, unknown>(
      url,
      options
    );

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }

  /**
   * Delete/remove a coupon from the cart.
   * @param code The coupon code you wish to remove from the cart.
   * @returns {unknown}
   */
  async delete(
    code: string,
    options?: RequestOptions
  ): Promise<ApiResult<unknown>> {
    const url = `/${this.endpoint}/${code}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doDelete<unknown>(url, options);

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }

  /**
   * Delete/remove all coupons from the cart.
   * @returns {CartCouponResponse[]}
   */
  async clear(
    options?: RequestOptions
  ): Promise<ApiResult<CartCouponResponse[]>> {
    const url = `/${this.endpoint}`;

    this.events.emit('cart:loading', true);
    this.events.emit('cart:request:start');

    const { data, error } = await doDelete<CartCouponResponse[]>(url, options);

    this.events.emitIf(!!data, 'cart:request:success');
    this.events.emitIf(!!error, 'cart:request:error', error);
    this.events.emit('cart:loading', false);

    return { data, error };
  }
}
