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
assert.ok(parentMessage.split('\n\n').length >= 4, 'rich parent message should preserve paragraph breaks');
assert.match(parentMessage, /전체 평균 대비 -9점/);
assert.match(parentMessage, /중3B 평균 대비 -2점/);
assert.match(parentMessage, /19번/);
assert.match(parentMessage, /이차함수와 그래프/);
assert.match(parentMessage, /정답률이 63%/);
assert.match(parentMessage, /다음 수업부터는/);
assert.match(parentMessage, /조건|계산|검산/);
assert.match(parentMessage, /맞힌 문항에서 기본 개념 적용/);
assert.match(parentMessage, /조건을 식으로 옮기는 과정/);
assert.match(parentMessage, /다시 풀어 정리했/);
assert.doesNotMatch(parentMessage, /가정에서|유지하면서|안정적인 성취|바탕으로/);
assert.match(parentMessage, /중3 과정은 고등 수학으로 넘어가기 전 마지막 정리 시기/);
assert.match(parentMessage, /고등 내신 상위권으로 가기 위해서는/);
assert.doesNotMatch(parentMessage, /풀이 시작점|안정적으로 잡겠습니다|오답 단원의 핵심 풀이|로 확인됩니다|문항였던 문항|책임 있게 이어가겠습니다/);
assert.doesNotMatch(parentMessage, /예상됩니다|보장|무조건|반드시 1등급/);

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
assert.match(lowerMessage, /먼저 다시 봐야 할 부분이 분명하게 확인/);
assert.match(lowerMessage, /제가 수업에서 직접 챙기면서 관리/);
assert.doesNotMatch(lowerMessage, /가정에서/);

const middle1InternalData = {
  student: { id: 's5', name: '중1', grade: '중1' },
  session: { id: 'e5', student_id: 's5', exam_title: '1학기 원내평가', score: 76, question_count: 20 },
  stats: {
    overallAvg: 78,
    wrongRows: [
      { questionNo: 4, unit: '정수와 유리수', correctRate: 58 },
      { questionNo: 9, unit: '문자와 식', correctRate: 62 }
    ]
  }
};
const middle1Message = context.reportCenterBuildRichParentMessage(middle1InternalData, middle1InternalData.stats.wrongRows);
assert.equal(context.reportCenterResolveParentReportType(middle1InternalData), 'internalAssessment');
assert.equal(context.reportCenterResolveGradeStage(middle1InternalData), 'middle1');
assert.match(middle1Message, /학교 시험이 없더라도 중학교 수학의 풀이 방식에 적응/);
assert.match(middle1Message, /첫 내신 시험을 준비/);

const middle2Data = {
  student: { id: 's6', name: '중2', grade: '중2' },
  session: { id: 'e6', student_id: 's6', exam_title: '학교 기출시험', score: 84, question_count: 20 },
  stats: {
    overallAvg: 80,
    wrongRows: [{ questionNo: 11, unit: '연립방정식', correctRate: 66 }]
  }
};
const middle2Message = context.reportCenterBuildRichParentMessage(middle2Data, middle2Data.stats.wrongRows);
assert.equal(context.reportCenterResolveGradeStage(middle2Data), 'middle2');
assert.match(middle2Message, /다음 학기와 중3 과정에서 반복되지 않도록 관리/);
assert.doesNotMatch(middle2Message, /NaN점/);

const middle3LowerData = {
  student: { id: 's7', name: '중3하위', grade: '중3' },
  session: { id: 'e7', student_id: 's7', exam_title: '학교 기출시험', score: 58, question_count: 20 },
  stats: {
    overallAvg: 76,
    wrongRows: Array.from({ length: 8 }, (_, index) => ({
      questionNo: index + 1,
      unit: '이차함수',
      correctRate: 35
    }))
  }
};
const middle3LowerMessage = context.reportCenterBuildRichParentMessage(middle3LowerData, middle3LowerData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(middle3LowerData, middle3LowerData.stats.wrongRows), 'lower');
assert.match(middle3LowerMessage, /이번 학교 기출시험으로/);
assert.match(middle3LowerMessage, /먼저 다시 봐야 할 부분/);
assert.match(middle3LowerMessage, /고등 선행을 빠르게 나가기보다 중등 핵심 단원의 빈틈/);

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
assert.match(highMessage, /수업 시간에 같이 다시 풀었/);
assert.match(highMessage, /새 단원 수업에서도 제가 계속 확인/);

const middle3HighData = {
  student: { id: 's8', name: '중3상위', grade: '중3' },
  session: { id: 'e8', student_id: 's8', exam_title: '학교 기출시험', score: 94, question_count: 20 },
  stats: {
    overallAvg: 82,
    wrongRows: [{ questionNo: 18, unit: '도형', correctRate: 72 }]
  }
};
const middle3HighMessage = context.reportCenterBuildRichParentMessage(middle3HighData, middle3HighData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(middle3HighData, middle3HighData.stats.wrongRows), 'high');
assert.match(middle3HighMessage, /1등급권을 목표로 관리해볼 수 있는 상태/);
assert.doesNotMatch(middle3HighMessage, /예상됩니다|보장|무조건|반드시 1등급/);

const perfectData = {
  student: { id: 's4', name: '만점', grade: '중3' },
  session: { id: 'e4', student_id: 's4', exam_title: '단원평가', score: 100, question_count: 20 },
  stats: { overallAvg: 84, wrongRows: [] }
};
const perfectMessage = context.reportCenterBuildRichParentMessage(perfectData, perfectData.stats.wrongRows);
assert.equal(context.reportCenterResolveAiParentToneBand(perfectData, perfectData.stats.wrongRows), 'perfect');
assert.match(perfectMessage, /전 문항을 정확히 해결/);
assert.match(perfectMessage, /고난도 변형 문제와 서술형 답안/);
assert.doesNotMatch(perfectMessage, /가정에서|칭찬/);
assert.match(perfectMessage, /1등급권을 목표로 관리해볼 수 있는 좋은 상태/);
assert.doesNotMatch(perfectMessage, /오답/);
assert.doesNotMatch(perfectMessage, /예상됩니다|보장|무조건|반드시 1등급/);

console.log('report parent message rich test passed');
