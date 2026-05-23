import { Router } from 'express';
import { registerUser, loginUser, getSession } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/session', getSession);

export default router;
