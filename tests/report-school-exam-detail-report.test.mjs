import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['archive-render.js', 'report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민서' }],
      classes: [],
      class_students: [],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간고사', score: 70, question_count: 8 }],
      wrong_answers: [1, 2, 3, 4, 5, 6].map(question_id => ({ session_id: 'e1', student_id: 's1', question_id })),
      exam_blueprints: [1, 2, 3, 4, 5, 6].map(question_no => ({
        archive_file: 'exam-a.js',
        question_no,
        standard_unit: question_no % 2 ? '함수 활용' : '부등식과 범위',
        difficulty: question_no <= 2 ? '쉬움' : '어려움'
      })),
      exam_question_reviews: [1, 2, 3, 4, 5, 6].map(question_no => ({
        archive_file: 'exam-a.js',
        question_no: String(question_no),
        review_text: JSON.stringify({ concept: question_no % 2 ? '함수 활용' : '부등식과 범위', tag: question_no <= 2 ? '계산·검산' : '조건 해석' })
      })),
      exam_analysis_meta: []
    }
  },
  window: {},
  document: { querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const selected = context.reportCenterSelectParentReportWrongRows([
  { questionNo: 1, correctRate: 92 },
  { questionNo: 2, correctRate: 88 },
  { questionNo: 3, correctRate: 81 },
  { questionNo: 4, correctRate: 38 },
  { questionNo: 5, correctRate: 24 },
  { questionNo: 6, correctRate: 61 }
], 5);
assert.equal(JSON.stringify(selected.map(row => row.questionNo)), JSON.stringify([1, 2, 3, 5, 4]));

const legacy = context.reportCenterSelectPriorityWrongRows([
  { questionNo: 1, correctRate: 92 },
  { questionNo: 5, correctRate: 24 }
], 2);
assert.equal(JSON.stringify(legacy.map(row => row.questionNo)), JSON.stringify([1, 5]));

const archiveDetails = {
  ok: true,
  details: [1, 2, 3, 4, 5, 6].map(questionNo => context.reportCenterNormalizeQuestionDetail(
    { content: `${questionNo}번 원문`, choices: ['보기1', '보기2'] },
    questionNo,
    { questionNo, unit: '함수 활용', correctRate: 50 }
  ))
};
const html = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { archiveDetails });
assert.match(html, /오답 문항 분석/);
assert.doesNotMatch(html, /먼저 볼 문항|우선 확인 문항|실제 문항|상세 학부모 리포트/);
assert.equal((html.match(/aprc-parent-question-card/g) || []).length, 5);
assert.match(html, /나머지 1개 문항/);
assert.doesNotMatch(html, /aprc-parent-question-label">(?:학부모 해석|이번 오답 의미|다음 수업 계획)</);
assert.match(html, /aprc-parent-question-comment/);
assert.ok(html.indexOf('시험 요약') < html.indexOf('앞으로의 학습 방향'));
assert.ok(html.indexOf('앞으로의 학습 방향') < html.indexOf('오답 문항 분석'));
assert.doesNotMatch(html, /다음 수업에서|다음 수업 계획/);
assert.ok(html.indexOf('오답 문항 분석') < html.indexOf('학부모님께'));
assert.doesNotMatch(html, /학부모 안내 문구/);
assert.ok(html.indexOf('aprc-parent-question-comment') < html.indexOf('문항 원문'));
const questionOrder = [...html.matchAll(/aprc-parent-question-no">(\d+)번/g)].map(match => Number(match[1]));
assert.deepEqual(questionOrder, [1, 2, 3, 4, 5]);
const comments = [...html.matchAll(/<section class="aprc-parent-question-comment">\s*<p>([\s\S]*?)<\/p>/g)]
  .map(match => match[1].replace(/^\d+번은\s*/, '').replace(/전체 정답률\s*\d+%/g, '전체 정답률'));
const counts = new Map();
comments.forEach(comment => counts.set(comment, (counts.get(comment) || 0) + 1));
assert.ok([...counts.values()].every(count => count < 3));
assert.match(html, /안녕하세요, AP수학입니다/);
assert.doesNotMatch(html, /풀이 시작점|안정적으로 잡겠습니다|오답 단원의 핵심 풀이/);

console.log('report school exam detail report test passed');
