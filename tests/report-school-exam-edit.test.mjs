import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

// 편집 폼에서 읽힐 필드 값을 갈아끼울 수 있게 mutable 하게 둔다(학생별 저장 검증용).
let currentFormFields = [
  ['summary', 's1 요약'],
  ['meaning', 's1 총평'],
  ['cause', 's1 원인'],
  ['counsel', 's1 상담'],
  ['action', 's1 조치'],
  ['parent', 's1 안내']
];

const context = {
  state: { db: { exam_analysis_meta: [], exam_question_reviews: [] } },
  window: {},
  document: {
    querySelectorAll: selector => selector === '[data-report-counsel-field]'
      ? currentFormFields.map(([key, value]) => ({ getAttribute: () => key, value }))
      : []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  openReportCenterModal: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

// 1) 편집 모드 토글
context.reportCenterSetCounselEditMode('s1', 'exam-a.js', true);
assert.equal(context.reportCenterCounselEditMode('s1', 'exam-a.js'), true);

// 2) 학생 s1 저장
const savedS1 = await context.reportCenterSaveSchoolExamCounselReport('s1', 'exam-a.js');
assert.equal(savedS1.meaning, 's1 총평');
assert.equal(context.reportCenterCounselEditMode('s1', 'exam-a.js'), false, '저장 후 편집 모드 해제');

// 3) 저장이 store에 학생 단위로 반영 (재렌더 시 읽어올 수 있어야 함)
const readBackS1 = context.reportCenterGetSavedCounselFields('s1', 'exam-a.js');
assert.ok(readBackS1, '저장 직후 s1 수정본을 다시 읽을 수 있어야 함');
assert.equal(readBackS1.meaning, 's1 총평');
assert.equal(readBackS1.parent, 's1 안내');

// 4) 시험 총평(overview_text) 오염 금지 — 학생 상담 편집이 시험 메타 총평을 덮어쓰면 안 됨
const metaRow = context.state.db.exam_analysis_meta[0];
assert.ok(metaRow, '시험 메타 row 생성');
assert.notEqual(metaRow.overview_text, 's1 총평', 'overview_text가 학생 총평으로 오염되면 안 됨');

// 5) 다른 학생 s2는 아직 격리 (s1 저장이 s2로 새면 안 됨)
assert.equal(context.reportCenterGetSavedCounselFields('s2', 'exam-a.js'), null, 's2는 저장 전 null');

// 6) s2 저장 후에도 s1 수정본이 그대로 유지 (교차오염 없음)
currentFormFields = [
  ['summary', 's2 요약'],
  ['meaning', 's2 총평'],
  ['cause', 's2 원인'],
  ['counsel', 's2 상담'],
  ['action', 's2 조치'],
  ['parent', 's2 안내']
];
await context.reportCenterSaveSchoolExamCounselReport('s2', 'exam-a.js');
assert.equal(context.reportCenterGetSavedCounselFields('s2', 'exam-a.js').meaning, 's2 총평');
assert.equal(context.reportCenterGetSavedCounselFields('s1', 'exam-a.js').meaning, 's1 총평', 's2 저장이 s1을 덮어쓰면 안 됨');

console.log('report school exam edit test passed');
