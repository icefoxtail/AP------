const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { assertLoads, assertLoadedBefore } = require('./helpers/html-asset-refs.cjs');

// 단원별 기출 "이미 준 문항 빼고 뽑기": 선택 코어(givenUids), 조회·기억 모듈, Worker 조회(helpers/given-question-uids.js).
// 자료는 매일 늘어나므로 정확한 문항 수는 고정하지 않고 결함 조건(제외 켠 결과에 준 문항 0, 빈 자리 0, 조회 실패해도 뽑기 진행,
// 대상 없음 = 기존 결과와 같음)만 본다.
const root = path.resolve(__dirname, '..');
const archiveRoot = path.join(root, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const given = require(path.join(archiveRoot, 'archive2-given-questions.js'));

function loadIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  return context.window.questionIndex;
}
const uidFor = n => `qid_v1_${String(n).padStart(64, '0')}`;
// 원본 색인 문항에는 아직 questionUid가 없다(화면은 승인 메타를 합칠 때 붙인다). 시험용으로 문항마다 서로 다른 UID를 붙인다.
const catalog = core.buildCatalog(loadIndex(), { profileId: 'm1' });
let counter = 0;
const units = catalog.units.map(unit => ({ ...unit, selectableRecords: unit.selectableRecords.map(record => ({ ...record, questionUid: uidFor(++counter) })) }));
const cellsOf = (unitList, steps = [1, 2, 3, 4, 5, 'none']) => unitList.flatMap(unit => steps.map(step => ({ unitKey: unit.key, step })));
const rich = units.filter(unit => unit.selectableRecords.length >= 100).slice(0, 2);
assert.ok(rich.length >= 1, '시험에 쓸 단원이 있어야 한다');
const cells = cellsOf(rich);
const pick = (extra = {}) => core.buildSelectionPapers(cells, { units, ...extra });
const recordsOf = result => result.papers.flatMap(paper => paper.records);
const uidsOf = result => new Set(recordsOf(result).map(core.getQuestionUid));
const idOf = core.getRecordIdentity;

test('대상을 안 고르면(옵션 없음·빈 집합) 이전과 같은 결과다: 같은 문항·권 키·결과 모양', () => {
  const plain = pick({ perCell: 7 });
  const none = pick({ perCell: 7, givenUids: new Set() });
  const nullish = pick({ perCell: 7, givenUids: null });
  for (const other of [none, nullish]) {
    assert.deepEqual(other.papers.map(paper => [paper.snapshotKey, paper.title, paper.records.map(idOf)]), plain.papers.map(paper => [paper.snapshotKey, paper.title, paper.records.map(idOf)]));
    assert.equal(other.given, undefined, '제외를 안 쓰면 given 보고 자체가 없다');
    assert.ok(other.papers.every(paper => paper.givenCount === undefined));
  }
  const allPlain = pick();
  assert.deepEqual(pick({ givenUids: new Set() }).papers.map(paper => paper.snapshotKey), allPlain.papers.map(paper => paper.snapshotKey));
});

test('칸마다 N문항: 이미 준 문항을 켜면 결과에 준 문항이 0이고 문항 수·빈 자리는 그대로다(후보가 충분할 때)', () => {
  const first = pick({ perCell: 6 });
  const givenUids = uidsOf(first);
  assert.ok(first.total > 0);
  const second = pick({ perCell: 6, givenUids });
  assert.equal([...uidsOf(second)].filter(uid => givenUids.has(uid)).length, 0, '이미 준 문항 0');
  assert.equal(second.total, first.total, '빈 자리 0: 같은 수를 채운다');
  assert.equal(second.shortages.length, first.shortages.length, '새로 모자란 칸이 생기지 않는다');
  assert.equal(second.given.overlap, 0);
  assert.ok(second.given.excluded >= first.total, '후보 중 이미 준 문항 수를 보고한다');
  assert.ok(second.papers.every(paper => paper.givenCount === 0));
  // 두 번째 문제지를 또 준 뒤 세 번째도 앞선 둘과 겹치지 않는다.
  const third = pick({ perCell: 6, givenUids: new Set([...givenUids, ...uidsOf(second)]) });
  assert.equal([...uidsOf(third)].filter(uid => givenUids.has(uid) || uidsOf(second).has(uid)).length, 0);
  // 권 키는 문항이 다르면 달라진다(같은 날 같은 키로 출제하면 앞 출제를 덮어쓰므로 중요하다).
  assert.notEqual(second.papers[0].snapshotKey, first.papers[0].snapshotKey);
});

