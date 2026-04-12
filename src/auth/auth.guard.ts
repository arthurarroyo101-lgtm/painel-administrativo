import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { Request }              from 'express';
import { FIREBASE_AUTH }        from '../firebase/firebase.module';

/**
 * Guard que valida o Firebase ID Token enviado pelo frontend.
 *
 * Fluxo esperado no frontend:
 *   const token = await firebaseAuth.currentUser.getIdToken();
 *   fetch('/api/...', { headers: { Authorization: `Bearer ${token}` } });
 *
 * Após validação, popula req.firebaseUser e req.authUser (tipados via
 * src/@types/express/index.d.ts) com o DecodedIdToken completo.
 *
 * Custom claims acessíveis:
 *   req.firebaseUser['role']   → 'admin' | 'editor' | 'viewer'
 *   req.firebaseUser['active'] → true | false
 *
 * Uso: @UseGuards(AuthGuard)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(FIREBASE_AUTH) private readonly auth: Auth,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    // 1. Extrai Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token não fornecido');
    }
    const idToken = authHeader.slice(7).trim();
    if (!idToken) {
      throw new UnauthorizedException('Token vazio');
    }

    // 2. Valida assinatura e revogação via Firebase Admin SDK
    let decoded: DecodedIdToken;
    try {
      decoded = await this.auth.verifyIdToken(idToken, /* checkRevoked */ true);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    // 3. Rejeita contas desativadas (custom claim definido pelo UsersService)
    if (decoded['active'] === false) {
      throw new UnauthorizedException('Conta desativada');
    }

    // 4. Popula propriedades tipadas via Express augmentation (src/@types/express/index.d.ts)
    req.firebaseUser = decoded;
    req.authUser     = decoded; // alias para compatibilidade
    return true;
  }
}
