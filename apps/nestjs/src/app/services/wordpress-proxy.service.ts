import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { WordPressHttpService } from './wordpress.http.service';

export interface ProxyOptions {
  headersToForward?: string[];
  headersToBackward?: string[];
  forwardAllHeaders?: boolean;
}

@Injectable()
export class WordPressProxyService {
  private readonly defaultBackwardHeaders: string[];

  constructor(
    private readonly configService: ConfigService,
    private readonly wpHttpService: WordPressHttpService
  ) {
    this.defaultBackwardHeaders = this.configService
      .get<string>(
        'STORE_API_BACKWARD_HEADERS',
        'authorization,x-wp-nonce,x-custom-header'
      )
      .split(',')
      .map((e) => e.trim());
  }

  /**
   * Proxies a GET request to WordPress and forwards headers bidirectionally
   */
  async proxyGet<T>(
    url: string,
    incomingHeaders: Record<string, string | string[]>,
    response: Response,
    options: ProxyOptions = {}
  ): Promise<void> {
    // Forward headers from incoming request to WordPress
    const forwardedHeaders = this.wpHttpService.forwardHeaders(incomingHeaders);

    try {
      // Make request to WordPress
      const data = await this.wpHttpService.doGet<T>(url, {
        headers: forwardedHeaders,
      });

      // Forward headers from incoming request back to response
      this.forwardHeadersToResponse(incomingHeaders, response, options);

      // Send the response
      response.json(data);
    } catch (error) {
      // Forward headers even on error
      this.forwardHeadersToResponse(incomingHeaders, response, options);

      // Re-throw the error to let NestJS handle it
      throw error;
    }
  }

  /**
   * Forwards specific headers from incoming request to the response
   */
  private forwardHeadersToResponse(
    incomingHeaders: Record<string, string | string[]>,
    response: Response,
    options: ProxyOptions
  ): void {
    const headersToBackward =
      options.headersToBackward || this.defaultBackwardHeaders;

    if (options.forwardAllHeaders) {
      // Forward all headers (be careful with this)
      Object.entries(incomingHeaders).forEach(([key, value]) => {
        if (this.shouldForwardHeader(key)) {
          response.set(key, Array.isArray(value) ? value[0] : value);
        }
      });
    } else {
      // Forward only specific headers
      headersToBackward.forEach((headerName) => {
        const headerValue = incomingHeaders[headerName.toLowerCase()];
        if (headerValue) {
          response.set(
            headerName,
            Array.isArray(headerValue) ? headerValue[0] : headerValue
          );
        }
      });
    }
  }

  /**
   * Determines if a header should be forwarded (security check)
   */
  private shouldForwardHeader(headerName: string): boolean {
    const lowerHeaderName = headerName.toLowerCase();

    // Skip internal/sensitive headers
    const skipHeaders = [
      'host',
      'connection',
      'content-length',
      'transfer-encoding',
      'upgrade',
      'proxy-authorization',
      'proxy-authenticate',
    ];

    return !skipHeaders.includes(lowerHeaderName);
  }
}
