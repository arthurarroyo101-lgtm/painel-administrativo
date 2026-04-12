import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { DecodedIdToken }  from 'firebase-admin/auth';
import { AuthGuard }       from '../auth/auth.guard';
import { CurrentUser }     from '../auth/decorators/current-user.decorator';
import { RolesService }    from './roles.service';
import { CreateRoleDto, Permission } from './dto/create-role.dto';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /** GET /api/roles — lista todos os roles */
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  /** GET /api/roles/:id — detalhe de um role */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  /** POST /api/roles — cria role customizado (admin only) */
  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true })) dto: CreateRoleDto,
    @CurrentUser() user: DecodedIdToken,
  ) {
    if (user['role'] !== 'admin') return { error: 'Apenas administradores podem criar roles' };
    return this.rolesService.create(dto);
  }

  /** PATCH /api/roles/:id/permissions — atualiza permissões (admin only) */
  @Patch(':id/permissions')
  @HttpCode(200)
  updatePermissions(
    @Param('id') id: string,
    @Body() body: { permissions: Permission[] },
    @CurrentUser() user: DecodedIdToken,
  ) {
    if (user['role'] !== 'admin') return { error: 'Apenas administradores podem editar roles' };
    return this.rolesService.updatePermissions(id, body.permissions);
  }

  /** DELETE /api/roles/:id — remove role customizado (admin only) */
  @Delete(':id')
  @HttpCode(200)
  delete(
    @Param('id') id: string,
    @CurrentUser() user: DecodedIdToken,
  ) {
    if (user['role'] !== 'admin') return { error: 'Apenas administradores podem remover roles' };
    return this.rolesService.delete(id).then(() => ({ success: true }));
  }
}
