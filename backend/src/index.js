import 'dotenv/config';

const REQUIRED_ENV = ['JWT_SECRET', 'ADMIN_PASSWORD', 'DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[fatal] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import { requireAuth } from './middleware/auth.js';
import { notifyExpiringItems } from './jobs/notifyExpiring.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // permite fetch cross-origin (Vercel → Railway)
}));
app.use(cors({ origin: process.env.FRONTEND_URL || false }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/items', requireAuth, itemsRouter);

// Daily expiry check at 8am Brasília time (UTC-3 = 11:00 UTC)
cron.schedule('0 11 * * *', () => {
  console.log('[cron] Running daily expiry notification...');
  notifyExpiringItems().catch(console.error);
}, { timezone: 'America/Sao_Paulo' });

// Multer error handler (file too large, wrong type)
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Arquivo muito grande. Máximo: 5MB.' });
  }
  if (err.message === 'Apenas imagens são permitidas') {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

// Generic error handler — must be last, must have 4 args
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
