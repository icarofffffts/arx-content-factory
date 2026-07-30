#!/bin/bash
# Cleanup VPS — orphans, projetos mortos, lixo docker
# Uso: ssh root@185.111.156.178 'bash -s' < cleanup_vps.sh

set -e

echo "=== 1. PARAR/REMOVER ORPHANS COOLIFY ==="
docker rm -f \
  jmbh5oorx65xrdg208fn2t36-005554887890 \
  d5nq3pkz78eebmx53cbv2mv7-023759956484 \
  g9skoxi058n37evievd67wdl-023351611423 \
  waqce4ejfk1c13on0fpfyueo-011240320423 \
  b9vnpmrfmb5d8pwrh54ph3si-010217056138 \
  l8cb0bnoj32n6d7sz9ap2g6u-201834733359 \
  u14ejqiucddxokvu3deqy883-013238263003 \
  q104824sn4elg38l1ru5vwhi-035040434111 \
  dm9mqsn4uwikrzpt4olhzvpp-035348965126 \
  n7ehbivqnmi00hk1ko8hisvm-033227889836 \
  vn5kor3jnmfwjumc5yi2w6yt-033227860858 \
  uauo066bbqp7g752rug4xguz 2>/dev/null || echo "  (alguns ja removidos)"

echo "=== 2. REMOVER PROJETOS EXTRAS ==="
docker rm -f $(docker ps -a --filter name=odysseus -q) 2>/dev/null || true
docker rm -f $(docker ps -a --filter name=hybrid-crm -q) 2>/dev/null || true
docker rm -f $(docker ps -a --filter name=n8n-monitor -q) 2>/dev/null || true

echo "=== 3. PARAR SERVICOS SYSTEMD MORTO ==="
systemctl stop propostas-java 2>/dev/null || true
systemctl disable propostas-java 2>/dev/null || true
systemctl stop clinicas 2>/dev/null || true
systemctl disable clinicas 2>/dev/null || true
systemctl stop paperclip 2>/dev/null || true
systemctl disable paperclip 2>/dev/null || true

echo "=== 4. REMOVER PASTAS ==="
rm -rf /opt/paperclip/
rm -rf /opt/propostas-java/
rm -rf /opt/clinicas/

echo "=== 5. DOCKER PRUNE ==="
docker system prune -af --volumes

echo "=== 6. STATUS FINAL ==="
docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
df -h /
free -h

echo "=== PRONTO ==="
