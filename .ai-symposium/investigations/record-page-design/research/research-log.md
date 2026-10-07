# Research log

## Repository reconnaissance (before any search)
- Read `docs/index.html` in full, twice: once for the style block per the
  brief's explicit instruction, once for the script that generates the
  markup the style block styles. Cross-referenced every CSS comment against
  the code path it describes to check the comment is still true of the
  current file (all were, as of commit `c890306`).
- Read `docs/data.json`, `.github/scripts/tally.py` header, `tools/preview/build.py`
  header.
- `git log --oneline -- docs/index.html` (last 15 commits) -- confirms the
  "redesigned in the last few hours" framing and that the file is a moving
  target: the CSS comments are contemporaneous design rationale, not
  archaeology.
- Attempted to render the page: no browser/screenshot tool is available in
  this session (no Playwright MCP loaded). Ran `python3 tools/preview/build.py`
  successfully (writes `tools/preview/out/index.html`, confirmed it never
  references the live repo) but could not drive a headless browser against
  it. **Everything in the transcript about what the eye lands on is
  reasoned from the generated markup and the CSS cascade, not observed in a
  rendered viewport.** Flagged inline wherever it matters.
- Computed WCAG contrast ratios directly in Python for every token pair,
  rather than trusting the author's inline comments or eyeballing hex
  values. See `/scratchpad/contrast.py` (session scratchpad, not in repo).
  Full results in sources.json S7. Headline: the two numbers the author
  states inline (accent/bg 6.06:1 light, 8.27:1 dark) check out exactly.
  One pair nobody had commented on -- `--faint` on `--bg` in dark mode,
  used for `.abs`, `.num`, `.budget`, `.stamp` -- comes out at 4.62:1,
  which clears the 4.5:1 AA floor for small text by 0.12, the thinnest
  margin anywhere on the page.
- Grepped for every use of `.q7` (the "genuine staleness only" token per its
  own comment at line 89) across the script. Found it applied to four
  distinct situations of different severity: a stale proposal (matches the
  comment), a pull request targeting the wrong base branch (a
  misconfiguration, not staleness), a bare round number and an
  after-rounds count (neutral facts, not warnings at all), and a vote
  submission that silently failed to record (an actual failure, arguably
  more severe than `.clash`, which gets `--urgent`). This is reported as a
  finding, not asserted from memory -- see transcript, Hour 7.

## Web research
Searches run this session, each either confirming a claim already planned to
be made, or supplying a real comparator not otherwise available:

1. Fogg Behavior Model (B=MAP), origin and 2019 renaming of "trigger" to
   "prompt" -- confirmed, S9.
2. Nielsen's F-shaped-pattern eyetracking study, exact date and sample size
   -- confirmed (17 Apr 2006, n=232), S10.
3. WCAG 2.5.5 vs 2.5.8 exact pixel thresholds and levels -- confirmed, S8.
   This matters because the page's own comments cite "24px" and "44px" as
   if interchangeable minimums; they are not interchangeable, they are two
   different conformance levels (AA and AAA), and the page's claims turn
   out to be accurate once read carefully (see transcript Hour 4).
4. GOV.UK content design guidance for legal/procedural plain language --
   S16. The strongest available real-world precedent for "can design do
   better than a sentence" on legal obligation, because GOV.UK does this at
   national scale and publishes its research.
5. Loomio's four-position consensus model -- S13. The single most useful
   comparator found this session: a real, deployed tool with almost the
   same four-way split (agree/disagree/abstain/block vs.
   preference/toleration/abstention/objection), but one where "abstain" is
   *defined* as a different, deliberately weak-but-real signal ("this
   doesn't affect me, I'm fine with whatever you decide") rather than being
   arithmetically silent. This sharpens the panel's "new idea" discussion:
   Newspeak's problem is not that it has four positions, it's that two of
   those four positions are designed by the Constitution to do nothing, and
   no visual language the page could invent changes what the Constitution
   makes true.
6. Pluralistic ignorance (S14) and Gerber & Rogers' descriptive-norms
   voting experiment (S15) -- both explored for a specific proposed
   addition (a base-rate "most members who vote on Tier C business choose
   preference" framing). Gerber & Rogers' finding that descriptive-norm
   messaging only works when the true norm is *high* participation is the
   reason this idea is costed as a two-edged one in the transcript rather
   than recommended outright: nobody on the panel could verify, in this
   session, what the Record's actual historical toleration rate is, so
   showing the true number might demonstrate the problem rather than fix
   it. Marked unverified where the transcript says so.
7. Dieter Rams's ten principles, exact wording -- confirmed, S11.
8. Tufte's data-ink ratio / chartjunk / lie-factor definitions -- confirmed,
   S12, applied directly to `.gauge` (lines 156-158, 898-899).
9. Gestalt grouping (proximity/similarity/figure-ground) and Fitts's Law --
   standard, confirmed, S19/S20, used to name formally what the page's own
   comments already do informally (e.g. the `.vote` left-rule comment at
   lines 126-129 is a proximity-grouping argument whether or not the author
   used that word).
10. Butterick on tabular figures -- S21 -- surfaced the minor
    `font-variant-numeric:tabular-nums` redundancy inside an already-monospace
    stack (lines 84-85). Low-stakes, reported as a cut candidate, not a bug.
11. NN/g on progress indicators -- S22 -- checked to make sure the `.gauge`
    critique wasn't borrowing authority from guidance that doesn't actually
    apply (NN/g's progress-indicator literature is about elapsed-time wait
    states, not static ratio display) -- it doesn't transfer directly, so
    the transcript cites Tufte for the gauge, not NN/g.

## What was not independently verified
- The Geiger & Swim pluralistic-ignorance intervention claim (S14) is
  reported at the level of the Wikipedia summary, not the primary paper.
- No actual toleration/abstention/silence rate from the Record's real vote
  history was computed in this session (would require reading every
  `votes/*.md` file and the live GitHub API) -- the panel's claims about
  "how often this already happens" are about the *mechanism*, verified
  from `.github/scripts/tally.py` and `constitution.md`'s own text, not
  about empirical frequency in this specific Lab, which is unverified.
- No rendered screenshot, light or dark, phone or desktop, was taken.
