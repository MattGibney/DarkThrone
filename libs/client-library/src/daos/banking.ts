import DarkThroneClient, { APIError, APIResponse } from '..';
// import { WarHistoryObject } from './warHistory';

export default class BankingDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async deposit(
    amount: number,
  ): Promise<
    APIResponse<'ok', { amount: number }> | APIResponse<'fail', APIError[]>
  > {
    try {
      const depositResponse = await this.root.http.post<{ amount: number }>(
        '/bank/deposit',
        { amount },
      );

      this.root.emit('playerUpdate');

      return { status: 'ok', data: depositResponse.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async withdraw(
    amount: number,
  ): Promise<
    APIResponse<'ok', { amount: number }> | APIResponse<'fail', APIError[]>
  > {
    try {
      const withdrawResponse = await this.root.http.post<{ amount: number }>(
        '/bank/withdraw',
        { amount },
      );

      this.root.emit('playerUpdate');

      return { status: 'ok', data: withdrawResponse.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }
}
