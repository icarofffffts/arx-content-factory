$hbaContent = @'
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust

# Docker network (evolution-api, n8n, etc.)
host all all 172.18.0.0/16 trust

# Default: all others use scram-sha-256
host all all all scram-sha-256
'@

$hbaContent | ssh arxdevsvps "cat > /tmp/pg_hba_fixed.conf"
"Wrote pg_hba_fixed.conf to VPS"
