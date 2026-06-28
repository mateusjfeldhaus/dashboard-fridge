import pg from 'pg';
import logger from './logger.js';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err: Error) => {
  logger.error({ err }, 'Idle DB client error');
});

export default pool;
