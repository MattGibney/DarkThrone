import express from 'express';
import cors from 'cors';
import { Logger } from 'pino';
import { ulid } from 'ulid';
import { Config } from '../config/environment';
import ModelFactory from './modelFactory';
import DaoFactory from './daoFactory';
import e from 'express';
import router from './router';

export type Context = {
  requestID: string;
  config: Config;
  logger: Logger;
  modelFactory: ModelFactory;
  daoFactory: DaoFactory;
};

const application = (logger: Logger, config: Config, daoFactory: DaoFactory) => {
  const app = express();

  app.use(express.json());

  const allowlist = [config.webApp.origin]
  const corsOptionsDelegate = function (req, callback) {
    let corsOptions = { origin: false, credentials: false };
    if (allowlist.indexOf(req.header('Origin')) !== -1) {
      corsOptions = { origin: true, credentials: true }
    }
    callback(null, corsOptions)
  }

  app.use(cors(corsOptionsDelegate));

  app.use((req, res, next) => {
    const requestID = ulid();

    req.ctx = {
      requestID,
      config,
      logger: logger.child({ requestID }),
      modelFactory: new ModelFactory(),
      daoFactory
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

  app.use(router);

  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  });

  return app;
}

export default application;
