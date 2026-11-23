'use strict';

// "그림이 이상해요" 신고 Worker(helpers/figure-reports.js): 검증·하루 상한·중복·권한·학생 정보 미저장·테이블 없음.
// 실제 핸들러 코드를 node:sqlite(D1 흉내)로 돌린다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath', 'worker-backup', 'worker');
const read = file => fs.readFileSync(path.join(workerDir, file), 'utf8');
const schema = read('schema.sql');
const migration = read('migrations/20261124_figure_reports.sql');
const toUrl = file => String(new URL(`file:///${file.replace(/\\/g, '/')}`));

function createD1(db) {
  return {
    prepare(sql) {
      return {
        bindings: [],
        bind(...args) { this.bindings = args.map(value => (value === undefined ? null : value)); return this; },
        async all() { return { results: db.prepare(sql).all(...this.bindings).map(row => ({ ...row })) }; },
        async first() { const row = db.prepare(sql).get(...this.bindings); return row ? { ...row } : null; },
        async run() { const result = db.prepare(sql).run(...this.bindings); return { success: true, meta: { changes: Number(result.changes) } }; },
      };
    },
  };
}

function statements(sql) {
  return sql.split('\n').filter(line => !line.trim().startsWith('--')).join('\n')
    .split(';').map(part => part.replace(/\s+/g, ' ').trim()).filter(Boolean);
}
const normalize = sql => sql.replace(/\s*([(),])\s*/g, '$1');

let mod;
async function load() {
  if (!mod) mod = await import(toUrl(path.join(workerDir, 'helpers', 'figure-reports.js')));
  return mod;
}

function newEnv({ withTable = true, extraEnv = {} } = {}) {
  const db = new DatabaseSync(':memory:');
  if (withTable) for (const sql of statements(migration)) db.exec(sql);
  return { db, env: { DB: createD1(db), D1_BACKUP_API_TOKEN: SECRET, ...extraEnv } };
}

const SECRET = 'test-secret-A';
const U = n => `qid_v1_${Number(n).toString(16).padStart(64, '0')}`;
const NOW = new Date('2026-11-24T05:03:40.000Z');
const NEXT_DAY = new Date('2026-11-25T05:03:40.000Z');
const good = (extra = {}) => ({
  question_uid: U(100), archive_file: 'exams/original/high/h1/2mid/a.js', question_no: 3,
  figure_path: 'assets/images/a/q3.svg', role: 'problem', reason_code: 'missing_parts', screen: 'exam', width_bucket: 'xs', ...extra,
});
// 학생 확인은 student-portal.js의 verifyStudentPortalSession이 한다. 여기서는 같은 모양의 결과를 돌려주는 대역을 쓴다.
const verifyStudent = async (env, id, token) => (id && token === `tok-${id}`
  ? { student: { id } }
  : { error: new Response(JSON.stringify({ success: false }), { status: 401 }) });
const body = (student, extra = {}) => ({ student_id: student, student_token: `tok-${student}`, ...good(), ...extra });
async function post(env, payload, now = NOW) {
  const { handleFigureReportPost } = await load();
  const request = new Request('http://local/api/student-portal/figure-report', { method: 'POST', body: typeof payload === 'string' ? payload : JSON.stringify(payload) });
  const response = await handleFigureReportPost(request, env, { verifyStudent, now });
  const text = await response.text();
  return { status: response.status, json: JSON.parse(text) };
}
async function get(env, teacher, query = '') {
  const { handleFigureReportsGet } = await load();
  const url = new URL(`http://local/api/student-portal/figure-reports${query}`);
  const response = await handleFigureReportsGet(new Request(url), env, teacher, url);
  return { status: response.status, type: response.headers.get('Content-Type'), text: await response.text() };
}
const rows = db => db.prepare('SELECT * FROM figure_reports ORDER BY id').all().map(row => ({ ...row }));

