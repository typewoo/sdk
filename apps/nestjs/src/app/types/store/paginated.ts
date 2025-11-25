import { PaginatedSchema } from '@typewoo/core';
import { createZodDto } from 'nestjs-zod';
export class ApiPaginated extends createZodDto(PaginatedSchema) {}
