# Rule: Drafting and filing tools for the Record

**Layer:** 2 — Ordinary
**Tier:** A — 48 hours
**Status:** live

## What this adopts

Tooling to help members draft and file proposals, held in this repository:

| | |
|---|---|
| `CONTRIBUTING.md` | How to propose, deliberate and record a decision, through the website or the command line |
| `AGENTS.md` | Instructions for a member's AI agent working in this repository. `CLAUDE.md` is a one-line pointer to the same file |
| `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md` | Two issue forms — one for a proposal, one for recording a position on a vote — and a pull request template, asking for what the Constitution requires |
| `.github/workflows/record-vote.yml` | Writes a member's own position into `votes/pr-{number}.md` on the proposal's branch when they submit the vote form, as them, and comments with the commit. It refuses rather than guesses: it will not open a vote, attribute a position to an unidentified account, write after the window has closed, or write at all if the result fails its own checks. Where it cannot write, it says so and links the file, which is always editable by hand |
| `.github/scripts/test-record-vote.mjs`, `.github/scripts/test-vote-parse.mjs` | The vote workflow's logic and the dashboard's vote arithmetic, each run against stubs. The workflow triggers on `issues`, which GitHub always runs from the default branch, so it cannot be exercised by the pull request that introduces it; the dashboard's arithmetic is lifted out of the page and driven from the same worked cases as `tally.py`, so the two cannot disagree |
| `.claude/skills/` | Optional procedures an agent may load: `classify`, `draft-policy`, `review-agenda` |
| `.claude/hooks/`, `.claude/settings.json` | A hook preventing an agent from merging, pushing to `main`, force-pushing or rewriting history **in a Record**. It identifies one by its own files and steps aside anywhere else. It does not prevent an agent from recording a position a member has stated: Section 1 makes an agent's actions the member's, so that is the member acting, disclosed by a `Co-Authored-By:` trailer on the commit. What an agent may not do is *decide* a position, and no hook can check that — `AGENTS.md` states it as a duty the agent holds rather than a door the tooling closes. The hook constrains a member's own agent in their own clone, and the member may switch it off |
| `.github/workflows/label-proposals.yml` | Reads the layer, tier and deliberation period from a pull request body and applies them as labels, and records when a proposal opened and how many members have endorsed it |
| `.github/scripts/test-label-proposals.mjs` | Runs the labelling workflow's own logic against a stubbed GitHub API. That workflow uses `pull_request_target`, which GitHub always runs from the default branch, so it cannot be tested by the proposal that introduces it |
| `.github/workflows/check-record.yml`, `.github/scripts/check-record.py` | Warns when the dashboard's figures no longer match the Record — a quoted clause that has been amended, a time that disagrees with its own quote, an instrument that expires without saying so, a vote whose written result disagrees with its own rows |
| `.github/scripts/tally.py`, `.github/scripts/vote-cases.json` | Recomputes a vote from its own file and shows the working, so a Record Keeper verifying one under Section 3 has something to check against. Advisory: it decides nothing. The worked cases beside it state the arithmetic as data, and are read by both this and the dashboard so the two cannot disagree |
| `.github/instrument-templates/` | Skeletons for a rule, a policy, a record of an adjudication and a vote. The dashboard's *Start a proposal* button asks which you are filing and opens GitHub's editor at the right path with the right one. Held as files so they cannot drift from the templates beside them |
| `.github/ruleset-main.json`, `.github/ruleset-all-branches.json` | Copies of the branch protection applied to `main` and to every other branch, so the configuration is reviewable in the Record rather than visible only to repository admins. The second exists because a vote is recorded on a proposal's own branch: without it, a position could be force-pushed away before the proposal merged |
| `docs/` | A page showing the state of the Record: deadlines, open proposals and their deliberation windows, what is in force, who holds office, and how the Record changed |
| `README.md` | Expanded: the layers, what is in the repository, and the Laboratory's current state |

## The `main` branch configuration

`.github/ruleset-main.json` records what is configured on `main`: every change arrives as a pull request, the branch cannot be deleted or force-pushed, no approving review is required, and only organisation administrators may update the branch.

**This records the configuration; it does not create it.** The authority is Constitution §3, which makes Record Keepers *"the only members with merge access"*. The file exists so that a change to who can merge is something a member can read and object to, instead of a setting two administrators can alter silently. If the file and the live settings disagree, the live settings are what is in force and the file is wrong.

