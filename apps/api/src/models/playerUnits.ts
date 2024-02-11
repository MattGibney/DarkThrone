import { Context } from '../app';
import { PlayerUnitsRow } from '../daos/playerUnits';

type UnitType = {
  [k: string]: {
    attack: number;
    defence: number;
    cost?: number;
  };
};

const UnitTypes: UnitType = {
  citizen: {
    attack: 0,
    defence: 0,
  },
  soldier: {
    attack: 3,
    defence: 0,
    cost: 1500,
  },
  guard: {
    attack: 0,
    defence: 3,
    cost: 1500,
  },
}

/**
 * This is pluralised as it is a collection of player units
 */
export default class PlayerUnitsModel {
  private ctx: Context;

  public id: string;
  public playerID: string;
  public unitType: keyof typeof UnitTypes;
  public quantity: number;

  constructor(ctx: Context, data: PlayerUnitsRow) {
    this.ctx = ctx;

    this.populateFromRow(data);
  }

  save(): Promise<void> {
    return this.ctx.daoFactory.playerUnits.update({
      id: this.id,
      player_id: this.playerID,
      unit_type: this.unitType as string,
      quantity: this.quantity,
    });
  }

  calculateAttackStrength(): number {
    return UnitTypes[this.unitType].attack * this.quantity;
  }

  calculateDefenceStrength(): number {
    return UnitTypes[this.unitType].defence * this.quantity;
  }

  static async fetchUnitsForPlayer(ctx: Context, playerID: string): Promise<PlayerUnitsModel[]> {
    const rows = await ctx.daoFactory.playerUnits.fetchUnitsForPlayer(playerID);

    return rows.map((row) => new PlayerUnitsModel(ctx, row));
  }

  static async fetchUnitsForPlayerByType(ctx: Context, playerID: string, type: string): Promise<PlayerUnitsModel | null> {
    const row = await ctx.daoFactory.playerUnits.fetchUnitsForPlayerByType(playerID, type);
    if (!row) return null;

    return new PlayerUnitsModel(ctx, row);
  }

  static async create(ctx: Context, playerID: string, type: string, quantity: number): Promise<PlayerUnitsModel> {
    const row = await ctx.daoFactory.playerUnits.create(ctx.logger, playerID, type, quantity);

    return new PlayerUnitsModel(ctx, row);
  }

  private populateFromRow(data: PlayerUnitsRow) {
    this.id = data.id;
    this.playerID = data.player_id;
    this.unitType = data.unit_type;
    this.quantity = data.quantity;
  }
}
