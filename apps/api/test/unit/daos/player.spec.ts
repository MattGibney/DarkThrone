import { Knex } from 'knex';
import PlayerDao, { PlayerRow } from '../../../src/daos/player';

describe('DAO: Player', () => {
  it('ensureTypeSafety preserves armoury structure upgrades', () => {
    const dao = new PlayerDao({} as Knex);
    const row = {
      id: 'PLR-1',
      user_id: 'USR-1',
      display_name: 'Test',
      race: 'human',
      class: 'fighter',
      created_at: new Date(),
      attack_turns: 0,
      gold: 0,
      gold_in_bank: 0,
      experience: 0,
      overall_rank: 0,
      structureUpgrades: {
        fortification: 0,
        housing: 0,
        armoury: 1,
      },
    } as PlayerRow;

    const ensured = (
      dao as unknown as { ensureTypeSafety: (r: PlayerRow) => PlayerRow }
    ).ensureTypeSafety(row);

    expect(ensured.structureUpgrades).toEqual({
      fortification: 0,
      housing: 0,
      armoury: 1,
    });
  });
});
