import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiErrorResponse } from '../../types/api';
import { ApiOrderResponse } from '../../types/store';

const endpoint = 'wp-json/wc/store/v1/order';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class OrderController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get(':orderId')
  @ApiResponse({
    status: 200,
    type: ApiOrderResponse,
  })
  get(
    @Param('orderId') orderId: string,
    @Query('key') key: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('billing_email') billingEmail?: string
  ) {
    let url = `${endpoint}/${orderId}?key=${key}`;
    if (billingEmail) {
      url += `&billing_email=${billingEmail}`;
    }

    return this.wpHttpService.proxy(url, req, res);
  }
}
