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

async function run({ labels = [], pr, eventName = 'pull_request_target', action = 'opened',
                     timeline = [], reviews = [], comments = [] }) {
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
    },
    paginate: async fn => (fn === 'TIMELINE' ? timeline : fn === 'REVIEWS' ? reviews : []),
  };
  const context = { payload: { pull_request: pr, action }, repo: { owner: 'o', repo: 'r' }, eventName };
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

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
