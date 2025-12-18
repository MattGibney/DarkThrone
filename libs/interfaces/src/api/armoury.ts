import {
  API_Error,
  AuthedPlayerObject,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  PlayerItemQuantity,
} from '..';

export type POST_armouryBuy = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      items: PlayerItemQuantity[];
    };
    Responses: {
      200: AuthedPlayerObject;
      400: API_Error<
        | 'armoury.buy.noItemsRequested'
        | 'armoury.buy.nonPositiveQuantity'
        | 'armoury.buy.invalidItem'
        | 'armoury.buy.insufficientGold'
        | 'armoury.buy.insufficientArmouryLevel'
      >;
    };
  }
>;

export type POST_armourySell = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      items: PlayerItemQuantity[];
    };
    Responses: {
      200: AuthedPlayerObject;
      400: API_Error<
        | 'armoury.sell.noItemsRequested'
        | 'armoury.sell.nonPositiveQuantity'
        | 'armoury.sell.invalidItem'
        | 'armoury.sell.notEnoughItems'
      >;
    };
  }
>;
