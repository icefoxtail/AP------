// M8 진도·교재 화면 확인 하니스 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
// tests/apms-foundation-browser.cjs 와 같은 방식: 정적 서버 + workers.dev API 가로채기 + localStorage 테스트 세션.
// 가짜 서버는 교재 목록을 메모리에 들고 있어 추가·수정·삭제가 실제처럼 동작하고, 요청 횟수를 센다.
//
// 실행:
//   APMS_SHOT_DIR=/경로 node tests/ws-progress-browser.cjs           기기 4 × 상태 3(빈/보통/많음) 스크린샷 + 화면 검사
//   node tests/ws-progress-browser.cjs --flow                         흐름 검사(재조회 0, Esc 확인, 휴대폰 순서, payload)
// 환경: APMS_ROOT(다른 시점 파일 폴더, 전/후 비교용), AP_PLAYWRIGHT_MODULE, APMS_SHOT_ONLY(예: normal,many)
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = process.env.APMS_ROOT ? path.resolve(process.env.APMS_ROOT) : path.resolve(__dirname, '..');
const shotDir = process.env.APMS_SHOT_DIR || '';
const flowMode = process.argv.includes('--flow');
const onlyStates = process.env.APMS_SHOT_ONLY ? process.env.APMS_SHOT_ONLY.split(',') : null;
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

const TODAY = new Date().toLocaleDateString('sv-SE');
const COURSE = { curriculumKey: '2022', level: 'middle', courseKey: 'M3-1', courseLabel: '중3 과정 · 1학기', gradeKey: '중3' };
const UNITS = [
    ['제곱근과 실수', '제곱근의 뜻'], ['제곱근과 실수', '무리수와 실수'], ['제곱근과 실수', '근호를 포함한 식의 계산'],
    ['다항식의 곱셈과 인수분해', '다항식의 곱셈'], ['다항식의 곱셈과 인수분해', '인수분해 공식'], ['다항식의 곱셈과 인수분해', '인수분해의 활용'],
    ['이차방정식', '이차방정식의 풀이'], ['이차방정식', '근의 공식'], ['이차방정식', '이차방정식의 활용']
].map(([l1, l2], i) => ({ ...COURSE, canonicalPathKey: `2022|middle|M3-1|${i}`, l1, l2 }));

const TITLES = ['개념원리 중3-1', '쎈 중3-1', '학교 부교재 (왕지중 3학년 수학 익힘책)', '일품 중3-1', '라이트쎈 중3-1', '블랙라벨 중3-1', '최상위 쎈 중3-1', '에이급 수학 중3-1', '체크체크 중3-1', '수학의 정석 기본편(공통수학1)', '유형완성 중3-1', '내신 대비 프린트 모음'];

// state: empty(0) | normal(3) | many(12)
function booksFor(kind) {
    if (kind === 'empty') return [];
    const count = kind === 'normal' ? 3 : 12;
    return Array.from({ length: count }, (_, i) => {
        const status = kind === 'normal' ? (i === 2 ? 'completed' : 'active') : (i < 8 ? 'active' : i < 11 ? 'completed' : 'hidden');
        return {
            id: `tb${i + 1}`, class_id: 'c1', title: TITLES[i % TITLES.length], status,
            start_date: '2026-03-02', end_date: status === 'completed' ? '2026-08-20' : null, sort_order: i,
            progress_curriculum_key: i < 2 ? COURSE.curriculumKey : null, progress_level_key: i < 2 ? COURSE.level : null, progress_course_key: i < 2 ? COURSE.courseKey : null
        };
    });
}

