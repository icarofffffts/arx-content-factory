#!/bin/bash
set -e

REPO="https://github.com/icarofffffts/arx-content-factory.git"
TMP="/tmp/arx-repo-$(date +%s)"
DEST="/opt/content_factory"

echo "=== 1. CLONAR REPO ==="
git clone --depth=1 "$REPO" "$TMP"

echo "=== 2. BACKUP DASHBOARD ANTIGO ==="
cp -r "$DEST/dashboard" "$DEST/dashboard_backup_$(date +%Y%m%d_%H%M)" 2>/dev/null || true

echo "=== 3. SQL SCHEMA ==="
PGPASSWORD="${DB_PASSWORD:-REDACTED_OLD_DB_PASSWORD}" \
  psql -h "${DB_HOST:-10.0.1.20}" -U "${DB_USER:-supabase_admin}" -d "${DB_NAME:-postgres}" -f "$TMP/sql_schema_novo.sql"

echo "=== 4. BUILD REACT ==="
cd "$TMP/frontend"
npm install
npm run build

echo "=== 5. COPIAR BUILD + SERVER ==="
cp -r dist "$DEST/dashboard/react-dist"
cp "$TMP/dashboard/server.js" "$DEST/dashboard/server.js"

echo "=== 6. RESTART ==="
systemctl restart content-dashboard

echo "=== 7. STATUS ==="
systemctl status content-dashboard --no-pager | head -10
echo ""
echo "✅ Pronto!"
echo "   React:  https://conteudos.icarodev.cloud/"
echo "   Old:    https://conteudos.icarodev.cloud/dashboard/"

rm -rf "$TMP"
