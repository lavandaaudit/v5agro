#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AGRO.MAGAZ — 24h Live News Parser
==================================
Multi-source RSS parser for the AGRO.MAGAZ portal.
Fetches real agricultural news from 12+ sources, filters to last 24 hours,
categorises, deduplicates, and writes data/news_feed.json.

Designed to run both locally and inside a GitHub Actions cron job (hourly).
Output schema is BACKWARDS-COMPATIBLE with the existing app.js consumer.

Sources (UA):
  - latifundist.com                 (RSS)
  - superagronom.com                (RSS)
  - elevatorist.com                 (RSS)
  - Google News UA: агро, АПК, зерно, експорт, фінанси
  - Google News UA: агропромисловий комплекс

Sources (EN):
  - Google News EN: agriculture market
  - Google News EN: agritech innovation
  - Google News EN: wheat corn soybean
  - Google News EN: Ukraine grain export
  - brownfieldagnews.com            (RSS)
  - feeds.feedburner.com/agriculture (RSS)

Run:
  python3 scripts/news_parser.py
"""

import json
import re
import sys
import time
import hashlib
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse, quote_plus
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import feedparser  # type: ignore
except ImportError:
    feedparser = None  # falls back to stdlib xml.etree

import urllib.request
import urllib.error
import xml.etree.ElementTree as ET

# ==============================================================
# CONFIGURATION
# ==============================================================

OUTPUT_PATH = "data/news_feed.json"
PERIOD_HOURS = 24   # last 24 hours — matches the UI badge "(24H)"
MAX_UA_ITEMS = 60
MAX_EN_ITEMS = 80
HTTP_TIMEOUT = 15
USER_AGENT = (
    "Mozilla/5.0 (compatible; AGROMagazNewsParser/2.0; "
    "+https://lavandaaudit.github.io/agro_aaa/)"
)


def _gn_search(q: str, lang: str = "uk", country: str = "UA"):
    """Google News rss/search endpoint (broader coverage, sorted by relevance)."""
    from urllib.parse import quote_plus
    hl = f"{lang}-{country}" if lang == "en" else lang
    return (
        "https://news.google.com/rss/search?q=" + quote_plus(q) +
        f"&hl={hl}&gl={country}&ceid={country}:{lang}"
    )


def _gn_section(q: str, lang: str = "uk", country: str = "UA"):
    """Google News headlines/section/q endpoint (sorted by date, fresher results)."""
    from urllib.parse import quote_plus
    hl = f"{lang}-{country}" if lang == "en" else lang
    return (
        "https://news.google.com/rss/headlines/section/q/" + quote_plus(q) +
        f"?hl={hl}&gl={country}&ceid={country}:{lang}"
    )


UA_RSS_FEEDS = [
    # Direct agro outlets (dedicated RSS)
    ("https://latifundist.com/rss", "Агро Ринок"),
    ("https://superagronom.com/rss", "Агро Ринок"),
    ("https://elevatorist.com/rss", "Експорт та Логістика"),
    # Google News UA — HYBRID: both rss/search (broader) and section/q (fresher)
    # rss/search variants
    (_gn_search("(агро OR АПК OR зерно OR експорт OR аграрний) Україна", "uk", "UA"), "АПК України"),
    (_gn_search("зерно експорт Україна порт", "uk", "UA"), "Експорт та Логістика"),
    (_gn_search("аграрії фінанси дотапія держпідтримка Україна", "uk", "UA"), "Фінанси та Держпідтримка"),
    (_gn_search("агротех OR точне землеробство OR трактор OR комбайн Україна", "uk", "UA"), "Агротех та Техніка"),
    (_gn_search("сівба OR урожай OR ринок зерна Україна", "uk", "UA"), "Виробництво та Поля"),
    (_gn_search("агропромисловий комплекс Україна", "uk", "UA"), "АПК України"),
    # section/q variants (date-sorted)
    (_gn_section("агро Україна", "uk", "UA"), "АПК України"),
    (_gn_section("зерно Україна", "uk", "UA"), "Агро Ринок"),
    (_gn_section("сівба урожай", "uk", "UA"), "Виробництво та Поля"),
    (_gn_section("аграрії Україна", "uk", "UA"), "АПК України"),
    (_gn_section("експорт зерна Україна", "uk", "UA"), "Експорт та Логістика"),
]

EN_RSS_FEEDS = [
    # Google News EN — section/q (date-sorted, mostly fresh)
    (_gn_section("agriculture market grain prices", "en", "US"), "Commodity Markets"),
    (_gn_section("agritech precision agriculture", "en", "US"), "AgTech"),
    (_gn_section("wheat corn soybean crop harvest", "en", "US"), "Crops"),
    (_gn_section("agriculture trade export import", "en", "US"), "Trade"),
    (_gn_section("Ukraine grain export", "en", "US"), "Trade"),
    (_gn_section("agriculture farming", "en", "US"), "Crops"),
    (_gn_section("USDA crop report", "en", "US"), "Commodity Markets"),
    (_gn_section("farm equipment tractor", "en", "US"), "AgTech"),
    # Google News EN — rss/search (broader)
    (_gn_search("agriculture market prices grain", "en", "US"), "Commodity Markets"),
    (_gn_search("agritech OR precision agriculture OR smart farming", "en", "US"), "AgTech"),
    (_gn_search("wheat corn soybean crop harvest", "en", "US"), "Crops"),
    (_gn_search("agriculture trade export import tariff", "en", "US"), "Trade"),
    (_gn_search("Ukraine grain export wheat", "en", "US"), "Trade"),
    # Direct agro outlets (dedicated RSS)
    ("https://brownfieldagnews.com/feed/", "Commodity Markets"),
    ("https://feeds.feedburner.com/agriculture", "Crops"),
]

# Category keyword maps used to refine category when source gives generic news
UA_CATEGORY_KEYWORDS = [
    ("Експорт та Логістика", [
        "експорт", "імпорт", "порт", "логістик", "транзит", "вантаж",
        "коридор", "чорне море", "дунай", "solo", "рейс", "фрахт"]),
    ("Фінанси та Держпідтримка", [
        "фінанс", "кредит", "дотац", "субсид", "держпідтримк", "податк",
        "мвф", "єс", "грант", "компенсац", "відшкод"]),
    ("Агротех та Техніка", [
        "трактор", "комбайн", "агротех", "точне землероб", "drone",
        "безпілотник", "satellite", "sentinel", "ndvi", "інновац", "робот"]),
    ("Виробництво та Поля", [
        "сівба", "посів", "урожай", "збир", "оранк", "грунт", "добрив",
        "пестицид", "ззр", "поля", "вегетац", "ndvi"]),
    ("Агро Ринок", [
        "ринок", "цін", "котируван", "бірж", "matif", "cbot", "зерно",
        "пшениц", "кукурудз", "соняшник", "соя", "ріпак", "буряк"]),
]
EN_CATEGORY_KEYWORDS = [
    ("AgTech", [
        "agtech", "precision agriculture", "smart farming", "drone",
        "satellite", "ai", "robot", "iot", "sensor", "innovat"]),
    ("Crops", [
        "wheat", "corn", "soybean", "rape", "barley", "harvest", "yield",
        "crop", "planting", "seed", "soil", "fertilizer"]),
    ("Trade", [
        "export", "import", "tariff", "trade", "shipment", "logistics",
        "corridor", "sanction", "black sea", "grain deal"]),
    ("Commodity Markets", [
        "price", "market", "cbot", "matif", "futures", "commodity",
        "quote", "rally", "drop", "surge", "supply", "demand"]),
]

# ==============================================================
# HTTP FETCH
# ==============================================================

def http_get(url: str) -> bytes:
    """Fetch URL with custom UA. Returns bytes. Raises on error."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/rss+xml, application/xml, text/xml, */*",
            "Accept-Language": "uk,en;q=0.8",
        },
    )
    with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
        return resp.read()


