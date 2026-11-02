// APMS M7 클리닉 작업 화면 확인 하니스 (테스트 전용, 서버·인증 코드는 건드리지 않는다).
//
// tests/apms-foundation-browser.cjs 와 같은 방식: 정적 서버로 저장소를 열고 workers.dev API 요청을 Playwright가 가로채
// 가짜 응답을 준다. 클리닉에 필요한 시험 기록·오답·청사진 가짜 데이터를 상태 3가지(빈/보통/많음)로 만든다.
//
// 실행:  node tests/apms-clinic-workspace-browser.cjs                      (동작 검사: 반 전환·탭·취소·닫기)
//        APMS_SHOT_DIR=/경로 node tests/apms-clinic-workspace-browser.cjs   (+ 기기×테마×상태 스크린샷, 12px·터치·넘침 검사)
//        APMS_CLINIC_FLOW=legacy APMS_ROOT=/옛시점폴더 APMS_SHOT_DIR=/경로 ...   (이전 모습 비교용 스크린샷)
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE로 경로 지정 가능)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = process.env.APMS_ROOT ? path.resolve(process.env.APMS_ROOT) : path.resolve(__dirname, '..');
const shotDir = process.env.APMS_SHOT_DIR || '';
const only = process.env.APMS_SHOT_ONLY ? process.env.APMS_SHOT_ONLY.split(',') : null; // 이름에 포함된 조각, 예: print-many-pc,detail-normal-phone
const flow = process.env.APMS_CLINIC_FLOW === 'legacy' ? 'legacy' : 'workspace';
const API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/';

const DEVICES = [
    { id: 'phone-390x844', width: 390, height: 844, mobile: true },
    { id: 'tablet-p-800x1280', width: 800, height: 1280, mobile: true },
    { id: 'tablet-l-1280x800', width: 1280, height: 800, mobile: true },
    { id: 'pc-1440x900', width: 1440, height: 900, mobile: false }
];
const STATES = ['empty', 'normal', 'many'];

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

function dateBefore(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toLocaleDateString('sv-SE');
}

// scale: empty(시험 기록 없음) | normal(학생 8명·시험 2개·약점 단원 4개) | many(학생 30명·시험 10개·약점 단원 12개)
function buildData(scale) {
    const today = dateBefore(0);
    const classes = [
        ['c1', '중3A', '중3', '1,3,5', '6:30~8:00'], ['c2', '중2B', '중2', '2,4', '4:50~6:20'], ['c3', '고1 심화', '고1', '1,4', '8:00~9:30'],
        ['c4', '중1C', '중1', '2,5', '6:30~8:00'], ['c5', '고2 미적', '고2', '3,6', '4:50~6:20'], ['c6', '중3A', '중3', '2,4', '8:00~9:30']
    ].map(([id, name, grade, days, time]) => ({ id, name, grade, subject: '수학', teacher_name: id === 'c6' ? '박선생' : '김선생', schedule_days: days, time_label: time, is_active: 1 })); // c6: 다른 선생님 반(이름 중복) — 선생님 탭에는 안 보이고 "다른 반"으로 연다
    const names = ['김민수', '이서윤', '박지호', '최유나', '정도윤', '강하린', '조현우', '윤서아', '장민재', '임채원', '한지우', '오세린'];
    const students = [];
    const class_students = [];
    classes.forEach((c, ci) => {
        const count = c.id === 'c1' && scale === 'many' ? 30 : 8;
        for (let i = 0; i < count; i++) {
            const id = `${c.id}s${i}`;
            students.push({ id, name: names[(i + ci) % names.length] + (i >= 12 ? String(Math.floor(i / 12) + 1) : ''), grade: c.grade, school: '왕지중', status: '재원', phone: '010-0000-0000', guardian_phone: '010-1111-2222', enroll_date: '2026-03-02' });
            class_students.push({ class_id: c.id, student_id: id });
        }
    });
    const examCount = scale === 'many' ? 10 : scale === 'normal' ? 2 : 0;
    const unitCount = scale === 'many' ? 12 : scale === 'normal' ? 4 : 0;
    const assignments = [];
    const sessions = [];
    const wrong_answers = [];
    const blueprints = [];
    for (let e = 0; e < examCount; e++) {
        const file = `exams/clinic_test_${e}.js`;
        const date = dateBefore(3 + e * 2);
        const title = `왕지중 ${e + 1}회 단원평가`;
        assignments.push({ id: `a${e}`, class_id: 'c1', exam_date: date, exam_title: title, archive_file: file, question_count: 20, is_active: 1 });
        for (let q = 1; q <= 20; q++) {
            const u = (q + e) % Math.max(unitCount, 1);
            blueprints.push({ archive_file: file, question_no: q, standard_unit_key: `U-${String(u + 1).padStart(2, '0')}`, standard_unit: `${u + 1}. ${['다항식의 연산', '인수분해', '이차방정식', '이차함수의 그래프', '삼각비', '원의 성질', '확률', '통계', '일차함수', '연립방정식', '제곱근과 실수', '부등식'][u % 12]}`, standard_course: '중3', concept_cluster_key: `K-${(u % 4) + 1}` });
        }
        students.filter(s => s.id.startsWith('c1s')).forEach((s, si) => {
            const sid = `ses_${e}_${si}`;
            sessions.push({ id: sid, student_id: s.id, class_id: 'c1', exam_date: date, exam_title: title, archive_file: file, question_count: 20, score: 55 + ((si * 7 + e * 3) % 45) });
            for (let q = 1; q <= 20; q++) if ((si + q * 3 + e) % 5 === 0 || q === 1 + (si % 3)) wrong_answers.push({ id: `w_${sid}_${q}`, session_id: sid, question_id: q });
        });
    }
    return { today, classes, students, class_students, assignments, sessions, wrong_answers, blueprints };
}

