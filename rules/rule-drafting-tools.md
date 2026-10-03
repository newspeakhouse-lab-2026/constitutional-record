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
| `.github/workflows/label-proposals.yml` | Reads the layer, tier and deliberation period from a pull request body and applies them as labels |
| `docs/` | A page showing the state of the Record: deadlines, open deliberation windows, adopted instruments, roles and thresholds |

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

When the proposal-process Policy is adopted, or at the end of this Constitution on 30 November 2026, whichever comes first.

`Observed by:` This rule creates no enforceable duty, so there is nothing to observe breach of. The files it adopts are in the Record and their history is public; whether they are used is visible in the proposals members file, and whether they help is a question for a monthly review.
