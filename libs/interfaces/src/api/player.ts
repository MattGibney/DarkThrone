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
    QueryParams: {
      page: string;
      pageSize?: string;
    };
    Responses: {
      200: PaginatedResponse<PlayerObject>;
    };
  }
>;

export type GET_fetchPlayersForUser = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      200: PlayerObject[];
    };
  }
>;

export type GET_fetchPlayerByID = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    PathParams: {
      id: string;
    };
    Responses: {
      200: PlayerObject;
      404: { errors: ['player.fetchByID.notFound'] };
    };
  }
>;
