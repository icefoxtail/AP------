// 빠른 찾기(apmath/js/nav-quickfind.js) 검색 코어 + 서랍 권한 일치 + 연결 확인.
// 화면(DOM) 동작은 tests/apms-foundation-browser.cjs 방식의 브라우저 확인으로 본다. 여기서는 순수 함수와 소스 계약만 본다.
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const qfSource = read('apmath/js/nav-quickfind.js');
const labelSource = read('apmath/js/apms-class-label.js');
const uiSource = read('apmath/js/ui.js');
const indexHtml = read('apmath/index.html');
const qfCss = read('apmath/css/nav-quickfind.css');

function load(withLabel = true) {
  const context = { console, Number, String, Array, Object, Set, Map };
  context.window = context;
  vm.createContext(context);
  if (withLabel) vm.runInContext(labelSource, context, { filename: 'apms-class-label.js' });
  vm.runInContext(qfSource, context, { filename: 'nav-quickfind.js' });
  return vm.runInContext(`({
    search: apmsQuickFindSearch, shortcuts: apmsQuickFindShortcuts, mask: apmsQfMaskPhone,
    features: APMS_QF_FEATURES, runnerIds: Object.keys(APMS_QF_RUNNERS)
  })`, context);
}

const raw = load();
// vm 안에서 만든 배열은 다른 realm이라 deepStrictEqual이 어긋난다. JSON으로 한 번 옮겨 비교한다.
const clone = value => JSON.parse(JSON.stringify(value));
const qf = {
  search: (q, c, o) => clone(raw.search(q, c, o)),
  shortcuts: (r, n) => clone(raw.shortcuts(r, n)),
  mask: raw.mask,
  features: clone(raw.features),
  runnerIds: clone(raw.runnerIds)
};

const classes = [
  { id: 'c1', name: '중3A', grade: '중3', teacher_name: '김선생', is_active: 1 },
  { id: 'c2', name: '중3A', grade: '중3', teacher_name: '박준성', is_active: 1 },
  { id: 'c3', name: '심화반', grade: '고1', teacher_name: '김선생', is_active: 1 },
  { id: 'c4', name: '옛반', grade: '중1', teacher_name: '김선생', is_active: 0 }
];
const students = [
  { id: 's1', name: '김민수', school_name: '왕지중', grade: '중3', status: '재원', phone: '010-1234-5678', guardian_phone: '010-9999-0001' },
  { id: 's2', name: '김민수', school_name: '왕지중', grade: '고1', status: '재원', phone: '010-2222-3333' },
  { id: 's3', name: '이서윤', school_name: '송정중', grade: '중3', status: '퇴원', phone: '' },
  { id: 's4', name: '박지호', school_name: '왕지중', grade: '중3', status: '재원', phone: '010-5555-6666' },
  { id: 's5', name: '미배정생', school_name: '', grade: '중2', status: '재원', phone: '' }
];
const class_students = [
  { class_id: 'c1', student_id: 's1' },
  { class_id: 'c3', student_id: 's2' },
  { class_id: 'c1', student_id: 's3' },
  { class_id: 'c2', student_id: 's4' }
];
const exam_schedules = [
  { id: 'e1', school_name: '왕지중', grade: '중3', exam_name: '1학기 중간고사', exam_date: '2026-04-20' },
  { id: 'e2', school_name: '왕지중', grade: '중3', exam_name: '2학기 기말고사', exam_date: '2026-12-10' }
];
const class_exam_assignments = [
  { id: 'a1', class_id: 'c1', exam_title: '왕지중 2025 기말', exam_date: '2026-11-01', archive_file: 'wj2025.json' },
  { id: 'a2', class_id: 'c2', exam_title: '송정중 2025 중간', exam_date: '2026-11-02', archive_file: 'sj2025.json' }
];

function ctxFor(role, mine) {
  return {
    role, classes, students, class_students, exam_schedules, class_exam_assignments, today: '2026-11-02',
    // 선생님은 담당이 김선생인 반만 접근 가능하다는 가정
    canSeeClass: role === 'admin' ? () => true : cls => String(cls.teacher_name) === (mine || '김선생')
  };
}
const titles = result => result.items.map(i => i.title);
const types = result => result.items.map(i => i.type);

