import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import {
  ApiBatchRequest,
  ApiBatchResponse,
  ApiErrorResponse,
} from '@store-sdk/core';
import { ApiResponse } from '@nestjs/swagger';

const endpoint = 'wp-json/wc/store/v1/batch';
@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class BatchController {
  constructor(private readonly wpService: WordPressHttpService) {}

  @Post()
  @ApiResponse({ status: 200, type: ApiBatchResponse })
  batch(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: ApiBatchRequest
  ) {
    return this.wpService.proxy(endpoint, req, res, body);
  }
}
