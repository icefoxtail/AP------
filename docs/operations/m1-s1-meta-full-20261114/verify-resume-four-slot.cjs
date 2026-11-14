// Validate only the changed review proposal; never write source or original 4-slot evidence.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), assert = require('assert');
const root = path.resolve(__dirname, '../../..');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(path.join(root, p));
const op = 'docs/operations/m1-s1-meta-full-20261114';
const patchPath = op + '/residual/worker-b/four-slot-patches.json';
const patchBytes = read(patchPath), patches = JSON.parse(patchBytes).patches;
const { validateData, loadDict, DEFAULT_DICT } = require(path.join(root, 'tools/4slot/validate-4slot.cjs'));
const dict = loadDict(root, DEFAULT_DICT), rows = [];
assert.equal(patches.length, 1);
for (const p of patches) {
  assert.equal(p.op, 'replace_goal_only');
  const beforeBytes = read(p.targetReviewFile), d = JSON.parse(beforeBytes);
  const item = d.items.find(x => x.questionUid === p.questionUid);
  assert(item && item.sourceOrdinal === p.sourceOrdinal);
  assert.deepStrictEqual(item.slots.goal, p.before);
  assert.deepStrictEqual(item.slots.method, []);
  assert.deepStrictEqual(p.methodAfter, []);
  assert.deepStrictEqual(p.after[1], p.before[1]);
  assert.equal(p.after[0].term, '판정');
  assert(dict.terms.some(x => x.id === 132 && x.ko === '판정' && x.status !== 'RETIRED'));
  item.slots.goal = p.after;
  const result = validateData(d, { root, dict });
  const expected = d.items.map(x => `#${x.sourceOrdinal} empty method`);
  const unexpected = result.fail.filter(x => !expected.includes(x));
  const missingExpected = expected.filter(x => !result.fail.includes(x));
  assert.deepStrictEqual(unexpected, []);
  assert.deepStrictEqual(missingExpected, []);
  assert.equal(result.fail.length, 24);
  assert.deepStrictEqual(read(p.targetReviewFile), beforeBytes);
  rows.push({ patchId: p.patchId, sourceOrdinal: p.sourceOrdinal, questionUid: p.questionUid,
    targetReviewFile: p.targetReviewFile, unchangedOriginalSha256: sha(beforeBytes),
    currentSourceSha256: sha(read('archive/exams/' + d.sourceArchiveFile)),
    proposalAppliedInMemoryOnly: true, methodRemainsEmpty: true, sourceEdits: 0,
    officialValidator: { stats: result.stats, expectedEmptyMethodFailures: result.fail,
      unexpectedFailures: unexpected, warnings: result.warn } });
}
const report = { schemaVersion: 'm1-s1-resume-four-slot-proposal-validation-v1',
  taskId: 'ef319e48-5efb-4d99-a4ac-5ded7ac1d74d',
  status: 'CHANGED_GOAL_PROPOSAL_VALIDATED_WITH_24_EXPECTED_METHOD_DEBTS',
  qualityStatus: 'NOT_A_FULL_SEMANTIC_OR_RELEASE_PASS',
  patchPath, patchSha256: sha(patchBytes),
  validatorPath: 'tools/4slot/validate-4slot.cjs', validatorSha256: sha(read('tools/4slot/validate-4slot.cjs')),
  dictionaryPath: DEFAULT_DICT, dictionarySha256: sha(read(DEFAULT_DICT)), rows };
if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, changedGoals: rows.length,
  checkedItems: rows.reduce((s,x)=>s+x.officialValidator.stats.items,0),
  expectedEmptyMethodFailures: rows.reduce((s,x)=>s+x.officialValidator.expectedEmptyMethodFailures.length,0),
  unexpectedFailures: 0, warningCount: rows.reduce((s,x)=>s+x.officialValidator.warnings.length,0) }));
