import PlayerModel from './models/player';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';
import WarHistoryModel from './models/warHistory';

export default class ModelFactory {
  public player: typeof PlayerModel;
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;
  public warHistory: typeof WarHistoryModel;

  constructor() {
    this.player = PlayerModel;
    this.user = UserModel;
    this.userSession = UserSessionModel;
    this.warHistory = WarHistoryModel;
  }
}
