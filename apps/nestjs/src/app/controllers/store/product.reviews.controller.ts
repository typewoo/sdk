import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import * as qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import {
  ApiProductReviewResponse,
  ApiProductReviewRequest,
} from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/products/reviews';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductReviewsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductReviewResponse,
    isArray: true,
  })
  list(
    @Query() params: ApiProductReviewRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify(params, { encode: true });
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }
}
