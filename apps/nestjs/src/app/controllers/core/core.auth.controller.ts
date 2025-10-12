import { Body, Controller, Inject, Post } from '@nestjs/common';
import { type ClerkClient } from '@clerk/backend';

@Controller('auth')
export class CoreAuthController {
  constructor(
    @Inject('Clerk')
    private readonly clerkClient: ClerkClient
  ) {}
  @Post('register')
  async register(@Body() model: { email: string; password: string }) {
    try {
      // Try minimal user creation first
      const userParams = {
        emailAddress: [model.email],
        password: model.password,
      };

      console.log(
        'Attempting to create user with params:',
        JSON.stringify(userParams, null, 2)
      );

      const result = await this.clerkClient.users.createUser(userParams);

      console.log('User created successfully:', result);
      return result;
    } catch (error) {
      console.error('Clerk API Error:', error);
      if (error && typeof error === 'object' && 'errors' in error) {
        console.error('Error details:', (error as { errors: unknown }).errors);
      }
      throw error;
    }
  }
}