test('후보가 모자라면 빈 자리 대신 이미 준 문항으로 채우고 겹친 수를 보고한다', () => {
  const unit = rich[0];
  const oneCell = [{ unitKey: unit.key, step: 'none' }, ...[1, 2, 3, 4, 5].map(step => ({ unitKey: unit.key, step }))];
  const pool = unit.selectableRecords;
  // 단원 전체 문항을 이미 준 것으로 하고 칸마다 3문항을 달라고 한다 → 새 문항이 하나도 없다.
  const allGiven = new Set(pool.map(core.getQuestionUid));
  const plain = core.buildSelectionPapers(oneCell, { units, perCell: 3 });
  const filled = core.buildSelectionPapers(oneCell, { units, perCell: 3, givenUids: allGiven });
  assert.equal(filled.total, plain.total, '빈 자리 0');
  assert.equal(filled.shortages.length, plain.shortages.length);
  assert.equal(filled.given.overlap, filled.total, '전부 이미 준 문항으로 채웠다');
  assert.equal(filled.given.excluded, filled.given.candidates - filled.given.overlap);
  assert.equal(filled.papers.reduce((sum, paper) => sum + paper.givenCount, 0), filled.total);
  // 일부만 준 경우: 새 문항을 먼저 쓰고 모자란 만큼만 이미 준 문항이 든다.
  const step = [1, 2, 3, 4, 5, 'none'].find(token => pool.filter(record => core.getStepToken(record) === token).length >= 4);
  assert.ok(step !== undefined, '4문항 이상인 칸이 있어야 한다');
  const cellPool = pool.filter(record => core.getStepToken(record) === step);
  const want = cellPool.length - 1; // 새 문항은 1개만 남기고 나머지를 준 것으로 한다
  const keepNew = cellPool[0];
  const mostlyGiven = new Set(cellPool.filter(record => record !== keepNew).map(core.getQuestionUid));
  const cell = [{ unitKey: unit.key, step }];
  const partial = core.buildSelectionPapers(cell, { units, perCell: want, givenUids: mostlyGiven });
  assert.equal(partial.total, want, '요청한 수만큼 채운다');
  assert.ok(uidsOf(partial).has(core.getQuestionUid(keepNew)), '새 문항은 먼저 들어간다');
  assert.equal(partial.given.overlap, want - 1);
});

test('있는 만큼 전부: 이미 준 문항은 빠지고, 고른 범위가 전부 준 것이면 빈 문제지 대신 그대로 넣는다', () => {
  const plain = pick();
  const someGiven = new Set(recordsOf(plain).filter((record, index) => index % 3 === 0).map(core.getQuestionUid));
  const dropped = pick({ givenUids: someGiven });
  assert.equal(dropped.total, plain.total - someGiven.size);
  assert.equal([...uidsOf(dropped)].filter(uid => someGiven.has(uid)).length, 0);
  assert.equal(dropped.given.excluded, someGiven.size);
  const everything = new Set(recordsOf(plain).map(core.getQuestionUid));
  const fallback = pick({ givenUids: everything });
  assert.equal(fallback.total, plain.total, '빈 문제지가 아니다');
  assert.equal(fallback.given.allGiven, true);
  assert.equal(fallback.given.excluded, 0);
});

