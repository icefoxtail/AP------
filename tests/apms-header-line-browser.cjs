// APMS 데스크톱 머리줄 일치 확인: 레일 맨 위 칸(☰)과 .desktop-topbar 가 한 줄로 이어지는지 잰다(선생님·원장 두 역할, 스크롤 뒤에도).
// (테스트 전용: 서버·인증 코드는 건드리지 않고, 실서버 API 는 가로채기 + localStorage 테스트 세션으로 대체한다.)
// 실행:  node tests/apms-header-line-browser.cjs
//        APMS_SHOT_DIR=/경로 node tests/apms-header-line-browser.cjs   (+ 스크린샷)
//        APMS_MEASURE=1 node tests/apms-header-line-browser.cjs        (단정 없이 수치만 출력)
// 필요: playwright 모듈(AP_PLAYWRIGHT_MODULE)과 크롬. run-tests.js가 돌리는 파일이 아니다.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const shotDir = process.env.APMS_SHOT_DIR || '';
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

const EMPTY = ['attendance', 'homework', 'consultations', 'operation_memos', 'exam_sessions', 'wrong_answers', 'class_exam_assignments', 'exam_schedules', 'academy_schedules', 'journals', 'class_textbooks', 'class_daily_records', 'class_daily_progress', 'timetable_classes', 'timetable_class_students', 'timetable_students', 'timetable_class_textbooks', 'class_progress_taxonomy', 'class_progress_snapshots', 'class_progress_items', 'class_progress_phases', 'attendance_history', 'homework_history', 'wrong_clinic_status', 'report_exam_cohort_stats', 'exam_blueprints', 'exam_question_reviews', 'exam_analysis_meta', 'school_exam_records', 'parent_contacts', 'message_logs', 'student_status_history', 'class_transfer_history', 'timetable_conflict_logs', 'timetable_conflict_overrides'];
function fixture() {
    const today = new Date().toLocaleDateString('sv-SE');
    const out = {
        success: true,
        classes: [{ id: 'c1', name: '중3A', grade: '중3', subject: '수학', teacher_name: '김선생', schedule_days: '1,3,5', time_label: '6:30~8:00', is_active: 1 }],
        students: [{ id: 's1', name: '김민수', grade: '중3', school: '왕지중', status: '재원', enroll_date: '2026-03-02' }],
        class_students: [{ class_id: 'c1', student_id: 's1' }],
        class_progress_date: today, class_progress_taxonomy_version: 'x'
    };
    EMPTY.forEach(k => { out[k] = []; });
    return out;
}

async function openApp(browser, base, width, height, theme, role = 'teacher') {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: Number(process.env.APMS_DSF || 1) });
    await context.route(API + '**', route => {
        const url = new URL(route.request().url());
        const body = url.pathname.endsWith('/initial-data') ? fixture() : { success: true, data: [], items: [] };
        route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }, body: JSON.stringify(body) });
    });
    await context.route(/^https:\/\/api\.qrserver\.com\//, route => route.abort());
    await context.addInitScript(({ theme, role }) => {
        localStorage.setItem('APMATH_THEME', theme);
        localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 't1', name: '김선생', role, session_token: 'local-test-only' }));
    }, { theme, role });
    const page = await context.newPage();
    page.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0, 200)));
    await page.goto(`${base}/apmath/index.html`, { waitUntil: 'load' });
    await page.waitForFunction(() => typeof state !== 'undefined' && state.db && state.db.classes.length > 0, null, { timeout: 15000 });
    await page.waitForTimeout(700);
    return { context, page };
}

// 머리줄 아래쪽 선이 놓인 y(선의 위쪽 가장자리)를 잰다.
async function measure(page) {
    return page.evaluate(() => {
        const r = el => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, height: b.height, left: b.left, right: b.right }; };
        const bar = document.querySelector('.desktop-topbar');
        const drawer = document.getElementById('app-drawer');
        const tools = drawer.querySelector('.drw-top-tools');
        const toggle = drawer.querySelector('.drw-rail-toggle');
        const expanded = drawer.classList.contains('drw-expanded');
        const cs = getComputedStyle(bar);
        const barLine = r(bar).bottom - parseFloat(cs.borderBottomWidth);
        let railLine, railLineH, railLineColor;
        const dr = r(drawer);
        if (expanded) {
            const tcs = getComputedStyle(tools);
            railLine = r(tools).bottom - parseFloat(tcs.borderBottomWidth); railLineH = parseFloat(tcs.borderBottomWidth); railLineColor = tcs.borderBottomColor;
        } else {
            const tcs = getComputedStyle(toggle);
            railLine = r(toggle).bottom - parseFloat(tcs.borderBottomWidth); railLineH = parseFloat(tcs.borderBottomWidth); railLineColor = tcs.borderBottomColor;
        }
        const labels = [...drawer.querySelectorAll('.drw-menu .drw-section-label')].filter(el => getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().height > 0);
        const firstItem = drawer.querySelector('.drw-menu .drw-item');
        const qf = document.querySelector('.desktop-topbar .apms-qf-open--pill');
        return {
            expanded, barHeight: r(bar).height, barLine, barLineColor: cs.borderBottomColor, barBg: cs.backgroundColor, barBox: cs.boxSizing,
            railLine, railLineH, railLineColor, drawerBg: getComputedStyle(drawer).backgroundColor, drawerTop: dr.top,
            toggleTop: toggle ? r(toggle).top : null, toggleBottom: toggle ? r(toggle).bottom : null,
            firstLabelTop: labels.length ? r(labels[0]).top : null, firstItemTop: firstItem ? r(firstItem).top : null,
            qf: qf ? r(qf) : null
        };
    });
}