function initialData(data) {
    const { today, classes, students, class_students, assignments, sessions, wrong_answers, blueprints } = data;
    return {
        success: true, classes, students, class_students, attendance: [], homework: [],
        consultations: [], operation_memos: [], exam_sessions: sessions, wrong_answers, class_exam_assignments: assignments, exam_schedules: [],
        academy_schedules: [], journals: [], class_textbooks: [], class_daily_records: [], class_daily_progress: [], timetable_classes: [],
        timetable_class_students: [], timetable_students: [], timetable_class_textbooks: [], class_progress_date: today, class_progress_taxonomy_version: 'x',
        class_progress_taxonomy: [], class_progress_snapshots: [], class_progress_items: [], class_progress_phases: [], attendance_history: [],
        homework_history: [], wrong_clinic_status: [], report_exam_cohort_stats: [], exam_blueprints: blueprints, exam_question_reviews: [],
        exam_analysis_meta: [], school_exam_records: [], parent_contacts: [], message_logs: [], student_status_history: [], class_transfer_history: [],
        timetable_conflict_logs: [], timetable_conflict_overrides: []
    };
}

async function openApp(browser, base, device, theme, scale, options = {}) {
    const data = buildData(scale);
    const context = await browser.newContext({
        viewport: { width: device.width, height: device.height },
        deviceScaleFactor: 1, hasTouch: device.mobile, isMobile: device.mobile && device.width < 700
    });
    const apiCalls = [];
    await context.route(API + '**', async route => {
        const url = new URL(route.request().url());
        apiCalls.push(url.pathname.replace(/^.*\/api\//, '') + url.search);
        if (options.apiDelayMs) await new Promise(resolve => setTimeout(resolve, options.apiDelayMs));
        let body = { success: true, data: [], items: [] };
        const p = url.pathname;
        if (p.endsWith('/initial-data')) body = initialData(data);
        else if (p.endsWith('/exam-sessions/by-class')) {
            const classId = url.searchParams.get('class');
            const ids = new Set(data.class_students.filter(r => r.class_id === classId).map(r => r.student_id));
            const mine = data.sessions.filter(s => ids.has(s.student_id));
            const mineIds = new Set(mine.map(s => s.id));
            body = { success: true, sessions: mine, assignments: data.assignments.filter(a => a.class_id === classId), wrong_answers: data.wrong_answers.filter(w => mineIds.has(w.session_id)), exclusions: [], blueprints: data.blueprints, result_items: [], assignment_questions: [] };
        } else if (p.endsWith('/exam-sessions/by-grade')) {
            body = { success: true, classes: data.classes, class_students: data.class_students, students: data.students, assignments: data.assignments, sessions: data.sessions, wrong_answers: data.wrong_answers, blueprints: data.blueprints, exclusions: [], result_items: [], assignment_questions: [] };
        } else if (p.endsWith('/exam-blueprints')) {
            const file = url.searchParams.get('file');
            body = { success: true, items: data.blueprints.filter(b => b.archive_file === file) };
        }
        await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(body) });
    });
    await context.route(/^https:\/\/api\.qrserver\.com\//, route => route.abort());
    await context.addInitScript(({ theme }) => {
        localStorage.setItem('APMATH_THEME', theme);
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 't1', name: '김선생', role: 'teacher', session_token: 'local-test-only' }));
    }, { theme });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    // 테스트 전용: 유사문항 후보 만들기는 JS아카이브 시험 파일 수백 개를 읽으므로 가짜 후보로 바꾼다(화면 확인용, 앱 코드는 그대로).
    await page.addInitScript(() => {
        window.__stubRecommendations = true;
    });
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
        if (typeof buildSimilarQuestionCandidates === 'function') {
            window.buildSimilarQuestionCandidates = async (item, limit = 10) => Array.from({ length: Math.min(limit, 6) }, (_, i) => ({
                file: 'exams/stub_' + i + '.js', archiveFile: 'exams/stub_' + i + '.js', examTitle: '유사 시험 ' + (i + 1), sourceTitle: '유사 시험 ' + (i + 1),
                questionId: i + 3, questionNo: i + 3, level: i % 2 ? '중' : '상', standardUnitKey: item.unitKey || '', standardUnit: item.label || '',
                standardCourse: '중3', conceptClusterKey: item.cluster || '', contentPreview: '다음 이차방정식의 해를 구하시오. x² - ' + (i + 2) + 'x + 6 = 0 의 두 근의 합과 곱을 이용하여 값을 구하는 문제입니다.',
                preview: '다음 이차방정식의 해를 구하시오. x² - ' + (i + 2) + 'x + 6 = 0', matchType: i % 3 === 2 ? 'conceptClusterKey' : 'standardUnitKey'
            }));
        }
    });
    return { context, page, errors, apiCalls, data };
}

