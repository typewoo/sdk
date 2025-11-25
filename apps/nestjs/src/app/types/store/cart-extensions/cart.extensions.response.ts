import { CartExtensionsResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartExtensionsResponse extends createZodDto(
  CartExtensionsResponseSchema
) {}
