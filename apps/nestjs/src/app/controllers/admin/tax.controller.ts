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
  ApiAdminTax,
  ApiAdminTaxQueryParams,
  ApiAdminTaxClass,
  ApiAdminTaxClassRequest,
  ApiAdminTaxRequest,
} from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/taxes')
export class AdminTaxController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
    isArray: true,
  })
  list(
    @Query() params: ApiAdminTaxQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
  })
  create(
    @Body() tax: ApiAdminTaxRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes';
    return this.wpHttpService.proxy(endpoint, req, res, tax);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
  })
  update(
    @Param('id') id: string,
    @Body() tax: ApiAdminTaxRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/taxes/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, tax);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
  })
  delete(
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/taxes/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
    type: ApiAdminTax,
    isArray: true,
  })
  batch(
    @Body()
    operations: {
      create?: ApiAdminTaxRequest[];
      update?: Array<ApiAdminTaxRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes/batch';
    return this.wpHttpService.proxy(endpoint, req, res, operations);
  }

  // Tax Classes endpoints
  @Get('classes')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxClass,
    isArray: true,
  })
  listClasses(
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes/classes';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('classes')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxClass,
  })
  createClass(
    @Body() taxClass: ApiAdminTaxClassRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/taxes/classes';
    return this.wpHttpService.proxy(endpoint, req, res, taxClass);
  }

  @Delete('classes/:slug')
  @ApiResponse({
    status: 200,
    type: ApiAdminTaxClass,
  })
  deleteClass(
    @Param('slug') slug: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/taxes/classes/${slug}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
