# Policy: Community AI (Emys)

**Layer:** 3 · **Status:** experimental
**Ends:** 23:59 UK time, Friday 29 January 2027 (`2027-01-29T23:59:00+00:00`) — a two-month experiment, **conditional on the Constitution continuing**: this Constitution expires on 30 November 2026 unless re-ratified or replaced (§5), and Emys's authorisation ends with it if it is not. Renewable by a further proposal.

## 1. Purpose and scope

1.1 This policy authorises **Emys**, a shared community-AI run for the Laboratory by the administrators named in clause 3.1, and governs what it may read, keep, and do. Emys gives each member a private AI workspace, maintains a searchable memory of the Laboratory's own shared channels, and connects read-only to the Laboratory's instruments. The software that runs Emys is not the Laboratory's; section 9 governs it.

1.2 Emys operates only within the Laboratory's own Discord server, and serves Laboratory members and the Faculty who have joined that server. It is not deployed to, and processes no data of, anyone else.

1.3 This policy establishes the Community AI area. It does not govern the Laboratory's other communication or collaboration arrangements, which remain open.

## 2. Source of authority

2.1 Charter §3 devolves to the Laboratory "the channels, systems, and tools of its own creation" and "the URL 2026.newspeak.house and whatever it serves". Emys is such a tool.

2.2 Charter §8 reserves to the College its legal, financial, and safety obligations, including data protection. This policy alters none of them and operates subject to them. A privacy declaration, published with this policy, states in plain terms what Emys reads, keeps, and discards, and how a member exercises the choices in this policy.

## 3. Administration

3.1 Emys has two administrators, @emergentvibe and @anchitsom. No individual administers it alone. The administrators operate Emys within this policy; if one ceases to serve, the Laboratory appoints another so that two always serve.

3.2 Emys's prompts and configuration are public in the Laboratory's repository and change by ordinary (Layer 2) procedure. This clause reaches the prompts and configuration, and not the engine, which section 9 governs. Emys is identified as AI in every interaction and takes no position the Laboratory has not adopted.

## 4. The private workspace

4.1 Emys gives each member a private workspace in which to work with the AI. A member's workspace, their direct messages with Emys, and their personal memory are private to that member and held in that member's own space.

4.2 In this experiment, nothing from a member's workspace, messages, or personal memory enters the shared community memory.

4.3 Contributing a member's own work or interests to the shared community memory — to connect members who have shared needs or expertise — is outside this experiment. It may be introduced only by a further proposal, and only where each contribution is shown to, and approved by, that member before it is shared.

## 5. The shared memory

5.1 Emys reads the server's shared channels by default, and stores in a searchable community memory only factual community knowledge — events, schedules, logistics, resources, and decisions — with the source attributed.

5.2 It does not store opinions, arguments, complaints about people, third-party claims about anyone, or anyone's health, relationships, or personal circumstances.

5.3 Any member may ask an administrator to exclude a channel from processing, and the administrator shall do so. A personal-feed channel is read only if its owner opts in.

## 6. Connected instruments

6.1 Emys connects to the Laboratory's instruments — the library application, room booking, Google Calendar, Google Sheets, topic.forum, and the Constitutional Record — with read access only. During this experiment it reads from them and writes to none.

6.2 Write access to any Laboratory instrument is outside this experiment, and may be proposed only afterwards and only if this experiment has succeeded.

## 7. Processing and compute

7.1 Emys processes only what the functions in this policy require, and for no other purpose.

7.2 Emys shall process and store members' content on the Laboratory's own infrastructure. Model inference runs on open-weights models hosted by the **East London GPU Coop**, which keeps no logs of members' content and uses it for no other purpose. Members' content is sent to no other external service, and to no commercial model provider. This holds from the day Emys is deployed.

7.3 A member's personal memory may be corrected or deleted on request. The administrators do not access a member's workspace, messages, or personal memory except to investigate a specific bug or incident.

7.4 Emys records, and the administrators may use, figures for **how much and how often Emys is used** — counts of queries and of the distinct members who use it, and similar aggregate usage figures — because the experiment is judged on them (clause 8.2). This covers usage figures, not the content of what members ask or write.

7.5 Any analysis of an individual member's use beyond clause 7.4 — to improve Emys or for any other purpose — is done only with that member's prior agreement, asked for by an administrator and freely given, and may be withdrawn at any time.

## 8. The experiment

8.1 **Hypothesis.** Given a private AI workspace and a searchable memory of the Laboratory's own channels, members find what is already there — and learn who knows and is working on what — at lower cost than they can today.

8.2 **Success — the renewal test.** The experiment has succeeded if, by its end: (a) members other than the administrators have used Emys repeatedly and of their own accord; and (b) at least one such member has noticed and reported when Emys was unavailable or wrong. A before-and-after questionnaire, published with this policy, and Emys's own record of how often it is queried, evidence (a); the governance channel evidences (b).

8.3 **End and fallback.** The experiment ends at 23:59 on 29 January 2027, unless renewed by a further proposal. This Constitution expires on 30 November 2026 unless re-ratified or replaced (§5); if it is not, Emys's authorisation under this policy ends with it, and any continuation is a matter for the successor. Emys reads only and adds only, so its ending removes nothing in use: on expiry Emys ceases to read and to answer; the shared community memory is retained in frozen form unless the Laboratory directs its deletion; and members' private workspaces and memory are deleted on request as in clause 4.

## 9. The engine

9.1 The software that orchestrates Emys — the **engine** — is built from third-party open-source components, which remain under their own licences, together with additions written by @emergentvibe. Those additions remain that member's, and nothing in this policy transfers them to the Laboratory or to any other member. This policy alters no third-party licence.

9.2 @emergentvibe's additions are licensed to the Laboratory to run Emys under this policy, for as long as this policy is in force and no longer. That licence confers no right to copy, modify, redistribute, or use those additions for any other purpose. Rights in the third-party components are unaffected and continue under their own terms. The licence terms for both accompany the source on the machine on which it runs.

9.3 The engine runs on the Laboratory's own compute (clause 7.2), so an administrator who operates that machine can read its source. That access exists to operate Emys and is not a grant under clause 9.2.

9.4 Clause 3.2 publishes Emys's prompts and configuration, and the privacy declaration states what Emys reads, keeps, and discards. Neither requires @emergentvibe's additions to be published, and the third-party components are publicly available under their own licences in any case.

## 10. Review

10.1 This policy is reviewed when renewal is proposed, and whenever the Constitution is re-ratified or replaced.

**Observed by:** Emys's prompts and configuration are public, and it is identified as AI in every interaction, so those duties are visible; channel exclusions and the privacy declaration are public. Which model endpoint Emys calls is visible in that public configuration, so clause 7.2's choice of provider can be checked. The licence in clause 9.2 accompanies the source on the machine, so any administrator can read the terms on which they hold it. Three things are commitments rather than observable facts: the administrators' undertaking in clause 7.3, the restraint in clause 9.2 on an administrator who can read the engine, and the East London GPU Coop's undertaking in clause 7.2 to keep no logs — which is a third party's word, and which the Laboratory cannot verify from outside.
