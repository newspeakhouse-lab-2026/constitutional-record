#!/usr/bin/env node
/* record-amendment.yml's logic, against stubs.
 *
 * The workflow copies the `## Amendment record` section of a pull request
 * description into amendment-record/pr-{number}.md on the proposal's branch. It
 * is the SECOND writer to that file — record-vote.yml writes a member's position
 * into the same one — and that is what most of this exercises.
 *
 * The hazard is not the race. The Contents API sha serialises any number of
 * writers, and record-vote.yml's retry re-reads on every attempt. The hazard is
 * record-vote.yml's INVARIANTS: before every write it asserts that nothing
 * outside the voting member's own block has moved, including five exact header
 * lines. A writer that disturbs those does not corrupt the file — it makes a
 * VOTER's write fail, and tells the voter their position was not recorded. So
 * the cases that matter are the ones proving this writer touches one region.
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const WF = join(HERE, '..', 'workflows', 'record-amendment.yml');
const yml = readFileSync(WF, 'utf8');

const m = yml.match(/^[ \t]*script: \|\s*\n([\s\S]*)$/m);
if (!m) { console.error('no `script: |` block in record-amendment.yml'); process.exit(1); }
const lines = m[1].split('\n');
const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.length - l.trimStart().length));
const SCRIPT = lines.map(l => (l.trim() ? l.slice(indent) : '')).join('\n');

const results = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`          got ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`);
};
const has = (s, t) => (s || '').includes(t);
const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const err = status => { const e = new Error('stub'); e.status = status; return e; };

/* ---- the fixtures -------------------------------------------------------- */

const SECTION = [
  '## Amendment record',
  '',
  '**How it was made:** Lazy consensus — no objection within 48 hours.',
  '**Assumptions:** That the house still has fourteen members.',
  '**Status:** live',
  '**Notes from the discussion:** Nobody argued against it.',
  '**Abstentions or objections:** None.',
].join('\n');

const BODY = (section = SECTION, meta = '**Layer:** 2\n\n**Tier:** A\n') =>
  `## Proposal\n\n${meta}\n### What this does\n\nA thing.\n\n---\n\n${section}\n\n---\n\n## Process\n`;

const OPEN = '<!-- amendment-record: copied from the pull request description -->';
const CLOSE = '<!-- /amendment-record -->';

/* A file as the workflow itself would have left it. */
const WRITTEN = (fields = [
  '**How it was made:** Lazy consensus — no objection within 48 hours.',
  '**Assumptions:** That the house still has fourteen members.',
  '**Status:** live',
  '**Notes from the discussion:** Nobody argued against it.',
  '**Abstentions or objections:** None.',
]) => ['# Amendment record — PR #18: a proposal', '',
  '**Procedure:** Tier A', '',
  '## Amendment record', '', OPEN, ...fields, CLOSE, ''].join('\n');

/* The same file after a member has voted into it: a roll, the five header lines,
   and an objection with its anchor. This is what record-vote.yml's invariants
   are protecting, and what this writer must leave alone. */
const WITH_VOTE = [
  '# Amendment record — PR #18: a proposal', '',
  '**Procedure:** Tier C',
  '**Carries if:** a simple majority of those voting — **8 of 14**',
  '**Opened:** Sunday 31 May 2026, 10:00 UK (`2026-05-31T10:00:00+01:00`)',
  '**Closes:** Friday 1 January 2099, 12:00 UK (`2099-01-01T12:00:00+00:00`)',
  '**Entitled to vote:** 14 members, frozen when this vote opened', '',
  '| Member | Position | Date |',
  '|---|---|---|',
  '| Ada Lovelace | preference | 2026-06-01 |',
  '| Blaise Pascal | — | |', '',
  '## Amendment record', '', OPEN,
  '**Status:** live', CLOSE, '',
  '## Objections', '',
  '<!-- objection: 222 -->',
  '**Blaise Pascal** — 2026-05-01', '',
  '> Reason: theirs.',
  '>',
  '> Route forward: theirs.', '',
].join('\n');

