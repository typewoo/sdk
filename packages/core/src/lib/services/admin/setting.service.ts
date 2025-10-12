import { BaseService } from '../base.service.js';
import {
  AdminSetting,
  AdminSettingRequest,
  AdminSettingGroup,
} from '../../types/admin/setting.types.js';
import { ApiResult } from '../../types/api.js';
import { doGet, doPut, doPost } from '../../utilities/axios.utility.js';

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
  async listGroups(): Promise<ApiResult<AdminSettingGroup[]>> {
    const url = `/${this.endpoint}`;

    const { data, error } = await doGet<AdminSettingGroup[]>(url);
    return { data, error };
  }

  /**
   * List settings in a group
   */
  async listSettings(groupId: string): Promise<ApiResult<AdminSetting[]>> {
    const url = `/${this.endpoint}/${groupId}`;

    const { data, error } = await doGet<AdminSetting[]>(url);
    return { data, error };
  }

  /**
   * Get single setting
   */
  async getSetting(
    groupId: string,
    settingId: string
  ): Promise<ApiResult<AdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;

    const { data, error } = await doGet<AdminSetting>(url);
    return { data, error };
  }

  /**
   * Update a setting
   */
  async updateSetting(
    groupId: string,
    settingId: string,
    setting: AdminSettingRequest
  ): Promise<ApiResult<AdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;
    const { data, error } = await doPut<AdminSetting, AdminSettingRequest>(
      url,
      setting
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
    }
  ): Promise<ApiResult<{ update: AdminSetting[] }>> {
    const url = `/${this.endpoint}/${groupId}/batch`;
    const { data, error } = await doPost<
      { update: AdminSetting[] },
      typeof operations
    >(url, operations);

    return { data, error };
  }

  /**
   * Batch update multiple settings across groups
   */
  async batchUpdate(operations: {
    update?: Array<AdminSettingRequest & { group: string; id: string }>;
  }): Promise<ApiResult<{ update: AdminSetting[] }>> {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      { update: AdminSetting[] },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
