import axios, { AxiosInstance } from 'axios';

export type UserSessionObject = {
  id: string;
  email: string;
  playerID: string;
  hasConfirmedEmail: boolean;
};

export type APIError = {
  code: string;
  title: string;
  detail?: string;
};

type APIResponse<S, T> = {
  status: S;
  data: T;
}

type EventListener = (...args: any[]) => void;

export default class DarkThroneClient {
  private http: AxiosInstance;
  private events: { [event: string]: EventListener[] } = {};

  public authenticatedUser: UserSessionObject | undefined;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
    });
  }

  async getCurrentUser(): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.http.get<UserSessionObject>('/auth/current-user');

      this.authenticatedUser = response.data;

      return { status: 'ok', data: response.data as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.http.post<UserSessionObject>(
        '/auth/login',
        { email, password, rememberMe }
      );

      this.authenticatedUser = response.data;

      return { status: 'ok', data: response.data as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async register(email: string, password: string): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.http.post<UserSessionObject>(
        '/auth/register',
        { email, password }
      );

      this.authenticatedUser = response.data;

      return { status: 'ok', data: response.data as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async logout(): Promise<APIResponse<'ok', null> | APIResponse<'fail', APIError[]>> {
    try {
      await this.http.post('/auth/logout');

      this.authenticatedUser = undefined;
      this.emit('userLogout');

      return { status: 'ok', data: null };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
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
