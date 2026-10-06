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

const b64 = s => Buffer.from(s, 'utf8').toString('base64');

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
  pull = { state: 'open', draft: false, head: { ref: 'feature', repo: { full_name: 'o/r' } }, html_url: 'PRURL' },
  pullMissing = false,
  putFails = [],            // statuses to throw before succeeding
  fileAfterConflict = null, // what another voter left behind
} = {}) {
  const comments = [], added = [], warnings = [], writes = [];
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
      addLabels: async ({ labels }) => added.push(...labels),
      update: async () => {},
    },
    pulls: { get: async () => { if (pullMissing) throw new Error('404'); return { data: pull }; } },
    repos: {
      getContent: async ({ path }) => {
        if (path === 'members.md') return { data: { content: b64(MEMBERS) } };
        if (fileMissing) throw new Error('404');
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
  await new Function('github', 'context', 'core', 'return (async()=>{' + SCRIPT + '})()')(github, context, core);
  return { comments, added, failed: warnings, writes, puts };
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

r = await run({ pullMissing: true });
check('an unknown pull request is refused', r.writes.length, 0);

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

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
