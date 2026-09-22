# 2026 Newspeak House Governance Laboratory Constitution

## Shared values

This Constitution is grounded in the following shared values:

**Participation.** We value different forms of participation. Building a system, facilitating a difficult conversation, cleaning up after an event, and showing up for a decision are all contributions to the Laboratory. Participation does not mean everyone contributing in the same way.

**Good intentions and caring communication.** We begin from the assumption that people are acting in good faith. When something feels difficult or harmful, we ask before we assume. We communicate honestly and with care, take responsibility for how we show up, apologise when needed, and make space for different ways of communicating.

**Transparency.** Decisions live in a durable, inspectable record, and the reasoning behind them is legible to every member. We default to showing our work, so no one has to rely on memory or trust alone to know how a decision was made.

These shared values guide interpretation but do not themselves create an enforceable duty or ground for sanction; an enforceable duty must be stated in a rule.

---

## 1. Rule of Recognition

### Membership

The Constitutional Record must contain `members.md`, the authoritative list of Laboratory members. A member may resign by written notice. Removal occurs only under Section 4. A membership change takes effect when entered in `members.md`.

### Validity

A rule is valid if and only if it was adopted through the procedure required for its layer, its exact adopted text appears in the Constitutional Record, and it has not expired, been repealed or been superseded. A repository edit or commit does not itself create authority.

### The Constitutional Record

The Constitutional Record is a private git repository in GitHub. Every decision required by this Constitution to enter the Record is recorded by commit. No member may lose a right under this Constitution because they cannot use GitHub or the Laboratory's communication channel. The Convener must provide a reasonably equivalent route and ensure anything submitted through it is communicated and recorded as the Constitution otherwise requires. The repository is readable by all members from the last day of the Convention.

The Interim Constitution shall only be accessible to Laboratory members and Faculty. The private Constitutional Record preserves the internal record of the procedures, decisions and amendments by which that published Constitution is created and changed. A public, up-to-date Constitution is made available to the Newspeak House community by the Record Keeper.

### Amendment records

All amendments to the Constitution and rules proposed by members shall be recorded with:

- The date and time (captured by the commit timestamp)
- Brief narrative description of how the amendment was made (e.g. by consent, by consensus, by majority / supermajority vote)
- Assumptions on which the amendment is based
- Status (live, experimental, or archived)
- Any explanatory notes from the discussion
- Any abstentions or objections, recorded in aggregate where the applicable procedure uses an anonymous or secret ballot

The repository's authoritative history may not be rewritten merely to erase an adopted decision. Errors are corrected by a new commit, and superseded material may be archived. Material may nevertheless be removed where required by law or where retaining it would disclose personal or confidential information or create a serious risk of harm. The removal and its reason must be recorded without reproducing the removed material. Not every decision needs the Record. Reversible actions within existing rules (Layer 0 — Operational) and short-lived coordination like scheduling (Layer 1 — Coordination) happen without a commit.

### Layers

Decisions that persist are organised by weight:

- `constitution.md` — this document (**Layer 4 — Constitutional**)
- `policies/{area}/policy.md` — governance systems for specific areas (**Layer 3 — Policy**)
- `policies/{area}/rule-*.md` — rules within a governed area (**Layer 2 — Ordinary**)
- `rules/rule-*.md` — standalone rules not yet part of a policy (**Layer 2 — Ordinary**)
- `exp-*` prefix on any file — a time-limited experiment at whatever layer it belongs to
- `disputes/dispute-*.md` — adjudication precedent

The layer determines the process. A proposal is classified according to its actual effect, not the label chosen by its proposer. Where there is a reasonable unresolved dispute between two layers, the more demanding applicable process applies. Reclassifying a decision type generally requires a Constitutional amendment.

Examples of **Ordinary Rules (Layer 2)**: day-to-day running of Newspeak House and the Laboratory, running of the library, running of communication channels, running of events, and day-to-day expenses.

Examples of **Constitutional Rules (Layer 4)**: shared values, the allocation of authority over the Treasury, constitutional controls on expenditure, and any matter or clause stipulated in this Constitution.

