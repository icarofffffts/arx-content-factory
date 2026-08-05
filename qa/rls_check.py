#!/usr/bin/env python3
"""RLS hardening verification against prod DB (via VPS SSH)."""
import json
import re
import subprocess
import sys
from pathlib import Path

SSH_ALIAS = "arxdevsvps"
DB_HOST = "10.0.1.20"
DB_USER = "supabase_admin"
DB_NAME = "postgres"
DB_PASSWORD = "1743764e88719c2461c477a8b5507b17574fbd6c0e13b8398bc19a67aa23441d"

CHECK_SQL = r"""
\pset format unaligned
\pset tuples_only on
-- 1. tabelas sem RLS
SELECT 'no_rls:' || count(*) FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity;
-- 2. tabelas sem FORCE RLS
SELECT 'no_force:' || count(*) FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relforcerowsecurity;
-- 3. grants DML (INSERT/UPDATE/DELETE) anon/authenticated fora de rsvp
SELECT 'sensitive_dml:' || count(*) FROM information_schema.role_table_grants
  WHERE table_schema='public' AND grantee IN ('anon','authenticated')
    AND privilege_type IN ('INSERT','UPDATE','DELETE') AND table_name <> 'rsvp';
-- 4. anon tentando ler users (deve FALHAR)
SET ROLE anon;
SELECT 'anon_users_ok:' || count(*) FROM public.users;
RESET ROLE;
-- 5. anon lendo convites publicos (deve FUNCIONAR, 0 linhas ok)
SET ROLE anon;
SELECT 'anon_convites_ok:' || count(*) FROM public.convites;
RESET ROLE;
"""


def main():
    sql_file = Path(r"C:\Users\ADMINI~1\AppData\Local\Temp\opencode\rls_check.sql")
    sql_file.write_text(CHECK_SQL, encoding="utf-8")
    try:
        subprocess.run(
            ["scp", "-i", r"C:\Users\Administrator\.ssh\id_arxdevsvps", str(sql_file),
             f"root@185.111.156.178:/tmp/rls_check.sql"],
            check=True, capture_output=True, timeout=60,
        )
        result = subprocess.run(
            ["ssh", "-i", r"C:\Users\Administrator\.ssh\id_arxdevsvps", "root@185.111.156.178",
             f"PGPASSWORD={DB_PASSWORD} psql -h {DB_HOST} -U {DB_USER} -d {DB_NAME} -f /tmp/rls_check.sql 2>&1"],
            check=True, capture_output=True, timeout=120,
        )
        out = result.stdout.decode("utf-8", errors="replace")
    except subprocess.CalledProcessError as e:
        out = e.stdout.decode("utf-8", errors="replace") + e.stderr.decode("utf-8", errors="replace")
        print("SSH/psql falhou:", out[-2000:])
        return False, []

    results = []
    tests = [
        ("RLS habilitado em todas tabelas public", r"no_rls:(\d+)", lambda v: v == "0", False),
        ("FORCE RLS em todas tabelas public", r"no_force:(\d+)", lambda v: v == "0", False),
        ("anon/authenticated sem DML em tabelas sensiveis", r"sensitive_dml:(\d+)", lambda v: v == "0", False),
        ("anon bloqueado em users (permission denied)", r"anon_users_ok:(\d+)", lambda v: False, True),
        ("anon lê convites públicos", r"anon_convites_ok:(\d+)", lambda v: True, False),
    ]
    for name, pattern, check, expect_error in tests:
        if expect_error:
            # erro esperado: "permission denied" presente e sem linha ok
            ok = ("permission denied" in out) and (pattern + ":" not in out or re.search(pattern, out) is None)
            # se linha apareceu, falhou (anon conseguiu ler)
            m = re.search(pattern, out)
            if m:
                ok = False
            results.append((name, ok, "permission denied esperado" if ok else "anon CONSEGUIU ler users!"))
        else:
            m = re.search(pattern, out)
            ok = m is not None and check(m.group(1))
            results.append((name, ok, m.group(0) if m else "padrao nao encontrado"))

    return all(r[1] for r in results), results


if __name__ == "__main__":
    ok, results = main()
    for name, passed, detail in results:
        print(f"{'PASS' if passed else 'FAIL'}  {name}  [{detail}]")
    print(f"\n=== RLS Check: {sum(1 for r in results if r[1])} pass, {sum(1 for r in results if not r[1])} fail ===")
    sys.exit(0 if ok else 1)
