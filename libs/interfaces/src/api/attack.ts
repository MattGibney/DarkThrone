import {
  API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  WarHistoryObject,
} from '..';

export type POST_attackPlayer = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      targetID: string;
      attackTurns: number;
    };
    Responses: {
      200: WarHistoryObject;
      400: API_Error<
        | 'attack.missingProps'
        | 'attack.invalidAttackTurns'
        | 'attack.notEnoughAttackTurns'
        | 'attack.noAttackStrength'
        | 'attack.outsideRange'
      >;
      404: API_Error<'attack.targetNotFound'>;
    };
  }
>;
