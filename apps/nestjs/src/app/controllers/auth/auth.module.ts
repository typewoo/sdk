import { Module } from '@nestjs/common';

import { WordPressProxyService } from '../../services/wordpress-proxy.service';
import { WordPressHttpService } from '../../services/wordpress.http.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [AuthController],
  providers: [WordPressHttpService, WordPressProxyService],
})
export class AuthModule {}
