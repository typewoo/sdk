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
  ApiAdminProductAttributeTerm,
  ApiAdminProductAttributeTermQueryParams,
  ApiAdminProductAttributeTermRequest,
} from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/products/attributes/:attributeId/terms')
export class AdminAttributeTermController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttributeTerm,
    isArray: true,
  })
  list(
    @Param('attributeId') attributeId: string,
    @Query() params: ApiAdminProductAttributeTermQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':termId')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttributeTerm,
  })
  get(
    @Param('attributeId') attributeId: string,
    @Param('termId') termId: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${termId}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttributeTerm,
  })
  create(
    @Param('attributeId') attributeId: string,
    @Body() term: ApiAdminProductAttributeTermRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    return this.wpHttpService.proxy(endpoint, req, res, term);
  }

  @Put(':termId')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttributeTerm,
  })
  update(
    @Param('attributeId') attributeId: string,
    @Param('termId') termId: string,
    @Body() term: ApiAdminProductAttributeTermRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `${endpoint}/${termId}`;

    return this.wpHttpService.proxy(url, req, res, term);
  }

  @Delete(':termId')
  @ApiResponse({
    status: 200,
    type: ApiAdminProductAttributeTerm,
  })
  delete(
    @Param('attributeId') attributeId: string,
    @Param('termId') termId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const query = qs.stringify({ force: force || false }, { encode: false });
    const url = `${endpoint}/${termId}?${query}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('batch')
  @ApiResponse({
    status: 200,
  })
  batch(
    @Param('attributeId') attributeId: string,
    @Body()
    operations: {
      create?: ApiAdminProductAttributeTermRequest[];
      update?: Array<ApiAdminProductAttributeTermRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = `wp-json/wc/v3/products/attributes/${attributeId}/terms`;
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
