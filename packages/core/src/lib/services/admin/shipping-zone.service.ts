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
    params?: AdminShippingZoneQueryParams
  ): Promise<ApiPaginationResult<AdminShippingZone[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminShippingZone[]>(url);

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping zone by ID
   */
  async get(
    id: number,
    params?: AdminShippingZoneQueryParams
  ): Promise<ApiResult<AdminShippingZone>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<AdminShippingZone>(url);
    return { data, error };
  }

  /**
   * Create a new shipping zone
   */
  async create(
    zone: AdminShippingZoneRequest
  ): Promise<ApiResult<AdminShippingZone>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      AdminShippingZone,
      AdminShippingZoneRequest
    >(url, zone);
    return { data, error };
  }

  /**
   * Update a shipping zone
   */
  async update(
    id: number,
    zone: AdminShippingZoneRequest
  ): Promise<ApiResult<AdminShippingZone>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      AdminShippingZone,
      AdminShippingZoneRequest
    >(url, zone);
    return { data, error };
  }

  /**
   * Delete a shipping zone
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<AdminShippingZone>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${id}${query}`;
    const { data, error } = await doDelete<AdminShippingZone>(url);
    return { data, error };
  }

  /**
   * List shipping zone locations
   */
  async listLocations(
    zoneId: number
  ): Promise<ApiResult<AdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doGet<AdminShippingZoneLocation[]>(url);
    return { data, error };
  }

  /**
   * Update shipping zone locations
   */
  async updateLocations(
    zoneId: number,
    locations: AdminShippingZoneLocationRequest[]
  ): Promise<ApiResult<AdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doPut<
      AdminShippingZoneLocation[],
      AdminShippingZoneLocationRequest[]
    >(url, locations);
    return { data, error };
  }

  /**
   * List shipping zone methods
   */
  async listMethods(
    zoneId: number,
    params?: AdminShippingZoneMethodQueryParams
  ): Promise<ApiPaginationResult<AdminShippingZoneMethod[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<AdminShippingZoneMethod[]>(
      url
    );

    const { total, totalPages, link } = extractPagination(headers);

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping zone method
   */
  async getMethod(
    zoneId: number,
    instanceId: number,
    params?: AdminShippingZoneMethodQueryParams
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminShippingZoneMethod>(url);
    return { data, error };
  }

  /**
   * Add shipping method to zone
   */
  async addMethod(
    zoneId: number,
    methodId: string,
    params?: AdminShippingZoneMethodRequest
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods`;
    const body = { method_id: methodId, ...params };
    const { data, error } = await doPost<AdminShippingZoneMethod, typeof body>(
      url,
      body
    );
    return { data, error };
  }

  /**
   * Update shipping zone method
   */
  async updateMethod(
    zoneId: number,
    instanceId: number,
    method: AdminShippingZoneMethodRequest
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}`;
    const { data, error } = await doPut<
      AdminShippingZoneMethod,
      AdminShippingZoneMethodRequest
    >(url, method);
    return { data, error };
  }

  /**
   * Delete shipping zone method
   */
  async deleteMethod(
    zoneId: number,
    instanceId: number,
    force = false
  ): Promise<ApiResult<AdminShippingZoneMethod>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${query}`;
    const { data, error } = await doDelete<AdminShippingZoneMethod>(url);
    return { data, error };
  }
}
