import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { ApiResult } from '../../types/api.js';
import {
  ProductCollectionDataRequest,
  ProductCollectionDataResponse,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Product Collection Data API
 *
 * This endpoint allows you to get aggregate data from a collection of products,
 * for example, the min and max price in a collection of products (ignoring pagination).
 * This is used by blocks for product filtering widgets, since counts are based on the product catalog being viewed.
 */
export class ProductCollectionDataService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/collection-data';

  /**
   * Calculate
   * @param params
   * @returns
   */
  async calculate(
    params?: ProductCollectionDataRequest,
    options?: RequestOptions
  ): Promise<ApiResult<ProductCollectionDataResponse>> {
    const query = qs.stringify(params, { encode: true });
    const url = `/${this.endpoint}?${query}`;
    const { data, error } = await doGet<ProductCollectionDataResponse>(
      url,
      options
    );
    return { data, error };
  }
}
