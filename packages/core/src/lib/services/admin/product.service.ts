import { BaseService } from '../base.service.js';
import {
  WcProduct,
  WcProductRequest,
  WcProductQueryParams,
  WcProductVariation,
} from '../../types/admin/product.types.js';
import type { WcProductCustomFieldNameQueryParams } from '../../types/admin/product.types.js';
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
export class WcAdminProductService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products';

  /**
   * List products
   */
  async list(
    params?: WcProductQueryParams
  ): Promise<ApiPaginationResult<WcProduct[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcProduct[]>(url);

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
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcProduct>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcProduct>(url);
    return { data, error };
  }

  /**
   * Create a new product
   */
  async create(product: WcProductRequest): Promise<ApiResult<WcProduct>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<WcProduct, WcProductRequest>(
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
    product: WcProductRequest
  ): Promise<ApiResult<WcProduct>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<WcProduct, WcProductRequest>(
      url,
      product
    );

    return { data, error };
  }

  /**
   * Delete a product
   */
  async delete(id: number, force = false): Promise<ApiResult<WcProduct>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcProduct>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete products
   */
  async batch(operations: {
    create?: WcProductRequest[];
    update?: Array<WcProductRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcProduct[];
      update: WcProduct[];
      delete: WcProduct[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcProduct[];
        update: WcProduct[];
        delete: WcProduct[];
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
    updates?: WcProductRequest
  ): Promise<ApiResult<WcProduct>> {
    const url = `/${this.endpoint}/${id}/duplicate`;
    const { data, error } = await doPost<WcProduct, WcProductRequest>(
      url,
      updates || {}
    );

    return { data, error };
  }

  /**
   * List product variations
   */
  async listVariations(
    productId: number,
    params?: WcProductQueryParams
  ): Promise<ApiPaginationResult<WcProductVariation[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<WcProductVariation[]>(url);

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
  ): Promise<ApiResult<WcProductVariation>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${productId}/variations/${variationId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<WcProductVariation>(url);
    return { data, error };
  }

  /**
   * Create a product variation
   */
  async createVariation(
    productId: number,
    variation: Partial<WcProductVariation>
  ): Promise<ApiResult<WcProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations`;
    const { data, error } = await doPost<
      WcProductVariation,
      Partial<WcProductVariation>
    >(url, variation);

    return { data, error };
  }

  /**
   * Update a product variation
   */
  async updateVariation(
    productId: number,
    variationId: number,
    variation: Partial<WcProductVariation>
  ): Promise<ApiResult<WcProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations/${variationId}`;
    const { data, error } = await doPut<
      WcProductVariation,
      Partial<WcProductVariation>
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
  ): Promise<ApiResult<WcProductVariation>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${productId}/variations/${variationId}?${query}`;
    const { data, error } = await doDelete<WcProductVariation>(url);

    return { data, error };
  }

  /**
   * Generate variations for a variable product
   */
  async generateVariations(
    productId: number,
    options?: {
      delete?: boolean;
      default_values?: Partial<WcProductVariation>;
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
    params?: WcProductCustomFieldNameQueryParams
  ): Promise<ApiResult<string[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/custom-fields/names${
      query ? `?${query}` : ''
    }`;
    const { data, error } = await doGet<string[]>(url);
    return { data, error };
  }
}
