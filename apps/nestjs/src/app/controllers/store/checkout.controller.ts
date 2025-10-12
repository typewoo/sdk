import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiCheckoutCreateRequest,
  ApiCheckoutResponse,
  ApiCheckoutUpdateRequest,
  ApiErrorResponse,
} from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/checkout';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CheckoutController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Get()
  @ApiResponse({ status: 200, type: ApiCheckoutResponse })
  get(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const url = `${endpoint}/`;
    return this.wpHttpService.proxy(url, req, res);
  }

  @Put()
  @ApiResponse({ status: 200, type: ApiCheckoutResponse })
  update(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body?: ApiCheckoutUpdateRequest,
    @Query('__experimental_calc_totals') experimental_calc_totals?: boolean
  ) {
    const params = new URLSearchParams();
    params.append(
      '__experimental_calc_totals',
      (experimental_calc_totals || false).toString()
    );

    if (body) {
      // Add body parameters to query string to match core service pattern
      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${endpoint}/?${params.toString()}`;
    return this.wpHttpService.proxy(url, req, res, body);
  }

  @Post()
  @ApiResponse({ status: 200, type: ApiCheckoutResponse })
  processOrderAndPayment(
    @Body() body: ApiCheckoutCreateRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const url = `${endpoint}/`;
    return this.wpHttpService.proxy(url, req, res, body);
  }
}
