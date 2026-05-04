import { schemaRegistry } from '../../schema-registry.js';
import { BatchRequestSchema } from './batch.request.js';
import { BatchResponseSchema } from './batch.response.js';

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

export * from './batch.request.js';
export * from './batch.response.js';
