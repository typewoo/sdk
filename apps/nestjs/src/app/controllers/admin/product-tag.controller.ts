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
import { ApiErrorResponse, ApiAdminTaxonomyTag } from '@store-sdk/core';
import type {
  AdminTaxonomyTagRequest,
  AdminTaxonomyTagQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/products/tags')
export class AdminProductTagController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyTag,
    isArray: true,
  })
  list(
    @Query() params: AdminTaxonomyTagQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyTag,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyTag,
  })
  create(
    @Body() tag: AdminTaxonomyTagRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
    return this.wpHttpService.proxy(endpoint, req, res, tag);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyTag,
  })
  update(
    @Param('id') id: string,
    @Body() tag: AdminTaxonomyTagRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, tag);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxonomyTag,
  })
  delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
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
      create?: AdminTaxonomyTagRequest[];
      update?: Array<AdminTaxonomyTagRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/tags';
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
