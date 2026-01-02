import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaginatedRequest } from '../../../extensions/paginated-request.js';
import { ApiPaginationResult } from '../../../types/api.js';

interface TestItem {
  id: number;
  name: string;
}

interface TestParams {
  page?: number;
  per_page?: number;
  category?: string;
}

describe('PaginatedRequest', () => {
  describe('thenable behavior', () => {
    it('can be awaited directly like a promise', async () => {
      const mockData: TestItem[] = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const mockRequest = vi.fn().mockResolvedValue({
        data: mockData,
        pagination: { total: 2, totalPages: 1 },
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(
        mockRequest,
        { per_page: 10 }
      );

      const result = await request;

      expect(result.data).toEqual(mockData);
      expect(result.pagination.total).toBe(2);
      expect(mockRequest).toHaveBeenCalledWith({ per_page: 10 });
    });

    it('passes params to the underlying request', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [],
        pagination: { total: 0, totalPages: 0 },
      });

      const params: TestParams = { page: 2, per_page: 25, category: 'test' };
      const request = new PaginatedRequest<TestItem[], TestParams>(
        mockRequest,
        params
      );

      await request;

      expect(mockRequest).toHaveBeenCalledWith(params);
    });

    it('works without params', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [],
        pagination: {},
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      await request;

      expect(mockRequest).toHaveBeenCalledWith(undefined);
    });
  });

  describe('then() method', () => {
    it('transforms result with onfulfilled callback', async () => {
      const mockData: TestItem[] = [{ id: 1, name: 'Test' }];
      const mockRequest = vi.fn().mockResolvedValue({
        data: mockData,
        pagination: { total: 1 },
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const count = await request.then((result) => result.data?.length ?? 0);

      expect(count).toBe(1);
    });

    it('chains multiple then() calls', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        pagination: { total: 1 },
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const result = await request
        .then((r) => r.data?.[0])
        .then((item) => item?.name.toUpperCase());

      expect(result).toBe('TEST');
    });

    it('handles onrejected callback', async () => {
      const error = new Error('Request failed');
      const mockRequest = vi.fn().mockRejectedValue(error);

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const result = await request.then(
        () => 'success',
        (err) => `error: ${(err as Error).message}`
      );

      expect(result).toBe('error: Request failed');
    });
  });

  describe('catch() method', () => {
    it('catches rejected promises', async () => {
      const error = new Error('Network error');
      const mockRequest = vi.fn().mockRejectedValue(error);

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const result = await request.catch(
        (err) => `caught: ${(err as Error).message}`
      );

      expect(result).toBe('caught: Network error');
    });

    it('passes through successful results', async () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        pagination: {},
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const result = await request.catch(() => ({
        data: [],
        pagination: {},
      }));

      expect(result.data).toHaveLength(1);
    });
  });

  describe('finally() method', () => {
    it('executes cleanup on success', async () => {
      const cleanup = vi.fn();
      const mockRequest = vi.fn().mockResolvedValue({
        data: [],
        pagination: {},
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      await request.finally(cleanup);

      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('executes cleanup on failure', async () => {
      const cleanup = vi.fn();
      const mockRequest = vi.fn().mockRejectedValue(new Error('fail'));

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      await request.catch(() => {}).finally(cleanup);

      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('preserves the original result', async () => {
      const mockData = [{ id: 1, name: 'Test' }];
      const mockRequest = vi.fn().mockResolvedValue({
        data: mockData,
        pagination: { total: 1 },
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      const result = await request.finally(() => {});

      expect(result.data).toEqual(mockData);
    });
  });

  describe('Promise.resolve compatibility', () => {
    it('works with Promise.all', async () => {
      const mockRequest1 = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'A' }],
        pagination: {},
      });
      const mockRequest2 = vi.fn().mockResolvedValue({
        data: [{ id: 2, name: 'B' }],
        pagination: {},
      });

      const request1 = new PaginatedRequest<TestItem[], TestParams>(
        mockRequest1
      );
      const request2 = new PaginatedRequest<TestItem[], TestParams>(
        mockRequest2
      );

      const [result1, result2] = await Promise.all([request1, request2]);

      expect(result1.data?.[0].name).toBe('A');
      expect(result2.data?.[0].name).toBe('B');
    });

    it('works with Promise.race', async () => {
      const fastRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Fast' }],
        pagination: {},
      });
      const slowRequest = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) =>
              setTimeout(
                () =>
                  resolve({ data: [{ id: 2, name: 'Slow' }], pagination: {} }),
                100
              )
            )
        );

      const fast = new PaginatedRequest<TestItem[], TestParams>(fastRequest);
      const slow = new PaginatedRequest<TestItem[], TestParams>(slowRequest);

      const result = await Promise.race([fast, slow]);

      expect(result.data?.[0].name).toBe('Fast');
    });
  });

  describe('loop() method', () => {
    it('is available on the PaginatedRequest instance', () => {
      const mockRequest = vi.fn().mockResolvedValue({
        data: [],
        pagination: {},
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      expect(typeof request.loop).toBe('function');
    });

    it('fetches all pages and combines results', async () => {
      let callCount = 0;
      const mockRequest = vi.fn().mockImplementation((params) => {
        callCount++;
        const page = params?.page ?? 1;
        if (page === 1) {
          return Promise.resolve({
            data: [{ id: 1, name: 'Item 1' }],
            pagination: { total: 3, totalPages: 3, next: 2 },
          });
        } else if (page === 2) {
          return Promise.resolve({
            data: [{ id: 2, name: 'Item 2' }],
            pagination: { total: 3, totalPages: 3, next: 3 },
          });
        } else {
          return Promise.resolve({
            data: [{ id: 3, name: 'Item 3' }],
            pagination: { total: 3, totalPages: 3 },
          });
        }
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(
        mockRequest,
        { per_page: 1 }
      );

      const result = await request.loop();

      expect(result.data).toHaveLength(3);
      expect(result.data).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]);
      expect(callCount).toBe(3);
    });

    it('passes options to loopExtension', async () => {
      const onPage = vi.fn();
      const mockRequest = vi.fn().mockResolvedValue({
        data: [{ id: 1, name: 'Test' }],
        pagination: { total: 1, totalPages: 1 },
      });

      const request = new PaginatedRequest<TestItem[], TestParams>(mockRequest);

      await request.loop({ onPage, maxPages: 5, delayMs: 0 });

      expect(onPage).toHaveBeenCalled();
    });
  });

  describe('custom page parameter name', () => {
    it('uses custom page parameter in loop', async () => {
      const mockRequest = vi.fn().mockImplementation((params) => {
        const page = params?.pageNumber ?? 1;
        if (page === 1) {
          return Promise.resolve({
            data: [{ id: 1, name: 'Page 1' }],
            pagination: { totalPages: 2, next: 2 },
          });
        }
        return Promise.resolve({
          data: [{ id: 2, name: 'Page 2' }],
          pagination: { totalPages: 2 },
        });
      });

      interface CustomParams {
        pageNumber?: number;
      }

      const request = new PaginatedRequest<TestItem[], CustomParams>(
        mockRequest,
        {},
        'pageNumber'
      );

      const result = await request.loop();

      expect(mockRequest).toHaveBeenCalledWith({ pageNumber: 1 });
      expect(mockRequest).toHaveBeenCalledWith({ pageNumber: 2 });
      expect(result.data).toHaveLength(2);
    });
  });
});
