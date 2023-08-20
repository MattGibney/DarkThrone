import pino from 'pino';
import application from './app';
import config from '../config/environment';

const logger = pino({});

const app = application(logger, config);

app.listen(config.port, () => {
  logger.info(`API listening on ${config.port}`);
});
