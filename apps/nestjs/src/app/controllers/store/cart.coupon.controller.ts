import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiCartCouponResponse, ApiErrorResponse } from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/cart/coupons';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CartCouponsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({ status: 200, type: ApiCartCouponResponse, isArray: true })
  list(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Get(':code')
  @ApiResponse({ status: 200, type: ApiCartCouponResponse })
  single(
    @Param('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${code}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post()
  @ApiResponse({ status: 200, type: ApiCartCouponResponse })
  add(
    @Query('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}?code=${code}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Delete(':code')
  @ApiResponse({ status: 200, type: ApiCartCouponResponse })
  delete(
    @Param('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${code}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Delete()
  @ApiResponse({ status: 200, type: ApiCartCouponResponse })
  clear(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