def parse_feed_with_feedparser(url: str, default_category: str):
    """Use feedparser library. Returns list of normalized dicts."""
    if feedparser is None:
        return None
    try:
        d = feedparser.parse(
            url,
            agent=USER_AGENT,
        )
        items = []
        for e in d.entries:
            # Date
            dt = None
            for key in ("published_parsed", "updated_parsed"):
                t = getattr(e, key, None)
                if t:
                    try:
                        dt = datetime(*t[:6], tzinfo=timezone.utc)
                    except Exception:
                        pass
                    break
            if dt is None:
                # Try string fields
                for key in ("published", "updated"):
                    s = getattr(e, key, None) or (e.get(key) if isinstance(e, dict) else None)
                    if s:
                        dt = parse_date_string(s)
                        if dt:
                            break
            # Title
            title = getattr(e, "title", "") or ""
            # Link
            link = getattr(e, "link", "") or ""
            # Source
            source = None
            if hasattr(e, "source") and hasattr(e.source, "title"):
                source = e.source.title
            elif isinstance(e.get("source"), dict):
                source = e["source"].get("title")
            # Summary (not used in JSON but useful for category refinement)
            summary = getattr(e, "summary", "") or ""
            items.append({
                "title": title.strip(),
                "link": link.strip(),
                "pubDate_dt": dt,
                "pubDateStr_raw": getattr(e, "published", "") or getattr(e, "updated", ""),
                "source_raw": source,
                "summary": summary,
                "default_category": default_category,
                "feed_url": url,
            })
        return items
    except Exception as e:
        print(f"[feedparser] {url}: {e}", file=sys.stderr)
        return None