// A realistic 14-member roster and the live threshold/period shape, so the
// roll-builder's arithmetic is pinned against the same numbers the dashboard uses.
const MEMBERS = ['# Members', '', '## Current members', '',
  '| Name | GitHub | ID |', '|---|---|---|',
  ...['Anchit Som','Clara Yeo','Disha Shanbhag','Fernanda Munhoz','Joel Naoki CHRISTOPH',
      'Madison Karas','Mario Morvan','Nathaniel Cooke','Niba','Noam Herberg',
      'Rhianwen Rowlands','Tess Buckley','William Wong','Yiannis Ravanis']
      .map((nm, i) => `| ${nm} | gh${i} | ${1000 + i} |`), ''].join('\n');
const DATA = JSON.stringify({
  thresholds: {
    'layer-3': { name: 'Layer 3 Policy', rule: 'majority', over: 'all',
      words: 'affirmative support from a majority of all members' },
    'layer-4': { name: 'Layer 4 Constitutional', rule: 'fraction', num: 2, den: 3, over: 'all',
      words: 'affirmative support from two-thirds of all members' },
    'tier-c': { name: 'Tier C', rule: 'majority', over: 'voting',
      words: 'a simple majority of those who vote, with a quorum',
      quorum: { rule: 'fraction', num: 1, den: 2, over: 'all', counts: 'responders' } },
  },
  procedures: { 'tier-c': { days: 7, name: 'Tier C' }, 'layer-3': { days: 7, name: 'Policy', needsApprovals: 1 },
                'layer-4': { days: 7, name: 'Amendment', needsApprovals: 2 } },
});

