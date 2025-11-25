import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

// Services
import { WordPressHttpService } from './services/wordpress.http.service';
import { WordPressProxyService } from './services/wordpress-proxy.service';

// Auth Controllers
import { AuthController } from './controllers/auth/auth.controller';
import { AdminModule } from './controllers/admin/admin.module';
import { StoreModule } from './controllers/store/store.module';
import { AuthModule } from './controllers/auth/auth.module';

@Module({
  imports: [
    HttpModule,

    AuthModule,
    AdminModule,
    StoreModule,
    // AuthModule.forRoot({ auth }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService
      ): Promise<TypeOrmModuleOptions> => {
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [],
          logging: configService.get<string>('NODE_ENV') !== 'production',
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [WordPressHttpService, WordPressProxyService, ConfigService],
})
export class AppModule {}
