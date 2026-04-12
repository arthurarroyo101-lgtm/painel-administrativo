import { Injectable, NotFoundException } from '@nestjs/common';
import { adminAuth } from '../firebase/firebase';

@Injectable()
export class UsersService {
  async getUser(uid: string) {
    return await adminAuth.getUser(uid);
  }

  async findAll() {
    // Sem Firestore, devolve lista vazia
    return [];
  }

  async findById(uid: string) {
    const user = await adminAuth.getUser(uid);
    if (!user) throw new NotFoundException(`Usuário '${uid}' não encontrado`);
    return user;
  }

  async syncFromAuth(uid: string) {
    return await adminAuth.getUser(uid);
  }

  async setRole(uid: string, role: string) {
    await adminAuth.setCustomUserClaims(uid, { role });
    return { uid, role };
  }

  async deactivate(uid: string) {
    await adminAuth.setCustomUserClaims(uid, { active: false });
    return { uid, active: false };
  }

  async reactivate(uid: string) {
    await adminAuth.setCustomUserClaims(uid, { active: true });
    return { uid, active: true };
  }
}