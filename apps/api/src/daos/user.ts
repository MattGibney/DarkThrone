import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';

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

  async fetchByID(logger: Logger, id: string): Promise<UserRow | undefined> {
    try {
      const user = await this.database<UserRow>('users')
        .first('*')
        .where({ id });

      return user;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  async create(
    logger: Logger,
    email: string,
    passwordHash: string,
  ): Promise<UserRow | null> {
    const userID = `USR-${ulid()}`;
    try {
      const user = await this.database<UserRow>('users')
        .insert({
          id: userID,
          email,
          password_hash: passwordHash,
        })
        .returning('*');

      return user[0];
    } catch (error) {
      logger.error(error, 'DAO: Failed to create user');
      return null;
    }
  }
}
