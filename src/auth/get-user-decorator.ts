import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from './auth.entity';

export const getUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