async function modalOpen(page) {
    return page.evaluate(() => !document.getElementById('modal-overlay').classList.contains('hidden') && document.getElementById('modal-overlay').classList.contains('show'));
}

// 열린 모달 안의 12px 미만 글자, 24px 미만 터치 요소, 가로 넘침을 잰다(iframe 안은 제외).
async function measureModal(page) {
    return page.evaluate(() => {
        const out = { smallText: [], smallTouch: [], docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, modalOverflow: 0, rect: null, cancelButtons: 0 };
        const content = document.getElementById('modal-content');
        if (!content || document.getElementById('modal-overlay').classList.contains('hidden')) return out;
        const r = content.getBoundingClientRect();
        out.rect = { left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom), vw: innerWidth, vh: innerHeight };
        const visible = el => {
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
            const b = el.getBoundingClientRect();
            return b.width > 0 && b.height > 0;
        };
        const describe = el => (el.id ? '#' + el.id : '') + '.' + String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className).trim().split(/\s+/).slice(0, 2).join('.') + ' "' + (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 14) + '"';
        const body = document.getElementById('modal-body');
        if (body) out.modalOverflow = Math.max(0, body.scrollWidth - body.clientWidth);
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.nodeValue.trim()) continue;
            const el = node.parentElement;
            if (!el || seen.has(el) || !visible(el)) continue;
            seen.add(el);
            const fs = parseFloat(getComputedStyle(el).fontSize);
            if (fs < 12) out.smallText.push(fs + 'px ' + describe(el));
        }
        content.querySelectorAll('button, a[href], select, input:not([type=hidden]), textarea, [role=button], [tabindex="0"]').forEach(el => {
            if (!visible(el) || el.closest('iframe')) return;
            let box = el.getBoundingClientRect();
            if (el.matches('input[type=checkbox], input[type=radio]')) {
                const label = el.closest('label');
                if (label && visible(label)) box = label.getBoundingClientRect();
            }
            if (box.width < 24 || box.height < 24) out.smallTouch.push(Math.round(box.width) + 'x' + Math.round(box.height) + ' ' + describe(el));
        });
        out.cancelButtons = Array.from(content.querySelectorAll('button')).filter(b => visible(b) && b.innerText.trim() === '취소').length;
        return out;
    });
}

