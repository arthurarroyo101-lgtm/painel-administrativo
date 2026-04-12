import { Global, Module } from '@nestjs/common';
import { adminAuth} from './firebase';

/** Token de injeção para Firebase Admin Auth */
export const FIREBASE_AUTH = Symbol('FIREBASE_AUTH');

/**
 * Módulo global — qualquer serviço pode injetar Firebase com:
 *   @Inject(FIREBASE_AUTH) private readonly auth: Auth
 */
@Global()
@Module({
  providers: [
    { provide: FIREBASE_AUTH, useValue: adminAuth },
  ],
  exports: [FIREBASE_AUTH],
})
export class FirebaseModule {}
