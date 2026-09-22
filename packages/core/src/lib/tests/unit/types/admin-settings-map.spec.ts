import { describe, expect, it } from 'vitest';
import { AdminShippingZoneMethodSchema } from '../../../types/admin/shipping-zones/shipping-zone-method.schema.js';
import { AdminPaymentGatewaySchema } from '../../../types/admin/payment-gateways/payment-gateway.schema.js';

// Shapes as returned by WooCommerce 11.1.1: `settings` is a map keyed by
// setting ID, not a single setting.
describe('admin settings maps', () => {
  it('parses a flat_rate method whose settings include one named "type"', () => {
    const method = {
      instance_id: 3,
      title: 'Flat rate',
      method_id: 'flat_rate',
      method_title: 'Flat rate',
      method_description: 'Charge a fixed rate.',
      settings: {
        title: { id: 'title', type: 'text', value: 'Flat rate' },
        cost: { id: 'cost', type: 'text', value: '5' },
        // Present when the store has shipping classes.
        type: {
          id: 'type',
          type: 'select',
          value: 'class',
          options: { class: 'Per class', order: 'Per order' },
        },
      },
      _links: {
        self: [{ href: 'x' }],
        collection: [{ href: 'x' }],
        describes: [{ href: 'x' }],
      },
    };

    const result = AdminShippingZoneMethodSchema.safeParse(method);
    expect(result.success).toBe(true);
    expect(result.data?.settings?.['type']?.value).toBe('class');
  });

  it('accepts setting types beyond the core list and array values', () => {
    const gateway = {
      id: 'cod',
      settings: {
        title: { id: 'title', type: 'safe_text', value: 'Cash on delivery' },
        enable_for_methods: {
          id: 'enable_for_methods',
          type: 'multiselect',
          value: ['flat_rate', 'local_pickup'],
          // Grouped options, as COD returns them.
          options: {
            'Flat rate': { flat_rate: 'Any "Flat rate" method' },
            'Local pickup': { local_pickup: 'Any "Local pickup" method' },
          },
        },
      },
      _links: { self: [{ href: 'x' }], collection: [{ href: 'x' }] },
    };

    expect(
      AdminPaymentGatewaySchema.shape.settings.safeParse(gateway.settings)
        .success
    ).toBe(true);
  });
});
