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
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }],
      classes: [{ id: 'c1', name: 'A반' }],
      class_students: [{ class_id: 'c1', student_id: 's1' }],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '기말', score: 80, question_count: 4 }],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 2 }, { session_id: 'e1', student_id: 's1', question_id: 3 }],
      exam_question_reviews: [
        { archive_file: 'exam-a.js', question_no: '2', review_text: JSON.stringify({ concept: '분배법칙', tag: '계산·검산', trap: '부호를 옮기는 단계' }) },
        { archive_file: 'exam-a.js', question_no: '3', review_text: JSON.stringify({ concept: '일차방정식', tag: '계산·검산', trap: '이항 후 정리' }) }
      ],
      exam_analysis_meta: [],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 2, standard_unit: '식의 계산', difficulty: '중' },
        { archive_file: 'exam-a.js', question_no: 3, standard_unit: '방정식', difficulty: '중' }
      ]
    }
  },
  window: {},
  document: { querySelectorAll: () => [] },
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

const html = context.reportCenterBuildSchoolExamCounselReport('s1', 'exam-a.js');
assert.match(html, /학생별 상담 리포트 1장/);
assert.match(html, /상단 요약/);
assert.match(html, /이번 시험 총평/);
assert.match(html, /오답 원인 요약/);
assert.match(html, /상담 포인트/);
assert.match(html, /학원 조치/);
assert.match(html, /학부모 안내 문구/);
assert.match(html, /계산·검산 유형이 여러 문항/);

context.reportCenterSetCounselEditMode('s1', 'exam-a.js', true);
const editHtml = context.reportCenterBuildSchoolExamCounselReport('s1', 'exam-a.js');
assert.match(editHtml, /textarea/);
assert.match(editHtml, /저장/);

const parent = context.reportCenterBuildSchoolExamParentReport('s1', 'exam-a.js');
assert.doesNotMatch(parent, /코호트|함정|blueprint|review_text|전체 정답률\s*\d+%/);

const detailed = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js');
assert.match(detailed, /상세 학부모 리포트/);
assert.match(detailed, /실제 오답 문제/);
assert.match(detailed, /2번/);

const archiveDetails = {
  ok: true,
  status: 'loaded',
  message: '아카이브 문항 원문을 불러왔습니다.',
  details: [
    context.reportCenterNormalizeQuestionDetail(
      { content: '2번 원문입니다.', choices: ['① 1', '② 2'], answer: '②', solution: '2를 고릅니다.' },
      2,
      { questionNo: 2, unit: '식의 계산', correctRate: 40 }
    ),
    context.reportCenterNormalizeQuestionDetail(
      { content: '3번 원문입니다.', choices: ['① x', '② y'], answer: '①', solution: 'x를 고릅니다.' },
      3,
      { questionNo: 3, unit: '방정식', correctRate: 45 }
    )
  ]
};
const detailedWithArchive = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { archiveDetails });
// 내부 상태 메시지는 학부모 출력에 노출 금지
assert.doesNotMatch(detailedWithArchive, /아카이브 문항 원문을 불러왔습니다|원문 없음|자료 부족|확인 불가/);
assert.match(detailedWithArchive, /2번 원문입니다/);
assert.match(detailedWithArchive, /① 1/);
assert.doesNotMatch(detailedWithArchive, /<b>정답<\/b>/);
assert.doesNotMatch(detailedWithArchive, /<b>해설 요약<\/b>/);
// 학부모 3블록 서술: raw(묻는것/함정/풀이) 대신 해석·의미·계획
assert.match(detailedWithArchive, /학부모 해석/);
assert.match(detailedWithArchive, /이번 오답 의미/);
assert.match(detailedWithArchive, /다음 수업 계획/);
assert.match(detailedWithArchive, /전체 정답률 \d+%(로|의)/);
assert.doesNotMatch(detailedWithArchive, /<b>묻는 것<\/b>|<b>함정<\/b>|<b>풀이 포인트<\/b>/);

