// M4 반 관리 · M6 학생 상세 작업 화면 확인 하니스 (테스트 전용. 서버·인증 코드는 건드리지 않는다).
//
// tests/apms-foundation-browser.cjs와 같은 방식이다: 정적 서버로 저장소를 열고, 실서버 주소(workers.dev)로 가는
// API 요청을 Playwright가 가로채 가짜 응답을 준다. 이 파일은 그 위에 (1) 보낸 요청을 기록하고 (2) 반 0/5/30개,
// 학생 정보 적음/보통/많음 상태를 만들고 (3) 저장 뒤 전체 재조회(initial-data)가 없는지 센다.
//
// 실행:  node tests/ws-student-browser.cjs                       (동작 검사만)
//        WS_SHOT_DIR=/경로 node tests/ws-student-browser.cjs      (+ 4기기 × 상태 스크린샷, 가로 넘침·12px 미만·24px 미만 검사)
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE로 경로 지정 가능)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = process.env.APMS_ROOT ? path.resolve(process.env.APMS_ROOT) : path.resolve(__dirname, '..');
const shotDir = process.env.WS_SHOT_DIR || '';
const only = process.env.WS_SHOT_ONLY ? process.env.WS_SHOT_ONLY.split(',') : null;
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';

const DEVICES = [
    { id: 'phone-390x844', width: 390, height: 844, mobile: true },
    { id: 'tablet-p-800x1280', width: 800, height: 1280, mobile: true },
    { id: 'tablet-l-1280x800', width: 1280, height: 800, mobile: true },
    { id: 'pc-1440x900', width: 1440, height: 900, mobile: false }
];

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
function startServer() {
    const server = http.createServer((req, res) => {
        const url = decodeURIComponent(req.url.split('?')[0]);
        const file = path.normalize(path.join(root, url.endsWith('/') ? url + 'index.html' : url));
        if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; return res.end('not found'); }
        res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
        res.end(fs.readFileSync(file));
    });
    return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
const NAMES = ['김민수', '이서윤', '박지호', '최유나', '정도윤', '강하린', '조현우', '윤서아', '장민재', '임채원', '한지우', '오세린'];

