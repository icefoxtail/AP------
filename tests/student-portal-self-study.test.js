// Student portal: "오답 다시 풀기" + the question-card screen the similar-problem step reuses.
// Defect conditions only (wrong-number filter, stock explanations hidden, one broken question never blocks the rest);
// no fixed operating counts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const view = require('../apmath/student/self-study-view.js');
const APRenderText = require('../archive/render-text.js');
const html = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

const deps = {
  text: APRenderText,
  imageUrl: src => `https://img.test/${src}`,
  crossOrigin: () => '',
  resolveHtml: value => value
};
const bank = [
  { id: 1, content: '1. 첫 문항 $x^2$', choices: ['1', '2', '3', '4', '5'], answer: '③', solution: '풀이 $x=1$' },
  { id: 2, content: '둘째', choices: ['주관식'], answer: '12', solution: '[JS 기준 풀이] 틀 문구이다. 계산 결과는 12이다.' },
  { id: 3, content: '셋째', choices: ['a', 'b', 'c', 'd', 'e'], answer: '①', solution: '   ' },
  { id: 4, content: '넷째', image: 'assets/images/x/4.png', choices: [], answer: '7', solution: '해설 있음' }
];

test('wrong numbers pick questions by position, whatever the question id looks like', () => {
  const numeric = view.buildWrongSet({ title: 't', questions: bank, wrongIds: ['3', 1, 3, 'x', 0, -2] });
  assert.deepEqual(numeric.questions.map(q => q.no), [1, 3]);
  assert.equal(numeric.questions[1].content, '셋째');
  const qIds = bank.map((q, i) => ({ ...q, id: `Q${String(i + 1).padStart(2, '0')}` }));
  const prefixed = view.buildWrongSet({ title: 't', questions: qIds, wrongIds: [4, 2] });
  assert.deepEqual(prefixed.questions.map(q => [q.no, q.id]), [[2, 'Q02'], [4, 'Q04']]);
  const noQuestion = view.buildWrongSet({ title: 't', questions: bank, wrongIds: [2, 99] });
  assert.equal(noQuestion.questions[1].missing, true, 'a number with no question stays visible as a failed card');
  assert.deepEqual(view.buildWrongSet({ title: 't', questions: bank, wrongIds: [] }).questions, []);
  assert.deepEqual(view.buildWrongSet({ title: 't', questions: { questions: bank }, wrongIds: [1] }).questions.map(q => q.no), [1]);
});

test('title keeps the portal exam title and the purpose with the question count', () => {
  assert.equal(view.buildTitle({ date: '2026-11-20', examTitle: '왕지중 1회', purpose: '오답 다시 풀기', count: 5 }), '11/20 왕지중 1회 · 오답 다시 풀기 5문항');
  assert.equal(view.buildTitle({ examTitle: '', purpose: '오답 다시 풀기', count: 0 }), '오답 다시 풀기');
});

test('a card opens answer and explanation per question; a stock explanation hides only the explanation button', () => {
  const full = view.renderCard({ ...bank[0], no: 1 }, deps);
  assert.match(full, /data-ss-toggle="answer"/);
  assert.match(full, /data-ss-toggle="solution"/);
  assert.match(full, /id="ss-a-1"[^>]*hidden/);
  assert.match(full, /id="ss-s-1"[^>]*hidden/);
  assert.doesNotMatch(full, /<div class="ss-stem">1\. /, 'the leading "1." is stripped like the engine does');
  for (const index of [1, 2]) {
    const card = view.renderCard({ ...bank[index], no: index + 1 }, deps);
    assert.match(card, /data-ss-toggle="answer"/, 'answer stays available');
    assert.doesNotMatch(card, /data-ss-toggle="solution"/, 'stock or empty explanation is not offered');
    assert.doesNotMatch(card, /기준 풀이/);
  }
  assert.equal(view.hasRealSolution({ solution: '[JS 기준 풀이] x' }), false);
  assert.equal(view.hasRealSolution({ solution: ' ' }), false);
  assert.equal(view.hasRealSolution({ solution: '실제 풀이' }), true);
  const figure = view.renderCard({ ...bank[3], no: 4 }, deps);
  assert.match(figure, /<img src="https:\/\/img\.test\/assets\/images\/x\/4\.png"/);
  assert.doesNotMatch(view.renderCard({ id: 9, no: 9, content: '답 없음', choices: [] }, deps), /ss-toggle/, 'no answer and no explanation: no buttons');
});

test('one question that cannot be drawn becomes a failed card and never throws into the others', () => {
  const broken = { get content() { throw new Error('bad'); }, no: 2 };
  const cards = [view.renderCard({ ...bank[0], no: 1 }, deps), view.renderCard(broken, deps), view.renderCard({ no: 5, missing: true }, deps)];
  assert.match(cards[0], /class="ss-card"/);
  for (const card of cards.slice(1)) {
    assert.match(card, new RegExp(view.FAIL_CARD_TEXT));
    assert.match(card, /is-failed/);
  }
});

