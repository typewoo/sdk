import { schemaRegistry } from '../../schema-registry.js';
import { AdminSettingSchema } from './setting.schema.js';
import { AdminSettingUpdateRequestSchema } from './setting.update.schema.js';
import { AdminSettingGroupSchema } from './setting-group.schema.js';

schemaRegistry.add(AdminSettingGroupSchema, {
  surface: 'admin',
  route: '/wc/v3/settings',
  kind: 'response',
});
schemaRegistry.add(AdminSettingSchema, {
  surface: 'admin',
  route: '/wc/v3/settings/(?P<group_id>[\\w-]+)',
  kind: 'response',
});
schemaRegistry.add(AdminSettingUpdateRequestSchema, {
  surface: 'admin',
  route: '/wc/v3/settings/(?P<group_id>[\\w-]+)/(?P<id>[\\w-]+)',
  kind: 'request',
  method: 'PUT',
});

export * from './setting.schema.js';
export * from './setting.update.schema.js';
export * from './setting-group.schema.js';
