import { BaseService } from '../base.service.js';
import { doGet, doPost, doPut, doDelete } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  ProductQueryParams,
  AdminProduct,
  AdminProductRequest,
  AdminProductVariation,
  ProductCustomFieldNameQueryParams,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

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
    params?: ProductQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminProduct[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminProduct[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single product by ID
   */
  async getById(
    id: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminProduct>(url, options);
    return { data, error };
  }

  /**
   * Create a new product
   */
  async create(
    product: AdminProductRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminProduct, AdminProductRequest>(
      url,
      product,
      options
    );

    return { data, error };
  }

  /**
   * Update a product
   */
  async update(
    id: number,
    product: AdminProductRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminProduct, AdminProductRequest>(
      url,
      product,
      options
    );

    return { data, error };
  }

  /**
   * Delete a product
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminProduct>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete products
   */
  async batch(
    operations: {
      create?: AdminProductRequest[];
      update?: Array<AdminProductRequest & { id: number }>;
      delete?: number[];
    },
    options?: RequestOptions
  ): Promise<
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
    >(url, operations, options);

    return { data, error };
  }

  /**
   * Duplicate a product
   */
  async duplicate(
    id: number,
    product?: Partial<AdminProductRequest>,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}/${id}/duplicate`;
    const { data, error } = await doPost<AdminProduct, AdminProductRequest>(
      url,
      product || {},
      options
    );

    return { data, error };
  }

  /**
   * List product variations
   */
  async listVariations(
    productId: number,
    params?: ProductQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminProductVariation[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<AdminProductVariation[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single product variation
   */
  async getVariation(
    productId: number,
    variationId: number,
    params?: { context?: 'view' | 'edit' },
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations/${variationId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminProductVariation>(url, options);
    return { data, error };
  }

  /**
   * Create a product variation
   */
  async createVariation(
    productId: number,
    variation: Partial<AdminProductVariation>,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations`;
    const { data, error } = await doPost<
      AdminProductVariation,
      Partial<AdminProductVariation>
    >(url, variation, options);

    return { data, error };
  }

  /**
   * Update a product variation
   */
  async updateVariation(
    productId: number,
    variationId: number,
    variation: Partial<AdminProductVariation>,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations/${variationId}`;
    const { data, error } = await doPut<
      AdminProductVariation,
      Partial<AdminProductVariation>
    >(url, variation, options);

    return { data, error };
  }

  /**
   * Delete a product variation
   */
  async deleteVariation(
    productId: number,
    variationId: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${productId}/variations/${variationId}?${query}`;
    const { data, error } = await doDelete<AdminProductVariation>(url, options);

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
    },
    requestOptions?: RequestOptions
  ): Promise<ApiResult<{ count: number }>> {
    const url = `/${this.endpoint}/${productId}/variations/generate`;
    const { data, error } = await doPost<{ count: number }, typeof options>(
      url,
      options || {},
      requestOptions
    );

    return { data, error };
  }

  /**
   * List product custom-field names
   * GET /wp-json/wc/v3/products/custom-fields/names
   */
  async listCustomFieldNames(
    params?: ProductCustomFieldNameQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<string[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/custom-fields/names${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<string[]>(url, options);
    return { data, error };
  }
}
