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
assert.match(parentMessage, /정답률이 63%/);
assert.match(parentMessage, /다음 수업에서는/);
assert.match(parentMessage, /조건|계산|검산/);
assert.match(parentMessage, /다시 확인할 부분을 줄이면 더 안정적인 결과/);
assert.match(parentMessage, /조건 해석과 식 정리/);
assert.doesNotMatch(parentMessage, /풀이 시작점|안정적으로 잡겠습니다|오답 단원의 핵심 풀이|로 확인됩니다|문항였던 문항|책임 있게 이어가겠습니다/);

const lowerData = {
  student: { id: 's2', name: '하위권' },
  session: { id: 'e2', student_id: 's2', exam_title: '단원평가', score: 60, question_count: 20 },
  stats: {
    overallAvg: 78,
    wrongRows: Array.from({ length: 7 }, (_, index) => ({
      questionNo: index + 1,
      unit: '함수',
      correctRate: 40
    }))
  }
};
const lowerMessage = context.reportCenterBuildRichParentMessage(lowerData, lowerData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(lowerData, lowerData.stats.wrongRows), 'lower');
assert.match(lowerMessage, /점수 자체보다 앞으로 어떤 부분을 먼저 정리/);
assert.match(lowerMessage, /문제를 많이 다시 풀리기보다 풀이 흔적/);

const highData = {
  student: { id: 's3', name: '상위권' },
  session: { id: 'e3', student_id: 's3', exam_title: '단원평가', score: 94, question_count: 20 },
  stats: {
    overallAvg: 84,
    wrongRows: [{ questionNo: 12, unit: '도형', correctRate: 88 }]
  }
};
const highMessage = context.reportCenterBuildRichParentMessage(highData, highData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(highData, highData.stats.wrongRows), 'high');
assert.match(highMessage, /심화 확장/);
assert.match(highMessage, /풀이 과정을 짧게 설명/);

const perfectData = {
  student: { id: 's4', name: '만점' },
  session: { id: 'e4', student_id: 's4', exam_title: '단원평가', score: 100, question_count: 20 },
  stats: { overallAvg: 84, wrongRows: [] }
};
const perfectMessage = context.reportCenterBuildRichParentMessage(perfectData, perfectData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(perfectData, perfectData.stats.wrongRows), 'perfect');
assert.match(perfectMessage, /전 문항을 정확히 해결/);
assert.match(perfectMessage, /충분히 칭찬/);

console.log('report parent message rich test passed');
