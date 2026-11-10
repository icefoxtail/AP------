'use strict';
// 원본 시험지 JS는 두 형식이 있다: window.questionBank(+별칭) 형식, window.examData만 있는 형식.
// 엔진(screen-runtime-adapter.js, engine.html 레거시 경로)은 questionBank가 있으면 그것을, 없을 때만 examData를 읽어야 한다.
// 이유: examData만 있는 시험지가 학생 화면에서 EMPTY_SOURCE_DATA로 비어 보인 적이 있다. 개수는 고정하지 않고 조건만 검사한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const adapter = fs.readFileSync(path.join(root, 'archive', 'screen-runtime-adapter.js'), 'utf8');
const engine = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');

// 어댑터의 실제 선택 코드를 그대로 잘라 실행한다(복사본이 아니라 현행 소스를 검사).
const START = 'const bank = window.questionBank || window.examData;';
const END = "displayTitle = window.examDisplayTitle || title;";
const startAt = adapter.indexOf(START);
const endAt = adapter.indexOf(END);
assert(startAt > 0 && endAt > startAt, 'adapter source selection block should be present');
const selectionBlock = adapter.slice(startAt, endAt + END.length);
const resolveSource = new Function('window', 'input',
  `let raw, title, displayTitle;\n${selectionBlock}\nreturn { raw, title, displayTitle };`);

function evalExam(file) {
  const win = {};
  new Function('window', 'document', fs.readFileSync(file, 'utf8'))(win, {});
  return win;
}

function listOriginalExamFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listOriginalExamFiles(full, out);
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

test('questionBank가 있으면 examData가 있어도 questionBank와 examTitle을 쓴다', () => {
  const win = {
    questionBank: [{ id: 1 }, { id: 2 }],
    examTitle: '뱅크 제목',
    examData: { title: '데이터 제목', questions: [{ id: 9 }] }
  };
  const out = resolveSource(win, {});
  assert.equal(out.raw, win.questionBank);
  assert.equal(out.title, '뱅크 제목');
});

test('questionBank가 있고 examTitle이 없으면 examData 제목이 아니라 기존 폴백을 쓴다', () => {
  const win = { questionBank: [{ id: 1 }], examData: { title: '데이터 제목', questions: [{ id: 9 }] } };
  assert.equal(resolveSource(win, { title: '링크 제목' }).title, '링크 제목');
  assert.equal(resolveSource(win, {}).title, '수학 시험지');
});

test('questionBank가 없으면 examData.questions와 examData 제목을 쓴다', () => {
  const win = { examData: { title: '데이터 제목', questions: [{ id: 1 }, { id: 2 }, { id: 3 }] } };
  const out = resolveSource(win, {});
  assert.equal(out.raw.length, 3);
  assert.equal(out.title, '데이터 제목');
  assert.equal(resolveSource({ examData: { examTitle: '시험 제목', questions: [{ id: 1 }] } }, {}).title, '시험 제목');
  assert.equal(resolveSource({ examData: { questions: [{ id: 1 }] } }, {}).title, '수학 시험지');
});

test('둘 다 없거나 비어 있으면 EMPTY_SOURCE_DATA로 실패한다', () => {
  assert.throws(() => resolveSource({}, {}), /EMPTY_SOURCE_DATA/);
  assert.throws(() => resolveSource({ examData: { title: 'x', questions: [] } }, {}), /EMPTY_SOURCE_DATA/);
});

test('어댑터는 시험지를 연속으로 열어도 이전 examData가 남지 않게 로드 전에 지우고 로드 뒤 복원한다', () => {
  assert.match(adapter, /const names = \[[^\]]*'questionBank'[^\]]*'examData'[^\]]*\];/);
  assert.match(adapter, /names\.forEach\(name => \{ delete window\[name\]; \}\);/);
  assert.match(adapter, /originals\.forEach\(\(\[name, descriptor\]\) =>/);
});

test('engine.html 레거시 경로도 questionBank가 없을 때만 examData를 읽는다', () => {
  assert.match(engine, /const qb = window\.questionBank \|\| window\.examData;/);
  assert.match(engine, /AppState\.title = window\.examTitle \|\| \(!window\.questionBank && \(window\.examData\?\.title \|\| window\.examData\?\.examTitle\)\)/);
});

test('원본 시험지 중 questionBank가 없는 파일은 모두 examData에서 비어 있지 않은 문항 배열을 얻는다', () => {
  const files = listOriginalExamFiles(path.join(root, 'archive', 'exams', 'original'));
  const failures = [];
  let checked = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (/window\.questionBank\s*=/.test(source)) continue;
    checked += 1;
    try {
      const win = evalExam(file);
      const { raw } = resolveSource(win, {});
      if (!Array.isArray(raw) || !raw.length) failures.push(`${path.relative(root, file)}: empty`);
      else if (win.examData && Array.isArray(win.examData.questions) && raw.length !== win.examData.questions.length) {
        failures.push(`${path.relative(root, file)}: length mismatch`);
      }
    } catch (error) {
      failures.push(`${path.relative(root, file)}: ${error.message}`);
    }
  }
  assert.deepEqual(failures, [], `questionBank 없는 원본 ${checked}개 중 문항을 못 얻는 파일이 있다`);
});
