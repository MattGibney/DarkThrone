import {
  AuthedPlayerObject,
  PlayerObject,
  UserSessionObject,
  ValidAuthResponse,
} from '@darkthrone/interfaces';
import DarkThroneClient, { APIError, APIResponse } from '..';

export default class AuthDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async getCurrentUser(): Promise<
    APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.get<{
        user: UserSessionObject;
        player?: AuthedPlayerObject;
      }>('/auth/current-user');

      this.root.serverTime = new Date(response.data.user.serverTime);
      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = response.data.player;
      this.root.emit('updateCurrentUser');

      return { status: 'ok', data: response.data.user as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<
    APIResponse<'ok', ValidAuthResponse> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<ValidAuthResponse>(
        '/auth/login',
        { email, password, rememberMe },
      );

      this.root.emit('userLogin', response.data);
      this.root.authenticatedUser = response.data.session;

      localStorage.setItem('token', response.data.token);
      this.root.http.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      return { status: 'ok', data: response.data as ValidAuthResponse };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async register(
    email: string,
    password: string,
  ): Promise<
    APIResponse<'ok', ValidAuthResponse> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<ValidAuthResponse>(
        '/auth/register',
        { email, password },
      );

      this.root.emit('userLogin', response.data);
      this.root.authenticatedUser = response.data.session;

      localStorage.setItem('token', response.data.token);
      this.root.http.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      return { status: 'ok', data: response.data as ValidAuthResponse };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async logout(): Promise<
    APIResponse<'ok', null> | APIResponse<'fail', APIError[]>
  > {
    try {
      await this.root.http.post('/auth/logout');

      this.root.authenticatedUser = undefined;
      this.root.emit('userLogout');

      localStorage.removeItem('token');

      return { status: 'ok', data: null };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async assumePlayer(
    playerID: string,
  ): Promise<
    APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<{
        user: UserSessionObject;
        player: AuthedPlayerObject;
      }>('/auth/assume-player', { playerID });

      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = response.data.player;
      this.root.emit('playerChange', response.data.user);

      return { status: 'ok', data: response.data.user as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async unassumePlayer(): Promise<
    APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<{
        user: UserSessionObject;
        player: PlayerObject;
      }>('/auth/unassume-player');

      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = undefined;
      this.root.emit('playerChange', response.data.user);

      return { status: 'ok', data: response.data.user as UserSessionObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }
}
