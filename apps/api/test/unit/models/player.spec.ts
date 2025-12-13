import { PlayerRow } from '../../../src/daos/player';
import { Context } from '../../../src/app';
import PlayerModel from '../../../src/models/player';
import PlayerUnitsModel from '../../../src/models/playerUnits';
import UserModel from '../../../src/models/user';
import { calculateLevelXP, getLevelXP, calculateLevelFromXP } from '@darkthrone/game-data';

const mockPlayerRow: PlayerRow = {
  id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
  user_id: 'USR-01HQH3NPM1P19T8133DH5P0FJT',
  display_name: 'TestPlayer',
  race: 'human',
  class: 'fighter',
  created_at: new Date(),
  attack_turns: 10,
  gold: 20,
  gold_in_bank: 40,
  experience: 30,
  overall_rank: 1,
  structureUpgrades: {
    fortification: 0,
    housing: 0,
  },
};

const mockPlayerUnits = [
  {
    unitType: 'worker',
    quantity: 10,
    calculateAttackStrength: jest.fn().mockReturnValue(40),
    calculateDefenceStrength: jest.fn().mockReturnValue(50),
    calculateGoldPerTurn: jest.fn().mockReturnValue(100),
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
        'overallRank',
        'armySize',
      ]);
    });
    it('should return a AuthedPlayerObject if the object is for the authenticated player', async () => {
      const mockCTX = {
        authedPlayer: {
          id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        } as unknown as PlayerModel,
        daoFactory: {
          player: {
            fetchBankHistory: jest.fn().mockResolvedValue([]),
          },
        },
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, mockPlayerUnits);
      const serialised = await player.serialiseAuthedPlayer();

      expect(Object.keys(serialised)).toEqual([
        'id',
        'name',
        'avatarURL',
        'race',
        'class',
        'gold',
        'level',
        'overallRank',
        'armySize',
        'attackStrength',
        'defenceStrength',
        'attackTurns',
        'experience',
        'goldInBank',
        'goldPerTurn',
        'citizensPerDay',
        'depositHistory',
        'units',
        'structureUpgrades',
      ]);
    });
    it('correctly populates all fields', async () => {
      const mockCTX = {
        authedPlayer: {
          id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        } as unknown as PlayerModel,
        daoFactory: {
          player: {
            fetchBankHistory: jest.fn().mockResolvedValue([]),
          },
        },
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, mockPlayerUnits);
      const serialised = await player.serialiseAuthedPlayer();

      expect(serialised).toEqual({
        id: 'PLR-01HQH3NXAG7CASHPCETDC4HE0V',
        name: 'TestPlayer',
        avatarURL: undefined,
        race: 'human',
        class: 'fighter',
        gold: 20,
        level: 1,
        experience: 30,
        overallRank: 1,
        armySize: 0,
        attackTurns: 10,
        attackStrength: 44, // 40 from the mockPlayerUnits + 5% bonus for human
        defenceStrength: 52,
        depositHistory: [],
        goldInBank: 40,
        goldPerTurn: 10100,
        units: [
          {
            unitType: 'worker',
            quantity: 10,
          },
        ],
        citizensPerDay: 26,
        structureUpgrades: {
          fortification: 0,
          housing: 0,
        },
      });
    });
  });

  describe('GET armySize', () => {
    it('should return the sum of all unit quantities', async () => {
      const mockCTX = {} as unknown as Context;
      const playerUnits = [
        {
          unitType: 'worker',
          quantity: 5,
        },
        {
          unitType: 'soldier_1',
          quantity: 3,
        },
        {
          unitType: 'guard_1',
          quantity: 2,
        },
      ] as PlayerUnitsModel[];

      const player = new PlayerModel(mockCTX, mockPlayerRow, playerUnits);
      expect(player.armySize).toEqual(5);
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
      { race: 'human', class: 'fighter', expected: 105 },
      { race: 'human', class: 'cleric', expected: 110 },
      { race: 'human', class: 'thief', expected: 105 },
      { race: 'human', class: 'assassin', expected: 105 },

      { race: 'elf', class: 'fighter', expected: 110 },
      { race: 'elf', class: 'cleric', expected: 115 },
      { race: 'elf', class: 'thief', expected: 110 },
      { race: 'elf', class: 'assassin', expected: 110 },

      { race: 'goblin', class: 'fighter', expected: 110 },
      { race: 'goblin', class: 'cleric', expected: 115 },
      { race: 'goblin', class: 'thief', expected: 110 },
      { race: 'goblin', class: 'assassin', expected: 110 },

      { race: 'undead', class: 'fighter', expected: 105 },
      { race: 'undead', class: 'cleric', expected: 110 },
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
            calculateDefenceStrength: jest.fn().mockReturnValue(100),
          } as unknown as PlayerUnitsModel,
        ];
        const defenceStrength = await player.calculateDefenceStrength();

        expect(defenceStrength).toEqual(testCase.expected);
      });
    });
  });

  describe('calculateGoldPerTurn', () => {
    it('should return 0 if the player has no units', async () => {
      const mockCTX = {} as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, []);
      const goldPerTurn = await player.calculateGoldPerTurn();

      expect(goldPerTurn).toEqual(10000);
    });
    it('should return the sum of goldPerTurn for each unit', async () => {
      const mockCTX = {} as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, mockPlayerUnits);
      const goldPerTurn = await player.calculateGoldPerTurn();

      expect(goldPerTurn).toEqual(10100);
    });
    it('should add 5% bonus for thief players', async () => {
      const mockCTX = {} as unknown as Context;

      const thiefPlayerRow = {
        ...mockPlayerRow,
        class: 'thief',
      } as unknown as PlayerRow;

      const player = new PlayerModel(mockCTX, thiefPlayerRow, mockPlayerUnits);
      const goldPerTurn = await player.calculateGoldPerTurn();

      expect(goldPerTurn).toEqual(10105); // Includes the housing bonus
    });
  });

  describe('attackPlayer', () => {
    it('should correctly record war history for a successful attack', async () => {
      const attackerPlayerRow = {
        id: 'PLR-01HQP5D6HM1XS3MNAQXZAWP61K',
        race: 'elf',
        class: 'theif',
        gold: 100,
      } as unknown as PlayerRow;
      const attackerUnits = [
        {
          unitType: 'offence',
          quantity: 6,
          calculateAttackStrength: jest.fn().mockReturnValue(18),
        } as unknown as PlayerUnitsModel,
      ] as unknown as PlayerUnitsModel[];

      const defenderPlayerRow = {
        id: 'PLR-01HQP5DE1ZC99QTZR4AVV0MS7R',
        race: 'goblin',
        class: 'cleric',
        gold: 100,
      } as unknown as PlayerRow;
      const defenderUnits = [
        {
          unitType: 'defence',
          quantity: 1,
          calculateDefenceStrength: jest.fn().mockReturnValue(3),
        } as unknown as PlayerUnitsModel,
      ] as unknown as PlayerUnitsModel[];

      const mockCTX = {
        daoFactory: {
          player: {
            update: jest.fn().mockResolvedValue(attackerPlayerRow),
          },
        },
        modelFactory: {
          warHistory: {
            create: jest.fn().mockResolvedValue({}),
          },
        },
      } as unknown as Context;

      const attacker = new PlayerModel(
        mockCTX,
        attackerPlayerRow,
        attackerUnits,
      );

      const defender = new PlayerModel(
        mockCTX,
        defenderPlayerRow,
        defenderUnits,
      );

      await attacker.attackPlayer(defender, 10);

      expect(mockCTX.modelFactory.warHistory.create).toHaveBeenCalledWith(
        mockCTX,
        {
          id: expect.any(String),
          attacker_id: 'PLR-01HQP5D6HM1XS3MNAQXZAWP61K',
          defender_id: 'PLR-01HQP5DE1ZC99QTZR4AVV0MS7R',
          attack_turns_used: 10,
          is_attacker_victor: true,
          attacker_strength: 18,
          defender_strength: 3,
          gold_stolen: expect.any(Number),
          created_at: expect.any(Date),
          attacker_experience: expect.any(Number),
          defender_experience: 0,
        },
      );
    });
  });

  describe('determineIsVictor', () => {
    const player = new PlayerModel(
      {} as unknown as Context,
      {} as unknown as PlayerRow,
      [],
    );
    it('should return true if the attacker strength is greater than the defender strength', async () => {
      const isVictor = await player.determineIsVictor(10, 5);

      expect(isVictor).toEqual(true);
    });
    it('should return false if the attacker strength is less than the defender strength', async () => {
      const isVictor = await player.determineIsVictor(5, 10);

      expect(isVictor).toEqual(false);
    });
    it('should return false if the attacker strength is equal to the defender strength', async () => {
      const isVictor = await player.determineIsVictor(10, 10);

      expect(isVictor).toEqual(false);
    });
    it('should return false if the attacker and defender has no strength', async () => {
      const isVictor = await player.determineIsVictor(0, 0);

      expect(isVictor).toEqual(false);
    });
  });

  describe('depositGold', () => {
    it('should update the player gold and goldInBank', async () => {
      const mockCTX = {
        daoFactory: {
          player: {
            createBankHistory: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue(mockPlayerRow),
          },
        },
        logger: {
          debug: jest.fn(),
        },
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, []);

      const saveMock = jest.fn().mockResolvedValue({});
      player.save = saveMock;

      await player.depositGold(10);

      expect(mockCTX.logger.debug).toHaveBeenCalledWith(
        { amount: 10 },
        'Depositing gold',
      );
      expect(mockCTX.daoFactory.player.createBankHistory).toHaveBeenCalledWith(
        mockCTX.logger,
        player.id,
        10,
        'deposit',
      );
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('withdrawGold', () => {
    it('should update the player gold and goldInBank', async () => {
      const mockCTX = {
        daoFactory: {
          player: {
            createBankHistory: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue(mockPlayerRow),
          },
        },
        logger: {
          debug: jest.fn(),
        },
      } as unknown as Context;

      const player = new PlayerModel(mockCTX, mockPlayerRow, []);

      const saveMock = jest.fn().mockResolvedValue({});
      player.save = saveMock;

      await player.withdrawGold(10);

      expect(mockCTX.logger.debug).toHaveBeenCalledWith(
        { amount: 10 },
        'Withdrawing gold',
      );
      expect(mockCTX.daoFactory.player.createBankHistory).toHaveBeenCalledWith(
        mockCTX.logger,
        player.id,
        10,
        'withdraw',
      );
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('(static) fetchAllForUser', () => {
    it('should return an array of PlayerModels', async () => {
      const mockCTX = {
        daoFactory: {
          player: {
            fetchAllForUser: jest.fn().mockResolvedValue([mockPlayerRow]),
          },
        },
        modelFactory: {
          playerUnits: {
            fetchUnitsForPlayer: jest.fn().mockResolvedValue(mockPlayerUnits),
          },
        },
      } as unknown as Context;

      const players = await PlayerModel.fetchAllForUser(
        mockCTX,
        {} as UserModel,
      );

      expect(players).toHaveLength(1);
      expect(players[0]).toBeInstanceOf(PlayerModel);
    });
  });

  describe('{static} fetchAll', () => {
    it('should return an array of PlayerModels', async () => {
      const mockCTX = {
        daoFactory: {
          player: {
            fetchAll: jest.fn().mockResolvedValue([mockPlayerRow]),
          },
        },
        modelFactory: {
          playerUnits: {
            fetchUnitsForPlayer: jest.fn().mockResolvedValue(mockPlayerUnits),
          },
        },
      } as unknown as Context;

      const players = await PlayerModel.fetchAll(mockCTX);

      expect(players).toHaveLength(1);
      expect(players[0]).toBeInstanceOf(PlayerModel);
    });
  });

  describe('(static) fetchAllPaginated', () => {
    it('should return a paginated array of PlayerModels', async () => {
      const mockCTX = {
        daoFactory: {
          player: {
            fetchAllPaginated: jest
              .fn()
              .mockImplementation((ctx, paginator) => {
                paginator.totalItemCount = 1;
                paginator.dataRows = [mockPlayerRow];
                return Promise.resolve(paginator);
              }),
          },
        },
        modelFactory: {
          playerUnits: {
            fetchUnitsForPlayer: jest.fn().mockResolvedValue(mockPlayerUnits),
          },
        },
        logger: {},
      } as unknown as Context;

      const paginator = await PlayerModel.fetchAllPaginated(mockCTX, 1, 10);

      expect(mockCTX.daoFactory.player.fetchAllPaginated).toHaveBeenCalledWith(
        mockCTX.logger,
        paginator,
      );

      expect(paginator.page).toBe(1);
      expect(paginator.pageSize).toBe(10);
      expect(paginator.totalItemCount).toBe(1);
      expect(paginator.items.length).toBe(1);
      expect(paginator.items[0]).toBeInstanceOf(PlayerModel);
    });
  });

  describe('Level XP Formula', () => {
    // Original XP values from the game data
    // Had to add level 1 as 0 XP to the array
    const originalXPValues = [
      0, 4000, 8000, 13000, 19000, 26000, 34000, 43000, 53000, 64000, 76000,
      89000, 103000, 118000, 134000, 151000, 169000, 188000, 208000, 229000,
      251000, 274000, 298000, 323000, 349000, 376000, 404000, 433000, 463000,
      494000, 526000, 559000, 593000, 628000, 664000, 701000, 739000, 778000,
      818000, 859000, 901000, 944000, 988000, 1033000, 1079000, 1126000,
      1174000, 1223000, 1273000, 1324000, 1376000, 1429000, 1483000, 1538000,
      1594000, 1651000, 1709000, 1768000, 1828000, 1889000, 1951000, 2014000,
      2078000, 2143000, 2209000, 2276000, 2344000, 2413000, 2483000, 2554000,
      2626000, 2699000, 2773000, 2848000, 2924000, 3001000, 3079000, 3158000,
      3238000, 3319000, 3401000, 3484000, 3568000, 3653000, 3739000, 3826000,
      3914000, 4003000, 4093000, 4184000, 4276000, 4369000, 4463000, 4558000,
      4654000, 4751000, 4849000, 4948000, 5048000, 5149000, 5251000,
    ];

    it('should match original XP values within 1% margin', () => {
      originalXPValues.forEach((expectedXP, index) => {
        const level = index + 1;
        if (level === 1) return; // Skip level 1
        const calculatedXP = calculateLevelXP(level);
        const percentDiff = Math.abs((calculatedXP - expectedXP) / expectedXP);

        expect(percentDiff).toBeLessThan(0.01); // Within 1% margin
      });
    });

    it('should throw error for invalid levels', () => {
      expect(() => getLevelXP(0)).toThrow('Level must be between 1 and 100');
      expect(() => getLevelXP(101)).toThrow('Level must be between 1 and 100');
    });

    [
      { experience: 0, expected_level: 1 },
      { experience: 2000, expected_level: 1 },
      { experience: 4000, expected_level: 2 },
      { experience: 6000, expected_level: 2 },
      { experience: 8000, expected_level: 3 },
      { experience: 13000, expected_level: 4 },
      { experience: 19000, expected_level: 5 },
      { experience: 5251000, expected_level: 100 },
      { experience: 9999999, expected_level: 100 },
    ].forEach((testCase) => {
      it(`should return level ${testCase.expected_level} for ${testCase.experience} XP`, () => {
        const level = calculateLevelFromXP(testCase.experience);
        expect(level).toBe(testCase.expected_level);
      });
    });
  });
});
