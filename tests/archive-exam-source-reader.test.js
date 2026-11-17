const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const examsRoot = path.join(archiveRoot, 'exams');
const reader = require(path.join(archiveRoot, 'exam-source-reader.js'));

test('문항 배열 찾기 순서: questions → questionBank → examData(배열/.questions/.problems)', () => {
  const q = [{ id: 1 }];
  assert.equal(reader.readQuestionArray({ questions: q, questionBank: [{ id: 2 }] }), q);
  assert.equal(reader.readQuestionArray({ questionBank: q, examData: { questions: [{ id: 3 }] } }), q);
  assert.equal(reader.readQuestionArray({ questionBank: { questions: q } }), q);
  assert.equal(reader.readQuestionArray({ questionBank: { problems: q } }), q);
  assert.equal(reader.readQuestionArray({ examData: q }), q);
  assert.equal(reader.readQuestionArray({ examData: { questions: q } }), q);
  assert.equal(reader.readQuestionArray({ examData: { problems: q } }), q);
  // 여러 범위를 주면 앞에서부터 찾는다(node vm: window, 그다음 컨텍스트 전역).
  assert.equal(reader.readQuestionArray({}, { questionBank: q }), q);
});

test('문항 배열이 없으면 null이고, 배열이 아닌 값은 무시한다', () => {
  assert.equal(reader.readQuestionArray({}), null);
  assert.equal(reader.readQuestionArray(null, undefined), null);
  assert.equal(reader.readQuestionArray({ questions: 'x', questionBank: {}, examData: { id: 1 } }), null);
  assert.equal(reader.readQuestionArray({ questions: 'x', questionBank: [{ id: 4 }] })[0].id, 4);
});

test('제목: examTitle 우선, questionBank가 없는 examData 형식일 때만 examData.title/examTitle', () => {
  assert.equal(reader.readExamTitle({ examTitle: 'A', examData: { title: 'B' } }), 'A');
  assert.equal(reader.readExamTitle({ examData: { title: 'B' } }), 'B');
  assert.equal(reader.readExamTitle({ examData: { examTitle: 'C' } }), 'C');
  assert.equal(reader.readExamTitle({ questionBank: [], examData: { title: 'B' } }), '');
  assert.equal(reader.readExamTitle({}), '');
});

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

test('archive/exams 시험지 JS 전부가 공용 읽기로 문항 배열을 가진다(없거나 0개인 파일 0개)', () => {
  const files = walk(examsRoot);
  assert.ok(files.length > 0, '시험지 파일이 있어야 한다');
  const defects = [];
  let examDataOnly = 0, bodyOnlyInQuestion = 0, bodyMissing = 0;
  for (const file of files) {
    const rel = path.relative(examsRoot, file).replace(/\\/g, '/');
    const window = {};
    const context = { window, console: { log() {}, warn() {}, error() {} } };
    context.globalThis = context;
    vm.createContext(context);
    try {
      vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 5000 });
    } catch (error) {
      defects.push(`${rel}: 실행 실패 ${error.message}`);
      continue;
    }
    const bank = reader.readQuestionArray(window, context);
    if (!Array.isArray(bank) || bank.length === 0) {
      defects.push(`${rel}: 문항 배열 없음 또는 0개`);
      continue;
    }
    const examDataForm = !window.questionBank && !window.questions && Boolean(window.examData);
    if (examDataForm) examDataOnly += 1;
    for (const item of bank) {
      if (!item?.content && item?.question && examDataForm) bodyOnlyInQuestion += 1;
      if (!item?.content && !item?.question) bodyMissing += 1;
    }
  }
  assert.deepEqual(defects, []);
  // 결함 조건이 아니라 현황 출력이다(실패시키지 않는다): 본문이 content에 없는 examData 형식 문항 수.
  console.log(`# exam-source-reader: 시험지 ${files.length}개, examData 형식 ${examDataOnly}개, 본문이 question에만 있는 examData 문항 ${bodyOnlyInQuestion}개, 본문이 content·question 모두 없는 문항(전체) ${bodyMissing}개`);
});
