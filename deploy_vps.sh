#!/bin/bash
# 🚀 Deploy: clonar repo + build + restart
# Rode isso na VPS (ssh root@185.111.156.178)

set -e

echo "=== 1. CLONAR REPO ==="
cd /opt/content_factory
mv dashboard dashboard_backup_$(date +%Y%m%d) 2>/dev/null || true
git clone https://github.com/icarofffffts/arx-content-factory.git .
mv dashboard_backup_*/public dashboard/ 2>/dev/null || true

echo "=== 2. SQL SCHEMA ==="
PGPASSWORD='635ddc870eca917c87aa2fcbf0abeef59fe5a4e5608f14b055d2884e7b163bfc' \
  psql -h 10.0.1.20 -U supabase_admin -d postgres -f sql_schema_novo.sql

echo "=== 3. BUILD REACT ==="
cd frontend
npm install
npm run build

echo "=== 4. RESTART DASHBOARD ==="
systemctl restart content-dashboard

echo "=== 5. STATUS ==="
systemctl status content-dashboard --no-pager | head -10
echo ""
echo "✅ Pronto!"
echo "   React:  https://conteudos.icarodev.cloud/"
echo "   Old:    https://conteudos.icarodev.cloud/dashboard/"
