import { POST_attackPlayer, WarHistoryObject } from '@darkthrone/interfaces';
import DarkThroneClient from '..';
import axios from 'axios';

export default class AttackDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async attackPlayer(
    targetID: string,
    attackTurns: number,
  ): Promise<WarHistoryObject> {
    try {
      const requestBody: POST_attackPlayer['RequestBody'] = {
        targetID,
        attackTurns,
      };
      const attackResponse = await this.root.http.post<
        POST_attackPlayer['Responses'][200]
      >('/attack', requestBody);

      return attackResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
