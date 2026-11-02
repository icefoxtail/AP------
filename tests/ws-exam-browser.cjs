// M3 원내평가·OMR 작업 화면 확인 하니스 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
//
// 방식은 tests/apms-foundation-browser.cjs와 같다: 정적 서버로 저장소를 열고, 실서버 주소(workers.dev)로 가는
// API 요청을 Playwright가 가로채 가짜 응답을 준다(세션은 localStorage의 테스트 값). 이 파일은 시험·OMR 응답과
// 호출 기록(어떤 요청이 몇 번 갔는지, 저장 payload)을 더한다.
//
// 실행 예:
//   AP_PLAYWRIGHT_MODULE=/경로/playwright WSX_MODE=after WSX_SHOT_DIR=/경로 node tests/ws-exam-browser.cjs
//   WSX_MODE=before APMS_ROOT=/옛_저장소_복사본 ...   (통합 전 화면: 시험 이력 → 시험 상세 → 성적 직접 입력)
//   WSX_CHECK=flow   저장 흐름 검사(모달 유지·다음 미제출 학생·재조회 횟수·payload)만 한다.
//   WSX_PAYLOAD_OUT=파일.json   같은 입력을 넣어 저장한 payload를 기록한다(before/after 비교용).
//   WSX_COMPARE_WITH=파일.json  (flow) 위에서 기록한 통합 전 payload와 한 글자도 다르지 않은지 비교한다.
// 필요: playwright 모듈과 크롬. tools/run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = process.env.APMS_ROOT ? path.resolve(process.env.APMS_ROOT) : path.resolve(__dirname, '..');
const shotDir = process.env.WSX_SHOT_DIR || '';
const MODE = process.env.WSX_MODE === 'before' ? 'before' : 'after';
const CHECK = process.env.WSX_CHECK || '';
const PAYLOAD_OUT = process.env.WSX_PAYLOAD_OUT || '';
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';

