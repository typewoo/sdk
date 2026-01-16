import { describe, it, expect, vi } from 'vitest';
import { createTypewoo } from '../../../sdk.js';
import type { CustomEndpoints } from '../../../configs/sdk.config.js';

// Mock the HTTP client and interceptors to isolate SDK tests
vi.mock('../../../http/http.client.js', () => ({
  createHttpClient: vi.fn(),
  httpClient: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    request: vi.fn().mockResolvedValue({ data: {}, headers: {} }),
  },
}));

vi.mock('../../../interceptors/cart.token.interceptor.js', () => ({
  addCartTokenInterceptors: vi.fn(),
}));

vi.mock('../../../interceptors/nonce.interceptor.js', () => ({
  addNonceInterceptors: vi.fn(),
}));

vi.mock('../../../interceptors/token.interceptor.js', () => ({
  addTokenInterceptor: vi.fn(),
}));

vi.mock('../../../interceptors/refresh.token.interceptor.js', () => ({
  addRefreshTokenInterceptor: vi.fn(),
}));

vi.mock('../../../interceptors/admin-auth.interceptor.js', () => ({
  addAdminAuthInterceptor: vi.fn(),
}));

// Mock HTTP helpers for endpoint testing
vi.mock('../../../http/http.js', () => ({
  doGet: vi.fn().mockResolvedValue({ data: { result: 'get' }, headers: {} }),
  doPost: vi.fn().mockResolvedValue({ data: { result: 'post' }, headers: {} }),
  doPut: vi.fn().mockResolvedValue({ data: { result: 'put' }, headers: {} }),
  doDelete: vi
    .fn()
    .mockResolvedValue({ data: { result: 'delete' }, headers: {} }),
  doHead: vi.fn().mockResolvedValue({ data: null, headers: { 'x-test': '1' } }),
  createRequest: vi.fn(),
}));

// Import mocked functions after mock setup
import { doGet, doPost, doPut, doDelete, doHead } from '../../../http/http.js';

