# The Job Name Is a String Someone Else Reads — outline

Logline: chasing the simplest required-checks configuration, I found the
blog's pinned `build` check resolving against the deploy job, not the
pull-request build, and started naming workflows for when they run and
jobs for what they produce, because branch protection reads the job name
and nothing else. Opens on its opposite: three jobs all called `run`,
named for nobody, fixed by renaming them. Absorbs #394; the migration
cost is scene 4, not its own post.

**Anchors beyond the beats.** The convention as recorded in chezmoi PR
#770: workflow `name:` is the when (trigger or cadence), job `name:` is
the what as a human phrase, filename is the workflow name kebab-cased,
split files only on `on:`, job names unique repo-wide, matrix jobs
required through a stable aggregator.

## 1. Three jobs called `run` — *the opposite*

1. Each check landed in its own pull request, its own file, named for the tool *(`bats.yml`, `lychee.yml`, `pre-commit.yml`, `astro.yml`)*.
2. Three of those jobs were keyed `run` and reported as one context *(blog#255)*.
3. The infrastructure repo could pin only `build` on `main` *(alunduil-infrastructure#161)*.
4. The fix I filed was the minimal one: give the jobs distinct names *(blog#255, 2026-06-20)*.

## 2. The pin that pointed at the deploy — *the turn*

1. I went looking for the simplest required-checks configuration *(author)*.
2. The three tool files had identical `on:` and `permissions:`, so the split had never meant anything *(blog#390)*.
3. `astro.yml` and `pages.yml` both named a job `build` *(blog#390)*.
4. On a push to `main`, the pinned `build` resolved against the Pages deploy, not the pull-request build *(blog#390; infrastructure#300)*.
5. Branch protection matches the job name alone, not `Workflow / Job` *(woodland-generators#384)*.
6. The job name stopped being a label for me and became a string other systems read *(author: "ambiguity in job name has caused issues for other systems knowing the full story")*.
7. So the workflow names the when and the job names the what, unique across the repo *(blog#390, 2026-07-25; seeded by woodland-generators#383's `weekly.yml`, 2026-07-19)*.

## 3. Sixteen files become nine — *the lift*

1. chezmoi went from ten workflow files to four, and ADR 0004 reversed ADR 0002's rejection of consolidation *(chezmoi PR #435, 2026-07-26)*.
2. genshin went from sixteen files to nine *(genshin PR #1006, 2026-07-30)*.
3. Once the sensors shared one file, it showed that pre-commit.ci had never been installed there *(genshin PR #1006)*.
4. Sixteen hooks, `vale`, `reuse` and `zizmor` among them, had run in no CI job *(genshin PR #1006)*.
5. With a workflow per when, an OIDC grant can pin one workflow file *(author; infrastructure `c4428d5`, 2026-09-18, binds the blog's analytics grant to `job_workflow_ref` `pages.yml@refs/heads/main`)*.
6. Woodland-generators finished first: four contexts required, matrix behind an aggregator *(infrastructure `84a68ef`, #575, 2026-09-19; `Confirm every test leg passed`)*.

## 4. The window with no gate — *the cost*

1. Renaming a pinned context breaks the pin held in another repo *(infrastructure#300)*.
2. Terraform applies run out of band, so a swap can't be timed against the merge *(infrastructure#304)*.
3. During that gap, every other open blog pull request reports the old names and can't merge *(infrastructure#304)*.
4. So the pin was dropped first, leaving `main` with no check gate *(infrastructure#304, closed 2026-09-19)*.
5. The convention went into global guidance the same day *(chezmoi PR #770, 2026-09-19)*.
6. The next issue was its first violation: a systemd job named `run` *(chezmoi#771)*.

## 5. The grant pinned to a file that's gone — *the landing*

1. The blog's rename merged, and `pages.yml` became `cd.yml` *(PR #388, 2026-09-21)*.
2. The analytics grant still names `pages.yml` *(infrastructure `c4428d5`)*.
3. TBD: what happened when #685 wired the token exchange.
4. TBD: the blog's required checks restored, or still not *(infrastructure#300; on 2026-10-02 `main` had no status-check rule)*.

## Open

- Wait for blog#685: how the `pages.yml` pin played out lands as 5.3.
- Wait for infrastructure#300: the blog's pin restored, or not, lands as 5.4.
- "Easier to enforce workflows": what enforcement did you mean? Required workflows in rulesets, the Actions allowlist, or something else? Name the instance or cut it.
- After both land, re-run Diagnose: the landing may move from the honest gap to woodland-generators's finished state.
