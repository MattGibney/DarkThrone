import { Knex } from 'knex';
import { Logger } from 'pino';
import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';

export default class DaoFactory {
  private database: Knex;

  public user: UserDao;
  public userSession: UserSessionDao;

  constructor(database: Knex) {
    this.database = database;

    this.user = new UserDao(this.database);
    this.userSession = new UserSessionDao(this.database);
  }

  async hasDatabaseConnection(logger: Logger): Promise<boolean> {
    try {
      await this.database.raw('SELECT 1');

      return true;
    } catch (err) {
      logger.error(err, 'DAO FACTORY: Failed to connect to database');
      return false;
    }
  }
}
