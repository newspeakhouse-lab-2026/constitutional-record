# Policy: Community AI (Emys)

**Layer:** 3 · **Status:** experimental
**Ends:** 23:59 UK time, Friday 29 January 2027 (`2027-01-29T23:59:00+00:00`) — a two-month experiment, **conditional on the Constitution continuing**: this Constitution expires on 30 November 2026 unless re-ratified or replaced (§5), and the Laboratory's authorisation under this policy ends with it if it is not. Renewable by a further proposal.

## 1. Purpose and scope

1.1 This policy authorises the Laboratory and its members to use **Emys**, a community AI run by @emergentvibe. It is not an authorisation for Emys to exist: Constitution §1 permits a member to run an AI agent on their own responsibility.

1.2 Emys does three things. It gives each member a private AI workspace. It maintains a searchable memory of the Laboratory's own shared channels. And it connects read-only to **the Laboratory's instruments** — the library application, the room booking system at `booking.newspeak.house`, the Laboratory's Google Calendar, its coordination spreadsheets, topic.forum, and this Constitutional Record. Section 7 governs that access.

1.3 Emys serves Laboratory members and the Faculty who have joined the Laboratory's Discord server, and is reached through that server and at the Laboratory's own URL, `2026.newspeak.house/emys`, authenticated against the same membership — the same Emys either way, with the same workspace, memory and limits. It is made available to no other community or organisation, and takes no input from anyone else.

1.4 In this policy, **the operator** means the member named in clause 3.1. **Members' content** means a member's workspace, their messages with Emys, their personal memory, and the shared community memory — anything a member gives Emys, and anything Emys takes from the Laboratory's channels or instruments.

## 2. Source of authority

2.1 Constitution §1 (*Computational tools*) permits any member to run an AI agent, provided it is documented and communicated to the rest of the membership, and makes its actions that member's responsibility. Emys is such an agent, and this policy is that documentation.

## 3. Who runs Emys

3.1 Emys is run and administered by **@emergentvibe** ("the operator"), alone, on infrastructure the operator rents and controls. The Laboratory does not hold, and does not by this policy assume, administrative access to Emys or to the machine on which it runs.

3.2 The operator may appoint members as **Emys administrators**. An Emys administrator holds Emys's own administrative commands — its configuration, and the channel exclusions required by clauses 6.3 and 6.4 — and holds no access to the machine or to the engine. An Emys administrator may discharge any duty of the operator that does not require the operator's own access.

3.3 Emys is identified in every interaction as an AI agent run by @emergentvibe, as Constitution §1 requires of an AI agent operating on Laboratory infrastructure. Emys takes no position the Laboratory has not adopted.

3.4 Emys's prompts and configuration are published in the Laboratory's Github Organisation and change by ordinary (Layer 2) procedure. Because the Laboratory holds no administrative access, a change it adopts is a direction to the operator, who undertakes under clause 10.1(e) to apply it and to run Emys as published. This clause reaches the prompts and configuration and not the engine, which section 4 governs.

## 4. The engine

4.1 The software that orchestrates Emys — the **engine** — is the operator's. It is built from third-party open-source components, which remain under their own licences, together with additions written by @emergentvibe. Those additions remain that member's, and nothing in this policy transfers them, or any right in them, to the Laboratory or to any member.

4.2 The Laboratory has the use of Emys as a service, for this experiment and on the terms in section 10. It is granted no licence in the engine, and the engine is not supplied to it, not deployed on its infrastructure, and not made readable to it or to any member. Reimbursement under section 11 pays for running a service: this policy is not a commission, an assignment, or work made for the Laboratory, and confers no interest in the engine.

4.3 The engine's source is not published. Clause 3.4's publication duty reaches Emys's prompts and configuration and not the engine.

4.4 The operator may use the engine for any other purpose, including commercially. Members' content does not travel with it: clause 10.1(c) and (d) apply.

## 5. The private workspace

5.1 A member's workspace, their direct messages with Emys, and their personal memory are private to that member and held in that member's own space.

5.2 In this experiment, nothing from them enters the shared community memory. It may do so only by a further proposal, and only where each contribution — including a member's own work shared with their own instance — is shown to, and approved by, that member before it is shared. Connecting members to one another on that basis is outside this experiment.

