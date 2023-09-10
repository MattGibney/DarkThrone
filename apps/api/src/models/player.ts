import { PlayerObject, PlayerRace } from '@darkthrone/client-library';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';
import { ulid } from 'ulid';
import WarHistoryModel from './warHistory';

export default class PlayerModel {
  private ctx: Context;

  public id: string;
  public userID: string;
  public displayName: string;
  public race: PlayerRace;
  public class: string;
  public avatarURL?: string;
  public createdAt: Date;
  public attackTurns: number;
  public gold: number;

  constructor(ctx: Context, data: PlayerRow) {
    this.ctx = ctx;

    this.populateFromRow(data);
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

  get attackStrength(): number {
    return 0;
  }

  get defenceStrength(): number {
    return 0;
  }

  async attackPlayer(targetPlayer: PlayerModel, attackTurns: number): Promise<WarHistoryModel> {
    const warHistoryID = `WRH-${ulid()}`;
    const isVictor = this.attackStrength > targetPlayer.defenceStrength;

    if (!isVictor) {
      // Create War History
      return await this.ctx.modelFactory.warHistory.create(
        this.ctx,
        {
          id: warHistoryID,
          attacker_id: this.id,
          defender_id: targetPlayer.id,
          attack_turns_used: attackTurns,
          is_attacker_victor: false,
          attacker_strength: this.attackStrength,
          defender_strength: targetPlayer.defenceStrength,
          gold_stolen: 0,
          created_at: new Date(),
        }
      );
    }

    // Calculate Damage

    // Calculate winnings
    const totalPossibleWinnings = targetPlayer.gold * 0.8;
    const winnings = Math.floor(totalPossibleWinnings * (0.1 * attackTurns));
    this.gold += winnings;
    targetPlayer.gold -= winnings;

    // Calculate XP

    // Subtract attack Turns
    this.attackTurns -= attackTurns;

    this.save();
    targetPlayer.save();

    return await this.ctx.modelFactory.warHistory.create(
      this.ctx,
      {
        id: warHistoryID,
        attacker_id: this.id,
        defender_id: targetPlayer.id,
        attack_turns_used: attackTurns,
        is_attacker_victor: true,
        attacker_strength: this.attackStrength,
        defender_strength: targetPlayer.defenceStrength,
        gold_stolen: winnings,
        created_at: new Date(),
      }
    )
  }

  async save() {
    const playerData = await this.ctx.daoFactory.player.update(this.ctx.logger, this.id, {
      avatar_url: this.avatarURL,
      attack_turns: this.attackTurns,
      gold: this.gold,
    });

    this.populateFromRow(playerData);
  }

  private populateFromRow(row: PlayerRow) {
    this.id = row.id;
    this.userID = row.user_id;
    this.displayName = row.display_name;
    this.race = row.race;
    this.class = row.class;
    this.avatarURL = row.avatar_url;
    this.createdAt = row.created_at;
    this.attackTurns = row.attack_turns;
    this.gold = row.gold;
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
