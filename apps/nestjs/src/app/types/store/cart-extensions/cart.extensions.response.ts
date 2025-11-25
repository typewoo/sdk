import { CartExtensionsResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartExtensionsResponse extends createZodDto(
  CartExtensionsResponseSchema
) {}
