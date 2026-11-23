// Turns the SVG engine shard results into one Markdown summary for the job page.
//   node tools/ci/svg-engine-test-summary.mjs <dir with node-<i>.tap and py-<i>.json>   (reads recursively)
// Reports facts only: counts, wall time per shard, and the failing tests/modules. It never changes the exit code.
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2] ?? '.';
const expectArg = process.argv.indexOf('--expect');
const expect = expectArg >= 0 ? process.argv[expectArg + 1].split(',') : ['node', 'py']; // suites that must have a result
const files = (d => { const all = []; const walk = p => { for (const e of fs.existsSync(p) ? fs.readdirSync(p, {withFileTypes: true}) : []) { const f = path.join(p, e.name); e.isDirectory() ? walk(f) : all.push(f); } }; walk(d); return all.sort(); })(dir);
const out = ['## SVG engine tests', ''];

const taps = files.filter(f => /node-\d+\.tap$/.test(f));
const pys = files.filter(f => /py-\d+\.json$/.test(f));

let nodeTotals = {tests: 0, pass: 0, fail: 0, skipped: 0, ms: 0};
const nodeFailures = [];
for (const file of taps) {
  const tap = fs.readFileSync(file, 'utf8');
  const count = key => Number((new RegExp('^# ' + key + ' (\\d+)', 'm').exec(tap) || [])[1] ?? 0);
  nodeTotals.tests += count('tests'); nodeTotals.pass += count('pass'); nodeTotals.fail += count('fail'); nodeTotals.skipped += count('skipped');
  nodeTotals.ms = Math.max(nodeTotals.ms, Number((/^# duration_ms ([\d.]+)/m.exec(tap) || [])[1] ?? 0));
  const lines = tap.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    const head = /^\s*not ok \d+ - (.*?)(?: # .*)?$/.exec(lines[i]);
    if (!head) continue;
    let type = '', location = '';
    for (let j = i + 1; j < lines.length && !/^\s*\.\.\.$/.test(lines[j]) && !/^\s*(not )?ok \d+ - /.test(lines[j]); j += 1) {
      type = /^\s*type: '(\w+)'/.exec(lines[j])?.[1] ?? type;
      location = /^\s*location: '(.*)'/.exec(lines[j])?.[1] ?? location;
    }
    if (type !== 'suite') nodeFailures.push(`${head[1]} (${location.split(/[\\/]+/).join('/').replace(/^.*?(archive\/tools\/geometry-equation\/)/, '$1')})`);
  }
}
if (taps.length || expect.includes('node')) out.push(taps.length
  ? `- node: ${taps.length} shard(s), tests ${nodeTotals.tests}, pass ${nodeTotals.pass}, fail ${nodeTotals.fail}, skipped ${nodeTotals.skipped}, slowest shard ${(nodeTotals.ms / 1000).toFixed(0)}s`
  : '- node: NOT_RUN (no TAP result)');

const pyResults = pys.flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')).results);
const pyBad = pyResults.filter(r => r.code !== 0);
if (pys.length || expect.includes('py')) out.push(pys.length
  ? `- python: ${pys.length} shard(s), ${pyResults.length} modules, ${pyResults.reduce((a, r) => a + r.ran, 0)} tests ran, ${pyBad.length} failing modules, ${pyResults.reduce((a, r) => a + r.failed.length, 0)} failing tests`
  : '- python: NOT_RUN (no result)');

if (nodeFailures.length) out.push('', '### Failing node tests', ...nodeFailures.map(f => `- ${f}`));
if (pyBad.length) out.push('', '### Failing python modules', ...pyBad.map(r => `- ${r.module}${r.note ? ` — ${r.note}` : ''}${r.failed.length ? `: ${r.failed.join('; ')}` : ''}`));
console.log(out.join('\n'));
