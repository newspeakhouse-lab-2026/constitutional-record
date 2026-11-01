# Emys — Community AI for Newspeak House

**Layer:** 2 · **Status:** experimental
**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) — with the Constitution, unless renewed.

I have been working on CommClaw, a community memory and coordination bot for communities. CommClaw was already successfully deployed at TREEWEEK, a yearly community gathering I co-host.

I propose we name our instance **"Emys"**, a symbolic reversal of "Syme", the politically orthodox linguist and colleague of Winston from Orwel's 1984. Syme's job was to edit the Newspeak dictionary. Emys' job is to serve us in our governance journey by creating a living memory of our community, fostering the communal evolution of language and nuance, and encouraging flourishing neological deliberation, liberating thought and incubating new ideas.

*[image]*

You may have encountered [Emys](https://en.wikipedia.org/wiki/Emys) in the wild, as it is also a species of [European turtle](https://en.wikipedia.org/wiki/European_pond_turtle) :)

Emys will read shared channels, build searchable community knowledge, connect to house systems (booking, library, calendar, topic.forum, the constitutional record), and give every member a personal AI agent that knows the house.

CommClaw is a fork of NanoClaw, an open-source personal agent framework. The engine is my project and will remain closed source for now while I'm pursuing commercial deployments. To remain transparent, I will submit an accurate model of the architecture as part of this proposal. The prompts, configuration, and community knowledge that shape how CommClaw behaves in our community will be open, hosted in our constitutional record repo under our org, and changeable by our ordinary procedures.

**Note:** This is separate from our constitution's current [AGENTS.md](https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/AGENTS.md) - it doesn't *have* to be, we could use Emys for doing constitutional work and eventually I'd like it to be able to do so. I'll keep them separate for now as things could get messy otherwise.

## What it's like to use

**You're a Lab Member. It's Wednesday morning.** A DM arrives:

3 things today: the Financial Policy deliberation thread has 2 new responses. There's a session at 4pm on participatory budgeting (Lounge). And Nanda shared a paper in #share-with-us about collective intelligence that matches your interests.

You reply: *"Is the Committee Room free this afternoon?"* — Emys checks the booking system and tells you it's booked 12-2pm, free after that.

You type /recall data governance and get back what the community memory knows — fragments from past conversations, links to constitutional record entries, who's been discussing it.

**You're Faculty. It's Thursday.** You get a daily digest — today's sessions, new shared links, a summary of channels you subscribe to. You DM: *"What books do we have about deliberative democracy?"* — Emys searches the library and lists 4 titles with availability. "Who's been thinking about AI and government friction?" — it tells you Andreas Varotsis has written about AI, sludge, and transparency paradoxes on topic.forum.

## Phase 1 — The Experiment

This is what we build for the Layer 2 experiment. Expires with the Constitution on 30 November 2026 unless renewed.

### What it reads and remembers

**Shared channels** — a configured list. An extraction loop periodically processes message batches to identify factual community knowledge — events, schedules, logistics, resources, decisions — and stores it in searchable community memory. It stores facts, not opinions. Sources are attributed. A lot of useful knowledge already flows through channels without being captured: Ration Club coordination in #ration-club alongside the Google Sheet roster, fieldwork findings in #share-with-us, Dispatches material scattered across channels. The extraction loop makes this searchable.

**DMs** — private conversations with your agent. Your DM history stays in your personal memory space. It never enters community memory.

**Personal feed channels** — only with the owner's permission. If you opt in (via bot command), others can ask "what has Yianni been up to?"

**On-demand channel reading** — when you ask Emys a question about recent conversations ("what's been happening in #governance-deliberation this week?"), it can read channel history directly via the Discord API.

### Tools

CommClaw connects to house systems (initially read-only):

- **Booking (LibreBooking)** — room availability, booking rules, monthly hour limits (50h candidates, 35h faculty). Spaces: Terrace, Committee Room, Library, Lounge/Kitchen, Newspeak Hall, Guest Room.
- **Library** — catalogue search, availability, borrowed books
- **Google Calendar** — events, session schedules
- **Google Sheets** — coordination spreadsheets (e.g. Ration Club roster)
- **topic.forum** — topics, posts, faculty profiles and expertise
- **Constitutional record** — constitution, rules, open proposals (quotes and links directly, never paraphrases)
- **Discord channel history** — read recent messages from any channel Emys has access to, on demand

Existing webhooks (GitHub update, Links bot, topic.forum Bot, sessions Bot, booking-bot) keep working — CommClaw adds memory and question-answering on top.

### Commands

Agent commands via @mention: /today, /recall [topic], /hello, /connect.

Local commands as slash commands: /subscribe [topic], /unsubscribe [topic].

**Subscriptions and digests:** /subscribe lets you follow topics you care about — governance areas, specific projects, keywords, whatever matters to you. When the extraction loop finds something matching your subscriptions, you get notified via DM. You can also subscribe to specific channels you don't want to read manually. Every morning, members who want one get a daily digest DM — a summary of what happened across their subscribed topics and channels, plus today's events and anything relevant to their stated interests. /unsubscribe removes a subscription. You control what you hear about; Emys handles the filtering.

### The website

A companion website under 2026.newspeak.house/emys authenticated via Discord OAuth.

**Card queue** — a personalised feed shaped by your subscriptions: governance proposals, shared links, booking changes, subscription matches, feature requests to vote on, announcements. Like a review queue — cards you scroll through, dismiss, or act on.

**Feature request backlog** — submit requests through the bot or the website. Members upvote/downvote. The result is a community-prioritised backlog of what Emys should learn to do next.

**Shared links** — aggregated view of links shared across Discord.

### Hosting and cost

Model inference: Nick and Jack from the GPU Coop (friends of the house) are offering access to their 4x A100 server — compute only, no data storage. It will be donation based during their trial period while they are setting up. I'm still waiting to hear what their pricing model will be after that, but I expect it to be quite reasonable and much cheaper than anything else we could use. The bot source code, database, and memory go on a separate small droplet (~$12-24/month).

### Open prompts

System prompts live in a public repo under newspeakhouse-lab-2026/constitutional-record/commclaw-prompts. Changes go through PRs via the regular procedure of layer 2.

### Privacy and Direct Messaging

DMs between you and the bot are private — stored only in each member's container, they never enter community memory. I (admin) will not casually browse DM transcripts or personal memory spaces — only when investigating specific bugs or incidents. Anchit (co-admin) has the same access under the same constraint.

## Roadmap

If the experiment works, here's where CommClaw goes:

**Phase 2 — Inter-agent communication.** Each agent gets an inbox. Your agent instance (the one you interact with in DMs) can message other peoples' agents — negotiate scheduling, follow up on commitments, match interests. The human always approves, unless they have set rules their agent can follow.

**Phase 3 — Privacy circles.** Extend beyond Lab Members and Faculty: non-members see public info, external network coordinates through a public-facing interface.

## Constitutional position and privacy

**§1 requirements:** Open-weights models on private compute (no external API or logging). Two admins (Yianni + Anchit). Operating instructions recorded and readable (experiment rule + public org repo). May not take positions the Laboratory has not adopted. Clearly identified as AI.

**Privacy:** Community memory is shared facts from shared channels. Personal memory is private per member. All processing on our infrastructure, no external data transfer. Personal memory can be deleted/edited upon request. A formal privacy policy will be published with the experiment proposal.

Part of this deployment will consist of experimentation with Emys' persona, character, voice, and boundaries — how it speaks, what it refuses, how it handles ambiguity. This tuning happens through the open prompts repo, visible to all members, and shaped by feedback.
