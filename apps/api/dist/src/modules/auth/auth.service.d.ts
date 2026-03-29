import { UsersService, User } from '@app/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@app/modules/users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUserCredentials(email: string, pass: string): Promise<User | null>;
    login(user: Omit<User, 'hashedPassword'>): Promise<{
        accessToken: string;
        user: Omit<{
            name: string;
            uuid: string;
            email: string;
            hashedPassword: string;
            createdAt: Date;
            updatedAt: Date;
        }, "hashedPassword">;
    }>;
    register(registerDto: CreateUserDto): Promise<{
        accessToken: string;
        user: Omit<{
            name: string;
            uuid: string;
            email: string;
            hashedPassword: string;
            createdAt: Date;
            updatedAt: Date;
        }, "hashedPassword">;
    }>;
}
