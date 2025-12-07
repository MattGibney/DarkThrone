import { API_Error, EndpointDefinition, ValidAuthResponse } from '..';

export interface POST_login extends EndpointDefinition {
  RequestBody: {
    email: string;
    password: string;
    rememberMe?: boolean;
  };
  Responses: {
    200: ValidAuthResponse;
    400: API_Error<'auth.missingParams' | 'auth.invalidParams'>;
    401: API_Error<'auth.unauthorized'>;
    500: API_Error<'server.error'>;
  };
}