const DEVICES = [
    { id: 'phone-390x844', width: 390, height: 844, mobile: true },
    { id: 'tablet-p-800x1280', width: 800, height: 1280, mobile: true },
    { id: 'tablet-l-1280x800', width: 1280, height: 800, mobile: true },
    { id: 'pc-1440x900', width: 1440, height: 900, mobile: false }
];
// 상태 3가지: 시험 0개 / 3개(20문항) / 15개(맨 위 시험 50문항)
const STATES = [
    { id: 'e0', exams: 0, topQ: 20 },
    { id: 'e3', exams: 3, topQ: 20 },
    { id: 'e15', exams: 15, topQ: 50 }
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

const NAMES = ['김민수', '이서윤', '박지호', '최유나', '정도윤', '강하린', '조현우', '윤서아', '장민재', '임채원', '한지우', '오세린',
    '서준영', '문하은', '배시우', '신예린', '권도현', '황지안', '안유진', '송태양', '류가온', '홍서진', '전민아', '고은우'];
const CLASS_ROWS = [['c1', '중3A', '중3', '1,3,5', '6:30~8:00'], ['c2', '중2B', '중2', '2,4', '4:50~6:20'], ['c3', '고1 심화', '고1', '1,4', '8:00~9:30']];

// 시험 한 줄: 제출 학생 수는 시험마다 다르다. 맨 위(가장 최근) 시험은 늘 미제출 학생이 6명 이상 남는다.
function buildData(state) {
    const today = new Date().toLocaleDateString('sv-SE');
    const classes = CLASS_ROWS.map(([id, name, grade, days, time]) => ({ id, name, grade, subject: '수학', teacher_name: '김선생', schedule_days: days, time_label: time, is_active: 1 }));
    const students = [];
    const class_students = [];
    const attendance = [];
    const homework = [];
    classes.forEach((c, ci) => {
        const n = c.id === 'c1' ? 24 : 6;
        for (let i = 0; i < n; i++) {
            const id = `${c.id}s${i}`;
            students.push({ id, name: NAMES[(i + ci * 3) % NAMES.length], grade: c.grade, school: '왕지중', status: '재원', phone: '010-0000-0000', guardian_phone: '010-1111-2222', enroll_date: '2026-03-02' });
            class_students.push({ class_id: c.id, student_id: id });
            attendance.push({ student_id: id, class_id: c.id, date: today, status: '출석' });
            homework.push({ student_id: id, class_id: c.id, date: today, status: '완료' });
        }
    });
    const exam_sessions = [];
    const wrong_answers = [];
    const class_exam_assignments = [];
    for (let i = 0; i < state.exams; i++) {
        const q = i === 0 ? state.topQ : 20;
        const d = new Date(Date.now() - (i * 6 + 1) * 86400000).toLocaleDateString('sv-SE');
        const title = i % 3 === 0 ? `25_yeonhyang_m3_final_${i + 1}회` : `단원평가 ${i + 1}회`;
        const archive = i % 3 === 0 ? `exams/25_yeonhyang_m3_final_${i + 1}.js` : '';
        const aid = `a${i}`;
        class_exam_assignments.push({ id: aid, class_id: 'c1', exam_title: title, exam_date: d, archive_file: archive, question_count: q, pdf_status: i % 2 === 0 ? 'ready' : 'pending' });
        const submitted = Math.max(2, 24 - 6 - i * 1);
        for (let k = 0; k < submitted; k++) {
            const sid = `s-${i}-${k}`;
            const wrongs = [];
            for (let w = 1; w <= q; w++) if ((w * 7 + k * 3 + i) % 9 === 0) wrongs.push(String(w));
            const score = Math.round((q - wrongs.length) * (100 / q));
            exam_sessions.push({ id: sid, student_id: `c1s${k}`, class_id: 'c1', assignment_id: aid, exam_title: title, exam_date: d, score, question_count: q, archive_file: archive, updated_at: `${d}T10:00:00Z` });
            wrongs.forEach(w => wrong_answers.push({ session_id: sid, question_id: w }));
        }
    }
    return {
        success: true, classes, students, class_students, attendance, homework,
        consultations: [], operation_memos: [], exam_sessions, wrong_answers, class_exam_assignments, exam_schedules: [], academy_schedules: [], journals: [],
        class_textbooks: [], class_daily_records: [], class_daily_progress: [], timetable_classes: [], timetable_class_students: [],
        timetable_students: [], timetable_class_textbooks: [], class_progress_date: today, class_progress_taxonomy_version: 'x',
        class_progress_taxonomy: [], class_progress_snapshots: [], class_progress_items: [], class_progress_phases: [],
        attendance_history: [], homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [], exam_blueprints: [],
        exam_question_reviews: [], exam_analysis_meta: [], school_exam_records: [], parent_contacts: [], message_logs: [],
        student_status_history: [], class_transfer_history: [], timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

async function openApp(browser, base, device, theme, role, scenario) {
    const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: 1, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700
    });
    const data = buildData(scenario);
    const calls = [];
    let seq = 0;
    await context.route(API + '**', route => {
        const request = route.request();
        const url = new URL(request.url());
        const method = request.method();
        const p = url.pathname.replace(/^.*\/api\//, '');
        let body = { success: true, data: [], items: [] };
        let payload = null;
        try { payload = request.postDataJSON(); } catch (e) { payload = null; }
        calls.push({ method, path: p, query: url.search, payload });
        if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
        if (method === 'GET' && p === 'initial-data') body = data;
        else if (method === 'GET' && p === 'exam-sessions/by-class') {
            const ids = new Set(data.class_students.filter(m => m.class_id === url.searchParams.get('class')).map(m => m.student_id));
            const sessions = data.exam_sessions.filter(s => ids.has(s.student_id));
            const sids = new Set(sessions.map(s => s.id));
            body = { success: true, sessions, wrong_answers: data.wrong_answers.filter(w => sids.has(w.session_id)), assignments: data.class_exam_assignments.filter(a => a.class_id === url.searchParams.get('class')), exclusions: [], blueprints: [], result_items: [], assignment_questions: [] };
        } else if (method === 'PATCH' && p === 'exam-sessions/new') {
            const d = payload || {};
            const existing = d.session_id ? data.exam_sessions.find(s => s.id === d.session_id) : null;
            const id = existing ? existing.id : `new-${++seq}`;
            const row = { id, student_id: d.student_id, class_id: d.class_id, assignment_id: d.assignment_id || '', exam_title: d.exam_title, exam_date: d.exam_date, score: d.score, question_count: d.question_count, archive_file: d.archive_file || '' };
            if (existing) Object.assign(existing, row); else data.exam_sessions.push(row);
            data.wrong_answers = data.wrong_answers.filter(w => w.session_id !== id).concat((d.wrong_ids || []).map(w => ({ session_id: id, question_id: String(w) })));
            body = { success: true, id };
        } else if (method === 'DELETE' && /^exam-sessions\/[^/]+$/.test(p) && p !== 'exam-sessions/by-exam') {
            const id = p.split('/')[1];
            data.exam_sessions = data.exam_sessions.filter(s => s.id !== id);
            data.wrong_answers = data.wrong_answers.filter(w => w.session_id !== id);
        } else if (method === 'DELETE' && p === 'exam-sessions/by-exam') {
            body = { success: true, deleted: 0 };
        } else if (method === 'GET' && p === 'exam-blueprints') body = { success: true, items: [] };
        route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(body) });
    });
    await context.route(/^https:\/\/(api\.qrserver\.com|icefoxtail\.github\.io)\//, route => route.abort());
    await context.addInitScript(({ theme, role }) => {
        localStorage.setItem('APMATH_THEME', theme);
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 't1', name: role === 'admin' ? '원장' : '김선생', role, session_token: 'local-test-only' }));
    }, { theme, role });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(500);
    return { context, page, errors, calls, data };
}

