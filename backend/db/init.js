const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    await client.query(sql);
    console.log('DB init complete');
  } catch (err) {
    console.error('DB init failed', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
