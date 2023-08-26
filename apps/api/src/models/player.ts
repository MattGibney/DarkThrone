import { PlayerObject, PlayerRace } from '@darkthrone/client-library';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';

export default class PlayerModel {
  private ctx: Context;

  public id: string;
  public userID: string;
  public displayName: string;
  public race: PlayerRace;
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

  static async fetchByID(ctx: Context, id: string): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByID(ctx.logger, id);
    if (!playerRow) return null;

    return new PlayerModel(ctx, playerRow);
  }

  static async fetchByDisplayName(ctx: Context, displayName: string): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByDisplayName(ctx.logger, displayName);
    if (!playerRow) return null;

    return new PlayerModel(ctx, playerRow);
  }

  static async create(ctx: Context, displayName: string, selectedRace: PlayerRace, selectedClass: string): Promise<PlayerModel> {
    const playerRow = await ctx.daoFactory.player.create(ctx.logger, ctx.authedUser.model.id, displayName, selectedRace, selectedClass);
    return new PlayerModel(ctx, playerRow);
  }
}
