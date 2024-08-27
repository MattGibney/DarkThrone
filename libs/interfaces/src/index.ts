// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnitTypes } from '@darkthrone/game-data';

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
  depositHistory: DepositHistory[];
  units: PlayerUnits[];
  structureUpgrades: {
    fortification: number;
    economy: number;
    armory: number;
    housing: number;
  };
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

export type FortificationUpgrade = {
  name: string;
  level: number;
};
