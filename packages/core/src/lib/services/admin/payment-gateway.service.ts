import { BaseService } from '../base.service.js';
import { doGet, doPut } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminPaymentGatewayQueryParams,
  AdminPaymentGateway,
  AdminPaymentGatewayRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

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
  list(
    params?: AdminPaymentGatewayQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminPaymentGateway[], AdminPaymentGatewayQueryParams> {
    const request = async (
      pageParams?: AdminPaymentGatewayQueryParams
    ): Promise<ApiPaginationResult<AdminPaymentGateway[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminPaymentGateway[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single payment gateway by ID
   */
  async get(
    id: string,
    params?: AdminPaymentGatewayQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminPaymentGateway>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminPaymentGateway>(url, options);
    return { data, error };
  }

  /**
   * Update a payment gateway
   */
  async update(
    id: string,
    gateway: AdminPaymentGatewayRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminPaymentGateway>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminPaymentGateway,
      AdminPaymentGatewayRequest
    >(url, gateway, options);
    return { data, error };
  }
}
