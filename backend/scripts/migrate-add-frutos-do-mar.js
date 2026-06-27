import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
console.log('Connected ✅');

// Drop old constraint and recreate with the new category
await client.query(`
  ALTER TABLE items DROP CONSTRAINT IF EXISTS items_category_check;
`);

await client.query(`
  ALTER TABLE items ADD CONSTRAINT items_category_check
  CHECK (category IN (
    'carne', 'frango', 'porco', 'peixe', 'frutos do mar',
    'congelados', 'pães', 'sopa', 'massas', 'proteina', 'outro'
  ));
`);

console.log('Constraint updated ✅');
console.log('Category "frutos do mar" added!');

await client.end();
