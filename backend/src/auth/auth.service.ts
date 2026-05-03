import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    if (!password || !username)
      throw new UnauthorizedException('Credenciales invalidas');

    const usuario = await this.usuarioService.findOneByUsername(username);
    if (!usuario) throw new UnauthorizedException('Credenciales incorrectas');
    const comparePass = bcrypt.compareSync(password, usuario.password ?? '');
    if (!comparePass)
      throw new UnauthorizedException('Credenciales incorrectas');
    const payload = {
      sub: usuario.id,
      username: usuario.username,
      role: usuario.role,
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      type: 'bearer',
    };
  }
}
