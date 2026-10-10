/* Runs record-vote.yml's logic against a stubbed GitHub API.
 *
 * The workflow triggers on `issues`, which GitHub always runs from the default
 * branch — so it cannot be exercised by the pull request that introduces it.
 * The script is read out of the workflow file rather than copied, so the two
 * cannot drift.
 *
 * A failure here means a member's position would be lost, misattributed, or
 * written by someone other than them.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const WF = join(HERE, '..', 'workflows', 'record-vote.yml');
const yml = readFileSync(WF, 'utf8');

const m = yml.match(/^[ \t]*script: \|\s*\n([\s\S]*)$/m);
if (!m) { console.error('no `script: |` block in record-vote.yml'); process.exit(1); }
const lines = m[1].split('\n');
const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.length - l.trimStart().length));
const SCRIPT = lines.map(l => (l.trim() ? l.slice(indent) : '')).join('\n');

const results = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`);
};
const has = (s, sub) => typeof s === 'string' && s.includes(sub);

/* ---- the forms and the workflow must agree on every field label ---------- */
const labelsIn = file => [...readFileSync(join(HERE, '..', 'ISSUE_TEMPLATE', file), 'utf8')
  .matchAll(/^\s*label:\s*(.+)$/gm)].map(x => x[1].trim().replace(/^["']|["']$/g, ''));
const declared = [...SCRIPT.matchAll(/^\s{2}\w+:\s*'([^']+)',$/gm)].map(x => x[1]);
for (const file of ['vote.yml']) {
  for (const label of labelsIn(file)) {
    check(`${file} field "${label}" is known to the workflow`, declared.includes(label), true);
  }
}

/* ---- fixtures ------------------------------------------------------------ */
const MEMBERS = [
  '# Members', '', '## Current members (3)', '',
  '| Name | GitHub | ID | Role Held |', '|---|---|---|---|',
  '| Ada Lovelace | ada | 111 | |',
  '| Blaise Pascal | blaise | 222 | |',
  '| Carl Gauss | carl |  | |', '',
  '## Change log', '- nothing',
].join('\n');

const voteFile = (rows = { Ada: '—', Blaise: '—', Carl: '—' }, closes = '2099-01-01T12:00:00+00:00') => [
  '# Vote — PR #14: a proposal', '',
  '**Procedure:** Layer 3 Policy',
  '**Carries if:** a majority of all members — **2 of 3**',
  '**Opened:** 1 January 2026, 12:00 UK (`2026-01-01T12:00:00+00:00`)',
  `**Closes:** 1 January 2099, 12:00 UK (\`${closes}\`)`,
  '**Entitled to vote:** 3 members, frozen when this vote opened — `members.md` blob `abc1234`', '',
  '| Member | Position | Date |', '|---|---|---|',
  `| Ada Lovelace | ${rows.Ada} | |`,
  `| Blaise Pascal | ${rows.Blaise} | |`,
  `| Carl Gauss | ${rows.Carl} | |`, '',
  '## Result', '', '## Objections', '',
].join('\n');

/* Tier A and Tier B hold no vote (§2): no table, no roll, no threshold, no
   window. The file exists only because somebody objected. */
const noVoteFile = (blocks = '', closes = '2099-01-01T12:00:00+00:00') => [
  '# Objections — PR #14: a proposal', '',
  '**Procedure:** Tier A',
  '**Carries if:** no member objects before it closes',
  '**Opened:** Sunday 31 May 2026, 10:00 UK (`2026-05-31T10:00:00+01:00`)',
  `**Closes:** Friday 1 January 2099, 12:00 UK (\`${closes}\`)`, '',
  'Section 2 passes a Tier A proposal absent a stated objection, so no vote is',
  'held and this file has no table.', '',
  '## Objections', '', blocks,
].join('\n');

/* The window at Tier A and Tier B is computed from the proposal's own labels —
   opened: plus the period §2 gives the tier — so a fixture without them is a
   proposal whose period nothing records. The issue is submitted 2026-06-01, so
   opening on 05-31 leaves a 2-day Tier A window open. */
const TIER = (tier, extra = ['opened:2026-05-31T10:00:00Z']) =>
  ({ state: 'open', draft: false,
     labels: [{ name: `tier-${tier}` }, ...extra.map(name => ({ name }))],
     head: { ref: 'feature', repo: { full_name: 'o/r' } }, html_url: 'PRURL' });

const DATA_JSON = JSON.stringify({ procedures: { 'tier-a': { days: 2 } } });

const b64 = s => Buffer.from(s, 'utf8').toString('base64');

/* Octokit puts the HTTP status on the error it throws, and the workflow now
   branches on it: only a 404 is a fact about the Record. A stub that throws a
   bare Error carries no status, so it would exercise the fault branch while the
   test believed it was exercising the refusal — which is how a stub comes to
   assert the opposite of what it names. */
const err = status => Object.assign(new Error(`HTTP ${status}`), { status });

/* An objection on the single form: the position dropdown says objection, and the
   two boxes Section 2 requires are filled in or not. */
const OBJ = (reason, route) =>
  '### Pull request number\n\n14\n\n### Your position\n\nobjection — I object. Fill in BOTH boxes below; Section 2 requires them\n'
  + `\n### Your reason — required if you are objecting\n\n${reason}\n`
  + `\n### A suggested route forward — required if you are objecting\n\n${route}\n`;

async function run({
  user = { id: 111, login: 'ada' },
  labels = ['vote'],
  title = 'Vote: PR #14',
  body = '### Pull request number\n\n14\n\n### Your position\n\npreference — I support this outcome. THE ONLY ANSWER THAT COUNTS AS A YES\n',
  file = voteFile(),
  fileMissing = false,
  fileStatus = 404,         // what GitHub answered: 404 is "no vote", anything else is a fault
  pullStatus = 404,
  pull = { state: 'open', draft: false, head: { ref: 'feature', repo: { full_name: 'o/r' } }, html_url: 'PRURL' },
  pullMissing = false,
  dataJson = DATA_JSON,     // holds the period §2 gives Tier A
  putFails = [],            // statuses to throw before succeeding
  fileAfterConflict = null, // what another voter left behind
  tamper = null,            // corrupt apply()'s output, to prove invariants() fires
} = {}) {
  const comments = [], added = [], warnings = [], writes = [], labelled = [];
  let current = file, puts = 0;
  const context = {
    payload: {
      issue: { number: 7, title, body, user, labels: labels.map(name => ({ name })), created_at: '2026-06-01T10:00:00Z' },
      repository: { default_branch: 'main' },
    },
    repo: { owner: 'o', repo: 'r' },
  };
  const github = { rest: {
    issues: {
      createComment: async ({ body }) => comments.push(body),
      addLabels: async ({ issue_number, labels }) => {
        added.push(...labels);
        for (const l of labels) labelled.push(`${l}@${issue_number}`);
      },
      update: async () => {},
    },
    pulls: { get: async () => { if (pullMissing) throw err(pullStatus); return { data: pull }; } },
    repos: {
      getContent: async ({ path }) => {
        if (path === 'members.md') return { data: { content: b64(MEMBERS) } };
        if (path === 'docs/data.json') return { data: { content: b64(dataJson) } };
        if (fileMissing) throw err(fileStatus);
        return { data: { content: b64(current), sha: 'sha' + puts } };
      },
      createOrUpdateFileContents: async (args) => {
        if (puts < putFails.length) {
          const e = new Error('conflict'); e.status = putFails[puts]; puts++;
          if (fileAfterConflict) current = fileAfterConflict;
          throw e;
        }
        puts++;
        writes.push({ ...args, text: Buffer.from(args.content, 'base64').toString('utf8') });
        return { data: { commit: { html_url: 'COMMITURL' } } };
      },
    },
  } };
  const core = { notice: () => {}, setFailed: m => warnings.push(m) };
  if (tamper) globalThis.__TAMPER = tamper; else delete globalThis.__TAMPER;
  try {
    await new Function('github', 'context', 'core', 'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  } finally { delete globalThis.__TAMPER; }
  return { comments, added, failed: warnings, writes, puts, labelled };
}

/* ---- the paths ----------------------------------------------------------- */
let r;

r = await run();
check('happy path writes one commit', r.writes.length, 1);
check('happy path labels it recorded', r.added, ['vote-recorded']);
check('the row is the voter\'s own', has(r.writes[0].text, '| Ada Lovelace | preference | 2026-06-01 |'), true);
check('other rows untouched', has(r.writes[0].text, '| Blaise Pascal | — | |'), true);
check('commit author is the member, not the bot',
  [r.writes[0].author.name, r.writes[0].author.email], ['Ada Lovelace', '111+ada@users.noreply.github.com']);
check('the commit message names the issue and the account',
  has(r.writes[0].message, 'issue #7 by @ada (account id 111)'), true);
check('the reply carries the commit link', has(r.comments[0], 'COMMITURL'), true);
check('the reply says only preference is a yes', has(r.comments[0], 'None of them is a yes'), true);
check('the reply refuses to say it carried', has(r.comments[0], 'Nothing has carried'), true);

r = await run({ user: { id: 999, login: 'stranger' } });
check('a non-member is refused', r.writes.length, 0);
check('and told their own account id so they can act', has(r.comments[0], '`999`'), true);
check('and it is not a red run', r.failed, []);

r = await run({ user: { id: 333, login: 'carl' } });
check('a member with a blank ID is refused', r.writes.length, 0);
check('and given the exact row to paste', has(r.comments[0], '| Carl Gauss | carl | 333 | |'), true);

r = await run({ user: { id: 777, login: 'ada' } });
check('a login matching a different id is a tooling failure', r.failed.length, 1);
check('and writes nothing', r.writes.length, 0);

r = await run({ file: voteFile(undefined, '2020-01-01T12:00:00+00:00') });
check('a closed window is refused', r.writes.length, 0);
check('and names when it closed', has(r.comments[0], '2020-01-01T12:00:00+00:00'), true);

r = await run({ fileMissing: true });
check('no vote file means refusal, not creation', r.writes.length, 0);
check('and it will not open a vote itself', has(r.comments[0], "will not create one"), true);
check('and a 404 is not a red run', r.failed, []);
/* The silent failure: a hand edit committed to a new branch shows a green
   success page and changes nothing. Every message offering a hand edit names
   the radio, so this is asserted on one of them. */
check('the hand-edit offer names the branch to commit to',
  has(r.comments[0], 'Commit directly to the `feature` branch'), true);
check('and names the radio that loses the vote',
  has(r.comments[0], 'Create a new branch for this commit and start a pull request'), true);

/* A rate limit, a permissions blip or a 500 is not evidence about the Record.
   Saying "no vote is open" on that evidence tells a member something false, and
   a member who believes no vote is open stops trying to vote. */
r = await run({ fileMissing: true, fileStatus: 429 });
check('a rate-limited file read is not reported as "no vote is open"',
  has(r.comments[0], 'no vote is open to record'), false);
check('it says the workflow could not find out', has(r.comments[0], 'could not find out'), true);
check('and it is a red run, because a maintainer should look', r.failed.length, 1);
check('and still writes nothing', r.writes.length, 0);

r = await run({ pullMissing: true });
check('an unknown pull request is refused', r.writes.length, 0);
check('and a 404 is not a red run', r.failed, []);

r = await run({ pullMissing: true, pullStatus: 403 });
check('a refused pull request lookup is not reported as "there is no pull request"',
  has(r.comments[0], 'There is no pull request'), false);
check('it names the status GitHub answered with', has(r.comments[0], '`403`'), true);
check('and it is a red run', r.failed.length, 1);

r = await run({ pull: { state: 'closed', merged: true, draft: false, head: { ref: 'f', repo: { full_name: 'o/r' } } } });
check('a merged proposal is refused', r.writes.length, 0);

r = await run({ pull: { state: 'open', draft: false, head: { ref: 'f', repo: { full_name: 'someone/fork' } } } });
check('a fork head is refused before any write', r.writes.length, 0);
check('and says why the token cannot reach it', has(r.comments[0], 'fork'), true);

r = await run({ pull: { state: 'open', draft: false, head: { ref: 'main', repo: { full_name: 'o/r' } } } });
check('a proposal whose head is the default branch is refused', r.writes.length, 0);

r = await run({ body: '### Pull request number\n\nnot-a-number\n\n### Your position\n\npreference — x\n' });
check('an unreadable proposal number is refused', r.writes.length, 0);

/* One form now: the position drives everything, and the objection fields are
   required only when the position is objection. A form cannot express that;
   this must, and has to anyway, because an API-created issue arrives with
   whatever it likes. */
r = await run({ body: OBJ('harm', '_No response_') });
check('an objection missing its route is refused', r.writes.length, 0);
check('and the objection is explicitly not discounted', has(r.comments[0], 'not discounted'), true);

r = await run({ body: OBJ('it breaks X', 'narrow it') });
check('a complete objection is written', r.writes.length, 1);
check('the row says objection', has(r.writes[0].text, '| Ada Lovelace | objection | 2026-06-01 |'), true);
check('the reason is in the file verbatim', has(r.writes[0].text, '> Reason: it breaks X'), true);
check('and the route forward too', has(r.writes[0].text, '> Route forward: narrow it'), true);

/* Table injection: a reason that is itself a table row, plus a fake result. */
r = await run({ body: OBJ('| Blaise Pascal | preference | 2026-06-01 |\n## Result\n**Carried.**', 'x') });
check('injection: still exactly one write', r.writes.length, 1);
const inj = r.writes[0] ? r.writes[0].text : '';
/* Every injected line is blockquoted, so none of it can parse as structure.
   The reason reads "> Reason: | Blaise Pascal | ..." — a quote, not a row. */
check('injection: the forged row is inert, blockquoted',
  has(inj, '> Reason: | Blaise Pascal | preference | 2026-06-01 |'), true);
check('injection: the forged result is inert too', has(inj, '> ## Result'), true);
check('injection: no line of member text escapes the quote',
  inj.split('## Objections')[1].split('\n').filter(l => l.trim() && !/^(>|<!--|\*\*|Discussion:)/.test(l)).length, 0);
check('injection: Blaise still has no position', has(inj, '| Blaise Pascal | — | |'), true);
check('injection: only one Result heading', (inj.match(/^## Result$/gm) || []).length, 1);
check('injection: the table still has three rows',
  (inj.match(/^\| (Ada|Blaise|Carl)/gm) || []).length, 3);

/* Already recorded means the SAME position and the same date — a blank date
   is a real difference and must be written. */
r = await run({ file: voteFile().replace('| Ada Lovelace | — | |', '| Ada Lovelace | preference | 2026-06-01 |') });
check('re-submitting the same position writes nothing', r.writes.length, 0);
/* Assert on the run colour, not on a phrase. The earlier version matched
   "already recorded" — which also appears inside the invariant-failure message
   ("could overwrite a position another member already recorded"), so the test
   passed while the workflow was failing closed. A substring that appears in
   both the success and the failure path tests nothing. */
check('and is not a failure', [r.failed.length, r.added], [0, ['vote-recorded']]);
check('and says the position already stands', has(r.comments[0], 'is already recorded for'), true);
check('and does not claim anything was refused', has(r.comments[0], 'refused to write'), false);

/* THE ONE THAT MATTERS. A 409 means someone wrote between our read and our
   write. The retry must re-read and reapply — not resend the stale bytes,
   which would erase them. */
r = await run({
  putFails: [409],
  fileAfterConflict: voteFile({ Ada: '—', Blaise: 'preference', Carl: '—' }),
});
check('a conflict is retried', r.puts, 2);
check('the retry writes once', r.writes.length, 1);
const after = r.writes[0] ? r.writes[0].text : '';
check('CONFLICT: our row is recorded', has(after, '| Ada Lovelace | preference | 2026-06-01 |'), true);
check('CONFLICT: the other voter is NOT erased', has(after, '| Blaise Pascal | preference | |'), true);

r = await run({ putFails: [409, 409, 409, 409, 409] });
check('five conflicts give up loudly rather than silently', r.failed.length, 1);
check('and write nothing', r.writes.length, 0);

r = await run({ labels: ['proposal'], title: 'Can we talk about the kitchen?', body: '### Nothing\n\nx\n' });
check('an unrelated issue is ignored entirely', [r.comments.length, r.writes.length], [0, 0]);

/* Titled like a vote but written by hand. Not the member's mistake, and it must
   not be reported as a broken tool. */
r = await run({ labels: [], title: 'Vote: PR #5', body: 'I vote yes on this one\n' });
check('a hand-written vote issue is pointed at the form', r.failed, []);
check('and is not told the tooling is broken', has(r.comments[0], 'Use **Record a position'), true);
check('and writes nothing', r.writes.length, 0);

/* Whereas the form's own label plus missing fields really is drift. */
r = await run({ labels: ['vote'], title: 'Vote: PR #5', body: 'no headings at all\n' });
check('a form submission missing its fields is a tooling failure', r.failed.length, 1);

/* GitHub applies a template's labels only if they already exist, so a fresh
   repository drops them silently and the workflow would never fire. The title
   prefix the template sets needs nothing to exist first. */
r = await run({ labels: [], title: 'Vote: PR #14' });
check('an unlabelled submission is recognised by its title', r.writes.length, 1);
r = await run({ labels: [], title: 'Vote: PR #14', body: OBJ('r', 'q') });
check('an unlabelled objection is recognised too', r.writes.length, 1);
r = await run({ labels: [], title: 'Can we discuss the newsletter?' });
check('an ordinary issue with no label and no prefix is still ignored',
  [r.comments.length, r.writes.length], [0, 0]);

/* An objection has to be visible on the proposal, not only on the issue nobody
   revisits. At Tier A or Tier B a single stated one blocks lazy consensus and
   moves the proposal up a tier, so until this label reached the pull request a
   blocked proposal looked exactly like one passing. The issue is #7, the
   proposal is #14. */
r = await run({ body: OBJ('it breaks X', 'narrow it') });
check('an objection labels the issue', r.labelled.includes('objection@7'), true);
check('and the proposal itself', r.labelled.includes('objection@14'), true);
r = await run();
check('a preference labels neither as an objection',
  r.labelled.filter(x => x.startsWith('objection')), []);


/* ---- Tier A and Tier B: no vote, and the objection is the decisive act ----
   This was the gap: the workflow refused whenever no vote file existed, so the
   one place a single objection decides anything was the one place nothing could
   record it. */

r = await run({ pull: TIER('a'), fileMissing: true, body: OBJ('the bins are full by Tuesday', 'a second collection') });
check('Tier A objection with no file creates one', r.writes.length, 1);
check('the created file has no table', /^\s*\|/m.test(r.writes[0].text), false);
check('the created file names the procedure', r.writes[0].text.includes('**Procedure:** Tier A'), true);
check('the created file states its window', r.writes[0].text.includes('**Closes:**'), true);
check('and states it twice, words and timestamp', /\*\*Closes:\*\*.*`\d{4}-\d{2}-\d{2}T[\d:]+[+-]\d{2}:\d{2}`/.test(r.writes[0].text), true);
check('the window is the one the labels describe', r.writes[0].text.includes('2026-06-02T'), true);
check('the reason is written verbatim', r.writes[0].text.includes('the bins are full by Tuesday'), true);
check('the route forward is written verbatim', r.writes[0].text.includes('a second collection'), true);
check('it is created without a sha', r.writes[0].sha, undefined);
check('the objection labels the proposal, not only the issue',
  r.labelled.includes('objection@14') && r.labelled.includes('objection@7'), true);

r = await run({ pull: TIER('b', ['opened:2026-05-31T10:00:00Z', 'days-3']), fileMissing: true, body: OBJ('r', 'q') });
check('Tier B behaves the same as Tier A', r.writes.length, 1);
check('Tier B names its own procedure', r.writes[0].text.includes('**Procedure:** Tier B'), true);

/* A position other than an objection has no effect at these tiers, and
   recording one would suggest a vote was running when none was. */
r = await run({ pull: TIER('a'), fileMissing: true });
check('a preference at Tier A writes nothing', r.writes.length, 0);
check('and says why, naming the tier', has(r.comments[0], 'holds no vote at that tier'), true);
check('and points at the thing that does have an effect', has(r.comments[0], 'single stated one is enough'), true);

/* Without a tier-a/tier-b label the old refusal is unchanged: this workflow
   still will not open a vote, because that names a procedure, freezes a roll and
   writes a threshold. */
r = await run({ pull: TIER('c'), fileMissing: true, body: OBJ('r', 'q') });
check('Tier C with no file still refuses to open a vote', r.writes.length, 0);
check('and gives the original reason', has(r.comments[0], 'will not create one'), true);

/* Someone else's objection is in the file already. */
const OTHERS = '<!-- objection: 222 -->\n**Blaise Pascal** — 2026-05-01\n\n> Reason: theirs.\n>\n> Route forward: theirs.\n';
r = await run({ pull: TIER('a'), file: noVoteFile(OTHERS), body: OBJ('mine', 'my route') });
check('a second objection is added, not substituted', r.writes.length, 1);
check("the other member's block survives", r.writes[0].text.includes('Reason: theirs.'), true);
check('and the new one is there too', r.writes[0].text.includes('Reason: mine'), true);

/* Submitting the same objection twice changes nothing and says so. */
const MINE = '<!-- objection: 111 -->\n**Ada Lovelace** — 2026-06-01' +
  '\n\n> Reason: mine\n> \n> Route forward: my route\n';
r = await run({ pull: TIER('a'), file: noVoteFile(MINE), body: OBJ('mine', 'my route') });
check('resubmitting an identical objection writes nothing', r.writes.length, 0);
check('and says it already stands', has(r.comments[0], 'already recorded'), true);
check('and still closes as recorded', r.added.includes('vote-recorded'), true);

/* Two members objecting at once. A create loses the race with a 422; the retry
   re-reads and finds the file the other member made. */
r = await run({ pull: TIER('a'), fileMissing: false, file: noVoteFile(OTHERS),
  putFails: [422], body: OBJ('mine', 'my route') });
check('a lost create race retries and still records', r.writes.length, 1);
check('and keeps the objection that won the race', r.writes[0].text.includes('Reason: theirs.'), true);

/* The window is enforced, not disclaimed. It is computed from the opened: label
   and §2's period for the tier the first time, then read from the file — one
   answer, the same one the dashboard counts down. */

r = await run({ pull: TIER('a'), file: noVoteFile('', '2026-01-01T12:00:00+00:00'), body: OBJ('r', 'q') });
check('an objection after the window closed is refused', r.writes.length, 0);
check('and says when it closed', has(r.comments[0], '2026-01-01T12:00:00+00:00'), true);
check('and does not rule the objection out of time',
  has(r.comments[0], 'not a ruling that your objection is out of time'), true);

r = await run({ pull: TIER('a', []), fileMissing: true, body: OBJ('r', 'q') });
check('no opened: label means the period cannot be known', r.writes.length, 0);
check('and says so rather than guessing', has(r.comments[0], 'cannot tell when the deliberation period'), true);

/* §2: a Tier B proposal runs for "a stated period of less than seven days", and
   a period never stated cannot have elapsed. */
r = await run({ pull: TIER('b'), fileMissing: true, body: OBJ('r', 'q') });
check('Tier B with no days- label is refused', r.writes.length, 0);
check('and cites the stated-period requirement', has(r.comments[0], 'stated period'), true);

/* The period for Tier A is read from docs/data.json with the sentence it came
   from, never written into this workflow. */
r = await run({ pull: TIER('a'), fileMissing: true, dataJson: '{"procedures":{}}', body: OBJ('r', 'q') });
check('no recorded period for Tier A is refused, not assumed', r.writes.length, 0);
check('and names the file that should hold it', has(r.comments[0], 'docs/data.json'), true);

/* ---- the two defects the final review found ------------------------------
   Both were in the newest code, and both got through because the tests covered
   the path that worked rather than the path that did not. */

/* A replacement STRING expands $&, $`, $' and $1, and the block being inserted
   carries the member's own words. "The space costs $`40" wrote the whole file
   prefix - header and table - unquoted into the middle of the objection, the
   write succeeded, nobody was warned, and tally.py then refused the vote for the
   whole cohort because every member had two rows. */
const DOLLARS = ['$`', "$'", '$&', '$1', '$$'];
for (const d of DOLLARS) {
  r = await run({ pull: TIER('a'), file: noVoteFile(), body: OBJ(`the space costs ${d}40 a month`, 'make it fortnightly') });
  const text = r.writes.length ? r.writes[0].text : '';
  check(`an objection containing ${d} is written`, r.writes.length, 1);
  check(`  and does not duplicate the file's header`,
    (text.match(/^\*\*Procedure:\*\*/gm) || []).length, 1);
  check(`  and does not duplicate the Objections heading`,
    (text.match(/^## Objections\s*$/gm) || []).length, 1);
  check(`  and keeps the member's text verbatim`, text.includes(`${d}40 a month`), true);
}

/* The !isObjection guard lived inside the branch that CREATES the file, so it
   only ever ran on the first submission. Once the file existed, a preference was
   committed as "Record objection from <member>" and labelled `objection` on the
   proposal - which §2 makes decisive. A member expressing support blocked the
   proposal they supported. Every existing-file Tier A test submitted an
   objection, so nothing covered this. */
for (const [label, body] of [
  ['preference', '### Pull request number\n\n14\n\n### Your position\n\npreference — I support this outcome. THE ONLY ANSWER THAT COUNTS AS A YES\n'],
  ['toleration', '### Pull request number\n\n14\n\n### Your position\n\ntoleration — I may not be in favour, but I have no reasoned objection. Counted as an abstention, not a yes\n'],
  ['abstention', '### Pull request number\n\n14\n\n### Your position\n\nabstention — I do not take a position. Not a yes\n'],
]) {
  r = await run({ pull: TIER('a'), file: noVoteFile(), body });
  check(`${label} on an EXISTING Tier A file writes nothing`, r.writes.length, 0);
  check(`  and is not labelled an objection`, r.labelled.some(l => l.startsWith('objection@')), false);
  check(`  and says why, naming the tier`, has(r.comments[0], 'holds no vote at that tier'), true);
}

/* The refusal reads the tier from the file, not the labels: §2 moves the labels
   up a tier the moment the first objection lands, and the file is the Record. */
r = await run({ pull: TIER('c'), file: noVoteFile(),
  body: '### Pull request number\n\n14\n\n### Your position\n\npreference — I support this outcome. THE ONLY ANSWER THAT COUNTS AS A YES\n' });
check('after escalation the refusal still names Tier A, from the file', has(r.comments[0], 'Tier A'), true);

/* ---- invariants(): the last check before a write, previously untested -------
   The file's own comment says the cost of writing through a failed check is "a
   position silently destroyed, which nobody may ever notice". Nothing exercised
   it, because the only way in is a corrupted apply() result and apply() is
   correct. Each case corrupts the result and asserts the write is refused. */
const TAMPERS = [
  ['a second member\'s row changed',  s => s.replace('| Carl Gauss | — |', '| Carl Gauss | preference |')],
  ['the header row rewritten',        s => s.replace('| Member | Position | Date |', '| Member | Vote | Date |')],
  ['the separator row rewritten',     s => s.replace('|---|---|---|', '|---|---|')],
  ['a member renamed',                s => s.replace('Blaise Pascal', 'Blaise Pascale')],
  ['a row removed',                   s => s.replace('| Carl Gauss | — | |\n', '')],
  ['the Carries if line altered',     s => s.replace('**2 of 3**', '**1 of 3**')],
  ['the Entitled to vote line altered', s => s.replace('3 members, frozen', '4 members, frozen')],
  ['a control character introduced',  s => s.replace('## Result', '## Res\u0007ult')],
  ['an impossible position written',  s => s.replace('| Ada Lovelace | preference |', '| Ada Lovelace | yes please |')],
];
for (const [name, fn] of TAMPERS) {
  r = await run({ tamper: fn });
  check(`invariants refuses: ${name}`, r.writes.length, 0);
  check(`  and fails loudly rather than silently`, r.failed.length > 0, true);
  check(`  and says the file is unchanged`, has(r.comments[0], 'nothing in the file has changed'), true);
}
/* The control it is measured against: an untampered run still writes. */
r = await run();
check('invariants passes a correct write', r.writes.length, 1);

/* The no-table path has its own guard, and its own blind spot: it compares
   every OTHER member's block byte for byte. */
const NV_TAMPERS = [
  ["another member's block edited", s => s.replace('Reason: theirs.', 'Reason: THEIRS, EDITED.')],
  ["another member's block deleted", s => s.replace(/<!-- objection: 222 -->[\s\S]*?(?=\n<!-- |\n## |$)/, '')],
  ['a third block appearing',        s => s + '\n<!-- objection: 999 -->\n**Nobody** — 2026-06-01\n\n> Reason: forged.\n'],
  ['the Procedure line changed',     s => s.replace('**Procedure:** Tier A', '**Procedure:** Tier C')],
  ['a table appearing',              s => s + '\n| Member | Position | Date |\n|---|---|---|\n| Ada Lovelace | preference | |\n'],
];
for (const [name, fn] of NV_TAMPERS) {
  r = await run({ pull: TIER('a'), file: noVoteFile(OTHERS), body: OBJ('mine', 'my route'), tamper: fn });
  check(`invariantsNoTable refuses: ${name}`, r.writes.length, 0);
  check(`  and fails loudly`, r.failed.length > 0, true);
}

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
