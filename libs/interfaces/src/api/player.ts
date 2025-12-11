import {
  // API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  PaginatedResponse,
  PlayerObject,
} from '..';

export type GET_fetchAllPlayers = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      200: PaginatedResponse<PlayerObject>;
    };
  }
>;
