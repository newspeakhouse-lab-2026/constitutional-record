# Implementation — Guest Room booking system

*Not operative. It records the changes the house booking system needs so that what runs matches this policy. The policy governs; this is the implementation to-do for whoever administers the droplet — the Record Keepers (who administer LibreBooking, Booking Policy) together with Anchit (who built the bot). Secrets are **not** recorded here; they live in the server `.env` and the house password manager.*

The guest-room flow is **built and prototyped** in `newspeakhouse-lab-2026/booking-system` — LibreBooking, the public request form (`apache/request.html`, `apache/welcome.html`), and the `booking-bot` service — but it is **not yet configured to match this policy**. The changes, most-blocking first:

## 1. Give the bot its mail credentials (Mailgun) — the gating item

The bot sends the guest-facing emails (received / confirmed / not-confirmed) through its **own mailer** (`booking_bot/mailer.py`), **not** LibreBooking's — so `LB_EMAIL_ENABLED` does *not* govern them (it only turns on LibreBooking's internal mail). The bot's SMTP settings are **required** in `config.py`: left empty (as in `.env.example`) the bot **won't start at all**, which takes the whole silent-consent loop down with it. So this is not a flag to flip — populate the server `.env` with working Mailgun credentials:

```
LB_SMTP_HOST=smtp.eu.mailgun.org
LB_SMTP_PORT=2525
LB_SMTP_USER=booking@mg.2026.newspeak.house
LB_SMTP_PASS=<secret, from the password manager>
LB_EMAIL_FROM=booking@mg.2026.newspeak.house
```

## 2. Reply-To → the Agent inbox

`booking@mg.2026.newspeak.house` is send-only, so guest replies currently reach no one. Point them at the monitored Agent inbox:

```
LB_REPLY_TO=newspeakhouse26@gmail.com
LB_ALERT_EMAIL=newspeakhouse26@gmail.com      # optional: bot failure alerts
```

These are **already set to the Agent inbox in `.env.example`** and wired through `config.py`/`mailer.py`; replies "reach no one" today only because email is off (item 1). Confirm the live `.env` matches.

## 3. Approver → the bot, with the Agent inbox as the account (not a person)

The approver is currently **Noam personally** (`sql/2026-10-03-approvals-and-flat-credits.sql`) — it must be the **office, not a person**: a LibreBooking approver account under the **Agent inbox** (`newspeakhouse26@gmail.com`). Once the bot is up (`COMPOSE_PROFILES=bot`), run `sql/2026-10-14-guest-room-bot-approver.sql` to make the **Booking Bot** the Guest Room resource admin, so approval follows the silent consent of policy §3.1 (window currently 48 hours). Any manual or fallback approver is the Agent-inbox account, never a departed role-holder.

## 4. Short-notice stays (policy §3.3)

The system enforces a minimum notice in three places — the form (`request.html`, JS `min` = 4 days ahead), LibreBooking (`min_notice_time_add` = 259200 s = 3 days), and the bot's 72-hour check. The form's 4-day floor is the 72-hour rule rounded up for a midnight arrival; the policy's "three days" (§3.2) means 72 hours, so the form is the conservative outlier, not a conflict — align it to 3 days if you want policy and form to read the same. Policy §3.3 lets a sponsor confirm a short-notice stay of **up to two nights** without the window; beyond two nights the request goes through the normal window. That path **does not exist yet**: the system needs a way for a sponsor to confirm a same-/short-notice stay, capped at two nights, directly. Until it is built, the carve-out is handled off-system, on the sponsor's own account.

## 5. Show the contribution scale (policy §4)

The system has **no** contribution display. Add the sliding scale — **Supported £30 / Standard £60 / Solidarity £120 per night** — and the Open Collective link to the welcome page (`apache/welcome.html`), the request form (`apache/request.html`), and the confirmation email, plus a printed card in the room. The booking system does not collect the money; contributions go to Open Collective (Financial Policy).

## 6. Add the cleaning / linen note (policy §5.3)

There is **no** guest-room cleaning section on the welcome page to "correct" — the only cleaning text is a generic common-space line. **Add** guidance per §5.3: the House cleaner does the room but not the laundry, and the sponsor is accountable for linen and turnaround.

## 7. Add a guest introduction, and circulate it (policy §2.5, §5.4)

A single **introduction** field with a warm prompt (not several boxes), so the cohort has a reason to welcome an arriving guest and the guest arrives as part of the house rather than a stranger. Suggested prompt:

> Tell us a little about yourself — what you're working on or curious about, and anything you'd like to share with the house while you're here: a conversation, a skill, a short talk. Staying here is about being part of the community for a few days, not just a room.

Three places:
- **Form (`apache/request.html`):** the one prompted field for the Guest Room.
- **Member bookings (LibreBooking):** a third Guest Room reservation attribute (*"Introduction"*) beside *Guest name* and *Why they want to stay*, so a member's own booking carries it too.
- **Bot (`booking_bot`):** include the introduction in the request post; and **notify the cohort when the guest is arriving** — a channel post on or near the arrival date — so residents know someone is coming and the sponsor can make the intro (policy §5.4).