test('마이그레이션과 schema.sql은 같은 표를 정의하고, 핸들러에는 요청 중 스키마 생성이 없다', async () => {
  const pick = sql => normalize(statements(sql).find(item => /^CREATE TABLE IF NOT EXISTS figure_reports/i.test(item)));
  assert.equal(pick(migration), pick(schema));
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS idx_figure_reports_once/);
  assert.ok(!/DROP |DELETE FROM|UPDATE |ALTER TABLE/i.test(statements(migration).join(';')), '추가 전용');
  const source = read('helpers/figure-reports.js').split('\n').map(line => line.replace(/\s\/\/ .*$/, '')).filter(line => !line.trim().startsWith('//')).join('\n');
  assert.ok(!/CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX)/i.test(source), 'helpers/figure-reports.js에 DDL이 없다');
  assert.ok(!/(?:name|student_id|student_name|ip|device|comment|memo|free_text)\s+TEXT/i.test(statements(migration).join(' ')), '학생 식별·자유 글 열이 없다');
  const portal = read('routes/student-portal.js');
  assert.match(portal, /id === 'figure-report'/);
  assert.match(portal, /id === 'figure-reports'/);
});

test('검증: 허용 목록 밖의 값·나쁜 그림 경로·긴 값을 거절하고, 모르는 필드는 버린다', async () => {
  const { normalizeFigureReport } = await load();
  const ok = normalizeFigureReport({ ...good(), student_name: '홍길동', note: '자유 글' });
  assert.deepEqual(Object.keys(ok.report).sort(), ['archiveFile', 'figurePath', 'questionNo', 'questionUid', 'reasonCode', 'role', 'screen', 'widthBucket']);
  assert.ok(!JSON.stringify(ok).includes('홍길동') && !JSON.stringify(ok).includes('자유 글'));
  assert.ok(normalizeFigureReport(good({ question_uid: '', question_no: 3 })).report, '파일+번호만으로도 된다');
  assert.ok(normalizeFigureReport(good({ figure_path: '' })).report, '인라인 svg는 경로가 없다');
  assert.ok(normalizeFigureReport(good({ figure_path: 'assets/images/25_금당고_2학기/q1 (2).png' })).report);
  for (const bad of [
    { role: 'x' }, { reason_code: 'free' }, { screen: 'portal' }, { width_bucket: 'huge' },
    { figure_path: 'https://evil.example/a.svg' }, { figure_path: '../secret.svg' }, { figure_path: 'assets/images/../x.svg' },
    { figure_path: 'assets/images/a/b.html' }, { figure_path: '/assets/images/a.svg' }, { figure_path: `assets/images/${'a'.repeat(300)}.svg` },
    { question_no: 1.5 }, { question_no: -1 }, { question_no: 5000 }, { question_no: '3' },
    { question_uid: '', archive_file: '', figure_path: '' }, { question_uid: 'free text', archive_file: '', figure_path: '' },
  ]) assert.ok(normalizeFigureReport(good(bad)).error, `거절: ${JSON.stringify(bad)}`);
  // 문항 식별 칸은 실제 형식이 아니면 그 칸만 비우고 신고는 받는다(학생이 글을 넣을 자리가 없다).
  for (const free of ['x'.repeat(201), '<script>', 'a\nb', '안녕하세요 이 그림 이상해요', 'qid_v1_' + 'z'.repeat(64), 'uid-100']) {
    assert.equal(normalizeFigureReport(good({ question_uid: free })).report.questionUid, '', `uid 비움: ${free.slice(0, 20)}`);
  }
  for (const free of ['a;b', '이 그림 이상해요', 'x'.repeat(200) + '.js', '../a.js', 'exams/a.png', 'http://evil.example/a.js']) {
    assert.equal(normalizeFigureReport(good({ archive_file: free })).report.archiveFile, '', `파일 비움: ${free.slice(0, 20)}`);
  }
  assert.equal(normalizeFigureReport(good({ question_uid: U(7) })).report.questionUid, U(7));
  assert.equal(normalizeFigureReport(good({ archive_file: 'exams/original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js' })).report.archiveFile, 'exams/original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js');
  assert.equal(normalizeFigureReport(good({ question_uid: 'free', archive_file: '', figure_path: 'assets/images/a/q3.svg' })).report.figurePath, 'assets/images/a/q3.svg', '그림 경로가 있으면 문항 칸이 비어도 받는다');
  assert.ok(normalizeFigureReport(null).error && normalizeFigureReport([]).error);
});