// 실제로 그려진 화면에서 머리 선이 놓인 y(화면 픽셀 행)를 읽는다. 레이아웃 수치가 아니라 픽셀이므로 sticky·테두리 반올림(화면 배율)까지 본다.
// 상단 막대 쪽(x=700)과 레일·서랍 쪽(x=3) 열에서, 머리 칸 바탕(y=45)과 다른 밝기의 행(선)을 y 50~70 안에서 찾는다.
async function pixelLineRows(page) {
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 720, height: 100 } });
    return page.evaluate(async ({ b64 }) => {
        const img = new Image();
        await new Promise((ok, no) => { img.onload = ok; img.onerror = no; img.src = 'data:image/png;base64,' + b64; });
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const d = img.width / 720; // 화면 배율(DPR)
        const sum = (x, y) => { const p = g.getImageData(x, y, 1, 1).data; return p[0] + p[1] + p[2]; };
        const rows = xc => { const x = Math.round(xc * d), ref = sum(x, Math.round(45 * d)), out = []; for (let y = Math.round(50 * d); y < Math.round(70 * d); y++) if (Math.abs(sum(x, y) - ref) > 15) out.push(y); return out; };
        return { rail: rows(3), bar: rows(700) };
    }, { b64: buf.toString('base64') });
}

async function main() {
    const server = await startServer();
    const base = `http://127.0.0.1:${server.address().port}`;
    const browser = await chromium.launch();
    const rows = [];
    const measureOnly = !!process.env.APMS_MEASURE;
    const note = (tag, o) => { if (measureOnly) rows.push({ tag, ...o }); };
    try {
        for (const role of ['teacher', 'admin']) {
            for (const [w, h] of [[1280, 800], [1440, 900], [1919, 1000]]) {
                for (const theme of ['light', 'dark']) {
                    const { context, page } = await openApp(browser, base, w, h, theme, role);
                    try {
                        const tag = `${role} ${w}x${h} ${theme}`;
                        const a = await measure(page);
                        note(tag + ' rail', a);
                        if (shotDir) await page.screenshot({ path: path.join(shotDir, `full-${role}-${w}x${h}-${theme}.png`) });
                        if (shotDir && w === 1440) await page.screenshot({ path: path.join(shotDir, `rail-${role}-${w}x${h}-${theme}.png`), clip: { x: 0, y: 0, width: 420, height: 220 } });
                        await page.evaluate(() => openAppDrawer());
                        await page.waitForTimeout(600);
                        const b = await measure(page);
                        note(tag + ' expanded', b);
                        if (shotDir && w === 1440) await page.screenshot({ path: path.join(shotDir, `expanded-${role}-${w}x${h}-${theme}.png`), clip: { x: 0, y: 0, width: 520, height: 220 } });
                        if (measureOnly) continue;
                        for (const m of [a, b]) {
                            const s = `${tag} ${m.expanded ? '펼침' : '레일'}`;
                            assert.ok(Math.abs(m.railLine - m.barLine) <= 0.5, `${s}: 서랍 머리선 y=${m.railLine} / 상단바 선 y=${m.barLine}`);
                            assert.equal(m.railLineH, 1, `${s}: 머리선 두께 1px`);
                            assert.equal(m.railLineColor, m.barLineColor, `${s}: 머리선 색이 같다`);
                            assert.equal(m.barHeight, 58, `${s}: 상단바 총 높이 58px`);
                            if (m.qf) assert.ok(m.qf.height <= 40 && m.qf.top >= 4 && m.qf.bottom <= m.barLine - 4, `${s}: 빠른 찾기 알약이 상단바 안에 들어간다`);
                            if (!m.expanded && m.firstLabelTop != null) assert.ok(m.firstLabelTop - m.railLine > 8, `${s}: 레일 첫 구분선이 머리선 바로 밑에 붙지 않는다`);
                        }
                        if (role === 'teacher' && w === 1440 && theme === 'light') {
                            await page.evaluate(() => closeAppDrawer());
                            await page.waitForTimeout(500);
                            await page.evaluate(() => showModal('샘플', '<div class="apms-modal apms-modal--confirm"><p>모달 열림 확인</p><div class="apms-modal__actions"><button class="btn" onclick="closeModal()">닫기</button></div></div>'));
                            await page.waitForTimeout(500);
                            assert.equal(await page.evaluate(() => document.body.classList.contains('ap-modal-open')), true);
                            if (shotDir) await page.screenshot({ path: path.join(shotDir, `modal-${w}x${h}-${theme}.png`) });
                        }
                    } finally { await context.close(); }
                }
            }

            // 스크롤: 항목이 많아 레일·서랍이 스크롤돼도 머리줄은 상단 막대 선과 같은 y 에 남는다(픽셀로 확인). 낮은 화면(1280x500)은 두 역할 모두 확실히 스크롤된다.
            for (const [w, h] of [[1280, 800], [1440, 900], [1280, 500]]) {
                for (const theme of ['light', 'dark']) {
                    const { context, page } = await openApp(browser, base, w, h, theme, role);
                    try {
                        for (const expanded of [false, true]) {
                            if (expanded) { await page.evaluate(() => openAppDrawer()); await page.waitForTimeout(600); }
                            const tag = `${role} ${w}x${h} ${theme} ${expanded ? '펼침' : '레일'} 스크롤`;
                            const sc = await page.evaluate(() => { const d = document.getElementById('app-drawer'); const max = d.scrollHeight - d.clientHeight; d.scrollTop = 40; return { max, top: d.scrollTop }; });
                            await page.waitForTimeout(250);
                            const px = await pixelLineRows(page);
                            const m = await measure(page);
                            note(tag, { ...sc, ...px, toggleTop: m.toggleTop });
                            if (shotDir && (w === 1440 || h === 500) && theme === 'light') await page.screenshot({ path: path.join(shotDir, `scrolled-${role}-${expanded ? 'expanded' : 'rail'}-${w}x${h}.png`), clip: { x: 0, y: 0, width: expanded ? 520 : 420, height: 260 } });
                            if (measureOnly) continue;
                            if (h === 500) assert.ok(sc.top > 0, `${tag}: 낮은 화면에서는 스크롤된다(max=${sc.max})`);
                            if (sc.top > 0) {
                                assert.ok(px.rail.length >= 1 && px.rail.length <= 2 && px.rail[0] === px.bar[0], `${tag}: 스크롤 뒤에도 머리선 y 가 같다 (서랍 ${px.rail} / 상단바 ${px.bar})`);
                                if (!expanded) assert.equal(m.toggleTop, 0, `${tag}: ☰ 머리 칸이 제자리(맨 위)에 남는다`);
                            }
                        }
                    } finally { await context.close(); }
                }
            }
        }

        // 휴대폰·태블릿(<901px)은 머리와 서랍이 예전과 같아야 한다: 데스크톱 상단 막대가 없고 앱 머리줄(header)이 보이며, 서랍을 열면 머리줄 칸이 58px.
        for (const [w, h] of [[390, 844], [800, 1280]]) {
            const { context, page } = await openApp(browser, base, w, h, 'light');
            try {
                const before = await page.evaluate(() => ({ bar: getComputedStyle(document.querySelector('.desktop-topbar')).display, header: document.querySelector('body > header').getBoundingClientRect().height }));
                await page.evaluate(() => openAppDrawer());
                await page.waitForTimeout(600);
                const open = await page.evaluate(() => { const t = document.querySelector('#app-drawer .drw-top-tools').getBoundingClientRect(); const d = document.getElementById('app-drawer').getBoundingClientRect(); return { toolsTop: t.top, toolsBottom: t.bottom, drawerW: d.width, drawerLeft: d.left }; });
                note(`${w}x${h}`, { ...before, ...open });
                if (shotDir) await page.screenshot({ path: path.join(shotDir, `small-${w}x${h}-drawer.png`) });
                if (!measureOnly) {
                    assert.equal(before.bar, 'none', `${w}px: 데스크톱 상단 막대는 숨김`);
                    assert.ok(before.header > 40, `${w}px: 앱 머리줄이 보임`);
                    assert.equal(open.toolsBottom - open.toolsTop, 58, `${w}px: 서랍 머리줄 칸 58px`);
                }
            } finally { await context.close(); }
        }
    } finally { await browser.close(); server.close(); }
    if (measureOnly) console.log(JSON.stringify(rows));
    console.log('apms-header-line-browser: OK');
}
main().catch(e => { console.error(e); process.exit(1); });
