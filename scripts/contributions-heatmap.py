#!/usr/bin/env python3
"""Regenerate the contributions heatmap for "The Tool Was Never the Lever".

Fetches the author's GitHub contribution calendar (GraphQL, one year per
request), buckets it by week, and renders a weeks heatmap to the post's
asset path.

Run from the repo root:

    python3 scripts/contributions-heatmap.py

Requires an authenticated `gh` CLI (the contribution calendar is GraphQL
only, no REST) and matplotlib. The window is hardcoded so the figure stays
matched to the post's fixed dates; bump DATA_THROUGH / YEAR_END to refresh.
"""
import datetime
import json
import subprocess

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import numpy.ma as ma  # noqa: E402
from matplotlib.colors import PowerNorm  # noqa: E402

LOGIN = "alunduil"
YEAR_START = 2010
YEAR_END = 2026
DATA_THROUGH = datetime.date(2026, 6, 30)  # weeks after this render blank
GAMMA = 0.45  # square-root-ish colour scale: decade stays visible vs 2026
OUTPUT = "public/assets/i-built-the-machine-twice-contributions.svg"

QUERY = (
    "query($login:String!,$from:DateTime!,$to:DateTime!){"
    "user(login:$login){contributionsCollection(from:$from,to:$to){"
    "contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}"
)


def fetch_daily():
    """Return {date-iso: count} across the hardcoded year range."""
    daily = {}
    for year in range(YEAR_START, YEAR_END + 1):
        result = subprocess.run(
            [
                "gh", "api", "graphql",
                "-f", f"login={LOGIN}",
                "-f", f"from={year}-01-01T00:00:00Z",
                "-f", f"to={year}-12-31T23:59:59Z",
                "-f", f"query={QUERY}",
            ],
            capture_output=True,
            text=True,
            check=True,
        )
        calendar = json.loads(result.stdout)["data"]["user"][
            "contributionsCollection"
        ]["contributionCalendar"]
        for week in calendar["weeks"]:
            for day in week["contributionDays"]:
                daily[day["date"]] = day["contributionCount"]
    return daily


def build_grid(daily):
    """Bucket daily counts into a years x 53-weeks masked grid."""
    years = list(range(YEAR_START, YEAR_END + 1))
    grid = np.ma.masked_all((len(years), 53))
    for row, year in enumerate(years):
        for week in range(53):
            start = datetime.date(year, 1, 1) + datetime.timedelta(days=week * 7)
            total = 0
            seen = False
            for offset in range(7):
                day = start + datetime.timedelta(days=offset)
                if day.year != year or day > DATA_THROUGH:
                    continue
                seen = True
                total += daily.get(day.isoformat(), 0)
            if seen:
                grid[row, week] = total
    return years, grid


def render(years, grid):
    cmap = plt.cm.Greens.copy()
    cmap.set_bad("#ffffff")
    norm = PowerNorm(gamma=GAMMA, vmin=0, vmax=ma.max(grid))
    fig, ax = plt.subplots(figsize=(11, 5.4))
    mesh = ax.pcolormesh(
        grid, cmap=cmap, norm=norm, edgecolors="#e8e8e8", linewidth=0.4
    )
    ax.set_aspect("equal")
    ax.invert_yaxis()
    ax.set_yticks(np.arange(len(years)) + 0.5)
    ax.set_yticklabels([str(y) for y in years], fontsize=8)
    ax.set_xticks([2, 6, 10, 15, 19, 24, 28, 32, 37, 41, 45, 50])
    ax.set_xticklabels(list("JFMAMJJASOND"), fontsize=8)
    ax.tick_params(length=0)
    ax.xaxis.tick_top()
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.set_title("GitHub contributions by week, 2010–2026", pad=14, fontsize=11)
    bar = fig.colorbar(
        mesh, ax=ax, orientation="horizontal", pad=0.05, fraction=0.04,
        ticks=[0, 50, 200, 500, 1000],
    )
    bar.ax.set_xticklabels(["0", "50", "200", "500", "1000"], fontsize=8)
    bar.outline.set_visible(False)
    fig.tight_layout()
    fig.savefig(OUTPUT, bbox_inches="tight")


def strip_trailing_whitespace(path):
    """matplotlib emits trailing whitespace; keep the asset CI-clean."""
    with open(path) as handle:
        lines = handle.readlines()
    with open(path, "w") as handle:
        handle.writelines(line.rstrip() + "\n" for line in lines)


def main():
    daily = fetch_daily()
    years, grid = build_grid(daily)
    render(years, grid)
    strip_trailing_whitespace(OUTPUT)
    print(f"wrote {OUTPUT} (weekly max {int(ma.max(grid))})")


if __name__ == "__main__":
    main()
