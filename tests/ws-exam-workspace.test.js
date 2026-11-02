// 원내평가·OMR 통합 작업 화면(M3, 2026-11-02) 결함 조건 테스트.
// 개수가 아니라 결함을 본다: 저장 뒤 반 화면으로 튀지 않는가, 같은 표의 다음 미제출 학생으로 넘어가는가,
// 저장 뒤 전체 재조회(initial-data)·모달 갈아 끼움이 없는가, 저장 payload가 옛 모달과 같은가,
// 늦게 온 응답이 새 화면을 덮지 않는가, 휴대폰에서 누르기 쉬운 크기인가.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const planner = read('apmath/js/classroom-planner.js');
const qrOmr = read('apmath/js/qr-omr.js');
const wsData = read('apmath/js/ws-exam-data.js');
const wsWorkspace = read('apmath/js/ws-exam-workspace.js');
const wsCss = read('apmath/css/ws-exam.css');
const indexHtml = read('apmath/index.html');
const classroom = read('apmath/js/classroom.js');
const dashboard = read('apmath/js/dashboard.js');
const sliceBetween = (src, begin, end) => {
    const i = src.indexOf(begin), j = src.indexOf(end, i + begin.length);
    assert.ok(i >= 0 && j > i, `boundary not found: ${begin}`);
    return src.slice(i, j);
};

