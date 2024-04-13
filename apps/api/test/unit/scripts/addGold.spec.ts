import addGold from '../../../src/scripts/addGold';
import { Context } from '../../../src/app';

describe('addGold', () => {
  it('should increment gold for all players', async () => {
    const mockPlayers = [
      {
        id: 'PLR-1',
        calculateGoldPerTurn: jest.fn().mockResolvedValue(10),
        gold: 0,
        save: jest.fn(),
      },
      {
        id: 'PLR-2',
        calculateGoldPerTurn: jest.fn().mockResolvedValue(10),
        gold: 0,
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
      },
    } as unknown as Context;

    await addGold(mockCTX);

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      '[Process Gold Production] Starting',
    );

    expect(mockCTX.modelFactory.player.fetchAll).toHaveBeenCalled();

    expect(mockPlayers[0].calculateGoldPerTurn).toHaveBeenCalled();
    expect(mockPlayers[0].gold).toBe(10);
    expect(mockPlayers[0].save).toHaveBeenCalled();

    expect(mockPlayers[1].calculateGoldPerTurn).toHaveBeenCalled();
    expect(mockPlayers[1].gold).toBe(10);
    expect(mockPlayers[1].save).toHaveBeenCalled();

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      { goldAddedtoEconomy: 20 },
      '[Process Gold Production] Complete',
    );
  });
});
