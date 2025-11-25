import { BaseService } from '../base.service.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminTaxonomyCategoryQueryParams,
  AdminTaxonomyCategory,
  AdminTaxonomyCategoryRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Product Categories Service
 *
 * Manages product categories through the WooCommerce REST API (wp-json/wc/v3/products/categories)
 */
export class AdminProductCategoryService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/categories';

  /**
   * List product categories
   */
  async list(
    params?: AdminTaxonomyCategoryQueryParams
  ): Promise<ApiPaginationResult<AdminTaxonomyCategory[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTaxonomyCategory[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product category by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxonomyCategory>(url);
    return { data, error };
  }

  /**
   * Create a new product category
   */
  async create(
    category: AdminTaxonomyCategoryRequest
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminTaxonomyCategory,
      AdminTaxonomyCategoryRequest
    >(url, category);

    return { data, error };
  }

  /**
   * Update a product category
   */
  async update(
    id: number,
    category: AdminTaxonomyCategoryRequest
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminTaxonomyCategory,
      AdminTaxonomyCategoryRequest
    >(url, category);

    return { data, error };
  }

  /**
   * Delete a product category
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTaxonomyCategory>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product categories
   */
  async batch(operations: {
    create?: AdminTaxonomyCategoryRequest[];
    update?: Array<AdminTaxonomyCategoryRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminTaxonomyCategory[];
      update: AdminTaxonomyCategory[];
      delete: AdminTaxonomyCategory[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminTaxonomyCategory[];
        update: AdminTaxonomyCategory[];
        delete: AdminTaxonomyCategory[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
