import {
  GET_fetchAllWarHistory,
  GET_fetchWarHistoryByID,
  WarHistoryObject,
} from '@darkthrone/interfaces';
import DarkThroneClient from '..';
import axios from 'axios';

export default class AttackDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async fetchByID(id: string): Promise<WarHistoryObject> {
    try {
      const attackResponse = await this.root.http.get<
        GET_fetchWarHistoryByID['Responses'][200]
      >(`/war-history/${id}`);

      return attackResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async fetchAll(): Promise<WarHistoryObject[]> {
    try {
      const attackResponse =
        await this.root.http.get<GET_fetchAllWarHistory['Responses'][200]>(
          '/war-history',
        );

      return attackResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
