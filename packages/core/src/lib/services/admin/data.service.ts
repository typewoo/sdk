import { BaseService } from '../base.service.js';
import { doGet } from '../../utilities/axios.utility.js';
import { extractPagination } from '../../utilities/common.js';
import * as qs from 'qs';
import { ApiPaginationResult, ApiResult } from '../../types/api.js';
import {
  AdminDataQueryParams,
  AdminCountry,
  AdminCurrency,
  AdminContinent,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Data Service
 *
 * Manages data endpoints through the WooCommerce REST API (wp-json/wc/v3/data)
 */
export class AdminDataService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/data';

  /**
   * List countries
   */
  async listCountries(
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminCountry[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/countries${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCountry[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single country by code
   */
  async getCountry(
    code: string,
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCountry>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/countries/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminCountry>(url, options);
    return { data, error };
  }

  /**
   * List currencies
   */
  async listCurrencies(
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminCurrency[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/currencies${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminCurrency[]>(url, options);

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single currency by code
   */
  async getCurrency(
    code: string,
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminCurrency>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/currencies/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminCurrency>(url, options);
    return { data, error };
  }

  /**
   * List continents
   */
  async listContinents(
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiPaginationResult<AdminContinent[]>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/continents${query ? `?${query}` : ''}`;

    const { data, error, headers } = await doGet<AdminContinent[]>(
      url,
      options
    );

    const pagination = extractPagination(headers);

    return { data, error, pagination };
  }

  /**
   * Get single continent by code
   */
  async getContinent(
    code: string,
    params?: AdminDataQueryParams,
    options?: RequestOptions
  ): Promise<ApiResult<AdminContinent>> {
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `/${this.endpoint}/continents/${code}${
      query ? `?${query}` : ''
    }`;

    const { data, error } = await doGet<AdminContinent>(url, options);
    return { data, error };
  }
}