Budgets, custody arrangements, reimbursement procedures and routine expense handling may be governed by Policy or Ordinary Rules where consistent with those constitutional controls. These lists are illustrative, not exhaustive — the layer system determines classification.

GitHub branch protection enforces approval requirements per path. The College holds administrative access to shared platforms until the Laboratory assumes it by Policy resolution (Layer 3). When the Laboratory holds access, no individual member holds it alone.

### Computational tools

Any member may choose to run an AI agent, provided it is documented and communicated to the rest of the membership. It holds no membership, no vote, and no standing; its actions are the member's responsibility. AI Agents operating on behalf of members on Laboratory infrastructure (e.g. communications channels, GitHub) must be clearly identifiable as AI Agents of the respective member of the Laboratory. By Ordinary resolution, the Laboratory may also augment the Agent role with a computational system. If adopted, its operating instructions are recorded with the Ordinary resolution and are readable by any member. They do not amend this Constitution. The system runs on open-source models with no external logging. No individual member holds admin access alone. The system may not take positions the Laboratory has not adopted. Extra rules of engagement (boundaries, disclosure) will be discussed in a separate policy document.

### Thresholds

For any threshold stated as a fraction of all members, fractions round up to the next whole member. "All members" means all members entitled to vote when the vote opens.

---

## 2. Amendment

The laboratory uses consent-based decision-making by default. "Consent" is the agreement to proceed with a proposal in the absence of a reasoned objection — not that it is the preferred pathway or outcome for the member. Consent does not mean everyone is happy; it means no one is left unheard.

After a deliberation process, the positions a member of the laboratory can take are:

- **Preference:** The member supports and is in favor of this outcome.
- **Toleration:** The member may not be in favor of this outcome but has no reasoned objection.
- **Abstention:** The member does not take a position on this outcome.
- **Objection:** The member has an explicit reason to not favor or prevent this outcome on the basis of potential harm to the laboratory.

An objection is never left as a bare "no" — it is stated with its reason and offered alongside a suggested route forward, so that raising a concern moves the cohort closer to a decision rather than simply halting it. Toleration or abstention is an acceptable final position; however, in the interest of building consensus, members with "toleration" as a position are encouraged to state what would move their position to "preference" or "objection."

### Ordinary rules

**Ordinary Rules (Layering).** Ordinary Rules are classified by deliberation window. Three tiers apply:

**Tier A — 48 hours.** Any member may propose a rule by opening a GitHub issue. The proposal is visible in the governance channel on the chosen communication channel for 48 hours. Deliberation happens there and in the GitHub issue and pull request threads. If no member raises an objection within the window, it passes (lazy consensus). A single stated objection is sufficient to block lazy consensus and move the proposal to Tier B.

**Tier B — under 7 days.** Used when a Tier A proposal has drawn an objection, or when the proposer opts in directly at proposal time because the matter needs more scrutiny than 48 hours allows but does not warrant a full vote. Deliberation runs for a stated period of less than seven days. If no member raises an objection within that window, it passes (lazy consensus). A single stated objection at this tier moves the proposal to Tier C. Every objection, at either tier, must be stated with its reason and offered alongside a suggested route forward, per Section 2's consent framework.

**Tier C — 7 days or more.** Used when a proposal has drawn an objection at Tier B, or when the proposer opts in directly given the significance of the matter. Deliberation runs for at least seven days. Adoption requires a simple majority of those who vote, with a quorum of half of all members. For this purpose, "those who vote" means members choosing Preference or Objection. Toleration and Abstention count toward quorum but not toward the majority denominator.

A proposal may enter at any tier the proposer chooses; it can only move upward (toward longer deliberation), never downward, once objected to. Rules are filed in the relevant policy folder, or in `rules/` if no policy exists or the rule crosses multiple areas.

A material change to a proposal restarts any minimum deliberation period applicable to it. Corrections that do not change its meaning do not restart the period.

### Policy resolutions (Two-door rule)

