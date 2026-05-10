import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utilities/common.js', () => ({
  extractPagination: vi
    .fn()
    .mockReturnValue({ total: 50, totalPages: 5, currentPage: 1, perPage: 10 }),
}));

import { doGet, doPost, doPut, doDelete } from '../../../../http/http.js';
import { AdminOrderService } from '../../../../services/admin/order.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);
const doPutMock = vi.mocked(doPut);
const doDeleteMock = vi.mocked(doDelete);

describe('AdminOrderService', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Core CRUD ─────────────────────────────────────────────────────────────

  describe('list()', () => {
    it('returns a PaginatedRequest', () => {
      const { state, config, events } = makeTestDeps();
      expect(
        typeof new AdminOrderService(state, config, events).list().then
      ).toBe('function');
    });

    it('calls GET /wc/v3/orders with params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], headers: {} });

      const result = await svc.list({ per_page: 10, status: 'processing' });

      const url = doGetMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/orders');
      expect(url).toContain('status=processing');
      expect(result.pagination?.total).toBe(50);
    });

    it('returns error when list fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
        headers: {},
      });
      const result = await svc.list();
      expect(result.error).toBeDefined();
    });
  });

  describe('get()', () => {
    it('calls GET /wc/v3/orders/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 100, status: 'processing' },
        error: undefined,
      });

      const result = await svc.get(100);
      expect(doGetMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/orders/100');
      expect(result.data).toBeDefined();
    });
  });

  describe('create()', () => {
    it('POSTs to /wc/v3/orders', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 1, status: 'pending' },
        error: undefined,
      });

      const result = await svc.create({
        status: 'pending',
        currency: 'USD',
        line_items: [],
      });
      expect(doPostMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/orders');
      expect(doPostMock.mock.calls[0][0]).not.toContain('/batch');
      expect(result.data).toBeDefined();
    });
  });

  describe('update()', () => {
    it('PUTs to /wc/v3/orders/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPutMock.mockResolvedValueOnce({
        data: { id: 100, status: 'completed' },
        error: undefined,
      });

      const result = await svc.update(100, { status: 'completed' });
      expect(doPutMock.mock.calls[0][0]).toContain('/wp-json/wc/v3/orders/100');
      expect(result.data).toBeDefined();
    });
  });

  describe('delete()', () => {
    it('DELETEs /wc/v3/orders/{id}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({
        data: { id: 100 },
        error: undefined,
      });

      await svc.delete(100, true);
      const url = doDeleteMock.mock.calls[0][0] as string;
      expect(url).toContain('/wp-json/wc/v3/orders/100');
      expect(url).toContain('force=true');
    });
  });

  describe('batch()', () => {
    it('POSTs to /wc/v3/orders/batch', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { create: [], update: [], delete: [] },
        error: undefined,
      });

      const result = await svc.batch({ delete: [100] });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/batch'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getStatuses()', () => {
    it('calls GET /wc/v3/orders/statuses', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ slug: 'processing', name: 'Processing' }],
        error: undefined,
      });

      const result = await svc.getStatuses();
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/statuses'
      );
      expect(result.data).toBeDefined();
    });
  });

  // ── Order Notes ────────────────────────────────────────────────────────────

  describe('listNotes()', () => {
    it('calls GET /wc/v3/orders/{orderId}/notes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], error: undefined });

      const result = await svc.listNotes(100);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/notes'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getNote()', () => {
    it('calls GET /wc/v3/orders/{orderId}/notes/{noteId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 5, note: 'Internal note' },
        error: undefined,
      });

      const result = await svc.getNote(100, 5);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/notes/5'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('createNote()', () => {
    it('POSTs to /wc/v3/orders/{orderId}/notes', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 6, note: 'New note' },
        error: undefined,
      });

      const result = await svc.createNote(100, { note: 'New note' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/notes'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteNote()', () => {
    it('DELETEs /wc/v3/orders/{orderId}/notes/{noteId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doDeleteMock.mockResolvedValueOnce({ data: { id: 5 }, error: undefined });

      await svc.deleteNote(100, 5, true);
      expect(doDeleteMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/notes/5'
      );
    });
  });

  // ── Order Refunds ──────────────────────────────────────────────────────────

  describe('listRefunds()', () => {
    it('calls GET /wc/v3/orders/{orderId}/refunds', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({ data: [], error: undefined });

      const result = await svc.listRefunds(100);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/refunds'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getRefund()', () => {
    it('calls GET /wc/v3/orders/{orderId}/refunds/{refundId}', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { id: 10, amount: '5.00' },
        error: undefined,
      });

      const result = await svc.getRefund(100, 10);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/refunds/10'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('createRefund()', () => {
    it('POSTs to /wc/v3/orders/{orderId}/refunds', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { id: 11, amount: '10.00' },
        error: undefined,
      });

      const result = await svc.createRefund(100, { amount: '10.00' });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/refunds'
      );
      expect(result.data).toBeDefined();
    });
  });

  // ── Email / Receipt Actions ────────────────────────────────────────────────

  describe('generateReceipt()', () => {
    it('POSTs to /wc/v3/orders/{orderId}/receipt', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { html: '<html>Receipt</html>' },
        error: undefined,
      });

      const result = await svc.generateReceipt(100);
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/receipt'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getReceipt()', () => {
    it('calls GET /wc/v3/orders/{orderId}/receipt', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { html: '<html>Receipt</html>' },
        error: undefined,
      });

      const result = await svc.getReceipt(100);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/receipt'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('getEmailTemplates()', () => {
    it('calls GET /wc/v3/orders/{orderId}/actions/email_templates', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: [{ id: 'customer_on_hold_order', label: 'Order On-Hold' }],
        error: undefined,
      });

      const result = await svc.getEmailTemplates(100);
      expect(doGetMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/actions/email_templates'
      );
      expect(result.data).toBeDefined();
    });
  });

  describe('sendEmail()', () => {
    it('POSTs to /wc/v3/orders/{orderId}/actions/send_email', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { message: 'Email sent.' },
        error: undefined,
      });

      const result = await svc.sendEmail(100, {
        template_id: 'customer_on_hold_order',
      });
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/actions/send_email'
      );
      expect(result.data?.message).toBe('Email sent.');
    });
  });

  describe('sendOrderDetails()', () => {
    it('POSTs to /wc/v3/orders/{orderId}/actions/send_order_details', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AdminOrderService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { message: 'Details sent.' },
        error: undefined,
      });

      const result = await svc.sendOrderDetails(100);
      expect(doPostMock.mock.calls[0][0]).toContain(
        '/wp-json/wc/v3/orders/100/actions/send_order_details'
      );
      expect(result.data?.message).toBe('Details sent.');
    });
  });
});