test('저장: 학생 id·이름·토큰·자유 글은 어디에도 남지 않고, 같은 그림·사유 중복은 무시된다', async () => {
  const { env, db } = newEnv();
  const first = await post(env, body('s-1', { student_name: '홍길동', comment: '이상함' }));
  assert.equal(first.status, 200);
  assert.deepEqual([first.json.ok, first.json.duplicate], [true, false]);
  const saved = rows(db);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].created_at, '2026-11-24T05:03Z', '분 단위 시각');
  assert.equal(saved[0].report_day, '2026-11-24');
  const dump = JSON.stringify(saved);
  for (const secret of ['s-1', 'tok-s-1', '홍길동', '이상함']) assert.ok(!dump.includes(secret), `저장 내용에 ${secret} 없음`);
  assert.match(saved[0].limit_key, /^[0-9a-f]{24}$/);
  const columns = db.prepare('PRAGMA table_info(figure_reports)').all().map(column => column.name);
  assert.deepEqual(columns, ['id', 'created_at', 'report_day', 'question_uid', 'archive_file', 'question_no', 'figure_path', 'role', 'reason_code', 'screen', 'width_bucket', 'limit_key']);

  const again = await post(env, body('s-1'));
  assert.equal(again.json.duplicate, true);
  assert.equal(rows(db).length, 1, '같은 학생·그림·사유는 무시');
  await post(env, body('s-1', { reason_code: 'not_visible' }));
  await post(env, body('s-2'));
  assert.equal(rows(db).length, 3, '다른 사유·다른 학생은 따로 쌓인다');
  const keys = new Set(rows(db).map(row => row.limit_key));
  assert.equal(keys.size, 2, '학생마다 키가 하나(같은 날)');
});

test('하루 상한 키: 서버 비밀값 HMAC. 토큰·PIN 대입으로는 재현되지 않고, 비밀값이 다르면 키가 다르다', async () => {
  const crypto = require('node:crypto');
  const { figureReportLimitKey, figureReportSecret } = await load();
  const key = await figureReportLimitKey(SECRET, 's-1', '2026-11-24');
  assert.equal(key, crypto.createHmac('sha256', SECRET).update('figure-report:s-1:2026-11-24').digest('hex').slice(0, 24));
  assert.notEqual(await figureReportLimitKey('test-secret-B', 's-1', '2026-11-24'), key, '같은 입력·다른 비밀값 -> 다른 키');
  assert.notEqual(await figureReportLimitKey(SECRET, 's-2', '2026-11-24'), key);
  // DB를 읽는 사람이 아는 값(학생 id, 로그인 토큰, PIN 0000~9999 대입)만으로는 같은 키를 만들 수 없다.
  const token = pin => crypto.createHash('sha256').update(`s-1:${pin}:student-portal:v1`).digest('hex');
  const reproducible = new Set();
  for (let pin = 0; pin < 10000; pin += 1) {
    const p = String(pin).padStart(4, '0');
    for (const material of [`${token(p)}:figure-report:2026-11-24`, `figure-report:s-1:2026-11-24:${p}`, `s-1:${p}:figure-report:2026-11-24`])
      reproducible.add(crypto.createHash('sha256').update(material).digest('hex').slice(0, 24));
  }
  assert.ok(!reproducible.has(key), '비밀값 없이 만든 어떤 해시와도 다르다');
  assert.equal(await figureReportLimitKey('', 's-1', '2026-11-24'), '', '비밀값이 없으면 키 없음');
  assert.equal(figureReportSecret({ D1_BACKUP_API_TOKEN: ' a ', REPORT_AI_PROXY_SECRET: 'b' }), 'a');
  assert.equal(figureReportSecret({ REPORT_AI_PROXY_SECRET: 'b' }), 'b');
  assert.equal(figureReportSecret({}), '');
  const { env, db } = newEnv();
  await post(env, body('s-1'));
  assert.equal(rows(db)[0].limit_key, key, '저장되는 키가 HMAC 값');
  assert.ok(!JSON.stringify(rows(db)).includes('s-1'));
});

