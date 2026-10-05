const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || 'playwright');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'reports/clinic-grade-recent-month-20260929');
const server = http.createServer((req, res) => {
    if (req.url.startsWith('/fixture')) {
        res.setHeader('Content-Type', 'text/html');
        return res.end('<!doctype html><html lang="ko"><head><meta charset="utf-8"></head><body></body></html>');
    }
    res.setHeader('Content-Type', 'text/html');
    res.end('<!doctype html><html><body>미리보기 검증<pre id="payload"></pre><script>window.addEventListener("message",e=>{if(e.data.type==="AP_PRINT_PREVIEW"){window.payload=e.data.payload;document.getElementById("payload").textContent=JSON.stringify(window.payload)}})</script></body></html>');
});

(async () => {
    fs.mkdirSync(output, { recursive: true });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const browser = await chromium.launch({ channel: 'chrome', headless: true });
    try {
        const page = await browser.newPage({ viewport: { width: 1350, height: 1000 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(`http://127.0.0.1:${server.address().port}/fixture`);
        await page.addStyleTag({ content: ':root{--surface:#fff;--surface-2:#f8fafc;--bg:#f3f4f6;--border:#e5e7eb;--text:#1f2937;--secondary:#6b7280;--primary:#2563eb;--primary-soft:#eff6ff;--primary-rgb:37,99,235;--error:#ef4444;}body{margin:0;padding:16px;font:14px Arial,sans-serif;background:#f3f4f6;}input,button,select{font:inherit;}#modal-body{height:950px;}' });
        await page.addStyleTag({ path: path.join(root, 'apmath/css/apms-clinic-print.css') });
        await page.evaluate(() => {
            const NativeDate = Date;
            window.Date = class extends NativeDate { constructor(...args) { super(...(args.length ? args : ['2026-09-29T12:00:00+09:00'])); } };
            const fileA = 'exams/25_왕운중_2학기_중간_중2_수학.js';
            const fileB = 'exams/25_다른반시험_2학기_중간_중2_수학.js';
            const classes = [{ id: 'c1', name: '중2A', grade: '중2', teacher_name: '선생님 A' }, { id: 'c2', name: '중2B', grade: '중2', teacher_name: '선생님 B' }];
            const students = Array.from({ length: 12 }, (_, i) => ({ id: 's' + i, name: '검증학생 ' + i, status: '재원', grade: '중2' }));
            const memberships = students.map((s, i) => ({ class_id: i < 4 ? 'c1' : 'c2', student_id: s.id }));
            const sessions = students.map((s, i) => ({ id: 'e' + i, student_id: s.id, class_id: i < 4 ? 'c1' : 'c2',
                exam_date: i < 4 ? '2026-09-28' : '2026-09-10', exam_title: '왕운중 중간', archive_file: fileA, question_count: 25 }));
            const wrongs = sessions.flatMap((s, i) => [
                ...(i === 0 || i >= 4 && i <= 9 ? [{ id: 'wa' + i, session_id: s.id, question_id: 1 }] : []),
                ...(i === 0 || i === 4 ? [{ id: 'wb' + i, session_id: s.id, question_id: 2 }] : [])
            ]);
            students.slice(4).forEach((s, i) => {
                const id = 'foreign-' + i;
                sessions.push({ id, student_id: s.id, class_id: 'c2', exam_date: '2026-09-15', exam_title: '다른 선생님 시험', archive_file: fileB, question_count: 25 });
                if (i < 5) wrongs.push({ id: 'wc' + i, session_id: id, question_id: 3 });
                if (i < 2) wrongs.push({ id: 'wd' + i, session_id: id, question_id: 4 });
            });
            const assignments = [{ id: 'a1', class_id: 'c1', exam_date: '2026-09-28', exam_title: '왕운중 중간', archive_file: fileA, question_count: 25 },
                { id: 'a2', class_id: 'c2', exam_date: '2026-09-15', exam_title: '다른 선생님 시험', archive_file: fileB, question_count: 25 }];
            window.cohort = { success: true, classes, students, class_students: memberships, sessions, wrong_answers: wrongs, assignments, blueprints: [], exclusions: [] };
            window.state = { db: { classes: [classes[0]], students: students.slice(0, 4), class_students: memberships.slice(0, 4),
                exam_sessions: sessions.filter(s => s.class_id === 'c1'), wrong_answers: wrongs.filter(w => ['e0', 'e1', 'e2', 'e3'].includes(w.session_id)), class_exam_assignments: [assignments[0]] } };
            window.api = { get: async route => route.startsWith('exam-sessions/by-grade') ? window.cohort : { assignments: [assignments[0]], exclusions: [] } };
            window.showModal = (title, markup) => { document.body.innerHTML = '<main id="modal-body">' + markup + '</main>'; };
            window.toast = () => {};
        });
        await page.addScriptTag({ path: path.join(root, 'apmath/js/clinic-print.js') });
        await page.evaluate(() => openClinicPrintCenter('c1'));
        await page.locator('.clinic-print-mode-card[data-mode="grade"]').click();
        await page.waitForFunction(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload?.mode === 'grade');
        const gradePayload = await page.evaluate(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload);
        assert.equal(gradePayload.gradeWrongItems.length, 4, 'grade common wrongs must include both type categories');
        assert.deepEqual(gradePayload.gradeWrongItems.map(item => item.questionNo).sort(), [1, 2, 3, 4]);
        assert.deepEqual(gradePayload.gradeWrongItems.map(item => item.wrongCount).sort((a, b) => b - a), [7, 5, 2, 2]);
        assert.deepEqual({ from: gradePayload.range.from, to: gradePayload.range.to }, { from: '2026-08-29', to: '2026-09-29' });
        assert.equal(await page.locator('input[name="clinic-print-exam"]:checked').count(), 2);
        assert.equal(await page.locator('input[name="clinic-print-student"]').count(), 12);
        assert.match(await page.locator('#clinic-print-summary').innerText(), /학년 전체 학생 12명/);
        await page.screenshot({ path: path.join(output, 'grade-common-wrongs.png'), fullPage: true });
        await page.locator('.clinic-print-mode-card[data-mode="type"]').click();
        await page.locator('[data-scope="grade"]').click();
        await page.locator('[data-type-mode="mostWrong"]').click();
        await page.waitForFunction(() => document.querySelectorAll('#clinic-print-type-result .clinic-print-preview-row').length === 2);
        assert.equal(await page.locator('input[name="clinic-print-exam"]:checked').count(), 2);
        assert.equal(await page.locator('input[name="clinic-print-student"]').count(), 12);
        assert.match(await page.locator('#clinic-print-grade-window').innerText(), /2026-08-29 ~ 2026-09-29/);
        assert.deepEqual(await page.locator('#clinic-print-type-result .clinic-print-preview-row__wrong').allTextContents(), ['오답 7명', '오답 5명']);
        assert.deepEqual(await page.locator('#clinic-print-type-result .clinic-print-preview-row__rate').allTextContents(), ['정답률 42%', '정답률 38%']);
        await page.waitForFunction(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload?.typeMode === 'mostWrong');
        const mostWrongPayload = await page.evaluate(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload);
        assert.equal(await page.locator('[data-type-mode="mostWrong"]').evaluate(el => el.classList.contains('clinic-print-type-card--active')), true);
        await page.screenshot({ path: path.join(output, 'grade-most-wrong.png'), fullPage: true });
        await page.locator('#clinic-print-type-result').screenshot({ path: path.join(output, 'grade-most-wrong-results.png') });
        await page.locator('[data-type-mode="frequent"]').click();
        assert.deepEqual(await page.locator('#clinic-print-type-result .clinic-print-preview-row__wrong').allTextContents(), ['오답 2명', '오답 2명']);
        assert.deepEqual(await page.locator('#clinic-print-type-result .clinic-print-preview-row__rate').allTextContents(), ['정답률 83%', '정답률 75%']);
        await page.waitForFunction(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload?.typeMode === 'frequent');
        const frequentPayload = await page.evaluate(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload);
        assert.deepEqual(Array.from(new Set([...mostWrongPayload.typeItems, ...frequentPayload.typeItems].map(item => item.itemKey))).sort(),
            gradePayload.gradeWrongItems.map(item => item.itemKey).sort(), 'the two type categories must partition the common grade wrongs');
        await page.locator('#clinic-print-type-result').screenshot({ path: path.join(output, 'grade-frequent-results.png') });
        await page.locator('input[name="clinic-print-student"]').evaluateAll(inputs => inputs.forEach(input => { input.checked = input.value === 's0'; }));
        const payload = await page.evaluate(() => clinicPrintBuildTypePayload('c1'));
        assert.equal(payload.typeItems.length, 2);
        assert.deepEqual({ from: payload.range.from, to: payload.range.to }, { from: '2026-08-29', to: '2026-09-29' });
        assert.equal(payload.typeItems[0].wrongCount, 2);
        assert.deepEqual(await page.evaluate(() => clinicPrintBuildWrongClinicTargets('c1', clinicPrintBuildTypePayload('c1'), ['s0']).map(s => s.student_id)), ['s0']);
        await page.evaluate(async () => { window.api.get = async () => ({ error: 'Internal server error' }); await clinicPrintRetryGradeData('c1'); });
        assert.match(await page.locator('#clinic-print-summary').innerText(), /학년 전체 기록을 불러오지 못했습니다/);
        assert.equal(await page.locator('input[name="clinic-print-student"]').count(), 0);
        assert.equal(await page.locator('#clinic-print-type-result .clinic-print-preview-row').count(), 0);
        await page.waitForFunction(() => document.getElementById('clinic-print-preview-frame').contentWindow.payload?.typeItems?.length === 0);
        await page.screenshot({ path: path.join(output, 'grade-load-error.png'), fullPage: true });
        await page.evaluate(() => { window.api.get = async () => window.cohort; });
        await page.getByRole('button', { name: '다시 불러오기' }).click();
        await page.waitForFunction(() => document.querySelectorAll('#clinic-print-type-result .clinic-print-preview-row').length === 2);
        assert.equal(await page.locator('input[name="clinic-print-student"]').count(), 12);
        assert.deepEqual(errors, []);
        const result = { ok: true, checks: ['grade common wrongs include all four questions across both rate categories', 'cross-teacher different dates', 'other-teacher-only paper selected', '12-student cohort',
            'most-wrong counts 7/5 and rates 42/38', 'frequent rates 83/75', 'recipient selection preserves cohort', 'failed lookup blocks results', 'retry restores results'], pageErrors: errors };
        fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(result, null, 2));
        console.log(JSON.stringify(result));
    } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
