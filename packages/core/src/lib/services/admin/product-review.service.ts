import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminProductReviewQueryParams,
  AdminProductReview,
  AdminProductReviewRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Product Reviews Service
 *
 * Manages product reviews through the WooCommerce REST API (wp-json/wc/v3/products/reviews)
 */
export class AdminProductReviewService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/reviews';

  /**
   * List product reviews
   */
  async list(
    params?: AdminProductReviewQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminProductReview[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProductReview[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single product review by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductReview>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProductReview>(url, options);
    return { data, error };
  }

  /**
   * Create a new product review
   */
  async create(
    review: AdminProductReviewRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductReview>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminProductReview,
      AdminProductReviewRequest
    >(url, review, options);

    return { data, error };
  }

  /**
   * Update a product review
   */
  async update(
    id: number,
    review: AdminProductReviewRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductReview>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminProductReview,
      AdminProductReviewRequest
    >(url, review, options);

    return { data, error };
  }

  /**
   * Delete a product review
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductReview>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminProductReview>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete product reviews
   */
  async batch(
    operations: {
      create?: AdminProductReviewRequest[];
      update?: Array<AdminProductReviewRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
    ApiResult<{
      create: AdminProductReview[];
      update: AdminProductReview[];
      delete: AdminProductReview[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminProductReview[];
        update: AdminProductReview[];
        delete: AdminProductReview[];
      },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
