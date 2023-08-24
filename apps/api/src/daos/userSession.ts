import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';

export type UserSessionRow = {
  id: string;
  user_id: string;
  token: string;
  player_id: string;
  created_at: Date;
  expires_at: Date;
};

export default class UserSessionDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async create(logger: Logger, userSession: Partial<UserSessionRow>): Promise<UserSessionRow | null> {
    const userID = `SES-${ulid()}`
    try {
      const [createdUserSession] = await this.database<UserSessionRow>('user_sessions')
        .insert({
          id: userID,
          ...userSession,
        })
        .returning('*');

      return createdUserSession;
    } catch (error) {
      logger.error(error, 'DAO: Failed to create user session');
      return null;
    }
  }

  async fetchValidByToken(
    logger: Logger,
    token: string,
  ): Promise<UserSessionRow | undefined> {
    try {
      const [userSession] = await this.database<UserSessionRow>('user_sessions')
        .select('*')
        .where({ token })
        .andWhere('expires_at', '>', new Date());

      return userSession;
    } catch (err) {
      logger.error(err);
      return undefined;
    }
  }

  async invalidate(logger: Logger, id: string): Promise<void> {
    try {
      await this.database<UserSessionRow>('user_sessions')
        .update({ expires_at: new Date() })
        .where({ id });
    } catch (err) {
      logger.error(err);
    }
  }
}
