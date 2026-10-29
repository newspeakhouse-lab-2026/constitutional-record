# Git hooks for the Constitutional Record

`pre-push` refuses a push to `main` from this clone — the same guard the `.claude`
and `.codex` agent hooks apply, at the git level, so it holds for any client
including a plain shell. It is the belt for the one case the GitHub ruleset waves
through: a Record Keeper (org admin) acting through their own agent.

**Install once per clone:**

```
git config core.hooksPath .githooks
```

It is bypassable with `--no-verify` and does not catch `gh pr merge` (that is the
GitHub API, not git — the `.claude`/`.codex` command hooks catch that). It steps
aside outside the Record (it checks the origin, or `constitution.md` + `members.md`).
