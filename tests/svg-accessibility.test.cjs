const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const helperPath = path.join(__dirname, '..', 'archive', 'svg-accessibility.js');

function loadAccessibilityHelper() {
  assert.ok(fs.existsSync(helperPath), 'shared SVG accessibility helper must exist');
  return require(helperPath);
}

const records = [
  {
    assetRef: 'assets/images/sample/circle.svg',
    visualRole: 'problem',
    titleKo: '원과 접선',
    descriptionKo: '원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림',
    sourceExamRef: 'archive/exams/sample.js',
    sourceQid: '1',
    provenanceStatus: 'SOURCE_BOUND',
    answerHintFree: true
  },
  {
    assetRef: 'assets/generated-lite/circle-solution.svg',
    visualRole: 'solution',
    titleKo: '원과 두 접선',
    descriptionKo: '원과 두 접선의 접점 및 두 직선의 교점을 나타낸 그림',
    sourceExamRef: 'archive/exams/sample.js',
    sourceQid: '2',
    provenanceStatus: 'SOURCE_BOUND',
    answerHintFree: true
  }
];

test('SVG accessibility resolver normalizes same-origin absolute and relative refs and prefers curated text to generic English', () => {
  const { createResolver } = loadAccessibilityHelper();
  const resolve = createResolver(records, { baseUrl: 'https://example.test/AP------/archive/engine.html' });
  const alt = resolve('/archive/assets/images/sample/circle.svg?v=123', 'problem', 'APMath student geometry visual');
  assert.equal(alt, '원과 접선. 원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림');
  assert.equal(resolve('https://example.test/AP------/archive/assets/images/sample/circle.svg?v=456', 'problem', 'APMath student geometry visual'), alt);
});

test('SVG accessibility resolver preserves meaningful Korean context and appends curated relation detail', () => {
  const { createResolver } = loadAccessibilityHelper();
  const resolve = createResolver(records, { baseUrl: 'https://example.test/archive/engine.html' });
  assert.equal(
    resolve('assets/images/sample/circle.svg', 'problem', undefined, '접점의 위치를 나타낸 그림'),
    '접점의 위치를 나타낸 그림. 원과 접선. 원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림'
  );
  assert.equal(
    resolve('assets/images/sample/circle.svg', 'problem', undefined, '접점의 위치를 나타낸 그림.'),
    '접점의 위치를 나타낸 그림. 원과 접선. 원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림'
  );
  assert.equal(resolve('assets/images/sample/circle.svg', 'problem', undefined, '원과 접선'), '원과 접선. 원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림');
  assert.equal(resolve('assets/generated-lite/circle-solution.svg', 'problem', ''), '');
});

test('SVG accessibility resolver replaces generic Korean internal alt summaries and mixed English prose', () => {
  const { createResolver } = loadAccessibilityHelper();
  const resolve = createResolver(records, { baseUrl: 'https://example.test/archive/engine.html' });
  const genericKorean = resolve('assets/generated-lite/circle-solution.svg', 'solution', undefined, '도형의 이동 문항 7의 핵심 관계를 표시한 해설 도형');
  const mixedEnglish = resolve('assets/generated-lite/circle-solution.svg', 'solution', undefined, '그림에 표시한 negative branch 관계');
  assert.equal(genericKorean, '원과 두 접선. 원과 두 접선의 접점 및 두 직선의 교점을 나타낸 그림');
  assert.equal(mixedEnglish, '원과 두 접선. 원과 두 접선의 접점 및 두 직선의 교점을 나타낸 그림');
});

test('SVG accessibility resolver skips unsafe, data, blob, cross-origin, and unknown asset refs', () => {
  const { createResolver } = loadAccessibilityHelper();
  const resolve = createResolver(records, { baseUrl: 'https://example.test/archive/engine.html' });
  for (const ref of [
    'data:image/svg+xml,%3Csvg/%3E',
    'blob:https://example.test/123',
    'https://other.test/archive/assets/images/sample/circle.svg',
    'assets/images/not-indexed.svg',
    '../../outside.svg'
  ]) {
    assert.equal(resolve(ref, 'problem', ''), '', ref);
  }
});

test('SVG accessibility resolver supports the archive direct file URL path', () => {
  const { normalizeAssetRef, createResolver } = loadAccessibilityHelper();
  const baseUrl = 'file:///C:/repo/archive/engine.html';
  assert.equal(normalizeAssetRef('file:///C:/repo/archive/assets/images/sample/circle.svg', baseUrl), 'assets/images/sample/circle.svg');
  const resolve = createResolver(records, { baseUrl });
  assert.equal(resolve('assets/images/sample/circle.svg', 'problem', ''), '원과 접선. 원과 접선이 두 점에서 만나는 위치 관계를 나타낸 그림');
});

test('SVG accessibility resolver rejects records that may reveal an answer', () => {
  const { createResolver } = loadAccessibilityHelper();
  const resolve = createResolver([{
    ...records[0],
    answerHintFree: false
  }], { baseUrl: 'https://example.test/archive/engine.html' });
  assert.equal(resolve('assets/images/sample/circle.svg', 'problem', ''), '');
});

test('SVG accessibility resolver permits source-bound solution descriptions with answer details only in solution mode', () => {
  const { createResolver } = loadAccessibilityHelper();
  const answerBearingSolution = {
    ...records[1],
    answerHintFree: false,
    descriptionKo: '계산을 마쳐 얻은 값 8을 나타낸 해설 그림'
  };
  const resolve = createResolver([answerBearingSolution], { baseUrl: 'https://example.test/archive/engine.html' });
  assert.equal(resolve('assets/generated-lite/circle-solution.svg', 'solution', undefined, ''), '원과 두 접선. 계산을 마쳐 얻은 값 8을 나타낸 해설 그림');
  assert.equal(resolve('assets/generated-lite/circle-solution.svg', 'problem', undefined, ''), '');
});
