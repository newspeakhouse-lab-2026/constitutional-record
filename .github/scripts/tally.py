#!/usr/bin/env python3
"""Recompute a vote from its own file, and show the working.

    python3 .github/scripts/tally.py votes/pr-14.md

Advisory. Section 3 gives the outcome to a Record Keeper, who verifies that the
vote happened and that the correct outcome is recorded. This prints arithmetic to
verify against; it decides nothing. Where it disagrees with the Constitution, it
is wrong.

Thresholds come from docs/data.json, which carries the sentence each one was read
from. No number the Constitution states is restated here.
"""

import json
import os
import re
import sys

POSITIONS = ("preference", "toleration", "abstention", "objection")

# What a member writes in **Procedure:** -> the key in data.json's thresholds.
PROCEDURES = {
    "tier a": None, "tier b": None,          # no vote: pass absent an objection
    "tier c": "tier-c",
    "layer 3 policy": "layer-3", "layer 3": "layer-3", "policy": "layer-3",
    "layer 4 constitutional": "layer-4", "layer 4": "layer-4",
    "emergency": "emergency",
    "re-ratification": "re-ratification", "reratification": "re-ratification",
    "recall": "recall", "no-confidence": "recall",
    "remedy": "remedy", "§4 remedy": "remedy",
    "removal": "removal", "§4 removal": "removal",
}


def ceil_div(a, b):
    return -(-a // b)


def required(spec, d):
    """Two rules, and they differ on an even denominator.

    A majority is MORE THAN HALF, so a majority of 14 is 8 and a 7-7 split
    fails. A named fraction rounds up, so two-thirds of 14 is 10. Using ceil
    for a majority is the bug that carries a tied vote.
    """
    rule = spec.get("rule")
    if rule == "majority":
        return d // 2 + 1
    if rule == "fraction":
        return ceil_div(d * spec["num"], spec["den"])
    return None


def tally(procedure, roll, counts, thresholds, excluded=0):
    spec = thresholds.get(procedure)
    electorate = roll - excluded
    got = {p: int(counts.get(p, 0)) for p in POSITIONS}
    responders = sum(got.values())

    out = {
        "procedure": procedure,
        "electorate": electorate,
        "counts": got,
        "responders": responders,
        "nonResponse": electorate - responders,
        "source": (spec or {}).get("source"),
    }

    if spec is None:
        out["verdict"] = "none"
        out["note"] = "no threshold recorded for this procedure"
        return out

    # The Constitution does not settle these, and guessing a number would set a
    # threshold, which Section 2 reserves to Layer 4.
    if spec.get("verdict") == "none" or spec.get("rule") in ("unspecified", "none"):
        out["verdict"] = "none"
        out["readings"] = {
            "preference and objection only": required({"rule": "majority"}, got["preference"] + got["objection"]),
            "everyone who responded": required({"rule": "majority"}, responders),
        }
        out["note"] = "the Constitution does not state the denominator"
        return out

    quorum = spec.get("quorum")
    if quorum:
        out["quorumRequired"] = required(quorum, electorate)
        out["quorumMet"] = responders >= out["quorumRequired"]

    over = spec.get("over")
    d = got["preference"] + got["objection"] if over in ("voting", "others-voting") else electorate
    out["denominator"] = d
    out["over"] = over

    if d == 0:
        out["required"] = None
        out["carried"] = False
        out["note"] = "nobody chose preference or objection, and a majority of nobody is not a majority"
        return out

    out["required"] = required(spec, d)
    out["carried"] = out.get("quorumMet", True) and got["preference"] >= out["required"]
    return out


def parse(text):
    """Read a vote file: its procedure, who was entitled to vote, and the positions."""
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)

    m = re.search(r"^\*\*Procedure:\*\*[^\S\n]*(.+)$", text, re.M)
    if not m:
        return None, "no **Procedure:** line, so the arithmetic to apply is unknown"
    raw = m.group(1).strip().strip("*").strip()
    key = PROCEDURES.get(raw.lower().replace("—", "-").strip())
    if key is None and raw.lower() not in PROCEDURES:
        return None, f'procedure "{raw}" is not one the Constitution names'

    rows, counts, excluded, bad = [], {p: 0 for p in POSITIONS}, 0, []
    for line in text.split("\n"):
        if not line.lstrip().startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 2 or re.fullmatch(r"[:\-\s]+", cells[0] or "-"):
            continue
        if cells[0].lower() == "member":
            continue
        name, pos = cells[0], cells[1].lower().strip("`")
        rows.append(name)
        if pos == "excluded":
            excluded += 1
        elif pos in POSITIONS:
            counts[pos] += 1
        elif pos not in ("", "—", "-"):
            bad.append((name, cells[1]))

    if bad:
        listed = "; ".join(f'{n} reads "{p}"' for n, p in bad[:3])
        return None, f"unrecognised position — {listed}. Use one of: {', '.join(POSITIONS)}, or — for no answer"
    if len(rows) != len(set(rows)):
        dupes = sorted({n for n in rows if rows.count(n) > 1})
        return None, f"duplicated row(s) for {', '.join(dupes)}, so the denominator is ambiguous"
    if not rows:
        return None, "no table rows, so there is nobody to count"

    restarted = re.search(r"^\*\*Restarted:\*\*[^\S\n]*(.+)$", text, re.M)
    earlier = re.findall(r"^\*\*Round\s+(\d+)\*\*\s*[—-]\s*(.+)$", text, re.M)
    stated = re.search(r"^\*\*Entitled to vote:\*\*[^\S\n]*(\d+)", text, re.M)
    if stated and int(stated.group(1)) != len(rows):
        return None, f"**Entitled to vote:** says {stated.group(1)} members but the table has {len(rows)} rows"

    return {"procedure": key, "roll": len(rows), "counts": counts, "excluded": excluded,
            "restarted": restarted.group(1).strip() if restarted else None,
            "earlier": earlier}, None


