import { AuthedPlayerObject, PlayerNameValidation, PlayerObject } from '@darkthrone/interfaces';
import { PlayerRace } from '@darkthrone/interfaces';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';
import { ulid } from 'ulid';
import WarHistoryModel from './warHistory';
import PlayerUnitsModel from './playerUnits';
import { levelXPArray } from '@darkthrone/game-data';
import { getRandomNumber } from '../utils';

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
  public experience: number;

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
      level: levelXPArray.findIndex((xp) => xp >= this.experience) + 1,
    } as PlayerObject;

    if (!isAuthed) return playerObject;

    const attackStrength = await this.calculateAttackStrength();
    const defenceStrength = await this.calculateDefenceStrength();

    const authedPlayerObject: AuthedPlayerObject = Object.assign(playerObject, {
      attackStrength: attackStrength,
      defenceStrength: defenceStrength,
      attackTurns: this.attackTurns,
      experience: this.experience,
      units: this.units.map((unit) => ({
        unitType: unit.unitType,
        quantity: unit.quantity,
      })),
    });

    return authedPlayerObject;
  }

  async calculateAttackStrength(): Promise<number> {
    let offense = this.units.reduce((acc, unit) => acc + unit.calculateAttackStrength(), 0);
    if (this.race === 'human' || this.race === 'undead') {
      // Humans and Undead get a 5% bonus to attack strength
      offense *= 1.05;
    }
    if (this.class === 'fighter') {
      // Fighters get a 5% bonus to attack strength
      offense *= 1.05;
    }
    return Math.floor(offense);
  }

  async calculateDefenceStrength(): Promise<number> {
    const defence = this.units.reduce((acc, unit) => acc + unit.calculateDefenceStrength(), 0);
    if (this.race === 'elf' || this.race === 'goblin') {
      // Elves and Goblins get a 5% bonus to defence strength
      return defence * 1.05;
    }
    if (this.class === 'cleric') {
      // Clerics get a 5% bonus to defence strength
      return defence * 1.05;
    }
    return Math.floor(defence);
  }

  async calculateGoldPerTurn(): Promise<number> {
    let goldPerTurn = this.units.reduce((acc, unit) => acc + unit.calculateGoldPerTurn(), 0);
    if (this.class === 'thief') {
      // Thieves get a 5% bonus to gold per turn
      goldPerTurn *= 1.05;
    }
    return Math.floor(goldPerTurn);
  }

  async attackPlayer(targetPlayer: PlayerModel, attackTurns: number): Promise<WarHistoryModel> {
    const warHistoryID = `WRH-${ulid()}`;

    const playerAttackStrength = await this.calculateAttackStrength();
    const targetPlayerDefenceStrength = await targetPlayer.calculateDefenceStrength();

    const isVictor = playerAttackStrength > targetPlayerDefenceStrength;

    // Calculate XP
    const victorExperience = Math.floor(getRandomNumber(500, 1500) * (0.1 * attackTurns));

    if (!isVictor) {
      // Grant XP to the defender
      targetPlayer.experience += victorExperience;
      await targetPlayer.save();

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
          attacker_experience: 0,
          defender_experience: victorExperience,
        }
      );
    }

    // Calculate Damage

    // Calculate winnings
    const totalPossibleWinnings = targetPlayer.gold * 0.8;
    const winnings = Math.floor(totalPossibleWinnings * (0.1 * attackTurns));
    this.gold += winnings;
    targetPlayer.gold -= winnings;

    // Grant XP to the attacker
    this.experience += victorExperience;

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
        attacker_experience: victorExperience,
        defender_experience: 0,
      }
    )
  }

  async save() {
    const playerData = await this.ctx.daoFactory.player.update(this.ctx.logger, this.id, {
      avatar_url: this.avatarURL,
      attack_turns: this.attackTurns,
      gold: this.gold,
      experience: this.experience,
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
    this.experience = row.experience;
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

  static async validateDisplayName(ctx: Context, displayName: string): Promise<PlayerNameValidation> {
    const errors = [];

    const existingPlayer = await ctx.modelFactory.player.fetchByDisplayName(ctx, displayName);
    if (existingPlayer) {
      /* If the name is already taken, we don't need to do any other validation
       * A name that already exists, MUST be valid by definition. Returning
       * additional errors would look sloppy.
       */

      return {
        isValid: false,
        issues: ['name_taken'],
      };
    }

    // Validate Regex a-zA-Z0-9_
    if (!/^[a-zA-Z0-9_]*$/.test(displayName)) {
      errors.push('invalid_characters');
    }

    if (displayName.length < 3) {
      errors.push('too_short');
    }

    if (displayName.length > 20) {
      errors.push('too_long');
    }

    return {
      isValid: errors.length === 0,
      issues: errors,
    };
  }
}
