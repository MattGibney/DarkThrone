import UserModel from './models/user';
import UserSessionModel from './models/userSession';

export default class ModelFactory {
  public user: typeof UserModel;
  public userSession: typeof UserSessionModel;

  constructor() {
    this.user = UserModel;
    this.userSession = UserSessionModel;
  }
}