// ── 검색 코어 ──
{
  const r = qf.search('중3', ctxFor('admin'));
  assert.deepStrictEqual(types(r).slice(0, 2), ['class', 'class'], '반이 학생보다 먼저');
  assert.ok(r.items.some(i => i.type === 'student' && i.title === '김민수'), '학년이 중3인 학생도 나온다');
  assert.ok(!r.items.some(i => i.id === 'c4'), '비활성 반은 나오지 않는다');
}
{
  // 동명 반: 원장은 두 반을 모두 보고, 담당이 다르므로 담당 표기가 붙는다
  const r = qf.search('중3A', ctxFor('admin'));
  const cls = r.items.filter(i => i.type === 'class');
  assert.strictEqual(cls.length, 2);
  assert.ok(cls.every(i => i.title === '중3A'), '학년이 겹쳐 쓰이지 않는다(중3 · 중3A 금지)');
  assert.deepStrictEqual(cls.map(i => i.teacherTag).sort(), ['김선생', '박준성']);
  // 선생님은 자기 반만 보이고, 같은 이름의 다른 반이 없으니 담당 표기가 없다
  const t = qf.search('중3A', ctxFor('teacher'));
  const mine = t.items.filter(i => i.type === 'class');
  assert.strictEqual(mine.length, 1);
  assert.strictEqual(mine[0].teacherTag, '');
  assert.strictEqual(mine[0].id, 'c1');
}
{
  // 같은 이름의 반이 담당별로 있으면 학생 줄에도 담당이 붙는다
  const s4 = qf.search('박지호', ctxFor('admin')).items[0];
  assert.ok(s4.sub.startsWith('중3A(박준성)'), s4.sub);
  const s1 = qf.search('김민수 중3', ctxFor('admin')).items.find(i => i.id === 's1');
  assert.ok(s1.sub.startsWith('중3A(김선생)'), s1.sub);
}
{
  // 심화반 + 학년: 이름에 학년 글자가 없으면 앞에 붙는다
  const r = qf.search('고1', ctxFor('admin'));
  assert.ok(r.items.some(i => i.type === 'class' && i.title === '고1 심화반'));
}
{
  // 동명이인: 둘 다 나오고, 반·학교·학년으로 구분된다
  const r = qf.search('김민수', ctxFor('admin'));
  const same = r.items.filter(i => i.type === 'student' && i.title === '김민수');
  assert.strictEqual(same.length, 2);
  assert.notStrictEqual(same[0].sub, same[1].sub);
  assert.ok(same.some(i => i.sub.includes('중3A') && i.sub.includes('중3')));
  assert.ok(same.some(i => i.sub.includes('고1 심화반') && i.sub.includes('고1')));
  // 이름 + 반 낱말로 좁힐 수 있다
  const narrowed = qf.search('김민수 고1', ctxFor('admin'));
  assert.deepStrictEqual(narrowed.items.filter(i => i.type === 'student').map(i => i.id), ['s2']);
}
{
  // 재원생이 퇴원생보다 먼저, 퇴원은 상태가 표시된다
  const r = qf.search('중3', ctxFor('admin'));
  const order = r.items.filter(i => i.type === 'student').map(i => i.id);
  assert.ok(order.indexOf('s1') < order.indexOf('s3'));
  assert.ok(r.items.find(i => i.id === 's3').sub.includes('퇴원'));
}
{
  // 선생님: 보이지 않는 반(박준성 담당)의 학생·자료는 숨고, 반 없는 학생은 보인다
  const r = qf.search('박지호', ctxFor('teacher'));
  assert.strictEqual(r.total, 0);
  assert.strictEqual(qf.search('박지호', ctxFor('admin')).total, 1);
  assert.strictEqual(qf.search('미배정생', ctxFor('teacher')).items[0].sub.split(' · ')[0], '미배정');
  assert.ok(!qf.search('송정중 2025', ctxFor('teacher')).items.some(i => i.type === 'assignment'));
  assert.ok(qf.search('송정중 2025', ctxFor('admin')).items.some(i => i.type === 'assignment'));
}
{
  // 전화번호: 검색은 되지만 결과에는 뒤 4자리만 보인다
  const r = qf.search('1234', ctxFor('admin'));
  assert.deepStrictEqual(r.items.map(i => i.id), ['s1'], '숫자 3자리 이상이면 전화번호로도 찾는다');
  assert.ok(r.items[0].sub.includes('****5678'));
  const r2 = qf.search('010-1234', ctxFor('admin'));
  assert.strictEqual(r2.items[0].id, 's1');
  assert.ok(r2.items[0].sub.includes('****5678'));
  const g2 = qf.search('010-9999', ctxFor('admin'));
  assert.strictEqual(g2.items[0].id, 's1');
  assert.ok(g2.items[0].sub.includes('****0001'), '보호자 번호도 뒤 4자리만');
  assert.strictEqual(qf.search('12', ctxFor('admin')).items.filter(i => i.sub.includes('****')).length, 0, '두 자리는 전화 검색 아님');
  const all = JSON.stringify([r2, g2, qf.search('김민수', ctxFor('admin'))]);
  assert.ok(!/010-?1234-?5678|1234-5678|01012345678|9999-0001/.test(all), '전화번호 전체가 결과에 나오지 않는다');
  assert.strictEqual(qf.mask('010-1234-5678'), '****5678');
  assert.strictEqual(qf.mask('12'), '');
  assert.strictEqual(qf.mask(''), '');
}
{
  // 0건, 빈 입력
  const none = qf.search('zzzz없는이름', ctxFor('teacher'));
  assert.deepStrictEqual({ n: none.items.length, t: none.total }, { n: 0, t: 0 });
  assert.deepStrictEqual(qf.search('   ', ctxFor('teacher')), { items: [], total: 0 });
}
{
  // 많음: 상위 limit개만, total은 전체 건수
  const many = [];
  const map = [];
  for (let i = 0; i < 45; i++) {
    many.push({ id: 'm' + i, name: '학생' + i, school_name: '왕지중', grade: '중2', status: '재원' });
  }
  const r = qf.search('학생', { role: 'teacher', students: many, classes: [], class_students: map }, { limit: 20 });
  assert.strictEqual(r.items.length, 20);
  assert.ok(r.total >= 45);
}
{
  // 시험일정: 다가오는 일정이 먼저
  const r = qf.search('왕지중', ctxFor('admin'), { types: ['exam'] });
  assert.deepStrictEqual(r.items.map(i => i.id), ['e2', 'e1']);
  assert.strictEqual(r.items[0].action.date, '2026-12-10');
}

