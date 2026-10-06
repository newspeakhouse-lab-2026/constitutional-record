/* Tests the dashboard's vote reader against the same worked cases as the Python
   tally, so the page and the Record cannot disagree about what a file says.
 *
 * The page deliberately computes no arithmetic: a vote file states its own
 * threshold, written out when the vote opened and frozen with the roll (§2), so
 * the page reads that number and counts rows. This test therefore checks
 * counting and reading, not thresholds — those are tested in test-tally.py.
 *
 * voteOf is read out of docs/index.html rather than copied, so the two cannot
 * drift. A failure here means the page would misreport a live vote.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(HERE, '..', '..', 'docs', 'index.html'), 'utf8');

const m = html.match(/\/\* ---8<---[\s\S]*?--->8--- end[^\n]*\n/);
if (!m) {
  console.error('could not find the ---8<--- region in docs/index.html. If it was renamed, rename it here too.');
  process.exit(1);
}
const { POS, requiredFor, voteOf } = new Function(m[0] + '\nreturn {POS, requiredFor, voteOf};')();

const corpus = JSON.parse(readFileSync(join(HERE, 'vote-cases.json'), 'utf8'));

/* Build the file a case describes. Rows are generic names: this tests counting,
   and using real member names in a fixture is how a fixture gets mistaken for a
   record. */
function fixture(c) {
  const electorate = c.roll - (c.excluded || 0);
  const rows = [];
  let i = 0;
  for (const p of POS) for (let k = 0; k < (c.counts[p] || 0); k++) rows.push(`| M${++i} | ${p} | 2026-10-07 |`);
  while (rows.length < electorate) rows.push(`| M${++i} | — | |`);
  for (let k = 0; k < (c.excluded || 0); k++) rows.push(`| R${k + 1} | excluded | |`);
  return [
    '# Vote — PR #1: fixture', '',
    '**Procedure:** fixture',
    `**Carries if:** the Constitution's words — **${c.expect.required ?? 0} of ${electorate}**`,
    '**Opened:** 2026-10-06 12:00 UK (`2026-10-06T12:00:00+01:00`)',
    '**Closes:** 2026-10-13 12:00 UK (`2026-10-13T12:00:00+01:00`)',
    `**Entitled to vote:** ${electorate} members, frozen when this vote opened — \`members.md\` blob \`abc1234\``, '',
    '| Member | Position | Date |', '|---|---|---|',
    ...rows, '',
    '<!-- preference toleration abstention objection — guidance, must not be counted -->',
  ].join('\n');
}

const results = [];
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  results.push(ok);
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${name}`);
  if (!ok) console.log(`          got  ${JSON.stringify(got)}\n          want ${JSON.stringify(want)}`);
};

for (const c of corpus.cases) {
  const electorate = c.roll - (c.excluded || 0);
  const responders = POS.reduce((n, p) => n + (c.counts[p] || 0), 0);
  const v = voteOf(fixture(c));
  check(c.name, {
    roll: v.roll,
    counts: v.counts,
    awaiting: v.awaiting.length,
    required: v.required,
  }, {
    roll: electorate,                       // an excluded respondent is not on the roll
    counts: POS.reduce((o, p) => ({ ...o, [p]: c.counts[p] || 0 }), {}),
    awaiting: electorate - responders,
    required: c.expect.required ?? 0,
  });
}

/* The guidance comment in the template contains the four position words. A
   reader that counted them would inflate every tally on the page. */
const commented = voteOf([
  '**Carries if:** words — **8 of 2**',
  '| Member | Position | Date |', '|---|---|---|',
  '| A | preference | 2026-10-07 |', '| B | — | |',
  '<!--', '| Z | preference | 2026-10-07 |', 'preference preference preference', '-->',
].join('\n'));
check('html comments are not counted', [commented.roll, commented.counts.preference], [2, 1]);

/* A free-text cell can never reach the Position column, but if the table shape
   changed, a row whose position is unrecognised must read as "not answered"
   rather than being silently bucketed as support. */
const junk = voteOf(['| Member | Position | Date |', '|---|---|---|', '| A | yes | x |', '| B | preference | x |'].join('\n'));
check('an unrecognised position is not support', [junk.counts.preference, junk.awaiting], [1, ['A']]);

/* The page computes a threshold only when opening a vote. It must agree with
   tally.py on every case that states one, including the two rounding rules —
   a majority is more than half, a named fraction rounds up. */
const thresholds = JSON.parse(readFileSync(join(HERE, '..', '..', 'docs', 'data.json'), 'utf8')).thresholds;
for (const c of corpus.cases) {
  const spec = thresholds[c.procedure];
  if (!spec || c.expect.required == null || spec.over === 'voting' || spec.over === 'others-voting') continue;
  const electorate = c.roll - (c.excluded || 0);
  check(`requiredFor ${c.name}`, requiredFor(spec, electorate), c.expect.required);
}
check('a majority of 14 is 8, not 7', requiredFor({ rule: 'majority' }, 14), 8);
check('two-thirds of 14 rounds up to 10', requiredFor({ rule: 'fraction', num: 2, den: 3 }, 14), 10);
check('two-thirds of 13 rounds up to 9', requiredFor({ rule: 'fraction', num: 2, den: 3 }, 13), 9);
check('half of 13 rounds up to 7', requiredFor({ rule: 'fraction', num: 1, den: 2 }, 13), 7);

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
