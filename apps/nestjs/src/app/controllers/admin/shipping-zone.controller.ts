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
  ApiAdminShippingZone,
  ApiAdminShippingZoneRequest,
  ApiAdminShippingZoneQueryParams,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/shipping/zones')
export class AdminShippingZoneController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminShippingZone,
    isArray: true,
  })
  list(
    @Query() params: ApiAdminShippingZoneQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/shipping/zones';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminShippingZone,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/shipping/zones';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminShippingZone,
  })
  create(
    @Body() zone: ApiAdminShippingZoneRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/shipping/zones';
    return this.wpHttpService.proxy(endpoint, req, res, zone);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminShippingZone,
  })
  update(
    @Param('id') id: string,
    @Body() zone: ApiAdminShippingZoneRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/shipping/zones/${id}`;
    return this.wpHttpService.proxy(endpoint, req, res, zone);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminShippingZone,
  })
  delete(
    @Param('id') id: string,
    @Query('force') force = false,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ force }, { encode: false });
    const endpoint = `wp-json/wc/v3/shipping/zones/${id}?${query}`;
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
