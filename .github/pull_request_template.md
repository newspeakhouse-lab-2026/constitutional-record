<!--
A pull request is the only thing that can enter the Record — an issue holds no
text. So this template carries everything the Constitution requires of a
proposal, and a pull request opened without a prior issue is complete on its own.

Opening an issue first is optional and useful when you want to propose a rule
before you have drafted its text.
-->

## Proposal

**Layer:**
<!-- 2 Ordinary / 3 Policy / 4 Constitutional — or "0/1" if this is a correction or
coordination that creates no rule. Classified by actual EFFECT, not by convenience.
Where two layers are arguable, the more demanding process applies. -->

**Tier (Layer 2 only):**
<!-- A — 48h, passes absent a stated objection
     B — a stated period under 7 days, passes absent a stated objection
     C — 7 days or more, simple majority of those voting, quorum 7
A proposal may enter at any tier. One stated objection moves it up a tier; it
never moves down. -->

**File(s):**
<!-- policies/{area}/policy.md · policies/{area}/rule-*.md · rules/rule-*.md ·
constitution.md · exp- prefix for a time-limited experiment -->

**Resolves:**
<!-- #N if there is an issue, otherwise "no prior issue" -->

### What this does

<!-- Plain sentences. What changes for members. -->

### Why this layer

<!-- REQUIRED (Constitution §2). Not the label — the reasoning. Name the effect
that determines the layer, say why the layer above is not required, and why the
layer below is insufficient if anyone might argue for it. -->

### `Observed by:`

<!-- REQUIRED if this creates any enforceable duty. How would fulfilment or
breach reasonably become known, in the ordinary course? This authorises no new
surveillance and no collection that would not otherwise reasonably become
available. If it creates no duty, write: none — creates no enforceable duty. -->

### Conflicts checked

<!-- What you searched and what you found. Name anything this supersedes.
  grep -ri "{keyword}" constitution.md policies/ rules/
  gh pr list --state open ; gh issue list --state open ; git branch -a
  gh repo list newspeakhouse-lab-2026     # private repos run live systems
Write "none found" only after saying what you searched. -->

### Source of authority — Layer 3 and 4

<!-- What in the Charter or Constitution gives the Laboratory power here.
Name anything adjacent that Charter §8 reserves to the College: the Hall's
programme, the Access Register, the building's fabric, the College's legal,
financial and safety obligations, Fellowship admission, Faculty appointment,
the Dean's office. -->

### Experiment — delete if not one

<!-- An experiment takes its own layer's process; the prefix changes the expiry,
not the threshold. -->

- **Hypothesis:**
- **Success criteria:**
- **End date:** <!-- leave a monthly review before it, so the cohort can extend deliberately -->
- **What operates on expiry:** <!-- REQUIRED. An experiment whose expiry breaks the instrument containing it is not an experiment, it is a dependency. -->

### Endorsements

<!-- Layer 3: one other member. Layer 4: two endorsing reviews, which start the
7-day clock. Layer 2: none required. -->

---

## Checks

- [ ] Layer stated **with its reasoning**, not just the label
- [ ] Filed at the path the layer requires, `exp-` prefixed if time-limited
- [ ] `Observed by:` present if any enforceable duty is created, and honest
- [ ] Conflicts searched across the Record, open PRs, open issues, branches, and the organisation's other repositories
- [ ] Thresholds computed from the current `members.md`, fractions rounded up
- [ ] Dates and arithmetic computed, not recalled
- [ ] Cross-references resolve — every section cited exists
- [ ] No authority claimed that the Charter reserves to the College
- [ ] No personal data — no contact details, nothing identifying guests or non-members
- [ ] Reasoning lives in a companion `rationale.md`, not in the operative text
- [ ] Provisional numbers marked provisional

---

## Amendment record — complete before merge

<!-- Required by Constitution §1 for amendments to the Constitution and to rules. -->

- **How it was made:** <!-- lazy consensus / consent / majority / supermajority vote -->
- **Tally:** <!-- prefer / tolerate / object / abstain, and whether quorum was met -->
- **Assumptions it rests on:**
- **Status:** <!-- live / experimental / archived -->
- **Explanatory notes from the discussion:**
- **Abstentions or objections:** <!-- in aggregate where the ballot was anonymous -->

---

## Process — for the merging Record Keeper

- [ ] Deliberation period elapsed, **verified in the governance channel as well as here** — absence of objection on this pull request is not by itself proof of lazy consensus
- [ ] Endorsements obtained where the layer requires them
- [ ] Recorded outcome matches what actually happened
- [ ] Merged by a Record Keeper. **Recommended practice: not by the author** — the Constitution permits either Record Keeper to merge, but a verification performed by the author verifies little

<!-- If an AI agent helped prepare this, say so and name the member responsible.
Constitution §1 requires agents on Laboratory infrastructure to be clearly
identifiable as the agent of a specific member. -->
