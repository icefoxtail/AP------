// 유사 시험지로 출제된 응시를 학교 시험과 가른다(2026-11-23 원장님 결정).
// 입력(OMR)은 기출과 같은 길로 되지만, 유사 응시는 성적 평균·추이·"진행 중" 독촉에서 빠지고 목록에는 "유사 · 자습용" 꼬리표로 보인다.
// 결함 조건만 본다: 기출 2 + 유사 1 fixture에서 평균·추이가 기출 2건뿐이고, 진행 중 집계에 유사가 없고, 목록에는 꼬리표와 함께 남는다.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const Sim = require('../apmath/js/similar-exam.js');

const ORIGINAL_A = 'exams/original/high/h1/1mid/26_가고_1학기_중간_고1_공통수학1.js';
const ORIGINAL_B = 'exams/original/high/h1/1final/26_가고_1학기_기말_고1_공통수학1.js';
const SIMILAR = 'exams/similar/high/h1/1mid/26_가고_1학기_중간_고1_공통수학1_유사.js';

function sliceFunction(src, name) {
  const m = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`).exec(src);
  assert.ok(m, `function ${name} not found`);
  const open = src.indexOf('{', src.indexOf(')', m.index));
  let depth = 0;
  for (let j = open; j < src.length; j += 1) {
    if (src[j] === '{') depth += 1;
    else if (src[j] === '}' && --depth === 0) return src.slice(m.index, j + 1);
  }
  throw new Error(`unterminated function ${name}`);
}

test('판정 한 곳: similar/ 아래 시험 파일만 유사이고, 기출·MIXED·빈 값은 아니다', () => {
  for (const file of [SIMILAR, SIMILAR.replace('exams/', ''), `archive/${SIMILAR}`, SIMILAR.replace(/\//g, '\\'), `${SIMILAR}?v=1`]) {
    assert.equal(Sim.isSimilarExamFile(file), true, file);
  }
  for (const file of [ORIGINAL_A, 'MIXED:archive2-abc', '', null, undefined, 'exams/original/similar-name.js']) {
    assert.equal(Sim.isSimilarExamFile(file), false, String(file));
  }
  assert.equal(Sim.isSimilarExamRow({ archive_file: SIMILAR }), true);
  assert.equal(Sim.isSimilarExamRow({ archiveFile: SIMILAR }), true);
  assert.equal(Sim.isSimilarExamRow({ archive_file: ORIGINAL_A }), false);
  assert.equal(Sim.isSimilarExamRow(null), false);
  assert.deepEqual(Sim.schoolExamRows([{ id: 1, archive_file: ORIGINAL_A }, { id: 2, archive_file: SIMILAR }]).map((r) => r.id), [1]);
});

// ---- 리포트 센터: 기출 2 + 유사 1 ----
function reportCenterContext() {
  const sessions = [
    { id: 'e1', student_id: 's1', archive_file: ORIGINAL_A, exam_title: '중간', exam_date: '2026-06-01', score: 80, question_count: 20, school: '가고', grade: '고1' },
    { id: 'e2', student_id: 's1', archive_file: ORIGINAL_B, exam_title: '기말', exam_date: '2026-07-10', score: 60, question_count: 20, school: '가고', grade: '고1' },
    { id: 'e3', student_id: 's1', archive_file: SIMILAR, exam_title: '중간 유사', exam_date: '2026-07-20', score: 100, question_count: 20, school: '가고', grade: '고1' },
  ];
  const context = {
    state: {
      db: {
        students: [{ id: 's1', name: '민준', status: '재원' }],
        classes: [], class_students: [],
        exam_sessions: sessions,
        wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 3 }],
        exam_question_reviews: [], exam_analysis_meta: [], exam_blueprints: [],
      },
    },
    window: {},
    document: { getElementById: () => null },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    toast() {}, console, setTimeout, clearTimeout,
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read('apmath/js/similar-exam.js'), context, { filename: 'similar-exam.js' });
  vm.runInContext(['report-text.js', 'report-center.js', 'report-print.js'].map((f) => read(`apmath/js/${f}`)).join('\n'), context, { filename: 'report.js' });
  return context;
}

test('리포트 센터: 최근 평균·성적 추이는 기출 2건만으로 계산한다', () => {
  const ctx = reportCenterContext();
  assert.equal(ctx.getRecentAverage('s1', 3), 70, '유사 100점이 평균에 섞이지 않는다');
  assert.deepEqual(Array.from(ctx.reportCenterGetSortedStudentExamSessions('s1'), (s) => s.id), ['e2', 'e1']);
  const trend = ctx.reportCenterGetExamTrendData('s1', { limit: 5 });
  assert.deepEqual(Array.from(trend.selectedSessions, (s) => s.id), ['e1', 'e2']);
  assert.equal(trend.trend.averageScore, 70);
  assert.equal(trend.trend.latestScore, 60);
  assert.equal(trend.trend.bestScore, 80);
  assert.equal(trend.trend.scoreDelta, -20);
  // 시험 목록·시험 결과 선택 쪽은 유사도 포함해서 고를 수 있다(기본 선택만 학교 시험).
  assert.deepEqual(Array.from(ctx.reportCenterGetSortedStudentExamSessions('s1', { includeSimilar: true }), (s) => s.id), ['e3', 'e2', 'e1']);
  const data = ctx.reportCenterGetExamReportData('s1');
  assert.equal(data.session.id, 'e2', '기본 선택은 가장 최근 학교 시험');
  assert.deepEqual(Array.from(data.sessions, (s) => s.id), ['e3', 'e2', 'e1']);
  assert.equal(ctx.reportCenterGetExamReportData('s1', 'e3').session.id, 'e3', '유사 응시도 직접 열 수는 있다');
});

test('리포트 센터: 시험 목록에는 유사가 "유사 · 자습용" 꼬리표로 남고 기출 줄은 그대로다', () => {
  const ctx = reportCenterContext();
  const hub = ctx.reportCenterBuildExamHubList();
  assert.equal(hub.length, 3);
  const bySimilar = Object.fromEntries(Array.from(hub, (row) => [row.archiveFile, row.similar]));
  assert.equal(bySimilar[ORIGINAL_A], false);
  assert.equal(bySimilar[ORIGINAL_B], false);
  assert.equal(bySimilar[SIMILAR], true);
  const card = (file) => ctx.reportCenterRenderExamHubCard(hub.find((row) => row.archiveFile === file), 's1');
  assert.match(card(SIMILAR), /유사 · 자습용/);
  assert.doesNotMatch(card(ORIGINAL_A), /유사 · 자습용/);
  assert.doesNotMatch(card(ORIGINAL_B), /유사 · 자습용/);
  const groups = ctx.reportCenterGetSchoolExamGroups();
  assert.equal(groups.filter((g) => g.similar).length, 1);
  assert.equal(groups.length, 3);
  // 응시 인원·점수 자체는 줄이지 않는다(유사 시험 안의 이 시험 평균은 그대로 보인다).
  assert.equal(hub.find((row) => row.archiveFile === SIMILAR).takers, 1);
});

test('리포트 센터: 유사 응시는 "오답 미입력" 독촉 칩의 최신 시험이 되지 않는다', () => {
  const ctx = reportCenterContext();
  // 최신 학교 시험 e2는 오답이 없다(독촉 칩 대상), 유사 e3는 대상이 아니다.
  assert.match(ctx.reportCenterBuildStudentStatusChips('s1'), /오답 미입력/);
  ctx.state.db.exam_sessions = ctx.state.db.exam_sessions.filter((s) => s.id !== 'e2');
  // 이제 학교 시험 최신은 오답이 있는 e1이다: 유사 e3(오답 없음)가 최신이어도 칩이 뜨지 않는다.
  assert.doesNotMatch(ctx.reportCenterBuildStudentStatusChips('s1'), /오답 미입력/);
});

// ---- core.js: 목표 달성률(최근 평균) ----
test('core: 목표 점수 달성률의 최근 평균도 기출만으로 계산한다', () => {
  const core = read('apmath/js/core.js');
  const src = ['apmsGetExamSessionsForStudent', 'apmsGetScoreExamSessionsForStudent', 'getStudentTargetScore', 'computeStudentTargetProgress']
    .map((name) => sliceFunction(core, name)).join('\n');
  const rows = [
    { id: 'e3', student_id: 's1', exam_date: '2026-07-20', score: 100, archive_file: SIMILAR },
    { id: 'e2', student_id: 's1', exam_date: '2026-07-10', score: 60, archive_file: ORIGINAL_B },
    { id: 'e1', student_id: 's1', exam_date: '2026-06-01', score: 80, archive_file: ORIGINAL_A },
  ];
  const ctx = {
    state: { db: { students: [{ id: 's1', target_score: 90 }], exam_sessions: rows } },
    apmsGetDataIndexes: () => ({ examSessionsByStudentId: new Map([['s1', rows]]) }),
    apmsGetStudentById: (id) => ({ id, target_score: 90 }),
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(read('apmath/js/similar-exam.js'), ctx);
  vm.runInContext(src, ctx);
  const progress = ctx.computeStudentTargetProgress('s1');
  assert.equal(progress.currentAverage, 70);
  assert.equal(progress.remainScore, 20);
  assert.deepEqual(Array.from(ctx.apmsGetScoreExamSessionsForStudent('s1'), (s) => s.id), ['e2', 'e1']);
});

// ---- 원내평가·OMR 작업 화면 / 반 출제 목록 ----
test('원내평가 작업 화면: 유사 시험은 제출률 독촉 대신 "유사 · 자습용 · 응시 N명"으로 보인다', () => {
  const ctx = {
    state: { db: { students: [{ id: 's1', status: '재원' }, { id: 's2', status: '재원' }], class_students: [{ class_id: 'c1', student_id: 's1' }, { class_id: 'c1', student_id: 's2' }] } },
    normalizeClassroomArchiveFile: (f) => String(f || '').replace(/^exams\//, ''),
    makeExamListKey: (t, d, a) => `${t}|${d}|${a}`,
    getClassroomExamDisplayTitle: (row) => row.title || row.exam_title || '',
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(read('apmath/js/similar-exam.js'), ctx);
  vm.runInContext(read('apmath/js/ws-exam-data.js'), ctx);
  const res = {
    sessions: [
      { id: 'e1', student_id: 's1', class_id: 'c1', assignment_id: 'a1', exam_title: '중간', exam_date: '2026-06-01', score: 80, question_count: 20, archive_file: ORIGINAL_A },
      { id: 'e3', student_id: 's1', class_id: 'c1', assignment_id: 'a3', exam_title: '중간 유사', exam_date: '2026-07-20', score: 100, question_count: 20, archive_file: SIMILAR },
    ],
    assignments: [
      { id: 'a1', class_id: 'c1', exam_title: '중간', exam_date: '2026-06-01', archive_file: ORIGINAL_A, question_count: 20 },
      { id: 'a3', class_id: 'c1', exam_title: '중간 유사', exam_date: '2026-07-20', archive_file: SIMILAR, question_count: 20 },
    ],
    wrong_answers: [], exclusions: [],
  };
  const exams = ctx.wsExamBuildExams(ctx.wsExamBuildSource('c1', res));
  assert.equal(exams.length, 2);
  const school = exams.find((e) => e.archiveFile === ORIGINAL_A);
  const similar = exams.find((e) => e.archiveFile === SIMILAR);
  assert.equal(school.similar, false);
  assert.equal(similar.similar, true);
  assert.equal(school.count, 1);
  assert.equal(school.targetCount, 2, '기출 줄의 제출 n/m 집계는 그대로');
  const ws = read('apmath/js/ws-exam-workspace.js');
  assert.match(ws, /exam\.similar\s*\?\s*`[^`]*유사 · 자습용 · 응시 \$\{exam\.count\}명`/);
  assert.match(read('apmath/js/classroom.js'), /row\.similar \? `유사 · 자습용 · 응시 \$\{row\.submittedCount\}명`/);
});