async function run({
  body = BODY(),
  title = 'a proposal',
  state = 'open',
  merged = false,
  draft = false,
  labels = [],
  headRef = 'a-branch',
  headRepo = 'o/r',
  file = null,          // null => 404
  fileStatus = 404,
  members = MEMBERS,
  dataJson = DATA,
  createdAt = '2026-05-31T09:00:00Z',
  timeline = [],
  reviews = [],
  putFails = [],
  fileAfterConflict = null,
  user = { login: 'ada', id: 111 },
} = {}) {
  const writes = [], comments = [], notices = [], failed = [];
  let puts = 0, current = file;

  const github = {
    paginate: async (fn, args) => fn(args),
    rest: {
      issues: {
        createComment: async ({ body }) => { comments.push(body); },
        listEventsForTimeline: async () => timeline,
      },
      pulls: {
        listReviews: async () => reviews,
      },
      repos: {
        getContent: async ({ path }) => {
          if (path === 'members.md') return { data: { content: b64(members), sha: 'msha123456' } };
          if (path === 'docs/data.json') return { data: { content: b64(dataJson), sha: 'dsha' } };
          if (current === null) throw err(fileStatus);
          return { data: { content: b64(current), sha: 'sha' + puts } };
        },
        createOrUpdateFileContents: async (args) => {
          if (puts < putFails.length) {
            const e = err(putFails[puts]); puts++;
            if (fileAfterConflict !== null) current = fileAfterConflict;
            throw e;
          }
          puts++;
          writes.push({ ...args, text: Buffer.from(args.content, 'base64').toString('utf8') });
          return { data: {} };
        },
      },
    },
  };
  const context = {
    repo: { owner: 'o', repo: 'r' },
    payload: {
      repository: { default_branch: 'main' },
      pull_request: {
        number: 18, title, body, state, merged, draft, labels, user, created_at: createdAt,
        head: { ref: headRef, repo: { full_name: headRepo } },
      },
    },
  };
  const core = {
    notice: m => notices.push(m),
    warning: m => notices.push(m),
    setFailed: m => failed.push(m),
  };
  await new Function('github', 'context', 'core',
    'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  return { writes, comments, notices, failed, puts };
}

let r;

/* ---- creating the file --------------------------------------------------- */

r = await run();
check('a complete section is written', r.writes.length, 1);
check('to amendment-record/, named for the pull request', r.writes[0].path, 'amendment-record/pr-18.md');
check('on the proposal\'s own branch', r.writes[0].branch, 'a-branch');
check('with a Procedure line, derived from the stated tier',
  has(r.writes[0].text, '**Procedure:** Tier A'), true);
check('and an H1 naming the proposal, not "Vote"',
  has(r.writes[0].text, '# Amendment record — PR #18: a proposal'), true);
check('all five fields are copied', [
  has(r.writes[0].text, '**How it was made:** Lazy consensus'),
  has(r.writes[0].text, '**Assumptions:** That the house'),
  has(r.writes[0].text, '**Status:** live'),
  has(r.writes[0].text, '**Notes from the discussion:** Nobody argued'),
  has(r.writes[0].text, '**Abstentions or objections:** None.'),
], [true, true, true, true, true]);
check('the commit is authored by the pull request author, not the bot',
  [r.writes[0].author.name, r.writes[0].author.email],
  ['ada', '111+ada@users.noreply.github.com']);
check('and the message says the words are the author\'s',
  has(r.writes[0].message, "author's words"), true);

/* The Procedure: line is the bridge to tally.py — without it tally.parse errors,
   check-record.py stops there, and check 6 never runs on the file. A proposal
   with no readable layer or tier gets no file rather than an unreadable one. */
r = await run({ body: BODY(SECTION, 'no metadata here\n') });
check('no readable layer or tier: no file is created', r.writes.length, 0);
check('and it says why (names the missing Layer/Tier), without failing the run',
  [has(r.notices.join(' '), 'Layer'), r.failed.length], [true, 0]);

/* ---- the roll-builder: a voting tier gets its roll built server-side -------
 *
 * The headline of G: no "Start a vote", no paste. When a voting-tier proposal is
 * open (out of draft, with an opened: label), record-amendment builds the whole
 * vote file — roll of all members, the threshold, the window — so a member's form
 * submission has a table to go in. record-vote.yml is untouched. The threshold
 * arithmetic is ported from docs/record.js voteFileFor; these cases pin it against
 * the known numbers for 14 members: majority 8, two-thirds 10, Tier C quorum 7. */
const VOTE = (meta, extra = {}) =>
  run({ body: BODY(SECTION, meta), labels: [{ name: 'opened:2026-05-31T10:00:00Z' }], ...extra });
// Layer 3 now needs one endorsing review (data.json needsApprovals: 1), so its
// VOTE cases supply one; the clock then dates from that review, not the label.
const L3REV = [{ user: { login: 'e' }, state: 'APPROVED', submitted_at: '2026-05-30T00:00:00Z' }];

r = await VOTE('**Layer:** 4\n', { reviews: [
  { user: { login: 'a' }, state: 'APPROVED', submitted_at: '2026-05-20T00:00:00Z' },
  { user: { login: 'b' }, state: 'APPROVED', submitted_at: '2026-05-25T00:00:00Z' }] });
check('a Layer 4 proposal (two endorsements in) builds a vote file, not a §1-only record', r.writes.length, 1);
check('with the constitutional procedure', has(r.writes[0].text, '**Procedure:** Layer 4 Constitutional'), true);
check('two-thirds of 14 is written as 10 of 14 (ceil, not floor)',
  /\*\*Carries if:\*\*[^\n]*\*\*10 of 14\*\*/.test(r.writes[0].text), true);
check('and it carries a full 14-member roll', (r.writes[0].text.match(/^\| .+ \| — \| \|$/gm) || []).length, 14);

r = await VOTE('**Layer:** 3\n', { reviews: L3REV });
check('a majority of 14 is 8 of 14 (floor+1, so a 7–7 split fails)',
  /\*\*Carries if:\*\*[^\n]*\*\*8 of 14\*\*/.test(r.writes[0].text), true);

r = await VOTE('**Layer:** 2\n\n**Tier:** C\n');
check('Tier C states a quorum of 7 of 14, counted at close, not an affirmative bar',
  /quorum \*\*7 of 14\*\*/.test(r.writes[0].text), true);

/* The built roll must be readable by the same parser record-vote.yml and the
   dashboard use, or a position could never be recorded into it. */
r = await VOTE('**Layer:** 3\n', { reviews: L3REV });
const built = r.writes[0].text;
const SB = { document: {}, window: {}, localStorage: { getItem: () => null, setItem: () => {} },
  atob: x => Buffer.from(x, 'base64').toString('binary'), TextDecoder };
const { voteOf } = new Function(...Object.keys(SB),
  readFileSync(join(HERE, '..', '..', 'docs', 'record.js'), 'utf8') + '\nreturn {voteOf};')(...Object.values(SB));
const parsed = voteOf(built);
check('voteOf reads the built roll as a live vote', parsed && parsed.holdsVote, true);
check('and finds all 14 members in it', (parsed.members || []).length, 14);
check('exactly one table — the roll, nothing above it to be mistaken for it',
  (built.match(/^\|---/gm) || []).length, 1);
check('the §1 Assumptions the proposer wrote rode into the vote file',
  has(built, '**Assumptions:** That the house still has fourteen members.'), true);

/* P2 gating: a voting proposal opened as a draft is not open, so NO file is
   created — its record IS the roll, built when it is ready. A §1-only file created
   now would be exactly the roll-less file that later blocks the roll. */
r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'), draft: true, labels: [{ name: 'opened:2026-05-31T10:00:00Z' }] });
check('a draft voting proposal writes no file at all', r.writes.length, 0);

/* The opened: timestamp for an UNGATED tier (Tier C — Layer 3 is now gated): the
   label if present, else the ready_for_review timeline event, else created_at —
   derived here so it does not hang on a bot label-add that never re-triggers this. */
r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'),
  timeline: [{ event: 'ready_for_review', created_at: '2026-05-31T10:00:00Z' }] });
