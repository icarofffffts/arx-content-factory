#!/bin/sh
# Add trust line before the scram-sha-256 line
sed -i '/^host.*all.*all.*all.*scram-sha-256$/i host all all 172.18.0.0/16 trust' /var/lib/postgresql/data/pg_hba.conf
# Remove duplicate trust lines
tac /var/lib/postgresql/data/pg_hba.conf | awk '!seen[$0]++' | tac > /tmp/pg_hba_clean.conf
cp /tmp/pg_hba_clean.conf /var/lib/postgresql/data/pg_hba.conf
# Remove old md5/trust lines for 172.18.0.0 that are after the 'all' line
echo "Done"
