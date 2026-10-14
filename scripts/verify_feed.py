#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AGRO.MAGAZ — news_feed.json validator
======================================
Called from .github/workflows/update-news.yml as a single source of truth
for the "Verify output" and "Summary" steps.

Why a separate script?
----------------------
The previous workflow embedded multi-line Python inside bash heredocs
(`python3 -c "..."`). That is brittle: any title containing a `$` or `"`
can break the bash escape sequence and the step fails with exit code 1
even though the parser itself succeeded. Moving the logic into a real
Python file eliminates that entire class of bugs.

Usage:
    python3 scripts/verify_feed.py            # verify + print stats
    python3 scripts/verify_feed.py --summary  # also append Markdown to $GITHUB_STEP_SUMMARY
"""
import json
import os
import sys
from pathlib import Path

FEED_PATH = Path("data/news_feed.json")
SUMMARY_PATH = Path(os.environ.get("GITHUB_STEP_SUMMARY") or "") if os.environ.get("GITHUB_STEP_SUMMARY") else None


def load_feed() -> dict:
    if not FEED_PATH.exists():
        print("❌ data/news_feed.json not created — aborting", file=sys.stderr)
        sys.exit(1)
    with FEED_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def print_stats(d: dict) -> None:
    print(f"  updated_at: {d.get('updated_at')}")
    print(f"  UA items:   {d.get('ua_count')}")
    print(f"  EN items:   {d.get('en_count')}")
    if (d.get("ua_count", 0) + d.get("en_count", 0)) == 0:
        print("⚠️  WARNING: zero news items — parser may be failing")


def print_summary(d: dict) -> str:
    """Return a Markdown block suitable for $GITHUB_STEP_SUMMARY."""
    lines = [
        f"- **Updated:** {d.get('updated_at')}",
        f"- **UA news (24h):** {d.get('ua_count')}",
        f"- **EN news (24h):** {d.get('en_count')}",
        "",
        "Top 5 UA:",
    ]
    for it in (d.get("ua") or [])[:5]:
        lines.append(
            "  - [{hours:.1f}h] {src}: {title}".format(
                hours=float(it.get("hours_ago", 0.0)),
                src=it.get("source", "?"),
                title=(it.get("title") or "")[:70],
            )
        )
    lines.append("")
    lines.append("Top 5 EN:")
    for it in (d.get("en") or [])[:5]:
        lines.append(
            "  - [{hours:.1f}h] {src}: {title}".format(
                hours=float(it.get("hours_ago", 0.0)),
                src=it.get("source", "?"),
                title=(it.get("title") or "")[:70],
            )
        )
    return "\n".join(lines)


def main() -> int:
    do_summary = "--summary" in sys.argv
    d = load_feed()
    print("✅ news_feed.json generated:")
    print_stats(d)
    if do_summary:
        if SUMMARY_PATH is None:
            print("⚠️  GITHUB_STEP_SUMMARY not set — skipping summary write", file=sys.stderr)
            return 0
        with SUMMARY_PATH.open("a", encoding="utf-8") as f:
            f.write("### 📰 News Refresh Summary\n\n")
            f.write(print_summary(d))
            f.write("\n")
        print("✅ Summary appended to GITHUB_STEP_SUMMARY")
    return 0


if __name__ == "__main__":
    sys.exit(main())
