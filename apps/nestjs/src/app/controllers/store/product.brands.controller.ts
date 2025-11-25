import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import { ApiProductBrandResponse } from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/products/brands';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductBrandsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductBrandResponse,
    isArray: true,
  })
  list(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('page') page?: number,
    @Query('per_page') per_page?: number,
    @Query('offset') offset?: number
  ) {
    const params = new URLSearchParams();

    if (page !== undefined) params.append('page', page.toString());
    if (per_page !== undefined) params.append('per_page', per_page.toString());
    if (offset !== undefined) params.append('offset', offset.toString());

    const queryString = params.toString();
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiProductBrandResponse,
  })
  single(
    @Param('id') id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${id}`;
    return this.wpHttpService.proxy(url, req, res);
  }
}
