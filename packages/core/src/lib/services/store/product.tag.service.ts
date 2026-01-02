import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../http/http.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult } from '../../types/api.js';
import { ProductTagRequest, ProductTagResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';
import { PaginatedRequest } from '../../extensions/paginated-request.js';

/**
 * Product Tags API
 */
export class ProductTagService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/tags';

  /**
   * List Product Tags
   * @param params
   * @returns
   */
  list(
    params?: ProductTagRequest,
    options?: RequestOptions
  ): PaginatedRequest<ProductTagResponse[], ProductTagRequest> {
    const request = async (
      pageParams?: ProductTagRequest
    ): Promise<ApiPaginationResult<ProductTagResponse[]>> => {
      const query = qs.stringify(pageParams);
      const url = `/${this.endpoint}?${query}`;
      const { data, error, headers } = await doGet<ProductTagResponse[]>(
        url,
        options
      );

      const pagination = extractPagination(headers);
      return { data, error, pagination };
    };

    return new PaginatedRequest(request, params);
  }
}
