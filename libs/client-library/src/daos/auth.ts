import axios from 'axios';
import {
  AuthedPlayerObject,
  PlayerObject,
  POST_login,
  POST_register,
  UserSessionObject,
} from '@darkthrone/interfaces';
import DarkThroneClient, { APIError, APIResponse } from '..';

export default class AuthDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async login(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<UserSessionObject> {
    try {
      const requestBody: POST_login['RequestBody'] = {
        email,
        password,
        rememberMe,
      };
      const response = await this.root.http.post<POST_login['Responses'][200]>(
        '/auth/login',
        requestBody,
      );

      this.root.emit('userLogin', response.data);

      /* TODO: Refactor this, the DAO shouldn't be changing root HTTP headers,
       * or setting local storage values.
       *
       * The client should likely want to subscribe to the login event and
       * handle it that way.
       */
      this.root.authenticatedUser = response.data.session;
      localStorage.setItem('token', response.data.token);
      this.root.http.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      return response.data.session;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('An unknown error occurred during login.');
    }
  }

  async register(email: string, password: string): Promise<UserSessionObject> {
    try {
      const requestBody: POST_register['RequestBody'] = {
        email,
        password,
      };
      const response = await this.root.http.post<
        POST_register['Responses'][201]
      >('/auth/register', requestBody);

      this.root.emit('userLogin', response.data);

      /* TODO: Refactor this, the DAO shouldn't be changing root HTTP headers,
       * or setting local storage values.
       *
       * The client should likely want to subscribe to the login event and
       * handle it that way.
       */
      this.root.authenticatedUser = response.data.session;
      localStorage.setItem('token', response.data.token);
      this.root.http.defaults.headers.Authorization = `Bearer ${response.data.token}`;

      return response.data.session;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('An unknown error occurred during registration.');
    }
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
