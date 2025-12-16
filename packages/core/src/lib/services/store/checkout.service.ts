import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet, doPut, doPost } from '../../http/http.js';
import { ApiResult } from '../../types/api.js';
import {
  CheckoutResponse,
  CheckoutUpdateRequest,
  CheckoutCreateRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Checkout API
 *
 * The checkout API facilitates the creation of orders (from the current cart) and handling payments for payment methods.
 */
export class CheckoutService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/checkout';

  /**
   * Get Checkout Data
   * @returns {CheckoutResponse}
   */
  async get(options?: RequestOptions): Promise<ApiResult<CheckoutResponse>> {
    const url = `/${this.endpoint}/`;

    const { data, error } = await doGet<CheckoutResponse>(url, options);

    return { data, error };
  }

  /**
   * Update checkout data
   * @param params
   * @param experimental_calc_totals This is used to determine if the cart totals should be recalculated. This should be set to true if the cart totals are being updated in response to a PUT request, false otherwise.
   * @returns {CheckoutResponse}
   */
  async update(
    params?: CheckoutUpdateRequest,
    experimental_calc_totals = false,
    options?: RequestOptions
  ): Promise<ApiResult<CheckoutResponse>> {
    const query = qs.stringify(params, { encode: true });

    const url = `/${this.endpoint}/?__experimental_calc_totals=${
      experimental_calc_totals || false
    }&${query}`;
    const { data, error } = await doPut<CheckoutResponse, unknown>(
      url,
      undefined,
      options
    );

    return { data, error };
  }

  /**
   * Process Order and Payment
   * @param params
   * @returns {CheckoutResponse}
   */
  async processOrderAndPayment(
    params: CheckoutCreateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<CheckoutResponse>> {
    // Store API expects POST body with checkout payload at the base endpoint
    const url = `/${this.endpoint}/`;

    const { data, error } = await doPost<
      CheckoutResponse,
      CheckoutCreateRequest
    >(url, params, options);

    return { data, error };
  }
}