const countCalls = (calls, method, p) => calls.filter(c => c.method === method && c.path === p).length;

// 모달 안 가로 넘침·작은 글자·작은 터치 영역을 잰다.
async function measure(page) {
    return page.evaluate(() => {
        const content = document.getElementById('modal-content');
        const overlay = document.getElementById('modal-overlay');
        const open = !!content && !overlay.classList.contains('hidden');
        const out = { open, docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, modalOverflowX: 0, small12: [], touch24: [], touch44: 0, touchTotal: 0 };
        if (!open) return out;
        const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
        const body = document.getElementById('modal-body');
        const scrollers = [content, body, ...content.querySelectorAll('.apms-modal, .apms-workspace, .apms-workspace__list, .apms-workspace__detail')];
        out.modalOverflowX = Math.max(0, ...scrollers.map(el => el.scrollWidth - el.clientWidth));
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.nodeValue.trim()) continue;
            const el = node.parentElement;
            if (!el || seen.has(el) || !visible(el)) continue;
            seen.add(el);
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 12) out.small12.push(`${fs}px "${node.nodeValue.trim().slice(0, 14)}"`);
        }
        const targets = content.querySelectorAll('button, a[href], select, input:not([type=hidden]):not([type=checkbox]), textarea, label:has(input[type=checkbox]), [role=button]');
        targets.forEach(el => {
            if (!visible(el)) return;
            if (el.closest('[hidden]')) return;
            const r = el.getBoundingClientRect();
            out.touchTotal += 1;
            if (Math.min(r.width, r.height) < 24) out.touch24.push(`${Math.round(r.width)}x${Math.round(r.height)} "${(el.innerText || el.getAttribute('aria-label') || el.id || el.tagName).trim().slice(0, 12)}"`);
            if (Math.min(r.width, r.height) >= 44) out.touch44 += 1;
        });
        return out;
    });
}

// ---------- 화면별 동작 (통합 전 / 통합 후) ----------
async function actOpenList(page) {
    if (MODE === 'before') await page.evaluate(() => openExamGradeView('c1'));
    else await page.evaluate(() => openExamWorkspace('c1'));
    await page.waitForTimeout(900);
}
async function actOpenDetail(page, state) {
    if (MODE === 'before') {
        if (!state.exams) return;
        await page.evaluate(() => {
            const row = document.querySelector('.classroom-exam-history-row');
            if (row) row.click();
        });
        await page.waitForTimeout(900);
    } else if (state.exams) {
        await page.locator('.wsx-exam-item').first().click();
        await page.waitForTimeout(500);
    }
}
async function actOpenOmr(page, state) {
    if (MODE === 'before') {
        if (!state.exams) { await page.getByRole('button', { name: '새 시험 입력' }).click(); await page.waitForTimeout(900); return; }
        await page.locator('button', { hasText: /^입력$/ }).first().click();
        await page.waitForTimeout(900);
    } else {
        if (!state.exams) {
            await page.locator('#wsx-new-title').waitFor({ timeout: 4000 });
            await page.locator('#wsx-new-create').click();
            await page.waitForTimeout(700);
        }
        await page.locator('.wsx-row-input', { hasText: '입력' }).first().click();
        await page.waitForTimeout(900);
    }
}

