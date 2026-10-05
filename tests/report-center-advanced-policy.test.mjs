import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const storage = new Map();
const context = {
  state: { db: { students: [{ id: 's1', name: '민준' }], classes: [], class_students: [], exam_sessions: [], wrong_answers: [], report_exam_cohort_stats: [] } },
  window: {},
  document: { getElementById: () => null },
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

context.reportCenterSetAdvancedMode(false);
const basicToolbar = context.reportCenterRenderStudioToolbar('s1', 'e1', { isEditMode: false });
assert.match(basicToolbar, /돌아가기/);
assert.match(basicToolbar, /인쇄하기/);
assert.doesNotMatch(basicToolbar, /프리미엄 분석/);
assert.doesNotMatch(basicToolbar, />편집</);
assert.equal(context.reportCenterRenderStudioPanel('s1', 'e1', { isEditMode: true }), '');

context.reportCenterSetAdvancedMode(true);
const advancedToolbar = context.reportCenterRenderStudioToolbar('s1', 'e1', { isEditMode: false });
assert.match(advancedToolbar, /프리미엄 분석/);
assert.match(advancedToolbar, />편집</);

const advancedShell = context.reportCenterBaseShell('s1', 'exam', '<main>legacy</main>');
assert.match(advancedShell, /오늘 리포트/);
assert.match(advancedShell, /평가 리포트/);
assert.match(advancedShell, /상담 리포트/);
assert.match(context.reportCenterAdvancedToggleHtml('s1', 'exam'), /상세 편집 도구/);

console.log('report center advanced policy test passed');
