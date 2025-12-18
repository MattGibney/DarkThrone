import { Context } from '../app';
import { PlayerItemsRow } from '../daos/playerItems';

export default class PlayerItemModel {
  private ctx: Context;

  public id: string;
  public playerID: string;
  public itemKey: string;
  public quantity: number;

  constructor(ctx: Context, data: PlayerItemsRow) {
    this.ctx = ctx;
    this.populateFromRow(data);
  }

  save(): Promise<void> {
    return this.ctx.daoFactory.playerItems.update({
      id: this.id,
      player_id: this.playerID,
      item_key: this.itemKey,
      quantity: this.quantity,
    });
  }

  static async fetchItemsForPlayer(
    ctx: Context,
    playerID: string,
  ): Promise<PlayerItemModel[]> {
    const rows = await ctx.daoFactory.playerItems.fetchItemsForPlayer(playerID);
    return rows.map((row) => new PlayerItemModel(ctx, row));
  }

  static async fetchItemForPlayerByKey(
    ctx: Context,
    playerID: string,
    itemKey: string,
  ): Promise<PlayerItemModel | null> {
    const row = await ctx.daoFactory.playerItems.fetchItemForPlayerByKey(
      playerID,
      itemKey,
    );
    if (!row) return null;
    return new PlayerItemModel(ctx, row);
  }

  static async create(
    ctx: Context,
    playerID: string,
    itemKey: string,
    quantity: number,
  ): Promise<PlayerItemModel> {
    const row = await ctx.daoFactory.playerItems.create(
      ctx.logger,
      playerID,
      itemKey,
      quantity,
    );
    return new PlayerItemModel(ctx, row);
  }

  private populateFromRow(row: PlayerItemsRow) {
    this.id = row.id;
    this.playerID = row.player_id;
    this.itemKey = row.item_key;
    this.quantity = row.quantity;
  }
}
