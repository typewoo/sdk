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
  ApiAdminWebhook,
  ApiAdminWebhookQueryParams,
  ApiAdminWebhookRequest,
} from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/webhooks')
export class AdminWebhookController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
    isArray: true,
  })
  list(
    @Query() params: ApiAdminWebhookQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/webhooks';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/webhooks';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
  })
  create(
    @Body() webhook: ApiAdminWebhookRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/webhooks';
    return this.wpHttpService.proxy(endpoint, req, res, webhook);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
  })
  update(
    @Param('id') id: string,
    @Body() webhook: ApiAdminWebhookRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/webhooks/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, webhook);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
  })
  delete(
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/webhooks/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
    type: ApiAdminWebhook,
    isArray: true,
  })
  batch(
    @Body()
    operations: {
      create?: ApiAdminWebhookRequest[];
      update?: Array<ApiAdminWebhookRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/webhooks/batch';
    return this.wpHttpService.proxy(endpoint, req, res, operations);
  }
}
