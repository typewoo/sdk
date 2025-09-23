import { BaseService } from '../base.service.js';
import {
  WcAdminTax,
  WcAdminTaxRequest,
  WcAdminTaxQueryParams,
  WcAdminTaxClass,
  WcAdminTaxClassRequest,
  WcAdminTaxClassQueryParams,
} from '../../types/admin/tax.types.js';
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
 * WooCommerce REST API Tax Service
 *
 * Manages taxes through the WooCommerce REST API (wp-json/wc/v3/taxes)
 */
export class WcAdminTaxService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes';

  /**
   * List taxes
   */
  async list(
    params?: WcAdminTaxQueryParams
  ): Promise<ApiPaginationResult<WcAdminTax[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminTax[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single tax by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<WcAdminTax>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminTax>(url);
    return { data, error };
  }

  /**
   * Create a new tax
   */
  async create(tax: WcAdminTaxRequest): Promise<ApiResult<WcAdminTax>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<WcAdminTax, WcAdminTaxRequest>(
      url,
      tax
    );

    return { data, error };
  }

  /**
   * Update a tax
   */
  async update(
    id: number,
    tax: WcAdminTaxRequest
  ): Promise<ApiResult<WcAdminTax>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<WcAdminTax, WcAdminTaxRequest>(
      url,
      tax
    );

    return { data, error };
  }

  /**
   * Delete a tax
   */
  async delete(id: number, force = true): Promise<ApiResult<WcAdminTax>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<WcAdminTax>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete taxes
   */
  async batch(operations: {
    create?: WcAdminTaxRequest[];
    update?: Array<WcAdminTaxRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: WcAdminTax[];
      update: WcAdminTax[];
      delete: WcAdminTax[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: WcAdminTax[];
        update: WcAdminTax[];
        delete: WcAdminTax[];
      },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}

/**
 * WooCommerce REST API Tax Classes Service
 *
 * Manages tax classes through the WooCommerce REST API (wp-json/wc/v3/taxes/classes)
 */
export class WcAdminTaxClassService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes/classes';

  /**
   * List tax classes
   */
  async list(
    params?: WcAdminTaxClassQueryParams
  ): Promise<ApiResult<WcAdminTaxClass[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminTaxClass[]>(url);
    return { data, error };
  }

  /**
   * Get single tax class by slug
   */
  async get(slug: string): Promise<ApiResult<WcAdminTaxClass[]>> {
    const url = `/${this.endpoint}/${slug}`;

    const { data, error } = await doGet<WcAdminTaxClass[]>(url);
    return { data, error };
  }

  /**
   * Create a new tax class
   */
  async create(
    taxClass: WcAdminTaxClassRequest
  ): Promise<ApiResult<WcAdminTaxClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminTaxClass,
      WcAdminTaxClassRequest
    >(url, taxClass);

    return { data, error };
  }

  /**
   * Delete a tax class
   */
  async delete(
    slug: string,
    force = true
  ): Promise<ApiResult<WcAdminTaxClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${slug}?${query}`;
    const { data, error } = await doDelete<WcAdminTaxClass>(url);

    return { data, error };
  }
}
