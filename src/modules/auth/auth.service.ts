import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService, User } from '@app/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './strategies/jwt.strategy';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    email: string,
    pass: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(pass, user.hashedPassword))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; //full user object including hashedPassword for internal use
  }

  async login(user: Omit<User, 'hashedPassword'>) {
    // user here is the one returned from LocalStrategy.validate, already without hashedPassword
    const payload: JwtPayload = { email: user.email, sub: user.uuid };
    return {
      accessToken: this.jwtService.sign(payload),
      user, // user info
    };
  }

  async register(registerDto: CreateUserDto) {
    const newUser = await this.usersService.create(registerDto);
    return this.login(newUser);
  }
}
