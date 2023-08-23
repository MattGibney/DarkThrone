export type Config = {
  port: string;
  webApp: {
    origin: string;
  }
  jwtSecret: string;
};

const config: Config = {
  port: process.env.API_PORT,
  webApp: {
    origin: process.env.WEBAPP_ORIGIN,
  },
  jwtSecret: process.env.JWT_SECRET,
}

export default config;
