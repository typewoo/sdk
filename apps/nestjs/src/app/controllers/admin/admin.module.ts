import { Module } from '@nestjs/common';
import { AdminAttributeTermController } from './attribute-term.controller';
import { AdminCouponController } from './coupon.controller';
import { AdminCustomerController } from './customer.controller';
import { AdminDataController } from './data.controller';
import { AdminOrderController } from './order.controller';
import { AdminPaymentGatewayController } from './payment-gateway.controller';
import { AdminProductAttributeController } from './product-attribute.controller';
import { AdminProductBrandController } from './product-brand.controller';
import { AdminProductCategoryController } from './product-category.controller';
import { AdminProductReviewController } from './product-review.controller';
import { AdminProductTagController } from './product-tag.controller';
import { AdminProductController } from './product.controller';
import { AdminRefundController } from './refund.controller';
import { AdminSettingController } from './setting.controller';
import { AdminShippingZoneController } from './shipping-zone.controller';
import { AdminSystemStatusController } from './system-status.controller';
import { AdminTaxController } from './tax.controller';
import { AdminWebhookController } from './webhook.controller';
import { WordPressProxyService } from '../../services/wordpress-proxy.service';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [
    AdminAttributeTermController,
    AdminCouponController,
    AdminCustomerController,
    AdminDataController,
    AdminOrderController,
    AdminPaymentGatewayController,
    AdminProductAttributeController,
    AdminProductBrandController,
    AdminProductCategoryController,
    AdminProductReviewController,
    AdminProductTagController,
    AdminProductController,
    AdminRefundController,
    AdminSettingController,
    AdminShippingZoneController,
    AdminSystemStatusController,
    AdminTaxController,
    AdminWebhookController,
  ],
  providers: [WordPressHttpService, WordPressProxyService],
})
export class AdminModule {}
