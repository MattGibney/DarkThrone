import {
  AuthedPlayerObject,
  CombatUnitType,
  FortificationUpgrade,
  PlayerClass,
  PlayerNameValidation,
  PlayerNameValidationIssue,
  PlayerObject,
  StructureUpgrade,
  UnitItem,
  UnitItemType,
  UnitType,
} from '@darkthrone/interfaces';
import { PlayerRace } from '@darkthrone/interfaces';
import { Context } from '../app';
import { PlayerRow } from '../daos/player';
import UserModel from './user';
import { ulid } from 'ulid';
import WarHistoryModel from './warHistory';
import PlayerUnitsModel from './playerUnits';
import PlayerItemModel from './playerItem';
import {
  UnitTypes,
  fortificationUpgrades,
  housingUpgrades,
  levelXPArray,
  structureUpgrades,
  unitItems,
} from '@darkthrone/game-data';
import { getRandomNumber } from '../utils';
import { Paginator } from '../lib/paginator';

const unitItemLookup: Record<string, UnitItem> = unitItems.reduce(
  (acc, item) => {
    acc[item.key] = item;
    return acc;
  },
  {} as Record<string, UnitItem>,
);

const itemTypeOrder: UnitItemType[] = [
  'weapon',
  'helm',
  'armor',
  'boots',
  'bracers',
  'shield',
];

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
    armoury: number;
  };

  public units: PlayerUnitsModel[];
  public items: PlayerItemModel[];

  constructor(
    ctx: Context,
    data: PlayerRow,
    units: PlayerUnitsModel[],
    items: PlayerItemModel[],
  ) {
    this.ctx = ctx;

    this.populateFromRow(data);
    this.units = units;
    this.items = items || [];
  }

  async serialiseAuthedPlayer(): Promise<AuthedPlayerObject> {
    const attackStrength = await this.calculateAttackStrength();
    const defenceStrength = await this.calculateDefenceStrength();
    const goldPerTurn = await this.calculateGoldPerTurn();

    const date24HoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const depositHistory = await this.fetchBankHistory(date24HoursAgo);

    const basePlayerObject = await this.serialise();
    const authedPlayerObject: AuthedPlayerObject = Object.assign(
      basePlayerObject,
      {
        attackStrength: attackStrength,
        defenceStrength: defenceStrength,
        attackTurns: this.attackTurns,
        experience: this.experience,
        goldInBank: this.goldInBank,
        goldPerTurn: goldPerTurn,
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
        items: this.items.map((item) => ({
          itemKey: item.itemKey,
          quantity: item.quantity,
        })),
        structureUpgrades: this.structureUpgrades,
      },
    );

    return authedPlayerObject;
  }

  async serialise(): Promise<PlayerObject> {
    const armySize = this.armySize;

    const playerObject: PlayerObject = {
      id: this.id,
      name: this.displayName,
      avatarURL: this.avatarURL,
      race: this.race,
      class: this.class,
      gold: this.gold,
      level: levelXPArray.findIndex((xp) => xp >= this.experience) + 1,
      overallRank: this.overallRank,
      armySize: armySize,
    };

    return playerObject;
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
    let offence =
      this.units.reduce(
        (acc, unit) => acc + unit.calculateAttackStrength(),
        0,
      ) + this.calculateItemStrength(CombatUnitType.OFFENCE, 'offence');
    if (this.race === 'human' || this.race === 'undead') {
      // Humans and Undead get a 5% bonus to attack strength
      offence *= 1.05;
    }
    if (this.class === 'fighter') {
      // Fighters get a 5% bonus to attack strength
      offence *= 1.05;
    }
    return Math.floor(offence);
  }

  async calculateDefenceStrength(): Promise<number> {
    let defence =
      this.units.reduce(
        (acc, unit) => acc + unit.calculateDefenceStrength(),
        0,
      ) + this.calculateItemStrength(CombatUnitType.DEFENCE, 'defence');
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

  private getUnitCountByCombatType(combatType: CombatUnitType): number {
    return this.units
      .filter((unit) => {
        const unitCombatType = UnitTypes[unit.unitType].type;
        if (
          unitCombatType !== UnitType.OFFENCE &&
          unitCombatType !== UnitType.DEFENCE
        ) {
          return false;
        }
        return combatType === CombatUnitType.OFFENCE
          ? unitCombatType === UnitType.OFFENCE
          : unitCombatType === UnitType.DEFENCE;
      })
      .reduce((acc, unit) => acc + unit.quantity, 0);
  }

  private calculateItemStrength(
    combatType: CombatUnitType,
    stat: 'offence' | 'defence',
  ): number {
    const unitCount = this.getUnitCountByCombatType(combatType);
    if (unitCount === 0) return 0;

    let total = 0;

    itemTypeOrder.forEach((itemType) => {
      const itemsForType = this.items
        .map((item) => {
          const definition = unitItemLookup[item.itemKey];
          if (
            !definition ||
            definition.unitType !== combatType ||
            definition.itemType !== itemType
          ) {
            return null;
          }

          const bonus = definition.bonuses[stat] || 0;
          if (bonus <= 0) return null;

          return { bonus, quantity: item.quantity };
        })
        .filter(Boolean) as { bonus: number; quantity: number }[];

      if (itemsForType.length === 0) return;

      itemsForType.sort((a, b) => b.bonus - a.bonus);

      let remaining = unitCount;
      for (const entry of itemsForType) {
        if (remaining <= 0) break;

        const used = Math.min(remaining, entry.quantity);
        total += used * entry.bonus;
        remaining -= used;
      }
    });

    return total;
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
    this.level = levelXPArray.findIndex((xp) => xp >= this.experience) + 1;
    this.overallRank = row.overall_rank;
    this.structureUpgrades = {
      fortification: row.structureUpgrades?.fortification || 0,
      housing: row.structureUpgrades?.housing || 0,
      armoury: row.structureUpgrades?.armoury || 0,
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
        const playerItems =
          await ctx.modelFactory.playerItems.fetchItemsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits, playerItems);
      }),
    );
  }

  static async fetchAll(ctx: Context): Promise<PlayerModel[]> {
    const playerRows = await ctx.daoFactory.player.fetchAll(ctx.logger);
    return Promise.all(
      playerRows.map(async (row) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(ctx, row.id);
        const playerItems =
          await ctx.modelFactory.playerItems.fetchItemsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits, playerItems);
      }),
    );
  }

  static async fetchAllPaginated(
    ctx: Context,
    page = 1,
    pageSize = 100,
  ): Promise<Paginator<PlayerRow, PlayerObject, PlayerModel>> {
    const paginator: Paginator<PlayerRow, PlayerObject, PlayerModel> =
      new Paginator<PlayerRow, PlayerObject, PlayerModel>(page, pageSize);
    await ctx.daoFactory.player.fetchAllPaginated(ctx.logger, paginator);

    paginator.items = await Promise.all(
      paginator.dataRows.map(async (player) => {
        const playerUnits =
          await ctx.modelFactory.playerUnits.fetchUnitsForPlayer(
            ctx,
            player.id,
          );
        const playerItems =
          await ctx.modelFactory.playerItems.fetchItemsForPlayer(
            ctx,
            player.id,
          );
        return new PlayerModel(ctx, player, playerUnits, playerItems);
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
    const playerItems = await ctx.modelFactory.playerItems.fetchItemsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits, playerItems);
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
    const playerItems = await ctx.modelFactory.playerItems.fetchItemsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits, playerItems);
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
        const playerItems =
          await ctx.modelFactory.playerItems.fetchItemsForPlayer(ctx, row.id);
        return new PlayerModel(ctx, row, playerUnits, playerItems);
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
    const playerItems = await ctx.modelFactory.playerItems.fetchItemsForPlayer(
      ctx,
      playerRow.id,
    );
    return new PlayerModel(ctx, playerRow, playerUnits, playerItems);
  }

  static async validateDisplayName(
    ctx: Context,
    displayName: string,
  ): Promise<PlayerNameValidation> {
    const errors: PlayerNameValidationIssue[] = [];

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
        issues: ['player.name.validation.taken'],
      };
    }

    // Validate Regex a-zA-Z0-9_
    if (!/^[a-zA-Z0-9_]*$/.test(displayName)) {
      errors.push('player.name.validation.invalidCharacters');
    }

    if (displayName.length < 3) {
      errors.push('player.name.validation.tooShort');
    }

    if (displayName.length > 20) {
      errors.push('player.name.validation.tooLong');
    }

    return {
      isValid: errors.length === 0,
      issues: errors,
    };
  }
}
