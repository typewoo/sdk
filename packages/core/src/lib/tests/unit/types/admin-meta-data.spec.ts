import { describe, it, expect } from 'vitest';
import {
  AdminCouponSchema,
  AdminOrderCreateRequestSchema,
  AdminProductCreateRequestSchema,
  AdminProductSchema,
  type AdminProductCreateRequest,
} from '../../../../index.js';

const arrayMeta = {
  id: 7,
  key: '_wc_gallery_order',
  value: [3, 1, 2],
};

describe('admin meta_data', () => {
  it('accepts array meta values on every resource response', () => {
    for (const schema of [AdminProductSchema, AdminCouponSchema]) {
      expect(schema.shape.meta_data.safeParse([arrayMeta]).success).toBe(true);
    }
  });

  it('lets create requests add meta without an id', () => {
    const request: AdminProductCreateRequest = {
      name: 'Shirt',
      meta_data: [{ key: 'size_chart', value: 'eu' }],
    };
    expect(AdminProductCreateRequestSchema.safeParse(request).success).toBe(
      true
    );
    expect(
      AdminOrderCreateRequestSchema.safeParse({
        meta_data: [{ key: 'gift', value: true }],
      }).success
    ).toBe(true);
  });

  it('still requires a key on each entry', () => {
    expect(
      AdminProductCreateRequestSchema.safeParse({
        meta_data: [{ value: 'eu' }],
      }).success
    ).toBe(false);
  });
});
