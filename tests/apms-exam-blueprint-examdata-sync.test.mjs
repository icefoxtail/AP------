import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import {
  extractArchiveQuestionsFromText,
  extractQuestionBankFromArchiveText,
  resolveArchiveQuestionNo
} from '../apmath/worker-backup/worker/helpers/archive-question-bank.js';
import { syncExamBlueprintsFromArchive } from '../apmath/worker-backup/worker/routes/exams.js';

const ARCHIVE_ROOT = path.resolve('archive');
const MIDDLE_ROOT = path.join(ARCHIVE_ROOT, 'exams/original/middle');

const FILES = {
  qUpperWithNumber: 'exams/original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js', // id "Q01" + number
  qLowerWithNumber: 'exams/original/middle/m3/2final/19_동산여중_2학기_기말_중3_수학.js', // id "q01"/"s01" + number
  noId: 'exams/original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js', // id 없음, number만
  numericId: 'exams/original/middle/m1/1mid/16_연향중_1학기_중간_중1_수학.js' // 숫자 id
};

function read(rel) { return fs.readFileSync(path.join(ARCHIVE_ROOT, rel), 'utf8'); }

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

const legacyNo = q => Number(String(q?.id ?? '').match(/\d+/)?.[0] || 0);

test('examData 변형 4가지를 모두 문항 배열로 꺼낸다', () => {
  for (const rel of Object.values(FILES)) {
    const { questions, format } = extractArchiveQuestionsFromText(read(rel));
    assert.equal(format, 'examData', rel);
    assert.ok(questions.length > 0, rel);
    assert.equal(extractQuestionBankFromArchiveText(read(rel)).length, questions.length, rel);
  }
});

test('questionNo: Q01+number, q01, id 없음, 숫자 id', () => {
  const upper = extractArchiveQuestionsFromText(read(FILES.qUpperWithNumber));
  assert.deepEqual(upper.questions.map((q, i) => resolveArchiveQuestionNo(q, i, upper.format)),
    upper.questions.map((_, i) => i + 1));

  const lower = extractArchiveQuestionsFromText(read(FILES.qLowerWithNumber));
  const lowerNos = lower.questions.map((q, i) => resolveArchiveQuestionNo(q, i, lower.format));
  assert.equal(lowerNos[0], 1);
  assert.equal(new Set(lowerNos).size, lowerNos.length, 's01 같은 id가 q01과 겹치지 않는다(number 우선)');

  const noId = extractArchiveQuestionsFromText(read(FILES.noId));
  assert.ok(noId.questions.every(q => q.id === undefined));
  assert.deepEqual(noId.questions.map((q, i) => resolveArchiveQuestionNo(q, i, noId.format)),
    noId.questions.map((_, i) => i + 1));

  const numeric = extractArchiveQuestionsFromText(read(FILES.numericId));
  assert.deepEqual(numeric.questions.map((q, i) => resolveArchiveQuestionNo(q, i, numeric.format)),
    numeric.questions.map(legacyNo));

  // 번호도 숫자 id도 없으면 순번+1
  assert.equal(resolveArchiveQuestionNo({ id: 'extra' }, 6, 'examData'), 7);
  assert.equal(resolveArchiveQuestionNo({}, 0, 'examData'), 1);
});

test('questionBank 형식은 결과 불변(id 첫 숫자, 없으면 0)', () => {
  const src = 'window.questionBank = [{id: 3}, {id: "s01", number: 22}, {id: "x"}];';
  const { questions, format } = extractArchiveQuestionsFromText(src);
  assert.equal(format, 'questionBank');
  assert.deepEqual(questions.map((q, i) => resolveArchiveQuestionNo(q, i, format)), [3, 1, 0]);
  const bare = extractArchiveQuestionsFromText('const questionBank = [{id: 1}];');
  assert.equal(bare.format, 'questionBank');
  assert.equal(extractArchiveQuestionsFromText('window.nothing = 1;').questions.length, 0);
  assert.equal(extractArchiveQuestionsFromText('this is not js').questions.length, 0);
});

test('middle 원본 전체: questionBank 추출 불변, examData 36개 번호 충돌·0 없음', () => {
  let examDataFiles = 0;
  for (const file of walk(MIDDLE_ROOT)) {
    const text = fs.readFileSync(file, 'utf8');
    const { questions, format } = extractArchiveQuestionsFromText(text);
    if (format === 'questionBank') {
      assert.deepEqual(questions.map((q, i) => resolveArchiveQuestionNo(q, i, format)), questions.map(legacyNo), file);
    } else if (format === 'examData') {
      examDataFiles++;
      const nos = questions.map((q, i) => resolveArchiveQuestionNo(q, i, format));
      assert.ok(nos.every(n => n > 0), file);
      assert.equal(new Set(nos).size, nos.length, `duplicate question_no in ${file}`);
    }
  }
  assert.ok(examDataFiles >= 36);
});

