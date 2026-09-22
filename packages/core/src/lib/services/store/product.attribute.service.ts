import { BaseService } from '../base.service.js';
import { extractPagination } from '../../utilities/common.js';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import { ProductAttributeResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Product Attributes API
 */
export class ProductAttributeService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/products/attributes';

  /**
   * List Product Attributes
   * @returns {ProductAttributeResponse[]}
   */
  async list(
    options?: RequestOptions
  ): Promise<ApiPaginationResult<ProductAttributeResponse[]>> {
    const url = `/${this.endpoint}`;
    const { data, error, headers } = await this.http.get<
      ProductAttributeResponse[]
    >(url, options);

    const pagination = extractPagination(headers);
    return { data, error, pagination };
  }

  /**
   * Single Product Attribute
   * @param id The ID of the attribute to retrieve.
   * @returns {ProductAttributeResponse}
   */
  async single(
    id: number,
    options?: RequestOptions
  ): Promise<ApiResult<ProductAttributeResponse>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await this.http.get<ProductAttributeResponse>(
      url,
      options
    );
    return { data, error };
  }
}
