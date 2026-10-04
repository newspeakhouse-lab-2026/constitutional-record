# `docs/` — the Record's dashboard

Published at **<https://newspeakhouse-lab-2026.github.io/constitutional-record/>**.

Two files. Neither is an instrument, and neither has any force: nothing here creates, amends or records a decision.

| | |
|---|---|
| `index.html` | A page showing the state of the Record in four sections: deadlines and open proposals, issues under discussion, what is in force, and how the Record got here. It reads the Record live from the GitHub API each time someone opens it. |
| `data.json` | The handful of constitutional facts the page cannot work out for itself: how long each kind of deliberation runs, and the dates the Constitution names. |

## Why the folder is called `docs`

Not because it holds documents — the whole repository does. **GitHub Pages will only publish from the repository root or from a folder named `docs`** when serving from a branch, so the name is GitHub's constraint rather than a description. Publishing through a GitHub Actions workflow instead would allow any name, at the cost of a workflow.

**Pages currently serves from the `drafting-tools` branch**, because that is where `docs/` exists while this is still a proposal. When it is merged, the source should be repointed at `main` — otherwise the published page keeps following a branch that has already been merged, and stops reflecting the Record.

## Where the rest comes from

Everything other than `data.json` is read live: which proposals are open, what has been adopted, who holds which office. Two facts come from **labels a workflow writes** rather than from an events API — `opened:<timestamp>`, the moment a proposal left draft, and `endorsed:<n>`, how many members have endorsed it.

That is partly cheaper and mostly better: a label is visible on the proposal itself, with GitHub's own record of who added it and when, which is what showing that a period began ought to mean. (A proposed but **not adopted** rule, `rules/rule-deliberation-clock.md`, would put that principle in the Record. Until it is merged it is a convention, not a clause.)

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
- **A continuous-integration check** does the same on any pull request touching `constitution.md`, `docs/data.json`, `rules/` or `policies/`, so an amendment that changes one of these sentences is caught on the pull request making the change, and whoever is amending the Constitution is told then — rather than the page quietly counting down to a number nobody voted for. It warns; it never blocks.

## Instruments that expire

A rule or policy with an end date declares it in one line, inside itself:

```
**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) — when the proposal-process Policy is adopted, or at the end of this Constitution, whichever comes first
```

The page reads these from the repository tree, so **a new expiry is discovered where it was written** rather than copied into this folder by someone who has to remember. It covers an instrument's own expiry only — recurring obligations and event-triggered windows are not expressible this way, and the latter cannot be shown at all.

Updating `data.json` is a change to the Record like any other: a branch, a pull request, a Record Keeper merges.