// classCount: 0 | 5 | 30.  studentLevel: 'few' | 'normal' | 'many' (학생 한 명에 붙은 보호자·상담·이력 양)
function buildFixture({ classCount = 5, studentLevel = 'normal' } = {}) {
    const today = new Date().toLocaleDateString('sv-SE');
    const classes = Array.from({ length: classCount }, (_, i) => {
        const grade = GRADES[i % GRADES.length];
        const letter = String.fromCharCode(65 + (i % 6));
        return {
            id: `c${i + 1}`, name: i % 5 === 4 ? `${grade} 심화${letter}` : `${grade}${letter}`, grade, subject: '수학',
            teacher_name: i % 3 === 0 ? '김선생' : i % 3 === 1 ? '박선생' : '', schedule_days: ['1,3,5', '2,4', '1,4', '3,6'][i % 4],
            time_label: ['6:30~8:00', '4:50~6:20', '8:00~9:30', ''][i % 4], is_active: i % 9 === 8 ? 0 : 1, textbook: ''
        };
    });
    const students = [], class_students = [], consultations = [], parent_contacts = [], message_logs = [];
    const perClass = classCount > 10 ? 3 : 8;
    classes.forEach((c, ci) => {
        for (let i = 0; i < perClass; i++) {
            const id = `${c.id}s${i}`;
            const rich = studentLevel === 'many';
            students.push({
                id, name: NAMES[(i + ci) % NAMES.length], grade: c.grade, school_name: '왕지중', status: '재원',
                student_phone: studentLevel === 'few' ? '' : '010-0000-0000', parent_phone: studentLevel === 'few' ? '' : '010-1111-2222',
                guardian_relation: studentLevel === 'few' ? '' : '모', student_address: rich ? '광주광역시 광산구 왕지로 12, 101동 1203호' : '', memo: rich ? '수업 태도가 좋음. 숙제 확인 필요. 시험 기간 보충 일정 협의.' : '',
                created_at: '2026-03-02', onboarding_started_at: '2026-03-02'
            });
            class_students.push({ class_id: c.id, student_id: id });
        }
    });
    // 퇴원생 현황용: 올해 퇴원한 학생 몇 명(기존 반을 유지한 채 상태만 '퇴원')
    const year = new Date().getFullYear();
    if (classes.length) {
        for (let i = 0; i < (studentLevel === 'many' ? 12 : 4); i++) {
            const c = classes[i % classes.length];
            const id = `w${i}`;
            students.push({ id, name: NAMES[(i + 5) % NAMES.length] + '(퇴원)', grade: c.grade, school_name: '왕지중', status: '퇴원', withdrawn_at: `${year}-0${(i % 8) + 1}-1${i % 9}`, created_at: `${year - 1}-03-02`, student_pin: '1234' });
            class_students.push({ class_id: c.id, student_id: id });
        }
    }
    if (studentLevel !== 'few') {
        students.slice(0, 3).forEach((s, i) => {
            const n = studentLevel === 'many' ? 12 : 2;
            for (let k = 0; k < n; k++) consultations.push({
                id: `cn-${s.id}-${k}`, student_id: s.id, date: `2026-10-${String(28 - k).padStart(2, '0')}`, type: k % 2 ? '전화' : '대면',
                content: `상담 내용 ${k + 1}: 최근 성적 변화와 숙제 수행 정도를 이야기함. 다음 시험 대비 계획 공유.`, next_action: k % 3 === 0 ? '다음 주 재확인' : '', teacher_name: '김선생'
            });
            parent_contacts.push({ id: `pc-${s.id}-1`, student_id: s.id, name: '김어머니', relation: '모', phone: '010-1111-2222', is_primary: 1 });
            if (studentLevel === 'many') parent_contacts.push({ id: `pc-${s.id}-2`, student_id: s.id, name: '김아버지', relation: '부', phone: '010-3333-4444', is_primary: 0 });
        });
    }
    return {
        success: true, classes, students, class_students, attendance: [], homework: [],
        consultations, operation_memos: [], exam_sessions: [], wrong_answers: [], class_exam_assignments: [], exam_schedules: [], academy_schedules: [], journals: [],
        class_textbooks: [], class_daily_records: [], class_daily_progress: [], timetable_classes: classes.filter(c => c.is_active), timetable_class_students: [],
        timetable_students: [], timetable_class_textbooks: [], class_progress_date: today, class_progress_taxonomy_version: 'x',
        class_progress_taxonomy: [], class_progress_snapshots: [], class_progress_items: [], class_progress_phases: [],
        attendance_history: [], homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [], exam_blueprints: [],
        exam_question_reviews: [], exam_analysis_meta: [], school_exam_records: [], parent_contacts, message_logs: [],
        student_status_history: [], class_transfer_history: [], timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

// 요청 기록: calls = [{ method, path, body }]
async function openApp(browser, base, device, theme, role, fixtureOptions, hooks = {}) {
    const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: 1, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700
    });
    const calls = [];
    const fixtureData = buildFixture(fixtureOptions);
    await context.route(API + '**', route => {
        const request = route.request();
        const url = new URL(request.url());
        const apiPath = url.pathname.replace(/^.*\/api\//, '');
        const method = request.method();
        if (method === 'OPTIONS') {
            return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        }
        let body = null;
        try { body = request.postDataJSON(); } catch (error) { body = null; }
        calls.push({ method, path: apiPath, body });
        let response = hooks.respond ? hooks.respond({ method, apiPath, body, fixtureData }) : undefined;
        if (response === undefined) {
            if (apiPath === 'initial-data') response = fixtureData;
            else if (method === 'POST' && apiPath === 'classes') {
                const id = `cls_new_${calls.length}`;
                response = { success: true, id, class: { id, name: body.name, grade: body.grade, subject: body.subject || '수학', teacher_name: body.teacher_name, schedule_days: body.schedule_days, textbook: '', is_active: 1, day_group: '', time_label: body.time_label } };
            } else if (method === 'DELETE' && /^classes\//.test(apiPath)) response = { success: true, mode: 'archived' };
            else if (method === 'PATCH' || method === 'POST' || method === 'DELETE') response = { success: true };
            else response = { success: true, data: [], items: [], consultations: [], contacts: [], consents: [] };
        }
        route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(response) });
    });
    await context.route(/^https:\/\/api\.qrserver\.com\//, route => route.abort());
    await context.addInitScript(({ theme, role }) => {
        localStorage.setItem('APMATH_THEME', theme);
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 't1', name: role === 'admin' ? '원장' : '김선생', role, session_token: 'local-test-only' }));
    }, { theme, role });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    if (process.env.WS_BEFORE) await page.addInitScript(() => { window.__wsBefore = true; }); // 옛 코드(변경 전 스냅샷)로 비교 스크린샷을 찍을 때
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && Array.isArray(state.db.classes) && (typeof openClassManageWorkspace === 'function' || window.__wsBefore), null, { timeout: 15000 });
    await page.waitForTimeout(700);
    return { context, page, errors, calls, fixtureData };
}

