#!/usr/bin/env python3
"""Check that what the dashboard says matches what the Record says.

Warnings only. This never fails a pull request: rules/rule-drafting-tools.md
says the tooling creates no duty, and an amendment is valid whatever our JSON
happens to contain. The job is to tell whoever is amending the Constitution,
at the moment they amend it, that something else needs updating too.

Three checks:
  1. Every sentence docs/data.json quotes still appears in constitution.md.
  2. Every instant agrees with the wall-clock time its own quote states.
  3. Every instrument that expires declares it in a form the page can read.
"""
import json, re, sys, glob
from datetime import datetime
from zoneinfo import ZoneInfo

UK = ZoneInfo("Europe/London")
MONTHS = "january february march april may june july august september october november december".split()
warnings = []


def warn(file, msg):
    warnings.append((file, msg))
    print(f"::warning file={file}::{msg}")


def norm(t):
    return re.sub(r"\s+", " ", t.replace("*", "")).strip()


def date_in(quote):
    """Pull a wall-clock date, and a time where one is given, out of a quoted sentence."""
    m = re.search(r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", quote)
    if not m or m.group(2).lower() not in MONTHS:
        return None
    day, month, year = int(m.group(1)), MONTHS.index(m.group(2).lower()) + 1, int(m.group(3))
    t = re.search(r"(\d{1,2}):(\d{2})", quote)
    return (year, month, day, int(t.group(1)), int(t.group(2))) if t else (year, month, day, None, None)


def main():
    data = json.load(open("docs/data.json"))
    const = open("constitution.md").read()
    cn = norm(const)

    # 1 — quotes still present
    entries = [("procedures." + k, v) for k, v in data.get("procedures", {}).items()]
    entries += [("fixed[%d]" % i, v) for i, v in enumerate(data.get("fixed", []))]
    for name, e in entries:
        if "quote" not in e:
            warn("docs/data.json", f"{name} has no quote, so nothing can verify it against the Constitution")
        elif norm(e["quote"]) not in cn:
            warn("docs/data.json",
                 f'{name} quotes {e.get("source","the Constitution")} as "{e["quote"][:70]}" '
                 f"but that sentence is no longer in constitution.md. "
                 f"The dashboard will keep showing the old value until this file is updated.")

    # 2 — the instant agrees with the wall-clock time its quote states
    for i, f in enumerate(data.get("fixed", [])):
        want = date_in(f.get("quote", ""))
        if not want:
            continue
        uk = datetime.fromisoformat(f["at"].replace("Z", "+00:00")).astimezone(UK)
        y, mo, d, hh, mm = want
        if (uk.year, uk.month, uk.day) != (y, mo, d) or (hh is not None and (uk.hour, uk.minute) != (hh, mm)):
            said = f"{d} {MONTHS[mo-1].title()} {y}" + (f" {hh:02d}:{mm:02d}" if hh is not None else "")
            warn("docs/data.json",
                 f'fixed[{i}] "{f["label"]}" stores {f["at"]}, which is '
                 f'{uk.strftime("%-d %B %Y %H:%M %Z")} in UK time — but its own quote says {said}. '
                 f"Check the UTC offset: the UK is on BST from late March to late October.")

    # 3 — instruments that expire should say so in a form the page can read
    for path in sorted(glob.glob("rules/*.md") + glob.glob("policies/*/*.md")):
        if path.endswith("rationale.md"):
            continue
        text = open(path).read()
        declared = re.search(r"^\*\*Ends:\*\*\s*(\S+)\s*[—-]\s*(.+)$", text, re.M)
        prose = re.search(r"^#+\s*Ends\b", text, re.M) or re.search(r"\bEnds\b.*\b20\d\d\b", text)
        if declared:
            try:
                dt = datetime.fromisoformat(declared.group(1))
                if dt.utcoffset() is None:
                    warn(path, "the Ends: line has no UTC offset. Write +00:00 or +01:00 explicitly — "
                               "the UK is on BST from late March to late October, and a missing offset is how "
                               "a deadline ends up an hour out.")
                elif dt.utcoffset() != dt.replace(tzinfo=None).replace(tzinfo=UK).utcoffset():
                    warn(path, f"the Ends: line states offset {dt.utcoffset()} but Europe/London is "
                               f"{dt.replace(tzinfo=None).replace(tzinfo=UK).utcoffset()} on that date.")
            except ValueError:
                warn(path, f'could not read "{declared.group(1)}" as a date. '
                           f"Expected: **Ends:** 2026-11-30T23:59:00+00:00 — reason")
        elif prose:
            warn(path, "this instrument appears to expire but has no machine-readable Ends: line, "
                       "so its expiry will not appear on the dashboard. Add one, for example: "
                       "**Ends:** 2026-11-30T23:59:00+00:00 — reason")

    print(f"\n{len(warnings)} warning(s).")
    summary = __import__("os").environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a") as fh:
            fh.write("## Record check\n\n" + ("\n".join(f"- `{f}` — {m}" for f, m in warnings)
                     if warnings else "Everything the dashboard claims still matches the Record.\n"))
    return 0  # never fail a pull request


if __name__ == "__main__":
    sys.exit(main())