// ── 기능 이름·별칭·권한 ──
const featureIds = (query, role) => qf.search(query, ctxFor(role), { types: ['feature'] }).items.map(i => i.id);
{
  assert.strictEqual(featureIds('진도', 'teacher')[0], 'progress');
  assert.strictEqual(featureIds('교재', 'teacher')[0], 'progress');
  assert.strictEqual(featureIds('OMR', 'teacher')[0], 'exam');
  assert.strictEqual(featureIds('omr', 'teacher')[0], 'exam');
  assert.strictEqual(featureIds('성적 입력', 'teacher')[0], 'exam');
  assert.strictEqual(featureIds('원내평가', 'teacher')[0], 'exam');
  assert.strictEqual(featureIds('클리닉', 'teacher')[0], 'clinic');
  assert.strictEqual(featureIds('오답', 'teacher')[0], 'clinic');
  assert.strictEqual(featureIds('유사문항', 'teacher')[0], 'clinic');
  assert.strictEqual(featureIds('학급', 'teacher')[0], 'classManage');
  assert.strictEqual(featureIds('학급', 'admin')[0], 'classManage');
  assert.strictEqual(featureIds('시험지', 'teacher')[0], 'vault');
}
{
  // 권한 밖은 보이지 않는다: 원장에게는 교재·클리닉·원내평가·리포트 센터가 없다(D1)
  ['진도', '교재', '클리닉', '오답', 'OMR', '원내평가', '리포트', '출석부', '일지', '학교성적'].forEach(word => {
    const ids = featureIds(word, 'admin');
    ['progress', 'clinic', 'exam', 'report', 'attendance', 'journal', 'school'].forEach(id => {
      assert.ok(!ids.includes(id), `원장에게 ${id}가 보이면 안 됨 (검색어 ${word})`);
    });
  });
  // 선생님에게는 원장 전용(진단평가·관리·아카이브)이 없다
  ['진단평가', '관리', '아카이브', '기출'].forEach(word => {
    const ids = featureIds(word, 'teacher');
    ['diagnostic', 'manage', 'archive'].forEach(id => assert.ok(!ids.includes(id), `선생님에게 ${id}가 보이면 안 됨 (${word})`));
  });
  assert.ok(featureIds('진단', 'admin').includes('diagnostic'));
  // 선생님이 가진 퇴원생/일정/시간표는 두 권한 모두에 있다
  ['퇴원생', '일정', '시간표', '학생관리'].forEach(word => {
    assert.ok(featureIds(word, 'admin').length && featureIds(word, 'teacher').length, word);
  });
}
{
  // 입력이 비었을 때 바로 가기: 권한에 맞는 기능만, 중복 없음
  const teacher = qf.shortcuts('teacher', 8);
  const admin = qf.shortcuts('admin', 8);
  assert.strictEqual(teacher.length, 8);
  assert.strictEqual(new Set(teacher.map(i => i.id)).size, 8);
  assert.ok(teacher.some(i => i.id === 'clinic'));
  assert.ok(!admin.some(i => ['clinic', 'progress', 'exam'].includes(i.id)));
  assert.ok(admin.some(i => i.id === 'classManage'));
}

