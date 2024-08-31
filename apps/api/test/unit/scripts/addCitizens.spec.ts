import addCitizens from '../../../src/scripts/addCitizens';
import { Context } from '../../../src/app';

describe('addCitizens', () => {
  it('should increment attack turns for all players', async () => {
    const mockPlayers = [
      { id: 'PLR-1', citizensPerDay: 25 },
      { id: 'PLR-2', citizensPerDay: 25 },
    ];
    const mockPlayerUnits = [
      {
        id: 'UNIT-1',
        playerID: 'PLR-1',
        type: 'citizen',
        quantity: 10,
        save: jest.fn(),
      },
      {
        id: 'UNIT-2',
        playerID: 'PLR-1',
        type: 'worker',
        quantity: 10,
        save: jest.fn(),
      },
      {
        id: 'UNIT-3',
        playerID: 'PLR-2',
        type: 'citizen',
        quantity: 20,
        save: jest.fn(),
      },
    ];
    const mockCTX = {
      logger: {
        info: jest.fn(),
      },
      modelFactory: {
        player: {
          fetchAll: jest.fn().mockResolvedValue(mockPlayers),
        },
        playerUnits: {
          fetchUnitsForPlayerByType: jest
            .fn()
            .mockImplementation((ctx, playerID, type) => {
              return mockPlayerUnits.find(
                (unit) => unit.playerID === playerID && unit.type === type,
              );
            }),
        },
      },
    } as unknown as Context;

    await addCitizens(mockCTX);

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      '[Process Citizens] Starting',
    );

    expect(mockCTX.modelFactory.player.fetchAll).toHaveBeenCalled();

    expect(
      mockCTX.modelFactory.playerUnits.fetchUnitsForPlayerByType,
    ).toHaveBeenCalledTimes(2);

    expect(
      mockCTX.modelFactory.playerUnits.fetchUnitsForPlayerByType,
    ).toHaveBeenCalledWith(mockCTX, 'PLR-1', 'citizen');
    expect(
      mockCTX.modelFactory.playerUnits.fetchUnitsForPlayerByType,
    ).toHaveBeenCalledWith(mockCTX, 'PLR-2', 'citizen');

    expect(mockPlayerUnits[0].quantity).toBe(35);
    expect(mockPlayerUnits[2].quantity).toBe(45);

    expect(mockPlayerUnits[0].save).toHaveBeenCalled();
    expect(mockPlayerUnits[2].save).toHaveBeenCalled();

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      '[Process Citizens] Complete',
    );
  });
});
