import axios, { AxiosInstance } from 'axios';
import AuthDAO from './daos/auth';
import PlayersDAO from './daos/players';
import AttackDAO from './daos/attack';
import WarHistoryController, { WarHistoryObject } from './daos/warHistory';
import TrainingDAO from './daos/training';
import BankingDAO from './daos/banking';
import type {
  AuthedPlayerObject,
  UserSessionObject,
} from '@darkthrone/interfaces';

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

  public attack: AttackDAO;
  public auth: AuthDAO;
  public banking: BankingDAO;
  public players: PlayersDAO;
  public training: TrainingDAO;
  public warHistory: WarHistoryController;

  public serverTime: Date | undefined;

  constructor(apiUrl: string) {
    this.http = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    this.attack = new AttackDAO(this);
    this.auth = new AuthDAO(this);
    this.banking = new BankingDAO(this);
    this.players = new PlayersDAO(this);
    this.training = new TrainingDAO(this);
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
