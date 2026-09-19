const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const qaPath = path.join(root, 'tests', 'archive-unit-past-exams-browser-qa.mjs');
const runnerPath = path.join(root, 'tools', 'run-tests.js');
const qa = fs.readFileSync(qaPath, 'utf8');
const runner = fs.readFileSync(runnerPath, 'utf8');

test('단원별 기출 브라우저 QA 계약은 CI 테스트 수집 대상이며 핵심 흐름을 포함한다', () => {
  assert.match(runner, /name\.endsWith\('\.test\.js'\)/);
  assert.match(qa, /export async function runUnitPastExamsBrowserQA/);
  for (const marker of [
    'collectionYearMode', 'collectionSemester', 'collectionExamType',
    'collectionSchoolTools', 'unifiedConfiguration', 'unit-confirmation', 'unit-preview-iframe',
    'mobile320', 'unit-past-exams-fallback.html', 'unit-past-exams-multi-paper.html',
    'dev.logs', 'overflow', 'assignUrl'
  ]) {
    assert.match(qa, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('브라우저 QA 계약은 실제 페이지에서 사용할 오류 상태와 출력 버튼을 검증한다', () => {
  assert.match(qa, /#unit-selection-report/);
  assert.match(qa, /getByRole\('button', \{ name: \/일반 출력\//);
  assert.match(qa, /getByRole\('button', \{ name: \/학생에게 출제\//);
  assert.match(qa, /editButtons/);
  assert.match(qa, /result\.logs/);
  assert.match(qa, /assert\.equal\(Array\.from\(result\.logs\)\.length, 0\)/);
});