Merging reports that the rules block it and offers a bypass. That is the permission working, not a violation: the ruleset restricts who may update `main`, and administrators are the exception that confines merging to the Record Keepers.

Requiring no approving review is deliberate: a Layer 2 proposal needs no endorsement, so a required approval would have forced a procedural click that the dashboard would then have counted as an endorsement.

**Merge is the only method allowed.** A vote is recorded one commit per position, each authored by the member whose position it is — that authorship is half of how a vote is attributed, and `git log` on the vote file is what Section 3 gives a Record Keeper to verify against. Squash collapses every one of those commits into a single commit authored by whoever pressed the button, and rebase rewrites them onto new hashes. Merge is also the only method that keeps the branch's own history, which is where a restarted vote's earlier rounds live.

## What this does not do

**It creates no duty.** Every requirement the templates ask for — the layer and its reasoning, the `Observed by:` line, hypothesis and success criteria for experiments — is already imposed by Section 2. Nothing here adds a requirement, and no proposal is invalid for having been filed without these tools. Blank issues remain enabled.

**It binds no member.** `AGENTS.md` instructs a tool, not a person. Any member may ignore it, use a different agent, use none, or propose entirely through the website. The merge hook constrains a member's own agent in their own clone and can be switched off by the member it belongs to; it takes nothing from a Record Keeper.

**It is subordinate.** `AGENTS.md` states that where it contradicts the Constitution, the Constitution wins and the file is wrong.

**The page reports; it does not decide.** What it displays has whatever force the Record gives it and no more. A proposal with no recorded opening is shown as not opened rather than guessed at, and nothing on the page is ever described as ready to merge — that judgement belongs to a Record Keeper who can see the governance channel. The labelling workflow never fails a check: a proposal missing a label is unlabelled, not blocked.

## Keeping these in step with the Constitution

Everything adopted here **describes** the Constitution. None of it has authority of its own. Where any file above disagrees with the Constitution, the Constitution is right and the file is wrong — that holds for `AGENTS.md`, `CONTRIBUTING.md`, the templates, the figures in `docs/data.json`, and anything the dashboard displays.

**A proposal that changes the Constitution should update the affected tooling in the same pull request.** The pull request template asks this directly for deadlines, because nothing can detect a deadline newly added to a clause. It is the cheapest moment to do it: the person who knows what changed is already there.

Three things notice drift rather than prevent it. `check-record.py` warns when a clause quoted in `docs/data.json` is no longer in `constitution.md`, when a stated time disagrees with its own quote, and when an instrument appears to expire without a readable `Ends:` line. The dashboard says plainly that its figures are unverified rather than showing them as though checked. The monthly review looks.

**None of this may block an amendment.** A proposal is not invalid because the tooling was not updated alongside it, no check here fails a pull request, and nobody carries a duty to maintain these files. Tooling that has fallen behind the Constitution is a defect in the tooling, never in the instrument — and a Laboratory that could not amend its Constitution until a dashboard was updated would have the relationship exactly backwards.

## This is the act that adopts the templates

Section 2 says the first Policy to be issued will define the issue templates for each layer and the proposer's checklist. That describes what a future Policy is expected to do. It does not reserve the job, and nothing in it makes templates a Layer 3 matter.

**Layer follows effect.** These templates create no duty and bind no member: they prompt for what Section 2 already requires, and a proposal filed without them is exactly as valid as one filed with them. Adopting something optional is not creating or redesigning the governance of an area, so this is an Ordinary resolution — and this rule is the act that adopts them, not a placeholder for one.

If the Laboratory later issues the Policy Section 2 anticipates, it supersedes this rule and may change or discard anything here. That is simply how a Policy relates to an Ordinary rule, and needs no special provision.

## Amendment

Any part of this rule may be amended by Ordinary resolution. Changes to files it adopts follow the same route.

## Ends

**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) — with this Constitution, which these tools exist to serve

The line above is written in a form the Record dashboard can read, so this rule's expiry is visible rather than buried in prose. The offset is explicit because the United Kingdom is on British Summer Time from late March to late October, and a missing offset is how a deadline ends up an hour out.

`Observed by:` This rule creates no enforceable duty, so there is nothing to observe breach of. The files it adopts are in the Record and their history is public; whether they are used is visible in the proposals members file, and whether they help is a question for a monthly review.
