import { BaseService } from '../base.service.js';
import {
  AdminPaymentGateway,
  AdminPaymentGatewayRequest,
  AdminPaymentGatewayQueryParams,
} from '../../types/admin/payment-gateway.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import { doGet, doPut } from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

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

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
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
