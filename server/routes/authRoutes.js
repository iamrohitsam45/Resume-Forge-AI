import { Router } from 'express';
import { register, login, me, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import validateBody from '../validators/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/login', authLimiter, validateBody(loginSchema), login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

export default router;
