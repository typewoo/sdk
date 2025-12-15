import { AxiosError, Method } from 'axios';
import { getSdkConfig } from '../configs';

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG = {
  maxRetries: 3,
  delay: 1000,
  retryOnStatus: [408, 429, 500, 502, 503, 504],
  retryOnMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'] as Method[],
};

/**
 * Sleep utility for retry delays
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get the retry delay for a given attempt
 */
export const getRetryDelay = (
  delay: number | ((attempt: number) => number) | undefined,
  attempt: number,
): number => {
  if (typeof delay === 'function') {
    return delay(attempt);
  }
  return delay ?? DEFAULT_RETRY_CONFIG.delay;
};

/**
 * Get the max retries value
 */
export const getMaxRetries = (
  maxRetries: number | (() => number) | undefined,
): number => {
  if (typeof maxRetries === 'function') {
    return maxRetries();
  }
  return maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries;
};

/**
 * Check if the request should be retried based on configuration
 */
export const shouldRetry = (
  error: AxiosError,
  attempt: number,
  method: string,
): boolean => {
  const config = getSdkConfig();
  const retryConfig = config?.request?.retry;

  if (!retryConfig?.enabled) {
    return false;
  }

  const maxRetries = getMaxRetries(retryConfig.maxRetries);
  if (attempt >= maxRetries) {
    return false;
  }

  // Check if method is retryable
  const retryOnMethods =
    retryConfig.retryOnMethods ?? DEFAULT_RETRY_CONFIG.retryOnMethods;
  if (!retryOnMethods.includes(method.toUpperCase() as Method)) {
    return false;
  }

  // Check custom retry condition
  if (retryConfig.retryCondition) {
    if (!retryConfig.retryCondition(error, attempt)) {
      return false;
    }
  }

  // Check if status code is retryable
  const retryOnStatus =
    retryConfig.retryOnStatus ?? DEFAULT_RETRY_CONFIG.retryOnStatus;

  // Network errors (no response) should be retried
  if (!error.response) {
    return true;
  }

  return retryOnStatus.includes(error.response.status);
};
