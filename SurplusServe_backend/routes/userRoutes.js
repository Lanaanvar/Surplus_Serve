import { Router } from 'express';
import { getUser, createUser } from '../controllers/userController.js';

const router = Router();

router.get('/me', getUser);

router.post('/create', createUser);

export default router;