import fs from 'node:fs';
import path from 'node:path';
import { compareVisualFacts } from '../pipeline-core/visual.mjs';
import { uidSet, uidSetSha, writeNewJson } from '../pipeline-core/canonical.mjs';

const args = process.argv.slice(2);
let report;
try {
  if (!args[0] || !args[1]) throw new Error('Expected and observed JSONL files are required');
  const read = file => fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
  const expected = read(args[0]), observed = read(args[1]);
  const expectedUids = uidSet(expected.map(f => f.questionUid)), observedUids = uidSet(observed.map(f => f.questionUid));
  if (!expected.length || JSON.stringify(expectedUids) !== JSON.stringify(observedUids)) throw new Error('NONEMPTY_EXACT_UID_COVERAGE_REQUIRED');
  const byUid = new Map(observed.map(f => [f.questionUid, f]));
  const results = expected.map(fact => ({ questionUid: fact.questionUid, ...compareVisualFacts(fact, byUid.get(fact.questionUid)) }));
  report = { schemaVersion: 'APMATH_VISUAL_PARITY_v2', status: results.every(r => r.status === 'PASS') ? 'PASS' : 'FAIL', scope: 'TYPED_SEMANTIC_COMPARISON_ONLY_NOT_INDEPENDENT_REVIEW_OR_RELEASE', questionUidSetSha: uidSetSha(expectedUids), results };
} catch (error) { report = { status: 'FAIL', errors: [error.message] }; }
const outputIndex = args.indexOf('--out');
if (outputIndex >= 0) writeNewJson(path.resolve(args[outputIndex + 1]), report);
console.log(JSON.stringify(report, null, 2));
if (report.status !== 'PASS') process.exitCode = 1;
