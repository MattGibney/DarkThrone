import { PlayerUnits } from '@darkthrone/interfaces';
import PlayerUnitsModel from '../../../src/models/playerUnits';
import { splitUnitsToCreateAndUpdate } from '../../../src/controllers/training';
import { Context } from '../../../src/app';

describe('TrainUnitsController', () => {
  describe('splitUnitsToCreateAndUpdate', () => {
    it('should return empty arrays if no units requested', () => {
      const desiredUnits: PlayerUnits[] = [];
      const existingUnits: PlayerUnitsModel[] = [];

      const result = splitUnitsToCreateAndUpdate(desiredUnits, existingUnits);

      expect(result).toEqual({ toCreate: [], toUpdate: [] });
    });

    it('should return all units to create if no existing units', () => {
      const desiredUnits: PlayerUnits[] = [
        { unitType: 'citizen', quantity: 1 },
        { unitType: 'worker', quantity: 1 },
      ];
      const existingUnits: PlayerUnitsModel[] = [];

      const result = splitUnitsToCreateAndUpdate(desiredUnits, existingUnits);

      expect(result).toEqual({ toCreate: desiredUnits, toUpdate: [] });
    });

    it('should return all units to update if no desired units', () => {
      const desiredUnits: PlayerUnits[] = [
        { unitType: 'citizen', quantity: 1 },
        { unitType: 'worker', quantity: 1 },
      ];
      const existingUnits: PlayerUnitsModel[] = [
        new PlayerUnitsModel({} as Context, {
          id: '',
          player_id: '',
          unit_type: 'citizen',
          quantity: 1,
        }),
        new PlayerUnitsModel({} as Context, {
          id: '',
          player_id: '',
          unit_type: 'worker',
          quantity: 1,
        }),
      ];

      const result = splitUnitsToCreateAndUpdate(desiredUnits, existingUnits);

      expect(result).toEqual({ toCreate: [], toUpdate: existingUnits });
    });

    it('should return the correct split of records to update', () => {
      const desiredUnits: PlayerUnits[] = [
        { unitType: 'citizen', quantity: 1 },
        { unitType: 'worker', quantity: 1 },
      ];
      const existingUnits: PlayerUnitsModel[] = [
        new PlayerUnitsModel({} as Context, {
          id: '',
          player_id: '',
          unit_type: 'citizen',
          quantity: 1,
        }),
      ];

      const result = splitUnitsToCreateAndUpdate(desiredUnits, existingUnits);

      expect(result).toEqual({
        toCreate: [{ unitType: 'worker', quantity: 1 }],
        toUpdate: [existingUnits[0]],
      });
    });
  });
});
