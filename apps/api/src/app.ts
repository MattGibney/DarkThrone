import express from 'express';
import cors from 'cors';
import { Logger } from 'pino';
import { ulid } from 'ulid';
import { Config } from '../config/environment';

export type Context = {
  requestID: string;
  config: Config;
  logger: Logger;
};

const application = (logger: Logger, config: Config) => {
  const app = express();

  app.use(cors({
    origin: config.webApp.origin,
    optionsSuccessStatus: 200,
  }));

  app.use((req, res, next) => {
    const requestID = ulid();

    req.ctx = {
      requestID,
      config,
      logger: logger.child({ requestID }),
    };

    res.setHeader('X-Powered-By', 'Dark Throne');
    res.set('X-Request-ID', requestID);

    res.on('finish', () => {
      logger.info(
        { requestID, statusCode: res.statusCode },
        'Request finished',
      );
    });

    next();
  });

  app.get('/healthcheck', (req, res) => {
    logger.info('Healthcheck');
    res.send({ message: 'OK' });
  });

  return app;
}

export default application;
