import {
  AuthedPlayerObject,
  FortificationUpgrade,
  PlayerClass,
  PlayerNameValidation,
  PlayerObject,
  StructureUpgrade,
  UnitType,
} from '@darkthrone/interfaces';
import { PlayerRace } from '@darkthrone/interfaces';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';
import { ulid } from 'ulid';
import WarHistoryModel from './warHistory';
import PlayerUnitsModel from './playerUnits';
import {
  UnitTypes,
  fortificationUpgrades,
  housingUpgrades,
  calculateLevelFromXP,
  structureUpgrades,
} from '@darkthrone/game-data';
import { getRandomNumber } from '../utils';
import { Paginator } from '../lib/paginator';

export default class PlayerModel {
  private ctx: Context;

  public id: string;
  public userID: string;
  public displayName: string;
  public race: PlayerRace;
  public class: PlayerClass;
  public avatarURL?: string;
  public createdAt: Date;
  public attackTurns: number;
  public gold: number;
  public goldInBank: number;
  public experience: number;
  public level: number;
  public overallRank: number;
  public structureUpgrades: {
    fortification: number;
    housing: number;
  };

  public units: PlayerUnitsModel[];

  constructor(ctx: Context, data: PlayerRow, units: PlayerUnitsModel[]) {
    this.ctx = ctx;

    this.populateFromRow(data);
    this.units = units;
  }

  async serialise(): Promise<PlayerObject | AuthedPlayerObject> {
    const isAuthed = this.ctx.authedPlayer?.id === this.id;

    const armySize = this.armySize;

    const playerObject: PlayerObject = {
      id: this.id,
      name: this.displayName,
      avatarURL: this.avatarURL,
      race: this.race,
      class: this.class,
      gold: this.gold,
      level: calculateLevelFromXP(this.experience),
      overallRank: this.overallRank,
      armySize: armySize,
    };

    if (!isAuthed) return playerObject;

    const attackStrength = await this.calculateAttackStrength();
    const defenceStrength = await this.calculateDefenceStrength();

    const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const depositHistory = await this.fetchBankHistory(date24HoursAgo);

    const authedPlayerObject: AuthedPlayerObject = Object.assign(playerObject, {
      attackStrength: attackStrength,
      defenceStrength: defenceStrength,
      attackTurns: this.attackTurns,
      experience: this.experience,
      goldInBank: this.goldInBank,
      citizensPerDay: this.citizensPerDay,
      depositHistory: depositHistory.map((history) => ({
        amount: history.amount,
        date: history.created_at,
        type: history.transaction_type,
      })),
      units: this.units.map((unit) => ({
        unitType: unit.unitType,
        quantity: unit.quantity,
      })),
      structureUpgrades: this.structureUpgrades,
    });

    return authedPlayerObject;
  }

  async fetchBankHistory(dateFrom: Date) {
    return await this.ctx.daoFactory.player.fetchBankHistory(
      this.ctx.logger,
      this.id,
      dateFrom,
    );
  }

  async depositGold(amount: number) {
    this.ctx.logger.debug({ amount }, 'Depositing gold');

    this.gold -= amount;
    this.goldInBank += amount;

    await this.ctx.daoFactory.player.createBankHistory(
      this.ctx.logger,
      this.id,
      amount,
      'deposit',
    );

    this.save();
  }

  async withdrawGold(amount: number) {
    this.ctx.logger.debug({ amount }, 'Withdrawing gold');

    this.gold += amount;
    this.goldInBank -= amount;

    await this.ctx.daoFactory.player.createBankHistory(
      this.ctx.logger,
      this.id,
      amount,
      'withdraw',
    );

    this.save();
  }

  get armySize(): number {
    return this.units
      .filter((unit) => UnitTypes[unit.unitType].type !== UnitType.SUPPORT)
      .reduce((acc, unit) => acc + unit.quantity, 0);
  }

  get fortification(): FortificationUpgrade {
    return fortificationUpgrades[this.structureUpgrades.fortification];
  }

  async upgradeStructure(
    type: keyof typeof structureUpgrades,
    desiredUpgrade: StructureUpgrade,
  ) {
    this.ctx.logger.debug({ type }, 'Upgrading structure');

    this.gold -= desiredUpgrade.cost;
    this.structureUpgrades[type] += 1;

    this.save();
  }

  async calculateAttackStrength(): Promise<number> {
    let offense = this.units.reduce(
      (acc, unit) => acc + unit.calculateAttackStrength(),
      0,
    );
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
    let defence = this.units.reduce(
      (acc, unit) => acc + unit.calculateDefenceStrength(),
      0,
    );
    if (this.race === 'elf' || this.race === 'goblin') {
      // Elves and Goblins get a 5% bonus to defence strength
      defence *= 1.05;
    }
    if (this.class === 'cleric') {
      // Clerics get a 5% bonus to defence strength
      defence *= 1.05;
    }

    const fortificationBonus = this.fortification.defenceBonusPercentage;
    defence *= 1 + fortificationBonus / 100;

    return Math.floor(defence);
  }

