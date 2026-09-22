import { describe, it, expect } from 'vitest';
import {
  extractPagination,
  parseLinkHeader,
  parseLinkHeaderPage,
} from '../../../utilities/common.js';

const LINK =
  '<https://store.test/wp-json/wc/store/v1/products?page=1>; rel="prev", ' +
  '<https://store.test/wp-json/wc/store/v1/products?page=3>; rel="next", ' +
  '<https://store.test/wp-json/wc/store/v1>; rel="up", ' +
  '<https://store.test/other>; rel="alternate"';

describe('parseLinkHeader', () => {
  it('returns undefined without a header', () => {
    expect(parseLinkHeader()).toBeUndefined();
    expect(parseLinkHeader('')).toBeUndefined();
  });

  it('keeps only prev, next and up relations', () => {
    expect(parseLinkHeader(LINK)).toEqual({
      prev: 'https://store.test/wp-json/wc/store/v1/products?page=1',
      next: 'https://store.test/wp-json/wc/store/v1/products?page=3',
      up: 'https://store.test/wp-json/wc/store/v1',
    });
  });

  it('ignores malformed parts', () => {
    expect(parseLinkHeader('not a link, <x>; rel=next')).toEqual({});
  });
});

describe('parseLinkHeaderPage', () => {
  it('reads the page query parameter', () => {
    expect(parseLinkHeaderPage('https://store.test/x?page=7')).toBe(7);
  });
});

describe('extractPagination', () => {
  it('returns an empty object without headers', () => {
    expect(extractPagination()).toEqual({});
  });

  it('reads totals and next/previous pages', () => {
    expect(
      extractPagination({
        link: LINK,
        'x-wp-total': '42',
        'x-wp-totalpages': '5',
      })
    ).toEqual({ next: 3, previous: 1, total: 42, totalPages: 5 });
  });

  it('leaves totals undefined when the headers are missing', () => {
    expect(extractPagination({})).toEqual({
      total: undefined,
      totalPages: undefined,
    });
  });
});