// 서술 빌더 단독 검증: 정답률 구간별 헤드라인 + 태그별 의미/계획
const hardNarrative = context.reportCenterBuildParentQuestionNarrative({
  questionNo: 8, correctRate: 7,
  reviewText: JSON.stringify({ concept: '이차방정식+일차부등식 연립 조건', tag: '조건 해석', trap: '경계 등호 처리를 놓쳐 범위가 반쪽이 되기 쉽습니다' })
});
assert.match(hardNarrative.headline, /전체 정답률 7%의 매우 어려운 최상위 문항/);
assert.match(hardNarrative.meaning, /조건을 식으로 옮기고/);
assert.match(hardNarrative.action, /최상위 난도 문항 대비/);
const easyNarrative = context.reportCenterBuildParentQuestionNarrative({
  questionNo: 3, correctRate: 91,
  reviewText: JSON.stringify({ concept: '제곱근의 이해', tag: '계산·검산' })
});
assert.match(easyNarrative.headline, /전체 정답률 91%로 대부분 맞힌 기본 문항/);
assert.match(easyNarrative.meaning, /계산과 마무리 확인/);
assert.match(easyNarrative.action, /검산 습관/);

const printDoc = context.reportCenterBuildSchoolExamDetailedPrintDocument('s1', 'e1', { archiveDetails });
assert.match(printDoc, /학교시험 상세 리포트/);
assert.match(printDoc, /상세 학부모 리포트/);
assert.match(printDoc, /2번 원문입니다/);

const simple = context.reportCenterBuildSchoolExamSimpleParentReport('s1', 'exam-a.js');
assert.match(simple, /간단 리포트/);
assert.match(simple, /카톡\/짧은 상담용/);

// 프리미엄 분석(학생별·sessionId 기준 저장)이 있으면 상세 리포트가 그 문구를 우선 사용한다.
const detailedBefore = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js');
assert.doesNotMatch(detailedBefore, /프리미엄 분석 적용/);
context.AP_REPORT_AI_ANALYSIS_CACHE = {
  e1: {
    source: 'ai',
    summary: 'AISUMMARYXYZ',
    parentMessage: 'AIPARENTXYZ',
    nextActions: ['AIPLAN1XYZ'],
    wrongAnalysis: 'AIWRONGXYZ',
    diagnosis: 'AIDIAGXYZ',
    kakaoSummary: 'AIKAKAOXYZ'
  }
};
const premiumDetailed = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js');
assert.match(premiumDetailed, /프리미엄 분석 적용/);
assert.match(premiumDetailed, /AISUMMARYXYZ/);
assert.match(premiumDetailed, /AIPARENTXYZ/);
assert.match(premiumDetailed, /AIPLAN1XYZ/);

// 상담 1장도 프리미엄 우선(저장 수정본은 없으니 AI가 뱅크를 대체).
context.reportCenterSetCounselEditMode('s1', 'exam-a.js', false);
const premiumCounsel = context.reportCenterBuildSchoolExamCounselReport('s1', 'exam-a.js');
assert.match(premiumCounsel, /AISUMMARYXYZ/);
assert.match(premiumCounsel, /AIWRONGXYZ/);
assert.match(premiumCounsel, /AIDIAGXYZ/);
assert.match(premiumCounsel, /AIPLAN1XYZ/);
assert.match(premiumCounsel, /AIPARENTXYZ/);

// 간단 리포트도 프리미엄 우선(카톡 요약/안내를 AI로).
const premiumSimple = context.reportCenterBuildSchoolExamSimpleParentReport('s1', 'exam-a.js');
assert.match(premiumSimple, /AIKAKAOXYZ/);
assert.match(premiumSimple, /AIPARENTXYZ/);
context.AP_REPORT_AI_ANALYSIS_CACHE = {};

console.log('report school exam counsel test passed');
