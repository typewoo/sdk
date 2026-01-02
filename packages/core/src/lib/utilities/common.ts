import { Pagination } from '../types/index.js';

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
  }[Keys];

export const parseLinkHeader = (linkHeader?: string) => {
  if (!linkHeader) return undefined;

  const links: Record<string, string> = {};
  const parts = linkHeader.split(',');
  for (const part of parts) {
    const match = part.trim().match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const [, url, rel] = match;
      if (rel === 'prev' || rel === 'next' || rel === 'up') {
        links[rel] = url;
      }
    }
  }

  return links;
};

export const parseLinkHeaderPage = (link: string) => {
  const url = new URL(link);
  const page = url.searchParams.get('page');
  return Number(page);
};

export const extractPagination = (
  headers?: Record<string, string>
): Pagination => {
  const pagination: Pagination = {};
  if (!headers) return pagination;

  const link = parseLinkHeader(headers['link']);
  if (link && link['next']) {
    pagination.next = parseLinkHeaderPage(link['next']);
  }
  if (link && link['prev']) {
    pagination.previous = parseLinkHeaderPage(link['prev']);
  }

  pagination.total = headers['x-wp-total']
    ? parseInt(headers['x-wp-total'], 10)
    : undefined;
  pagination.totalPages = headers['x-wp-totalpages']
    ? parseInt(headers['x-wp-totalpages'], 10)
    : undefined;

  return pagination;
};
