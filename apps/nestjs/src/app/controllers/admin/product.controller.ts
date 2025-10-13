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
import { ApiAdminProduct, ApiErrorResponse } from '@store-sdk/core';
import type { ProductRequest, ProductQueryParams } from '@store-sdk/core';
import qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/products')
export class AdminProductController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiAdminProduct,
    isArray: true,
  })
  list(
    @Query() params: ProductQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProduct,
  })
  get(
    @Param('id') id: string,
    @Query() params: { context?: 'view' | 'edit' },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${id}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({
    status: 200,
    type: ApiAdminProduct,
  })
  create(
    @Body() product: ProductRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products';
    return this.wpHttpService.proxy(endpoint, req, res, product);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProduct,
  })
  update(
    @Param('id') id: string,
    @Body() product: ProductRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products';
    const url = `${endpoint}/${id}`;

    return this.wpHttpService.proxy(url, req, res, product);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    type: ApiAdminProduct,
  })
  delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('force') force?: boolean
  ) {
    const endpoint = 'wp-json/wc/v3/products';
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
      create?: ProductRequest[];
      update?: Array<ProductRequest & { id: number }>;
      delete?: number[];
    },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/products';
    const url = `${endpoint}/batch`;

    return this.wpHttpService.proxy(url, req, res, operations);
  }
}
