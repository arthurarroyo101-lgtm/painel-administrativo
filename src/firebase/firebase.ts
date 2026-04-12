import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

function initAdmin(): App {
  if (getApps().length > 0) return getApps()[0];

  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (b64) {
    const serviceAccount = JSON.parse(
      Buffer.from(b64, 'base64').toString('utf8'),
    );
    return initializeApp({ credential: cert(serviceAccount) });
  }

  // Fallback local: apenas autenticação com projectId
  return initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const app = initAdmin();

/** Firebase Admin Auth — verifica tokens, custom claims, revoga sessões */
export const adminAuth: Auth = getAuth(app);