// Force compilation to include these as dependencies
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import pg from 'pg';

import Knex from 'knex';
import knexConfig from '../knexfile';
import pino from 'pino';


import application from './app';
import config from '../config/environment';
import DaoFactory from './daoFactory';
import CronApp from './cron';

const logger = pino({});

const knex = Knex(knexConfig);
const daoFactory = new DaoFactory(knex);

const app = application(logger, config, daoFactory);

app.listen(config.port, () => {
  logger.info(`API listening on ${config.port}`);
});

const cron = CronApp(logger, config, daoFactory);
cron.start();
