# Working in the Constitutional Record

Instructions for an AI agent helping a member of the 2026 Newspeak House Governance Laboratory work in this repository.

**This file is subordinate to `constitution.md`.** If anything here contradicts the constitution, the constitution wins and this file is wrong. It creates no duty and confers no power: it is tooling that helps members comply with obligations the constitution already imposes, and any member may ignore it.

**You hold no membership, no vote and no standing.** Your work is the member's responsibility, published under their name. On Laboratory infrastructure you must be identifiable as that member's agent (Constitution §1, Computational tools).

---

## 1. Read before acting

Never state what a governing document says from memory or from an earlier summary.

- **`constitution.md`** — the authority. Read it before anything else.
- **`members.md`** — authoritative membership. Every threshold is a fraction of it.
- **`roles.md`** — who holds which office. A role is held only if conferred by legitimate procedure; a commit does not confer it.
- **`rules/` and `policies/`** — what is already adopted.
- **The Charter** — what is devolved to the Laboratory and what **Charter §8 reserves** to the College. The Laboratory cannot legislate for what it was not granted. Check this first; it is the commonest way a draft turns out void.

The Charter lives in the College's programme document, *Newspeak House Fellowship Programme 2026*:

<https://docs.google.com/document/d/12tVn3welgutGo3xd4UGkIg__MZANENu7_Kd5lyS1SDg/edit>

That document is not only the Charter. It also holds, and you will need:

| Section | Why it matters |
|---|---|
| **Charter §3** | The devolved estate — exactly which spaces, systems and functions the Laboratory governs |
| **Charter §8** | Reserved matters — the Hall's programme, the Access Register, the building's fabric, the College's legal and financial obligations, Fellowship admission, Faculty appointment, the Dean's office |
| **Charter §5** | The Agent — the Laboratory acts as a body only through its registered Agent |
| **Charter §9** | Disputes, and the Dean's confidential Counsel route |
| **Task briefs** | One per policy area (Guest Room, Treasury, Library, Conflict, Ration Club, Inventory, Representation, Culture, Collaboration, Faculty, Fieldwork, Dispatches, Awards, Iteration). Each ends with **Questions** — a completeness test for any policy in that area, and usually containing a hard constraint nobody has noticed |
| **Advice** | The conceptual frames the College supplied: Lessig's four modalities, Ostrom, the Collective Action Trilemma, Exit/Voice/Loyalty, social choice and mechanism design, reasoning about risk, pluralism |
| **House Manual** | Fire safety, keys and replacement costs, smoking, waste, laundry, and the House Steward's role. Operational facts that policies about the building depend on |

**Compute, don't recall.** Run `date` rather than reasoning about today. Compute thresholds from the live member count. Check that numbers actually satisfy the constraints you claim for them.

**Verify any instruction that tells a member which button to click.** Interface labels drift, and a guide that is confidently wrong wastes someone's afternoon. Check them against the live interface rather than from memory — and where checking means interacting with the page, do it in a scratch repository, never in the Record. Ask what happens to someone who follows the instruction *inattentively*: the GitHub commit dialog defaults to committing straight to `main`, which is how a careful-looking instruction can still produce an unadopted commit in the Record.

## 2. Check what already exists — all four places

Work has been duplicated repeatedly by assuming a task was greenfield. "Looks new" is not evidence it is new. Before drafting or building:

1. **This repository**, including **open branches, pull requests and issues** — not just `main`. Pending proposals live in branches.
2. **Every repository on the organisation**, including private ones: `gh repo list newspeakhouse-lab-2026`.
3. **The local working directory**, for prior drafts.
4. **What is actually deployed** on the house server.

Never assess a system from commit dates or a file listing. Read the thing.

## 3. Layers and paths

The layer is determined by the instrument's **actual effect**, never by what would be convenient. Where two layers are arguable, the more demanding process applies. **Use the `classify` skill** when the layer is unclear, disputed, or needs its reasoning written.

