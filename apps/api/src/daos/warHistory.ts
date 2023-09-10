import { Knex } from 'knex';
import { Logger } from 'pino';

export type WarHistoryRow = {
  id: string;
  attacker_id: string;
  defender_id: string;
  attack_turns_used: number;
  is_attacker_victor: boolean;
  attacker_strength: number;
  defender_strength: number;
  gold_stolen: number;
  created_at: Date;
}

export default class WarHistoryDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async create(logger: Logger, warHistory: WarHistoryRow): Promise<WarHistoryRow | null> {
    try {
      const [createdWarHistory] = await this.database<WarHistoryRow>('war_history')
        .insert(warHistory)
        .returning('*');

      return createdWarHistory;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async fetchByID(logger: Logger, id: string): Promise<WarHistoryRow | null> {
    try {
      const [warHistory] = await this.database<WarHistoryRow>('war_history')
        .select('*')
        .where({ id });

      return warHistory;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
