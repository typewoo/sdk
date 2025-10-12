import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiCartItemResponse, ApiErrorResponse } from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/cart/items';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CartItemsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({ status: 200, type: ApiCartItemResponse, isArray: true })
  list(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Get(':key')
  @ApiResponse({ status: 200, type: ApiCartItemResponse })
  single(
    @Param('key') key: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${key}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({ status: 200, type: ApiCartItemResponse })
  add(
    @Query('id') id: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('quantity') quantity?: number
  ) {
    const params = new URLSearchParams();
    params.append('id', id.toString());
    if (quantity !== undefined) {
      params.append('quantity', quantity.toString());
    }
    const url = `${endpoint}?${params.toString()}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Put(':key')
  @ApiResponse({ status: 200, type: ApiCartItemResponse })
  update(
    @Param('key') key: string,
    @Query('quantity') quantity: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${key}?quantity=${quantity}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Delete(':key')
  @ApiResponse({ status: 200, type: ApiCartItemResponse })
  remove(
    @Param('key') key: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${key}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Delete()
  @ApiResponse({ status: 200, type: ApiCartItemResponse })
  clear(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
