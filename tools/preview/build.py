#!/usr/bin/env python3
"""A TEST HARNESS. It points at the SANDBOX. It is not part of the Record.

    newspeakhouse-lab-2026/record-sandbox     <- what this builds against
    newspeakhouse-lab-2026/constitutional-record  <- NEVER, see the guard below

What it does
------------
Writes a copy of `docs/index.html` into `tools/preview/out/` that

  (a) points every repository reference at the sandbox instead of the Record,
      so every button on the page acts on the sandbox and nothing else; and

  (b) carries a small `fetch` shim that serves a synthetic vote file for an
      open proposal that has none, so the page renders a vote without one
      having to exist.

Everything else passes straight through to the live GitHub API, unauthenticated.
That is a shared budget of 60 requests an hour from one address, and a cold load
of this page costs 25-30, so expect two or three loads before it rate-limits.
The page says so when it happens; that banner is the real one, not a mock.

Why the shim does not simply replace the vote file
--------------------------------------------------
It tries the real request first and only invents a file when GitHub answers 404.
That is what makes the round trip watchable: before the workflow has written
anything you see a synthetic vote, and after it has written a row you see the
real file with the row in it. A shim that always won would hide the thing you
came to look at.

The round trip to test
----------------------
    python3 tools/preview/build.py --serve
    open http://127.0.0.1:8777/

  1. Find pull request #1 (branch `sandbox-proposal`). It has a real vote file
     at `votes/pr-1.md`, so the row shows the real thing, not a synthetic one.
  2. Click **Record your position**. It should open the sandbox's issue form
     with the pull request number already filled in.
  3. Submit a position.
  4. `.github/workflows/record-vote.yml` should write your row into
     `votes/pr-1.md` on `sandbox-proposal`, comment on the issue with a link to
     the commit, label it `vote-recorded` and close it.
  5. Reload this page. The row should show your position.

  If nothing happens at step 4, look at the issue: every handled failure
  comments and closes. An issue left open and unlabelled means the workflow
  itself fell over, and the run log is the place to look.

UNVERIFIED. The session that wrote this had no GitHub access at all — not the
API, not the `gh` CLI, no token — so none of the five steps above has been run.
The page renders and the shim works against stubs; the round trip is reasoning,
not an observation. Treat step 4 as the thing to check first.

The guard
---------
This file writes nothing if the string `constitutional-record` survives anywhere
in its own output. The sandbox is a throwaway; the Record is not, and a preview
quietly aimed at the real repository would put a live issue form in front of
somebody who thought they were clicking a mock.
"""

import argparse
import json
import pathlib
import re
import shutil
import sys

SANDBOX = "newspeakhouse-lab-2026/record-sandbox"
RECORD = "newspeakhouse-lab-2026/constitutional-record"

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "docs" / "index.html"
DATA = ROOT / "docs" / "data.json"
MEMBERS = ROOT / "members.md"
OUT = pathlib.Path(__file__).resolve().parent / "out"


def roll():
    """Member names, read from members.md now rather than copied in here —
    a list baked into a tool goes stale the moment somebody joins."""
    text = MEMBERS.read_text(encoding="utf-8")
    section = ""
    for part in re.split(r"^##\s+", text, flags=re.M)[1:]:
        if part.lower().startswith("current members"):
            section = part
            break
    names = []
    for line in section.split("\n"):
        if not line.startswith("|") or re.match(r"^\|\s*:?-", line):
            continue
        cell = line.strip().strip("|").split("|")[0].strip()
        if cell and cell.lower() != "name":
            names.append(cell)
    return names