test('UID가 없는 문항은 빼지 않고 오류도 내지 않는다', () => {
  const bare = units.map(unit => ({ ...unit, selectableRecords: unit.selectableRecords.map(({ questionUid, ...record }) => record) }));
  const result = core.buildSelectionPapers(cells, { units: bare, perCell: 5, givenUids: new Set([uidFor(1)]) });
  const plain = core.buildSelectionPapers(cells, { units: bare, perCell: 5 });
  assert.equal(result.total, plain.total);
  assert.equal(result.given.excluded, 0);
});

// ---- 조회·기억 모듈 ----
const goodUid = uidFor(901);
test('fetchGiven: 성공하면 UID 집합과 건수를 돌려주고 잘못된 UID는 버린다', async () => {
  const calls = [];
  const request = async (route, options) => { calls.push([route, options.method]); return { success: true, question_uids: [goodUid, 'not-a-uid', uidFor(902)], assignment_count: 3, unresolved_assignment_count: 1, truncated: false }; };
  const student = await given.fetchGiven(request, { kind: 'student', studentId: 's 1' });
  assert.equal(student.ok, true);
  assert.deepEqual([...student.uids].sort(), [goodUid, uidFor(902)]);
  assert.equal(student.assignments, 3);
  assert.equal(student.unresolved, 1);
  assert.equal(calls[0][0], '/class-exam-assignments/given-questions?student_ids=s%201');
  assert.equal(calls[0][1], 'GET');
  await given.fetchGiven(request, { kind: 'class', classId: 'c1' }, { from: '2026-09-01' });
  assert.equal(calls[1][0], '/class-exam-assignments/given-questions?class_id=c1&from=2026-09-01');
});

test('fetchGiven: 로그인 만료·옛 서버(404)·시간 초과·네트워크 오류도 던지지 않고 실패로 돌려준다', async () => {
  const fail = error => given.fetchGiven(async () => { throw error; }, { kind: 'class', classId: 'c1' });
  for (const [error, reason] of [[Object.assign(new Error('x'), { status: 401 }), 'login'], [Object.assign(new Error('x'), { status: 403 }), 'forbidden'],
    [Object.assign(new Error('x'), { status: 404 }), 'unsupported'], [Object.assign(new Error('x'), { timeout: true }), 'timeout'], [new Error('network'), 'error']]) {
    const result = await fail(error);
    assert.equal(result.ok, false);
    assert.equal(result.reason, reason);
    assert.equal(result.uids.size, 0);
    assert.match(given.failureMessage(reason), /제외 없이 뽑았습니다/);
  }
  const noTarget = await given.fetchGiven(async () => { throw new Error('must not be called'); }, null);
  assert.equal(noTarget.ok, false);
});

test('조회가 실패하면 제외 없이 뽑기가 그대로 된다(실패 결과의 uids는 비어 있어 기존 결과와 같다)', async () => {
  const failed = await given.fetchGiven(async () => { throw Object.assign(new Error('x'), { status: 404 }); }, { kind: 'student', studentId: 's1' });
  const plain = pick({ perCell: 5 });
  const withFailed = pick({ perCell: 5, givenUids: failed.uids });
  assert.deepEqual(withFailed.papers.map(paper => paper.records.map(idOf)), plain.papers.map(paper => paper.records.map(idOf)));
});

test('이번 접속 기억: 대상마다 따로, 저장소가 막혀도 메모리로 동작, 잘못된 UID는 넣지 않는다', () => {
  const store = new Map();
  const storage = { getItem: key => (store.has(key) ? store.get(key) : null), setItem: (key, value) => store.set(key, value) };
  const memory = given.createSessionMemory(storage);
  assert.equal(memory.add('student:a', [goodUid, 'bad']), 1);
  assert.equal(memory.add('student:a', [goodUid]), 0, '이미 있는 것은 더하지 않는다');
  assert.equal(memory.get('student:b').size, 0);
  assert.deepEqual([...memory.get('student:a')], [goodUid]);
  // 새로고침(같은 저장소로 다시 만듦)해도 남는다.
  assert.deepEqual([...given.createSessionMemory(storage).get('student:a')], [goodUid]);
  memory.clear('student:a');
  assert.equal(memory.get('student:a').size, 0);
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const blocked = given.createSessionMemory(broken);
  assert.equal(blocked.add('class:x', [goodUid]), 1);
  assert.equal(blocked.get('class:x').size, 1);
  assert.equal(given.createSessionMemory(null).add('', [goodUid]), 0, '대상 키가 없으면 기억하지 않는다');
});

