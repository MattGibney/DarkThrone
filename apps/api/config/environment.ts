export type Config = {
  port: string;
  webApp: {
    origin: string;
  }
};

const config: Config = {
  port: process.env.API_PORT,
  webApp: {
    origin: process.env.WEBAPP_ORIGIN,
  },
}

export default config;
