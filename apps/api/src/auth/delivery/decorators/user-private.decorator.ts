import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserPrivate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
