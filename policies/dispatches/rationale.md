This document is not operative. It carries the reasoning behind `policy.md` and `rule-cadence-rotation.md`; nothing here creates a duty or confers a power.

## Origin

Drafted by Madison Karas, first raised as issue #7 ("Dispatches newsletter management") on 29 September 2026, endorsed there by Anchit Som. The issue was never converted into a pull request, so nothing in it was ever adopted — only a merged pull request adopts anything in this Record. This proposal re-files that same substance as a pull request, with its dates recomputed from the actual filing date rather than the issue's original (now lapsed) timeline, and restructured to the shape `.github/instrument-templates/policy.md` requires.

## Why Layer 3

This creates two new offices (Editor, Publisher), a cohort-wide rotation, and touches an ongoing financial arrangement (tip jar and subscription income, managed jointly with the Treasurer). That redesigns governance for an area rather than setting a single operational parameter within an existing frame — Layer 3, not Layer 2.

## Problem this addresses

The Charter commits the Laboratory to publishing its findings — experiments, visitors, fieldnotes, member activities — but there was no process for who gathers them, who writes them up, or when they go out. Without one, the work tends to collapse onto whoever volunteers first.

## Why split policy.md and rule-cadence-rotation.md

The durable frame — that there are two roles, what each does, that review happens before publication, that disputes about *whether* something runs go to the ordinary process — is not something the Laboratory expects to revisit often. The cadence, the exact rotation schedule, and the evaluation metrics are exactly the kind of thing the policy's own text calls "proposed defaults, expected to change once the Laboratory has a few months of real data." Keeping those in a separate Layer 2 file means retuning them later does not require reopening the whole policy, consistent with the instrument template's own instruction to split "anything you expect to tune" into a companion `rule-*.md`.

## What was forced versus chosen

**Forced by the source material:** the two-role split, the Thursday–Sunday submission window feeding a Monday–Tuesday assembly period, the Tuesday review by Publisher and Agent, the "never published over an objection" rule, and the Editor-claims-previous-Publisher sign-up mechanic — all came directly from Madison's original draft and issue #7, and are carried through unchanged.

**Chosen in this pass, and worth checking:**
- The exact restructuring into the template's five numbered sections — mechanical, but the editorial judgement of what counts as "durable frame" versus "tunable" in §4 of `policy.md` versus `rule-cadence-rotation.md` is this drafting pass's call, not a value the original text stated explicitly.
- The recomputed dates (launch 18 November 2026, the full rotation table through September 2027) — the *mechanism* (three-week rounds, the Christmas/New Year break folded into whichever round it falls in) is carried from the original draft, but applying it to new dates was a computation done in this pass, not a value judgement. It should still be checked against a calculator before filing, not trusted because it reads cleanly.
- Leaving the full 14-round schedule in place despite it running past this Constitution's own 30 November 2026 expiry, rather than scoping it down to what provably fits before that date — the Laboratory's proposer chose to treat this as ongoing infrastructure regardless of this particular Constitution's fate. This is flagged in `rule-cadence-rotation.md` itself so a later reader is not misled by a stale, finished-looking table.
- The Source of authority citation in `policy.md` §2 is written loosely as "the Charter's Findings provisions" rather than a specific section number, because the Charter lives in a gated Google Doc this drafting pass could not read. **This should be confirmed against the primary document and tightened to an exact citation before the pull request is opened** — it is the one required field in the template this draft could not fill with confidence.

## Conflicts checked

- `grep -ri "dispatch" constitution.md policies/ rules/` — found `rules/rule-dispatches-disclaimer.md` (merged PR #14, 20 October 2026) and `rules/rule-ghost-publishing.md` (merged PR #5, 9 October 2026). Both predate this policy area and were filed under `rules/` because no policy existed yet for Dispatches — correct at the time. Now that `policies/dispatches/` exists, they are candidates for migration to `policies/dispatches/rule-*.md`, but the proposer chose to leave that migration for a separate, later proposal rather than fold it into this one.
- `git branch -a` and the GitHub pull requests API — no open or other merged pull request touches Dispatches policy. `madisonkaras-policy-proposal` exists as a branch but forked from a commit far behind current `main` (missing most of the repository's current tooling); it was not used as the base for this filing.
- No conflict found with `members.md` (14 members, unchanged) or `roles.md` (no existing Editor/Publisher offices).

## Open question, unresolved on purpose

Should the site include a page of Fellowship Candidate biographies? Recorded in `policy.md` §4.6 as a suggestion, not decided here — it is the Laboratory's to answer, not this drafting pass's.

## Assumptions

- The newsletter, main site, and subscriber management live on one platform (Ghost, already adopted).
- The Laboratory has 14 members, all Fellows who can take part in the rotation — current as of `members.md`'s last change log entry, 1 November 2026.
- Cadence, term length, and the rotation mechanism are starting defaults, expected to change once the Laboratory has a few months of real data.
