import { POST_deposit, POST_withdraw } from '@darkthrone/interfaces';
import DarkThroneClient from '..';
import axios from 'axios';

export default class BankingDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async deposit(amount: number): Promise<{ amount: number }> {
    try {
      const depositRequestBody: POST_deposit['RequestBody'] = { amount };
      const depositResponse = await this.root.http.post<{ amount: number }>(
        '/bank/deposit',
        depositRequestBody,
      );

      this.root.emit('playerUpdate');

      return depositResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }

  async withdraw(amount: number): Promise<{ amount: number }> {
    try {
      const withdrawRequestBody: POST_withdraw['RequestBody'] = { amount };
      const withdrawResponse = await this.root.http.post<{ amount: number }>(
        '/bank/withdraw',
        withdrawRequestBody,
      );

      this.root.emit('playerUpdate');

      return withdrawResponse.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw new Error('server.error');
    }
  }
}
