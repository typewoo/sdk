import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { ProductAttributeResponse } from '../../types/index.js';

/**
 * Product Attributes API
 */
export class ProductAttributeService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/attributes';

  /**
   * List Product Attributes
   * @returns {ProductAttributeResponse[]}
   */
  async list(): Promise<ApiPaginationResult<ProductAttributeResponse[]>> {
    const url = `/${this.endpoint}`;
    const { data, error, headers } = await doGet<ProductAttributeResponse[]>(
      url
    );

    const { total, totalPages, link } = extractPagination(headers);
    return { data, error, total, totalPages, link };
  }

  /**
   * Single Product Attribute
   * @param id The ID of the attribute to retrieve.
   * @returns {ProductAttributeResponse}
   */
  async single(id: number): Promise<ApiResult<ProductAttributeResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doGet<ProductAttributeResponse>(url);
    return { data, error };
  }
}
