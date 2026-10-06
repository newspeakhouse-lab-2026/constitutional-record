# Planning — Record Votes Panel

## Original question

The user asked for an actual panel — not a report — reviewing `git diff
drafting-tools..record-votes` (15 commits, the vote-recording system for the
Constitutional Record), staffed from six named perspectives, producing rounds
of real deliberation and a tensions register, with a closing synthesis naming
unresolved choices and their costs rather than smoothing them into agreed
findings.

## Why one panel, not an arc

The standard AI Symposium arc (Exploration → Technical/Critical → Synthesis)
assumes the territory needs mapping before anyone can disagree productively.
Here the territory is already mapped — exhaustively, by `voting-requirements.md`
(R1–R11) and by the prior single-voice report
(`.ai-symposium/vote-system-review.md`), both already read in full. Running an
Exploration panel first would re-derive ground those documents already cover
and would dilute the thing the brief actually asked for: six-to-seven distinct,
named, real voices in the same room, disagreeing on the record, about specific
open questions the brief itself names (PR #9's layer, the toleration trap, the
two members without push access, whether this is ceremony).

So: one panel, run as a CRITICAL PANEL in form (stress-test, steelman, find
blind spots) but staffed by the six required lenses rather than a generic
critic roster, with an explicit Tensions Register as the primary output and a
closing Synthesis section (hours 18–24) that names each unresolved tension as
a choice with a cost, per the brief's explicit instruction not to resolve by
cleverness.

## Why these seven, not six

The brief asks for "at least" six. A seventh seat (James C. Scott) is added
because every one of the other six would otherwise converge too easily on
"legibility is good, formalise everything" — Scott is the one voice who will
say the Record's insistence on a named row, a numeric GitHub ID, and a single
canonical table for every position is a *high-modernist* choice with a real
cost for the two members who structurally cannot be legible to it (no push
access), and that cost is not currently disclosed anywhere a member would see
it before it bites. Without Scott, the panel has no one positioned to make
that argument against Elster's and Schneier's shared instinct that more
structure is more legitimate/more secure. This is deliberately the "someone
unexpected" the symposium's own selection principles ask for.

Mapping brief seat → named expert, with the real work each is drawing on:

1. Constitutional/institutional design → **Jon Elster** (*Ulysses Unbound*,
   2000 — precommitment, constitutions as self-binding devices, and —
   importantly, verified by search — his own later partial repudiation of the
   individual/collective disanalogy in that same book's second half, which
   sharpens rather than weakens what he can say about self-amending rules).
2. Adversarial security → **Bruce Schneier** (security economics, attack
   trees, "security is a process not a product," who benefits from
   ambiguity).
3. Interface and attention → **Don Norman** (*The Design of Everyday Things* —
   slips vs. mistakes, affordances/signifiers, "human error is usually a
   design error").
4. Small-group governance in practice → **Elinor Ostrom** (*Governing the
   Commons*, 1990 — eight design principles, verified by search: boundaries,
   proportional costs/benefits, collective choice, monitoring, **graduated
   sanctions**, cheap conflict resolution, nested enterprise, recognised
   self-determination). Ostrom's dialogue explicitly invokes Hirschman's
   exit/voice/loyalty and the Advice's Collective Action Trilemma by name,
   per the brief's instruction to use them where they bite, without giving
   them separate seats.
5. Software reliability → **Charity Majors** (observability engineering —
   "if you didn't instrument it, you don't know it broke"; production as the
   only truth; sociotechnical systems).
6. The disengaged member's advocate → **B.J. Fogg** (*Tiny Habits*; the Fogg
   Behavior Model, B=MAP — verified by search: behaviour is motivation times
   ability times prompt, not a sum, and if any one drops to zero at the
   moment of decision nothing happens). Chosen over a generic "advocate"
   because Fogg gives this seat an actual falsifiable model to argue from,
   rather than vibes about boredom.
7. Wildcard/critic → **James C. Scott** (*Seeing Like a State*; *Weapons of
   the Weak* — legibility, metis vs. techne, high modernism).

## What "winning" means here

The brief says the disengaged member's advocate "must be allowed to win
arguments." In practice this means: wherever Fogg's friction/motivation
argument and someone else's formal-correctness argument collide, the
transcript lets Fogg's position stand as the one the panel adopts for that
specific recommendation, even where Elster or Schneier are not fully
persuaded — and says so explicitly rather than papering over it with a
compromise nobody argued for.

## Mid-task correction: reweighted after Phase 1 setup was written

After the roster above was drafted but before the panel ran, the coordinator
reweighted the brief: **the primary subject is the rendered dashboard UI**
(`docs/index.html`) — layout, hierarchy, what the eye lands on first, what is
lost on a phone, what a tired member misreads. Wider UX (the Discord-link-to-
recorded-position journey, the issue forms as forms, `CONTRIBUTING.md` under
time pressure) is substantial but secondary. The constitutional, security and
reliability lenses are kept but subordinated: they earn a line only when they
change what a member is shown or asked to do. The disengaged member's
advocate (Fogg) is now the loudest voice in the room, not one of seven equal
seats. The output shape changes too: five sharp UI findings with concrete
fixes are wanted more than a wide tensions register — the register is kept,
but trimmed to the handful of disagreements that survive being pointed at
actual member experience, rather than one tension per lens.

This changed what the panel produced, not who is in the room. Verified before
rewriting anything: `docs/index.html`'s own "record your position" link
(line 728) points at `/edit/{branch}/votes/pr-{n}.md` — GitHub's raw file
editor — never at `issues/new?template=vote.yml`. The only `template=` link
anywhere in the file is `proposal.yml`, for raising a new issue (line 798).
Confirmed by `grep -n "template=vote\|template=objection\|issues/new"
docs/index.html` before the panel treated this as a finding. This single
fact reorganised the whole session: it is the one place every lens — Scott's
accessibility critique, Schneier's audit-trail argument, Fogg's friction
argument, Norman's affordance argument — converges without disagreement, so
it leads the findings rather than sitting in the tensions register.

## What I will not re-litigate

The user corrected the prior report's S1 (agent-vote hook) finding: the
missing deny-list entry was a deliberate removal, not an oversight, and
`AGENTS.md`'s "Hard rules" section already states it as a trust boundary the
agent itself must hold, not a control the hook provides. The panel does not
re-report this as missing. Schneier is explicitly invited to argue the line
is drawn in the wrong place — which is different from reporting the control
as absent by mistake.
