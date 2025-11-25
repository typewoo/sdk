import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { CartController } from './cart.controller';
import { CartCouponsController } from './cart.coupon.controller';
import { CartExtensionsController } from './cart.extensions.controller';
import { CartItemsController } from './cart.item.controller';
import { CheckoutController } from './checkout.controller';
import { CheckoutOrderController } from './checkout.order.controller';
import { OrderController } from './order.controller';
import { ProductAttributesController } from './product.attributes.controller';
import { ProductBrandsController } from './product.brands.controller';
import { ProductCategoriesController } from './product.categories.controller';
import { ProductCollectionDataController } from './product.collection.data.controller';
import { ProductReviewsController } from './product.reviews.controller';
import { ProductTagsController } from './product.tags.controller';
import { ProductsController } from './products.controller';
import { WordPressProxyService } from '../../services/wordpress-proxy.service';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [
    BatchController,
    CartController,
    CartCouponsController,
    CartExtensionsController,
    CartItemsController,
    CheckoutController,
    CheckoutOrderController,
    OrderController,
    ProductAttributesController,
    ProductBrandsController,
    ProductCategoriesController,
    ProductCollectionDataController,
    ProductReviewsController,
    ProductTagsController,
    ProductsController,
  ],
  providers: [WordPressHttpService, WordPressProxyService],
})
export class StoreModule {}
