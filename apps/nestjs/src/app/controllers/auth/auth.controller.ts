import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import type { Response, Request } from 'express';
import { ApiErrorResponse } from '../../types/api';
import {
  ApiAuthTokenResponse,
  ApiAuthTokenRequest,
  ApiAuthRefreshRequest,
  ApiAuthRevokeResponse,
  ApiAuthRevokeRequest,
  ApiAuthOneTimeTokenResponse,
  ApiAuthOneTimeTokenRequest,
  ApiAuthValidateResponse,
  ApiAuthStatusResponse,
} from '../../types/auth';

const endpoint = 'wp-json/store-sdk/v1/auth';

@Controller(endpoint)
@ApiResponse({ status: 400, type: ApiErrorResponse })
export class AuthController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}
  @Post('token')
  @ApiResponse({
    status: 200,
    type: ApiAuthTokenResponse,
  })
  token(
    @Body() body: ApiAuthTokenRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/store-sdk/v1/auth/token';
    return this.wpHttpService.proxy(endpoint, req, res, body);
  }

  @Post('refresh')
  @ApiResponse({
    status: 200,
    type: ApiAuthTokenResponse,
  })
  refreshToken(
    @Body() body: ApiAuthRefreshRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/store-sdk/v1/auth/refresh';
    return this.wpHttpService.proxy(endpoint, req, res, body);
  }

  @Post('revoke')
  @ApiResponse({
    status: 200,
    type: ApiAuthRevokeResponse,
  })
  revokeToken(
    @Body() body: ApiAuthRevokeRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/store-sdk/v1/auth/revoke';
    return this.wpHttpService.proxy(endpoint, req, res, body);
  }

  @Post('one-time-token')
  @ApiResponse({
    status: 200,
    type: ApiAuthOneTimeTokenResponse,
  })
  oneTimeToken(
    @Body() body: ApiAuthOneTimeTokenRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/store-sdk/v1/auth/one-time-token';
    return this.wpHttpService.proxy(endpoint, req, res, body);
  }

  @Get('validate')
  @ApiResponse({
    status: 200,
    type: ApiAuthValidateResponse,
  })
  validate(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const endpoint = 'wp-json/store-sdk/v1/auth/validate';
    return this.wpHttpService.proxy(endpoint, req, res);
  }

  @Get('status')
  @ApiResponse({
    status: 200,
    type: ApiAuthStatusResponse,
  })
  status(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const endpoint = 'wp-json/store-sdk/v1/auth/status';
    return this.wpHttpService.proxy(endpoint, req, res);
  }
}
