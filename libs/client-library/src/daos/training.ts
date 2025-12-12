import axios from 'axios';
import DarkThroneClient from '..';
import type {
  AuthedPlayerObject,
  PlayerUnits,
  POST_trainUnits,
  POST_unTrainUnits,
} from '@darkthrone/interfaces';

export default class TrainingDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async trainUnits(desiredUnits: PlayerUnits[]): Promise<AuthedPlayerObject> {
    try {
      const requestBody: POST_trainUnits['RequestBody'] = {
        desiredUnits,
      };
      const response = await this.root.http.post<
        POST_trainUnits['Responses'][200]
      >('/training/train', requestBody);

      // TODO: Push the data through to avoid an extra fetch.
      this.root.emit('playerUpdate');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async unTrainUnits(desiredUnits: PlayerUnits[]): Promise<AuthedPlayerObject> {
    try {
      const requestBody: POST_unTrainUnits['RequestBody'] = {
        unitsToUnTrain: desiredUnits,
      };
      const response = await this.root.http.post<
        POST_unTrainUnits['Responses'][200]
      >('/training/untrain', requestBody);

      this.root.emit('playerUpdate');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
