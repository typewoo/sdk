import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminTaxonomyCategoryQueryParams,
  AdminTaxonomyCategory,
  AdminTaxonomyCategoryRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

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
  list(
    params?: AdminTaxonomyCategoryQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<
    AdminTaxonomyCategory[],
    AdminTaxonomyCategoryQueryParams
  > {
    const request = async (
      pageParams?: AdminTaxonomyCategoryQueryParams
    ): Promise<ApiPaginationResult<AdminTaxonomyCategory[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await doGet<AdminTaxonomyCategory[]>(
        url,
        options
      );
      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Get single product category by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxonomyCategory>(url, options);
    return { data, error };
  }

  /**
   * Create a new product category
   */
  async create(
    category: AdminTaxonomyCategoryRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminTaxonomyCategory,
      AdminTaxonomyCategoryRequest
    >(url, category, options);

    return { data, error };
  }

  /**
   * Update a product category
   */
  async update(
    id: number,
    category: AdminTaxonomyCategoryRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminTaxonomyCategory,
      AdminTaxonomyCategoryRequest
    >(url, category, options);

    return { data, error };
  }

  /**
   * Delete a product category
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminTaxonomyCategory>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTaxonomyCategory>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete product categories
   */
  async batch(
    operations: {
      create?: AdminTaxonomyCategoryRequest[];
      update?: Array<AdminTaxonomyCategoryRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
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
    >(url, operations, options);

    return { data, error };
  }
}
