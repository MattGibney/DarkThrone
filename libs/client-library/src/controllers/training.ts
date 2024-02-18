import DarkThroneClient, { APIError, APIResponse } from '..';
import type { PlayerUnits } from '@darkthrone/interfaces';

export default class TrainingController {
  private root: DarkThroneClient;

  constructor(root: DarkThroneClient) {
    this.root = root;
  }

  async trainUnits(desiredUnits: PlayerUnits[]): Promise<APIResponse<'ok', PlayerUnits[]> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.post<PlayerUnits[]>('/training/train', desiredUnits);

      this.root.emit('playerUpdate');

      return { status: 'ok', data: response.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async unTrainUnits(desiredUnits: PlayerUnits[]): Promise<APIResponse<'ok', PlayerUnits[]> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.root.http.post<PlayerUnits[]>('/training/untrain', desiredUnits);

      return { status: 'ok', data: response.data };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }
}
