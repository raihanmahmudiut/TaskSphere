import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { schema, todoApps } from '@app/db/index';
import { ROLES_KEY, RequiredRole } from './role.decorator';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';

// Use the schema type directly
export type DrizzleClient = NodePgDatabase<typeof schema>;

@Injectable()
export class TodoAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RequiredRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, access is granted
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // From JwtAuthGuard
    const todoId = parseInt(request.params.id || request.params.todoId, 10);

    if (!user || !todoId) {
      return false; // Or throw a more specific error
    }

    // Try the relation approach first
    const todoApp = await this.db.query.todoApps.findFirst({
      where: eq(todoApps.id, todoId),
      with: {
        collaborators: true,
      },
    });

    if (!todoApp) {
      throw new NotFoundException('ToDo App not found');
    }

    // Check for ownership first
    if (todoApp.ownerId === user.uuid) {
      return true; // Owner has all permissions
    }

    // Check for collaborator role
    const collaboration = todoApp.collaborators?.find(
      (c: any) => c.userId === user.uuid,
    );

    // Check required roles
    if (requiredRoles.includes('OWNER') && todoApp.ownerId === user.uuid) {
      return true;
    }

    if (collaboration) {
      // Check if the user has any of the required roles (e.g., EDITOR)
      for (const role of requiredRoles) {
        if (role === 'EDITOR' && collaboration.role === 'EDITOR') {
          return true;
        }
        if (
          role === 'VIEWER' &&
          (collaboration.role === 'VIEWER' || collaboration.role === 'EDITOR')
        ) {
          // Editors can also view
          return true;
        }
      }
    }

    throw new ForbiddenException(
      'You do not have the necessary permissions for this resource.',
    );
  }
}
