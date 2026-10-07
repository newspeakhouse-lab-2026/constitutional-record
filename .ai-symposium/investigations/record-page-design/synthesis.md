# Synthesis — the Record's page as a designed object

Panel: `panels/panel-01-design.md`. Tensions, steelmanned both ways:
`artifacts/tensions.json`. Recommendations with file:line and cost:
`artifacts/recommendations.json`. Research grounding and what was and wasn't
verified: `research/sources.json`, `research/research-log.md`.

This investigation is deliberately narrower than `../record-votes-panel/`,
which it does not re-litigate: that panel's R1-R5 and T1-T3 stand as written.
Where this panel's findings touch the same code, they are reported as a
fresh read of the file as it exists today (substantially redesigned since
that panel ran), not as a re-analysis of the governance system behind it.

## What converged without disagreement

Three things the prior panel found broken or absent are, on reading the
current file, already fixed or already correct, and no seat on this panel
found anything to add:

1. The "record your position" link now routes to the issue form (line 946),
   not GitHub's raw file editor -- the prior panel's one unanimous finding is
   resolved.
2. The countdown has been correctly demoted below the gap-to-threshold figure
   [lines 78-88], matching Norman's own "a clock affords nothing" reasoning,
   independently reached by whoever wrote the CSS before this panel ever
   convened.
3. The action button clears WCAG 2.5.8 (24px, AA) on desktop and 2.5.5
   (44px, AAA) on phones [S8], exactly as the page's own comments claim --
   checked with the actual numbers, not assumed.

Reported as findings, not recommendations, since nothing needs to change.

## The one finding this panel is most confident about

**`.q7` is applied to four things of three different severities**, against
its own stated scope ("genuine staleness only," line 89): a real stale
proposal (correct), a misconfigured base branch and a silently failed vote
submission (both understated -- these are `.clash`-grade problems wearing
the wrong colour), and two bare facts about which round a vote is on (both
overstated -- not warnings at all). This was found by grepping every use of
the class across the whole script, not by reading the style block alone,
and is reported as R6: a reclassification, not a new design opinion, costed
at under ten minutes and zero new tokens.

## The brief's hardest question, answered honestly rather than cleanly

The user asked whether design can do better than a sentence for the
toleration/abstention/silence problem, and said plainly this was the
question most wanted from the panel. The honest answer the panel reached:
**yes, for three of the four procedures that use these four positions, and
not yet for the fourth.**

Layer 3, Layer 4, and re-ratification resolve to one clean binary --
preference and objection decide it, toleration and abstention and silence
don't -- and a visual grouping (R8) can carry that binary without replacing
the explanatory sentence, only reinforcing it. Tier C does not resolve to
one binary: toleration and abstention sit on the *counting* side of quorum's
line and the *non-counting* side of the majority's line, in the same vote,
at the same time. Two non-nesting groupings of the same four numbers cannot
be shown as one grouping without either inventing a second visual grammar
(deferred, not rejected -- see recommendations) or printing the same four
counts twice, which undoes the card-length problem this panel also flagged
independently (T1). The panel chose not to improvise a dual-grouping design
under the time pressure the brief itself warns against, for the single
highest-stakes procedure on the page, and said so rather than claiming a
complete answer it did not actually build or see rendered.

This is written up as T2, and the panel considers it the sharpest tension in
the register -- sharper than T1 (where within a row the critical sentence
sits), because T2 is about whether a whole class of constitutional
arithmetic can be shown at all without prose, and T1 is "only" about where
on a card something goes.

## The single best new idea

**R7 — "Since you were last here."** Costed in full in the transcript and
recommendations file. The reason it is the strongest idea produced today,
not merely the cheapest: it is the only proposal considered that treats the
60-requests-an-hour ceiling -- the tightest hard constraint on this entire
page -- as an opportunity rather than only a limit. It computes its diff
from data the page is already fetching for its existing purpose, so it costs
nothing against the budget that killed or deferred every other feature idea
(deep-linked names, a second gauge grammar, Discord visibility). And it is
the most direct answer in the whole session to the brief's third ask --
"what would make a member open it voluntarily" -- because a changed-since-
last-visit signal is the one thing on this page that rewards returning,
rather than only informing someone who was already sent here.

## What this synthesis does not do

It does not claim R8 solves the toleration problem; it solves three-quarters
of it and says so (T2). It does not claim the panel saw any of these
proposals rendered -- no screenshot tool was available this session, and
every layout claim is reasoned from markup and CSS, flagged as such
throughout. It does not manufacture a fourth design tension to round out a
tidier-looking register: T4 (the --faint dark-mode contrast margin) is
reported at the strength it actually earned -- a watch-item, not a
recommendation, because it passes today.
