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

  // async attackPlayer(
  //   targetID: string,
  //   attackTurns: number,
  // ): Promise<
  //   APIResponse<'ok', WarHistoryObject> | APIResponse<'fail', APIError[]>
  // > {
  //   if (!this.root.authenticatedPlayer) {
  //     return {
  //       status: 'fail',
  //       data: [{ code: 'CL465', title: 'You are not authenticated' }],
  //     };
  //   }

  //   try {
  //     const attackResponse = await this.root.http.post<WarHistoryObject>(
  //       '/attack',
  //       { targetID, attackTurns },
  //     );

  //     return { status: 'ok', data: attackResponse.data };
  //   } catch (err: unknown) {
  //     const axiosError = err as { response: { data: { errors: APIError[] } } };
  //     return {
  //       status: 'fail',
  //       data: axiosError.response.data.errors as APIError[],
  //     };
  //   }
  // }
}
