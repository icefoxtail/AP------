const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const packsPath = path.join(root, 'archive', 'assessment', 'assessment-packs-1sem.generated.js');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const ko = {
  low: '하',
  mid: '중',
  high: '상',
  diagnostic: '진단평가',
  middle1: '중1',
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(packsPath, 'utf8'), context, { filename: packsPath });

const data = context.window.APMATH_ASSESSMENT_PACKS_1SEM;
const packs = data.packs || [];

// 2026-06-18: M1 diagnostic packs raised to 하4/중12/상8=24
const specs = [
  {
    id: 'DIAG_1SEM_M1_U12_25',
    count: 24,
    mix: { [ko.low]: 4, [ko.mid]: 12, [ko.high]: 8 },
    units: ['M1-01', 'M1-02'],
    sourcePrefixes: ['types/middle/m1/'],
  },
  {
    id: 'DIAG_1SEM_M1_U34_25',
    count: 24,
    mix: { [ko.low]: 4, [ko.mid]: 12, [ko.high]: 8 },
    units: ['M1-03', 'M1-04'],
    sourcePrefixes: ['types/middle/m1/', 'similar/middle/m1/'],
  },
];

for (const spec of specs) {
  const pack = packs.find((item) => item.id === spec.id);
  assert(pack, `${spec.id} should exist`);
  assert(pack.category === ko.diagnostic, `${spec.id} should be a diagnostic pack`);
  assert(pack.grade === ko.middle1, `${spec.id} should be middle school grade 1`);
  assert(pack.questionCount === spec.count, `${spec.id} should have questionCount ${spec.count}, got ${pack.questionCount}`);
  assert(
    Array.isArray(pack.questions) && pack.questions.length === spec.count,
    `${spec.id} should have ${spec.count} questions, got ${pack.questions.length}`
  );

  const counts = pack.questions.reduce((acc, question) => {
    acc[question.level] = (acc[question.level] || 0) + 1;
    return acc;
  }, {});
  Object.entries(spec.mix).forEach(([level, count]) => {
    assert(counts[level] === count, `${spec.id} should contain ${count} ${level} questions, got ${counts[level]}`);
  });

  // Difficulty ordering: 하(1-10) → 중(11-20) → 상(21-24)
  const expectedOrder = [
    ...Array(spec.mix[ko.low]).fill(ko.low),
    ...Array(spec.mix[ko.mid]).fill(ko.mid),
    ...Array(spec.mix[ko.high]).fill(ko.high),
  ];
  assert(
    pack.questions.every((question, index) => question.level === expectedOrder[index]),
    `${spec.id} questions should be ordered 하→중→상`
  );

  // No internal duplicate source questions
  const sourceKeys = pack.questions.map((question) => `${question._sourceFile}:${question._sourceQuestionNo}`);
  assert(new Set(sourceKeys).size === sourceKeys.length, `${spec.id} should not duplicate source questions inside the pack`);

  // Source files from correct scope
  assert(
    pack.questions.every((question) => spec.sourcePrefixes.some((prefix) => String(question._sourceFile || '').startsWith(prefix))),
    `${spec.id} should use allowed source questions`
  );

  // All questions from allowed units
  assert(
    pack.questions.every((question) => spec.units.includes(question.standardUnitKey)),
    `${spec.id} should only use questions from units: ${spec.units.join(', ')}`
  );

  // difficultyMix matches
  assert(
    pack.difficultyMix[ko.low] === spec.mix[ko.low] &&
      pack.difficultyMix[ko.mid] === spec.mix[ko.mid] &&
      pack.difficultyMix[ko.high] === spec.mix[ko.high],
    `${spec.id} difficultyMix should match the new 하4/중12/상8 spec`
  );
}

// Cross-pack deduplication: M1_U12 and M1_U34 share no _qKey
const m1u12 = packs.find((p) => p.id === 'DIAG_1SEM_M1_U12_25');
const m1u34 = packs.find((p) => p.id === 'DIAG_1SEM_M1_U34_25');
const u12Keys = new Set((m1u12.questions || []).map((q) => q._qKey));
const u34Keys = (m1u34.questions || []).map((q) => q._qKey);
assert(
  u34Keys.every((k) => !u12Keys.has(k)),
  'DIAG_1SEM_M1_U12_25 and DIAG_1SEM_M1_U34_25 should share no duplicate _qKey'
);

console.log('assessment M1 diagnostic pack checks passed');
