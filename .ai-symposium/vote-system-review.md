# Review: UI/UX and governance system of the Constitutional Record (record-votes branch)

Reviewed read-only against `record-votes` (diff from `drafting-tools`), `constitution.md`,
`voting-requirements.md`, and a live render via `/tmp/vote-preview/build.py` +
`.github/scripts/tally.py`. Nothing in the repository was changed.

Arithmetic was verified, not assumed: `python3 .github/scripts/test-tally.py` passes
19/19 worked cases, and the three synthetic votes in `/tmp/vote-preview/pr-{11,13,14}.md`
tally correctly by hand-check against `tally.py`'s output (PR #14 Layer-3: 7
preference of 14, needed 8, did not carry; PR #13 Tier C: 10 of 14 responded
(quorum 7, met), 4 of 6 preference+objection, needed 4, carried; PR #11
re-ratification: 5 of 14, needed 10, did not carry). The arithmetic engine is not
where this system's risk lives.

Severity: **Critical** (breaks the thing it exists to protect, or defeats a stated
hard requirement) / **High** (will cause a real incident or a wrong vote count) /
**Medium** (will confuse or mislead, recoverably) / **Low** (polish, consistency).

---

## SYSTEM DESIGN

### S1 — CRITICAL: The one architectural control the requirements doc demanded for agent-cast votes was not built, in the same PR that created the attack surface it warned about

**File:** `.claude/hooks/block-merge.sh` (diff vs. `drafting-tools`); enabled by
`.github/ISSUE_TEMPLATE/vote.yml`, `objection.yml`, `.github/workflows/record-vote.yml`.

`voting-requirements.md` R8.6 says, in terms: *"An agent must not be able to vote.
`.claude/hooks/block-merge.sh` blocks merging, pushing to `main`, force-pushing,
rebasing, resetting and deleting branches — but not `gh issue create`. Any
issue-driven write path must add the vote templates to that deny list **in the
same proposal that introduces them**, or it creates a direct route around R1.6."

This PR *is* that proposal — it introduces `vote.yml`, `objection.yml` and the
workflow that writes a member's row from them. The hook's diff (8 lines) does not
add a deny-list entry for either template. I read the full `case "$norm" in …
esac` block: it matches `gh pr merge`, `git merge` (on main), `gh api …/merge`,
`git push … main`, force-push, `git reset --hard`, `git rebase`, and branch
deletion. There is no pattern for `gh issue create`. The new comment added at line
46-47 — *"Filing a vote through an issue has a workflow write the row, so the
issue is the position. Proposals and every other kind of issue are untouched"* —
explicitly rationalises leaving it open rather than closing it.

