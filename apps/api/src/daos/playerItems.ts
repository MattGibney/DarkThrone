import { Knex } from 'knex';
import { Logger } from 'pino';
import { ulid } from 'ulid';

export type PlayerItemsRow = {
  id: string;
  player_id: string;
  item_key: string;
  quantity: number;
};

export default class PlayerItemsDao {
  private database: Knex;

  constructor(database: Knex) {
    this.database = database;
  }

  async fetchItemsForPlayer(playerID: string): Promise<PlayerItemsRow[]> {
    return await this.database<PlayerItemsRow>('player_items')
      .select('*')
      .where('player_id', playerID);
  }

  async fetchItemForPlayerByKey(
    playerID: string,
    itemKey: string,
  ): Promise<PlayerItemsRow | null> {
    return await this.database<PlayerItemsRow>('player_items')
      .first('*')
      .where('player_id', playerID)
      .andWhere('item_key', itemKey);
  }

  async create(
    logger: Logger,
    playerID: string,
    itemKey: string,
    quantity: number,
  ): Promise<PlayerItemsRow> {
    try {
      const id = `ITM-${ulid()}`;
      const [row] = await this.database<PlayerItemsRow>('player_items')
        .insert({
          id,
          player_id: playerID,
          item_key: itemKey,
          quantity,
        })
        .returning('*');

      return row;
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  async update(playerItem: PlayerItemsRow): Promise<void> {
    await this.database<PlayerItemsRow>('player_items')
      .update(playerItem)
      .where('id', playerItem.id);
  }
}
