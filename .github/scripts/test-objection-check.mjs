/* Tests .github/workflows/objection-check.yml.
 *
 * The check blocks a merge, so the thing to be most careful about is not whether
 * it fires when it should — it is whether it fires when it SHOULD NOT. §2 makes a
 * single objection decisive at Tier A and Tier B and merely countable everywhere
 * else: 8 preferring and 6 objecting carries a Layer 3 policy. A check that
 * blocked that would invent a veto the Constitution declined to give, and it
 * would do it to the procedures that matter most.
 *
 * The script is read out of the workflow rather than copied, so the two cannot
 * drift.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const yml = readFileSync(join(HERE, '..', 'workflows', 'objection-check.yml'), 'utf8');
const m = yml.match(/script: \|\n([\s\S]*)$/);
if (!m) {
  console.error('could not find the script block in objection-check.yml');
  process.exit(1);
}
const SCRIPT = m[1].split('\n').map(l => l.slice(12)).join('\n');

const results = [];
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`);
}
const has = (s, t) => typeof s === 'string' && s.includes(t);

const b64 = s => Buffer.from(s, 'utf8').toString('base64');
const err = status => Object.assign(new Error(`HTTP ${status}`), { status });

/* A Tier A objections file as record-vote.yml writes one: no table, no roll. */
const objFile = (blocks) => [
  '# Objections — PR #40: a proposal', '',
  '**Procedure:** Tier A',
  '**Carries if:** no member objects before it closes',
  '**Opened:** Sunday 31 May 2026, 10:00 UK (`2026-05-31T10:00:00+01:00`)',
  '**Closes:** Friday 1 January 2099, 12:00 UK (`2099-01-01T12:00:00+00:00`)', '',
  '## Objections', '', blocks || '',
].join('\n');

const BLOCK = '<!-- objection: 222 -->\n**Noam Herberg** — 2026-10-07\n\n> Reason: the bins are full by Tuesday.\n>\n> Route forward: a second collection.\n';

async function run({ labels = ['tier-a'], file = null, fileStatus = 404 } = {}) {
  const info = [], warned = [], failed = [];
  const context = {
    payload: { pull_request: { number: 40, labels: labels.map(name => ({ name })), head: { sha: 'abc123' } } },
    repo: { owner: 'o', repo: 'r' },
  };
  const github = { rest: { repos: { getContent: async () => {
    if (file === null) throw err(fileStatus);
    return { data: { content: b64(file) } };
  } } } };
  const core = {
    info: m => info.push(m), warning: m => warned.push(m), setFailed: m => failed.push(m),
    summary: { addHeading() { return this; }, addRaw() { return this; }, async write() {} },
  };
  await new Function('github', 'context', 'core', 'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  return { info, warned, failed };
}

console.log('\nobjection-check.yml');

/* ---- it fires where §2 makes an objection decisive ---------------------- */
let r = await run({ labels: ['tier-a', 'layer-2'], file: objFile(BLOCK) });
check('an objection at Tier A blocks the merge', r.failed.length, 1);
check('  and names who objected', has(r.failed[0], 'Noam Herberg'), true);
check('  and says where §2 sends it', has(r.failed[0], 'Tier B'), true);
check('  and says how to clear it', has(r.failed[0], 'tier-b'), true);

r = await run({ labels: ['tier-b', 'layer-2'], file: objFile(BLOCK) });
check('an objection at Tier B blocks it too', r.failed.length, 1);
check('  and sends it to Tier C', has(r.failed[0], 'Tier C'), true);

const TWO = BLOCK + '\n<!-- objection: 111 -->\n**Ada Lovelace** — 2026-10-08\n\n> Reason: second.\n>\n> Route forward: second.\n';
r = await run({ labels: ['tier-a'], file: objFile(TWO) });
check('two objections name both members', has(r.failed[0], 'Noam Herberg and Ada Lovelace'), true);

/* ---- it must NOT fire where an objection is meant to be outvoted -------- */
for (const tier of ['tier-c', 'layer-3', 'layer-4']) {
  r = await run({ labels: [tier], file: objFile(BLOCK) });
  check(`an objection at ${tier} does NOT block — §2 counts it, not vetoes`, r.failed.length, 0);
}
r = await run({ labels: [], file: objFile(BLOCK) });
check('an unlabelled proposal does not block', r.failed.length, 0);

/* ---- and not when there is nothing recorded ----------------------------- */
r = await run({ labels: ['tier-a'], file: null });
check('no vote file means nothing to block on', r.failed.length, 0);
r = await run({ labels: ['tier-a'], file: objFile('') });
check('an empty Objections section does not block', r.failed.length, 0);

/* A ## Notes block has the same shape as an objection. Counting it would block
   a proposal nobody objected to, which is the worst failure this check has. */
r = await run({ labels: ['tier-a'], file: objFile('') + '\n## Notes\n\n**Ada Lovelace** — 2026-10-07\n\n> Would move me: nothing.\n' });
check('a Notes block is not an objection', r.failed.length, 0);

/* Template guidance lives in HTML comments and must not read as a real one. */
r = await run({ labels: ['tier-a'], file: objFile('<!--\n**Example Member** — 2026-01-01\n\n> Reason: an example.\n-->\n') });
check('a commented-out example is not an objection', r.failed.length, 0);

/* ---- GitHub being unavailable must not block a merge -------------------- */
r = await run({ labels: ['tier-a'], file: null, fileStatus: 403 });
check('a 403 does not block the merge', r.failed.length, 0);
check('  but says the check could not find out', has(r.warned[0], 'could not find out'), true);
r = await run({ labels: ['tier-a'], file: null, fileStatus: 500 });
check('a 500 does not block the merge either', r.failed.length, 0);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
