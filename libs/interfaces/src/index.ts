export type UnitType = {
  attack: number;
  defence: number;
  cost: number;
  goldPerTurn: number;
  canTrain: boolean;
  canUntrain: boolean;
};

export type PlayerRace = 'human' | 'elf' | 'goblin' | 'undead';

export interface PlayerObject {
  id: string;
  name: string;
  avatarURL?: string;
  race: PlayerRace;
  class: string;
  gold: number;
};

export interface AuthedPlayerObject extends PlayerObject {
  attackStrength: number;
  defenceStrength: number;
  attackTurns: number;
};

export type UserSessionObject = {
  id: string;
  email: string;
  playerID?: string;
  hasConfirmedEmail: boolean;
};
