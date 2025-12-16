import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  ProductCategoryRequest,
  ProductCategoryResponse,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Product Categories API
 */
export class ProductCategoryService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/categories';

  /**
   * List Product Categories
   * @param params
   * @returns
   */
  async list(
    params?: ProductCategoryRequest,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<ProductCategoryResponse[]>> {
    const query = qs.stringify(params);
    const url = `/${this.endpoint}?${query}`;
    const { data, error, headers } = await doGet<ProductCategoryResponse[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Single Product Category
   * @param id The ID of the category to retrieve.
   * @returns
   */
  async single(
    id: number,
    options?: RequestOptions
  ): Promise<ApiResult<ProductCategoryResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doGet<ProductCategoryResponse>(url, options);
    return { data, error };
  }
}
