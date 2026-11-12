# Policy: Community AI (Emys)

**Layer:** 3 · **Status:** experimental
**Ends:** 23:59 UK time, Friday 29 January 2027 (`2027-01-29T23:59:00+00:00`) — a two-month experiment, **conditional on the Constitution continuing**: this Constitution expires on 30 November 2026 unless re-ratified or replaced (§5), and the Laboratory's authorisation under this policy ends with it if it is not. Renewable by a further proposal.

## 1. Purpose and scope

1.1 This policy authorises the Laboratory and its members to use **Emys**, a community AI run by @emergentvibe. It is not an authorisation for Emys to exist: Constitution §1 permits a member to run an AI agent on their own responsibility.

1.2 Emys does four things. It gives each member a private AI workspace. It maintains a searchable memory of the Laboratory's own shared channels. It sends a member a personalised digest of what is happening and what has been posted that concerns them, which that member may turn off. And it connects read-only to **the Laboratory's instruments** — the library application, the room booking system at `booking.newspeak.house`, the Laboratory's Google Calendar, its coordination spreadsheets, topic.forum, and this Constitutional Record. Section 7 governs that access.

1.3 Emys serves Laboratory members and the Faculty who have joined the Laboratory's Discord server, and is reached through that server and at the Laboratory's own URL, `2026.newspeak.house/emys`, authenticated against the same membership — the same Emys either way, with the same workspace, memory and limits. It is made available to no other community or organisation, and takes no input from anyone else.

1.4 In this policy, **the operator** means the member named in clause 3.1. **Members' content** means a member's workspace, their messages with Emys, their personal memory, and the shared community memory — anything a member gives Emys, and anything Emys takes from the Laboratory's channels or instruments.

## 2. Source of authority

2.1 Constitution §1 (*Computational tools*) permits any member to run an AI agent, provided it is documented and communicated to the rest of the membership, and makes its actions that member's responsibility. Emys is such an agent, and this policy is that documentation.

2.2 Charter §3 devolves to the Laboratory "the channels, systems, and tools of its own creation" and "the URL 2026.newspeak.house and whatever it serves". This policy is the Laboratory's grant of access to those channels, instruments and URL, on the terms it sets.

2.3 This policy is not a resolution by which the Laboratory assumes administrative access to a shared platform. It confers none on the Laboratory or on any member (clause 3.1).

## 3. Who runs Emys

3.1 Emys is run and administered by **@emergentvibe** ("the operator"), alone, on infrastructure the operator rents and controls. The Laboratory does not hold, and does not by this policy assume, administrative access to Emys or to the machine on which it runs. The web interface in clause 1.3 is served through the Laboratory's own server, so requests to it and answers from it pass through Laboratory infrastructure on the way.

3.2 The operator may appoint members as **Emys administrators**. An Emys administrator holds Emys's own administrative commands — its configuration, the channel inclusions under clause 6.1, and the exclusions decided under clause 6.3 — and holds no access to the machine or to the engine. An Emys administrator may discharge any duty of the operator that does not require the operator's own access.

3.3 Emys is identified in every interaction as an AI agent run by @emergentvibe, as Constitution §1 requires of an AI agent operating on Laboratory infrastructure. Emys takes no position the Laboratory has not adopted.

3.4 Emys's prompts and configuration are published in the Laboratory's `emys-config` repository — <https://github.com/newspeakhouse-lab-2026/emys-config>, readable by members of the Laboratory's GitHub organisation — and change by ordinary (Layer 2) procedure. Because the Laboratory holds no administrative access, a change it adopts is a direction to the operator, who undertakes under clause 10.1(e) to apply it and to run Emys as published. This clause reaches the prompts and configuration and not the engine, which section 4 governs.

## 4. The engine

4.1 The software that orchestrates Emys — the **engine** — is the operator's. It is built from third-party open-source components, which remain under their own licences, together with additions written by @emergentvibe. Those additions remain that member's, and nothing in this policy transfers them, or any right in them, to the Laboratory or to any member.

4.2 The Laboratory has the use of Emys as a service, for this experiment and on the terms in section 10. It is granted no licence in the engine, and the engine is not supplied to it, not deployed on its infrastructure, and not made readable to it or to any member. Reimbursement under section 11 pays for running a service: this policy is not a commission, an assignment, or work made for the Laboratory, and confers no interest in the engine.

4.3 The engine's source is not published. Clause 3.4's publication duty reaches Emys's prompts and configuration and not the engine.

4.4 The operator may use the engine for any other purpose, including commercially. Members' content does not travel with it: clause 10.1(c) and (d) apply.

## 5. The private workspace

5.1 A member's workspace, their direct messages with Emys, and their personal memory are private to that member and held in that member's own space.

5.2 In this experiment, nothing from them enters the shared community memory (section 6). It may do so only by a further proposal, and only where each contribution — including a member's own work shared with their own instance — is shown to, and approved by, that member before it is shared. Connecting members to one another on that basis is outside this experiment.

