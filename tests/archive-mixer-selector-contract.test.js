const assert = require('node:assert/strict');
const fs = require('node:fs');
const selector = require('../archive/mixer-selector.js');

const mixerHtml = fs.readFileSync(require('node:path').join(__dirname, '..', 'archive', 'mixer.html'), 'utf8');
assert.match(mixerHtml, /mixer-selector\.js\?v=20260825\.1/);
assert.match(mixerHtml, /evaluateHardConstraints\(pool/);
assert.match(mixerHtml, /validateBlueprintSet/);
assert.match(mixerHtml, /lastAutoGenValidation && !lastAutoGenValidation\.ok/);
assert.match(mixerHtml, /function togglePin\(qKey\)/, 'pin toggle path missing');
assert.match(mixerHtml, /const pinnedItems = mode === 'rebuild' \? cart\.filter\(c => pinnedKeys\.has\(c\._qKey\)\)/, 'rebuild must preserve pinned cart items');
assert.match(mixerHtml, /function adjustDifficultyPlanForPinned\(plan, pinnedItems\)/, 'rebuild must reserve slots for pinned difficulty items');
assert.match(mixerHtml, /function adjustBlueprintRowsForPinned\(rows, pinnedItems\)/, 'rebuild must reserve slots for pinned blueprint items');
assert.match(mixerHtml, /targetCount: requestedTotal/, 'rebuild report must validate the final cart count');
assert.match(mixerHtml, /\.panel-cart \{[^}]*overflow-y: auto/, 'cart panel must keep pin controls reachable');
assert.match(mixerHtml, /\.cart-footer \{[^}]*position: static/, 'cart footer must not cover cart items');
assert.match(mixerHtml, /const executeArchiveSource = new Function\('window', 'document', source\)/, 'archive loader must isolate each JS file scope');
assert.match(mixerHtml, /return response\.text\(\)/, 'archive loader must read source text before isolated execution');
assert.doesNotMatch(mixerHtml, /slice\(0,\s*want\)/, 'legacy selector slice should be removed from mixer auto-generation');
assert.match(mixerHtml, /subUnitKey:/);
for (const id of ['ag-school-include', 'ag-school-exclude', 'ag-year-range', 'ag-recent-uids', 'ag-source-diversity', 'ag-template-max', 'ag-essay-count']) {
  assert.match(mixerHtml, new RegExp(`id="${id}"`), `3D advanced blueprint option missing: ${id}`);
}
assert.match(mixerHtml, /problemTypeKey/);

const uid = hex => `qid_v1_${hex.repeat(64).slice(0, 64)}`;

const pool = [
  {
    questionUid: uid('a'), sourceFile: 'original/high/h1/1mid/a.js', sourceOrdinal: 1,
    grade: '고1', subject: '수학', course: '수학(상)', standardUnitKey: 'H15-SA-01',
    subUnitKey: 'H15-SA-01-OPERATIONS', conceptClusterKey: 'CONCEPT_A',
    problemTypeKey: 'TYPE_A', difficultyBucket: '중', school: '금당고', year: 2024,
    tags: ['객관식', '식']
  },
  {
    questionUid: uid('b'), sourceFile: 'original/high/h1/1mid/b.js', sourceOrdinal: 2,
    grade: '고1', subject: '수학', course: '수학(상)', standardUnitKey: 'H15-SA-01',
    subUnitKey: 'H15-SA-01-OPERATIONS', conceptClusterKey: 'CONCEPT_A',
    problemTypeKey: 'TYPE_B', difficultyBucket: '상', school: '매산고', year: 2025,
    tags: ['서술형', '식']
  },
  {
    questionUid: uid('c'), sourceFile: 'original/high/h2/1mid/c.js', sourceOrdinal: 3,
    grade: '고2', subject: '수학', course: '수학II', standardUnitKey: 'H15-M2-01',
    subUnitKey: 'H15-M2-01-LIMIT', conceptClusterKey: 'CONCEPT_B',
    problemTypeKey: 'TYPE_A', difficultyBucket: '중', school: '금당고', year: 2023,
    tags: ['객관식']
  },
  {
    questionUid: 'legacy_qkey', sourceFile: 'original/high/h1/1mid/legacy.js', sourceOrdinal: 4,
    grade: '고1', subject: '수학', course: '수학(상)', standardUnitKey: 'H15-SA-01', difficultyBucket: '중'
  }
];

const request = {
  count: 1,
  grade: '고1',
  subject: '수학',
  course: '수학(상)',
  unitKeys: ['H15-SA-01'],
  subUnitKeys: ['H15-SA-01-OPERATIONS'],
  conceptKeys: ['CONCEPT_A'],
  problemTypeKeys: ['TYPE_A'],
  difficultyBucket: '중',
  includeSchools: ['금당고'],
  yearFrom: 2024,
  yearTo: 2024,
  tagsAll: ['객관식']
};

assert.equal(selector.CONTRACT_VERSION, 'archive-mixer-selector-v1');
assert.equal(selector.validateSelectionRequest(request).ok, true);
assert.equal(selector.validateSelectionRequest({ ...request, count: 0 }).ok, false);

const evaluated = selector.evaluateHardConstraints(pool, request);
assert.equal(evaluated.ok, true);
assert.equal(evaluated.eligible.length, 1);
assert.equal(evaluated.eligible[0].questionUid, pool[0].questionUid);
assert.equal(evaluated.diagnostics.rejectedByReason.invalid_identity, 1);

const recent = selector.evaluateHardConstraints(pool, { ...request, recentQuestionUids: [pool[0].questionUid] });
assert.equal(recent.ok, false);
assert.equal(recent.diagnostics.eligibleCount, 0);
assert.equal(recent.diagnostics.rejectedByReason.recent, 1);

const duplicate = selector.evaluateHardConstraints([pool[0], { ...pool[0], sourceOrdinal: 9 }], { ...request, count: 1 });
assert.equal(duplicate.ok, false);
assert.deepEqual(duplicate.diagnostics.duplicateUids, [pool[0].questionUid]);

assert.equal(selector.validateSelection([pool[0]], request).ok, true);
const wrongCount = selector.validateSelection([pool[0], pool[1]], { ...request, count: 1 });
assert.equal(wrongCount.ok, false);
assert.match(wrongCount.errors[0], /selected count/);

const deterministicRequest = {
  count: 2,
  grade: '고1',
  subject: '수학',
  course: '수학(상)',
  unitKeys: ['H15-SA-01'],
  conceptKeys: ['CONCEPT_A'],
  difficulties: ['중', '상']
};
const firstRun = selector.selectCandidates(pool, deterministicRequest, {
  selectionSeed: 'fixture-seed-20260825',
  targetDifficulty: '상',
  targetConceptKeys: ['CONCEPT_A'],
  targetProblemTypeKeys: ['TYPE_A']
});
const secondRun = selector.selectCandidates(pool, deterministicRequest, {
  selectionSeed: 'fixture-seed-20260825',
  targetDifficulty: '상',
  targetConceptKeys: ['CONCEPT_A'],
  targetProblemTypeKeys: ['TYPE_A']
});
assert.equal(firstRun.ok, true);
assert.deepEqual(firstRun.selected.map(item => item.questionUid), secondRun.selected.map(item => item.questionUid));
assert.equal(new Set(firstRun.selected.map(item => item.questionUid)).size, 2);
assert.equal(firstRun.diagnostics.selectionSeed, 'fixture-seed-20260825');
assert.ok(firstRun.diagnostics.scores.every(item => Number.isFinite(item.score)));

const constrained = selector.selectCandidates([
  { ...pool[0], templateKey: 'T1' },
  { ...pool[1], templateKey: 'T2', tags: ['서술형'] }
], { ...deterministicRequest, maxTemplateCount: 1, essayCount: 1 }, { selectionSeed: 'constraint-seed' });
assert.equal(constrained.ok, true);
assert.equal(constrained.selected.filter(item => item.tags.includes('서술형')).length, 1);

const assembled = constrained.selected.map((item, rowIndex) => ({ ...item, _blueprintRowIndex: rowIndex }));
const blueprintValidation = selector.validateBlueprintSet(assembled, [{ count: 1 }, { count: 1 }], { maxTemplateCount: 1, essayCount: 1 });
assert.equal(blueprintValidation.ok, true);
assert.equal(blueprintValidation.actualCount, 2);
assert.equal(blueprintValidation.duplicateUids.length, 0);
assert.equal(blueprintValidation.limits.essayActual, 1);
const invalidBlueprint = selector.validateBlueprintSet([assembled[0], { ...assembled[0], _blueprintRowIndex: 1 }], [{ count: 1 }, { count: 1 }]);
assert.equal(invalidBlueprint.ok, false);
assert.equal(invalidBlueprint.duplicateUids.length, 1);

console.log('archive mixer selector Phase 3A~3E contract checks passed');
