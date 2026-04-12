import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/** Permissões disponíveis no painel */
export type Permission =
  | 'apps:read'   | 'apps:write'   | 'apps:delete'
  | 'users:read'  | 'users:write'
  | 'domains:read'| 'domains:write'| 'domains:delete'
  | 'integrations:read' | 'integrations:write'
  | 'roles:read'  | 'roles:write';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  id!: string; // ex: 'admin', 'editor', 'viewer'

  @IsString()
  @IsNotEmpty()
  name!: string; // ex: 'Administrador'

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  permissions!: Permission[];
}
