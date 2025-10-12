import { Controller, Get, Param, Query, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import qs from 'qs';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiErrorResponse,
  ApiProductRequest,
  ApiProductResponse,
} from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/products';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductResponse,
    isArray: true,
  })
  list(
    @Query() params: ApiProductRequest,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    const query = qs.stringify({ ...params }, { encode: false });
    const url = `${endpoint}${query ? `?${query}` : ''}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiProductResponse,
  })
  single(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request
  ) {
    const url = `${endpoint}/${id}`;
    return this.wpHttpService.proxy(url, req, res);
  }
}
