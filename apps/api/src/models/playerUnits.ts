import { Context } from '../app';
import { PlayerUnitsRow } from '../daos/playerUnits';

type UnitType = {
  [k: string]: {
    attack: number;
    defence: number;
  };
};

const UnitTypes: UnitType = {
  citizen: {
    attack: 0,
    defence: 0,
  },
  soldier: {
    attack: 10,
    defence: 0,
  },
  guard: {
    attack: 0,
    defence: 10,
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

  static async fetchUnitsForPlayer(ctx: Context, playerID: string): Promise<PlayerUnitsModel[]> {
    const rows = await ctx.daoFactory.playerUnits.fetchUnitsForPlayer(playerID);

    return rows.map((row) => new PlayerUnitsModel(ctx, row));
  }

  calculateAttackStrength(): number {
    return UnitTypes[this.unitType].attack * this.quantity;
  }

  calculateDefenceStrength(): number {
    return UnitTypes[this.unitType].defence * this.quantity;
  }

  private populateFromRow(data: PlayerUnitsRow) {
    this.id = data.id;
    this.playerID = data.player_id;
    this.unitType = data.unit_type;
    this.quantity = data.quantity;
  }
}
