import { BaseService } from '../base.service.js';
import { doGet, doPut, doPost } from '../../http/http.js';
import { ApiResult } from '../../types/api.js';
import {
  AdminSettingGroup,
  AdminSetting,
  AdminSettingRequest,
} from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * WooCommerce REST API Settings Service
 *
 * Manages settings through the WooCommerce REST API (wp-json/wc/v3/settings)
 */
export class AdminSettingService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/settings';

  /**
   * List setting groups
   */
  async listGroups(
    options?: RequestOptions,
  ): Promise<ApiResult<AdminSettingGroup[]>> {
    const url = `/${this.endpoint}`;

    const { data, error } = await doGet<AdminSettingGroup[]>(url, options);
    return { data, error };
  }

  /**
   * List settings in a group
   */
  async listSettings(
    groupId: string,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminSetting[]>> {
    const url = `/${this.endpoint}/${groupId}`;

    const { data, error } = await doGet<AdminSetting[]>(url, options);
    return { data, error };
  }

  /**
   * Get single setting
   */
  async getSetting(
    groupId: string,
    settingId: string,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;

    const { data, error } = await doGet<AdminSetting>(url, options);
    return { data, error };
  }

  /**
   * Update a setting
   */
  async updateSetting(
    groupId: string,
    settingId: string,
    setting: AdminSettingRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<AdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;
    const { data, error } = await doPut<AdminSetting, AdminSettingRequest>(
      url,
      setting,
      options,
    );

    return { data, error };
  }

  /**
   * Batch update settings in a group
   */
  async batchUpdateSettings(
    groupId: string,
    operations: {
      update?: Array<AdminSettingRequest & { id: string }>;
    },
    options?: RequestOptions,
  ): Promise<ApiResult<{ update: AdminSetting[] }>> {
    const url = `/${this.endpoint}/${groupId}/batch`;
    const { data, error } = await doPost<
      { update: AdminSetting[] },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }

  /**
   * Batch update multiple settings across groups
   */
  async batchUpdate(
    operations: {
      update?: Array<AdminSettingRequest & { group: string; id: string }>;
    },
    options?: RequestOptions,
  ): Promise<ApiResult<{ update: AdminSetting[] }>> {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      { update: AdminSetting[] },
      typeof operations
    >(url, operations, options);

    return { data, error };
  }
}
