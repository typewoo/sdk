import { BaseService } from '../base.service.js';
import { doPost } from '../../utilities/axios.utility.js';
import { ApiResult } from '../../types/api.js';
import { OrderRequest, CheckoutResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Checkout order API
 *
 * The checkout order API facilitates the processing of existing orders and handling payments.
 */
export class CheckoutOrderService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/checkout';

  /**
   * Process Order and Payment
   * @param orderId
   * @param params
   * @returns
   */
  async order(
    orderId: number,
    params: OrderRequest,
    options?: RequestOptions
  ): Promise<ApiResult<CheckoutResponse>> {
    const url = `/${this.endpoint}/${orderId}`;

    const { data, error } = await doPost<CheckoutResponse, OrderRequest>(
      url,
      params,
      options
    );

    return { data, error };
  }
}