// ---------- 가짜 앱 위에서 실제 코드를 실행한다 ----------
function makeApp({ patchResult } = {}) {
    const log = { patch: [], get: [], post: [], delete: [], refreshDataOnly: 0, closeModal: 0, renderClass: 0, loadData: 0, modals: [], toasts: [], confirms: [] };
    const day = '2026-10-30';
    const students = ['s1', 's2', 's3', 's4', 's5'].map((id, i) => ({ id, name: `학생${i + 1}`, status: '재원' }));
    const byClass = {
        c1: {
            sessions: [{ id: 'sess-1', student_id: 's1', class_id: 'c1', assignment_id: 'a1', exam_title: '단원평가', exam_date: day, score: 90, question_count: 20, archive_file: '' }],
            wrong_answers: [{ session_id: 'sess-1', question_id: '3' }, { session_id: 'sess-1', question_id: '9' }],
            assignments: [{ id: 'a1', class_id: 'c1', exam_title: '단원평가', exam_date: day, archive_file: '', question_count: 20, pdf_status: 'pending' }],
            exclusions: [], blueprints: []
        },
        c2: { sessions: [], wrong_answers: [], assignments: [{ id: 'b1', class_id: 'c2', exam_title: '월말평가', exam_date: day, archive_file: '', question_count: 25 }], exclusions: [], blueprints: [] }
    };
    const pendingGets = [];
    const ctx = {
        console: { log() {}, warn() {}, error() {} }, Date, Set, Map, String, Number, Math, JSON, Promise, encodeURIComponent, parseInt, Array, Object, Boolean,
        window: {},
        fetch: async () => ({ ok: false, status: 404 }),
        CONFIG: { API_BASE: 'https://example.test/api' },
        getAuthHeader: () => ({}),
        state: {
            ui: { currentClassId: 'c1' },
            db: {
                classes: [{ id: 'c1', name: '중3A', is_active: 1 }, { id: 'c2', name: '중2B', is_active: 1 }],
                students,
                class_students: students.map(s => ({ class_id: 'c1', student_id: s.id })).concat([{ class_id: 'c2', student_id: 's9' }]),
                exam_sessions: byClass.c1.sessions.slice(), wrong_answers: byClass.c1.wrong_answers.slice(), class_exam_assignments: byClass.c1.assignments.slice(), exam_blueprints: []
            }
        },
        api: {
            get: async url => {
                log.get.push(url);
                if (url.startsWith('exam-sessions/by-class')) {
                    const cid = new URL('http://x/' + url).searchParams.get('class');
                    if (ctx.holdClass === cid) return new Promise(resolve => pendingGets.push(() => resolve({ success: true, ...byClass[cid] })));
                    return { success: true, ...byClass[cid] };
                }
                return { success: true, items: [] };
            },
            patch: async (url, payload) => { log.patch.push({ url, payload: JSON.parse(JSON.stringify(payload)) }); return patchResult ? patchResult(payload) : { success: true, id: `new-${log.patch.length}` }; },
            post: async (url, payload) => { log.post.push({ url, payload }); return { success: true }; },
            delete: async (resource, id) => { log.delete.push({ resource, id }); return { success: true }; }
        },
        apEscapeHtml: v => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'),
        apJsArg: v => JSON.stringify(String(v ?? '')).replace(/"/g, '&quot;'),
        showModal: (title, html) => { log.modals.push({ title, html }); },
        closeModal: () => { log.closeModal += 1; },
        refreshDataOnly: async () => { log.refreshDataOnly += 1; },
        loadData: async () => { log.loadData += 1; },
        renderClass: () => { log.renderClass += 1; },
        renderDashboard: () => {},
        toast: (message, kind) => log.toasts.push([message, kind]),
        confirm: message => { log.confirms.push(message); return ctx.confirmAnswer; },
        confirmAnswer: true,
        setModalReturnView: () => {},
        setModalDirtyChecker: () => {},
        setExamBlueprintsForFiles: () => {},
        ensureBlueprintsForSessions: async () => {},
        findBlueprintForWrong: () => null,
        computeClassWeakUnits: () => [],
        getTodayExamConfig: () => null
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(planner, ctx, { filename: 'classroom-planner.js' });
    vm.runInContext(qrOmr, ctx, { filename: 'qr-omr.js' });
    vm.runInContext(wsData, ctx, { filename: 'ws-exam-data.js' });
    vm.runInContext(wsWorkspace, ctx, { filename: 'ws-exam-workspace.js' });
    return { ctx, log, release: () => pendingGets.splice(0).forEach(fn => fn()) };
}
const wsx = ctx => JSON.parse(JSON.stringify(vm.runInContext('wsx', ctx), (k, v) => (v instanceof Set ? Array.from(v) : v === undefined ? null : v)));
const lastHtml = log => log.modals[log.modals.length - 1].html;

test('저장하면 같은 작업 화면에 머물고, 같은 표의 다음 미제출 학생 입력 칸이 열린다', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamWorkspace('c1');
    assert.equal(wsx(ctx).classId, 'c1');
    await ctx.wsxOpenPanel('s2');
    assert.equal(wsx(ctx).panel.sid, 's2');
    for (const n of ['7', '3']) ctx.wsxToggleQ({ checked: true, value: n });
    const getsBefore = log.get.length;
    await ctx.wsxSavePanel(true);
    // 다음 미제출 학생(명단 순서 s3)의 입력 칸
    assert.equal(wsx(ctx).panel.sid, 's3', '저장한 학생 다음 미제출 학생으로 넘어간다');
    assert.equal(wsx(ctx).panel.loading, false);
    assert.equal(log.patch.length, 1);
    // 반 화면으로 나가지 않고, 모달을 닫거나 다시 열지 않고, 전체 재조회를 하지 않는다
    assert.equal(log.closeModal, 0, '저장 뒤 closeModal 호출 없음');
    assert.equal(log.renderClass, 0, '저장 뒤 반 화면 다시 그리기 없음');
    assert.equal(log.refreshDataOnly, 0, '저장 뒤 refreshDataOnly(전체 initial-data) 없음');
    assert.equal(log.loadData, 0);
    assert.deepEqual(log.get.slice(getsBefore).filter(u => /initial-data|by-class/.test(u)), [], '저장 뒤 서버 재조회 없음');
    // 화면 자료·앱 자료가 새 점수를 갖는다
    const saved = ctx.state.db.exam_sessions.find(s => s.student_id === 's2');
    assert.ok(saved && saved.score === 90, '앱 자료(state.db)에 새 점수가 반영된다');
    assert.ok(ctx.state.db.wrong_answers.some(w => w.session_id === saved.id && w.question_id === '7'));
    assert.match(lastHtml(log), /data-sid="s2" data-pending="0"/, '표에서 저장한 학생은 제출 상태');
    assert.match(lastHtml(log), /data-sid="s3" data-pending="0"|data-sid="s3" data-pending="1"/);
});

test('모든 미제출 학생을 끝내면 입력 칸이 닫히고 표에 점수가 남는다', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamWorkspace('c1');
    for (const sid of ['s2', 's3', 's4', 's5']) {
        await ctx.wsxOpenPanel(sid, { skipConfirm: true });
        await ctx.wsxSavePanel(true);
    }
    assert.equal(wsx(ctx).panel, null, '마지막 학생 저장 뒤 입력 칸이 닫힌다');
    assert.equal(log.patch.length, 4);
    assert.equal(log.closeModal, 0);
    assert.equal(log.get.filter(u => u.includes('initial-data')).length, 0);
    assert.match(lastHtml(log), /제출 5\/5명/);
});

