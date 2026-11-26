# Guest Room — approval flow

*Not operative. A spec artifact: the state machine the booking system runs to carry out the policy. The policy governs; this shows how a request moves from arrival to stay, with the clause each step discharges in parentheses. Use it to check that every policy requirement maps to a state — a requirement with no state here is a gap.*

```mermaid
flowchart TD
    M["Member / Faculty book directly<br/>(they are the sponsor)"]
    F["Outsider submits the request form<br/>(names a sponsor + an introduction)"]
    N{"Made with<br/>&ge; 3 days' notice? (§3.2)"}
    SN{"Otherwise-empty<br/>night?"}
    EC["Sponsor confirms directly —<br/>up to 2 nights, no window (§3.3)"]
    DEC["Not this way — &gt; 2 nights, or no free night:<br/>goes through the window (§3.3)"]
    P["Posted to the members-only channel (§3.1)<br/>· member sponsor @-tagged; Faculty sponsor gets a<br/>gated disown button, DM or email (§2.3) · window opens"]
    O{"In the window: a member objects (§3.1),<br/>or the named sponsor disowns (§2.3)?"}
    NC["Not confirmed · requester told (§3.1)"]
    CF["Confirmed · requester told (§3.1)<br/>· cohort told a guest is coming (§5.4)"]
    G["Sponsor receives the guest (§5.2)<br/>· backstop contact if no one appears (§5.5)"]
    ST["The stay — up to 14 nights (§3.4)<br/>· sponsor does linen + turnaround (§5.3)<br/>· guest asked to contribute (§4)"]

    M --> N
    F --> N
    N -- yes --> P
    N -- "no · short notice" --> SN
    SN -- yes --> EC
    SN -- no --> DEC
    P --> O
    O -- "yes — one ends it" --> NC
    O -- "no — window elapses" --> CF
    EC --> G
    CF --> G
    G --> ST
```

**Notes.**
- A member's own booking is **not** a bypass: the room requires approval, so it enters the same window as a form request (§3.1).
- **Disown (§2.3) is separate from objection (§3.1).** Only members may object to any stay. A named sponsor may disown their *own*: a member via the Object button, a **Faculty** sponsor via a gated disown button only they can use (by DM, or email if not on the Discord). Faculty get no general objection.
- Steps that depend on the booking system being fully live (the post, the emails, the confirmation) are tracked in `implementation.md`.
