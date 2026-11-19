const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const root = path.resolve(__dirname, '..');
const workerDir = path.join(root, 'apmath/worker-backup/worker');

function toFileUrl(filePath) {
  return String(new URL(`file:///${filePath.replace(/\\/g, '/')}`));
}

function createMockD1(db) {
  return {
    prepare(sql) {
      return {
        sql,
        bindings: [],
        bind(...values) {
          this.bindings = values.map(value => value === undefined ? null : value);
          return this;
        },
        async first() {
          const row = db.prepare(this.sql).get(...this.bindings);
          return row ? { ...row } : null;
        },
        async all() {
          return { results: db.prepare(this.sql).all(...this.bindings).map(row => ({ ...row })) };
        },
        async run() {
          const result = db.prepare(this.sql).run(...this.bindings);
          return { success: true, meta: { changes: Number(result.changes || 0) } };
        }
      };
    },
    async batch(statements) {
      db.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.run());
        db.exec('COMMIT');
        return results;
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    }
  };
}

function buildDb() {
  const db = new DatabaseSync(':memory:');
  db.exec(fs.readFileSync(path.join(workerDir, 'schema.sql'), 'utf8'));
  const mig = name => db.exec(fs.readFileSync(path.join(workerDir, 'migrations', name), 'utf8'));
  mig('20260518_timetable_versions_foundation.sql');
  mig('20260520_timetable_version_student_assignments.sql');
  mig('20260520_timetable_version_classes_foundation.sql');
  return db;
}

