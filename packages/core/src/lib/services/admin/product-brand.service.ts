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
  AdminBrandQueryParams,
  AdminBrand,
  AdminBrandRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Product Brands Service
 *
 * Manages product brands through the WooCommerce REST API (wp-json/wc/v3/products/brands)
 */
export class AdminProductBrandService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/brands';

  /**
   * List product brands
   */
  async list(
    params?: AdminBrandQueryParams
  ): Promise<ApiPaginationResult<AdminBrand[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminBrand[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product brand by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminBrand>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminBrand>(url);
    return { data, error };
  }

  /**
   * Create a new product brand
   */
  async create(brand: AdminBrandRequest): Promise<ApiResult<AdminBrand>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminBrand, AdminBrandRequest>(
      url,
      brand
    );

    return { data, error };
  }

  /**
   * Update a product brand
   */
  async update(
    id: number,
    brand: AdminBrandRequest
  ): Promise<ApiResult<AdminBrand>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminBrand, AdminBrandRequest>(
      url,
      brand
    );

    return { data, error };
  }

  /**
   * Delete a product brand
   */
  async delete(id: number, force = false): Promise<ApiResult<AdminBrand>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminBrand>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product brands
   */
  async batch(operations: {
    create?: AdminBrandRequest[];
    update?: Array<AdminBrandRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminBrand[];
      update: AdminBrand[];
      delete: AdminBrand[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminBrand[];
        update: AdminBrand[];
        delete: AdminBrand[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
