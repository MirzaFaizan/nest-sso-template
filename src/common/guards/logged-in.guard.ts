import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public-route.decorator';
import { CustomRequestType } from '../common.types';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<CustomRequestType>();

    const user = req.session?.user;
    if (!user) return false;

    return true;
  }
}
