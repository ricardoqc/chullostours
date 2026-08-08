"""
debug_tripadvisor.py
Script de depuración: captura screenshot y guarda el HTML para analizar los selectores correctos.
"""

import asyncio
import os

DEBUG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scratch")
os.makedirs(DEBUG_DIR, exist_ok=True)

TARGET_URL = "https://www.tripadvisor.com.mx/Attraction_Review-g294314-d26719669-Reviews-Chullos_Tours-Cusco_Cusco_Region.html"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)


async def main():
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,  # Visible para debugging
            args=["--no-sandbox", "--disable-blink-features=AutomationControlled"]
        )

        context = await browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1366, "height": 900},
            locale="es-419",
            timezone_id="America/Lima",
            extra_http_headers={
                "Accept-Language": "es-419,es;q=0.9,en;q=0.8",
                "Referer": "https://www.google.com/",
            }
        )

        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            window.chrome = { runtime: {} };
        """)

        page = await context.new_page()

        print(f"Navegando a: {TARGET_URL}")
        await page.goto(TARGET_URL, wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(5000)

        # Scroll para cargar contenido lazy
        await page.evaluate("window.scrollTo(0, 500)")
        await page.wait_for_timeout(2000)

        # Screenshot
        screenshot_path = os.path.join(DEBUG_DIR, "tripadvisor_debug.png")
        await page.screenshot(path=screenshot_path, full_page=False)
        print(f"Screenshot guardado: {screenshot_path}")

        # Guardar HTML completo
        html = await page.content()
        html_path = os.path.join(DEBUG_DIR, "tripadvisor_debug.html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"HTML guardado: {html_path} ({len(html)} chars)")

        # Buscar posibles selectores de reviews
        selectors_to_test = [
            '[data-automation="reviewCard"]',
            '.review-container',
            '[class*="ReviewCard"]',
            '[class*="review_card"]',
            '[class*="listItem"]',
            'div[data-test-target="reviews-tab"]',
            '[class*="reviewsList"]',
            'div[class*="review"]',
            'article',
        ]

        print("\nBuscando selectores validos...")
        for sel in selectors_to_test:
            try:
                elements = await page.query_selector_all(sel)
                if elements:
                    print(f"  ENCONTRADO: '{sel}' -> {len(elements)} elementos")
                    # Obtener clases del primer elemento
                    cls = await elements[0].get_attribute('class')
                    print(f"    Clase: {cls[:100] if cls else 'N/A'}")
            except Exception as e:
                print(f"  Error con '{sel}': {e}")

        # Obtener todos los data-automation attributes presentes
        data_automations = await page.evaluate("""
            () => {
                const els = document.querySelectorAll('[data-automation]');
                const values = new Set();
                els.forEach(el => values.add(el.getAttribute('data-automation')));
                return [...values].sort();
            }
        """)
        print(f"\nTodos los data-automation encontrados ({len(data_automations)}):")
        for da in data_automations:
            print(f"  - {da}")

        await browser.close()
        print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
