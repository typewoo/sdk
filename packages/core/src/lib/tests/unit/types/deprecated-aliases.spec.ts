import { describe, it, expect } from 'vitest';
import * as sdk from '../../../../index.js';
import type {
  AdminProductRequest,
  AdminProductUpdateRequest,
  AdminTaxClassRequest,
} from '../../../../index.js';

describe('deprecated 3.x request aliases', () => {
  it('point each 3.x schema name at the update (or only) variant', () => {
    expect(sdk.AdminProductRequestSchema).toBe(
      sdk.AdminProductUpdateRequestSchema
    );
    expect(sdk.AdminWebhookRequestSchema).toBe(
      sdk.AdminWebhookUpdateRequestSchema
    );
    expect(sdk.AdminOrderNoteRequestSchema).toBe(
      sdk.AdminOrderNoteCreateRequestSchema
    );
    expect(sdk.AdminTaxClassRequestSchema).toBe(
      sdk.AdminTaxClassCreateRequestSchema
    );
  });

  it('keep the 3.x type names assignable', () => {
    const product: AdminProductRequest = { name: 'Shirt' };
    const update: AdminProductUpdateRequest = product;
    const taxClass: AdminTaxClassRequest = { name: 'Reduced' };
    expect(update.name).toBe('Shirt');
    expect(taxClass.name).toBe('Reduced');
  });
});
