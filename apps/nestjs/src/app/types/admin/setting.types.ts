import {
  AdminSettingSchema,
  AdminSettingRequestSchema,
  AdminSettingGroupSchema,
} from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminSetting extends createZodDto(AdminSettingSchema) {}
export class ApiAdminSettingRequest extends createZodDto(
  AdminSettingRequestSchema
) {}
export class ApiAdminSettingGroup extends createZodDto(
  AdminSettingGroupSchema
) {}
