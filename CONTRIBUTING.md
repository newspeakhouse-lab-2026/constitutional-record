# The Constitutional Record: A GitHub Guide

## What this is

The Constitutional Record is a **public** GitHub repository. It is the single source of truth for every rule, policy, and constitutional decision the Laboratory makes. Every decision that persists is a file in the repo. Every adoption is a merge. The history is immutable — nothing is deleted, only archived.

Almost all Laboratory members have write access, which is what lets you push a branch and open a pull request. **If you find you cannot, say so in the governance channel** and it will be fixed — Section 1 says no member may lose a right because of the tooling, and not being able to open a pull request is exactly that. The repository is public, as Section 1 requires, so that the Laboratory's reasoning is legible to anyone — the College, future cohorts, and the field.

> **The repository is public. Write accordingly.** Anything you put in a file, a commit message, a pull request or a comment is visible to the world and stays in the history. Candid or sensitive discussion belongs in the governance channel, not here. Never commit personal data — contact details, third-party phone numbers, or anything identifying about guests or non-members. Refer to roles, not people.
>
> Material may be removed where retaining it would disclose personal or confidential information or create a serious risk of harm. The removal and its reason are recorded without reproducing the removed material. But the authoritative history may **not** be rewritten merely to erase an adopted decision: errors are corrected by a new commit.

## Quick reference

