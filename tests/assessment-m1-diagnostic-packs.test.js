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

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(packsPath, 'utf8'), context, { filename: packsPath });

const data = context.window.APMATH_ASSESSMENT_PACKS_1SEM;
const packs = data.packs || [];

const specs = [
  {
    id: 'DIAG_1SEM_M1_U12_25',
    count: 24,
    mix: { '하': 4, '중': 12, '상': 8 },
    units: ['M1-01', 'M1-02'],
    sourcePrefixes: ['types/middle/m1/'],
  },
  {
    id: 'DIAG_1SEM_M1_U34_25',
    count: 24,
    mix: { '하': 4, '중': 12, '상': 8 },
    units: ['M1-03'],
    sourcePrefixes: ['similar/middle/m1/1final/'],
    titleIncludes: '3,4단원',
  },
  {
    id: 'DIAG_1SEM_M1_U45_25',
    count: 24,
    mix: { '하': 4, '중': 15, '상': 5 },
    units: ['M1-04'],
    sourcePrefixes: ['similar/middle/m1/1final/'],
    titleIncludes: '4,5단원',
  },
];

const m1Diagnostics = packs.filter((pack) => pack.category === '진단평가' && pack.grade === '중1');
assert(m1Diagnostics.length === 3, `middle 1 should have 3 diagnostic packs, got ${m1Diagnostics.length}`);

for (const spec of specs) {
  const pack = packs.find((item) => item.id === spec.id);
  assert(pack, `${spec.id} should exist`);
  assert(pack.category === '진단평가', `${spec.id} should be a diagnostic pack`);
  assert(pack.grade === '중1', `${spec.id} should be middle school grade 1`);
  assert(pack.questionCount === spec.count, `${spec.id} should have questionCount ${spec.count}, got ${pack.questionCount}`);
  assert(
    Array.isArray(pack.questions) && pack.questions.length === spec.count,
    `${spec.id} should have ${spec.count} questions, got ${pack.questions.length}`
  );
  if (spec.titleIncludes) {
    assert(pack.title.includes(spec.titleIncludes), `${spec.id} title should include ${spec.titleIncludes}`);
  }

  const counts = pack.questions.reduce((acc, question) => {
    acc[question.level] = (acc[question.level] || 0) + 1;
    return acc;
  }, {});
  Object.entries(spec.mix).forEach(([level, count]) => {
    assert(counts[level] === count, `${spec.id} should contain ${count} ${level} questions, got ${counts[level]}`);
  });
  Object.keys(counts).forEach((level) => {
    assert(level in spec.mix, `${spec.id} should not contain unexpected ${level} questions`);
  });

  const expectedOrder = Object.entries(spec.mix).flatMap(([level, count]) => Array(count).fill(level));
  assert(
    pack.questions.every((question, index) => question.level === expectedOrder[index]),
    `${spec.id} questions should be ordered by configured difficulty mix`
  );

  const sourceKeys = pack.questions.map((question) => `${question._sourceFile}:${question._sourceQuestionNo}`);
  assert(new Set(sourceKeys).size === sourceKeys.length, `${spec.id} should not duplicate source questions inside the pack`);

  assert(
    pack.questions.every((question) => spec.sourcePrefixes.some((prefix) => String(question._sourceFile || '').startsWith(prefix))),
    `${spec.id} should use allowed source questions`
  );

  assert(
    pack.questions.every((question) => spec.units.includes(question.standardUnitKey)),
    `${spec.id} should only use questions from units: ${spec.units.join(', ')}`
  );

  Object.entries(spec.mix).forEach(([level, count]) => {
    assert(pack.difficultyMix[level] === count, `${spec.id} difficultyMix.${level} should be ${count}`);
  });

  const essayCount = pack.questions.filter((question) => String(question.content || '').includes('서술형')).length;
  assert(essayCount <= 3, `${spec.id} should not overuse essay questions, got ${essayCount}`);
}

const allM1DiagnosticKeys = m1Diagnostics.flatMap((pack) => (pack.questions || []).map((question) => question._qKey));
assert(
  new Set(allM1DiagnosticKeys).size === allM1DiagnosticKeys.length,
  'middle 1 diagnostic packs should share no duplicate _qKey values'
);

console.log('assessment M1 diagnostic pack checks passed');