function createMockD1(db) {
  return {
    prepare(sql) {
      let params = [];
      const prepared = {
        bind(...next) { params = next; return prepared; },
        async all() { return { results: db.prepare(sql).all(...params) }; },
        async first() { return db.prepare(sql).get(...params) || null; },
        async run() { return { success: true, meta: db.prepare(sql).run(...params) }; }
      };
      return prepared;
    },
    async batch(statements) {
      db.exec('BEGIN');
      try { for (const s of statements) await s.run(); db.exec('COMMIT'); }
      catch (e) { db.exec('ROLLBACK'); throw e; }
      return [];
    }
  };
}

function createEnv(db) {
  return {
    DB: createMockD1(db),
    ARCHIVE2_ASSETS: {
      async fetch(url) {
        const rel = decodeURIComponent(String(url).replace(/^.*\/archive\//, ''));
        const full = path.join(ARCHIVE_ROOT, rel);
        if (!fs.existsSync(full)) return new Response('', { status: 404 });
        return new Response(fs.readFileSync(full, 'utf8'), { status: 200 });
      }
    }
  };
}

function newBlueprintDb() {
  const db = new DatabaseSync(':memory:');
  const schema = fs.readFileSync('apmath/worker-backup/worker/schema.sql', 'utf8');
  const ddl = schema.match(/CREATE TABLE IF NOT EXISTS exam_blueprints \([\s\S]*?\n\);/)[0];
  db.exec(ddl);
  return db;
}

test('sync: examData 시험지 3종이 처음으로 blueprint 행을 만든다', async () => {
  const db = newBlueprintDb();
  const env = createEnv(db);
  for (const rel of [FILES.qUpperWithNumber, FILES.noId, FILES.qLowerWithNumber]) {
    const count = extractArchiveQuestionsFromText(read(rel)).questions.length;
    await syncExamBlueprintsFromArchive(env, rel);
    const rows = db.prepare('SELECT question_no, source_question_no, source_question_ordinal FROM exam_blueprints WHERE archive_file = ? ORDER BY source_question_ordinal').all(rel);
    assert.equal(rows.length, count, rel);
    assert.ok(rows.every(r => r.question_no > 0), rel);
    assert.ok(rows.every(r => r.source_question_no > 0), `${rel} source_question_no`);
  }
  // 두 번째 실행은 해시가 같아 아무것도 바꾸지 않는다.
  const before = JSON.stringify(db.prepare('SELECT * FROM exam_blueprints ORDER BY archive_file, question_no').all());
  await syncExamBlueprintsFromArchive(env, FILES.noId);
  const after = JSON.stringify(db.prepare('SELECT * FROM exam_blueprints ORDER BY archive_file, question_no').all());
  assert.equal(after, before);
});

test('sync 안전성: 다른 시험·같은 시험의 다른 문항 행은 건드리지 않고 삭제하지 않는다', async () => {
  const db = newBlueprintDb();
  const env = createEnv(db);
  const file = FILES.noId;
  const total = extractArchiveQuestionsFromText(read(file)).questions.length;
  db.prepare("INSERT INTO exam_blueprints (archive_file, question_no, standard_unit_key, type_key) VALUES (?, ?, ?, ?)")
    .run('other_exam.js', 1, 'manual-unit', 'manual-type');
  db.prepare("INSERT INTO exam_blueprints (archive_file, question_no, standard_unit_key, type_key) VALUES (?, ?, ?, ?)")
    .run(file, total + 5, 'manual-extra', 'manual-extra-type'); // 원본에 없는 번호의 수동 행
  await syncExamBlueprintsFromArchive(env, file);
  const other = db.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ?').all('other_exam.js');
  assert.equal(other.length, 1);
  assert.equal(other[0].standard_unit_key, 'manual-unit');
  const extra = db.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? AND question_no = ?').get(file, total + 5);
  assert.equal(extra.standard_unit_key, 'manual-extra', '원본에 없는 번호의 기존 행은 삭제·변경되지 않는다');
});

test('sync 주의: 같은 (시험, 번호)에 수동 행이 있으면 원본 JS 메타로 덮어쓴다(기존 questionBank 시험지와 같은 동작)', async () => {
  const db = newBlueprintDb();
  const env = createEnv(db);
  const file = FILES.noId;
  db.prepare("INSERT INTO exam_blueprints (archive_file, question_no, standard_unit_key, type_key) VALUES (?, ?, ?, ?)")
    .run(file, 1, 'manual-unit', 'manual-type');
  await syncExamBlueprintsFromArchive(env, file);
  const row = db.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? AND question_no = 1').get(file);
  // 원본 JS에 메타가 없으면 null로 바뀐다. 이 사실을 고정해 두어 의도치 않게 바뀌면 알 수 있게 한다.
  assert.equal(row.standard_unit_key, null);
  assert.equal(row.type_key, null);
});
