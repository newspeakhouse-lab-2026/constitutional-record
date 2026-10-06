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


MONTHS = ["january","february","march","april","may","june",
          "july","august","september","october","november","december"]
DAYS = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]


def human_disagrees(words, dt):
    """An Ends: line states the instant twice — in words and as a timestamp.
    Report every way the words and the timestamp fail to agree."""
    out = []
    if not words.strip():
        return out
    m = re.search(r"(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})", words)
    if m:
        day, month, year = int(m.group(1)), m.group(2).lower(), int(m.group(3))
        if month in MONTHS:
            said = (year, MONTHS.index(month) + 1, day)
            if said != (dt.year, dt.month, dt.day):
                out.append(f"the Ends: line reads {day} {m.group(2)} {year} in words but "
                           f"{dt.date().isoformat()} in its timestamp.")
    t = re.search(r"\b(\d{1,2}):(\d{2})\b", words)
    if t and (int(t.group(1)), int(t.group(2))) != (dt.hour, dt.minute):
        out.append(f"the Ends: line reads {t.group(1)}:{t.group(2)} in words but "
                   f"{dt.strftime('%H:%M')} in its timestamp.")
    w = re.search(r"\b(" + "|".join(DAYS) + r")\b", words, re.I)
    if w and not out:
        actual = DAYS[dt.weekday()]
        if w.group(1).lower() != actual:
            out.append(f"the Ends: line says {w.group(1)} but "
                       f"{dt.date().isoformat()} is a {actual.capitalize()}.")
    return out


def read(path):
    try:
        return open(path).read()
    except OSError:
        return None


def main():
    # A branch may legitimately not carry every file — a rule on its own branch
    # has no docs/ folder. Missing input is a reason to skip a check and say so,
    # never a reason to crash: a crash is a failure, and this must never fail.
    raw = read("docs/data.json")
    const = read("constitution.md")
    data = {}
    if raw is None:
        print("note: no docs/data.json here, so the quote and time checks are skipped")
    else:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as e:
            warn("docs/data.json", f"is not valid JSON ({e}), so the dashboard cannot read it")
    if const is None and raw is not None:
        print("note: no constitution.md here, so quotes cannot be checked against it")
    cn = norm(const) if const else None

    # 1 — quotes still present
    entries = [("procedures." + k, v) for k, v in data.get("procedures", {}).items()]
    entries += [("thresholds." + k, v) for k, v in data.get("thresholds", {}).items()]
    entries += [("fixed[%d]" % i, v) for i, v in enumerate(data.get("fixed", []))]
    if "rounding" in data:
        entries.append(("rounding", data["rounding"]))
    for name, e in entries if cn else []:
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
        if not f.get("at"):
            warn("docs/data.json", f'fixed[{i}] has no "at", so nothing can be counted down to')
            continue
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
        # Guidance left behind from a template is not part of the instrument.
        # Without this, a template's own worked example is read as a real expiry,
        # and its explanation of expiry is read as prose claiming one.
        text = re.sub(r"<!--.*?-->", "", text, flags=re.S)
        line = re.search(r"^\*\*Ends:\*\*[^\S\n]*(.+)$", text, re.M)
        declared = None
        if line:
            bt = re.search(r"`([^`]+)`", line.group(1))
            stamp = bt.group(1) if bt else (line.group(1).split() or [""])[0]
            # Only the newer form states the instant twice. With a bare timestamp
            # there are no words to disagree with it, and reading them out of the
            # timestamp itself finds "59:00" inside 23:59:00.
            words = line.group(1)[:bt.start()] if bt else ""
            declared = (stamp, words)
        prose = re.search(r"^#+\s*Ends\b", text, re.M) or re.search(r"\bEnds\b.*\b20\d\d\b", text)
        if declared:
            try:
                dt = datetime.fromisoformat(declared[0])
                if dt.utcoffset() is None:
                    warn(path, "the Ends: line has no UTC offset. Write +00:00 or +01:00 explicitly — "
                               "the UK is on BST from late March to late October, and a missing offset is how "
                               "a deadline ends up an hour out.")
                elif dt.utcoffset() != dt.replace(tzinfo=None).replace(tzinfo=UK).utcoffset():
                    warn(path, f"the Ends: line states offset {dt.utcoffset()} but Europe/London is "
                               f"{dt.replace(tzinfo=None).replace(tzinfo=UK).utcoffset()} on that date.")
                else:
                    # The line says the same thing twice, once for a person and
                    # once for the page. If the two disagree, one of them is
                    # wrong and nobody would notice from reading the rule.
                    for msg in human_disagrees(declared[1], dt):
                        warn(path, msg)
            except ValueError:
                warn(path, f'could not read "{declared[0]}" as a date. Expected, for example: '
                           f"**Ends:** 23:59 UK time, Monday 30 November 2026 "
                           f"(`2026-11-30T23:59:00+00:00`) — reason")
        elif prose:
            warn(path, "this instrument appears to expire but has no machine-readable Ends: line, "
                       "so its expiry will not appear on the dashboard. Add one, for example: "
                       "**Ends:** 23:59 UK time, Monday 30 November 2026 "
                       "(`2026-11-30T23:59:00+00:00`) — reason")

    # 4 — a vote's written result still matches its own rows
    #
    # Warns, never decides. Section 3 gives the outcome to a Record Keeper; this
    # only makes a disagreement visible, because the likeliest failure here is
    # two people counting Tier C differently in good faith, not an attack.
    import tally
    for path in sorted(glob.glob("votes/*.md")):
        text = read(path)
        if text is None:
            continue
        parsed, err = tally.parse(text)
        if err:
            warn(path, f"this vote cannot be recounted: {err}")
            continue
        got = tally.tally(parsed["procedure"], parsed["roll"], parsed["counts"],
                          data.get("thresholds", {}), parsed["excluded"])
        stated = re.search(r"^\*\*(Carried|Did not carry)\b", re.sub(r"<!--.*?-->", "", text, flags=re.S), re.M)
        if not stated:
            continue  # no result written yet: an open vote, not a defect
        said = stated.group(1) == "Carried"
        if got.get("verdict") == "none":
            warn(path, f'the result says "{stated.group(1)}", but {got["note"]} for this procedure, '
                       f"so no arithmetic can confirm it. Record who decided and on what reading.")
        elif got.get("carried") is not None and said != got["carried"]:
            warn(path, f'the result says "{stated.group(1)}" but recounting the rows gives '
                       f'"{"Carried" if got["carried"] else "Did not carry"}" — '
                       f"{got['counts']['preference']} preference of {got.get('denominator')}, "
                       f"needed {got.get('required')}. One of the two is wrong.")

    print(f"\n{len(warnings)} warning(s).")
    summary = __import__("os").environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a") as fh:
            fh.write("## Record check\n\n" + ("\n".join(f"- `{f}` — {m}" for f, m in warnings)
                     if warnings else "Everything the dashboard claims still matches the Record.\n"))
    return 0  # never fail a pull request


if __name__ == "__main__":
    sys.exit(main())
