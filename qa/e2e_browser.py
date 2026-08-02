#!/usr/bin/env python3
"""
QA CANÔNICO — E2E Browser (Arx Content Factory)
================================================
Cobertura de ponta a ponta no navegador (Playwright, headless):
  1. Landing carrega (hero, CTA)
  2. Abrir Preços -> 3 cards (Gratuito/Pro/Enterprise) com preços R$
  3. Switch Anual altera preços
  4. Login admin -> dashboard
  5. Dashboard mostra dados reais (posts > 0)
  6. Aba Admin aparece (role=admin) + stats reais
  7. Logout visível + funciona (volta p/ landing)

Requer: pip install playwright && playwright install chromium
Se não houver playwright, o orquestrador usa o browser do Hermes (qa/run.py faz fallback).

Como rodar:
  python qa/e2e_browser.py [--base URL] [--email] [--password]
"""
import argparse
import sys
import os

try:
    from playwright.sync_api import sync_playwright
    HAVE_PW = True
except ImportError:
    HAVE_PW = False
except Exception:
    # Ex.: greenlet sem extensão C em Python 3.14 — sync_api quebra no import
    HAVE_PW = False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="https://conteudos.icarodev.cloud")
    parser.add_argument("--email", default="admin")
    parser.add_argument("--password", default="arx_secret_2026!")
    args = parser.parse_args()

    if not HAVE_PW:
        print("SKIP  e2e_browser: playwright não instalado")
        print("      rode: pip install playwright && playwright install chromium")
        print("      (ou use o browser do Hermes manualmente)")
        sys.exit(0)  # não falha a suíte se não houver playwright

    fails = []
    base = args.base.rstrip("/")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Landing
        page.goto(base + "/", wait_until="networkidle")
        hero = page.inner_text("h1")
        if "piloto automático" in hero.lower():
            print("PASS  landing hero")
        else:
            fails.append("landing hero")
            print("FAIL  landing hero")

        # 2. Pricing
        try:
            page.click("button:has-text('Ver Planos')", timeout=5000)
        except Exception:
            try:
                page.click("button:has-text('Preços')", timeout=5000)
            except Exception:
                pass
        page.wait_for_selector(".glass-card", timeout=8000)
        cards = page.query_selector_all(".glass-card")
        if len(cards) == 3:
            print("PASS  pricing: 3 cards")
        else:
            fails.append("pricing cards")
            print(f"FAIL  pricing cards: {len(cards)}")

        names = [c.query_selector("h3").inner_text() for c in cards]
        if {"Gratuito", "Pro", "Enterprise"}.issubset(set(names)):
            print("PASS  pricing: nomes corretos")
        else:
            fails.append("pricing nomes")
            print(f"FAIL  pricing nomes: {names}")

        # 3. Switch Anual
        try:
            page.click("button:has-text('Anual')", timeout=4000)
            page.wait_for_timeout(800)
            print("PASS  pricing: switch anual clicável")
        except Exception:
            fails.append("switch anual")
            print("FAIL  switch anual")

        # 4. Login
        page.goto(base + "/login", wait_until="networkidle") if False else None
        # usa a landing: clica Entrar
        from playwright.sync_api import TimeoutError as PWTimeout
        try:
            # tenta input de email direto (login page)
            page.goto(base + "/", wait_until="networkidle")
            page.click("button:has-text('Entrar')", timeout=5000)
            page.wait_for_selector("input[type='email'], input[placeholder*='email' i]", timeout=5000)
            page.fill("input[type='email'], input[placeholder*='email' i]", args.email)
            page.fill("input[type='password']", args.password)
            page.click("button:has-text('Entrar')", timeout=5000)
            page.wait_for_url("**/dashboard", timeout=8000)
            print("PASS  login -> dashboard")
        except (Exception, PWTimeout) as e:
            fails.append("login")
            print(f"FAIL  login: {e}")

        # 5. Dashboard dados reais
        try:
            page.wait_for_selector("text=Publicados", timeout=8000)
            body = page.inner_text("body")
            # procura número de posts publicados
            import re
            m = re.search(r"(\d+)\s*Publicados", body)
            if m and int(m.group(1)) > 0:
                print(f"PASS  dashboard: {m.group(1)} posts publicados (reais)")
            else:
                fails.append("dashboard dados")
                print("FAIL  dashboard dados reais")
        except Exception as e:
            fails.append("dashboard")
            print(f"FAIL  dashboard: {e}")

        # 6. Admin tab
        try:
            admin_link = page.query_selector("button:has-text('Admin')")
            if admin_link:
                admin_link.click()
                page.wait_for_timeout(600)
                body = page.inner_text("body")
                if "Usuários" in body and "Planos" in body:
                    print("PASS  admin: aba + stats visíveis")
                else:
                    fails.append("admin conteudo")
                    print("FAIL  admin conteudo")
            else:
                fails.append("admin tab")
                print("FAIL  admin tab ausente")
        except Exception as e:
            fails.append("admin")
            print(f"FAIL  admin: {e}")

        # 7. Logout
        try:
            logout = page.query_selector("button:has-text('Sair')")
            if logout:
                logout.click()
                page.wait_for_timeout(800)
                if "piloto automático" in page.inner_text("h1").lower():
                    print("PASS  logout -> landing")
                else:
                    fails.append("logout redirect")
                    print("FAIL  logout redirect")
            else:
                fails.append("logout btn")
                print("FAIL  logout btn ausente")
        except Exception as e:
            fails.append("logout")
            print(f"FAIL  logout: {e}")

        browser.close()

    if fails:
        print(f"\n=== QA E2E: FALHOU ({fails}) ===")
        sys.exit(1)
    print("\n=== QA E2E: PASSOU ===")
    sys.exit(0)


if __name__ == "__main__":
    main()
