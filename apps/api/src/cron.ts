import { Logger } from 'pino';
import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import cronManager from './cronManager';
import ModelFactory from './modelFactory';
import addAttackTurns from './scripts/addAttackTurns';
import { Context } from './app';
import addCitizens from './scripts/addCitizens';

export default (logger: Logger, config: Config, daoFactory: DaoFactory) => {
  const cron = cronManager();

  const ctx = {
    logger,
    config,
    daoFactory,
    modelFactory: new ModelFactory(),
  } as Context;

  // At the 0th and 30th minute of every hour
  cron.schedule('0,30 * * * *', () => addAttackTurns(ctx));
  // At 00:00 every day
  cron.schedule('0 0 * * *', () => addCitizens(ctx));

  return cron;
};

