import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() datos: { username: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(datos.username, datos.password);

    response.cookie('jwt_token', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    return {
      message: 'Login exitoso',
      user: {
        username: datos.username,
      },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt_token');
    return { message: 'Sesión cerrada' };
  }
}