// ---- 학생 포털 ----
test('학생 포털: 유사 시험은 입력은 되지만 "진행 중" 개수·독촉에 세지 않고 전체 목록에는 자습용으로 남는다', () => {
  const html = read('apmath/student/index.html');
  const helpers = html.match(/function isStudentPortalSelfStudy\(exam\) \{[\s\S]*?function groupStudentPortalExams\(exams, today = new Date\(\)\) \{[\s\S]*?\n    \}/);
  assert.ok(helpers, 'portal grouping helpers exist');
  const statusFn = sliceFunction(html, 'getStudentPortalRecordedSubmission');
  const ctx = { Date, Number, String, Array, Math };
  vm.createContext(ctx);
  vm.runInContext(read('apmath/js/similar-exam.js'), ctx);
  vm.runInContext(`${statusFn}\n${helpers[0]}`, ctx);
  const groups = ctx.groupStudentPortalExams([
    { assignment_id: 'a1', archive_file: ORIGINAL_A, is_submitted: 0 },
    { assignment_id: 'a2', archive_file: ORIGINAL_B, is_submitted: 1 },
    { assignment_id: 'a3', archive_file: SIMILAR, is_submitted: 0 },
  ]);
  assert.deepEqual(Array.from(groups.all, (e) => e.assignment_id), ['a1', 'a2', 'a3'], '유사도 전체 목록에서 열 수 있다');
  assert.deepEqual(Array.from(groups.pending, (e) => e.assignment_id), ['a1'], '진행 중(독촉) 집계는 기출만');
  assert.deepEqual(Array.from(groups.complete, (e) => e.assignment_id), ['a2']);
  const submittedSimilar = ctx.groupStudentPortalExams([{ assignment_id: 'a4', archive_file: SIMILAR, is_submitted: 1 }]);
  assert.deepEqual(Array.from(submittedSimilar.complete, (e) => e.assignment_id), ['a4'], '제출한 유사 결과는 기록·열람된다');
  // 카드: 유사는 "유사 · 자습용"으로 조용히, 입력 단추(틀린 번호 체크)는 기출과 같이 남는다.
  assert.match(html, /selfStudy\) statusParts\.push\('유사 · 자습용'\)/);
  assert.match(html, /submissionUnknown \|\| selfStudy \? '' : 'pending'/);
  assert.match(html, /onclick="renderOmrInput\('\$\{escapeHtml\(exam\.assignment_id\)\}'\)">틀린 번호 체크/);
  // 학생 포털은 같은 판정 파일을 불러 쓴다(한 곳).
  assert.match(html, /<script src="\.\.\/js\/similar-exam\.js\?v=[^"]+"><\/script>/);
  assert.doesNotMatch(html, /startsWith\('similar\//);
});

test('학생 포털 배포: 판정 파일이 공개 검증 목록에 있고 버전 네 곳이 같다', () => {
  const release = read('tools/ci/student-portal-public-release.mjs');
  assert.match(release, /'apmath\/js\/similar-exam\.js'/);
  const version = JSON.parse(read('apmath/student/student-version.json')).version;
  assert.equal(JSON.parse(read('apmath/student/manifest.json')).version, version);
  assert.match(read('apmath/student/sw.js'), new RegExp(`STUDENT_SW_VERSION = '${version.replace(/\./g, '\\.')}'`));
  assert.match(read('apmath/student/index.html'), new RegExp(`STUDENT_APP_VERSION = '${version.replace(/\./g, '\\.')}'`));
  // 교사 화면도 같은 파일을 core.js보다 먼저 불러온다.
  const teacher = read('apmath/index.html');
  assert.ok(teacher.indexOf('js/similar-exam.js') > 0 && teacher.indexOf('js/similar-exam.js') < teacher.indexOf('js/core.js'));
});
