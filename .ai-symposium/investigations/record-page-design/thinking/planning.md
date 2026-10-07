# Planning — the Record's page as a designed object

## Scope, deliberately narrow

The brief is explicit: one subject, `docs/index.html` as a designed artefact — not
whether the governance machinery behind it is correct (a prior investigation,
`../record-votes-panel/`, already ran a critical panel on the vote-recording
*system*; its synthesis is read but not re-litigated here), and not the
Constitution. This investigation does not reopen T1–T3 from that panel. Where
this panel's findings touch the same code (e.g. the "record your position"
link, the toleration sentence) they are treated as a fresh design read of the
current state, since the page was "substantially redesigned in the last few
hours" per the brief — the prior panel's finding that the link routed to the
raw file editor is **already fixed** in the file as read today (line 946:
`.../issues/new?template=vote.yml...`, not the blob editor). That is reported
as a fact discovered during setup, not re-claimed as new analysis.

## Why a single panel, not an arc

The brief asks for one thing done thoroughly — critique, text, new ideas,
tensions — not a sequence of panels converging over multiple sessions. Running
this as one extended "design critique" panel (using the Core Critical Panel
shape, bent toward design rather than security/feasibility, per
`panels/core.md`'s explicit allowance that panel composition should match the
question) serves the brief better than forcing an Exploration → Technical →
Synthesis arc onto a question that is already scoped tightly. If the user
wants to continue — an Implementation panel to sequence the actual edits, or a
Critical/Red Team pass specifically on the toleration-sentence redesign — that
is offered at the end, not pre-committed to.

## What was read before any judgement was formed

- `docs/index.html` in full (1174 lines) — style block first, per the brief's
  instruction, including every CSS comment, which the brief treats as binding
  design rationale unless argued against explicitly.
- `docs/data.json` — the constitutional facts and their source quotes.
- `.github/scripts/tally.py` header — the arithmetic the page's numbers are
  checked against.
- `tools/preview/build.py` header — confirms the preview is a sandboxed copy,
  never touches the live Record.
- `git log --oneline -- docs/index.html` — the last 15 commits are all same-day
  work on exactly the areas the brief flags (vote rendering, the "record your
  position" routing, the clash-of-clocks warning, the countdown demotion). This
  confirms "redesigned in the last few hours" and that prior findings may
  already be addressed.
- The prior investigation's `synthesis.md`, to avoid re-presenting R1 (the
  routing fix) as new, and to not re-run T1 (toleration copy vs. mechanism
  fix) without acknowledging it already exists in the register.

No browser/screenshot tool was available in this environment (no Playwright
MCP loaded for this session) and no headless renderer was run, so the rendered
pixel layout is **reconstructed from the generated markup and CSS, not
observed** — flagged throughout as reasoning from code, not from a screenshot.
Contrast ratios are computed directly (WCAG relative luminance formula) rather
than estimated; the working is in `research/sources.json` and
`research/research-log.md`.

## Expert selection — reasoning

The brief's hardest question (the toleration/abstention/silence problem) is a
*legibility-under-behavioural-pressure* problem wearing a typography problem's
clothes. That argues for a panel split between people who think about
attention and triggers (behaviour design), people who think about whether a
reader can perceive a distinction at all (information design, usability), and
someone who will refuse to let either side add anything without cutting
something else.

Selected (7):
- **Don Norman** — affordances/signifiers, errors as design failures. Reads
  the row grammar and the gauge.
- **Dieter Rams** — restraint, "as little design as possible, back to purity."
  The brake on every other seat's instinct to add something.
- **Edward Tufte** — data-ink ratio, graphical integrity, small multiples. The
  gauge bar and the four-position tally are exactly his material.
- **B.J. Fogg** — behaviour design (B=MAP: motivation, ability, prompt — the
  "trigger" of the 2009 model, renamed "prompt" in *Tiny Habits*, 2019).
  Returning voice from the prior investigation, deliberately: the brief's
  "what would make someone open it voluntarily" is his question exactly, and
  continuity of voice is honest here rather than inventing a new behaviourist.
- **George Orwell** — "Politics and the English Language" (1946): concrete,
  checkable rules for prose (cut the dead metaphor, prefer the short word,
  never use the passive where the active will do). Judges the page's actual
  sentences as writing, not as UX copy in the abstract. The name is also not
  a cheap pun to take lightly — this is Newspeak *House*, and a panel that
  ducked the obvious irony of asking Orwell to read a page that must "never
  state an outcome" would be declining the sharpest tool available for free.
- **Jakob Nielsen** — "users don't read, they scan" (Alertbox, Oct 1997); the
  F-shaped-pattern eyetracking study (Alertbox, Apr 2006, n=232). The
  empirical critic: is the eye actually landing where the CSS comments claim
  it does?
- **Christopher Alexander** — "the quality without a name" (*The Timeless Way
  of Building*, 1979); pattern languages. The one voice asking whether the
  page, however correct, has *life* — whether a tired member on a phone feels
  met by it or processed by it. Also doubles as the systems-thinker: he is
  already in the foundational software/architecture table for exactly this
  reason.

Expected conflicts, genuinely, not staged: Rams vs. Fogg (cut vs. add a
trigger); Tufte vs. Norman (does the gauge need a label Norman's affordance
logic wants, that Tufte's data-ink logic doesn't); Nielsen vs. everyone (his
answer to most proposed additions is "nobody will read it, cut it or make it
the only large thing on the row"); Alexander vs. the whole table (his
objection is to the premise that a tighter grid is automatically a better
one).
