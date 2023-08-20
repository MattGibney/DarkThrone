export type Config = {
  port: string;
};

const config: Config = {
  port: process.env.API_PORT,
}

export default config;
