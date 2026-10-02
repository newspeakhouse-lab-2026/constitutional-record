---
name: deliberation
description: Report the state of open proposals — which deliberation windows have elapsed, which thresholds apply, what is merge-ready — and build the monthly review agenda. Use when asked about proposal status or before a review meeting.
---

# Deliberation

## Thresholds

Compute from the current `members.md` every time. Fractions of all members **round up**. With 14 members:

| Procedure | Window | Requirement |
|---|---|---|
| Tier A | 48h | Passes absent a stated objection |
| Tier B | Stated, under 7 days | Passes absent a stated objection |
| Tier C | 7 days or more | Simple majority of those voting; quorum 7 |
| Layer 3 Policy | 7 days + 1 endorsement + preference mapping | 8 affirmative |
| Layer 4 | 7 days + 2 endorsing reviews | 10 affirmative |
| Emergency | 12h | Majority of those voting; quorum 7; expires in 7 days unless confirmed |
| Adjudication remedy | 7 days' notice | Two-thirds of other members voting; quorum 7 (half of the other 13) |
| Removal | 7 days' notice | 9 affirmative (two-thirds of all but the respondent) |

"Those who vote" counts Preference and Objection only. Toleration and Abstention count toward quorum, not the majority denominator. One stated objection moves an Ordinary proposal **up** a tier; it never moves down. An Emergency resolution may not amend the Constitution, impose a sanction, decide membership, determine an adjudication, authorise expenditure above £300, or create an ongoing financial commitment. A material change restarts the minimum period; a correction that does not change meaning does not.

## Status report

```bash
date -u +%Y-%m-%dT%H:%M:%SZ
gh pr list --state open --json number,title,author,createdAt,headRefName
gh issue list --state open --json number,title,author,createdAt
gh pr view {n} --json createdAt,reviews,comments
```

For each open proposal report: its layer, when it opened, the window that applies, whether that window has elapsed, what threshold it needs, what it has, and what is blocking it.

**The hard constraint on this skill.** Deliberation also happens in the governance channel, which you cannot read. Absence of objection on a pull request is **not** proof of lazy consensus. Always report elapsed-window findings as "no objection recorded here — verify in the governance channel", and never conclude that a proposal has passed. That verification is the Record Keeper's job and the reason the office exists.

## Merge-readiness

A proposal is ready to merge when its window has elapsed, its threshold is met, and verification has happened. Flag, but never perform:

- Only **Record Keepers** merge.
- **Recommended: the author does not merge their own proposal.** The Constitution says "either may merge" and does not expressly forbid it, but verification means little when the verifier is the author. Flag it as practice, not as a rule.
- Record Keepers verify that the process occurred and the outcome is recorded correctly. They are custodians, not gatekeepers: they check process, not whether they agree.

## Monthly review agenda

The Convener convenes a retrospective each month. Build the agenda from:

1. **Experiments expiring before the next review** — these expire automatically unless adopted or extended by their own layer's procedure. List each with its success criteria and whether they were met.
2. **Open proposals**, with windows elapsed and what blocks each.
3. **Rules adopted since the last review.**
4. **Standalone rules in `rules/`** that might now belong inside a policy folder — see the `classify` skill.
5. **Stale proposals** — open with no movement, especially any whose deliberation clock never started for want of endorsements.
6. **Instruments approaching an end date**, including the Constitution's own expiry.

```bash
grep -rl "^exp-\|expires\|End date\|Ends" policies/ rules/ 2>/dev/null
gh pr list --state open --json number,title,updatedAt
```

The standing format is what went well, what could be improved, and action items. That format is itself changeable at these sessions.
