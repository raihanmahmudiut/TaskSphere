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
import { DrizzleService } from '@app/modules/drizzle/drizzle.service';
import schema from '@app/db/index';
import { ROLES_KEY, RequiredRole } from './role.decorator';

@Injectable()
export class TodoAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DrizzleService) private readonly db: DrizzleService,
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

    const todoApp = await this.db.query.todoApps.findFirst({
      where: eq(schema.todoApps.id, todoId),
      with: {
        collaborators: true,
      },
    });

    if (!todoApp) {
      throw new NotFoundException('ToDo App not found');
    }

    // Check for ownership
    if (requiredRoles.includes('OWNER') && todoApp.ownerId === user.uuid) {
      return true;
    }

    // Check for collaborator role
    const collaboration = todoApp.collaborators.find(
      (c) => c.userId === user.uuid,
    );

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

    // Check if the user is the owner, which grants all permissions
    if (todoApp.ownerId === user.uuid) {
      return true;
    }

    throw new ForbiddenException(
      'You do not have the necessary permissions for this resource.',
    );
  }
}
