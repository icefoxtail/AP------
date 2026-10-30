const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const archive2Core = require(path.join(archiveRoot, 'archive2-core.js'));

const uid = n => `qid_v1_${String(n).padStart(64, '0')}`;
const file = name => `original/high/h1/1mid/${name}.js`;

// 단원별 기출 uses the 문제지 만들기 general-use gate: verified identity, intact source reference and
// fingerprint decide usage. Metadata approval, pending review, source-issue annotations and a broken
// Meta Foundation taxonomy chain do not.
async function runPage() {
  const elements = new Map();
  class FakeElement {
    constructor(id) { this.id = id; this.innerHTML = ''; this.textContent = ''; this.value = ''; this.style = {}; this.dataset = {}; this.attributes = {};
      this.classList = { toggle() {} }; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    scrollIntoView() {}
  }
  const getElement = id => { if (!elements.has(id)) elements.set(id, new FakeElement(id)); return elements.get(id); };
  const document = {
    body: { appendChild() {} }, createElement: () => new FakeElement(''), getElementById: getElement,
    querySelectorAll: () => [], querySelector: () => null
  };
  const catalogRecord = (n, name) => ({
    questionUid: uid(n), identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED',
    sourceFile: file(name), sourceOrdinal: 1, sourceFingerprint: 'f'.repeat(64)
  });
  const index = ['24_a', '24_b', '24_c', '24_d'].map((name, i) => ({
    sourceFile: file(name), sourceOrdinal: 1, id: 1, grade: '고1', subject: '공통수학1', course: '공통수학1',
    standardUnitKey: 'H22-C-01', standardUnit: '다항식의 연산', subUnitKey: 'H22-C-01-CORE', subUnit: '핵심', level: '중',
    examYear: 2024, question_uid: uid(i + 1)
  }));
  const meta = (n, name, extra) => ({
    questionUid: uid(n), sourceArchiveFile: file(name), sourceOrdinal: 1, sourceQuestionNo: 1,
    standardUnitKey: 'H22-C-01', subUnitKey: 'H22-C-01-CORE', difficultyBucket: '중', defaultSelectable: true, ...extra
  });
  const window = {
    UnitPastExamsCore: core, Archive2Core: archive2Core, questionIndex: index,
    ARCHIVE2_FINAL_CATALOG: { records: [catalogRecord(1, '24_a'), catalogRecord(2, '24_b'), catalogRecord(4, '24_d')] },
    ARCHIVE_META_FOUNDATION_RUNTIME: { status: 'ACTIVE', ownedScopes: [], taxonomyRows: [] },
    ARCHIVE_QUESTION_METADATA: { records: [
      meta(1, '24_a', {}),
      meta(2, '24_b', { defaultSelectable: false, sourceIssueHold: true }),
      meta(3, '24_c', {}),
      meta(4, '24_d', { metaFoundationStatus: 'ACTIVE', metaFoundationPackId: 'P', problemTypeKey: 'PT_X', templateKey: 'TPL_X' })
    ] },
    __ARCHIVE_METADATA_READY__: Promise.resolve({}),
    location: new URL('http://unit.test/archive/unit-past-exams.html?ready=1&grade=h1'),
    addEventListener() {}, scrollTo() {}
  };
  const context = {
    window, document, history: { pushState() {}, replaceState() {} }, console, URL, URLSearchParams, Map, Set, Date, Math, Number,
    String, Boolean, Array, JSON, Promise,
    localStorage: { getItem: () => JSON.stringify({ role: 'teacher' }), setItem() {} },
    atob: value => Buffer.from(value, 'base64').toString('binary'), btoa: value => Buffer.from(value, 'binary').toString('base64')
  };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8'), context, { filename: 'unit-past-exams.js' });
  await window.UnitPastExams.init();
  return { window, status: getElement('unit-status').textContent, summary: getElement('unit-summary').textContent };
}

test('단원별 기출은 승인 메타와 무관하게 기술 확인된 문항을 출제 가능으로 센다', async () => {
  const { status, summary } = await runPage();
  // a (approved), b (pending review + source-issue annotation), d (broken taxonomy chain) are usable;
  // c has no catalog record, so its identity cannot be verified.
  assert.match(status, /분류 4문항 · 출제 가능 3문항/);
  assert.match(status, /\(승인 메타 1문항\)/);
  assert.match(status, /원본 확인 실패로 제외 1문항/);
  assert.match(status, /완결된 최근 연도\(2025년, 2024년 순\)부터 선택하고 같은 연도에서는 승인 메타 문항을 먼저 씁니다/);
  assert.match(summary, /^3문항/);
});

test('page join keeps approval truthful and marks usage separately', () => {
  const html = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
  assert.match(html, /generalUseEligibility/);
  assert.doesNotMatch(html, /sourceIssueHold === true \|\| meta\.sourceDefectCandidate === true\)\s*\?\s*true/);
});
