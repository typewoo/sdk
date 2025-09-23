import { BaseService } from '../base.service.js';
import {
  WcAdminSetting,
  WcAdminSettingRequest,
  WcAdminSettingGroup,
} from '../../types/admin/setting.types.js';
import { ApiResult } from '../../types/api.js';
import { doGet, doPut, doPost } from '../../utilities/axios.utility.js';

/**
 * WooCommerce REST API Settings Service
 *
 * Manages settings through the WooCommerce REST API (wp-json/wc/v3/settings)
 */
export class WcAdminSettingService extends BaseService {
  private readonly endpoint = 'wp-json/wc/v3/settings';

  /**
   * List setting groups
   */
  async listGroups(): Promise<ApiResult<WcAdminSettingGroup[]>> {
    const url = `/${this.endpoint}`;

    const { data, error } = await doGet<WcAdminSettingGroup[]>(url);
    return { data, error };
  }

  /**
   * List settings in a group
   */
  async listSettings(groupId: string): Promise<ApiResult<WcAdminSetting[]>> {
    const url = `/${this.endpoint}/${groupId}`;

    const { data, error } = await doGet<WcAdminSetting[]>(url);
    return { data, error };
  }

  /**
   * Get single setting
   */
  async getSetting(
    groupId: string,
    settingId: string
  ): Promise<ApiResult<WcAdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;

    const { data, error } = await doGet<WcAdminSetting>(url);
    return { data, error };
  }

  /**
   * Update a setting
   */
  async updateSetting(
    groupId: string,
    settingId: string,
    setting: WcAdminSettingRequest
  ): Promise<ApiResult<WcAdminSetting>> {
    const url = `/${this.endpoint}/${groupId}/${settingId}`;
    const { data, error } = await doPut<WcAdminSetting, WcAdminSettingRequest>(
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
      update?: Array<WcAdminSettingRequest & { id: string }>;
    }
  ): Promise<ApiResult<{ update: WcAdminSetting[] }>> {
    const url = `/${this.endpoint}/${groupId}/batch`;
    const { data, error } = await doPost<
      { update: WcAdminSetting[] },
      typeof operations
    >(url, operations);

    return { data, error };
  }

  /**
   * Batch update multiple settings across groups
   */
  async batchUpdate(operations: {
    update?: Array<WcAdminSettingRequest & { group: string; id: string }>;
  }): Promise<ApiResult<{ update: WcAdminSetting[] }>> {
    const url = `/${this.endpoint}/batch`;
    const { data, error } = await doPost<
      { update: WcAdminSetting[] },
      typeof operations
    >(url, operations);

    return { data, error };
  }
}
