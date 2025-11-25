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
import { AdminOrderQueryParams, AdminOrderRequest } from '@store-sdk/core';
import { ApiAdminOrder } from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/orders')
export class AdminOrderController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminOrder,
    isArray: true,
  })
  list(
    @Query() params: AdminOrderQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminOrder,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminOrder,
  })
  create(
    @Body() order: AdminOrderRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
    return this.wpHttpService.proxy(endpoint, req, res, order);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminOrder,
  })
  update(
    @Param('id') id: string,
    @Body() order: AdminOrderRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, order);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminOrder,
  })
  delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
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
      create?: AdminOrderRequest[];
      update?: Array<AdminOrderRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/orders';
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
