import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loopExtension } from '../../../extensions/loop/loop.js';
import { ApiError } from '../../../types/api.js';

interface TestItem {
  id: number;
  name: string;
}

interface TestParams {
  page?: number;
  per_page?: number;
  filter?: string;
}

describe('loopExtension', () => {
  describe('basic pagination', () => {
    it('fetches single page when totalPages is 1', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item 1' }],
        pagination: { total: 1, totalPages: 1 },
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('fetches multiple pages until totalPages reached', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        const items =
          page === 1
            ? [
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
              ]
            : page === 2
            ? [
                { id: 3, name: 'C' },
                { id: 4, name: 'D' },
              ]
            : [{ id: 5, name: 'E' }];

        return Promise.resolve({
          data: items,
          pagination: {
            total: 5,
            totalPages: 3,
            next: page < 3 ? page + 1 : undefined,
          },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        { per_page: 2 },
        'page'
      );

      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(result.data).toHaveLength(5);
      expect(result.pagination.total).toBe(5);
    });

    it('uses next property when totalPages is undefined', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { next: page < 3 ? page + 1 : undefined },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(result.data).toHaveLength(3);
    });

    it('preserves original params while adding page', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        pagination: { totalPages: 1 },
      });

      await loopExtension<TestItem[], TestParams>(
        mockRequest,
        { per_page: 50, filter: 'active' },
        'page'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        per_page: 50,
        filter: 'active',
        page: 1,
      });
    });
  });

  describe('empty results handling', () => {
    it('stops on empty array response', async () => {
      let callCount = 0;
      const mockRequest = vi.fn().mockImplementation((params) => {
        callCount++;
        const page = params?.page ?? 1;
        if (page === 1) {
          return Promise.resolve({
            data: [{ id: 1, name: 'Item' }],
            pagination: { next: 2, totalPages: 100 },
          });
        }
        return Promise.resolve({
          data: [],
          pagination: { totalPages: 100 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(callCount).toBe(2);
      expect(result.data).toHaveLength(1);
    });

    it('stops when data is undefined', async () => {
      let callCount = 0;
      const mockRequest = vi.fn().mockImplementation((params) => {
        callCount++;
        const page = params?.page ?? 1;
        if (page === 1) {
          return Promise.resolve({
            data: [{ id: 1, name: 'Item' }],
            pagination: { next: 2, totalPages: 10 },
          });
        }
        return Promise.resolve({
          data: undefined,
          pagination: { totalPages: 10 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(callCount).toBe(2);
      expect(result.data).toHaveLength(1);
    });

    it('handles completely empty first page', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [],
        pagination: { total: 0, totalPages: 0 },
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(0);
    });
  });

  describe('maxPages option', () => {
    it('stops after maxPages even if more pages available', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { total: 100, totalPages: 100, next: page + 1 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { maxPages: 3 }
      );

      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(result.data).toHaveLength(3);
    });

    it('respects maxPages of 1', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Single' }],
        pagination: { total: 50, totalPages: 50, next: 2 },
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { maxPages: 1 }
      );

      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('delayMs option', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays between page requests', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 3, next: page < 3 ? page + 1 : undefined },
        });
      });

      const promise = loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { delayMs: 100 }
      );

      // First request happens immediately
      await vi.advanceTimersByTimeAsync(0);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      // Second request after delay
      await vi.advanceTimersByTimeAsync(100);
      expect(mockRequest).toHaveBeenCalledTimes(2);

      // Third request after another delay
      await vi.advanceTimersByTimeAsync(100);
      expect(mockRequest).toHaveBeenCalledTimes(3);

      const result = await promise;
      expect(result.data).toHaveLength(3);
    });

    it('skips delay on first request', async () => {
      const startTime = Date.now();
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { totalPages: 1 },
      });

      const promise = loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { delayMs: 1000 }
      );

      await vi.advanceTimersByTimeAsync(0);
      await promise;

      // Should complete immediately since only one page
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('stops on error by default (stopOnError: true)', async () => {
      const mockError: ApiError = {
        code: 'server_error',
        message: 'Internal server error',
        data: { status: 500 },
        details: {},
      };

      let callCount = 0;
      const mockRequest = vi.fn().mockImplementation((params) => {
        callCount++;
        const page = params?.page ?? 1;
        if (page === 2) {
          return Promise.resolve({
            data: undefined,
            error: mockError,
            pagination: {},
          });
        }
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 5, next: page + 1 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(callCount).toBe(2);
      expect(result.data).toHaveLength(1);
      expect(result.error).toEqual(mockError);
    });

    it('continues on error when stopOnError is false', async () => {
      const mockError: ApiError = {
        code: 'not_found',
        message: 'Not found',
        data: { status: 404 },
        details: {},
      };

      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        if (page === 2) {
          return Promise.resolve({
            data: [{ id: 2, name: 'Still works' }],
            error: mockError,
            pagination: { totalPages: 3, next: 3 },
          });
        }
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 3, next: page < 3 ? page + 1 : undefined },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { stopOnError: false }
      );

      expect(mockRequest).toHaveBeenCalledTimes(3);
      expect(result.data).toHaveLength(3);
      expect(result.error).toEqual(mockError); // Last error is preserved
    });
  });

  describe('onPage callback', () => {
    it('calls onPage for each page fetched', async () => {
      const onPage = vi.fn();
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: {
            total: 3,
            totalPages: 3,
            next: page < 3 ? page + 1 : undefined,
          },
        });
      });

      await loopExtension<TestItem[], TestParams>(mockRequest, {}, 'page', {
        onPage,
      });

      expect(onPage).toHaveBeenCalledTimes(3);
    });

    it('passes ApiPaginationResult to onPage callback', async () => {
      const onPage = vi.fn();
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        pagination: { total: 1, totalPages: 1 },
      });

      await loopExtension<TestItem[], TestParams>(mockRequest, {}, 'page', {
        onPage,
      });

      expect(onPage).toHaveBeenCalledWith({
        data: [{ id: 1, name: 'Test' }],
        pagination: { total: 1, totalPages: 1 },
      });
    });

    it('supports async onPage callback', async () => {
      const order: string[] = [];
      const onPage = vi.fn().mockImplementation(async () => {
        order.push('callback-start');
        await new Promise((resolve) => setTimeout(resolve, 10));
        order.push('callback-end');
      });

      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        order.push(`request-${page}`);
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 2, next: page < 2 ? 2 : undefined },
        });
      });

      await loopExtension<TestItem[], TestParams>(mockRequest, {}, 'page', {
        onPage,
      });

      // Callbacks should complete before next request
      expect(order).toEqual([
        'request-1',
        'callback-start',
        'callback-end',
        'request-2',
        'callback-start',
        'callback-end',
      ]);
    });
  });

  describe('AbortSignal', () => {
    it('stops immediately when already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { totalPages: 10, next: 2 },
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { signal: controller.signal }
      );

      expect(mockRequest).not.toHaveBeenCalled();
      expect(result.data).toHaveLength(0);
    });

    it('stops after abort signal is triggered', async () => {
      const controller = new AbortController();

      let callCount = 0;
      const mockRequest = vi.fn().mockImplementation((params) => {
        callCount++;
        const page = params?.page ?? 1;
        if (page === 2) {
          controller.abort();
        }
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 100, next: page + 1 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { signal: controller.signal }
      );

      // Should stop after page 2 completes but before page 3
      expect(callCount).toBe(2);
      expect(result.data).toHaveLength(2);
    });

    it('returns items collected before abort', async () => {
      const controller = new AbortController();

      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        const result = {
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 10, next: page + 1 },
        };
        if (page === 3) {
          controller.abort();
        }
        return Promise.resolve(result);
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { signal: controller.signal }
      );

      expect(result.data).toHaveLength(3);
      expect(result.data).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]);
    });

    it('checks abort after delay', async () => {
      vi.useFakeTimers();
      const controller = new AbortController();

      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { totalPages: 10, next: page + 1 },
        });
      });

      const promise = loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page',
        { signal: controller.signal, delayMs: 100 }
      );

      // First request
      await vi.advanceTimersByTimeAsync(0);
      expect(mockRequest).toHaveBeenCalledTimes(1);

      // Abort during delay
      await vi.advanceTimersByTimeAsync(50);
      controller.abort();
      await vi.advanceTimersByTimeAsync(50);

      const result = await promise;
      expect(mockRequest).toHaveBeenCalledTimes(1);
      expect(result.data).toHaveLength(1);

      vi.useRealTimers();
    });
  });

  describe('non-array data handling', () => {
    it('handles single object data (non-array)', async () => {
      interface SingleItem {
        value: string;
      }

      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: { value: `page-${page}` },
          pagination: { totalPages: 2, next: page < 2 ? 2 : undefined },
        });
      });

      const result = await loopExtension<SingleItem, TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(result.data).toEqual([{ value: 'page-1' }, { value: 'page-2' }]);
    });
  });

  describe('pagination metadata', () => {
    it('returns correct total and totalPages from response', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { total: 42, totalPages: 1 },
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(result.pagination.total).toBe(42);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('updates pagination from last response', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: {
            total: page * 10, // Simulating changing total
            totalPages: 3,
            next: page < 3 ? page + 1 : undefined,
          },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      // Should have the last known total
      expect(result.pagination.total).toBe(30);
      expect(result.pagination.totalPages).toBe(3);
    });
  });

  describe('custom page parameter', () => {
    it('uses custom page parameter name', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { totalPages: 1 },
      });

      await loopExtension<TestItem[], { pageNum?: number }>(
        mockRequest,
        {},
        'pageNum'
      );

      expect(mockRequest).toHaveBeenCalledWith({ pageNum: 1 });
    });

    it('preserves other params with custom page name', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { totalPages: 1 },
      });

      await loopExtension<TestItem[], { pageNum?: number; limit?: number }>(
        mockRequest,
        { limit: 25 },
        'pageNum'
      );

      expect(mockRequest).toHaveBeenCalledWith({ limit: 25, pageNum: 1 });
    });
  });

  describe('edge cases', () => {
    it('handles undefined params', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Item' }],
        pagination: { totalPages: 1 },
      });

      await loopExtension<TestItem[], TestParams>(
        mockRequest,
        undefined,
        'page'
      );

      expect(mockRequest).toHaveBeenCalledWith({ page: 1 });
    });

    it('handles pagination with no metadata', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        if (page > 2) {
          return Promise.resolve({
            data: [],
            pagination: {},
          });
        }
        return Promise.resolve({
          data: [{ id: page, name: `Item ${page}` }],
          pagination: { next: page + 1 },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        {},
        'page'
      );

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBeUndefined();
      expect(result.pagination.totalPages).toBeUndefined();
    });

    it('handles very large dataset efficiently', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.page ?? 1;
        const items = Array.from({ length: 100 }, (_, i) => ({
          id: (page - 1) * 100 + i + 1,
          name: `Item ${(page - 1) * 100 + i + 1}`,
        }));
        return Promise.resolve({
          data: items,
          pagination: {
            total: 500,
            totalPages: 5,
            next: page < 5 ? page + 1 : undefined,
          },
        });
      });

      const result = await loopExtension<TestItem[], TestParams>(
        mockRequest,
        { per_page: 100 },
        'page'
      );

      expect(mockRequest).toHaveBeenCalledTimes(5);
      expect(result.data).toHaveLength(500);
    });
  });
});
