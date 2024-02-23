import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Logger } from 'pino';
import { ulid } from 'ulid';
import { Config } from '../config/environment';
import ModelFactory from './modelFactory';
import DaoFactory from './daoFactory';
import router from './router';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';
import PlayerModel from './models/player';

export type Context = {
  requestID: string;
  config: Config;
  logger: Logger;
  modelFactory: ModelFactory;
  daoFactory: DaoFactory;
  authedUser?: {
    model: UserModel;
    session: UserSessionModel;
  };
  authedPlayer?: PlayerModel;
};

const application = (logger: Logger, config: Config, daoFactory: DaoFactory) => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

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
    const requestStartTime = Date.now();
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
      if (req.path === '/healthcheck') return;
      const requestDuration = Date.now() - requestStartTime;
      logger.info(
        {
          requestID,
          statusCode: res.statusCode,
          method: req.method,
          path: req.path,
          duration: requestDuration,
        },
        `Request: ${req.method} ${req.path}`,
      );
    });

    next();
  });

  app.use(async (req, res, next) => {
    const token = req.cookies['DTAC'];
    if (!token) {
      return next();
    }

    req.ctx.logger.debug({ token }, 'Found token in cookie');
    const userSession =
      await req.ctx.modelFactory.userSession.fetchValidByToken(req.ctx, token);
    if (!userSession) {
      // The cookie doesn't belong to a valid session, so clear it
      res.clearCookie('DTAC');
      return next();
    }

    const user = await req.ctx.modelFactory.user.fetchByID(
      req.ctx,
      userSession.userID,
    );
    if (!user) {
      return next();
    }

    req.ctx.logger.debug({ userID: user.id }, 'Found user');
    req.ctx.authedUser = {
      model: user,
      session: userSession,
    };

    if (userSession.playerID) {
      const player = await req.ctx.modelFactory.player.fetchByID(
        req.ctx,
        userSession.playerID,
      );

      req.ctx.logger.debug({ playerID: player.id }, 'Found player');
      req.ctx.authedPlayer = player;
    }

    next();
  });

  app.get('/healthcheck', (req, res) => {
    res.send({ message: 'OK' });
  });

  app.use(router);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send({ message: 'Internal Server Error' });
  });

  return app;
}

export default application;
