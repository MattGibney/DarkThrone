import { Context } from '../app';
import { UserSessionRow } from '../daos/userSession';
import UserModel from './user';

export default class UserSessionModel {
  private ctx: Context;

  public id: string;
  public userID: string;
  public token: string;
  public playerID: string;
  public createdAt: Date;
  public expiresAt: Date;

  constructor(ctx: Context, data: UserSessionRow) {
    this.ctx = ctx;

    this.id = data.id;
    this.userID = data.user_id;
    this.token = data.token;
    this.playerID = data.player_id;
    this.createdAt = data.created_at;
    this.expiresAt = data.expires_at;
  }

  static async create(ctx: Context, user: UserModel, rememberMe: boolean): Promise<UserSessionModel> {
    return null;
  }
}
