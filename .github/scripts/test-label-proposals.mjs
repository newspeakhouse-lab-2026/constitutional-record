// Runs the label-proposals workflow's own script against a stubbed GitHub API.
//
// The workflow uses pull_request_target, which GitHub always executes from the
// DEFAULT branch — so it cannot be exercised on the pull request that proposes
// it. Without this, its first real run would be after adoption. The script is
// read out of the workflow file rather than copied, so the two cannot drift.
//
//   node .github/scripts/test-label-proposals.mjs

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const yml = fs.readFileSync(path.join(here, '..', 'workflows', 'label-proposals.yml'), 'utf8');

const m = yml.match(/^[ \t]*script: \|\s*\n([\s\S]*)$/m);
if (!m) { console.error('could not find the script block in label-proposals.yml'); process.exit(1); }
const lines = m[1].split('\n');
const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.length - l.trimStart().length));
const SCRIPT = lines.map(l => (l.trim() ? l.slice(indent) : '')).join('\n');

const DEFAULT_DATA = JSON.stringify({ procedures: {
  'tier-a': { days: 2 }, 'tier-b': { daysFromLabel: true }, 'tier-c': { days: 7 },
  'layer-3': { days: 7, needsApprovals: 1 }, 'layer-4': { days: 7, needsApprovals: 2 },
} });

async function run({ labels = [], pr, eventName = 'pull_request_target', action = 'opened',
                     timeline = [], reviews = [], comments = [], dataJson = DEFAULT_DATA }) {
  const added = [], dropped = [], posted = [], warnings = [];
  const exists = n => { if (!labels.includes(n)) throw new Error('404'); return { data: { name: n } }; };
  const github = {
    rest: {
      issues: {
        get: async () => ({ data: { labels: labels.map(name => ({ name })) } }),
        getLabel: async ({ name }) => exists(name),
        createLabel: async () => ({}),
        addLabels: async ({ labels: l }) => { added.push(...l); return {}; },
        removeLabel: async ({ name }) => { dropped.push(name); return {}; },
        listComments: async () => ({ data: comments }),
        createComment: async ({ body }) => { posted.push(body); return {}; },
        listEventsForTimeline: 'TIMELINE',
      },
      pulls: { listReviews: 'REVIEWS' },
      repos: {
        getContent: async ({ path }) => {
          if (path === 'docs/data.json') return { data: { content: Buffer.from(dataJson, 'utf8').toString('base64') } };
          throw Object.assign(new Error('404'), { status: 404 });
        },
      },
    },
    paginate: async fn => (fn === 'TIMELINE' ? timeline : fn === 'REVIEWS' ? reviews : []),
  };
  const context = { payload: { pull_request: pr, action, repository: { default_branch: 'main' } }, repo: { owner: 'o', repo: 'r' }, eventName };
  const core = { warning: msg => warnings.push(msg) };
  await new Function('github', 'context', 'core',
    'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  return { added, dropped, posted: posted.length, warnings };
}

const results = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`${ok ? '  ok  ' : '  FAIL'}  ${name}`);
  if (!ok) console.log(`        got  ${JSON.stringify(got)}\n        want ${JSON.stringify(want)}`);
};

const FILLED = [
  '## Proposal', '', '**Layer:** 2', '', '**Tier:** A', '',
  '**File(s):**', '`rules/rule-example.md`', '',
  '### Why this layer', 'Because it operates within an existing frame.', '',
].join('\n');

const base = { number: 1, draft: false, created_at: '2026-10-01T09:00:00Z' };
let r;

r = await run({ pr: { ...base, body: FILLED }, action: 'ready_for_review',
  timeline: [{ event: 'ready_for_review', created_at: '2026-10-03T20:15:30.000Z' }] });
check('a filled proposal marked ready is labelled, opened: from the timeline',
  r.added.sort(), ['layer-2', 'opened:2026-10-03T20:15:30Z', 'tier-a']);

r = await run({ pr: { ...base, body: 'A proposal with no metadata at all.' } });
check('no layer -> no layer label, and exactly one comment',
  { layers: r.added.filter(x => x.startsWith('layer')), posted: r.posted }, { layers: [], posted: 1 });

r = await run({ pr: { ...base, body: 'no layer here' },
  comments: [{ body: 'earlier note <!-- label-proposals -->' }] });
check('it does not comment twice', r.posted, 0);

r = await run({ pr: { ...base, body: FILLED, draft: true } });
check('a draft gets no opened: label', r.added.filter(x => x.startsWith('opened:')), []);

r = await run({ labels: ['opened:2026-10-03T20:15:30Z', 'layer-2'],
  pr: { ...base, body: FILLED, draft: true }, action: 'converted_to_draft' });
check('returning to draft removes opened:', r.dropped, ['opened:2026-10-03T20:15:30Z']);

r = await run({ eventName: 'pull_request_review', labels: ['endorsed:0'],
  pr: { ...base, body: '**Layer:** 4' },
  reviews: [{ user: { login: 'a' }, state: 'APPROVED' }, { user: { login: 'b' }, state: 'APPROVED' },
            { user: { login: 'a' }, state: 'DISMISSED' }, { user: { login: 'c' }, state: 'COMMENTED' }] });
check('only each member\'s latest review counts, dismissals included',
  { added: r.added, dropped: r.dropped }, { added: ['endorsed:1'], dropped: ['endorsed:0'] });

r = await run({ pr: { ...base, body: '**Layer:** 2\n**Tier:** B\n**Deliberation period:** 5' } });
check('Tier B carries its stated period',
  r.added.filter(x => !x.startsWith('opened')).sort(), ['days-5', 'layer-2', 'tier-b']);

