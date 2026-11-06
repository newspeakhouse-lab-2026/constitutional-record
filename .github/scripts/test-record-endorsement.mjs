// Runs record-endorsement.yml's own script against a stubbed GitHub API. The
// script is read out of the workflow file, not copied, so the two cannot drift.
//
//   node .github/scripts/test-record-endorsement.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const yml = fs.readFileSync(path.join(here, '..', 'workflows', 'record-endorsement.yml'), 'utf8');
const m = yml.match(/^[ \t]*script: \|\s*\n([\s\S]*)$/m);
if (!m) { console.error('no `script: |` block in record-endorsement.yml'); process.exit(1); }
const lines = m[1].split('\n');
const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.length - l.trimStart().length));
const SCRIPT = lines.map(l => (l.trim() ? l.slice(indent) : '')).join('\n');

const b64 = s => Buffer.from(s, 'utf8').toString('base64');

// Same 14-member roster shape as members.md: logins gh0..gh13, ids 1000..1013.
const MEMBERS = ['# Members', '', '## Current members', '',
  '| Name | GitHub | ID |', '|---|---|---|',
  ...['Anchit Som', 'Clara Yeo', 'Disha Shanbhag', 'Fernanda Munhoz', 'Joel Naoki CHRISTOPH',
      'Madison Karas', 'Mario Morvan', 'Nathaniel Cooke', 'Niba', 'Noam Herberg',
      'Rhianwen Rowlands', 'Tess Buckley', 'William Wong', 'Yiannis Ravanis']
      .map((nm, i) => `| ${nm} | gh${i} | ${1000 + i} |`), ''].join('\n');
const DATA = JSON.stringify({
  thresholds: { 'layer-3': { name: 'Layer 3 Policy' }, 'layer-4': { name: 'Layer 4 Constitutional' } },
  procedures: { 'tier-a': { days: 2 }, 'layer-3': { days: 7, needsApprovals: 1 }, 'layer-4': { days: 7, needsApprovals: 2 } },
});

const PR = { number: 18, state: 'open', merged: false, draft: false,
  user: { login: 'ada', id: 111 }, body: '**Layer:** 4\n', labels: [] };
// An endorse issue by member gh{i}, and the same as it appears in listForRepo.
const ISSUE = i => ({ number: 700 + i, user: { login: `gh${i}`, id: 1000 + i },
  title: 'Endorse: PR #18', labels: [{ name: 'endorse' }], body: '### Pull request number\n\n18\n' });
const EXI = (i, at) => ({ ...ISSUE(i), created_at: at });

