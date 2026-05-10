import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeTestDeps } from '../../../helpers/make-test-deps.js';

vi.mock('../../../../http/http.js', () => ({
  doGet: vi.fn(),
  doPost: vi.fn(),
  doPut: vi.fn(),
  doDelete: vi.fn(),
}));
vi.mock('../../../../utils/auth.utils.js', () => ({
  clearAuthSession: vi.fn(),
}));

import { doGet, doPost } from '../../../../http/http.js';
import { AuthService } from '../../../../services/auth/auth.service.js';

const doGetMock = vi.mocked(doGet);
const doPostMock = vi.mocked(doPost);

describe('AuthService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getAutoLoginUrl()', () => {
    it('builds a URL with token and redirect params', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);

      const url = await svc.getAutoLoginUrl(
        'ott-abc',
        'https://store.test/account'
      );

      expect(url).toContain('token=ott-abc');
      expect(url).toContain('redirect=');
      expect(url).toContain('/autologin');
    });

    it('includes optional tracking params in the query string', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);

      const url = await svc.getAutoLoginUrl('ott-xyz', 'https://store.test/', {
        utm_source: 'email',
        promo: 'welcome20',
      });

      expect(url).toContain('utm_source=email');
      expect(url).toContain('promo=welcome20');
    });
  });

  describe('oneTimeToken()', () => {
    it('POSTs to the one-time-token endpoint', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { token: 'ott-123' },
        error: undefined,
      });

      const result = await svc.oneTimeToken({ user_id: 1 });

      expect(doPostMock.mock.calls[0][0]).toContain('/one-time-token');
      expect(result.data?.token).toBe('ott-123');
      expect(result.error).toBeUndefined();
    });

    it('returns error when the endpoint fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.oneTimeToken({ user_id: 1 });

      expect(result.data).toBeUndefined();
      expect(result.error?.code).toBe('rest_forbidden');
    });
  });

  describe('validate()', () => {
    it('GETs the validate endpoint', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: { valid: true },
        error: undefined,
      });

      const result = await svc.validate();

      expect(doGetMock.mock.calls[0][0]).toContain('/validate');
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('returns error when validation fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doGetMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'jwt_auth_invalid_token',
          message: 'Invalid token',
          data: { status: 401 },
          details: {},
        },
      });

      const result = await svc.validate();

      expect(result.data).toBeUndefined();
      expect(result.error?.code).toBe('jwt_auth_invalid_token');
    });
  });

  describe('revokeToken()', () => {
    it('POSTs to the revoke endpoint', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: { revoked: true },
        error: undefined,
      });

      const result = await svc.revokeToken();

      expect(doPostMock.mock.calls[0][0]).toContain('/revoke');
      expect(result.error).toBeUndefined();
    });

    it('returns error when revoke fails', async () => {
      const { state, config, events } = makeTestDeps();
      const svc = new AuthService(state, config, events);
      doPostMock.mockResolvedValueOnce({
        data: undefined,
        error: {
          code: 'rest_forbidden',
          message: 'Forbidden',
          data: { status: 403 },
          details: {},
        },
      });

      const result = await svc.revokeToken();

      expect(result.error?.code).toBe('rest_forbidden');
    });
  });

  describe('token() — revokeTokenBeforeLogin', () => {
    it('calls revokeToken before login when config flag is set', async () => {
      const { state, config, events } = makeTestDeps({
        auth: { revokeTokenBeforeLogin: true },
      } as never);
      const svc = new AuthService(state, config, events);
      // First call: revokeToken POST; second call: login POST
      doPostMock
        .mockResolvedValueOnce({ data: { revoked: true }, error: undefined })
        .mockResolvedValueOnce({
          data: { token: 'tok', refresh_token: 'ref' },
          error: undefined,
        });

      await svc.token({ login: 'user', password: 'pass' });

      expect(doPostMock).toHaveBeenCalledTimes(2);
      expect(doPostMock.mock.calls[0][0]).toContain('/revoke');
      expect(doPostMock.mock.calls[1][0]).toContain('/token');
    });
  });
});
