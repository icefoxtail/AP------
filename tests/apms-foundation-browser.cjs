// APMS 디자인 기반 화면 확인 하니스 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
//
// 방식: 정적 서버로 저장소를 열고, 실서버 주소(workers.dev)로 가는 API 요청을 Playwright가 가로채
// 가짜 응답(initial-data 등)을 준다. 로그인 세션은 localStorage에 넣는 테스트 값이다(실제 토큰 아님).
// 로그인 오버레이를 숨기지 않는다 — 세션이 있으면 앱이 스스로 대시보드를 그린다.
//
// 실행:  node tests/apms-foundation-browser.cjs            (동작 검사만)
//        APMS_SHOT_DIR=/경로 node tests/apms-foundation-browser.cjs   (+ 기기×테마 스크린샷, 가로 넘침 검사)
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE로 경로 지정 가능)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = process.env.APMS_ROOT ? path.resolve(process.env.APMS_ROOT) : path.resolve(__dirname, '..'); // APMS_ROOT: 비교용으로 다른 시점 파일을 풀어 둔 폴더
const shotDir = process.env.APMS_SHOT_DIR || '';
const only = process.env.APMS_SHOT_ONLY ? process.env.APMS_SHOT_ONLY.split(',') : null; // 예: dash-teacher,class,student-login
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';

const DEVICES = [
    { id: 'phone-390x844', width: 390, height: 844, mobile: true },
    { id: 'tablet-p-800x1280', width: 800, height: 1280, mobile: true },
    { id: 'tablet-l-1280x800', width: 1280, height: 800, mobile: true },
    { id: 'pc-1440x900', width: 1440, height: 900, mobile: false },
    { id: 'pc-1280x800', width: 1280, height: 800, mobile: false }
];
const THEMES = ['light', 'dark'];

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

function fixture() {
    const today = new Date().toLocaleDateString('sv-SE');
    const classes = [
        ['c1', '중3A', '중3', '1,3,5', '6:30~8:00'], ['c2', '중2B', '중2', '2,4', '4:50~6:20'], ['c3', '고1 심화', '고1', '1,4', '8:00~9:30'],
        ['c4', '중1C', '중1', '2,5', '6:30~8:00'], ['c5', '고2 미적', '고2', '3,6', '4:50~6:20']
    ].map(([id, name, grade, days, time]) => ({ id, name, grade, subject: '수학', teacher_name: '김선생', schedule_days: days, time_label: time, is_active: 1 }));
    const names = ['김민수', '이서윤', '박지호', '최유나', '정도윤', '강하린', '조현우', '윤서아', '장민재', '임채원', '한지우', '오세린'];
    const students = [];
    const class_students = [];
    const attendance = [];
    const homework = [];
    classes.forEach((c, ci) => {
        for (let i = 0; i < 8; i++) {
            const id = `${c.id}s${i}`;
            students.push({ id, name: names[(i + ci) % names.length] + (i > 11 ? '2' : ''), grade: c.grade, school: '왕지중', status: '재원', phone: '010-0000-0000', guardian_phone: '010-1111-2222', enroll_date: '2026-03-02' });
            class_students.push({ class_id: c.id, student_id: id });
            attendance.push({ student_id: id, class_id: c.id, date: today, status: i % 7 === 0 ? '결석' : i % 5 === 0 ? '지각' : '출석' });
            homework.push({ student_id: id, class_id: c.id, date: today, status: i % 3 === 0 ? '미완료' : '완료' });
        }
    });
    return {
        success: true, classes, students, class_students, attendance, homework,
        consultations: [], operation_memos: [{ id: 'm1', content: '시험 기간 보강 일정 확인', created_at: today, is_done: 0 }],
        exam_sessions: [], wrong_answers: [], class_exam_assignments: [], exam_schedules: [], academy_schedules: [], journals: [],
        class_textbooks: [], class_daily_records: [], class_daily_progress: [], timetable_classes: [], timetable_class_students: [],
        timetable_students: [], timetable_class_textbooks: [], class_progress_date: today, class_progress_taxonomy_version: 'x',
        class_progress_taxonomy: [], class_progress_snapshots: [], class_progress_items: [], class_progress_phases: [],
        attendance_history: [], homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [], exam_blueprints: [],
        exam_question_reviews: [], exam_analysis_meta: [], school_exam_records: [], parent_contacts: [], message_logs: [],
        student_status_history: [], class_transfer_history: [], timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

async function openApp(browser, base, device, theme, role) {
    const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: 1, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700
    });
    await context.route(API + '**', route => {
        const url = new URL(route.request().url());
        const body = url.pathname.endsWith('/initial-data') ? fixture() : { success: true, data: [], items: [] };
        route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(body) });
    });
    await context.route(/^https:\/\/api\.qrserver\.com\//, route => route.abort());
    await context.addInitScript(({ theme, role }) => {
        localStorage.setItem('APMATH_THEME', theme);
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 't1', name: role === 'admin' ? '원장' : '김선생', role, session_token: 'local-test-only' }));
    }, { theme, role });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    return { context, page, errors };
}