// 화면 검사: 가로 넘침, 12px 미만 글자, 24px 미만 누르는 영역(모달 안만)
async function inspect(page) {
    return page.evaluate(() => {
        const overlay = document.getElementById('modal-overlay');
        const open = overlay && !overlay.classList.contains('hidden');
        const body = document.getElementById('modal-body');
        const content = document.getElementById('modal-content');
        const out = { docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, modalOverflowX: 0, smallText: [], smallTargets: [], clipped: [] };
        if (!open || !body) return out;
        const cr = content.getBoundingClientRect();
        out.modalBox = { left: Math.round(cr.left), top: Math.round(cr.top), right: Math.round(cr.right), bottom: Math.round(cr.bottom), vw: innerWidth, vh: innerHeight };
        const root = body.querySelector('.apms-modal') || body;
        out.modalOverflowX = Math.max(0, root.scrollWidth - root.clientWidth);
        const visible = el => { const r = el.getBoundingClientRect(); const st = getComputedStyle(el); return r.width > 0 && r.height > 0 && st.visibility !== 'hidden' && st.display !== 'none'; };
        const seen = new Set();
        body.querySelectorAll('*').forEach(el => {
            if (!visible(el)) return;
            const st = getComputedStyle(el);
            const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
            if (hasText && parseFloat(st.fontSize) < 12 - 0.01) {
                const key = (el.className || el.tagName) + ':' + st.fontSize;
                if (!seen.has(key)) { seen.add(key); out.smallText.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${st.fontSize} "${el.textContent.trim().slice(0, 20)}"`); }
            }
            if (el.matches('button, a[href], select, input:not([type=hidden]), textarea, [role=button], summary')) {
                const r = el.getBoundingClientRect();
                const target = el.matches('input[type=checkbox], input[type=radio]') && el.closest('label') ? el.closest('label').getBoundingClientRect() : r;
                if (target.height < 24 - 0.5 || target.width < 24 - 0.5) out.smallTargets.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)} ${Math.round(target.width)}x${Math.round(target.height)} "${(el.textContent || el.value || '').trim().slice(0, 16)}"`);
            }
        });
        return out;
    });
}

function summarizeProblems(tag, info, errors) {
    const problems = [];
    if (info.docOverflow > 1) problems.push(`${tag}: 문서 가로 넘침 ${info.docOverflow}px`);
    if (info.modalOverflowX > 1) problems.push(`${tag}: 모달 안 가로 넘침 ${info.modalOverflowX}px`);
    const b = info.modalBox;
    if (b && (b.left < -1 || b.right > b.vw + 1 || b.top < -1 || b.bottom > b.vh + 1)) problems.push(`${tag}: 모달이 화면 밖 ${JSON.stringify(b)}`);
    if (info.smallText.length) problems.push(`${tag}: 12px 미만 글자 ${info.smallText.join(' | ')}`);
    if (info.smallTargets.length) problems.push(`${tag}: 24px 미만 누르는 영역 ${info.smallTargets.join(' | ')}`);
    if (errors.length) problems.push(`${tag}: 페이지 오류 ${errors.join(' | ')}`);
    return problems;
}

