import {
  API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  PaginatedResponse,
  PlayerClass,
  PlayerNameValidation,
  PlayerNameValidationIssue,
  PlayerObject,
  PlayerRace,
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

export type POST_fetchAllMatchingIDs = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      playerIDs: string[];
    };
    Responses: {
      200: PlayerObject[];
    };
  }
>;

export type POST_validatePlayerName = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      displayName: string;
    };
    Responses: {
      200: PlayerNameValidation;
      400: API_Error<PlayerNameValidationIssue>;
    };
  }
>;

export type POST_createPlayer = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      displayName: string;
      selectedRace: PlayerRace;
      selectedClass: PlayerClass;
    };
    Responses: {
      201: PlayerObject;
      400: API_Error<PlayerNameValidationIssue>;
    };
  }
>;
