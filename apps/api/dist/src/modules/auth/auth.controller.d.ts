import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(req: Request): Promise<{
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
    getProfile(req: Request): Express.User;
}
