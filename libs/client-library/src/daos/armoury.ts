import axios from 'axios';
import DarkThroneClient from '..';
import type {
  AuthedPlayerObject,
  PlayerItemQuantity,
  POST_armouryBuy,
  POST_armourySell,
} from '@darkthrone/interfaces';

export default class ArmouryDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async buy(items: PlayerItemQuantity[]): Promise<AuthedPlayerObject> {
    try {
      const requestBody: POST_armouryBuy['RequestBody'] = { items };
      const response = await this.root.http.post<
        POST_armouryBuy['Responses'][200]
      >('/armoury/buy', requestBody);

      this.root.emit('playerUpdate');

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async sell(items: PlayerItemQuantity[]): Promise<AuthedPlayerObject> {
    try {
      const requestBody: POST_armourySell['RequestBody'] = { items };
      const response = await this.root.http.post<
        POST_armourySell['Responses'][200]
      >('/armoury/sell', requestBody);

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
