const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('../archive/render-authority.js');

function question(overrides = {}) {
  return {
    sourceRef: { sourceArchiveFile: 'exams/a.js', sourceQuestionUid: 'uid-1', sourceQuestionOrdinal: 1, sourceQuestionNo: 1 },
    displayNo: 1,
    content: '문항 내용',
    choices: ['① $x$', '② y'],
    answer: '①',
    solution: '해설',
    image: 'q.png',
    imageSize: 'large',
    solutionImage: 's.svg',
    solutionImageAlt: '해설 그래프',
    solutionImageCaption: '그래프',
    solutionImageSize: 'medium',
    choiceColumns: 2,
    sourcePayload: { id: 1 },
    ...overrides
  };
}

const renderOptions = {
  resolveAssetUrl(assetRef, q, ref) {
    assert.equal(q.sourceRef.sourceQuestionUid, ref.sourceQuestionUid);
    return `/assets/${assetRef}`;
  },
  wrapLatex(value) { return `latex(${value})`; }
};

test('Question authority emits canonical exam, answer, and solution semantics', () => {
  const exam = A.renderQuestionHTML(question(), { ...renderOptions, mode: 'exam' });
  const answer = A.renderQuestionHTML(question(), { ...renderOptions, mode: 'answer' });
  const solution = A.renderQuestionHTML(question(), { ...renderOptions, mode: 'solution' });
  assert.match(exam, /class="choices choices-grid"/);
  assert.match(exam, /grid-template-columns:repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(exam, /class="q-image-wrap image-large"/);
  assert.doesNotMatch(exam, /sol-exp/);
  assert.match(answer, /class="sol-ans"/);
  assert.match(solution, /class="sol-image-wrap image-medium"/);
  assert.match(solution, /alt="해설 그래프"/);
  assert.match(solution, /class="sol-image-caption">그래프/);
  assert.match(solution, /class="sol-exp">latex\(해설\)/);
});

test('Question authority requires adapter-owned asset resolution and compares semantic parity deterministically', () => {
  assert.throws(() => A.renderQuestionHTML(question(), { mode: 'exam' }), /MISSING_ASSET_RESOLVER/);
  const shared = A.renderQuestionHTML(question(), { ...renderOptions, mode: 'solution' });
  const parity = A.compareQuestionSemantics(shared, shared);
  assert.equal(parity.equal, true);
  assert.deepEqual(parity.differences, []);
  const drift = A.compareQuestionSemantics(shared.replace('sol-image-wrap', 'missing-image-wrap'), shared);
  assert.equal(drift.equal, false);
  assert.deepEqual(drift.differences.map(item => item.key), ['solutionImageCount']);
});
