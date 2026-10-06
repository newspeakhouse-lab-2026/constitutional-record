# Panel 1: The Record's vote-recording system — dashboard first, mechanism second

**Type**: critical (reweighted mid-session toward UI/UX; constitutional,
security and reliability lenses retained but subordinated to member
experience)
**Date**: 2026-10-06
**Status**: completed

---

## Context

**Original question**: Review `git diff drafting-tools..record-votes` (the
vote-recording system) as a convened panel of distinct, disagreeing
perspectives — constitutional/institutional design, adversarial security,
interface and attention, small-group governance in practice, software
reliability, the disengaged member's advocate, plus one wildcard — producing
a tensions register rather than a smoothed consensus, against the hard
deadline of interim offices expiring 23:59 UK 2 November 2026.

**This panel's focus** (after a mid-session reweight): the rendered dashboard
(`docs/index.html`) as the primary subject — what a tired member on a phone
actually sees and does — with the wider vote-recording UX (Discord link →
issue form → recorded position; `CONTRIBUTING.md` under time pressure) as a
substantial second subject, and the constitutional/security/reliability
lenses invoked only where they change what a member is shown or asked to do.

**Building on**: `voting-requirements.md` (R1-R11, read in full);
`.ai-symposium/vote-system-review.md` (the prior single-voice report, read in
full — this panel does not re-report its findings, only extends, confirms,
or contradicts them where the live code has moved or a fresh angle applies).

**Inherited from the prior report, confirmed still open on this branch**:
S4/D3 (the forms exist but are not advertised in `CONTRIBUTING.md`'s Quick
Reference), U3-U5 (glossary, ratio formatting, awaiting-list truncation).

**Already fixed, not re-reported** (per the task brief's own list, confirmed
by reading the current files rather than trusted on claim): the "roll"
jargon; "only preference counts as a yes" now styled `.yesonly`, bold and
ink-coloured, not `.quiet`; §3.9 recall added to the vote template's
procedure placeholder; five places that restated dates now point at
`roles.md` or the dashboard instead.

---

## Panelists

| Seat | Expert | Role this panel |
|---|---|---|
| Disengaged member's advocate | **B.J. Fogg** | Lead. Argues from B=MAP (behaviour = motivation × ability × prompt, multiplicative) [S12]. |
| Interface and attention | **Don Norman** | Lead. Argues from affordances, signifiers, slips vs. mistakes. |
| Constitutional/institutional design | **Jon Elster** | On call — precommitment, self-amending rules, and (per his own later partial retraction of the clean precommitment analogy [S14]) suspicious of anyone who reaches for "the Constitution already settled this" too quickly. |
| Adversarial security | **Bruce Schneier** | On call — asks who benefits from a confusing or invisible failure, not who might mount an exotic attack nobody here will mount. |
| Small-group governance in practice | **Elinor Ostrom** | On call — eight design principles [S13], applied as a practice gut-check: what do fourteen cohabiting people actually do with this page in month three. |
| Software reliability | **Charity Majors** | On call — failures a member experiences as silence, not abstract observability architecture. |
| Wildcard | **James C. Scott** | On call — who this clean, legible page is built for, and who it quietly isn't. |

No one is returning; this is the Record's first symposium panel on this
material.

---

## Transcript

### Hours 1-6: Grounding — what is this page, and who is actually looking at it

**NORMAN**: Before anything else, I want us looking at the same object. I
opened `docs/index.html` and read `render()` end to end rather than the
feature list. What a member actually gets is one long vertical list —
`<div class="r">` rows — sorted by nothing but time-to-deadline
(`live.sort((a,b)=>a.ms-b.ms)`, line 765). A Tier A rule with forty hours
left, the Constitution's own 2 November interim-office deadline, and a
re-ratification vote three days from closing are interleaved purely by
countdown value. There is no "what does this have to do with me" axis at
all. That's not a bug in any one row; it's the organising principle of the
page, and it's wrong for a skimming reader.

