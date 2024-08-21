import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../services/auth/auth.service';
import { JwtPayload } from '../types/jwt-payload.type';
import { User } from '../../typeorm/User.entity';
import { RefreshTokenBody } from '../types/RefreshTokenBody.type';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: FastifyRequest,
    payload: JwtPayload,
  ): Promise<JwtPayload> {
    const body = req.body as RefreshTokenBody;
    const refreshToken = body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const user = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const { exp, ...payloadWithoutExp } = payload as JwtPayload & {
      exp: number;
    };
    return payloadWithoutExp;
  }
}
