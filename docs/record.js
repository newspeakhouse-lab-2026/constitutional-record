/* Shared by every page of the Record.
 *
 * Split out of index.html so that a second page can use the same reader,
 * the same row, the same cache and the same arithmetic without a second
 * copy of any of it. The ---8<--- region below is lifted from THIS file by
 * .github/scripts/test-vote-parse.mjs; keep the markers, and keep one copy.
 */
const REPO="newspeakhouse-lab-2026/constitutional-record", API="https://api.github.com/repos/"+REPO;
const HOUR=36e5, DAY=24*HOUR, TTL=6e5;   // 10 minutes
let budget=null;                        // requests left this hour, read from GitHub's own header
// The skeletons live in .github/instrument-templates/, read from the Record
// like everything else so they cannot drift from the templates beside them.
// Until they are on main the buttons still work — they open an empty file.
const newFileURL=(path,t)=>{
  const base=`https://github.com/${REPO}/new/main?filename=${encodeURIComponent(path)}`;
  if(!t) return base;
  const v=encodeURIComponent(t);
  // A prefill long enough to break the URL gives a button that silently fails.
  // Better an empty file than a dead link.
  return v.length>6000?base:base+"&value="+v;
};
// Where each kind of instrument goes. The path decides which procedure applies,
// so choosing here is the same choice as choosing a layer.
// What is in force changes rarely and filled a third of the page with rows
// nobody was reading. Off for now; the Record itself is one click away.
const SHOW_IN_FORCE=false;
const LAYER={
  "0":"Layer 0 — Operational: a reversible action within existing rules. Nothing is committed and no period runs.",
  "1":"Layer 1 — Coordination: scheduling and logistics. Nothing is committed and no period runs.",
  "2":"Layer 2 — Ordinary: operates within a frame that already exists, or sets a parameter.",
  "3":"Layer 3 — Policy: creates or redesigns the governance of an area, or creates an office.",
  "4":"Layer 4 — Constitutional: alters rights, thresholds, procedures, or the allocation of authority."};
// Why a row has no countdown, said in the tag rather than in a word nobody can decode.
const STATES={
  draft:     {t:"Draft",            d:"The proposer has not submitted this for deliberation."},
  unstarted: {t:"Not started",      d:"The deliberation period has not begun, so no clock is running."},
  none:      {t:"No period needed", d:"The Constitution requires no deliberation period at this layer."},
  unopened:  {t:"Not opened",       d:"Nothing records when this was opened for deliberation, so no countdown can be shown. The label that records it is written by a workflow when a proposal leaves draft."},
  "no-tier": {t:"No tier recorded", d:"A Layer 2 proposal states a tier, and the tier is what decides how long deliberation runs."},
  "no-layer":{t:"No layer recorded",d:"The layer decides which procedure applies, so without it nothing here can work out whether a period is running."},
  "no-period":{t:"No period stated",d:"A Tier B proposal states how many days it runs for, and §2 requires one."},
};
const stateOf=w=>STATES[w.state]||null;
const KINDS=[
  {file:".github/instrument-templates/rule.md", path:"rules/rule-untitled.md",
   name:"An Ordinary rule", tag:"Layer 2",
   desc:"Operates within a frame that already exists, or sets a parameter. Passes in 48 hours if nobody objects."},
  {file:".github/instrument-templates/policy.md", path:"policies/{area}/policy.md", area:true,
   name:"A Policy", tag:"Layer 3",
   desc:"Creates or redesigns the governance of an area, or creates an office. One endorsement, seven days, and a majority of all members."},
  {file:".github/instrument-templates/dispute.md", path:"disputes/dispute-untitled.md",
   name:"A record of an adjudication", tag:"§4",
   desc:"Only after a Step 3 vote has already decided the matter. Filing this starts nothing — an adjudication begins by raising a concern in the governance channel or with the Agent."},
];
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* A failed read must never look like an empty Record. Everything here either
   returns data or throws; nothing returns null and lets the page render
   emptiness as though it were a finding. */
/* Carries the HTTP status, because callers have to tell "GitHub says this does
   not exist" from "GitHub did not answer". Those mean opposite things about the
   Record and only one of them is safe to remember. */
