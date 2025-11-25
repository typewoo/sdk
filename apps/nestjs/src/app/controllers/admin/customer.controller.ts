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
import { AdminCustomerQueryParams, AdminCustomerRequest } from '@typewoo/core';
import { ApiAdminCustomer } from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/customers')
export class AdminCustomerController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminCustomer,
    isArray: true,
  })
  list(
    @Query() params: AdminCustomerQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminCustomer,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminCustomer,
  })
  create(
    @Body() customer: AdminCustomerRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    return this.wpHttpService.proxy(endpoint, req, res, customer);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminCustomer,
  })
  update(
    @Param('id') id: string,
    @Body() customer: AdminCustomerRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, customer);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminCustomer,
  })
  delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean,
    @Query('reassign') reassign?: string
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    const queryParams: { force: boolean; reassign?: number } = {
      force: force || false,
    };
    if (reassign) {
      queryParams.reassign = parseInt(reassign, 10);
    }
    const query = qs.stringify(queryParams, { encode: false });
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
      create?: AdminCustomerRequest[];
      update?: Array<AdminCustomerRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/customers';
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