def parse_feed_with_stdlib(url: str, default_category: str):
    """Fallback: fetch and parse RSS/Atom with stdlib."""
    try:
        raw = http_get(url)
        root = ET.fromstring(raw)
    except Exception as e:
        print(f"[stdlib] {url}: {e}", file=sys.stderr)
        return []

    items = []
    # RSS 2.0
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub = (item.findtext("pubDate") or "").strip()
        # Source
        src_el = item.find("source")
        source = src_el.text if src_el is not None else None
        summary = (item.findtext("description") or "").strip()
        items.append({
            "title": title,
            "link": link,
            "pubDate_dt": parse_date_string(pub),
            "pubDateStr_raw": pub,
            "source_raw": source,
            "summary": summary,
            "default_category": default_category,
            "feed_url": url,
        })
    # Atom
    ns = {"a": "http://www.w3.org/2005/Atom"}
    atom_entries = list(root.iterfind(".//a:entry", ns)) + list(root.iterfind("entry", {}))
    for entry in atom_entries:
        title = (entry.findtext("title") or "").strip()
        link = ""
        link_el = entry.find("link")
        if link_el is not None:
            link = link_el.get("href", "") or link_el.text or ""
        pub = (entry.findtext("published") or entry.findtext("updated") or "").strip()
        source = None
        summary = (entry.findtext("summary") or entry.findtext("content") or "").strip()
        items.append({
            "title": title,
            "link": link,
            "pubDate_dt": parse_date_string(pub),
            "pubDateStr_raw": pub,
            "source_raw": source,
            "summary": summary,
            "default_category": default_category,
            "feed_url": url,
        })
    return items


def parse_feed(url: str, default_category: str):
    """Parse RSS feed. Prefers feedparser; falls back to stdlib."""
    items = parse_feed_with_feedparser(url, default_category)
    if items is None:
        items = parse_feed_with_stdlib(url, default_category)
    return items


# ==============================================================
# DATE PARSING
# ==============================================================

def parse_date_string(s: str):
    """Parse RFC 822 / ISO 8601 / various date formats. Returns tz-aware datetime or None."""
    if not s:
        return None
    s = s.strip()
    # Try RFC 822 (RSS standard)
    try:
        dt = parsedate_to_datetime(s)
        if dt is not None:
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
    except Exception:
        pass
    # Try ISO 8601 (often in Atom)
    for fmt in (
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%dT%H:%M:%SZ",
        "%Y-%m-%dT%H:%M:%S.%f%z",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%d %H:%M:%S",
        "%Y-%m-%d",
    ):
        try:
            dt = datetime.strptime(s, fmt)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            return dt
        except Exception:
            pass
    # Try fromisoformat (handles Z suffix in Python 3.11+)
    try:
        iso = s.replace("Z", "+00:00")
        dt = datetime.fromisoformat(iso)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        pass
    return None


