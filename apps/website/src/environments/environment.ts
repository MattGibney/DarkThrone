export interface Config {
  webAppUrl: string;
}
export const environment: Config = {
  webAppUrl: import.meta.env.VITE_GAME_APP_URL || 'http://localhost:4200',
};