r = await run({ labels: ['layer-3', 'tier-c', 'days-9'], action: 'edited',
  pr: { ...base, body: '**Layer:** 2\n**Tier:** A' } });
check('editing the body drops labels it no longer claims',
  r.dropped.sort(), ['days-9', 'layer-3', 'tier-c']);

// The regression these anchors exist for: \s spans newlines, so a field left
// blank above prose beginning with a digit was read as the answer. The pull
// request template's own wording is "2 Ordinary · 3 Policy · 4 Constitutional".
r = await run({ pr: { ...base,
  body: '**Layer:**\n\n2 Ordinary · 3 Policy · 4 Constitutional. Classified by actual EFFECT.\n' } });
check('a blank Layer does not absorb the line beneath it',
  r.added.filter(x => x.startsWith('layer-')), []);

r = await run({ pr: { ...base,
  body: '**Tier:**\n\nA — 48h, passes absent a stated objection\n**Layer:** 2\n' } });
check('a blank Tier does not absorb the line beneath it',
  r.added.filter(x => x.startsWith('tier-')), []);

r = await run({ pr: { ...base,
  body: 'Preamble.\n\n**Layer:** 4\n**Tier:** C\n**Deliberation period:** 10\n' } });
check('fields still parse when they are filled in',
  r.added.filter(x => !x.startsWith('opened')).sort(), ['days-10', 'layer-4', 'tier-c']);

/* ---- inline guidance comments ------------------------------------------
 *
 * The pull request template puts its guidance in an HTML comment beside each
 * field. GitHub hides those when it RENDERS a description; it does not remove
 * them from the body, and this is the only reader in the repository that was
 * not stripping them. #21 was filed exactly as the template invited and got
 * "I could not read a Layer" — the parser reached "<" where it wanted a digit.
 */
r = await run({ pr: { ...base, body:
  '**Layer:** <!-- write just the number: 2, 3, 4 --> 3 \n' +
  '**Tier:** <!-- Layer 2 only. Write just the letter: A, B or C -->\n' } });
check('a value written AFTER the inline comment is read (this is #21)',
  r.added.filter(x => !x.startsWith('opened')).sort(), ['layer-3']);
check('and no "could not read a Layer" comment is posted', r.posted, 0);

r = await run({ pr: { ...base, body:
  '**Layer:** 2 <!-- write just the number --> \n**Tier:** A <!-- A, B or C -->\n' } });
check('a value written BEFORE the comment still works',
  r.added.filter(x => !x.startsWith('opened')).sort(), ['layer-2', 'tier-a']);

/* The one-line anchor must survive the stripping. Removing a comment must not
   let a field absorb the guidance that followed it on the NEXT line — the bug
   that once labelled a blank-Layer proposal layer-2 from "2 Ordinary · 3 Policy". */
r = await run({ pr: { ...base, body:
  '**Layer:**\n<!-- 2 Ordinary · 3 Policy · 4 Constitutional -->\n\n**Tier:** A\n' } });
check('a blank Layer still does not absorb its guidance after stripping',
  r.added.filter(x => x.startsWith('layer-')), []);

/* A field whose only content is the comment is blank, not readable. */
r = await run({ pr: { ...base, body: '**Layer:** <!-- 3 --> \n' } });
check('a digit inside the comment is not the answer',
  r.added.filter(x => x.startsWith('layer-')), []);

/* ---- gated tiers: opened: is the Nth endorsing review, not leaving draft ----
 * Section 2 starts a Layer 4 clock at two endorsing reviews and a Layer 3 clock at
 * one. The opened: label carries that clock-start, so the label, the dashboard and
 * the vote file all state the same instant. needs is read from data.json. */
r = await run({ eventName: 'pull_request_review', labels: ['endorsed:1'],
  pr: { ...base, body: '**Layer:** 4' },
  reviews: [{ user: { login: 'a' }, state: 'APPROVED', submitted_at: '2026-10-10T00:00:00Z' },
            { user: { login: 'b' }, state: 'APPROVED', submitted_at: '2026-10-12T00:00:00Z' }] });
check('Layer 4: the second endorsing review stamps opened: at its own moment',
  { endorsed: r.added.filter(x => x.startsWith('endorsed')), opened: r.added.filter(x => x.startsWith('opened:')) },
  { endorsed: ['endorsed:2'], opened: ['opened:2026-10-12T00:00:00Z'] });

r = await run({ eventName: 'pull_request_review', labels: ['endorsed:0'],
  pr: { ...base, body: '**Layer:** 3' },
  reviews: [{ user: { login: 'a' }, state: 'APPROVED', submitted_at: '2026-10-09T08:30:00Z' }] });
check('Layer 3: one endorsing review starts its clock; opened: dated from it',
  r.added.filter(x => x.startsWith('opened:')), ['opened:2026-10-09T08:30:00Z']);

r = await run({ pr: { ...base, body: '**Layer:** 4' }, action: 'ready_for_review',
  timeline: [{ event: 'ready_for_review', created_at: '2026-10-05T00:00:00Z' }], reviews: [] });
check('a gated tier marked ready with no endorsements gets NO opened: (clock not started)',
  r.added.filter(x => x.startsWith('opened:')), []);

r = await run({ pr: { ...base, body: '**Layer:** 4' }, action: 'edited',
  reviews: [{ user: { login: 'a' }, state: 'APPROVED', submitted_at: '2026-10-10T00:00:00Z' },
            { user: { login: 'b' }, state: 'APPROVED', submitted_at: '2026-10-12T00:00:00Z' }] });
check('a gated tier edited after its endorsements stamps opened: from the second',
  r.added.filter(x => x.startsWith('opened:')), ['opened:2026-10-12T00:00:00Z']);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
