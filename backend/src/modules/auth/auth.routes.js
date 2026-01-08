import { Router } from 'express';
import { login } from './auth.controller.js';
import { logout } from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
const router = Router();

router.post('/login/', login);

router.post(
    '/logout',
    authenticate,
    logout
);


export default router;