// 상태별로 화면을 연다.
const OPEN = {
    legacy: {
        menu: page => page.evaluate(() => openClinicCenter('c1')),
        picker: page => page.evaluate(() => openClinicClassPicker()),
        print: page => page.evaluate(() => openClinicPrintCenter('c1')),
        similar: page => page.evaluate(() => openClinicSimilarForClass('c1')),
        detail: async page => {
            await page.evaluate(() => openClinicSimilarForClass('c1'));
            await page.waitForTimeout(500);
            const first = page.locator('#modal-body [onclick^="openWeakUnitDetail"]').first();
            if (await first.count()) await first.click();
        }
    },
    workspace: {
        print: page => page.evaluate(() => openClinicCenter('c1')),
        similar: async page => {
            await page.evaluate(() => openClinicCenter('c1'));
            await page.waitForTimeout(400);
            await page.getByRole('tab', { name: '유사문항' }).click();
        },
        // 추천 보기(단원 상세 + 유사문항 후보)
        detail: async page => {
            await page.evaluate(() => openClinicCenter('c1'));
            await page.waitForTimeout(400);
            await page.getByRole('tab', { name: '유사문항' }).click();
            await page.waitForTimeout(500);
            const tab = page.locator('.ws-clinic-subtab', { hasText: '유사문항 추천' });
            if (await tab.count()) { await tab.click(); await page.waitForTimeout(600); }
        },
        // 다른 반 선택 칸이 보이는 위쪽 줄
        other: async page => {
            await page.evaluate(() => openClinicCenter('c1'));
            await page.waitForTimeout(500);
        },
        // 바구니 보기(후보 2개 담은 뒤)
        basket: async page => {
            await page.evaluate(() => openClinicCenter('c1'));
            await page.waitForTimeout(400);
            await page.getByRole('tab', { name: '유사문항' }).click();
            await page.waitForTimeout(500);
            const tab = page.locator('.ws-clinic-subtab', { hasText: '유사문항 추천' });
            if (await tab.count()) {
                await tab.click();
                await page.waitForSelector('.ws-clinic-candidate');
                const add = page.locator('.ws-clinic-candidate button:not(:disabled)');
                await add.first().click();
                await add.first().click();
                await page.locator('.ws-clinic-subtab', { hasText: '바구니' }).click();
                await page.waitForTimeout(300);
            }
        }
    }
};

