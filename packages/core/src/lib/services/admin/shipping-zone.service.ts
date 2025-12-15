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
  AdminShippingZoneQueryParams,
  AdminShippingZone,
  AdminShippingZoneRequest,
  AdminShippingZoneLocation,
  AdminShippingZoneLocationRequest,
  AdminShippingZoneMethodQueryParams,
  AdminShippingZoneMethod,
  AdminShippingZoneMethodRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Shipping Zones Service
 *
 * Manages shipping zones through the WooCommerce REST API (wp-json/wc/v3/shipping/zones)
 */
export class AdminShippingZoneService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/shipping/zones';

  /**
   * List shipping zones
   */
  async list(
    params?: AdminShippingZoneQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminShippingZone[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminShippingZone[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single shipping zone by ID
   */
  async get(
    id: number,
    params?: AdminShippingZoneQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZone>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminShippingZone>(url, options);
    return { data, error };
  }

  /**
   * Create a new shipping zone
   */
  async create(
    zone: AdminShippingZoneRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZone>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminShippingZone,
      AdminShippingZoneRequest
    >(url, zone, options);
    return { data, error };
  }

  /**
   * Update a shipping zone
   */
  async update(
    id: number,
    zone: AdminShippingZoneRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZone>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminShippingZone,
      AdminShippingZoneRequest
    >(url, zone, options);
    return { data, error };
  }

  /**
   * Delete a shipping zone
   */
  async delete(
    id: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZone>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${id}${query}`;
    const { data, error } = await doDelete<AdminShippingZone>(url, options);
    return { data, error };
  }

  /**
   * List shipping zone locations
   */
  async listLocations(
    zoneId: number,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doGet<AdminShippingZoneLocation[]>(
      url,
      options
    );
    return { data, error };
  }

  /**
   * Update shipping zone locations
   */
  async updateLocations(
    zoneId: number,
    locations: AdminShippingZoneLocationRequest[],
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doPut<
      AdminShippingZoneLocation[],
      AdminShippingZoneLocationRequest[]
    >(url, locations, options);
    return { data, error };
  }

  /**
   * List shipping zone methods
   */
  async listMethods(
    zoneId: number,
    params?: AdminShippingZoneMethodQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminShippingZoneMethod[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<AdminShippingZoneMethod[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single shipping zone method
   */
  async getMethod(
    zoneId: number,
    instanceId: number,
    params?: AdminShippingZoneMethodQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminShippingZoneMethod>(url, options);
    return { data, error };
  }

  /**
   * Add shipping method to zone
   */
  async addMethod(
    zoneId: number,
    methodId: string,
    params?: AdminShippingZoneMethodRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods`;
    const body = { method_id: methodId, ...params };
    const { data, error } = await doPost<AdminShippingZoneMethod, typeof body>(
      url,
      body,
      options
    );
    return { data, error };
  }

  /**
   * Update shipping zone method
   */
  async updateMethod(
    zoneId: number,
    instanceId: number,
    method: AdminShippingZoneMethodRequest,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}`;
    const { data, error } = await doPut<
      AdminShippingZoneMethod,
      AdminShippingZoneMethodRequest
    >(url, method, options);
    return { data, error };
  }

  /**
   * Delete shipping zone method
   */
  async deleteMethod(
    zoneId: number,
    instanceId: number,
    force = false,
    options?: RequestOptions
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${query}`;
    const { data, error } = await doDelete<AdminShippingZoneMethod>(
      url,
      options
    );
    return { data, error };
  }
}
