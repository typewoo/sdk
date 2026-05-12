import { schemaRegistry } from '../../schema-registry.js';
import { BatchRequestSchema } from './batch.create.schema.js';
import { BatchResponseSchema } from './batch.schema.js';

schemaRegistry.add(BatchResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/batch',
  kind: 'response',
});
schemaRegistry.add(BatchRequestSchema, {
  surface: 'store',
  route: '/wc/store/v1/batch',
  kind: 'request',
  method: 'POST',
});

export * from './batch.create.schema.js';
export * from './batch.schema.js';
