import { BaseService } from '../base.service.js';
import { doPost } from '../../http/http.js';
import { ApiResult } from '../../types/api.js';
import { BatchRequest, BatchResponse } from '../../types/index.js';
import { RequestOptions } from '../../types/request.js';

/**
 * Batch API
 *
 * The batch API allows you to make multiple API requests in a single HTTP request.
 * This can be useful for performance optimization when you need to make several API calls.
 */
export class BatchService extends BaseService {
  private readonly endpoint = 'wp-json/wc/store/v1/batch';

  /**
   * Execute Batch Request
   * Process multiple API requests in a single HTTP request
   * @param params - Batch request parameters containing individual requests
   * @returns {BatchResponse} - Batch response containing individual results
   */
  async execute(
    params: BatchRequest,
    options?: RequestOptions,
  ): Promise<ApiResult<BatchResponse>> {
    const url = `/${this.endpoint}`;

    this.events.emit('batch:loading', true);
    this.events.emit('batch:request:start');

    const { data, error } = await doPost<BatchResponse, BatchRequest>(
      url,
      params,
      options,
    );

    this.events.emitIf(!!data, 'batch:request:success');
    this.events.emitIf(!!error, 'batch:request:error', { error });
    this.events.emit('batch:loading', false);

    return { data, error };
  }
}
