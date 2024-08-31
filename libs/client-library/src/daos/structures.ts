import { structureUpgrades } from '@darkthrone/game-data';
import DarkThroneClient, { APIError, APIResponse } from '..';

export default class StructuresDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async upgrade(
    structureType: keyof typeof structureUpgrades,
  ): Promise<
    APIResponse<'ok', { amount: number }> | APIResponse<'fail', APIError[]>
  > {
    try {
      const depositResponse = await this.root.http.post<{ amount: number }>(
        '/structures/upgrade',
        { structureType },
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
}
