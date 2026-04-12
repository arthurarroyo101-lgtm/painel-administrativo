import { Injectable } from '@nestjs/common';
import { adminAuth } from '../firebase/firebase';

@Injectable()
export class UsersService {
  async getUser(uid: string) {
    return await adminAuth.getUser(uid);
  }

  async setViewerRole(uid: string) {
    await adminAuth.setCustomUserClaims(uid, { role: 'viewer', active: true });
  }

  async setCustomClaims(uid: string, claims: Record<string, any>) {
    await adminAuth.setCustomUserClaims(uid, claims);
  }

  async revokeTokens(uid: string) {
    await adminAuth.revokeRefreshTokens(uid);
  }
}