function makeServer(kind) {
    const s = { books: booksFor(kind), calls: [], initialDataGets: 0, nextId: 100, savedRecord: null };
    s.record = kind === 'empty' ? null : { id: 'rec1', class_id: 'c1', date: TODAY, teacher_name: '김선생', special_note: '교재 진도 점검 필요', created_at: TODAY, updated_at: TODAY };
    s.progress = kind === 'empty' ? [] : s.books.filter(b => b.status === 'active').slice(0, 4).map((b, i) => ({ id: `pg${i}`, record_id: 'rec1', class_id: 'c1', textbook_id: b.id, textbook_title_snapshot: b.title, progress_text: `p.${10 + i * 12}~${25 + i * 12}` }));
    return s;
}

function fixture(server) {
    const classes = [
        ['c1', '중3A', '중3', '1,3,5', '6:30~8:00'], ['c2', '중2B', '중2', '2,4', '4:50~6:20'], ['c3', '고1 심화', '고1', '1,4', '8:00~9:30'],
        ['c4', '중1C', '중1', '2,5', '6:30~8:00'], ['c5', '고2 미적', '고2', '3,6', '4:50~6:20']
    ].map(([id, name, grade, days, time]) => ({ id, name, grade, subject: '수학', teacher_name: '김선생', schedule_days: days, time_label: time, is_active: 1 }));
    const names = ['김민수', '이서윤', '박지호', '최유나', '정도윤', '강하린'];
    const students = []; const class_students = [];
    classes.forEach((c, ci) => { for (let i = 0; i < 4; i++) { const id = `${c.id}s${i}`; students.push({ id, name: names[(i + ci) % names.length], grade: c.grade, school: '왕지중', status: '재원', phone: '010-0000-0000', guardian_phone: '010-1111-2222', enroll_date: '2026-03-02' }); class_students.push({ class_id: c.id, student_id: id }); } });
    return {
        success: true, classes, students, class_students, attendance: [], homework: [], consultations: [], operation_memos: [],
        exam_sessions: [], wrong_answers: [], class_exam_assignments: [], exam_schedules: [], academy_schedules: [], journals: [],
        class_textbooks: server.books.map(b => ({ ...b })), class_daily_records: [], class_daily_progress: [], timetable_classes: [], timetable_class_students: [],
        timetable_students: [], timetable_class_textbooks: [], class_progress_date: '', class_progress_taxonomy_version: 'x',
        class_progress_taxonomy: UNITS, class_progress_snapshots: [], class_progress_items: [], class_progress_phases: [],
        attendance_history: [], homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [], exam_blueprints: [],
        exam_question_reviews: [], exam_analysis_meta: [], school_exam_records: [], parent_contacts: [], message_logs: [],
        student_status_history: [], class_transfer_history: [], timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

async function openApp(browser, base, device, theme, server, role = 'teacher') {
    const context = await browser.newContext({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700 });
    await context.route(API + '**', async route => {
        const req = route.request();
        const url = new URL(req.url());
        const rel = url.pathname.replace(/^.*\/api\//, '');
        const method = req.method();
        const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };
        const send = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: cors, body: JSON.stringify(body) });
        if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
        let payload = null;
        try { payload = req.postData() ? JSON.parse(req.postData()) : null; } catch (e) { payload = null; }
        if (rel === 'initial-data') { server.initialDataGets += 1; return send(fixture(server)); }
        server.calls.push({ method, rel: rel + url.search, payload });
        if (rel === 'class-textbooks' && method === 'POST') {
            const item = { id: `tb${server.nextId++}`, class_id: payload.class_id, title: payload.title, status: 'active', start_date: payload.start_date, end_date: null, sort_order: 0, progress_curriculum_key: payload.progress_curriculum_key || null, progress_level_key: payload.progress_level_key || null, progress_course_key: payload.progress_course_key || null };
            server.books.push(item); return send({ success: true, item });
        }
        if (rel.startsWith('class-textbooks/') && method === 'PATCH') {
            const id = rel.split('/')[1]; const b = server.books.find(x => x.id === id);
            if (!b) return send({ success: false, error: 'not found' }, 404);
            Object.assign(b, payload); if (payload.status === 'completed' && !b.end_date) b.end_date = TODAY; if (payload.clear_end_date) b.end_date = null;
            return send({ success: true, item: { ...b } });
        }
        if (rel.startsWith('class-textbooks/') && method === 'DELETE') {
            server.books = server.books.filter(x => x.id !== rel.split('/')[1]); return send({ success: true });
        }
        if (rel === 'class-daily-records' && method === 'GET') return send({ success: true, records: server.record ? [server.record] : [], progress: server.progress });
        if (rel === 'class-daily-records' && method === 'POST') { server.savedRecord = payload; return send({ success: true, record: { id: 'rec-saved', class_id: payload.class_id, date: payload.date, special_note: payload.special_note, teacher_name: payload.teacher_name }, progress: (payload.progress || []).map((p, i) => ({ id: `s${i}`, record_id: 'rec-saved', class_id: payload.class_id, ...p })) }); }
        if (rel === 'class-progress' && method === 'GET') return send({ success: true, snapshot: null, items: [], legacy_record: null });
        if (rel === 'class-progress' && method === 'POST') return send({ success: true, snapshot: { id: 'snap1', class_id: payload.class_id, effective_date: payload.effective_date }, items: payload.items });
        if (rel === 'class-progress-phase') return send({ success: true, phase: 'regular', effective_date: null });
        return send({ success: true, data: [], items: [] });
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
    await page.waitForTimeout(2200);
    return { context, page, errors };
}

// 화면 검사: 12px 미만 글자, 24px 미만 누르는 영역, 가로 넘침, 모달 잘림
async function audit(page) {
    return page.evaluate(() => {
        const modal = document.getElementById('modal-content');
        const overlay = document.getElementById('modal-overlay');
        const out = { smallFonts: [], smallTargets: [], overflow: [], modalBox: null };
        if (!modal || overlay.classList.contains('hidden')) return out;
        const label = el => (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + ' "' + String(el.textContent || el.value || '').trim().slice(0, 14) + '"');
        const visible = el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
        const walker = document.createTreeWalker(modal, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!String(node.nodeValue).trim()) continue;
            const el = node.parentElement;
            if (!el || seen.has(el) || !visible(el)) continue;
            seen.add(el);
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 12) out.smallFonts.push(label(el) + ' ' + fs + 'px');
        }
        modal.querySelectorAll('button, a[href], select, textarea, summary, input:not([type=hidden])').forEach(el => {
            if (!visible(el)) return;
            let box = el.getBoundingClientRect();
            if (el.tagName === 'INPUT' && (el.type === 'checkbox' || el.type === 'radio')) { const l = el.closest('label'); if (l) box = l.getBoundingClientRect(); }
            if (box.height < 24 || box.width < 24) out.smallTargets.push(label(el) + ` ${Math.round(box.width)}x${Math.round(box.height)}`);
        });
        const mr = modal.getBoundingClientRect();
        out.modalBox = { left: Math.round(mr.left), top: Math.round(mr.top), right: Math.round(mr.right), bottom: Math.round(mr.bottom), vw: innerWidth, vh: innerHeight };
        out.docOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        modal.querySelectorAll('*').forEach(el => { if (el.scrollWidth - el.clientWidth > 2 && getComputedStyle(el).overflowX === 'visible' && visible(el) && el.clientWidth > 0 && el.children.length) out.overflow.push(label(el) + ` ${el.scrollWidth}>${el.clientWidth}`); });
        return out;
    });
}

