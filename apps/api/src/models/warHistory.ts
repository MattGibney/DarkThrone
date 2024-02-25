import { WarHistoryObject } from '@darkthrone/client-library';
import { Context } from '../app';
import { WarHistoryRow } from '../daos/warHistory';
import PlayerModel from './player';

export default class WarHistoryModel {
  private ctx: Context;

  public id: string;
  public attackerID: string;
  public defenderID: string;
  public attackTurnsUsed: number;
  public isAttackerVictor: boolean;
  public attackerStrength: number;
  public defenderStrength: number | undefined;
  public goldStolen: number;
  public createdAt: Date;

  constructor(ctx: Context, data: WarHistoryRow) {
    this.ctx = ctx;

    this.populateFromRow(data);
  }

  serialise(): WarHistoryObject {
    return {
      id: this.id,
      attackerID: this.attackerID,
      defenderID: this.defenderID,
      isAttackerVictor: this.isAttackerVictor,
      attackTurnsUsed: this.attackTurnsUsed,
      attackerStrength: this.attackerStrength,
      defenderStrength: this.isAttackerVictor
        ? this.defenderStrength
        : undefined,
      goldStolen: this.goldStolen,
      createdAt: this.createdAt,
    };
  }

  populateFromRow(row: WarHistoryRow): void {
    this.id = row.id;
    this.attackerID = row.attacker_id;
    this.defenderID = row.defender_id;
    this.attackTurnsUsed = row.attack_turns_used;
    this.isAttackerVictor = row.is_attacker_victor;
    this.attackerStrength = row.attacker_strength;
    this.defenderStrength = row.defender_strength;
    this.goldStolen = row.gold_stolen;
    this.createdAt = row.created_at;
  }

  static async create(
    ctx: Context,
    data: WarHistoryRow,
  ): Promise<WarHistoryModel | null> {
    const warHistoryRow = await ctx.daoFactory.warHistory.create(
      ctx.logger,
      data,
    );
    if (!warHistoryRow) return null;

    return new WarHistoryModel(ctx, warHistoryRow);
  }

  static async fetchByID(
    ctx: Context,
    id: string,
  ): Promise<WarHistoryModel | null> {
    const warHistoryRow = await ctx.daoFactory.warHistory.fetchByID(
      ctx.logger,
      id,
    );
    if (!warHistoryRow) return null;

    return new WarHistoryModel(ctx, warHistoryRow);
  }

  static async fetchAllForPlayer(
    ctx: Context,
    player: PlayerModel,
  ): Promise<WarHistoryModel[]> {
    const warHistoryRows = await ctx.daoFactory.warHistory.fetchAllForPlayer(
      ctx.logger,
      player.id,
    );

    return warHistoryRows.map(
      (warHistoryRow) => new WarHistoryModel(ctx, warHistoryRow),
    );
  }
}
