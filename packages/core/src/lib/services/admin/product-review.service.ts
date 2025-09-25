import { BaseService } from '../base.service.js';
import {
  WcAdminProductReview,
  WcAdminProductReviewRequest,
  WcAdminProductReviewQueryParams,
} from '../../types/admin/product-review.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Product Reviews Service
 *
 * Manages product reviews through the WooCommerce REST API (wp-json/wc/v3/products/reviews)
 */
export class WcAdminProductReviewService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/reviews';

  /**
   * List product reviews
   */
  async list(
    params?: WcAdminProductReviewQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductReview[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductReview[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product review by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminProductReview>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductReview>(url);
    return { data, error };
  }

  /**
   * Create a new product review
   */
  async create(
    review: WcAdminProductReviewRequest
  ): Promise<ApiResult<WcAdminProductReview>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductReview,
      WcAdminProductReviewRequest
    >(url, review);

    return { data, error };
  }

  /**
   * Update a product review
   */
  async update(
    id: number,
    review: WcAdminProductReviewRequest
  ): Promise<ApiResult<WcAdminProductReview>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminProductReview,
      WcAdminProductReviewRequest
    >(url, review);

    return { data, error };
  }

  /**
   * Delete a product review
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminProductReview>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminProductReview>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product reviews
   */
  async batch(operations: {
    create?: WcAdminProductReviewRequest[];
    update?: Array<WcAdminProductReviewRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminProductReview[];
      update: WcAdminProductReview[];
      delete: WcAdminProductReview[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductReview[];
        update: WcAdminProductReview[];
        delete: WcAdminProductReview[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
