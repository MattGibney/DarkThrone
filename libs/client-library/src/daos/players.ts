import axios from 'axios';
import DarkThroneClient from '..';
import type {
  GET_fetchAllPlayers,
  GET_fetchPlayerByID,
  GET_fetchPlayersForUser,
  PaginatedResponse,
  PlayerClass,
  PlayerNameValidation,
  PlayerObject,
  PlayerRace,
  POST_createPlayer,
  POST_fetchAllMatchingIDs,
  POST_validatePlayerName,
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

  async fetchAllMatchingIDs(playerIDs: string[]): Promise<PlayerObject[]> {
    try {
      const requestBody: POST_fetchAllMatchingIDs['RequestBody'] = {
        playerIDs,
      };
      const response = await this.root.http.post<
        POST_fetchAllMatchingIDs['Responses'][200]
      >('/players/matching-ids', requestBody);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async validatePlayerName(name: string): Promise<PlayerNameValidation> {
    try {
      const requestBody: POST_validatePlayerName['RequestBody'] = {
        displayName: name,
      };
      const response = await this.root.http.post<
        POST_validatePlayerName['Responses'][200]
      >('/players/validate-name', requestBody);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async create(
    name: string,
    selectedRace: PlayerRace,
    selectedClass: PlayerClass,
  ): Promise<PlayerObject> {
    try {
      const requestBody: POST_createPlayer['RequestBody'] = {
        displayName: name,
        selectedRace: selectedRace,
        selectedClass: selectedClass,
      };
      const response = await this.root.http.post<
        POST_createPlayer['Responses'][201]
      >('/players', requestBody);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
