import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { NestDrizzleModule } from '@app/modules/drizzle/drizzle.module'; // Your Drizzle module

@Module({
  imports: [NestDrizzleModule], // Make Drizzle provider available
  controllers: [UsersController], // We'll add this later if needed for user-specific endpoints
  providers: [UsersService],
  exports: [UsersService], // Export UsersService for AuthModule
})
export class UsersModule {}