A policy creates or redesigns governance for an area. Any member may propose one. At least one other member must endorse. The proposer conducts a preference-mapping step. Seven-day deliberation. Voting uses "prefer", "tolerate", or "object". "Prefer" counts as affirmative support, "tolerate" as abstention, and "object" as opposition. Adoption requires affirmative support from a majority of all members.

### Constitutional amendments

Any member may open a pull request against `constitution.md`. Two endorsing reviews start the 7-day deliberation clock. Adoption requires affirmative support from two-thirds of all members. Voting through "prefer", "tolerate", or "object". Non-response and abstention do not count towards the required affirmative threshold.

### Proposal templates

The first policy to be issued through this constitutional process will be defining the GitHub issue templates for each layer of possible proposals (4 — constitutional, 3 — policy, 2 — ordinary), including a checklist the proposer has to follow to submit a proposal, including but not limited to the reasoning behind the proposal's given layer classification. A proposal creating an enforceable duty must include a line beginning `Observed by:` stating how fulfilment or breach could reasonably become known. The requirement does not itself authorise surveillance or collection of information that would not otherwise reasonably become available.

### Experiments

Any proposal may be filed as an experiment. The proposal must state a hypothesis, success criteria, and an end date. At monthly review, expiring experiments are evaluated. Adoption or extension requires the procedure applicable to the experiment's layer; otherwise the experiment expires automatically.

### Emergency resolutions

Any member may propose with `[EMERGENCY]`. Requires a majority of those who vote within 12 hours, quorum of half. Expires after 7 days unless confirmed through the normal process applicable to its substance. An Emergency resolution may not amend this Constitution, impose a sanction, decide membership, determine an adjudication, authorise expenditure above £300, create an ongoing financial commitment, or decide a matter otherwise requiring Constitutional approval. The same Emergency resolution may not be renewed through the Emergency procedure.

### Monthly review

Each month, the Convener convenes a retrospective. The format to start with should be simple: what went well, what could be improved, and action items. This process itself can also be changed at these sessions.

---

## Communications Infrastructure

### 1. Purpose

Members of the laboratory shall have access to private communications that serve two distinct kinds of exchange:

a. **Informal communication** — social exchange, humor, and casual coordination among members; and

b. **Formal communication** — deliberation, voting, amendments, and other matters with binding or procedural consequences.

The constitution requires that these forms of communication be clearly distinguishable in practice, so that a member can tell at a glance whether a given exchange is informal chatter or part of a formal process.

### 2. Platform Requirements

Whatever specific tools are adopted, the laboratory's communications infrastructure must satisfy the following requirements:

a. **Topic segmentation.** Channels shall be organized by topic and purpose, at minimum distinguishing general or social discussion, deliberation, and voting, so that members can engage with only the communications relevant to them.

b. **Multi-channel communication.** Communication shall not be consolidated into a single undifferentiated stream. Multiple channels are required to preserve the distinctions described above.

c. **Access.** All infrastructure shall be accessible via both mobile and desktop, so that participation is not gated by device. Where possible, communication channels shall be integrable with other technical infrastructure used by the laboratory.

d. **Whole-of-laboratory access.** Whatever platforms are used, all members included on the laboratory's contact list shall be joined to, have access to, and have visibility into the relevant communications infrastructure.

### 3. Contact Directory

The constitution, or an appendix maintained alongside it, shall include a current list of contacts for the roles and individuals named elsewhere in this document, so that members can locate the relevant point of contact without having to search across multiple channels.

### 4. Tool Selection

The specific platforms used for messaging, video calls, code hosting, document hosting, or other forms of communication are implementation details to be determined and updated by the laboratory from time to time. Except where this Constitution expressly specifies a platform, such platforms are not fixed by this Constitution.

Any change in tooling must continue to satisfy the Platform Requirements in subsection 2 above.

### 5. Rule of Recognition

The communications platforms used by the laboratory may support both informal and formal communication, provided that the distinction between them remains clear.

Ordinary rules, policies, and resolutions may be discussed in any appropriate communication channel. Constitutional amendments must be discussed and recorded as required by Section 2 and the Rule of Recognition. A member using the reasonably equivalent route required by Section 1 is treated as participating through the designated formal process.

