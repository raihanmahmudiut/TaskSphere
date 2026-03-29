export type RequiredRole = 'OWNER' | 'EDITOR' | 'VIEWER';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RequiredRole[]) => import("@nestjs/common").CustomDecorator<string>;
