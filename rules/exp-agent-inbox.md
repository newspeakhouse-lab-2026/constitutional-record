# Experiment: Agent inbox

**Layer:** 2
**Tier:** B
**Status:** experimental

**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`), with the Constitution. When it ends the system is switched off, and its tracker remains readable in the repository named in section 1.

## 1. What this adopts

Under Constitution Section 1 (Computational tools), the Laboratory augments the Agent role with a computational system, called here the inbox. It has four parts:

1. An email address at which requests to the Laboratory are received.
2. A categoriser, which uses an open-source language model named in section 5 to assign each request to a category and, from Stage 2, to choose an entry in the answer table.
3. A tracker: one database, readable by every member, recording where each request went and what became of it.
4. A bot in the Laboratory's Discord that delivers routed requests to role holders by direct message, and answers clarificatory questions from members.

Its code, its keyword rules, its rota and its answer table are held in a public repository of the organisation, `newspeakhouse-lab-2026/agent-inbox`, created on adoption. The operating instructions are recorded in sections 3 to 5 of this rule, as Section 1 requires, and are readable by any member. They do not amend the Constitution.

## 2. Hypothesis and success criteria

Hypothesis: most administrative queries repeat, and most are already answered by an adopted document. A model that reads a request, however it is worded, can categorise it and find that document more reliably than fixed keywords can. Pointing senders to the document, and routing the rest with a recorded destination, reduces the load on the Agent and makes the path of every request visible to every member, without the system deciding anything.

Judged at the November monthly review, from the tracker. The figures are provisional and are for the review to revise.

- Stage 1: every request has a category, a destination and a recorded outcome, and at least 80% reach the right holder without being forwarded on.
- Stage 2: at least 70% of requests that received a reply are not reopened or escalated, and no reply cites a document that was not adopted at the time.
- At all stages: no message that may raise a concern under Section 3.8 reaches any person or channel other than the Agent.

## 3. Operating instructions

### Stage 1: live on adoption

1. A request arrives at the email address. The categoriser assigns it to the Agent, the Treasurer, the Record Keepers, whoever is running Ration Club that week, the librarian, any other role the Laboratory assigns, or the whole Laboratory. If the model is unavailable or is not confident, the keyword rules in the repository in section 1 apply, and a request they cannot categorise goes to the Agent.
2. The system sends the request to the holder of that role by Discord direct message, with the sender's address and a short summary so that the holder can reply. The holder is the person named in `roles.md` or, for a role that is rotating or assigned by the Laboratory and is not in that file, the person named in the rota in the repository. Discord addresses are held privately and are not in the repository. A request that cannot be categorised goes to the Agent. A request that needs the whole Laboratory is posted as a summary to the governance channel, without the sender's identity unless the sender has agreed to it.
3. Every request is entered in the tracker with its category, destination, time and outcome. The tracker holds neither the message text nor the sender's address. It is readable by all members, and it is the tracker of open requests and the record of recurring questions that Section 3.6 requires of the Agent.
4. At least once a month the system lists the questions that recur and have no adopted document, so that gaps in documentation are visible to the Agent and the Convener.

### Stage 2: after the system is established

5. Stage 2 begins only when the Agent announces it in the governance channel, citing the Stage 1 tracker, and no member states an objection within 48 hours. If a member objects, Stage 2 does not begin unless a further Ordinary resolution adopts it.
6. For a request that matches an entry in the answer table, the system sends one reply containing a link to the adopted document, and nothing else. The model chooses the entry. The reply text is fixed, and the model writes no text to the sender. It does not paraphrase, interpret or apply a rule. The table maps a topic to a document in the Constitutional Record or to a published Laboratory page, and changes by pull request to the repository in section 1.
7. Every reply states how to reach a person. A reply to the reply, or the word "escalate", reopens the request and routes it as in Stage 1. The purpose of Stage 2 is to reduce administrative queries that adopted documents already answer, and a sender who is not satisfied is never left without a route to a person.
8. The system replies once to a sender on a topic, and never replies to automated mail.
9. Replies are entered in the tracker, which is how Laboratory members are copied in under Section 3.5.
10. Where no adopted document answers the request, the system routes it and does not reply.

### At every stage

11. The inbox is not the channel for concerns under Section 3.8. A message that appears to raise one, or a safeguarding matter, goes to the Agent only. It is not replied to automatically, is not posted to any shared channel, and never reveals an anonymity the sender has requested.
12. A request about a guest room is routed to the Agent and not answered, because Booking Policy Section 8 sends it through the 48-hour lazy consensus process.
13. The bot states in each message that it is a computational aid to the Agent. It is never presented as the Agent.

## 4. What the system may not do

1. Take a position the Laboratory has not adopted, or answer a question by its own judgement of what a rule means.
2. Decide a request, allocate a resource, or promise an outcome (Section 3.4).
3. Vote, endorse, object, or state a position in any process.
4. Send anything to a person in the Laboratory's name other than the replies and links in section 3.
5. Let the model choose anything but a category from section 3 and an entry in the answer table, or send the text of a message to any service other than the email provider, Discord and the server in section 5.

## 5. The model, custody and switching off

1. The categoriser uses [MODEL NAME AND VERSION, to be named before filing], published under [LICENCE, to be named before filing], which is an open-source licence. It runs on a server that is not a third-party service, so that no prompt or message is logged outside the Laboratory. Both the model and its licence are named in the repository, and changing either requires an amending Ordinary resolution.
2. The server is provided by a member, and is administered by at least two role holders, so that no individual holds admin access alone. The credentials for the address, the email service and the bot are held in the house password manager and are readable by at least two role holders. If the server is unavailable the system falls back to the keyword rules and the Agent, as item 1 of section 3 provides.
3. Messages pass through an email provider, Mailgun, which the Laboratory already uses under `rules/rule-ghost-publishing.md`. The provider keeps message data for the period its settings allow. The retention setting is to be the shortest the service offers. This is a known limit of the design, and members who consider it to be external logging should say so in deliberation.
4. No spend is authorised by this rule. Renting a GPU, or using a hosted model through a paid interface, would come back as its own proposal. The latter would also need the Laboratory to decide how the requirement of open-source models with no external logging in Constitution Section 1 (Computational tools) applies to it.
5. Any member may ask the Agent or a Record Keeper in the governance channel to switch the system off. The Agent or a Record Keeper switches it off within 24 hours of being asked. It is switched back on only by the Agent or a Record Keeper, after the member's concern is stated in the governance channel.

## 6. Relation to existing instruments

This rule supersedes nothing. Booking Policy Section 9 provides that the agent passes Event Space requests to the person named there. The system may carry that out as an aid, and the Agent remains responsible for it. Booking Policy Section 8 is unchanged and is applied by item 12 of section 3. Neither the Constitution nor `roles.md` is changed.

## 7. Amendment

Any part of this rule may be amended by Ordinary resolution. A change to the answer table, the keyword rules or the rota in the repository is made by pull request to that repository and takes effect on merge, provided it does not breach sections 3 and 4.

**Observed by:** the duties here are those in sections 3 (item 11) and 5 (item 5). Whether a sensitive message reached only the Agent is visible in the tracker, which records every destination. A request to switch the system off is made in the governance channel, so whether and when it was done is visible there and in the tracker. The model in use, its licence and where it runs are named in the repository.
