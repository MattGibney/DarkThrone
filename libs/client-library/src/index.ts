import axios, { AxiosInstance } from 'axios';
import AuthController, { UserSessionObject } from './controllers/auth';
import PlayersController, { AuthedPlayerObject, PlayerObject } from './controllers/players';
import AttackController from './controllers/attack';
import WarHistoryController, { WarHistoryObject } from './controllers/warHistory';

export type APIError = {
  code: string;
  title: string;
  detail?: string;
};

export type APIResponse<S, T> = {
  status: S;
  data: T;
}

type PlayerRace = 'human' | 'elf' | 'goblin' | 'undead';

type EventListener = (...args: any[]) => void;

export default class DarkThroneClient {
  public http: AxiosInstance;
  public events: { [event: string]: EventListener[] } = {};

  public authenticatedUser: UserSessionObject | undefined;
  public authenticatedPlayer: AuthedPlayerObject | undefined;

  public attack: AttackController;
  public auth: AuthController;
  public players: PlayersController;
  public warHistory: WarHistoryController;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
    });

    this.attack = new AttackController(this);
    this.auth = new AuthController(this);
    this.players = new PlayersController(this);
    this.warHistory = new WarHistoryController(this);
  }

  on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: any[]) {
    const eventListeners = this.events[event];
    if (eventListeners) {
      eventListeners.forEach(listener => {
        listener(...args);
      });
    }
  }
}

export type { WarHistoryObject, AuthedPlayerObject, PlayerObject, UserSessionObject, PlayerRace }
