---
name: propose
description: Take a member from "I think we should..." to a filed proposal — understanding it, classifying it, checking conflicts, drafting, and filing. Use whenever someone wants to change something.
---

# Propose

The arc from an idea to a filed proposal. The other skills are stages inside it.

**Do not start at the end.** The commonest failure is drafting a document for someone who arrived with a feeling. Work out what they want before writing anything.

## 1. Understand it first

Read what they brought you, and pick your register (`CLAUDE.md` §2). If it is a complaint rather than a proposal, stay in questions until there is something to classify.

Three things you need before anything else:

- **What goes wrong today, concretely.** Not "the kitchen is a problem" — what happens, how often, to whom.
- **What they want to be true instead.**
- **Whether it needs a rule at all.** Many things want a norm, a rota, a conversation, or a sign on a door. Say so if you think so; the Laboratory is better governed by five rules everyone knows than fifty nobody has read.

## 2. Check whether it already exists

Before classifying. All four places (`CLAUDE.md` §3):

```bash
grep -ri "{keyword}" constitution.md policies/ rules/
gh pr list --state open ; gh issue list --state open ; git branch -a
gh repo list newspeakhouse-lab-2026        # private repos run live systems
```

If someone has already built or proposed this, say so immediately and ask whether they want to amend it, support it, or propose something different. Finding out through a pull request is how colleagues get annoyed.

## 3. Classify

Use the `classify` skill. Produce the layer **and the reasoning**, which the proposal must carry. If it is Layer 3 or 4, tell them what it will cost: endorsements, seven days, and 8 or 10 affirmative votes out of 14. People often reshape a proposal once they see the price.

## 4. Draft

Use `draft-policy` for a policy or anything substantial. For a short rule, draft directly — but still name which parts are forced by the Charter and which are the member's choice, because that is what they will have to defend.

Reasoning goes in a companion `rationale.md`, never in the instrument.

## 5. Check

Use the `check` skill. Report what is missing; do not quietly fix it.

## 6. File

```bash
git checkout -b {short-name}
# write the file at the path its layer requires
git add . && git commit -m "Propose {layer}: {title}"
git push -u origin {short-name}
gh pr create                 # the template asks for everything required
```

An issue first is optional, and worth it only when the text does not exist yet. The pull request is the proposal of record.

Fill the template honestly. If you prepared it, say so in the pull request and name the member responsible — Section 1 requires an agent to be identifiable.

## 7. Tell them the last step is theirs

**The deliberation window runs in the governance channel, not on GitHub.** Nothing you have done starts a clock. The member must post it to the channel with a link and the tier.

Then stop. You do not endorse, object, state a position, or vote. Draft any of those if asked, and hand them over to send.

## Afterwards

Use `deliberation` to report where it has got to, what threshold applies, and whether it is ready for a Record Keeper. Never conclude that a proposal has passed: you cannot see the channel, and absence of objection on a pull request is not proof of lazy consensus.
