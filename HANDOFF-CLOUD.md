# Handoff — cloud session, 6 October 2026

Ten commits on `record-votes`, on top of `9d517bb One form, not two`. Nothing is
merged. Nothing is pushed. Nothing on `newspeakhouse-lab-2026/constitutional-record`
was touched, read or written.

## The short version

| | |
|---|---|
| **Done** | All eleven steps in the brief. Each is one commit, in order, and each commit message says what it corrects and why. |
| **Verified** | The five test commands, on every step. `node --check` on the inline script and a control-byte scan on every change to `docs/index.html`. The page rendered in Chromium at 1280px and 375px in both themes. Contrast computed, not eyeballed. The preview harness driven against a stubbed GitHub. |
| **Not verified** | Anything involving live GitHub. This session had no API access, no `gh` token and no git remote. See *What I could not verify*. |
| **Not done** | Nothing in the brief was skipped. Things found along the way and deliberately left alone are under *Found, not fixed*. |

## The commits

| | |
|---|---|
| `dab7bb3` | Step 1 — the whole workflow body runs in one `try`, opened after `brokenTooling` so the catch can use it. `invariants()` now guards `b` as well as `a`. `ACTED` moved inside and checked, because `toISOString()` on an unreadable `created_at` threw a RangeError that took the run down in silence. |
| `cc538da` | Step 2 — the pull request lookup and the vote file read bind their error and branch on `e.status === 404`. A 403, 429 or 500 no longer tells a member "there is no pull request #14" or "no vote is open". The stubs that threw `new Error('404')` with no `.status` are fixed, and the status is now a parameter. |
| `451a324` | Step 3 — the page caches an empty vote only on a true 404. Any other failure is counted, left uncached, and named in the stale-snapshot banner. `Unreadable` carries the HTTP status so a caller can tell the two apart. |
| `c841040` | Step 4 — the row says so when the countdown (from the `opened:` label) and the file's `Closes:` line disagree. It shows both and names the file as the one the workflow enforces. It does not prefer either. |
| `2596b68` | Step 5 — once the window has closed the action is replaced by what happens next: a Record Keeper writes the result in and verifies it before merging (§3), with the file linked for reading. |
| `5caa759` | Step 6 — the layout. See below. |
| `c890306` | Step 7 — every message offering a hand edit names the radio: commit directly to the proposal's branch, **not** "create a new branch and start a pull request". Workflow, `CONTRIBUTING.md`, and the dashboard. |
| `2139b59` | Step 8 — `CONTRIBUTING.md`, `AGENTS.md`, the inventory in `rule-drafting-tools.md`, and `rule-recording-votes.md`'s `Observed by:` line. |
| `bfecd59` | Step 9 — `allowed_merge_methods` is `["merge"]`. |
| `1589797` | Step 11 — `tools/preview/build.py`. |

## Step 6, in more detail

The vote on a row was one run of about 300 characters joined by middots. It is
now four things, each its own line: where the vote stands, who is missing, what
counts as a yes, and only then the action — which now follows the sentence it
depends on rather than preceding it by three clauses.

- **The action.** Measured in the browser: 165×36 at 1280px, 321×44 full-width
  at 375px. Was 112×13. WCAG 2.5.8 wants 24px, 2.5.5 wants 44px.
