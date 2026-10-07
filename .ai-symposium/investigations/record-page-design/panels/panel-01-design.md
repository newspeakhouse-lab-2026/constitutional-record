# Panel 1 — Design Critique: `docs/index.html` as a designed object

**Subject**: `docs/index.html`, branch `record-votes`, commit `c890306` at time
of reading. Not the vote-recording system, not the Constitution — the page.

**Panel**: Don Norman, Dieter Rams, Edward Tufte, B.J. Fogg, George Orwell,
Jakob Nielsen, Christopher Alexander. Full selection reasoning:
`../thinking/expert-selection-panel-1.md`.

**Method note, stated once and not repeated**: no rendered screenshot exists
for this panel to look at — no browser tool was available this session. Every
claim about layout is derived from the generated markup (the `row()`
function, `render()`, and the CSS cascade that applies to it) and is marked
"[from code]" the first time each seat makes that kind of claim. Every
contrast ratio is computed, not eyeballed; the numbers are in
`research/sources.json` [S7] and quoted as stated there.

---

## Hour 1–6: Grounding

**NORMAN**: Before critique, what is this object *for*? Not "a dashboard" —
read the brief's own sentence: the thing being defended against is members
*not acting*. That's not an information problem in the usual sense. A member
who reads the page and still does nothing has not failed to find information.
Classic design-of-everyday-things framing: when a well-intentioned person
fails repeatedly, that's a signal the design, not the person, has an error in
it. So the first question isn't "is this legible" — it's "does legibility
even solve the problem this page exists for."

**RAMS**: It solves part of it. A member who can't tell what a proposal is or
when it closes certainly won't act. Legibility is necessary, not sufficient —
but don't dismiss it as beside the point before we've checked it.

**ORWELL**: Agreed with Rams on sequence, not on priority. I'll read the style
block's own comments first, as instructed, because they are — I'm told —
binding unless argued against. Line 78–83:

> Stepped down from 600/.85rem. It was the largest, most coloured thing on
> every row, and a clock affords nothing: knowing a vote closes in 19 hours
> tells a member nothing about whether to act. The gap to the threshold does,
> so that is now the largest live figure on a row and this is the second.

That is a correct piece of reasoning, stated plainly, and I have no argument
with it. I note it because it is already doing exactly what I'd ask of it:
"a clock affords nothing" is Norman's own vocabulary, used correctly, by
whoever wrote this CSS. This page's author already read Norman. Some of our
work today is confirming good instincts rather than discovering bad ones.

**NIELSEN**: Which matters for how we spend the day. I don't want seven
people re-deriving conclusions the comments already reached. Where the
comments got there first, say so and move on. Where they didn't — the actual
rendered text, the actual scan path — that's where I want time spent.

**TUFTE**: One ground-rule before dimensions: this page states a number four
times in different shapes on a single row — a countdown, an absolute date, a
gauge, and a tally — for exactly one vote. Before asking "is each one
legible," ask whether four representations of overlapping information is the
right amount of ink for one fact. I'll hold that question rather than answer
it now.