async function overflowOf(page) {
    return page.evaluate(() => ({
        doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        modal: (() => {
            const el = document.getElementById('modal-content');
            if (!el || document.getElementById('modal-overlay').classList.contains('hidden')) return null;
            const r = el.getBoundingClientRect();
            return { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom), vw: innerWidth, vh: innerHeight };
        })()
    }));
}

const DEMO_W = `
<div class="apms-modal apms-modal--workspace">
  <div class="apms-workspace__bar"><span class="apms-unified-context__name">중3A · 샘플 작업 화면</span></div>
  <div class="apms-workspace">
    <div class="apms-workspace__list">
      ${Array.from({ length: 9 }, (_, i) => `<button type="button" class="apms-workspace__item${i === 1 ? ' is-active' : ''}">항목 ${i + 1}<br><span style="color:var(--secondary);font-size:12px">제출 ${10 + i}/20</span></button>`).join('')}
    </div>
    <div class="apms-workspace__detail">
      <div class="apms-unified-form" style="display:flex;flex-direction:column;gap:12px">
        <div class="apms-unified-context"><div class="apms-unified-context__name">선택한 항목 상세</div><div class="apms-unified-context__meta">목록에서 고르면 이 칸만 바뀝니다.</div></div>
        <label class="apms-unified-label" for="demo-w-a">제목</label><input id="demo-w-a" class="apms-unified-control" value="단원평가 1회">
        <label class="apms-unified-label" for="demo-w-b">메모</label><textarea id="demo-w-b" class="apms-unified-control" rows="4">내용</textarea>
        ${Array.from({ length: 6 }, (_, i) => `<div class="apms-unified-context"><div class="apms-unified-context__name">학생 ${i + 1}</div><div class="apms-unified-context__meta">제출 10-31 21:0${i}</div></div>`).join('')}
      </div>
    </div>
  </div>
  <div class="apms-modal__actions"><button type="button" class="btn apms-unified-quiet" onclick="closeModal()">닫기</button><button type="button" class="btn btn-primary apms-unified-primary">저장</button></div>
</div>`;
const DEMO_C = `
<div class="apms-modal apms-modal--confirm">
  <div class="apms-unified-context"><div class="apms-unified-context__name">시간표를 적용할까요?</div><div class="apms-unified-context__meta">적용하면 오늘부터 새 시간표가 보입니다.</div></div>
  <p style="margin:0;font-size:13px;line-height:1.5">중3A, 중2B 2개 반의 요일이 바뀝니다.</p>
  <div class="apms-modal__actions"><button type="button" class="btn apms-unified-quiet" onclick="closeModal()">취소</button><button type="button" class="btn btn-primary apms-unified-primary" onclick="closeModal()">적용</button></div>
</div>`;
const DEMO_P = `
<div class="apms-modal apms-modal--panel">
  <div class="apms-modal__body">
    <div class="apms-unified-context"><div class="apms-unified-context__name">전체 화면 패널 샘플</div><div class="apms-unified-context__meta">컨트롤이 많은 독립 도구</div></div>
  </div>
  <div class="apms-modal__actions"><button type="button" class="btn apms-unified-quiet" onclick="closeModal()">닫기</button></div>
</div>`;

