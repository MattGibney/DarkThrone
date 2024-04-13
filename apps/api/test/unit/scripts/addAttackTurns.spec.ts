import addAttackTurns from '../../../src/scripts/addAttackTurns';
import { Context } from '../../../src/app';

describe('addAttackTurns', () => {
  it('should increment attack turns for all players', async () => {
    const mockPlayers = [
      { attackTurns: 0, save: jest.fn() },
      { attackTurns: 0, save: jest.fn() },
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

    await addAttackTurns(mockCTX);

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      '[Process Attack Turns] Starting',
    );

    expect(mockCTX.modelFactory.player.fetchAll).toHaveBeenCalled();

    expect(mockPlayers[0].attackTurns).toBe(1);
    expect(mockPlayers[0].save).toHaveBeenCalled();

    expect(mockPlayers[1].attackTurns).toBe(1);
    expect(mockPlayers[1].save).toHaveBeenCalled();

    expect(mockCTX.logger.info).toHaveBeenCalledWith(
      '[Process Attack Turns] Complete',
    );
  });
});
