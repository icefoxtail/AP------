// APMS 새로고침 시 반 화면 복원(N4) 브라우저 확인 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
// 방식: tests/apms-history-back-browser.cjs 와 같다 — 정적 서버 + 실서버 API 가로채기(가짜 응답) + localStorage 테스트 세션.
// 실행:  NODE_PATH=/opt/node-tools/node_modules node tests/apms-class-hash-restore-browser.cjs
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';
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

// 김선생 반 c1·c2, 다른선생 반 c9(김선생에게는 접근 불가). 로그인 계정: kim(김선생, t1) / lee(이선생, t2) / admin(원장, a1)
function fixture() {
    const today = new Date().toLocaleDateString('sv-SE');
    const classes = [
        ['c1', '중3A', '중3', '1,3,5', '6:30~8:00', '김선생'], ['c2', '중2B', '중2', '2,4', '4:50~6:20', '김선생'],
        ['c9', '고2 심화', '고2', '3,6', '4:50~6:20', '다른선생']
    ].map(([id, name, grade, days, time, teacher]) => ({ id, name, grade, subject: '수학', teacher_name: teacher, schedule_days: days, time_label: time, is_active: 1 }));
    const students = [];
    const class_students = [];
    classes.forEach(c => {
        for (let i = 0; i < 4; i++) {
            const id = `${c.id}s${i}`;
            students.push({ id, name: `학생${c.id}${i}`, grade: c.grade, school: '왕지중', status: '재원', phone: '010-0000-0000', guardian_phone: '010-1111-2222', enroll_date: '2026-03-02' });
            class_students.push({ class_id: c.id, student_id: id });
        }
    });
    return {
        success: true, classes, students, class_students, attendance: [], homework: [],
        consultations: [], operation_memos: [], exam_sessions: [], wrong_answers: [], class_exam_assignments: [], exam_schedules: [],
        academy_schedules: [], journals: [], class_textbooks: [], class_daily_records: [], class_daily_progress: [], timetable_classes: [],
        timetable_class_students: [], timetable_students: [], timetable_class_textbooks: [], class_progress_date: today,
        class_progress_taxonomy_version: 'x', class_progress_taxonomy: [], class_progress_snapshots: [], class_progress_items: [],
        class_progress_phases: [], attendance_history: [], homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [],
        exam_blueprints: [], exam_question_reviews: [], exam_analysis_meta: [], school_exam_records: [], parent_contacts: [], message_logs: [],
        student_status_history: [], class_transfer_history: [], timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

const USERS = {
    kim: { login_id: 'kim', id: 't1', name: '김선생', role: 'teacher' },
    lee: { login_id: 'lee', id: 't2', name: '이선생', role: 'teacher' },
    admin: { login_id: 'admin', id: 'a1', name: '원장', role: 'admin' }
};

async function openApp(browser, base, who, startUrl) {
    const user = USERS[who];
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    await context.route(API + '**', route => {
        const url = new URL(route.request().url());
        const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
        if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
        let body;
        if (url.pathname.endsWith('/auth/login')) {
            const sent = JSON.parse(route.request().postData() || '{}');
            const u = USERS[sent.login_id];
            body = u ? { success: true, ...u, session_token: 'local-test-only-' + u.id } : { success: false, message: '로그인 실패' };
        } else if (url.pathname.endsWith('/initial-data')) body = fixture();
        else body = { success: true, data: [], items: [] };
        route.fulfill({ status: 200, contentType: 'application/json', headers, body: JSON.stringify(body) });
    });
    await context.route(/^https:\/\/api\.qrserver\.com\//, route => route.abort());
    if (user) {
        await context.addInitScript(u => {
            if (location.protocol === 'about:') return;
            try { if (!localStorage.getItem('APMATH_SESSION') && !sessionStorage.getItem('__noSeed')) localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: u.id, name: u.name, role: u.role, login_id: u.login_id, session_token: 'local-test-only-' + u.id })); } catch (e) { /* about:blank */ }
        }, user);
    }
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => { if (!/Access is denied for this document/.test(error.message)) errors.push(error.message); });
    await page.goto('about:blank'); // 앞 항목이 있어야 "앱을 떠남"을 확인할 수 있다
    await page.goto(startUrl ? base + startUrl : `${base}/apmath/index.html`, { waitUntil: 'load' });
    return { context, page, errors };
}

const ready = page => page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0 && !!document.querySelector('#app-root > *'), null, { timeout: 15000 });
const wait = (page, ms = 500) => page.waitForTimeout(ms);
const classShell = page => page.evaluate(() => { const e = document.querySelector('.ap-classroom-shell'); return e ? e.getAttribute('data-class-id') : null; });
const hash = page => page.evaluate(() => location.hash);
const loginVisible = page => page.evaluate(() => !!document.querySelector('.ap-login-fullscreen'));
const tap = page => page.mouse.click(2, 2); // 사용자 입력 한 번(크롬이 이력 칸을 건너뛰지 않게)
const histLen = page => page.evaluate(() => history.length);

