---
name: review-agenda
description: Compile the agenda for a monthly review — expiring experiments, stale proposals, rules that should migrate, instruments nearing an end date. Use before a monthly review, or when the Convener asks what needs attention.
---

# Monthly review agenda

The Convener convenes a retrospective each month. This compiles what belongs on it.

It is **compilation, not judgement.** You list what exists and what its own text says about itself. You do not report whether anything has passed, and you do not pronounce anything ready to merge — see the hard rules in `CLAUDE.md`. Deliberation happens in a channel you cannot read.

Start by establishing today's date with `date`. Several items below are relative to it.

## 1. Experiments expiring before the next review

The ones that matter most, because **they expire automatically** unless adopted or extended by the procedure for their own layer. An expiry nobody noticed is a rule that silently stopped existing.

```bash
ls policies/*/exp-* rules/exp-* 2>/dev/null
grep -rl "expires\|End date\|Ends\|success criteria" policies/ rules/ 2>/dev/null
```

For each: its end date, its stated hypothesis and success criteria, and what its own text says operates when it expires. Quote the criteria rather than assessing whether they were met — that is the cohort's call at the review.

## 2. Instruments approaching an end date

Including the Constitution itself: it expires **23:59 UK time on Monday 30 November 2026** unless re-ratified or replaced, and a re-ratification proposal must have obtained its endorsements and entered seven-day deliberation **no later than Monday 23 November 2026**. Count the days and say so plainly.

Interim arrangements, time-limited rules and recurring bookings that lapse unless reaffirmed belong here too.

## 3. Open proposals, and what blocks each

```bash
gh pr list --state open --json number,title,author,createdAt,reviews
gh issue list --state open --json number,title,author,createdAt
git branch -a
```

For each: its layer, who proposed it, when it opened, and **what is blocking it** — missing endorsements, an unanswered objection, no text yet, or a clock that never started because nobody posted it to the governance channel.

Report blockers, not verdicts. "Opened eleven days ago, no endorsing reviews, so the Layer 4 clock has not started" is useful and true. "Ready to merge" is neither.

## 4. Stale proposals

Open with no movement for weeks — especially any whose clock never started for want of endorsements. These are the ones that quietly die, and the review is where they get picked up or withdrawn deliberately.

## 5. Rules that should migrate

Standalone rules in `rules/` that now belong inside a policy folder, because a policy for that area has since been adopted. See the `classify` skill.

```bash
ls rules/ ; ls policies/
```

## 6. Adopted since the last review

What merged, with links. Short, but it is the only place the cohort sees its own output.

---

The standing format is what went well, what could be improved, and action items — and that format is itself changeable at these sessions. Hand the Convener a draft they can edit, not a finished agenda.
