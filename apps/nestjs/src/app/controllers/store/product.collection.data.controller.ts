import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import {
  ApiErrorResponse,
  ApiProductCollectionDataRequest,
  ApiProductCollectionDataResponse,
} from '@store-sdk/core';

const endpoint = 'wp-json/wc/store/v1/products/collection-data';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductCollectionDataController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductCollectionDataResponse,
  })
  calculate(
    @Query() params: ApiProductCollectionDataRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify(params, { encode: true });
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }
}
