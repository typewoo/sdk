import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import * as qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import {
  ApiProductCategoryResponse,
  ApiProductCategoryRequest,
} from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/products/categories';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductCategoriesController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductCategoryResponse,
    isArray: true,
  })
  list(
    @Query() params: ApiProductCategoryRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify(params);
    const url = `${endpoint}?${query}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiProductCategoryResponse,
  })
  single(
    @Param('id') id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${id}`;
    return this.wpHttpService.proxy(url, req, res);
  }
}