test('서버 비밀값이 없으면 키를 비워 저장하고 학생별 상한·중복 무시는 건너뛰며, 전체 하루 상한은 지킨다', async () => {
  const { FIGURE_REPORT_DAILY_TOTAL } = await load();
  const { env, db } = newEnv({ extraEnv: { D1_BACKUP_API_TOKEN: '' } });
  for (let n = 0; n < 22; n += 1) assert.equal((await post(env, body('s-1', { question_uid: U(n + 1) }))).status, 200, '학생별 20건 상한 없음');
  assert.equal((await post(env, body('s-1', { question_uid: U(1) }))).json.duplicate, false, '중복 무시 없음');
  assert.ok(rows(db).length >= 23 && rows(db).every(row => row.limit_key === ''), '키 없이 저장');
  const full = newEnv({ extraEnv: { D1_BACKUP_API_TOKEN: '' } });
  const insert = full.db.prepare("INSERT INTO figure_reports (created_at, report_day, role, reason_code, screen, width_bucket, limit_key) VALUES ('2026-11-24T00:00Z','2026-11-24','problem','other','exam','xs','')");
  full.db.exec('BEGIN');
  for (let n = 0; n < FIGURE_REPORT_DAILY_TOTAL; n += 1) insert.run();
  full.db.exec('COMMIT');
  assert.equal((await post(full.env, body('s-1'))).status, 429, '전체 하루 상한은 유지');
  // REPORT_AI_PROXY_SECRET만 있어도 키가 생긴다.
  const other = newEnv({ extraEnv: { D1_BACKUP_API_TOKEN: '', REPORT_AI_PROXY_SECRET: 'proxy-secret' } });
  await post(other.env, body('s-1'));
  assert.match(rows(other.db)[0].limit_key, /^[0-9a-f]{24}$/);
});

test('하루 상한: 학생당 20건, 전체 2,000건. 날짜가 바뀌면 키가 달라 다시 보낼 수 있다', async () => {
  const { env, db } = newEnv();
  const { FIGURE_REPORT_DAILY_PER_STUDENT, FIGURE_REPORT_DAILY_TOTAL, figureReportLimitKey } = await load();
  assert.equal(FIGURE_REPORT_DAILY_PER_STUDENT, 20);
  assert.equal(FIGURE_REPORT_DAILY_TOTAL, 2000);
  for (let n = 1; n <= 20; n += 1) assert.equal((await post(env, body('s-1', { question_no: n, question_uid: U(n) }))).status, 200);
  const over = await post(env, body('s-1', { question_no: 21, question_uid: U(21) }));
  assert.equal(over.status, 429);
  assert.equal(over.json.code, 'DAILY_LIMIT');
  assert.equal(rows(db).length, 20);
  assert.equal((await post(env, body('s-1', { question_no: 5, question_uid: U(5) }))).status, 200, '이미 보낸 것은 상한에 걸리지 않고 중복으로 답한다');
  assert.equal((await post(env, body('s-2'))).status, 200, '다른 학생은 영향 없음');
  assert.equal((await post(env, body('s-1', { question_uid: U(999) }), NEXT_DAY)).status, 200, '다음 날은 다시 가능');
  assert.notEqual(await figureReportLimitKey(SECRET, 's-1', '2026-11-24'), await figureReportLimitKey(SECRET, 's-1', '2026-11-25'));

  const full = newEnv();
  const insert = full.db.prepare("INSERT INTO figure_reports (created_at, report_day, role, reason_code, screen, width_bucket, limit_key, question_uid) VALUES ('2026-11-24T00:00Z','2026-11-24','problem','other','exam','xs',?,?)");
  full.db.exec('BEGIN');
  for (let n = 0; n < FIGURE_REPORT_DAILY_TOTAL; n += 1) insert.run(`k${n}`, `u${n}`);
  full.db.exec('COMMIT');
  const blocked = await post(full.env, body('s-9'));
  assert.equal(blocked.status, 429);
  assert.equal(rows(full.db).length, FIGURE_REPORT_DAILY_TOTAL);
  assert.equal((await post(full.env, body('s-9'), NEXT_DAY)).status, 200, '전체 상한도 날짜별');
});

test('인증·본문 검증: 학생 확인 실패 401, 나쁜 본문·큰 본문 400, 아무것도 저장되지 않는다', async () => {
  const { env, db } = newEnv();
  assert.equal((await post(env, { ...body('s-1'), student_token: 'wrong' })).status, 401);
  assert.equal((await post(env, { ...good() })).status, 401, '학생 정보 없음');
  assert.equal((await post(env, 'not json')).status, 400);
  assert.equal((await post(env, '[1,2]')).status, 400);
  assert.equal((await post(env, body('s-1', { role: 'bad' }))).status, 400);
  assert.equal((await post(env, body('s-1', { question_uid: 'x'.repeat(5000) }))).status, 400, '본문이 4KB를 넘는다');
  assert.equal(rows(db).length, 0);
});