async function main() {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        // 1) 반 화면 → 해시 → 새로고침 → 같은 반 → 뒤로 1번 대시보드 → 2번 앱 떠남
        {
            const { context, page, errors } = await openApp(browser, base, 'kim');
            try {
                await ready(page); await wait(page); await tap(page);
                assert.equal(await hash(page), '', '대시보드에는 해시가 없다');
                const len0 = await histLen(page);
                await page.evaluate(() => renderClass('c1'));
                await wait(page);
                assert.equal(await classShell(page), 'c1');
                assert.equal(await hash(page), '#class=c1', '반 화면 → 주소에 #class=c1');
                const lenClass = await histLen(page);
                assert.equal(lenClass, len0 + 1, '해시는 replaceState라 이력 칸을 늘리지 않는다(보호 항목 1칸만)');
                // 모달을 열어도 주소에 모달 상태가 없다
                await page.evaluate(() => showModal('샘플', '<div class="apms-modal apms-modal--confirm"><p>x</p><div class="apms-modal__actions"><button class="btn" onclick="closeModal()">닫기</button></div></div>'));
                await wait(page);
                assert.equal(await hash(page), '#class=c1', '모달은 주소에 넣지 않는다');
                await page.evaluate(() => closeModal(true));
                await wait(page);

                await page.reload({ waitUntil: 'load' });
                await ready(page); await wait(page, 900);
                assert.equal(await classShell(page), 'c1', '새로고침 → 같은 반 화면');
                assert.equal(await hash(page), '#class=c1');
                assert.equal(await page.evaluate(() => !!(history.state && history.state.apmsGuard)), true, '복원된 반 화면에는 보호 항목이 있다');
                await tap(page);
                await page.goBack();
                await wait(page, 700);
                assert.equal(await classShell(page), null, '복원 뒤 뒤로 1번 → 대시보드');
                assert.equal(await hash(page), '', '대시보드에서는 해시를 지운다');
                assert.ok(page.url().startsWith(base), '아직 앱 안');
                // 대시보드에서 새로고침해도 대시보드
                await page.reload({ waitUntil: 'load' });
                await ready(page); await wait(page, 700);
                assert.equal(await classShell(page), null, '해시가 지워졌으니 새로고침해도 대시보드');
                await page.goBack();
                await wait(page, 700);
                // 새로고침 직전 항목들이 더 있을 수 있으니, 앱을 떠날 때까지 뒤로 간 횟수를 센다.
                let extra = 0;
                while (page.url().startsWith(base) && extra < 4) { await page.goBack(); await wait(page, 500); extra++; }
                assert.equal(page.url(), 'about:blank', '앱을 떠남');
                assert.equal(extra, 0, '복원된 반 화면에서 뒤로 2번이면 앱을 떠난다(뒤로 가기 한 번 더 필요 없음)');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }

        // 2) 반 화면 → 대시보드(앱 안 이동) → 해시 사라짐, 새로고침 시 대시보드 / 반 → 다른 반 → 해시 갱신
        {
            const { context, page, errors } = await openApp(browser, base, 'kim');
            try {
                await ready(page); await wait(page); await tap(page);
                await page.evaluate(() => renderClass('c1'));
                await wait(page);
                await page.evaluate(() => renderClass('c2'));
                await wait(page);
                assert.equal(await hash(page), '#class=c2', '다른 반으로 가면 해시 갱신');
                await page.evaluate(() => renderDashboard());
                await wait(page, 700);
                assert.equal(await hash(page), '', '대시보드로 가면 해시 제거');
                assert.equal(await page.evaluate(() => !!(history.state && history.state.apmsGuard)), false, '보호 항목도 걷힘');
                await page.reload({ waitUntil: 'load' });
                await ready(page); await wait(page, 700);
                assert.equal(await classShell(page), null, '낡은 해시가 남지 않아 대시보드');
                // 뒤로 가기 이중 처리: 반 → 뒤로 → 해시 없음 → 앞으로 가기로 보호 항목에 돌아와도 화면 이력이 어긋나지 않는다
                await page.evaluate(() => renderClass('c1'));
                await wait(page);
                await page.goBack();
                await wait(page, 700);
                assert.equal(await classShell(page), null, '뒤로 → 대시보드');
                assert.equal(await hash(page), '');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }

        // 3) 접근 불가 반·없는 반 해시로 열기 → 조용히 대시보드 + 해시 제거
        for (const bad of ['c9', 'zzz']) {
            const { context, page, errors } = await openApp(browser, base, 'kim', `/apmath/index.html#class=${bad}`);
            try {
                await ready(page); await wait(page, 800);
                assert.equal(await classShell(page), null, `${bad}: 대시보드`);
                assert.equal(await hash(page), '', `${bad}: 해시 제거`);
                assert.equal(await loginVisible(page), false);
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }
        // 3b) 접근 가능한 반 해시로 직접 열기 → 그 반 (뒤로 1번 = 대시보드)
        {
            const { context, page, errors } = await openApp(browser, base, 'kim', '/apmath/index.html#class=c2');
            try {
                await ready(page); await wait(page, 800);
                assert.equal(await classShell(page), 'c2', '주소로 직접 열기 → 그 반');
                await tap(page);
                await page.goBack();
                await wait(page, 700);
                assert.equal(await classShell(page), null, '뒤로 1번 → 대시보드');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }

        // 4) 로그아웃 → 해시·반 정리 → 같은 계정 재로그인도 대시보드 / 다른 계정 로그인도 대시보드
        for (const [again, label] of [['kim', '같은 계정'], ['lee', '다른 계정'], ['admin', '원장']]) {
            const { context, page, errors } = await openApp(browser, base, 'kim');
            try {
                await ready(page); await wait(page); await tap(page);
                await page.evaluate(() => renderClass('c1'));
                await wait(page);
                assert.equal(await hash(page), '#class=c1');
                await page.evaluate(() => logout());
                await wait(page, 700);
                assert.equal(await loginVisible(page), true, '로그인 화면');
                assert.equal(await hash(page), '', `${label}: 로그아웃 → 해시 제거`);
                assert.equal(await page.evaluate(() => state.ui.currentClassId || null), null, `${label}: 열린 반 기록 제거`);
                await page.fill('#login-id', again);
                await page.fill('#login-pw', 'pw');
                await page.evaluate(() => handleLogin());
                await page.waitForFunction(() => !document.querySelector('.ap-login-fullscreen') && !!document.querySelector('#app-root > *'), null, { timeout: 15000 });
                await wait(page, 700);
                assert.equal(await classShell(page), null, `${label}: 로그아웃 뒤 로그인 → 대시보드(이전 반 아님)`);
                assert.equal(await hash(page), '');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }

        // 5) 로그인 전 해시: 해시가 있는 채 로그인 화면 → (같은 사용자) 로그인하면 복원 / (다른 사용자) 복원하지 않음
        for (const [again, expectClass, label] of [['kim', 'c1', '같은 사용자'], ['lee', null, '다른 사용자']]) {
            const { context, page, errors } = await openApp(browser, base, 'kim');
            try {
                await ready(page); await wait(page); await tap(page);
                await page.evaluate(() => renderClass('c1'));
                await wait(page);
                // 세션 만료: 로그인 화면(해시·기록은 로그아웃이 아니므로 남는다)
                await page.evaluate(() => { clearSession(); state.auth = { id: null, name: null, role: null }; renderLogin(); });
                await wait(page, 500);
                assert.equal(await loginVisible(page), true);
                assert.equal(await hash(page), '#class=c1', `${label}: 만료 직후 해시는 그대로`);
                await page.fill('#login-id', again);
                await page.fill('#login-pw', 'pw');
                await page.evaluate(() => handleLogin());
                await page.waitForFunction(() => !document.querySelector('.ap-login-fullscreen') && !!document.querySelector('#app-root > *'), null, { timeout: 15000 });
                await wait(page, 800);
                assert.equal(await classShell(page), expectClass, `${label}: 만료 뒤 로그인 → ${expectClass || '대시보드'}`);
                assert.equal(await hash(page), expectClass ? '#class=' + expectClass : '');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }

        // 5b) 로그인 세션 없이 해시만 있는 주소 → 로그인 화면. 로그인해도 해시 주인이 없으니 복원하지 않고 지운다.
        {
            const { context, page, errors } = await openApp(browser, base, null, '/apmath/index.html#class=c1');
            try {
                await page.waitForFunction(() => !!document.querySelector('.ap-login-fullscreen'), null, { timeout: 15000 });
                await page.fill('#login-id', 'kim');
                await page.fill('#login-pw', 'pw');
                await page.evaluate(() => handleLogin());
                await page.waitForFunction(() => !document.querySelector('.ap-login-fullscreen') && !!document.querySelector('#app-root > *'), null, { timeout: 15000 });
                await wait(page, 800);
                assert.equal(await classShell(page), null, '주인 모르는 해시는 로그인 뒤에도 복원하지 않는다');
                assert.equal(await hash(page), '');
                assert.deepEqual(errors, [], '오류 없음: ' + errors.join(' | '));
            } finally { await context.close(); }
        }
        console.log('APMS 새로고침 시 반 화면 복원(N4) 동작 검사 통과');
    } finally {
        await browser.close();
        server.close();
    }
}

if (require.main === module) main().catch(error => { console.error(error); process.exit(1); });
module.exports = { startServer, openApp, fixture };
