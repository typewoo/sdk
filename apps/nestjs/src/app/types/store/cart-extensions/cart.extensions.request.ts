import { CartExtensionsRequestSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartExtensionsRequest extends createZodDto(
  CartExtensionsRequestSchema
) {}