async function behaviour(browser, base) {
    const { context, page, errors } = await openApp(browser, base, DEVICES[3], 'light', 'teacher');
    try {
        const isOpen = () => page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden') && document.getElementById('modal-overlay').classList.contains('show'));
        const dialogs = [];
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); await dialog.dismiss(); });

        // F: 반 추가. 하단 액션줄에 추가 버튼이 있고 헤더 행동은 없다.
        await page.evaluate(() => { openAddClassModal(); state.ui.modalReturnView = null; }); // 반 관리 목록으로 돌아가는 연결은 이 검사와 무관하다
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), true);
        assert.equal(await page.locator('#modal-body .apms-modal__actions button').count(), 2);
        assert.equal(await page.locator('#modal-action-btn').isVisible(), false, '헤더 행동 버튼은 없다');
        const box = await page.locator('.apms-modal__actions').boundingBox();
        const modal = await page.locator('#modal-content').boundingBox();
        assert.ok(Math.abs((box.y + box.height) - (modal.y + modal.height)) < 3, '액션줄이 모달 맨 아래에 붙어 있다');
        // 깨끗하면 Esc로 바로 닫힌다
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false, '변경 없음 → Esc로 닫힘');
        assert.equal(dialogs.length, 0);

        // 입력하면 바깥 클릭으로 닫히지 않고, Esc는 확인을 묻는다(취소 → 유지)
        await page.evaluate(() => { openAddClassModal(); state.ui.modalReturnView = null; }); // 반 관리 목록으로 돌아가는 연결은 이 검사와 무관하다
        await page.waitForTimeout(450);
        await page.fill('#add-cls-name', '새 반');
        await page.mouse.click(1425, 450);
        await page.waitForTimeout(400);
        assert.equal(await isOpen(), true, '입력 중 바깥 클릭 → 유지');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
        assert.equal(dialogs.length, 1, 'Esc → 닫을까요? 확인');
        assert.equal(await isOpen(), true, '확인에서 취소 → 유지');
        page.removeAllListeners('dialog');
        page.on('dialog', dialog => dialog.accept());
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false, '확인에서 수락 → 닫힘');

        // 깨끗한 상태 바깥 클릭은 닫는다. 모달 안에서 끌어 밖에서 놓으면 닫지 않는다.
        await page.evaluate(() => { openAddClassModal(); state.ui.modalReturnView = null; }); // 반 관리 목록으로 돌아가는 연결은 이 검사와 무관하다
        await page.waitForTimeout(450);
        await page.mouse.click(1425, 450);
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false, '변경 없음 → 바깥 클릭으로 닫힘');

        // W 등급: 바깥 클릭으로 닫히지 않는다. 폼 안 입력 후에도 Esc는 확인을 묻는다.
        await page.evaluate(html => showModal('작업 화면', html), DEMO_W);
        await page.waitForTimeout(450);
        await page.mouse.click(1425, 450);
        await page.waitForTimeout(400);
        assert.equal(await isOpen(), true, 'W 바깥 클릭 → 유지');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false, 'W 변경 없음 → Esc로 닫힘');

        // 단계 모달: Esc는 맨 위 한 단계만 돌아간다
        await page.evaluate(() => showModal('첫째', '<div class="apms-modal apms-modal--form"><p>1단계</p></div>'));
        await page.waitForTimeout(450);
        await page.evaluate(html => showModalStep('둘째', html), DEMO_C);
        await page.waitForTimeout(450);
        assert.equal(await page.locator('#modal-title').innerText(), '둘째');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await page.locator('#modal-title').innerText(), '첫째', 'Esc → 한 단계만 돌아감');
        assert.equal(await isOpen(), true);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false);

        // 헤더 행동(at/af)을 넘긴 등급 모달은 하단 액션줄로 옮겨 그려지고 눌러서 실행된다
        await page.evaluate(() => { window.__saved = 0; showModal('옮겨 그리기', '<div class="apms-modal apms-modal--form"><input id="x" class="apms-unified-control"></div>', '저장', () => { window.__saved += 1; }); });
        await page.waitForTimeout(450);
        assert.equal(await page.locator('#modal-action-btn').isVisible(), false);
        await page.locator('.apms-modal__actions button', { hasText: '저장' }).click();
        assert.equal(await page.evaluate(() => window.__saved), 1);
        await page.evaluate(() => closeModal(true));
        await page.waitForTimeout(400);

        // Esc 레이어: 모달 위에 늦게 열린 레이어가 있으면 그것만 닫힌다
        await page.evaluate(() => { window.__layer = 0; showModal('아래', '<div class="apms-modal apms-modal--confirm"><p>x</p></div>'); window.__unreg = registerEscapeLayer(() => { window.__layer += 1; window.__unreg(); }); });
        await page.waitForTimeout(450);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        assert.equal(await page.evaluate(() => window.__layer), 1);
        assert.equal(await isOpen(), true, '레이어만 닫히고 모달은 남음');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        assert.equal(await isOpen(), false);

        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally {
        await context.close();
    }
}

