import { Knex } from 'knex';
import { Logger } from 'pino';

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
    try {
      const [createdUserSession] = await this.database<UserSessionRow>('user_sessions')
        .insert(userSession)
        .returning('*');

      return createdUserSession;
    } catch (error) {
      logger.error(error, 'DAO: Failed to create user session');
      return null;
    }
  }
}
