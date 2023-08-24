import axios, { AxiosInstance } from 'axios';
import AuthController, { UserSessionObject } from './controllers/auth';
import PlayersController, { PlayerObject } from './controllers/players';

export type APIError = {
  code: string;
  title: string;
  detail?: string;
};

export type APIResponse<S, T> = {
  status: S;
  data: T;
}

type EventListener = (...args: any[]) => void;

export default class DarkThroneClient {
  public http: AxiosInstance;
  public events: { [event: string]: EventListener[] } = {};

  public authenticatedUser: UserSessionObject | undefined;

  public auth: AuthController;
  public players: PlayersController;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
    });

    this.auth = new AuthController(this);
    this.players = new PlayersController(this);
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

export type { PlayerObject, UserSessionObject }
