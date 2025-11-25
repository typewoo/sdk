import { CartItemResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiCartItemResponse extends createZodDto(CartItemResponseSchema) {}
