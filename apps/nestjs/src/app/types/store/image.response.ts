import { ImageResponseSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiImageResponse extends createZodDto(ImageResponseSchema) {}
