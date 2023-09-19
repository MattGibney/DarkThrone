import { Knex } from 'knex';
import { Logger } from 'pino';
import PlayerDao from './daos/player';
import UserDao from './daos/user';
import UserSessionDao from './daos/userSession';
import WarHistoryDao from './daos/warHistory';
import PlayerUnitsDao from './daos/playerUnits';

export default class DaoFactory {
  private database: Knex;

  public player: PlayerDao;
  public playerUnits: PlayerUnitsDao;
  public user: UserDao;
  public userSession: UserSessionDao;
  public warHistory: WarHistoryDao;

  constructor(database: Knex) {
    this.database = database;

    this.player = new PlayerDao(this.database);
    this.playerUnits = new PlayerUnitsDao(this.database);
    this.user = new UserDao(this.database);
    this.userSession = new UserSessionDao(this.database);
    this.warHistory = new WarHistoryDao(this.database);
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
