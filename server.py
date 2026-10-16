#!/usr/bin/env python3
"""Épure Botanique — Botanical Hair & Skin Care Store.

Serves the landing page with server-side injection of structured data
(JSON-LD), product cards, and FAQ — all from JSON data files.
Features endpoints for newsletter double opt-in and privacy-friendly analytics.
"""

import json
import hmac
import os
import re
import secrets
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
DATA.mkdir(exist_ok=True)

PORT = int(os.environ.get("PORT", "4175"))
SITE_URL = os.environ.get("SITE_URL", f"http://localhost:{PORT}").rstrip("/")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
ALLOWED_EVENTS = {"pageview", "add_to_bag", "newsletter_subscribe", "cta_click"}

_lock = threading.Lock()
_rate = {}


def load_json(name):
    with open(DATA / name, encoding="utf-8") as f:
        return json.load(f)


SITE = load_json("site.json")
PRODUCTS = load_json("products.json")


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


def render_card(p):
    tag = ""
    if p.get("tag"):
        cls = "tag tag--gold" if p.get("tagGold") else "tag"
        tag = f'<span class="{cls}">{esc(p["tag"])}</span>'
    price = f'{p.get("currencySymbol", "€")}{p["price"]}'
    size_badge = f'<span class="card-size">{esc(p.get("size", ""))}</span>' if p.get("size") else ""
    return (
        f'<article class="card" data-reveal data-product-id="{esc(p["id"])}" data-category="{esc(p.get("category", "skin"))}">\n'
        f'  <div class="card-visual">\n'
        f'    {tag}\n'
        f'    <svg class="bottle" style="--liquid:{p["liquid"]}" aria-hidden="true">'
        f'<use href="#flacon-care"></use></svg>\n'
        f'  </div>\n'
        f'  <div class="card-body">\n'
        f'    <div class="card-meta">\n'
        f'      <p class="card-family" data-product-family>{esc(p["family"])}</p>\n'
        f'      {size_badge}\n'
        f'    </div>\n'
        f'    <button class="card-title" type="button" data-product-view="{esc(p["id"])}" aria-label="View details for {esc(p["name"])}"><h3 data-product-name>{esc(p["name"])}</h3></button>\n'
        f'    <p class="card-note" data-product-notes>{esc(p["notes"])}</p>\n'
        f'    <div class="card-foot">\n'
        f'      <span class="price">{price}</span>\n'
        f'      <button class="add-btn" type="button" data-add="{esc(p["name"])}" aria-label="Add {esc(p["name"])} to bag" data-add-id="{esc(p["id"])}" '
        f'data-add-price="{p["price"]}" '
        f'data-add-currency="{esc(p.get("currencySymbol", "€"))}">\n'
        f'        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        f'stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>\n'
        f'        <span data-i18n="product.add">Add</span>\n'
        f'      </button>\n'
        f'    </div>\n'
        f'  </div>\n'
        f'</article>'
    )


def render_faq():
    items = []
    for f in SITE.get("faq", []):
        items.append(
            f'<details class="faq-item">\n'
            f'<summary data-faq-question="{len(items)}">{esc(f["q"])} <span class="plus" aria-hidden="true">+</span></summary>\n'
            f'  <p class="faq-answer" data-faq-answer="{len(items)}">{esc(f["a"])}</p>\n'
            f'</details>'
        )
    return "\n".join(items)


def build_structured_data():
    org = {
        "@type": "Organization", "@id": f"{SITE_URL}/#org",
        "name": SITE["name"], "url": f"{SITE_URL}/",
        "foundingDate": SITE.get("foundingDate"),
        "founder": {"@type": "Person", "name": SITE.get("founder")},
    }
    website = {
        "@type": "WebSite", "@id": f"{SITE_URL}/#website",
        "url": f"{SITE_URL}/", "name": SITE.get("title", SITE["name"]),
        "publisher": {"@id": f"{SITE_URL}/#org"},
    }
    faq = {
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": f["q"],
             "acceptedAnswer": {"@type": "Answer", "text": f["a"]}}
            for f in SITE.get("faq", [])
        ],
    }
    products = []
    for p in PRODUCTS:
        products.append({
            "@type": "Product",
            "@id": f"{SITE_URL}/#product-{p['id']}",
            "name": p["name"],
            "description": f"{p['notes']} — {p.get('size', 'treatment')}.",
            "brand": {"@type": "Brand", "name": SITE["name"]},
            "category": "Hair & Skin Care",
            "offers": {
                "@type": "Offer",
                "url": f"{SITE_URL}/#collection",
                "priceCurrency": p.get("currency", "EUR"),
                "price": f"{p['price']:.2f}",
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition",
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": str(p.get("rating", 4.9)),
                "reviewCount": str(p.get("reviews", 0)),
            },
        })
    graph = [org, website, faq] + products
    return json.dumps({"@context": "https://schema.org", "@graph": graph},
                      ensure_ascii=False)


