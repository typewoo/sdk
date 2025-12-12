import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult } from '../../types/api.js';
import { ProductTagRequest, ProductTagResponse } from '../../types/index.js';

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
  async list(
    params?: ProductTagRequest
  ): Promise<ApiPaginationResult<ProductTagResponse[]>> {
    const query = qs.stringify(params);
    const url = `/${this.endpoint}?${query}`;
    const { data, error, headers } = await doGet<ProductTagResponse[]>(url);

    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }
}
