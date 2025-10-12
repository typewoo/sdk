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
  ApiAdminRefund,
  ApiAdminRefundCreateRequest,
  ApiAdminRefundQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wc/v3/orders/:orderId/refunds')
export class AdminRefundController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminRefund,
    isArray: true,
  })
  list(
    @Param('orderId') orderId: string,
    @Query() params: ApiAdminRefundQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/orders/${orderId}/refunds`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminRefund,
  })
  get(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/orders/${orderId}/refunds`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminRefund,
  })
  create(
    @Param('orderId') orderId: string,
    @Body() refund: ApiAdminRefundCreateRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/orders/${orderId}/refunds`;
    return this.wpHttpService.proxy(endpoint, req, res, refund);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminRefund,
  })
  update(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Body() refund: ApiAdminRefundCreateRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/orders/${orderId}/refunds/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, refund);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminRefund,
  })
  delete(
    @Param('orderId') orderId: string,
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/orders/${orderId}/refunds/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
