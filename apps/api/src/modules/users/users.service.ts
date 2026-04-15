import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as allSchema from '@tasksphere/db';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export type User = typeof allSchema.users.$inferSelect;
export type NewUser = typeof allSchema.users.$inferInsert;

export type DrizzleClient = NodePgDatabase<typeof allSchema>;

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const { email, password, name } = createUserDto;

    const existingUser = await this.db.query.users.findFirst({
      where: eq(allSchema.users.email, email.toLowerCase()),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    try {
      const newUserPayload: NewUser = {
        email: email.toLowerCase(),
        hashedPassword,
        name: name || null,
      };

      const insertedUsers = await this.db
        .insert(allSchema.users)
        .values(newUserPayload)
        .returning({
          uuid: allSchema.users.uuid,
          email: allSchema.users.email,
          name: allSchema.users.name,
          createdAt: allSchema.users.createdAt,
          updatedAt: allSchema.users.updatedAt,
        });

      if (!insertedUsers || insertedUsers.length === 0) {
        throw new InternalServerErrorException('Could not create user');
      }
      return insertedUsers[0] as Omit<User, 'hashedPassword'>;
    } catch (error) {
      console.error('Error creating user:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException(
        'Could not create user due to an unexpected error.',
      );
    }
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.db.query.users.findFirst({
      where: eq(allSchema.users.email, email.toLowerCase()),
    });
  }

  async findByEmailSafe(
    email: string,
  ): Promise<Omit<User, 'hashedPassword'> | undefined> {
    const user = await this.db.query.users.findFirst({
      where: eq(allSchema.users.email, email.toLowerCase()),
      columns: { hashedPassword: false },
    });
    return user as Omit<User, 'hashedPassword'> | undefined;
  }

  async findById(
    userId: string,
  ): Promise<Omit<User, 'hashedPassword'> | undefined> {
    const user = await this.db.query.users.findFirst({
      where: eq(allSchema.users.uuid, userId),
      columns: {
        hashedPassword: false,
      },
    });
    return user as Omit<User, 'hashedPassword'> | undefined;
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updateData: Partial<NewUser> = {};

    if (updateUserDto.name !== undefined) {
      updateData.name = updateUserDto.name;
    }

    if (updateUserDto.password !== undefined) {
      const saltOrRounds = 10;
      updateData.hashedPassword = await bcrypt.hash(
        updateUserDto.password,
        saltOrRounds,
      );
    }

    if (Object.keys(updateData).length === 0) {
      return existingUser;
    }

    try {
      const updatedUsers = await this.db
        .update(allSchema.users)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(allSchema.users.uuid, userId))
        .returning({
          uuid: allSchema.users.uuid,
          email: allSchema.users.email,
          name: allSchema.users.name,
          createdAt: allSchema.users.createdAt,
          updatedAt: allSchema.users.updatedAt,
        });

      if (!updatedUsers || updatedUsers.length === 0) {
        throw new InternalServerErrorException('Could not update user');
      }

      return updatedUsers[0] as Omit<User, 'hashedPassword'>;
    } catch (error) {
      console.error('Error updating user:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Could not update user due to an unexpected error.',
      );
    }
  }

  async delete(userId: string): Promise<void> {
    const existingUser = await this.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.db
        .delete(allSchema.users)
        .where(eq(allSchema.users.uuid, userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException(
        'Could not delete user due to an unexpected error.',
      );
    }
  }

  async findAll(): Promise<Omit<User, 'hashedPassword'>[]> {
    return this.db.query.users.findMany({
      columns: {
        hashedPassword: false,
      },
    }) as Promise<Omit<User, 'hashedPassword'>[]>;
  }
}
