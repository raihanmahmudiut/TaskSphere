import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from '@app/core/constants/db.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres'; // Use the correct Drizzle client type based on your provider
import * as allSchema from '@app/db/index'; // Import all named exports
import { CreateUserDto } from './dto/create-user.dto';

// Infer types directly from the specific table schema
export type User = typeof allSchema.users.$inferSelect;
export type NewUser = typeof allSchema.users.$inferInsert;

// Your DrizzleClient type should match what DrizzleProvider actually provides.
// If DrizzleProvider provides NodePgDatabase<typeof allSchema>, use that.
// For simplicity, let's assume it's NodePgDatabase<any> for now, but ideally type it with your full schema.
export type DrizzleClient = NodePgDatabase<typeof allSchema>; // More specific type

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE_PROVIDER) private readonly db: DrizzleClient) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'hashedPassword'>> {
    const { email, password, name } = createUserDto;

    // Use the correctly imported 'users' table object
    const existingUser = await this.db.query.users.findFirst({
      where: eq(allSchema.users.email, email.toLowerCase()),
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltOrRounds = 10;
    // Ensure your users schema has 'hashedPassword' not 'passwordHash'
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    try {
      const newUserPayload: NewUser = {
        email: email.toLowerCase(),
        hashedPassword, // Match this to your schema field name
        name: name || null,
      };

      const insertedUsers = await this.db
        .insert(allSchema.users) // Use the specific users table
        .values(newUserPayload)
        .returning({
          uuid: allSchema.users.uuid, // Match your schema: 'uuid' not 'id'
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

  async findById(
    userId: string,
  ): Promise<Omit<User, 'hashedPassword'> | undefined> {
    const user = await this.db.query.users.findFirst({
      where: eq(allSchema.users.uuid, userId),
      columns: {
        hashedPassword: false, // Exclude hashedPassword
      },
    });
    return user as Omit<User, 'hashedPassword'> | undefined;
  }
}