def fmt(r, restarted=None, earlier=()):
    rnd = f", round {len(earlier) + 1}" if earlier else ""
    lines = [f"{r['procedure']} — {r['electorate']} entitled to vote{rnd}"]
    for n, line in earlier:
        lines.append(f"  round {n} — {line}")
    if restarted:
        lines.append(f"  restarted: {restarted}. Earlier positions were cleared; the full earlier round is in this file's git history.")
    c = r["counts"]
    lines.append("  " + " · ".join(f"{p} {c[p]}" for p in POSITIONS) + f" · not answered {r['nonResponse']}")

    if r.get("verdict") == "none":
        lines.append(f"  NO VERDICT — {r['note']}")
        for how, n in (r.get("readings") or {}).items():
            lines.append(f"    reading '{how}': would need {n}")
        lines.append("  Supplying the missing number would set a threshold, which §2 reserves to Layer 4.")
        return "\n".join(lines)

    if "quorumRequired" in r:
        lines.append(f"  quorum {r['responders']} of {r['electorate']} responded, needed "
                     f"{r['quorumRequired']} — {'met' if r['quorumMet'] else 'NOT MET'}")
    if r.get("required") is None:
        lines.append(f"  {r['note']}")
    else:
        over = "preference and objection only" if r["over"] in ("voting", "others-voting") else "all members"
        lines.append(f"  majority {c['preference']} of {r['denominator']} ({over}), needed {r['required']}")
    lines.append("  " + ("CARRIED" if r["carried"] else "DID NOT CARRY"))
    lines.append("  Advisory. §3 gives the outcome to a Record Keeper.")
    return "\n".join(lines)


def main(argv):
    here = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(here, "..", "..", "docs", "data.json")) as f:
        thresholds = json.load(f).get("thresholds", {})

    if not argv:
        print(__doc__.strip())
        return 2

    rc = 0
    for path in argv:
        print(f"\n{path}")
        try:
            text = open(path).read()
        except OSError as e:
            print(f"  cannot read: {e}")
            rc = 1
            continue
        parsed, err = parse(text)
        if err:
            print(f"  REFUSED — {err}")
            rc = 1
            continue
        print(fmt(tally(parsed["procedure"], parsed["roll"], parsed["counts"],
                        thresholds, parsed["excluded"]),
                  parsed.get("restarted"), parsed.get("earlier") or ()))
    return rc


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
