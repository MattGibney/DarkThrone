import axios, { AxiosInstance } from 'axios';
import AuthDAO from './daos/auth';
import PlayersDAO from './daos/players';
import AttackDAO from './daos/attack';
import WarHistoryController from './daos/warHistory';
import TrainingDAO from './daos/training';
import BankingDAO from './daos/banking';
import type {
  CurrentUserState,
  AuthedPlayerObject,
  UserSessionObject,
} from '@darkthrone/interfaces';
import StructuresDAO from './daos/structures';
import ArmouryDAO from './daos/armoury';

export type DarkThroneClientEventMap = {
  userLogin: [user: UserSessionObject];
  userLogout: [];
  updateCurrentUser: [state: CurrentUserState];
  playerChange: [state: CurrentUserState];
  playerUpdate: [];
};

type EventName = keyof DarkThroneClientEventMap;
type EventListener<Event extends EventName> = (
  ...args: DarkThroneClientEventMap[Event]
) => void;

export default class DarkThroneClient {
  public http: AxiosInstance;
  public events: Partial<{
    [Event in EventName]: EventListener<Event>[];
  }> = {};

  public authenticatedUser: UserSessionObject | undefined;
  public authenticatedPlayer: AuthedPlayerObject | undefined;

  public attack: AttackDAO;
  public auth: AuthDAO;
  public banking: BankingDAO;
  public players: PlayersDAO;
  public structures: StructuresDAO;
  public training: TrainingDAO;
  public warHistory: WarHistoryController;
  public armoury: ArmouryDAO;

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
    this.structures = new StructuresDAO(this);
    this.training = new TrainingDAO(this);
    this.warHistory = new WarHistoryController(this);
    this.armoury = new ArmouryDAO(this);

    const reFetchCurrentUser = async () => {
      try {
        await this.auth.getCurrentUser();
      } catch {
        // console.error('Error re-fetching current user on focus:', error);
      }
    };
    window.addEventListener('focus', function () {
      reFetchCurrentUser();
    });
  }

  on<Event extends EventName>(event: Event, listener: EventListener<Event>) {
    const eventListeners = this.events[event] as
      | EventListener<Event>[]
      | undefined;

    if (!eventListeners) {
      this.events[event] = [listener] as (typeof this.events)[Event];
      return;
    }

    eventListeners.push(listener);
  }

  off<Event extends EventName>(event: Event, listener: EventListener<Event>) {
    const eventListeners = this.events[event] as
      | EventListener<Event>[]
      | undefined;
    if (!eventListeners) return;

    this.events[event] = eventListeners.filter(
      (registeredListener) => registeredListener !== listener,
    ) as (typeof this.events)[Event];
  }

  emit<Event extends EventName>(
    event: Event,
    ...args: DarkThroneClientEventMap[Event]
  ) {
    const eventListeners = this.events[event] as
      | EventListener<Event>[]
      | undefined;
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(...args);
      });
    }
  }
}
