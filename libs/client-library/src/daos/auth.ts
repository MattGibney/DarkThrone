import axios from 'axios';
import {
  GET_currentUser,
  POST_assumePlayer,
  POST_login,
  POST_logout,
  POST_register,
  POST_unassumePlayer,
  UserSessionObject,
} from '@darkthrone/interfaces';
import DarkThroneClient from '..';

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
      throw new Error('server.error');
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
      throw new Error('server.error');
    }
  }

  async getCurrentUser(): Promise<UserSessionObject> {
    try {
      const response =
        await this.root.http.get<GET_currentUser['Responses'][200]>(
          '/auth/current-user',
        );

      this.root.serverTime = new Date(response.data.user.serverTime);
      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = response.data.player;
      this.root.emit('updateCurrentUser');

      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async logout(): Promise<null> {
    try {
      await this.root.http.post<POST_logout['Responses'][204]>('/auth/logout');

      this.root.authenticatedUser = undefined;
      this.root.emit('userLogout');

      localStorage.removeItem('token');

      return null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async assumePlayer(playerID: string): Promise<UserSessionObject> {
    try {
      const assumePlayerRequestBody: POST_assumePlayer['RequestBody'] = {
        playerID,
      };
      const response = await this.root.http.post<
        POST_assumePlayer['Responses'][200]
      >('/auth/assume-player', assumePlayerRequestBody);

      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = response.data.player;
      this.root.emit('playerChange', response.data.user);

      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async unassumePlayer(): Promise<UserSessionObject> {
    try {
      const response = await this.root.http.post<
        POST_unassumePlayer['Responses'][200]
      >('/auth/unassume-player');

      this.root.authenticatedUser = response.data.user;
      this.root.authenticatedPlayer = undefined;
      this.root.emit('playerChange', response.data.user);

      return response.data.user;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