**FOGG**: Say what that costs in my terms. Ability is "can a tired person
find the one row that's theirs." Right now that's a linear scan of every row
on the page, reading every `.why` line, looking for their own name inside an
`awaiting` list that's alphabetical-ish and truncated at four (`vote.awaiting
.slice(0,4)`, line 726). If I'm the ninth-least-engaged member of fourteen,
I'm not reading eleven rows to find out if one of them needs me. I bounce.
Motivation was never the problem here — I don't need more motivation copy. I
need the ability cost of "is this for me" to be near zero, and right now it's
the single highest-friction unsolved step on the page.

**SCHNEIER**: Before we go further into layout — I want the room to say
plainly what we are and are not defending against, because it changes how
much any of this is worth building. Nobody is going to forge a vote by
exploiting CSS. The actual adversary, if there is one, is time and apathy:
a member who could have objected but the window closed, or a bad-faith
delay tactic dressed as a procedural question. I'll flag the one place
ambiguity is genuinely exploitable later. For now: don't let me, or the
Constitution, or the self-amendment questions, eat the panel. Those matter
only insofar as they change what the page tells somebody, or what somebody
is asked to click.

**ELSTER**: Agreed, and I'll hold myself to that. One ground-clearing point
only: this page has no authority. `voteOf()` and `tally.py` both say so in
their own comments — "the page reports; it does not decide" (`rule-drafting-
tools.md`). That's correct design and I don't want to re-litigate it. What I
will come back to is narrower: does the page's *rendering choices* make a
member more or less likely to misjudge whether a window is actually running
— because that is a legitimacy-adjacent question even though the page itself
claims no authority.

**OSTROM**: I'd add the practice question underneath Norman's layout one.
Fourteen people sharing a house, by month three, develop their own informal
channel for "did anyone see the vote thing" — a WhatsApp message, someone
shouting up a stairwell. The page is competing with that channel, not
replacing it. If the page is slower to answer "is this for me" than asking a
housemate, people will ask the housemate, and the Record's whole design
principle — that the file, not the channel, is the evidence — quietly stops
being where the truth lives. That's not hypothetical: `CONTRIBUTING.md`
itself concedes "absence of objection on a pull request is not proof of
lazy consensus," because deliberation runs in the channel it cannot see.

**MAJORS**: And from where I sit, the thing that worries me is not that this
page might be wrong — it's that it might be *silently incomplete* and nobody
would know. `windowOf()` reads GitHub labels; if the labelling workflow and
the page disagree about what a label means, the page just renders something
plausible-looking with no error. A member cannot tell "this row is accurate"
from "this row is stale in a way nothing flagged." I'll come back to this
with a concrete case once we're in the vote rows themselves.

**SCOTT**: My opening claim, which I expect to be the least popular one in
the room: this entire design assumes a legible member — someone with a
GitHub account whose numeric ID is in `members.md`, who can read a markdown
table, who has push access to edit a file on a branch. For most of the
fourteen that's true. For the two without push access [R4.4, S9], it isn't,
and nothing on the page says so. I'll bring the concrete case later too.

---

### Hours 6-12: Exploration — the five findings, in the order the eye actually meets them

**NORMAN**: Let's walk it in reading order, because that's the only order
that matters for a skim. Top of a proposal row: the tags —
`<span class="tag ty">Proposal</span>`, `VOTE OPEN`, `L3`, `C`, state tags,
then `@user · filed Nd ago · N notes · H/N endorsed` — all concatenated with
" · " into one `.meta` div (line 707), all the same 0.75rem muted grey. Then
underneath, the `.why` line, which for an open Tier C vote reads, verified
against the actual render logic:

> **5 toward the 10 needed** · preference 5 · toleration 1 · abstention 0 ·
> objection 0 · awaiting Disha Shanbhag, Joel Naoki CHRISTOPH, Niba, Noam
> Herberg and 4 more · record your position · **only preference counts as a
> yes**

Eight clauses, one line, 11.8px, one visual weight apart from the bolded
headline number and the one sentence correctly singled out as `.yesonly`.
The thing a member needs to *do* — "record your position" — is a bare `<a>`
with no padding, no border, sitting between a name list and a warning
clause. On a phone that is the worst-placed, hardest-to-hit target on the
page for the one action the page exists to produce.

**FOGG**: And I want to name the thing underneath that, which is the first
of what I'll insist are the five findings worth fixing. **Finding 1 is not
this line — it's where that link actually goes.** Read the href.

**[the panel pulls up the code together]**

**NORMAN**: `https://github.com/${REPO}/edit/${branch}/votes/pr-${n}.md`
(line 728). That's GitHub's raw file editor on the branch. Not an issue
form. There is exactly one `template=` link anywhere on this whole page —
`issues/new?template=proposal.yml`, line 798, for raising a brand-new
governance question, nothing to do with voting. `template=vote.yml` and
`template=objection.yml` — the forms this very pull request built, with a
workflow that validates identity, retries on write conflict, and writes a
commit message that says outright "the position is the member's; this
commit only writes it down" — are never linked from the dashboard at all.

