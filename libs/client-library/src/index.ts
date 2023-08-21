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

export default class DarkThroneClient {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: 'http://localhost:3333',
      withCredentials: true,
    });
  }

  async login(email: string, password: string, rememberMe: boolean): Promise<{ status: 'ok', data: UserObject } | { status: 'fail', data: APIError[] }> {
    const response = await this.http.post<UserObject>(
      '/auth/login',
      {
        email,
        password,
        rememberMe,
      }
    );
    if (response.status !== 200) return { status: 'fail', data: response.data as unknown as APIError[] };

    return { status: 'ok', data: response.data as UserObject };
  }

}
