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
