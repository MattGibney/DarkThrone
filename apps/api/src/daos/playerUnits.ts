import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';

export type PlayerUnitsRow = {
  id: string;
  player_id: string;
  unit_type: string;
  quantity: number;
};

export default class PlayerUnitsDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchUnitsForPlayer(playerID: string): Promise<PlayerUnitsRow[]> {
    return await this.database<PlayerUnitsRow>('player_units')
      .select('*')
      .where('player_id', playerID);
  }

  async fetchUnitsForPlayerByType(playerID: string, type: string): Promise<PlayerUnitsRow | null> {
    return await this.database<PlayerUnitsRow>('player_units')
      .first('*')
      .where('player_id', playerID)
      .andWhere('unit_type', type);
  }

  async create(logger: Logger, playerID: string, type: string, quantity: number): Promise<PlayerUnitsRow> {
    try {
      const id = `UNT-${ulid()}`;
      const [row] = await this.database<PlayerUnitsRow>('player_units')
        .insert({
          id,
          player_id: playerID,
          unit_type: type,
          quantity,
        })
        .returning('*');

      return row;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async update(playerUnits: PlayerUnitsRow): Promise<void> {
    await this.database<PlayerUnitsRow>('player_units')
      .update(playerUnits)
      .where('id', playerUnits.id);
  }
}