The location and form of a communication may indicate whether it forms part of a formal process, but validity depends on compliance with this Constitution rather than on the platform used.

---

## 3. Agent and Roles

**3.1 Nature of the Role.** The Agent is a clerical role responsible for the Laboratory's record-keeping and its internal and external communications. The Agent does not direct, decide for, or represent the Laboratory. Until accredited, the Laboratory's collective rights under the Charter are dormant.

**3.2 Selection.** The Agent and the Deputy Agent are each elected by separate anonymous ranked-choice vote for a two-month term. Re-election is permitted.

**3.3 Agent and Deputy.** The Agent holds primary responsibility for all duties under this section. The Deputy assumes those duties only when the Agent is unable to fulfil them or the role is vacant.

**3.4 No Executive Authority.** The Agent may not make binding decisions or allocate resources. Spokespersons and public points of contact may be created by Ordinary resolution.

**3.5 Enquiries and Petitions.** The Agent may give clarificatory responses to enquiries and to petitions from non-members, copying in Laboratory members. Substantive questions follow the process in Section 2.

**3.6 Records.** The Agent shall maintain:

- a record of recurring questions, so that patterns of concern remain visible;
- a tracker of open requests showing what was asked, what has been concluded, and what is outstanding.

**3.7 Transparency.** All decisions and conclusions are shared with the Laboratory and Newspeak House, unless anonymity has been clearly requested or there is a reasonable safeguarding concern.

**3.8 Concerns.** Any member may raise a concern with the Agent, privately or anonymously, through a channel the Agent maintains. Concerns pass to the Deputy only if the Agent is incapacitated. Anonymous reports are forwarded to the respondent without identifying the reporter. Neither the Agent nor the Deputy may sit on an adjudication panel for a concern they received.

**3.9 Recall.** Any member may call a no-confidence vote in the Agent or the Deputy, and a simple majority removes them. A new election is held within 7 days. Until then, the Deputy acts as Agent. If there is no Deputy, the outgoing officer continues as caretaker.

**3.10 Fallback.** If neither the Agent nor the Deputy can act, the Laboratory acts through written instructions signed by all members.

**3.11 Amendment.** Changes to this section follow the Constitutional process in Section 2.

### Other roles

The Convener, Treasurer, and Record Keepers are mandatory rotating roles defined in the constitution with 2-month term limits. Each role shall be held by two members, a primary and a deputy.

The **Convener** calls regular meetings specifying venue and time, conducts roll call, facilitates sessions and the agenda, manages the call for new motions including new requests from the agent. The Convener must follow any rules of order validly adopted by the Laboratory.

The **Treasurer** maintains an inspectable record of balance, income, spending, budgets, and reimbursements, and shares short financial summaries regularly. The Treasurer may execute or request payment only for expenditure already authorised under Section 2; executing a payment does not itself create spending authority. No member may authorise a payment to themselves; reimbursement to the Treasurer requires approval from another member.

Rotation schedules for the Convener, Treasurer, and Record Keepers are decided by Policy resolution (Layer 3). Additional agents for specific policy areas may be created through Ordinary resolution (Layer 2), with scoped responsibilities and a single outward communication channel.

The Laboratory shall not incur debt. Budgets should be agreed in advance for reasonably foreseeable activities, and expenditure outside or above an approved budget requires further approval under Section 2.

Laboratory funds shall be held securely and no individual shall have sole and uncontrolled access to substantial funds. The Laboratory shall adopt Ordinary Rules governing custody of funds, withdrawals and payments, delegation of money for authorised spending, spending limits, receipts, return of unused money, reimbursement and reconciliation of accounts.

Expenditure must not be divided into smaller transactions for the purpose of avoiding any financial approval threshold.

**Record Keepers:** the only members with merge access. They verify that the correct process was followed and merge changes to the Record. They must verify that the vote happened and that the correct outcome is recorded. They are custodians, not gatekeepers: they check the process, not whether they personally agree. At least two Record Keepers serve at a time. Either may merge a change after verifying that the required process occurred and that the recorded outcome is correct.