# ==============================================================
# SOURCE & CATEGORY REFINEMENT
# ==============================================================

def extract_source(title: str, source_attr, link: str) -> str:
    """Extract source name. Priority: source attribute > title suffix > domain."""
    if source_attr and source_attr.strip():
        return source_attr.strip()
    # Google News format: "Headline - Source Name"
    if " - " in title:
        parts = title.rsplit(" - ", 1)
        if len(parts) == 2 and len(parts[1]) < 80:
            return parts[1].strip()
    # Fallback: domain
    try:
        netloc = urlparse(link).netloc.lower()
        if netloc.startswith("www."):
            netloc = netloc[4:]
        if netloc:
            return netloc
    except Exception:
        pass
    return "Джерело"


def clean_title(title: str, source: str) -> str:
    """Remove ' - Source' suffix from title if present."""
    if source and title.endswith(" - " + source):
        return title[: -(len(source) + 3)].strip()
    # Generic Google News suffix removal
    if " - " in title:
        parts = title.rsplit(" - ", 1)
        if len(parts) == 2 and len(parts[1]) < 80:
            # Check if suffix matches a known news source pattern
            suffix = parts[1].strip()
            if (
                suffix == source
                or "." in suffix  # likely a domain-ish source
                or len(suffix) < 60
            ):
                return parts[0].strip()
    return title.strip()


def refine_category(text: str, default_cat: str, keyword_map) -> str:
    """Refine category based on keyword match in title + summary."""
    text_lower = text.lower()
    for cat, kws in keyword_map:
        for kw in kws:
            if kw in text_lower:
                return cat
    return default_cat


# ==============================================================
# DEDUP
# ==============================================================

def dedup_key(item: dict) -> str:
    """Build a dedup key. Normalize title."""
    title = item.get("title", "").lower()
    # Strip non-alphanumerics
    title = re.sub(r"[^\w\s]", "", title, flags=re.UNICODE)
    title = re.sub(r"\s+", " ", title).strip()
    # If too short, also include link
    if len(title) < 30:
        link = item.get("link", "")
        return hashlib.md5((title + "|" + link).encode("utf-8")).hexdigest()
    return hashlib.md5(title.encode("utf-8")).hexdigest()


# ==============================================================
# MAIN PIPELINE
# ==============================================================

def collect_feed(url_cat_pairs):
    """Fetch many feeds in parallel. Returns list of normalized items."""
    all_items = []
    seen_links = set()

    def worker(url, cat):
        return url, parse_feed(url, cat)

    with ThreadPoolExecutor(max_workers=6) as ex:
        futures = [ex.submit(worker, url, cat) for url, cat in url_cat_pairs]
        for fut in as_completed(futures, timeout=HTTP_TIMEOUT * 3):
            try:
                url, items = fut.result(timeout=HTTP_TIMEOUT * 3)
                count = 0
                for it in items:
                    link = it.get("link", "")
                    if link and link in seen_links:
                        continue
                    if link:
                        seen_links.add(link)
                    all_items.append(it)
                    count += 1
                print(f"  [OK] {url} → {count} items")
            except Exception as e:
                print(f"  [FAIL] {fut}: {e}", file=sys.stderr)
    return all_items


def build_news_item(raw: dict, lang: str):
    """Build a final news item dict in the schema expected by app.js."""
    title_raw = raw.get("title", "")
    if not title_raw:
        return None
    link = raw.get("link", "") or "#"
    source_attr = raw.get("source_raw")
    source = extract_source(title_raw, source_attr, link)
    title = clean_title(title_raw, source)
    if not title:
        return None

    dt = raw.get("pubDate_dt")
    if dt is None:
        # Cannot use item without a date
        return None

    now = datetime.now(timezone.utc)
    hours_ago = (now - dt).total_seconds() / 3600.0
    if hours_ago < 0:
        hours_ago = 0.0

    # RFC 822 string for pubDateStr
    pub_date_str = dt.strftime("%a, %d %b %Y %H:%M:%S GMT")
    pub_date_iso = dt.isoformat()

    # Category
    default_cat = raw.get("default_category", "Агро Ринок" if lang == "ua" else "Commodity Markets")
    text_for_cat = title + " " + (raw.get("summary", "") or "")
    if lang == "ua":
        category = refine_category(text_for_cat, default_cat, UA_CATEGORY_KEYWORDS)
    else:
        category = refine_category(text_for_cat, default_cat, EN_CATEGORY_KEYWORDS)

    return {
        "title": title,
        "source": source,
        "link": link,
        "pubDate": pub_date_iso,
        "pubDateStr": pub_date_str,
        "category": category,
        "hours_ago": round(hours_ago, 2),
    }


