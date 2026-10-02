# The Constitutional Record: A GitHub Guide

## What this is

The Constitutional Record is a **public** GitHub repository. It is the single source of truth for every rule, policy, and constitutional decision the Laboratory makes. Every decision that persists is a file in the repo. Every adoption is a merge. The history is immutable — nothing is deleted, only archived.

All Laboratory members have write access. The repository is public, as Section 1 of the Constitution requires, so that the Laboratory's reasoning is legible to anyone — the College, future cohorts, and the field.

> **The repository is public. Write accordingly.** Anything you put in a file, a commit message, a pull request or a comment is visible to the world and stays in the history. Candid or sensitive discussion belongs in the governance channel, not here. Never commit personal data — contact details, third-party phone numbers, or anything identifying about guests or non-members. Refer to roles, not people.
>
> Material may be removed where retaining it would disclose personal or confidential information or create a serious risk of harm. The removal and its reason are recorded without reproducing the removed material. But the authoritative history may **not** be rewritten merely to erase an adopted decision: errors are corrected by a new commit.

## What is GitHub / git?

Git is a version control system — it tracks every change ever made to a set of files, who made it, and when. GitHub is a website that hosts git repositories and adds a web interface for collaboration.

Key concepts:

- **Repository (repo)** — a folder of files with its full history. Ours holds the constitution, rules, policies, and disputes.
- **Branch** — a parallel version of the repo where you can make changes without affecting the main copy. Think of it as a draft.
- **Commit** — a saved change. Every commit has a timestamp, an author, and a description. Commits are permanent.
- **Pull request (PR)** — a proposal to merge a branch into `main`. It shows what changed and has a space for discussion, evidence, and approvals.
- **Merge** — when a pull request is accepted, the branch's changes are added to `main`. This is the moment a decision enters the record.
- **Main** — the official branch. What's on `main` is the law. Everything should reach it through a pull request.

**You do not need to install anything.** Everything in this guide can be done through GitHub's website. Members comfortable with the command line can use `git` and the GitHub CLI instead, and AI agents authorised under the Constitution's computational tools clause work the same way — see *Working with an AI agent* below, and `CLAUDE.md`.

**If GitHub is a barrier, it must not cost you anything.** Section 1 provides that no member may lose a right under the Constitution because they cannot use GitHub or the Laboratory's communication channel, and the Convener must provide a reasonably equivalent route and ensure anything submitted through it is communicated and recorded as the Constitution otherwise requires. Ask the Convener. This guide exists to reduce how often that is needed, not to replace it.

## Roles

**Members** — everyone in the Laboratory. You propose rules, discuss pull requests, and vote through the process defined in the Constitution.

**Record Keepers (two people)** — the only members with merge access. They verify that the correct process was followed — that the vote happened, the outcome is recorded, and the PR text matches the decision — before merging. They are custodians, not gatekeepers: they check the process, not whether they personally agree. Having two means one being unavailable never blocks the record. The Constitution says either may merge; it does not expressly forbid merging your own proposal, but a verification carried out by the author verifies little, so **the practice is that the other Record Keeper merges**. Any member can create branches and pull requests; a Record Keeper is there to help members who'd rather not, and to perform the final merge.

Current role holders are recorded in `roles.md`, maintained by the Record Keepers. A role is held only if it was conferred through the procedures the Constitution sets out — a repository edit does not confer it.

## Repository structure

```
constitution.md                      Layer 4 — Constitutional
members.md                           Authoritative membership list
roles.md                             Current role holders
policies/
  {area}/
    policy.md                        Layer 3 — Policy: the governance frame for an area
    rule-{name}.md                   Layer 2 — Rules within that area
    exp-rule-{name}.md               A time-limited experiment
    rationale.md                     Reasoning, explicitly not operative
rules/
  rule-{name}.md                     Layer 2 — Standalone rules, no policy area or crossing several
disputes/
  dispute-{date}-{name}.md           Adjudication precedent
CLAUDE.md                            Instructions for members' AI agents
CONTRIBUTING.md                      This guide
.github/
  ISSUE_TEMPLATE/                    The Proposal form
  pull_request_template.md           The checks every pull request should pass
```

A policy area is a **folder**. The Layer 3 policy is `policy.md`; each Layer 2 rule in that area is its own `rule-*.md` file beside it. Keeping them separate is the point: the policy changes only by Policy resolution, while its rules and parameters change at Tier A in 48 hours.

A rule that belongs to no policy area, or crosses several, lives in `rules/`.

Any instrument may be filed as a time-limited experiment using the `exp-` prefix, at whatever layer it belongs to. It must state a hypothesis, success criteria and an end date, and it expires automatically unless adopted or extended.

Put reasoning in a companion `rationale.md`, not in the instrument. Reasoning left inside an instrument becomes binding, and a future reader will cite your argument as law.

## The process, end to end

