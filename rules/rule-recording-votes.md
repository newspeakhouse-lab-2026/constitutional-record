# Ordinary rule: recording votes

**Layer:** 2 — Ordinary resolution
**Tier:** A — 48 hours

## What this does

It says where a vote is written down, and in what form. Nothing more.

Every threshold, every position and every procedure is already in the
Constitution. **This rule adds none and changes none.** It creates no duty: a
member who states a position in the governance channel has voted, whether or not
anyone writes it into a file. The file is **evidence of a vote, not the vote
itself**.

Layer follows effect, and the effect here is clerical. This is the same ground as
`rule-drafting-tools.md`, which adopted the instrument templates by Ordinary
resolution because prompting for what Section 2 already requires creates nothing.

## Where a vote lives

**`votes/pr-{number}.md`, on the proposal's own branch.**

On the proposal's branch so the evidence merges into the Record beside the text it
adopted — and so a proposal that fails keeps its vote on the branch, where it
remains part of the repository.

Named by pull request number because that number is immutable and is already how
proposals are referred to everywhere else.

**Not** beside the instrument under `policies/` or `rules/`. The dashboard and
`check-record.py` both read a file in those directories as an adopted instrument,
and a vote is not one.

## What it looks like

A header, one table, a result, and the objections in full. The template is
`.github/instrument-templates/vote.md`.

- **Every member is listed, including those who said nothing.** Every threshold in
  the Constitution is a fraction of everyone entitled to vote, so the arithmetic
  cannot be checked unless they are all visible. Section 2 also distinguishes an abstention —
  "does not take a position" — from never answering, and a list of only those who
  answered could not show the difference.
- **Who may vote is frozen when the vote opens.** Section 2 counts "all members
  entitled to vote when the vote opens", so the file cites the `members.md`
  commit it was taken from. The freeze is then a fact anyone can check rather
  than something someone remembers.
- **`Carries if:` writes out the number.** Safe here, unlike elsewhere in the
  Record: because that list is frozen at open, the figure is a fact about this
  vote rather than a global that silently goes stale when membership changes.
- **No free-text column in the table.** A reason or a note belongs under
  *Objections*. One newline in a table cell ends the row and lets a single edit
  forge several.

## Who writes a row

The member it belongs to.

A member's AI agent may write the row that member has told it to write. Section 1
gives an agent no vote **of its own** and makes its actions the member's
responsibility, so the position is the member's either way.

**The act may be delegated; the decision may not.** A member may have their agent
record a position they have stated. A member may not ask it to decide what their
position is, and it may not offer to. Recording a stated position is
transcription; inferring one from a conversation is not, and no record can tell
the two apart afterwards. Section 1 also requires an agent working on Laboratory
infrastructure to be identifiable as that member's agent, which for a commit
means saying so in it.

Where a member does not or cannot use GitHub, **the Convener writes the row and
says so in the commit message.** Section 1 requires a reasonably equivalent route
for any member who cannot use the tooling, and this is it. It is never recorded
as though the member acted directly, and the Convener may not interpret,
summarise or improve a position.

## Objections are written into the file

An objection must carry a reason and a suggested route forward (Section 2). Both
go into the *Objections* section **verbatim**, and the discussion is linked.

A reason that exists only in a pull request comment is not in the Record — `git
clone` retrieves none of it, and nor does anything else that survives the
platform. The one thing Section 2 insists an objection contain must not be the
one thing kept outside the repository.

## The result

Written into the file when the window closes, with the arithmetic shown.

Section 3 makes a Record Keeper "verify that the vote happened and that the
correct outcome is recorded". That is a comparison, so there has to be something
to compare: the stated result against the rows above it. A file holding only rows
offers nothing to verify; a file holding only a result offers no evidence.

**Tier C needs care.** Quorum counts over everyone who responded; the majority
counts over preferences and objections only. Two different denominators inside
one procedure, and the commonest way to get a tally wrong. Write both out.

Fractions round up.

## If the vote restarts

A material change restarts the deliberation period (Section 2). Write the closing
round's outcome into *Earlier rounds*, clear the positions, say in a `Restarted:`
line what changed, set the new window, and vote again.

**One table, always the current round.** Earlier rounds keep their outcome and
their reason for restarting; who held which position in one is in the file's git
history, which is the Record. This is not only tidiness: every tool that writes
to this file depends on there being exactly one table, and with two, nothing can
tell which round a row belongs to.

A restart does not clear the objections. An objection is deliberation and stands
until the member withdraws it, even where the change that caused the restart was
made to answer it.

## What this does not do

**It creates no duty.** No proposal is invalid for having no file, no member is
required to use GitHub to vote, and nothing here may block an amendment.

**It decides nothing.** Any tool that reads or writes this file reports and
transcribes. What carries is decided by the Constitution and verified by a Record
Keeper. A tool that disagrees with the Constitution is a defect in the tool.

**It is subordinate.** Where this rule and the Constitution disagree, the
Constitution is right and this rule is wrong.

## Amendment

Any part of this rule may be amended by Ordinary resolution. Changes to the
template it adopts follow the same route.

## Ends

**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) —
with this Constitution, whose votes it exists to record.

`Observed by:` A vote's existence and outcome are visible in the file and its
history. A vote held with no file recorded is visible as a merged proposal with
no `votes/` entry. A row written by someone other than the member it names is
visible in `git log`, which records who made every commit.
