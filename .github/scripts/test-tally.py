#!/usr/bin/env python3
"""Run tally.py against vote-cases.json.

Unlike check-record.py, a failure here is a real failure: it means a vote would
be counted wrongly. Exits non-zero.
"""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import tally  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(HERE, "vote-cases.json")) as f:
    corpus = json.load(f)
with open(os.path.join(HERE, "..", "..", "docs", "data.json")) as f:
    thresholds = json.load(f).get("thresholds", {})

results = []
for v in corpus["cases"]:
    got = tally.tally(v["procedure"], v["roll"], v["counts"], thresholds, v.get("excluded", 0))
    bad = []
    for key, want in v["expect"].items():
        if got.get(key) != want:
            bad.append(f"{key}: got {got.get(key)!r}, want {want!r}")
    results.append((v["name"], bad, v["why"]))
    print(f"  {'FAIL' if bad else 'ok  '}  {v['name']}")
    for b in bad:
        print(f"          {b}")
    if bad:
        print(f"          why this case exists: {v['why']}")

# Tier A and Tier B: no table, and that is correct. These go through parse() as
# well as tally(), because the failure being guarded against was parse refusing
# the file outright.
def no_vote_fixture(v):
    lines = [f"# Objections — PR #1: fixture", "", f"**Procedure:** {v['procedure']}", ""]
    if v.get("table"):
        lines += ["| Member | Position | Date |", "|---|---|---|",
                  "| M1 | objection | 2026-10-07 |"] + [f"| M{i} | — | |" for i in range(2, 15)] + [""]
    lines += ["## Objections", ""]
    for o in v["objections"]:
        lines += [f"**{o['name']}** — {o['date']}", "", "> Reason: fixture.", ">",
                  "> Route forward: fixture.", ""]
    return "\n".join(lines)


for v in corpus.get("noVoteCases", []):
    parsed, err = tally.parse(no_vote_fixture(v))
    bad = []
    if err:
        bad.append(f"parse refused the file: {err}")
    else:
        got = tally.tally(parsed["procedure"], parsed["roll"], parsed["counts"], thresholds,
                          parsed["excluded"], no_vote=not parsed["holdsVote"],
                          objections=parsed["objections"])
        if parsed["holdsVote"] != v["expect"]["holdsVote"]:
            bad.append(f"holdsVote: got {parsed['holdsVote']!r}, want {v['expect']['holdsVote']!r}")
        if len(parsed["objections"]) != v["expect"]["objections"]:
            bad.append(f"objections: got {len(parsed['objections'])}, want {v['expect']['objections']}")
        if not v["expect"]["holdsVote"] and got.get("verdict") != "no-vote":
            bad.append(f"verdict: got {got.get('verdict')!r}, want 'no-vote'")
    results.append((v["name"], bad, v["why"]))
    print(f"  {'FAIL' if bad else 'ok  '}  {v['name']}")
    for b in bad:
        print(f"          {b}")
    if bad:
        print(f"          why this case exists: {v['why']}")

# parse() refuses seven kinds of broken file, and every one of those refusals was
# untested. Each is the difference between a wrong tally and a visible complaint.
HEAD = ("**Procedure:** Layer 3 Policy\n"
        "**Carries if:** a majority of all members \u2014 **8 of 14**\n\n")
TABLE = "| Member | Position | Date |\n|---|---|---|\n"

PARSE_CASES = [
    ("duplicate rows",
     HEAD + TABLE + "| Ada | preference | |\n| Ada | objection | |\n",
     "duplicated row",
     "Two rows for one member make the denominator ambiguous and the tally silent about it."),
    ("Entitled to vote disagrees with the table",
     HEAD + "**Entitled to vote:** 14 members\n\n" + TABLE + "| Ada | preference | |\n",
     "but the table has",
     "The stated roll and the actual rows must agree, or the fraction is of nothing checkable."),
    ("an unrecognised position",
     HEAD + TABLE + "| Ada | yes please | |\n",
     "unrecognised position",
     "A cast vote that is silently dropped is worse than a refusal: nobody is told."),
    ("a comment block carrying position words",
     HEAD + TABLE + "| Ada | preference | |\n<!-- | Bo | preference | | -->\n",
     None,
     "Template guidance must not be counted. Expect a clean parse of ONE row, not a refusal."),
    ("Tier A with a table",
     "**Procedure:** Tier A\n\n" + TABLE + "| Ada | preference | |\n",
     "holds no vote, but the file has a table",
     "A vote whose Procedure line was never updated would report no-vote and suppress the verdict."),
    ("no Procedure line",
     TABLE + "| Ada | preference | |\n",
     "no **Procedure:** line",
     "Without it there is no arithmetic to apply, and guessing one would set a threshold."),
    ("a procedure the Constitution does not name",
     "**Procedure:** Vibes\n\n" + TABLE + "| Ada | preference | |\n",
     "is not one the Constitution names",
     "\u00a72 reserves thresholds; inventing one here would invent a procedure."),
]

for name, text, want, why in PARSE_CASES:
    parsed, err = tally.parse(text)
    bad = []
    if want is None:
        if err:
            bad.append(f"expected a clean parse, got refusal: {err}")
        elif parsed["roll"] != 1:
            bad.append(f"expected 1 row, got {parsed['roll']} \u2014 the comment was counted")
    elif not err:
        bad.append("expected a refusal, got a clean parse")
    elif want not in err:
        bad.append(f"refused with {err!r}, which does not mention {want!r}")
    results.append(("parse/" + name, bad, why))
    print(f"  {'FAIL' if bad else 'ok  '}  parse/{name}")
    for b in bad:
        print(f"          {b}")
    if bad:
        print(f"          why this case exists: {why}")

# The §4 respondent is excluded from their own electorate, not counted into it.
_p, _e = tally.parse("**Procedure:** Layer 3 Policy\n**Carries if:** a majority of all members \u2014 **8 of 14**\n\n"
                     + TABLE + "| Ada | preference | |\n| Bo | excluded | |\n")
_bad = [] if (not _e and _p["excluded"] == 1 and _p["roll"] == 2) else [f"excluded row mishandled: {_e or _p}"]
results.append(("parse/excluded-row", _bad, "\u00a74 removes the respondent from the denominator of their own removal."))
print(f"  {'FAIL' if _bad else 'ok  '}  parse/excluded-row")

# The two rounding rules, asserted directly rather than only through a procedure.
extra = []
if tally.required({"rule": "majority"}, 14) != 8:
    extra.append("a majority of 14 must be 8 — more than half, not ceil(14/2)=7")
if tally.required({"rule": "fraction", "num": 2, "den": 3}, 14) != 10:
    extra.append("two-thirds of 14 must round up to 10")
if tally.required({"rule": "fraction", "num": 2, "den": 3}, 13) != 9:
    extra.append("two-thirds of 13 must round up to 9")
if tally.required({"rule": "fraction", "num": 1, "den": 2}, 13) != 7:
    extra.append("half of 13, as a quorum, must round up to 7")
for e in extra:
    print(f"  FAIL  rounding: {e}")

failed = [n for n, bad, _ in results if bad] + extra
print(f"\n{len(results) - len([n for n, bad, _ in results if bad])}/{len(results)} cases passed"
      + (f", {len(extra)} rounding assertion(s) failed" if extra else ""))
sys.exit(1 if failed else 0)
