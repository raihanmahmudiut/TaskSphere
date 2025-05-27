import { SetMetadata } from '@nestjs/common';

export type RequiredRole = 'OWNER' | 'EDITOR' | 'VIEWER';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RequiredRole[]) =>
  SetMetadata(ROLES_KEY, roles);
