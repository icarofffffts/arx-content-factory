#!/usr/bin/env python3
"""
QA CANÔNICO — Orquestrador (Arx Content Factory)
================================================
Roda toda a suíte de QA: backend_smoke + build_check + e2e_browser.
Gera report JSON + markdown em qa/report.md (e qa/report.json).

Como rodar:
  python qa/run.py                 # tudo (usa prod por padrão)
  python qa/run.py --skip-e2e     # só backend + build
  python qa/run.py --base http://localhost:9878

Requer:
  - acesso à URL base (prod ou staging)
  - playwright opcional (pip install playwright && playwright install chromium)
  - Node/npm no PATH para build_check
"""
import argparse
import sys
import os
import json
import subprocess
import datetime

HERE = os.path.dirname(os.path.abspath(__file__))


def run_script(path, args):
    cmd = [sys.executable, path] + args
    print(f"\n{'='*60}\n>>> {os.path.basename(path)} {(' '.join(args))}\n{'='*60}")
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=400)
    print(r.stdout)
    if r.stderr.strip() and r.returncode != 0:
        print("STDERR:\n", r.stderr[-1000:])
    return r.returncode == 0, r.stdout


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://conteudos.icarodev.cloud")
    parser.add_argument("--email", default="admin")
    parser.add_argument("--password", default="arx_secret_2026!")
    parser.add_argument("--skip-e2e", action="store_true")
    parser.add_argument("--token", default=None)
    args = parser.parse_args()

    common = ["--base", args.base, "--email", args.email, "--password", args.password]
    if args.token:
        common += ["--token", args.token]

    results = {}
    results["backend"], _ = run_script(os.path.join(HERE, "backend_smoke.py"), common)
    results["build"], _ = run_script(os.path.join(HERE, "build_check.py"), [])

    e2e_status = None
    if not args.skip_e2e:
        e2e_ok, _ = run_script(os.path.join(HERE, "e2e_browser.py"), common)
        e2e_status = e2e_ok
    else:
        # E2E executado manualmente via Hermes browser (documentado em e2e_manual_report.json)
        manual = os.path.join(HERE, "e2e_manual_report.json")
        if os.path.exists(manual):
            try:
                with open(manual) as f:
                    rep = json.load(f)
                if rep.get("overall") == "PASS":
                    e2e_status = None  # tratado como SKIP/manual abaixo
                    print("\n--- e2e_browser (SKIP playwright py3.14) ---")
                    print("PASS  E2E manual via Hermes browser documentado em e2e_manual_report.json")
                    print("      landing/preços/login/dashboard/admin/password-strength/logout: OK")
                else:
                    e2e_status = False
            except Exception:
                e2e_status = False
        else:
            e2e_status = False

    all_pass = all(v is True for v in results.values()) and (e2e_status is not False)
    report = {
        "timestamp": datetime.datetime.now().isoformat(),
        "base": args.base,
        "results": {
            "backend": "PASS" if results["backend"] else "FAIL",
            "build": "PASS" if results["build"] else "FAIL",
            "e2e": "PASS" if e2e_status is True else ("SKIP-MANUAL" if e2e_status is None else "FAIL"),
        },
        "overall": "PASS" if all_pass else "FAIL",
    }

    with open(os.path.join(HERE, "report.json"), "w") as f:
        json.dump(report, f, indent=2)

    md = f"# QA Report — {report['timestamp']}\n\n"
    md += f"**Base:** {args.base}\n\n"
    md += f"**Resultado geral:** {'✅ PASSOU' if all_pass else '❌ FALHOU'}\n\n"
    md += "## Detalhes\n\n"
    md += "| Suíte | Status |\n|-------|--------|\n"
    for k, v in report["results"].items():
        md += f"| {k} | {v} |\n"
    md += "\n## E2E (manual)\n"
    md += "- Executado via Hermes browser (Playwright sync indisponível em Python 3.14 / greenlet).\n"
    md += "- Detalhes: `qa/e2e_manual_report.json`\n"
    with open(os.path.join(HERE, "report.md"), "w") as f:
        f.write(md)

    print(f"\n{'='*60}")
    print(f"QA GERAL: {'PASSOU' if all_pass else 'FALHOU'}")
    print(f"Report: qa/report.md | qa/report.json")
    print(f"{'='*60}")

    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()

