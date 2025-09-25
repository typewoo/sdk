#!/usr/bin/env node

import { readFileSync } from 'fs';

const baseline = JSON.parse(
  readFileSync('snapshots/api-structure/admin/baseline.json', 'utf8')
);
const routes = Object.keys(baseline.routes);

console.log('=== WooCommerce Admin REST API Coverage Analysis ===\n');

// Filter out marketplace and extension-specific endpoints
const coreRoutes = routes.filter(
  (r) =>
    !r.includes('marketplace') &&
    !r.includes('brands') &&
    !r.includes('layouts') &&
    !r.includes('layout-templates')
);

// Group routes by main category
const categories = {
  Products: coreRoutes.filter(
    (r) => r.startsWith('products') && !r.match(/\(\?P<id>.*\)$/)
  ),
  Orders: coreRoutes.filter(
    (r) => r.startsWith('orders') && !r.match(/\(\?P<id>.*\)$/)
  ),
  Customers: coreRoutes.filter(
    (r) => r.startsWith('customers') && !r.match(/\(\?P<id>.*\)$/)
  ),
  Coupons: coreRoutes.filter(
    (r) => r.startsWith('coupons') && !r.match(/\(\?P<id>.*\)$/)
  ),
  Reports: coreRoutes.filter((r) => r.startsWith('reports')),
  Settings: coreRoutes.filter((r) => r.startsWith('settings')),
  Shipping: coreRoutes.filter((r) => r.startsWith('shipping')),
  Taxes: coreRoutes.filter((r) => r.startsWith('tax')),
  Webhooks: coreRoutes.filter((r) => r.startsWith('webhooks')),
  System: coreRoutes.filter((r) => r.startsWith('system_status')),
  Data: coreRoutes.filter((r) => r.startsWith('data')),
  Payment: coreRoutes.filter((r) => r.startsWith('payment_gateways')),
  Refunds: coreRoutes.filter((r) => r.startsWith('refunds')),
  'Shipping Methods': coreRoutes.filter((r) =>
    r.startsWith('shipping_methods')
  ),
};

// SDK Implementation mapping
const sdkImplementations = {
  Products: [
    'WcAdminProductService',
    'WcAdminProductCategoryService',
    'WcAdminProductTagService',
    'WcAdminProductAttributeService',
    'WcAdminProductReviewService',
    'WcAdminShippingClassService',
  ],
  Orders: ['WcAdminOrderService'],
  Customers: ['WcAdminCustomerService'],
  Coupons: ['WcAdminCouponService'],
  Reports: ['WcAdminReportService'],
  Settings: ['WcAdminSettingService'],
  Shipping: ['WcAdminShippingZoneService'],
  Taxes: ['WcAdminTaxService', 'WcAdminTaxClassService'],
  Webhooks: ['WcAdminWebhookService'],
  System: ['WcAdminSystemStatusService'],
  Data: ['WcAdminDataService'],
  Payment: ['WcAdminPaymentGatewayService'],
  Refunds: ['WcAdminRefundService'],
  'Shipping Methods': ['WcAdminShippingMethodService'],
};

Object.entries(categories).forEach(([category, endpoints]) => {
  if (endpoints.length > 0) {
    const implementations = sdkImplementations[category] || [];
    const status = implementations.length > 0 ? '✅ IMPLEMENTED' : '❌ MISSING';

    console.log(`${category} (${endpoints.length} endpoints) - ${status}`);
    if (implementations.length > 0) {
      console.log(`   SDK Services: ${implementations.join(', ')}`);
    }
    console.log(`   API Endpoints:`);
    endpoints.forEach((endpoint) => {
      console.log(`     • ${endpoint}`);
    });
    console.log('');
  }
});

console.log(`📊 SUMMARY:`);
console.log(`   Core Admin API Endpoints: ${coreRoutes.length}`);
console.log(
  `   SDK Service Categories: ${Object.keys(sdkImplementations).length}`
);
console.log(`   Total All Endpoints (including extensions): ${routes.length}`);

// Count individual routes vs ID-specific routes
const individualRoutes = coreRoutes.filter((r) => !r.match(/\(\?P<id>.*\)$/));
const idRoutes = coreRoutes.filter((r) => r.match(/\(\?P<id>.*\)$/));

console.log(`\n📈 ENDPOINT BREAKDOWN:`);
console.log(`   Collection endpoints: ${individualRoutes.length}`);
console.log(`   Individual resource endpoints: ${idRoutes.length}`);
