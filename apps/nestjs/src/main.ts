/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ZodFilter } from './app/filters/zod.filter';
import { AdminModule } from './app/controllers/admin/admin.module';
import { StoreModule } from './app/controllers/store/store.module';
import { AuthModule } from './app/controllers/auth/auth.module';
import { ApiKeyGuard } from './app/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.STORE_API_PREFIX || '';

  // Apply API Key Guard globally
  const configService = app.get(ConfigService);
  app.useGlobalGuards(new ApiKeyGuard(configService));

  // Auth API spec
  const authOptions = new DocumentBuilder()
    .setTitle('Auth API')
    .setVersion('1.0')
    .build();
  const authOpenApiDoc = SwaggerModule.createDocument(app, authOptions, {
    include: [AuthModule],
  });

  // Admin API spec
  const adminOptions = new DocumentBuilder()
    .setTitle('WooCommerce REST API')
    .setDescription(
      'The WooCommerce REST API is a powerful part of WooCommerce which lets you read and write various parts of WooCommerce data such as orders, products, coupons, customers, and shipping zones.'
    )
    .setVersion('1.0')
    .build();
  const adminOpenApiDoc = SwaggerModule.createDocument(app, adminOptions, {
    include: [AdminModule],
  });

  // Store API spec
  const storeOptions = new DocumentBuilder()
    .setTitle('WooCommerce Store API')
    .setDescription(
      'The Store API provides public Rest API endpoints for the development of customer-facing cart, checkout, and product functionality.'
    )
    .setVersion('1.0')
    .build();
  const storeOpenApiDoc = SwaggerModule.createDocument(app, storeOptions, {
    include: [StoreModule],
  });

  // Setup single Swagger UI with all specs
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(authOpenApiDoc), {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: '/swagger/auth/json',
          name: 'Auth API',
        },
        {
          url: '/swagger/admin/json',
          name: 'WooCommerce REST API',
        },
        {
          url: '/swagger/store/json',
          name: 'WooCommerce Store API',
        },
      ],
    },
    jsonDocumentUrl: 'swagger/auth/json',
  });

  // Serve individual JSON endpoints
  SwaggerModule.setup('api/auth', app, cleanupOpenApiDoc(authOpenApiDoc), {
    jsonDocumentUrl: 'swagger/auth/json',
  });
  SwaggerModule.setup('api/admin', app, cleanupOpenApiDoc(adminOpenApiDoc), {
    jsonDocumentUrl: 'swagger/admin/json',
  });
  SwaggerModule.setup('api/store', app, cleanupOpenApiDoc(storeOpenApiDoc), {
    jsonDocumentUrl: 'swagger/store/json',
  });

  const exposedHeaders = process.env.CORS_EXPOSE_HEADERS ?? '';
  app.enableCors({
    exposedHeaders: exposedHeaders.split(',').map((h) => h.trim()),
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new ZodFilter());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
