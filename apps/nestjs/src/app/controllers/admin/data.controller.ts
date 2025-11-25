import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import * as qs from 'qs';
import { ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AdminDataQueryParams } from '@typewoo/core';
import {
  ApiAdminCountry,
  ApiAdminCurrency,
  ApiAdminContinent,
} from '../../types/admin';
import { ApiErrorResponse } from '../../types/api';

@ApiResponse({ status: 400, type: ApiErrorResponse })
@Controller('wp-json/wc/v3/data')
export class AdminDataController {
  constructor(private readonly wpHttpService: WordPressHttpService) {}

  // Countries endpoints
  @Get('countries')
  @ApiResponse({
    status: 200,
    type: ApiAdminCountry,
    isArray: true,
  })
  listCountries(
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/countries';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get('countries/:code')
  @ApiResponse({
    status: 200,
    type: ApiAdminCountry,
  })
  getCountry(
    @Param('code') code: string,
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/countries';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${code}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  // Currencies endpoints
  @Get('currencies')
  @ApiResponse({
    status: 200,
    type: ApiAdminCurrency,
    isArray: true,
  })
  listCurrencies(
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/currencies';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get('currencies/:code')
  @ApiResponse({
    status: 200,
    type: ApiAdminCurrency,
  })
  getCurrency(
    @Param('code') code: string,
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/currencies';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${code}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  // Continents endpoints
  @Get('continents')
  @ApiResponse({
    status: 200,
    type: ApiAdminContinent,
    isArray: true,
  })
  listContinents(
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/continents';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }

  @Get('continents/:code')
  @ApiResponse({
    status: 200,
    type: ApiAdminContinent,
  })
  getContinent(
    @Param('code') code: string,
    @Query() params: AdminDataQueryParams,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const endpoint = 'wp-json/wc/v3/data/continents';
    const query = params ? qs.stringify(params, { encode: false }) : '';
    const url = `${endpoint}/${code}${query ? `?${query}` : ''}`;

    return this.wpHttpService.proxy(url, req, res);
  }
}
