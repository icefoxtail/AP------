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
  low: '\uD558',
  mid: '\uC911',
  high: '\uC0C1',
  diagnostic: '\uC9C4\uB2E8\uD3C9\uAC00',
  middle1: '\uC9111',
  multiAnswer: '\uBCF5\uC218\uC815\uB2F5',
  unit3: '\uBB38\uC790\uC758 \uC0AC\uC6A9\uACFC \uC2DD',
};

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(packsPath, 'utf8'), context, { filename: packsPath });

const data = context.window.APMATH_ASSESSMENT_PACKS_1SEM;
const packs = data.packs || [];

const specs = [
  {
    id: 'DIAG_1SEM_M1_20',
    title: `${ko.middle1} 1\uB2E8\uC6D0 ${ko.diagnostic}`,
    count: 20,
    mix: { [ko.low]: 4, [ko.mid]: 13, [ko.high]: 3 },
    units: ['M1-01'],
    requiredTypeTags: { prime_composite_definition_truth: ko.multiAnswer },
  },
  {
    id: 'DIAG_1SEM_M1_U12_25',
    title: `${ko.middle1} 1~2\uB2E8\uC6D0 ${ko.diagnostic}`,
    count: 25,
    mix: { [ko.low]: 5, [ko.mid]: 14, [ko.high]: 6 },
    units: ['M1-01', 'M1-02'],
  },
  {
    id: 'DIAG_1SEM_M1_U123_25',
    title: `${ko.middle1} 1~3\uB2E8\uC6D0 ${ko.diagnostic}`,
    count: 25,
    mix: { [ko.low]: 4, [ko.mid]: 15, [ko.high]: 6 },
    units: ['M1-01', 'M1-02', 'M1-03'],
  },
];

for (const spec of specs) {
  const pack = packs.find((item) => item.id === spec.id);
  assert(pack, `${spec.id} should exist`);
  assert(pack.title === spec.title, `${spec.id} should keep the requested title`);
  assert(pack.category === ko.diagnostic, `${spec.id} should be a diagnostic pack`);
  assert(pack.grade === ko.middle1, `${spec.id} should be middle school grade 1`);
  assert(pack.questionCount === spec.count, `${spec.id} should expose questionCount ${spec.count}`);
  assert(Array.isArray(pack.questions) && pack.questions.length === spec.count, `${spec.id} should have ${spec.count} questions`);

  const counts = pack.questions.reduce((acc, question) => {
    acc[question.level] = (acc[question.level] || 0) + 1;
    return acc;
  }, {});
  Object.entries(spec.mix).forEach(([level, count]) => {
    assert(counts[level] === count, `${spec.id} should contain ${count} ${level} questions after stage-3 review`);
  });

  const expectedOrder = [
    ...Array(spec.mix[ko.low]).fill(ko.low),
    ...Array(spec.mix[ko.mid]).fill(ko.mid),
    ...Array(spec.mix[ko.high]).fill(ko.high),
  ];
  assert(
    pack.questions.every((question, index) => question.level === expectedOrder[index]),
    `${spec.id} questions should be ordered by difficulty low-mid-high`
  );

  const sourceKeys = pack.questions.map((question) => `${question._sourceFile}:${question._sourceQuestionNo}`);
  assert(new Set(sourceKeys).size === sourceKeys.length, `${spec.id} should not duplicate source questions inside the pack`);

  const diagnosticTypes = pack.questions.map((question) => question._diagnosticType);
  assert(
    diagnosticTypes.every((type) => typeof type === 'string' && type.length > 0),
    `${spec.id} should label every question with a diagnostic type`
  );
  assert(
    new Set(diagnosticTypes).size === diagnosticTypes.length,
    `${spec.id} should not duplicate diagnostic types inside the pack`
  );
  assert(
    pack.questions.every((question) => String(question._sourceFile || '').startsWith('types/middle/m1/')),
    `${spec.id} should use M1 type JS source questions`
  );
  assert(
    pack.questions.every((question) => spec.units.includes(question.standardUnitKey)),
    `${spec.id} should only use questions from the requested units`
  );
  assert(
    pack.questions.every((question) => question.standardUnitKey !== 'M1-03' || question.standardUnit === ko.unit3),
    `${spec.id} should use the official M1-03 standard unit name`
  );

  Object.entries(spec.requiredTypeTags || {}).forEach(([diagnosticType, tag]) => {
    const question = pack.questions.find((item) => item._diagnosticType === diagnosticType);
    assert(question, `${spec.id} should include diagnostic type ${diagnosticType}`);
    assert(Array.isArray(question.tags) && question.tags.includes(tag), `${spec.id} ${diagnosticType} should include ${tag} tag`);
  });
}

console.log('assessment M1 diagnostic pack checks passed');
