#!/usr/bin/env bash
# Blocks an agent from merging, or from writing to main, in the Constitutional Record.
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

norm=$(printf '%s' "$cmd" | tr -s '[:space:]' ' ')

case "$norm" in
  *"gh pr merge"*)                       deny "gh pr merge" ;;
  *"git merge"*)                         deny "git merge" ;;
  *"gh api"*"/merge"*)                   deny "a merge through the GitHub API" ;;
  *"git push"*" main"*|*"git push"*":main"*) deny "a push to main" ;;
  *"git push --force"*|*"git push -f"*)  deny "a force push — the Record's history is append-only (Constitution §1)" ;;
  *"git reset --hard"*)                  deny "git reset --hard" ;;
  *"git rebase"*)                        deny "git rebase — it rewrites history" ;;
  *"git branch -D main"*|*"git push"*"--delete"*) deny "deleting a branch" ;;
esac
exit 0
