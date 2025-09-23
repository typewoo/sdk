import { BaseService } from '../base.service.js';
import {
  WcAdminShippingZone,
  WcAdminShippingZoneRequest,
  WcAdminShippingZoneQueryParams,
  WcAdminShippingZoneLocation,
  WcAdminShippingZoneLocationRequest,
  WcAdminShippingZoneMethod,
  WcAdminShippingZoneMethodRequest,
  WcAdminShippingZoneMethodQueryParams,
} from '../../types/admin/shipping-zone.types.js';
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
 * WooCommerce REST API Shipping Zones Service
 *
 * Manages shipping zones through the WooCommerce REST API (wp-json/wc/v3/shipping/zones)
 */
export class WcAdminShippingZoneService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/shipping/zones';

  /**
   * List shipping zones
   */
  async list(
    params?: WcAdminShippingZoneQueryParams
  ): Promise<ApiPaginationResult<WcAdminShippingZone[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminShippingZone[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping zone by ID
   */
  async get(
    id: number,
    params?: WcAdminShippingZoneQueryParams
  ): Promise<ApiResult<WcAdminShippingZone>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${id}${query ? `?${query}` : ''}`;

    const { data, error } = await doGet<WcAdminShippingZone>(url);
    return { data, error };
  }

  /**
   * Create a new shipping zone
   */
  async create(
    zone: WcAdminShippingZoneRequest
  ): Promise<ApiResult<WcAdminShippingZone>> {
    const url = `/${this.endpoint}`;
    const { data, error } = await doPost<
      WcAdminShippingZone,
      WcAdminShippingZoneRequest
    >(url, zone);
    return { data, error };
  }

  /**
   * Update a shipping zone
   */
  async update(
    id: number,
    zone: WcAdminShippingZoneRequest
  ): Promise<ApiResult<WcAdminShippingZone>> {
    const url = `/${this.endpoint}/${id}`;
    const { data, error } = await doPut<
      WcAdminShippingZone,
      WcAdminShippingZoneRequest
    >(url, zone);
    return { data, error };
  }

  /**
   * Delete a shipping zone
   */
  async delete(
    id: number,
    force = false
  ): Promise<ApiResult<WcAdminShippingZone>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${id}${query}`;
    const { data, error } = await doDelete<WcAdminShippingZone>(url);
    return { data, error };
  }

  /**
   * List shipping zone locations
   */
  async listLocations(
    zoneId: number
  ): Promise<ApiResult<WcAdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doGet<WcAdminShippingZoneLocation[]>(url);
    return { data, error };
  }

  /**
   * Update shipping zone locations
   */
  async updateLocations(
    zoneId: number,
    locations: WcAdminShippingZoneLocationRequest[]
  ): Promise<ApiResult<WcAdminShippingZoneLocation[]>> {
    const url = `/${this.endpoint}/${zoneId}/locations`;
    const { data, error } = await doPut<
      WcAdminShippingZoneLocation[],
      WcAdminShippingZoneLocationRequest[]
    >(url, locations);
    return { data, error };
  }

  /**
   * List shipping zone methods
   */
  async listMethods(
    zoneId: number,
    params?: WcAdminShippingZoneMethodQueryParams
  ): Promise<ApiPaginationResult<WcAdminShippingZoneMethod[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods${
      query ? `?${query}` : ''
    }`;

    const { data, error, headers } = await doGet<WcAdminShippingZoneMethod[]>(
      url
    );

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single shipping zone method
   */
  async getMethod(
    zoneId: number,
    instanceId: number,
    params?: WcAdminShippingZoneMethodQueryParams
  ): Promise<ApiResult<WcAdminShippingZoneMethod>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<WcAdminShippingZoneMethod>(url);
    return { data, error };
  }

  /**
   * Add shipping method to zone
   */
  async addMethod(
    zoneId: number,
    methodId: string,
    params?: WcAdminShippingZoneMethodRequest
  ): Promise<ApiResult<WcAdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods`;
    const body = { method_id: methodId, ...params };
    const { data, error } = await doPost<
      WcAdminShippingZoneMethod,
      typeof body
    >(url, body);
    return { data, error };
  }

  /**
   * Update shipping zone method
   */
  async updateMethod(
    zoneId: number,
    instanceId: number,
    method: WcAdminShippingZoneMethodRequest
  ): Promise<ApiResult<WcAdminShippingZoneMethod>> {
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}`;
    const { data, error } = await doPut<
      WcAdminShippingZoneMethod,
      WcAdminShippingZoneMethodRequest
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
  ): Promise<ApiResult<WcAdminShippingZoneMethod>> {
    const query = force ? '?force=true' : '';
    const url = `/${this.endpoint}/${zoneId}/methods/${instanceId}${query}`;
    const { data, error } = await doDelete<WcAdminShippingZoneMethod>(url);
    return { data, error };
  }
}