test('테이블이 아직 없으면 조용히 불가 응답을 하고 테이블을 만들지 않는다', async () => {
  const { env, db } = newEnv({ withTable: false });
  const result = await post(env, body('s-1'));
  assert.equal(result.status, 200);
  assert.equal(result.json.ok, false);
  assert.equal(result.json.code, 'FEATURE_UNAVAILABLE');
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM sqlite_master WHERE name = 'figure_reports'").get().n, 0, '요청 중 CREATE TABLE 없음');
  const read = await get(env, { id: 't1', role: 'teacher' });
  assert.equal(read.status, 200);
  assert.deepEqual(JSON.parse(read.text).rows, []);
});

test('집계 GET: 로그인한 교사·관리자만, 학생 식별 정보 없이 그림·문항·사유별 건수, 기간·사유 필터, TSV', async () => {
  const { env } = newEnv();
  await post(env, body('s-1'));
  await post(env, body('s-2'));
  await post(env, body('s-3', { reason_code: 'not_visible' }));
  await post(env, body('s-1', { question_uid: U(200), figure_path: 'assets/images/a/q9.svg', role: 'solution' }));
  await post(env, body('s-1', { question_uid: U(300), figure_path: '' }), NEXT_DAY);

  assert.equal((await get(env, null)).status, 401);
  assert.equal((await get(env, { id: 'p1', role: 'parent' })).status, 403);

  const all = JSON.parse((await get(env, { id: 't1', role: 'teacher' })).text);
  assert.equal(all.ok, true);
  const top = all.rows[0];
  assert.deepEqual([top.question_uid, top.figure_path, top.reason_code, top.reports, top.last_day], [U(100), 'assets/images/a/q3.svg', 'missing_parts', 2, '2026-11-24']);
  assert.equal(all.rows.length, 4);
  const dump = JSON.stringify(all);
  for (const secret of ['s-1', 's-2', 's-3', 'tok-', 'limit_key', 'student']) assert.ok(!dump.includes(secret), `응답에 ${secret} 없음`);

  const day2 = JSON.parse((await get(env, { id: 'a', role: 'admin' }, '?from=2026-11-25')).text);
  assert.deepEqual(day2.rows.map(row => row.question_uid), [U(300)]);
  const day1 = JSON.parse((await get(env, { id: 'a', role: 'admin' }, '?from=2026-11-24&to=2026-11-24&reason=not_visible')).text);
  assert.deepEqual(day1.rows.map(row => [row.question_uid, row.reports]), [[U(100), 1]]);
  assert.equal((await get(env, { id: 'a', role: 'admin' }, '?reason=nope')).status, 400);
  const limited = JSON.parse((await get(env, { id: 'a', role: 'admin' }, '?limit=1')).text);
  assert.equal(limited.rows.length, 1);

  const tsv = await get(env, { id: 't1', role: 'teacher' }, '?format=tsv');
  assert.match(tsv.type, /tab-separated-values/);
  const lines = tsv.text.trim().split('\n');
  assert.equal(lines[0], 'figure_path\tquestion_uid\tarchive_file\tquestion_no\trole\treason_code\treports\tfirst_day\tlast_day');
  assert.equal(lines.length, 5);
  assert.equal(lines[1].split('\t').length, 9);
});

test('TSV: 탭·줄바꿈과 수식으로 읽힐 첫 글자는 무력화한다', async () => {
  const { figureReportsToTsv } = await load();
  const out = figureReportsToTsv([{ figure_path: '=1+1', question_uid: 'a\tb\nc', archive_file: '@x', question_no: 1, role: 'problem', reason_code: 'other', reports: 1, first_day: '2026-11-24', last_day: '2026-11-24' }]);
  const cells = out.trim().split('\n')[1].split('\t');
  assert.equal(cells.length, 9);
  assert.equal(cells[0], "'=1+1");
  assert.equal(cells[1], 'a b c');
  assert.equal(cells[2], "'@x");
});
