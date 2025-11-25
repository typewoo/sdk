import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import * as qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import {
  ApiAdminProductReview,
  ApiAdminProductReviewQueryParams,
  ApiAdminProductReviewRequest,
} from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/products/reviews')
export class AdminProductReviewController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
    isArray: true,
  })
  list(
    @Query() params: ApiAdminProductReviewQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/reviews';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/reviews';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
  })
  create(
    @Body() review: ApiAdminProductReviewRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/reviews';
    return this.wpHttpService.proxy(endpoint, req, res, review);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
  })
  update(
    @Param('id') id: string,
    @Body() review: ApiAdminProductReviewRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/reviews/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, review);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
  })
  delete(
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/products/reviews/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductReview,
    isArray: true,
  })
  batch(
    @Body()
    operations: {
      create?: ApiAdminProductReviewRequest[];
      update?: Array<ApiAdminProductReviewRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/reviews/batch';
    return this.wpHttpService.proxy(endpoint, req, res, operations);
  }
}
