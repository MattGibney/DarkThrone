import { Request, Response } from 'express';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnitTypes } from '@darkthrone/game-data';

export interface EndpointDefinition {
  PathParams?: Record<string, string>;
  QueryParams?: Record<string, string | string[] | number | number[]>;
  RequestBody?: unknown;
  Responses: {
    500: API_Error<'server.error'>;
  };
}

// Extends EndpointDefinition to include standard authentication error responses
export interface AuthenticatedEndpointDefinition extends EndpointDefinition {
  Responses: EndpointDefinition['Responses'] & {
    401: API_Error<'auth.unauthorized'>;
    403: API_Error<'auth.forbidden'>;
  };
}

// Utility type to create a new EndpointDefinition by extending a base EndpointDefinition
// with custom RequestBody, Query, Params, and Responses.
type MergeResponses<
  Base extends Record<number, unknown>,
  Extension extends Record<number, unknown>,
> = Omit<Base, keyof Extension> & Extension;

export type ExtendEndpointDefinition<
  Base extends EndpointDefinition,
  Extension extends Partial<{
    RequestBody: object;
    QueryParams: object;
    PathParams: object;
    Responses: { [status: number]: unknown };
  }>,
> = Omit<Base, keyof Extension> & {
  [K in keyof Extension]: Extension[K] extends undefined
    ? K extends keyof Base
      ? Base[K]
      : never
    : K extends 'Responses'
      ? Extension[K] extends Record<number, unknown>
        ? MergeResponses<Base['Responses'], Extension[K]>
        : Base['Responses']
      : Extension[K];
};

export type TypedRequest<Def extends EndpointDefinition> = Request<
  Def['PathParams'],
  unknown,
  Def['RequestBody'],
  Def['QueryParams']
>;

type StatusCodesFor<Def extends EndpointDefinition> = Extract<
  keyof Def['Responses'],
  number
>;

type TypedStatusFn<Def extends EndpointDefinition> = <
  S extends StatusCodesFor<Def>,
>(
  status: S,
) => TypedResponseWithStatus<Def, S>;

export type TypedResponse<Def extends EndpointDefinition> = Omit<
  Response,
  'status' | 'json' | 'send' | 'sendStatus'
> & {
  status: TypedStatusFn<Def>;
  sendStatus: <S extends StatusCodesFor<Def>>(
    status: S,
  ) => TypedResponseWithStatus<Def, S>;
};

type TypedResponseWithStatus<
  Def extends EndpointDefinition,
  S extends StatusCodesFor<Def>,
> = Omit<
  Response<Def['Responses'][S]>,
  'status' | 'json' | 'send' | 'sendStatus'
> & {
  status: TypedStatusFn<Def>;
  sendStatus: <Next extends StatusCodesFor<Def>>(
    status: Next,
  ) => TypedResponseWithStatus<Def, Next>;
  json: (body: Def['Responses'][S]) => Response<Def['Responses'][S]>;
  send: (body: Def['Responses'][S]) => Response<Def['Responses'][S]>;
};

export type API_Error<T extends string> = {
  errors: T[];
};

export type PaginatedResponse<T> = {
  items: T[];
  meta: {
    totalItemCount: number;
    totalPageCount: number;
    page: number;
    pageSize: number;
  };
};

export type ExtractErrorCodesForStatuses<
  T extends { Responses: Record<number, unknown> },
  Statuses extends keyof T['Responses'] = keyof T['Responses'],
> = Statuses extends keyof T['Responses']
  ? T['Responses'][Statuses] extends API_Error<infer E>
    ? E
    : never
  : never;

export * from './api/attack';
export * from './api/auth';
export * from './api/banking';
export * from './api/player';
export * from './api/structures';
export * from './api/training';
export * from './api/warHistory';

export enum UnitType {
  SUPPORT = 'support',
  OFFENCE = 'offence',
  DEFENCE = 'defence',
}

export enum CombatUnitType {
  OFFENCE = UnitType.OFFENCE,
  DEFENCE = UnitType.DEFENCE,
}

export type Unit = {
  attack: number;
  defence: number;
  cost: number;
  goldPerTurn: number;
  canTrain: boolean;
  canUntrain: boolean;
  name: string;
  type: UnitType;
};

export type PlayerRace = 'human' | 'elf' | 'goblin' | 'undead';
export type PlayerClass = 'fighter' | 'cleric' | 'thief' | 'assassin';

export interface PlayerObject {
  id: string;
  name: string;
  avatarURL?: string;
  race: PlayerRace;
  class: PlayerClass;
  gold: number;
  level: number;
  overallRank: number;
  armySize: number;
}

export interface AuthedPlayerObject extends PlayerObject {
  attackStrength: number;
  defenceStrength: number;
  experience: number;
  attackTurns: number;
  goldInBank: number;
  citizensPerDay: number;
  depositHistory: DepositHistory[];
  units: PlayerUnits[];
  structureUpgrades: {
    fortification: number;
    housing: number;
    armoury: number;
  };
  goldPerTurn: number;
}

export interface DepositHistory {
  amount: number;
  date: Date;
  type: 'deposit' | 'withdraw';
}

export interface PlayerUnits {
  unitType: keyof typeof UnitTypes;
  quantity: number;
}

export type UserSessionObject = {
  id: string;
  email: string;
  playerID?: string;
  hasConfirmedEmail: boolean;
  serverTime: string;
};

export type PlayerNameValidationIssue =
  | 'player.name.validation.taken'
  | 'player.name.validation.invalidCharacters'
  | 'player.name.validation.tooShort'
  | 'player.name.validation.tooLong'
  | 'player.name.validation.empty';
export type PlayerNameValidation = {
  isValid: boolean;
  issues: PlayerNameValidationIssue[];
};

export type NewsPost = {
  title: string;
  content: string;
  date: Date;
};

export type ValidAuthResponse = {
  session: UserSessionObject;
  token: string;
};

export type StructureUpgrade = {
  name: string;
  cost: number;
  requiredFortificationLevel: number;
};

export type FortificationUpgrade = StructureUpgrade & {
  type: 'fortification';
  defenceBonusPercentage: number;
  goldPerTurn: number;
  levelRequirement: number;
};

export type HousingUpgrade = StructureUpgrade & {
  type: 'housing';
  citizensPerDay: number;
};

export type ArmouryUpgrade = StructureUpgrade & {
  type: 'armoury';
};

export type WarHistoryObject = {
  id: string;
  attackerID: string;
  defenderID: string;
  isAttackerVictor: boolean;
  attackTurnsUsed: number;
  attackerStrength: number;
  defenderStrength?: number;
  goldStolen: number;
  createdAt: Date;
};

export type StructureUpgradeType = 'fortification' | 'housing' | 'armoury';

export type UnitItemType =
  | 'weapon'
  | 'helm'
  | 'armor'
  | 'boots'
  | 'bracers'
  | 'shield';

export type UnitItem = {
  key: string;
  unitType: CombatUnitType;
  itemType: UnitItemType;
  buyCost: number;
  sellCost: number;
  bonuses: {
    offence?: number;
    defence?: number;
  };
  requirements: {
    armouryLevel: number;
  };
};
