import { ConfigService } from '@nestjs/config';
import { UsersService, User } from '@app/modules/users/users.service';
export interface JwtPayload {
    sub: string;
    email: string;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly usersService;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: JwtPayload): Promise<Omit<User, 'hashedPassword'>>;
}
export {};
