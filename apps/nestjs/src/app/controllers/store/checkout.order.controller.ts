import { Controller, Post, Param, Body, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import { ApiCheckoutResponse, ApiOrderRequest } from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/checkout';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CheckoutOrderController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Post(':orderId')
  @ApiResponse({ status: 200, type: ApiCheckoutResponse })
  order(
    @Param('orderId') orderId: number,
    @Body() body: ApiOrderRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/${orderId}`;
    return this.wpHttpService.proxy(url, req, res, body);
  }
}
