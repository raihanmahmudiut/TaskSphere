import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './core/constants/db.constants';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import schema from '../src/db/index';

@Injectable()
export class AppService {
  constructor(
    @Inject(DRIZZLE_PROVIDER) private conn: PostgresJsDatabase<typeof schema>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async getUser() {
    console.log(this.conn);
    // return 'test'
    return this.conn.select().from(schema.users);
  }
}