(async () => {
  const mod = await import(toFileUrl(path.join(workerDir, 'routes/timetable-versions.js')));
  const { computeRosterDiff, isWithdrawnStudentStatus, isUntouchedDraftAssignment } = mod;

  // ───────────── 순수 함수 ─────────────
  assert.strictEqual(isWithdrawnStudentStatus('퇴원'), true);
  assert.strictEqual(isWithdrawnStudentStatus('제적'), true);
  assert.strictEqual(isWithdrawnStudentStatus('재원'), false);
  assert.strictEqual(isWithdrawnStudentStatus('입학예정'), false);

  const note = text => JSON.stringify({ note: text });
  const vcs = [
    { id: 'vA', source_class_id: 'A', name_snapshot: 'A반', status: 'draft' },
    { id: 'vB', source_class_id: 'B', name_snapshot: 'B반', status: 'draft' },
    { id: 'vG', source_class_id: 'G', name_snapshot: '졸업반', status: 'excluded' },
    { id: 'vR', source_class_id: 'R', name_snapshot: '삭제반', status: 'removed' }
  ];
  const stu = (id, status = '재원') => ({ id, name: `학생${id}`, status, grade: '중1' });
  const mem = (class_id, student_id, class_name = class_id) => ({ class_id, student_id, class_name });
  const asg = (student_id, version_class_id, source_class_id, extra = {}) => ({
    student_id, version_class_id, source_class_id, class_id: source_class_id, excluded_reason: null, temp_student_id: null,
    memo: note('copied from active class_students'), ...extra
  });

  // 신입·퇴원·두 반 수강
  let d = computeRosterDiff({
    versionClasses: vcs,
    assignments: [asg('old', 'vA', 'A'), asg('gone', 'vA', 'A')],
    memberships: [mem('A', 'old'), mem('A', 'new1', 'A반'), mem('B', 'two', 'B반'), mem('A', 'two', 'A반'), mem('A', 'gone')],
    students: [stu('old'), stu('new1'), stu('two'), stu('gone', '퇴원')]
  });
  assert.deepStrictEqual(d.newcomers.map(n => n.student_id).sort(), ['new1', 'two']);
  assert.strictEqual(d.newcomers.find(n => n.student_id === 'new1').target_version_class_id, 'vA');
  assert.deepStrictEqual(d.withdrawn.map(w => w.student_id), ['gone']);
  assert.deepStrictEqual(d.multi_class.map(m => m.student_id), ['two']);
  assert.strictEqual(d.in_sync, false);

  // 졸업 반만 듣는 학생은 누락이 아니다 / 삭제한 반·원본 없는 반은 미배정 신입
  d = computeRosterDiff({
    versionClasses: vcs,
    assignments: [],
    memberships: [mem('G', 'grad'), mem('R', 'inRemoved'), mem('ZZ', 'noDraftClass', '새 운영 반')],
    students: [stu('grad'), stu('inRemoved'), stu('noDraftClass')]
  });
  assert.deepStrictEqual(d.newcomers.map(n => n.student_id).sort(), ['inRemoved', 'noDraftClass']);
  assert.ok(d.newcomers.every(n => n.target_version_class_id === null), '대응하는 초안 반이 없으면 미배정');

  // 미배정으로 뺀 재원생은 "초안에 있는 학생"이므로 신입이 아니다(되돌리지 않음)
  d = computeRosterDiff({
    versionClasses: vcs,
    assignments: [asg('un', '__unassigned__', 'A', { excluded_reason: 'unassigned' })],
    memberships: [mem('A', 'un')],
    students: [stu('un')]
  });
  assert.strictEqual(d.newcomers.length, 0);
  assert.strictEqual(d.moves.length, 0);
  assert.strictEqual(d.in_sync, true);

  // 운영에서 반 이동: 손대지 않은 학생만 따라가고, 원장이 옮긴 학생은 그대로
  const untouched = asg('mv', 'vA', 'A');
  d = computeRosterDiff({ versionClasses: vcs, assignments: [untouched], memberships: [mem('B', 'mv', 'B반')], students: [stu('mv')] });
  assert.strictEqual(d.moves.length, 1);
  assert.strictEqual(d.moves[0].to_version_class_id, 'vB');
  assert.strictEqual(d.moves[0].ops_class_id, 'B');

  const touchedNote = asg('mv', 'vA', 'A', { memo: note('draft student reassigned') });
  d = computeRosterDiff({ versionClasses: vcs, assignments: [touchedNote], memberships: [mem('B', 'mv', 'B반')], students: [stu('mv')] });
  assert.strictEqual(d.moves.length, 0, '원장이 배정한 학생은 따라가지 않는다');

  const movedByDirector = asg('mv', 'vB', 'A'); // 메모는 그대로여도 원래 반(A)이 아닌 반에 있으면 손댄 것
  d = computeRosterDiff({ versionClasses: vcs, assignments: [movedByDirector], memberships: [mem('A', 'mv', 'A반')], students: [stu('mv')] });
  assert.strictEqual(d.moves.length, 0);
  assert.strictEqual(isUntouchedDraftAssignment(movedByDirector, new Map([['A', vcs[0]]])), false);
  assert.strictEqual(isUntouchedDraftAssignment(untouched, new Map([['A', vcs[0]]])), true);

  // 운영에서 아직 같은 반에도 남아 있으면 이동이 아니다
  d = computeRosterDiff({ versionClasses: vcs, assignments: [untouched], memberships: [mem('A', 'mv'), mem('B', 'mv')], students: [stu('mv')] });
  assert.strictEqual(d.moves.length, 0);

  // 퇴원 후 재등록한 학생은 신입과 같다(초안에서는 퇴원 sync로 지워졌으므로 행이 없다)
  d = computeRosterDiff({ versionClasses: vcs, assignments: [], memberships: [mem('A', 'back')], students: [stu('back', '재원')] });
  assert.strictEqual(d.newcomers.length, 1);

  // 운영에서 새로 연 활성 반: source가 맞는 개편안 반이 없을 때만. 삭제한(removed)·졸업(excluded) 반은 source 행이 남아 있어 해당 없음
  d = computeRosterDiff({
    versionClasses: vcs,
    assignments: [],
    memberships: [],
    students: [],
    opsClasses: [{ id: 'A', name: 'A반' }, { id: 'R', name: '삭제반' }, { id: 'G', name: '졸업반' }, { id: 'NEW', name: '새 반' }]
  });
  assert.deepStrictEqual(d.new_classes.map(c => c.ops_class_id), ['NEW']);
  assert.strictEqual(d.in_sync, false, '가져오지 않은 새 운영 반이 있으면 맞지 않는 상태');

  // ───────────── DB 흐름 ─────────────
  const db = buildDb();
  const env = { DB: createMockD1(db) };
  const admin = { id: 'admin-1', login_id: 'owner', role: 'admin' };
  async function call(method, parts, body = {}) {
    const request = { method };
    const response = await mod.handleTimetableVersions(request, env, admin, ['api', 'timetable-versions', ...parts], new URL(`https://worker.local/api/timetable-versions/${parts.join('/')}`), body);
    return { status: response.status, body: await response.json() };
  }
  const run = (sql, ...p) => db.prepare(sql).run(...p);
  const get = (sql, ...p) => db.prepare(sql).get(...p);
  const all = (sql, ...p) => db.prepare(sql).all(...p);

  run("INSERT INTO classes (id, name, grade, subject, teacher_name, is_active) VALUES ('c1','중1 A반','중1','수학','박',1), ('c2','중1 B반','중1','수학','박',1), ('c3','중3 졸업반','중3','수학','박',1), ('c4','중1 C반','중1','수학','박',1)");
  const addStudent = (id, name, status = '재원', grade = '중1') => run('INSERT INTO students (id, name, grade, status, student_pin) VALUES (?, ?, ?, ?, ?)', id, name, grade, status, `pin-${id}`);
  addStudent('s1', '가'); addStudent('s2', '나'); addStudent('s3', '다'); addStudent('s4', '라', '퇴원');
  addStudent('s5', '마', '재원', '중3'); addStudent('s6', '바'); addStudent('s9', '아');
  const join = (c, s) => run('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)', c, s);
  join('c1', 's1'); join('c1', 's2'); join('c2', 's3'); join('c1', 's4'); join('c3', 's5'); join('c1', 's6'); join('c2', 's6'); join('c1', 's9');

  // 운영 슬롯과, 예전 활성 버전에 복사돼 있던 낡은 슬롯
  run("INSERT INTO class_time_slots (id, class_id, day_of_week, start_time, end_time) VALUES ('cts1','c1','월','17:00','19:00'), ('cts2','c2','화','16:00','18:00'), ('cts3','c4','수','16:00','18:00')");
  run("INSERT INTO timetable_versions (id, school_year, title, status) VALUES ('ttv_active', 2026, '운영', 'active')");
  run("INSERT INTO timetable_version_slots (id, version_id, class_id, day_of_week, start_time, end_time) VALUES ('old1','ttv_active','c1','월','15:00','17:00')");

  const created = await call('POST', ['create-next-draft'], { school_year: 2030 });
  assert.strictEqual(created.status, 200, JSON.stringify(created.body));
  const vid = created.body.timetable_version.id;
  const vcOf = src => get('SELECT * FROM timetable_version_classes WHERE version_id = ? AND source_class_id = ?', vid, src);
  const assigned = () => Object.fromEntries(all("SELECT student_id, version_class_id FROM timetable_version_student_assignments WHERE version_id = ?", vid).map(r => [r.student_id, r.version_class_id]));

  // 퇴원생·졸업 반 학생은 새 초안에 없고, 슬롯은 운영 슬롯 기준
  let a = assigned();
  assert.ok(!('s4' in a), '퇴원생은 새 초안에 복사되지 않는다');
  assert.ok(!('s5' in a), '졸업 반 학생은 개편안에 없다(기존 동작)');
  assert.strictEqual(a.s1, vcOf('c1').id);
  const c1Slots = all('SELECT * FROM timetable_version_slots WHERE version_id = ? AND version_class_id = ?', vid, vcOf('c1').id);
  assert.deepStrictEqual(c1Slots.map(s => s.start_time), ['17:00'], '요일·시간은 현재 운영 class_time_slots 기준');

  let diff = await call('GET', [vid, 'roster-diff']);
  assert.strictEqual(diff.body.roster_diff.in_sync, true, JSON.stringify(diff.body));
  assert.deepStrictEqual(diff.body.roster_diff.multi_class.map(m => m.student_id), ['s6']);

  // 원장 작업: s1을 B반으로 옮김, s9를 미배정으로 뺌, 새 반 만들기
  await call('POST', [vid, 'students', 'assign'], { student_id: 's1', target_class_id: vcOf('c2').id });
  const un = await call('POST', [vid, 'students', 'unassign'], { student_id: 's9' });
  assert.strictEqual(un.status, 200, JSON.stringify(un.body));
  assert.deepStrictEqual(un.body.timetable_version_unassigned_students.map(r => r.student_id), ['s9']);
  assert.ok(!un.body.timetable_version_student_assignments.some(r => r.student_id === 's9'), '미배정은 렌더 목록에 섞이지 않는다');
  const made = await call('POST', [vid, 'classes', 'draft-create'], { name: '새 반', grade: '중2', teacher_name: '박', slots: [{ day_of_week: '금', start_time: '16:00', end_time: '18:00' }] });
  assert.strictEqual(made.status, 200, JSON.stringify(made.body));
  const newVcId = made.body.timetable_version_class.id;

  // 운영 변화: 신입 s7(c1), s10(개편안 만든 뒤 운영에서 새로 연 반 c5), s2 퇴원, s3 c2→c4 이동(손대지 않음), s1 c1→c4(원장이 옮긴 학생), s6 재원 유지
  addStudent('s7', '카'); addStudent('s10', '타');
  run("INSERT INTO classes (id, name, grade, is_active) VALUES ('c5','중1 신규반','중1',1)");
  join('c1', 's7'); join('c5', 's10');
  run("INSERT INTO class_time_slots (id, class_id, day_of_week, start_time, end_time) VALUES ('cts5','c5','금','16:00','18:00')");
  run("UPDATE students SET status = '퇴원' WHERE id = 's2'");
  run("DELETE FROM class_students WHERE class_id = 'c2' AND student_id = 's3'"); join('c4', 's3');
  run("DELETE FROM class_students WHERE class_id = 'c1' AND student_id = 's1'"); join('c4', 's1');

  // 적용은 명단이 다르면 거부(안전장치)
  const blocked = await call('POST', [vid, 'activate']);
  assert.strictEqual(blocked.status, 409, JSON.stringify(blocked.body));
  assert.strictEqual(blocked.body.error, 'roster_mismatch');
  assert.ok(blocked.body.roster_diff.newcomers.some(n => n.student_id === 's7'));
  assert.ok(blocked.body.roster_diff.withdrawn.some(w => w.student_id === 's2'));
  assert.deepStrictEqual(blocked.body.roster_diff.new_classes.map(c => c.ops_class_id), ['c5'], '가져오지 않은 새 운영 반이 있으면 적용 차단');
  assert.strictEqual(get("SELECT status FROM timetable_versions WHERE id = ?", vid).status, 'draft', '거부되면 초안은 그대로');
  assert.strictEqual(get("SELECT COUNT(*) AS n FROM classes WHERE promotion_version_id = ?", vid).n, 0, '거부되면 운영에 아무것도 쓰지 않는다');

  // 열 때마다 자동 갱신
  const opened = await call('GET', [vid]);
  assert.strictEqual(opened.status, 200);
  const sync = opened.body.roster_sync;
  assert.deepStrictEqual(sync.added.map(x => x.student_id).sort(), ['s10', 's7']);
  assert.strictEqual(sync.added.find(x => x.student_id === 's7').class_name, vcOf('c1').name_snapshot);
  assert.strictEqual(sync.added.find(x => x.student_id === 's10').unassigned, false, '새로 가져온 반의 학생은 미배정이 아니라 그 반으로');
  assert.strictEqual(sync.added.find(x => x.student_id === 's10').class_name, vcOf('c5').name_snapshot);
  assert.deepStrictEqual(sync.added_classes.map(c => c.name), [vcOf('c5').name_snapshot]);
  assert.strictEqual(vcOf('c5').status, 'draft');
  // 같은 응답의 반 목록에 방금 가져온 반이 들어 있어야 화면이 다시 열지 않고도 그 반을 그린다.
  assert.ok(opened.body.timetable_version_classes.some(c => c.source_class_id === 'c5'), '자동 갱신으로 가져온 반은 같은 응답의 반 목록에 있어야 한다');
  assert.ok(opened.body.timetable_classes.some(c => c.source_class_id === 'c5'));
  assert.deepStrictEqual(all('SELECT start_time FROM timetable_version_slots WHERE version_id = ? AND version_class_id = ?', vid, vcOf('c5').id).map(r => r.start_time), ['16:00'], '새 반의 슬롯도 현재 운영 슬롯에서 복사');
  assert.deepStrictEqual(sync.removed.map(x => x.student_id), ['s2']);
  assert.deepStrictEqual(sync.moved.map(x => x.student_id), ['s3']);
  a = assigned();
  assert.ok(!('s2' in a), '퇴원생은 초안에서 빠진다');
  assert.strictEqual(a.s7, vcOf('c1').id);
  assert.strictEqual(a.s3, vcOf('c4').id, '손대지 않은 학생은 운영의 새 반을 따라간다');
  assert.strictEqual(a.s1, vcOf('c2').id, '원장이 옮긴 학생은 그대로');
  assert.strictEqual(a.s9, '__unassigned__', '원장이 미배정으로 뺀 재원생은 그대로');
  assert.strictEqual(a.s10, vcOf('c5').id);

  // 멱등: 다시 열어도, 직접 sync해도 바뀌는 것이 없다
  const again = await call('GET', [vid]);
  assert.strictEqual(again.body.roster_sync.changed, 0);
  const postSync = await call('POST', [vid, 'roster-sync']);
  assert.strictEqual(postSync.status, 200);
  assert.strictEqual(postSync.body.roster_sync.changed, 0);
  assert.deepStrictEqual(assigned(), a);
  assert.deepStrictEqual(again.body.timetable_version_unassigned_students.map(r => r.student_id).sort(), ['s9']);

  // 반 수정
  const upd = await call('POST', [vid, 'classes', 'update'], { class_id: vcOf('c2').id, name: '중2 B반', grade: '중2', teacher_name: '김', subject: '수학', textbook: '쎈' });
  assert.strictEqual(upd.status, 200, JSON.stringify(upd.body));
  const updRow = vcOf('c2');
  assert.strictEqual(updRow.name_snapshot, '중2 B반');
  assert.strictEqual(updRow.next_grade, '중2');
  assert.strictEqual(updRow.teacher_name_snapshot, '김');
  assert.strictEqual(JSON.parse(updRow.memo).textbook, '쎈');
  assert.strictEqual((await call('POST', [vid, 'classes', 'update'], { class_id: vcOf('c2').id, name: '  ' })).status, 400);

  // 반 삭제: 새로 만든 반은 행·슬롯 삭제, 운영 반에서 온 반은 removed. 학생은 미배정으로
  const rmNew = await call('POST', [vid, 'classes', 'remove'], { class_id: newVcId });
  assert.strictEqual(rmNew.body.deleted, true);
  assert.strictEqual(get('SELECT COUNT(*) AS n FROM timetable_version_classes WHERE id = ?', newVcId).n, 0);
  assert.strictEqual(get('SELECT COUNT(*) AS n FROM timetable_version_slots WHERE version_class_id = ?', newVcId).n, 0);

  const rmC4 = await call('POST', [vid, 'classes', 'remove'], { class_id: vcOf('c4').id });
  assert.strictEqual(rmC4.status, 200, JSON.stringify(rmC4.body));
  assert.strictEqual(rmC4.body.deleted, false);
  assert.strictEqual(rmC4.body.unassigned_count, 1);
  assert.strictEqual(vcOf('c4').status, 'removed');
  assert.strictEqual(assigned().s3, '__unassigned__', '반 삭제 시 학생은 미배정으로');
  assert.deepStrictEqual(rmC4.body.timetable_version_removed_classes.map(r => r.source_class_id), ['c4']);
  const afterRemove = await call('GET', [vid]);
  assert.ok(!afterRemove.body.timetable_classes.some(c => c.source_class_id === 'c4'), '삭제한 반은 렌더 목록에 없다');
  assert.strictEqual(afterRemove.body.roster_sync.changed, 0, 'sync가 삭제한 반이나 미배정 학생을 되돌리지 않는다');
  assert.strictEqual(assigned().s3, '__unassigned__');
  assert.strictEqual((await call('POST', [vid, 'students', 'assign'], { student_id: 's3', target_class_id: vcOf('c4').id })).status, 404, '삭제한 반에는 배정할 수 없다');

  const restored = await call('POST', [vid, 'classes', 'restore'], { class_id: vcOf('c4').id });
  assert.strictEqual(restored.status, 200, JSON.stringify(restored.body));
  assert.strictEqual(vcOf('c4').status, 'draft');
  assert.strictEqual(assigned().s3, '__unassigned__', '복원해도 학생은 미배정에 남는다');

  // 미배정 학생을 반에 넣으면 정상 배정으로 돌아온다
  const back = await call('POST', [vid, 'students', 'assign'], { student_id: 's9', target_class_id: vcOf('c1').id });
  assert.strictEqual(back.status, 200, JSON.stringify(back.body));
  assert.strictEqual(assigned().s9, vcOf('c1').id);
  assert.strictEqual(get('SELECT excluded_reason FROM timetable_version_student_assignments WHERE version_id = ? AND student_id = ?', vid, 's9').excluded_reason, null);
  await call('POST', [vid, 'students', 'unassign'], { student_id: 's9' });

  // c4를 다시 삭제하고 적용: 삭제한 반의 운영 반도 비활성화되어야 한다
  await call('POST', [vid, 'classes', 'remove'], { class_id: vcOf('c4').id });
  const activated = await call('POST', [vid, 'activate']);
  assert.strictEqual(activated.status, 200, JSON.stringify(activated.body));
  assert.strictEqual(activated.body.removed_class_count, 1);
  assert.strictEqual(activated.body.unassigned_student_count, 2, 's3, s9');
  assert.strictEqual(get("SELECT status FROM timetable_versions WHERE id = ?", vid).status, 'active');
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c4'").is_active, 0, '삭제한 반의 원래 운영 반이 비활성화된다');
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c1'").is_active, 0);
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c3'").is_active, 1, '졸업(excluded) 반은 기존대로 운영에 그대로 둔다');
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c5'").is_active, 0, '가져온 새 운영 반은 적용되어 원래 운영 반은 닫힌다');
  assert.strictEqual(get("SELECT COUNT(*) AS n FROM class_students WHERE class_id = 'c4'").n, 0);
  const applied = all(`SELECT cs.student_id, c.name FROM class_students cs JOIN classes c ON c.id = cs.class_id WHERE c.promotion_version_id = ?`, vid);
  const appliedByStudent = Object.fromEntries(applied.map(r => [r.student_id, r.name]));
  assert.ok(appliedByStudent.s7, '신입 s7은 새 운영 반에 들어간다');
  assert.ok(appliedByStudent.s10, '운영에서 새로 연 반의 학생은 적용 후 새 운영 반에 있다');
  assert.ok(appliedByStudent.s1 && appliedByStudent.s6, '기존 재원생은 유지');
  for (const gone of ['s2', 's4', 's3', 's9']) assert.ok(!(gone in appliedByStudent), `${gone}는 어느 새 반에도 들어가지 않는다`);
  assert.strictEqual(get("SELECT COUNT(*) AS n FROM student_enrollments WHERE student_id = 's3' AND status = 'active'").n, 0, '미배정 학생의 운영 수강 기록은 종료된다');
  const appliedC2 = get("SELECT * FROM classes WHERE promotion_version_id = ? AND name = '중2 B반'", vid);
  assert.ok(appliedC2 && appliedC2.teacher_name === '김' && appliedC2.textbook === '쎈', '수정한 반 정보가 적용된다');

  // 새로 만들기: 낡은 초안을 버리고 현재 운영 명단으로 다시
  run("UPDATE timetable_versions SET status = 'archived' WHERE id = ?", vid);
  run("INSERT INTO timetable_versions (id, school_year, title, status, effective_from) VALUES ('ttv_d2', 2031, '개편 초안', 'draft', '2031-01-01')");
  const restarted = await call('POST', ['ttv_d2', 'restart']);
  assert.strictEqual(restarted.status, 200, JSON.stringify(restarted.body));
  const newId = restarted.body.timetable_version.id;
  assert.notStrictEqual(newId, 'ttv_d2');
  assert.strictEqual(get("SELECT status FROM timetable_versions WHERE id = 'ttv_d2'").status, 'cancelled');
  assert.strictEqual(restarted.body.timetable_version.school_year, 2031);
  assert.strictEqual(restarted.body.timetable_version.title, '개편 초안');
  assert.strictEqual(restarted.body.timetable_version.effective_from, '2031-01-01');
  const newAssigned = all('SELECT student_id FROM timetable_version_student_assignments WHERE version_id = ?', newId).map(r => r.student_id);
  assert.ok(!newAssigned.includes('s2') && !newAssigned.includes('s4'), '새 초안에 퇴원생이 없다');
  assert.strictEqual((await call('POST', [vid, 'restart'])).status, 400, '적용된 버전은 새로 만들 수 없다');

  // 새 운영 반 가져오기 2: 원장이 삭제한 반은 다시 안 들어오고, 손대지 않은 학생은 새 반을 따라간다
  const draft3 = newId;
  const assigned3 = () => Object.fromEntries(all('SELECT student_id, version_class_id FROM timetable_version_student_assignments WHERE version_id = ?', draft3).map(r => [r.student_id, r.version_class_id]));
  const mover = 's7';
  assert.ok(assigned3()[mover], 's7은 새 초안에 배정돼 있다');
  run("INSERT INTO classes (id, name, grade, is_active) VALUES ('c6','중1 D반','중1',1), ('c7','중1 E반','중1',1), ('c8','중1 닫힌반','중1',0)");
  run("INSERT INTO class_time_slots (id, class_id, day_of_week, start_time, end_time) VALUES ('cts6','c6','월','17:00','19:00'), ('cts7','c7','화','17:00','19:00')");
  addStudent('s11', '하'); addStudent('s12', '거');
  join('c6', 's11'); join('c7', 's12');
  run("DELETE FROM class_students WHERE student_id = ?", mover); join('c7', mover);
  const blocked3 = await call('POST', [draft3, 'activate']);
  assert.strictEqual(blocked3.status, 409, '새 운영 반을 아직 가져오지 않았으면 적용 차단');
  assert.deepStrictEqual(blocked3.body.roster_diff.new_classes.map(c => c.ops_class_id).sort(), ['c6', 'c7'], '운영에서 닫힌 반(c8)은 가져오지 않는다');
  const open3 = await call('GET', [draft3]);
  assert.deepStrictEqual(open3.body.roster_sync.added_classes.length, 2);
  const vc3 = src => get('SELECT * FROM timetable_version_classes WHERE version_id = ? AND source_class_id = ?', draft3, src);
  assert.ok(vc3('c6') && vc3('c7') && !vc3('c8'));
  assert.strictEqual(assigned3().s11, vc3('c6').id);
  assert.strictEqual(assigned3().s12, vc3('c7').id);
  assert.strictEqual(assigned3()[mover], vc3('c7').id, '손대지 않은 학생은 새로 가져온 반으로 따라간다');
  assert.strictEqual((await call('GET', [draft3])).body.roster_sync.changed, 0, '두 번째 sync는 변경 0');
  await call('POST', [draft3, 'classes', 'remove'], { class_id: vc3('c6').id });
  const reopen3 = await call('GET', [draft3]);
  assert.strictEqual(reopen3.body.roster_sync.changed, 0, '원장이 삭제한 반은 다시 가져오지 않는다');
  assert.strictEqual(all('SELECT id FROM timetable_version_classes WHERE version_id = ? AND source_class_id = ?', draft3, 'c6').length, 1);
  assert.strictEqual(vc3('c6').status, 'removed');
  assert.strictEqual(assigned3().s11, '__unassigned__');
  const activated3 = await call('POST', [draft3, 'activate']);
  assert.strictEqual(activated3.status, 200, JSON.stringify(activated3.body));
  const applied3 = Object.fromEntries(all('SELECT cs.student_id, c.name FROM class_students cs JOIN classes c ON c.id = cs.class_id WHERE c.promotion_version_id = ?', draft3).map(r => [r.student_id, r.name]));
  assert.ok(applied3.s12 && applied3[mover], '새 반의 학생은 적용 후 새 운영 반에 있다');
  assert.ok(!('s11' in applied3), '원장이 삭제한 반의 학생은 미배정');
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c7'").is_active, 0);
  assert.strictEqual(get("SELECT is_active FROM classes WHERE id = 'c6'").is_active, 0, '삭제한 반의 운영 반도 닫힌다');

  console.log('apmath-timetable-draft-roster: all assertions passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
