import { BaseService } from '../base.service.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminProductQueryParams,
  AdminProduct,
  AdminProductCreateRequest,
  AdminProductUpdateRequest,
  AdminProductDuplicateRequest,
  AdminProductDuplicateResponse,
  AdminProductVariation,
  AdminProductVariationCreateRequest,
  AdminProductVariationUpdateRequest,
  AdminProductVariationQueryParams,
  AdminProductVariationGenerateRequest,
  AdminProductVariationGenerateResponse,
  ProductCustomFieldNameQueryParams,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

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
  list(
    params?: AdminProductQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<AdminProduct[], AdminProductQueryParams> {
    const request = async (
      pageParams?: AdminProductQueryParams
    ): Promise<ApiPaginationResult<AdminProduct[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

      const { data, error, headers } = await this.http.get<AdminProduct[]>(
        url,
        options
      );

      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
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

    const { data, error } = await this.http.get<AdminProduct>(url, options);
    return { data, error };
  }

  /**
   * Create a new product
   */
  async create(
    product: AdminProductCreateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await this.http.post<
      AdminProduct,
      AdminProductCreateRequest
    >(url, product, options);

    return { data, error };
  }

  /**
   * Update a product
   */
  async update(
    id: number,
    product: AdminProductUpdateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProduct>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await this.http.put<
      AdminProduct,
      AdminProductUpdateRequest
    >(url, product, options);

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
    const { data, error } = await this.http.delete<AdminProduct>(url, options);

    return { data, error };
  }

  /**
   * Batch create/update/delete products
   */
  async batch(
    operations: {
      create?: AdminProductCreateRequest[];
      update?: Array<AdminProductUpdateRequest & { id: number }>;
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
    const { data, error } = await this.http.post<
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
   * Duplicate a product. Fields in `product` override the copied values.
   *
   * WooCommerce returns the new product's raw `WC_Product::get_data()`, not
   * the REST product shape; call `getById(data.id)` for the latter.
   */
  async duplicate(
    id: number,
    product?: AdminProductDuplicateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductDuplicateResponse>> {
    const url = `/${this.endpoint}/${id}/duplicate`;
    const { data, error } = await this.http.post<
      AdminProductDuplicateResponse,
      AdminProductDuplicateRequest
    >(url, product || {}, options);

    return { data, error };
  }

  /**
   * List product variations
   */
  listVariations(
    productId: number,
    params?: AdminProductVariationQueryParams,
    options?: RequestOptions
  ): PaginatedRequest<
    AdminProductVariation[],
    AdminProductVariationQueryParams
  > {
    const request = async (
      pageParams?: AdminProductVariationQueryParams
    ): Promise<ApiPaginationResult<AdminProductVariation[]>> => {
      const query = pageParams
        ? qs.stringify(pageParams, { encode: false })
        : '';
      const url = `/${this.endpoint}/${productId}/variations${
        query ? `?${query}` : ''
      }`;

      const { data, error, headers } = await this.http.get<
        AdminProductVariation[]
      >(url, options);

      const pagination = extractPagination(headers);

      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
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

    const { data, error } = await this.http.get<AdminProductVariation>(
      url,
      options
    );
    return { data, error };
  }

  /**
   * Create a product variation
   */
  async createVariation(
    productId: number,
    variation: AdminProductVariationCreateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations`;
    const { data, error } = await this.http.post<
      AdminProductVariation,
      AdminProductVariationCreateRequest
    >(url, variation, options);

    return { data, error };
  }

  /**
   * Update a product variation
   */
  async updateVariation(
    productId: number,
    variationId: number,
    variation: AdminProductVariationUpdateRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminProductVariation>> {
    const url = `/${this.endpoint}/${productId}/variations/${variationId}`;
    const { data, error } = await this.http.put<
      AdminProductVariation,
      AdminProductVariationUpdateRequest
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
    const { data, error } = await this.http.delete<AdminProductVariation>(
      url,
      options
    );

    return { data, error };
  }

  /**
   * Generate variations for a variable product
   */
  async generateVariations(
    productId: number,
    options?: AdminProductVariationGenerateRequest,
    requestOptions?: RequestOptions
  ): Promise<ApiResult<AdminProductVariationGenerateResponse>> {
    const url = `/${this.endpoint}/${productId}/variations/generate`;
    const { data, error } = await this.http.post<
      AdminProductVariationGenerateResponse,
      AdminProductVariationGenerateRequest
    >(url, options || {}, requestOptions);

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
    const { data, error } = await this.http.get<string[]>(url, options);
    return { data, error };
  }
}