class Unreadable extends Error{ constructor(msg,reset,status){ super(msg); this.reset=reset; this.status=status; } }

/* One store, two ways to read it. Fresh reads respect the TTL; lastGood ignores
   it, so a rate-limited load can still show the Record as it was rather than
   nothing at all. localStorage rather than sessionStorage: closing a tab should
   not make the next visit cost a full cold load against a 60/hour ceiling. */
const cacheGet=p=>{ try{ return JSON.parse(localStorage.getItem("rec:"+p)||"null") }catch{ return null } };
const lastGood=p=>cacheGet(p);

async function api(p){
  const k="rec:"+p;
  const hit=cacheGet(p); if(hit && Date.now()-hit.t<TTL) return hit.v;
  let r;
  try{ r=await fetch(API+p,{headers:{Accept:"application/vnd.github+json"}}); }
  catch(e){ throw new Unreadable("the network request failed"); }
  if(r.status===403||r.status===429){
    if(r.headers.get("x-ratelimit-remaining")==="0"){
      const reset=new Date(+r.headers.get("x-ratelimit-reset")*1000);
      throw new Unreadable("rate-limited by GitHub",reset,r.status);
    }
    throw new Unreadable("GitHub refused the request",null,r.status);
  }
  if(!r.ok) throw new Unreadable(`GitHub returned ${r.status} for ${p}`,null,r.status);
  const left=r.headers.get("x-ratelimit-remaining");
  if(left!==null) budget=+left;
  const v=await r.json();
  try{localStorage.setItem(k,JSON.stringify({t:Date.now(),v}))}catch{}
  return v;
}

/* Falls back to the last good copy instead of rejecting. A timestamped stale
   view is honest; a blank page implying nothing is happening is not. */
async function apiOrLast(p){
  try{ return {v:await api(p), at:null}; }
  catch(e){
    const l=lastGood(p);
    if(!l) throw e;
    return {v:l.v, at:l.t};
  }
}

/* A blob SHA is content-addressed, so a blob never changes. Cache it for good:
   after the first load nothing here is fetched again until something merges. */
async function blob(sha){
  const k="blob:"+sha;
  try{ const hit=localStorage.getItem(k); if(hit!==null) return hit; }catch{}
  const b=await api(`/git/blobs/${sha}`);
  const txt=new TextDecoder().decode(Uint8Array.from(atob(b.content.replace(/\n/g,"")),c=>c.charCodeAt(0)));
  try{ localStorage.setItem(k,txt); }catch{}
  return txt;
}

/* Same editor route as newFileURL, but on a proposal's branch rather than main,
   and with the same guard: an over-long URL silently fails, so an empty editor
   beats a broken link. */
const newVoteURL=(branch,path,text)=>{
  const base=`https://github.com/${REPO}/new/${encodeURIComponent(branch)}?filename=${encodeURIComponent(path)}`;
  const v=encodeURIComponent(text);
  return v.length>6000?base:base+"&value="+v;
};

const b64=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g,"")),c=>c.charCodeAt(0)));

/* A vote file carries its own threshold, written out when the vote opened and
   frozen with the roll (§2). So nothing here computes it: the page reads the
   number the file already states and counts rows. The arithmetic lives once, in
   .github/scripts/tally.py, and this cannot drift from it because it does none.
   The page also never says a vote carried — that is §3's word, not a web page's. */
/* ---8<--- vote reading and arithmetic. test-vote-parse.mjs lifts this whole
   region out of the page and drives it from .github/scripts/vote-cases.json —
   the same cases as tally.py — so the two cannot disagree. Keep the markers. */
const POS=["preference","toleration","abstention","objection"];

/* Two rules, and they differ on an even denominator. A majority is MORE THAN
   HALF, so a majority of 14 is 8 and a 7-7 split fails. A named fraction rounds
   up, so two-thirds of 14 is 10. Using ceil for a majority carries a tie.

   The page needs this only to write a threshold into a vote it is opening. It
   never uses it to judge one: a vote file states its own threshold, frozen with
   the roll, and reading that number is all the display does. */
