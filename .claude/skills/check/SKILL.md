---
name: check
description: Pre-flight check of a draft instrument against everything the Constitution requires of a proposal, before it is filed. Use on any draft before opening an issue or pull request.
---

# Check

Run this on a draft before it is filed. It checks the requirements the Constitution already imposes — it adds none of its own.

Report findings as a list, each with the file and line, and say plainly whether the draft is fileable. Do not fix silently; show the member what is wrong.

## 1. Required content

- [ ] **Layer stated**, and the **reasoning** for it — the label alone fails (§2, Proposal templates)
- [ ] **`Observed by:`** present if the instrument creates any enforceable duty. Check it is honest: does it describe how breach would become known *in the ordinary course*, without authorising collection that would not otherwise reasonably become available?
- [ ] **Experiments** carry hypothesis, success criteria, end date, **and the default that operates on expiry**
- [ ] **Amendments** to the Constitution or to rules carry the §1 record: how it was made, assumptions, status, explanatory notes, abstentions or objections in aggregate

## 2. Filing

- [ ] Path matches the layer, per `CLAUDE.md` §3
- [ ] `exp-` prefix if time-limited
- [ ] Not creating `policies/{area}/` unless a Layer 3 proposal has passed for that area

## 3. Arithmetic and dates

```bash
date                                   # never reason about today
grep -c "^|" members.md                # confirm the member count yourself
```

- [ ] Thresholds computed from the **current** `members.md`, fractions **rounded up**
- [ ] Any arithmetic in the instrument actually satisfies the constraint it claims
- [ ] Dates computed, including the day of the week if the text names one

## 4. Conflicts

```bash
grep -ri "{keyword}" constitution.md policies/ rules/
gh pr list --state open
gh issue list --state open
git branch -a
gh repo list newspeakhouse-lab-2026        # private repos too — live systems live there
```

- [ ] Nothing in the Record contradicts this; anything superseded is **named**
- [ ] No pending branch, pull request or issue already does this
- [ ] No deployed system already implements something incompatible

## 5. Authority

- [ ] Claims no power the Charter reserves to the College (Charter §8: the Hall's programme, the Access Register, the fabric of the building, the College's legal and financial obligations, Fellowship admission, Faculty appointment, the Dean's office)
- [ ] Where the instrument depends on an operational fact about the house, that fact has been **confirmed with a person**, not inferred from a document

## 6. Hygiene

- [ ] **No personal data** — no contact details, no third-party phone numbers, nothing identifying about guests or non-members. Roles, not people
- [ ] **No reasoning inside the operative instrument** — it belongs in a companion `rationale.md` marked non-operative, or it becomes binding
- [ ] Cross-references resolve: every section cited exists
- [ ] Provisional numbers marked provisional, with what should inform them
- [ ] Plain declarative prose, present tense, British spelling, short numbered clauses

## 7. Readability

- [ ] Could a member who was not in the room operate this?
- [ ] Could the next cohort?
- [ ] Can a reader who disagrees find the clause they disagree with?