const isOpen = page => page.evaluate(() => { const o = document.getElementById('modal-overlay'); return !o.classList.contains('hidden') && o.classList.contains('show'); });
const initialDataCalls = calls => calls.filter(c => c.method === 'GET' && c.path === 'initial-data').length;
const writeCalls = (calls, from = 0) => calls.slice(from).filter(c => c.method !== 'GET');

// ------------------------------------------------------------------ M4 동작 검사
async function behaviourClass(browser, base) {
    const { context, page, errors, calls } = await openApp(browser, base, DEVICES[3], 'light', 'admin', { classCount: 5, studentLevel: 'normal' });
    try {
        const dialogs = [];
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.accept(); });
        const baseline = initialDataCalls(calls);
        assert.ok(baseline >= 1, '처음 한 번은 initial-data를 읽는다');

        await page.evaluate(() => openClassManageModal());
        await page.waitForTimeout(450);
        assert.equal(await isOpen(page), true);
        assert.equal(await page.locator('.apms-modal--workspace.ws-class').count(), 1, '반 관리는 W 작업 화면');
        assert.equal(await page.evaluate(() => modalStepStack.length), 0, '모달 단계 쌓기 없음');
        assert.equal(await page.locator('#ws-class-list .ws-class__item').count(), 5, '반 5개 목록');
        // 반 고르기는 서버 호출 없이 오른쪽 폼만 바꾼다
        const before = calls.length;
        await page.locator('#ws-class-list .ws-class__item').nth(1).click();
        assert.equal(calls.length, before, '목록에서 고르는 데 서버 호출 없음');
        assert.equal(await page.locator('#edit-cls-name').count(), 1);
        // 라벨 없는 입력 0
        const unlabeled = await page.evaluate(() => Array.from(document.querySelectorAll('#ws-class-detail input:not([type=checkbox]), #ws-class-detail select')).filter(el => !document.querySelector(`label[for="${el.id}"]`)).map(el => el.id));
        assert.deepEqual(unlabeled, [], '라벨 없는 입력 없음');

        // 수정 저장: payload 필드 고정, 전체 재조회 없음, 화면 안 닫힘
        const oldName = await page.inputValue('#edit-cls-name');
        await page.fill('#edit-cls-name', oldName + '수정');
        let writeStart = calls.length;
        await page.locator('#ws-class-save').click();
        await page.waitForTimeout(300);
        let w = writeCalls(calls, writeStart);
        assert.equal(w.length, 1);
        assert.equal(w[0].method, 'PATCH');
        assert.match(w[0].path, /^classes\/c\d+$/);
        assert.deepEqual(Object.keys(w[0].body).sort(), ['grade', 'name', 'schedule_days', 'subject', 'teacher_name', 'time_label']);
        assert.equal(w[0].body.name, oldName + '수정');
        assert.equal(initialDataCalls(calls), baseline, '저장 뒤 initial-data 재조회 없음');
        assert.equal(await isOpen(page), true, '저장 뒤에도 같은 자리');
        assert.match(await page.locator('#ws-class-list .ws-class__item.is-active').innerText(), /수정/, '목록 이름 갱신');
        assert.equal(await page.evaluate(id => state.db.classes.find(c => c.id === id).name, w[0].path.split('/')[1]), oldName + '수정', 'state.db 갱신');

        // 두 번 눌러도 한 번만 저장
        await page.fill('#edit-cls-subject', '수학2');
        writeStart = calls.length;
        await page.evaluate(() => { const b = document.getElementById('ws-class-save'); b.click(); b.click(); });
        await page.waitForTimeout(300);
        assert.equal(writeCalls(calls, writeStart).length, 1, '더블 클릭해도 저장 한 번');

        // 새 반 추가: 같은 자리 폼, 응답의 class를 목록에 넣는다
        await page.locator('#ws-class-add-btn').click();
        assert.equal(await page.locator('#add-cls-name').count(), 1);
        await page.locator('#ws-class-save').click();
        await page.waitForTimeout(200);
        assert.equal(writeCalls(calls, writeStart + 1).length, 0, '이름 없으면 전송하지 않음');
        await page.fill('#add-cls-name', '새로운반');
        await page.check('.add-cls-days[value="2"]');
        await page.selectOption('#add-cls-period', '6:30~8:00');
        writeStart = calls.length;
        await page.locator('#ws-class-save').click();
        await page.waitForTimeout(300);
        w = writeCalls(calls, writeStart);
        assert.equal(w.length, 1);
        assert.equal(w[0].method, 'POST');
        assert.equal(w[0].path, 'classes');
        assert.deepEqual(Object.keys(w[0].body).sort(), ['grade', 'is_active', 'name', 'schedule_days', 'subject', 'teacher_name', 'time_label']);
        assert.equal(w[0].body.schedule_days, '2');
        assert.equal(w[0].body.time_label, '6:30~8:00');
        assert.equal(initialDataCalls(calls), baseline, '추가 뒤 재조회 없음');
        assert.equal(await page.locator('#ws-class-list .ws-class__item').count(), 6, '목록에 새 반');
        assert.match(await page.locator('#ws-class-list .ws-class__item.is-active').innerText(), /새로운반/, '새 반이 선택됨');

        // 숨김 → 복구 → 보관 (확인창 수락)
        writeStart = calls.length;
        await page.getByRole('button', { name: '숨김', exact: true }).click();
        await page.waitForTimeout(300);
        w = writeCalls(calls, writeStart);
        assert.equal(w.length, 1);
        assert.equal(w[0].body.is_active, 0);
        assert.equal(await page.locator('#ws-class-list .ws-class__item.is-hidden').count() >= 1, true, '숨김 구역에 표시');
        await page.getByRole('button', { name: '복구', exact: true }).click();
        await page.waitForTimeout(300);
        assert.equal(writeCalls(calls, writeStart).pop().body.is_active, 1);
        writeStart = calls.length;
        await page.getByRole('button', { name: '반 보관' }).click();
        await page.waitForTimeout(300);
        w = writeCalls(calls, writeStart);
        assert.equal(w.length, 1);
        assert.equal(w[0].method, 'DELETE');
        assert.equal(initialDataCalls(calls), baseline, '숨김·복구·보관 뒤 재조회 없음');

        // 변경 중 Esc는 확인, 바깥 클릭은 무시(W)
        await page.locator('#ws-class-list .ws-class__item').first().click();
        await page.fill('#edit-cls-name', '바꾸는 중');
        dialogs.length = 0;
        page.removeAllListeners('dialog');
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });
        await page.mouse.click(1425, 450);
        await page.waitForTimeout(300);
        assert.equal(await isOpen(page), true, '바깥 클릭으로 닫히지 않음');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        assert.equal(dialogs.length, 1, '변경 중 Esc → 확인');
        assert.equal(await isOpen(page), true, '확인에서 취소 → 유지');
        await page.locator('#ws-class-list .ws-class__item').nth(2).click();
        assert.equal(dialogs.length, 2, '변경 중 다른 반 선택 → 확인');
        assert.equal(await page.inputValue('#edit-cls-name'), '바꾸는 중', '확인에서 취소 → 입력 유지');
        page.removeAllListeners('dialog');
        page.on('dialog', dialog => dialog.accept());
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(page), false, '수락 → 닫힘');

        // 헤더 취소와 하단 취소가 겹치지 않는다
        await page.evaluate(() => openClassManageModal());
        await page.waitForTimeout(450);
        await page.locator('#ws-class-add-btn').click();
        const cancelButtons = await page.evaluate(() => Array.from(document.querySelectorAll('#modal-content button')).filter(b => b.offsetParent && /^취소$/.test(b.textContent.trim())).length);
        assert.equal(cancelButtons, 1, '취소 버튼은 헤더 하나뿐');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);

        // 반 화면에서 "반 설정" → 같은 작업 화면, 저장하면 반 화면으로 복귀 (returnTo 계약)
        await page.evaluate(() => renderClass('c1'));
        await page.waitForTimeout(500);
        await page.evaluate(() => openClassroomManagementAction('c1', 'edit'));
        await page.waitForTimeout(450);
        assert.equal(await page.locator('#edit-cls-name').count(), 1);
        await page.fill('#edit-cls-teacher', '박선생');
        writeStart = calls.length;
        await page.locator('#ws-class-save').click();
        await page.waitForTimeout(700);
        assert.equal(writeCalls(calls, writeStart).length, 1);
        assert.equal(await isOpen(page), false, 'returnTo=classDetail 이면 저장 뒤 닫고 반 화면으로');
        assert.equal(await page.evaluate(() => state.ui.currentClassId), 'c1');
        assert.equal(initialDataCalls(calls), baseline, '반 설정 저장 뒤에도 재조회 없음');

        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally {
        await context.close();
    }
}

