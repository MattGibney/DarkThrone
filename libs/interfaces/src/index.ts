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
    Query: object;
    Params: object;
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

type ErrorStatuses<T extends Record<number, unknown>> = Extract<
  {
    [K in keyof T]: K extends number
      ? `${K}` extends `${'3' | '4' | '5'}${number}${number}`
        ? K
        : never
      : never;
  }[keyof T],
  number
>;

export type ExtractErrorCodesForStatuses<T extends Record<number, unknown>> =
  ErrorStatuses<T> extends infer S
    ? S extends keyof T
      ? T[S] extends API_Error<infer E>
        ? E
        : never
      : never
    : never;

export * from './api/auth';

export enum UnitType {
  SUPPORT = 'support',
  OFFENSE = 'offense',
  DEFENSE = 'defense',
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

export type PlayerNameValidation = {
  isValid: boolean;
  issues: string[];
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
