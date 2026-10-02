---
name: classify
description: Determine which layer an instrument belongs to and write the classification reasoning a proposal must carry. Use before drafting, and whenever a proposal's layer is disputed.
---

# Classify

A proposal is classified by its **actual effect**, never by the label its proposer chooses or by which process would be convenient. Where two layers are reasonably arguable, **the more demanding process applies**. Reclassifying a decision *type* generally needs a Constitutional amendment.

## Decision order

Work down. The first match wins.

1. **Does it change `constitution.md`, or alter rights, thresholds, procedures, or the allocation of authority?** → **Layer 4.** Two endorsing reviews, 7 days, 10 affirmative of 14.
2. **Does it create or redesign governance for an area?** Creates an office or role, builds a mechanism, establishes an ongoing financial flow, or sets up a standing decision body. → **Layer 3.** One endorsement, preference mapping, 7 days, 8 affirmative of 14.
3. **Does it change who holds admin access to shared platforms?** → **Layer 3.**
4. **Does it set or change a specific rule, or a parameter, within an existing frame?** → **Layer 2.** Tier A, B or C.
5. **Is it short-lived coordination — scheduling, logistics?** → **Layer 1.** Post in the governance channel. No commit.
6. **Is it a reversible action within existing rules?** → **Layer 0.** Just do it. No commit.

An experiment sits at whatever layer it would otherwise occupy and takes that layer's process. The `exp-` prefix changes the expiry, not the threshold.

## The tests that catch misclassification

Ask these before settling on Layer 2:

- **Does it name a new role or office?** Creating one is Layer 3, even if the role sounds administrative.
- **Does it create a recurring meeting that decides things?** That is a standing decision body. Layer 3.
- **Does money move in or out on an ongoing basis?** Layer 3.
- **Does it bind future decisions**, or only this one?
- **Would it survive the thing that prompted it?** A durable frame is Layer 3; a number inside that frame is Layer 2.
- **Does it rely on authority the Charter reserves to the College?** Then it is void at any layer. Check §8 before classification.

## Splitting, which is usually the right answer

Most substantial proposals are two instruments, not one:

- the **durable frame** → Layer 3 `policies/{area}/policy.md`
- the **tunable numbers** → Layer 2 `policies/{area}/rule-*.md` in the same folder

Parameters then change in 48 hours instead of needing another policy resolution, and the policy stops being hostage to its own arithmetic. State in the policy which invariants may *only* change by amending the policy.

## Writing the reasoning

Every proposal must carry the reasoning for its layer, not just the label. A reasoning that passes scrutiny does three things:

1. Names the effect that determines the layer — "this creates the office of Innkeeper", not "this is administrative".
2. Says why the **next layer up** is not required.
3. Says why the next layer **down** is insufficient, if anyone might argue for it.

Weak: "This is Layer 2 because it is a day-to-day matter."
Strong: "Layer 2. It sets credit amounts and prices within the frame established by the spaces policy, creates no role and binds no future decision. Not Layer 3: it establishes no mechanism and the policy it operates under is already adopted. Parameters are expected to change at each review, which is why they are filed separately from the policy."

## Migration

When a new policy is adopted for an area, check whether standalone rules in `rules/` now belong inside it:

```bash
ls rules/
grep -ril "{area keyword}" rules/
```

A rule that only concerns the new policy's area should migrate to `policies/{area}/rule-*.md`. A rule crossing several areas stays in `rules/`. Migration is a Layer 2 change and should name what moved and why.