test('반 목록: 지금 보는 학년의 반이 앞에 오고 학년은 학년 칸이나 이름에서 읽는다', () => {
  const rows = [{ id: 'a', name: '고1 A반' }, { id: 'b', name: '중1 금요반' }, { id: 'c', name: '이름만', grade: '중2' }, { id: 'd', name: '중1 월요반' }, { name: 'no id' }];
  const options = given.classOptions(rows, '중1');
  assert.deepEqual(options.map(item => item.id), ['b', 'd', 'c', 'a'], '같은 학년(이름순) → 다른 학년(학년순)');
  assert.equal(given.classGradeOf({ name: '중3 수학' }), '중3');
});

// ---- Worker 조회(helpers/given-question-uids.js): 실제 SQLite(node:sqlite)에 D1과 같은 prepare/bind/all 모양을 씌워 검사한다 ----
function createD1() {
  const { DatabaseSync } = require('node:sqlite');
  const db = new DatabaseSync(':memory:');
  db.exec(`
    CREATE TABLE class_exam_assignments (id TEXT PRIMARY KEY, class_id TEXT, exam_title TEXT, exam_date TEXT, archive_file TEXT, mixed_payload_json TEXT, cancelled_at TEXT);
    CREATE TABLE class_exam_assignment_recipients (assignment_id TEXT, student_id TEXT, PRIMARY KEY (assignment_id, student_id));
    CREATE TABLE class_exam_assignment_exclusions (assignment_id TEXT, student_id TEXT, PRIMARY KEY (assignment_id, student_id));
    CREATE TABLE class_exam_assignment_questions (assignment_id TEXT, order_no INTEGER, question_uid TEXT, resolution_status TEXT);
  `);
  const prepare = sql => {
    let args = [];
    const statement = { bind(...values) { args = values; return statement; }, async all() { return { results: db.prepare(sql).all(...args).map(row => ({ ...row })) }; }, async first() { return db.prepare(sql).get(...args) || null; } };
    return statement;
  };
  return { db, env: { DB: { prepare } } };
}
function addAssignment(db, { id, classId = 'c1', date = '2026-11-01', uids = [], payload = true, cancelled = false, students = ['s1'], excluded = [], bridge = [] }) {
  const body = payload === 'broken' ? '{not json' : payload ? JSON.stringify({ questions: uids.map(uid => ({ questionUid: uid })), meta: {} }) : '';
  db.prepare('INSERT INTO class_exam_assignments (id, class_id, exam_title, exam_date, archive_file, mixed_payload_json, cancelled_at) VALUES (?,?,?,?,?,?,?)')
    .run(id, classId, id, date, `MIXED:${id}`, body, cancelled ? '2026-11-02' : null);
  for (const student of students) db.prepare('INSERT INTO class_exam_assignment_recipients VALUES (?,?)').run(id, student);
  for (const student of excluded) db.prepare('INSERT INTO class_exam_assignment_exclusions VALUES (?,?)').run(id, student);
  bridge.forEach((uid, index) => db.prepare('INSERT INTO class_exam_assignment_questions VALUES (?,?,?,?)').run(id, index + 1, uid, uid ? 'VERIFIED' : 'UNRESOLVED'));
}
test('Worker 조회: 학생 기준은 받는 사람으로 적힌 출제의 본문 UID와 확인된 UID를 합치고, 제외·취소·깨진 본문을 정확히 다룬다', async () => {
  const { loadGivenQuestionUids } = await import(require('node:url').pathToFileURL(path.join(root, 'apmath/worker-backup/worker/helpers/given-question-uids.js')).href);
  const { db, env } = createD1();
  addAssignment(db, { id: 'a1', uids: [uidFor(1), uidFor(2)], students: ['s1', 's2'] });
  addAssignment(db, { id: 'a2', uids: [uidFor(3)], students: ['s1'], excluded: ['s1'] }); // 이 학생은 출제에서 제외됨
  addAssignment(db, { id: 'a3', uids: [uidFor(4)], students: ['s1'], cancelled: true }); // 취소된 출제
  addAssignment(db, { id: 'a4', uids: [], payload: false, students: ['s1'], bridge: [uidFor(5)] }); // 본문 없이 확인된 UID만 있는 출제(저장본·원본)
  addAssignment(db, { id: 'a5', uids: [], payload: 'broken', students: ['s1'] }); // 깨진 본문: 오류 없이 문항을 알 수 없는 출제로 센다
  addAssignment(db, { id: 'a6', uids: [uidFor(6)], students: ['s2'] }); // 다른 학생
  addAssignment(db, { id: 'a7', uids: [uidFor(7)], students: ['s1'], date: '2026-08-01' });
  const s1 = await loadGivenQuestionUids(env, { studentIds: ['s1'] });
  assert.deepEqual(s1.question_uids, [uidFor(1), uidFor(2), uidFor(5), uidFor(7)]);
  assert.equal(s1.scope, 'students');
  assert.equal(s1.assignment_count, 4, '취소·제외된 출제는 세지 않는다');
  assert.equal(s1.unresolved_assignment_count, 1, '깨진 본문 출제');
  const s2 = await loadGivenQuestionUids(env, { studentIds: ['s2'] });
  assert.deepEqual(s2.question_uids, [uidFor(1), uidFor(2), uidFor(6)]);
  const both = await loadGivenQuestionUids(env, { studentIds: ['s1', 's2'] });
  assert.equal(both.question_uids.length, new Set(both.question_uids).size, '중복 UID 0');
  const recent = await loadGivenQuestionUids(env, { studentIds: ['s1'], from: '2026-10-01' });
  assert.ok(!recent.question_uids.includes(uidFor(7)), '기간 앞의 출제는 빠진다');
  const none = await loadGivenQuestionUids(env, { studentIds: ['nobody'] });
  assert.deepEqual(none.question_uids, []);
  assert.equal(none.assignment_count, 0);
  // 반 기준: 그 반의 취소되지 않은 출제 전부(학생별 제외와 관계없이).
  const classWide = await loadGivenQuestionUids(env, { classId: 'c1' });
  assert.equal(classWide.scope, 'class');
  assert.ok(classWide.question_uids.includes(uidFor(3)) && !classWide.question_uids.includes(uidFor(4)));
  assert.equal((await loadGivenQuestionUids(env, { classId: 'other' })).assignment_count, 0);
});

test('Worker 경로와 화면 연결: 읽기 전용 GET 경로, 권한 확인, 단원 페이지가 새 모듈을 먼저 읽는다', () => {
  const exams = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/routes/exams.js'), 'utf8');
  const start = exams.indexOf("id === 'given-questions'");
  assert.ok(start > 0);
  const block = exams.slice(start, exams.indexOf("id === 'board'", start));
  assert.match(block, /method === 'GET'/);
  assert.match(block, /requireTeacher/);
  assert.match(block, /canAccessClass/);
  assert.match(block, /requireStudentAccess/);
  assert.doesNotMatch(block, /INSERT|UPDATE|DELETE|CREATE TABLE/i, '조회는 아무것도 쓰지 않는다');
  const helper = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/helpers/given-question-uids.js'), 'utf8');
  assert.doesNotMatch(helper, /\b(INSERT|UPDATE|DELETE|CREATE TABLE|ALTER)\b/i);
  const html = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.html'), 'utf8');
  assertLoads(html, 'archive2-given-questions.js', 'html');
  assertLoadedBefore(html, 'archive2-given-questions.js', 'unit-past-exams.js', 'html');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.ok(manifest.archiveRootFiles.includes('archive2-given-questions.js'));
});