check('no opened: label, but a ready_for_review event -> the roll still builds',
  /^\|---/m.test(r.writes[0]?.text || ''), true);
check('and the window is anchored to the ready_for_review moment',
  has(r.writes[0].text, '2026-05-31'), true);

r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'), createdAt: '2026-04-01T08:00:00Z', timeline: [] });
check('no label and no ready event -> falls back to created_at, still builds',
  [/^\|---/m.test(r.writes[0]?.text || ''), has(r.writes[0].text, '2026-04-01')], [true, true]);

r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'),
  labels: [{ name: 'opened:2026-05-31T10:00:00Z' }],
  createdAt: '2026-04-01T08:00:00Z',
  timeline: [{ event: 'ready_for_review', created_at: '2026-03-03T03:03:00Z' }] });
check('the opened: label wins over created_at and the timeline when present',
  [has(r.writes[0].text, '2026-05-31'), has(r.writes[0].text, '2026-04-01'), has(r.writes[0].text, '2026-03-03')],
  [true, false, false]);

/* ---- P1: an endorsement-gated tier waits for its reviews -------------------
 * Section 2 starts Layer 4's clock at TWO endorsing reviews, not when the PR is
 * ready. So the roll is not built, and its window not dated, until two standing
 * approvals exist — and the window is dated from the SECOND, read from the reviews
 * directly, never from a label another workflow writes. */
const APP = (login, at) => ({ user: { login }, state: 'APPROVED', submitted_at: at });
r = await run({ body: BODY(SECTION, '**Layer:** 4\n'), labels: [{ name: 'opened:2026-05-31T10:00:00Z' }], reviews: [] });
check('Layer 4 with no endorsements builds no roll yet', r.writes.length, 0);
check('and says it is waiting on the endorsing reviews', has(r.notices.join(' '), 'endorsing reviews'), true);

r = await run({ body: BODY(SECTION, '**Layer:** 4\n'), reviews: [APP('a', '2026-05-10T00:00:00Z')] });
check('Layer 4 with one endorsement still waits', r.writes.length, 0);

r = await run({ body: BODY(SECTION, '**Layer:** 4\n'), labels: [{ name: 'opened:2099-01-01T00:00:00Z' }],
  reviews: [APP('a', '2026-05-10T00:00:00Z'), APP('b', '2026-05-20T00:00:00Z')] });
check('Layer 4 with two endorsements builds the roll', /^\|---/m.test(r.writes[0]?.text || ''), true);
check('two-thirds of 14 is still 10 of 14', /\*\*Carries if:\*\*[^\n]*\*\*10 of 14\*\*/.test(r.writes[0].text), true);
check('the clock is dated from the SECOND endorsement, not the opened: label',
  [has(r.writes[0].text, '2026-05-20'), has(r.writes[0].text, '2099')], [true, false]);

r = await run({ body: BODY(SECTION, '**Layer:** 4\n'),
  reviews: [APP('a', '2026-05-10T00:00:00Z'), APP('a', '2026-05-11T00:00:00Z'),
            { user: { login: 'b' }, state: 'COMMENTED', submitted_at: '2026-05-12T00:00:00Z' }] });
check('one approver twice, plus a comment, is one endorsement -> still waits', r.writes.length, 0);

/* Layer 3 is gated too, at one review (data.json needsApprovals: 1): the same
   mechanism, N=1. No review waits; one review builds and dates the clock from it. */
