import { BaseService } from './base.service.js';
import { AdminProductService } from './admin/product.service.js';
import { AdminOrderService } from './admin/order.service.js';
import { AdminCustomerService } from './admin/customer.service.js';
import { AdminCouponService } from './admin/coupon.service.js';
import { AdminProductCategoryService } from './admin/product-category.service.js';
import { AdminProductTagService } from './admin/product-tag.service.js';
import { AdminShippingClassService } from './admin/shipping-class.service.js';
import { AdminProductAttributeService } from './admin/product-attribute.service.js';
import { AdminProductAttributeTermService } from './admin/product-attribute-term.service.js';
import { AdminProductBrandService } from './admin/product-brand.service.js';
import { AdminProductReviewService } from './admin/product-review.service.js';
import { AdminRefundService } from './admin/refund.service.js';
import { AdminTaxService, AdminTaxClassService } from './admin/tax.service.js';
import { AdminWebhookService } from './admin/webhook.service.js';
import { AdminSettingService } from './admin/setting.service.js';
import { AdminReportService } from './admin/report.service.js';
import { AdminShippingZoneService } from './admin/shipping-zone.service.js';
import { AdminPaymentGatewayService } from './admin/payment-gateway.service.js';
import { AdminShippingMethodService } from './admin/shipping-method.service.js';
import { AdminSystemStatusService } from './admin/system-status.service.js';
import { AdminDataService } from './admin/data.service.js';

/**
 * Aggregator service for all WooCommerce REST API services
 *
 * Provides access to all REST API endpoints through organized service instances
 */
export class AdminService extends BaseService {
  private _products?: AdminProductService;
  private _orders?: AdminOrderService;
  private _customers?: AdminCustomerService;
  private _coupons?: AdminCouponService;
  private _productCategories?: AdminProductCategoryService;
  private _productTags?: AdminProductTagService;
  private _shippingClasses?: AdminShippingClassService;
  private _productAttributes?: AdminProductAttributeService;
  private _attributeTerms?: AdminProductAttributeTermService;
  private _productBrands?: AdminProductBrandService;
  private _productReviews?: AdminProductReviewService;
  private _refunds?: AdminRefundService;
  private _taxes?: AdminTaxService;
  private _taxClasses?: AdminTaxClassService;
  private _webhooks?: AdminWebhookService;
  private _settings?: AdminSettingService;
  private _reports?: AdminReportService;
  private _shippingZones?: AdminShippingZoneService;
  private _paymentGateways?: AdminPaymentGatewayService;
  private _shippingMethods?: AdminShippingMethodService;
  private _systemStatus?: AdminSystemStatusService;
  private _data?: AdminDataService;

  /**
   * Access to products REST API endpoints
   */
  get products(): AdminProductService {
    if (!this._products) {
      this._products = new AdminProductService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._products;
  }

  /**
   * Access to orders REST API endpoints
   */
  get orders(): AdminOrderService {
    if (!this._orders) {
      this._orders = new AdminOrderService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._orders;
  }

  /**
   * Access to customers REST API endpoints
   */
  get customers(): AdminCustomerService {
    if (!this._customers) {
      this._customers = new AdminCustomerService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._customers;
  }

  /**
   * Access to coupons REST API endpoints
   */
  get coupons(): AdminCouponService {
    if (!this._coupons) {
      this._coupons = new AdminCouponService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._coupons;
  }

  /**
   * Access to product categories REST API endpoints
   */
  get productCategories(): AdminProductCategoryService {
    if (!this._productCategories) {
      this._productCategories = new AdminProductCategoryService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._productCategories;
  }

  /**
   * Access to product tags REST API endpoints
   */
  get productTags(): AdminProductTagService {
    if (!this._productTags) {
      this._productTags = new AdminProductTagService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._productTags;
  }

  /**
   * Access to shipping classes REST API endpoints
   */
  get shippingClasses(): AdminShippingClassService {
    if (!this._shippingClasses) {
      this._shippingClasses = new AdminShippingClassService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._shippingClasses;
  }

  /**
   * Access to product attributes REST API endpoints
   */
  get productAttributes(): AdminProductAttributeService {
    if (!this._productAttributes) {
      this._productAttributes = new AdminProductAttributeService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._productAttributes;
  }

  /**
   * Access to attribute terms REST API endpoints
   */
  get attributeTerms(): AdminProductAttributeTermService {
    if (!this._attributeTerms) {
      this._attributeTerms = new AdminProductAttributeTermService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._attributeTerms;
  }

  /**
   * Access to product brands REST API endpoints
   */
  get productBrands(): AdminProductBrandService {
    if (!this._productBrands) {
      this._productBrands = new AdminProductBrandService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._productBrands;
  }

  /**
   * Access to product reviews REST API endpoints
   */
  get productReviews(): AdminProductReviewService {
    if (!this._productReviews) {
      this._productReviews = new AdminProductReviewService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._productReviews;
  }

  /**
   * Access to refunds REST API endpoints
   */
  get refunds(): AdminRefundService {
    if (!this._refunds) {
      this._refunds = new AdminRefundService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._refunds;
  }

  /**
   * Access to taxes REST API endpoints
   */
  get taxes(): AdminTaxService {
    if (!this._taxes) {
      this._taxes = new AdminTaxService(this.state, this.config, this.events);
    }
    return this._taxes;
  }

  /**
   * Access to tax classes REST API endpoints
   */
  get taxClasses(): AdminTaxClassService {
    if (!this._taxClasses) {
      this._taxClasses = new AdminTaxClassService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._taxClasses;
  }

  /**
   * Access to webhooks REST API endpoints
   */
  get webhooks(): AdminWebhookService {
    if (!this._webhooks) {
      this._webhooks = new AdminWebhookService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._webhooks;
  }

  /**
   * Access to settings REST API endpoints
   */
  get settings(): AdminSettingService {
    if (!this._settings) {
      this._settings = new AdminSettingService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._settings;
  }

  /**
   * Access to reports REST API endpoints
   */
  get reports(): AdminReportService {
    if (!this._reports) {
      this._reports = new AdminReportService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._reports;
  }

  /**
   * Access to shipping zones REST API endpoints
   */
  get shippingZones(): AdminShippingZoneService {
    if (!this._shippingZones) {
      this._shippingZones = new AdminShippingZoneService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._shippingZones;
  }

  /**
   * Access to payment gateways REST API endpoints
   */
  get paymentGateways(): AdminPaymentGatewayService {
    if (!this._paymentGateways) {
      this._paymentGateways = new AdminPaymentGatewayService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._paymentGateways;
  }

  /**
   * Access to shipping methods REST API endpoints
   */
  get shippingMethods(): AdminShippingMethodService {
    if (!this._shippingMethods) {
      this._shippingMethods = new AdminShippingMethodService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._shippingMethods;
  }

  /**
   * Access to system status REST API endpoints
   */
  get systemStatus(): AdminSystemStatusService {
    if (!this._systemStatus) {
      this._systemStatus = new AdminSystemStatusService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._systemStatus;
  }

  /**
   * Access to data REST API endpoints (countries, currencies, continents)
   */
  get data(): AdminDataService {
    if (!this._data) {
      this._data = new AdminDataService(this.state, this.config, this.events);
    }
    return this._data;
  }
}
