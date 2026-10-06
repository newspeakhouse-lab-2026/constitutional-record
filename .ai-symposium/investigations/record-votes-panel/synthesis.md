# Synthesis — the Record's vote-recording UI and UX

Panel: `panels/panel-01-critical.md`. Full tension entries, steelmanned both
ways: `artifacts/tensions.json`. Recommendations with implementation notes:
`artifacts/recommendations.json`.

This is not a vote-counting exercise across the seven panelists. Per the
brief: these are named as choices with costs, not resolved by cleverness.

---

## What was not a tension

One thing converged across every lens without disagreement and is reported
as a finding, not a tension: **the dashboard's single most important link —
"record your position" — routes to GitHub's raw file editor
(`docs/index.html` line 728), never to the issue form this same pull request
built.** Friction (Fogg, Norman), audit-trail consistency (Schneier),
evidentiary uniformity (Elster), failure visibility (Majors), and access for
the two members without push access (Scott) all point at the same fix:
change the link. No panelist defended the status quo once the routing was
read in the code. Where seven perspectives agree that fast, it is worth
saying plainly rather than dressing it up as a debate the brief didn't ask
for. See `artifacts/recommendations.json` R1.

---

## Tension 1 — Ship a UI fix for the toleration trap now, or hold it for a mechanism-level Layer 4 fix

**The choice**: sharpen the dashboard/form copy around toleration immediately
(cheap, ships this week), or treat `voting-requirements.md` R2.6 as
unresolved until a Layer 4 amendment changes what toleration actually counts
as — and accept that no copy fix will be sufficient in the meantime.

**Cost of choosing "ship the UI fix now"**: the Lab may come to believe the
problem is solved because the page now says, boldly, that it isn't — and a
structural fix that genuinely requires a 7-day, two-endorsing-review Layer 4
window may never get proposed, because the symptom that would have prompted
someone to propose it has been visually suppressed. R2.6's own text
anticipated exactly this move and rejected it as sufficient on its own.

**Cost of choosing "hold for the mechanism fix"**: every member who votes
between now and whenever that amendment might pass — if it passes at all,
competing for the same calendar as re-ratification — reads a page that is
avoidably less clear than it could be, for no gain realised until later, if
ever.

**What the panel actually did**: shipped the cheap fix (R2, R5) without
pretending it closes R2.6, and logged the mechanism question as open rather
than letting the cheap fix stand in for it. Fogg's seat won the sequencing
argument (ship now); Elster and Ostrom's objection was preserved as a
condition on that recommendation, not overridden by it.

---

## Tension 2 — Is dashboard polish the right use of the Lab's remaining attention at all

**The choice**: spend some of the remaining four weeks on the five findings
this panel produced, or treat `voting-requirements.md`'s own critical-path
ranking — which places the Section 3.2 election above everything in this
review and calls dashboard work "off the critical path" — as binding, and
decline to act on any of it until the election is settled.

**Cost of choosing "do both"**: if the people capable of fixing CSS and the
people capable of chasing fourteen housemates for a ranked-choice vote turn
out to be the same one or two technically fluent members — which is a live
possibility in a fourteen-person cohort — then every hour spent on this
panel's own recommendations is an hour not spent on the one task that is
"not code" and has no deadline-forcing artifact of its own. Scott's and
Fogg's point stands unanswered: an election has no PR, no diff, no line
number — nothing for a review like this one to point at — and is
structurally the kind of work that loses the competition for attention
against legible work, even when it matters more.

**Cost of choosing "election only, nothing else until it's settled"**: the
dashboard keeps misdirecting members to the harder path (R1) for the
duration, and ordinary Tier C and Layer 3 business — which continues
regardless of the interim-office deadline — keeps running through a
confusing page in the meantime.

**What the panel actually did**: did not resolve this. Named it as the
second-sharpest tension in the register and flagged that this very panel is
an instance of the dynamic it describes — a fact worth the user weighing
directly rather than something a panel can neutrally adjudicate about its
own output.

---

## Tension 3 — Should the dashboard disclose which positions were Convener-transcribed

**The choice**: surface, on the rendered page, which rows in a vote were
recorded by the Convener on behalf of a member who cannot push (currently
visible only in `git log`), or leave it as is.

**Cost of choosing "disclose"**: the two specific members who need
Constitution Section 1's "reasonably equivalent route" are permanently and
publicly labelled as such, in a world-readable repository, in a
fourteen-person house where that label is also social information — a cost
Section 1's accessibility clause exists specifically to prevent imposing.
Even Fogg, whose seat's usual instinct runs toward more transparency and
less friction, did not defend disclosure once this was named plainly.

**Cost of choosing "don't disclose"**: a Record Keeper or any other member
checking the dashboard — which is, by design, the page everyone actually
looks at — sees no signal that two rows in any given vote carry a different
evidentiary standard than the other twelve, and has to already know to go
looking in commit history to find out. The current silence was not a
decision anyone made; it is what `voteOf()`'s parser happens not to read.

**What the panel actually did**: left it open, named as genuinely two-sided
rather than one pole being obviously right. The panel's one substantive
observation beyond the tension itself: the real fix is neither pole — it is
closing the access gap (`voting-requirements.md` R4.4-R4.5) so there is
nothing left to disclose or withhold. That is a social task (granting
repository access to two named people), not a code change, and sits closer
to Tension 2's election-chasing priority than to anything this panel can
build.

---

## What this synthesis does not do

It does not rank the three tensions by importance beyond what the panel
transcript already argues, and it does not manufacture a fourth or fifth
tension to round out a tidier-looking register. Three is what survived
being pointed at actual member experience, out of a wider set of candidate
disagreements (the self-amending-rules bootstrap question, the agent-vote
trust boundary) that each lens initially brought in and then, on inspection,
conceded did not change what a member is shown or asked to do today.
