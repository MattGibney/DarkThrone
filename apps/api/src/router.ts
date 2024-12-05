import Router from 'express';
import AttackController from './controllers/attack';
import AuthController from './controllers/auth';
import BankingController from './controllers/banking';
import PlayersController from './controllers/player';
import StructuresController from './controllers/structures';
import TrainingController from './controllers/training';
import WarHistoryController from './controllers/warHistory';

const router = Router();
// const authedRouter = Router();

// authedRouter.use((req, res, next) => {
//   if (!req.ctx.authedUser) {
//     res.status(401).send({
//       errors: [
//         {
//           code: 'not_authenticated',
//           title: 'Not authenticated',
//         },
//       ],
//     });
//     return;
//   }
//   next();
// });

// Attack
router.post('/attack', AttackController.POST_attackPlayer);

// Auth
router.post('/auth/login', AuthController.POST_login);
router.post('/auth/register', AuthController.POST_register);
router.get('/auth/current-user', AuthController.GET_currentUser);
router.get(
  '/auth/current-user/players',
  PlayersController.GET_fetchPlayersForUser,
);
router.post('/auth/logout', AuthController.POST_logout);
router.post('/auth/assume-player', AuthController.POST_assumePlayer);
router.post('/auth/unassume-player', AuthController.POST_unassumePlayer);

// Players
router.get('/players', PlayersController.GET_fetchAllPlayers);
router.post('/players', PlayersController.POST_createPlayer);
router.post(
  '/players/validate-name',
  PlayersController.POST_validatePlayerName,
);
router.get('/players/:id', PlayersController.GET_fetchPlayerByID);
router.post(
  '/players/matching-ids',
  PlayersController.POST_fetchAllMatchingIDs,
);
router.get('/players/:id/goldPerTurn', PlayersController.GET_goldPerTurn);
// War History
router.get('/war-history/:id', WarHistoryController.GET_fetchByID);
router.get('/war-history', WarHistoryController.GET_fetchAll);

// Training
router.post('/training/train', TrainingController.POST_trainUnits);
router.post('/training/untrain', TrainingController.POST_unTrainUnits);

// Banking
router.post('/bank/deposit', BankingController.POST_deposit);
router.post('/bank/withdraw', BankingController.POST_withdraw);

// Structures
router.post('/structures/upgrade', StructuresController.POST_upgradeStructure);

export default router;
