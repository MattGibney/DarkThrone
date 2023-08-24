import Router from 'express';
import AuthController from './controllers/auth';

const router = Router();

router.post('/auth/login', AuthController.POST_login);
router.post('/auth/register', AuthController.POST_register);
router.get('/auth/current-user', AuthController.GET_currentUser);
router.post('/auth/logout', AuthController.POST_logout);

export default router;
