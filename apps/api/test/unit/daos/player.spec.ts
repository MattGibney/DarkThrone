import { Knex } from 'knex';
import { newPlayerStartingState } from '@darkthrone/game-data';
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

  it('create seeds explicit starter resources instead of relying on database defaults', async () => {
    const createdAt = new Date();
    const count = jest.fn().mockResolvedValue([{ count: '4' }]);
    const returning = jest.fn().mockResolvedValue([
      {
        id: 'PLR-1',
        user_id: 'USR-1',
        display_name: 'Starter',
        race: 'human',
        class: 'fighter',
        created_at: createdAt,
        attack_turns: newPlayerStartingState.attackTurns,
        gold: newPlayerStartingState.gold,
        gold_in_bank: newPlayerStartingState.goldInBank,
        experience: newPlayerStartingState.experience,
        overall_rank: 5,
        structureUpgrades: newPlayerStartingState.structureUpgrades,
      },
    ]);
    const insert = jest.fn().mockReturnValue({ returning });
    const database = jest
      .fn()
      .mockReturnValue({ count, insert }) as unknown as Knex;
    const dao = new PlayerDao(database);

    await dao.create(
      { error: jest.fn() } as never,
      'USR-1',
      'Starter',
      'human',
      'fighter',
    );

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'USR-1',
        display_name: 'Starter',
        race: 'human',
        class: 'fighter',
        attack_turns: newPlayerStartingState.attackTurns,
        gold: newPlayerStartingState.gold,
        gold_in_bank: newPlayerStartingState.goldInBank,
        experience: newPlayerStartingState.experience,
        overall_rank: 5,
        structureUpgrades: newPlayerStartingState.structureUpgrades,
      }),
    );
  });
});
