import { PlayerRow } from '../../../src/daos/player';
import { Context } from '../../../src/app';
import PlayerModel from '../../../src/models/player';
import PlayerUnitsModel from '../../../src/models/playerUnits';

const mockPlayerRow: PlayerRow = {
  id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
  user_id: 'USR-01HQH3NPM1P19T8133DH5P0FJT',
  display_name: 'TestPlayer',
  race: 'human',
  class: 'fighter',
  created_at: new Date(),
  attack_turns: 10,
  gold: 20,
  experience: 30,
};

const mockPlayerUnits = [
  {
    unitType: 'support',
    quantity: 10,
    calculateAttackStrength: jest.fn().mockReturnValue(40),
    calculateDefenceStrength: jest.fn().mockReturnValue(50),
  } as unknown as PlayerUnitsModel,
];

describe('Model: Player', () => {
  describe('serialise', () => {
    it('should return a PlayerObject if the object is not for the authenticated player', async () => {
      const mockCTX = {} as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, []);
      const serialised = await player.serialise();

      expect(Object.keys(serialised)).toEqual([
        'id',
        'name',
        'avatarURL',
        'race',
        'class',
        'gold',
        'level',
      ]);
    });
    it('should return a AuthedPlayerObject if the object is for the authenticated player', async () => {
      const mockCTX = {
        authedPlayer: {
          id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        } as unknown as PlayerModel,
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, mockPlayerUnits);
      const serialised = await player.serialise();

      expect(Object.keys(serialised)).toEqual([
        'id',
        'name',
        'avatarURL',
        'race',
        'class',
        'gold',
        'level',
        'attackStrength',
        'defenceStrength',
        'attackTurns',
        'experience',
        'units',
      ]);
    });
    it('correctly populates all fields', async () => {
      const mockCTX = {
        authedPlayer: {
          id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        } as unknown as PlayerModel,
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, mockPlayerUnits);
      const serialised = await player.serialise();

      expect(serialised).toEqual({
        id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        name: 'TestPlayer',
        avatarURL: undefined,
        race: 'human',
        class: 'fighter',
        gold: 20,
        level: 1,
        experience: 30,
        attackTurns: 10,
        attackStrength: 44, // 40 from the mockPlayerUnits + 5% bonus for human
        defenceStrength: 50,
        units: [
          {
            unitType: 'support',
            quantity: 10,
          },
        ],
      });
    });
  });

  describe('calculateAttackStrength', () => {
    [
      { race: 'human', class: 'fighter', expected: 110 },
      { race: 'human', class: 'cleric', expected: 105 },
      { race: 'human', class: 'thief', expected: 105 },
      { race: 'human', class: 'assassin', expected: 105 },

      { race: 'elf', class: 'fighter', expected: 105 },
      { race: 'elf', class: 'cleric', expected: 100 },
      { race: 'elf', class: 'thief', expected: 100 },
      { race: 'elf', class: 'assassin', expected: 100 },

      { race: 'goblin', class: 'fighter', expected: 105 },
      { race: 'goblin', class: 'cleric', expected: 100 },
      { race: 'goblin', class: 'thief', expected: 100 },
      { race: 'goblin', class: 'assassin', expected: 100 },

      { race: 'undead', class: 'fighter', expected: 110 },
      { race: 'undead', class: 'cleric', expected: 105 },
      { race: 'undead', class: 'thief', expected: 105 },
      { race: 'undead', class: 'assassin', expected: 105 },
    ].map((testCase) => {
      it(`calculate attack strength for a ${testCase.race} ${testCase.class}`, async () => {
        const mockCTX = {} as unknown as Context;

        const player = new PlayerModel(
          mockCTX,
          {
            race: testCase.race,
            class: testCase.class,
          } as unknown as PlayerRow,
          [],
        );
        player.units = [
          {
            calculateAttackStrength: jest.fn().mockReturnValue(100),
          } as unknown as PlayerUnitsModel,
        ];
        const attackStrength = await player.calculateAttackStrength();

        expect(attackStrength).toEqual(testCase.expected);
      });
    });
  });

  describe('calculateDefenceStrength', () => {
    [
      { race: 'human', class: 'fighter', expected: 100 },
      { race: 'human', class: 'cleric', expected: 105 },
      { race: 'human', class: 'thief', expected: 100 },
      { race: 'human', class: 'assassin', expected: 100 },

      { race: 'elf', class: 'fighter', expected: 105 },
      { race: 'elf', class: 'cleric', expected: 105 },
      { race: 'elf', class: 'thief', expected: 105 },
      { race: 'elf', class: 'assassin', expected: 105 },

      { race: 'goblin', class: 'fighter', expected: 105 },
      { race: 'goblin', class: 'cleric', expected: 105 },
      { race: 'goblin', class: 'thief', expected: 105 },
      { race: 'goblin', class: 'assassin', expected: 105 },

      { race: 'undead', class: 'fighter', expected: 100 },
      { race: 'undead', class: 'cleric', expected: 105 },
      { race: 'undead', class: 'thief', expected: 100 },
      { race: 'undead', class: 'assassin', expected: 100 },
    ].map((testCase) => {
      it(`calculate attack strength for a ${testCase.race} ${testCase.class}`, async () => {
        const mockCTX = {} as unknown as Context;

        const player = new PlayerModel(
          mockCTX,
          {
            race: testCase.race,
            class: testCase.class,
          } as unknown as PlayerRow,
          [],
        );
        player.units = [
          {
            calculateDefenceStrength: jest.fn().mockReturnValue(100),
          } as unknown as PlayerUnitsModel,
        ];
        const defenceStrength = await player.calculateDefenceStrength();

        expect(defenceStrength).toEqual(testCase.expected);
      });
    });
  });
});
