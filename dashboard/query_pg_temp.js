const { Pool } = require('pg');
const pool = new Pool({
  user: 'supabase_admin',
  host: '10.0.1.20',
  database: 'postgres',
  password: '635ddc870eca917c87aa2fcbf0abeef59fe5a4e5608f14b055d2884e7b163bfc',
  port: 5432,
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
