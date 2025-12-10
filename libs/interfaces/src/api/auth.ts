import {
  API_Error,
  AuthedPlayerObject,
  AuthenticatedEndpointDefinition,
  EndpointDefinition,
  ExtendEndpointDefinition,
  UserSessionObject,
  ValidAuthResponse,
} from '..';

export type POST_login = ExtendEndpointDefinition<
  EndpointDefinition,
  {
    RequestBody: {
      email: string;
      password: string;
      rememberMe?: boolean;
    };
    Responses: {
      200: ValidAuthResponse;
      400: API_Error<'auth.login.missingParams' | 'auth.login.invalidParams'>;
    };
  }
>;

export type POST_register = ExtendEndpointDefinition<
  EndpointDefinition,
  {
    RequestBody: {
      email: string;
      password: string;
    };
    Responses: {
      201: ValidAuthResponse;
      400: API_Error<
        | 'auth.register.missingParams'
        | 'auth.register.invalidParams'
        | 'auth.register.emailInUse'
        | 'auth.register.invalidPassword'
      >;
    };
  }
>;

export type GET_currentUser = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      200: {
        user: UserSessionObject;
        player: AuthedPlayerObject | undefined;
      };
    };
  }
>;

export type POST_logout = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      204: null;
    };
  }
>;

export type POST_assumePlayer = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      playerID: string;
    };
    Responses: {
      200: {
        user: UserSessionObject;
        player: AuthedPlayerObject;
      };
      400: API_Error<'auth.assumePlayer.missingParams'>;
      403: API_Error<'auth.assumePlayer.notAllowed'>;
      404: API_Error<'auth.assumePlayer.notFound'>;
    };
  }
>;

export type POST_unassumePlayer = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    Responses: {
      200: {
        user: UserSessionObject;
        player: null;
      };
    };
  }
>;
