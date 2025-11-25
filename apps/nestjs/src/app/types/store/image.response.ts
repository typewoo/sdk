import { ImageResponseSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiImageResponse extends createZodDto(ImageResponseSchema) {}