def render_index():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    html = html.replace("__SITE_URL__", SITE_URL)
    html = html.replace("<!--__STRUCTURED_DATA__-->",
                        '<script type="application/ld+json">' +
                        build_structured_data() + "</script>")
    html = html.replace("<!--__PRODUCTS__-->", "\n".join(render_card(p) for p in PRODUCTS))
    html = html.replace("<!--__FAQ__-->", render_faq())
    html = html.replace("<!--__PRODUCT_DATA__-->",
                        '<script>window.EPURE_PRODUCTS=' + json.dumps(PRODUCTS, ensure_ascii=False) + ';</script>')
    return html


def read_subscribers():
    path = DATA / "subscribers.json"
    if not path.exists():
        return []
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def write_subscribers(subs):
    with open(DATA / "subscribers.json", "w", encoding="utf-8") as f:
        json.dump(subs, f, ensure_ascii=False, indent=2)


def append_event(event):
    with open(DATA / "events.jsonl", "a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")


def is_rate_limited(ip, limit=5, window=60):
    now = time.time()
    with _lock:
        times = [t for t in _rate.get(ip, []) if now - t < window]
        _rate[ip] = times
        if len(times) >= limit:
            return True
        times.append(now)
        return False


MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
}


class Handler(BaseHTTPRequestHandler):
    server_version = "EpureBotanique/1.0"

    def _send(self, code, body, ctype="application/json; charset=utf-8", cache="no-cache"):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache)
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.send_header("X-Frame-Options", "SAMEORIGIN")
        self.end_headers()
        self.wfile.write(body)

    def _json(self, code, obj):
        self._send(code, json.dumps(obj, ensure_ascii=False))

    def _read_body(self, limit=8192):
        try:
            length = int(self.headers.get("Content-Length", 0))
        except (TypeError, ValueError):
            return None
        if length <= 0 or length > limit:
            return None
        return self.rfile.read(length)

    def log_message(self, fmt, *args):
        pass

    def do_GET(self):
        path = self.path.split("?")[0]

        if path in ("/", "/index.html"):
            self._send(200, render_index(), "text/html; charset=utf-8")
            return

        if path == "/robots.txt":
            body = f"User-agent: *\nAllow: /\nSitemap: {SITE_URL}/sitemap.xml\n"
            self._send(200, body, "text/plain; charset=utf-8")
            return

        if path == "/sitemap.xml":
            today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            body = (
                '<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                f'  <url><loc>{SITE_URL}/</loc><lastmod>{today}</lastmod>'
                '<changefreq>monthly</changefreq><priority>1.0</priority></url>\n'
                '</urlset>\n'
            )
            self._send(200, body, "application/xml; charset=utf-8")
            return

        if path == "/api/stats":
            supplied_token = self.headers.get("X-Admin-Token", "")
            if ADMIN_TOKEN and not hmac.compare_digest(supplied_token, ADMIN_TOKEN):
                self._json(401, {"ok": False, "error": "unauthorized"})
                return
            self._json(200, get_stats())
            return

        if path == "/api/subscribe/confirm":
            self._confirm_subscribe()
            return

        self._serve_static(path)

    def do_POST(self):
        path = self.path.split("?")[0]
        if path == "/api/subscribe":
            self._subscribe()
        elif path == "/api/event":
            self._event()
        else:
            self._json(404, {"ok": False, "error": "not found"})

    def _serve_static(self, path):
        rel = path.lstrip("/")
        if not rel:
            rel = "index.html"
        target = (ROOT / rel).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            self._json(404, {"ok": False, "error": "not found"})
            return
        if not target.is_file():
            self._json(404, {"ok": False, "error": "not found"})
            return
        ext = target.suffix.lower()
        ctype = MIME.get(ext, "application/octet-stream")
        cache = "public, max-age=3600" if ext in (".css", ".js", ".png", ".svg", ".ico") else "no-cache"
        self._send(200, target.read_bytes(), ctype, cache=cache)

    def _subscribe(self):
        raw = self._read_body()
        if raw is None:
            self._json(400, {"ok": False, "error": "invalid request"})
            return
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            self._json(400, {"ok": False, "error": "invalid JSON"})
            return

        ip = self.client_address[0]
        if is_rate_limited(ip):
            self._json(429, {"ok": False, "error": "Too many requests. Please try again shortly."})
            return

        if data.get("website"):
            self._json(200, {"ok": True, "message": "Thanks!"})
            return

        email = (data.get("email") or "").strip().lower()
        if not EMAIL_RE.match(email) or len(email) > 254:
            self._json(400, {"ok": False, "error": "Please enter a valid email address."})
            return
        if not data.get("consent"):
            self._json(400, {"ok": False, "error": "Please agree to the privacy policy."})
            return

        with _lock:
            subs = read_subscribers()
            if any(s["email"] == email for s in subs):
                self._json(200, {"ok": True, "message": "You're already subscribed."})
                return
            token = secrets.token_urlsafe(24)
            subs.append({
                "email": email,
                "token": token,
                "status": "pending",
                "ts": datetime.now(timezone.utc).isoformat(),
            })
            write_subscribers(subs)

        confirmation_url = f"{SITE_URL}/api/subscribe/confirm?token={token}"
        self._json(200, {
            "ok": True,
            "message": "Use the confirmation link to finish your subscription.",
            "confirmation_url": confirmation_url,
        })

    def _confirm_subscribe(self):
        query = self.path.split("?", 1)[1] if "?" in self.path else ""
        token = parse_qs(query).get("token", [""])[0]
        if not token:
            self._send(400, "Missing token.", "text/plain; charset=utf-8")
            return
        with _lock:
            subs = read_subscribers()
            for s in subs:
                if s.get("token") == token:
                    s["status"] = "subscribed"
                    write_subscribers(subs)
                    self._send(200, CONFIRM_OK, "text/html; charset=utf-8")
                    return
        self._send(404, "Invalid or expired link.", "text/plain; charset=utf-8")

    def _event(self):
        raw = self._read_body()
        if raw is None:
            self._json(400, {"ok": False})
            return
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            self._json(400, {"ok": False})
            return
        name = data.get("n", "")
        if name not in ALLOWED_EVENTS:
            self._json(400, {"ok": False})
            return
        if is_rate_limited(self.client_address[0], limit=120):
            self._json(429, {"ok": False, "error": "Too many requests"})
            return

        def text_value(key, limit):
            value = data.get(key, "")
            return value[:limit] if isinstance(value, str) else ""

        event = {
            "n": name,
            "p": text_value("p", 200),
            "r": text_value("r", 200),
            "label": text_value("label", 100),
            "product": text_value("product", 100),
            "ts": datetime.now(timezone.utc).isoformat(),
        }
        with _lock:
            append_event(event)
        self._json(200, {"ok": True})


CONFIRM_OK = (
    "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>"
    "<meta name='viewport' content='width=device-width, initial-scale=1'>"
    "<title>Subscription confirmed</title></head>"
    "<body style='font-family:Georgia,serif;background:#f9f7f2;color:#1f241e;"
    "display:grid;place-items:center;min-height:100vh;text-align:center;margin:0'>"
    "<div><h1 style='font-weight:500'>Welcome to Épure Botanique.</h1>"
    "<p style='color:#5c665a'>Your subscription is confirmed.</p></div></body></html>"
)


def get_stats():
    events = []
    path = DATA / "events.jsonl"
    if path.exists():
        for line in path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line:
                try:
                    events.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    counts = {}
    for e in events:
        counts[e.get("n", "?")] = counts.get(e.get("n", "?"), 0) + 1
    return {"total": len(events), "counts": counts, "recent": events[-20:]}


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Épure Botanique serving on http://localhost:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
