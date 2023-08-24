import DarkThroneClient, { APIError, APIResponse, UserSessionObject } from '..';

export type PlayerObject = {
  id: string;
  name: string;
  avatarURL?: string;
  race: string;
  class: string;
};

export default class PlayersController {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async fetchAllPlayers(): Promise<APIResponse<'ok', PlayerObject[]> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.get<PlayerObject[]>('/players');

      return { status: 'ok', data: response.data as PlayerObject[] };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  // async getCurrentUser(): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
  //   try {
  //     const response = await this.root.http.get<UserSessionObject>('/auth/current-user');

  //     this.root.authenticatedUser = response.data;

  //     return { status: 'ok', data: response.data as UserSessionObject };
  //   } catch (err: unknown) {
  //     const axiosError = err as { response: { data: { errors: APIError[] } } };
  //     return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
  //   }
  // }

  // async login(email: string, password: string, rememberMe: boolean): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
  //   try {
  //     const response = await this.root.http.post<UserSessionObject>(
  //       '/auth/login',
  //       { email, password, rememberMe }
  //     );

  //     this.root.authenticatedUser = response.data;

  //     return { status: 'ok', data: response.data as UserSessionObject };
  //   } catch (err: unknown) {
  //     const axiosError = err as { response: { data: { errors: APIError[] } } };
  //     return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
  //   }
  // }

  // async register(email: string, password: string): Promise<APIResponse<'ok', UserSessionObject> | APIResponse<'fail', APIError[]>> {
  //   try {
  //     const response = await this.root.http.post<UserSessionObject>(
  //       '/auth/register',
  //       { email, password }
  //     );

  //     this.root.authenticatedUser = response.data;

  //     return { status: 'ok', data: response.data as UserSessionObject };
  //   } catch (err: unknown) {
  //     const axiosError = err as { response: { data: { errors: APIError[] } } };
  //     return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
  //   }
  // }

  // async logout(): Promise<APIResponse<'ok', null> | APIResponse<'fail', APIError[]>> {
  //   try {
  //     await this.root.http.post('/auth/logout');

  //     this.root.authenticatedUser = undefined;
  //     this.root.emit('userLogout');

  //     return { status: 'ok', data: null };
  //   } catch (err: unknown) {
  //     const axiosError = err as { response: { data: { errors: APIError[] } } };
  //     return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
  //   }
  // }
}
