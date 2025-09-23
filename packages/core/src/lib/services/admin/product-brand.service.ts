import { BaseService } from '../base.service.js';
import {
  WcAdminProductBrand,
  WcAdminProductBrandRequest,
  WcAdminProductBrandQueryParams,
} from '../../types/admin/product-brand.types.js';
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
 * WooCommerce REST API Product Brands Service
 *
 * Manages product brands through the WooCommerce REST API (wp-json/wc/v3/products/brands)
 */
export class WcAdminProductBrandService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/brands';

  /**
   * List product brands
   */
  async list(
    params?: WcAdminProductBrandQueryParams
  ): Promise<ApiPaginationResult<WcAdminProductBrand[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminProductBrand[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product brand by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminProductBrand>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminProductBrand>(url);
    return { data, error };
  }

  /**
   * Create a new product brand
   */
  async create(
    brand: WcAdminProductBrandRequest
  ): Promise<ApiResult<WcAdminProductBrand>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminProductBrand,
      WcAdminProductBrandRequest
    >(url, brand);

    return { data, error };
  }

  /**
   * Update a product brand
   */
  async update(
    id: number,
    brand: WcAdminProductBrandRequest
  ): Promise<ApiResult<WcAdminProductBrand>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminProductBrand,
      WcAdminProductBrandRequest
    >(url, brand);

    return { data, error };
  }

  /**
   * Delete a product brand
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminProductBrand>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminProductBrand>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product brands
   */
  async batch(operations: {
    create?: WcAdminProductBrandRequest[];
    update?: Array<WcAdminProductBrandRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminProductBrand[];
      update: WcAdminProductBrand[];
      delete: WcAdminProductBrand[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminProductBrand[];
        update: WcAdminProductBrand[];
        delete: WcAdminProductBrand[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
