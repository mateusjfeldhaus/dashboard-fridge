import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validate(loginSchema), (req, res) => {
  const { password } = req.body as { password: string };

  if (password !== process.env.ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