**FOGG**: So the one button on the page that matters sends a tired person to
the *harder* path. Ability cost of hand-editing a pipe-separated markdown
table — finding your row among fourteen, replacing `—` with one of four
words spelled correctly, adding today's date without breaking the table
syntax — is dramatically higher than filling in a dropdown and a text field.
This is B=MAP doing exactly what it predicts: ability craters, so the
behaviour doesn't happen regardless of how motivated the member is. This
is Finding 1, and it is the easiest and highest-leverage fix on this entire
page: point that link at the issue form, not the file.

**SCHNEIER**: I said I'd only speak when something changes what a member is
shown or asked to do — this does, and sharply, so I'll take my turn now
rather than later. The issue-form path produces a uniform, fixed commit
message naming the workflow as transcriber. The raw-file path produces
whatever commit message the member — or, Section 1 being what it is, a
member's agent acting on their instruction — happens to write. `AGENTS.md`'s
entire "never decide a position" discipline rests on the `Co-Authored-By:`
trailer being present and honest. The form enforces that structurally. The
raw-file edit enforces it only as a convention someone has to remember. If
you want the "transcription, not decision" line to actually be legible in
the Record's own history rather than merely asserted in a policy document,
route people through the thing that writes it down consistently. That's not
a security feature nobody needs — it's the audit trail for the one
principle this whole rule is built around.

**ELSTER**: And from where I sit: a position recorded through the form has
a uniform evidentiary shape a Record Keeper can scan without reading prose.
A position recorded by hand has whatever shape its author gave it. Section
3 asks a Record Keeper to "verify that the vote happened and that the
correct outcome is recorded" — that's a comparison, and a comparison is
easier against a uniform shape. I don't think this rises to a legitimacy
defect in the vote itself — the rule is explicit that the file is "evidence
of a vote, not the vote itself" — but it does mean two votes recorded
through two different routes carry different *quality* of evidence for the
same underlying fact, and nothing on the page discloses which route
produced which row.

**SCOTT**: Which is exactly my case, and I didn't expect to need it this
early. The two members without push access [R4.4] cannot use the raw-file
edit route the way `CONTRIBUTING.md` describes it — a non-collaborator
editing a file on a protected branch is offered a fork-and-PR flow by
GitHub's own UI, not a direct commit. I haven't watched that happen live on
this org and I won't claim I have — flagging that as **unverified** — but
the permission model behind it is not in question: GitHub's own rules are
that issues on a public repository are open to anyone with read access,
while committing to a branch needs write access. The dashboard's one link
routes every member, including the two for whom it is structurally the
*wrong* route, to the path that needs permissions two of them don't have —
when the alternative the project already built would have worked for them
directly. This isn't a UI nicety. It's the dashboard pointing exactly the
members Section 1 says must not lose a right over tooling at the one link
most likely to be a dead end for them.

**OSTROM**: I'll put the practice frame under that rather than argue it.
Ostrom's monitoring principle says the people a rule protects should be able
to see that it's working, not just trust that it is. Right now nothing on
the rendered page distinguishes a row recorded through the form from a row
recorded by hand from a row the Convener transcribed on someone's behalf —
they all look identical in `voteOf()`'s table parse, which reads only the
position string, never who committed it or how. That's worth coming back to
as its own, smaller finding — not fixed by routing the link correctly, which
only helps a member recording their *own* position going forward.

**MAJORS**: Can I bank the reliability angle on this same finding before we
move on, so it doesn't get lost. If this link keeps pointing at the raw
file and a member gets partway through editing it by hand — breaks a pipe
character, doesn't match their name's exact spelling (the workflow's own
`apply()` throws `no row for ${me.name}` on a mismatch; a human hand-editing
has no such check) — nothing on the page will ever show that failure. The
form path at least produces an issue, a comment, and on five failed retries
a `vote-failed` label the dashboard's `stuckVotes` surfaces as "N submissions
did not record" on the row (line ~739). The raw-file path produces nothing
visible if it goes wrong except a confused member and a file a Record
Keeper has to notice looks off. Routing the link correctly doesn't just
lower friction — it moves failures from invisible to observable. That's the
reliability case for Finding 1, not just the UX case.