async function shoot(browser, base) {
    fs.mkdirSync(shotDir, { recursive: true });
    const problems = [];
    const report = [];
    const shots = [
        { id: 'class', act: async (page, st) => { await page.evaluate(() => renderClass('c1')); await page.waitForTimeout(700); }, only: ['e3'] },
        { id: 'list', act: async (page, st) => { await actOpenList(page); } },
        { id: 'detail', act: async (page, st) => { await actOpenList(page); await actOpenDetail(page, st); } },
        { id: 'omr', act: async (page, st) => { await actOpenList(page); await actOpenDetail(page, st); await actOpenOmr(page, st); } }
    ];
    const matrix = [];
    DEVICES.forEach(d => STATES.forEach(s => matrix.push({ device: d, theme: 'light', state: s })));
    STATES.forEach(s => matrix.push({ device: DEVICES[0], theme: 'dark', state: s }));
    matrix.push({ device: DEVICES[3], theme: 'dark', state: STATES[2] });
    const onlyState = process.env.WSX_STATES ? process.env.WSX_STATES.split(',') : null;
    const onlyShot = process.env.WSX_SHOTS ? process.env.WSX_SHOTS.split(',') : null;
    const onlyDevice = process.env.WSX_DEVICES ? process.env.WSX_DEVICES.split(',') : null;
    for (const item of matrix) {
        if (onlyState && !onlyState.includes(item.state.id)) continue;
        if (onlyDevice && !onlyDevice.some(t => item.device.id.startsWith(t))) continue;
        for (const shot of shots) {
            if (onlyShot && !onlyShot.includes(shot.id)) continue;
            if (shot.only && !shot.only.includes(item.state.id)) continue;
            const tag = `${item.state.id}-${item.device.id}-${item.theme}`;
            const { context, page, errors } = await openApp(browser, base, item.device, item.theme, 'teacher', item.state);
            try {
                await shot.act(page, item.state);
                const m = await measure(page);
                if (process.env.WSX_EVAL) console.log(tag, shot.id, JSON.stringify(await page.evaluate(process.env.WSX_EVAL)));
                await page.screenshot({ path: path.join(shotDir, `${MODE}-${shot.id}-${tag}.png`) });
                const line = { shot: shot.id, tag, docOverflow: m.docOverflow, modalOverflowX: m.modalOverflowX, small12: m.small12.length, touch24: m.touch24.length, touch44of: `${m.touch44}/${m.touchTotal}` };
                report.push(line);
                if (!m.open && shot.id !== 'class') problems.push(`${shot.id} ${tag}: 모달이 열리지 않음`);
                if (m.docOverflow > 1) problems.push(`${shot.id} ${tag}: 화면 가로 넘침 ${m.docOverflow}px`);
                if (m.modalOverflowX > 1) problems.push(`${shot.id} ${tag}: 모달 안 가로 넘침 ${m.modalOverflowX}px`);
                if (m.small12.length) problems.push(`${shot.id} ${tag}: 12px 미만 글자 ${m.small12.length}곳 ${m.small12.slice(0, 3).join(', ')}`);
                if (m.touch24.length) problems.push(`${shot.id} ${tag}: 24px 미만 터치 ${m.touch24.length}곳 ${m.touch24.slice(0, 3).join(', ')}`);
                if (errors.length) problems.push(`${shot.id} ${tag}: 오류 ${errors.join(' | ')}`);
            } catch (error) {
                problems.push(`${shot.id} ${tag}: 실행 실패 ${String(error.message).split('\n')[0]}`);
                try { await page.screenshot({ path: path.join(shotDir, `${MODE}-${shot.id}-${tag}-FAIL.png`) }); } catch (e) { /* 무시 */ }
            } finally { await context.close(); }
        }
    }
    fs.writeFileSync(path.join(shotDir, `${MODE}-report.json`), JSON.stringify(report, null, 1));
    return problems;
}

