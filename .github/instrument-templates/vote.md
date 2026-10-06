<!--
A vote. Adopted by rules/rule-recording-votes.md.

PATH: votes/pr-{number}.md, on the proposal's own branch — the same branch as the
text being decided, so the evidence merges into the Record beside it, and so a
proposal that fails keeps its vote where the branch keeps it.

NOT under policies/ or rules/. A file in those directories is read as an adopted
instrument, by the dashboard and by check-record.py. A vote is not one.

WHO OPENS IT: whoever is running the vote. Opening a vote means naming the
procedure, freezing the list of who may vote and writing out the threshold — decisions a member
makes. No tool may do it for you.

WHO WRITES A ROW: the member it belongs to. Where a member does not or cannot use
GitHub, the Convener writes it and says so in the commit message (Section 1).
An agent may never author a position — Section 1: it "holds no membership, no
vote, and no standing."

EVERY MEMBER ENTITLED TO VOTE GETS A ROW, including those who have said nothing.
Every threshold is a fraction of that list, so the list must be visible for the
arithmetic to be checkable. Section 2 also distinguishes an abstention, which is
taking the position of not taking one, from never answering.

Then delete this comment.
-->

# Vote — PR #NNN: <proposal title>

**Procedure:** <Tier C | Layer 3 Policy | Layer 4 Constitutional | Emergency | Re-ratification | §4 remedy | §4 removal>
**Carries if:** <the Constitution's own words> — **N of 14**
**Opened:** 2026-10-06 12:00 UK (`2026-10-06T12:00:00+01:00`)
**Closes:** 2026-10-13 12:00 UK (`2026-10-13T12:00:00+01:00`)
**Entitled to vote:** 14 members, frozen when this vote opened — `members.md` blob `<sha>`

<!--
PROCEDURE — Tier A and Tier B hold no vote: they pass unless a member objects, so
they need no file. If you are filling this in for a Tier A proposal, you probably
want a comment on the pull request instead.

CARRIES IF — write the Constitution's own words, then the number for this vote.
Writing the number out is safe here and nowhere else: the list is frozen when the
vote opens and the blob it came from is cited above, so it is a fact about this
vote rather than a figure that goes stale when membership changes.

  Two rounding rules, and they differ on an even number of members:
    a named fraction rounds up            two-thirds of 14 -> ceil(9.33) = 10
    a majority is MORE THAN HALF          majority of 14   -> 7 + 1     = 8
  A majority of 14 is 8, not 7. Seven of fourteen is a tie, and a tie fails.

OPENED / CLOSES — both forms, every time: the words a person reads, then the
instant a machine reads, backticked. The offset is explicit because the United
Kingdom is on British Summer Time from late March to late October, and a missing
offset is how a deadline ends up an hour out. It has happened here before.
A check warns when the words and the timestamp disagree.

ENTITLED TO VOTE — Section 2 counts "all members entitled to vote when the vote opens", so
cite the members.md blob the list was taken from (`git rev-parse HEAD:members.md`). A member who joins mid-vote
does not change the denominator.

IF THE VOTE RESTARTS — a material change restarts the deliberation period
(Section 2). Clear the Position and Date cells, add a line reading
`**Restarted:** <date> — <what changed>` below Entitled to vote, and vote again. The earlier
round stays in this file's history, which is the Record. Do not keep two tables.
-->

| Member | Position | Date |
|---|---|---|
| <member> | — | |
| <member> | — | |
| <one row per member entitled to vote, in the order members.md lists them> | — | |

**Positions:** `preference` · `toleration` · `abstention` · `objection` · `—` not answered.

> **Only `preference` counts as affirmative support.** Where a procedure needs
> affirmative support from a fraction of all members — Layer 3, Layer 4 and
> re-ratification all do — toleration, abstention and never answering are the
> same number. None of them is a yes.

## Result

*Written when the window closes, with the arithmetic shown.*

**<Carried | Did not carry>.**
Affirmative N of 14, needed N.
preference N · toleration N · abstention N · objection N · not answered N

<!--
SHOW THE WORKING. Section 3 makes a Record Keeper "verify that the vote happened
and that the correct outcome is recorded" — a comparison, so there has to be
something to compare. Rows alone offer nothing to verify; a result alone offers no
evidence.

TIER C HAS TWO DENOMINATORS and this is where tallies go wrong:
  quorum   counts over everyone who responded      (toleration and abstention COUNT)
  majority counts over preference and objection only
So write both lines out:
  quorum 11 of 14 responded, needed 7 — met
  majority 4 of 7 counted (preference and objection only), needed 4 — carried
A toleration helps reach quorum without diluting the majority. That is what the
word is for.

NOBODY CHOSE PREFERENCE OR OBJECTION? Then even with quorum met there is
nobody to count a majority of, so it does not carry. Say that in words.

NO VERDICT AVAILABLE for an Emergency resolution or a Section 3.9 recall: neither
states its denominator unambiguously. Print both readings and say the Constitution
does not settle it. Guessing a number here would set a threshold, which Section 2
reserves to Layer 4.
-->

## Objections

*Each objection's reason and route forward, in full. Section 2 requires both.*

<!--
VERBATIM, AND IN THIS FILE. A reason that exists only in a pull request comment is
not in the Record — git clone retrieves none of it. The one thing Section 2
insists an objection contain must not be the one thing kept outside the
repository.

AN OBJECTION IS NEVER DISCOUNTED for a missing part. Ask for the rest; do not
treat the concern as absent. Anyone may ask.
-->

**<member>** — <date>

> Reason: <verbatim>
>
> Route forward: <verbatim>

Discussion: <link>

## Notes

*Optional. Section 2 invites a member to say what would move their position.*
