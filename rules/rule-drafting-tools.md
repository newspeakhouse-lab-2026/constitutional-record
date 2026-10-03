# Rule: Drafting and filing tools for the Record

**Layer:** 2 — Ordinary
**Tier:** A — 48 hours
**Status:** live, interim

## What this adopts

Tooling to help members draft and file proposals, held in this repository:

| | |
|---|---|
| `CONTRIBUTING.md` | How to propose, deliberate and record a decision, through the website or the command line |
| `AGENTS.md` | Instructions for a member's AI agent working in this repository. `CLAUDE.md` is a one-line pointer to the same file |
| `.github/ISSUE_TEMPLATE/`, `.github/pull_request_template.md` | A proposal form and a pull request template, asking for what the Constitution requires |
| `.claude/skills/` | Optional procedures an agent may load: `classify`, `draft-policy`, `review-agenda` |
| `.claude/hooks/`, `.claude/settings.json` | A hook preventing an agent from merging, pushing to `main`, force-pushing or rewriting history |
| `.github/workflows/label-proposals.yml` | Reads the layer, tier and deliberation period from a pull request body and applies them as labels, and records when a proposal opened and how many members have endorsed it |
| `.github/workflows/check-record.yml`, `.github/scripts/check-record.py` | Warns when the dashboard's figures no longer match the Record — a quoted clause that has been amended, a time that disagrees with its own quote, an instrument that expires without saying so |
| `.github/instrument-templates/` | Skeletons for a rule, a policy and a record of an adjudication. The dashboard's *Start a proposal* button asks which you are filing and opens GitHub's editor at the right path with the right one. Held as files so they cannot drift from the templates beside them |
| `.github/ruleset-main.json` | A copy of the branch protection applied to `main`, so the configuration is reviewable in the Record rather than visible only to repository admins |
| `docs/` | A page showing the state of the Record: deadlines, open deliberation windows, adopted instruments, roles and thresholds |

## The `main` branch configuration

`.github/ruleset-main.json` records what is configured on `main`: every change arrives as a pull request, the branch cannot be deleted or force-pushed, no approving review is required, and only organisation administrators may update the branch.

**This records the configuration; it does not create it.** The authority is Constitution §3, which makes Record Keepers *"the only members with merge access"*. The file exists so that a change to who can merge is something a member can read and object to, instead of a setting two administrators can alter silently. If the file and the live settings disagree, the live settings are what is in force and the file is wrong.

Requiring no approving review is deliberate: a Layer 2 proposal needs no endorsement, so a required approval would have forced a procedural click that the dashboard would then have counted as an endorsement.

## What this does not do

**It creates no duty.** Every requirement the templates ask for — the layer and its reasoning, the `Observed by:` line, hypothesis and success criteria for experiments — is already imposed by Section 2. Nothing here adds a requirement, and no proposal is invalid for having been filed without these tools. Blank issues remain enabled.

**It binds no member.** `AGENTS.md` instructs a tool, not a person. Any member may ignore it, use a different agent, use none, or propose entirely through the website. The merge hook constrains a member's own agent in their own clone and can be switched off by the member it belongs to; it takes nothing from a Record Keeper.

**It is subordinate.** `AGENTS.md` states that where it contradicts the Constitution, the Constitution wins and the file is wrong.

**The page reports; it does not decide.** What it displays has whatever force the Record gives it and no more. A proposal with no recorded opening is shown as not opened rather than guessed at, and nothing on the page is ever described as ready to merge — that judgement belongs to a Record Keeper who can see the governance channel. The labelling workflow never fails a check: a proposal missing a label is unlabelled, not blocked.

## Interim

Section 2 provides that the first Policy to be issued will define the issue templates for each layer and the proposer's checklist. These templates are **interim**, adopted at Layer 2 so that members have something to file with before that Policy exists. That Policy supersedes this rule, and may change or discard anything here.

## Amendment

Any part of this rule may be amended by Ordinary resolution. Changes to files it adopts follow the same route.

## Ends

**Ends:** 2026-11-30T23:59:00+00:00 — when the proposal-process Policy is adopted, or at the end of this Constitution, whichever comes first

The line above is written in a form the Record dashboard can read, so this rule's expiry is visible rather than buried in prose. The offset is explicit because the United Kingdom is on British Summer Time from late March to late October, and a missing offset is how a deadline ends up an hour out.

`Observed by:` This rule creates no enforceable duty, so there is nothing to observe breach of. The files it adopts are in the Record and their history is public; whether they are used is visible in the proposals members file, and whether they help is a question for a monthly review.
