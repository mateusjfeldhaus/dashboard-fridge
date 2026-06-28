import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas.js';
import logger from '../logger.js';

const router = Router();

// Refresh secret derived from JWT_SECRET so no extra env var is needed
const refreshSecret = () => process.env.JWT_SECRET! + ':refresh';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Generous limit — legitimate use is ~1 req per 15 min per session
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Muitas tentativas de refresh. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, validate(loginSchema), (req, res) => {
  const { password } = req.body as { password: string };

  if (password !== process.env.ADMIN_PASSWORD) {
    logger.warn('Failed login attempt');
    res.status(401).json({ error: 'Senha incorreta' });
    return;
  }

  const token        = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ role: 'admin' }, refreshSecret(),            { expiresIn: '7d'  });

  logger.info('Login successful');
  res.json({ token, refreshToken });
});

router.post('/refresh', refreshLimiter, (req, res) => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    res.status(401).json({ error: 'Refresh token ausente' });
    return;
  }

  try {
    jwt.verify(refreshToken, refreshSecret());
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '15m' });
    res.json({ token });
  } catch {
    logger.warn('Invalid or expired refresh token');
    res.status(401).json({ error: 'Refresh token inválido ou expirado' });
  }
});

export default router;
