import asyncio
import logging

from playwright.async_api import Page, async_playwright

from app.core.config import settings

logger = logging.getLogger("pdf_render")

PREFERRED_CHANNELS = ["msedge", "chrome", "chromium"]
_browser = None
_browser_channel = None
_playwright = None


async def _get_browser():
    global _browser, _browser_channel, _playwright
    if _browser is not None:
        return _browser
    _playwright = await async_playwright().start()
    last_error: Exception | None = None
    for channel in PREFERRED_CHANNELS:
        try:
            if channel in ("msedge", "chrome"):
                _browser = await _playwright.chromium.launch(channel=channel)
            else:
                _browser = await _playwright.chromium.launch()
            _browser_channel = channel
            logger.info("Launched PDF browser via channel=%s", channel)
            return _browser
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            logger.warning("Failed to launch browser channel=%s: %s", channel, exc)
    raise RuntimeError(f"Could not launch any PDF browser: {last_error}")


def _frontend_origin() -> str:
    return settings.frontend_url.rstrip("/")


async def render_invoice_pdf(frontend_url: str, invoice_id: str, token: str) -> bytes:
    browser = await _get_browser()
    context = await browser.new_context()
    try:
        await context.add_cookies(
            [
                {
                    "name": settings.auth_cookie_name,
                    "value": token,
                    "url": _frontend_origin(),
                    "httpOnly": True,
                    "sameSite": "Lax",
                }
            ]
        )
        page: Page = await context.new_page()
        url = f"{frontend_url}/print/{invoice_id}"
        await page.goto(url, wait_until="load", timeout=60000)
        await page.wait_for_selector("[data-pdf-ready]", timeout=30000)
        await page.wait_for_timeout(200)
        pdf = await page.pdf(
            format="A4",
            print_background=True,
            display_header_footer=False,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        return pdf
    finally:
        await context.close()


async def render_invoice_pdf_for(invoice_id: str, token: str) -> bytes:
    return await render_invoice_pdf(settings.frontend_url, invoice_id, token)


def render_invoice_pdf_sync(frontend_url: str, invoice_id: str, token: str) -> bytes:
    return asyncio.run(render_invoice_pdf(frontend_url, invoice_id, token))