async function run({ issue, pull = PR, members = MEMBERS, dataJson = DATA, existing = [], edited = [] }) {
  const added = [], dropped = [], posted = [], failed = [];
  let closed = false, closeLabel = null;
  const github = {
    paginate: async (fn, args) => fn(args),
    graphql: async (q, vars) => ({ repository: { issue: { lastEditedAt: edited.includes(vars.n) ? '2026-06-01T00:00:00Z' : null } } }),
    rest: {
      issues: {
        createComment: async ({ body }) => { posted.push(body); },
        addLabels: async ({ issue_number, labels }) => {
          if (issue_number === issue.number) closeLabel = labels[0];   // a label on the endorse issue
          else added.push(...labels);                                  // a label on the PR
        },
        removeLabel: async ({ name }) => { dropped.push(name); },
        getLabel: async () => { throw Object.assign(new Error('404'), { status: 404 }); },
        createLabel: async () => ({}),
        update: async ({ state }) => { if (state === 'closed') closed = true; },
        listForRepo: async () => existing,
      },
      pulls: { get: async () => ({ data: pull }) },
      repos: {
        getContent: async ({ path }) => {
          if (path === 'members.md') return { data: { content: b64(members) } };
          if (path === 'docs/data.json') return { data: { content: b64(dataJson) } };
          throw Object.assign(new Error('404'), { status: 404 });
        },
      },
    },
  };
  const context = { repo: { owner: 'o', repo: 'r' }, payload: { issue, repository: { default_branch: 'main' } } };
  const core = { notice: () => {}, warning: () => {}, setFailed: m => failed.push(m) };
  await new Function('github', 'context', 'core', 'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  return { added: added.sort(), dropped, posted: posted.join('\n'), failed, closed, closeLabel };
}

const results = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${name}`);
  if (!ok) console.log(`        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`);
};
const re = (s, rx) => rx.test(s);
let r;

// The form the workflow reads must provide the field it reads.
const form = fs.readFileSync(path.join(here, '..', 'ISSUE_TEMPLATE', 'endorse.yml'), 'utf8');
check('the endorse form provides the Pull request number field', /label:\s*Pull request number/.test(form), true);
check('and labels the issue `endorse`', /labels:\s*\[\s*"endorse"\s*\]/.test(form), true);

// --- the happy path -------------------------------------------------------
r = await run({ issue: ISSUE(0), existing: [EXI(0, '2026-05-10T00:00:00Z')] });
check('a member endorsing a Layer 4 proposal is recorded, 1 of 2',
  { one: re(r.posted, /1 of 2/), labels: r.added, closed: r.closed, label: r.closeLabel },
  { one: true, labels: ['endorsed-by:gh0', 'endorsed:1'], closed: true, label: 'endorsed' });
check('and no opened: label yet (below the threshold)', r.added.filter(x => x.startsWith('opened:')), []);

r = await run({ issue: ISSUE(1), pull: { ...PR, labels: [{ name: 'endorsed:1' }, { name: 'endorsed-by:gh0' }] },
  existing: [EXI(0, '2026-05-10T00:00:00Z'), EXI(1, '2026-05-20T00:00:00Z')] });
check('the second endorsement meets the threshold, stamps opened: from its own moment, and says the clock started',
  { two: re(r.posted, /2 of 2/), started: re(r.posted, /clock has started/),
    opened: r.added.filter(x => x.startsWith('opened:')) },
  { two: true, started: true, opened: ['opened:2026-05-20T00:00:00Z'] });
check('endorsed:2 replaces endorsed:1', { added: r.added.includes('endorsed:2'), dropped: r.dropped },
  { added: true, dropped: ['endorsed:1'] });

// --- integrity refusals ---------------------------------------------------
r = await run({ issue: ISSUE(2), pull: { ...PR, user: { login: 'gh2', id: 1002 } }, existing: [EXI(2, '2026-05-10T00:00:00Z')] });
check('the proposer cannot endorse their own proposal',
  { refused: re(r.posted, /Someone other than you/), label: r.closeLabel, prLabels: r.added },
  { refused: true, label: 'endorse-refused', prLabels: [] });

r = await run({ issue: { number: 710, user: { login: 'stranger', id: 777 }, title: 'Endorse: PR #18',
  labels: [{ name: 'endorse' }], body: '### Pull request number\n\n18\n' } });
check('a non-member is refused', { refused: re(r.posted, /cannot find @stranger/), label: r.closeLabel },
  { refused: true, label: 'endorse-refused' });

const M_NOID = MEMBERS.replace('| gh0 | 1000 |', '| gh0 |  |');
r = await run({ issue: ISSUE(0), members: M_NOID });
check('a member whose id column is blank is asked to fill it, not silently counted',
  { refused: re(r.posted, /cannot prove the account/), label: r.closeLabel }, { refused: true, label: 'endorse-refused' });

r = await run({ issue: { ...ISSUE(0), number: 720 }, pull: { ...PR, labels: [{ name: 'endorsed:1' }, { name: 'endorsed-by:gh0' }] },
  existing: [EXI(0, '2026-05-10T00:00:00Z'), { ...EXI(0, '2026-05-21T00:00:00Z'), number: 720 }] });
check('endorsing twice is a no-op that says so', { already: re(r.posted, /already endorsed/), label: r.closeLabel },
  { already: true, label: 'endorsed' });

r = await run({ issue: ISSUE(1), existing: [EXI(0, '2026-05-10T00:00:00Z'), EXI(1, '2026-05-20T00:00:00Z')], edited: [700] });
check('an edited prior endorse-issue is not counted — only the fresh one', re(r.posted, /1 of 2/), true);

// --- proposal-state refusals ----------------------------------------------
r = await run({ issue: ISSUE(0), pull: { ...PR, body: '**Layer:** 2\n**Tier:** A\n' } });
check('a non-gated proposal cannot be endorsed', { refused: re(r.posted, /not an endorsement-gated/), label: r.closeLabel },
  { refused: true, label: 'endorse-refused' });

r = await run({ issue: ISSUE(0), pull: { ...PR, draft: true } });
check('a draft proposal cannot be endorsed yet', { refused: re(r.posted, /is a draft/), label: r.closeLabel },
  { refused: true, label: 'endorse-refused' });

r = await run({ issue: ISSUE(0), pull: { ...PR, state: 'closed' } });
check('a closed proposal cannot be endorsed', { refused: re(r.posted, /is closed/), label: r.closeLabel },
  { refused: true, label: 'endorse-refused' });

// --- form / shape refusals ------------------------------------------------
r = await run({ issue: { number: 730, user: { login: 'gh0', id: 1000 }, title: 'Endorse: PR #18',
  labels: [], body: 'no fields here' } });
check('an endorsement not filed through the form is refused with guidance',
  { refused: re(r.posted, /not filed through the form/), label: r.closeLabel }, { refused: true, label: 'endorse-refused' });

r = await run({ issue: { number: 740, user: { login: 'gh0', id: 1000 }, title: 'Just a question', labels: [], body: 'hi' } });
check('an unrelated issue is ignored silently', { posted: r.posted.length, closed: r.closed, failed: r.failed.length },
  { posted: 0, closed: false, failed: 0 });

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
