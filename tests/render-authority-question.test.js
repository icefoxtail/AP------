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

test('Question authority carries a fullwidth solution-image layout through its render class', () => {
  const solution = A.renderQuestionHTML(question({ solutionImageLayout: 'fullwidth' }), { ...renderOptions, mode: 'solution' });
  assert.match(solution, /class="sol-image-wrap image-medium layout-fullwidth"/);
});

test('Question authority emits a curated accessible name for an external problem SVG', () => {
  const description = '원과 접선의 위치 관계 & 교점';
  const exam = A.renderQuestionHTML(question({ image: 'diagrams/circle-tangent.svg' }), {
    ...renderOptions,
    mode: 'exam',
    resolveImageDescription(assetRef, field) {
      assert.equal(assetRef, 'diagrams/circle-tangent.svg');
      assert.equal(field, 'image');
      return description;
    }
  });
  assert.match(exam, /<img src="\/assets\/diagrams\/circle-tangent\.svg" alt="원과 접선의 위치 관계 &amp; 교점">/);
});

test('Question authority lets a curated description replace a generic solution-image alt', () => {
  const solution = A.renderQuestionHTML(question({
    solutionImage: 'diagrams/circle-tangent-solution.svg',
    solutionImageAlt: '문항 1 해설 그래프'
  }), {
    ...renderOptions,
    mode: 'solution',
    resolveImageDescription(assetRef, field, canonicalQuestion, existingAlt) {
      assert.equal(assetRef, 'diagrams/circle-tangent-solution.svg');
      assert.equal(field, 'solutionImage');
      assert.equal(existingAlt, '문항 1 해설 그래프');
      return '원과 두 접선의 접점 및 교점을 나타낸 그림';
    }
  });
  assert.match(solution, /alt="원과 두 접선의 접점 및 교점을 나타낸 그림"/);
});

test('Question authority preserves a meaningful source problem-image alt when no curated record applies', () => {
  const exam = A.renderQuestionHTML(question({
    image: 'assets/images/sample/unindexed.svg',
    sourcePayload: { id: 1, imageAlt: '원 위의 점과 중심을 잇는 반지름을 나타낸 그림' }
  }), { ...renderOptions, mode: 'exam' });
  assert.match(exam, /alt="원 위의 점과 중심을 잇는 반지름을 나타낸 그림"/);
});

test('Question authority automatically uses the shared SVG index when the browser page loads it', () => {
  const previousIndex = globalThis.APSvgAccessibilityIndex;
  const previousHelper = globalThis.APSvgAccessibility;
  const helper = require('../archive/svg-accessibility.js');
  globalThis.APSvgAccessibilityIndex = {
    schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1',
    records: [{
      assetRef: 'assets/images/sample/circle.svg',
      visualRole: 'problem',
      titleKo: '원과 접선',
      descriptionKo: '원과 접선이 만나는 위치 관계를 나타낸 그림',
      sourceExamRef: 'archive/exams/sample.js',
      sourceQid: '1',
      provenanceStatus: 'SOURCE_BOUND',
      answerHintFree: true
    }]
  };
  try {
    const exam = A.renderQuestionHTML(question({ image: 'assets/images/sample/circle.svg' }), { ...renderOptions, mode: 'exam' });
    assert.match(exam, /alt="원과 접선\. 원과 접선이 만나는 위치 관계를 나타낸 그림"/);
  } finally {
    if (previousIndex === undefined) delete globalThis.APSvgAccessibilityIndex;
    else globalThis.APSvgAccessibilityIndex = previousIndex;
    if (previousHelper === undefined) delete globalThis.APSvgAccessibility;
    else globalThis.APSvgAccessibility = previousHelper;
  }
});

test('Question authority retains meaningful Korean context and adds curated solution relation detail', () => {
  const previousIndex = globalThis.APSvgAccessibilityIndex;
  const previousHelper = globalThis.APSvgAccessibility;
  globalThis.APSvgAccessibility = require('../archive/svg-accessibility.js');
  globalThis.APSvgAccessibilityIndex = {
    schemaVersion: 'SVG_STUDENT_ACCESSIBILITY_V1',
    records: [{
      assetRef: 'assets/images/sample/solution.svg',
      visualRole: 'solution',
      titleKo: '두 접선과 교점',
      descriptionKo: '원에 접하는 두 직선의 접점과 교점을 나타낸 그림',
      sourceExamRef: 'archive/exams/sample.js',
      sourceQid: '1',
      provenanceStatus: 'SOURCE_BOUND',
      answerHintFree: true
    }]
  };
  try {
    const meaningful = A.renderQuestionHTML(question({
      solutionImage: 'assets/images/sample/solution.svg',
      solutionImageAlt: '원과 접점의 위치를 나타낸 그림'
    }), { ...renderOptions, mode: 'solution' });
    const genericEnglish = A.renderQuestionHTML(question({
      solutionImage: 'assets/images/sample/solution.svg',
      solutionImageAlt: 'Question 1 solution graph'
    }), { ...renderOptions, mode: 'solution' });
    assert.match(meaningful, /alt="원과 접점의 위치를 나타낸 그림\. 두 접선과 교점\. 원에 접하는 두 직선의 접점과 교점을 나타낸 그림"/);
    assert.match(genericEnglish, /alt="두 접선과 교점\. 원에 접하는 두 직선의 접점과 교점을 나타낸 그림"/);
  } finally {
    if (previousIndex === undefined) delete globalThis.APSvgAccessibilityIndex;
    else globalThis.APSvgAccessibilityIndex = previousIndex;
    if (previousHelper === undefined) delete globalThis.APSvgAccessibility;
    else globalThis.APSvgAccessibility = previousHelper;
  }
});