def filter_24h(items):
    """Keep only items published within last 24 hours."""
    cutoff = datetime.now(timezone.utc) - timedelta(hours=PERIOD_HOURS)
    return [it for it in items if it.get("pubDate_dt") and it["pubDate_dt"] >= cutoff]


def sort_and_limit(items, max_items):
    """Sort by pubDate desc and limit."""
    items_sorted = sorted(
        items,
        key=lambda x: x.get("pubDate_dt") or datetime.min.replace(tzinfo=timezone.utc),
        reverse=True,
    )
    return items_sorted[:max_items]


def main():
    print("=" * 60)
    print("AGRO.MAGAZ — News Parser v2.0")
    print(f"Time (UTC): {datetime.now(timezone.utc).isoformat()}")
    print(f"Period: last {PERIOD_HOURS}h")
    print("=" * 60)

    print("\n[1/4] Fetching UA feeds...")
    ua_pairs = [(url, cat) for url, cat in UA_RSS_FEEDS]
    ua_raw = collect_feed(ua_pairs)
    print(f"  Total UA raw items: {len(ua_raw)}")

    print("\n[2/4] Fetching EN feeds...")
    en_pairs = [(url, cat) for url, cat in EN_RSS_FEEDS]
    en_raw = collect_feed(en_pairs)
    print(f"  Total EN raw items: {len(en_raw)}")

    print(f"\n[3/4] Filtering to last {PERIOD_HOURS}h window...")
    ua_24h = filter_24h(ua_raw)
    en_24h = filter_24h(en_raw)
    print(f"  UA 24h: {len(ua_24h)}")
    print(f"  EN 24h: {len(en_24h)}")

    print("\n[4/4] Building news items + dedup...")
    ua_items = []
    en_items = []
    seen_ua = set()
    seen_en = set()

    for raw in sort_and_limit(ua_24h, MAX_UA_ITEMS * 3):
        item = build_news_item(raw, "ua")
        if not item:
            continue
        k = dedup_key(item)
        if k in seen_ua:
            continue
        seen_ua.add(k)
        ua_items.append(item)
        if len(ua_items) >= MAX_UA_ITEMS:
            break

    for raw in sort_and_limit(en_24h, MAX_EN_ITEMS * 3):
        item = build_news_item(raw, "en")
        if not item:
            continue
        k = dedup_key(item)
        if k in seen_en:
            continue
        seen_en.add(k)
        en_items.append(item)
        if len(en_items) >= MAX_EN_ITEMS:
            break

    # Sort final
    ua_items.sort(key=lambda x: x["hours_ago"])
    en_items.sort(key=lambda x: x["hours_ago"])

    output = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "period": f"{PERIOD_HOURS}h",
        "ua_count": len(ua_items),
        "en_count": len(en_items),
        "ua": ua_items,
        "en": en_items,
    }

    import os
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Wrote {OUTPUT_PATH}")
    print(f"   UA: {len(ua_items)} items")
    print(f"   EN: {len(en_items)} items")
    print(f"   Updated at: {output['updated_at']}")

    # Print top 5 of each
    print("\nTop UA:")
    for it in ua_items[:5]:
        print(f"  [{it['hours_ago']:.1f}h] {it['source']}: {it['title'][:70]}")
    print("\nTop EN:")
    for it in en_items[:5]:
        print(f"  [{it['hours_ago']:.1f}h] {it['source']}: {it['title'][:70]}")


if __name__ == "__main__":
    main()
