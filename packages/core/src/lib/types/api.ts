import z from 'zod';

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    status: z.number().int(),
    params: z.record(z.string(), z.string()).optional(),
  }),
  details: z.record(z.string(), z.record(z.string(), z.string())),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export interface ApiData<T> {
  data: T;
}
export class ApiDataResponse<T> implements ApiData<T> {
  data!: T;
}

export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
  headers?: Record<string, string>;
}
export class ApiResultResponse<T> implements ApiResult<T> {}

export interface Pagination {
  next?: number;
  previous?: number;
  /**
   * The total number of items in the collection.
   */
  total?: number;

  /**
   * The total number of pages in the collection.
   */
  totalPages?: number;

  /**
   * Contains links to other pages; next, prev, and up where applicable.
   */
  link?: {
    up?: string;
    prev?: string;
    next?: string;
  };
}

export interface ApiPaginationResult<T> extends ApiResult<T> {
  pagination: Pagination;
}

export interface AxiosApiResult<T> extends ApiResult<T> {
  status?: number;
}