r = await run({ body: BODY(SECTION, '**Layer:** 3\n'), labels: [{ name: 'opened:2099-01-01T00:00:00Z' }], reviews: [] });
check('Layer 3 with no endorsing review waits', r.writes.length, 0);
r = await run({ body: BODY(SECTION, '**Layer:** 3\n'), labels: [{ name: 'opened:2099-01-01T00:00:00Z' }],
  reviews: [APP('a', '2026-05-15T00:00:00Z')] });
check('Layer 3 with one endorsing review builds, clock dated from it (not the label)',
  [/^\|---/m.test(r.writes[0]?.text || ''), has(r.writes[0].text, '2026-05-15'), has(r.writes[0].text, '2099')],
  [true, true, false]);

/* ---- P2: a roll-less file for a now-voting proposal is upgraded ------------
 * A proposal filed at a non-voting tier (a §1-only file) then edited to a voting
 * one is upgraded to the full vote file. A file that already holds a roll is never
 * re-scaffolded, so a recorded position cannot be lost. */
const ONLY_S1 = ['# Amendment record — PR #18: a proposal', '', '**Procedure:** Tier A', '',
  '## Amendment record', '', OPEN, '**Status:** live', CLOSE, ''].join('\n');
r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'), file: ONLY_S1,
  labels: [{ name: 'opened:2026-05-31T10:00:00Z' }] });
check('a roll-less file for a now-voting proposal is upgraded to a full 14-member roll',
  (r.writes[0]?.text.match(/^\| .+ \| — \| \|$/gm) || []).length, 14);

r = await run({ body: BODY(SECTION, '**Layer:** 2\n\n**Tier:** C\n'), file: WITH_VOTE,
  labels: [{ name: 'opened:2026-05-31T10:00:00Z' }] });
check('a file that already has a roll is not re-scaffolded; the recorded vote survives',
  [has(r.writes[0]?.text || '', '| Ada Lovelace | preference |'), has(r.writes[0]?.text || '', '| Member | Position')],
  [true, true]);

/* A Tier A proposal is not a voting tier — unchanged: a §1-only record, no roll. */
r = await run({ body: BODY(SECTION), labels: [{ name: 'opened:2026-05-31T10:00:00Z' }] });
check('Tier A still gets a §1-only record, never a roll',
  [r.writes.length, /^\|---/m.test(r.writes[0].text)], [1, false]);

/* ---- injection through the title and the fields -------------------------- */
/* A pull request title is single-line in GitHub's UI but arrives here as a
   string, and whatever is after a newline in it lands at the start of a line in
   this file. A title carrying a forged objections section had objection-check.yml
   counting a forged objector — blocking a merge in the name of a member who
   never objected. objectionFile() has always defended against this; this did
   not. */
