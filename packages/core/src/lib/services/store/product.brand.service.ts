import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { Paginated, ProductBrandResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * Product Brands API
 */
export class ProductBrandService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/brands';

  /**
   * List Product Brands
   * @returns
   */
  list(
    params?: Paginated,
    options?: RequestOptions
  ): PaginatedRequest<ProductBrandResponse[], Paginated> {
    const request = async (
      pageParams?: Paginated
    ): Promise<ApiPaginationResult<ProductBrandResponse[]>> => {
      const query = qs.stringify(pageParams);
      const url = `/${this.endpoint}?${query}`;
      const { data, error, headers } = await doGet<ProductBrandResponse[]>(
        url,
        options
      );

      const pagination = extractPagination(headers);
      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }

  /**
   * Single Product Brand
   * @param id The identifier of the brand to retrieve. Can be an brand ID or slug.
   * @returns
   */
  async single(
    id: number,
    options?: RequestOptions
  ): Promise<ApiResult<ProductBrandResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doGet<ProductBrandResponse>(url, options);
    return { data, error };
  }
}
