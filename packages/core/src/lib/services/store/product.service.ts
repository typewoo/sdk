import {
  extractPagination,
  RequireAtLeastOne,
} from '../../utilities/common.js';
import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { ProductRequest, ProductResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * Products API
 *
 * The store products API provides public product data so it can be rendered on the client side.
 */
export class ProductService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products';

  /**
   * List Products
   * @param params
   * @returns
   */
  list(
    params?: ProductRequest,
    options?: RequestOptions
  ): PaginatedRequest<ProductResponse[], ProductRequest> {
    const request = async (
      pageParams?: ProductRequest
    ): Promise<ApiPaginationResult<ProductResponse[]>> => {
      let unstable_tax: string | undefined = undefined;
      let unstable_tax_operator: string | undefined = undefined;
      if (pageParams && pageParams._unstable_tax_) {
        pageParams._unstable_tax_?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            unstable_tax += `_unstable_tax_${key}=${item[key]}`;
          });
        });
        pageParams._unstable_tax_ = [];
      }

      if (pageParams && pageParams._unstable_tax_operator) {
        pageParams._unstable_tax_operator?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            unstable_tax_operator += `_unstable_tax_${key}_operator=${item[key]}`;
          });
        });
        pageParams._unstable_tax_operator = [];
      }
      const query = qs.stringify(
        { ...pageParams, unstable_tax, unstable_tax_operator },
        { encode: false }
      );

      const url = `/${this.endpoint}?${query}`;
      const { data, error, headers } = await doGet<ProductResponse[]>(
        url,
        options
      );

      const pagination = extractPagination(headers);
      return { data, error, pagination, headers };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Single Product by ID or Slug
   * @param params
   * @returns
   */
  async single(
    params: RequireAtLeastOne<{ id: number; slug: string }>,
    options?: RequestOptions
  ): Promise<ApiResult<ProductResponse>> {
    const url = `/${this.endpoint}/${params.id || params.slug}`;
    const { data, error } = await doGet<ProductResponse>(url, options);
    return { data, error };
  }
}
