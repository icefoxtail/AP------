const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');

function extractFunction(source, functionName, nextFunctionName) {
  const start = source.indexOf(`function ${functionName}`);
  const end = source.indexOf(`function ${nextFunctionName}`, start + 1);
  assert.ok(start >= 0 && end > start, `${functionName} source not found`);
  return source.slice(start, end);
}

function runHelper(file, functionName, nextFunctionName, rows) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const functionSource = extractFunction(source, functionName, nextFunctionName);
  const context = { state: { db: { academy_schedules: rows } }, Map };
  vm.createContext(context);
  vm.runInContext(`${functionSource}; globalThis.result = ${functionName}('2026-07-01', '2026-07-08');`, context);
  return Array.from(context.result);
}

const rows = [
  { id: 'a1', series_id: 's1', schedule_date: '2026-07-01', title: '학원방학', target_scope: 'global', is_deleted: 0 },
  { id: 'a2', series_id: 's1', schedule_date: '2026-07-02', title: '학원방학', target_scope: 'global', is_deleted: 0 },
  { id: 'a3', series_id: 's1', schedule_date: '2026-07-03', title: '학원방학', target_scope: 'global', is_deleted: 0 },
  { id: 'hidden', series_id: 's2', schedule_date: '2026-07-04', title: '학생 일정', target_scope: 'student', is_deleted: 0 }
];

test('teacher dashboard aggregates academy occurrences into one weekly item', () => {
  const result = runHelper('apmath/js/dashboard.js', 'getDashboardAcademyScheduleSeries', 'renderTodoSections', rows);
  assert.equal(result.length, 1);
  assert.equal(result[0].range_start, '2026-07-01');
  assert.equal(result[0].range_end, '2026-07-03');
  assert.equal(result[0].occurrence_count, 3);
});

test('admin dashboard aggregates academy occurrences into one weekly item', () => {
  const result = runHelper('apmath/js/dashboard-admin.js', 'apAdminAcademyScheduleSeries', 'apRemoveAdminSystemGate', rows);
  assert.equal(result.length, 1);
  assert.equal(result[0].range_start, '2026-07-01');
  assert.equal(result[0].range_end, '2026-07-03');
  assert.equal(result[0].occurrence_count, 3);
});
