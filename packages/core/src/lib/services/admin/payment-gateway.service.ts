import { BaseService } from '../base.service.js';
import { doGet, doPut } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminPaymentGatewayQueryParams,
  AdminPaymentGateway,
  AdminPaymentGatewayRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Payment Gateways Service
 *
 * Manages payment gateways through the WooCommerce REST API (wp-json/wc/v3/payment_gateways)
 */
export class AdminPaymentGatewayService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/payment_gateways';

  /**
   * List payment gateways
   */
  async list(
    params?: AdminPaymentGatewayQueryParams
  ): Promise<ApiPaginationResult<AdminPaymentGateway[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminPaymentGateway[]>(url);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single payment gateway by ID
   */
  async get(
    id: string,
    params?: AdminPaymentGatewayQueryParams
  ): Promise<ApiResult<AdminPaymentGateway>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminPaymentGateway>(url);
    return { data, error };
  }

  /**
   * Update a payment gateway
   */
  async update(
    id: string,
    gateway: AdminPaymentGatewayRequest
  ): Promise<ApiResult<AdminPaymentGateway>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminPaymentGateway,
      AdminPaymentGatewayRequest
    >(url, gateway);
    return { data, error };
  }
}
