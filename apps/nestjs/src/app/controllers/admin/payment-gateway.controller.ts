import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiErrorResponse, ApiAdminPaymentGateway } from '@store-sdk/core';
import type {
  AdminPaymentGatewayRequest,
  AdminPaymentGatewayQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wc/v3/payment_gateways')
export class AdminPaymentGatewayController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminPaymentGateway,
    isArray: true,
  })
  list(
    @Query() params: AdminPaymentGatewayQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/payment_gateways';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminPaymentGateway,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/payment_gateways';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminPaymentGateway,
  })
  update(
    @Param('id') id: string,
    @Body() gateway: AdminPaymentGatewayRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/payment_gateways';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, gateway);
  }
}
