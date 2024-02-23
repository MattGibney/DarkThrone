// Force compilation to include these as dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pg from 'pg';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as logtail from '@logtail/pino';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as pinoPretty from 'pino-pretty';

import Knex from 'knex';
import knexConfig from '../knexfile';
import pino from 'pino';


import application from './app';
import config from '../config/environment';
import DaoFactory from './daoFactory';
import CronApp from './cron';

const pinoTransport = config.logtailSourceToken
  ? {
      target: '@logtail/pino',
      options: {
        sourceToken: config.logtailSourceToken,
      },
    }
  : {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    };

const logger = pino({
  level: config.logLevel,
  formatters: {
    bindings: (bindings) => {
      return { host: bindings.hostname };
    },
  },
  transport: pinoTransport,
  timestamp: pino.stdTimeFunctions.isoTime,
});

const knex = Knex(knexConfig);
const daoFactory = new DaoFactory(knex);

const app = application(logger, config, daoFactory);

app.listen(config.port, () => {
  logger.info(`API listening on ${config.port}`);
});

const cron = CronApp(logger, config, daoFactory);
cron.start();