## 6. The shared community memory

6.1 Emys reads the server's shared Discord channels by default, and stores in a searchable community memory only factual community knowledge — events, schedules, logistics, resources, and decisions — with the source attributed. A channel created after Emys is deployed is not read until an Emys administrator includes it.

6.2 It does not store opinions, arguments, complaints about people, third-party claims about anyone, or anyone's health, relationships, or personal circumstances.

6.3 A channel is excluded from processing by Ordinary resolution, which any member may propose; on exclusion, whatever was already taken from that channel is removed from the shared memory. A personal-feed channel is read only if its owner opts in. A member who wants their own material out needs no resolution — clause 10.4 is theirs alone.

6.4 Messages already in the shared channels when Emys is deployed are processed under the same limits as live ones (clauses 6.1, 6.2 and 6.3).

6.5 Emys may store in the community memory what it reads from the instruments in clause 1.2, under the same limits as clauses 6.1 and 6.2.

6.6 The shared community memory may be seeded from the Laboratory's and the programme's own documents: this Constitutional Record, the Newspeak House charter and programme document, and the Laboratory's newsletters.

6.7 It may also be seeded with the topic.forum profiles of members, and of Faculty who have joined the Laboratory's Discord server, which those people wrote and published themselves. Such an entry names its source, and is removed from the shared memory at that person's request to the operator.

## 7. Connected instruments

7.1 Emys connects to the Laboratory's instruments named in clause 1.2 with read access only, and writes to none.

7.2 Write access to any Laboratory instrument is outside this experiment, and may be proposed as an amendment to this policy (Layer 3).

7.3 Emys's access to any Laboratory channel or instrument is the Laboratory's to grant and the Laboratory's to withdraw by Ordinary resolution, at any time and without ending this policy.

## 8. Processing and compute

8.1 Members' content is stored and processed on a server rented and controlled by the operator, in the United Kingdom. Model inference runs on open-weights models hosted by the **East London GPU Coop**, which keeps no logs of members' content and uses it for no other purpose. Members' content is sent to no other external service, and to no commercial model provider. This holds from the day Emys is deployed. Emys is reached through the Laboratory's Discord server and its web interface (clause 1.3), and delivering a member's answer to them through either is not a disclosure within this clause — but what passes through Discord is held by Discord on its own terms, which this policy cannot alter.

8.2 A member may correct or delete their own personal memory directly through Emys. Material in the shared community memory is corrected or removed on request to the operator.

8.3 Emys records, and the operator may use, figures for **how much and how often Emys is used** — counts of queries, of the distinct members who use it, and the like — because the experiment is judged on them (clause 9.2). This covers usage figures, not the content of what members ask or write.

8.4 Any analysis of an individual member's use beyond clause 8.3 is done only with that member's prior and freely given agreement, which may be withdrawn at any time.

8.5 The compute bought under clause 11.3 is capacity on the coop's hardware, and members may use it for their own work as well as through Emys. They do so on the operator's account and under the coop's own terms, and the Laboratory pays nothing beyond clause 11.3 for it. Access details will be shared with Laboratory Members upon request to the operator.

## 9. The experiment

9.1 **Hypothesis.** Given a private AI workspace and a searchable memory of the Laboratory's own channels, members find three things at lower cost than they can today: what is already there, who knows and is working on what, and what is happening when.

9.2 **Success — the renewal test.** The experiment has succeeded if, by its end: (a) members other than the operator and the Emys administrators have used Emys repeatedly and of their own accord; and (b) at least one such member has used Emys in making or informing something the Laboratory did — a decision, a post, a booking, a piece of work — and said so. The questionnaire published with this policy and Emys's query counts evidence (a); the Laboratory's own channels evidence (b).

9.3 **End and fallback.** The experiment ends at 23:59 on 29 January 2027, unless renewed by a further proposal. This Constitution expires on 30 November 2026 unless re-ratified or replaced (§5); if it is not, the Laboratory's authorisation under this policy ends with it, and any continuation is a matter for the successor. Emys changes nothing it reads and deletes nothing; it only adds. So ending it takes away nothing the Laboratory was using: the community memory is already in the Laboratory's own store (clause 10.6), and on expiry the operator acts under clause 10.7.

9.4 **Rollout.** Emys is rolled out in phases. Before a phase begins, the operator states in the announcements channel what it covers.

9.5 **Upgrades.** Changing and extending Emys during the experiment is the operator's to do, and clause 1.2 describes what Emys does rather than limiting it. A substantial change — one that alters what Emys does with members' content — is stated in the announcements channel before it ships, and ships unless a member objects within 48 hours; an objection sends it to the Laboratory as an Ordinary resolution. The operator judges what is substantial. Two things are not available by this route at all: write access to a Laboratory instrument, which clause 7.2 puts outside the experiment, and private material entering the shared community memory, which clause 5.2 reserves to a further proposal.