function requiredFor(spec,d){
  if(!spec) return null;
  if(spec.rule==="majority") return Math.floor(d/2)+1;
  if(spec.rule==="fraction") return Math.ceil(d*spec.num/spec.den);
  return null;
}

function voteOf(text){
  text=text.replace(/<!--[\s\S]*?-->/g,"");
  /* Tier C states a quorum here, not an affirmative threshold: its majority is
     counted over preference and objection only, and not until the window has
     closed. Reading that number as "needed" would compare preferences against a
     quorum — the exact confusion the two denominators cause. */
  /* A material change restarts the deliberation period (§2): the positions are
     cleared and the vote runs again. Without showing it, a member whose row was
     cleared reads "awaiting you" with no idea why. */
  /* Tier A and Tier B hold no vote at all: §2 passes the proposal absent a
     stated objection. Their files carry objections and no table, which is
     correct rather than broken — so the procedure is read, not inferred from
     the missing table. If such a file does have a table, the table wins here
     and check-record.py reports the contradiction: a page that silently showed
     nothing would hide a real vote. */
  const proc=((text.match(/^\*\*Procedure:\*\*[^\S\n]*(.+)$/m)||[])[1]||"").replace(/\*/g,"").trim();
  const noVoteProc=/^tier\s*[ab]$/i.test(proc);
  /* Bounded to its own section: ## Notes holds blocks of the same shape, and
     counting those as objections would be wrong. */
  const objSec=(text.split(/^## Objections[^\n]*$/m)[1]||"").split(/^## /m)[0];
  const objections=[...objSec.matchAll(/^\*\*(.+?)\*\*\s*[\u2014\u2013-]\s*(\S+)/gm)]
    .map(m=>({name:m[1].trim(), date:m[2].trim()}));
  const restarted=((text.match(/^\*\*Restarted:\*\*[^\S\n]*(.+)$/m)||[])[1]||"").trim();
  const carries=(text.match(/^\*\*Carries if:\*\*([^\n]*)$/m)||[])[1]||"";
  /* The stated quorum FIGURE, not the word. Testing for "quorum" anywhere matched
     it inside a negation — "a majority of all members, with no quorum requirement"
     rendered a Layer 3 row as Tier C and hid the affirmative count, which is the
     only number that decides it. */
  const quorumOnly=/quorum\s+(?:of\s+)?\*\*\d+\s+of\s+\d+\*\*/i.test(carries);
  const need=carries.match(/(\d+)\s+of\s+\d+/);
  const iso=(text.match(/^\*\*Closes:\*\*[^\n]*?`([^`]+)`/m)||[])[1];
  const counts={preference:0,toleration:0,abstention:0,objection:0};
  const awaiting=[], members=[]; let rows=0;
  /* ONE table, the first. The scan used to run to the end of the file, so a
     comparison table pasted under ## Notes — which the template invites — was
     counted into the roll and the affirmative total. Stop at the first blank line
     after the table has started. */
  const lines=text.split("\n"); let started=false;
  for(const line of lines){
    if(!line.trimStart().startsWith("|")){ if(started) break; continue; }
    started=true;
    const cells=line.trim().replace(/^\||\|$/g,"").split("|").map(s=>s.trim());
    if(cells.length<2 || /^[:\-\s]+$/.test(cells[0]||"-") || cells[0].toLowerCase()==="member") continue;
    const p=cells[1].toLowerCase();
    if(p==="excluded") continue;            // §4: the respondent does not vote
    rows++;
    if(POS.includes(p)) counts[p]++; else awaiting.push(cells[0]);
    /* Who answered and how, not only how many. The counts answer "where does
       this stand"; this answers "who still needs asking", which is the question
       the one person chasing people actually has. */
    members.push({name:cells[0], position:POS.includes(p)?p:null, date:cells[2]||""});
  }
  /* The result the file states, never one computed here — §3 gives the outcome
     to a Record Keeper. Rounds are counted from Earlier rounds, which holds one
     line per round that closed before this one. */
  /* Tier C writes quorum and majority lines between the verdict and the
     affirmative count, so these are found separately rather than adjacently. */
  const verdict=text.match(/^\*\*(Carried|Did not carry)\b/m);
  const figures=text.match(/^Affirmative\s+(\d+)\s+of\s+(\d+),\s*needed\s+(\d+)/m);
  const earlier=[...text.matchAll(/^\*\*Round\s+(\d+)\*\*\s*—\s*([^\n]+)/gm)]
    .map(m=>({n:+m[1], line:m[2].trim()}));
  const holdsVote=!noVoteProc||rows>0;
  if(!rows&&holdsVote) return null;
  return {procedure:proc, holdsVote, objections, members,
          counts, roll:rows, required:need?+need[1]:null, quorumOnly, restarted,
          result:verdict?{carried:verdict[1]==="Carried",
            affirmative:figures?+figures[1]:null, of:figures?+figures[2]:null,
            needed:figures?+figures[3]:null}:null,
          /* A restart means a round closed, so there are at least two even if the
             earlier one's outcome was never written down. */
          rounds:Math.max(earlier.length+1, restarted?2:1), earlier,
          affirmative:counts.preference, responded:rows-awaiting.length,
          awaiting,
          /* Invalid Date is TRUTHY, so `vote.closes || win.closes` picked it and
             `+enforced <= Date.now()` became NaN <= n, i.e. false: a closed vote
             kept a live button and the workflow then refused the member. The
             workflow guards this exactly; this did not. badCloses carries the fact
             so the row can say so rather than silently falling back. */
          badCloses:!!iso&&isNaN(new Date(iso)),
          closes:(iso&&!isNaN(new Date(iso)))?new Date(iso):null};
}
/* --->8--- end of the extracted region. */

/* The instant twice, as every dated line in the Record is written: the words a
   person reads, then the instant a machine reads. The offset is computed rather
   than assumed, because the United Kingdom is on British Summer Time from late
   March to late October and a missing offset is how a deadline ends up an hour
   out. That has happened here before. */
function ukStamp(d){
  const part=(o)=>new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",...o}).format(d);
  const tz=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",timeZoneName:"longOffset"})
    .formatToParts(d).find(p=>p.type==="timeZoneName").value;
  const off=tz==="GMT"?"+00:00":tz.replace("GMT","");
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",year:"numeric",month:"2-digit",
    day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(d)
    .reduce((o,x)=>(o[x.type]=x.value,o),{});
  const words=`${part({weekday:"long"})} ${+p.day} ${part({month:"long"})} ${p.year}, ${p.hour}:${p.minute} UK`;
  return `${words} (\`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:00${off}\`)`;
}

/* Builds the whole vote file and hands it to GitHub's new-file editor. Safe
   here and nowhere else: the file does not exist yet, so there is nothing to
   overwrite and no race with anyone recording a position. */
function voteFileFor(pr,win,thr,names,sha){
  const key=win.layer==="4"?"layer-4":win.layer==="3"?"layer-3":win.tier==="c"?"tier-c":null;
  const spec=key&&thr[key];
  if(!spec||!win.opened||!win.closes||!names.length) return null;
  // Tier C counts its majority over preference and objection only, so the number
  // is not knowable until the window closes. Say so rather than inventing one.
  const carries=spec.over==="voting"
    ? `${spec.words} — quorum **${requiredFor(spec.quorum,names.length)} of ${names.length}**; the majority is counted over preference and objection only, once the window has closed`
    : `${spec.words} — **${requiredFor(spec,names.length)} of ${names.length}**`;
  return [
    `# Vote — PR #${pr.number}: ${pr.title}`, "",
    `**Procedure:** ${spec.name}`,
    `**Carries if:** ${carries}`,
    `**Opened:** ${ukStamp(win.opened)}`,
    `**Closes:** ${ukStamp(win.closes)}`,
    `**Entitled to vote:** ${names.length} members, frozen when this vote opened — \`members.md\` blob \`${(sha||"").slice(0,7)}\``, "",
    "| Member | Position | Date |", "|---|---|---|",
    ...names.map(n=>`| ${n} | — | |`), "",
    "**Positions:** `preference` · `toleration` · `abstention` · `objection` · `—` not answered.", "",
    "> **Only `preference` counts as affirmative support.** Where a procedure needs",
    "> affirmative support from a fraction of all members — Layer 3, Layer 4 and",
    "> re-ratification all do — toleration, abstention and never answering are the",
    "> same number. None of them is a yes.", "",
    "## Result", "",
    "*Written when the window closes, with the arithmetic shown. "
    + "`python3 .github/scripts/tally.py` recomputes it and prints the working.*", "",
    "## Objections", "",
    "*Each objection's reason and route forward, in full. Section 2 requires both.*", "",
  ].join("\n");
}

/* Deliberation arithmetic comes from data.json, which cites the clause it came
   from — so amending the Constitution is a reviewable diff, not a silent change
   in a script. Opening times and endorsement counts come from labels the
   workflow writes, which is both cheaper and better evidence: the label is
   visible on the proposal, which is what "shown to have begun" means. */
function windowOf(pr,proc){
  const names=(pr.labels||[]).map(l=>l.name);
  // Split on the FIRST colon only — an ISO timestamp is full of colons and dashes.
  const pick=re=>{const x=names.find(v=>re.test(v));return x?x.slice(x.indexOf(":")+1):null};
  const layer=(names.find(n=>/^layer-\d$/.test(n))||"").split("-")[1];
  const tier=(names.find(n=>/^tier-[abc]$/.test(n))||"").split("-")[1];
  const days=(names.find(n=>/^days-\d+$/.test(n))||"").split("-")[1];
  const openedAt=pick(/^opened:/);
  const endorsed=pick(/^endorsed:/);
  const other=names.filter(n=>!/^(layer-\d|tier-[abc]|days-\d+|opened:|endorsed:)/.test(n));
  const o={layer,tier,days,other,opened:null,closes:null,minimum:false,why:[],state:"open"};

  if(pr.draft){o.state="draft";o.why.push(`a draft — the proposer has not <a href="https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/CONTRIBUTING.md#the-process-end-to-end">submitted it for deliberation</a>`);return o}
  if(!layer){o.state="no-layer";o.why.push(`a period may well be running — nothing here can say so until the <a href="https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/CONTRIBUTING.md#words-used-here">layer</a> is on the proposal`);return o}
  if(layer==="0"||layer==="1"){o.state="none";o.why.push(`<a href="https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/CONTRIBUTING.md#words-used-here">Layer ${layer}</a> — records or coordinates within existing rules, so no deliberation period is required`);return o}

  const key = layer==="4"?"layer-4" : layer==="3"?"layer-3" : tier?("tier-"+tier):null;
  const p = key && proc[key];
  if(!p){ o.state="no-tier"; if(layer!=="4"&&layer!=="3") o.why.push("no tier recorded"); return o }

  if(p.needsApprovals){
    const have=endorsed===null?0:Number(endorsed);
    o.endorse={have,need:p.needsApprovals};
    if(have<p.needsApprovals){
      o.state="unstarted";
      o.why.push(`a Constitutional amendment\u2019s clock starts at ${p.needsApprovals} <a href="https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/CONTRIBUTING.md#endorsing">endorsing reviews</a> (\u00a72) — this has ${have}`);
      return o;
    }
  }
  if(!openedAt){
    o.state="unopened";
    o.why.push("no recorded opening, so nothing here can say a period is running");
    return o;
  }
  o.opened=new Date(openedAt);
  let d=p.days;
  if(p.daysFromLabel){ if(!days){o.state="no-period";o.why.push(`<a href="https://github.com/newspeakhouse-lab-2026/constitutional-record/blob/main/CONTRIBUTING.md#words-used-here">Tier B</a> with no stated period — \u00a72 requires one`);return o} d=Number(days); }
  o.closes=new Date(+o.opened+d*DAY); o.minimum=!!p.minimum;
  return o;
}

function rem(at){
  if(!at)return null;
  const ms=+at-Date.now(), past=ms<0, a=Math.abs(ms);
  const d=Math.floor(a/DAY), h=Math.floor((a%DAY)/HOUR);
  const t=d>=2?`${d}d`:d>=1?`${d}d ${h}h`:`${h}h`;
  return {ms,past,txt:past?"elapsed":t,
    cls:past||ms<DAY?"urgent":ms<3*DAY?"soon":"",
    word:past?"elapsed":ms<DAY?"closing today":ms<3*DAY?"closing soon":"running"};
}
// The Constitution states its deadlines in UK time, so show them in UK time.
const fmt=d=>d?d.toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:"Europe/London"}):"";

/* ======================================================================
   THE LANES — fourteen slots, one per member of the frozen roll.

   `hand` gives every mark a rotation and an offset derived from the proposal
   number and the slot index: stable across reloads, different for every vote,
   under a degree of deviation. You do not see it; you feel that the row was
   not printed. A tally is marks made by a hand, and that is what this is.

   Order within a lane is always act to absence: preference, objection,
   toleration and abstention, then silence. The strip fades out to the right
   and the silence at the end of it is what this page is quietly about. */
function hand(seed,i){
  let x=((seed+1)*2654435761 ^ (i+1)*40503)>>>0;
  x=(x ^ (x>>>13))>>>0;
  return `--r:${((x%13)-6)/10}deg;--d:${(((x>>>5)%9)-4)/8}px`;
}
function laneCells(seed,plan){
  let i=0,out="";
  for(const [cls,n] of plan) for(let k=0;k<n;k++,i++)
    out+=`<i class="c ${cls}" style="${hand(seed,i)}"></i>`;
  return out;
}
/* `at` is where the stated threshold falls BETWEEN slots, so the drawing shows
   a gap rather than a percentage. null draws no line, which is the honest
   rendering when the procedure states no number this page may read. */
function lane(seed,key,plan,n,at){
  return `<div class="lane"><span class="lanek">${key}</span>`
    +`<span class="slots" style="--n:${n}">${laneCells(seed,plan)}`
    +(at!=null&&at>0?`<b class="notch" style="--at:${at}"></b>`:"")
    +`</span></div>`;
}

/* One mechanism for everything that used to be a sentence nobody had room to
   read: a small control that opens a native <dialog>. Native because Escape,
   focus trapping and the backdrop come free and correct, and because a page
   that must work from a file:// URL cannot afford a library.

   Two shapes, same machinery. A warning is a red triangle beside the thing it
   is about — it has to be noticed. A note is a plain link in the sentence it
   belongs to, because it answers a question rather than raising one. */
const MODALS=[]; let MODAL_N=0;
function modal(trigger,title,body,kind){
  const id=`m${++MODAL_N}`;
  MODALS.push(`<dialog id="${id}" class="sheet" aria-labelledby="${id}t"><form method="dialog">
    <h3 id="${id}t" tabindex="-1">${title}</h3><div class="sheetbody">${body}</div>
    <button class="sheetx" value="close">Close</button></form></dialog>`);
  return trigger(id);
}
/* aria-label carries the title: the glyph alone announces as "warning" and
   says nothing about which warning. */
function warnIcon(title,body){
  return modal(id=>`<button type="button" class="warnbtn" data-sheet="${id}"
    aria-label="${esc(title)}" title="${esc(title)}">!</button>`, title, body);
}
function noteBtn(label,title,body){
  return modal(id=>`<button type="button" class="notebtn" data-sheet="${id}">${label}</button>`,
    title, body);
}

/* The right-hand rail carries the deadline AND the action, in that order: the
   countdown, the instant it runs to, then the one thing to do before it. They
   are one thought — do this before that — and the action used to sit at the
   bottom of the left column, as far from its deadline as the row allowed.
   Everything in words stays on the left, in reading order: what it is, where it
   stands, the drawing of where it stands, and the two ways to ask about it. */
function row(sr,label,meta,remTxt,abs,cls,why,act){
  return `<div class="r ${cls||""}">
    <div class="lbl">${label}</div>
    <div class="rt"><span class="rem">${remTxt||""}${sr?`<span class="sr"> \u2014 ${sr}</span>`:""}</span>${
      abs?`<span class="abs">${abs}</span>`:""}</div>
    ${meta?`<div class="meta">${meta}</div>`:""}
    ${why?`<div class="why">${why}</div>`:""}
    ${act?`<div class="rail">${act}</div>`:""}</div>`;
}
