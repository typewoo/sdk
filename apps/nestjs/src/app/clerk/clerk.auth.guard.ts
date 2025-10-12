import { type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_AUTHORIZED } from './clerk.decorators';

@Injectable()
export class ClerkAuthGuard extends AuthGuard('clerk') {
  constructor(private reflector: Reflector) {
    super();
  }

  override canActivate(context: ExecutionContext) {
    const isAuthorized = this.reflector.getAllAndOverride<boolean>(
      IS_AUTHORIZED,
      [context.getHandler(), context.getClass()]
    );

    if (!isAuthorized) {
      return true;
    }

    return super.canActivate(context);
  }
}
