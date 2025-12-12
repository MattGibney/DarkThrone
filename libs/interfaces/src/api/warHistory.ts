import {
  API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  WarHistoryObject,
} from '..';

export type GET_fetchWarHistoryByID = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    PathParams: {
      id: string;
    };
    Responses: {
      200: WarHistoryObject;
      400: API_Error<'warHistory.fetchByID.invalidID'>;
      404: API_Error<'warHistory.fetchByID.notFound'>;
    };
  }
>;

export type GET_fetchAllWarHistory = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      200: WarHistoryObject[];
    };
  }
>;
