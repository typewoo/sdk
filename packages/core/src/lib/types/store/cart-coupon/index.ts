import { schemaRegistry } from '../../schema-registry.js';
import { CartCouponResponseSchema } from './cart.coupon.schema.js';

schemaRegistry.add(CartCouponResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/coupons',
  kind: 'response',
  alsoAt: ['/wc/store/v1/cart/coupons/(?P<code>[\\w-]+)'],
});

export * from './cart.coupon.schema.js';
export * from './cart.coupon.total.schema.js';
