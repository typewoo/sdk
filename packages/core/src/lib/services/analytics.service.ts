import { BaseService } from './base.service.js';
import { AnalyticsRevenueService } from './analytics/revenue.service.js';
import { AnalyticsOrdersService } from './analytics/orders.service.js';
import { AnalyticsProductsService } from './analytics/products.service.js';
import { AnalyticsCategoriesService } from './analytics/categories.service.js';
import { AnalyticsCouponsService } from './analytics/coupons.service.js';
import { AnalyticsTaxesService } from './analytics/taxes.service.js';
import { AnalyticsVariationsService } from './analytics/variations.service.js';
import { AnalyticsCustomersService } from './analytics/customers.service.js';
import { AnalyticsDownloadsService } from './analytics/downloads.service.js';
import { AnalyticsStockService } from './analytics/stock.service.js';
import { AnalyticsPerformanceService } from './analytics/performance.service.js';
import { AnalyticsLeaderboardsService } from './analytics/leaderboards.service.js';

/**
 * Aggregator service for all WooCommerce Analytics API services
 *
 * Provides access to all analytics endpoints through organized service instances.
 * Uses the wc-analytics namespace (wp-json/wc-analytics/) for modern analytics data
 * with time-series intervals, segmentation, and rich filtering.
 */
export class AnalyticsService extends BaseService {
  private _revenue?: AnalyticsRevenueService;
  private _orders?: AnalyticsOrdersService;
  private _products?: AnalyticsProductsService;
  private _categories?: AnalyticsCategoriesService;
  private _coupons?: AnalyticsCouponsService;
  private _taxes?: AnalyticsTaxesService;
  private _variations?: AnalyticsVariationsService;
  private _customers?: AnalyticsCustomersService;
  private _downloads?: AnalyticsDownloadsService;
  private _stock?: AnalyticsStockService;
  private _performance?: AnalyticsPerformanceService;
  private _leaderboards?: AnalyticsLeaderboardsService;

  /**
   * Revenue analytics (total sales, net revenue, coupons, shipping, taxes, refunds)
   */
  get revenue(): AnalyticsRevenueService {
    if (!this._revenue) {
      this._revenue = new AnalyticsRevenueService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._revenue;
  }

  /**
   * Orders analytics (order details + stats with time intervals)
   */
  get orders(): AnalyticsOrdersService {
    if (!this._orders) {
      this._orders = new AnalyticsOrdersService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._orders;
  }

  /**
   * Products analytics (product performance, items sold, revenue)
   */
  get products(): AnalyticsProductsService {
    if (!this._products) {
      this._products = new AnalyticsProductsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._products;
  }

  /**
   * Categories analytics (category performance, items sold, revenue)
   */
  get categories(): AnalyticsCategoriesService {
    if (!this._categories) {
      this._categories = new AnalyticsCategoriesService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._categories;
  }

  /**
   * Coupons analytics (coupon usage, discount amounts)
   */
  get coupons(): AnalyticsCouponsService {
    if (!this._coupons) {
      this._coupons = new AnalyticsCouponsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._coupons;
  }

  /**
   * Taxes analytics (tax collections, order tax, shipping tax)
   */
  get taxes(): AnalyticsTaxesService {
    if (!this._taxes) {
      this._taxes = new AnalyticsTaxesService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._taxes;
  }

  /**
   * Variations analytics (variation performance, items sold, revenue)
   */
  get variations(): AnalyticsVariationsService {
    if (!this._variations) {
      this._variations = new AnalyticsVariationsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._variations;
  }

  /**
   * Customers analytics (customer activity, spending, registration)
   */
  get customers(): AnalyticsCustomersService {
    if (!this._customers) {
      this._customers = new AnalyticsCustomersService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._customers;
  }

  /**
   * Downloads analytics (download activity and stats)
   */
  get downloads(): AnalyticsDownloadsService {
    if (!this._downloads) {
      this._downloads = new AnalyticsDownloadsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._downloads;
  }

  /**
   * Stock analytics (inventory status, low stock, out of stock)
   */
  get stock(): AnalyticsStockService {
    if (!this._stock) {
      this._stock = new AnalyticsStockService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._stock;
  }

  /**
   * Performance indicators (batch access to key metrics from multiple stats endpoints)
   */
  get performance(): AnalyticsPerformanceService {
    if (!this._performance) {
      this._performance = new AnalyticsPerformanceService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._performance;
  }

  /**
   * Leaderboards (top customers, products, categories, coupons)
   */
  get leaderboards(): AnalyticsLeaderboardsService {
    if (!this._leaderboards) {
      this._leaderboards = new AnalyticsLeaderboardsService(
        this.state,
        this.config,
        this.events
      );
    }
    return this._leaderboards;
  }
}
