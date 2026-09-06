const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const engine = fs.readFileSync(path.join(root, 'apmath', 'wrong_print_engine.html'), 'utf8');
const launcher = fs.readFileSync(path.join(root, 'tests', 'fixtures', 'wrong-print-layout-launcher.html'), 'utf8');

test('Clinic adapter restores source identity before opt-in single-student dual-run and retains recipient legacy paths', () => {
  assert.match(engine, /src="\.\.\/archive\/print-contract\.js\?v=20260906\.2"/);
  assert.match(engine, /src="\.\.\/archive\/render-authority\.js\?v=20260906\.5"/);
  assert.match(engine, /function buildClinicCanonicalData\(\)/);
  assert.match(engine, /function recordClinicDualRun\(area\)/);
  assert.match(engine, /recipient-composition-legacy-only/);
  assert.match(engine, /q\._sourceQuestionOrdinal = bank\.indexOf\(original\) \+ 1/);
  assert.match(engine, /box\.dataset\.sourceRef = getClinicQuestionSourceRef/);
  assert.match(engine, /maybeInsertStudentDuplexBreak/);
  assert.match(engine, /renderStudentReviewPacket/);
  assert.match(launcher, /renderAuthorityDualRun=1/);
});

test('Clinic single-student restored-source browser fixture records parity across all three modes', () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, 'reports', 'print-render-authority-v2.2', 'phase-5-clinic-browser-fixture.json'), 'utf8'));
  assert.equal(evidence.kind, 'actual-browser-dual-run');
  assert.equal(evidence.source.studentCount, 1);
  assert.deepEqual(evidence.results.map(result => result.mode), ['exam', 'solution', 'answer']);
  assert.ok(evidence.results.every(result => result.dualRunEqual === true && result.renderError === ''));
});
