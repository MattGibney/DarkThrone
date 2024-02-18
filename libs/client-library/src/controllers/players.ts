import DarkThroneClient, { APIError, APIResponse } from '..';
import type { PlayerObject } from '@darkthrone/interfaces';

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
}
