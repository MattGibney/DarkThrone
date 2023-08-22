import axios, { AxiosInstance } from 'axios';

export type UserObject = {
  id: string;
  email: string;
  hasConfirmedEmail: boolean;
};

export type APIError = {
  code: string;
  title: string;
  detail?: string;
};

type APIResponse<S, T> = {
  status: S;
  data: T;
}

export default class DarkThroneClient {
  private http: AxiosInstance;

  public authenticatedUser: UserObject | undefined;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
    });
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<APIResponse<'ok', UserObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.http.post<UserObject>(
        '/auth/login',
        { email, password, rememberMe }
      );

      this.authenticatedUser = response.data;

      return { status: 'ok', data: response.data as UserObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

  async register(email: string, password: string): Promise<APIResponse<'ok', UserObject> | APIResponse<'fail', APIError[]>> {
    try {
      const response = await this.http.post<UserObject>(
        '/auth/register',
        { email, password }
      );

      this.authenticatedUser = response.data;

      return { status: 'ok', data: response.data as UserObject };
    } catch (err: unknown) {
      const axiosError = err as { response: { data: { errors: APIError[] } } };
      return { status: 'fail', data: axiosError.response.data.errors as APIError[] };
    }
  }

}
