import request from 'supertest';
import makeApplication from '../helpers/makeApplication';

describe('POST_upgradeStructure.spec', () => {
  it('should return a 400 if no upgrade type is specified', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        structureUpgrades: {
          fortification: 0,
          housing: 0,
        },
        proficiencyPoints: {
          strength: 0,
          constitution: 0,
          wealth: 0,
          dexterity: 0,
          charisma: 0,
        },
      },
    });

    const response = await request(application)
      .post('/structures/upgrade')
      .set('Authorization', 'Bearer TOKEN')
      .send({});

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'upgrade_structure_not_found',
          title: 'Structure upgrade not found',
        },
      ],
    });
  });
  it('should return a 400 if the specified upgrade is invalid', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        structureUpgrades: {
          fortification: 0,
          housing: 0,
        },
        proficiencyPoints: {
          strength: 0,
          constitution: 0,
          wealth: 0,
          dexterity: 0,
          charisma: 0,
        },
      },
    });

    const response = await request(application)
      .post('/structures/upgrade')
      .set('Authorization', 'Bearer TOKEN')
      .send({ structureType: 'INVALID' });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'upgrade_structure_not_found',
          title: 'Structure upgrade not found',
        },
      ],
    });
  });
  it('should return a 400 if the player does not have enough gold', async () => {
    const { application } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        gold: 0,
        structureUpgrades: {
          fortification: 0,
          housing: 0,
        },
        proficiencyPoints: {
          strength: 0,
          constitution: 0,
          wealth: 0,
          dexterity: 0,
          charisma: 0,
        },
      },
    });

    const response = await request(application)
      .post('/structures/upgrade')
      .set('Authorization', 'Bearer TOKEN')
      .send({ structureType: 'fortification' });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      errors: [
        {
          code: 'upgrade_structure_not_enough_gold',
          title: 'Not enough gold',
        },
      ],
    });
  });
  it('should return a 200 if the upgrade is successful', async () => {
    const { application, daoFactory } = makeApplication({
      authenticatedUser: {
        user: {},
        session: {
          player_id: 'PLR-1',
        },
      },
      authenticatedPlayer: {
        id: 'PLR-1',
        gold: 100001,
        structureUpgrades: {
          fortification: 0,
          housing: 0,
        },
        proficiencyPoints: {
          strength: 0,
          constitution: 0,
          wealth: 0,
          dexterity: 0,
          charisma: 0,
        },
      },
    });

    const response = await request(application)
      .post('/structures/upgrade')
      .set('Authorization', 'Bearer TOKEN')
      .send({ structureType: 'fortification' });

    expect(daoFactory.player.update).toHaveBeenCalledWith(
      expect.anything(),
      'PLR-1',
      expect.objectContaining({
        gold: 1,
        structureUpgrades: {
          fortification: 1,
          housing: 0,
        },
      }),
    );
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ status: 'success' });
  });
});
