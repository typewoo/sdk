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
 * Integration: Analytics Revenue, Orders, Products
 *
 * Covers the wc-analytics endpoints for revenue stats, order stats/list, and product stats/list.
 * Assertions are resilient to environments with little/no data or restricted endpoints.
 */
describe('Integration: Analytics (Revenue, Orders, Products)', () => {
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

  // ──────── Revenue ────────
  it('gets revenue stats for a recent period', async () => {
    const { data, error } = await Typewoo.analytics.revenue.getStats({
      after: '2025-01-01T00:00:00',
      before: '2026-12-31T23:59:59',
      interval: 'month',
    });
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(data).toBeDefined();
      if (data) {
        expect(data.totals).toBeDefined();
        expect(Array.isArray(data.intervals)).toBe(true);
      }
    }
  });

  // ──────── Orders ────────
  it('gets order stats with daily interval', async () => {
    const { data, error } = await Typewoo.analytics.orders.getStats({
      after: '2026-01-01T00:00:00',
      before: '2026-01-31T23:59:59',
      interval: 'day',
    });
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(data).toBeDefined();
      if (data) {
        expect(data.totals).toBeDefined();
        expect(Array.isArray(data.intervals)).toBe(true);
      }
    }
  });

  it('lists order detail rows', async () => {
    const result = await Typewoo.analytics.orders
      .list({
        after: '2025-01-01T00:00:00',
        before: '2026-12-31T23:59:59',
        per_page: 5,
      })
      .send();
    if (result.error) {
      expect(result.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  // ──────── Products ────────
  it('gets product stats', async () => {
    const { data, error } = await Typewoo.analytics.products.getStats({
      after: '2025-01-01T00:00:00',
      before: '2026-12-31T23:59:59',
    });
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(data).toBeDefined();
      if (data) {
        expect(data.totals).toBeDefined();
      }
    }
  });

  it('lists product analytics rows', async () => {
    const result = await Typewoo.analytics.products
      .list({ per_page: 5 })
      .send();
    if (result.error) {
      expect(result.error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(Array.isArray(result.data)).toBe(true);
    }
  });

  // ──────── Categories ────────
  it('gets category stats', async () => {
    const { data, error } = await Typewoo.analytics.categories.getStats();
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(data).toBeDefined();
    }
  });

  // ──────── Performance Indicators ────────
  it('lists allowed performance indicators', async () => {
    const { data, error } = await Typewoo.analytics.performance.getAllowed();
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });

  // ──────── Leaderboards ────────
  it('lists leaderboards', async () => {
    const { data, error } = await Typewoo.analytics.leaderboards.list({
      after: '2025-01-01T00:00:00',
      before: '2026-12-31T23:59:59',
    });
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(Array.isArray(data)).toBe(true);
      if (data && data.length > 0) {
        expect(data[0].id).toBeDefined();
        expect(data[0].label).toBeDefined();
      }
    }
  });

  // ──────── Stock ────────
  it('gets stock stats', async () => {
    const { data, error } = await Typewoo.analytics.stock.getStats();
    if (error) {
      expect(error.code).toMatch(
        /not_found|invalid|forbidden|unsupported|cannot_view/i
      );
    } else {
      expect(data).toBeDefined();
    }
  });
});
