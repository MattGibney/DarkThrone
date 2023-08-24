import { Knex } from 'knex';
import { Logger } from 'pino';

export type PlayerRow = {
  id: string;
  user_id: string;
  display_name: string;
  race: string;
  class: string;
  avatar_url?: string;
  created_at: Date;
};

export default class PlayerDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchAllForUser(logger: Logger, userID: string): Promise<PlayerRow[]> {
    try {
      const players = await this.database<PlayerRow>('players')
        .where({ user_id: userID })
        .select('*');

      return players;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch players for user');
      return [];
    }
  }

  async fetchByID(logger: Logger, id: string): Promise<PlayerRow | null> {
    try {
      const player = await this.database<PlayerRow>('players')
        .where({ id })
        .first();

      return player;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch player by ID');
      return null;
    }
  }
}