## 10. The terms on which the operator runs Emys

10.1 The operator undertakes to the Laboratory that, in running Emys, they shall:

- **(a)** process members' content only as the functions in this policy require, and for no other purpose;
- **(b)** not read a member's workspace, their messages with Emys, or their personal memory, except to investigate a specific bug or incident that a member or an Emys administrator has reported;
- **(c)** not disclose, sell, licence, publish or transfer members' content to any person, and not use it to train, fine-tune or evaluate any model;
- **(d)** not copy, move, or make members' content available to any other deployment of Emys or of the engine, or to any other community, client or organisation — diagnosing a fault and improving the engine from what is learned is not restricted by this paragraph, provided members' content itself does not leave this deployment;
- **(e)** run Emys as its published prompts and configuration describe, and apply a change the Laboratory adopts under clause 3.4;
- **(f)** hold members' content on infrastructure in the United Kingdom, and send it to no service outside that infrastructure other than the model host named in clause 8.1;
- **(g)** not grant any other person access to members' content; and
- **(h)** tell the Laboratory without delay of any unauthorised access to, or loss of, members' content.

10.2 These undertakings restrict what may be done with members' content. They do not restrict the operator's use of the engine itself (clause 4.4), or of anything that is not members' content, and they do not displace what clauses 8.3 and 8.4 permit.

10.3 The undertakings in clause 10.1 are promises to the Laboratory, and the Laboratory is the one who may enforce them. They do not lapse when this policy ends: anything the operator still holds that was processed under it stays bound by them.

10.4 Any member may at any time require that their own content, in whole or in part, be removed from Emys, and the operator shall remove it. No resolution of the Laboratory is needed, and no reason need be given.

10.5 The Laboratory may end this arrangement at any time by Ordinary resolution, whereupon the operator shall stop processing members' content and act under clause 10.7. This adds to its powers under clause 7.3 and its access to the Discord server and Laboratory URL.

10.6 The shared community memory is exported, at least monthly, to the Laboratory's shared Google Drive, in a form the Laboratory can read without the engine, with each entry's source named. That store, and not Emys, is the Laboratory's copy.

10.7 On expiry or termination the operator shall make a final export under clause 10.6, delete members' content, and confirm to the Laboratory in the governance channel that they have done so. The shared community memory is retained by the Laboratory in its own store unless the Laboratory directs its deletion.

## 11. Cost

11.1 Emys runs on a server rented by the operator on their own account, and its compute is bought by the operator from the East London GPU Coop. The Laboratory reimburses both: the operator claims the monthly charges on Open Collective with the providers' receipts, under the Financial Policy's approval rules.

11.2 **The server.** About **$25 a month** — a 4 GB droplet at \$24, plus one monthly snapshot at about \$1. The Laboratory authorises **up to $50 a month** for it, which covers the 8 GB tier at $48 with one snapshot, so that the server may be resized if needed within the experiment and without a further proposal. The ceiling is in dollars because the provider bills in dollars, and is not breached by the exchange rate moving; roughly £19 and £38 in sterling, as an indication only.

11.3 **The compute.** Model inference on the East London GPU Coop's hardware (clause 8.1) costs **£50 a month**, which is both the expected cost and the ceiling for it. Any increase requires a further proposal.

11.4 The Laboratory authorises no more than **£50 a month** for the compute and **$50 a month** for the server, and no other payment to the operator. The expected cost is £50 plus about $25.

**Observed by:** Checkable in the ordinary course: the published prompts and configuration, against which clause 3.4's directions and clause 8.1's model endpoint can be compared; Emys's self-identification, which any member sees in every interaction; a request under clause 8.2 or 10.4, observed by the member who made it; the community memory's presence in the Laboratory's own store under clause 10.6, whose absence any member can see; the confirmation clause 10.7 requires, posted in the governance channel; and the spending, on Open Collective and in the Treasurer's statement. Stopping Emys needs no cooperation from the operator: its access to Discord can be cut by that server's administrators, who do not include him, and the web interface can be cut by repointing the Laboratory's own URL.

Not checkable, and the Laboratory should adopt this knowing it: the GPU Coop's no-logging undertaking is a third party's word; whether an upgrade is substantial enough to put to the Laboratory under clause 9.5 is the operator's judgement and no one else's; and the operator administers Emys alone — one member holds access to the machine and everything on it, and no other member can verify that clause 10.1 is kept. One qualification on that last point, in the other direction: because the web interface is served through the Laboratory's own server (clause 3.1), requests to it pass through infrastructure the operator does not solely control, and those who administer that server could see them. No drafting changes any of this. What the Laboratory holds instead is a remedy: clauses 10.4, 10.5 and 7.3. **The protection here is the remedy, not detection.**