| Action | How |
|---|---|
| Propose a new rule | Create a branch with the file → **Propose changes**. An issue first is optional, for proposing before the text exists |
| Amend an existing rule | Open file → pencil icon → **Commit changes** → new branch → **Propose changes** |
| Discuss a proposal | Comment on the pull request |
| Record a vote | Your row in `votes/pr-{number}.md` on the proposal's branch — step 6 |
| See what's being proposed | Open pull requests, open issues, **and** `git branch -a` — drafts live in branches |
| See the full history of a rule | Open the file → **History** |
| See all current rules | Browse the repo on `main` |
| Check thresholds and windows | `AGENTS.md` — or ask your agent |
| See the state of the Record at a glance | [The dashboard](https://newspeakhouse-lab-2026.github.io/constitutional-record/) |
| See what is closing, and what is running | The [dashboard](https://newspeakhouse-lab-2026.github.io/constitutional-record/) |

---

## What is GitHub / git?

Git is a version control system — it tracks every change ever made to a set of files, who made it, and when. GitHub is a website that hosts git repositories and adds a web interface for collaboration.

Key concepts:

- **Repository (repo)** — a folder of files with its full history. Ours holds the constitution, rules, policies, and disputes.
- **Branch** — a parallel version of the repo where you can make changes without affecting the main copy. Think of it as a draft.
- **Commit** — a saved change. Every commit has a timestamp, an author, and a description. Commits are permanent.
- **Pull request (PR)** — a proposal to merge a branch into `main`. It shows what changed and has a space for discussion, evidence, and approvals.
- **Merge** — when a pull request is accepted, the branch's changes are added to `main`. This is the moment a decision enters the record.
- **Main** — the official branch. What's on `main` is the law. Everything should reach it through a pull request.

**You do not need to install anything.** Everything in this guide can be done through GitHub's website. Members comfortable with the command line can use `git` and the GitHub CLI instead, and AI agents authorised under the Constitution's computational tools clause work the same way — see *Working with an AI agent* below, and `AGENTS.md`.

**If GitHub is a barrier, it must not cost you anything.** Section 1 provides that no member may lose a right under the Constitution because they cannot use GitHub or the Laboratory's communication channel, and the Convener must provide a reasonably equivalent route and ensure anything submitted through it is communicated and recorded as the Constitution otherwise requires. Ask the Convener. This guide exists to reduce how often that is needed, not to replace it.

## Roles

**Members** — everyone in the Laboratory. You propose rules, discuss pull requests, and vote through the process defined in the Constitution.

**Record Keepers (two people)** — the only members with merge access. They verify that the correct process was followed — that the vote happened, the outcome is recorded, and the PR text matches the decision — before merging. They are custodians, not gatekeepers: they check the process, not whether they personally agree. Having two means one being unavailable never blocks the record. **Constitution §3 says either may merge**, their own proposals included. If the other Record Keeper happens to be around, a second pair of eyes costs nothing — but it is not required, and it should never hold up a merge that is otherwise ready. Any member can create branches and pull requests; a Record Keeper is there to help members who'd rather not, and to perform the final merge.

Current role holders are recorded in [`roles.md`](https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/roles.md), maintained by the Record Keepers. A role is held only if it was conferred through the procedures the Constitution sets out: a repository edit does not confer it, and neither does this guide, so if the file and the proceedings disagree the proceedings win and the file needs fixing.

**All four interim offices are time-limited, and they end at the same moment.** `roles.md` records when each term ends, and the [dashboard](https://newspeakhouse-lab-2026.github.io/constitutional-record/) counts down to it. Check who actually holds an office before relying on it — a term that has lapsed leaves the office vacant whatever the file says.

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
votes/
  pr-{number}.md                     Positions on one proposal, beside the text it decides
disputes/
  dispute-{date}-{name}.md           A decision, binding on the parties only
AGENTS.md                            Instructions for members' AI agents
CLAUDE.md                            One line, pointing at AGENTS.md
CONTRIBUTING.md                      This guide
.github/
  ISSUE_TEMPLATE/                    Two forms: Proposal, and Record a position on a vote
  pull_request_template.md           What every pull request is asked for
  instrument-templates/              Skeletons for a rule, a policy, an adjudication, a vote
  workflows/, scripts/               Labelling, recording a vote, and checks that warn rather than block
  ruleset-main.json                  A copy of the branch protection on main
```

A policy area is a **folder**. The Layer 3 policy is `policy.md`; each Layer 2 rule in that area is its own `rule-*.md` file beside it. Keeping them separate is the point: the policy changes only by Policy resolution, while its rules and parameters change at Tier A in 48 hours.

A rule that belongs to no policy area, or crosses several, lives in `rules/`.

Any instrument may be filed as a time-limited experiment using the `exp-` prefix, at whatever layer it belongs to. It must state a hypothesis, success criteria and an end date, and it expires automatically unless adopted or extended.

Put reasoning in a companion `rationale.md`, not in the instrument. Reasoning left inside an instrument becomes binding, and a future reader will cite your argument as law.

## Words used here

| | |
|---|---|
| **Instrument** | The operative text itself — a rule, a policy, a constitutional amendment, a dispute decision. The thing that becomes binding, as distinct from the *proposal* asking for it, the *discussion* around it, or the `rationale.md` beside it. The Charter uses the word in §4. |
| **Layer** | How much weight a decision carries, and therefore what procedure adopts it. Determined by actual effect, not by the proposer's label. |
| **Tier** | Within Layer 2 only: how long deliberation runs. A (48 hours), B (under seven days), C (seven or more, with a vote). |
| **Lazy consensus** | Passing because nobody objected within the window, rather than by a vote. Tiers A and B only. |
| **The Record** | This repository. A rule exists only if its exact adopted text is here. |

## The process, end to end

Every amendment follows the same arc. The deliberation periods and thresholds differ by layer; the steps do not.

| | Step | Who | Where |
|---|---|---|---|
| 1 | Set up, once — or not at all, if you use the website | You | Your machine |
| 2 | Decide what you are proposing, and at which layer | You. An agent may advise; you decide | — |
| 3 | *Optional:* open an issue, if you have no text yet | You or your agent | GitHub |
| 4 | Draft the instrument, and a `rationale.md` beside it | Your agent drafts; you own it | Your machine or GitHub |
| 5 | Check it against what the Constitution requires | Your agent | — |
| 6 | Branch, commit, open the pull request | You or your agent | GitHub |
| 7 | Take it out of draft — it is posted to Discord automatically, and **this starts the deliberation clock** | You | GitHub, relayed |
| 8 | Deliberate | You. An agent may draft your words; it may never post a position | Channel, pull request, meetings |
| 9 | Endorsements, where the layer needs them | Other members. Never an agent | Pull request or channel |
| 10 | Vote, and record it | Members. **Never an agent** | Stating it is the vote, wherever you state it; `votes/pr-{number}.md` is the evidence |
| 11 | Write the result into `votes/pr-{number}.md`, arithmetic shown | You, or a Record Keeper | The proposal's branch |
| 12 | Verify the process and merge | A Record Keeper — §3: either may merge | GitHub |
| 13 | Announce the result | The merging Record Keeper | Governance channel |

A webhook posts repository events to Discord, so taking a proposal out of draft announces it without you doing anything further — that is the visibility Section 2 asks for. The relay posts a bare GitHub notification though, so saying what tier you are claiming and when the window closes still saves everyone reconstructing it later.

Two things happen on their own as you go. When you fill in the Layer, Tier and Deliberation period, a workflow turns them into **labels**; and when you take the pull request out of draft it adds an **`opened:`** label recording the moment, which is what shows that a deliberation period began. A second label, **`endorsed:`**, counts endorsing reviews. Nobody writes these by hand.

The [dashboard](https://newspeakhouse-lab-2026.github.io/constitutional-record/) reads them, so a proposal with no layer recorded is shown as **No layer recorded** rather than appearing to have no window running. If your proposal looks wrong there, the labels are the place to look.

### What starts the clock

It differs by layer, and the Constitution is explicit for only two of them.

| | What starts deliberation |
|---|---|
| **Tier A** | The 48 hours **is** the period the proposal is visible in the governance channel (Constitution §2) — which the Discord relay does for you when you take it out of draft. |
| **Tier B and C** | The stated period. **The Constitution does not say what triggers it.** |
| **Layer 3 Policy** | Seven days, after an endorsing member and the preference-mapping step. The trigger is not stated. |
| **Layer 4** | **"Two endorsing reviews start the 7-day deliberation clock"** — explicit, and those are reviews on the pull request. This clock runs on GitHub. |

Where the Constitution is silent, the safe practice is the same as Tier A: post it to the channel with the link and the tier, and say when the window closes. Then nobody can dispute later when it began. **But do not assume every clock runs in the channel — a Layer 4 amendment sitting without two endorsing reviews has not started at all**, however long it has been open, and however much it has been discussed.

### Working with an AI agent

Constitution §1 permits any member to run an AI agent, provided it is **documented and communicated to the rest of the membership**, and requires that an agent acting on Laboratory infrastructure be **clearly identifiable as that member's agent**. It holds no membership, no vote and no standing, and its actions are your responsibility.

**This is not the Agent.** The Agent is a constitutional office under Constitution §3 — a member, elected by anonymous ranked-choice vote for a two-month term, through whom the Laboratory acts as a body. Constitution §1 does allow the Laboratory to augment that office with a computational system, but only by Ordinary resolution and only on open-source models with no external logging and no individual holding admin access alone. Nothing like that exists. An agent you run is your tool, under your name, and speaks for nobody but you.

So the division is fixed:

**An agent can** read the Record, search for conflicts, classify a proposal and write the reasoning, draft an instrument and its rationale, check a draft against the Constitution's requirements, compute thresholds, create branches, commit, and open pull requests under your name. It cannot tell you whether a deliberation window has elapsed — that runs in the governance channel, which it cannot read.

**Only you can** post to the governance channel, endorse, vote, raise an objection or state a consent position, and — as a Record Keeper — verify and merge. An agent may draft any of those for you to send. It must not send them. Consent that an agent can manufacture is not consent.

#### Which model you may use — the clause people misread

Section 1 contains two permissions, one after the other, and they bind differently:

> Any member may choose to run an AI agent, provided it is documented and communicated to the rest of the membership.

> By Ordinary resolution, the Laboratory may also augment the Agent role with a computational system… **The system runs on open-source models with no external logging.**

**The open-source requirement applies only to the second.** It governs a system that augments the Agent *office* — something the Laboratory would have to adopt by Ordinary resolution, and which does not exist. **An agent you run yourself has no model restriction.** Claude, GPT, a local Llama: the Constitution is indifferent. What it asks of you is disclosure and identifiability, not a particular vendor.

If the Laboratory ever does want an agent of its own, that clause becomes binding and rules most hosted models out. That is a conversation worth having on its own terms, not one to drift into.

#### Setting one up

```bash
gh auth login                  # the agent tool does NOT do this for you
git clone https://github.com/newspeakhouse-lab-2026/constitutional-record
cd constitutional-record       # AGENTS.md is read from here automatically
```

Without `gh` authenticated, an agent can read and draft but cannot open a pull request.

**What this repository offers an agent, and what needs which tool:**

| | |
|---|---|
| `AGENTS.md` | The instructions. Plain prose, no tool-specific commands — **any agent that reads `AGENTS.md` gets them** |
| `CLAUDE.md` | One line pointing at `AGENTS.md`, for tools that look for that name instead |
| `.claude/skills/` | `classify`, `draft-policy`, `review-agenda`. **Claude Code only** — there is no cross-tool equivalent |
| `.claude/hooks/` | Stops an agent merging or pushing to `main` **in this repository**, and steps aside elsewhere. **Claude Code only**, and it does not take effect until you trust the folder |

**Tools members are using or might:**

- **[Claude Code](https://claude.com/product/claude-code)** — terminal. Reads `AGENTS.md`, and is the only thing that runs the skills and the merge hook.
- **[Claude Cowork](https://claude.com/product/cowork)** — Anthropic's desktop application. The instructions in `AGENTS.md` apply the same way; whether the skills and hook behave identically there is untested.
- **[opencode](https://opencode.ai)** — MIT-licensed and open source, terminal and desktop, reads `AGENTS.md`, and supports many model providers rather than one. **The option that ties the Laboratory to no vendor**, which is worth something in a record meant to outlast any of us.

Nothing here mandates a tool. The Constitution's Communications Infrastructure section says platforms are "implementation details to be determined and updated by the laboratory from time to time" — so this is a note on what currently works, not a rule, and anyone adopting something else should say so and improve this list.

#### Declaring it — required by the Constitution, with nowhere yet to record it

Section 1 says an agent must be **documented and communicated to the rest of the membership**. There is no register, and nothing in the Record records who is running what. Until there is — the AI policy is the obvious place to create one — the minimum that satisfies the clause is:

1. **Post once to the governance channel** saying you are running an agent and what it is. That is the communicating.
2. **Say so on every proposal it helped prepare**, naming yourself as the member responsible. That is the identifying, and Section 1 requires it separately: an agent acting on Laboratory infrastructure must be *clearly identifiable as that member's agent*.
3. **Mark its commits.** A `Co-Authored-By:` trailer naming the agent does this, and survives in the history where a pull request comment does not.

#### Two labels it must never touch

The `opened:` and `endorsed:` labels are written by a workflow. **An agent must not add, edit or remove either by hand.** The `opened:` label is the evidence that a deliberation period began, and evidence an agent can write is not evidence. If one looks wrong, it is for a member to fix.

#### When it gets something wrong

It is your proposal. Section 1 is unambiguous that an agent's actions are the member's responsibility, and "the agent drafted it" is not a defence for a clause nobody checked. Read what it wrote before you file it — particularly the layer and its reasoning, which is the part the cohort will test first.

## Doing it

The table above is the summary. This is the detail, for the steps that have any.

### Deciding whether you need an issue

**An issue cannot adopt anything.** It holds discussion, not text, and Constitution §1 requires that a rule's exact adopted text appear in the Record. Only a merged pull request does that.

So the pull request is the proposal of record, and its template asks for everything the Constitution requires. **Open an issue first only when it helps** — when you want to propose a rule before drafting its wording, or deliberate on whether a rule should exist before arguing about its text. Go to **Issues → New issue** and use the Proposal form: it asks three things (the layer, what you are proposing, and why that layer) and then tells you what the pull request will need. If you already have the text, go straight to a pull request.

A proposal is classified by its **actual effect**, not by the label you choose. Where two layers are reasonably arguable, the more demanding process applies.

### Creating a branch and drafting the text

**Through the website**, with nothing installed:

1. Open the folder where your instrument belongs (e.g. `rules/`) and choose **Add file → Create new file** — or open an existing file and use the edit (pencil) icon
2. Name it in the **Name your file…** box, and write the text
3. Click **Commit changes…**, the green button at the top right
4. The dialog offers **"Create a new branch for this commit and start a pull request"**. For almost everyone that is the only option, because `main` is protected
5. A branch name appears, auto-filled as something like `yourname-patch-1`; rename it to something meaningful, e.g. `rule-quiet-hours`
6. The dialog's title and button both change to **Propose changes**. Click it

> **If you are a Record Keeper, you will also see *"Commit directly to the `main` branch"*. Never take it.** Organisation administrators bypass the branch protection, so the editor shows them an option nobody else has. It would not make your rule valid — validity comes from the procedure, not from the commit — but it puts unadopted text in the Record with no proposal, no window and no diff to object to, and somebody then has to revert it.

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

### Filling in the pull request template

The pull request is pre-filled with everything the Constitution requires: the layer **and the reasoning for it**, the tier, the `Observed by:` line if the proposal creates any duty, the conflicts you searched, the source of authority for a Policy or an amendment, and the experiment fields if it is one. Link an issue with `Resolves #N` if you opened one.

You don't need everything immediately — the amendment record and the vote evidence are completed after deliberation, before merge.

### Discussion and deliberation

The pull request is visible to all members and to the public. Discussion happens in the pull request, in the governance channel, and in meetings as needed.

For Tier A the window **is** the proposal's visibility in the governance channel (Constitution §2), which the relay takes care of when you take it out of draft. For Layer 4 the clock starts when two endorsing reviews land on the pull request. See *What starts the clock* above — it is not the same rule for every layer. During it the proposal can be revised — the proposer or any member can push further commits to the branch. **A material change restarts any minimum deliberation period.** A correction that does not change the meaning does not.

An objection is never a bare "no": it is stated with its reason and a suggested route forward. A single stated objection moves an Ordinary proposal **up** a tier. It can never move down.

### Endorsing

Two layers need an endorsement before anything else happens, and for one of them the endorsement **is** the starting gun.

| | |
|---|---|
| **Layer 3 Policy** | "At least one other member must endorse" |
| **Layer 4 Constitutional** | "**Two endorsing reviews start the 7-day deliberation clock**" |

So a constitutional amendment's clock does not run from when it was opened. It runs from the moment the second member reviews it. An amendment nobody reviews has no window running, however long it has been sitting there — which is the position pull request #2 is in.

**Endorsing is not supporting.** It says *this deserves to be deliberated*, not *I agree with it*. You can endorse an amendment onto the agenda and then vote against it, and that is a perfectly coherent thing to do.

This matters more than it sounds. If people treat endorsement as agreement, then anyone who opposes an amendment can stop it being deliberated at all simply by declining to review — **a veto the Constitution never granted anyone.** Opposition belongs in the vote, where it is counted and recorded.

In practice an endorsement is an **approving review** on the pull request. The Constitution says "endorsing reviews" without defining them; approving review is the reading the tooling uses, and it is a reading rather than a quotation. If the Laboratory means something else by it, say so and the tooling should follow.

### Voting

Tier A and Tier B hold no vote: they pass unless someone objects. Tier C, Layer 3, Layer 4, re-ratification and the Section 4 procedures do vote.

A position may be stated anywhere — in the governance channel, in person, by message. **Stating it is the vote; the file is the evidence of it.** Nobody loses a vote for not using GitHub.

### Recording a vote

In **`votes/pr-{number}.md`, on the proposal's own branch**, so the evidence merges into the Record beside the text it adopted. Start it from `.github/instrument-templates/vote.md`; the dashboard's *Start a vote* button opens it prefilled.

One table, one row per member — **all of them, including anyone who has said nothing**, because every threshold is a fraction of everyone entitled to vote, and you cannot check the arithmetic unless you can see them all.

Two routes, and both record the same thing.

**The form.** Issues → New issue → **Record a position on a vote**, or the button on the dashboard, which fills in the pull request number. One form for all four positions; the reason and route forward an objection needs are asked of everyone and required only from an objection. A workflow writes your row as you and replies with a link to the commit, or says why it could not. It needs only read access, so it is the route that works if you cannot push.

**By hand.** Change your row to `preference`, `toleration`, `abstention` or `objection`, with the date. The dashboard links straight to your file.

> **When you commit, choose "Commit directly to the `{branch}` branch".** The other option — *"Create a new branch for this commit and start a pull request"* — is the right one for a proposal and the wrong one for a vote. It puts your position on a branch of its own, where nothing reads it, and then shows you a green success page. You will believe you have voted and nothing in the Record will have changed. This is the one way to lose a vote without being told, which is why the workflow names the same radio in every message that offers a hand edit.

> **Only `preference` counts as affirmative support.** At Layer 3, Layer 4 and re-ratification, toleration, abstention and never answering are the same number. None of them is a yes.

**An objection goes in the file, in full** — its reason *and* a suggested route forward, both of which Section 2 requires. A reason that lives only in a pull request comment is not in the Record: `git clone` retrieves none of it. Link the discussion for context; put the operative sentences in the file.

When the window closes, write the result in with the arithmetic shown, so a Record Keeper verifying it under Section 3 has something to verify *against*. `python3 .github/scripts/tally.py votes/pr-{number}.md` recomputes it and prints the working; it is advisory, and a check warns if the written result and the rows disagree.

Section 1's amendment record — the assumptions the decision rests on, its status, explanatory notes — belongs in the same file. **Not in the pull request description:** a merge commit carries only the title, so a description never enters the repository at all.

### Merging

A Record Keeper checks that the evidence is complete and matches the outcome, then merges. The proposal is now part of the official record on `main`.

There is no separate GitHub approval step — the vote already happened. The merge is a clerical act: confirming the process was followed, not casting a second vote.

**Absence of objection on a pull request is not by itself proof of lazy consensus**, because deliberation also happens in the governance channel. Verifying both is exactly what the Record Keeper's check is for.

The Record Keeper announces the result in the governance channel with a link to the merged pull request.

## What GitHub enforces, and what it cannot

`main` is protected by a repository ruleset, recorded in `.github/ruleset-main.json` so the configuration is reviewable here rather than visible only to administrators. It enforces three things:

- **Every change arrives as a pull request.** Nobody commits to `main` directly.
- **The branch cannot be deleted or force-pushed**, so the history cannot be quietly rewritten.
- **Only organisation administrators can merge** — currently the two Record Keepers, which is what Constitution §3 means by *"the only members with merge access"*.

> **Merging will tell you the rules block it, and offer to bypass.** That is expected, and it is not a violation. The ruleset restricts who may update `main`, and organisation administrators are the exception that makes merging possible for the Record Keepers and nobody else — so GitHub presents the permission as an override. Take the bypass. What it does not excuse is skipping the verification the bypass exists for: that the deliberation period actually ran, and that the recorded outcome matches it.

**No approving review is required, deliberately.** A Layer 2 proposal needs no endorsement, so requiring an approval would have forced a procedural click on a rule that passed by nobody objecting — and the dashboard would then have counted that click as an endorsement.

Three things it does **not** do, all of which are why a Record Keeper verifies rather than rubber-stamps:

**It cannot enforce the endorsements a layer requires.** A Layer 4 amendment needs two endorsing reviews and a Layer 3 Policy needs one, and nothing here checks that before the merge button works. §1 describes protection that *"enforces approval requirements per path"*, but GitHub cannot vary a required review count by file, so no setting expresses it. The verification is the Record Keeper's, which is what their office is for.

**It cannot see the governance channel**, where most deliberation actually runs. Absence of objection on a pull request is not proof of lazy consensus.

**It does not constrain the Record Keepers themselves.** Organisation administrators bypass the ruleset — that is what makes merging possible for them and nobody else — so they can also commit straight to `main`. Nothing stops that except the person. If you are a Record Keeper, see the warning under *Starting from the dashboard*.

## Starting from the dashboard

You do not need git, a clone, or anything installed. The **Start a proposal** button on the dashboard asks what you are filing and opens GitHub's editor on a new file, already filled in:

| | | |
|---|---|---|
| An Ordinary rule | Layer 2 | `rules/rule-untitled.md` |
| A Policy | Layer 3 | `policies/{area}/policy.md` — replace `{area}` |
| A record of an adjudication | §4 | `disputes/dispute-untitled.md` |

Amending the Constitution is Layer 4 and **edits `constitution.md` itself** rather than adding a file, so it is a link in that dialog rather than one of the choices.

**What you are filing decides the path, and the path decides the procedure.** Choose by what the instrument actually does, not by which route is quickest — where two layers are arguable, the more demanding one applies. Rename the file in the editor if you picked wrong; nothing is committed until you press the button.

**Then what happens.** You press *Commit changes*, and GitHub offers to **create a new branch and start a pull request**. Take it. GitHub makes the branch, commits your file to it, and takes you straight to the pull request form with this repository's template already loaded — which is the thing that asks for the layer and its reasoning, `Observed by:`, and the rest. Fill it in, open the pull request, and a workflow labels it. Nothing has been adopted at this point: the deliberation period starts when you post it in the governance channel.

**You will not be committing to `main`**, because `main` is protected and the option is not offered — unless you are a Record Keeper, in which case see the warning under *Creating a branch and drafting the text* above.

Opening the editor commits nothing, so it is safe to click through and look.

## Amending an existing rule

1. Open the file on GitHub
2. Click the pencil icon to edit
3. Make your changes on a new branch, as above
4. The pull request will show exactly what changed — additions in green, removals in red

The same deliberation and approval process applies, at the layer of the instrument you are changing.

## If your instrument expires

A rule or policy with an end date says so in one line, inside itself:

```
**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) — when the proposal-process Policy is adopted, whichever is first
```

Written that way, the expiry appears on the dashboard. Written only in prose, it does not, and a rule that quietly stops being a rule is the kind of thing nobody notices until it matters.

**It says the instant twice on purpose.** The words are for whoever reads the rule; the timestamp in backticks is what the dashboard reads. A check compares them and tells you if they disagree — a wrong weekday, two different dates, or the wrong offset for the time of year.

**Write the UTC offset.** The United Kingdom is on British Summer Time from late March to late October, so 23:59 on 4 October is `+01:00` and on 30 November is `+00:00`. Getting this wrong puts the deadline an hour out, which has already happened once.

This covers an instrument's **own expiry**. A policy may also set recurring obligations ("a retro each term") or windows triggered by events ("within 24 hours of posting") — neither is expressible this way, and the second cannot be shown at all, because the triggering event happens somewhere the Record cannot see.

## Archiving, not deleting

Nothing is deleted from the record. To retire a rule, change its status to **archived** in the file. The file stays in the repo. The full history — adoption, amendments, archival — is preserved in the git log.

## What the Constitution requires of this repository

Section 1 provides that GitHub branch protection enforces approval requirements per path, that Record Keepers are the only members with merge access, and that the authoritative history may not be rewritten to erase an adopted decision.

| Requirement | Status |
|---|---|
| No direct changes to `main` — everything through a pull request | **Configured** |
| No force-pushing, no deleting the branch | **Configured** |
| Only Record Keepers can merge | **Configured**, as "only organisation administrators", which is how the office is implemented |
| Per-path approval requirements | **Not configured, and not configurable.** GitHub cannot vary a required review count by file |
| Issue forms, pull request template, instrument templates | Configured |

`.github/ruleset-main.json` records the live configuration so a change to who can merge is something members can read and object to, rather than a setting two administrators can alter silently. If the file and the live settings disagree, the settings are what is in force and the file is wrong.

**What is still carried by people, not by settings.** Nothing checks that a Layer 4 amendment has its two endorsing reviews, or that a Layer 3 Policy has its one, before the merge button works — the Record Keeper's verification is the only control, which is what their office is for. And pushing a rule straight to `main` would not make it a rule in any case: validity comes from the procedure, and Section 1 is explicit that a repository edit or commit does not itself create authority.

> **Merge rights and the office can come apart.** Merge rights are tied to organisation administrators, because that is how the Record Keeper office is implemented. The interim terms end at the date `roles.md` records. If they lapse without an election, the office is vacant while the access stays with whoever happens to hold it — and Section 3's fallback, that the Convener covers unfilled roles, does not help, because the Convener's term ends at the same moment. Whoever fills these offices should make sure merge rights follow the office rather than the other way round.
