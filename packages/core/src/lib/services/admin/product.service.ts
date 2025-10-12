import { BaseService } from '../base.service.js';
import {
  AdminProduct,
  AdminProductRequest,
  ProductQueryParams,
  AdminProductVariation,
} from '../../types/admin/product.types.js';
import type { ProductCustomFieldNameQueryParams } from '../../types/admin/product.types.js';
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
 * WooCommerce REST API Products Service
 *
 * Manages products through the WooCommerce REST API (wp-json/wc/v3/products)
 */
export class AdminProductService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products';

  /**
   * List products
   */
  async list(
    params?: ProductQueryParams
  ): Promise<ApiPaginationResult<AdminProduct[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProduct[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product by ID
   */
  async getById(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminProduct>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProduct>(url);
    return { data, error };
  }

  /**
   * Create a new product
   */
  async create(product: AdminProductRequest): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminProduct, AdminProductRequest>(
      url,
      product
    );

    return { data, error };
  }

  /**
   * Update a product
   */
  async update(
    id: number,
    product: AdminProductRequest
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminProduct, AdminProductRequest>(
      url,
      product
    );

    return { data, error };
  }

  /**
   * Delete a product
   */
  async delete(id: number, force = false): Promise<ApiResult<AdminProduct>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminProduct>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete products
   */
  async batch(operations: {
    create?: AdminProductRequest[];
    update?: Array<AdminProductRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminProduct[];
      update: AdminProduct[];
      delete: AdminProduct[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminProduct[];
        update: AdminProduct[];
        delete: AdminProduct[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }

  /**
   * Duplicate a product
   */
  async duplicate(
    id: number,
    product?: Partial<AdminProductRequest>
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}/${id}/duplicate`;
    const { data, error } = await doPost<AdminProduct, AdminProductRequest>(
      url,
      product || {}
    );

    return { data, error };
  }

  /**
   * List product variations
   */
  async listVariations(
    productId: number,
    params?: ProductQueryParams
  ): Promise<ApiPaginationResult<AdminProductVariation[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<AdminProductVariation[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product variation
   */
  async getVariation(
    productId: number,
    variationId: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminProductVariation>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations/${variationId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminProductVariation>(url);
    return { data, error };
  }

  /**
   * Create a product variation
   */
  async createVariation(
    productId: number,
    variation: Partial<AdminProductVariation>
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations`;
    const { data, error } = await doPost<
      AdminProductVariation,
      Partial<AdminProductVariation>
    >(url, variation);

    return { data, error };
  }

  /**
   * Update a product variation
   */
  async updateVariation(
    productId: number,
    variationId: number,
    variation: Partial<AdminProductVariation>
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations/${variationId}`;
    const { data, error } = await doPut<
      AdminProductVariation,
      Partial<AdminProductVariation>
    >(url, variation);

    return { data, error };
  }

  /**
   * Delete a product variation
   */
  async deleteVariation(
    productId: number,
    variationId: number,
    force = false
  ): Promise<ApiResult<AdminProductVariation>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${productId}/variations/${variationId}?${query}`;
    const { data, error } = await doDelete<AdminProductVariation>(url);

    return { data, error };
  }

  /**
   * Generate variations for a variable product
   */
  async generateVariations(
    productId: number,
    options?: {
      delete?: boolean;
      default_values?: Partial<AdminProductVariation>;
    }
  ): Promise<ApiResult<{ count: number }>> {
    const url = `/${this.endpoint}/${productId}/variations/generate`;
    const { data, error } = await doPost<{ count: number }, typeof options>(
      url,
      options || {}
    );

    return { data, error };
  }

  /**
   * List product custom-field names
   * GET /wp-json/wc/v3/products/custom-fields/names
   */
  async listCustomFieldNames(
    params?: ProductCustomFieldNameQueryParams
  ): Promise<ApiResult<string[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/custom-fields/names${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<string[]>(url);
    return { data, error };
  }
}
