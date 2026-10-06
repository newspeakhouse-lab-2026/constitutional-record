# Research log

**2026-10-06**

- Read `~/.claude/agents/ai-symposium/installed.json` — tier `pro`, packs
  include `security`, `economics`, `devops`, `product`, confirming the named
  experts below are within the installed expert pool (Schneier/security,
  Ostrom/economics, Majors/devops, Norman/product) with Elster, Fogg and Scott
  brought in as free selections per the foundational file's explicit
  invitation to use any relevant real thinker.
- Full read of `constitution.md`, `CONTRIBUTING.md`, `AGENTS.md`, `README.md`,
  `rules/rule-recording-votes.md`, `rules/rule-drafting-tools.md`,
  `.github/instrument-templates/vote.md`, `.github/workflows/record-vote.yml`,
  `.github/scripts/tally.py`, `.github/scripts/check-record.py`,
  `.github/ISSUE_TEMPLATE/{vote,objection}.yml`, `docs/data.json`,
  `docs/index.html`, `members.md`, `roles.md`, `voting-requirements.md`, and
  the prior report `.ai-symposium/vote-system-review.md`.
- `git log --oneline drafting-tools..record-votes` — 15 commits, confirmed
  against `git diff --stat`, 29 files changed.
- Ran `.claude/hooks/block-merge.sh` by reading it directly (not executing
  against a live command) to confirm the current deny-list contents and the
  comment explaining the deliberate omission of `gh issue create` — matches
  the user's correction that this was removed on instruction, not missing by
  oversight.
- Ran `python3 .github/scripts/tally.py /tmp/vote-preview/pr-{14,13,11}.md`
  against the live preview server (`http://localhost:8778/`, confirmed
  reachable, HTTP 200) and independently cross-checked the printed arithmetic
  by hand against each file's table before trusting any dashboard-rendering
  claim built on top of it. All three matched the prior report's numbers.
- `grep -n "template=vote\|template=objection\|issues/new" docs/index.html`
  and `grep -n "record your position\|start a vote" docs/index.html` —
  confirmed the dashboard's "record your position" link (line 728) points at
  `/edit/{branch}/votes/pr-{n}.md`, never at an issue template, and the only
  `template=` link anywhere on the page is `proposal.yml` (line 798, for
  raising a new issue, unrelated to voting). This became the panel's lead
  finding.
- WebSearch, four queries, to verify the external experts' frameworks before
  letting them speak from them: Jon Elster's *Ulysses Unbound* and his own
  partial repudiation of the precommitment analogy; Ostrom's eight design
  principles (confirmed graduated sanctions, monitoring, nested enterprise);
  B.J. Fogg's B=MAP model (confirmed multiplicative, not additive, and the
  "brain cycles" / "non-routine" ability sub-factors); Charity Majors on
  observability and production-as-truth (exact phrasing not found verbatim;
  underlying claim confirmed across several independent summaries). Recorded
  in `research/sources.json` S12-S15, each marked verified with the caveat
  where phrasing wasn't exact.
- Did not re-search Norman, Schneier or Scott — their frameworks used here
  (affordances/slips; attack trees/security economics; legibility/metis) are
  foundational, widely-taught content from each author's best-known books,
  marked `"verified": false` in sources.json as a matter of record rather
  than re-confirming material this well established.
- Mid-task: coordinator reweighted the brief toward dashboard-UI-as-primary-
  subject. No new file reads were needed to answer this — the reweight
  changed which already-read material got emphasis, not what needed finding.
  The one additional verification it did prompt (the CTA-routes-to-raw-edit
  grep above) was run before, not after, writing it up as a finding.
