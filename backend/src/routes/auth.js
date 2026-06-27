import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../schemas.js';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), (req, res) => {
  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

export default router;
