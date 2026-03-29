import { UsersService } from './users.service';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request): Promise<Omit<{
        name: string;
        uuid: string;
        email: string;
        hashedPassword: string;
        createdAt: Date;
        updatedAt: Date;
    }, "hashedPassword">>;
    updateProfile(req: Request, updateUserDto: UpdateUserDto): Promise<Omit<{
        name: string;
        uuid: string;
        email: string;
        hashedPassword: string;
        createdAt: Date;
        updatedAt: Date;
    }, "hashedPassword">>;
    deleteProfile(req: Request): Promise<void>;
}
