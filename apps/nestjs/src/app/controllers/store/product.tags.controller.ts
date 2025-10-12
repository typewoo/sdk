import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import qs from 'qs';
import type { Response, Request } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import {
  ApiErrorResponse,
  ApiProductTagRequest,
  ApiProductTagResponse,
} from '@store-sdk/core';

const endpoint = 'wp-json/wc/store/v1/products/tags';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductTagsController {
  constructor(private readonly http: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductTagResponse,
    isArray: true,
  })
  list(
    @Query() params: ApiProductTagRequest,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const query = qs.stringify(params, { encode: true });
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.http.proxy(url, request, response);
  }
}
