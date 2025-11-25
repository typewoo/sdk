import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult } from '../../types/api.js';
import {
  ProductReviewRequest,
  ProductReviewResponse,
} from '../../types/index.js';

/**
 * Product Reviews API
 *
 * This endpoint returns product reviews (comments) and can also show results from either specific products or specific categories.
 */
export class ProductReviewService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/reviews';

  /**
   * List Product Reviews
   * @param params
   * @returns
   */
  async list(
    params?: ProductReviewRequest
  ): Promise<ApiPaginationResult<ProductReviewResponse[]>> {
    const query = qs.stringify(params, { encode: true });
    const url = `/${this.endpoint}?${query}`;
    const { data, error, headers } = await doGet<ProductReviewResponse[]>(url);

    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }
}
