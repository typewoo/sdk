import { schemaRegistry } from '../../schema-registry.js';
import { CartCouponResponseSchema } from './cart.coupon.response.js';

schemaRegistry.add(CartCouponResponseSchema, {
  surface: 'store',
  route: '/wc/store/v1/cart/coupons',
  kind: 'response',
});

export * from './cart.coupon.response.js';
export * from './cart.coupon.total.response.js';
