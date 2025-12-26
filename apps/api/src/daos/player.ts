import { PlayerClass, PlayerObject, PlayerRace } from '@darkthrone/interfaces';
import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';
import { Paginator } from '../lib/paginator';
import PlayerModel from '../models/player';

export type PlayerRow = {
  id: string;
  user_id: string;
  display_name: string;
  race: PlayerRace;
  class: PlayerClass;
  avatar_url?: string;
  created_at: Date;
  attack_turns: number;
  gold: number;
  gold_in_bank: number;
  experience: number;
  overall_rank: number;
  structureUpgrades: {
    fortification?: number;
    housing?: number;
    armoury?: number;
  };
};

export default class PlayerDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  private ensureTypeSafety(row: PlayerRow): PlayerRow {
    return {
      ...row,
      attack_turns: Number(row.attack_turns),
      gold: Number(row.gold),
      gold_in_bank: Number(row.gold_in_bank),
      experience: Number(row.experience),
      overall_rank: Number(row.overall_rank),
      structureUpgrades: {
        fortification: Number(row.structureUpgrades?.fortification ?? 0),
        housing: Number(row.structureUpgrades?.housing ?? 0),
      },
    };
  }

  async fetchAllForUser(logger: Logger, userID: string): Promise<PlayerRow[]> {
    try {
      const players = await this.database<PlayerRow>('players')
        .where({ user_id: userID })
        .select('*');

      return players.map(this.ensureTypeSafety);
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch players for user');
      return [];
    }
  }

  async fetchAll(logger: Logger): Promise<PlayerRow[]> {
    try {
      const players = await this.database<PlayerRow>('players').select('*');

      return players.map(this.ensureTypeSafety);
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch all players');
      return [];
    }
  }

  async fetchAllPaginated(
    logger: Logger,
    paginator: Paginator<PlayerRow, PlayerObject, PlayerModel>,
  ): Promise<undefined> {
    try {
      const rows = await this.database('players')
        .select(
          'players.*',
          this.database.raw('COUNT(*) OVER() AS total_count'),
        )
        .orderBy('overall_rank', 'ASC')
        .limit(paginator.pageSize)
        .offset((paginator.page - 1) * paginator.pageSize);

      paginator.dataRows = rows.map(this.ensureTypeSafety);

      // All rows have the same total_count, so just pick the first one
      paginator.totalItemCount = rows.length > 0 ? rows[0].total_count : 0;

      return;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch all players');
      paginator.totalItemCount = 0;
      return;
    }
  }

  async count(logger: Logger): Promise<number | null> {
    try {
      const result = await this.database<PlayerRow>('players').count('id');
      return parseInt(result[0].count.toString());
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch player count');
      return;
    }
  }

  async fetchByID(logger: Logger, id: string): Promise<PlayerRow | null> {
    try {
      const player = await this.database<PlayerRow>('players')
        .where({ id })
        .first();

      return this.ensureTypeSafety(player);
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

      return players.map(this.ensureTypeSafety);
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

      return this.ensureTypeSafety(player);
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
    selectedClass: PlayerClass,
  ): Promise<PlayerRow> {
    const playerID = `PLR-${ulid()}`;
    try {
      // the only existing issue with this is having multiple users
      // create players at the same time which will "duplicate" ranks.
      //
      // but this will be eventually fixed the next time the cron calculates ranks.
      const numberOfPlayers = await this.count(logger);
      // would be nice for us to have this default rank be a problem.
      let rank = 999999;
      if (numberOfPlayers !== null) {
        rank = numberOfPlayers + 1;
      }

      const player = await this.database<PlayerRow>('players')
        .insert({
          id: playerID,
          user_id: userID,
          display_name: displayName,
          race: selectedRace,
          class: selectedClass,
          overall_rank: rank,
        })
        .returning('*');

      return this.ensureTypeSafety(player[0]);
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

      return this.ensureTypeSafety(player[0]);
    } catch (error) {
      logger.error(error, 'DAO: Failed to update player');
      return null;
    }
  }

  async createBankHistory(
    logger: Logger,
    playerID: string,
    amount: number,
    type: 'deposit' | 'withdraw',
  ): Promise<void> {
    try {
      await this.database('bank_history').insert({
        player_id: playerID,
        amount,
        transaction_type: type,
      });
    } catch (error) {
      logger.error(error, 'DAO: Failed to create bank history');
    }
  }

  async fetchBankHistory(
    logger: Logger,
    playerID: string,
    dateFrom: Date,
  ): Promise<
    {
      amount: number;
      transaction_type: 'deposit' | 'withdraw';
      created_at: Date;
    }[]
  > {
    try {
      const history = await this.database('bank_history')
        .where({ player_id: playerID })
        .andWhere('created_at', '>=', dateFrom)
        .select('amount', 'transaction_type', 'created_at');

      return history;
    } catch (error) {
      logger.error(error, 'DAO: Failed to fetch bank history');
      return [];
    }
  }
}
