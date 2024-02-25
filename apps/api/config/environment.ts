export type Config = {
  port: string;
  webApp: {
    origin: string;
  };
  jwtSecret: string;
  logtailSourceToken: string;
  logLevel?: string;
};

const config: Config = {
  port: process.env.API_PORT,
  webApp: {
    origin: process.env.WEBAPP_ORIGIN,
  },
  jwtSecret: process.env.JWT_SECRET,
  logtailSourceToken: process.env.LOGTAIL_SOURCE_TOKEN,
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
