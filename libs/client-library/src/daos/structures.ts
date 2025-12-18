import axios from 'axios';
import DarkThroneClient from '..';
import {
  POST_upgradeStructure,
  StructureUpgradeType,
} from '@darkthrone/interfaces';

export default class StructuresDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async upgrade(
    structureType: StructureUpgradeType,
  ): Promise<{ status: 'success' }> {
    try {
      const requestBody: POST_upgradeStructure['RequestBody'] = {
        structureType,
      };
      const depositResponse = await this.root.http.post<
        POST_upgradeStructure['Responses'][200]
      >('/structures/upgrade', requestBody);

      this.root.emit('playerUpdate');

      return depositResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
