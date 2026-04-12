import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { fromNodeHeaders } from 'better-auth/node';
import { Request }         from 'express';
import { auth }            from './auth';

/**
 * Guard para rotas NestJS protegidas.
 * Aceita cookie de sessão HttpOnly ou Bearer JWT no header Authorization.
 * Rejeita contas com active=false mesmo que o token seja válido.
 *
 * Uso: @UseGuards(SessionGuard)
 * Acesso ao usuário no controller: req['authUser']
 */
@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers as Record<string, string>),
    });

    if (!session?.user) {
      throw new UnauthorizedException('Sessão inválida ou expirada');
    }

    const user = session.user as typeof session.user & { active?: boolean };
    if (user.active === false) {
      throw new UnauthorizedException('Conta desativada');
    }

    req['authUser'] = session.user;
    return true;
  }
}