  async calculateGoldPerTurn(): Promise<number> {
    let goldPerTurn = this.units.reduce(
      (acc, unit) => acc + unit.calculateGoldPerTurn(),
      0,
    );
    if (this.class === 'thief') {
      // Thieves get a 5% bonus to gold per turn
      goldPerTurn *= 1.05;
    }

    const fortificationGoldPerTurn = this.fortification.goldPerTurn;
    goldPerTurn += fortificationGoldPerTurn;

    return Math.floor(goldPerTurn);
  }

  get citizensPerDay(): number {
    const housingUpgrade = housingUpgrades[this.structureUpgrades.housing];
    return 25 + housingUpgrade.citizensPerDay;
  }

  determineIsVictor(attackerStrength: number, defenderStrength: number) {
    if (attackerStrength === 0) return false;

    return attackerStrength > defenderStrength;
  }

  async attackPlayer(
    targetPlayer: PlayerModel,
    attackTurns: number,
  ): Promise<WarHistoryModel> {
    const warHistoryID = `WRH-${ulid()}`;

    const playerAttackStrength = await this.calculateAttackStrength();
    const targetPlayerDefenceStrength =
      await targetPlayer.calculateDefenceStrength();

    const isVictor = this.determineIsVictor(
      playerAttackStrength,
      targetPlayerDefenceStrength,
    );

    // Calculate XP
    const victorExperience = Math.floor(
      getRandomNumber(500, 1500) * (0.1 * attackTurns),
    );

    if (!isVictor) {
      // Grant XP to the defender
      targetPlayer.experience += victorExperience;
      await targetPlayer.save();

      // Create War History
      return await this.ctx.modelFactory.warHistory.create(this.ctx, {
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
      });
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

    return await this.ctx.modelFactory.warHistory.create(this.ctx, {
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
    });
  }

  async save() {
    const playerData = await this.ctx.daoFactory.player.update(
      this.ctx.logger,
      this.id,
      {
        avatar_url: this.avatarURL,
        attack_turns: this.attackTurns,
        gold: this.gold,
        gold_in_bank: this.goldInBank,
        experience: this.experience,
        overall_rank: this.overallRank,
        structureUpgrades: this.structureUpgrades,
      },
    );

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
    this.goldInBank = row.gold_in_bank;
    this.experience = row.experience;
    this.level = calculateLevelFromXP(this.experience);
    this.overallRank = row.overall_rank;
    this.structureUpgrades = {
      fortification: row.structureUpgrades?.fortification || 0,
      housing: row.structureUpgrades?.housing || 0,
    };
  }

  static async fetchAllForUser(ctx: Context, user: UserModel) {
    const playerRows = await ctx.daoFactory.player.fetchAllForUser(
      ctx.logger,
      user.id,
    );
    return Promise.all(
      playerRows.map(async (row) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits);
      }),
    );
  }

  static async fetchAll(ctx: Context): Promise<PlayerModel[]> {
    const playerRows = await ctx.daoFactory.player.fetchAll(ctx.logger);
    return Promise.all(
      playerRows.map(async (row) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits);
      }),
    );
  }

  static async fetchAllPaginated(
    ctx: Context,
    page = 1,
    pageSize = 100,
  ): Promise<Paginator<PlayerRow, PlayerModel>> {
    const paginator: Paginator<PlayerRow, PlayerModel> = new Paginator<
      PlayerRow,
      PlayerModel
    >(page, pageSize);
    await ctx.daoFactory.player.fetchAllPaginated(ctx.logger, paginator);

    paginator.items = await Promise.all(
      paginator.dataRows.map(async (player) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(
            ctx,
            player.id,
          );
        return new PlayerModel(ctx, player, playerUnits);
      }),
    );

    return paginator;
  }

  static async fetchByID(
    ctx: Context,
    id: string,
  ): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByID(ctx.logger, id);
    if (!playerRow) return null;

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits);
  }

  static async fetchByDisplayName(
    ctx: Context,
    displayName: string,
  ): Promise<PlayerModel | null> {
    const playerRow = await ctx.daoFactory.player.fetchByDisplayName(
      ctx.logger,
      displayName,
    );
    if (!playerRow) return null;

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits);
  }

  static async fetchAllMatchingIDs(
    ctx: Context,
    playerIDs: string[],
  ): Promise<PlayerModel[]> {
    const playerRows = await ctx.daoFactory.player.fetchAllMatchingIDs(
      ctx.logger,
      playerIDs,
    );

    return Promise.all(
      playerRows.map(async (row) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits);
      }),
    );
  }

  static async create(
    ctx: Context,
    displayName: string,
    selectedRace: PlayerRace,
    selectedClass: PlayerClass,
  ): Promise<PlayerModel> {
    const playerRow = await ctx.daoFactory.player.create(
      ctx.logger,
      ctx.authedUser.model.id,
      displayName,
      selectedRace,
      selectedClass,
    );
    await ctx.daoFactory.playerUnits.create(
      ctx.logger,
      playerRow.id,
      'citizen',
      100,
    );

    const playerUnits = await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits);
  }

  static async validateDisplayName(
    ctx: Context,
    displayName: string,
  ): Promise<PlayerNameValidation> {
    const errors = [];

    const existingPlayer = await ctx.modelFactory.player.fetchByDisplayName(
      ctx,
      displayName,
    );
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