async function shoot(browser, base) {
    fs.mkdirSync(shotDir, { recursive: true });
    const problems = [];
    for (const device of DEVICES) {
        for (const theme of THEMES) {
            const tag = `${device.id}-${theme}`;
            const run = async (name, role, action, afterWait = 450) => {
                if (only && !only.includes(name)) return;
                const { context, page, errors } = await openApp(browser, base, device, theme, role);
                try {
                    if (action) await action(page);
                    await page.waitForTimeout(afterWait);
                    const overflow = await overflowOf(page);
                    await page.screenshot({ path: path.join(shotDir, `${name}-${tag}.png`) });
                    if (overflow.doc > 1) problems.push(`${name} ${tag}: 가로 넘침 ${overflow.doc}px`);
                    if (overflow.modal && (overflow.modal.left < -1 || overflow.modal.right > overflow.modal.vw + 1 || overflow.modal.top < -1 || overflow.modal.bottom > overflow.modal.vh + 1)) {
                        problems.push(`${name} ${tag}: 모달이 화면 밖 ${JSON.stringify(overflow.modal)}`);
                    }
                    if (errors.length) problems.push(`${name} ${tag}: 오류 ${errors.join(' | ')}`);
                } finally { await context.close(); }
            };
            await run('dash-teacher', 'teacher', null, 900);
            await run('dash-admin', 'admin', null, 900);
            await run('class', 'teacher', page => page.evaluate(() => renderClass('c1')), 900);
            await run('modal-C-legacy-clinic-menu', 'teacher', page => page.evaluate(() => { try { openClinicCenter('c1'); } catch (e) { showModal('클리닉', '<p>' + e.message + '</p>'); } }));
            await run('modal-C-new', 'teacher', page => page.evaluate(html => showModal('시간표 적용', html), DEMO_C));
            await run('modal-F-addclass', 'teacher', page => page.evaluate(() => openAddClassModal()));
            await run('modal-F-editclass', 'teacher', page => page.evaluate(() => openEditClassModal('c1')));
            await run('modal-F-homework', 'teacher', page => page.evaluate(() => openHomeworkPhotoAssignmentModal('c1')));
            await run('modal-F-qr', 'teacher', page => page.evaluate(() => openQrGenerator('c1')));
            await run('modal-W-progress-current', 'teacher', page => page.evaluate(() => openClassRecordModal('c1')), 1200);
            await run('modal-W-demo', 'teacher', page => page.evaluate(html => showModal('작업 화면 샘플', html), DEMO_W));
            await run('modal-P-demo', 'teacher', page => page.evaluate(html => showModal('전체 화면 패널 샘플', html), DEMO_P));
            // 학생 포털 로그인(공유 CSS 영향 확인용). 세션 없이 연다.
            if (!only || only.includes('student-login')) {
                const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700 });
                await context.route(API + '**', route => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{"success":true}' }));
                await context.addInitScript(t => localStorage.setItem('APMATH_THEME', t), theme);
                const page = await context.newPage();
                const errors = [];
                page.on('pageerror', error => errors.push(error.message));
                await page.goto(`${base}/apmath/student/index.html`, { waitUntil: 'load' });
                await page.waitForTimeout(900);
                const over = await overflowOf(page);
                await page.screenshot({ path: path.join(shotDir, `student-login-${tag}.png`) });
                if (over.doc > 1) problems.push(`student-login ${tag}: 가로 넘침 ${over.doc}px`);
                if (errors.length) problems.push(`student-login ${tag}: 오류 ${errors.join(' | ')}`);
                await context.close();
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
        if (!process.env.APMS_SKIP_BEHAVIOUR) {
            await behaviour(browser, base);
            console.log('APMS 모달 공통 부품 동작 검사 통과');
        }
        if (shotDir) {
            const problems = await shoot(browser, base);
            console.log(problems.length ? '문제:\n' + problems.join('\n') : '스크린샷 모두 가로 넘침·모달 잘림 없음');
            if (problems.length) process.exitCode = 1;
        }
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
