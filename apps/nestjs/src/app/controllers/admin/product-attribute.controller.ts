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
import {
  ApiErrorResponse,
  ApiAdminProductAttribute,
  ApiAdminProductAttributeRequest,
  ApiAdminProductAttributeQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wc/v3/products/attributes')
export class AdminProductAttributeController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
    isArray: true,
  })
  list(
    @Query() params: ApiAdminProductAttributeQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/attributes';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/attributes';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
  })
  create(
    @Body() attribute: ApiAdminProductAttributeRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/attributes';
    return this.wpHttpService.proxy(endpoint, req, res, attribute);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
  })
  update(
    @Param('id') id: string,
    @Body() attribute: ApiAdminProductAttributeRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, attribute);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
  })
  delete(
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/products/attributes/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttribute,
    isArray: true,
  })
  batch(
    @Body()
    operations: {
      create?: ApiAdminProductAttributeRequest[];
      update?: Array<ApiAdminProductAttributeRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products/attributes/batch';
    return this.wpHttpService.proxy(endpoint, req, res, operations);
  }
}