async function shoot(browser, base) {
    fs.mkdirSync(shotDir, { recursive: true });
    const problems = [];
    const states = ['empty', 'normal', 'many'].filter(k => !onlyStates || onlyStates.includes(k));
    for (const device of DEVICES) {
        for (const kind of states) {
            const themes = (kind === 'normal' && device.id === 'tablet-p-800x1280') ? ['light', 'dark'] : ['light'];
            for (const theme of themes) {
                const tag = `${device.id}-${kind}-${theme}`;
                const scenes = [
                    ['progress', async page => { await page.evaluate(() => openClassRecordModal('c1')); await page.waitForTimeout(1300); }],
                    ['manage', async page => { await page.evaluate(() => openClassRecordModal('c1')); await page.waitForTimeout(1300); await page.locator('[data-class-progress-manage-toggle]').click(); await page.waitForTimeout(500); }],
                    ['global', async page => { await page.evaluate(() => openGlobalTextbookManage()); await page.waitForTimeout(1300); }]
                ];
                for (const [name, action] of scenes) {
                    const server = makeServer(kind);
                    const { context, page, errors } = await openApp(browser, base, device, theme, server);
                    try {
                        await action(page);
                        const result = await audit(page);
                        await page.screenshot({ path: path.join(shotDir, `${name}-${tag}.png`) });
                        const where = `${name} ${tag}`;
                        if (result.docOverflow > 1) problems.push(`${where}: 문서 가로 넘침 ${result.docOverflow}px`);
                        const m = result.modalBox;
                        if (m && (m.left < -1 || m.right > m.vw + 1 || m.top < -1 || m.bottom > m.vh + 1)) problems.push(`${where}: 모달이 화면 밖 ${JSON.stringify(m)}`);
                        result.smallFonts.slice(0, 6).forEach(x => problems.push(`${where}: 12px 미만 ${x}`));
                        result.smallTargets.slice(0, 6).forEach(x => problems.push(`${where}: 24px 미만 누르기 ${x}`));
                        result.overflow.slice(0, 4).forEach(x => problems.push(`${where}: 안쪽 넘침 ${x}`));
                        if (errors.length) problems.push(`${where}: 오류 ${errors.join(' | ')}`);
                    } finally { await context.close(); }
                }
            }
        }
    }
    return problems;
}

