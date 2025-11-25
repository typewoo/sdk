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
  AdminTaxonomyCategoryQueryParams,
  AdminTaxonomyCategoryRequest,
} from '@store-sdk/core';
import { ApiAdminTaxonomyCategory } from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/products/categories')
export class AdminProductCategoryController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyCategory,
    isArray: true,
  })
  list(
    @Query() params: AdminTaxonomyCategoryQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyCategory,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyCategory,
  })
  create(
    @Body() category: AdminTaxonomyCategoryRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    return this.wpHttpService.proxy(endpoint, req, res, category);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyCategory,
  })
  update(
    @Param('id') id: string,
    @Body() category: AdminTaxonomyCategoryRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, category);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyCategory,
  })
  delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    const query = qs.stringify({ force: force || false }, { encode: false });
    const url = `${endpoint}/${id}?${query}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
  })
  batch(
    @Body()
    operations: {
      create?: AdminTaxonomyCategoryRequest[];
      update?: Array<AdminTaxonomyCategoryRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/categories';
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
