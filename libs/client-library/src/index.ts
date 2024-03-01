import axios, { AxiosInstance } from 'axios';
import AuthController from './controllers/auth';
import PlayersController from './controllers/players';
import AttackController from './controllers/attack';
import WarHistoryController, {
  WarHistoryObject,
} from './controllers/warHistory';
import type {
  AuthedPlayerObject,
  UserSessionObject,
} from '@darkthrone/interfaces';
import TrainingController from './controllers/training';

export type APIError = {
  code: string;
  title: string;
  detail?: string;
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

export type APIResponse<S, T> = {
  status: S;
  data: T;
};

type EventListener = (...args: unknown[]) => void;

export default class DarkThroneClient {
  public http: AxiosInstance;
  public events: { [event: string]: EventListener[] } = {};

  public authenticatedUser: UserSessionObject | undefined;
  public authenticatedPlayer: AuthedPlayerObject | undefined;

  public attack: AttackController;
  public auth: AuthController;
  public players: PlayersController;
  public training: TrainingController;
  public warHistory: WarHistoryController;

  public serverTime: Date | undefined;

  constructor(apiUrl: string) {
    this.http = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
    });

    this.attack = new AttackController(this);
    this.auth = new AuthController(this);
    this.players = new PlayersController(this);
    this.training = new TrainingController(this);
    this.warHistory = new WarHistoryController(this);

    const reFetchCurrentUser = async () => {
      await this.auth.getCurrentUser();
    };
    window.addEventListener('focus', function () {
      reFetchCurrentUser();
    });
  }

  on(event: string, listener: EventListener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, ...args: unknown[]) {
    const eventListeners = this.events[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
}

export type { WarHistoryObject };
