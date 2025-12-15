import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { ApiResult } from '../../types/api.js';
import { OrderResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Order API
 *
 * The order API returns the pay-for-order order.
 */
export class OrderService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/order';

  /**
   * Get Order
   * @param key
   * @param orderId
   * @param billingEmail
   * @returns {OrderResponse}
   */
  async get(
    key: string,
    orderId: string,
    billingEmail?: string,
    options?: RequestOptions
  ): Promise<ApiResult<OrderResponse>> {
    let url = `/${this.endpoint}/${orderId}?key=${key}`;
    if (billingEmail) {
      url += `&billing_email=${billingEmail}`;
    }

    const { data, error } = await doGet<OrderResponse>(url, options);
    return { data, error };
  }
}