**Interim responsibility for unfilled roles.** Where a role or responsibility within the Laboratory's devolved functions is required but has not yet been assigned to another member or office, the Convener shall temporarily perform that role or responsibility until it is filled through the applicable constitutional or rule-making process. This does not authorise the Convener to exercise any function reserved to the College or otherwise outside the Laboratory's authority.

Role selection shall, where possible, strike a balance between members' preferences, skill development opportunities, and existing experience.

Additional Roles can be created as necessary using the Ordinary Rules Process and registered in a `roles.md` file in the repository and follow Role Policy as defined outside the constitution.

---

## 4. Adjudication

Conflict among members is difficult to avoid. The aims of adjudication are restorative and remedial, not punitive. When resolving conflicts, it is helpful to be solutions-oriented and to discuss in the context of values and needs.

Any member may raise a concern publicly in the governance channel or through the Agent under Section 3. The respondent receives notice and a chance to respond.

**Step 1 — Shuttle diplomacy.** The parties choose a mutually acceptable mediator. Confidential. Nobody is required to use direct confrontation if uncomfortable doing so.

**Step 2 — Mediation.** If Step 1 fails, a facilitator drawn at random from volunteers convenes a structured conversation for acknowledgment and de-escalation. Members volunteer as facilitators at the first monthly review. Where the alleged rule-breaking is sufficiently serious, it may skip directly to Step 3.

**Step 3 — Group remedy.** If unresolved, the matter is brought to the Laboratory. The respondent receives notice and at least seven days to respond. Laboratory members discuss the matter and propose remedies. The respondent is encouraged to propose their own remedy. The respondent does not vote on the remedy. A two-thirds majority of the other members who vote is required to adopt a remedy, provided at least half of all other members vote.

Available remedies range from acknowledgment and apology, through behavioural undertakings and temporary suspension from privileges or spaces controlled by the Laboratory, to removal from a role, except where this Constitution provides a separate removal procedure for that role. A sanction may not remove a member's right to vote, receive notice, answer an allegation, read the Constitutional Record, inspect the financial record, or raise a concern.

Removal from Laboratory membership may be proposed only through Step 3. It requires affirmative support from two-thirds of all members other than the respondent, after at least seven days' notice and an opportunity for the respondent to address the membership. The respondent does not vote. Removal affects Laboratory membership only and does not determine College membership, residence, or building access.

The decision is recorded in `disputes/`. Non-compliance may be raised as a new matter; the Laboratory may escalate remedies, including referral to the College.

Adjudication decisions apply to the parties in the dispute. They do not create general rules. When a dispute reveals a flawed rule, the Laboratory may recommend an amendment through the process applicable to that rule's layer.

Laboratory members are encouraged to resolve conflicts with consideration for proportionality — the redress sought should match the harm caused. Nothing in this Section prevents any person from contacting the College, emergency services or police, or from taking proportionate immediate action to protect someone from a serious risk of harm. Such action does not itself determine the adjudication.

### Safety, Wellbeing, and Culture

**1. Value Statement.** Newspeak House Cohort 2026 holds that safety and wellbeing are a shared responsibility and a precondition for the work we do together. We commit to a culture that is proactive rather than reactive, identifying risk early, de-escalating where possible, and treating comfort and safety in our shared space as a standing obligation rather than a response triggered only after harm occurs. This sits alongside, and does not replace, the responsibilities of Newspeak House, its faculty, and the law; how these levels relate is set out in the Safety & Wellbeing Policy.

**2. Levels of Responsibility.** This constitution governs conduct and adjudication internal to the cohort. It does not govern, and cannot substitute for, Newspeak House's own responsibilities, or any matter that is or may be criminal, which lies wholly outside this constitution's authority and must be referred externally (Policy §3.2).

**3. Access.** Reporting shall be simple, confidential, and available to any member without a formal process needing to be triggered first (Policy §3.5). Provision may be made for prioritised access to support and, where needed, for requesting temporary restrictions on physical access from the body responsible for building access.

