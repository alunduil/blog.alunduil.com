#!/usr/bin/env python3
"""Check the scheduling convention on current-era blog posts.

Two rules from `docs/reference/post-frontmatter.md` (Scheduling): every
post's `pubDatetime` is unique, and it publishes on a Tuesday or a Sunday.
Uniqueness is a property of the collection, so the Astro schema, which
validates one file at a time, can't carry it.

Archival republishes under `src/data/blog/_<engine>/` are historical text,
not scheduled writing. Both this check and the collection skip them on the
leading underscore.

Run from the repo root:

    python3 scripts/check-post-scheduling.py
"""

import calendar
import re
import sys
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import yaml

BLOG = Path("src/data/blog")
CONFIG = Path("src/config.ts")

SCHEDULED_WEEKDAYS = {calendar.TUESDAY, calendar.SUNDAY}

# Published on a Monday, two months before the weekday convention existed.
# Its pubDatetime already went out over RSS, so it stays as posted.
WEEKDAY_EXEMPT = {BLOG / "how-i-read-eight-years-on.md"}

FRONTMATTER = re.compile(r"\A---\n(.*?)\n---\n", re.DOTALL)
SITE_TIMEZONE = re.compile(r"^\s*timezone:\s*\"([^\"]+)\"", re.MULTILINE)


@dataclass(frozen=True)
class Post:
    path: Path
    instant: datetime
    # None when `timezone` names no zone that resolves. A collision is still
    # caught in that case, because it compares instants; only the weekday
    # needs the local reading.
    local: datetime | None


def site_timezone() -> str | None:
    match = SITE_TIMEZONE.search(CONFIG.read_text())
    return match.group(1) if match else None


def in_scope(path: Path) -> bool:
    return not any(part.startswith("_") for part in path.relative_to(BLOG).parts)


def frontmatter(path: Path) -> dict:
    match = FRONTMATTER.match(path.read_text())
    if match is None:
        return {}
    return yaml.safe_load(match.group(1)) or {}


def read_posts(default_zone: str) -> tuple[list[Post], list[str]]:
    posts: list[Post] = []
    errors: list[str] = []

    for path in sorted(p for p in BLOG.rglob("*.md") if in_scope(p)):
        front = frontmatter(path)
        published = front.get("pubDatetime")
        if not isinstance(published, datetime) or published.tzinfo is None:
            errors.append(f"{path}: pubDatetime is missing or carries no UTC offset")
            continue

        # 08:00 local can land on a different day in UTC, so the weekday is
        # only right when read in the post's own zone.
        zone_name = front.get("timezone", default_zone)
        try:
            local = published.astimezone(ZoneInfo(zone_name))
        except (ZoneInfoNotFoundError, ValueError):
            errors.append(f"{path}: timezone {zone_name!r} is not an IANA zone")
            local = None

        posts.append(Post(path, published, local))

    return posts, errors


def weekday_errors(posts: list[Post]) -> list[str]:
    return [
        f"{post.path}: publishes {post.local:%A %Y-%m-%d %H:%M %Z}; "
        f"use a Tuesday (tech) or a Sunday (personal)"
        for post in posts
        if post.local is not None
        and post.path not in WEEKDAY_EXEMPT
        and post.local.weekday() not in SCHEDULED_WEEKDAYS
    ]


def collision_errors(posts: list[Post]) -> list[str]:
    # Aware datetimes hash and compare on the instant, so the two spellings
    # in the corpus (`…Z` and `…+01:00`) group together.
    sharing: dict[datetime, list[Path]] = defaultdict(list)
    for post in posts:
        sharing[post.instant].append(post.path)

    return [
        f"{instant:%Y-%m-%dT%H:%M:%S%z}: shared by "
        + ", ".join(str(path) for path in paths)
        + "; move one to the next open date on its weekday"
        for instant, paths in sorted(sharing.items())
        if len(paths) > 1
    ]


def main() -> int:
    default_zone = site_timezone()
    if default_zone is None:
        print(f"{CONFIG}: no SITE.timezone to default posts to", file=sys.stderr)
        return 1

    posts, errors = read_posts(default_zone)
    errors += weekday_errors(posts) + collision_errors(posts)

    for error in sorted(errors):
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
