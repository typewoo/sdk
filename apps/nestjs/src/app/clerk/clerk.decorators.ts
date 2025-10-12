import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_AUTHORIZED = 'IsAuthorized';
export const Authorized = () => SetMetadata(IS_AUTHORIZED, true);
