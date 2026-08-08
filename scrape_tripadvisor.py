"""
scrape_tripadvisor.py
Scraper de reseñas de TripAdvisor para Chullos Tours usando Playwright.
Guarda los resultados en data/reviews_tripadvisor.json
"""

import asyncio
import json
import re
import os
from datetime import datetime
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeout

TARGET_URL = "https://www.tripadvisor.com.mx/Attraction_Review-g294314-d26719669-Reviews-Chullos_Tours-Cusco_Cusco_Region.html"
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "reviews_tripadvisor.json")

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)


async def scroll_and_wait(page, delay=1500):
    await page.evaluate("""
        () => {
            return new Promise(resolve => {
                let totalHeight = 0;
                const distance = 300;
                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= document.body.scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        }
    """)
    await page.wait_for_timeout(delay)


async def extract_reviews_from_page(page) -> list:
    reviews = []

    try:
        await page.wait_for_selector('[data-automation="reviewCard"]', timeout=15000)
    except PlaywrightTimeout:
        print("  Intentando selector alternativo...")
        try:
            await page.wait_for_selector('.review-container, [class*="ReviewCard"]', timeout=10000)
        except PlaywrightTimeout:
            print("  No se pudieron cargar las resenas en esta pagina.")
            return []

    # Expandir todos los "Leer mas"
    read_more_buttons = await page.query_selector_all('[data-automation="expandReview"], .read_more, [class*="readMore"]')
    for btn in read_more_buttons:
        try:
            await btn.click()
            await page.wait_for_timeout(300)
        except Exception:
            pass

    reviews_data = await page.evaluate("""
        () => {
            const results = [];

            let cards = document.querySelectorAll('[data-automation="reviewCard"]');
            if (cards.length === 0) cards = document.querySelectorAll('.review-container');
            if (cards.length === 0) cards = document.querySelectorAll('[class*="ReviewCard_card"]');

            cards.forEach((card) => {
                try {
                    const nameEl = card.querySelector('[class*="memberOverlayLink"], [data-automation="authorName"], a[href*="Profile"]');
                    const name = nameEl ? nameEl.innerText.trim() : 'Anonimo';

                    let rating = null;
                    const ratingEl = card.querySelector('[aria-label*="estrellas"], [aria-label*="stars"], [aria-label*="de 5"], svg title');
                    if (ratingEl) {
                        const ratingText = ratingEl.getAttribute('aria-label') || ratingEl.innerText || '';
                        const match = ratingText.match(/(\\d+(\\.\\d+)?)/);
                        if (match) rating = parseFloat(match[1]);
                    }
                    if (!rating) {
                        const bubbles = card.querySelectorAll('[class*="bubble_fill"]');
                        if (bubbles.length > 0) {
                            const ratingClass = bubbles[0].className;
                            const m = ratingClass.match(/bubble_(\\d+)/);
                            if (m) rating = parseInt(m[1]) / 10;
                        }
                    }

                    const titleEl = card.querySelector('[data-automation="reviewTitle"], .noQuotes, span[class*="title"]');
                    const title = titleEl ? titleEl.innerText.trim() : '';

                    const textEl = card.querySelector('[data-automation="reviewText"] span, [class*="reviewText"], .partial_entry');
                    const text = textEl ? textEl.innerText.trim() : '';

                    const dateEl = card.querySelector('[data-automation="reviewedDate"], .ratingDate, time');
                    const date = dateEl ? (dateEl.getAttribute('datetime') || dateEl.innerText.trim()) : '';

                    const locationEl = card.querySelector('[class*="memberBadging"] .location, [class*="hometown"]');
                    const location = locationEl ? locationEl.innerText.trim() : '';

                    const tripTypeEl = card.querySelector('[class*="tripType"], [data-automation="tripType"]');
                    const tripType = tripTypeEl ? tripTypeEl.innerText.trim() : '';

                    if (name || text) {
                        results.push({ name, rating, title, text, date, location, tripType });
                    }
                } catch(e) {}
            });

            return results;
        }
    """)

    return reviews_data


async def get_next_page_url(page):
    next_btn = await page.query_selector('a[data-automation="page-next"], a.next, a[aria-label="Siguiente pagina"]')
    if next_btn:
        href = await next_btn.get_attribute('href')
        if href:
            base = "https://www.tripadvisor.com.mx"
            return base + href if href.startswith('/') else href
    return None


async def scrape_all_reviews():
    all_reviews = []
    page_num = 1
    current_url = TARGET_URL

    async with async_playwright() as p:
        print("Lanzando navegador Chromium...")
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-blink-features=AutomationControlled",
                "--disable-dev-shm-usage",
            ]
        )

        context = await browser.new_context(
            user_agent=USER_AGENT,
            viewport={"width": 1366, "height": 768},
            locale="es-419",
            timezone_id="America/Lima",
            extra_http_headers={
                "Accept-Language": "es-419,es;q=0.9,en;q=0.8",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Referer": "https://www.google.com/",
            }
        )

        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            window.chrome = { runtime: {} };
        """)

        page = await context.new_page()

        while current_url:
            print(f"Pagina {page_num}: {current_url}")

            try:
                await page.goto(current_url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(2500)
                await scroll_and_wait(page)

                for popup_sel in ['button[aria-label="Cerrar"]', 'button[id*="close"]', '.ui_close_x']:
                    try:
                        popup = await page.query_selector(popup_sel)
                        if popup:
                            await popup.click()
                            await page.wait_for_timeout(500)
                    except Exception:
                        pass

                page_reviews = await extract_reviews_from_page(page)

                if not page_reviews:
                    print(f"Pagina {page_num} sin resenas. Deteniendo.")
                    break

                print(f"  {len(page_reviews)} resenas en pagina {page_num}")
                all_reviews.extend(page_reviews)

                next_url = await get_next_page_url(page)
                if next_url and next_url != current_url:
                    current_url = next_url
                    page_num += 1
                    await page.wait_for_timeout(2000)
                else:
                    print("No hay mas paginas.")
                    break

            except Exception as e:
                print(f"Error en pagina {page_num}: {e}")
                break

        await browser.close()

    return all_reviews


async def main():
    print("=" * 60)
    print("  Chullos Tours - TripAdvisor Review Scraper")
    print("=" * 60)

    reviews = await scrape_all_reviews()

    if not reviews:
        print("No se extrajeron resenas. TripAdvisor puede haber bloqueado la peticion.")
    else:
        output = {
            "source": "TripAdvisor",
            "business": "Chullos Tours",
            "profile_url": TARGET_URL,
            "total_reviews_scraped": len(reviews),
            "scraped_at": datetime.now().isoformat(),
            "reviews": reviews
        }

        os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
        with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)

        print(f"Listo! {len(reviews)} resenas guardadas en: {OUTPUT_PATH}")

        print("Preview (primeras 3 resenas):")
        for i, r in enumerate(reviews[:3], 1):
            print(f"  [{i}] {r.get('rating', '?')} estrellas - {r.get('name', '?')}")
            print(f"      Titulo: {r.get('title', '')[:60]}")
            print(f"      Texto: {r.get('text', '')[:100]}")


if __name__ == "__main__":
    asyncio.run(main())
