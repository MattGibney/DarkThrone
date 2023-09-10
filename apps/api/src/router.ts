import Router from 'express';
import AttackController from './controllers/attack';
import AuthController from './controllers/auth';
import PlayersController from './controllers/player';
import WarHistoryController from './controllers/warHistory';

const router = Router();
const authedRouter = Router();
authedRouter.use((req, res, next) => {
  if (!req.ctx.authedUser) {
    res.status(401).send({
      errors: [{
        code: 'not_authenticated',
        title: 'Not authenticated',
      }],
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
router.post('/auth/logout', AuthController.POST_logout);
authedRouter.post('/auth/assume-player', AuthController.POST_assumePlayer);
authedRouter.post('/auth/unassume-player', AuthController.POST_unassumePlayer);

// Players
authedRouter.get('/players', PlayersController.GET_fetchAllPlayers);
authedRouter.post('/players', PlayersController.POST_createPlayer);
authedRouter.post('/players/validate-name', PlayersController.POST_validatePlayerName);
authedRouter.get('/players/:id', PlayersController.GET_fetchPlayerByID);

// War History
authedRouter.get('/war-history/:id', WarHistoryController.GET_fetchByID);

router.use(authedRouter);

export default router;
