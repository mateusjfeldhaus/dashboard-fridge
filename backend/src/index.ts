import 'dotenv/config';

const REQUIRED_ENV = ['JWT_SECRET', 'ADMIN_PASSWORD', 'DATABASE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[fatal] Missing required env vars: ${missing.join(', ')}`);
  process.exit(1);
}

import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cron from 'node-cron';
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import { requireAuth } from './middleware/auth.js';
import { notifyExpiringItems } from './jobs/notifyExpiring.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || false }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/items', requireAuth, itemsRouter);

// Daily expiry check at 8am Brasília time
cron.schedule('0 8 * * *', () => {
  console.log('[cron] Running daily expiry notification...');
  notifyExpiringItems().catch(console.error);
}, { timezone: 'America/Sao_Paulo' });

// Multer error handler
app.use((err: Error & { code?: string }, _req: Request, res: Response, next: NextFunction) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: 'Arquivo muito grande. Máximo: 5MB.' });
    return;
  }
  if (err.message === 'Apenas imagens são permitidas') {
    res.status(400).json({ error: err.message });
    return;
  }
  next(err);
});

// Generic error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[unhandled error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
