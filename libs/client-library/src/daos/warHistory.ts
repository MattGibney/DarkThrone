import { WarHistoryObject } from '@darkthrone/interfaces';
import DarkThroneClient, { APIError, APIResponse } from '..';

export default class AttackDAO {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async fetchByID(
    id: string,
  ): Promise<
    APIResponse<'ok', WarHistoryObject> | APIResponse<'fail', APIError[]>
  > {
    if (!this.root.authenticatedPlayer) {
      return {
        status: 'fail',
        data: [{ code: 'CL465', title: 'You are not authenticated' }],
      };
    }

    try {
      const attackResponse = await this.root.http.get<WarHistoryObject>(
        `/war-history/${id}`,
      );

      return { status: 'ok', data: attackResponse.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }

  async fetchAll(): Promise<
    APIResponse<'ok', WarHistoryObject[]> | APIResponse<'fail', APIError[]>
  > {
    if (!this.root.authenticatedPlayer) {
      return {
        status: 'fail',
        data: [{ code: 'CL465', title: 'You are not authenticated' }],
      };
    }

    try {
      const attackResponse =
        await this.root.http.get<WarHistoryObject[]>('/war-history');

      return { status: 'ok', data: attackResponse.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return {
        status: 'fail',
        data: axiosError.response.data.errors as APIError[],
      };
    }
  }
}
