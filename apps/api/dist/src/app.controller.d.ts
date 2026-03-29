import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getUser(): Promise<{
        name: string;
        uuid: string;
        email: string;
        hashedPassword: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
