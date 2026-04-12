import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto, Permission } from './dto/create-role.dto';

export interface RoleDoc {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RolesService implements OnModuleInit {
  private roles: RoleDoc[] = [];

  async onModuleInit(): Promise<void> {
    await this.seedDefaultRoles();
  }

  async findAll(): Promise<RoleDoc[]> {
    return this.roles;
  }

  async findById(id: string): Promise<RoleDoc> {
    const role = this.roles.find(r => r.id === id);
    if (!role) throw new NotFoundException(`Role '${id}' não encontrado`);
    return role;
  }

  async create(dto: CreateRoleDto): Promise<RoleDoc> {
    const now = new Date();
    const role: RoleDoc = {
      id: dto.id,
      name: dto.name,
      description: dto.description ?? '',
      permissions: dto.permissions,
      createdAt: now,
      updatedAt: now,
    };
    this.roles.push(role);
    return role;
  }

  async updatePermissions(id: string, permissions: Permission[]): Promise<RoleDoc> {
    const role = await this.findById(id);
    role.permissions = permissions;
    role.updatedAt = new Date();
    return role;
  }

  async delete(id: string): Promise<void> {
    const defaults = ['admin', 'editor', 'viewer'];
    if (defaults.includes(id)) {
      throw new Error(`O role '${id}' é padrão e não pode ser removido`);
    }
    this.roles = this.roles.filter(r => r.id !== id);
  }

  private async seedDefaultRoles(): Promise<void> {
    const defaults: Omit<RoleDoc, 'createdAt' | 'updatedAt'>[] = [
      {
        id: 'admin',
        name: 'Administrador',
        description: 'Acesso total ao painel',
        permissions: ['apps:read','apps:write','apps:delete','users:read','users:write','roles:read','roles:write'],
      },
      {
        id: 'editor',
        name: 'Editor',
        description: 'Pode visualizar e editar apps, domínios e integrações, sem deletar',
        permissions: ['apps:read','apps:write','users:read','roles:read'],
      },
      {
        id: 'viewer',
        name: 'Visualizador',
        description: 'Somente leitura em todas as entidades',
        permissions: ['apps:read','users:read','roles:read'],
      },
    ];

    const now = new Date();
    defaults.forEach(d => {
      if (!this.roles.find(r => r.id === d.id)) {
        this.roles.push({ ...d, createdAt: now, updatedAt: now });
      }
    });
  }
}