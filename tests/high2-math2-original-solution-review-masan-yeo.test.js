const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const archiveFile = 'original/high/h2/2mid/25_매산여고_2학기_중간_고2_수학II.js';
const examPath = path.join(root, 'archive', 'exams', archiveFile);
const assetDir = path.join(root, 'archive', 'assets', 'images', '25_매산여고_2학기_중간_고2_수학II');

function load(file) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 3000 });
  return context.window.questionBank;
}

test('25 매산여고 수학II는 23개 해설과 canonical metadata를 닫고 q2/q13 visuals를 등록한다', () => {
  const questions = load(examPath);
  assert.equal(questions.length, 23);
  assert.deepEqual(Array.from(questions, q => Number(q.id)), Array.from({ length: 23 }, (_, i) => i + 1));
  assert.ok(questions.every(q => String(q.solution || '').trim().length > 0));
  for (const id of [5, 6, 9, 12, 18]) {
    const q = questions.find(row => row.id === id);
    assert.equal(q.subUnitKey, 'H15-M2-03-DERIVATIVE');
    assert.equal(q.subUnit, '미분');
  }
  for (const id of [2, 13]) {
    const q = questions.find(row => row.id === id);
    assert.equal(q.solutionImage, `assets/images/25_매산여고_2학기_중간_고2_수학II/q${id}-solution.svg`);
    assert.equal(q.solutionImageStatus, 'asset_verified');
    assert.equal(fs.existsSync(path.join(assetDir, `q${id}-solution.svg`)), true);
  }
});

test('q2/q13 visual semantic mutations fail the common comparator', async () => {
  const { compareVisualFacts } = await import('../archive/tools/pipeline-core/visual.mjs');
  const reportDir = path.join(root, 'reports', 'solution-review-v2.2', '25_매산여고_2학기_중간_고2_수학II');
  for (const id of [2, 13]) {
    const expected = JSON.parse(fs.readFileSync(path.join(reportDir, `pipeline-v1-q${id}-fact.json`), 'utf8'));
    const observed = structuredClone(expected);
    observed.semantic.points[0].x += 0.1;
    assert.equal(compareVisualFacts(expected, observed).status, 'FAIL', `q${id} mutation must fail`);
  }
});
