import axios from 'axios';
import DarkThroneClient, { APIError, APIResponse } from '..';
import type {
  GET_fetchAllPlayers,
  GET_fetchPlayerByID,
  GET_fetchPlayersForUser,
  PaginatedResponse,
  PlayerNameValidation,
  PlayerObject,
} from '@darkthrone/interfaces';

export default class PlayersDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async fetchAllPlayers(
    page: number,
    pageSize?: number,
  ): Promise<PaginatedResponse<PlayerObject>> {
    try {
      if (!pageSize) pageSize = 100;

      // TODO: Use a URL constructor to enfore type safety?
      const response = await this.root.http.get<
        GET_fetchAllPlayers['Responses'][200]
      >(`/players?page=${page}&pageSize=${pageSize}`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async fetchAllPlayersForUser(): Promise<PlayerObject[]> {
    try {
      const response = await this.root.http.get<
        GET_fetchPlayersForUser['Responses'][200]
      >('/auth/current-user/players');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async fetchByID(id: string): Promise<PlayerObject> {
    try {
      const response = await this.root.http.get<
        GET_fetchPlayerByID['Responses'][200]
      >(`/players/${id}`);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async fetchAllMatchingIDs(
    playerIDs: string[],
  ): Promise<
    APIResponse<'ok', PlayerObject[]> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<PlayerObject[]>(
        '/players/matching-ids',
        { playerIDs },
      );

      return { status: 'ok', data: response.data as PlayerObject[] };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async validatePlayerName(
    name: string,
  ): Promise<
    APIResponse<'ok', PlayerNameValidation> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<PlayerNameValidation>(
        '/players/validate-name',
        { displayName: name },
      );

      return { status: 'ok', data: response.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async create(
    name: string,
    selectedRace: string,
    selectedClass: string,
  ): Promise<
    APIResponse<'ok', PlayerObject> | APIResponse<'fail', APIError[]>
  > {
    try {
      const response = await this.root.http.post<PlayerObject>('/players', {
        displayName: name,
        selectedRace: selectedRace,
        selectedClass: selectedClass,
      });

      return { status: 'ok', data: response.data as PlayerObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }
}
