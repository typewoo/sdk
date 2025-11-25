import { PaginatedSchema } from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiPaginated extends createZodDto(PaginatedSchema) {}
