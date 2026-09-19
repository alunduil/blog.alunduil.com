#!/usr/bin/env python3
"""Check the scheduling convention on current-era blog posts.

Two rules from `docs/reference/post-frontmatter.md` (Scheduling): every
post's `pubDatetime` is unique, and it publishes on a Tuesday or a Sunday.
Neither is expressible in the Astro schema — uniqueness is a property of
the collection rather than of a file, and the weekday depends on the post's
`timezone`.

Archival republishes under `src/data/blog/_<engine>/` are historical text,
not scheduled writing, and are out of scope. They drop out the same way
they drop out of the collection: on the leading underscore.

Run from the repo root:

    python3 scripts/check-post-scheduling.py
"""

import re
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import yaml

BLOG = Path("src/data/blog")
CONFIG = Path("src/config.ts")

# datetime.weekday() values. Monday through Saturday minus these two are
# unused slots, not a different kind of post.
SCHEDULED_WEEKDAYS = {1, 6}

# Published on a Monday two months before the weekday convention was
# written down. `pubDatetime` is a live-site moment that already went out
# over RSS, so it stays as posted.
WEEKDAY_EXEMPT = {BLOG / "how-i-read-eight-years-on.md"}

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
SITE_TIMEZONE = re.compile(r"^\s*timezone:\s*\"([^\"]+)\"", re.MULTILINE)


def site_timezone() -> str:
    match = SITE_TIMEZONE.search(CONFIG.read_text())
    if match is None:
        sys.exit(f"{CONFIG}: no SITE.timezone to default posts to")
    return match.group(1)


def in_scope(path: Path) -> bool:
    return not any(part.startswith("_") for part in path.relative_to(BLOG).parts)


def frontmatter(path: Path) -> dict:
    match = FRONTMATTER.match(path.read_text())
    if match is None:
        return {}
    return yaml.safe_load(match.group(1)) or {}


def main() -> int:
    default_zone = site_timezone()
    errors = []
    sharing_an_instant: dict[datetime, list[Path]] = {}

    for path in sorted(p for p in BLOG.rglob("*.md") if in_scope(p)):
        front = frontmatter(path)
        published = front.get("pubDatetime")
        if not isinstance(published, datetime) or published.tzinfo is None:
            errors.append(f"{path}: pubDatetime is missing or carries no UTC offset")
            continue

        # Aware datetimes hash and compare on the instant, so the two
        # spellings in the corpus (`…Z` and `…+01:00`) collide correctly.
        sharing_an_instant.setdefault(published, []).append(path)

        zone_name = front.get("timezone", default_zone)
        try:
            local = published.astimezone(ZoneInfo(zone_name))
        except (ZoneInfoNotFoundError, ValueError):
            errors.append(f"{path}: timezone {zone_name!r} is not an IANA zone")
            continue

        if path not in WEEKDAY_EXEMPT and local.weekday() not in SCHEDULED_WEEKDAYS:
            errors.append(
                f"{path}: publishes {local:%A %Y-%m-%d %H:%M %Z}; "
                f"use a Tuesday (tech) or a Sunday (personal)"
            )

    for instant, posts in sorted(sharing_an_instant.items()):
        if len(posts) > 1:
            errors.append(
                f"{instant:%Y-%m-%dT%H:%M:%S%z}: shared by "
                + ", ".join(str(post) for post in posts)
                + "; move one to the next open date on its weekday"
            )

    for error in sorted(errors):
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
