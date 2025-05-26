import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService, User } from '@app/modules/users/users.service';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  // Add any other fields you put in the JWT payload
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, // To fetch full user if needed
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Get secret from .env
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<User, 'hashedPassword'>> {
    // Passport first verifies the JWT signature and expiration.
    // This validate function is called if the token is valid.
    // payload is the decoded JWT.
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }
    // The object returned here will be attached to `req.user` in protected routes
    return user; // User object without hashedPassword
  }
}
