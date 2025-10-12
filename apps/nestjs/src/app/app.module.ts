import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

// Services
import { WordPressHttpService } from './services/wordpress.http.service';
import { WordPressProxyService } from './services/wordpress-proxy.service';

// Store Controllers
import { ProductsController } from './controllers/store/products.controller';
import { ProductCategoriesController } from './controllers/store/product.categories.controller';
import { ProductTagsController } from './controllers/store/product.tags.controller';
import { ProductBrandsController } from './controllers/store/product.brands.controller';
import { ProductAttributesController } from './controllers/store/product.attributes.controller';
import { ProductReviewsController } from './controllers/store/product.reviews.controller';
import { ProductCollectionDataController } from './controllers/store/product.collection.data.controller';
import { CartController } from './controllers/store/cart.controller';
import { CartItemsController } from './controllers/store/cart.item.controller';
import { CartCouponsController } from './controllers/store/cart.coupon.controller';
import { CartExtensionsController } from './controllers/store/cart.extensions.controller';
import { CheckoutController } from './controllers/store/checkout.controller';
import { CheckoutOrderController } from './controllers/store/checkout.order.controller';
import { OrderController } from './controllers/store/order.controller';
import { BatchController } from './controllers/store/batch.controller';
import { ClerkProvider } from './clerk/clerk.provider';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from './clerk/clerk.auth.guard';
import { CoreAuthController } from './controllers/core/core.auth.controller';

// Admin Controllers
import { AdminAttributeTermController } from './controllers/admin/attribute-term.controller';
import { AdminProductAttributeController } from './controllers/admin/product-attribute.controller';
import { AdminCouponController } from './controllers/admin/coupon.controller';
import { AdminCustomerController } from './controllers/admin/customer.controller';
import { AdminOrderController } from './controllers/admin/order.controller';
import { AdminProductCategoryController } from './controllers/admin/product-category.controller';
import { AdminProductController } from './controllers/admin/product.controller';
import { AdminProductTagController } from './controllers/admin/product-tag.controller';
import { AdminRefundController } from './controllers/admin/refund.controller';
import { AdminShippingZoneController } from './controllers/admin/shipping-zone.controller';
import { AdminTaxController } from './controllers/admin/tax.controller';
import { AdminDataController } from './controllers/admin/data.controller';
import { AdminProductBrandController } from './controllers/admin/product-brand.controller';
import { AdminProductReviewController } from './controllers/admin/product-review.controller';
import { AdminWebhookController } from './controllers/admin/webhook.controller';
import { AdminSettingController } from './controllers/admin/setting.controller';
import { AdminSystemStatusController } from './controllers/admin/system-status.controller';
import { AdminPaymentGatewayController } from './controllers/admin/payment-gateway.controller';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [
    ProductTagsController,
    ProductCategoriesController,
    ProductsController,
    ProductBrandsController,
    ProductAttributesController,
    ProductReviewsController,
    ProductCollectionDataController,
    CartController,
    CartItemsController,
    CartCouponsController,
    CartExtensionsController,
    CheckoutController,
    CheckoutOrderController,
    OrderController,
    BatchController,
    CoreAuthController,
    AdminAttributeTermController,
    AdminProductAttributeController,
    AdminCouponController,
    AdminCustomerController,
    AdminOrderController,
    AdminProductCategoryController,
    AdminProductController,
    AdminProductTagController,
    AdminRefundController,
    AdminShippingZoneController,
    AdminTaxController,
    AdminDataController,
    AdminProductBrandController,
    AdminProductReviewController,
    AdminWebhookController,
    AdminSettingController,
    AdminSystemStatusController,
    AdminPaymentGatewayController,
  ],
  providers: [
    WordPressHttpService,
    WordPressProxyService,
    ClerkProvider,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AppModule {}
