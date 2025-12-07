import {
  API_Error,
  EndpointDefinition,
  ExtractErrorCodesForStatuses,
  ValidAuthResponse,
} from '..';

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

export type POST_register_ErrorCodes = ExtractErrorCodesForStatuses<
  POST_register['Responses'],
  400
>;
export interface POST_register extends EndpointDefinition {
  RequestBody: {
    email: string;
    password: string;
  };
  Responses: {
    201: ValidAuthResponse;
    400: API_Error<
      | 'auth.missingParams'
      | 'auth.invalidParams'
      | 'auth.emailInUse'
      | 'auth.invalidPassword'
    >;
    500: API_Error<'server.error'>;
  };
}