Every amendment follows the same arc. The deliberation periods and thresholds differ by layer; the steps do not.

| | Step | Who | Where |
|---|---|---|---|
| 0 | Set up, once | You | Your machine, or nothing at all if you use the website |
| 1 | Decide what you are proposing, and at which layer | You — an agent may advise, you decide | — |
| 2 | *Optional:* open an issue, if you have no text yet | You or your agent | GitHub |
| 3 | **Post the proposal to the governance channel** — this is what starts the deliberation clock | **You, personally** | Governance channel |
| 4 | Draft the instrument, and a `rationale.md` beside it | Your agent drafts; you own it | Your machine or GitHub |
| 5 | Check it against what the Constitution requires | Your agent | — |
| 6 | Branch, commit, open the pull request | You or your agent | GitHub |
| 7 | Deliberate | You. An agent may draft your words; it may never post a position | Channel, pull request, meetings |
| 8 | Endorsements, where the layer needs them | Other members. Never an agent | Pull request or channel |
| 9 | Vote | Members. **Never an agent** | As the Constitution specifies — not GitHub |
| 10 | Record the outcome on the pull request | You, or a Record Keeper | Pull request |
| 11 | Verify the process and merge | A Record Keeper, ideally not the author | GitHub |
| 12 | Announce the result | The merging Record Keeper | Governance channel |

### Working with an AI agent

Section 1 permits any member to run an AI agent, provided it is **documented and communicated to the rest of the membership**, and requires that an agent acting on Laboratory infrastructure be **clearly identifiable as that member's agent**. It holds no membership, no vote and no standing, and its actions are your responsibility.

So the division is fixed:

**An agent can** read the Record, search for conflicts, classify a proposal and write the reasoning, draft an instrument and its rationale, check a draft against the Constitution's requirements, compute thresholds and windows, create branches, commit, and open pull requests under your name.

**Only you can** post to the governance channel, endorse, vote, raise an objection or state a consent position, and — as a Record Keeper — verify and merge. An agent may draft any of those for you to send. It must not send them. Consent that an agent can manufacture is not consent.

