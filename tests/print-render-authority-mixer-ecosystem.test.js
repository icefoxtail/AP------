const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const unitPast = fs.readFileSync(path.join(root, 'archive', 'unit-past-exams.js'), 'utf8');
const mixer = fs.readFileSync(path.join(root, 'archive', 'mixed_engine.html'), 'utf8');

function sourceBetween(text, start, end) {
  const startAt = text.indexOf(start);
  const endAt = text.indexOf(end, startAt);
  assert.ok(startAt >= 0 && endAt > startAt, `could not isolate ${start}`);
  return text.slice(startAt, endAt);
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    values
  };
}

test('unit-past producer writes the real mixed storage contract with canonical provenance header metadata', () => {
  const storeMixedPayload = sourceBetween(unitPast, 'function storeMixedPayload', 'function appendSessionHash');
  const localStorage = memoryStorage();
  const context = {
    String, Number, Date, JSON, Map, Set, localStorage,
    getProfile: () => ({ grade: 'M3', gradeLabel: '중3' }),
    getPaperSources: () => [{ label: '2026 · Fixture School · 1학기 중간' }],
    core: {
      getSubUnitLabel: record => record.subUnitLabel || '다항식',
      getDifficultyBucket: record => record.difficulty || '중',
      getQuestionUid: question => question.sourceQuestionUid || ''
    }
  };
  vm.createContext(context);
  vm.runInContext(storeMixedPayload, context, { filename: 'unit-past-store-mixed-payload.js' });

  const unit = { key: 'm3-poly', name: '다항식', course: '수학' };
  const paper = {
    title: '단원별 기출 fixture', snapshotKey: 'unit-past-fixture-key', school: 'Fixture School', schoolKey: 'fixture',
    selection: { mode: 'quick', collection: { scopeLabel: '1학기 중간', course: '수학' } },
    records: [{ sourceFile: 'exams/fixture.js', subUnitKey: 'poly', subUnitLabel: '다항식', difficulty: '중', metadataRevision: 'archive-metadata-v1' }]
  };
  const questions = [{ id: 1, sourceQuestionUid: 'unit-past-q-1' }];
  const meta = context.storeMixedPayload(unit, paper, questions);

  assert.deepEqual(JSON.parse(localStorage.getItem('mixedQuestions_unit-past-fixture-key')), questions);
  const storedMeta = JSON.parse(localStorage.getItem('mixedMeta_unit-past-fixture-key'));
  assert.equal(storedMeta.title, paper.title);
  assert.equal(storedMeta.printHeaderOptions.metaRight, '중3 수학 단원별 기출');
  assert.deepEqual(storedMeta.questionUids, ['unit-past-q-1']);
  assert.equal(meta.sourceSummary, '출처: 2026 · Fixture School · 1학기 중간');
});

test('archive index consumer launches the existing mixer with the stored unit-past key, requested mode, and production QPP', () => {
  const goUnitPastMixedEngine = sourceBetween(indexHtml, 'function goUnitPastMixedEngine', 'function launchIndexExamOutput');
  const localStorage = memoryStorage();
  localStorage.setItem('mixedQuestions_unit-past-fixture-key', JSON.stringify([{ id: 1 }]));
  const opened = [];
  const alerts = [];
  const context = {
    URL, String, Number, localStorage,
    window: { location: { href: 'http://localhost/archive/index.html' }, open: url => opened.push(url) },
    alert: message => alerts.push(message),
    resolveExamQuestionCountForAssignment: () => 8,
    appendCurrentArchiveSessionToHash: url => url
  };
  vm.createContext(context);
  vm.runInContext(goUnitPastMixedEngine, context, { filename: 'archive-index-unit-past-consumer.js' });
  context.goUnitPastMixedEngine({ unitPastSnapshotKey: 'unit-past-fixture-key' }, 'sol', 6, { submitQr: true, classId: 'class-1' });

  assert.equal(alerts.length, 0);
  assert.equal(opened.length, 1);
  const url = new URL(opened[0]);
  assert.equal(url.pathname, '/archive/mixed_engine.html');
  assert.equal(url.searchParams.get('key'), 'unit-past-fixture-key');
  assert.equal(url.searchParams.get('mode'), 'sol');
  assert.equal(url.searchParams.get('qpp'), '6');
  assert.equal(url.searchParams.get('q'), '8');
  assert.equal(url.searchParams.get('submitQr'), '1');
  assert.equal(url.searchParams.get('class'), 'class-1');

  context.goUnitPastMixedEngine({ unitPastSnapshotKey: 'missing' }, 'exam', 4);
  assert.equal(opened.length, 1, 'expired snapshots must not open an engine URL');
  assert.match(alerts[0], /만료/);
});

test('Mixer retains its PDF viewer as a separate adapter path without inventing a fourth canonical renderer mode', () => {
  assert.match(mixer, /if \(AppState\.mode === 'pdf' && file\)/);
  assert.match(mixer, /document\.getElementById\('pdf-viewer'\)\.src = file;/);
  assert.match(mixer, /id="btn-pdf-link"/);
  assert.match(mixer, /window\.open\(file, '_blank'\)/);
  assert.doesNotMatch(mixer, /renderQuestionHTML\([^)]*mode:\s*['"]pdf/);
});
