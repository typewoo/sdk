import { BaseService } from '../base.service.js';
import {
  AdminTaxonomyTag,
  AdminTaxonomyTagRequest,
  AdminTaxonomyTagQueryParams,
} from '../../types/admin/taxonomy.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Product Tags Service
 *
 * Manages product tags through the WooCommerce REST API (wp-json/wc/v3/products/tags)
 */
export class AdminProductTagService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/products/tags';

  /**
   * List product tags
   */
  async list(
    params?: AdminTaxonomyTagQueryParams
  ): Promise<ApiPaginationResult<AdminTaxonomyTag[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTaxonomyTag[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single product tag by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxonomyTag>(url);
    return { data, error };
  }

  /**
   * Create a new product tag
   */
  async create(
    tag: AdminTaxonomyTagRequest
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminTaxonomyTag,
      AdminTaxonomyTagRequest
    >(url, tag);

    return { data, error };
  }

  /**
   * Update a product tag
   */
  async update(
    id: number,
    tag: AdminTaxonomyTagRequest
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminTaxonomyTag,
      AdminTaxonomyTagRequest
    >(url, tag);

    return { data, error };
  }

  /**
   * Delete a product tag
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<AdminTaxonomyTag>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTaxonomyTag>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete product tags
   */
  async batch(operations: {
    create?: AdminTaxonomyTagRequest[];
    update?: Array<AdminTaxonomyTagRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminTaxonomyTag[];
      update: AdminTaxonomyTag[];
      delete: AdminTaxonomyTag[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminTaxonomyTag[];
        update: AdminTaxonomyTag[];
        delete: AdminTaxonomyTag[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