describe('SDK endpoints property', () => {
  describe('basic endpoints configuration', () => {
    it('should expose empty endpoints object when not configured', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
      });

      expect(sdk.endpoints).toBeDefined();
      expect(sdk.endpoints).toEqual({});
    });

    it('should expose configured endpoints', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getPosts: () => doGet('/wp/v2/posts'),
          createPost: (data: { title: string }) => doPost('/wp/v2/posts', data),
        },
      });

      expect(sdk.endpoints).toBeDefined();
      expect(typeof sdk.endpoints.getPosts).toBe('function');
      expect(typeof sdk.endpoints.createPost).toBe('function');
    });

    it('should preserve endpoint function references', () => {
      const getPosts = () => doGet('/wp/v2/posts');
      const createPost = (data: { title: string }) =>
        doPost('/wp/v2/posts', data);

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getPosts,
          createPost,
        },
      });

      expect(sdk.endpoints.getPosts).toBe(getPosts);
      expect(sdk.endpoints.createPost).toBe(createPost);
    });
  });

  describe('endpoint invocation', () => {
    it('should call GET endpoint correctly', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getPosts: () =>
            doGet<{ id: number; title: string }[]>('/wp/v2/posts'),
        },
      });

      const result = await sdk.endpoints.getPosts();

      expect(doGet).toHaveBeenCalledWith('/wp/v2/posts');
      expect(result).toEqual({ data: { result: 'get' }, headers: {} });
    });

    it('should call POST endpoint with data', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          createPost: (data: { title: string }) =>
            doPost<{ id: number }>('/wp/v2/posts', data),
        },
      });

      const result = await sdk.endpoints.createPost({ title: 'Test Post' });

      expect(doPost).toHaveBeenCalledWith('/wp/v2/posts', {
        title: 'Test Post',
      });
      expect(result).toEqual({ data: { result: 'post' }, headers: {} });
    });

    it('should call PUT endpoint with data', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          updatePost: (id: number, data: { title: string }) =>
            doPut<{ id: number }>(`/wp/v2/posts/${id}`, data),
        },
      });

      const result = await sdk.endpoints.updatePost(123, { title: 'Updated' });

      expect(doPut).toHaveBeenCalledWith('/wp/v2/posts/123', {
        title: 'Updated',
      });
      expect(result).toEqual({ data: { result: 'put' }, headers: {} });
    });

    it('should call DELETE endpoint correctly', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          deletePost: (id: number) => doDelete(`/wp/v2/posts/${id}`),
        },
      });

      const result = await sdk.endpoints.deletePost(456);

      expect(doDelete).toHaveBeenCalledWith('/wp/v2/posts/456');
      expect(result).toEqual({ data: { result: 'delete' }, headers: {} });
    });

    it('should call HEAD endpoint correctly', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          checkPost: (id: number) => doHead(`/wp/v2/posts/${id}`),
        },
      });

      const result = await sdk.endpoints.checkPost(789);

      expect(doHead).toHaveBeenCalledWith('/wp/v2/posts/789');
      expect(result).toEqual({ data: null, headers: { 'x-test': '1' } });
    });
  });

  describe('endpoint with multiple parameters', () => {
    it('should handle endpoints with multiple parameters', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getPostComments: (postId: number, page: number, perPage: number) =>
            doGet(
              `/wp/v2/posts/${postId}/comments?page=${page}&per_page=${perPage}`
            ),
        },
      });

      await sdk.endpoints.getPostComments(1, 2, 10);

      expect(doGet).toHaveBeenCalledWith(
        '/wp/v2/posts/1/comments?page=2&per_page=10'
      );
    });

    it('should handle endpoints with object parameters', async () => {
      interface CommentData {
        postId: number;
        content: string;
        author: string;
      }

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          createComment: (data: CommentData) => doPost(`/wp/v2/comments`, data),
        },
      });

      const commentData = { postId: 1, content: 'Test', author: 'User' };
      await sdk.endpoints.createComment(commentData);

      expect(doPost).toHaveBeenCalledWith('/wp/v2/comments', commentData);
    });

    it('should handle endpoints with optional parameters', async () => {
      interface RequestOptions {
        fields?: string[];
      }

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getUser: (id: number, options?: RequestOptions) => {
            const url = options?.fields
              ? `/wp/v2/users/${id}?_fields=${options.fields.join(',')}`
              : `/wp/v2/users/${id}`;
            return doGet(url);
          },
        },
      });

      await sdk.endpoints.getUser(1);
      expect(doGet).toHaveBeenCalledWith('/wp/v2/users/1');

      await sdk.endpoints.getUser(2, { fields: ['id', 'name'] });
      expect(doGet).toHaveBeenCalledWith('/wp/v2/users/2?_fields=id,name');
    });
  });

  describe('endpoint type safety', () => {
    it('should preserve return types', async () => {
      interface Post {
        id: number;
        title: string;
        content: string;
      }

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getPosts: () => doGet<Post[]>('/wp/v2/posts'),
        },
      });

      // This is a compile-time check - the endpoint should be typed correctly
      const result = await sdk.endpoints.getPosts();
      expect(result).toBeDefined();
    });

    it('should infer endpoint types from config', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          getNumber: () => Promise.resolve(42),
          getString: () => Promise.resolve('hello'),
          getObject: () => Promise.resolve({ foo: 'bar' }),
        },
      });

      // Type inference check - these should all be functions
      expect(typeof sdk.endpoints.getNumber).toBe('function');
      expect(typeof sdk.endpoints.getString).toBe('function');
      expect(typeof sdk.endpoints.getObject).toBe('function');
    });
  });

  describe('endpoints with different base URLs', () => {
    it('should support absolute URLs in endpoints', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://primary.com',
        endpoints: {
          getFromPrimary: () => doGet('/api/data'),
          getFromSecondary: () => doGet('https://secondary.com/api/data'),
        },
      });

      await sdk.endpoints.getFromPrimary();
      expect(doGet).toHaveBeenCalledWith('/api/data');

      await sdk.endpoints.getFromSecondary();
      expect(doGet).toHaveBeenCalledWith('https://secondary.com/api/data');
    });
  });

  describe('endpoints isolation between instances', () => {
    it('should have isolated endpoints per SDK instance', () => {
      const sdk1 = createTypewoo({
        baseUrl: 'https://store1.com',
        endpoints: {
          store1Endpoint: () => doGet('/store1'),
        },
      });

      const sdk2 = createTypewoo({
        baseUrl: 'https://store2.com',
        endpoints: {
          store2Endpoint: () => doGet('/store2'),
        },
      });

      expect(sdk1.endpoints.store1Endpoint).toBeDefined();
      expect(
        (sdk1.endpoints as Record<string, unknown>).store2Endpoint
      ).toBeUndefined();

      expect(sdk2.endpoints.store2Endpoint).toBeDefined();
      expect(
        (sdk2.endpoints as Record<string, unknown>).store1Endpoint
      ).toBeUndefined();
    });
  });

  describe('complex endpoint patterns', () => {
    it('should support CRUD patterns', async () => {
      interface Resource {
        id: number;
        name: string;
      }

      interface CreateResourceData {
        name: string;
      }

      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          listResources: () => doGet<Resource[]>('/api/resources'),
          getResource: (id: number) => doGet<Resource>(`/api/resources/${id}`),
          createResource: (data: CreateResourceData) =>
            doPost<Resource>('/api/resources', data),
          updateResource: (id: number, data: Partial<CreateResourceData>) =>
            doPut<Resource>(`/api/resources/${id}`, data),
          deleteResource: (id: number) => doDelete(`/api/resources/${id}`),
        },
      });

      // Verify all CRUD endpoints are callable
      await sdk.endpoints.listResources();
      await sdk.endpoints.getResource(1);
      await sdk.endpoints.createResource({ name: 'Test' });
      await sdk.endpoints.updateResource(1, { name: 'Updated' });
      await sdk.endpoints.deleteResource(1);

      expect(doGet).toHaveBeenCalledWith('/api/resources');
      expect(doGet).toHaveBeenCalledWith('/api/resources/1');
      expect(doPost).toHaveBeenCalledWith('/api/resources', { name: 'Test' });
      expect(doPut).toHaveBeenCalledWith('/api/resources/1', {
        name: 'Updated',
      });
      expect(doDelete).toHaveBeenCalledWith('/api/resources/1');
    });

    it('should support async/await patterns in endpoints', async () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {
          complexOperation: async (id: number) => {
            // Simulate a multi-step operation
            const result = await doGet(`/api/resource/${id}`);
            return result;
          },
        },
      });

      const result = await sdk.endpoints.complexOperation(5);
      expect(result).toBeDefined();
      expect(doGet).toHaveBeenCalledWith('/api/resource/5');
    });
  });

  describe('empty and undefined endpoints', () => {
    it('should handle undefined endpoints gracefully', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: undefined,
      });

      expect(sdk.endpoints).toEqual({});
    });

    it('should handle empty endpoints object', () => {
      const sdk = createTypewoo({
        baseUrl: 'https://example.com',
        endpoints: {},
      });

      expect(sdk.endpoints).toEqual({});
      expect(Object.keys(sdk.endpoints)).toHaveLength(0);
    });
  });
});
