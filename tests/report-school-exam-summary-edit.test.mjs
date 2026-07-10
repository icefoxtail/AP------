import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// E-6: 요약 카드(핵심 진단/담임 총평)까지 인라인 수정/저장 확장 회귀.
// 저장본(school_exam_detail fields_json)이 화면 상세 리포트·출력 문서(요약 카드)·카톡 간단 리포트에
// 일관되게 반영되는지 확인한다.

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
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간고사', score: 82, question_count: 4 }],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 2 }],
      exam_blueprints: [{ archive_file: 'exam-a.js', question_no: 2, standard_unit: '일차방정식', difficulty: '중' }],
      exam_question_reviews: [
        { archive_file: 'exam-a.js', question_no: '2', review_text: JSON.stringify({ concept: '일차방정식', tag: '계산·검산' }) }
      ],
      exam_analysis_meta: [],
      exam_student_reports: []
    }
  },
  window: {},
  document: {
    body: { classList: { add: () => {}, remove: () => {} } },
    head: { appendChild: () => {} },
    getElementById: () => null,
    createElement: tag => ({ tagName: tag, id: '', textContent: '' }),
    querySelectorAll: () => []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

// 1) 저장본이 없을 때: 기본 문구(자동 생성)가 요약 카드에 나온다.
const baseDoc = context.reportCenterBuildSchoolExamDetailedPrintDocument('s1', 'e1');
assert.match(baseDoc, /핵심 진단/);
assert.match(baseDoc, /담임 총평/);
assert.match(baseDoc, /2번 문항을 중심으로/, '기본 핵심 진단은 오답 문항 번호 기반');
assert.match(baseDoc, /수업에서 다시 확인했습니다/, '핵심 진단은 완료 시제');

// 2) 편집 모드에는 요약 카드 편집 필드가 함께 나온다(전 카드 편집 UX 단일화).
const editHtml = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { editMode: true });
assert.match(editHtml, /data-report-detail-field="diagnosisText"/);
assert.match(editHtml, /data-report-detail-field="teacherSummaryText"/);
assert.match(editHtml, /data-report-detail-field="planText"/);
assert.match(editHtml, /data-report-detail-field="parentText"/);

// 3) 저장본(school_exam_detail)이 있으면 화면·출력·카톡 모두 그것으로 대체된다.
context.state.db.exam_student_reports.push({
  archive_file: 'exam-a.js',
  student_id: 's1',
  report_type: 'school_exam_detail',
  fields_json: JSON.stringify({
    diagnosisText: '수정된 핵심 진단 문구입니다.',
    teacherSummaryText: '수정된 담임 총평 문구입니다.',
    planText: '수정된 학습 방향 문구입니다.',
    parentText: '수정된 학부모 안내 문구입니다.'
  })
});

const savedDoc = context.reportCenterBuildSchoolExamDetailedPrintDocument('s1', 'e1');
assert.match(savedDoc, /수정된 핵심 진단 문구입니다\./, '출력 요약 카드에 핵심 진단 저장본 반영');
assert.match(savedDoc, /수정된 담임 총평 문구입니다\./, '출력 요약 카드에 담임 총평 저장본 반영');
assert.match(savedDoc, /수정된 학습 방향 문구입니다\./, '출력 학습 방향에 저장본 반영');
assert.match(savedDoc, /수정된 학부모 안내 문구입니다\./, '출력 학부모 문구에 저장본 반영');
assert.doesNotMatch(savedDoc, /2번 문항을 중심으로/, '저장본이 있으면 자동 진단 문구를 대체');

const screenHtml = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { editMode: false });
assert.match(screenHtml, /수정된 학습 방향 문구입니다\./);
assert.match(screenHtml, /수정된 학부모 안내 문구입니다\./);

const editAfterSave = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { editMode: true });
assert.match(editAfterSave, /수정된 핵심 진단 문구입니다\./, '재편집 시 저장본이 기본값으로 채워짐');
assert.match(editAfterSave, /수정된 담임 총평 문구입니다\./);

const simpleHtml = context.reportCenterBuildSchoolExamSimpleParentReport('s1', 'exam-a.js');
assert.match(simpleHtml, /수정된 학부모 안내 문구입니다\./, '카톡 간단 리포트에도 학부모 저장본 반영');

// 4) 선생님 저장본은 블록 간 중복 제거(dedupe) 대상에서 제외 — 총평과 같은 문장을
//    학부모 문구에 의도적으로 반복해도 화면·출력에서 삭제되면 안 된다.
context.state.db.exam_student_reports = [{
  archive_file: 'exam-a.js',
  student_id: 's1',
  report_type: 'school_exam_detail',
  fields_json: JSON.stringify({
    teacherSummaryText: '오답 문항은 수업에서 다시 풀어 정리했습니다.',
    parentText: '어머님 안녕하세요. 오답 문항은 수업에서 다시 풀어 정리했습니다. 다음 주 보강 일정은 목요일입니다.'
  })
}];
const dedupeHtml = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { editMode: false });
const dedupeParent = dedupeHtml.match(/aprc-counsel-section--parent[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.match(dedupeParent, /다시 풀어 정리했습니다/, '저장본 문장은 총평과 겹쳐도 유지');
assert.match(dedupeParent, /다음 주 보강 일정/, '저장본 나머지 문장도 유지');

// 5) assertParentSafe 치환이 문법을 깨지 않아야 한다 (향후/학습 흐름 조사 호환)
assert.equal(context.reportCenterAssertParentSafe('향후에는 서술형 답안도 다루겠습니다.'), '앞으로는 서술형 답안도 다루겠습니다.');
assert.equal(context.reportCenterAssertParentSafe('향후 계획을 함께 안내드립니다.'), '앞으로 계획을 함께 안내드립니다.');
assert.equal(context.reportCenterAssertParentSafe('아이의 학습 흐름이 안정적입니다.'), '아이의 풀이 과정이 안정적입니다.');
assert.doesNotMatch(context.reportCenterAssertParentSafe('학습 흐름 점검'), /학습 상태/, '금지어(학습 상태)로 치환되면 안 됨');

console.log('report school exam summary edit test passed');
