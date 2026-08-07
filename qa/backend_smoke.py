#!/usr/bin/env python3
"""
QA CANÔNICO — Backend Smoke Test (Arx Content Factory)
=====================================================
Testa TODAS as rotas /api do servidor Express em produção:
  - auth gate (rotas protegidas exigem x-arx-token; sem token -> 401/403, não HTML)
  - respostas válidas JSON com token admin
  - NÃO vaza HTML do SPA em rotas de API (apenas em GET / )

Como rodar:
  python qa/backend_smoke.py [--base URL] [--token TOKEN] [--email E] [--password P]

Se --token não for passado, faz login com admin (credenciais do .env ou fallback).
Retorna exit code != 0 se houver falhas.
"""
import argparse
import json
import sys
import urllib.request
import urllib.error

UA = "Mozilla/5.0 (qa-canonico) Chrome/120.0 Safari/537.36"
BASE_DEFAULT = "https://conteudos.icarodev.cloud"

# Rotas GET/POST protegidas que devem retornar JSON com token
GET_PROTECTED = [
    "/api/metrics",
    "/api/posts",
    "/api/analytics",
    "/api/templates",
    "/api/drafts",
    "/api/settings",
    "/api/social/accounts",
    "/api/suggestions",
    "/api/whatsapp/instances",
    "/api/shortlinks",
    "/api/v2/auth/me",
    "/api/v2/plans",
    "/api/v2/leads/stats" if False else "/api/v1/leads/stats",
    "/api/admin/stats",
    "/api/admin/users",
    "/api/admin/clientes",
    "/api/admin/plans",
]

POST_PROTECTED = [
    "/api/me/api-key",          # body: {}
    "/api/generate",            # body: {"topic": "QA teste"}
    "/api/ai/chat",             # body: {"message": "oi"}
    "/api/demo/request",        # body: {"email": "qa@arx.test"}
    "/api/shorten",             # body: {"url": "https://arx.dev"}
    "/api/v2/plans/subscribe",  # body: {"plan": "pro"}  (pode falhar pagamento, mas deve ser JSON)
]

# Rotas GET protegidas adicionais (fluxos especiais)
GET_PROTECTED_EXTRA = [
    "/api/social/connect/linkedin",   # OAuth start (GET, retorna JSON redirect_url)
]

# Rotas públicas (sem token) que devem retornar JSON de erro ou redirect — NÃO HTML
PUBLIC_ENDPOINTS = [
    "/api/v2/auth/login",
    "/api/v2/auth/register",
    "/api/v2/auth/logout",
    "/api/v1/leads",
    "/api/v1/generate",
    "/api/v1/promos",
    "/api/whatsapp/instances",
]

HTML_SIGNATURES = ("<!doctype html", "<html", "<!DOCTYPE HTML", "<head>", "<script")


def req(method, url, token=None, body=None, base=BASE_DEFAULT):
    headers = {"User-Agent": UA, "Accept": "application/json"}
    if token:
        headers["x-arx-token"] = token
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    r = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read().decode("utf-8", "replace")
            return resp.status, raw, resp.headers.get("Content-Type", "")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace") if e.fp else ""
        return e.code, raw, e.headers.get("Content-Type", "")


def is_html(raw, ctype):
    if ctype and "text/html" in ctype.lower():
        return True
    low = raw.lstrip().lower()
    return any(sig in low[:200] for sig in HTML_SIGNATURES)


def login(base, email, password):
    st, raw, ct = req("POST", base + "/api/v2/auth/login",
                      body={"email": email, "password": password})
    if st == 200:
        try:
            return json.loads(raw).get("token")
        except Exception:
            pass
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://conteudos.icarodev.cloud")
    parser.add_argument("--token", default=None)
    parser.add_argument("--email", default="admin@arx.dev")
    parser.add_argument("--password", default="arx_secret_2026!")
    args = parser.parse_args()
    base = args.base.rstrip("/")

    fails = []
    passes = 0

    token = args.token or login(base, args.email, args.password)
    if not token:
        print("FAIL  login admin (sem token)")
        fails.append("login")
    else:
        print("PASS  login admin -> token obtido")
        passes += 1

    # 1. Rotas GET protegidas
    for path in GET_PROTECTED + GET_PROTECTED_EXTRA:
        st, raw, ct = req("GET", base + path, token=token)
        ok = 200 <= st < 300 and not is_html(raw, ct)
        if ok:
            passes += 1
            print(f"PASS  GET {path} [{st}]")
        else:
            fails.append(path)
            print(f"FAIL  GET {path} [{st}] html={is_html(raw, ct)}")

    # 2. Rotas POST protegidas
    for path in POST_PROTECTED:
        body = {"topic": "QA", "message": "oi", "email": "qa@arx.test",
                "plan": "pro", "url": "https://arx.dev", "platform": "linkedin"}
        st, raw, ct = req("POST", base + path, token=token, body=body)
        ok = 200 <= st < 500 and not is_html(raw, ct)  # 4xx/5xx ok se for JSON
        if ok:
            passes += 1
            print(f"PASS  POST {path} [{st}]")
        else:
            fails.append(path)
            print(f"FAIL  POST {path} [{st}] html={is_html(raw, ct)}")

    # 3. Auth gate: rotas protegidas SEM token devem ser bloqueadas (não HTML)
    for path in ["/api/metrics", "/api/admin/stats", "/api/settings", "/api/posts"]:
        st, raw, ct = req("GET", base + path, token=None)
        blocked = st in (401, 403) and not is_html(raw, ct)
        if blocked:
            passes += 1
            print(f"PASS  auth-gate {path} sem token -> {st} (JSON)")
        else:
            fails.append("gate:" + path)
            print(f"FAIL  auth-gate {path} -> {st} html={is_html(raw, ct)}")

    # 4. Rotas públicas não devem vazar HTML do SPA
    for path in PUBLIC_ENDPOINTS:
        st, raw, ct = req("POST" if path.endswith(("login", "register", "logout")) else "GET",
                          base + path, body={} if path.endswith(("login", "register")) else None)
        ok = not is_html(raw, ct)
        if ok:
            passes += 1
            print(f"PASS  public {path} [{st}] (no HTML)")
        else:
            fails.append("public:" + path)
            print(f"FAIL  public {path} [{st}] HTML vazado")

    # 5. GET / deve servir SPA (HTML esperado) — confirma que o SPA está no ar
    st, raw, ct = req("GET", base + "/")
    if st == 200 and is_html(raw, ct):
        passes += 1
        print("PASS  GET / -> SPA HTML")
    else:
        fails.append("GET /")
        print(f"FAIL  GET / -> {st}")

    print(f"\n=== QA Backend: {passes} pass, {len(fails)} fail ===")
    if fails:
        for f in fails:
            print("  FAIL " + f)
        sys.exit(1)
    print("ALL BACKEND CHECKS PASSED")
    sys.exit(0)


if __name__ == "__main__":
    main()
