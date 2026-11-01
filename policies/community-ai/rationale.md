# Rationale — Community AI (Emys)

*This document is not operative. It explains the reasoning behind the Emys policy and creates no duty of its own. Where it and the policy differ, the policy governs.*

## In the proposer's words

I have been working on CommClaw, a community memory and coordination bot for communities. CommClaw was already successfully deployed at TREEWEEK, a yearly community gathering I co-host.

I propose we name our instance **"Emys"**, a symbolic reversal of "Syme", the politically orthodox linguist and colleague of Winston from Orwel's 1984. Syme's job was to edit the Newspeak dictionary. Emys' job is to serve us in our governance journey by creating a living memory of our community, fostering the communal evolution of language and nuance, and encouraging flourishing neological deliberation, liberating thought and incubating new ideas.

You may have encountered [Emys](https://en.wikipedia.org/wiki/Emys) in the wild, as it is also a species of [European turtle](https://en.wikipedia.org/wiki/European_pond_turtle) :)

Emys will read shared channels, build searchable community knowledge, connect to house systems (booking, library, calendar, topic.forum, the constitutional record), and give every member a personal AI agent that knows the house.

CommClaw is a fork of NanoClaw, an open-source personal agent framework. The engine is my project and will remain closed source for now while I'm pursuing commercial deployments. The prompts, configuration, and community knowledge that shape how CommClaw behaves in our community will be open, hosted in our constitutional record repo under our org, and changeable by our ordinary procedures.

### What it's like to use

**You're a Lab Member. It's Wednesday morning.** A DM arrives: *3 things today: the Financial Policy deliberation thread has 2 new responses. There's a session at 4pm on participatory budgeting (Lounge). And Nanda shared a paper in #share-with-us about collective intelligence that matches your interests.* You reply: *"Is the Committee Room free this afternoon?"* — Emys checks the booking system and tells you it's booked 12–2pm, free after that. You type `/recall data governance` and get back what the community memory knows — fragments from past conversations, links to constitutional record entries, who's been discussing it.

**You're Faculty. It's Thursday.** You get a daily digest — today's sessions, new shared links, a summary of channels you subscribe to. You DM: *"What books do we have about deliberative democracy?"* — Emys searches the library and lists 4 titles with availability.

## The problem

Members report, in their own words, that it is hard to find things across the Discord: people do not know which channel to post in, information is easy to miss ("I put this in the Discord and you never saw it"), and nobody is sure who in the cohort could help with a given project. The Laboratory's own Collaboration brief names the same cluster — information arriving from many sources, "more possible choices, tasks, and decisions than any member can attend to", and offers and needs that members "often… not know what others have or want". Emys is one answer to that brief: make what is already in the channels findable, and make who-knows-what legible.

## Why this design

The design follows the research on shared group memory and on why such systems succeed or fail.

- **Lead with who-knows-what, not the fact store.** A [transactive memory system](https://en.wikipedia.org/wiki/Transactive_memory) is knowledge of *who knows what*, and that — not a central store of facts — is where the value lies (Wegner 1987, *Transactive Memory*; Ren & Argote 2011). Emys's highest-leverage function is helping members find the right *person*; the searchable fact-memory is the supporting, weaker half.
- **The bot does the work, so the people who benefit are not the people who curate.** [Groupware](https://en.wikipedia.org/wiki/Collaborative_software) most often dies from Grudin's disparity — those who must maintain the content are not those who gain from it (Grudin 1994, *Groupware and Social Dynamics*, Communications of the ACM). Emys ingests automatically; no member is asked to curate, which removes the commonest failure.
- **Success is measured in queries, not posts.** Most members consume and few contribute — the [90–9–1 rule of participation inequality](https://www.nngroup.com/articles/participation-inequality/) (Nielsen 2006; Leonardi, Huysman & Steinfield 2013). Because Emys generates the content itself, consumption with near-zero contribution is the intended mode, not a failure.
- **Always attribute the source.** An external store can make a group remember content less well — the [Google effect](https://en.wikipedia.org/wiki/Google_effect) (Sparrow, Liu & Wegner, *Science*, 2011). Attributing every fact to its source turns that from "the group forgets" into "the group learns who to ask" — the adaptive side of the same effect.
- **Be the lowest-effort path, with strong scent.** People use the cheapest route to an answer even at some cost to quality ([principle of least effort](https://en.wikipedia.org/wiki/Principle_of_least_effort), Zipf 1949; [information foraging](https://en.wikipedia.org/wiki/Information_foraging), Pirolli & Card 1999). Emys must be cheaper than scrolling or asking a person, and must answer with a sourced snippet, not a bare link.
- **Seed it; value is interdependent.** The worth of a shared memory depends on others using it, so early value is low and can collapse below a threshold (Markus 1987, critical mass). The experiment begins with the memory pre-loaded and queries demonstrated, not empty.

## The honest limit

Lowering the cost of *finding* things changes findability; it does not, by itself, make people *participate*. Participation is a problem of stakes and incentives — a public-good information commons is under-provided absent selective incentives ([Olson 1965, *The Logic of Collective Action*](https://en.wikipedia.org/wiki/The_Logic_of_Collective_Action)). Emys can honestly promise *"easier to find what is already here, and who can help"*; it should not promise *"more engagement"*. If engagement is the goal, that is a separate lever — the member-contribution proposal, not this one.

## How we will judge it

Evaluation at this scale (≈14 people, four weeks) is genuinely hard (Grudin 1994, challenge 6), so the policy triangulates three signals rather than leaning on any one:

1. **Emys's own usage record** — how often, and by how many distinct members, it is queried. This is the hard behavioural data, and the thing to watch is *retrieval*, not corpus size: an extraction loop can look healthy from the writing side while nobody ever reads it.
2. **A before-and-after questionnaire** (see `questionnaire.md`) — a short, anonymous self-report run before Emys ships and again near the end, measuring findability, missed information, keeping up, and whether members know who-knows-what.
3. **The complaint signal** — whether anyone other than the administrators notices and complains when Emys breaks. Nobody complains about a thing they can walk away from; it is the cheapest and hardest-to-fake adoption test, and it is the renewal test's second limb.

It would **not** have worked if extraction runs well but queries are rare, come only from the administrators, or nobody notices when it is down. The questionnaire is a directional signal, not a significance test — at n≈14, report individual change, not p-values.

## The web workspace, and the Phase-2 vision

Phase 1 includes a **web workspace** because members will not do real work with an agent inside Discord — the workspace is where Emys earns its daily use, and daily use is what a shared memory needs to survive. The workspace also gives Emys its individual pay-off: a member comes to get their own work done, and the community value accrues as a by-product. This is the deliberate answer to Grudin's disparity.

The intended **Phase 2** builds on that. As members work with Emys, their private workspace accumulates a picture of what each person knows and is working on. From that, Emys could proactively match people — *"someone else is working on something very close to this; you should talk"* — a far richer directory than any self-reported profile, and the strongest form of the who-knows-what value above. Phase 2 is deliberately **not** authorised by this policy, for one reason: it would move private, work-derived information into shared memory, which inverts Phase 1's central privacy guarantee. The policy forecloses it (clause 4.3) and names the guardrail it must meet — each contribution shown to and approved by the member before it is shared, with the AI suggesting and the member deciding. The data stays private until a later proposal, with that consent mechanism built, turns the feature on.

## Answering the College's Collaboration Questions

- *How do members find out about each other's projects, research, and ideas?* — Through the searchable community memory now, and the who-knows-what directory that Phase 2 would add.
- *How do stakeholders get what they need without being overwhelmed?* — Subscriptions and a daily digest push only what a member asked for; everything else is pulled on demand.
- *How are offers and needs discovered, and how are people motivated to help?* — Emys makes who-knows-what legible (discovery). Motivation it does not solve, and does not claim to (see *The honest limit*).
- *How is the system created and maintained, and who does the ongoing tasks?* — Two named administrators; ingestion is automatic, so no member carries a maintenance burden.
- *If it is failing, how will we know, and what will we do?* — The renewal test above; failure ends the experiment at its expiry by default.
- *How will the Laboratory govern it once established?* — Its prompts and configuration are public and change by ordinary Layer 2 procedure; continuation requires a renewal proposal.
- The brief's event, booking, and task-assignment questions are **out of scope**; Emys reads the booking system but governs none of them.

## What we chose not to do

- **No member curation.** Requiring members to file knowledge would re-create Grudin's disparity; ingestion is automatic.
- **Facts, not opinions.** Opinions, complaints about people, and sensitive context are exactly the messy exceptions groupware handles badly (Grudin 1994), and the material most likely to chill participation if captured. Leaving them out is the privacy mitigation, and aligns with the Record's "no new surveillance" constraint.
- **Matchmaking-by-sharing is gated** (clause 4.3), not shipped, because it is a privacy escalation that needs its consent mechanism built first.
- **No deployment beyond members and Faculty on the server**, and no write access to any instrument, in Phase 1.
- **The engine stays closed, and that is permitted.** Constitution §1 requires a member's computational tool to be documented, communicated to the membership, and identified as AI — not open-sourced. (Open-weights binds only a system that augments the *Agent role*, which Emys is not.) Transparency here is carried by the open prompts and configuration and by the privacy declaration; a full disclosure of the engine's architecture is not required, and the proposer retains the engine as their own work.

## Anticipated objections, answered

- **"The Lab should only run fully open-source AI."** Emys's model is open-weights, it runs on the Lab's own compute with nothing sent to an outside company, and its prompts and configuration are open and Layer-2-changeable. Only the orchestration engine is closed, which §1 permits for a tool that does not augment the Agent role. The open-source value is largely met; what is withheld is one member's own code.
- **"I don't want an AI reading our channels."** Emys reads only shared channels — any channel is excludable on request — and stores only attributed facts, never opinions, complaints, or anything personal. Private messages and workspaces never enter the shared memory, and nothing leaves the Lab's own compute.
- **"I'd have to trust the admins not to snoop."** Partly: private messages and workspaces can never *enter* the shared memory (enforced), but two named administrators could technically read stored files, and undertake not to except to investigate a specific bug or incident. The Laboratory accepts this as a trust commitment in a good-faith house.
- **"The real problem is our Discord is disorganised."** Partly true, and a separate job — better channel names — that this proposal neither does nor replaces. But findability should not wait on a reorganisation nobody currently owns, and Emys covers far more: who-knows-what, the house systems, and a private workspace.

## Risks we are watching

- **Better search can worsen the "which channel?" problem** — if finding is easy, members may stop caring where they post, fragmenting the channels further. Search treats the symptom; channel discipline is a norms problem (better channel names), handled separately.
- **The privacy escalation in Phase 2** — the reason it is gated behind a further proposal and an explicit, per-item consent step.
- **Critical mass** — if the memory launches empty or is never demonstrated, early value is too low to catch; hence seeding.
- **Evaluation at n≈14** — small, self-selected, short; the triangulated signals are the honest response, and none is reported as statistically significant.