**4. Core Safety Mechanisms.** A Safety & Wellbeing Policy adopted by Policy resolution may define and implement the following mechanisms. That Policy does not form part of this Constitution and may not alter rights, procedures or thresholds established by it:

a. Disclosure of conflicts of interest
b. Immediate safety, which takes priority over ordinary governance
c. Safety pause
d. Tap out
e. Confidential reporting, free from retaliation

**5. Adjudication.** A defined process maps consequences to actions, applied specifically and consistently. Where a matter reaches Step 3, adjudication follows Section 4. A Safety & Wellbeing Policy may add operational detail but may not create a separate adjudication procedure. A clear threshold shall exist for escalating to Newspeak House faculty; members are encouraged to escalate whenever in doubt. Where a dispute between lab members cannot be resolved internally, it proceeds under the Newspeak House Exclusion Policy (reference); the Laboratory may seek the exclusion of a non-member from its shared space where permitted by the College's rules.

**6. Conflict Resolution.** Informal conflict resolution — de-escalation, mediation, tapping out (§4d) — is the preferred first track, before formal adjudication, except where severity requires immediate escalation.

**7. Roles.** Defined roles for wellbeing and safety, including a Safety Lead, shall be established and documented, with scope set out in the Policy. These roles do not replace the Grievance Panel, nor Newspeak House's own formal responsibilities.

**8. Guests, Space, and External Resources.** Members are responsible for briefing their guests. Quiet hours and residential/non-residential distinctions are maintained per the Policy. A maintained list of external crisis resources shall be kept available to all members.

**9. Guiding Principles.** Not every uncomfortable interaction warrants formal process; the cohort distinguishes norm-level conduct from conduct that is patterned, repeated, or physical. Any process under this article can be weaponized. Outcomes may be revisited or disputed; members commit to guarding against rumour or the spread of sensitive case information. Trust is treated as a form of resilience. This policy is iterated on over time.

---

## 5. Expiry

This Constitution expires at 23:59 (UK time) on Monday, 30 November 2026 unless re-ratified or replaced. The final re-ratification or replacement proposal must have obtained any required endorsements and entered its seven-day deliberation period no later than Monday, 23 November 2026. If not re-ratified or replaced, this Constitution lapses and functions revert to the College. Re-ratification requires affirmative support from two-thirds of all members. The Laboratory may replace this constitution at any time through Section 2.

Laboratory members should keep a common record of proposed amendments as they arise, on which feedback and further refinements can be sought.

## 6. Expedited Constitutional amendments for a limited time after the Constitutional Convention

Recognising that Laboratory members wish to refine and amend the Constitution following the Constitutional Convention, any amendment to the Constitution shall, for the purposes of the amendment process, be treated as an Ordinary Rule for a period of two weeks immediately following the Constitution Convention. Such period of time shall end at 23:59 (UK time) on Sunday, 4 October 2026.

To ease the transition the Fellowship will appoint the following interim roles: Agent, Convener, Treasurer and Record Keeper. 

The interim selection process shall be as follows:

Candidates interested in the roles shall indicate their interest clearly on the Roles Election channel by posting with the following text:

I would like to fill role (Specify role) 

In the same message they are also entitled to add some supporting text to explain their candidacy. [Informally please keep this short]

Any Laboratory member who expresses interest by 22:00 on Tuesday the 22nd of September will be registered as a candidate.

Voting will then open using a  Borda count on Opavote:

Each voter may rank up to three candidates. A first preference receives three points, a second preference two points, and a third preference one point. Unranked candidates receive no points. The candidate receiving the highest total score is elected.

This vote will take place on open source 

Polls will close at 15:00 on the Wednesday 23nd of September with interim role holders elected according to the result. They will remain in place from that point until the period defined in 6. Expedited Constitutional amendments (Ending 23:59 (UK time) on Sunday, 4 October 2026.) The interim role holders will fill the roles with all the usual powers delegated to holders of those roles.

If an election under our usual processes occurs prior to the end of this timeline the powers will transfer from the interim role holders to the regular role holders. In the event that this has not occurred a two thirds majority of all Laboratory members may extend this interim period superseding any other usual constitutional rules.