**What this means concretely:** `CONTRIBUTING.md` tells every member running an
agent to `gh auth login` once as themselves. From that point, their agent — in
Claude Code, in opencode, in anything — can run
`gh issue create --template vote.yml --body '...position: preference...'` and
the workflow will write that position into `votes/pr-{n}.md`, attributed to the
member, indistinguishably from the member having clicked the form themselves.
`AGENTS.md`'s "Never decide a position" is honest about this — it says outright
*"Nothing here is enforced by a hook: this one is yours to hold"* — but that
sentence is describing a gap R1.6 explicitly said should not exist ("the
capability absent, not merely forbidden").

**The deeper problem, which the requirements doc doesn't quite confront:** even a
corrected hook only closes this for Claude Code. `.claude/hooks/` is stated in
`AGENTS.md` and `rule-drafting-tools.md` to be "Claude Code specific... Other
tools can ignore it." opencode and Claude Cowork — both named in CONTRIBUTING.md
as supported, one explicitly recommended for vendor-independence — have no
equivalent gate at all. And GitHub's REST API does not distinguish an issue
created by a human clicking the form from one created by a script using the same
token, so there is no server-side signal to key a check on either. **R1.6's
"capability absent" is most likely unachievable given how GitHub issue authorship
works; the real control is, and will remain, the same place a sanctioned
accomplice would be: the member not doing it.** That is worth saying plainly in
`AGENTS.md`, rather than letting R1.6 stand as a promise the architecture cannot
keep.

**Fix, concretely, in order of leverage:**
1. Add to `.claude/hooks/block-merge.sh`'s case statement, now, since this is the
   PR introducing the surface it protects against:
   ```
   *"gh issue create"*"--template vote.yml"*|*"gh issue create"*"--template objection.yml"*)
     deny "filing a vote or objection issue by command line — Section 1: an agent has no vote of its own, and a position it submits cannot be told apart from one it invented" ;;
   ```
   This is a narrow string match and will not catch every invocation shape (e.g.
   `--template=vote.yml`, or posting directly via `gh api repos/.../issues`), so
   broaden the match rather than trust it as complete.
2. In `AGENTS.md`'s "Hard rules" section, replace the implication that this is
   merely unenforced-for-now with an explicit statement that it is a trust
   boundary with no full technical fix, the same way a human delegate's good
   faith is a trust boundary — so nobody later "fixes" the hook and believes the
   problem solved.

---

### S2 — HIGH: The dashboard shows the deadline everyone is racing against, but not who currently holds the seats that deadline empties

**File:** `docs/index.html` (`SHOW_IN_FORCE` flag, lines ~170 and ~809-828).

The single highest-stakes fact in the whole project — interim offices expire
23:59 UK 2 November, Record Keepers are the only members who can merge, and all
four offices lapse at the same instant — is already surfaced as a countdown row
(good: it's in the `fixed` array in `docs/data.json`, sourced from §6, with a note
naming the mechanism). But the dashboard fetches `roles.md` (`collect()` already
reads it into `d.roles`) purely to feed the "In force" section, which is switched
off (`SHOW_IN_FORCE=false`, deliberately, per the code's own comment, because it
"filled a third of the page with rows nobody was reading"). The names of who
currently holds Agent / Convener / Treasurer / Record Keeper are consequently
**nowhere on the page** — a member who opens the dashboard at 11pm to find out who
to chase, or who to ask to merge something, sees a countdown and has to click
through to `roles.md` to get a name.

Turning the whole "In force" section back on would reintroduce the clutter it was
turned off to avoid, and that trade-off was reasonable. The fix is narrower: the
data is already fetched (`d.roles`, parsed into `rrows`) — append the four
role/holder pairs to the **existing** "Interim role holders' terms end" row's
`meta`, rather than reviving a whole section.

**Concrete change**, in `render()`, where the `fixed` items are rendered
(around line 670-675): when `f.label` matches the interim-roles entry, compute
`rrows` (already parsed further down — move that parsing earlier) and append the
four names to the row's meta string, e.g. `Agent: Noam Herberg · Convener: Clara
Yeo · Treasurer: Disha Shanbhag · Record Keepers: Anchit Som, Yiannis Ravanis`.
Do **not** hardcode the names into `docs/data.json`: that file's own stated
design principle is that every entry carries the sentence it was read from so
staleness is detected, and role-holder names change in a way the Constitution's
own checker (`check-record.py`) has no mechanism to catch — reading them live
from `roles.md`, as the code already does, is the only version that can't go
stale silently.

---

### S3 — MEDIUM: Dates are restated as literal prose in five files, and only two of them are checked against drift

**Files:** `README.md`, `CONTRIBUTING.md` (two places), `AGENTS.md`, `roles.md`,
`docs/data.json`, `voting-requirements.md`.

`docs/data.json`'s own stated design principle (`_comment`, and repeated in
`rule-drafting-tools.md`) is that a figure should carry the sentence it was read
from so a check can catch drift. `check-record.py` does exactly this — but only
for `docs/data.json`'s own `fixed`/`procedures`/`thresholds` entries against
`constitution.md`. It does not, and structurally cannot easily, check that
`README.md`'s "Current state" bullet, `CONTRIBUTING.md`'s role-holder box, and
`AGENTS.md`'s `roles.md` pointer **still say the same date** as `docs/data.json`
and as each other. This is exactly the pattern already flagged for thresholds
elsewhere in this project (hardcoded 8/10/9/quorum-7 across five files) — the
same failure mode now applies to the 2 November / 23 November / 30 November
dates, restated as prose in at least five non-authoritative places.

Concretely, if the interim period is extended again (plausible — §6 already
allows a two-thirds vote to do it, and the critical-path document flags the
election as the real priority), whoever drafts that amendment has to
remember to grep for the old date across README.md, CONTRIBUTING.md (twice),
AGENTS.md, and `roles.md`'s own prose, none of which is checked. Missing one
leaves a stale date standing next to the correct one with nothing to flag the
disagreement.

**Fix:** given the four-week deadline, don't build more tooling — reduce the
restatement. Where these files currently state the literal date in prose, point
at `roles.md` or the dashboard instead of repeating the timestamp:
e.g. CONTRIBUTING.md's *"All four interim offices are time-limited... 23:59 UK
time on Monday 2 November 2026"* → *"...until the date stated in `roles.md`."*
Keep the literal, checked timestamp in exactly two places: `constitution.md`
(authoritative) and `docs/data.json` (checked against it).

---

### S4 — MEDIUM: The "earlier reviewers wanted to cut the forms entirely" argument is partly right, and the system doesn't fully answer it

The build gives GitHub three independent ways to get a position recorded: editing
`votes/pr-{n}.md` by hand, the issue form + workflow, and (implicitly) a Record
Keeper transcribing a channel message. All three are real and all three are
necessary for different members (R7.1, R11.1) — cutting the forms is wrong for
a disconnected member, but the review is right that the forms **add** rather than
**replace** complexity: the file format (`votes/pr-{n}.md`) has to be
hand-editable and comprehensible on its own regardless of whether the forms
exist, because the forms degrade to it (R11.4) and a member without push access
still needs the Convener to hand-edit it for them. Given that the hand-editable
file *has* to exist and be the source of truth either way, the forms are a
genuine net addition of ~700 lines (`record-vote.yml` is 458 lines on its own) to
maintain, test (three separate test files), and keep in sync with the templates,
for a benefit that is real but narrow: GitHub-authenticated identity for members
who do have push access and don't want to edit a file.

This is not a case for deleting the forms — R4 (identity) and R7.1 make a strong
case they're needed for *some* members — but it is a case for being honest in
`CONTRIBUTING.md` about which members actually need this path. As written,
`CONTRIBUTING.md`'s Quick Reference lists "Record a vote → Your row in
`votes/pr-{number}.md`... — step 6" as the primary instruction and never
surfaces the issue forms as an alternative route at all in the main flow — a
member has to already know `vote.yml` exists. Given the forms exist and work
(tests pass), that's an omission the other direction: **cut nothing, but add one
line** to the Quick Reference table pointing at the form for members who'd
rather not edit a file, since right now the easier path for a non-technical
member is the one not advertised.

---

### S5 — LOW: `votes/pr-{n}.md`'s template procedure list omits §3.9 recall

**File:** `.github/instrument-templates/vote.md` line 30.

The placeholder line reads:
`**Procedure:** <Tier C | Layer 3 Policy | Layer 4 Constitutional | Emergency | Re-ratification | §4 remedy | §4 removal>`

`tally.py`'s `PROCEDURES` dict and `docs/data.json`'s `thresholds` both support
`recall` (and correctly print "NO VERDICT" per R10.2, since §3.9 states no
denominator) — but a member opening the template to run a no-confidence vote on
the Agent has no prompt telling them `Recall` is a recognised value. Add
`| Recall (§3.9)` to the placeholder list.

---

## UI/UX

### U1 — HIGH: The vote line is one long run-on sentence with no visual hierarchy, and the single most important action in it (recording your position) is a plain inline text link

**File:** `docs/index.html`, the `voteWhy` construction (~line 710-736) and `.why`
CSS rule (`font-size:.74rem;color:var(--muted)`).

Confirmed by rendering: for an open Layer-3/4/re-ratification vote, the row's
`.why` line reads, concatenated with ` · `:

> **5 toward the 10 needed** · preference 5 · toleration 1 · abstention 0 ·
> objection 0 · awaiting Disha Shanbhag, Joel Naoki CHRISTOPH, Niba, Noam Herberg
> and 4 more · record your position · only preference counts as a yes

That's eight clauses in one unbroken line of 11.8px muted-grey text, with the
single actionable item — "record your position" — a bare `<a>` with no button
styling, no padding, sitting between a comma-separated name list and a trailing
warning clause. On a phone at 11pm this is the worst-placed, hardest-to-hit
target on the page for the one thing the page exists to make happen.

**What to cut:** the full position breakdown (`preference 5 · toleration 1 ·
abstention 0 · objection 0`) duplicates what "5 toward the 10 needed" already
conveys for the common case where nobody's objected and you just want to know how
close it is. Keep it, but visually demote it (smaller/fainter than the headline
number), not equal weight with the headline.

**What must not be cut:** the "only preference counts as a yes" line — this is
R2.6, the highest-leverage sentence in the project, and it's correctly present on
every single vote row, not just once per page. Keep it exactly as prominent as it
is, possibly more so (see U2).

**Concrete fix:**
```css
.why{grid-column:1;font-size:.74rem;color:var(--muted);margin-top:.15rem}
.why .cta{display:inline-block;margin-top:.3rem;padding:.3rem .6rem;
  border:1px solid var(--accent);border-radius:999px;color:var(--accent);
  font-weight:600}
```
and wrap the "record your position" / "start a vote" links in `<span class="cta">`
so they render as a tappable button-shaped element on their own line, not an
inline link mid-sentence. This is the single highest-value one-line CSS change
in the review.

---

### U2 — MEDIUM: "Only preference counts as a yes" is styled identically to routine metadata, on the one line where that's wrong

**File:** `docs/index.html`, `voteWhy=p.join(" · ")+ ` · <span class="quiet">only
preference counts as a yes</span>` `` — and `.quiet{color:var(--muted)}`.

`.quiet` is explicitly documented in the CSS (line 84) as *"informational, not a
warning"* — correctly used elsewhere for things like "no comment" on a quiet
Tier A proposal. But it's reused here for the one sentence the requirements
document calls "plausibly the highest-leverage sentence in the project" (R2.6).
Visually it sits at the same weight as "awaiting X, Y" and "record your
position" — a member skimming fast on a phone has no reason to stop at it.

**Fix:** give this specific sentence its own class, not `.quiet`, with the
`--soon` colour (already used for "closing soon" urgency, measured above at
~5.6:1 contrast against the page background — passes WCAG AA) and bold weight:
```html
<strong class="trap">Only preference counts as a yes.</strong>
```
This is the one place on the page where making a line louder than its neighbours
is exactly right, and currently it's styled to be quieter.

---

### U3 — MEDIUM: The Tier C two-denominator explanation is accurate but assumes the reader already knows what "quorum" means

**File:** `docs/index.html`, the `quorumOnly` branch (~line 713-716); the
one-time `.glossary` paragraph (~line 766-769).

The per-row text — *"9 of 14 have answered, quorum 7 — met · the majority is
counted over preference and objection only, when the window closes"* — is
correct and appropriately specific (this exact wording was checked against
`vote-cases.json`'s worked cases). But it uses "quorum" and "majority" as if the
reader already distinguishes a participation threshold from a support threshold —
the thing the task brief specifically asks whether a member who hasn't read §2
would follow. The page's one general-purpose glossary paragraph defines L0-L4 and
Tier A-C but never defines "quorum" or "majority" as concepts.

**Fix:** add one clause to the existing glossary paragraph (cheap, one-time cost,
not per-row):
> *Quorum: the minimum number who must respond, in any position, for the vote to
> count at all. Majority/threshold: how many of those must say preference for it
> to pass.*

---

### U4 — MEDIUM: Ratios on the page are formatted three different ways, which defeats scanning for how close something is

**File:** `docs/index.html` — three separate ratio renderers:
- Vote threshold: `"N toward the M needed"`
- Tier C quorum: `"N of M have answered"`
- Endorsements: `"H/N endorsed"`

The brief's illustrative "`7 of 8` and `5 of 10` look identical at a glance" is
right in substance even though those exact strings don't appear verbatim: the
page shows at least three structurally different small-integer ratios (vote
progress, quorum progress, endorsement progress) on proposal rows, none with a
proportional visual cue (bar, fill, percentage) and all in the same font size and
colour regardless of how close they are to done. A member scanning ten rows fast
cannot tell "1/2 endorsed, basically done" from "4 toward 10 needed, not close"
without reading and doing the division themselves — exactly the failure mode
named in the brief.

**Fix, minimal:** this doesn't need a progress bar (that's a bigger change than
four weeks warrants). The cheap version: compute the fraction and apply the
existing `--soon`/`--urgent` colour classes (already defined, already
accessible) to the *ratio number itself* when it crosses 50%/90% of the way to
its threshold — the same visual language already used for time-urgency, reused
for progress-urgency. One function, reused three places:
```js
const closeCls = (have, need) => !need ? "" : have/need >= 0.9 ? "urgent" : have/need >= 0.5 ? "soon" : "";
```

---

### U5 — LOW: The "awaiting" list truncates to 4 names, which is least helpful exactly when the vote is highest-stakes

**File:** `docs/index.html`, `vote.awaiting.slice(0,4)`.

For a 14-member re-ratification vote with, say, 7 people still silent, the row
shows 4 names and "and 3 more" — a member trying to decide who to personally
message has to click through to the file for the rest. This is a reasonable
trade-off for routine Tier C/Layer-3 votes, but re-ratification is the one
procedure where "who exactly hasn't answered" is the whole ballgame (R7.6: "the
highest-value attack in the system" is silence from five people). Not urgent
given the four-week deadline, but worth a one-line special case: don't truncate
when `win.layer==="re-ratification"`-equivalent, or raise the threshold to 8-10
generally. Low priority — the full list is one click away and the page already
says so implicitly via the link.

---

### U6 — LOW (verified, not a defect): Contrast and screen-reader order checked and pass

Spot-checked by computing WCAG relative luminance by hand against the light
theme's `--bg:#fbfaf8`:
- `--urgent:#a3301f` → contrast ≈ 6.7:1 (passes AA 4.5:1 and is close to AAA 7:1)
- `--soon:#8a5c08` → contrast ≈ 5.6:1 (passes AA)
- `--muted:#5f5c56` (used for the dense `.why`/`.meta` lines) → contrast ≈ 6.4:1
  (passes AA; falls just short of AAA's 7:1 for small text, which is a reasonable
  trade-off here, not a defect)

I did not check the dark-theme pairs (`prefers-color-scheme: dark` variables) —
mark that **unverified**.

Countdown urgency (`.urgent`/`.soon` on the right-column figure) is not
colour-only: `row()` always includes a screen-reader-only `<span class="sr">` with
the word form ("closing today" / "closing soon" / "elapsed"), and the code
comment at line 92-93 explicitly documents the intent ("Explanations are not
urgency. `--soon` is reserved for clocks running out"). Layer/Tier abbreviations
(`L2`, `A`) are not title-only either — the visible `.glossary` paragraph spells
every one out, specifically because (per the code's own comment at line 764-765)
a `title=` tooltip "does not exist on a phone." These were already fixed in this
branch and should **not** be redone.

---

## DOCUMENTS

### D1 — MEDIUM: `vote.yml`'s toleration description is procedure-blind, which is exactly the failure mode R2.6 predicted

**File:** `.github/ISSUE_TEMPLATE/vote.yml`, the `position` dropdown.

The dropdown text — *"toleration — I may not be in favour, but I have no reasoned
objection. Counted as an abstention, not a yes"* — is true in every procedure,
but incomplete for exactly one: at Tier C, a toleration **does** do something (it
counts toward the quorum of half of all members without diluting the
preference/objection majority) — the thing `voting-requirements.md` R2.6 calls
out by name: *"the same four words mean different things under different
procedures… It cannot be fixed by form help text alone."* The requirements doc
predicted this correctly and the form, as built, confirms the prediction: a
GitHub issue form has no way to know which PR number the member is about to type
in, so it cannot conditionally change this text, and it doesn't try to.

In practice this is partly mitigated — the dashboard's per-row text for Tier C
rows explains the quorum mechanic — but a member who reaches the form directly
(a link pasted in Discord, say) without having read the dashboard row first sees
only the blanket "not a yes" framing and has no reason to think toleration is
worth choosing over silence even when it is.

**Fix:** add one sentence to the markdown intro block in `vote.yml` (the
`type: markdown` block at the top, which *can* be static prose since it doesn't
need to vary by procedure):
> "Toleration still matters for Tier C ordinary rules — it counts toward the
> quorum needed just to have a result at all. It never counts as a yes anywhere."

This doesn't fully solve R2.6's stated problem (it's still one static sentence
covering seven different procedures), but it stops the form from implying
toleration is uniformly inert, which is the part that's actually false.

---

### D2 — LOW: `rule-recording-votes.md`'s uncommitted edit removes "roll" consistently; one place elsewhere in the repo was worth checking and is fine

I grepped the full tree for the retired word "roll" (the task states this is
already being fixed, so this is a verification, not a new finding): every
member-facing use in `CONTRIBUTING.md`, `AGENTS.md`, and
`rules/rule-recording-votes.md` has been changed to "who may vote" / "everyone
entitled to vote" in the currently-unstaged diff. The word survives only as
internal JS variable names (`roll`, `rollSha`) in `docs/index.html`, which never
render to a user, and in `constitution.md`'s unrelated "conducts roll call" (a
different sense, in the authoritative document, not to be touched). **No action
needed; confirms the in-progress fix is complete for prose.**

---

### D3 — LOW: `CONTRIBUTING.md`'s claim that Record Keepers merging their own proposal is uncontroversial, restated as a near-duplicate paragraph in `AGENTS.md`

**Files:** `CONTRIBUTING.md` ("Roles" section) and `AGENTS.md` ("Conventions").

Both files separately explain, in their own words, that Constitution §3 says
"either may merge" and that this includes a Record Keeper's own proposal. This
is correct and not contradictory, but it's the same explanatory point made twice
in two authoring voices — a future editor correcting a nuance here (e.g. if a
Policy later qualifies this) has two prose passages to find and reconcile rather
than one canonical one. Not urgent; flagging per the task's ask for restated
facts that can drift. Low priority given the four-week deadline — I would leave
this rather than spend review time on it, since the two statements currently
agree.

---

## What I would cut

- **Nothing from the vote-recording mechanism itself** (file format, workflow,
  templates) — every piece earns its place against a specific requirement
  (R4, R7.1, R8.4, R8.6-partial, R9.x), and the test suite (19/19 tally cases,
  plus the three JS test files) means the arithmetic risk is already retired.
- **The full position breakdown repeated in the vote-row metadata line** (U1) —
  demote it visually, don't delete the data; "N toward M needed" carries the
  headline, the breakdown is detail for someone who stops to read.
- **Nothing on the dashboard that's currently shown** — `SHOW_IN_FORCE=false`
  already cut the one section that was genuinely unread (S2), correctly. I
  would not cut anything further; the page is already lean for what it does.
- **The duplicate "either may merge" explanation** (D3) is the only genuinely
  redundant prose I found, and it's low-stakes enough not to be worth the edit
  given the deadline — noting it rather than recommending spending time on it.

## What I could not verify

- Dark-theme colour contrast pairs in `docs/index.html` (U6).
- Whether exactly two people (the named Record Keepers) are the only GitHub
  organisation admins on the live `newspeakhouse-lab-2026` org — this repo's
  files assert it but nothing in the repository can confirm or refute live org
  membership.
- Live GitHub UI behaviour (e.g. whether the "commit directly to main" option
  actually appears only for org admins as `CONTRIBUTING.md` describes) — I read
  the ruleset JSON, which is consistent with the claim, but did not operate the
  live GitHub web UI as an org admin to confirm it first-hand.
- Whether GitHub's unauthenticated rate limit (R7.4, still unaddressed by this
  diff — it's orthogonal to the voting feature) treats conditional/ETag requests
  differently; I did not test this live.
