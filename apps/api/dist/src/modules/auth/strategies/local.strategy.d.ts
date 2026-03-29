import { AuthService } from '../auth.service';
import { User } from '@app/modules/users/users.service';
declare const LocalStrategy_base: new (...args: any) => any;
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, pass: string): Promise<Omit<User, 'hashedPassword'>>;
}
export {};
