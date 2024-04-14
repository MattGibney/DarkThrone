import Router from 'express';
import AttackController from './controllers/attack';
import AuthController from './controllers/auth';
import BankingController from './controllers/banking';
import PlayersController from './controllers/player';
import TrainingController from './controllers/training';
import WarHistoryController from './controllers/warHistory';

const router = Router();
const authedRouter = Router();

authedRouter.use((req, res, next) => {
  if (!req.ctx.authedUser) {
    res.status(401).send({
      errors: [
        {
          code: 'not_authenticated',
          title: 'Not authenticated',
        },
      ],
    });
    return;
  }
  next();
});

// Attack
authedRouter.post('/attack', AttackController.POST_attackPlayer);

// Auth
router.post('/auth/login', AuthController.POST_login);
router.post('/auth/register', AuthController.POST_register);
router.get('/auth/current-user', AuthController.GET_currentUser);
authedRouter.get(
  '/auth/current-user/players',
  PlayersController.GET_fetchPlayersForUser,
);
router.post('/auth/logout', AuthController.POST_logout);
authedRouter.post('/auth/assume-player', AuthController.POST_assumePlayer);
authedRouter.post('/auth/unassume-player', AuthController.POST_unassumePlayer);

// Players
authedRouter.get('/players', PlayersController.GET_fetchAllPlayers);
authedRouter.post('/players', PlayersController.POST_createPlayer);
authedRouter.post(
  '/players/validate-name',
  PlayersController.POST_validatePlayerName,
);
authedRouter.get('/players/:id', PlayersController.GET_fetchPlayerByID);
authedRouter.post(
  '/players/matching-ids',
  PlayersController.POST_fetchAllMatchingIDs,
);

// War History
authedRouter.get('/war-history/:id', WarHistoryController.GET_fetchByID);
authedRouter.get('/war-history', WarHistoryController.GET_fetchAll);

// Training
authedRouter.post('/training/train', TrainingController.POST_trainUnits);
authedRouter.post('/training/untrain', TrainingController.POST_unTrainUnits);

// Banking
authedRouter.post('/bank/deposit', BankingController.POST_deposit);
authedRouter.post('/bank/withdraw', BankingController.POST_withdraw);

router.use(authedRouter);

export default router;
