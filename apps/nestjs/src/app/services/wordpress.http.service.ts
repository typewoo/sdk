import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { AxiosApiResult, doRequest } from '@store-sdk/core';
import { from, map, Observable, tap } from 'rxjs';
import type { Response, Request } from 'express';

@Injectable()
export class WordPressHttpService {
  private readonly baseUrl: string;

  private readonly storeForwardHeaders: string[];
  private readonly storeBackwardHeaders: string[];

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.baseUrl = this.configService.get<string>('STORE_API_URL', '');

    this.storeForwardHeaders = this.configService
      .get<string>('STORE_API_FORWARD_HEADERS', '')
      .split(',')
      .map((e) => e.trim());

    this.storeBackwardHeaders = this.configService
      .get<string>('STORE_API_BACKWARD_HEADERS', '')
      .split(',')
      .map((e) => e.trim());
  }

  forwardHeaders = (incomingHeaders: Record<string, string | string[]>) => {
    const forwardedHeaders: Record<string, string | string[]> = {};

    for (const header of this.storeForwardHeaders) {
      if (incomingHeaders[header]) {
        forwardedHeaders[header] = incomingHeaders[header];
      }
    }

    return forwardedHeaders;
  };

  proxy<T>(path: string, req: Request, res: Response, body?: T) {
    if (!this.baseUrl) {
      return {
        error: 'STORE_API_URL is missing',
        status: 400,
      };
    }
    const data = body ?? req?.body;

    const headers = req?.headers ?? {};
    const forwardedHeaders: Record<string, string | string[]> = {};
    for (const header of this.storeForwardHeaders) {
      if (headers[header]) {
        forwardedHeaders[header] = headers[header];
      }
    }

    const url = `${this.baseUrl}/${path}`;
    const method = req?.method?.toLowerCase() ?? 'get';
    const options: AxiosRequestConfig = {
      method: method,
      headers: forwardedHeaders,
    };

    let source: Observable<AxiosApiResult<T>>;
    switch (method) {
      case 'get':
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      case 'post':
        options.data = data;
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      case 'put':
        options.data = data;
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      case 'patch':
        options.data = data;
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      case 'delete':
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      case 'head':
        options.validateStatus = () => true;
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
      default:
        source = from(doRequest<T>(this.httpService.axiosRef, url, options));
        break;
    }

    return source.pipe(
      tap((sourceRes) => {
        if (sourceRes.status) {
          res.status(sourceRes.status);
        }

        const resHeaders = sourceRes.headers ?? {};
        for (const header of this.storeBackwardHeaders) {
          if (resHeaders[header]) {
            res?.set(header, resHeaders[header] as string);
          }
        }
      }),
      map((e) => {
        return {
          data: e.data,
          error: e.error,
        };
      })
    );
  }

  doGet<T>(url: string, options?: AxiosRequestConfig) {
    const u = `${this.baseUrl}/${url}`;
    return from(
      doRequest<T>(this.httpService.axiosRef, u, {
        ...options,
        method: 'get',
      })
    );
  }

  /**
   * Make a POST request to WordPress API
   */
  doPost<T, TData>(url: string, data?: TData, options?: AxiosRequestConfig) {
    return from(
      doRequest<T>(this.httpService.axiosRef, url, {
        ...options,
        method: 'post',
        data: data,
      })
    );
  }

  /**
   * Make a PUT request to WordPress API
   */
  doPut<T, TData>(url: string, data?: TData, options?: AxiosRequestConfig) {
    return from(
      doRequest<T>(this.httpService.axiosRef, url, {
        ...options,
        method: 'put',
        data: data,
      })
    );
  }

  /**
   * Make a DELETE request to WordPress API
   */
  doDelete<T>(url: string, options?: AxiosRequestConfig) {
    return from(
      doRequest<T>(this.httpService.axiosRef, url, {
        ...options,
        method: 'delete',
      })
    );
  }

  doHead<T>(url: string, options?: AxiosRequestConfig) {
    return from(
      doRequest<T>(this.httpService.axiosRef, url, {
        ...options,
        method: 'head',
        validateStatus: () => true,
      })
    );
  }

  /**
   * Make a PATCH request to WordPress API
   */
  doPatch<T, TData>(url: string, data?: TData, options?: AxiosRequestConfig) {
    return from(
      doRequest<T>(this.httpService.axiosRef, url, {
        ...options,
        method: 'patch',
        data: data,
      })
    );
  }
}
