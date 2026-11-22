const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'archive', 'assessment');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const Diagnostic = require(path.join(dir, 'diagnostic-report-data.js'));
const KeyResolver = require(path.join(root, 'archive', 'archive2-key-resolver.js'));
const CounselData = require(path.join(dir, 'counsel-report-data.js'));
const CounselView = require(path.join(dir, 'counsel-report-view.js'));

// 개인정보 없는 가짜 by-class 응답(읽기 라우트가 주는 모양: students/sessions/wrong_answers/assignments/result_items).
const STUDENT = '가짜학생';
const OTHER = '다른학생';
const TYPES = { PT_A: '유형 에이', PT_B: '유형 비' };
const labelOf = (key) => TYPES[key] || '';
function resultItems(sessionId, wrongNos, withMeta) {
  return Array.from({ length: 12 }, (_, i) => {
    const no = i + 1;
    return {
      session_id: sessionId, assignment_id: 'as1', order_no: no, question_no: no,
      result_status: wrongNos.includes(no) ? 'wrong' : 'correct',
      source_question_uid: withMeta && no <= 8 ? `qid_v1_${String(no).padStart(64, '0')}` : null,
      standard_unit: withMeta ? (no <= 6 ? '단원 하나' : '단원 둘') : null,
      type_key: withMeta && no <= 8 ? (no % 2 ? 'PT_A' : 'PT_B') : null,
      difficulty: withMeta ? (no <= 4 ? '1' : no <= 10 ? '3' : 'UNKNOWN') : null,
      correct_answer: 'SECRET_ANSWER', metadata_json: '{"statement":"SECRET_BODY"}',
    };
  });
}
const response = (extra) => ({
  success: true,
  students: [{ id: 'S1', name: STUDENT, school_name: '가짜고', grade: '고1' }, { id: 'S2', name: OTHER, school_name: '가짜고', grade: '고1' }],
  sessions: [
    { id: 'ses1', student_id: 'S1', assignment_id: 'as1', exam_title: '가짜 기말', exam_date: '2026-06-20', question_count: 12 },
    { id: 'ses2', student_id: 'S2', assignment_id: 'as1', exam_title: '가짜 기말', exam_date: '2026-06-20', question_count: 12 },
  ],
  wrong_answers: [],
  assignments: [{ id: 'as1', class_id: 'C1', exam_title: '가짜 기말', exam_date: '2026-06-20' }],
  result_items: [...resultItems('ses1', [1, 3, 9, 11], true), ...resultItems('ses2', [2, 4, 6, 8, 10], true)],
  ...extra,
});
const ids = { classId: 'C1', assignmentId: 'as1', studentId: 'S1' };

// 1. 틀린 유형 표: 유형별 "n문항 중 m개 틀림", 유형 없는 문항은 "유형 정보 없음" 한 줄
{
  const model = CounselData.buildModel(response(), ids, labelOf);
  assert.ok(model.ok, 'model should build');
  assert.strictEqual(model.report.totals.total, 12);
  assert.strictEqual(model.report.totals.wrong, 4);
  const { html } = CounselView.render(model);
  const types = html.match(/<table class="grid types">[\s\S]*?<\/table>/)[0];
  const rows = [...types.matchAll(/<tr[^>]*><th scope="row">([^<]*)<\/th><td[^>]*>(.*?)<\/td><td[^>]*>(.*?)<\/td><\/tr>/g)].map((m) => ({ name: m[1], count: m[2], nos: m[3] }));
  // 유형 에이: 문항 1,3,5,7 중 1,3 틀림 / 유형 없음: 9~12 중 9,11 틀림
  const a = rows.find((r) => r.name === '유형 에이');
  assert.ok(a, 'labelled wrong type row');
  assert.match(a.count, /4문항 중 <b>2개<\/b> 틀림/);
  assert.strictEqual(a.nos, '1번, 3번');
  const none = rows.find((r) => r.name === '유형 정보 없음');
  assert.ok(none, 'type-less wrong items collapse into 유형 정보 없음');
  assert.match(none.count, /4문항 중 <b>2개<\/b> 틀림/);
  assert.ok(!rows.some((r) => r.name === '유형 비'), 'a type with no wrong item is not listed');
  assert.strictEqual(rows[rows.length - 1].name, '유형 정보 없음', 'no-info row is last');
  assert.ok(/<th scope="col">/.test(types) && (types.match(/<th scope="col">/g) || []).length <= 4, 'table has at most 4 columns');
  // 단원·난이도·번호별
  assert.match(html, /단원 하나/);
  assert.match(html, /단계 정보 없음/, 'invalid difficulty is 단계 정보 없음, never guessed');
  assert.strictEqual((html.match(/class="c [oxu]"/g) || []).length, 12 + 2, '12 chips + 2 legend swatches');
  assert.match(html, /이번 시험에서 <b>12문항 중 8개<\/b>를 맞혔고 4개를 틀렸습니다/);
}