**FOGG**: And the ground-rule I want on the table from hour one: B=MAP.
Behaviour happens when motivation, ability, and a prompt converge at the same
moment [S9]. This page can't manufacture motivation — fourteen people who
"find governance boring" are a fixed quantity of M for this quarter. It
*can* work on ability (can they understand what's asked of them fast enough)
and it can work on prompt (does anything bring them back without being
pushed). Most of what we'll argue about today is ability. The thing I most
want to bring back later is prompt, because right now this page has none —
it is pulled, never pushes, and nothing pulls someone to it beyond a Discord
link someone else posted.

**ALEXANDER**: I'll register my discomfort with the vocabulary early rather
than relitigate it all day. "Ability," "prompt," "affordance" — these treat a
reader as a mechanism to be operated correctly. I don't disagree with any
specific claim that follows from that vocabulary. I want it on record that a
page can satisfy every one of today's recommendations and still fail to feel,
to the person reading it at midnight, like somewhere a human decided
something mattered. I'll raise this again when it's concrete, not as a
standing objection to everything said today.

**NORMAN**: Noted, and fair — hold us to it later.

**Setup confirmed before critique starts**: `git log` on this file [S5] shows
fifteen commits, same session, on exactly the areas this brief flags — vote
rendering, the CTA, the clash-of-clocks warning. One specific thing the
*prior* investigation (`../record-votes-panel/`) found as its one
unanimous, non-tension finding — that "record your position" routed to
GitHub's raw file editor — is **already fixed**. Current line 946:
`.../issues/new?template=vote.yml&title=...&pr=...` — the issue form, not the
blob editor. This panel reports that as a fact discovered on read, not as new
analysis, and moves on.

---

## Hour 6–12: Exploration

### The tag strip

**NORMAN**: Four tags per proposal row — Layer, Tier, State, plus "VOTE OPEN"
where relevant [S1, lines 815–820]. Each has a `title` tooltip and `.tag[title]
{cursor:help}` [line 34] — so a tag that explains itself on hover *looks*
different from one that doesn't, which is correct: nothing here invites a tap
that does nothing. Good affordance discipline, no finding.

**NIELSEN**: Size, though. `.tag{font:0.63rem...}` [line 100]. The document
has no `html{font-size}` reset, so `rem` resolves against the browser
default — 16px in essentially every real browser absent a user override.
0.63rem is 10.08px, uppercase, letter-spaced. That's not a bug, people ship
10px uppercase labels all the time, but check what's *in* it: Layer, Tier,
procedural state — this is the classification that decides which rules apply
to this item. On the one hand, [S10] tells us scanning readers skip small
peripheral text almost entirely. On the other, this text is short, capitalised,
and sits at a fixed, learnable position at the start of every row — which is
exactly the condition under which small caps-locked labels *do* get read, once
learned, as icons rather than words. I'll call this acceptable, not optimal:
fine for the fifth visit, a real tax on the first.

**RAMS**: Then the fix isn't size, it's teaching it once. See the glossary
paragraph below the h2 [lines 991–994] — "L0 Operational · L1 Coordination…"
— spelled out once per page load, every load, forever, for fourteen people
who will see it dozens of times over four weeks. That paragraph earns its
keep on visit one and becomes furniture by visit five. Collapse it. A native
`<details><summary>what do L0–L4 and A/B/C mean?</summary>…</details>` costs
nothing — no JS, no accessibility regression, browser-native disclosure
semantics — and gives the small tag text somewhere to point to without
permanently spending vertical space above the fold on an explanation a
returning member doesn't need. *(→ R3)*

**TUFTE**: Agreed, and note what that frees: on a 375px phone, that paragraph
is several wrapped lines before any actual proposal appears. Removing it as
a standing cost — keeping it as an on-demand one — is the data-ink argument,
not the typography argument: it isn't about the ink on the glossary itself,
it's about the ink spent making every subsequent row scroll further from the
top on every single load.

### Contrast, computed rather than asserted

**NIELSEN**: [S7] — I had the actual numbers run rather than guessed. The
author's own two inline contrast claims are both exactly right: `--accent`
on `--bg` is 6.06:1 light, 8.27:1 dark [lines 109–110, 153–155]. No argument.
One pair nobody commented on: `--faint` on `--bg` in **dark mode** is 4.62:1.
The AA floor for small text is 4.5:1. That's a 0.12 margin, and `--faint` is
what colours `.abs` — the absolute date the author just fought to keep
visible on phones [comment, lines 191–192: "Hiding it on phones left '1d 19h'
with nothing to check it against"]. The exact element this page cares most
about keeping legible has the thinnest safety margin of any text colour on
the page, in the one mode (dark) that's more likely at the hour this page is
actually opened — "at night," the brief says.

**TUFTE**: That's worth a number, not a vibe: 4.62 vs. a 4.5 floor is not an
emergency, it's a near-miss. I'd flag it and move on, not rewrite a token
over a 0.12 margin that passes.

**ORWELL**: Agreed it's not urgent. It is, however, exactly the kind of thing
that silently breaks the next time someone "just slightly" adjusts `--faint`
for an unrelated reason and never reruns the arithmetic. *(→ logged as a
watch-item, not a recommendation — see tensions register, T4.)*

### The `.q7` token: four meanings sharing one warning colour

**ALEXANDER**: Here's a finding from actually reading the whole file, not
just the style block the brief pointed us at first. Line 89:

> `.q7{color:var(--soon);font-weight:500}` /* genuine staleness only */

The comment states a scope: *genuine staleness only*. I grepped every use
[research-log.md]. Four, not one:

1. Line 825 — `quiet ${quiet}d` on a proposal untouched ≥7 days. **Matches
   the comment.** Genuine staleness.
2. Line 831 — `targets ${pr.base.ref}, not main`. A pull request pointed at
   the wrong branch. That is not staleness. That is a **misconfiguration**
   — structurally the same category of problem as the two-clocks-disagree
   case the page already colours `--urgent` via `.clash` [line 95, comment
   lines 92–94: "a real problem with the Record, not a clock running out"].
3. Line 871 — `Round ${vote.rounds}`, stating which round a vote is on.
   Not a warning. A fact.
4. Line 917 — `${failed.length} submission(s) did not record`. A **vote
   that silently failed to reach the file.** This is arguably the single
   worst thing that can happen on this page — a member thought they acted
   and didn't — and it is wearing the same amber as "nobody's touched this
   in a week."
5. (Line 1092, in the history section) — `after ${mv.rounds} rounds`. Same
   as #3: a neutral fact, not a warning.

The design doctrine this file states for itself — `--urgent` for a real
problem, `--soon` for a clock running out, `--muted` for information — is
violated by its own code in two directions at once: a real problem (#4, and
arguably #2) undersold as mere staleness, and plain facts (#3, #5) oversold
as warnings at all.

**NORMAN**: That's not a style nit, that's a signifier doing the wrong job.
A colour that means "something needs attention" applied to "this is the
second round of voting" teaches a reader to stop trusting the colour. Fix:
split `.q7` into what it actually is. Staleness (#1) keeps `--soon`. The
misconfigured-branch case (#2) and the failed-submission case (#4) should be
`--urgent`/`.clash` — they are the same severity as the thing that colour
already exists for. The round-number cases (#3, #5) shouldn't be coloured at
all; they're `.quiet`/`--muted`, same as every other "informational, not a
warning" item the style block already distinguishes [comment, line 90].
*(→ R1 — the first concrete change.)*

**RAMS**: No new token required. That's the right shape of fix — reclassify,
don't invent.

### The row, top to bottom — where the eye actually goes

**NIELSEN**: [from code] Reconstructing the scan order from `row()` [lines
553–560] and the vote-block generator [lines 841–957]. Top-left of a row:
`#number` then title [line 821] — correct, that's the identifying anchor and
it's exactly where an F-shaped scan lands first and hardest [S10]. Top-right:
the demoted countdown, correctly smaller now per the author's own reasoning.
Below that: tags, then the metadata line (`@user · filed Nd ago · comment
count`), then — only if a vote is open — the vote block.

Count what's *in* the vote block, worst case, Tier C, mid-dispute: optional
clash warning, optional round note, the "where it stands" sentence, the
gauge, the four-way tally, the Tier-C two-denominators note, the awaiting
list, optional failed-submission note, *then* the one sentence the brief
calls "the one line on the page that changes outcomes," *then* the button.
That's potentially nine lines before the critical sentence. The author's own
comment calls this "four things, each its own line" [lines 119–123] — true
of the minimum case, understating the realistic one. Eyetracking research on
scanning behaviour [S10] says attention decays sharply moving down and right
within a block; by line nine of a card most scanning readers have already
decided whether to keep reading.

**FOGG**: But notice *where* it sits relative to the thing that matters
behaviourally: directly before the action. That's deliberate and it's
correct per the comment at lines 920–922 — "It sat three clauses after the
button... The button now follows it." Proximity-to-action is a real
principle too, and Fitts's Law [S20] only measures distance to a target once
you've decided to move toward it — it says nothing about whether you decided
to read first. These are two different axes and this row design optimises
one (closeness to the action, once you're already engaged) at some cost to
the other (primacy within the scan, for a reader who hasn't committed to
reading the whole card yet).

**TUFTE**: Name that squarely as unresolved rather than paper over it with
"well, both matter." It is a real tension, and I don't think today's panel
settles it. *(→ T1, the sharpest one, written up in the register.)*

### The text, read as writing

**ORWELL**: Sentence by sentence, because that's the brief's instruction,
not a paragraph of vibes.

Line 923–925:
> **Only `preference` counts as a yes.** At Layer 3, Layer 4 and
> re-ratification, toleration, abstention and never answering are the same
> number.

Active voice, short words, the one piece of jargon (`preference`) is the
Constitution's own term and can't be simplified without becoming inaccurate
— correctly left alone rather than paraphrased into something looser. "Never
answering" instead of "non-response" — plain word over the long one, exactly
my own rule [S17]. I have no edit for this sentence. It is the best-written
sentence on the page, which is fitting, since the brief says it's the one
that changes outcomes.

Line 905–906, the Tier C note:
> Tier C counts twice: quorum over everyone who answered, the majority over
> preference and objection only, and not until the window has closed.

"Counts twice" is a good opening — concrete, surprising, makes the reader
want the next clause. But the sentence then does three jobs at once (what
quorum counts, what the majority counts, when either can be known) in one
breath with two commas. [S16]'s own guidance — GOV.UK writes exactly this
class of content, obligation under a legal procedure, for citizens under
stress — is to front-load the one fact that changes what the reader does
next and let the rest follow. Split it:

> **Tier C counts twice.** Quorum counts everyone who answered. The majority
> counts preference and objection only — and neither is known until the
> window closes.

Same information, same length almost to the character, three short sentences
instead of one long one. Minor, but the brief asked to judge every sentence,
so here it is. *(→ folded into R2 below, since R2 touches this exact area.)*

Line 801 (`desc` field), the Policy proposal-type description:
> Creates or redesigns the governance of an area, or creates an office. One
> endorsement, seven days, and a majority of all members.

No note. Correct register, no fat.

**NIELSEN**: The one place I'd push back on Orwell: don't chase elegance on
text nobody reads twice. The failed-submission note [line 917] and the
clash-of-clocks note [lines 861–864] are both triggered rarely and are
already dense with the exact facts a confused member needs in the moment —
"optimise for scanning under distress," not for prose quality, on those two.
Spend editing effort on the sentences that render on *every* vote, not the
ones that render on a bad day.

**ORWELL**: Fair scope note. Accepted.

### What's missing: the "awaiting" list as a dead end

**FOGG**: [from code] Line 911: `Not yet answered: ${names}`. Full names,
every time, no truncation — deliberately, per the comment [907–910]. Good
call to not truncate. But look at what happens after a member reads their own
name in that list: nothing. It's plain text. No link, no action, nothing a
third reader — the Convener, say, or any member who wants to go chase someone
— can *do* with that name beyond knowing it. I want to propose making each
name there a `mailto:` or house-chat deep link.

**NORMAN**: Where would the address come from?

**FOGG**: ...it wouldn't. There's no server, and `members.md` holds names,
not contact details. Withdrawn — AGENTS.md is explicit: "No personal data in
the Record — no contact details." Good, that's exactly the kind of idea the
brief asked to cost, including the ones that die on inspection. Costed at:
one hard constitutional/architectural wall, not a design trade-off. *(logged,
not recommended.)*

### The gauge — one shape, two referents

**TUFTE**: Lines 156–158 and 897–899. The gauge fills `done/need` as a
percentage. For Layer 3/4 (`vote.required` is the affirmative threshold),
`done` is `vote.affirmative` — the bar genuinely tracks "progress toward
carrying." For Tier C (`quorumOnly`), `done` is `vote.responded` — the bar
tracks progress toward *quorum*, which has nothing to do with whether the
proposal passes. Same fill colour, same shape, same position on the row, two
different procedural referents depending on which proposal you're looking
at.

**ALEXANDER**: And nothing on the gauge itself tells you which referent
you're looking at — only the sentence above it does, which is the exact
pattern we just said we don't want to lean on for the harder question. Is
this the same problem as the toleration sentence, in miniature?

**TUFTE**: Structurally, yes, though smaller stakes. Graphical integrity
[S12] doesn't require a chart to show only one thing — it requires that what
it shows not mislead about the thing it does show, and this one doesn't
mislead: a Tier C gauge genuinely is quorum progress, truthfully rendered. The
risk isn't dishonesty, it's **transfer** — a member who learns "filling bar =
good news" from a Layer 3 proposal carries that association into a Tier C
proposal where a full bar means only "enough people showed up," saying
nothing about where the vote is headed.

**NIELSEN**: Is it worth a second visual treatment — say, a hatched or
outlined fill for the quorum-only case versus solid for the affirmative
case? I want costed, not assumed.

**RAMS**: Costed: one CSS rule, keyed off `.quorumOnly`-equivalent class on
the `<i>` fill. Cheap in code. The real cost is reader-side: now there are
two gauge *grammars* to learn instead of one, on a page whose whole
design philosophy up to now has been one visual vocabulary applied
consistently. I'd want to see the toleration-sentence question settled
first, because if design solves that one with a grouping treatment (see
Hour 12–18), the gauge's ambiguity may shrink for free as a side effect,
and inventing a second gauge style now would be solving a problem that's
about to get smaller anyway.

**TUFTE**: Agreed — hold this, don't recommend it standalone. *(logged as a
dependent idea, not R-numbered on its own.)*

---

## Hour 12–18: Convergence — new ideas, and the hardest question

### New idea 1 — "since you were last here"

**FOGG**: Here's my prompt proposal, costed properly. This page already
caches every API response in `localStorage`, keyed by content, with a TTL
[lines 316–338]. That plumbing exists for rate-limit survival, not for this,
but it's the same data a diff needs. On a successful render, store a small
snapshot — PR numbers, each one's `win.closes` and vote tally sum, issue
count. On the *next* load, after the fresh data arrives, diff against that
stored snapshot before overwriting it, and render one line, above everything
else: *"Since you were last here (3 days ago): a vote opened on #12, #9's
countdown entered its final day, 2 new comments on #7."*

Cost: no new API calls — it diffs data already being fetched for the page
itself, so it is **free against the 60-requests-an-hour ceiling**, the
single tightest constraint this whole project operates under. Implementation
is perhaps twenty lines in `render()`, one new `localStorage` key, and copy
to write. The only real cost is conceptual: it's per-browser, so a member who
reads on their phone and later on a housemate's laptop gets two independent
"since last time" baselines. Not a bug — the page already behaves this way
for caching — but state it plainly rather than let it surprise anyone.

**ALEXANDER**: This is the first idea all day that treats the page as
something a person returns to rather than something a person is sent to. I
withdraw some of my hour-one scepticism for this one specifically — it
doesn't operate on the reader, it remembers *with* them.

**NIELSEN**: I like it for a colder reason: it's the cheapest possible
"what changed" signal, and "what changed since I last looked" is close to
the single most-requested feature on every status dashboard I've ever
reviewed, in any domain. Ship it.

**RAMS**: One caution — don't let this banner become a second thing
competing with the `snap`/`warn` banners already at the top of the page
[lines 778–799]. If GitHub rate-limited the user AND something changed since
last visit, that's two banners stacked before any actual content. Order
matters: staleness/failure warnings first (they're about trust in what
follows), the since-last-visit note second (it's about what to pay attention
to within what follows).

**FOGG**: Agreed, and cheap to arrange — it's ordering, not a conflict.
*(→ R7.)*

### New idea 2 — group the tally by effect, not by name

**NORMAN**: Now the brief's hardest question. Can design do better than a
sentence, for the toleration/abstention/silence problem?

**TUFTE**: Start from what the tally line currently is [line 901]:
`POS.map(k => \`${k} ${c[k]}\`).join(" · ")` — four categories, equal visual
weight, alphabetically-arbitrary order (`preference · toleration · abstention
· objection`, the order `POS` happens to be declared in [line 381]). Equal
weight for four things that are *not* equally weighted by the Constitution is
exactly a data-ink problem: the ink spent is uniform, the information isn't.

**NORMAN**: Proposal: for Layer 3, Layer 4, and re-ratification — the three
procedures where the rule really is a clean binary, decides/doesn't — stop
presenting four coequal numbers. Present two groups:

> **preference 6 · objection 1** — these decide it
> toleration 2 · abstention 1 · not answered 4 — these don't, whatever was intended

Bold, dark ink for the group that moves the threshold; quiet, muted ink for
the group that doesn't. The grouping itself is the explanation. A member who
never reads the sentence below it can still see, structurally, that half the
roll sorted into a bucket visually marked as inert.

**ORWELL**: And the existing sentence doesn't go away — it can't, screen
readers get nothing from a colour grouping, and the brief is clear this page
must never *imply* a finding visually that it wouldn't state in words. The
sentence becomes confirmation of what the layout already showed, not the
only vehicle for it. That's a strictly better division of labour between
text and design than either doing the whole job alone.

**FOGG**: This is real design work on the actual mechanism, not a copy
tweak. Costed: restructuring roughly fifteen to twenty lines inside the
vote-rendering function, no new CSS tokens — `.yesonly`'s ink colour and
`.quiet`'s muted colour already exist and already mean what we need. I'd
ship this.

**RAMS**: Subtraction-shaped, not addition-shaped. Approved on those
grounds alone.

**NIELSEN**: One empirical worry, and I want it on record rather than
smoothed over: will a scanning reader register "these don't" as *absence of
effect* rather than *three different words meaning three different things
I might have cared about distinguishing for other reasons* (a toleration is
not an abstention is not silence, even though they count the same)? Grouping
by arithmetic effect is correct for the question this panel was asked. It is
also a genuine simplification of what toleration *means* socially — a
member who actively chose to tolerate something is not the same as a member
who never opened the page, even though the Constitution currently makes them
arithmetically identical. Grouping them visually risks making that
difference even harder to see than it already is.

**ALEXANDER**: Say that as a tension rather than let it pass. It's real.
*(→ T3.)*

### Where the clean idea breaks — Tier C

**ORWELL**: Now the part I don't think we get to resolve today. Everything
above assumes one binary: counts-toward-the-threshold vs. doesn't. That's
true for Layer 3, Layer 4, re-ratification. It is **not** true for Tier C.
Reread `voteOf()`'s own comment [lines 399–401]:

> Tier C states a quorum here, not an affirmative threshold: its majority is
> counted over preference and objection only, and not until the window has
> closed.

Tier C has *two* groupings running at once, and they don't nest inside each
other:
- **Quorum's grouping**: answered (preference, toleration, abstention,
  objection) vs. silent. Toleration and abstention are *inside* the
  "counts" side here.
- **Majority's grouping**: preference/objection vs.
  toleration/abstention/silent. Toleration and abstention are *outside* the
  "counts" side here.

The same two positions sit on opposite sides of two different lines, within
the same vote, depending which threshold you're asking about. That is
precisely why — I'd guess, reading the comment at lines 902–904 — "the page
currently handles this with a sentence": a sentence can hold two
simultaneous, non-nesting groupings in a way a single two-colour visual
grouping cannot, not without inventing two independent grouping systems
shown at once on one small tally line.

**TUFTE**: Could you draw both? A top line grouped for quorum, a second line
grouped for majority, the same four numbers reorganised twice?

**NORMAN**: You could. Cost that honestly: it's the same four numbers
printed twice in two different groupings, on a card that Nielsen has already
told us is too long by the time a reader reaches this point. Clarity bought
with length, on exactly the procedure — Tier C, the vote type with a quorum
*and* a majority, two tiers at once — that's already the hardest one on the
page to explain in any format.

**FOGG**: So the honest answer to "can design do better than a sentence" is:
**yes, cleanly, for three of the four procedures that use these four
positions — and genuinely not yet, for the fourth, which happens to be the
most complex one and the one members most need help with.** I don't think
that's a failure of today's panel. I think it's the actual shape of the
problem, and shipping the clean win for Layer 3/4/re-ratification now,
while saying plainly that Tier C still needs a sentence — or a harder piece
of design work than a one-day panel should improvise — is more honest than
inventing a dual-grouping gauge under time pressure to claim a clean sweep.

**ALEXANDER**: That is the sharpest thing anyone has said today, and it is
unresolved, correctly. *(→ T2, written up as the register's lead tension —
see below. Note it supersedes T1's attention/proximity question as the
*sharpest* one; T1 remains real but is a tension about where on a card
something sits, while T2 is a tension about whether a whole class of
constitutional arithmetic can be shown at all without prose. The second
matters more.)*

---

## Hour 18–24: Recommendations

Numbering continues from the prior investigation's R1–R5
(`../record-votes-panel/artifacts/recommendations.json`) since both live in
the same repository's design conversation and a reader should be able to
look up "R1" once and mean one thing across investigations. R1–R5 are
*that* panel's; this panel's are **R6 onward**. Full entries, with file:line
and cost, in `../artifacts/recommendations.json`.

- **R6** — Reclassify `.q7` by actual severity: keep `--soon` for genuine
  staleness (line 825) only; move the wrong-base-branch case (line 831) and
  the failed-submission case (line 917) to `--urgent`/`.clash`; strip colour
  entirely from the two round-count facts (lines 871, 1092), giving them
  `.quiet`. No new token. *Priority: first — cheapest, zero ambiguity, fixes
  a real inconsistency against the page's own stated doctrine.*
- **R7** — "Since you were last here": a diff banner computed from data
  already fetched, stored once per successful render, shown above the
  existing `.snap`/`.warn` banners, below them in display priority. Zero
  marginal API cost. *Priority: second — the single most direct answer to
  "what would make a member open it voluntarily," and the cheapest against
  the constraint (API budget) that killed every other idea considered.*
- **R8** — Group the vote tally by arithmetic effect rather than by
  nominal position, for Layer 3, Layer 4, and re-ratification only (Tier C
  explicitly excluded — see T2). The explanatory sentence stays, now as
  confirmation of a visual grouping rather than sole bearer of the point.
  *Priority: third — directly answers the brief's hardest question, for the
  three procedures where it can be answered cleanly.*
- **R9** — Collapse the L0–L4/A-B-C glossary paragraph [lines 991–994] into
  a native `<details>` disclosure. No JS required. *Priority: cheap,
  low-stakes, do alongside R6.*
- **R10** — Split the Tier C explanatory sentence [lines 905–906] into
  three short sentences per Orwell's edit above. *Priority: cheap, bundle
  with R6/R9 as a single small copy-and-markup pass.*
- **Considered and rejected, costed anyway, per the brief's instruction**:
  mailto/deep-linking the "not yet answered" names (dies on AGENTS.md's "no
  personal data" rule — not a design trade-off, a wall); a second gauge
  grammar for quorum-only votes (deferred pending R8's effect on the
  problem, not rejected outright); Discord-channel visibility on the page
  (dies on "no server," correctly already excluded by the brief's own
  constraints and the footer's existing honest disclaimer, lines 246–248 —
  nothing to add here).

**What converged without disagreement, reported as a finding rather than a
tension**: the "record your position" CTA routing, which the prior panel
found broken, is fixed in the file as it stands today. No seat on this panel
found anything wrong with the row's Fitts's-Law-sized action button [lines
159–172, 204–210], the `aria-live` stamp-not-main choice [lines 222–226], or
the never-render-emptiness discipline in the catch block [lines 1161–1171].
These were checked, not assumed, and held up.

---

*End of transcript. Tensions written up in full, both sides steelmanned, in
`../artifacts/tensions.json`. Recommendations with exact file:line and cost
in `../artifacts/recommendations.json`.*
