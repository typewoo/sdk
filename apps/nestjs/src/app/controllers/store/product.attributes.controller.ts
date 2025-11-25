import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import { ApiProductAttributeResponse } from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/products/attributes';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class ProductAttributesController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: ApiProductAttributeResponse,
    isArray: true,
  })
  list(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    type: ApiProductAttributeResponse,
  })
  single(
    @Param('id') id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${id}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Get(':attributeId/terms')
  @ApiResponse({
    status: 200,
    type: ApiProductAttributeResponse,
    isArray: true,
  })
  listTerms(
    @Param('attributeId') attributeId: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('order') order?: 'asc' | 'desc',
    @Query('orderby')
    orderby?: 'id' | 'name' | 'name_num' | 'slug' | 'count' | 'menu_order'
  ) {
    const params = new URLSearchParams();

    if (order) params.append('order', order);
    if (orderby) params.append('orderby', orderby);

    const queryString = params.toString();
    const url = `${endpoint}/${attributeId}/terms${
      queryString ? `?${queryString}` : ''
    }`;

    return this.wpHttpService.proxy(url, req, res);
  }
}
