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
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }],
      exam_sessions: [],
      wrong_answers: []
    }
  },
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

let lastModal = null;
context.reportCenterShowWideModal = (title, html) => {
  lastModal = { title, html };
};

assert.equal(context.reportCenterAdvancedMode(), false);

context.openReportCenterModal('s1');
assert.ok(lastModal, 'default mode renders a modal');
assert.match(lastModal.html, /data-report-center-mode="drilldown"/);
assert.match(lastModal.html, /리포트 센터/);
assert.match(lastModal.html, /학교시험 분석/);
assert.match(lastModal.html, /시험지 목록/);
assert.match(lastModal.html, /오늘 리포트/);
assert.match(lastModal.html, /평가 리포트/);
assert.match(lastModal.html, /상담 리포트/);

const nav = context.reportCenterNavTo('exam', { archiveFile: 'exam-a.js' });
assert.equal(JSON.stringify(nav), JSON.stringify({ level: 'exam', archiveFile: 'exam-a.js', studentId: '' }));
assert.equal(JSON.stringify(context.AP_REPORT_NAV), JSON.stringify(nav));

context.reportCenterSetAdvancedMode(true);
assert.equal(context.reportCenterAdvancedMode(), true);
const advancedHtml = context.reportCenterBaseShell('s1', 'daily', '<main>body</main>');
assert.match(advancedHtml, /오늘 리포트/);
assert.match(advancedHtml, /평가 리포트/);
assert.match(advancedHtml, /상담 리포트/);
assert.match(advancedHtml, /고급 보기/);

context.reportCenterSetAdvancedMode(false);
assert.equal(context.reportCenterAdvancedMode(), false);
context.openReportCenterModal('s1', 'exam');
assert.match(lastModal.html, /data-report-center-mode="drilldown"/);
assert.match(lastModal.html, /학교시험 분석/);
assert.match(lastModal.html, /평가 리포트/);

console.log('report center shell test passed');
