import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = UsuarioEntity>(err: any, user: any): TUser {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('No tienes autorización para acceder')
      );
    }
    return user as TUser;
  }
}