5.3 The shared community memory may be seeded with information a member has themselves published on the Laboratory's Discord or the constitutional-record repository. Such an entry names its source, and is removed from the shared memory at that member's request to the operator.

## 6. The shared community memory

6.1 Emys reads the server's shared Discord channels by default, and stores in a searchable community memory only factual community knowledge — events, schedules, logistics, resources, and decisions — with the source attributed.

6.2 It does not store opinions, arguments, complaints about people, third-party claims about anyone, or anyone's health, relationships, or personal circumstances.

6.3 Any member may ask the operator or an Emys administrator to exclude a channel from processing, and it shall be excluded; they may also ask for what was already taken from it to be removed from the shared memory, and it shall be removed. A personal-feed channel is read only if its owner opts in.

6.4 Messages already in the shared channels when Emys is deployed are processed under the same limits as live ones (clauses 6.1, 6.2 and 6.3).

## 7. Connected instruments

7.1 Emys connects to the Laboratory's instruments named in clause 1.2 with read access only, and writes to none.

7.2 Write access to any Laboratory instrument is outside this experiment, and may be proposed as an amendment.

7.3 Emys's access to any Laboratory channel or instrument is the Laboratory's to grant and the Laboratory's to withdraw via majority vote, at any time and without ending this policy.

## 8. Processing and compute

8.1 Members' content is stored and processed on a server rented and controlled by the operator, in the United Kingdom. Model inference runs on open-weights models hosted by the **East London GPU Coop**, which keeps no logs of members' content and uses it for no other purpose. Members' content is sent to no other external service, and to no commercial model provider. This holds from the day Emys is deployed. Emys is reached through the Laboratory's Discord server and its web interface (clause 1.3), and delivering a member's answer to them through either is not a disclosure within this clause — but what passes through Discord is held by Discord on its own terms, which this policy cannot alter.

8.2 A member's personal memory may be corrected or deleted on request.

8.3 Emys records, and the operator may use, figures for **how much and how often Emys is used** — counts of queries, of the distinct members who use it, and the like — because the experiment is judged on them (clause 9.2). This covers usage figures, not the content of what members ask or write.

8.4 Any analysis of an individual member's use beyond clause 8.3 is done only with that member's prior and freely given agreement, which may be withdrawn at any time.

8.5 The compute bought under clause 11.3 is capacity on the coop's hardware, and members may use it for their own work as well as through Emys. They do so on the operator's account and under the coop's own terms, and the Laboratory pays nothing beyond clause 11.3 for it. Access details will be shared with Laboratory Members upon request to the operator.

## 9. The experiment

9.1 **Hypothesis.** Given a private AI workspace and a searchable memory of the Laboratory's own channels, members find what is already there — and learn who knows and is working on what — at lower cost than they can today.

9.2 **Success — the renewal test.** The experiment has succeeded if, by its end: (a) members other than the operator and the Emys administrators have used Emys repeatedly and of their own accord; and (b) at least one such member has noticed and reported when Emys was unavailable or wrong. The questionnaire published with this policy and Emys's query counts evidence (a); the governance channel evidences (b).

9.3 **End and fallback.** The experiment ends at 23:59 on 29 January 2027, unless renewed by a further proposal. This Constitution expires on 30 November 2026 unless re-ratified or replaced (§5); if it is not, the Laboratory's authorisation under this policy ends with it, and any continuation is a matter for the successor. Emys reads only and adds only, so its ending removes nothing in use: the community memory is already in the Laboratory's own store (clause 10.6), and on expiry the operator acts under clause 10.7.

9.4 **Rollout.** Emys is rolled out in phases. Before a phase begins, the operator states in the governance channel what it covers.

9.5 **Upgrades.** Changing and extending Emys during the experiment is the operator's to do, and clause 1.2 describes what Emys does rather than limiting it. A substantial change — one that alters what Emys does with members' content — is put to the Laboratory before it ships, and the operator judges what is substantial. Two things are not available by this route at all: write access to a Laboratory instrument, which clause 7.2 puts outside the experiment, and private material entering the shared community memory, which clause 5.2 reserves to a further proposal.

## 10. The terms on which the operator runs Emys

10.1 The operator undertakes to the Laboratory that, in running Emys, they shall:

- **(a)** process members' content only as the functions in this policy require, and for no other purpose;
- **(b)** not read a member's workspace, their messages with Emys, or their personal memory, except to investigate a specific bug or incident that a member or an Emys administrator has reported;
- **(c)** not disclose, sell, licence, publish or transfer members' content to any person, and not use it to train, fine-tune or evaluate any model;
- **(d)** not use members' content in, or for the benefit of, any other deployment of Emys or of the engine, or of any other community, client or organisation;
- **(e)** run Emys as its published prompts and configuration describe, and apply a change the Laboratory adopts under clause 3.4;
- **(f)** hold members' content on infrastructure in the United Kingdom, and send it to no service outside that infrastructure other than the model host named in clause 8.1;
- **(g)** not grant any other person access to members' content; and
- **(h)** tell the Laboratory without delay of any unauthorised access to, or loss of, members' content.

10.2 These undertakings restrict what may be done with members' content. They do not restrict the operator's use of the engine itself (clause 4.4), or of anything that is not members' content, and they do not displace what clauses 8.3 and 8.4 permit.

10.3 The undertakings in clause 10.1 are given to the Laboratory and are enforceable by it. They continue after this policy ends, in respect of members' content processed while it was in force.

10.4 Any member may at any time require that their own content be removed from Emys, and the operator shall remove it. No resolution of the Laboratory is needed, and no reason need be given.

10.5 The Laboratory may end this arrangement at any time by Ordinary resolution, whereupon the operator shall stop processing members' content and act under clause 10.7. This adds to its powers under clause 7.3 and its access to the Discord server and Laboratory URL.

10.6 The shared community memory is exported, at least monthly, to a repository or store on the Laboratory's own account, in a form the Laboratory can read without the engine, with each entry's source named. That store, and not Emys, is the Laboratory's copy.

10.7 On expiry or termination the operator shall make a final export under clause 10.6, delete members' content, and confirm to the Laboratory in the governance channel that they have done so. The shared community memory is retained by the Laboratory in its own store unless the Laboratory directs its deletion.

## 11. Cost

11.1 Emys runs on a server rented by the operator on their own account, and its compute is bought by the operator from the East London GPU Coop. The Laboratory reimburses both: the operator claims the monthly charges on Open Collective with the providers' receipts, under the Financial Policy's approval rules.

11.2 **The server.** About **$25 a month** — 4 GB with monthly snapshots. The Laboratory authorises **up to $57.60 a month** for it, so that the server may be resized, and its backup arrangement changed, within the experiment and without a further proposal. The ceiling is in dollars because the provider bills in dollars, and is not breached by the exchange rate moving; roughly £19 and £44 in sterling, as an indication only.

11.3 **The compute.** Model inference on the East London GPU Coop's hardware (clause 8.1) costs **£50 a month**, which is both the expected cost and the ceiling for it. Any increase requires a further proposal.

11.4 Taken together, the expected cost is about **£69 a month** and the ceiling is £50 plus $57.60, about **£94**. This policy authorises no other payment to the operator.

11.5 This is a new recurring cost and an addition to the Laboratory's tech infrastructure within the meaning of the Financial Policy, notwithstanding that the server is rented on the operator's own account. 



**Observed by:** Checkable in the ordinary course: the published prompts and configuration, against which clause 3.4's directions and clause 8.1's model endpoint can be compared; Emys's self-identification, which any member sees in every interaction; a request under clause 6.3 or 10.4, observed by the member who made it; the community memory's presence in the Laboratory's own store under clause 10.6, whose absence any member can see; the confirmation clause 10.7 requires, posted in the governance channel; and the spending, on Open Collective and in the Treasurer's statement. Stopping Emys from accessing discord data needs no cooperation from the operator, who has no admin controls over the Discord server.

Not checkable, and the Laboratory should adopt this knowing it: the GPU Coop's no-logging undertaking is a third party's word; whether an upgrade is substantial enough to put to the Laboratory under clause 9.5 is the operator's judgement and no one else's; and the operator administers Emys alone — one member holds access to the machine and everything on it, and no other member can verify that clause 10.1 is kept. No drafting changes that. What the Laboratory holds instead is a remedy: clauses 10.4, 10.5 and 7.3. **The protection here is the remedy, not detection.**