// ---------- 저장 흐름 검사 + payload 기록 ----------
// 같은 입력(첫 미제출 학생, 틀린 번호 3·7·11)을 넣어 저장하고 PATCH payload를 기록한다.
async function flow(browser, base) {
    const device = DEVICES[0];
    const state = STATES[1];
    const { context, page, errors, calls, data } = await openApp(browser, base, device, 'light', 'teacher', state);
    const result = { mode: MODE, payloads: [], checks: [] };
    try {
        await actOpenList(page);
        if (MODE === 'before') {
            await actOpenDetail(page, state);
            const pendingName = await page.locator('tbody tr').filter({ has: page.locator('button', { hasText: /^입력$/ }) }).first().locator('td').first().innerText();
            await actOpenOmr(page, state);
            for (const n of [3, 7, 11]) await page.locator(`label:has(input.omr-q[value="${n}"])`).click();
            const before = calls.length;
            await page.locator('#modal-action-btn').click();
            await page.waitForTimeout(1500);
            const after = calls.slice(before);
            result.payloads = after.filter(c => c.method === 'PATCH' && c.path === 'exam-sessions/new').map(c => c.payload);
            result.pendingName = pendingName.trim();
            result.afterSave = {
                modalOpen: await page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden')),
                initialDataGets: countCalls(after, 'GET', 'initial-data'),
                byClassGets: countCalls(after, 'GET', 'exam-sessions/by-class'),
                screen: await page.evaluate(() => (document.querySelector('.cls-v4-top') ? 'class-screen' : 'other'))
            };
        } else {
            await actOpenDetail(page, state);
            const firstPending = page.locator('.wsx-student[data-pending="1"]').first();
            result.pendingName = (await firstPending.locator('.wsx-student__name').innerText()).trim();
            const secondPendingName = (await page.locator('.wsx-student[data-pending="1"]').nth(1).locator('.wsx-student__name').innerText()).trim();
            await actOpenOmr(page, state);
            for (const n of [3, 7, 11]) await page.locator(`label.wsx-q:has(input[value="${n}"])`).click();
            const before = calls.length;
            await page.locator('#wsx-save-next').click();
            await page.waitForTimeout(1200);
            const after = calls.slice(before);
            result.payloads = after.filter(c => c.method === 'PATCH' && c.path === 'exam-sessions/new').map(c => c.payload);
            result.afterSave = {
                modalOpen: await page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden')),
                initialDataGets: countCalls(after, 'GET', 'initial-data'),
                byClassGets: countCalls(after, 'GET', 'exam-sessions/by-class'),
                screen: await page.evaluate(() => (document.querySelector('.cls-v4-top') && !document.querySelector('#wsx-root') ? 'class-screen' : 'workspace')),
                openPanelFor: (await page.locator('.wsx-panel .wsx-panel__name').first().innerText().catch(() => '')).trim(),
                expectedNext: secondPendingName
            };
            // 같은 표에서 다음 미제출 학생으로: 저장한 학생은 제출로 바뀌고, 열린 입력 칸은 두 번째 미제출 학생이다.
            assert.equal(result.afterSave.modalOpen, true, '저장 뒤에도 작업 화면이 열려 있다');
            assert.equal(result.afterSave.screen, 'workspace', '반 화면으로 나가지 않는다');
            assert.equal(result.afterSave.initialDataGets, 0, '저장 뒤 전체 재조회(initial-data) 없음');
            assert.equal(result.afterSave.byClassGets, 0, '저장 뒤 시험 목록 재조회도 없음');
            assert.ok(result.afterSave.openPanelFor.includes(secondPendingName), `다음 미제출 학생(${secondPendingName}) 입력 칸이 열린다: ${result.afterSave.openPanelFor}`);
            const savedRow = await page.locator('.wsx-student', { hasText: result.pendingName }).first().innerText();
            assert.match(savedRow, /\d+점/, '저장한 학생 행에 점수가 보인다');
        }
        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally { await context.close(); }
    if (PAYLOAD_OUT) fs.writeFileSync(PAYLOAD_OUT, JSON.stringify(result, null, 1));
    // 통합 전 화면에서 기록한 payload와 같은 입력의 payload가 한 글자도 다르지 않은지 비교한다.
    if (process.env.WSX_COMPARE_WITH) {
        const other = JSON.parse(fs.readFileSync(process.env.WSX_COMPARE_WITH, 'utf8'));
        assert.deepEqual(result.payloads, other.payloads, '저장 payload가 통합 전과 같다');
        result.payloadSameAsBefore = true;
    }
    return result;
}

(async () => {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        if (CHECK === 'flow') {
            const r = await flow(browser, base);
            console.log(JSON.stringify(r, null, 1));
        } else if (shotDir) {
            const problems = await shoot(browser, base);
            console.log(problems.length ? '문제:\n' + problems.join('\n') : '스크린샷 모두 가로 넘침·잘림·작은 글자·작은 터치 영역 없음');
            if (problems.length) process.exitCode = 1;
        } else {
            console.log('WSX_SHOT_DIR 또는 WSX_CHECK=flow 를 지정하세요.');
        }
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