- **Distance to the threshold.** The head line names the gap in words ("8 of the
  10 needed · 2 more preferences") and a bar shows it. The bar is an `--accent`
  outline with the reached part filled in `--accent`, not a tinted track: a track
  would have to clear 3:1 against both `--bg` and `--accent`, and `--accent` is
  only 6.06:1 from `--bg`, so there is no room between them. No new token was
  needed. `aria-hidden`, because the numbers are in words directly above.
- **Hierarchy.** `.rem` dropped from 600/.85rem to 500/.8rem. Its colours stay —
  `--urgent` and `--soon` on a countdown are exactly what the style block
  reserves them for.
- **`aria-live`** moved off `<main>` onto `#stamp`, which both completion paths
  write last. It reads "reading the Record…" then "read at 16:51".
- **`.why a:focus-visible`** added.
- **One column at 375px.** The two-column grid held a whole column for the
  countdown and left content about 245px wide.

Contrast, computed in both themes (light / dark):

```
ink on bg        16.71 / 15.04   body text
muted on bg       6.39 /  6.24   .vtally, .vnote
faint on bg       4.87 /  4.62   .abs, .num
accent on bg      6.06 /  8.27   the button, the bar, every focus ring
bg on accent      6.06 /  8.27   the button's label when filled
urgent on bg      6.71 /  6.86   .clash
soon on bg        5.57 /  8.08   .q7, the soon countdown
ink on accent     2.76 /  1.82   REJECTED as a focus ring on the filled button
```

That last row is the one worth keeping: the obvious focus ring for a filled
accent button is `--ink` inside it, and it fails in both themes. The ring is
`--accent` offset outward onto the page instead.

## Test counts

The brief gave five expected counts. Four are unchanged. One moved, because I
added tests for behaviour I changed:

```
python3 .github/scripts/check-record.py        0 warnings      (as briefed)
python3 .github/scripts/test-tally.py          19/19           (as briefed)
node .github/scripts/test-vote-parse.mjs       48/48           (as briefed)
node .github/scripts/test-record-vote.mjs      73/73           (was 62/62)
node .github/scripts/test-label-proposals.mjs  11/11           (as briefed)
```

The eleven new assertions: both 404 paths still refuse quietly and stay green;
neither non-404 path states the refusal sentence; both name the status GitHub
answered with and go red; neither writes; and the hand-edit offer names both the
branch to commit to and the radio that loses the vote.

## What I could not verify

**No GitHub access of any kind.** No git remote (`git remote -v` is empty —
the repository was bundled and uploaded, not cloned), `GH_TOKEN` invalid, and
`api.github.com` answers 403 through the proxy. So:

- **Nothing is pushed.** The ten commits exist only in this container. They are
  the deliverable; pull them out with `claude --teleport`.
- **The live round trip in step 11 is UNVERIFIED.** No issue was opened on the
  sandbox, no workflow run was watched, no row was written. What was verified is
  local: the build runs, the output passes `node --check`, has no control bytes,
  contains no occurrence of `constitutional-record`, and renders correctly in
  Chromium against a stubbed GitHub returning a label-less pull request and a 404
  for every vote file. The steps to click are in the header of
  `tools/preview/build.py`. **Step 4 — the workflow actually writing the row — is
  the one to check first.**
- **The workflow changes are untested against GitHub.** `record-vote.yml` runs
  only on `issues`, which GitHub always runs from the default branch, so it
  cannot be exercised by the pull request that introduces it — that is why
  `test-record-vote.mjs` exists and lifts the script out of the YAML. The tests
  pass. A real run has not happened.
- **The rate-limit path in step 3 is reasoning, not an observation.** I did not
  watch GitHub return a 429.
- **The `aria-live` move has not been heard.** It is structurally right and both
  completion paths write `#stamp` last, but no screen reader was run.
- **GitHub's commit-dialog wording (step 7)** is from the current web UI.
  `CONTRIBUTING.md` already warns that GitHub relabels its buttons; the shape of
  the flow has been stable.
- **Step 9 changes a file, not a setting.** `.github/ruleset-main.json` records
  the configuration; applying it is a human action in the repository settings
  that nobody has taken. Until someone does, the file and the live settings
  disagree, and `rule-drafting-tools.md` already says the live settings win.

## Found, not fixed

Things I ran into that are not in the brief. None is urgent; all are real.

**1. `LABELS.note` in `record-vote.yml` has no field behind it.** The workflow
still declares `note: 'Anything that would move your position'`, which was a
field on the objection form before the two forms merged. `vote.yml` has no such
field, so `f[LABELS.note]` is always `undefined` and the `## Notes` block — the
non-objection half of that code — can never be written. The drift check in
`test-record-vote.mjs` asserts that every label in the YAML is known to the
workflow, but not the reverse, so it did not catch this. Either put the field
back on the form (§2 does encourage a member on toleration to say what would
move them) or delete the Notes path. I left it: deciding which is a judgement
about the form, not a defect to quietly pick a side on.

**2. `return refuse(...)` escapes the step 1 `try`.** The body returns these
promises rather than awaiting them, so a rejection inside `refuse` or
`brokenTooling` resolves outside the `try` and the catch never sees it. Narrow
in practice — `say` and `close` swallow their own errors — but the honest fix is
`return await` throughout, which is a wide mechanical diff I did not want inside
a commit about error handling.

**3. `.act` was being overridden before step 6.** `.why a` (specificity 0,1,1)
beat `.act` (0,1,0), so the button rendered with `color: inherit` and an
underline rather than the accent and no-underline the stylesheet intended. Fixed
as part of step 6 by scoping to `.why a.act`; worth knowing because the same trap
is waiting for the next class added inside `.why`.

**4. The Tier C bar measures quorum, not turnout.** For a Tier C vote the gauge
shows responded/quorum, so it reads full once quorum is met even though half the
roll has not answered. The head line says both numbers ("7 of 14 have answered ·
quorum 7, reached") so nothing is hidden, but the bar alone could be read as
"done". The alternative — showing responded/roll — hides the gate that actually
matters. I chose the gate and am flagging the choice.

**5. `SANDBOX.md` does not exist** in this clone, though the brief said to read
it first. Nothing else was missing.

**6. Git authorship.** `git config user.name` was `Claude` and `user.email`
`noreply@anthropic.com`, which would have put the agent in the author field.
`AGENTS.md` says the author is the member and the trailer is the agent, and the
existing history on this branch is authored by `emergentvibe
<yiannis.ravanis@gmail.com>`. I set the repository-local config to match. Every
commit carries `Co-Authored-By: Claude Opus 5`.

**7. `rule-drafting-tools.md` is adopted.** Steps 8 and 9 both edit it, which
makes those parts an amendment to a live Ordinary rule and they need the Ordinary
procedure like anything else. `rule-recording-votes.md` is *not* adopted — it is
proposed on this same branch — so editing it is editing this proposal.

**8. Local testing note.** Under a Playwright stub the footer's budget line is
blank, because `x-ratelimit-remaining` is not a CORS-safelisted header and a stub
does not send `access-control-expose-headers`. Real GitHub does. Not a bug in the
page; it will confuse the next person to stub it.

## What is still the member's to decide

- Whether `allowed_merge_methods` actually changes on the repository (step 9 is a
  file).
- Whether the Notes field comes back to `vote.yml` or the Notes path goes.
- Whether the Tier C bar should show quorum or turnout.
- Everything about whether any of this is proposed, and at what tier. I have
  decided no position, recorded none, and merged nothing.
