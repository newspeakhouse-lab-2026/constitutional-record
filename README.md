# Constitutional Record — Newspeak House Governance Laboratory 2026

The authoritative record of every rule, policy and constitutional decision of the 2026 Newspeak House Governance Laboratory, a fourteen-member research programme operating under a Charter devolved from the London College of Political Technology.

**A rule is valid only if it was adopted through the procedure required for its layer, its exact adopted text appears here, and it has not expired, been repealed or been superseded.** A repository edit or commit does not itself create authority.

The Laboratory acts as a body only through its registered Agent. Anything else is a communication from its individual sender.

## Layers

The layer is determined by a decision's actual effect, not by the label its proposer chooses. Where two layers are reasonably arguable, the more demanding process applies.

| Layer | What | Where | How it is adopted |
|---|---|---|---|
| **4** Constitutional | Rights, thresholds, procedures, allocation of authority | `constitution.md` | 2 endorsing reviews, 7 days, two-thirds of all members |
| **3** Policy | Governance systems for an area — mechanisms, offices, ongoing financial flows | `policies/{area}/policy.md` | 1 endorsement, preference mapping, 7 days, majority of all members |
| **2** Ordinary | Rules and parameters within an existing frame | `policies/{area}/rule-*.md` or `rules/rule-*.md` | Tier A 48h, Tier B under 7 days, or Tier C 7+ days with a vote |
| **1** Coordination | Scheduling, logistics | Governance channel | Post it; no commit |
| **0** Operational | Reversible action within existing rules | — | Just do it; no commit |

A time-limited experiment takes the `exp-` prefix at whatever layer it belongs to, states a hypothesis, success criteria and an end date, and expires automatically unless adopted or extended. Adjudication precedent lives in `disputes/dispute-*.md` and binds only the parties to that dispute.

## What is here

| | |
|---|---|
| `constitution.md` | The Constitution. The authority. |
| `members.md` | Authoritative membership. Every threshold is a fraction of this. |
| `roles.md` | Current role holders, maintained by the Record Keepers. |
| `rules/` | Standalone Ordinary Rules. |
| `policies/` | One folder per governed area. |
| `disputes/` | Adjudication decisions. |
| `CONTRIBUTING.md` | **How to propose, deliberate and record a decision.** Start here. |
| `CLAUDE.md` | Instructions for members' AI agents working in this repository. |

## Proposing something

Open an issue using the form for your layer, then put the text on a branch and open a pull request. The form asks for the reasoning behind your layer classification, which the Constitution requires. Full walkthrough in [CONTRIBUTING.md](CONTRIBUTING.md) — no command line needed.

Deliberation happens here, in the governance channel, and in meetings. Voting happens as the Constitution specifies for the layer; **GitHub is not the voting platform.** A Record Keeper merges once the process has been verified, which is a clerical act and not a second vote.

If GitHub is a barrier for you, it must not cost you a right: the Convener provides a reasonably equivalent route, and anything submitted that way is recorded as the Constitution otherwise requires.

## Current state

- **14 members.** Majority of all members is 8; two-thirds is 10; quorum is 7.
- **Interim role holders** were elected after the Constitutional Convention under §6 and are recorded in `roles.md`. Ordinary elections follow the process in §3.
- **This Constitution expires at 23:59 UK time on Monday 30 November 2026** unless re-ratified or replaced by two-thirds of all members. A re-ratification or replacement proposal must have obtained its endorsements and entered its seven-day deliberation period **no later than Monday 23 November 2026.** If it lapses, functions revert to the College.

## Notes on this repository

The repository is **public**. Anything committed here — files, commit messages, pull request comments — is visible to anyone and stays in the history. Candid or sensitive discussion belongs in the governance channel. Never commit personal data.

The authoritative history may not be rewritten to erase an adopted decision; errors are corrected by a new commit and superseded material is archived rather than deleted. Material may be removed where retaining it would disclose personal or confidential information or create a serious risk of harm, with the removal and its reason recorded.

**Branch protection is not yet configured.** §1 requires it, so until it is set up the rules it would enforce — no direct pushes to `main`, no rewritten history, merge restricted to Record Keepers — hold as norms rather than technical guarantees. See CONTRIBUTING.md for what is and is not in place.
