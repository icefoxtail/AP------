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
  for (const name of ['20260518_timetable_versions_foundation.sql', '20260520_timetable_version_student_assignments.sql', '20260520_timetable_version_classes_foundation.sql']) {
    db.exec(fs.readFileSync(path.join(workerDir, 'migrations', name), 'utf8'));
  }
  return db;
}

(async () => {
  const mod = await import(toFileUrl(path.join(workerDir, 'routes/timetable-versions.js')));
  const admin = { id: 'admin-1', login_id: 'owner', role: 'admin' };

  function harness() {
    const db = buildDb();
    const env = { DB: createMockD1(db) };
    const api = {
      env,
      run: (sql, ...p) => db.prepare(sql).run(...p),
      get: (sql, ...p) => db.prepare(sql).get(...p),
      all: (sql, ...p) => db.prepare(sql).all(...p),
      async call(method, parts, body = {}) {
        const response = await mod.handleTimetableVersions({ method }, env, admin, ['api', 'timetable-versions', ...parts], new URL(`https://worker.local/api/timetable-versions/${parts.join('/')}`), body);
        return { status: response.status, body: await response.json() };
      },
      student(id, name, status = '재원') { api.run('INSERT INTO students (id, name, grade, status, student_pin) VALUES (?, ?, ?, ?, ?)', id, name, '중1', status, `pin-${id}`); },
      join(c, s) { api.run('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)', c, s); }
    };
    return api;
  }

  // ───────────── 1. 세대가 이어져도 반 id가 길어지지 않고 충돌하지 않는다 ─────────────
  {
    const h = harness();
    h.run("INSERT INTO classes (id, name, grade, subject, teacher_name, is_active) VALUES ('cls_1700000000001','고1 A반','고1','수학','박',1), ('cls_1700000000002','고1 B반','고1','수학','박',1)");
    h.student('s1', '가'); h.student('s2', '나'); h.student('s3', '다');
    h.join('cls_1700000000001', 's1'); h.join('cls_1700000000001', 's3'); h.join('cls_1700000000002', 's2');
    h.run("INSERT INTO class_time_slots (id, class_id, day_of_week, start_time, end_time) VALUES ('t1','cls_1700000000001','월','17:00','19:00'), ('t2','cls_1700000000002','화','17:00','19:00')");
    h.run("INSERT INTO timetable_versions (id, school_year, title, status) VALUES ('ttv_active', 2026, '운영', 'active')");

    let maxVc = 0;
    let maxApplied = 0;
    for (let gen = 1; gen <= 4; gen += 1) {
      const created = await h.call('POST', ['create-next-draft'], { school_year: 2026 + gen });
      assert.strictEqual(created.status, 200, `gen ${gen} create: ${JSON.stringify(created.body)}`);
      const vid = created.body.timetable_version.id;
      const vcs = h.all('SELECT id, source_class_id FROM timetable_version_classes WHERE version_id = ?', vid);
      const opsActive = h.all('SELECT id FROM classes WHERE is_active = 1');
      assert.strictEqual(vcs.length, opsActive.length, `gen ${gen}: 초안 반 수 = 운영 활성 반 수`);
      assert.strictEqual(new Set(vcs.map(v => v.id)).size, vcs.length, `gen ${gen}: 개편안 반 id가 서로 다르다`);
      if (gen === 1) {
        // 이미 저장된 기존 초안과 같은 값(짧은 id는 예전 규칙 그대로)
        assert.deepStrictEqual(vcs.map(v => v.id).sort(), [`tvc_${vid}_cls_1700000000001`, `tvc_${vid}_cls_1700000000002`]);
      }
      const slotCount = h.get('SELECT COUNT(*) AS n FROM timetable_version_slots WHERE version_id = ?', vid).n;
      assert.strictEqual(slotCount, 2, `gen ${gen}: 슬롯이 반마다 하나씩 복사`);
      assert.strictEqual(h.get('SELECT COUNT(*) AS n FROM timetable_version_student_assignments WHERE version_id = ?', vid).n, 3, `gen ${gen}: 학생 3명`);
      const open = await h.call('GET', [vid]);
      assert.strictEqual(open.body.roster_sync.changed, 0, `gen ${gen}: 만든 직후에는 명단이 맞아 있다(새 반 가져오기가 충돌로 무시되지 않는다)`);
      const activated = await h.call('POST', [vid, 'activate']);
      assert.strictEqual(activated.status, 200, `gen ${gen} activate: ${JSON.stringify(activated.body)}`);
      const after = h.all('SELECT id FROM classes WHERE is_active = 1');
      assert.strictEqual(after.length, vcs.length, `gen ${gen}: 적용 뒤 운영 활성 반 수`);
      assert.strictEqual(h.all('SELECT class_id FROM class_students WHERE class_id IN (SELECT id FROM classes WHERE is_active = 1)').length, 3, `gen ${gen}: 적용 뒤 학생 3명 모두 반에 있다`);
      for (const v of vcs) maxVc = Math.max(maxVc, v.id.length);
      for (const c of after) maxApplied = Math.max(maxApplied, c.id.length);
    }
    assert.ok(maxVc <= 165, `개편안 반 id 길이 상한 (${maxVc})`);
    assert.ok(maxApplied <= 120, `운영 반 id 길이 상한 (${maxApplied})`);
  }

  // ───────────── 2. 운영에서 닫힌 반은 개편안에서 removed ─────────────
  {
    const h = harness();
    h.run("INSERT INTO classes (id, name, grade, subject, teacher_name, is_active) VALUES ('c1','중1 A반','중1','수학','박',1), ('c2','중1 B반','중1','수학','박',1), ('c3','중1 C반','중1','수학','박',1)");
    for (const [id, name] of [['s1', '가'], ['s2', '나'], ['s4', '라'], ['s3', '다']]) h.student(id, name);
    h.join('c1', 's1'); h.join('c2', 's2'); h.join('c2', 's4'); h.join('c3', 's3');
    h.run("INSERT INTO timetable_versions (id, school_year, title, status) VALUES ('ttv_active', 2026, '운영', 'active')");
    const created = await h.call('POST', ['create-next-draft'], { school_year: 2031 });
    const vid = created.body.timetable_version.id;
    const vcOf = src => h.get('SELECT * FROM timetable_version_classes WHERE version_id = ? AND source_class_id = ?', vid, src);
    const assigned = () => Object.fromEntries(h.all('SELECT student_id, version_class_id FROM timetable_version_student_assignments WHERE version_id = ?', vid).map(r => [r.student_id, r.version_class_id]));

    // 운영에서 c2를 닫음: s2는 c1로 옮겼고(원장이 개편안에서 손대지 않음) s4는 반이 없다
    h.run("UPDATE classes SET is_active = 0 WHERE id = 'c2'");
    h.run("DELETE FROM class_students WHERE class_id = 'c2' AND student_id = 's2'"); h.join('c1', 's2');

    const blocked = await h.call('POST', [vid, 'activate']);
    assert.strictEqual(blocked.status, 409, '닫힌 반이 남아 있으면 적용 차단(되살아남 방지)');
    assert.deepStrictEqual(blocked.body.roster_diff.closed_classes.map(c => c.ops_class_id), ['c2']);

    const open = await h.call('GET', [vid]);
    assert.deepStrictEqual(open.body.roster_sync.closed_classes.map(c => c.name), [vcOf('c2').name_snapshot]);
    assert.strictEqual(vcOf('c2').status, 'removed');
    assert.strictEqual(assigned().s2, vcOf('c1').id, '손대지 않은 학생은 옮겨 간 반을 따라간다');
    assert.strictEqual(assigned().s4, '__unassigned__', '남은 학생은 미배정');
    assert.strictEqual((await h.call('GET', [vid])).body.roster_sync.changed, 0, '멱등');

    // 원장이 되살리면 다음 갱신이 다시 지우지 않는다
    const restored = await h.call('POST', [vid, 'classes', 'restore'], { class_id: vcOf('c2').id });
    assert.strictEqual(restored.status, 200);
    assert.strictEqual(vcOf('c2').status, 'draft');
    const again = await h.call('GET', [vid]);
    assert.strictEqual(again.body.roster_sync.changed, 0, '되살린 반을 sync가 다시 지우지 않는다');
    assert.strictEqual(vcOf('c2').status, 'draft');
    // 지운 채 적용하는 경우: 닫힌 반이 활성 반으로 되살아나지 않는다
    await h.call('POST', [vid, 'classes', 'remove'], { class_id: vcOf('c2').id });
    assert.strictEqual((await h.call('GET', [vid])).body.roster_sync.changed, 0);
    const activated = await h.call('POST', [vid, 'activate']);
    assert.strictEqual(activated.status, 200, JSON.stringify(activated.body));
    assert.strictEqual(h.get("SELECT is_active FROM classes WHERE id = 'c2'").is_active, 0);
    assert.strictEqual(h.get("SELECT COUNT(*) AS n FROM classes WHERE promotion_version_id = ? AND parent_class_id = 'c2'", vid).n, 0, '닫힌 반은 새 운영 반으로 만들어지지 않는다');
  }

  // ───────────── 3. 적용 예약 + 적용일 자동 반영 ─────────────
  {
    const h = harness();
    h.run("INSERT INTO classes (id, name, grade, subject, teacher_name, is_active) VALUES ('c1','중1 A반','중1','수학','박',1), ('c2','중1 B반','중1','수학','박',1)");
    h.student('s1', '가'); h.student('s2', '나');
    h.join('c1', 's1'); h.join('c2', 's2');
    h.run("INSERT INTO class_time_slots (id, class_id, day_of_week, start_time, end_time) VALUES ('t1','c1','월','17:00','19:00'), ('t2','c2','화','17:00','19:00')");
    h.run("INSERT INTO timetable_versions (id, school_year, title, status) VALUES ('ttv_active', 2026, '운영', 'active')");

    assert.strictEqual(mod.kstDateString(new Date('2031-01-09T14:59:59Z')), '2031-01-09');
    assert.strictEqual(mod.kstDateString(new Date('2031-01-09T15:00:00Z')), '2031-01-10', 'UTC 15:00 = KST 다음 날 0:00');
    assert.strictEqual(mod.kstDateString(new Date('2031-01-09T15:05:00Z')), '2031-01-10');

    const created = await h.call('POST', ['create-next-draft'], { school_year: 2031 });
    const vid = created.body.timetable_version.id;
    // 짜는 동안 신입이 생기고, 원장이 한 명을 미배정으로 뺌
    await h.call('POST', [vid, 'students', 'unassign'], { student_id: 's2' });
    h.student('n1', '신입생'); h.join('c1', 'n1');

    // draft는 날짜가 지나도 자동 적용하지 않는다
    const draftRun = await mod.runScheduledTimetableActivation(h.env, new Date('2031-02-01T15:05:00Z'));
    assert.strictEqual(draftRun.due_count, 0);
    assert.strictEqual(h.get('SELECT status FROM timetable_versions WHERE id = ?', vid).status, 'draft');

    // 예약: 적용일이 오늘 이전·없음이면 거절, 뒤면 scheduled
    assert.strictEqual((await h.call('PATCH', [vid], { status: 'scheduled', effective_from: '2020-01-01' })).status, 400);
    assert.strictEqual((await h.call('PATCH', [vid], { status: 'scheduled', effective_from: '' })).status, 400);
    const scheduled = await h.call('PATCH', [vid], { status: 'scheduled', effective_from: '2031-01-10' });
    assert.strictEqual(scheduled.status, 200, JSON.stringify(scheduled.body));
    assert.strictEqual(scheduled.body.timetable_version.status, 'scheduled');
    // 예약 뒤에도 배치 수정은 된다
    assert.strictEqual((await h.call('POST', [vid, 'students', 'assign'], { student_id: 's1', target_class_id: h.get('SELECT id FROM timetable_version_classes WHERE version_id = ? AND source_class_id = ?', vid, 'c2').id })).status, 200);
    // 예약 상태에서 적용일을 과거로 바꾸는 것은 거절(다음 cron이 몰래 적용하는 것을 막음)
    assert.strictEqual((await h.call('PATCH', [vid], { effective_from: '2020-01-01' })).status, 400);
    // 예약 취소는 draft로
    assert.strictEqual((await h.call('PATCH', [vid], { status: 'draft' })).body.timetable_version.status, 'draft');
    assert.strictEqual((await h.call('PATCH', [vid], { status: 'scheduled' })).body.timetable_version.status, 'scheduled');

    // 적용일 전(한국 시간 1월 9일 23:59)에는 적용 안 됨
    const before = await mod.runScheduledTimetableActivation(h.env, new Date('2031-01-09T14:59:59Z'));
    assert.strictEqual(before.due_count, 0);
    assert.strictEqual(h.get('SELECT status FROM timetable_versions WHERE id = ?', vid).status, 'scheduled');

    // UTC 15:05 = KST 1월 10일 0:05 → 그날 날짜로 판정되어 적용
    const run1 = await mod.runScheduledTimetableActivation(h.env, new Date('2031-01-09T15:05:00Z'));
    assert.strictEqual(run1.today, '2031-01-10');
    assert.strictEqual(run1.due_count, 1);
    assert.strictEqual(run1.results[0].success, true, JSON.stringify(run1));
    assert.strictEqual(h.get('SELECT status FROM timetable_versions WHERE id = ?', vid).status, 'active');
    const appliedOf = sid => h.get('SELECT c.name FROM class_students cs JOIN classes c ON c.id = cs.class_id WHERE c.promotion_version_id = ? AND cs.student_id = ?', vid, sid);
    assert.ok(appliedOf('n1'), '적용 전에 명단이 맞춰져 신입이 들어가 있다');
    assert.ok(appliedOf('s1'));
    assert.ok(!appliedOf('s2'), '미배정 학생은 반 없이 적용된다(적용은 진행)');

    // 로그: 성공, 반 수·학생 수, 미배정 이름, sync로 바뀐 것
    const logs = h.all("SELECT * FROM timetable_version_apply_logs WHERE status = 'auto_success'");
    assert.strictEqual(logs.length, 1);
    const summary = JSON.parse(logs[0].summary_json);
    assert.strictEqual(summary.source, 'scheduled');
    assert.strictEqual(summary.applied_on, '2031-01-10');
    assert.strictEqual(summary.class_count, 2);
    assert.strictEqual(summary.student_count, 2, 's1, n1');
    assert.deepStrictEqual(summary.unassigned_students, ['나']);
    assert.deepStrictEqual(summary.roster_sync.added.map(a => a.name), ['신입생']);

    const latest = await h.call('GET', ['auto-apply-latest']);
    assert.strictEqual(latest.body.auto_apply.status, 'auto_success');
    assert.strictEqual(latest.body.auto_apply.summary.unassigned_students[0], '나');
    assert.strictEqual(latest.body.auto_apply.version_id, vid);

    // 같은 날 cron이 또 돌거나 이미 적용된 경우 중복 적용 없음
    const classCount = h.get('SELECT COUNT(*) AS n FROM classes').n;
    const run2 = await mod.runScheduledTimetableActivation(h.env, new Date('2031-01-09T15:05:00Z'));
    assert.strictEqual(run2.due_count, 0);
    assert.strictEqual(h.get('SELECT COUNT(*) AS n FROM classes').n, classCount);
    assert.strictEqual(h.all("SELECT id FROM timetable_version_apply_logs WHERE status IN ('auto_success','auto_failed')").length, 1);

    // 실패: 반이 모두 삭제된 예약 개편안은 적용되지 않고 scheduled로 남으며 다음 날 다시 시도한다
    const second = await h.call('POST', ['create-next-draft'], { school_year: 2032 });
    const vid2 = second.body.timetable_version.id;
    const vcs2 = h.all("SELECT id FROM timetable_version_classes WHERE version_id = ? AND status != 'excluded'", vid2);
    for (const vc of vcs2) await h.call('POST', [vid2, 'classes', 'remove'], { class_id: vc.id });
    assert.strictEqual((await h.call('PATCH', [vid2], { status: 'scheduled', effective_from: '2032-01-01' })).status, 200);
    const failRun = await mod.runScheduledTimetableActivation(h.env, new Date('2031-12-31T15:05:00Z'));
    assert.strictEqual(failRun.results[0].success, false);
    assert.strictEqual(h.get('SELECT status FROM timetable_versions WHERE id = ?', vid2).status, 'scheduled', '실패하면 예약 상태로 남는다');
    assert.strictEqual(JSON.parse(h.get("SELECT summary_json FROM timetable_version_apply_logs WHERE status = 'auto_failed'").summary_json).error, 'version has no classes');
    assert.strictEqual((await h.call('GET', ['auto-apply-latest'])).body.auto_apply.status, 'auto_failed');
    await h.call('POST', [vid2, 'classes', 'restore'], { class_id: vcs2[0].id });
    const retry = await mod.runScheduledTimetableActivation(h.env, new Date('2032-01-01T15:05:00Z'));
    assert.strictEqual(retry.results[0].success, true, '원인을 고치면 다음 날 cron이 다시 시도해 적용한다');
  }

  // cron 진입점: 다른 예약 작업과 allSettled로 분리되어 있다
  const indexSource = fs.readFileSync(path.join(workerDir, 'index.js'), 'utf8');
  assert.ok(indexSource.includes('runScheduledTimetableActivation(env, scheduledAt)'), 'index.js scheduled가 적용 예약 작업을 호출해야 함');
  assert.ok(/Promise\.allSettled\(tasks\)/.test(indexSource), '예약 작업은 Promise.allSettled로 서로 분리');
  assert.ok(/cron === '5 15 \* \* \*'/.test(indexSource));

  console.log('apmath-timetable-draft-lifecycle: all assertions passed');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
