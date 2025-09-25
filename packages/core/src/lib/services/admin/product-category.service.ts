import { BaseService } from '../base.service.js';
import {
  WcAdminProductCategory,
  WcAdminProductCategoryRequest,
  WcAdminProductCategoryQueryParams,
} from '../../types/admin/taxonomy.types.js';
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
 * WooCommerce REST API Product Categories Service
 *
 * Manages product categories through the WooCommerce REST API (wp-json/wc/v3/products/categories)
 */
export class WcAdminProductCategoryService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/categories';

  /**
   * List product categories
   */
  async list(
    params?: WcAdminProductCategoryQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductCategory[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductCategory[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product category by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminProductCategory>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductCategory>(url);
    return { data, error };
  }

  /**
   * Create a new product category
   */
  async create(
    category: WcAdminProductCategoryRequest
  ): Promise<ApiResult<WcAdminProductCategory>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductCategory,
      WcAdminProductCategoryRequest
    >(url, category);

    return { data, error };
  }

  /**
   * Update a product category
   */
  async update(
    id: number,
    category: WcAdminProductCategoryRequest
  ): Promise<ApiResult<WcAdminProductCategory>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminProductCategory,
      WcAdminProductCategoryRequest
    >(url, category);

    return { data, error };
  }

  /**
   * Delete a product category
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminProductCategory>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminProductCategory>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product categories
   */
  async batch(operations: {
    create?: WcAdminProductCategoryRequest[];
    update?: Array<WcAdminProductCategoryRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminProductCategory[];
      update: WcAdminProductCategory[];
      delete: WcAdminProductCategory[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductCategory[];
        update: WcAdminProductCategory[];
        delete: WcAdminProductCategory[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
