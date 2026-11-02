// APMS 뒤로 가기·닫기 정책(N2) 브라우저 확인 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
// 방식: tests/apms-foundation-browser.cjs 와 같다 — 정적 서버 + 실서버 API 가로채기(가짜 응답) + localStorage 테스트 세션.
// 실행:  node tests/apms-history-back-browser.cjs                    (동작 검사)
//        APMS_SHOT_DIR=/경로 node tests/apms-history-back-browser.cjs  (+ 토스트·휴대폰 헤더 스크린샷)
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const shotDir = process.env.APMS_SHOT_DIR || '';
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';

const DEVICES = {
    phone: { id: 'phone-390x844', width: 390, height: 844, mobile: true },
    tabletP: { id: 'tablet-p-800x1280', width: 800, height: 1280, mobile: true },
    pc: { id: 'pc-1280x800', width: 1280, height: 800, mobile: false }
};

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
    page.on('pageerror', error => { if (!/Access is denied for this document/.test(error.message)) errors.push(error.message); }); // about:blank 에서 테스트 세션 주입이 막히는 것은 제외
    await page.goto('about:blank'); // 앞 항목이 있어야 앱 첫 화면 뒤로 가기가 앱을 떠나는지 볼 수 있다
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    return { context, page, errors };
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
const DEMO_F = `
<div class="apms-modal apms-modal--form apms-unified-modal apms-unified-form">
  <div class="apms-unified-context"><div class="apms-unified-context__name">F 폼 샘플</div><div class="apms-unified-context__meta">입력 1~8개, 저장하면 닫힘</div></div>
  <label class="apms-unified-label" for="add-cls-name">이름</label>
  <input id="add-cls-name" class="btn apms-unified-control" placeholder="이름">
  <div class="apms-modal__actions"><button type="button" class="btn apms-unified-quiet" onclick="closeModal()">취소</button><button type="button" class="btn btn-primary apms-unified-primary">추가</button></div>
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


const wait = (page, ms = 450) => page.waitForTimeout(ms);
const isOpen = page => page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden') && document.getElementById('modal-overlay').classList.contains('show'));
const hasGuard = page => page.evaluate(() => !!(history.state && history.state.apmsGuard));
const hasClass = page => page.evaluate(() => !!document.querySelector('.ap-classroom-shell'));
const tap = page => page.mouse.click(2, 2); // 실제 입력 이벤트 한 번: 크롬의 "사용자가 누른 적 있는 페이지" 조건을 채운다
const reload = async page => {
    await page.goForward();
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await tap(page);
};

async function behaviour(browser, base) {
    const { context, page, errors } = await openApp(browser, base, DEVICES.pc, 'light', 'teacher');
    try {
        const dialogs = [];
        let answer = false;
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); if (answer) await dialog.accept(); else await dialog.dismiss(); });
        const url0 = page.url();
        await tap(page);

        // 1) 반 화면 → 모달 → 뒤로 → 반 화면 → 뒤로 → 대시보드 → 뒤로 → 앱을 떠남
        assert.equal(await hasGuard(page), false, '첫 화면에는 보호 항목이 없다(뒤로 가기 = 기본 동작)');
        await page.evaluate(() => renderClass('c1'));
        await wait(page, 500);
        assert.equal(await hasClass(page), true);
        assert.equal(await hasGuard(page), true, '반 화면에는 갈 곳(대시보드)이 있어 보호 항목이 있다');
        await page.evaluate(html => showModal('F 폼 샘플', html), DEMO_F);
        await wait(page);
        assert.equal(await isOpen(page), true);
        await page.goBack();
        await wait(page);
        assert.equal(await isOpen(page), false, '뒤로 → 모달만 닫힘');
        assert.equal(await hasClass(page), true, '반 화면은 그대로');
        assert.ok(page.url().startsWith(base), '앱이 남아 있다');
        assert.equal(await page.evaluate(() => document.body.classList.contains('ap-modal-open')), false);
        await page.goBack();
        await wait(page, 600);
        assert.equal(await hasClass(page), false, '뒤로 → 대시보드');
        assert.ok(page.url().startsWith(base), '대시보드에서도 앱이 남아 있다');
        assert.equal(await hasGuard(page), false, '대시보드는 첫 화면이라 보호 항목이 없다');
        assert.equal(page.url(), url0, '주소에 해시·쿼리를 남기지 않는다');
        await page.goBack();
        await wait(page, 500);
        assert.equal(page.url(), 'about:blank', '대시보드에서 뒤로 → 앱을 떠남(기본 동작)');
        await reload(page);

        // 2) 입력 중 뒤로 가기: 확인 → 아니오면 유지(보호 항목 복구), 예면 닫힘
        await page.evaluate(html => showModal('F 폼 샘플', html), DEMO_F);
        await wait(page);
        assert.equal(await hasGuard(page), true);
        await page.fill('#add-cls-name', '새 반');
        answer = false;
        await page.goBack();
        await wait(page, 500);
        assert.equal(dialogs.length, 1, '뒤로 → 닫을까요? 확인');
        assert.equal(await isOpen(page), true, '아니오 → 모달 유지');
        assert.equal(await hasGuard(page), true, '아니오 → 보호 항목 복구(다시 뒤로 가기가 모달을 닫는다)');
        assert.equal(await page.inputValue('#add-cls-name'), '새 반', '입력 값 유지');
        answer = true;
        await page.goBack();
        await wait(page, 500);
        assert.equal(dialogs.length, 2);
        assert.equal(await isOpen(page), false, '예 → 닫힘');
        assert.equal(await hasGuard(page), false, '모달만 있던 경우 닫으면 보호 항목도 없다');

        // 3) 헤더 "취소": 입력 중이면 같은 확인
        await page.evaluate(html => showModal('F 폼 샘플', html), DEMO_F);
        await wait(page);
        await page.fill('#add-cls-name', '새 반');
        answer = false;
        await page.click('#modal-cancel-btn');
        await wait(page);
        assert.equal(dialogs.length, 3, '헤더 취소 → 확인'); // 아니오 한 번
        assert.equal(await isOpen(page), true);
        answer = true;
        await page.click('#modal-cancel-btn');
        await wait(page, 500);
        assert.equal(await isOpen(page), false);
        assert.equal(await hasGuard(page), false);

        // 4) 앱 ← 버튼도 같은 확인
        await page.evaluate(html => showModal('F 폼 샘플', html), DEMO_F);
        await wait(page);
        await page.fill('#add-cls-name', '새 반');
        answer = false;
        await page.click('#desktop-app-back-button');
        await wait(page);
        assert.equal(dialogs.length, 5, '앱 ← → 확인'); // 3)의 예 한 번이 4번째
        assert.equal(await isOpen(page), true);
        answer = true;
        await page.click('#desktop-app-back-button');
        await wait(page, 500);
        assert.equal(await isOpen(page), false);

        // 5) 저장 성공 닫기(closeModal(true))는 확인 없이 닫히고, 뒤로 가기를 두 번 누를 일이 없다
        await page.evaluate(html => showModal('F 폼 샘플', html), DEMO_F);
        await wait(page);
        await page.fill('#add-cls-name', '새 반');
        const before = dialogs.length;
        await page.evaluate(() => closeModal(true));
        await wait(page, 600);
        assert.equal(dialogs.length, before, '저장 성공 닫기는 확인 없음');
        assert.equal(await isOpen(page), false);
        assert.equal(await hasGuard(page), false, '코드로 닫으면 보호 항목도 걷힌다');
        await page.goBack();
        await wait(page, 500);
        assert.equal(page.url(), 'about:blank', '모달을 코드로 닫은 뒤 뒤로 가기 한 번 = 앱을 떠남(두 번 아님)');
        await reload(page);

        // 6) 단계 모달은 한 단계씩, 닫고 곧바로 여는 흐름은 이력을 늘리지 않는다
        await page.evaluate(() => renderClass('c1'));
        await wait(page, 500);
        await page.evaluate(() => { showModal('첫째', '<div class="apms-modal apms-modal--form"><p>1단계</p></div>'); closeModal(true); showModal('다음', '<div class="apms-modal apms-modal--form"><p>다음</p></div>'); });
        await wait(page);
        await page.evaluate(html => showModalStep('둘째', html), DEMO_C);
        await wait(page);
        assert.equal(await page.locator('#modal-title').innerText(), '둘째');
        await page.goBack();
        await wait(page);
        assert.equal(await page.locator('#modal-title').innerText(), '다음', '뒤로 → 한 단계만');
        assert.equal(await isOpen(page), true);
        await page.goBack();
        await wait(page);
        assert.equal(await isOpen(page), false);
        assert.equal(await hasClass(page), true, '모달을 모두 닫으면 반 화면');
        await page.goBack();
        await wait(page, 500);
        assert.equal(await hasClass(page), false, '다시 뒤로 → 대시보드');
        assert.ok(page.url().startsWith(base));

        // 7) 반 화면에서 학생 상세를 열었다 닫아도 "한 번 더" 눌러야 하지 않는다 (학생 상세는 화면 이력에 넣지 않는다)
        await page.evaluate(() => renderClass('c1'));
        await wait(page, 500);
        await page.evaluate(() => renderStudentDetail('c1s0'));
        await wait(page, 700);
        assert.equal(await isOpen(page), true, '학생 상세 모달');
        await page.goBack();
        await wait(page, 600);
        assert.equal(await isOpen(page), false);
        assert.equal(await hasClass(page), true, '학생 상세 닫으면 반 화면');
        await page.goBack();
        await wait(page, 600);
        assert.equal(await hasClass(page), false, '다음 뒤로 → 곧바로 대시보드(학생 상세가 다시 열리지 않는다)');
        assert.equal(await isOpen(page), false);

        // 8) 모달 위 Esc 레이어도 뒤로 가기로 닫힌다
        await page.evaluate(() => { window.__layer = 0; showModal('아래', '<div class="apms-modal apms-modal--confirm"><p>x</p></div>'); window.__unreg = registerEscapeLayer(() => { window.__layer += 1; window.__unreg(); }); });
        await wait(page);
        await page.goBack();
        await wait(page);
        assert.equal(await page.evaluate(() => window.__layer), 1, '뒤로 → 맨 위 레이어만');
        assert.equal(await isOpen(page), true);
        await page.goBack();
        await wait(page);
        assert.equal(await isOpen(page), false);

        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally {
        await context.close();
    }
}

// 휴대폰: 화면 전체 모달(W·P)에서 앱 ← 가 숨고, 시트형(F)에서는 보인다. 토스트가 제목·취소·액션줄을 덮지 않는다.
async function layout(browser, base) {
    const problems = [];
    if (shotDir) fs.mkdirSync(shotDir, { recursive: true });
    for (const key of ['phone', 'tabletP', 'pc']) {
        const device = DEVICES[key];
        for (const [name, html, title] of [['W', DEMO_W, '작업 화면 샘플'], ['P', DEMO_P, '전체 화면 패널 샘플'], ['F', DEMO_F, 'F 폼 샘플']]) {
            const { context, page, errors } = await openApp(browser, base, device, 'light', 'teacher');
            try {
                await page.evaluate(([t, h]) => showModal(t, h), [title, html]);
                await wait(page);
                await page.evaluate(() => toast('데이터 동기화 중...', 'info'));
                await page.waitForTimeout(500);
                const info = await page.evaluate(() => {
                    const r = sel => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, vis: getComputedStyle(e).visibility }; };
                    const rects = [...document.querySelectorAll('.toast')].map(e => { const b = e.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom }; });
                    return {
                        toast: rects[0] || null,
                        title: r('#modal-title'), cancel: r('#modal-cancel-btn'), actions: r('#modal-body .apms-modal__actions'),
                        back: r(window.innerWidth > 900 ? '#desktop-app-back-button' : '#mobile-app-back-button')
                    };
                });
                const overlap = (a, b) => a && b && a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;
                const tag = `${name}-${device.id}`;
                if (!info.toast) problems.push(`${tag}: 토스트 없음`);
                else {
                    if (overlap(info.toast, info.title)) problems.push(`${tag}: 토스트가 제목을 덮음`);
                    if (overlap(info.toast, info.cancel)) problems.push(`${tag}: 토스트가 취소를 덮음`);
                    if (overlap(info.toast, info.actions)) problems.push(`${tag}: 토스트가 하단 액션줄을 덮음`);
                    if (info.toast.l < -1 || info.toast.r > device.width + 1) problems.push(`${tag}: 토스트가 화면 밖`);
                }
                if (key === 'phone' && (name === 'W' || name === 'P') && info.back && info.back.vis !== 'hidden') problems.push(`${tag}: 전체 화면 모달인데 앱 ← 가 보임`);
                if (key === 'phone' && name === 'F' && overlap(info.back, info.cancel)) problems.push(`${tag}: ← 가 시트 취소와 겹침`);
                if (errors.length) problems.push(`${tag}: 오류 ${errors.join(' | ')}`);
                if (shotDir) await page.screenshot({ path: path.join(shotDir, `n2-toast-modal${name}-${device.id}.png`) });
            } finally { await context.close(); }
        }
    }
    return problems;
}

(async () => {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        await behaviour(browser, base);
        console.log('APMS 뒤로 가기·닫기 정책 동작 검사 통과');
        const problems = await layout(browser, base);
        console.log(problems.length ? '문제:\n' + problems.join('\n') : '토스트·앱 ← 배치 검사 통과');
        if (problems.length) process.exitCode = 1;
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