## 8. Sponsor eligibility — member or Faculty (policy §2.1)

A sponsor may be a member of the Laboratory **or** a Faculty member, matching the Booking Policy §4. The built form and welcome page already say "a Faculty member or Fellowship Candidate" — so **no change is needed** here.

## 9. Let a named sponsor disown — tag members, notify Faculty (policy §2.3)

The form lets a request name anyone as sponsor with nothing requiring their consent (the forge-a-sponsor gap). A named sponsor must be able to **disown** a stay they didn't agree to back — but a Faculty sponsor must get *only* that, not the general objection power members have (§3.1, item 10). So the mechanism differs by sponsor type:

- **Member sponsor:** @-tagged in the members channel when the request posts; the existing **Object button is their disown** — a member already has objection power, so no new affordance is needed. Needs the private **member → Discord-id map** (off-repo, in the bot config; Discord ids stay out of the public Record). This re-enables the lookup dropped on 14 Oct.
- **Faculty sponsor:** the disown is a **gated button, scoped to that one stay**. Discord buttons identify who clicks (`interaction.user.id`) and can be locked to a single user — the official discord.py persistent-view pattern (put the sponsor's id in the button's `custom_id`; accept the press only from them, reject others ephemerally). So the bot gives the Faculty sponsor a **Disown button only they can use** — by DM if they are on the house Discord, or an **email disown-link** if they are not. A Faculty press on anyone else's stay does nothing, so they gain no general objection. Silence lets the stay stand.

This closes the forge-a-sponsor gap for both and keeps **disown** (a sponsor rejecting their own) separate from **objection** (a member's veto). Net-new build either way (the gated button / DM + the sponsor-id map, or the email path).

## 10. Objections are members-only; the channel holds members only (policy §3.1)

Only a member may object to a stay. This is enforced by **Discord channel access**: the channel where the bot posts requests and shows the Object button holds **members only** — Faculty, guests and the public are not in it. Keep its membership in step with `members.md`. Faculty are **deliberately kept out of general objection**; a Faculty sponsor's ability to **disown their own** stay is the separate, gated mechanism in item 9 (a per-stay button only they can use, by DM or email), not channel access.

## 11. Second contact in the confirmation (policy §5.5)

The guest's confirmation names a monitored Laboratory inbox — **newspeakhouse26@gmail.com** (the Agent inbox) — as a backup contact for arrival problems, so a guest whose sponsor and delegate both fail to appear still has someone to reach. Same inbox as Reply-To (item 2).

## 12. Guest-room availability on the request form (policy §2.2)

A non-logged-in requester currently books **blind** — picks a date, and only learns after submitting whether it was free. For the guest room, the form should show a **nightly calendar**: nights already booked are **greyed out and unselectable**, and the requester can choose only free nights. A form request is **one continuous stay** — a single unbroken range of nights, not several separate ranges. It reads LibreBooking's calendar (the API the bot already uses) and shows **free / busy only, never guest names** (privacy). This is the guest-room shape of the form-wide availability view also tracked in the communal-spaces rule's implementation note.

## 13. Enforce the 14-night cap on member bookings (policy §3.4)

The form already enforces 1–14 nights (`validation.py`), but member/Faculty **direct** bookings are adopted by the bot (`service.poll_member_bookings`) with **no length check** — a member can book a longer stay and nothing stops it. Add a max-nights check on the adoption path (reject or flag a stay over 14 nights).

---

**Effort — audited against the running code, 12 November 2026.** Most of this is small text or config; the real build is three items.
- **Trivial / none:** 2 and 8 (already true in the code/config), 6 and 11 (small text edits), and item 1 itself once the credentials exist.
- **Small:** 3 (one SQL run), 5 (static text in three places), 10 (Discord channel permissions — the code is already correct), 13 (one length check).
- **Medium:** 7 (form field + a LibreBooking attribute + a bot post field + a new scheduled arrival post — note the arrival post is *more* than §5.4 requires, since the bot already marks the post "Confirmed").
- **Large — the real build:** 4 (the short-notice ≤2-night carve-out — net-new logic that does not exist in the code), 9 (the sponsor id-map + tagging), 12 (the availability calendar — the biggest front-end piece).

**What already works (verified in code):** the silent-consent loop (post → objection window → confirm on silence, cancel on one objection), member bookings adopted into the *same* window (not a bypass), the objection window default of 48 hours, and the guest room at 0 credits in the SQL.

**Needs server confirmation (cannot be settled from the repo):** whether the live `.env` has working `LB_SMTP_*` credentials — and therefore whether the bot is running at all (item 1); whether `LB_REPLY_TO`/`LB_ALERT_EMAIL` match (item 2); whether the 14 Oct approver SQL (item 3) and the 3 Oct zero-credits SQL (§1.3) have been applied; and whether `COMPOSE_PROFILES=bot` is set with the bot container up.

None of this amends the policy or the Record — it is configuration and code for how the policy is carried out.
