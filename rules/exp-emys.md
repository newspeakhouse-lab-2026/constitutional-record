# Emys — Community AI for Newspeak House

**Layer:** 2 · **Status:** experimental
**Ends:** 23:59 UK time, Monday 30 November 2026 (`2026-11-30T23:59:00+00:00`) — with the Constitution, unless renewed by a fresh proposal.

Emys is a community memory and coordination assistant for the Laboratory. It reads the channels and systems the house already uses, builds a searchable memory of what the community knows, and gives every member an assistant that knows the house. It is a deployment of CommClaw (a fork of the open-source NanoClaw framework), already running at TREEWEEK.

The name reverses "Syme", the linguist in *Nineteen Eighty-Four* who edited the Newspeak dictionary to narrow thought; Emys is meant to widen it. (It is also a European pond turtle.)

**This is not the Agent.** Emys does not augment the constitutional Agent role (§3), and this proposal keeps the two separate on purpose. Emys could later be used for constitutional work — that would be a separate decision.

## What it's like to use

*Wednesday morning, a DM:* "3 things today — the Financial Policy thread has 2 new replies, there's a 4pm session on participatory budgeting in the Lounge, and someone shared a paper in #share-with-us on collective intelligence that matches your interests." You ask "is the Committee Room free this afternoon?" and it checks the booking system: booked 12–2, free after.

You type `/recall data governance` and get back what the community has said about it — fragments from past conversations, links to the constitutional record, who has been thinking about it.

## The experiment

> **To confirm with Yianni — this is the one part not yet settled.** The claim and the measure below are a draft.

**Hypothesis.** A shared assistant that reads the house's channels and systems lowers the cost of finding information and coordinating: members query Emys instead of re-asking in channel or asking a person, and miss fewer things they care about.

**What would show it worked.** Measured from Discord before and after Emys arrives — the "before" is already in the channel history: fewer duplicate questions, questions answered sooner, and some booking/library/calendar questions handled by Emys rather than a person. The deeper value — coordination in DMs and in person — is harder to measure in four weeks and will be reported anecdotally, not claimed as proof.

**Honest limit.** The Laboratory's deeper difficulty is that people have little reason to engage at all. Emys lowers the cost of coordinating; it does not create a reason to. This experiment tests the first, not the second.

## What it reads and remembers

**Shared channels** — a configured list. Every few minutes Emys extracts *factual* community knowledge — events, schedules, logistics, resources, decisions — and stores it, searchable, with the source named. It stores facts, not opinions: introductions, banter, health, relationships, complaints about people and third-party claims are all excluded. Extraction is per-channel, and off by default for new forum topics.

**DMs are private.** A direct conversation with your agent stays in your own space and never enters community memory — enforced in the code, not just promised.

**Personal feeds** are opt-in: only if you choose it can others ask "what has [member] been up to?"

## Tools

In Phase 1 Emys is **read-only**. It will be given read access — and no write access to any Laboratory system — to: booking (LibreBooking), the library catalogue, Google Calendar, coordination spreadsheets, topic.forum, and the constitutional record (which it quotes and links, never paraphrases). These integrations will be built during the experiment; the existing house bots keep working.

## Commands

`/today`, `/recall [topic]`, `/hello`, `/connect` by mention; `/subscribe [topic]` and `/unsubscribe`. Subscribe to topics or channels and Emys notifies you by DM when something matches; every morning, those who want one get a digest of their subscriptions and the day's events.

## The website

A companion site at `2026.newspeak.house/emys`, behind Discord login: a personalised card queue (proposals, links, booking changes, subscription matches), a feature-request backlog members upvote, and an aggregated view of links shared across Discord.

## Hosting and compute

Emys **will run on open-weights models on the Laboratory's own compute in the house, with no external API and no external logging.** It does not do so today — it currently uses a hosted model API — and moving it onto private compute is part of the work this experiment authorises. This is a privacy choice, not a constitutional requirement (see below). The bot's code, database and memory run on a small dedicated server (~$12–24/month); model inference is offered by the GPU Coop's hardware, donation-based during their trial.

## Privacy

Community memory holds only shared facts from shared channels. Each member **will have** a private personal memory space (this is being built); personal memory can be edited or deleted on request. All processing runs on the Laboratory's own infrastructure. Two members — Yianni and Anchit — administer Emys; no one administers it alone. Both undertake not to read members' private conversations except when investigating a specific bug or incident. A privacy policy will be published alongside this experiment.

## Constitutional position

Emys is a shared computational tool run by members, authorised here as a time-limited experiment. It is **not** the Agent and does not augment the Agent role (§3). Under §1 it is documented (this proposal) and communicated to the membership; it holds no membership, vote or standing; it is clearly identified as AI in every interaction; and it takes no position the Laboratory has not adopted. Its prompts and configuration are public in the organisation's repository (`commclaw-prompts`) and changeable by ordinary Layer 2 procedure. The engine (CommClaw) stays closed-source while its author pursues commercial deployments; an accurate model of its architecture will be published with this proposal. The open-weights / private-compute arrangement and the two-admin rule are commitments this proposal makes, not constraints §1 imposes on a tool of this kind.

## After the experiment

If it works: Phase 2 gives each member's agent an inbox so agents can coordinate with one another (always with human approval); Phase 3 extends access in privacy circles beyond members. Neither is part of this experiment.

**Observed by:** the prompts and configuration are public and Emys identifies as AI in every interaction, so those commitments are visible; the administrators' undertaking not to read private conversations is a commitment by the two named members, not externally observable.
