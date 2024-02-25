import bcrypt from 'bcrypt';
import { Context } from '../app';
import { UserRow } from '../daos/user';

export default class UserModel {
  private ctx: Context;

  public id: string;
  public email: string;
  public passwordHash: string;
  public confirmedEmailAt: Date;
  public createdAt: Date;

  constructor(ctx: Context, data: UserRow) {
    this.ctx = ctx;

    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.confirmedEmailAt = data.confirmed_email_at;
    this.createdAt = data.created_at;
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  serialise() {
    return {
      id: this.id,
      email: this.email,
      hasConfirmedEmail: !!this.confirmedEmailAt,
    };
  }

  static async fetchByEmail(
    ctx: Context,
    email: string,
  ): Promise<UserModel | null> {
    const userRow = await ctx.daoFactory.user.fetchByEmail(ctx.logger, email);
    if (!userRow) return null;

    return new UserModel(ctx, userRow);
  }

  static async fetchByID(ctx: Context, id: string): Promise<UserModel | null> {
    const userData = await ctx.daoFactory.user.fetchByID(ctx.logger, id);
    if (!userData) return null;

    return new UserModel(ctx, userData);
  }

  static async create(
    ctx: Context,
    email: string,
    password: string,
  ): Promise<UserModel | null> {
    const passwordHash = await bcrypt.hash(password, 10);
    const userRow = await ctx.daoFactory.user.create(
      ctx.logger,
      email,
      passwordHash,
    );
    if (!userRow) return null;

    return new UserModel(ctx, userRow);
  }
}
