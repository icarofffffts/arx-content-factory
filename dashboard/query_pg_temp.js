const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'supabase_admin',
  host: process.env.DB_HOST || '10.0.1.20',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'REDACTED_OLD_DB_PASSWORD',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  connectionTimeoutMillis: 8000
});
(async () => {
  try {
    const r = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name");
    console.log('SUCCESS:', JSON.stringify(r.rows, null, 2));
  } catch(e) {
    console.log('ERRO:', e.message);
    console.log('Code:', e.code);
  }
  await pool.end();
})();
