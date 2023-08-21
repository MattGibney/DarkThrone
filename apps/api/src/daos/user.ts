import { Knex } from 'knex';
import { Logger } from 'pino';

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  confirmed_email_at: Date;
  created_at: Date;
};

export default class UserDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchByEmail(logger: Logger, email: string): Promise<UserRow | null> {
    try {
      const user = await this.database<UserRow>('users')
        .where({ email })
        .first();

      return user;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch user by email');
      return null;
    }
  }
}
