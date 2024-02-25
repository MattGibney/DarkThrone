import jwt from 'jsonwebtoken';

import { Context } from '../app';
import { UserSessionRow } from '../daos/userSession';
import UserModel from './user';
import PlayerModel from './player';
import { UserSessionObject } from '@darkthrone/interfaces';

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

  static async create(
    ctx: Context,
    user: UserModel,
    rememberMe: boolean,
  ): Promise<UserSessionModel> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1));

    const token = jwt.sign({ userID: user.id }, ctx.config.jwtSecret, {
      expiresIn: `${rememberMe ? 30 : 1}d`,
    });

    const userSessionRow = await ctx.daoFactory.userSession.create(ctx.logger, {
      user_id: user.id,
      token,
      expires_at: expiresAt,
    });

    if (!userSessionRow) return null;

    return new UserSessionModel(ctx, userSessionRow);
  }

  static async fetchValidByToken(
    ctx: Context,
    token: string,
  ): Promise<UserSessionModel | null> {
    const userSessionData = await ctx.daoFactory.userSession.fetchValidByToken(
      ctx.logger,
      token,
    );
    if (!userSessionData) return null;

    return new UserSessionModel(ctx, userSessionData);
  }

  async invalidate(): Promise<void> {
    await this.ctx.daoFactory.userSession.invalidate(this.ctx.logger, this.id);
  }

  async assumePlayer(player: PlayerModel): Promise<void> {
    await this.ctx.daoFactory.userSession.assumePlayer(
      this.ctx.logger,
      this.id,
      player.id,
    );
    this.playerID = player.id;
  }

  async unassumePlayer(): Promise<void> {
    await this.ctx.daoFactory.userSession.unassumePlayer(
      this.ctx.logger,
      this.id,
    );
    this.playerID = null;
  }

  async serialise(): Promise<UserSessionObject> {
    const user = await this.ctx.modelFactory.user.fetchByID(
      this.ctx,
      this.userID,
    );
    return {
      id: this.id,
      email: user.email,
      playerID: this.playerID,
      hasConfirmedEmail: !!user.confirmedEmailAt,
      serverTime: new Date().toISOString(),
    };
  }
}