test('저장 실패하면 입력 칸과 입력 내용이 그대로 남는다', async () => {
    const { ctx, log } = makeApp({ patchResult: () => ({ success: false }) });
    await ctx.openExamWorkspace('c1');
    await ctx.wsxOpenPanel('s2');
    ctx.wsxToggleQ({ checked: true, value: '5' });
    await ctx.wsxSavePanel(true);
    const s = wsx(ctx);
    assert.equal(s.panel.sid, 's2');
    assert.deepEqual(s.panel.checked, ['5']);
    assert.equal(s.busy, false, '저장 실패 뒤 다시 누를 수 있다');
    assert.deepEqual(log.toasts.at(-1), ['저장실패', 'warn']);
    assert.equal(ctx.state.db.exam_sessions.length, 1, '실패한 저장은 앱 자료를 바꾸지 않는다');
});

test('저장 payload는 옛 "성적 직접 입력" 모달과 같은 필드·값이다(학생 포털이 읽는 값 불변)', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamWorkspace('c1');
    // 새 제출(미제출 학생 입력): session_id·assignment_id 없이 보낸다(옛 시험 상세의 [입력]과 같다)
    await ctx.wsxOpenPanel('s2');
    for (const n of ['11', '3', '7']) ctx.wsxToggleQ({ checked: true, value: n });
    await ctx.wsxSavePanel(false);
    assert.deepEqual(log.patch[0], {
        url: 'exam-sessions/new',
        payload: { student_id: 's2', exam_title: '단원평가', score: 85, wrong_ids: ['3', '7', '11'], exam_date: '2026-10-30', question_count: 20, class_id: 'c1' }
    });
    // 수정(기존 세션): session_id와 배정 ID를 그대로 보낸다
    await ctx.wsxOpenPanel('s1');
    assert.deepEqual(wsx(ctx).panel.checked, ['3', '9'], '기존 오답이 미리 채워진다');
    ctx.wsxToggleQ({ checked: true, value: '12' });
    await ctx.wsxSavePanel(false);
    assert.deepEqual(log.patch[1].payload, {
        student_id: 's1', exam_title: '단원평가', score: 85, wrong_ids: ['3', '9', '12'], exam_date: '2026-10-30', question_count: 20, class_id: 'c1',
        session_id: 'sess-1', assignment_id: 'a1'
    });
    assert.equal(log.patch.every(p => p.url === 'exam-sessions/new'), true);
});

test('payload를 만드는 곳은 submitOmrResult 하나이고 두 화면이 같이 쓴다', () => {
    const qrCode = qrOmr.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    assert.equal((qrCode.match(/exam-sessions\/new/g) || []).length, 1, 'qr-omr.js에서 단건 저장 경로는 한 곳');
    assert.doesNotMatch(wsWorkspace + wsData, /exam-sessions\/new/, '작업 화면은 payload를 따로 만들지 않는다');
    assert.match(sliceBetween(qrOmr, 'async function handleOMRSave(', '// ─────'), /submitOmrResult\(/);
    assert.match(sliceBetween(wsWorkspace, 'async function wsxSavePanel(', '// ───────────── 삭제'), /submitOmrResult\(/);
    // 점수 식도 같다
    const { ctx } = makeApp();
    for (const [q, wrong] of [[20, 3], [50, 7], [23, 5], [1, 1]]) {
        assert.equal(ctx.wsExamScore(q, wrong), Math.round((q - wrong) * (100 / q)));
    }
});

test('늦게 온 응답이 새로 연 반 화면을 덮지 않는다', async () => {
    const { ctx, release } = makeApp();
    ctx.holdClass = 'c1';
    const first = ctx.openExamWorkspace('c1');
    await Promise.resolve();
    ctx.holdClass = '';
    await ctx.openExamWorkspace('c2');
    assert.equal(wsx(ctx).classId, 'c2');
    release();
    await first;
    assert.equal(wsx(ctx).classId, 'c2', '느린 c1 응답이 c2 화면을 덮지 않는다');
    assert.equal(wsx(ctx).exams.length, 1);
    assert.equal(wsx(ctx).exams[0].title, '월말평가');
});

test('입력 중이면 반·시험을 바꿀 때 확인하고, 거절하면 그대로 있는다', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamWorkspace('c1');
    await ctx.wsxOpenPanel('s2');
    ctx.wsxToggleQ({ checked: true, value: '4' });
    ctx.confirmAnswer = false;
    await ctx.wsxSwitchClass('c2');
    assert.equal(wsx(ctx).classId, 'c1');
    assert.equal(log.confirms.length, 1);
    ctx.confirmAnswer = true;
    await ctx.wsxSwitchClass('c2');
    assert.equal(wsx(ctx).classId, 'c2');
});

test('시험 목록이 비어 있으면 새 시험 입력 칸이 바로 열린다', async () => {
    const { ctx, log } = makeApp();
    ctx.state.db.exam_sessions = [];
    ctx.api.get = async () => ({ success: true, sessions: [], assignments: [], exclusions: [], wrong_answers: [], blueprints: [] });
    await ctx.openExamWorkspace('c1');
    assert.match(lastHtml(log), /id="wsx-new-title"/);
    assert.match(lastHtml(log), /<label class="apms-unified-label" for="wsx-new-title">/);
    await ctx.wsxCreateExam();
    const s = wsx(ctx);
    assert.equal(s.drafts.length, 1);
    assert.equal(s.selKey, s.drafts[0].key);
    assert.match(lastHtml(log), /data-pending="1"/, '만든 시험의 모든 학생이 미제출로 보인다');
});

test('삭제·제외는 이 화면 안에서 끝난다(닫고 전체 재조회하고 다시 열지 않는다)', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamWorkspace('c1');
    await ctx.wsxExcludeStudent('s1');
    assert.equal(log.post.length, 1);
    assert.equal(log.post[0].url, 'class-exam-assignments/exclude-student');
    assert.deepEqual(Object.keys(log.post[0].payload).sort(), ['archive_file', 'assignment_id', 'class_id', 'exam_date', 'exam_title', 'student_id']);
    assert.equal(log.closeModal, 0);
    assert.equal(log.refreshDataOnly, 0);
    assert.equal(log.get.filter(u => u.includes('initial-data')).length, 0);
});