test('Question authority requires adapter-owned asset resolution and compares semantic parity deterministically', () => {
  assert.throws(() => A.renderQuestionHTML(question(), { mode: 'exam' }), /MISSING_ASSET_RESOLVER/);
  const shared = A.renderQuestionHTML(question(), { ...renderOptions, mode: 'solution' });
  const parity = A.compareQuestionSemantics(shared, shared);
  assert.equal(parity.equal, true);
  assert.deepEqual(parity.differences, []);
  const drift = A.compareQuestionSemantics(shared.replace('sol-image-wrap', 'missing-image-wrap'), shared);
  assert.equal(drift.equal, false);
  assert.deepEqual(drift.differences.map(item => item.key).slice(0, 2), ['solutionImageCount', 'semanticFingerprint']);
  assert.ok(drift.differences.some(item => item.key === 'question[0].solutionImages'));
});

test('Semantic fingerprint rejects equal-count content, answer, choice, image, table, and standalone-view drift', () => {
  const baseline = '<article class="q-box" data-source-ref="a#1"><div class="q-content"><table><tr><td>표 값</td></tr></table><div class="question-note-box">[보기] ㄱ. 조건</div>본문</div><div class="q-image-wrap"><img src="q-a.png" alt=""></div><div class="choices choices-grid"><div class="choice-item"><span class="choice-no">①</span><span class="choice-text">가</span></div></div><div class="sol-meta"><div class="sol-ans">[정답] ①</div><span class="sol-image-wrap"><img src="s-a.svg" alt="그래프"><span class="sol-image-caption">캡션</span></span><div class="sol-exp">해설 A</div></div></article>';
  const mutations = [
    baseline.replace('본문', '다른 본문'),
    baseline.replace('[정답] ①', '[정답] ②'),
    baseline.replace('>가</span>', '>나</span>'),
    baseline.replace('q-a.png', 'q-b.png'),
    baseline.replace('표 값', '다른 표 값'),
    baseline.replace('[보기] ㄱ. 조건', '보기에서 조건')
  ];
  for (const mutation of mutations) {
    const parity = A.compareQuestionSemantics(baseline, mutation);
    assert.equal(parity.equal, false, mutation);
    assert.ok(parity.differences.some(item => item.key === 'semanticFingerprint'));
    assert.ok(parity.differences.some(item => /^question\[0\]\.(?:content|contentMarkup|choices|answers|questionImages|tables|viewBlocks|semanticMarkup)/.test(item.key)));
  }
  const fingerprint = A.semanticFingerprint(baseline);
  assert.match(fingerprint.hash, /^[0-9a-f]{8}$/);
  assert.equal(fingerprint.questionCount, 1);
});

test('Answer authority fingerprints number, value order, and source identity rather than only answer-cell count', () => {
  const first = A.renderAnswerEntryHTML(question(), { formatAnswer: value => String(value) });
  const second = A.renderAnswerEntryHTML(question({ displayNo: 2, sourceRef: { sourceArchiveFile: 'exams/a.js', sourceQuestionUid: 'uid-2', sourceQuestionOrdinal: 2, sourceQuestionNo: 2 }, answer: '②' }), { formatAnswer: value => String(value) });
  const baseline = first + second;
  assert.equal(A.compareAnswerSemantics(baseline, baseline).equal, true);
  const drift = A.compareAnswerSemantics(baseline, baseline.replace('>②</div>', '>③</div>'));
  assert.equal(drift.equal, false);
  assert.ok(drift.differences.some(item => item.key === 'answerFingerprint'));
});

test('Question authority escapes data-SVG asset attributes without truncating quotes in the URL', () => {
  const dataSvg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E';
  const html = A.renderQuestionHTML(question({ image: dataSvg }), { ...renderOptions, mode: 'exam' });
  assert.match(html, /xmlns=&quot;http:\/\/www\.w3\.org\/2000\/svg&quot;/);
});