// ── 서랍과 같은 권한 기준 (ui.js buildDrawerMenu를 실제로 실행해 대조) ──
function drawerActions(role) {
  const start = uiSource.indexOf('function buildDrawerMenu(');
  const end = uiSource.indexOf('function ensureDrawerStyle(');
  assert.ok(start > 0 && end > start, 'ui.js에서 buildDrawerMenu를 찾지 못함');
  const actions = [];
  const sandbox = {
    drawerSection: () => '',
    drawerItem: (icon, label, action) => { actions.push(String(action)); return ''; }
  };
  vm.createContext(sandbox);
  vm.runInContext(uiSource.slice(start, end) + `\nbuildDrawerMenu(${JSON.stringify(role)});`, sandbox);
  return actions;
}
{
  ['admin', 'teacher'].forEach(role => {
    const actions = drawerActions(role);
    assert.ok(actions.length >= 8, `${role} 서랍 항목을 읽지 못함`);
    qf.features.forEach(feature => {
      const inDrawer = actions.some(action => feature.markers.some(marker => action.includes(marker)));
      assert.strictEqual(inDrawer, feature.roles.includes(role),
        `기능 "${feature.label}"이 ${role} 서랍과 어긋남 (서랍에 ${inDrawer ? '있음' : '없음'}, 빠른 찾기 권한 ${feature.roles.includes(role) ? '있음' : '없음'})`);
    });
    // 반대 방향: 서랍 항목은 모두 빠른 찾기에서 찾을 수 있어야 한다
    actions.forEach(action => {
      const covered = qf.features.some(feature => feature.roles.includes(role) && feature.markers.some(marker => action.includes(marker)));
      assert.ok(covered, `${role} 서랍 항목이 빠른 찾기 기능 표에 없음: ${action.slice(0, 80)}`);
    });
  });
  // 모든 기능에 실행기가 있다
  qf.features.forEach(f => assert.ok(qf.runnerIds.includes(f.id), `실행기 없음: ${f.id}`));
  assert.strictEqual(new Set(qf.features.map(f => f.id)).size, qf.features.length, '기능 id 중복');
}

// ── 소스 계약 ──
{
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|apiCall|callApi|sendBeacon/.test(qfSource), '서버 호출 없음');
  assert.match(qfSource, /type="search"/);
  assert.match(qfSource, /enterkeyhint=/);
  assert.match(qfSource, /isComposing/, '한글 조합 중 Enter 처리');
  assert.match(qfSource, /Escape|closeModal/);
  assert.match(qfSource, /key\.toLowerCase\(\) === 'k'/);
  assert.match(qfSource, /key === '\/'/);
  assert.match(qfSource, /apmsQfIsTyping/, '입력 중 / 무시');
  assert.match(qfCss, /font-size:\s*16px/);
  assert.match(qfCss, /\.apms-qf-open\s*\{[^}]*height:\s*44px/);
  assert.match(qfCss, /min-width:\s*44px/);
}

// ── 연결 ──
{
  assert.strictEqual((indexHtml.match(/js\/nav-quickfind\.js/g) || []).length, 1);
  assert.strictEqual((indexHtml.match(/css\/nav-quickfind\.css/g) || []).length, 1);
  assert.ok(indexHtml.indexOf('js/nav-quickfind.js') > indexHtml.indexOf('js/apms-class-label.js'));
  assert.ok(indexHtml.indexOf('js/nav-quickfind.js') < indexHtml.indexOf('src="app.js"'));
  const buttons = indexHtml.match(/<button[^>]*class="apms-qf-open[^>]*>/g) || [];
  assert.strictEqual(buttons.length, 2, '휴대폰 헤더와 PC 상단 막대에 각각 하나');
  buttons.forEach(b => {
    assert.match(b, /aria-label="빠른 찾기"/);
    assert.match(b, /onclick="apmsQuickFindOpen\(\)"/);
  });
  // 헤더 왼쪽 묶음(☰·←)은 건드리지 않았다
  assert.match(indexHtml, /<div class="mobile-header-left">[\s\S]*?<\/div>\s*<div class="brand mobile-header-brand"/);
  // 사용자 이름 칸은 그대로 id를 유지(ui.js가 갱신)
  assert.match(indexHtml, /id="mobile-header-user"/);
  // 원장 대시보드 검색은 같은 코어를 쓴다
  const adminSource = read('apmath/js/dashboard-admin.js');
  assert.match(adminSource, /apmsQuickFindSearch\(key, apmsQfBuildContext\(\)/);
}

console.log('apms-quickfind test passed');
