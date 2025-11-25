import {
  AdminMetaData,
  AdminAddress,
  AdminLinks,
  AdminImage,
  AdminDimensions,
  AdminTaxLine,
} from '@store-sdk/core';
import { createZodDto } from 'nestjs-zod';
export class ApiAdminMetaData extends createZodDto(AdminMetaData) {}
export class ApiAdminAddress extends createZodDto(AdminAddress) {}
export class ApiAdminLinks extends createZodDto(AdminLinks) {}
export class ApiAdminImage extends createZodDto(AdminImage) {}
export class ApiAdminDimensions extends createZodDto(AdminDimensions) {}
export class ApiAdminTaxLine extends createZodDto(AdminTaxLine) {}