**FOGG**: Good — that's four lenses converging on the same fix without
anyone arguing the other side. I don't think this is a tension at all. It's
a bug. Let's log it as Finding 1 and keep moving; the brief wants sharp
tensions, not twenty agreements, and this isn't one — it's a correction
everyone in the room reached for a different reason.

**NORMAN**: Finding 2, staying on the same line. Even once that link points
somewhere better, the line itself needs restructuring. Demote the repeated
position breakdown (`preference 5 · toleration 1 · abstention 0 · objection
0`) — it duplicates what "5 toward the 10 needed" already says for the
common case — to a smaller, fainter sub-line. Style the link as an actual
button: border, padding, its own line, not inline prose. Keep `.yesonly`
exactly as it is now; it was fixed correctly and should not be touched.

**FOGG**: And don't just shrink the breakdown — ask whether a disengaged
member needs to see "toleration 1 · abstention 0" at all on first glance.
They need three things, in this order: how close is this to happening,
is it closing soon, and what, if anything, do I need to do. Everything else
is detail for someone who already decided to read further. Collapse the
rest behind the headline, don't just make it smaller — smaller-but-present
still costs a fixation point.

**NORMAN**: Finding 3. There is no way for a returning member to say "I am
Niba" and have the page remember it. That's a direct consequence of the
no-login design — `CONTRIBUTING.md` and the code comments both say OAuth is
impossible on a static page — so I'm not proposing login. But the page
already uses `localStorage` extensively for caching (`cacheGet`, `blob()`).
A purely client-side, non-authenticating "I am: [dropdown]" that persists
locally and bolds or pins any row where that name appears in an `awaiting`
list costs nothing security-wise — it proves nothing and isn't meant to —
and directly answers Fogg's ability problem from the opening round.

**FOGG**: That is Finding 3, and I want it on record that it's the one I
care about most, more than the button styling. A "my attention, specifically"
filter is the single highest-leverage missing feature for the nine of
fourteen this seat exists to represent. It turns "scan eleven rows" into
"read the three that mention me." Nothing else proposed today does that.

**SCHNEIER**: No objection, and one small addition: make clear in the UI
that the picker is a convenience, not an identity claim — it should not read
as "logged in as," because it isn't, and a member must never infer their
vote is protected by having picked their own name from a list anyone could
pick.

**NORMAN**: Finding 4. Ratios on this page are written three structurally
different ways, confirmed in the render code: `"N toward the M needed"` for
an affirmative threshold, `"N of M have answered... quorum N — met/not met"`
for Tier C's participation threshold, and `"H/N endorsed"` for Layer 4's
endorsing-review count. None carries a proportional visual cue. A member
scanning several rows cannot tell "almost done" from "nowhere close" without
reading and dividing. The brief's own illustrative worry — that `7 of 8` and
`5 of 10` look identical at a glance — is exactly right even though neither
string appears verbatim; three *different* ratio grammars on one page make
it worse, not better, because the reader has to first work out which kind
of ratio they're looking at before they can judge how close it is.

**FOGG**: Cheapest fix, not a progress bar — that's more than four weeks of
runway justifies for this. Reuse the `--soon`/`--urgent` colour classes
already defined and already accessible (confirmed by the prior report's
contrast math) and apply them to the ratio *number itself* once it crosses
50%/90% of its own threshold, the same visual language already doing this
job for time-urgency. One function, three call sites.

**OSTROM**: Add the glossary point while we're here, since it's cheap and
it's been sitting unfixed since the prior report: the page defines L0-L4
and Tier A-C but never defines "quorum" or "majority" as concepts, and the
per-row Tier C explanation uses both as though the reader already
distinguishes a participation threshold from a support threshold. One
sentence in the existing glossary paragraph closes this. Low cost, still
worth doing, not one of the five headline fixes.

**NORMAN**: Finding 5, and this is the one that leaves the dashboard proper
and goes to the forms and the guide, because the brief asked for the wider
journey too, not just the rendered page. Open `vote.yml`'s dropdown. Four
options, each a long single line:

> "toleration — I may not be in favour, but I have no reasoned objection.
> Counted as an abstention, not a yes"

The distinguishing clause — "Counted as an abstention, not a yes" — sits at
the *end*. A tired person skimming a native `<select>` reads the first few
words of each option and stops; the first few words of all four options are
nearly interchangeable procedural throat-clearing. The thing that actually
differs between options is buried exactly where skimming stops looking.

**FOGG**: Front-load it. "toleration — no objection (NOT a yes)." Say the
caveat first, the nuance after, not the other way round. And while we're
doing journeys rather than pixels: `CONTRIBUTING.md`'s Quick Reference table
— the first thing anyone consults under time pressure — lists "Record a
vote → your row in `votes/pr-{number}.md`... step 6" as the instruction, and
never mentions the issue forms exist at all in that table. So even once
Finding 1 is fixed and the dashboard points at the form correctly, a member
who goes looking for how to vote by reading the guide instead of clicking
the dashboard link will still be told, first, to go hand-edit a file. The
easier path is the one nobody is told about, in two different places at
once. That compounds Finding 1 rather than standing apart from it, which is
why I'm folding it into the same finding rather than calling it a sixth.

**MAJORS**: One late addition before we leave the forms, because it's a
silence case and that's my seat: a member who submits the vote form and
whose fifth retry attempt fails (`record-vote.yml`'s own comment: "Among
fourteen people that should not happen, so this is worth a look") gets an
issue comment and a label. The dashboard does surface this — `d.stuckVotes`
renders "N submissions did not record" on the proposal row — but generically,
not addressed to the member whose submission it was. If they don't reload
the dashboard and don't reread the issue, they may reasonably believe their
position landed because GitHub told them "submitted." I don't think this
needs new infrastructure — the code comment is right that five concurrent
conflicts among fourteen people is a near-zero event — but it's worth one
line in the issue-closing message telling them explicitly to check the
dashboard or the file before assuming it worked.

---

### Hours 12-18: Convergence — what survived contact, what didn't

**SCHNEIER**: I want to name the one thing I came in prepared to argue and
am not going to, now that we've done the walk-through. I expected to spend
real time on the agent-vote trust boundary — whether a member's agent could
submit a position the member never actually stated. I'm not raising it as a
fresh finding, because the user's own brief already settled it: the deny-
list entry was removed deliberately, `AGENTS.md` already states the line as
a trust boundary the agent itself must hold, and there's no hook fix I can
propose that survives being pointed at experience the way this panel is
supposed to be pointed. The honest version of my seat's contribution this
session is Finding 1's audit-trail point, not a new control. I'd rather say
that plainly than manufacture a second finding to justify the seat.

**ELSTER**: Likewise — I expected to spend time on whether `rules/rule-
drafting-tools.md`'s own adoption, at Layer 2 Tier A, of the very templates
and dashboard that implement the layer system, is a sound place for a
self-amending system to draw its own boundary. It's a real question. But
pointed at experience, as instructed, it changes nothing about what a
member is shown or asked to do today — it's a question about the validity
of the tooling's *authority*, not its *interface*. I'll put it in the
tensions register as a smaller, flagged item rather than argue it here,
because arguing it well would mean leaving the dashboard, and the dashboard
is where this panel was told to stay.

**SCOTT**: I'll hold my ground slightly more than that, because my Finding-1
contribution already showed the legibility critique changes experience
directly — two members get routed to a dead end. The piece I haven't
resolved is Ostrom's point from the exploration round: nothing on the
rendered page distinguishes a self-recorded row from a Convener-transcribed
one. I think that's a genuine, small, experience-grounded tension, not a
clean fix, and I'd like it in the register rather than folded into Finding
1.

**OSTROM**: Agreed it's a tension, not a finding, and I'll take the other
side of it properly rather than just raising it. Disclosure helps a Record
Keeper and helps me, as the governance-practice seat, see the system is
working as designed. But disclosure also means a page rendering "Convener-
transcribed" next to exactly the two names who can't push access singles
them out, permanently, in a public repository, as the ones who needed help.
Section 1's whole point in requiring a "reasonably equivalent route" was
that using it shouldn't cost a member anything. Making it visible on the one
page everyone looks at is a cost, even if it's a small one. I don't think
cleverness resolves this, and I donll't want to pretend it does.

**FOGG**: I'll register disagreement with my own seat's instinct here, which
the brief said I'm allowed to lose when the cost runs the other way. My
first reaction is "more legible is better, ship the disclosure" — but
Ostrom's stigma point is specific and real in a fourteen-person house where
everyone will know within a day who the two unlabelled rows belong to
anyway. I don't think my seat's usual argument — reduce friction, increase
transparency — wins this one cleanly. I'm content to leave it as a genuine
tension rather than force a recommendation.

**MAJORS**: From reliability: whichever way that tension resolves, it should
resolve the same way everywhere, not differently on the dashboard than in
the file. Right now the file (`votes/pr-{n}.md`'s commit history) already
discloses it, quietly, to anyone who reads `git log`. The dashboard
currently discloses nothing. So the status quo is not "no disclosure" — it's
"disclosure exists, but only to someone already fluent enough to go looking,"
which is its own odd compromise nobody actually chose on purpose. Worth
saying that the current state is an accident, not a decision, whichever way
the Lab decides to resolve it on purpose.

**NORMAN**: Returning to the main thread — I think everything from the
exploration round holds. The five findings I'd ship, in priority order: (1)
route the CTA to the form, (2) restructure the vote line's hierarchy, (3)
the local "who am I" picker, (4) consistent ratio-urgency styling, (5)
front-load the form dropdown text and add one Quick Reference row. None of
these require a progress bar, a login system, or new infrastructure. All
five are CSS, one JS function, and prose edits.

**FOGG**: I'll put a number on it for the room, since I was asked to be the
loudest voice and I want to spend that loudness on something concrete rather
than general advocacy: findings 1 and 3 are the two that actually change
behaviour for the nine disengaged members. Findings 2, 4 and 5 make the page
less unpleasant for everyone, including the five already-engaged members who
don't need convincing. If the four weeks only allow three of the five, do 1,
3, and 2 in that order, and let 4 and 5 slip if they must.

---

### Hours 18-24: Recommendations and handoff

**Panel consensus, five UI/UX findings with concrete fixes** (full text in
`artifacts/recommendations.json` R1-R5):

1. **Route the dashboard's "record your position" link to the issue form**,
   not the raw file editor — `docs/index.html` line 728. Supported
   unanimously, for four independent reasons (friction, audit trail,
   failure visibility, access for the two members without push access).
2. **Restructure the vote sub-line**: demote the repeated position
   breakdown, style the action link as a button, keep `.yesonly` untouched.
3. **Add a client-side, non-authenticating "I am: ___" picker**, stored in
   `localStorage`, that bolds or pins rows where the selected name appears in
   an `awaiting` list. Fogg's priority recommendation; explicitly the one
   this seat cares about most.
4. **Give ratios one consistent, already-accessible urgency styling** and add
   one sentence defining quorum/majority in the existing glossary paragraph.
5. **Front-load the distinguishing clause in each dropdown option in
   `vote.yml`/`objection.yml`**, and add one row to `CONTRIBUTING.md`'s Quick
   Reference table naming the issue forms as the lower-friction alternative
   to hand-editing the file.

**What the panel declined to recommend**: a progress bar or other graphical
ratio display (more build than four weeks justifies for a cosmetic gain over
Finding 4's colour-only fix); any change to the agent-vote trust boundary
(settled by the user's own correction, not reopened); a hook-level fix
(none proposed; Schneier's contribution this round is entirely about routing
and audit trail, not access control).

---

## Tensions

Full entries, with both positions steelmanned and costs named, are in
`artifacts/tensions.json` (T1-T3) and the Synthesis document. Summarised
here:

### Tension T1: Ship a UI fix for the toleration trap now, or hold it for a mechanism-level Layer 4 fix

**Type**: fundamental (a scope-and-sequencing choice, not resolvable by
better copy or better code)

Fogg wants the dashboard and form copy sharpened immediately — it is the
only lever available before 2 November regardless of what else the Lab
decides. Ostrom and Elster both warn that a sharp, confident, well-styled
UI warning risks making the Lab feel the problem named in R2.6
(`voting-requirements.md`) is closed, when the structural fact — toleration,
abstention and silence are arithmetically identical at Layer 3 and above —
is untouched by any amount of styling, and genuinely needs a Layer 4
amendment the Lab may not have calendar room left to run before the window
that matters most (re-ratification) opens.

### Tension T2: Is dashboard polish the right use of the Lab's remaining attention at all

**Type**: fundamental

`voting-requirements.md`'s own critical-path analysis ranks the §3.2
election, not any of this tooling, as the only thing that matters by 2
November, and explicitly calls dashboard work "off the critical path."
Scott and Fogg's own friction logic cuts against this very panel's premise:
polished, demoable, legible dashboard work is exactly the kind of task that
crowds out the illegible, un-automatable, calendar-bound task — getting
fourteen busy people to actually rank-vote — that the deadline truly turns
on. Norman and Majors hold that the five findings above are cheap enough
(CSS and prose, no new infrastructure) not to compete meaningfully for the
same attention the election needs, but concede they cannot prove that in
advance.

### Tension T3: Should the dashboard disclose which positions were Convener-transcribed

**Type**: practical, genuinely two-sided

Raised by Scott, taken up seriously by Ostrom against her own seat's usual
instinct toward monitoring and transparency. Disclosure makes the "reasonably
equivalent route" visibly working, for anyone checking, including a future
Record Keeper. Disclosure also permanently and publicly marks the two
members who used it, in a repository Section 1 makes world-readable, as the
ones who needed it — a cost Section 1's accessibility clause was written
precisely to avoid imposing. The status quo (invisible on the page, visible
only in `git log` to someone who goes looking) was not actually chosen by
anyone; Majors' point that it is an accident rather than a decision stands
unresolved.

---

## Handoff

### What this panel accomplished

1. Verified, by reading the live render logic rather than trusting the
   feature list, that the dashboard's single most important link routes to
   the harder of two paths the project already built, and traced that one
   fact through four independent lenses without any of them disagreeing.
2. Produced five concrete, buildable UI/UX fixes, ranked by the disengaged-
   member-advocate seat rather than by engineering convenience.
3. Confirmed which of the prior report's open findings (S4/D3, U3-U5) remain
   open on this branch and which closed items (roll jargon, `.yesonly`
   styling, §3.9 in the template, the date-restating fixes) are genuinely
   fixed, by reading the current files rather than the prior report's claim.
4. Surfaced three tensions that survive being pointed at member experience,
   where the prior six-equal-lens framing would likely have produced one
   tension per lens instead.

### What remains unresolved

1. T1-T3, by design — the brief asked for choices named with costs, not
   resolutions.
2. Live GitHub UI behaviour for a non-collaborator attempting the raw-file
   edit route (Scott's Finding-1 contribution) — reasoned from the
   documented permission model, not watched happening on the live org.
   **Unverified.**
3. Whether three of five findings (the ones Fogg deprioritised) are worth
   building in the remaining four weeks at all, given T2.

### Suggested next steps

- **[A] Implementation**: ship Findings 1 and 3 first (Fogg's ordering),
  verify live on the actual GitHub org rather than the local preview.
- **[B] Decision panel** on T2 specifically — an explicit, timeboxed call on
  how much of the remaining four weeks goes to dashboard work versus
  directly chasing the §3.2 election, rather than leaving it as an
  unstated default.
- **[S] Synthesis** — the three tensions are few enough and sharp enough
  that synthesis can proceed directly from this panel without a further
  round.

---

## Meta-Observations

The mid-session reweight toward UI-as-primary-subject produced a sharper
panel than the originally planned six-equal-lens structure would have. With
every seat equally weighted, the likely outcome was one tension per lens —
a wide, shallow register, closer to what the brief explicitly said it did
not want ("twenty agreed findings" in miniature, one per seat). Forcing five
of seven voices to speak only when they changed member experience collapsed
several would-be-separate findings into one (Finding 1 absorbed what would
otherwise have been a security finding, a legitimacy finding, an
accessibility finding and a reliability finding) and left only the three
tensions that actually resisted collapsing. That is a stronger signal than
volume of disagreement: a tension that survives being asked "does this
change what a member sees or does" is more likely to be real than one that
exists only because a seat needed something to say.

---

*Panel completed: 2026-10-06*
*Next action: implement Findings 1 and 3; hold T2 as an explicit decision
rather than a default.*
