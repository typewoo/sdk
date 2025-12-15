import { describe, it, expect, beforeAll } from 'vitest';
import { Typewoo } from '../../../../index.js';
import {
  GET_WP_ADMIN_APP_PASSWORD,
  GET_WP_ADMIN_USER,
  GET_WP_URL,
} from '../../config.tests.js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../../../../../.env') });
/**
 * Integration: Admin Reports
 * Covers listing available reports and fetching sales, top sellers, customers, and orders reports.
 * Assertions are resilient to environments with little/no data or restricted endpoints.
 */
describe('Integration: Admin Reports', () => {
  beforeAll(async () => {
    await Typewoo.init({
      baseUrl: GET_WP_URL(),
      admin: {
        consumer_key: GET_WP_ADMIN_USER(),
        consumer_secret: GET_WP_ADMIN_APP_PASSWORD(),
        useAuthInterceptor: true,
      },
    });
  });

  it('lists available reports (headers if provided)', async () => {
    const { data, error } = await Typewoo.admin.reports.list({});
    expect(error).toBeFalsy();
    expect(Array.isArray(data)).toBe(true);
  });

  it('gets sales report for a recent period', async () => {
    const res = await Typewoo.admin.reports.getSalesReport({
      period: 'month',
    });
    if (res.error) {
      expect(res.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i,
      );
    } else {
      expect(res.data).toBeTruthy();
      if (!res.data) return;
      expect(res.data).toBeTruthy();
      if (res.data.length > 0) {
        expect(typeof res.data[0].total_sales).toBe('string');
        expect(typeof res.data[0].net_sales).toBe('string');
        expect(typeof res.data[0].total_orders).toBe('number');
      }
    }
  });

  it('gets top sellers report with pagination', async () => {
    const { data, error } = await Typewoo.admin.reports.getTopSellersReport({
      period: 'month',
      per_page: 5,
      page: 1,
    });
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].title).toBe('string');
        expect(typeof data[0].quantity).toBe('number');
      }
    }
  });

  it('gets customers report with pagination', async () => {
    const { data, error } = await Typewoo.admin.reports.getCustomersReport({
      period: 'month',
      per_page: 5,
      page: 1,
    });
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        expect(typeof data[0].name).toBe('string');
        expect(typeof data[0].total).toBe('number');
      }
    }
  });

  it('gets orders report for a recent period', async () => {
    const res = await Typewoo.admin.reports.getOrdersReport({
      period: 'month',
    });
    if (res.error) {
      expect(res.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported/i,
      );
    } else {
      expect(res.data).toBeTruthy();
      if (!res.data) return;
      expect(typeof res.data[0].slug).toBe('string');
      expect(typeof res.data[0].name).toBe('string');
      expect(typeof res.data[0].total).toBe('number');
    }
  });

  it('gets orders totals report', async () => {
    const { data, error } = await Typewoo.admin.reports.getOrdersTotals({});
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        // total can be string or number depending on endpoint
        expect(['string', 'number']).toContain(typeof data[0].total);
      }
    }
  });

  it('gets products totals report', async () => {
    const { data, error } = await Typewoo.admin.reports.getProductsTotals({});
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        expect(['string', 'number']).toContain(typeof data[0].total);
      }
    }
  });

  it('gets customers totals report', async () => {
    const { data, error } = await Typewoo.admin.reports.getCustomersTotals({});
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        expect(['string', 'number']).toContain(typeof data[0].total);
      }
    }
  });

  it('gets coupons totals report', async () => {
    const { data, error } = await Typewoo.admin.reports.getCouponsTotals({});
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        expect(['string', 'number']).toContain(typeof data[0].total);
      }
    }
  });

  it('gets reviews totals report', async () => {
    const { data, error } = await Typewoo.admin.reports.getReviewsTotals({});
    if (error) {
      expect(error.code).toMatch(/not_found|invalid|forbidden|unsupported/i);
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(typeof data[0].slug).toBe('string');
        expect(['string', 'number']).toContain(typeof data[0].total);
      }
    }
  });
});
