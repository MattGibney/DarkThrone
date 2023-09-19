import { Knex } from 'knex';

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
}
