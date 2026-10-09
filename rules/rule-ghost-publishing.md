# Rule: Ghost for the cohort site and newsletter

Madison Karas and I propose using Ghost (the free, open-source, self-hosted version) for 2026.newspeak.house and the cohort newsletter. This proposal is for the software choice only. The policy proposal is separate (Proposal: Dispatches newsletter) and has entered the 7-day deliberation.

## Why

We need a site to publish posts and a way to send the newsletter. Ghost does everything a publisher would need: posts, member sign-up, analytics, website design, email newsletters, payment integrations etc.

Deciding the tool means we can get the site up with some posts while the newsletter policy (roles, rotations, process) is worked out separately in Madison's proposal.

## Where it lives

On the cohort server approved in the cloud server rule (`rules/rule-cloud-server-hosting.md`), alongside the booking system.

## Tested

It's running now on that server as a test site: https://newspeak-house-2026.tail929f7d.ts.net:8443/

Posting works. Newsletters and emails have been sent and delivered through Mailgun, but only to a few test addresses for now, so public sign-up won't work yet.

Now that the server rule has passed, we will get this fully working on the 2026.newspeak.house domain once the DNS records are in place.

## Cost

Nothing extra. Ghost runs on the server we already pay for under the cloud server rule. Email goes through Mailgun's free plan (100 emails a day), which is enough to start with. If we ever outgrow it, a paid plan would come back as its own proposal.

## Scope

This rule covers the choice of tool only. Who writes, edits and sends the newsletter, and how often, is for the newsletter policy proposal.

## Suggest Alternatives

If you have suggestions for another platform, please do comment and provide alternatives.