const EVIL_TITLE = 'ok\n\n## Objections\n\n**A Member** — 2026-01-01\n\n> Reason: forged\n>\n> Route forward: forged\n';
r = await run({ title: EVIL_TITLE });
check('a newline in the title cannot forge a heading', /^## Objections$/m.test(r.writes[0].text), false);
check('so objection-check.yml counts no forged objector',
  (r.writes[0].text.replace(/<!--[\s\S]*?-->/g, '')
    .split(/^## Objections[^\n]*$/m)[1] || '').includes('Reason: forged'), false);
check('the title is flattened onto the H1 line',
  r.writes[0].text.split('\n')[0].startsWith('# Amendment record — PR #18: ok  ## Objections'), true);
check('and nothing after it begins a line',
  r.writes[0].text.split('\n').filter(l => l.startsWith('**A Member**')).length, 0);

r = await run({ title: 'x'.repeat(500) });
check('an unbounded title is bounded',
  r.writes[0].text.split('\n')[0].length < 260, true);

/* The field answers cannot do the same: each is collapsed to one line before it
   is written, so a newline in an answer cannot start a line either. */
r = await run({ body: BODY(SECTION.replace('**Status:** live',
  () => '**Status:** live\n\n| Member | Position | Date |\n|---|---|---|\n| A Member | preference | 2026-01-01 |')) });
check('a table smuggled into an answer does not become a table',
  (r.writes[0].text.match(/^\|/gm) || []).length, 0);
check('and a forged row cannot be read as the roll',
  /^\| A Member \| preference/m.test(r.writes[0].text), false);

/* ---- when there is nothing to copy -------------------------------------- */

/* Every fixture above carries a `## Process` heading after the section, so all
   of them exercised the "terminated by the next heading" branch and none
   exercised end-of-description. JavaScript has no \Z, and the first real
   description written against the new template ended with this section. */
r = await run({ body: `## Proposal\n\n**Layer:** 2\n\n**Tier:** A\n\n---\n\n${SECTION}\n` });
check('a section that is the LAST thing in the description is still read', r.writes.length, 1);
check('and all five fields come across',
  ['How it was made', 'Assumptions', 'Status', 'Notes from the discussion',
   'Abstentions or objections'].filter(f => !has(r.writes[0].text, `**${f}:** `)), []);
r = await run({ body: `## Proposal\n\n**Tier:** A\n\n---\n\n${SECTION}` });
check('with no trailing newline either', r.writes.length, 1);
/* The old regex also stopped at any capital Z in the prose. */
r = await run({ body: BODY(SECTION.replace('**Status:** live', () => '**Status:** live in Zone 2')) });
check('a capital Z in an answer does not truncate the section',
  has(r.writes[0].text, '**Abstentions or objections:** None.'), true);

r = await run({ body: '## Proposal\n\nNo record section at all.\n' });
check('a description with no Amendment record section writes nothing', r.writes.length, 0);
check('and is not a failure — an operational merge needs no record', r.failed.length, 0);

/* ---- §1 defaults: a proposer can write nothing and still be compliant ------
 *
 * §1 requires How-it-was-made, Assumptions and Status. Of those, Status is `live`
 * (or `experimental` for an exp-) and Assumptions is `None` unless the proposer
 * says otherwise — neither needs typing. So a Tier A proposal filed with a blank
 * §1 section now yields a complete record rather than nothing. (How-it-was-made is
 * added at close; Notes and abstentions are §1-conditional.) */
r = await run({ body: BODY('## Amendment record\n\n**How it was made:**\n**Status:**\n') });
check('a blank section now yields a defaulted record, not nothing', r.writes.length, 1);
check('Status defaults to live', has(r.writes[0].text, '**Status:** live'), true);
check('Assumptions defaults to None', has(r.writes[0].text, '**Assumptions:** None'), true);

r = await run({ body: BODY('## Amendment record\n\n') });
check('even a wholly empty section yields Assumptions None + Status live',
  [has(r.writes[0].text, '**Assumptions:** None'), has(r.writes[0].text, '**Status:** live')], [true, true]);

r = await run({ body: BODY('## Amendment record\n\n**Assumptions:** That the grant renews.\n') });
check('a real Assumption the proposer wrote overrides the None default',
  has(r.writes[0].text, '**Assumptions:** That the grant renews.'), true);

r = await run({ body: BODY('## Amendment record\n\n', '**Layer:** 2\n\n**Tier:** A\n\n**File(s):** `rules/exp-trial.md`\n') });
check('an exp- instrument gets Status experimental, not live',
  has(r.writes[0].text, '**Status:** experimental'), true);

r = await run({ body: BODY('## Amendment record\n\n**Status:** <live, experimental, or archived>\n') });
check('a field still holding the template placeholder falls back to the default',
  has(r.writes[0].text, '**Status:** live'), true);

/* The template ships each field under an HTML comment of guidance. Copying the
   section wholesale would put the template's prose in the Record. */
r = await run({ body: BODY(['## Amendment record', '',
  '<!-- §1 wants a brief narrative description. One sentence. -->',
  '**Status:** live',
  '<!-- live, experimental, or archived -->'].join('\n')) });
check('the template\'s guidance comments are not copied into the file',
  has(r.writes[0].text, '§1 wants a brief narrative'), false);
check('but the answer beside them is', has(r.writes[0].text, '**Status:** live'), true);

/* The old template emitted `- **Label:**` list items. A description written
   against it should still work rather than silently recording nothing. */
r = await run({ body: BODY('## Amendment record\n\n- **Status:** live\n- **Assumptions:** none\n') });
check('bulleted fields from the old template are read', r.writes.length, 1);
check('and the bullet is not carried into the file',
  has(r.writes[0].text, '- **Status:**'), false);

/* ---- the guards ---------------------------------------------------------- */

r = await run({ headRepo: 'someone/fork' });
check('a fork head is refused before any write', r.writes.length, 0);
check('and says a token cannot reach it', has(r.notices.join(' '), 'fork'), true);

r = await run({ headRef: 'main' });
check('a head on the default branch is refused', r.writes.length, 0);

r = await run({ state: 'closed', merged: true });
check('a merged proposal is left alone', r.writes.length, 0);

/* ---- updating, and never clobbering ------------------------------------- */

r = await run({ file: WRITTEN(), body: BODY(SECTION.replace('**Status:** live', '**Status:** experimental')) });
check('an edited description rewrites the region', r.writes.length, 1);
check('the new answer is in', has(r.writes[0].text, '**Status:** experimental'), true);
check('and the old one is gone', has(r.writes[0].text, '**Status:** live'), false);

r = await run({ file: WRITTEN() });
check('an unchanged description writes nothing', r.writes.length, 0);
check('which is what makes it safe to run on every edit', r.failed.length, 0);

/* A record somebody wrote by hand is their work. Overwriting it is the one
   thing not to do, so the workflow stands down and says so. */
const BY_HAND = ['# Amendment record — PR #18: a proposal', '',
  '**Procedure:** Tier A', '',
  '## Amendment record', '',
  '**How it was made:** I wrote this myself.', ''].join('\n');
r = await run({ file: BY_HAND });
check('a hand-written record is never overwritten', r.writes.length, 0);
check('and it says so rather than failing', [r.failed.length, has(r.notices.join(' '), 'by hand')], [0, true]);

/* The heading present with an EMPTY body is what the OTHER two generators
   emit — objectionFile() on a first objection, and voteFileFor() when a vote is
   opened. Both deliberately leave it empty so this workflow fills it rather
   than reading five blank labels as a record somebody wrote by hand. This is
   the ordinary path in practice, and it had no test. */
const EMPTY_SECTION = ['# Amendment record — PR #18: a proposal', '',
  '**Procedure:** Tier A',
  '**Carries if:** no member objects before it closes',
  '**Opened:** Sunday 31 May 2026, 10:00 UK (`2026-05-31T10:00:00+01:00`)',
  '**Closes:** Tuesday 2 June 2026, 10:00 UK (`2026-06-02T10:00:00+01:00`)', '',
  '## Amendment record', '',
  "<!-- Copied from this proposal's pull request description by",
  '     .github/workflows/record-amendment.yml. Fill the Amendment record',
  '     section there and it appears here. -->', '',
  '## Objections', '',
  '<!-- objection: 222 -->', '**Blaise Pascal** — 2026-05-01', '', '> Reason: theirs.', ''].join('\n');
r = await run({ file: EMPTY_SECTION });
check('an empty section left by another generator is filled', r.writes.length, 1);
check('the record lands in it', has(r.writes[0].text, '**Status:** live'), true);
check('the window that generator wrote is untouched',
  has(r.writes[0].text, '**Closes:** Tuesday 2 June 2026, 10:00 UK (`2026-06-02T10:00:00+01:00`)'), true);
check("and a member's objection is untouched", has(r.writes[0].text, '> Reason: theirs.'), true);
check('with still exactly one Objections heading',
  (r.writes[0].text.match(/^## Objections$/gm) || []).length, 1);
/* Running again on the same file must be a no-op, since the workflow fires on
   every description edit and most edits are to other sections. */
const filled = r.writes[0].text;
r = await run({ file: filled });
check('and a second run on it writes nothing', r.writes.length, 0);

const UNPAIRED = WRITTEN().replace(CLOSE, '');
r = await run({ file: UNPAIRED });
check('an unpaired anchor writes nothing', r.writes.length, 0);
check('and fails loudly, because the file is in a shape nobody intended', r.failed.length, 1);
check('and explains how to repair it', has(r.comments[0], 'repair the pair'), true);

r = await run({ file: '# Amendment record — PR #18\n\n**Procedure:** Tier A\n\nNo heading here.\n' });
check('a file with no Amendment record heading is left alone', r.writes.length, 0);

/* ---- the other writer's file ------------------------------------------- */

r = await run({ file: WITH_VOTE, body: BODY(SECTION) });
check('a file that already holds a vote is still updated', r.writes.length, 1);
const t = r.writes[0].text;
check('the roll survives untouched', [
  has(t, '| Ada Lovelace | preference | 2026-06-01 |'),
  has(t, '| Blaise Pascal | — | |'),
], [true, true]);
check('all five header lines survive byte for byte', [
  has(t, '**Procedure:** Tier C'),
  has(t, '**Carries if:** a simple majority of those voting — **8 of 14**'),
  has(t, '**Opened:** Sunday 31 May 2026, 10:00 UK (`2026-05-31T10:00:00+01:00`)'),
  has(t, '**Closes:** Friday 1 January 2099, 12:00 UK (`2099-01-01T12:00:00+00:00`)'),
  has(t, '**Entitled to vote:** 14 members, frozen when this vote opened'),
], [true, true, true, true, true]);
check('the Procedure line is NOT overwritten with the one from the labels',
  has(t, '**Procedure:** Tier A'), false);
check("another member's objection survives, anchor and all", [
  has(t, '<!-- objection: 222 -->'),
  has(t, '> Reason: theirs.'),
], [true, true]);
check('and the record region is the part that changed',
  has(t, '**How it was made:** Lazy consensus'), true);

/* ---- the invariants ----------------------------------------------------- */

const TAMPERS = [
  ['a table row appearing', s => s.replace(CLOSE, CLOSE + '\n\n| Member | Position | Date |')],
  ['the Procedure line changing', s => s.replace('**Procedure:** Tier C', '**Procedure:** Tier A')],
  ['an objection block vanishing', s => s.replace(/<!-- objection: 222 -->[\s\S]*?(?=\n## |$)/, '')],
];
for (const [name, fn] of TAMPERS) {
  /* Drive the tamper through the file the workflow reads, so the invariant is
     compared against the bytes it would actually have written. */
  r = await run({ file: fn(WITH_VOTE), body: BODY(SECTION) });
  const refused = r.writes.length === 0;
  const kept = r.writes.length === 1;
  check(`a file already showing ${name} is handled without destroying it`,
    refused || (kept && has(r.writes[0].text, '| Ada Lovelace | preference | 2026-06-01 |')), true);
}

/* A replacement STRING expands $&, $`, $' and $1. record-vote.yml carries the
   scar: an objection reading "the space costs $`40 a month" wrote the whole file
   prefix, header and table included, into the middle of itself. The author's
   prose goes through the same replace here. */
for (const d of ['$`', "$'", '$&', '$1']) {
  r = await run({
    file: WRITTEN(),
    /* A FUNCTION replacement here too. Building this fixture with a string
       replacement expanded the sequence before the workflow ever saw it, and
       the test failed claiming the workflow had eaten it. */
    body: BODY(SECTION.replace('**Status:** live', () => `**Status:** it costs ${d}40 a month`)),
  });
  check(`${d} in an answer is written literally`, has(r.writes[0].text, `it costs ${d}40 a month`), true);
  check(`  and nothing is duplicated into the file`,
    (r.writes[0].text.match(/# Amendment record — PR #18/g) || []).length, 1);
}

/* ---- the race ----------------------------------------------------------- */

r = await run({ putFails: [409], body: BODY(SECTION) });
check('a write conflict is retried', r.puts, 2);
check('and the retry lands', r.writes.length, 1);

/* The read is the first statement of the loop, so the retry sees what the other
   writer left and rebuilds on top of it rather than resending stale bytes. */
r = await run({ putFails: [409], fileAfterConflict: WITH_VOTE, body: BODY(SECTION) });
check('a retry re-reads rather than resending', r.writes.length, 1);
check('so a vote written between our read and our write survives',
  has(r.writes[0].text, '| Ada Lovelace | preference | 2026-06-01 |'), true);

r = await run({ putFails: [422] });
check('a 422 on create is treated as stale, not fatal', r.writes.length, 1);

r = await run({ putFails: [409, 409, 409, 409, 409] });
check('five conflicts give up loudly rather than silently', r.failed.length, 1);
check('and say nothing has been lost', has(r.comments[0], 'Nothing has been lost'), true);
check('and write nothing', r.writes.length, 0);

r = await run({ file: null, fileStatus: 500 });
check('a server error on the read is not mistaken for "no file"', r.writes.length, 0);
check('and is a red run, because somebody should look', r.failed.length, 1);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