// ---- 흐름 검사 (수정 후 화면 기준) ----
async function flows(browser, base) {
    const phone = DEVICES[0]; const pc = DEVICES[3];
    const isOpen = page => page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden') && document.getElementById('modal-overlay').classList.contains('show'));

    // 1) 교재 추가·수정·삭제: 전체 재조회(initial-data) 0, 모달 재오픈 0, 입력 중이던 진도 글자 유지
    {
        const server = makeServer('normal');
        const { context, page, errors } = await openApp(browser, base, pc, 'light', server);
        try {
            page.on('dialog', d => d.accept());
            await page.evaluate(() => { window.__opens = 0; const o = window.openClassRecordModal; window.openClassRecordModal = function () { window.__opens += 1; return o.apply(this, arguments); }; });
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            const getsBefore = server.initialDataGets;
            const opensBefore = await page.evaluate(() => window.__opens);
            const clicks = { n: 0 };
            // 진도 글자를 먼저 입력해 둔다(저장 전)
            await page.fill('#record-progress-detail .record-tb-progress', 'p.99~120');
            await page.locator('[data-class-progress-manage-toggle]').click(); clicks.n++;
            await page.waitForTimeout(300);
            await page.locator('[data-class-progress-add-toggle]').click(); clicks.n++;
            await page.fill('#new-tb-title', '새로 산 교재');
            await page.locator('[data-ws-textbook-submit]').click(); clicks.n++;
            await page.waitForTimeout(500);
            assert.equal(server.books.some(b => b.title === '새로 산 교재'), true, '교재 POST 됨');
            assert.equal(server.initialDataGets, getsBefore, '교재 추가 뒤 initial-data 재조회 0');
            assert.equal(await page.evaluate(() => window.__opens), opensBefore, '교재 추가 뒤 진도 모달 재오픈 0');
            assert.equal(await page.locator('.ws-progress-manage-item', { hasText: '새로 산 교재' }).count(), 1, '목록에 바로 나타남');
            // 목록 선택 → 수정(제목 바꾸기) → 저장
            await page.locator('.ws-progress-manage-item', { hasText: '새로 산 교재' }).locator('.ws-progress-manage-item__select').click();
            await page.fill('#edit-tb-title', '바꾼 교재 이름');
            await page.locator('[data-ws-textbook-save]').click();
            await page.waitForTimeout(500);
            assert.equal(server.books.find(b => b.title === '바꾼 교재 이름') !== undefined, true, '교재 PATCH 됨');
            const patchCall = server.calls.filter(c => c.method === 'PATCH').pop();
            assert.deepEqual(Object.keys(patchCall.payload).sort(), ['end_date', 'start_date', 'title'].filter(k => k in patchCall.payload).sort(), 'PATCH 필드는 title/start_date(/end_date)만');
            // 삭제
            await page.locator('[data-ws-textbook-delete]').click();
            await page.waitForTimeout(500);
            assert.equal(server.books.some(b => b.title === '바꾼 교재 이름'), false, '교재 DELETE 됨');
            assert.equal(server.initialDataGets, getsBefore, '수정·삭제 뒤에도 initial-data 재조회 0');
            assert.equal(await page.evaluate(() => window.__opens), opensBefore, '수정·삭제 뒤에도 재오픈 0');
            // 진행 목록으로 돌아가도 입력해 둔 진도 글자가 남아 있다
            await page.locator('[data-class-progress-manage-toggle]').click();
            await page.waitForTimeout(300);
            const kept = await page.evaluate(() => state.ui.classProgressModalState.progressByTextbook.tb1.progressText);
            assert.equal(kept, 'p.99~120', '입력하던 진도가 교재 관리 뒤에도 남음');
            assert.equal(await isOpen(page), true);
            console.log('흐름1 통과: 교재 추가→수정→삭제 클릭 수(관리 진입 포함 추가까지)=' + clicks.n + ', initial-data 재조회 0, 재오픈 0');
            assert.deepEqual(errors, [], 'page errors ' + errors.join(' | '));
        } finally { await context.close(); }
    }

    // 2) 저장 payload: 진도 저장 요청 모양
    {
        const server = makeServer('normal');
        const { context, page, errors } = await openApp(browser, base, pc, 'light', server);
        try {
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            await page.fill('#record-progress-detail .record-tb-progress', 'p.30~45');
            await page.fill('#record-special-note', '오늘 특이사항');
            await page.locator('.ap-class-progress-save').click();
            await page.waitForTimeout(700);
            const posted = server.savedRecord;
            assert.deepEqual(Object.keys(posted).sort(), ['class_id', 'date', 'progress', 'special_note', 'teacher_name']);
            assert.equal(posted.class_id, 'c1');
            assert.equal(posted.special_note, '오늘 특이사항');
            assert.ok(posted.progress.every(p => Object.keys(p).sort().join() === 'progress_text,textbook_id,textbook_title_snapshot'));
            assert.equal(posted.progress.find(p => p.textbook_id === 'tb1').progress_text, 'p.30~45');
            console.log('흐름2 통과: 진도 저장 payload 필드 불변 ' + JSON.stringify(Object.keys(posted).sort()));
            assert.deepEqual(errors, []);
        } finally { await context.close(); }
    }

    // 3) Esc: 변경 없으면 닫힘, 진도 글자 입력하면 확인(취소하면 유지)
    {
        const server = makeServer('normal');
        const { context, page } = await openApp(browser, base, pc, 'light', server);
        try {
            const dialogs = [];
            page.on('dialog', async d => { dialogs.push(d.message()); await d.dismiss(); });
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            await page.mouse.click(1425, 450);
            await page.waitForTimeout(300);
            assert.equal(await isOpen(page), true, '바깥 클릭으로 닫히지 않음');
            await page.fill('#record-progress-detail .record-tb-progress', 'p.1');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
            assert.equal(dialogs.length, 1, 'Esc → 닫을까요? 확인');
            assert.equal(await isOpen(page), true, '확인 취소 → 유지');
            assert.equal(await page.locator('.apms-modal__actions button', { hasText: '취소' }).count(), 0, '하단에 취소가 따로 없다(헤더 취소 하나만)');
            console.log('흐름3 통과: 변경 시 Esc 확인, 바깥 클릭 유지, 취소 버튼 하나');
        } finally { await context.close(); }
    }

    // 4) 휴대폰: 목록 위 · 상세 아래, 한 번에 스크롤
    {
        const server = makeServer('many');
        const { context, page } = await openApp(browser, base, phone, 'light', server);
        try {
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            const boxes = await page.evaluate(() => {
                const l = document.querySelector('.apms-workspace__list').getBoundingClientRect();
                const d = document.querySelector('.apms-workspace__detail').getBoundingClientRect();
                const m = document.getElementById('modal-content').getBoundingClientRect();
                return { listBottom: l.bottom, detailTop: d.top, listLeft: l.left, detailLeft: d.left, modalW: m.width, modalH: m.height, vw: innerWidth, vh: innerHeight };
            });
            assert.ok(boxes.detailTop >= boxes.listBottom - 1, '휴대폰: 상세가 목록 아래');
            assert.equal(Math.round(boxes.listLeft), Math.round(boxes.detailLeft), '휴대폰: 한 열');
            assert.equal(Math.round(boxes.modalW), boxes.vw, '휴대폰: 화면 전체 폭');
            console.log('흐름4 통과: 휴대폰 목록 위·상세 아래, 화면 전체');
        } finally { await context.close(); }
    }

    // 6) 과정 추가 패널에서 새 교재 등록 + 기존 교재 연결: 요청 순서·payload 그대로, 재조회·재오픈 0
    {
        const server = makeServer('normal');
        const { context, page, errors } = await openApp(browser, base, pc, 'light', server);
        try {
            await page.evaluate(() => { window.__opens = 0; const o = window.openClassRecordModal; window.openClassRecordModal = function () { window.__opens += 1; return o.apply(this, arguments); }; });
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            const getsBefore = server.initialDataGets;
            const opensBefore = await page.evaluate(() => window.__opens);
            server.books.find(b => b.id === 'tb2').progress_course_key = null; // 두 번째 교재는 과정 연결이 없다
            await page.evaluate(() => { const b = state.db.class_textbooks.find(x => x.id === 'tb2'); b.progress_course_key = null; b.progress_level_key = null; b.progress_curriculum_key = null; state.ui.classProgressModalState.books.find(x => x.id === 'tb2').progress_course_key = null; state.ui.classProgressModalState.allBooks.find(x => x.id === 'tb2').progress_course_key = null; });
            await page.locator('button', { hasText: '과정 추가' }).first().click();
            await page.selectOption('#record-progress-course-select', '2022|middle|M3-1');
            await page.locator('.ap-class-progress-course-book-choice[value="tb2"]').check();
            await page.locator('button', { hasText: '+ 새 교재 등록' }).click();
            await page.fill('#class-progress-course-new-tb-title', '과정과 함께 만든 교재');
            await page.locator('button', { hasText: '적용' }).click();
            await page.waitForTimeout(800);
            const posts = server.calls.filter(c => c.method === 'POST' && c.rel === 'class-textbooks');
            assert.equal(posts.length, 1);
            assert.deepEqual(posts[0].payload, { class_id: 'c1', title: '과정과 함께 만든 교재', start_date: posts[0].payload.start_date, progress_curriculum_key: '2022', progress_level_key: 'middle', progress_course_key: 'M3-1' });
            const patches = server.calls.filter(c => c.method === 'PATCH');
            assert.deepEqual(patches.map(c => c.rel).sort(), ['class-textbooks/tb1', 'class-textbooks/tb2'], '체크된 기존 교재만 PATCH, 새 교재는 다시 PATCH하지 않음');
            assert.deepEqual(patches[0].payload, { progress_curriculum_key: '2022', progress_level_key: 'middle', progress_course_key: 'M3-1' });
            assert.equal(server.initialDataGets, getsBefore, '재조회 0');
            assert.equal(await page.evaluate(() => window.__opens), opensBefore, '재오픈 0');
            assert.equal(await page.locator('[data-progress-group="2022|middle|M3-1"]').count() >= 1, true, '과정 카드가 같은 자리에 나타남');
            assert.equal(await page.locator('.ap-class-progress-book', { hasText: '과정과 함께 만든 교재' }).count(), 1, '새 교재가 목록에 나타남');
            console.log('흐름6 통과: 과정+새 교재 적용 POST 1 + 기존 교재 PATCH 2, 재조회 0, 재오픈 0');
            assert.deepEqual(errors, [], 'page errors ' + errors.join(' | '));
        } finally { await context.close(); }
    }

    // 7) 교재 관리 모드에서 반 탭 전환: 모드 유지, 이름 고치다 만 칸이 있으면 Esc는 확인
    {
        const server = makeServer('normal');
        const { context, page, errors } = await openApp(browser, base, pc, 'light', server);
        try {
            const dialogs = [];
            page.on('dialog', async d => { dialogs.push(d.message()); await d.dismiss(); });
            await page.evaluate(() => openGlobalTextbookManage());
            await page.waitForTimeout(1200);
            assert.equal(await page.locator('.ap-class-progress-class-tab').count(), 5, '모든 반 탭');
            await page.locator('.ap-class-progress-class-tab', { hasText: '중3A' }).click();
            await page.waitForTimeout(900);
            assert.equal(await page.getAttribute('.ws-progress', 'data-ws-mode'), 'manage', '반을 바꿔도 교재 관리 모드 유지');
            assert.equal(await page.locator('.ws-progress-manage-item').count(), 3);
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
            assert.equal(dialogs.length, 0, '변경 없으면 Esc로 바로 닫힘');
            await page.evaluate(() => openGlobalTextbookManage({ classId: 'c1' }));
            await page.waitForTimeout(1200);
            await page.fill('#edit-tb-title', '고치다 만 이름');
            await page.keyboard.press('Escape');
            await page.waitForTimeout(400);
            assert.equal(dialogs.length, 1, '이름을 고치다 만 칸이 있으면 Esc는 확인을 묻는다');
            assert.equal(await isOpen(page), true);
            console.log('흐름7 통과: 반 탭 전환 시 모드 유지, 고치다 만 칸 Esc 확인');
            assert.deepEqual(errors, [], 'page errors ' + errors.join(' | '));
        } finally { await context.close(); }
    }

    // 5) 1280x800: 왼쪽 가장자리가 56px 레일에 닿지 않는다
    {
        const server = makeServer('normal');
        const { context, page } = await openApp(browser, base, DEVICES[2], 'light', server);
        try {
            await page.evaluate(() => openClassRecordModal('c1'));
            await page.waitForTimeout(1200);
            const left = await page.evaluate(() => Math.round(document.getElementById('modal-content').getBoundingClientRect().left));
            assert.ok(left >= 60, '레일(56px) 오른쪽에 있다: left=' + left);
            console.log('흐름5 통과: 1280x800 모달 left=' + left + 'px');
        } finally { await context.close(); }
    }
}

async function main() {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        if (flowMode) await flows(browser, base);
        if (shotDir) {
            const problems = await shoot(browser, base);
            console.log(problems.length ? '문제 ' + problems.length + '건:\n' + problems.join('\n') : '스크린샷 모두 문제 없음');
            if (problems.length && !process.env.APMS_ALLOW_PROBLEMS) process.exitCode = 1;
        }
    } finally {
        await browser.close();
        server.close();
    }
}

module.exports = { startServer, openApp, makeServer, audit, DEVICES };
if (require.main === module) main().catch(error => { console.error(error); process.exit(1); });
