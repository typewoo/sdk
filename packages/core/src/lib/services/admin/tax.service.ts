import { BaseService } from '../base.service.js';
import {
  doGet,
  doPost,
  doPut,
  doDelete,
} from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminTaxQueryParams,
  AdminTax,
  AdminTaxRequest,
  AdminTaxClassQueryParams,
  AdminTaxClass,
  AdminTaxClassRequest,
} from '../../types/index.js';

/**
 * WooCommerce REST API Tax Service
 *
 * Manages taxes through the WooCommerce REST API (wp-json/wc/v3/taxes)
 */
export class AdminTaxService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes';

  /**
   * List taxes
   */
  async list(
    params?: AdminTaxQueryParams
  ): Promise<ApiPaginationResult<AdminTax[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminTax[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single tax by ID
   */
  async get(
    id: number,
    params?: { context?: 'view' | 'edit' }
  ): Promise<ApiResult<AdminTax>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTax>(url);
    return { data, error };
  }

  /**
   * Create a new tax
   */
  async create(tax: AdminTaxRequest): Promise<ApiResult<AdminTax>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminTax, AdminTaxRequest>(url, tax);

    return { data, error };
  }

  /**
   * Update a tax
   */
  async update(id: number, tax: AdminTaxRequest): Promise<ApiResult<AdminTax>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<AdminTax, AdminTaxRequest>(url, tax);

    return { data, error };
  }

  /**
   * Delete a tax
   */
  async delete(id: number, force = true): Promise<ApiResult<AdminTax>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${id}?${query}`;
    const { data, error } = await doDelete<AdminTax>(url);

    return { data, error };
  }

  /**
   * Batch create/update/delete taxes
   */
  async batch(operations: {
    create?: AdminTaxRequest[];
    update?: Array<AdminTaxRequest & { id: number }>;
    delete?: number[];
  }): Promise<
    ApiResult<{
      create: AdminTax[];
      update: AdminTax[];
      delete: AdminTax[];
    }>
  > {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      {
        create: AdminTax[];
        update: AdminTax[];
        delete: AdminTax[];
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
export class AdminTaxClassService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/taxes/classes';

  /**
   * List tax classes
   */
  async list(
    params?: AdminTaxClassQueryParams
  ): Promise<ApiResult<AdminTaxClass[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminTaxClass[]>(url);
    return { data, error };
  }

  /**
   * Get single tax class by slug
   */
  async get(slug: string): Promise<ApiResult<AdminTaxClass[]>> {
    const url = `/${this.endpoint}/${slug}`;

    const { data, error } = await doGet<AdminTaxClass[]>(url);
    return { data, error };
  }

  /**
   * Create a new tax class
   */
  async create(
    taxClass: AdminTaxClassRequest
  ): Promise<ApiResult<AdminTaxClass>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<AdminTaxClass, AdminTaxClassRequest>(
      url,
      taxClass
    );

    return { data, error };
  }

  /**
   * Delete a tax class
   */
  async delete(slug: string, force = true): Promise<ApiResult<AdminTaxClass>> {
    const query = qs.stringify({ force }, { encode: false });
    const url = `/${this.endpoint}/${slug}?${query}`;
    const { data, error } = await doDelete<AdminTaxClass>(url);

    return { data, error };
  }
}
