import { CartItemResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemResponse extends createZodDto(CartItemResponseSchema) {}