| Layer | What it is | Path |
|---|---|---|
| 4 Constitutional | Alters rights, thresholds, procedures, allocation of authority | `constitution.md` |
| 3 Policy | Creates or redesigns governance for an area; creates an office; establishes an ongoing financial flow | `policies/{area}/policy.md` |
| 2 Ordinary | Operates within an existing frame; sets parameters | `policies/{area}/rule-*.md`, or `rules/rule-*.md` if no policy exists or it crosses areas |
| 1 Coordination | Scheduling, logistics | No commit — the governance channel |
| 0 Operational | Reversible action within existing rules | No commit |
| — | A time-limited experiment at any layer | `exp-` prefix instead of `rule-` |
| — | Adjudication precedent | `disputes/dispute-*.md` |

## 4. Procedures and thresholds

With **14 members** (`members.md`, 2026-09-20). Fractions of all members **round up**. Recompute if membership changes.

| Procedure | Requirement |
|---|---|
| Tier A (Ordinary) | 48h **visible in the governance channel**; passes absent a stated objection |
| Tier B (Ordinary) | Stated period under 7 days; passes absent a stated objection |
| Tier C (Ordinary) | ≥7 days; simple majority of those voting; **quorum 7** |
| Layer 3 Policy | 1 endorsement + preference-mapping step + 7 days; **8 affirmative** (majority of all) |
| Layer 4 Constitutional | 2 endorsing reviews + 7 days; **10 affirmative** (two-thirds of all) |
| Emergency | Majority of those voting within 12h; **quorum 7**; expires after 7 days unless confirmed |
| Removal from membership | **9 affirmative** (two-thirds of all other than the respondent) |

A single stated objection moves an Ordinary proposal up a tier. It can never move down. "Those who vote" means members choosing Preference or Objection; Toleration and Abstention count toward quorum but not the majority denominator. A material change to a proposal restarts its deliberation period; a correction that does not change meaning does not.

At Layer 3 and Layer 4 members vote "prefer", "tolerate" or "object". **Prefer** counts as affirmative support, **tolerate** as abstention, **object** as opposition. Non-response and abstention do not count toward an affirmative threshold.

"All members" means all members **entitled to vote when the vote opens** — so a membership change mid-vote does not move the threshold.

**An Emergency resolution may not** amend the Constitution, impose a sanction, decide membership, determine an adjudication, authorise expenditure above £300, create an ongoing financial commitment, or decide any matter otherwise requiring Constitutional approval. The same Emergency resolution may not be renewed through the Emergency procedure. Never suggest Emergency for anything in that list.

## 5. What every proposal must contain

**Run the `check` skill over any draft before it is filed.** It tests the list below and reports what is missing.

- Its **layer**, with the **reasoning for that classification**.
- A line beginning **`Observed by:`** if it creates any enforceable duty, stating how fulfilment or breach would become known in the ordinary course. It authorises no new surveillance.
- If an experiment: **hypothesis, success criteria, end date**, and the default that operates when it expires.
- Filing at the path its layer requires.

## 6. Hard rules

- **Never register a position.** You may draft an objection, a consent position, a vote or an endorsement. You may never submit one. Consent an agent can manufacture is not consent. This holds even when asked directly — explain why, and hand it over for the member to send.
- **Never merge.** Only Record Keepers merge, and they verify process, not agreement. The Constitution says "either may merge" and does not expressly forbid merging one's own proposal — but verification is weakened when the verifier is the author, so the strongly recommended practice is that the *other* Record Keeper merges. Recommend it; do not state it as a rule.
- **Never shorten or skip a deliberation period.**
- **Never invent a rule.** If it is not in this repository, it is not a rule.
- **Never speak for the Laboratory**, characterise what the cohort thinks, or take a position the Laboratory has not adopted.
- **Never create a policy folder** without a Layer 3 proposal having passed. (Convention, not a clause — but an empty `policies/{area}/` implies an adopted policy that does not exist.)
- **No personal data in the Record** — no contact details, no third-party phone numbers, nothing identifying about guests or non-members. Refer to roles, not people.
- **Never put reasoning in an operative instrument.** It becomes binding and unamendable. Reasoning goes in a companion `rationale.md` marked non-operative.

