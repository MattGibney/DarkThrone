import { AuthedPlayerObject, PlayerObject } from '@darkthrone/interfaces';
import { PlayerRace } from '@darkthrone/interfaces';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';
import { ulid } from 'ulid';
import WarHistoryModel from './warHistory';
import PlayerUnitsModel from './playerUnits';

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

  public units: PlayerUnitsModel[];

  constructor(ctx: Context, data: PlayerRow, units: PlayerUnitsModel[]) {
    this.ctx = ctx;

    this.populateFromRow(data);
    this.units = units;
  }

  async serialise(): Promise<PlayerObject | AuthedPlayerObject> {
    const isAuthed = this.ctx.authedPlayer?.id === this.id;

    const playerObject = {
      id: this.id,
      name: this.displayName,
      avatarURL: this.avatarURL,
      race: this.race,
      class: this.class,
      gold: this.gold,
    } as PlayerObject;

    if (!isAuthed) return playerObject;

    const attackStrength = await this.calculateAttackStrength();
    const defenceStrength = await this.calculateDefenceStrength();

    const authedPlayerObject: AuthedPlayerObject = Object.assign(playerObject, {
      attackStrength: attackStrength,
      defenceStrength: defenceStrength,
      attackTurns: this.attackTurns,
      units: this.units.map((unit) => ({
        unitType: unit.unitType,
        quantity: unit.quantity,
      })),
    });

    return authedPlayerObject;
  }

  async calculateAttackStrength(): Promise<number> {
    return this.units.reduce((acc, unit) => acc + unit.calculateAttackStrength(), 0);
  }

  async calculateDefenceStrength(): Promise<number> {
    return this.units.reduce((acc, unit) => acc + unit.calculateDefenceStrength(), 0);
  }

  async calculateGoldPerTurn(): Promise<number> {
    return this.units.reduce((acc, unit) => acc + unit.calculateGoldPerTurn(), 0);
  }

  async attackPlayer(targetPlayer: PlayerModel, attackTurns: number): Promise<WarHistoryModel> {
    const warHistoryID = `WRH-${ulid()}`;

    const playerAttackStrength = await this.calculateAttackStrength();
    const targetPlayerDefenceStrength = await targetPlayer.calculateDefenceStrength();

    const isVictor = playerAttackStrength > targetPlayerDefenceStrength;

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
          attacker_strength: playerAttackStrength,
          defender_strength: targetPlayerDefenceStrength,
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
        attacker_strength: playerAttackStrength,
        defender_strength: targetPlayerDefenceStrength,
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
    return Promise.all(playerRows.map(async (row) => {
      const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
      return new PlayerModel(ctx, row, playerUnits);
    }));
  }

  static async fetchAll(ctx: Context): Promise<PlayerModel[]> {
    const playerRows = await ctx.daoFactory.player.fetchAll(ctx.logger);
    return Promise.all(playerRows.map(async (row) => {
      const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
      return new PlayerModel(ctx, row, playerUnits);
    }));
  }

  static async fetchByID(ctx: Context, id: string): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByID(ctx.logger, id);
    if (!playerRow) return null;

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, playerRow.id);
    return new PlayerModel(ctx, playerRow, playerUnits);
  }

  static async fetchByDisplayName(ctx: Context, displayName: string): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByDisplayName(ctx.logger, displayName);
    if (!playerRow) return null;

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, playerRow.id);
    return new PlayerModel(ctx, playerRow, playerUnits);
  }

  static async fetchAllMatchingIDs(ctx: Context, playerIDs: string[]): Promise<PlayerModel[]> {
    const playerRows = await ctx.daoFactory.player.fetchAllMatchingIDs(ctx.logger, playerIDs);

    return Promise.all(playerRows.map(async (row) => {
      const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
      return new PlayerModel(ctx, row, playerUnits);
    }));
  }

  static async create(ctx: Context, displayName: string, selectedRace: PlayerRace, selectedClass: string): Promise<PlayerModel> {
    const playerRow = await ctx.daoFactory.player.create(ctx.logger, ctx.authedUser.model.id, displayName, selectedRace, selectedClass);
    await ctx.daoFactory.playerUnits.create(ctx.logger, playerRow.id, 'citizen', 100);

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, playerRow.id);
    return new PlayerModel(ctx, playerRow, playerUnits);
  }
}
