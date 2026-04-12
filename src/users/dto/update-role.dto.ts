import { IsIn } from 'class-validator';

export type UserRole = 'admin' | 'editor' | 'viewer';

export class UpdateRoleDto {
  @IsIn(['admin', 'editor', 'viewer'], {
    message: 'role deve ser admin, editor ou viewer',
  })
  role!: UserRole;
}
