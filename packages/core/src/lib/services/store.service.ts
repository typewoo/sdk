import { BaseService } from './base.service.js';
import { CartCouponService } from './store/cart.coupon.service.js';
import { CartItemService } from './store/cart.item.service.js';
import { CartService } from './store/cart.service.js';
import { BatchService } from './store/batch.service.js';
import { CartExtensionsService } from './store/cart.extensions.service.js';
import { CheckoutService } from './store/checkout.service.js';
import { CheckoutOrderService } from './store/checkout.order.service.js';
import { OrderService } from './store/order.service.js';
import { ProductAttributeService } from './store/product.attribute.service.js';
import { ProductAttributeTermService } from './store/product.attribute.term.service.js';
import { ProductBrandService } from './store/product.brand.service.js';
import { ProductCategoryService } from './store/product.category.service.js';
import { ProductCollectionDataService } from './store/product.collection.data.service.js';
import { ProductReviewService } from './store/product.review.service.js';
import { ProductService } from './store/product.service.js';
import { ProductTagService } from './store/product.tag.service.js';

export class StoreService extends BaseService {
  private _tags?: ProductTagService;
  private _orders?: OrderService;
  private _brands?: ProductBrandService;
  private _checkout?: CheckoutService;
  private _checkoutOrder?: CheckoutOrderService;
  private _products?: ProductService;
  private _reviews?: ProductReviewService;
  private _categories?: ProductCategoryService;
  private _attributes?: ProductAttributeService;
  private _attributesTerms?: ProductAttributeTermService;
  private _collectionData?: ProductCollectionDataService;

  private _cart?: CartService;
  private _cartItems?: CartItemService;
  private _cartCoupons?: CartCouponService;
  private _cartExtensions?: CartExtensionsService;

  private _batch?: BatchService;

  /**
   * Product Tags API
   */
  get tags(): ProductTagService {
    if (!this._tags) {
      this._tags = new ProductTagService(this.state, this.config, this.events);
    }
    return this._tags;
  }

  /**
   * Order API
   */
  get orders(): OrderService {
    if (!this._orders) {
      this._orders = new OrderService(this.state, this.config, this.events);
    }
    return this._orders;
  }

  /**
   * Product Brands API
   */
  get brands(): ProductBrandService {
    if (!this._brands) {
      this._brands = new ProductBrandService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._brands;
  }

  /**
   * Checkout API
   */
  get checkout(): CheckoutService {
    if (!this._checkout) {
      this._checkout = new CheckoutService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._checkout;
  }

  /**
   * Checkout Order API
   */
  get checkoutOrder(): CheckoutOrderService {
    if (!this._checkoutOrder) {
      this._checkoutOrder = new CheckoutOrderService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._checkoutOrder;
  }

  /**
   * Product Reviews API
   */
  get reviews(): ProductReviewService {
    if (!this._reviews) {
      this._reviews = new ProductReviewService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._reviews;
  }

  /**
   * Products API
   */
  get products(): ProductService {
    if (!this._products) {
      this._products = new ProductService(this.state, this.config, this.events);
    }
    return this._products;
  }

  /**
   * Product Categories API
   */
  get categories(): ProductCategoryService {
    if (!this._categories) {
      this._categories = new ProductCategoryService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._categories;
  }

  /**
   * Product Attributes API
   */
  get attributes(): ProductAttributeService {
    if (!this._attributes) {
      this._attributes = new ProductAttributeService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._attributes;
  }

  /**
   * Product Attribute Terms API
   */
  get attributesTerms(): ProductAttributeTermService {
    if (!this._attributesTerms) {
      this._attributesTerms = new ProductAttributeTermService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._attributesTerms;
  }

  /**
   * Product Collection Data API
   */
  get collectionData(): ProductCollectionDataService {
    if (!this._collectionData) {
      this._collectionData = new ProductCollectionDataService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._collectionData;
  }

  /**
   * Cart API
   */
  get cart(): CartService {
    if (!this._cart) {
      this._cart = new CartService(this.state, this.config, this.events);
    }
    return this._cart;
  }

  /**
   * Cart Items API
   */
  get cartItems(): CartItemService {
    if (!this._cartItems) {
      this._cartItems = new CartItemService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._cartItems;
  }

  /**
   * Cart Coupons API
   */
  get cartCoupons(): CartCouponService {
    if (!this._cartCoupons) {
      this._cartCoupons = new CartCouponService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._cartCoupons;
  }

  /**
   * Cart Extensions API
   */
  get cartExtensions(): CartExtensionsService {
    if (!this._cartExtensions) {
      this._cartExtensions = new CartExtensionsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._cartExtensions;
  }

  /**
   * Batch API
   */
  get batch(): BatchService {
    if (!this._batch) {
      this._batch = new BatchService(this.state, this.config, this.events);
    }
    return this._batch;
  }
}
