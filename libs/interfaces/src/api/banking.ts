import {
  API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
} from '..';

export type POST_deposit = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      amount: number;
    };
    Responses: {
      200: { amount: number };
      400: API_Error<
        | 'banking.deposit.negativeAmount'
        | 'banking.deposit.exceedsMaxDeposit'
        | 'banking.deposit.maxDepositsReached'
      >;
    };
  }
>;

export type POST_withdraw = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      amount: number;
    };
    Responses: {
      200: { amount: number };
      400: API_Error<
        'banking.withdraw.negativeAmount' | 'banking.withdraw.insufficientFunds'
      >;
    };
  }
>;
