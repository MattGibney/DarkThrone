import {
  API_Error,
  AuthedPlayerObject,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  PlayerUnits,
} from '..';

export type POST_trainUnits = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      desiredUnits: PlayerUnits[];
    };
    Responses: {
      200: AuthedPlayerObject;
      400: API_Error<
        | 'training.train.noUnitsRequested'
        | 'training.train.nonPositiveUnitsRequested'
        | 'training.train.notEnoughCitizens'
        | 'training.train.notEnoughGold'
      >;
    };
  }
>;

export type POST_unTrainUnits = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      unitsToUnTrain: PlayerUnits[];
    };
    Responses: {
      200: AuthedPlayerObject;
      400: API_Error<
        | 'training.untrain.noUnitsRequested'
        | 'training.untrain.nonPositiveUnitsRequested'
        | 'training.untrain.notEnoughUnitsTrained'
        | 'training.untrain.insufficientGold'
      >;
    };
  }
>;
