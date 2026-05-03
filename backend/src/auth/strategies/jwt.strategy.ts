import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserType } from 'src/usuario/entities/usuario.entity';
import { Request } from 'express';

interface JwtPayload {
  sub: string;
  username: string;
  role: UserType;
}

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        const request = req as RequestWithCookies;
        return request.cookies?.['jwt_token'] || null;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
