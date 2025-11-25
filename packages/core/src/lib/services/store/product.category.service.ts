import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  ProductCategoryRequest,
  ProductCategoryResponse,
} from '../../types/index.js';

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
    params?: ProductCategoryRequest
  ): Promise<ApiPaginationResult<ProductCategoryResponse[]>> {
    const query = qs.stringify(params);
    const url = `/${this.endpoint}?${query}`;
    const { data, error, headers } = await doGet<ProductCategoryResponse[]>(
      url
    );

    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Single Product Category
   * @param id The ID of the category to retrieve.
   * @returns
   */
  async single(id: number): Promise<ApiResult<ProductCategoryResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doGet<ProductCategoryResponse>(url);
    return { data, error };
  }
}
