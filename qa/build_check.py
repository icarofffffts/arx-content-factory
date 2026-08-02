#!/usr/bin/env python3
"""
QA CANÔNICO — Frontend Build Check (Arx Content Factory)
=======================================================
Garante que o frontend compila sem erros:
  - tsc --noEmit (type check)
  - vite build (produção)
Roda dentro de frontend/ via npm. Retorna exit != 0 se falhar.
"""
import subprocess
import sys
import os

FRONTEND = os.path.join(os.path.dirname(__file__), "..", "frontend")
FRONTEND = os.path.abspath(FRONTEND)


def run(cmd, label):
    print(f"\n--- {label} ---")
    r = subprocess.run(cmd, cwd=FRONTEND, shell=True, capture_output=True, text=True, timeout=240)
    out = (r.stdout + r.stderr)[-1500:]
    print(out)
    return r.returncode == 0, out


def main():
    fails = []

    ok, _ = run("npm run build", "npm run build (tsc && vite build)")
    if not ok:
        fails.append("build")
        print("FAIL  build frontend")
    else:
        print("PASS  build frontend (tsc + vite)")

    # Verifica se o dist foi gerado
    dist = os.path.join(FRONTEND, "dist", "index.html")
    if os.path.exists(dist):
        print("PASS  dist/index.html gerado")
    else:
        fails.append("dist")
        print("FAIL  dist não gerado")

    # Verifica se o bundle cresceu (libs: motion, number-flow, lucide)
    assets = os.path.join(FRONTEND, "dist", "assets")
    if os.path.isdir(assets):
        js = [f for f in os.listdir(assets) if f.endswith(".js")]
        biggest = max((os.path.getsize(os.path.join(assets, f)) for f in js), default=0)
        if biggest > 400_000:
            print(f"PASS  bundle JS OK ({biggest // 1024} KB)")
        else:
            fails.append("bundle")
            print("FAIL  bundle muito pequeno")

    if fails:
        print(f"\n=== QA Build: FALHOU ({fails}) ===")
        sys.exit(1)
    print("\n=== QA Build: PASSOU ===")
    sys.exit(0)


if __name__ == "__main__":
    main()
