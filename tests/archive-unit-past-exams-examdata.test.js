const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const examSourceReader = require(path.join(archiveRoot, 'exam-source-reader.js'));
const uiSource = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');

// loadQuestionFile은 화면 내부 함수라 소스에서 그 구간만 잘라 가짜 loadScript와 함께 실행한다.
// 가짜 loadScript는 exams/<경로>?v=... 요청을 파일 내용 실행으로 바꿔 준다(브라우저의 script 태그와 같다).
function createLoader(sources) {
  const start = uiSource.indexOf('function requireSourceReader');
  const end = uiSource.indexOf('async function restorePaperQuestions');
  assert.ok(start > 0 && end > start, 'loader section must exist');
  const window = { ExamSourceReader: examSourceReader }; // 브라우저에서는 exam-source-reader.js가 먼저 로드한다
  const requested = [];
  const context = {
    window, core, state: { fileCache: new Map() }, Error, Array, Promise, Number, String, Object, Map,
    loadScript: async src => {
      const key = src.replace(/^exams\//, '').replace(/\?.*$/, '');
      requested.push(key);
      if (!(key in sources)) throw new Error(`불러오기 실패: ${src}`);
      vm.runInContext(sources[key], context);
    }
  };
  vm.createContext(context);
  vm.runInContext(`${uiSource.slice(start, end)}\nthis.loadQuestionFile = loadQuestionFile;`, context);
  return { load: context.loadQuestionFile, window, requested };
}

const ids = data => Array.from(data, question => question.id); // 다른 realm 배열이라 값으로 비교한다

test('window.examData = {questions} 형식 원본도 읽는다(questionBank 별칭 줄 없음)', async () => {
  const loader = createLoader({
    'original/middle/m3/2mid/a.js': 'window.examData = { id: "a", questions: [{ id: 1, question: "본문1" }, { id: 2, question: "본문2" }] };'
  });
  const data = await loader.load('original/middle/m3/2mid/a.js');
  assert.deepEqual(ids(data), [1, 2]);
  assert.equal(data[0].question, '본문1');
});

test('examData가 배열이거나 problems 배열이어도 읽고, 기존 questions·questionBank 형식은 그대로 읽는다', async () => {
  const loader = createLoader({
    'p/arr.js': 'window.examData = [{ id: 7 }];',
    'p/prob.js': 'window.examData = { problems: [{ id: 8 }] };',
    'p/q.js': 'window.questions = [{ id: 9 }];',
    'p/qb.js': 'window.questionBank = [{ id: 10 }]; window.examData = { questions: [{ id: 99 }] };'
  });
  assert.deepEqual(ids(await loader.load('p/arr.js')), [7]);
  assert.deepEqual(ids(await loader.load('p/prob.js')), [8]);
  assert.deepEqual(ids(await loader.load('p/q.js')), [9]);
  // questionBank가 있으면 examData보다 우선한다(원본 엔진과 같은 순서).
  assert.deepEqual(ids(await loader.load('p/qb.js')), [10]);
});

test('앞 파일의 examData가 다음 파일에 섞이지 않는다', async () => {
  const loader = createLoader({
    'p/first.js': 'window.examData = { questions: [{ id: 1, question: "앞 파일" }] };',
    'p/second.js': 'window.__noop = true;'
  });
  assert.equal((await loader.load('p/first.js')).length, 1);
  await assert.rejects(() => loader.load('p/second.js'), /문항 배열을 찾지 못했습니다/);
  assert.equal(loader.window.examData, undefined);
});

test('배열이 없는 파일은 실패 메시지를 내고 다시 시도할 수 있게 캐시하지 않는다', async () => {
  const loader = createLoader({ 'p/empty.js': 'window.examData = { id: "x" };' });
  await assert.rejects(() => loader.load('p/empty.js'), /문항 배열을 찾지 못했습니다/);
  await assert.rejects(() => loader.load('p/empty.js'), /문항 배열을 찾지 못했습니다/);
  assert.equal(loader.requested.length, 2);
});

test('실제 원본 22_연향중 2학기 중간 중3은 examData 형식이며 21문항을 읽는다', async () => {
  const sourceFile = 'original/middle/m3/2mid/22_연향중_2학기_중간_중3_수학.js';
  const real = fs.readFileSync(path.join(archiveRoot, 'exams', sourceFile), 'utf8');
  assert.doesNotMatch(real, /questionBank/, '이 원본에는 questionBank 별칭 줄이 없다');
  const loader = createLoader({ [sourceFile]: real });
  const data = await loader.load(sourceFile);
  assert.equal(data.length, 21);
  assert.ok(data.every(question => Number.isFinite(Number(question.id)) && question.question), '문항 번호와 본문(question)이 있다');
});

test('mixer·Archive2Source도 같은 공용 읽기(exam-source-reader.js)를 쓴다', () => {
  const read = name => fs.readFileSync(path.join(archiveRoot, name), 'utf8');
  const mixer = read('mixer.html');
  assert.match(mixer, /reader\.readQuestionArray\(window\)/);
  assert.match(mixer, /<script src="exam-source-reader\.js\?v=[^"]+"><\/script>/);
  assert.match(read('archive2-source.js'), /examSourceReader\.readQuestionArray\(scope\)/);
  // 같은 규칙을 다시 인라인으로 적지 않는다.
  for (const name of ['mixer.html', 'archive2-source.js', 'unit-past-exams.js']) {
    assert.doesNotMatch(read(name), /examData\?\.questions \|\| examData\?\.problems|window\.questionBank \|\| window\.examData/, `${name}: 공용 읽기를 쓴다`);
  }
  // 공용 모듈을 쓰는 화면은 그 script를 먼저 로드한다(Archive2Source보다 앞).
  for (const name of ['index.html', 'problem-bank-search.html', 'workspace.html', 'archive2-runtime-check.html']) {
    const html = read(name);
    const reader = html.indexOf('exam-source-reader.js'), source = html.indexOf('archive2-source.js');
    assert.ok(reader > 0 && source > reader, `${name}: exam-source-reader.js가 archive2-source.js보다 먼저`);
  }
  assert.match(read('unit-past-exams.html'), /exam-source-reader\.js\?v=/, 'unit-past-exams.html: exam-source-reader.js 로드');
});

function createRestorer(sources) {
  const start = uiSource.indexOf('function requireSourceReader');
  const end = uiSource.indexOf('function getQpp()');
  assert.ok(start > 0 && end > start, 'restorer section must exist');
  const window = { ExamSourceReader: examSourceReader, Archive2ErrorDetail: null };
  const context = {
    window, core, matchQuestionNo: core.matchQuestionNo, parseQuestionNo: core.parseQuestionNo,
    state: { fileCache: new Map() }, Error, Array, Promise, Number, String, Object, Map,
    loadScript: async src => {
      const key = src.replace(/^exams\//, '').replace(/\?.*$/, '');
      if (!(key in sources)) throw new Error(`불러오기 실패: ${src}`);
      vm.runInContext(sources[key], context);
    }
  };
  vm.createContext(context);
  vm.runInContext(`${uiSource.slice(start, end)}\nthis.restorePaperQuestions = restorePaperQuestions;`, context);
  return { restore: context.restorePaperQuestions };
}

test('restorePaperQuestions: 문항 id가 Q01, 12, 7 꼴이어도 sourceQuestionNo와 매칭해 원본 문항을 복원한다', async () => {
  const restorer = createRestorer({
    'p/q01.js': 'window.examData = { questions: [{ id: "Q01", question: "1번 본문" }, { id: "12", question: "12번 본문" }, { id: 7, question: "7번 본문" }] };'
  });
  const paper = {
    records: [
      { sourceFile: 'p/q01.js', sourceQuestionNo: 1, sourceOrdinal: 1, mappedUnitKey: 'u1' },
      { sourceFile: 'p/q01.js', sourceQuestionNo: 12, sourceOrdinal: 2, mappedUnitKey: 'u1' },
      { sourceFile: 'p/q01.js', sourceQuestionNo: 7, sourceOrdinal: 3, mappedUnitKey: 'u1' },
    ]
  };
  const restored = (await restorer.restore(paper)).questions;
  assert.equal(restored.length, 3);
  assert.equal(restored[0].question, '1번 본문');
  assert.equal(restored[1].question, '12번 본문');
  assert.equal(restored[2].question, '7번 본문');
});

test('restorePaperQuestions: 복원된 문항이 하나도 없으면 다른 순서 문항을 추측하지 않고 예외를 던진다', async () => {
  const restorer = createRestorer({
    'p/missing.js': 'window.examData = { questions: [{ id: "Q02", question: "2번 본문" }] };'
  });
  const paper = {
    records: [{ sourceFile: 'p/missing.js', sourceQuestionNo: 1, sourceOrdinal: 1, mappedUnitKey: 'u1' }]
  };
  await assert.rejects(
    () => restorer.restore(paper),
    /p\/missing\.js의 1번 문항을 찾지 못했습니다/,
  );
});

test('restorePaperQuestions: 번호 칸이 number인 시험지도 sourceQuestionNo로 복원한다', async () => {
  const restorer = createRestorer({
    'p/number.js': 'window.examData = { questions: [{ number: 1, question: "1번 본문" }, { number: 2, question: "2번 본문" }] };'
  });
  const paper = { records: [
    { sourceFile: 'p/number.js', id: 2, sourceQuestionNo: 2, sourceOrdinal: 2 },
    { sourceFile: 'p/number.js', id: 1, sourceQuestionNo: 1, sourceOrdinal: 1 },
  ] };
  const restored = await restorer.restore(paper);
  assert.deepEqual(restored.questions.map(question => question.question), ['2번 본문', '1번 본문']);
  assert.equal(restored.missing.length, 0);
});

test('restorePaperQuestions: 서술형 s01은 같은 번호의 객관식 q01이 아니라 자기 문항으로 복원된다', async () => {
  const restorer = createRestorer({
    'p/essay.js': 'window.questions = [{ id: "q01", question: "객관식 1" }, { id: "q02", question: "객관식 2" }, { id: "s01", question: "서술형 1" }];'
  });
  const paper = { records: [
    { sourceFile: 'p/essay.js', id: 'q01', sourceQuestionNo: 1, sourceOrdinal: 1 },
    { sourceFile: 'p/essay.js', id: 's01', sourceQuestionNo: 1, sourceOrdinal: 3 },
  ] };
  const restored = await restorer.restore(paper);
  assert.deepEqual(restored.questions.map(question => question.question), ['객관식 1', '서술형 1']);
  assert.equal(restored.records.length, 2);
});

test('restorePaperQuestions: id 글자가 안 맞고 번호가 겹치면 색인 자리가 맞을 때만 잇고 아니면 추측하지 않는다', async () => {
  const restorer = createRestorer({
    'p/dup.js': 'window.questions = [{ id: "a1", question: "첫째" }, { id: "b1", question: "둘째" }];'
  });
  const paper = { records: [
    { sourceFile: 'p/dup.js', id: 'x1', sourceQuestionNo: 1, sourceOrdinal: 2 },
    { sourceFile: 'p/dup.js', id: 'x1', sourceQuestionNo: 1, sourceOrdinal: 9 },
  ] };
  const restored = await restorer.restore(paper);
  assert.deepEqual(restored.questions.map(question => question.question), ['둘째']);
  assert.equal(restored.missing.length, 1);
});

test('restorePaperQuestions: 한 문항을 못 찾아도 나머지는 복원하고 못 찾은 문항을 알려 준다', async () => {
  const restorer = createRestorer({
    'p/partial.js': 'window.questions = [{ id: "Q01", question: "1번" }, { id: "Q03", question: "3번" }];'
  });
  const paper = { records: [
    { sourceFile: 'p/partial.js', sourceQuestionNo: 1, sourceOrdinal: 1 },
    { sourceFile: 'p/partial.js', sourceQuestionNo: 2, sourceOrdinal: 2 },
    { sourceFile: 'p/partial.js', sourceQuestionNo: 3, sourceOrdinal: 3 },
  ] };
  const restored = await restorer.restore(paper);
  assert.deepEqual(restored.questions.map(question => question.question), ['1번', '3번']);
  assert.deepEqual(restored.records.map(record => record.sourceQuestionNo), [1, 3]);
  assert.equal(restored.missing.length, 1);
  assert.equal(restored.missing[0].file, 'p/partial.js');
  assert.equal(restored.missing[0].questionNo, 2);
  assert.equal(restored.missing[0].code, 'QUESTION_NOT_FOUND');
});
