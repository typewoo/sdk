import { BaseService } from './base.service.js';
import { WcAdminProductService } from './admin/product.service.js';
import { WcAdminOrderService } from './admin/order.service.js';
import { WcAdminCustomerService } from './admin/customer.service.js';
import { WcAdminCouponService } from './admin/coupon.service.js';
import { WcAdminProductCategoryService } from './admin/product-category.service.js';
import { WcAdminProductTagService } from './admin/product-tag.service.js';
import { WcAdminShippingClassService } from './admin/shipping-class.service.js';
import { WcAdminProductAttributeService } from './admin/product-attribute.service.js';
import { WcAdminAttributeTermService } from './admin/attribute-term.service.js';
import { WcAdminProductBrandService } from './admin/product-brand.service.js';
import { WcAdminProductReviewService } from './admin/product-review.service.js';
import { WcAdminRefundService } from './admin/refund.service.js';
import {
  WcAdminTaxService,
  WcAdminTaxClassService,
} from './admin/tax.service.js';
import { WcAdminWebhookService } from './admin/webhook.service.js';
import { WcAdminSettingService } from './admin/setting.service.js';
import { WcAdminReportService } from './admin/report.service.js';
import { WcAdminShippingZoneService } from './admin/shipping-zone.service.js';
import { WcAdminPaymentGatewayService } from './admin/payment-gateway.service.js';
import { WcAdminShippingMethodService } from './admin/shipping-method.service.js';
import { WcAdminSystemStatusService } from './admin/system-status.service.js';
import { WcAdminDataService } from './admin/data.service.js';

/**
 * Aggregator service for all WooCommerce REST API services
 *
 * Provides access to all REST API endpoints through organized service instances
 */
export class AdminService extends BaseService {
  private _products?: WcAdminProductService;
  private _orders?: WcAdminOrderService;
  private _customers?: WcAdminCustomerService;
  private _coupons?: WcAdminCouponService;
  private _productCategories?: WcAdminProductCategoryService;
  private _productTags?: WcAdminProductTagService;
  private _shippingClasses?: WcAdminShippingClassService;
  private _productAttributes?: WcAdminProductAttributeService;
  private _attributeTerms?: WcAdminAttributeTermService;
  private _productBrands?: WcAdminProductBrandService;
  private _productReviews?: WcAdminProductReviewService;
  private _refunds?: WcAdminRefundService;
  private _taxes?: WcAdminTaxService;
  private _taxClasses?: WcAdminTaxClassService;
  private _webhooks?: WcAdminWebhookService;
  private _settings?: WcAdminSettingService;
  private _reports?: WcAdminReportService;
  private _shippingZones?: WcAdminShippingZoneService;
  private _paymentGateways?: WcAdminPaymentGatewayService;
  private _shippingMethods?: WcAdminShippingMethodService;
  private _systemStatus?: WcAdminSystemStatusService;
  private _data?: WcAdminDataService;

  /**
   * Access to products REST API endpoints
   */
  get products(): WcAdminProductService {
    if (!this._products) {
      this._products = new WcAdminProductService(
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
  get orders(): WcAdminOrderService {
    if (!this._orders) {
      this._orders = new WcAdminOrderService(
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
  get customers(): WcAdminCustomerService {
    if (!this._customers) {
      this._customers = new WcAdminCustomerService(
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
  get coupons(): WcAdminCouponService {
    if (!this._coupons) {
      this._coupons = new WcAdminCouponService(
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
  get productCategories(): WcAdminProductCategoryService {
    if (!this._productCategories) {
      this._productCategories = new WcAdminProductCategoryService(
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
  get productTags(): WcAdminProductTagService {
    if (!this._productTags) {
      this._productTags = new WcAdminProductTagService(
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
  get shippingClasses(): WcAdminShippingClassService {
    if (!this._shippingClasses) {
      this._shippingClasses = new WcAdminShippingClassService(
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
  get productAttributes(): WcAdminProductAttributeService {
    if (!this._productAttributes) {
      this._productAttributes = new WcAdminProductAttributeService(
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
  get attributeTerms(): WcAdminAttributeTermService {
    if (!this._attributeTerms) {
      this._attributeTerms = new WcAdminAttributeTermService(
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
  get productBrands(): WcAdminProductBrandService {
    if (!this._productBrands) {
      this._productBrands = new WcAdminProductBrandService(
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
  get productReviews(): WcAdminProductReviewService {
    if (!this._productReviews) {
      this._productReviews = new WcAdminProductReviewService(
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
  get refunds(): WcAdminRefundService {
    if (!this._refunds) {
      this._refunds = new WcAdminRefundService(
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
  get taxes(): WcAdminTaxService {
    if (!this._taxes) {
      this._taxes = new WcAdminTaxService(this.state, this.config, this.events);
    }
    return this._taxes;
  }

  /**
   * Access to tax classes REST API endpoints
   */
  get taxClasses(): WcAdminTaxClassService {
    if (!this._taxClasses) {
      this._taxClasses = new WcAdminTaxClassService(
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
  get webhooks(): WcAdminWebhookService {
    if (!this._webhooks) {
      this._webhooks = new WcAdminWebhookService(
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
  get settings(): WcAdminSettingService {
    if (!this._settings) {
      this._settings = new WcAdminSettingService(
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
  get reports(): WcAdminReportService {
    if (!this._reports) {
      this._reports = new WcAdminReportService(
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
  get shippingZones(): WcAdminShippingZoneService {
    if (!this._shippingZones) {
      this._shippingZones = new WcAdminShippingZoneService(
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
  get paymentGateways(): WcAdminPaymentGatewayService {
    if (!this._paymentGateways) {
      this._paymentGateways = new WcAdminPaymentGatewayService(
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
  get shippingMethods(): WcAdminShippingMethodService {
    if (!this._shippingMethods) {
      this._shippingMethods = new WcAdminShippingMethodService(
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
  get systemStatus(): WcAdminSystemStatusService {
    if (!this._systemStatus) {
      this._systemStatus = new WcAdminSystemStatusService(
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
  get data(): WcAdminDataService {
    if (!this._data) {
      this._data = new WcAdminDataService(this.state, this.config, this.events);
    }
    return this._data;
  }
}
