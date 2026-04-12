import { DecodedIdToken } from 'firebase-admin/auth';

/**
 * Augmentation do namespace Express para adicionar propriedades
 * tipadas injetadas pelo AuthGuard em cada requisição autenticada.
 *
 * Isso elimina o uso de req['firebaseUser'] (string indexing) em favor
 * de req.firebaseUser com tipagem completa do DecodedIdToken.
 *
 * Propriedades disponíveis após @UseGuards(AuthGuard):
 *   req.firebaseUser.uid           → UID do usuário no Firebase
 *   req.firebaseUser.email         → e-mail verificado
 *   req.firebaseUser['role']       → custom claim: 'admin' | 'editor' | 'viewer'
 *   req.firebaseUser['active']     → custom claim: true | false
 *
 * req.authUser é um alias de req.firebaseUser mantido por compatibilidade.
 */
declare global {
  namespace Express {
    interface Request {
      /** Token Firebase decodificado e validado pelo AuthGuard */
      firebaseUser?: DecodedIdToken;

      /** Alias de firebaseUser — mantido por compatibilidade */
      authUser?: DecodedIdToken;
    }
  }
}

export {};
