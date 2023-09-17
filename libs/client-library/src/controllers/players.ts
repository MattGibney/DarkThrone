import DarkThroneClient, { APIError, APIResponse, PlayerRace } from '..';

export interface PlayerObject {
  id: string;
  name: string;
  avatarURL?: string;
  race: PlayerRace;
  class: string;
  gold: number;
};

export interface AuthedPlayerObject extends PlayerObject {
  attackStrength: number;
  defenceStrength: number;
  attackTurns: number;
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

  async fetchByID(id: string): Promise<APIResponse<'ok', PlayerObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.get<PlayerObject>(`/players/${id}`);

      return { status: 'ok', data: response.data as PlayerObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async fetchAllMatchingIDs(playerIDs: string[]): Promise<APIResponse<'ok', PlayerObject[]> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.post<PlayerObject[]>('/players/matching-ids', { playerIDs });

      return { status: 'ok', data: response.data as PlayerObject[] };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async validatePlayerName(name: string): Promise<APIResponse<'ok', boolean> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.post<boolean>('/players/validate-name', { displayName: name });

      return { status: 'ok', data: response.data as boolean };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async create(name: string, selectedRace: string, selectedClass: string): Promise<APIResponse<'ok', PlayerObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.post<PlayerObject>('/players', {
        displayName: name,
        selectedRace: selectedRace,
        selectedClass: selectedClass,
      });

      return { status: 'ok', data: response.data as PlayerObject };
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
