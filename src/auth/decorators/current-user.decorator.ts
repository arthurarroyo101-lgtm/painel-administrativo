import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Request }        from 'express';

/**
 * Decorator de parâmetro que extrai o usuário autenticado da request.
 * Injetado pelo AuthGuard via req.firebaseUser (tipado pelo Express augmentation).
 *
 * Uso nos controllers:
 *   @Get('me')
 *   @UseGuards(AuthGuard)
 *   getMe(@CurrentUser() user: DecodedIdToken) {
 *     return { uid: user.uid, role: user['role'] };
 *   }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): DecodedIdToken => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.firebaseUser!;
  },
);
