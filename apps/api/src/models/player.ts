import { PlayerObject } from '@darkthrone/client-library';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';

export default class PlayerModel {
  private ctx: Context;

  public id: string;
  public userID: string;
  public displayName: string;
  public race: string;
  public class: string;
  public avatarURL?: string;
  public createdAt: Date;

  constructor(ctx: Context, data: PlayerRow) {
    this.ctx = ctx;

    this.id = data.id;
    this.userID = data.user_id;
    this.displayName = data.display_name;
    this.race = data.race;
    this.class = data.class;
    this.avatarURL = data.avatar_url;
    this.createdAt = data.created_at;
  }

  serialise(): PlayerObject {
    return {
      id: this.id,
      name: this.displayName,
      avatarURL: this.avatarURL,
      race: this.race,
      class: this.class,
    };
  }

  static async fetchAllForUser(ctx: Context, user: UserModel) {
    const playerRows = await ctx.daoFactory.player.fetchAllForUser(ctx.logger, user.id);
    return playerRows.map((row) => new PlayerModel(ctx, row));
  }

  static async fetchByID(ctx: Context, id: string) {
    const playerRow = await ctx.daoFactory.player.fetchByID(ctx.logger, id);
    return new PlayerModel(ctx, playerRow);
  }
}