def synthetic_vote(names):
    """A vote file in exactly the shape `.github/instrument-templates/vote.md`
    gives, with a window that is open and nobody having answered. Procedure and
    threshold are Layer 4 because that is the arithmetic most worth looking at:
    two-thirds of all members, where toleration and silence are the same
    number."""
    need = -(-len(names) * 2 // 3)  # a named fraction rounds up (§1)
    return "\n".join(
        [
            "# Vote — PR #{n}: {title}",
            "",
            "**Procedure:** Layer 4 Constitutional",
            "**Carries if:** affirmative support from two-thirds of all members"
            f" — **{need} of {len(names)}**",
            "**Opened:** {opened_words} (`{opened_iso}`)",
            "**Closes:** {closes_words} (`{closes_iso}`)",
            f"**Entitled to vote:** {len(names)} members, frozen when this vote opened"
            " — `members.md` blob `0000000`",
            "",
            "| Member | Position | Date |",
            "|---|---|---|",
        ]
        + [f"| {n} | — | |" for n in names]
        + [
            "",
            "**Positions:** `preference` · `toleration` · `abstention` · `objection`"
            " · `—` not answered.",
            "",
            "## Result",
            "",
            "## Objections",
            "",
        ]
    )


def shim(names):
    """Injected at the top of the page's own script, so it is in place before
    anything is fetched. It wraps `fetch` and touches exactly two things."""
    template = json.dumps(synthetic_vote(names))
    return """
/* ===== PREVIEW HARNESS — NOT PART OF THE RECORD =========================
   Injected by tools/preview/build.py. This file is a build artefact; edit
   the generator, not this. Everything here points at the sandbox.

   Two interventions, both logged to the console as they happen:

     1. A vote file that GitHub answers 404 for is replaced with a synthetic
        one, so a proposal with no vote still renders a vote. A file that
        really exists is passed through untouched — otherwise you could not
        watch the workflow write a row into it, which is the whole point.

     2. An open proposal carrying no layer-N label is given layer-4, an
        opened: two days ago and endorsed:2, because the page only reads a
        vote for a proposal whose procedure votes. Without this, a sandbox
        pull request filed with no labels shows no vote and there is nothing
        to look at. A proposal that HAS a layer is left exactly as it is.

   Everything else goes to the live API, unauthenticated: 60 requests an
   hour shared from one address, and a cold load costs 25-30 of them. */
(function(){
  const SYNTH = __TEMPLATE__;
  const PREVIEW_REPO = "__SANDBOX__";
  const ukWords = d => new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",
      weekday:"long",day:"numeric",month:"long",year:"numeric",
      hour:"2-digit",minute:"2-digit",hour12:false}).format(d) + " UK";
  const real = window.fetch.bind(window);
  const b64enc = s => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
  /* The page reads its remaining budget from GitHub's own header and shows it in
     the footer. A synthesised response must carry the real number through, or an
     invented request would report a budget of zero. */
  const passHeaders = res => {
    const h = { "content-type": "application/json" };
    const left = res.headers.get("x-ratelimit-remaining");
    if (left !== null) h["x-ratelimit-remaining"] = left;
    return h;
  };
  const log = (...a) => console.log("%c[preview]", "color:#7a5a2a;font-weight:600", ...a);

  function voteFor(n, title){
    const opened = new Date(Date.now() - 2*864e5), closes = new Date(Date.now() + 5*864e5);
    return SYNTH
      .replace("{n}", n).replace("{title}", title)
      .replace("{opened_words}", ukWords(opened)).replace("{opened_iso}", opened.toISOString())
      .replace("{closes_words}", ukWords(closes)).replace("{closes_iso}", closes.toISOString());
  }
  const titles = {};

  window.fetch = async function(input, init){
    const url = typeof input === "string" ? input : (input && input.url) || "";
    const res = await real(input, init);

    const vote = url.match(/\\/contents\\/votes\\/pr-(\\d+)\\.md/);
    if (vote && res.status === 404) {
      const n = vote[1];
      log(`no votes/pr-${n}.md on the sandbox — serving a synthetic one`);
      const text = voteFor(n, titles[n] || "a sandbox proposal");
      const body = JSON.stringify({ content: b64enc(text), encoding: "base64",
                                    path: `votes/pr-${n}.md` });
      return new Response(body, { status: 200, headers: passHeaders(res) });
    }

    if (/\\/pulls\\?state=open/.test(url) && res.ok) {
      const prs = await res.clone().json();
      if (Array.isArray(prs)) {
        let touched = 0;
        for (const pr of prs) {
          titles[pr.number] = pr.title;
          const names = (pr.labels || []).map(l => l.name);
          if (names.some(x => /^layer-\\d$/.test(x))) continue;
          pr.labels = (pr.labels || []).concat(
            [{ name: "layer-4" },
             { name: "opened:" + new Date(Date.now() - 2*864e5).toISOString() },
             { name: "endorsed:2" }]);
          touched++;
          log(`#${pr.number} has no layer label — pretending layer-4, opened 2d ago, 2 endorsements`);
        }
        if (touched) return new Response(JSON.stringify(prs),
          { status: 200, headers: passHeaders(res) });
      }
    }
    return res;
  };
  log("serving against " + PREVIEW_REPO + " — this is a harness, nothing here is the Record");
})();
/* ===== end of the preview harness ===================================== */
""".replace("__TEMPLATE__", template).replace("__SANDBOX__", SANDBOX)


BANNER = """<div style="background:#7a5a2a;color:#fbfaf8;font:600 .8rem/1.4 system-ui,sans-serif;
  padding:.6rem 1rem;text-align:center">
  PREVIEW HARNESS — built by <code>tools/preview/build.py</code>, pointed at
  <strong>{sandbox}</strong>. Not the Constitutional Record. Every button here acts on the sandbox.
</div>"""


def build():
    html = SRC.read_text(encoding="utf-8")
    if RECORD not in html:
        print(f"warning: {SRC} does not mention {RECORD} — has the page moved?", file=sys.stderr)
    html = html.replace(RECORD, SANDBOX)

    # The shim goes at the top of the page's own script, so it is installed
    # before the first fetch. There is exactly one <script> in the page.
    if html.count("<script>") != 1:
        sys.exit("expected exactly one inline <script> in docs/index.html")
    html = html.replace("<script>", "<script>\n" + shim(roll()), 1)
    html = html.replace("<body>", "<body>" + BANNER.format(sandbox=SANDBOX), 1)
    # Prose, not URLs. The footer's link said "Read live from the Constitutional
    # Record" while pointing at the sandbox, which is the exact confusion this
    # file exists to prevent — the guard below only reads slugs.
    html = html.replace(">the Constitutional Record</a>", ">the sandbox copy of the Record</a>")
    html = html.replace("<title>", "<title>PREVIEW (sandbox) — ", 1)

    data = json.loads(DATA.read_text(encoding="utf-8"))
    data["repo"] = SANDBOX
    data_text = json.dumps(data, indent=2)

    # The guard. Nothing is written if the Record's name survived anywhere.
    for name, text in (("index.html", html), ("data.json", data_text)):
        if RECORD in text or "constitutional-record" in text:
            sys.exit(
                f"REFUSING TO WRITE: {name} still names {RECORD}.\n"
                "A preview aimed at the real Record would put a live issue form in\n"
                "front of someone who thought they were clicking a mock."
            )

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(html, encoding="utf-8")
    (OUT / "data.json").write_text(data_text + "\n", encoding="utf-8")
    print(f"wrote {OUT / 'index.html'}")
    print(f"wrote {OUT / 'data.json'}")
    print(f"pointed at {SANDBOX}; checked that {RECORD} appears nowhere in either")


def serve(port):
    import functools
    import http.server

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(OUT))
    print(f"serving {OUT} at http://127.0.0.1:{port}/  (ctrl-c to stop)")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--serve", action="store_true", help="serve the build on 127.0.0.1")
    ap.add_argument("--port", type=int, default=8777)
    ap.add_argument("--clean", action="store_true", help="delete the build directory first")
    args = ap.parse_args()
    if args.clean and OUT.exists():
        shutil.rmtree(OUT)
    build()
    if args.serve:
        serve(args.port)
