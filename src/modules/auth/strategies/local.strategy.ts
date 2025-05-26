import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '@app/modules/users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); //to use 'email' as the username
  }

  async validate(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.authService.validateUserCredentials(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Excludding hashedPassword before returning
    const result = { ...user };
    delete result.hashedPassword;
    return result;
  }
}
