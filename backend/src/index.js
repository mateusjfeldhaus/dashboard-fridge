import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import authRouter from './routes/auth.js';
import itemsRouter from './routes/items.js';
import { requireAuth } from './middleware/auth.js';
import { notifyExpiringItems } from './jobs/notifyExpiring.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/items', requireAuth, itemsRouter);

// Daily expiry check at 8am Brasília time (UTC-3 = 11:00 UTC)
cron.schedule('0 11 * * *', () => {
  console.log('[cron] Running daily expiry notification...');
  notifyExpiringItems().catch(console.error);
}, { timezone: 'America/Sao_Paulo' });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