// 2. 넣지 않는 것: 다른 학생·비교 수치·본문·정답·해설·단정
{
  const model = CounselData.buildModel(response(), ids, labelOf);
  const { html } = CounselView.render(model);
  assert.ok(!html.includes(OTHER), 'other student name must not appear');
  assert.ok(!/석차|등수|반 평균|반 정답률|평균|상위|하위/.test(html), 'no comparison numbers');
  assert.ok(!/SECRET_ANSWER|SECRET_BODY|해설|<img|<svg[^>]*class="figure/.test(html), 'no question body, answer or explanation');
  assert.ok(!/약점|예상 점수|예상점수|합격/.test(html), 'no assertive wording');
  // 다른 학생(S2)의 오답이 섞이지 않는다: S2가 틀린 6번은 S1에서 맞힘
  assert.ok(!/6번/.test(html.match(/<table class="grid types">[\s\S]*?<\/table>/)[0]), "other student's wrong numbers do not leak");
}

// 3. 옛 출제분(결과 항목 없음, 틀린 번호만): 번호별 정오만, 단원·유형 칸은 정보 없음
{
  const legacy = response({ result_items: [], wrong_answers: [{ session_id: 'ses1', question_id: '2', student_id: 'S1' }, { session_id: 'ses1', question_id: '5', student_id: 'S1' }] });
  const model = CounselData.buildModel(legacy, ids, labelOf);
  assert.ok(model.ok);
  assert.strictEqual(model.source, 'wrong_answers');
  const { html } = CounselView.render(model);
  assert.match(html, /<th scope="row">유형 정보 없음<\/th><td[^>]*>12문항 중 <b>2개<\/b> 틀림/);
  assert.match(html, /단원 정보 없음/);
  assert.match(html, /저장되기 전에 응시한 것/);
}

// 4. 유형 이름을 못 불러와도(labelOf 없음) 키 글자를 내보내지 않고 "유형 정보 없음"
{
  const model = CounselData.buildModel(response(), ids, null);
  const { html } = CounselView.render(model);
  assert.ok(!/PT_[AB]/.test(html), 'raw type keys are never shown');
  assert.match(html, /유형 정보 없음/);
}

// 5. 제출 결과 없음·결과 항목도 문항 수도 없음
{
  assert.strictEqual(CounselData.buildModel(response(), { ...ids, studentId: 'S9' }, labelOf).reason, 'no-session');
  const empty = response({ result_items: [], sessions: [{ id: 'ses1', student_id: 'S1', assignment_id: 'as1', question_count: 0 }] });
  assert.strictEqual(CounselData.buildModel(empty, ids, labelOf).reason, 'no-items');
}

// 6. 틀린 문항이 없으면 표 대신 한 줄
{
  const perfect = response({ result_items: resultItems('ses1', [], true) });
  const { html } = CounselView.render(CounselData.buildModel(perfect, ids, labelOf));
  assert.match(html, /틀린 문항이 없습니다/);
  assert.ok(!/<table class="grid types">/.test(html));
}

// 7. 키 해석기와 함께(진단평가 결과표와 같은 이름표 경로)
{
  const resolverLabel = Diagnostic.createLabelOf({ taxonomy: { problemTypes: [{ problemTypeKey: 'PT_A', canonicalLabelKo: '실제 유형 이름' }], templates: [] }, concepts: {}, conditions: {}, extensions: {} }, KeyResolver);
  const { html } = CounselView.render(CounselData.buildModel(response(), ids, resolverLabel));
  assert.match(html, /<th scope="row">실제 유형 이름<\/th>/);
}

// 8. 페이지 껍데기: 이름은 title·주소·저장소에 두지 않고, 로그인 없으면 요청하지 않는다
{
  const html = read('archive/assessment/counsel-report.html');
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(!title.includes(STUDENT) && !/\$\{|\{\{/.test(title), 'static title without student name');
  const loads = [...html.matchAll(/<script[^>]*\ssrc="([^"?]+)/g)].map((m) => m[1]);
  const order = ['diagnostic-report-data.js', 'diagnostic-report-view.js', 'counsel-report-data.js', 'counsel-report-view.js', 'counsel-report.js'];
  order.forEach((name, i) => {
    assert.ok(loads.includes(name), `${name} is loaded`);
    if (i) assert.ok(loads.indexOf(order[i - 1]) < loads.indexOf(name), `${order[i - 1]} loads before ${name}`);
  });
  const code = ['counsel-report.js', 'counsel-report-data.js', 'counsel-report-view.js'].map((f) => read(`archive/assessment/${f}`).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')).join('\n');
  assert.ok(!/localStorage\s*\.\s*setItem|sessionStorage|indexedDB|document\.title\s*=|history\.(push|replace)State|location\.(hash|search)\s*=/.test(code), 'nothing is stored or written to the address');
  const main = read('archive/assessment/counsel-report.js');
  assert.ok(main.indexOf('teacherSession()') < main.indexOf('fetchByClass(ids, session)'), 'login is checked before any request');
  assert.match(main, /로그인이 필요합니다/);
  assert.ok(!/password|raw_password|login_id/.test(main), 'no login bypass or credential handling');
  assert.match(main, /exam-sessions\/by-class/);
}

// 9. 들어가는 링크와 릴리스 목록
{
  const ws = read('apmath/js/ws-exam-workspace.js');
  const fn = ws.match(/function wsxCounselLink\(row\) \{[\s\S]*?\n\}/)[0];
  assert.match(fn, /counsel-report\.html\?/);
  assert.match(fn, /student=\$\{encodeURIComponent\(row\.sid\)\}/);
  assert.ok(!/\.name|studentName/.test(fn), 'link carries ids only, never a name');
  assert.match(fn, /assignment_id/);
  const manifest = JSON.parse(read('tools/archive-pages-release-manifest.json'));
  for (const f of ['counsel-report.html', 'counsel-report.js', 'counsel-report.css', 'counsel-report-data.js', 'counsel-report-view.js']) {
    assert.ok(manifest.files.includes(`archive/assessment/${f}`), `${f} is shipped`);
    assert.ok(fs.existsSync(path.join(dir, f)), `${f} exists`);
  }
}

console.log('counsel-report tests passed');