To work this way you need `git`, the [GitHub CLI](https://cli.github.com) authenticated with `gh auth login`, and a clone of this repository. An agent tool does **not** authenticate GitHub for you — that is a separate step, and PRs cannot be opened without it. `CLAUDE.md` in this repository is read automatically by agent tools that look for it; it is plain prose and carries no tool-specific commands, so it works with whatever you use.

When an agent has helped prepare a proposal, say so in the pull request and name yourself as the member responsible.

## How an amendment works

Every amendment — a new rule, a policy change, or a constitutional edit — follows the same path through GitHub. The deliberation periods and approval thresholds differ by layer, as the Constitution defines. The mechanics are the same.

### 1. Decide whether you need an issue

**An issue cannot adopt anything.** It holds discussion, not text, and Section 1 requires that a rule's exact adopted text appear in the Record. Only a merged pull request does that.

So the pull request is the proposal of record, and its template asks for everything the Constitution requires. **Open an issue first only when it helps** — when you want to propose a rule before drafting its wording, or deliberate on whether a rule should exist before arguing about its text. Go to **Issues → New issue** and use the Proposal form: it asks three things (the layer, what you are proposing, and why that layer) and then tells you what the pull request will need. If you already have the text, go straight to a pull request.

A proposal is classified by its **actual effect**, not by the label you choose. Where two layers are reasonably arguable, the more demanding process applies.

### 2. Create a branch and draft the text

**Through the website**, with nothing installed:

1. Open the folder where your instrument belongs (e.g. `rules/`) and choose **Add file → Create new file** — or open an existing file and use the edit (pencil) icon
2. Name it in the **Name your file…** box, and write the text
3. Click **Commit changes…**, the green button at the top right
4. **In the dialog, change the branch option.** It opens on *"Commit directly to the `main` branch"* — see the warning below
5. Choose **"Create a new branch for this commit and start a pull request"**. A branch name appears, auto-filled as something like `yourname-patch-1`; rename it to something meaningful, e.g. `rule-quiet-hours`
6. The dialog's title and button both change to **Propose changes**. Click it

> **Step 4 is a trap.** The dialog opens with *"Commit directly to the `main` branch"* already selected. Accept that default and your text lands in the Record immediately — no branch, no pull request, no deliberation, no vote. Branch protection is not configured (see below), so nothing stops it. It would not make your rule valid, since validity comes from the procedure and not from the commit, but it does put unadopted text in the Record and someone has to revert it.

GitHub relabels its buttons from time to time. The shape of the flow is stable: edit a file, commit to a **new branch**, open a pull request.

**From the command line**, or through an agent:

```bash
git clone https://github.com/newspeakhouse-lab-2026/constitutional-record
cd constitutional-record
git checkout -b rule-quiet-hours
# write rules/rule-quiet-hours.md
git add rules/rule-quiet-hours.md
git commit -m "Propose ordinary rule: quiet hours"
git push -u origin rule-quiet-hours
gh pr create          # fills in the pull request template
```

For constitutional amendments, edit `constitution.md` on a new branch. Two endorsing reviews on the pull request start the seven-day clock.

### 3. Fill in the pull request template

The pull request is pre-filled with everything the Constitution requires: the layer **and the reasoning for it**, the tier, the `Observed by:` line if the proposal creates any duty, the conflicts you searched, the source of authority for a Policy or an amendment, and the experiment fields if it is one. Link an issue with `Resolves #N` if you opened one.

You don't need everything immediately — the amendment record and the vote evidence are completed after deliberation, before merge.

### 4. Discussion and deliberation

The pull request is visible to all members and to the public. Discussion happens in the pull request, in the governance channel, and in meetings as needed.

**The deliberation window runs in the governance channel** — Section 2 requires a Tier A proposal to be visible there for 48 hours — so post it there with a link to the pull request and say which tier you are using. The pull request is where the text and the evidence live; the channel is where the clock runs. During it the proposal can be revised — the proposer or any member can push further commits to the branch. **A material change restarts any minimum deliberation period.** A correction that does not change the meaning does not.

An objection is never a bare "no": it is stated with its reason and a suggested route forward. A single stated objection moves an Ordinary proposal **up** a tier. It can never move down.

### 5. Vote

Voting happens as the Constitution specifies for the layer — in the governance channel, by show of hands, by anonymous poll, however the Laboratory decides. **GitHub is not the voting platform.**

### 6. Record the result

Once the vote concludes, the proposer or a Record Keeper updates the pull request with:

- the vote result and tallies
- any objections, and how they were addressed
- any abstentions, in aggregate where the ballot was anonymous
- a link to the discussion or meeting notes
- the assumptions the decision rests on, and its status (live, experimental, archived)

These are the amendment record fields Section 1 requires. Add them as a comment or in the pull request description.

### 7. Merge

A Record Keeper checks that the evidence is complete and matches the outcome, then merges. The proposal is now part of the official record on `main`.

There is no separate GitHub approval step — the vote already happened. The merge is a clerical act: confirming the process was followed, not casting a second vote.

**Absence of objection on a pull request is not by itself proof of lazy consensus**, because deliberation also happens in the governance channel. Verifying both is exactly what the Record Keeper's check is for.

The Record Keeper announces the result in the governance channel with a link to the merged pull request.

## Amending an existing rule

1. Open the file on GitHub
2. Click the pencil icon to edit
3. Make your changes on a new branch, as above
4. The pull request will show exactly what changed — additions in green, removals in red

The same deliberation and approval process applies, at the layer of the instrument you are changing.

## Archiving, not deleting

Nothing is deleted from the record. To retire a rule, change its status to **archived** in the file. The file stays in the repo. The full history — adoption, amendments, archival — is preserved in the git log.

## What the Constitution requires of this repository

Section 1 provides that GitHub branch protection enforces approval requirements per path, that Record Keepers are the only members with merge access, and that the authoritative history may not be rewritten to erase an adopted decision.

**Not all of this is configured yet.** As things stand:

| Requirement | Status |
|---|---|
| No direct changes to `main` — everything through a pull request | **Not configured.** Anyone with write access can push to `main` |
| No force-pushing or rewriting history | **Not configured** |
| Only Record Keepers can merge | **Not configured** — enforced by convention only |
| Per-path approval requirements | **Not configured** |
| Issue forms and pull request template | Configured |

Until branch protection is set up, these hold as **norms the Constitution already imposes**, not as technical guarantees — and note that the website's commit dialog *defaults* to committing straight to `main`, so the easiest path through the interface is the one that bypasses the process. Follow them anyway: pushing a rule straight to `main` does not make it a rule. Validity comes from the procedure, and Section 1 is explicit that a repository edit or commit does not itself create authority.

Configuring branch protection implements an existing constitutional requirement rather than creating a new one, and falls to the Record Keepers. Two cautions: set it after any merge-ready proposals have been merged, and make sure restricting merge rights cannot lock the repository if the Record Keeper role falls vacant.

## Quick reference

| Action | How |
|---|---|
| Propose a new rule | Create a branch with the file → **Propose changes**. An issue first is optional, for proposing before the text exists |
| Amend an existing rule | Open file → pencil icon → **Commit changes** → new branch → **Propose changes** |
| Discuss a proposal | Comment on the pull request |
| Record a vote result | Comment on the pull request with the evidence in step 6 |
| See what's being proposed | Open pull requests, open issues, **and** `git branch -a` — drafts live in branches |
| See the full history of a rule | Open the file → **History** |
| See all current rules | Browse the repo on `main` |
| Check thresholds and windows | `CLAUDE.md`, or ask your agent for the `deliberation` skill |
