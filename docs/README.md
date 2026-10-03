# `docs/` — the Record's dashboard

Two files. Neither is an instrument, and neither has any force: nothing here creates, amends or records a decision.

| | |
|---|---|
| `index.html` | A page showing the state of the Record — deadlines, deliberation windows, adopted instruments, roles. It reads the Record live from the GitHub API each time someone opens it. |
| `data.json` | The handful of constitutional facts the page cannot work out for itself: how long each kind of deliberation runs, and the dates the Constitution names. |

## Why the folder is called `docs`

Not because it holds documents — the whole repository does. **GitHub Pages will only publish from the repository root or from a folder named `docs`** when serving from a branch, so the name is GitHub's constraint rather than a description. Publishing through a GitHub Actions workflow instead would allow any name, at the cost of a workflow.

## Where the rest comes from

Everything other than `data.json` is read live: which proposals are open, what has been adopted, who holds which office. Two facts come from **labels a workflow writes** rather than from an events API — `opened:<timestamp>`, the moment a proposal left draft, and `endorsed:<n>`, how many members have endorsed it.

That is partly cheaper and mostly better. `rules/rule-deliberation-clock.md` says a period that cannot be shown to have begun has not begun, and a label is that showing: visible on the proposal, with GitHub's own record of who added it and when.

## What is in `data.json`, and why

The page reads everything it can from the Record itself: which proposals are open, when their clocks started, what has been adopted, who holds which office. Two things cannot be read that way.

**How long a deliberation period lasts.** Section 2 says this in prose — "Tier A — 48 hours", "Deliberation runs for at least seven days". Writing a parser for constitutional English would work until somebody rephrased a clause, and would then fail silently while appearing to work.

**The dates the Constitution fixes.** Its own expiry, the deadline for re-ratification, the end of the interim period.

So both are copied into `data.json` by hand. **Each entry carries the exact sentence it was copied from**, which turns a stale copy from something nobody notices into something that announces itself:

```json
{ "label": "Constitution expires",
  "at": "2026-11-30T23:59:00Z",
  "source": "§5",
  "quote": "This Constitution expires at 23:59 (UK time) on Monday, 30 November 2026" }
```

The quote is not a parser. It is a tripwire. It makes no attempt to understand the Constitution — it only detects that the Constitution changed somewhere the page depends on.

- **The page** checks every quote against `constitution.md` on each load, and shows a warning across the top if one has gone.
- **A continuous-integration check** does the same on every pull request, so an amendment that changes one of these sentences fails on the pull request making the change, and whoever is amending the Constitution is told then — rather than the page quietly counting down to a number nobody voted for.

## Instruments that expire

A rule or policy with an end date declares it in one line, inside itself:

```
**Ends:** 2026-11-30T23:59:00+00:00 — when the proposal-process Policy is adopted, whichever is first
```

The page reads these from the repository tree, so **a new expiry is discovered where it was written** rather than copied into this folder by someone who has to remember. It covers an instrument's own expiry only — recurring obligations and event-triggered windows are not expressible this way, and the latter cannot be shown at all.

Updating `data.json` is a change to the Record like any other: a branch, a pull request, a Record Keeper merges.

## Decided against

A design panel considered these and advised against each. Recorded so they are not quietly reopened.

- **A document viewer in the page.** With no dependencies permitted, rendering `CONTRIBUTING.md` or the Constitution here means hand-writing a markdown parser and applying it to operative governance text. A mis-rendered table or a flattened list in constitutional text looks exactly as authoritative as a correct one, and GitHub already renders it with history, blame and permalinks. Link out instead.
- **A shortcut into creating a pull request.** GitHub offers nothing clean, and the nearest thing re-enables the commit-straight-to-`main` default that `CONTRIBUTING.md` warns about. It would also skip the classification the guide puts first.
- **A "link AI agent" affordance.** The Constitution requires an agent be documented and communicated to the membership — a fact living in the governance channel, which this page cannot read. A button would claim a capability the page does not have, and parsing pull request bodies for a disclosure sentence would under-report by omission: a missed parse reads as "no agent", which is the false emptiness this page is built to avoid.

The test they proposed for anything added later: **is there a true sentence this page's existing read surface can say about it?** If the honest answer needs inferring, parsing or guessing, that is a cannot-tell state, and the right response is a cannot-tell row rather than a feature dressed up as more certain than its data.