test('exam source is read from the exam file or from the frozen snapshot, never both guessed', async () => {
  const source = 'window.examTitle = "x";\nwindow.questionBank = [{"id":"Q01","content":"a","choices":[],"answer":"1"},{"id":"Q02","content":"b","choices":[],"answer":"2"}];';
  const requested = [];
  const fetchImpl = async url => { requested.push(url); return { ok: true, text: async () => source }; };
  const fromFile = await view.loadExamQuestions({ assignment_id: 'a', archive_file: 'exams/original/high/h1/2mid/가 고.js' }, { fetchImpl, baseUrl: 'https://school.test/AP------/apmath/student/index.html' });
  assert.deepEqual(fromFile.map(q => q.id), ['Q01', 'Q02']);
  assert.equal(requested[0], 'https://school.test/AP------/archive/exams/original/high/h1/2mid/%EA%B0%80%20%EA%B3%A0.js');
  const frozen = JSON.stringify({ questions: [{ id: 7, content: 'frozen' }], meta: {} });
  requested.length = 0;
  const fromSnapshot = await view.loadExamQuestions({ assignment_id: 'a', archive_file: 'MIXED:k', mixed_payload_json: frozen }, { fetchImpl, baseUrl: 'https://school.test/AP------/apmath/student/index.html' });
  assert.deepEqual(fromSnapshot.map(q => q.content), ['frozen']);
  assert.equal(requested.length, 0, 'a frozen snapshot is used as issued, no file request');
  await assert.rejects(view.loadExamQuestions({ archive_file: 'MIXED:k' }, { fetchImpl }), /EXAM_SOURCE_UNAVAILABLE/);
  await assert.rejects(view.loadExamQuestions({ archive_file: 'exams/a.js' }, { fetchImpl: async () => ({ ok: false }), baseUrl: 'https://school.test/AP------/apmath/student/index.html' }), /EXAM_FETCH_FAILED/);
});

function buttonHelpers() {
  const grab = name => html.match(new RegExp(`    function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n    \\}`))[0];
  const context = vm.createContext({
    globalThis: { StudentSelfStudyView: view },
    escapeHtml: value => String(value),
    isOmrReviewAvailable: exam => Boolean(exam.archive_file)
  });
  vm.runInContext([grab('normalizeOmrWrongIds'), grab('getStudentPortalRecordedSubmission'), grab('getSelfStudyWrongCount'), grab('renderSelfStudyWrongButton')].join('\n'), context);
  return context;
}

test('the exam card offers the button only for a submitted exam with at least one wrong number', () => {
  const h = buttonHelpers();
  const base = { assignment_id: 'a1', archive_file: 'exams/x.js', is_submitted: 1 };
  assert.match(h.renderSelfStudyWrongButton({ ...base, wrong_ids: [3, 1] }, 'list'), /오답 다시 풀기.*2문항/s);
  assert.match(h.renderSelfStudyWrongButton({ ...base, wrong_ids: [3] }, 'result'), /openSelfStudyWrong\('a1', 'result'\)/);
  assert.equal(h.renderSelfStudyWrongButton({ ...base, wrong_ids: [] }, 'list'), '', 'no wrong number: no button');
  assert.equal(h.renderSelfStudyWrongButton({ ...base, wrong_ids: null }, 'list'), '', 'wrong numbers not received: no button, not "no wrong"');
  assert.equal(h.renderSelfStudyWrongButton({ ...base, is_submitted: 0, wrong_ids: [1] }, 'list'), '');
  assert.equal(h.renderSelfStudyWrongButton({ ...base, is_submitted: undefined, wrong_ids: [1] }, 'list'), '');
  assert.equal(h.renderSelfStudyWrongButton({ ...base, archive_file: '', wrong_ids: [1] }, 'list'), '', 'no readable questions: no button');
});

test('the portal wires the button on the list card and the result screen and loads the view lazily', () => {
  assert.match(html, /<script src="\.\/self-study-view\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /\$\{renderSelfStudyWrongButton\(exam, 'list'\)\}/);
  assert.match(html, /\$\{renderSelfStudyWrongButton\(exam, 'result'\)\}/);
  assert.match(html, /'omr-self-study':'exams'/);
  assert.match(html, /view === 'omr-self-study'/);
  const source = fs.readFileSync(path.join(root, 'apmath/student/self-study-view.js'), 'utf8');
  assert.doesNotMatch(source, /method:\s*['"](?:POST|PUT|PATCH|DELETE)|apiPost|XMLHttpRequest|localStorage\.setItem/, 'the card screen records and sends nothing');
  for (const lazy of ['render-text.js', 'archive-asset-base.js', 'tex-mml-chtml-mathjax-tex.js']) {
    assert.doesNotMatch(html, new RegExp(lazy), `${lazy} must not load at portal start`);
  }
});