async function behaviour(browser, base) {
    const { context, page, errors, apiCalls } = await openApp(browser, base, DEVICES[3], 'light', 'normal');
    try {
        const dialogs = [];
        let acceptNext = false;
        page.on('dialog', async dialog => { dialogs.push(dialog.message()); if (acceptNext) { acceptNext = false; await dialog.accept(); } else await dialog.dismiss(); });
        const title = () => page.locator('#modal-title').innerText();
        const settle = ms => page.waitForTimeout(ms || 700);
        // showModal 호출 횟수를 센다(테스트 전용 감시): 반·탭·단원을 바꿀 때 모달을 갈아 끼우지 않는다는 근거는 아래 DOM 표식으로 본다.
        await page.evaluate(() => { window.__bodyNode = null; window.__overlayHidden = 0; new MutationObserver(() => { if (document.getElementById('modal-overlay').classList.contains('hidden')) window.__overlayHidden += 1; }).observe(document.getElementById('modal-overlay'), { attributes: true, attributeFilter: ['class'] }); });

        // 1) 반 화면 → 클리닉 진입: 모달 1개, 제목 '클리닉', 반 전환 탭·보기 탭, 취소 버튼 하나
        await page.evaluate(() => renderClass('c1'));
        await settle(800);
        await page.evaluate(() => openClassroomFeature('c1', 'clinic'));
        await page.waitForSelector('.ws-clinic', { timeout: 8000 });
        await page.waitForSelector('#clinic-print-summary', { timeout: 8000 });
        assert.equal(await title(), '클리닉');
        assert.equal(await page.locator('.ws-clinic-classtab').count(), 5, '반 전환 탭 5개');
        assert.equal(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').innerText().then(t => t.trim()), '중3A');
        assert.equal(await page.getByRole('tab', { name: '오답 출력' }).getAttribute('aria-selected'), 'true');
        assert.equal((await measureModal(page)).cancelButtons, 1, '취소 버튼은 헤더 하나만 보인다');
        assert.match(await page.locator('#clinic-print-summary').innerText(), /선택 시험/);
        assert.ok(apiCalls.some(c => c.startsWith('exam-sessions/by-class?class=c1')), '출력 센터가 반 시험 기록을 불러온다');

        // 1a) 내 반(5개)만 탭에 있고, 다른 선생님 반은 "다른 반" 선택 칸에 있다(같은 이름은 담당을 붙여 구분)
        assert.equal(await page.locator('.ws-clinic-classtab', { hasText: '박선생' }).count(), 0);
        assert.deepEqual(await page.locator('.ws-clinic-otherclass option').allTextContents(), ['다른 반', '중3A · 박선생']);
        assert.equal(await page.locator('.ws-clinic-otherclass').getAttribute('data-apms-nodirty'), '');

        // 1b) 반 표기: 학년을 겹쳐 쓰지 않고, 같은 이름 + 다른 담당일 때만 담당 이름을 붙인다
        const labels = await page.evaluate(() => {
            const a = { id: 'x1', name: '중3A', grade: '중3', teacher_name: '김선생' };
            const b = { id: 'x2', name: '중3A', grade: '중3', teacher_name: '박선생 선생님' };
            const c = { id: 'x3', name: '심화반', grade: '고1', teacher_name: '김선생' };
            const peers = [a, b, c];
            return [wsClinicClassLabel(a, peers), wsClinicClassLabel(b, peers), wsClinicClassLabel(c, peers), wsClinicClassLabel(a, [a, c])];
        });
        assert.deepEqual(labels, [{ text: '중3A', teacher: '김선생' }, { text: '중3A', teacher: '박선생' }, { text: '고1 심화반', teacher: '' }, { text: '중3A', teacher: '' }]);

        const shared = await page.evaluate(() => { const original = window.apmsClassLabel; window.apmsClassLabel = () => ({ text: '공통표기', teacher: '공통담당' }); const r = wsClinicClassLabel({ id: 'q', name: 'x' }, []); window.apmsClassLabel = original; return r; });
        assert.deepEqual(shared, { text: '공통표기', teacher: '공통담당' }, '공통 함수 window.apmsClassLabel 이 있으면 먼저 쓴다');

        // 2) 반 전환: 모달이 닫히지 않고 같은 자리에서 다른 반 출력 센터로 바뀐다
        const hiddenBefore = await page.evaluate(() => window.__overlayHidden);
        await page.locator('.ws-clinic-classtab', { hasText: '중2B' }).click();
        await page.waitForFunction(() => document.querySelector('.clinic-print-summary-card__title')?.textContent.trim() === '중2B', null, { timeout: 8000 });
        assert.equal(await page.evaluate(() => window.__overlayHidden), hiddenBefore, '반을 바꿔도 모달이 닫히지 않는다');
        assert.equal(await title(), '클리닉');
        assert.ok(apiCalls.some(c => c.startsWith('exam-sessions/by-class?class=c2')));

        // 3) 탭 전환: 유사문항(W) ↔ 오답 출력(P), 모달 유지
        await page.getByRole('tab', { name: '유사문항' }).click();
        await page.waitForSelector('.ws-clinic-similar', { timeout: 8000 });
        assert.equal(await page.evaluate(() => window.__overlayHidden), hiddenBefore, '탭을 바꿔도 모달이 닫히지 않는다');
        assert.equal(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').innerText().then(t => t.trim()), '중2B', '탭을 바꿔도 선택한 반이 유지된다');
        await page.locator('.ws-clinic-classtab', { hasText: '중3A' }).click();
        await page.waitForSelector('.ws-clinic-unit', { timeout: 8000 });
        assert.ok(await page.locator('.ws-clinic-unit').count() >= 1, '중3A 취약 단원 목록');

        // 4) 단원 선택 → 같은 자리에서 오른쪽 상세만 바뀐다(모달 갈아 끼움 없음)
        const first = page.locator('.ws-clinic-unit').first();
        await first.click();
        await page.waitForSelector('.ws-clinic-detail__title');
        const firstTitle = (await page.locator('.ws-clinic-detail__title').innerText()).trim();
        assert.ok(firstTitle.length > 0);
        assert.equal(await title(), '클리닉');
        assert.equal(await page.evaluate(() => window.__overlayHidden), hiddenBefore);
        assert.ok(await page.locator('.ws-clinic-row').count() >= 1, '오답 문항 목록');
        const bodyBefore = await page.evaluate(() => { const el = document.getElementById('ws-clinic-root'); el.dataset.marker = 'same-modal'; return true; });
        await page.locator('.ws-clinic-unit').nth(1).click();
        assert.notEqual((await page.locator('.ws-clinic-detail__title').innerText()).trim(), firstTitle, '다른 단원 상세로 바뀐다');
        assert.equal(await page.locator('.ws-clinic-unit[aria-current="true"]').count(), 1, '선택 단원은 하나');
        assert.equal(await page.evaluate(() => document.getElementById('ws-clinic-root').dataset.marker), 'same-modal', '단원을 골라도 모달 내용을 갈아 끼우지 않는다');

        // 5) 유사문항 추천 → 후보 담기 → 바구니(같은 자리) → 단원 B로 바로 이동 → 삭제
        await page.locator('.ws-clinic-subtab', { hasText: '유사문항 추천' }).click();
        await page.waitForSelector('.ws-clinic-candidate', { timeout: 8000 });
        await page.locator('.ws-clinic-candidate button', { hasText: '클리닉 후보 담기' }).first().click();
        await page.waitForTimeout(200);
        assert.match(await page.locator('.ws-clinic-basket-count').first().innerText(), /1/);
        assert.equal(await page.locator('.ws-clinic-candidate button:disabled').count(), 1, '담은 후보는 "바구니에 담김"으로 바뀐다');
        await page.locator('.ws-clinic-unit').nth(2).click();
        await page.waitForSelector('.ws-clinic-candidate', { timeout: 8000 });
        assert.equal(await page.locator('.ws-clinic-unit[aria-current="true"] .ws-clinic-unit__name').count(), 1, '단원 A→B 이동 후에도 추천 보기가 이어진다');
        await page.locator('.ws-clinic-subtab', { hasText: '바구니' }).click();
        await page.waitForSelector('.ws-clinic-basket');
        assert.equal(await page.locator('.ws-clinic-basket-item').count(), 1);
        assert.equal(await title(), '클리닉', '추천·담기·바구니·단원 이동 내내 모달은 하나');
        assert.equal(await page.evaluate(() => window.__overlayHidden), hiddenBefore, '추천·바구니·단원 이동 내내 모달이 닫히지 않는다');
        await page.locator('.ws-clinic-basket-item button', { hasText: '삭제' }).first().click();
        await page.waitForTimeout(200);
        assert.equal(await page.locator('.ws-clinic-basket-item').count(), 0, '바구니 삭제는 같은 자리에서 반영된다');
        assert.equal(await page.evaluate(() => document.getElementById('ws-clinic-root').dataset.marker), 'same-modal');

        // 6) 취소는 한 번에 닫히고 시작한 반 화면으로 돌아간다(옛: 취소 = 반 화면 이탈이 단계마다 반복)
        await page.locator('#modal-cancel-btn').click();
        await settle(700);
        assert.equal(await modalOpen(page), false, '취소 한 번에 닫힌다');
        assert.ok(await page.locator('.ap-classroom-shell').count() >= 1, '시작한 반 화면으로 돌아온다');
        assert.equal(dialogs.length, 0, '변경 없는 닫기에 확인창이 뜨지 않는다');

        // 7) 서랍(반 없이) 진입: 반 고르기 모달 없이 바로 작업 화면
        await page.evaluate(() => openClinicCenter());
        await page.waitForSelector('.ws-clinic .ws-clinic-classtab');
        assert.equal(await title(), '클리닉');
        assert.ok(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').count() === 1, '기본 반이 하나 선택된다');
        assert.equal(await page.locator('.clinic-print-class-list').count(), 0, '반 고르기 목록은 없다');
        // 마지막에 본 보기(유사문항)가 기억되어 열린다. 오답 출력 탭으로 바꿔도 같은 모달이다.
        assert.equal(await page.getByRole('tab', { name: '유사문항' }).getAttribute('aria-selected'), 'true', '마지막에 본 보기가 기억된다');
        await page.getByRole('tab', { name: '오답 출력' }).click();
        // 바깥 클릭은 닫지 않고, Esc는 닫는다(변경 전)
        await page.waitForSelector('#clinic-print-summary', { timeout: 8000 });
        await page.mouse.click(2, 450);
        await page.waitForTimeout(400);
        assert.equal(await modalOpen(page), true, '바깥 클릭으로 닫히지 않는다');
        await page.keyboard.press('Escape');
        await settle(700);
        assert.equal(await modalOpen(page), false, 'Esc로 닫힌다');

        // 8) 옛 진입점(직접 호출)이 모두 새 화면을 연다: 출력 센터 직접 호출·유사문항 직접 호출
        await page.evaluate(() => openClinicPrintCenter('c2'));
        await page.waitForSelector('.ws-clinic #clinic-print-summary', { timeout: 8000 });
        assert.equal(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').innerText().then(t => t.trim()), '중2B');
        await page.evaluate(() => openClinicSimilarForClass('c1'));
        await page.waitForSelector('.ws-clinic-similar', { timeout: 8000 });
        assert.equal(await page.getByRole('tab', { name: '유사문항' }).getAttribute('aria-selected'), 'true');
        await page.evaluate(() => closeModal(true));
        await settle(500);

        // 9) 늦게 온 응답: 느린 망에서 반 A → 반 B로 바로 바꿔도 A의 늦은 응답이 B 화면을 덮지 않는다
        await page.evaluate(() => { window.__origGet = api.get; api.get = async (route, ...rest) => { if (String(route).startsWith('exam-sessions/by-class?class=c1')) await new Promise(r => setTimeout(r, 1200)); return window.__origGet.call(api, route, ...rest); }; });
        await page.evaluate(() => { openClinicPrintCenter('c1'); });
        await page.waitForSelector('.ws-clinic', { timeout: 8000 });
        assert.equal(await page.locator('.ws-clinic-loading').count(), 1, '불러오는 동안 모달이 먼저 열려 있다(자리에서 로딩)');
        await page.locator('.ws-clinic-classtab', { hasText: '중2B' }).click();
        await page.waitForFunction(() => document.querySelector('.clinic-print-summary-card__title')?.textContent.trim() === '중2B', null, { timeout: 8000 });
        await page.waitForTimeout(1600);
        assert.equal(await page.locator('.clinic-print-summary-card__title').innerText().then(t => t.trim()), '중2B', '늦게 온 중3A 응답이 중2B 화면을 덮지 않는다');
        await page.evaluate(() => { api.get = window.__origGet; closeModal(true); });
        await settle(500);

        // 9b) 다른 선생님 반(대강·보강): 선택 칸에서 고르면 임시 탭으로 열리고, 다른 반을 보고 돌아와도 탭이 남는다
        await page.evaluate(() => openClinicPrintCenter('c1'));
        await page.waitForSelector('.ws-clinic .ws-clinic-otherclass', { timeout: 8000 });
        await page.waitForSelector('#clinic-print-summary', { timeout: 8000 });
        await page.locator('.ws-clinic-otherclass').selectOption('c6');
        await page.waitForFunction(() => document.querySelector('.ws-clinic-classtab[aria-pressed="true"]')?.dataset.classId === 'c6', null, { timeout: 8000 });
        assert.match(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').innerText(), /중3A\s*박선생/);
        await page.waitForSelector('#clinic-print-summary', { timeout: 8000 });
        assert.equal(await page.locator('.ws-clinic-otherclass').count(), 0, '연 반은 선택 칸에서 빠지고, 고를 반이 없으면 선택 칸도 없다');
        await page.locator('.ws-clinic-classtab[data-class-id="c1"]').click();
        await page.waitForFunction(() => document.querySelector('.ws-clinic-classtab[aria-pressed="true"]')?.dataset.classId === 'c1', null, { timeout: 8000 });
        assert.equal(await page.locator('.ws-clinic-classtab[data-class-id="c6"]').count(), 1, '임시 탭이 남는다');
        await page.evaluate(() => closeModal(true));
        await settle(500);
        await page.evaluate(() => openClinicCenter('c6')); // 반 화면에서 다른 선생님 반으로 들어온 경우
        await page.waitForSelector('.ws-clinic-classtab[data-class-id="c6"][aria-pressed="true"]', { timeout: 8000 });
        await page.evaluate(() => closeModal(true));
        await settle(500);

        // 10) 고른 내용이 있으면 반·탭을 바꾸기 전에 묻는다. 취소하면 그대로, 확인하면 바뀐다.
        await page.evaluate(() => openClinicPrintCenter('c1'));
        await page.waitForSelector('.ws-clinic input[name="clinic-print-exam"]', { timeout: 8000 });
        await page.locator('.ws-clinic input[name="clinic-print-exam"]:not(:checked)').first().check();
        const askedBefore = dialogs.length;
        await page.locator('.ws-clinic-classtab', { hasText: '중2B' }).click();
        await page.waitForTimeout(500);
        assert.equal(dialogs.length, askedBefore + 1, '고른 내용이 있으면 반을 바꾸기 전에 묻는다');
        assert.equal(await page.locator('.ws-clinic-classtab[aria-pressed="true"]').getAttribute('data-class-id'), 'c1', '취소하면 그 반에 그대로 있다');
        acceptNext = true;
        await page.locator('.ws-clinic-classtab', { hasText: '중2B' }).click();
        await page.waitForFunction(() => document.querySelector('.clinic-print-summary-card__title')?.textContent.trim() === '중2B', null, { timeout: 8000 });
        await page.evaluate(() => closeModal(true));
        await settle(500);

        assert.deepEqual(errors, [], 'page errors: ' + errors.join(' | '));
    } finally {
        await context.close();
    }
}

async function shoot(browser, base) {
    fs.mkdirSync(shotDir, { recursive: true });
    const problems = [];
    const views = flow === 'legacy' ? ['menu', 'picker', 'print', 'similar', 'detail'] : ['print', 'similar', 'detail', 'basket', 'other'];
    for (const device of DEVICES) {
        for (const theme of ['light', 'dark']) {
            if (theme === 'dark' && device.id !== 'phone-390x844') continue; // 다크는 대표 1기기(휴대폰)
            for (const scale of STATES) {
                for (const view of views) {
                    if (view === 'other' && (device.id !== 'phone-390x844' || scale !== 'normal' || theme !== 'light')) continue;
                    if ((view === 'menu' || view === 'picker') && scale !== 'normal') continue;
                    const name = `${flow}-${view}-${scale}-${device.id}-${theme}`;
                    if (only && !only.some(piece => name.includes(piece))) continue;
                    const { context, page, errors } = await openApp(browser, base, device, theme, scale);
                    try {
                        await page.evaluate(() => renderClass('c1'));
                        await page.waitForTimeout(500);
                        await OPEN[flow][view](page);
                        await page.waitForTimeout(view === 'print' ? 1800 : 1200);
                        const m = await measureModal(page);
                        await page.screenshot({ path: path.join(shotDir, `${name}.png`) });
                        const notes = [];
                        if (m.docOverflow > 1) notes.push(`문서 가로 넘침 ${m.docOverflow}px`);
                        if (m.modalOverflow > 1) notes.push(`모달 본문 가로 넘침 ${m.modalOverflow}px`);
                        if (m.rect && (m.rect.left < -1 || m.rect.right > m.rect.vw + 1 || m.rect.top < -1 || m.rect.bottom > m.rect.vh + 1)) notes.push('모달이 화면 밖 ' + JSON.stringify(m.rect));
                        if (m.smallText.length) notes.push(`12px 미만 ${m.smallText.length}곳 [${[...new Set(m.smallText)].slice(0, Number(process.env.APMS_VERBOSE || 4)).join(' | ')}]`);
                        if (m.smallTouch.length) notes.push(`24px 미만 터치 ${m.smallTouch.length}곳 [${[...new Set(m.smallTouch)].slice(0, Number(process.env.APMS_VERBOSE || 4)).join(' | ')}]`);
                        if (m.cancelButtons > 1) notes.push(`취소 버튼 ${m.cancelButtons}개`);
                        if (errors.length) notes.push('오류 ' + errors.join(' | '));
                        if (notes.length) problems.push(`${name}: ${notes.join('; ')}`);
                    } finally { await context.close(); }
                }
            }
        }
    }
    return problems;
}

// 출력 불변 근거: 출력 센터에서 시험·학생을 고르고 만든 출제 payload(인쇄 엔진에 가는 값)를 파일로 저장한다.
// 옛 시점(APMS_ROOT=main 을 풀어 둔 폴더, APMS_CLINIC_FLOW=legacy)과 새 시점의 결과를 diff 하면 같아야 한다.
async function dumpPayloads(browser, base, file) {
    const { context, page } = await openApp(browser, base, DEVICES[3], 'light', 'many');
    try {
        await page.evaluate(() => renderClass('c1'));
        await page.waitForTimeout(500);
        await page.evaluate(() => openClinicPrintCenter('c1'));
        await page.waitForSelector('#clinic-print-summary', { timeout: 10000 });
        await page.waitForTimeout(1200);
        const out = await page.evaluate(() => {
            const strip = value => JSON.parse(JSON.stringify(value, (key, v) => (/createdAt|generatedAt|timestamp|clientRequestId|requestId/i.test(key) ? undefined : v)));
            const result = {};
            const examKeys = Array.from(document.querySelectorAll('input[name="clinic-print-exam"]:not(:disabled)')).slice(0, 3).map(el => el.value);
            const studentIds = Array.from(document.querySelectorAll('input[name="clinic-print-student"]')).map(el => el.value);
            result.examKeys = examKeys;
            result.studentCount = studentIds.length;
            for (const mode of ['student', 'class', 'grade']) {
                try {
                    result[mode] = strip(clinicPrintBuildPayload('c1', { selectedExamKeys: examKeys, selectedStudentIds: studentIds, mode, headerOptions: clinicPrintGetHeaderOptions('c1') }));
                } catch (e) { result[mode] = 'ERROR ' + e.message; }
            }
            result.summary = document.getElementById('clinic-print-summary').textContent.trim();
            result.printCenterIds = Array.from(document.querySelectorAll('#modal-body [id]')).map(el => el.id).filter(id => id.startsWith('clinic-print-')).sort();
            return result;
        });
        fs.writeFileSync(file, JSON.stringify(out, null, 2));
    } finally { await context.close(); }
}

(async () => {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        if (process.env.APMS_PAYLOAD_DUMP) {
            await dumpPayloads(browser, base, process.env.APMS_PAYLOAD_DUMP);
            console.log('출제 payload 저장:', process.env.APMS_PAYLOAD_DUMP);
            return;
        }
        if (!process.env.APMS_SKIP_BEHAVIOUR && flow === 'workspace') {
            await behaviour(browser, base);
            console.log('APMS 클리닉 작업 화면 동작 검사 통과');
        }
        if (shotDir) {
            const problems = await shoot(browser, base);
            console.log(problems.length ? '문제:\n' + problems.join('\n') : '스크린샷 모두 넘침·잘림·12px 미만·24px 미만 터치 없음');
            if (problems.length && !process.env.APMS_ALLOW_PROBLEMS) process.exitCode = 1;
        }
    } finally {
        await browser.close();
        server.close();
    }
})().catch(error => { console.error(error); process.exit(1); });
