import { describe, it, expect, beforeAll } from 'vitest';
import {
  getJwtExpiration,
  isJwtExpired,
} from '../../../utilities/jwt.utility.js';

beforeAll(() => {
  // Polyfill atob for Node.js test environment
  if (!(globalThis as Record<string, unknown>).atob) {
    (globalThis as Record<string, unknown>).atob = (b64: string) =>
      Buffer.from(b64, 'base64').toString('binary');
  }
});

function buildJwt(expSecondsFromNow: number): string {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  ).toString('base64');
  const exp = Math.floor(Date.now() / 1000) + expSecondsFromNow;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64');
  return `${header}.${payload}.signature`;
}

describe('getJwtExpiration()', () => {
  it('returns null when token is undefined', () => {
    expect(getJwtExpiration(undefined)).toBeNull();
  });

  it('returns a Date instance for a valid token', () => {
    expect(getJwtExpiration(buildJwt(300))).toBeInstanceOf(Date);
  });

  it('returned date is in the future for a non-expired token', () => {
    const exp = getJwtExpiration(buildJwt(60));
    expect(exp!.getTime()).toBeGreaterThan(Date.now());
  });

  it('returned date is in the past for an already-expired token', () => {
    const exp = getJwtExpiration(buildJwt(-60));
    expect(exp!.getTime()).toBeLessThan(Date.now());
  });
});

describe('isJwtExpired()', () => {
  it('returns true when token is undefined', () => {
    expect(isJwtExpired(undefined)).toBe(true);
  });

  it('returns false for a token expiring in the future', () => {
    expect(isJwtExpired(buildJwt(300))).toBe(false);
  });

  it('returns true for an already-expired token', () => {
    expect(isJwtExpired(buildJwt(-1))).toBe(true);
  });
});
