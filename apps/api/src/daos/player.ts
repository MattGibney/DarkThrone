import { PlayerRace } from '@darkthrone/interfaces';
import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';

export type PlayerRow = {
  id: string;
  user_id: string;
  display_name: string;
  race: PlayerRace;
  class: string;
  avatar_url?: string;
  created_at: Date;
  attack_turns: number;
  gold: number;
  experience: number;
  overall_rank: number;
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

  async fetchAll(logger: Logger): Promise<PlayerRow[]> {
    try {
      const players = await this.database<PlayerRow>('players').select('*');

      return players;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch all players');
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

  async fetchAllMatchingIDs(
    logger: Logger,
    playerIDs: string[],
  ): Promise<PlayerRow[]> {
    try {
      const players = await this.database<PlayerRow>('players')
        .whereIn('id', playerIDs)
        .select('*');

      return players;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch players by IDs');
      return [];
    }
  }

  async fetchByDisplayName(
    logger: Logger,
    displayName: string,
  ): Promise<PlayerRow | null> {
    try {
      const player = await this.database<PlayerRow>('players')
        .where({ display_name: displayName })
        .first();

      return player;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch player by display name');
      return null;
    }
  }

  async create(
    logger: Logger,
    userID: string,
    displayName: string,
    selectedRace: PlayerRace,
    selectedClass: string,
  ): Promise<PlayerRow> {
    const playerID = `PLR-${ulid()}`;
    try {
      const player = await this.database<PlayerRow>('players')
        .insert({
          id: playerID,
          user_id: userID,
          display_name: displayName,
          race: selectedRace,
          class: selectedClass,
        })
        .returning('*');

      return player[0];
    } catch (error) {
      logger.error(error, 'DAO: Failed to create player');
      return null;
    }
  }

  async update(
    logger: Logger,
    playerID: string,
    update: Partial<PlayerRow>,
  ): Promise<PlayerRow> {
    try {
      const player = await this.database<PlayerRow>('players')
        .where({ id: playerID })
        .update(update)
        .returning('*');

      return player[0];
    } catch (error) {
      logger.error(error, 'DAO: Failed to update player');
      return null;
    }
  }
}
