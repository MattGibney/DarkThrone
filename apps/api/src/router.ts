import Router from 'express';
import AuthController from './controllers/auth';

const router = Router();

router.post('/auth/login', AuthController.POST_login);
router.post('/auth/register', AuthController.POST_register);

export default router;
