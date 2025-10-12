import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiCartExtensionsRequest,
  ApiCartExtensionsResponse,
  ApiErrorResponse,
} from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/cart/extensions';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class CartExtensionsController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  @Post()
  @ApiResponse({ status: 200, type: ApiCartExtensionsResponse })
  store(
    @Body() body: ApiCartExtensionsRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.wpHttpService.proxy(endpoint, req, res, body);
  }
}
