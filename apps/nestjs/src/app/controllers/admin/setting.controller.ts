import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiErrorResponse,
  ApiAdminSetting,
  ApiAdminSettingRequest,
  ApiAdminSettingGroup,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/settings')
export class AdminSettingController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminSettingGroup,
    isArray: true,
  })
  list(
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/settings';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':groupId')
  @ApiResponse({
    status: 200,
    type: ApiAdminSettingGroup,
  })
  getGroup(
    @Param('groupId') groupId: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/settings';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${groupId}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  // Setting options endpoints
  @Get(':groupId/options')
  @ApiResponse({
    status: 200,
    type: ApiAdminSetting,
    isArray: true,
  })
  listOptions(
    @Param('groupId') groupId: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/settings/${groupId}/options`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':groupId/options/:optionId')
  @ApiResponse({
    status: 200,
    type: ApiAdminSetting,
  })
  getOption(
    @Param('groupId') groupId: string,
    @Param('optionId') optionId: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/settings/${groupId}/options`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${optionId}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Put(':groupId/options/:optionId')
  @ApiResponse({
    status: 200,
    type: ApiAdminSetting,
  })
  updateOption(
    @Param('groupId') groupId: string,
    @Param('optionId') optionId: string,
    @Body() option: ApiAdminSettingRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/settings/${groupId}/options/${optionId}`;
    return this.wpHttpService.proxy(endpoint, req, res, option);
  }

  @Post(':groupId/options/batch')
  @ApiResponse({
    status: 200,
    type: ApiAdminSetting,
    isArray: true,
  })
  batchOptions(
    @Param('groupId') groupId: string,
    @Body()
    operations: {
      update?: Array<ApiAdminSettingRequest & { id: string }>;
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/settings/${groupId}/options/batch`;
    return this.wpHttpService.proxy(endpoint, req, res, operations);
  }
}
