#!/bin/bash
# STOP ORPHANS — nao remove nada, so desliga
# Uso: ssh root@185.111.156.178 'bash -s' < stop_orphans_vps.sh

set -e

echo "=== PARAR CONTAINERS ORPHAN COOLIFY ==="
for c in \
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
  uauo066bbqp7g752rug4xguz; do
  docker stop $c 2>/dev/null && echo "  STOPPED: $c" || echo "  SKIP: $c (ja parado/inexistente)"
done

echo ""
echo "=== PARAR CONTAINERS PROJETOS EXTRAS ==="
for proj in "odysseus" "hybrid-crm" "n8n-monitor"; do
  ids=$(docker ps -q --filter name=$proj)
  if [ -n "$ids" ]; then
    echo "$ids" | xargs docker stop && echo "  STOPPED: $proj"
  else
    echo "  SKIP: $proj (nenhum rodando)"
  fi
done

echo ""
echo "=== PARAR SERVICOS (systemd) ==="
for svc in "propostas-java" "clinicas" "paperclip"; do
  if systemctl is-active --quiet $svc 2>/dev/null; then
    systemctl stop $svc && echo "  STOPPED: $svc"
  else
    echo "  SKIP: $svc (inativo)"
  fi
done

echo ""
echo "=== CONTAINERS AINDA RODANDO ==="
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'

echo ""
echo "=== DISCO ==="
df -h /