test('옛 진입은 얇은 래퍼다: 같은 이름으로 남아 작업 화면을 연다', async () => {
    const { ctx, log } = makeApp();
    await ctx.openExamGradeView('c1');
    assert.equal(wsx(ctx).classId, 'c1');
    await ctx.openExamDetail('c1', '단원평가', '2026-10-30', '');
    assert.equal(wsx(ctx).selKey, wsx(ctx).exams[0].key);
    await ctx.openGlobalExamGradeView?.();
    assert.match(sliceBetween(dashboard, 'function openGlobalExamGradeView() {', 'function openOperationMenu('), /openExamWorkspace\(''\)/);
    assert.doesNotMatch(sliceBetween(dashboard, 'function openGlobalExamGradeView() {', 'function openOperationMenu('), /showModal\(/, '반 고르기 모달은 없다(반 전환은 작업 화면의 탭)');
    assert.ok(log.modals.length > 0);
});

test('openOMR: 작업 화면이 있으면 그 화면의 학생 입력 칸으로, 없으면 옛 모달로 열린다', async () => {
    // 작업 화면 없이 qr-omr.js만 있는 환경: 옛 "성적 직접 입력" 모달이 열린다(테스트·비상용)
    const modals = [];
    const ctxOld = {
        console, Date, Set, Map, String, Number, Math, encodeURIComponent,
        state: { db: { classes: [], class_students: [{ class_id: 'c1', student_id: 's1' }], students: [], exam_sessions: [], wrong_answers: [] }, ui: {} },
        document: { getElementById: () => null }, localStorage: { setItem() {} },
        getTodayExamConfig: () => null, showModal: (t, h) => modals.push({ t, h }), api: {}
    };
    ctxOld.window = ctxOld;
    vm.createContext(ctxOld);
    vm.runInContext(qrOmr, ctxOld);
    await vm.runInContext("openOMR('s1', '단원평가', 20, 'c1', '', '', 'class')", ctxOld);
    assert.equal(modals.length, 1);
    assert.equal(modals[0].t, '성적 직접 입력');
    assert.match(modals[0].h, /id="omr-class-id-hidden"/);
    // 작업 화면이 있는 앱: 모달을 따로 열지 않고 작업 화면의 새 시험 칸(그 학생 먼저)으로 간다
    const { ctx, log } = makeApp();
    await ctx.openOMR('s2', '단원평가', 20, 'c1', '', '', 'class');
    assert.ok(log.modals.every(m => m.title === '원내평가'), '성적 직접 입력 모달은 열리지 않는다');
    assert.equal(wsx(ctx).newForm.studentId, 's2', '새 시험 칸이 그 학생 먼저로 열린다');
    await ctx.wsxCreateExam();
    assert.equal(wsx(ctx).panel.sid, 's2', '시험을 만들면 그 학생의 입력 칸이 바로 열린다');
    assert.equal(wsx(ctx).panel.title, '단원평가');
    assert.equal(log.closeModal, 0);
});

// ---------- 정적 결함 조건 ----------
test('작업 화면 코드는 모달을 갈아 끼우거나 닫고 다시 열지 않는다', () => {
    const code = (wsWorkspace + wsData).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    assert.doesNotMatch(code, /showModalStep|replaceModalStep/);
    assert.doesNotMatch(code, /closeModal\(/);
    assert.doesNotMatch(code, /refreshDataOnly|loadData\(|initial-data/);
    assert.doesNotMatch(code, /openExamDetail\(|openExamGradeView\(|openOMR\(/, '작업 화면이 옛 열기 함수를 되부르지 않는다');
});

test('W 등급 공통 부품 마크업을 쓰고 저장 위치는 하단 액션줄 하나다', () => {
    const shell = sliceBetween(wsWorkspace, 'function wsxShellHtml() {', 'function wsxMount() {');
    for (const cls of ['apms-modal apms-modal--workspace', 'apms-workspace__bar', 'apms-workspace__list', 'apms-workspace__detail', 'apms-modal__actions'])
        assert.ok(shell.includes(cls), cls);
    // 하단 액션줄에 헤더 "취소"와 같은 닫기 버튼을 따로 두지 않는다(취소·닫기 중복 금지)
    assert.doesNotMatch(sliceBetween(wsWorkspace, 'function wsxActionsHtml() {', 'function wsxShellHtml() {'), /closeModal|>닫기<|>취소</);
    // QR 생성기도 하단 닫기를 따로 두지 않는다
    assert.doesNotMatch(sliceBetween(qrOmr, 'function openQrGenerator(cid) {', 'function shareQrUrl('), /apms-modal__actions[\s\S]*closeModal\(\)/);
});

test('입력칸은 모두 라벨이 있고 문항 번호는 44px 이상 누르는 칸이다', () => {
    const html = wsWorkspace;
    const inputs = [...html.matchAll(/<input id="([^"]+)"/g)].map(m => m[1]);
    assert.ok(inputs.length >= 4);
    for (const id of inputs) assert.match(html, new RegExp(`for="${id}"`), `${id} 라벨`);
    assert.match(wsCss, /\.wsx \.wsx-grid\s*\{[^}]*minmax\(44px, 1fr\)/);
    assert.match(wsCss, /\.wsx \.wsx-q span\s*\{[^}]*min-height: 44px/);
    assert.match(wsCss, /\.wsx \.wsx-btn\s*\{[^}]*min-height: 44px/);
    assert.match(wsCss, /\.wsx \.wsx-qcount\s*\{[^}]*font-size: 16px/, '휴대폰 입력 글자 16px(자동 확대 방지)');
});

test('작업 화면 CSS: 12px 미만 글자 없음, 새 !important 없음, 색은 토큰만', () => {
    for (const m of wsCss.matchAll(/font-size:\s*(\d+(?:\.\d+)?)px/g)) assert.ok(Number(m[1]) >= 12, `font-size ${m[1]}px`);
    assert.equal((wsCss.match(/!important/g) || []).length, 1, 'hidden 속성 한 곳 말고는 !important 없음');
    const hex = [...wsCss.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(m => m[0].toLowerCase());
    assert.ok(hex.every(c => c === '#fff'), `토큰이 아닌 색: ${hex.filter(c => c !== '#fff').join(', ')}`);
});

test('index.html: 새 파일은 qr-omr.js·apms-unified-modal.css 바로 다음 줄에만 추가했다', () => {
    const lines = indexHtml.split('\n');
    const at = re => lines.findIndex(l => re.test(l));
    const qr = at(/js\/qr-omr\.js/);
    assert.match(lines[qr + 1], /js\/ws-exam-data\.js/);
    assert.match(lines[qr + 2], /js\/ws-exam-workspace\.js/);
    const modalCss = at(/css\/apms-unified-modal\.css/);
    assert.match(lines[modalCss + 1], /css\/ws-exam\.css/);
});

test('반 화면 도구 줄: QR 진입은 유지하고 원내평가/OMR은 작업 화면으로 간다', () => {
    const bar = sliceBetween(classroom, 'function renderClassToolBarV4B(', 'function renderClassStudentBoardV4B(');
    assert.match(bar, /openClassroomFeature\('\$\{cid\}', 'qr'\)">QR<\/button>/);
    assert.match(bar, /openClassroomFeature\('\$\{cid\}', 'exam'\)">원내평가\/OMR<\/button>/);
    assert.match(sliceBetween(classroom, 'function openClassroomFeature(', 'function renderClassToolBarV4B('), /exam: \(\) => openExamGradeView\(classId\)/);
    assert.match(sliceBetween(planner, 'async function openExamGradeView(', 'async function downloadClassExamPdf('), /openExamWorkspace\(classId\)/);
});
