/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { ZodFilter } from './app/filters/zod.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = process.env.STORE_API_PREFIX || '';

  const openApiDoc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Store SDK API')
      .setDescription('The Store SDK API description')
      .setVersion('1.0')
      .build()
  );
  SwaggerModule.setup('api', app, cleanupOpenApiDoc(openApiDoc), {
    jsonDocumentUrl: 'swagger/json',
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
