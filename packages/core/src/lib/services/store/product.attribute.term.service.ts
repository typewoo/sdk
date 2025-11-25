import * as qs from 'qs';
import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult } from '../../types/api.js';
import {
  ProductAttributeTermRequest,
  ProductAttributeResponse,
} from '../../types/index.js';

/**
 * Product Attribute Terms API
 */
export class ProductAttributeTermService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/attributes';

  /**
   * List Attribute Terms
   * @param attributeId The ID of the attribute to retrieve terms for.
   * @param params
   * @returns
   */
  async list(
    attributeId: number,
    params?: ProductAttributeTermRequest
  ): Promise<ApiPaginationResult<ProductAttributeResponse[]>> {
    const query = qs.stringify(params, { encode: true });
    const url = `/${this.endpoint}/${attributeId}/terms?${query}`;
    const { data, error, headers } = await doGet<ProductAttributeResponse[]>(
      url
    );

    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }
}
