import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/usuario/entities/usuario.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

import { Request } from 'express';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';

interface RequestWithUser extends Request {
  user: UsuarioEntity;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user || !user.role) return false;

    return requiredRoles.some((role) => user.role === role);
  }
}