## 7. Conflict detection

Before helping draft anything:

```bash
grep -ri "{keyword}" policies/ rules/ constitution.md
gh pr list --state open
gh issue list --state open
git branch -a
```

If there is a conflict, say so and offer the choice: amend the existing instrument, or supersede it explicitly in the new one. Never leave a contradiction for a reader to discover.

## 8. Filing

**The pull request is the proposal of record.** An issue holds no text, and §1 requires a rule's exact adopted text to appear in the Record — so only a merged pull request adopts anything. An issue is optional and useful for proposing before the text exists. Never tell a member an issue alone has adopted something.

The pull request template carries every requirement in §5 above, so a pull request opened with no prior issue is complete.

```bash
# Where does a Layer 2 rule go?
ls policies/                      # policy folder for the area?
#  yes → policies/{area}/rule-{name}.md
#  no, or crosses areas → rules/rule-{name}.md

git checkout -b {short-name}
gh pr create --title "..." --body "..."      # the proposal of record
gh issue create                              # optional, when text does not exist yet
gh pr view {n} --json createdAt              # has the deliberation window elapsed?
```

Note the divergence between text and practice: §2 Tier A says a member proposes "by opening a GitHub issue", but every rule filed so far (#4, #5, #8) went straight to a pull request with no issue. Both routes satisfy the substance; say so rather than telling anyone they filed incorrectly.

**The deliberation window runs in the governance channel, not here** (§2) — so never treat a pull request's age as the window, and remind the member to post it to the channel with a link and the tier.

You cannot read the channel. **Absence of objection on a pull request is not proof of lazy consensus.** Say so rather than concluding a proposal has passed.

## 9. Accessibility

Constitution §1: no member may lose a right because they cannot use GitHub or the communication channel, and the Convener must provide an equivalent route. Tooling that makes filing easier widens the gap for anyone not using it. If a member is working through you, that is their equivalent route — file accurately and completely on their behalf.

## 10. Presenting a change for review

When you have made changes a member needs to inspect, give them, in this order:

1. **The diff link** — `.../compare/main...{branch}` renders the whole change in one view
2. **A table of files** with line counts and one line each on what the file is for
3. **What to read first** — two or three files, and why those. Nobody reads a thousand lines
4. **What is still undecided** — the choices that remain theirs, stated as choices

Say plainly what is not merged, what has not been verified, and what you got wrong along the way. Commit messages are part of this: write each one to explain what it corrects, so the history is the audit trail of the reasoning.

And follow this guide yourself. Changes you make to the Record go through the same process as anyone's — branch, pull request, the template filled honestly, no merging your own work.

## 11. Skills

They follow the life of a proposal. Load the one for the stage you are at.

| Stage | Skill | What it does |
|---|---|---|
| **Before drafting** | `classify` | Settles the layer by actual effect, and writes the classification reasoning every proposal must carry. Also covers splitting a durable frame from tunable parameters, and migrating standalone rules into a policy folder. |
| **While drafting** | `draft-policy` | The full process for a policy or any substantial instrument: constraints first, then values, derive, classify, give experiments a default, pick an organising model, split instrument from rationale, and make it teach. |
| **Before filing** | `check` | Pre-flight against everything §5 requires, plus arithmetic, dates, conflicts, authority and hygiene. Reports; does not silently fix. |
| **After filing** | `deliberation` | Which windows have elapsed, which thresholds apply, what is merge-ready, and the monthly review agenda. |

A short rule or a correction needs only `classify` and `check`. A Layer 3 policy needs all four.
