#!/usr/bin/env python3
"""Run check-record.py's date logic against known-bad input.

check-record.py never fails a pull request, which is right: the tooling creates
no duty. The consequence is that nothing about it is self-announcing — a check
that silently stopped checking would look exactly like a Record with nothing
wrong. This exercises the comparisons directly, and a failure HERE is a real
failure.

The one it exists for: an instrument's Ends: line states its instant twice, in
words for a person and as a timestamp for the page. If the two disagree, one of
them is wrong and nobody would notice from reading the rule.
"""

import importlib.util
import os
import sys
from datetime import datetime
from zoneinfo import ZoneInfo

HERE = os.path.dirname(os.path.abspath(__file__))
# The filename has a hyphen, so it is not importable by name.
_spec = importlib.util.spec_from_file_location("check_record", os.path.join(HERE, "check-record.py"))
cr = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(cr)

UK = ZoneInfo("Europe/London")
results = []


def case(name, got, want, why):
    bad = [] if got == want else [f"got {got!r}, want {want!r}"]
    results.append((name, bad, why))
    print(f"  {'FAIL' if bad else 'ok  '}  {name}")
    for b in bad:
        print(f"          {b}")
    if bad:
        print(f"          why this case exists: {why}")


# ---- human_disagrees: the words against the timestamp ----------------------
#
# 30 November 2026 is a Monday, and the UK is on GMT by then.
NOV30 = datetime(2026, 11, 30, 23, 59, tzinfo=UK)

case("a line that agrees with itself raises nothing",
     cr.human_disagrees("23:59 UK time, Monday 30 November 2026 ", NOV30), [],
     "The ordinary case. If this warns, every correct instrument warns and the check is noise.")

case("a wrong weekday is caught",
     len(cr.human_disagrees("23:59 UK time, Tuesday 30 November 2026 ", NOV30)), 1,
     "A date copied from elsewhere keeps its old weekday; the weekday is the cheapest tell.")

case("a wrong date is caught",
     len(cr.human_disagrees("23:59 UK time, Monday 29 November 2026 ", NOV30)), 1,
     "The words and the timestamp naming different days is the defect this line exists to expose.")

case("a wrong time is caught",
     len(cr.human_disagrees("12:00 UK time, Monday 30 November 2026 ", NOV30)), 1,
     "An hour's drift decides whether a position submitted at 23:30 was in time.")

case("an empty words half raises nothing",
     cr.human_disagrees("", NOV30), [],
     "A bare timestamp has no words to disagree with it; absence is not a defect.")

# A wrong date and a wrong time together: both reported, not just the first.
case("two disagreements are both reported",
     len(cr.human_disagrees("12:00 UK time, Monday 29 November 2026 ", NOV30)), 2,
     "Reporting only the first sends someone back twice for one fix.")


# ---- date_in: reading a wall-clock instant out of a quoted sentence --------
case("a date with a time is read whole",
     cr.date_in("expires at 23:59 on 30 November 2026"), (2026, 11, 30, 23, 59),
     "docs/data.json's countdowns are checked against the sentence they were read from.")

case("a date with no time reads as a date",
     cr.date_in("on 2 November 2026"), (2026, 11, 2, None, None),
     "Not every quoted deadline states a time, and inventing midnight would be inventing a deadline.")

case("a sentence with no date reads as nothing",
     cr.date_in("whenever everyone is ready"), None,
     "A quote with no date must not be silently read as one.")

case("a month that is not a month reads as nothing",
     cr.date_in("30 Smarch 2026"), None,
     "A typo in a month name must refuse rather than resolve to something.")


# ---- the BST trap ---------------------------------------------------------
#
# The United Kingdom is on British Summer Time from late March to late October.
# Writing Z for a summer date puts the deadline an hour out. That has happened
# in this repository, which is why the offset check exists.
def offset_wrong(stamp):
    dt = datetime.fromisoformat(stamp)
    return dt.utcoffset() != dt.replace(tzinfo=None).replace(tzinfo=UK).utcoffset()


case("a summer date written +01:00 is accepted", offset_wrong("2026-10-04T23:59:00+01:00"), False,
     "4 October is BST; +01:00 is correct and must not warn.")
case("a summer date written Z is caught", offset_wrong("2026-10-04T23:59:00+00:00"), True,
     "THE REGRESSION. Z on a summer date is the hour-out bug the check was written for.")
case("a winter date written Z is accepted", offset_wrong("2026-11-30T23:59:00+00:00"), False,
     "30 November is GMT; Z is correct there, so the check must not be a blanket ban.")
case("a winter date written +01:00 is caught", offset_wrong("2026-11-30T23:59:00+01:00"), True,
     "The same error in the other direction, which a rule copied from an October one would make.")


failed = [n for n, bad, _ in results if bad]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