// ------------------------------------------------------------------ M4 재등원 (퇴원생 현황 안 같은 자리 폼)
async function behaviourRestore(browser, base) {
    const respond = ({ method, apiPath, body, fixtureData }) => {
        const m = /^students\/([^/]+)\/restore$/.exec(apiPath);
        if (method === 'PATCH' && m) {
            const st = fixtureData.students.find(x => x.id === m[1]);
            return { success: true, student: Object.assign({}, st, { status: '재원' }), class_student: { student_id: m[1], class_id: body.class_id }, student_enrollments: [] };
        }
        return undefined;
    };
    const { context, page, errors, calls } = await openApp(browser, base, DEVICES[0], 'light', 'admin', { classCount: 5, studentLevel: 'normal' }, { respond });
    try {
        page.on('dialog', dialog => dialog.accept());
        const baseline = initialDataCalls(calls);
        await page.evaluate(() => openWithdrawalReport());
        await page.waitForTimeout(600);
        const rows = () => page.locator('#modal-body .ap-withdrawal-row').count();
        const before = await rows();
        assert.ok(before >= 2, '퇴원생 행이 있다');
        const title = await page.locator('#modal-title').innerText();
        await page.locator('#modal-body .ap-withdrawal-row').first().getByRole('button', { name: '재등원', exact: true }).click();
        await page.waitForTimeout(250);
        assert.equal(await page.locator('#restore-class').count(), 1, '행 아래 폼이 펼쳐진다');
        assert.equal(await page.locator('#modal-title').innerText(), title, '모달을 갈아 끼우지 않는다(목록이 그대로)');
        assert.equal(await page.evaluate(() => modalStepStack.length), 0);
        const unlabeled = await page.evaluate(() => ['restore-class', 'restore-date'].filter(id => !document.querySelector(`label[for="${id}"]`)));
        assert.deepEqual(unlabeled, []);
        const info = await inspect(page);
        assert.deepEqual(info.smallText, [], '재등원 목록 12px 미만 글자 없음');
        await page.screenshot({ path: path.join(shotDir || '/tmp', 'restore-inline-phone.png') }).catch(() => {});
        // 같은 행 다시 누르면 접힘
        await page.locator('#modal-body .ap-withdrawal-row').first().getByRole('button', { name: '재등원', exact: true }).click();
        assert.equal(await page.locator('#restore-class').count(), 0);
        await page.locator('#modal-body .ap-withdrawal-row').first().getByRole('button', { name: '재등원', exact: true }).click();
        // 반을 고르지 않으면 보내지 않는다
        await page.selectOption('#restore-class', '');
        let start = calls.length;
        await page.getByRole('button', { name: '재등원 처리' }).click();
        await page.waitForTimeout(200);
        assert.equal(writeCalls(calls, start).length, 0, '반을 고르지 않으면 전송하지 않음');
        await page.selectOption('#restore-class', 'c2');
        start = calls.length;
        await page.getByRole('button', { name: '재등원 처리' }).click();
        await page.waitForTimeout(500);
        const w = writeCalls(calls, start);
        assert.equal(w.length, 1);
        assert.equal(w[0].method, 'PATCH');
        assert.match(w[0].path, /^students\/w\d+\/restore$/);
        assert.deepEqual(Object.keys(w[0].body).sort(), ['class_id', 'reenrollment_date']);
        assert.equal(w[0].body.class_id, 'c2');
        assert.equal(await isOpen(page), true, '저장 뒤 모달이 그대로 열려 있다');
        assert.equal(await rows(), before - 1, '목록에서 그 학생이 빠진다');
        assert.equal(await page.locator('#restore-class').count(), 0);
        assert.equal(initialDataCalls(calls), baseline, '재등원 뒤 전체 재조회 없음');
        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally {
        await context.close();
    }
}

// ------------------------------------------------------------------ 스크린샷
async function shoot(browser, base) {
    fs.mkdirSync(shotDir, { recursive: true });
    const problems = [];
    const classStates = [0, 5, 30];
    const studentStates = ['few', 'normal', 'many'];
    for (const device of DEVICES) {
        const themes = device.id === 'phone-390x844' ? ['light', 'dark'] : ['light'];
        for (const theme of themes) {
            const tag = `${device.id}-${theme}`;
            const run = async (name, fixtureOptions, role, action, wait = 500) => {
                if (only && !only.includes(name.split('-')[0]) && !only.includes(name)) return;
                const { context, page, errors } = await openApp(browser, base, device, theme, role, fixtureOptions);
                try {
                    await action(page);
                    await page.waitForTimeout(wait);
                    const info = await inspect(page);
                    await page.screenshot({ path: path.join(shotDir, `${name}-${tag}.png`) });
                    problems.push(...summarizeProblems(`${name} ${tag}`, info, errors));
                } finally { await context.close(); }
            };
            const before = !!process.env.WS_BEFORE;
            for (const n of classStates) {
                await run(`class-list-${n}`, { classCount: n }, 'admin', page => page.evaluate(() => openClassManageModal()));
                if (n > 0) {
                    await run(`class-edit-${n}`, { classCount: n }, 'admin', async page => {
                        if (before) { await page.evaluate(() => openEditClassModal('c2')); return; }
                        await page.evaluate(() => openClassManageModal());
                        await page.waitForTimeout(400);
                        await page.locator('#ws-class-list .ws-class__item').nth(1).click();
                    }, 800);
                }
            }
            await run('class-add-5', { classCount: 5 }, 'admin', async page => {
                if (before) { await page.evaluate(() => openAddClassModal()); return; }
                await page.evaluate(() => openClassManageModal());
                await page.waitForTimeout(400);
                await page.locator('#ws-class-add-btn').click();
            }, 800);
            await run('restore-inline', { classCount: 5 }, 'admin', async page => {
                await page.evaluate(() => openWithdrawalReport());
                await page.waitForTimeout(600);
                await page.locator('#modal-body .ap-withdrawal-row').first().getByRole('button', { name: '재등원', exact: true }).click();
            }, 700);
            for (const level of studentStates) {
                const scenario = global.__wsStudentScenarios && global.__wsStudentScenarios[0];
                if (scenario) await scenario(run, level);
            }
        }
    }
    return problems;
}

(async () => {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        if (!process.env.WS_SKIP_BEHAVIOUR) {
            await behaviourClass(browser, base);
            console.log('M4 반 관리 작업 화면 동작 검사 통과');
            await behaviourRestore(browser, base);
            console.log('M4 재등원 같은 자리 폼 동작 검사 통과');
            if (typeof global.__wsStudentBehaviour === 'function') {
                await global.__wsStudentBehaviour(browser, base, { openApp, isOpen, initialDataCalls, writeCalls, DEVICES });
                console.log('M6 학생 상세 동작 검사 통과');
            }
        }
        if (shotDir) {
            const problems = await shoot(browser, base);
            console.log(problems.length ? '문제:\n' + problems.join('\n') : '스크린샷 모두 가로 넘침·12px 미만·24px 미만 터치 없음');
            if (problems.length) process.exitCode = 1;
        }
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
