import { Controller, Get, Post, Body, Query, Req, Res } from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiCartItemAddRequest,
  ApiCartCustomerRequest,
  ApiCartResponse,
  ApiErrorResponse,
} from '@store-sdk/core';
import qs from 'qs';
import type { Response, Request } from 'express';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/cart';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CartController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({ status: 200, type: ApiCartResponse })
  get(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Post('add-item')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  add(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: ApiCartItemAddRequest
  ) {
    const url = `${endpoint}/add-item`;
    return this.wpHttpService.proxy(url, req, res, body);
  }

  @Post('update-item')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  update(
    @Query('key') key: string,
    @Query('quantity') quantity: number,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const query = qs.stringify({ key, quantity }, { encode: true });
    const url = `${endpoint}/update-item?${query}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('remove-item')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  remove(
    @Query('key') key: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/remove-item?key=${key}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('apply-coupon')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  applyCoupon(
    @Query('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/apply-coupon?code=${code}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('remove-coupon')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  removeCoupon(
    @Query('code') code: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/remove-coupon?code=${code}`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Post('update-customer')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  updateCustomer(
    @Body() body: ApiCartCustomerRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/update-customer`;
    return this.wpHttpService.proxy(url, req, res, body);
  }

  @Post('select-shipping-rate')
  @ApiResponse({ status: 200, type: ApiCartResponse })
  async selectShippingRate(
    @Query('packageId') packageId: number,
    @Query('rateId') rateId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/select-shipping-rate?package_id=${packageId}&rate_id=${rateId}`;
    return this.wpHttpService.proxy(url, req, res);
  }
}
