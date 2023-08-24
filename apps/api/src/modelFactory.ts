import PlayerModel from './models/player';
import UserModel from './models/user';
import UserSessionModel from './models/userSession';

export default class ModelFactory {
  public player: typeof PlayerModel;
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;

  constructor() {
    this.player = PlayerModel;
    this.user = UserModel;
    this.userSession = UserSessionModel;
  }
}
