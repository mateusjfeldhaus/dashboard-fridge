import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log('Connected to Neon ✅');

await client.query(readFileSync(join(__dirname, '../schema.sql'), 'utf8'));
console.log('Schema applied ✅');

const { rows } = await client.query(
  `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'items' ORDER BY ordinal_position`
);
console.log('\nitems table columns:');
rows.forEach((r) => console.log(`  • ${r.column_name} (${r.data_type})`));

await client.end();
