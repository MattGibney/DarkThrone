import { Logger } from 'pino';
import { Config } from '../config/environment';
import DaoFactory from './daoFactory';
import cronManager from './cronManager';
import ModelFactory from './modelFactory';
import addAttackTurns from './scripts/addAttackTurns';
import { Context } from './app';

export default (logger: Logger, config: Config, daoFactory: DaoFactory) => {
  const cron = cronManager();

  const ctx = {
    logger,
    config,
    daoFactory,
    modelFactory: new ModelFactory(),
  } as Context;

  cron.schedule('0,30 * * * *', () => addAttackTurns(ctx));

  return cron;
};

