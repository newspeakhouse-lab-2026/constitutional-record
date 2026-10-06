#!/usr/bin/env bash
# Blocks an agent from writing to a vote file.
#
# Constitution §1: an AI agent "holds no membership, no vote, and no standing."
# AGENTS.md says never register a position, because consent an agent can
# manufacture is not consent. That is a norm; this is architecture, for the one
# file where a position becomes part of the Record.
#
# It blocks every write to votes/, not only a position. A vote file is also
# opened by naming the procedure and freezing who may vote, which are decisions
# a member makes, and the result is a finding a Record Keeper makes under §3.
# An agent may read the file, run .github/scripts/tally.py and report what it
# prints — it may not be the hand that writes any of it.
#
# This does not close the hole, and should not be described as if it did: an
# agent driving a member's own authenticated gh is indistinguishable from the
# member. It removes the easy path. What remains is detection — every row is a
# commit naming an account, in a public history.

path=$(cat | python3 -c 'import json,sys; d=json.load(sys.stdin).get("tool_input",{}); print(d.get("file_path") or d.get("path") or "")' 2>/dev/null)
[ -z "$path" ] && exit 0

# Only inside a Record. Identified by its own files rather than by a repository
# name, so a copy made to test workflows is covered without naming it here.
[ -f constitution.md ] && [ -f members.md ] || exit 0

case "$path" in
  votes/*.md|*/votes/*.md)
    echo "BLOCKED: writing to $path" >&2
    echo "A vote file holds members' positions, and Constitution §1 gives an AI agent no vote. Draft the row or the result and hand it over — the member commits it. You may read the file and run .github/scripts/tally.py to show the arithmetic. A member editing this file themselves is unaffected." >&2
    exit 2 ;;
esac
exit 0
