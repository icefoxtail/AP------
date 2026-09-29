const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const workerDir = path.resolve(__dirname, '../apmath/worker-backup/worker');
const requireWorker = createRequire(path.join(workerDir, 'package.json'));
const { Miniflare } = requireWorker('miniflare');
const { build } = requireWorker('esbuild');

test('Recent-month grade clinic: real Worker, D1, cross-teacher cohort and distribution', async t => {
    const bundle = await build({
        stdin: { resolveDir: workerDir, contents: `
            import { handleExams } from './routes/exams.js';
            import { handleWrongClinics } from './routes/wrong-clinics.js';
            export default { async fetch(request, env) {
                const url = new URL(request.url);
                const teacher = { id: 'teacher-a', role: request.headers.get('X-Test-Role') || 'teacher', name: '선생님 A' };
                const route = url.pathname.startsWith('/api/wrong-clinics') ? handleWrongClinics : handleExams;
                try { return await route(request, env, teacher, url.pathname.split('/').filter(Boolean), url); }
                catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
            } };` },
        bundle: true, write: false, format: 'esm', platform: 'browser', external: ['cloudflare:*', 'node:*']
    });
    const mf = new Miniflare({ modules: true, script: bundle.outputFiles[0].text,
        compatibilityDate: '2026-07-11', compatibilityFlags: ['nodejs_compat'], d1Databases: ['DB'] });
    try {
        const db = await mf.getD1Database('DB');
        await db.batch([
            'CREATE TABLE classes (id TEXT PRIMARY KEY, name TEXT, grade TEXT, teacher_name TEXT, is_active INTEGER)',
            'CREATE TABLE teacher_classes (teacher_id TEXT, class_id TEXT)',
            'CREATE TABLE class_students (class_id TEXT, student_id TEXT)',
            'CREATE TABLE students (id TEXT PRIMARY KEY, name TEXT, school_name TEXT, grade TEXT, status TEXT)',
            'CREATE TABLE exam_sessions (id TEXT PRIMARY KEY, class_id TEXT, student_id TEXT, exam_date TEXT, exam_title TEXT, archive_file TEXT, question_count INTEGER, created_at TEXT, updated_at TEXT)',
            'CREATE TABLE class_exam_assignments (id TEXT PRIMARY KEY, class_id TEXT, exam_date TEXT, exam_title TEXT, archive_file TEXT, question_count INTEGER, created_at TEXT, updated_at TEXT)',
            'CREATE TABLE wrong_answers (id TEXT PRIMARY KEY, session_id TEXT, student_id TEXT, question_id INTEGER)',
            'CREATE TABLE exam_blueprints (id TEXT PRIMARY KEY, archive_file TEXT, question_no INTEGER, source_archive_file TEXT, source_question_no INTEGER)',
            'CREATE TABLE class_exam_assignment_exclusions (assignment_id TEXT, student_id TEXT, reason TEXT)',
            "INSERT INTO classes VALUES ('c1','중2A','중2','선생님 A',1),('c2','중2B','중2','선생님 B',1),('c3','중3A','중3','선생님 C',1),('inactive','이전 중2반','중2','선생님 D',0)",
            "INSERT INTO teacher_classes VALUES ('teacher-a','c1')"
        ].map(sql => db.prepare(sql)));
        const studentStatements = [];
        for (let i = 0; i < 125; i++) {
            studentStatements.push(db.prepare('INSERT INTO students VALUES (?,?,?,?,?)').bind('s' + i, '테스트 학생 ' + i, '테스트중', '중2', '재원'));
            studentStatements.push(db.prepare('INSERT INTO class_students VALUES (?,?)').bind(i === 0 ? 'c1' : 'c2', 's' + i));
        }
        await db.batch(studentStatements);
        await db.prepare(`WITH RECURSIVE seq(i) AS (SELECT 0 UNION ALL SELECT i + 1 FROM seq WHERE i < 2100)
            INSERT INTO exam_sessions SELECT 'e' || i, CASE WHEN i % 125 = 0 THEN 'c1' ELSE 'c2' END,
                's' || (i % 125), CASE WHEN i % 2 = 0 THEN '2026-09-28' ELSE '2026-09-10' END,
                '시험 ' || i, 'MIXED:paper-' || (i % 105), 25, '2026-09-28', '2026-09-28' FROM seq`).run();
        await db.prepare(`INSERT INTO wrong_answers SELECT 'w-' || id, id, student_id, 1 FROM exam_sessions`).run();
        const papers = [];
        for (let i = 0; i < 105; i++) {
            papers.push(db.prepare('INSERT INTO class_exam_assignments VALUES (?,?,?,?,?,?,?,?)')
                .bind('a' + i, 'c2', '2026-09-10', '다른 반 시험 ' + i, 'MIXED:paper-' + i, 25, '2026-09-10', '2026-09-10'));
            papers.push(db.prepare('INSERT INTO exam_blueprints VALUES (?,?,?,?,?)')
                .bind('bp' + i, 'MIXED:paper-' + i, 1, 'MIXED:paper-' + i, 1));
            papers.push(db.prepare('INSERT INTO class_exam_assignment_exclusions VALUES (?,?,?)').bind('a' + i, 's1', '테스트 제외'));
        }
        await db.batch(papers);
        const boundaries = [
            ['start', 'c2', '2026-08-29'], ['old', 'c2', '2026-08-28'], ['future', 'c2', '2026-09-30'],
            ['other-grade', 'c3', '2026-09-28'], ['inactive', 'inactive', '2026-09-28']
        ];
        for (const [id, classId, date] of boundaries) {
            await db.prepare('INSERT INTO exam_sessions VALUES (?,?,?,?,?,?,?,?,?)')
                .bind(id, classId, 's1', date, id, 'MIXED:paper-0', 25, date, date).run();
            await db.prepare('INSERT INTO wrong_answers VALUES (?,?,?,?)').bind('w-' + id, id, 's1', 2).run();
        }
        const endpoint = 'http://local/api/exam-sessions/by-grade?class=c1&to=2026-09-29';
        let cohort;
        await t.test('All 2102 recent sessions and 125 students load despite ownership and the former 100/2000 limits', async () => {
            const response = await mf.dispatchFetch(endpoint);
            assert.equal(response.status, 200);
            cohort = await response.json();
            assert.equal(cohort.success, true);
            assert.equal(cohort.from, '2026-08-29');
            assert.equal(cohort.to, '2026-09-29');
            assert.deepEqual(cohort.classes.map(row => row.id).sort(), ['c1', 'c2']);
            assert.equal(cohort.students.length, 125);
            assert.equal(cohort.sessions.length, 2102);
            assert.equal(cohort.wrong_answers.length, 2102);
            assert.ok(cohort.sessions.some(row => row.id === 'start'));
            assert.ok(!cohort.sessions.some(row => ['old', 'future', 'other-grade', 'inactive'].includes(row.id)));
        });
        await t.test('105 papers, blueprints and assignment exclusions survive D1 parameter limits', () => {
            assert.equal(cohort.assignments.length, 105);
            assert.equal(cohort.blueprints.length, 105);
            assert.equal(cohort.exclusions.length, 105);
        });
        await t.test('Staff and source-class access remain required', async () => {
            assert.equal((await mf.dispatchFetch(endpoint, { headers: { 'X-Test-Role': 'student' } })).status, 403);
            assert.equal((await mf.dispatchFetch(endpoint.replace('class=c1', 'class=c2'))).status, 403);
            assert.equal((await mf.dispatchFetch(endpoint + '&from=2026-10-01')).status, 400);
        });
        await t.test('Previous month clips March 31 to February 28', async () => {
            const response = await mf.dispatchFetch(endpoint.replace('2026-09-29', '2026-03-31'));
            assert.equal(response.status, 200);
            const body = await response.json();
            assert.equal(body.from, '2026-02-28');
            assert.equal(body.sessions.length, 0);
        });
        await t.test('A teacher can save and distribute grade/type wrongs to 125 students across teachers', async () => {
            const response = await mf.dispatchFetch('http://local/api/wrong-clinics', { method: 'POST',
                headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    title: '학년 전체 최근 한 달 최다오답', mode: 'type',
                    source: { class_id: 'c1', grade: '중2', scope_type: 'grade' },
                    targets: cohort.students.map(student => ({ type: 'student', student_id: student.id,
                        class_id: student.id === 's0' ? 'c1' : 'c2' })),
                    payload: { mode: 'type', typeMode: 'mostWrong', scope: 'grade', gradeName: '중2', classId: 'c1',
                        typeItems: [{ archiveFile: 'MIXED:paper-0', questionNo: 1, wrongCount: 125, totalCount: 125, correctRate: 0 }],
                        options: {} }
                }) });
            const body = await response.json();
            assert.equal(response.status, 200, JSON.stringify(body));
            assert.equal(body.packet_count, 125);
            const stored = await mf.dispatchFetch('http://local/api/wrong-clinics/set/' + body.public_set_key);
            assert.equal(stored.status, 200);
            const print = await stored.json();
            assert.equal(print.payload.typeItems.length, 1);
            assert.equal(print.payload.recipients.length, 125);
        });
        await t.test('Grade common wrongs preserve both rate categories through save and print retrieval', async () => {
            const response = await mf.dispatchFetch('http://local/api/wrong-clinics', { method: 'POST',
                headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
                    title: '중2 학년별 공통 오답', mode: 'grade',
                    source: { class_id: 'c1', grade: '중2', scope_type: 'grade' },
                    targets: [{ type: 'student', student_id: 's1', class_id: 'c2' }],
                    payload: { mode: 'grade', gradeName: '중2', classId: 'c1', gradeWrongItems: [
                        { archiveFile: 'MIXED:paper-0', questionNo: 1, wrongCount: 2, totalCount: 10, correctRate: 80 },
                        { archiveFile: 'MIXED:paper-1', questionNo: 2, wrongCount: 8, totalCount: 10, correctRate: 20 }
                    ], options: {} }
                }) });
            const body = await response.json();
            assert.equal(response.status, 200, JSON.stringify(body));
            assert.equal(body.packet_count, 1);
            const stored = await mf.dispatchFetch('http://local/api/wrong-clinics/set/' + body.public_set_key);
            assert.equal(stored.status, 200);
            const print = await stored.json();
            assert.equal(print.payload.mode, 'grade');
            assert.equal(print.payload.gradeWrongItems.length, 2);
            assert.deepEqual(print.payload.gradeWrongItems.map(item => item.correctRate), [80, 20]);
            assert.equal(print.payload.recipients[0].studentId, 's1');
        });
    } finally { await mf.dispose(); }
});
