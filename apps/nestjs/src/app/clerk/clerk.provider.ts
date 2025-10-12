import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';
import { CLERK_PROVIDER_NAME } from './clerk.constants';

export const ClerkProvider: Provider = {
  provide: CLERK_PROVIDER_NAME,
  useFactory: (config: ConfigService) => {
    return createClerkClient({
      secretKey: config.get('CLERK_SECRET_KEY'),
      // publishableKey: config.get('CLERK_PUBLISHABLE_KEY'),
      // apiUrl: ''
    });
  },
  inject: [ConfigService],
};
