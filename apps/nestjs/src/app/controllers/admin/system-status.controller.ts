import { Controller, Get, Query, Param, Req, Res } from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiErrorResponse,
  ApiAdminSystemStatus,
  ApiAdminSystemStatusQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/system_status')
export class AdminSystemStatusController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminSystemStatus,
  })
  get(
    @Query() params: ApiAdminSystemStatusQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/system_status';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get('tools')
  @ApiResponse({
    status: 200,
    type: Object,
    isArray: true,
  })
  listTools(
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/system_status/tools';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get('tools/:toolId')
  @ApiResponse({
    status: 200,
    type: Object,
  })
  getTool(
    @Param('toolId') toolId: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/system_status/tools';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${toolId}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }
}
