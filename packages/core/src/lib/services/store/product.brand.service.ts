import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { Paginated, ProductBrandResponse } from '../../types/index.js';

/**
 * Product Brands API
 */
export class ProductBrandService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/brands';

  /**
   * List Product Brands
   * @returns
   */
  async list(
    params?: Paginated
  ): Promise<ApiPaginationResult<ProductBrandResponse[]>> {
    const query = qs.stringify(params);
    const url = `/${this.endpoint}?${query}`;
    const { data, error, headers } = await doGet<ProductBrandResponse[]>(url);

    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Single Product Brand
   * @param id The identifier of the brand to retrieve. Can be an brand ID or slug.
   * @returns
   */
  async single(id: number): Promise<ApiResult<ProductBrandResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doGet<ProductBrandResponse>(url);
    return { data, error };
  }
}
