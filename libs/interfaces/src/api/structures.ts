import {
  API_Error,
  AuthenticatedEndpointDefinition,
  ExtendEndpointDefinition,
  StructureUpgradeType,
} from '..';

export type POST_upgradeStructure = ExtendEndpointDefinition<
  AuthenticatedEndpointDefinition,
  {
    RequestBody: {
      structureType: StructureUpgradeType;
    };
    Responses: {
      200: { status: 'success' };
      400: API_Error<
        | 'structure.upgrade.notFound'
        | 'structure.upgrade.notEnoughGold'
        | 'structure.upgrade.levelRequirementNotMet'
        | 'structure.upgrade.fortificationRequirementNotMet'
      >;
    };
  }
>;
