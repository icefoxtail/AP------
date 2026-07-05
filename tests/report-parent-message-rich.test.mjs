import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: { db: { students: [], exam_sessions: [], wrong_answers: [], exam_blueprints: [], exam_question_reviews: [] } },
  window: {},
  document: { querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const data = {
  student: { id: 's1', name: '유예준' },
  session: { id: 'e1', student_id: 's1', exam_title: '학교시험', score: 81 },
  stats: {
    overallAvg: 90,
    classAvg: 83,
    className: '중3B',
    wrongRows: [
      { questionNo: 19, unit: '이차함수와 그래프', correctRate: 63, classCorrectRate: 33 },
      { questionNo: 7, unit: '연립방정식', correctRate: 92, classCorrectRate: 80 }
    ]
  }
};

const parentMessage = context.reportCenterBuildRichParentMessage(data, data.stats.wrongRows);
assert.ok(parentMessage.length >= 180);
assert.match(parentMessage, /전체 평균 대비 -9점/);
assert.match(parentMessage, /중3B 평균 대비 -2점/);
assert.match(parentMessage, /19번/);
assert.match(parentMessage, /이차함수와 그래프/);
assert.match(parentMessage, /전체 정답률 63%/);
assert.match(parentMessage, /다음 수업에서는/);
assert.match(parentMessage, /조건|계산|검산/);
assert.doesNotMatch(parentMessage, /풀이 시작점|안정적으로 잡겠습니다|오답 단원의 핵심 풀이/);

console.log('report parent message rich test passed');
