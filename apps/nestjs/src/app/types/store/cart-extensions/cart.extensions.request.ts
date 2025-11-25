import { CartExtensionsRequestSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartExtensionsRequest extends createZodDto(
  CartExtensionsRequestSchema
) {}
