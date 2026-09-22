import { describe, it, expect } from 'vitest';
import axios, {
  type AxiosAdapter,
  type InternalAxiosRequestConfig,
} from 'axios';
import { createHttp } from '../../../http/http.js';
import type { ResolvedSdkConfig } from '../../../configs/sdk.config.js';

const config = {
  baseUrl: 'https://store.test',
  uniqueIdentifier: 'test',
  request: { retry: { enabled: false } },
} as ResolvedSdkConfig;

function makeHttp(status = 200) {
  const requests: InternalAxiosRequestConfig[] = [];
  const adapter: AxiosAdapter = async (req) => {
    requests.push(req);
    const response = {
      data: { ok: true },
      status,
      statusText: '',
      headers: {},
      config: req,
    };
    const validate = req.validateStatus ?? ((s: number) => s < 400);
    if (!validate(status)) {
      throw new axios.AxiosError('fail', undefined, req, undefined, response);
    }
    return response;
  };
  const client = axios.create({ baseURL: config.baseUrl, adapter });
  return { http: createHttp({ client, config }), client, requests };
}

describe('createHttp', () => {
  it('exposes the instance client', () => {
    const { http, client } = makeHttp();
    expect(http.client).toBe(client);
  });

  it.each(['get', 'delete'] as const)(
    '%s sends the method without a body',
    async (method) => {
      const { http, requests } = makeHttp();
      const { data } = await http[method]('/x', {
        axiosConfig: { params: { a: 1 } },
      });
      expect(data).toEqual({ ok: true });
      expect(requests[0].method).toBe(method);
      expect(requests[0].url).toBe('/x');
      expect(requests[0].params).toEqual({ a: 1 });
    }
  );

  it.each(['post', 'put'] as const)(
    '%s sends the body as JSON',
    async (method) => {
      const { http, requests } = makeHttp();
      await http[method]('/x', { name: 'Shirt' });
      expect(requests[0].method).toBe(method);
      expect(JSON.parse(requests[0].data as string)).toEqual({ name: 'Shirt' });
    }
  );

  it('head never treats a status as an error', async () => {
    const { http, requests } = makeHttp(404);
    const { error, status } = await http.head('/missing');
    expect(requests[0].method).toBe('head');
    expect(error).toBeUndefined();
    expect(status).toBe(404);
  });

  it('get turns an error status into an error result', async () => {
    const { http } = makeHttp(500);
    const { data, error } = await http.get('/x');
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
  });
});
