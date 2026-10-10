#!/usr/bin/env bash
# Blocks an agent from merging, or from writing to main, in the Constitutional Record.
# Only in the Record: it checks the origin remote before doing anything.
#
# Constitution §3 gives merge access to the Record Keepers alone, and merging is the
# moment a decision enters the Record. An instruction not to merge is a norm; this is
# architecture. Lessig's point, applied to the tool that quotes him.
#
# A Record Keeper merging by hand, in the GitHub interface or their own shell, is
# unaffected. This governs the agent only.

cmd=$(cat | python3 -c 'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null)
[ -z "$cmd" ] && exit 0

deny() {
  echo "BLOCKED: $1" >&2
  echo "Merging and writing to main belong to the Record Keepers (Constitution §3), who merge only after verifying that the required process occurred. Prepare the change on a branch and open a pull request; a human completes it." >&2
  exit 2
}


# This guards the Constitutional Record. Matching on the command alone blocked
# pushes to main in every repository, which is wider than it claims. Identify the
# repository first, and step aside for anything else — but fail closed, because a
# command we cannot place is not a command we should wave through.
origin=$(git config --get remote.origin.url 2>/dev/null)
case "$origin" in
  *constitutional-record*) ;;   # the Record: everything below applies
  "")                      ;;   # cannot tell: fail closed
  # Some other repository. A copy of a Record made to test workflows is still a
  # Record for this purpose, so identify one by its own files rather than by a
  # name — that way a sandbox is covered without this hook naming it.
  *) { [ -f constitution.md ] && [ -f members.md ]; } || exit 0 ;;
esac

norm=$(printf '%s' "$cmd" | tr -s '[:space:]' ' ')

case "$norm" in
  *"gh pr merge"*)                       deny "gh pr merge" ;;
  *"git merge"*)
    # Only a merge performed while on main writes to main. Bringing main into a
    # working branch is routine and has nothing to do with adopting anything.
    [ "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" = "main" ] && deny "a git merge while on main"
    ;;
  *"gh api"*"/merge"*)                   deny "a merge through the GitHub API" ;;
  # Filing a vote through an issue has a workflow write the row, so the issue is
  # the position. Proposals and every other kind of issue are untouched.
  *"git push"*" main"*|*"git push"*":main"*) deny "a push to main" ;;
  *"git push --force"*|*"git push -f"*)  deny "a force push — the Record's history is append-only (Constitution §1)" ;;
  *"git reset --hard"*)                  deny "git reset --hard" ;;
  *"git rebase"*)                        deny "git rebase — it rewrites history" ;;
  *"git branch -D main"*|*"git push"*"--delete"*) deny "deleting a branch" ;;
esac
exit 0
