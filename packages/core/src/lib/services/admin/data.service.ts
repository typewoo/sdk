import { BaseService } from '../base.service.js';
import {
  WcAdminCountry,
  WcAdminCurrency,
  WcAdminContinent,
  WcAdminDataQueryParams,
} from '../../types/admin/data.types.js';
import { ApiResult, ApiPaginationResult } from '../../types/api.js';
import { doGet } from '../../utilities/axios.utility.js';
import { parseLinkHeader } from '../../utilities/common.js';
import qs from 'qs';

/**
 * WooCommerce REST API Data Service
 *
 * Manages data endpoints through the WooCommerce REST API (wp-json/wc/v3/data)
 */
export class WcAdminDataService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/data';

  /**
   * List countries
   */
  async listCountries(
    params?: WcAdminDataQueryParams
  ): Promise<ApiPaginationResult<WcAdminCountry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/countries${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminCountry[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single country by code
   */
  async getCountry(
    code: string,
    params?: WcAdminDataQueryParams
  ): Promise<ApiResult<WcAdminCountry>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/countries/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<WcAdminCountry>(url);
    return { data, error };
  }

  /**
   * List currencies
   */
  async listCurrencies(
    params?: WcAdminDataQueryParams
  ): Promise<ApiPaginationResult<WcAdminCurrency[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/currencies${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminCurrency[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single currency by code
   */
  async getCurrency(
    code: string,
    params?: WcAdminDataQueryParams
  ): Promise<ApiResult<WcAdminCurrency>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/currencies/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<WcAdminCurrency>(url);
    return { data, error };
  }

  /**
   * List continents
   */
  async listContinents(
    params?: WcAdminDataQueryParams
  ): Promise<ApiPaginationResult<WcAdminContinent[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/continents${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<WcAdminContinent[]>(url);

    let total, totalPages, link;
    if (headers) {
      link = parseLinkHeader(headers['link']);
      total = headers['x-wp-total'];
      totalPages = headers['x-wp-totalpages'];
    }

    return { data, error, total, totalPages, link };
  }

  /**
   * Get single continent by code
   */
  async getContinent(
    code: string,
    params?: WcAdminDataQueryParams
  ): Promise<ApiResult<WcAdminContinent>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/continents/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<WcAdminContinent>(url);
    return { data, error };
  }
}
