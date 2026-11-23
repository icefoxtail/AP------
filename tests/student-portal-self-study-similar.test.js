// Student portal: "유사 문항 풀어보기" supply rules (same-number pairing from the exam's similar papers).
// Defect conditions only; no fixed operating counts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const view = require('../apmath/student/self-study-view.js');
const similar = require('../apmath/student/self-study-similar.js');
const link = require('../apmath/student/similar-link.js');
const html = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

const make = (count, prefix, extra = () => ({})) => Array.from({ length: count }, (_, i) => ({ id: i + 1, content: `${prefix}${i + 1}`, choices: ['1', '2', '3', '4', '5'], answer: '①', solution: '풀이', ...extra(i) }));
const original = make(4, 'O');
const map = link.normalizeMap({ version: 1, map: { 'original/x/a.js': [['similar/x/a_유사2.js', 4], ['similar/x/a_유사.js', 4], ['similar/x/a_유사3.js', 4], ['similar/x/a_다른수.js', 5]] } });
const exam = { assignment_id: 'a1', archive_file: 'exams/original/x/a.js', question_count: 4, is_submitted: 1, wrong_ids: [2, 4] };

test('same-number pairing: wrong number N gets the similar paper\'s number N, labelled with its origin', () => {
  const sim = make(4, 'S');
  const set = similar.buildSimilarSet({ title: 't', originalQuestions: original, wrongIds: [4, 2], similarSets: [{ file: 'f', questions: sim }] });
  assert.deepEqual(set.questions.map(q => q.content), ['S2', 'S4']);
  assert.deepEqual(set.questions.map(q => q.sourceLabel), ['원본 2번의 유사', '원본 4번의 유사']);
  assert.deepEqual(set.questions.map(q => q.no), [1, 2], 'cards are numbered in the order shown');
});

test('a similar paper with another question count is not used at all', () => {
  const set = similar.buildSimilarSet({ originalQuestions: original, wrongIds: [1, 2], similarSets: [{ file: 'f', questions: make(5, 'S') }] });
  assert.deepEqual(set.questions, []);
  assert.match(set.emptyText, /찾지 못/);
  assert.deepEqual(similar.usableSets(exam, map, link).map(set => set.file), ['similar/x/a_유사.js', 'similar/x/a_유사2.js'], 'the 5-question paper is dropped; 유사 before 유사2; at most 2');
  assert.equal(similar.canOffer({ ...exam, question_count: 9 }, map, link), false);
  assert.equal(similar.canOffer(exam, map, link), true);
  assert.equal(similar.canOffer({ ...exam, archive_file: 'MIXED:key' }, map, link), false, 'frozen/made-to-order papers are out of scope');
  assert.equal(similar.canOffer({ ...exam, archive_file: 'exams/original/x/none.js' }, map, link), false, 'no similar paper: no button');
  assert.equal(similar.canOffer(exam, null, link), false);
});

test('a similar question without an answer is never offered; a stock explanation stays (the card hides only that button)', () => {
  const sim = make(4, 'S', i => (i === 1 ? { answer: '  ' } : i === 3 ? { solution: '[JS 기준 풀이] 틀 문구' } : {}));
  const set = similar.buildSimilarSet({ originalQuestions: original, wrongIds: [2, 4], similarSets: [{ file: 'f', questions: sim }] });
  assert.deepEqual(set.questions.map(q => q.content), ['S4'], 'S2 has no answer: nothing is invented for wrong number 2');
  assert.equal(view.hasRealSolution(set.questions[0]), false);
});

test('at most 2 similar questions per wrong question, first paper first, labelled 1 and 2', () => {
  const sets = ['a', 'b', 'c'].map(name => ({ file: name, questions: make(4, `S${name}`) }));
  const set = similar.buildSimilarSet({ originalQuestions: original, wrongIds: [3], similarSets: sets });
  assert.deepEqual(set.questions.map(q => q.content), ['Sa3', 'Sb3']);
  assert.deepEqual(set.questions.map(q => q.sourceLabel), ['원본 3번의 유사 1', '원본 3번의 유사 2']);
});

test('a similar question that names its source is matched by that name (past exam ids may skip a number)', () => {
  const skipping = [1, 2, 3, 5].map(id => ({ id, content: `O${id}`, answer: '1' }));
  const sim = [1, 2, 3, 5].map((id, i) => ({ id: i + 1, content: `S${id}`, answer: '1', sourceQid: `q${String(id).padStart(2, '0')}` }));
  const set = similar.buildSimilarSet({ originalQuestions: skipping, wrongIds: [4], similarSets: [{ file: 'f', questions: sim }] });
  assert.deepEqual(set.questions.map(q => q.content), ['S5'], 'position 4 = past id 5 = similar sourceQid q05');
  const byNo = make(4, 'S', i => ({ sourceQuestionNo: 4 - i }));
  assert.equal(similar.buildSimilarSet({ originalQuestions: original, wrongIds: [1], similarSets: [{ file: 'f', questions: byNo }] }).questions[0].content, 'S4', 'sourceQuestionNo wins over position');
  const unmatched = similar.buildSimilarSet({ originalQuestions: original, wrongIds: [1], similarSets: [{ file: 'f', questions: make(4, 'S', () => ({ sourceQuestionNo: 99 })) }] });
  assert.deepEqual(unmatched.questions, [], 'named for another number: not used for this one');
});

test('the snapshot the student was graded on must be the same question as the file\'s', () => {
  const issued = original.map((q, i) => (i === 1 ? { ...q, content: 'different' } : q));
  const set = similar.buildSimilarSet({ originalQuestions: original, issuedQuestions: issued, wrongIds: [1, 2], similarSets: [{ file: 'f', questions: make(4, 'S') }] });
  assert.deepEqual(set.questions.map(q => q.content), ['S1']);
});

test('only the past exam file and its 1-2 similar papers are downloaded', async () => {
  const requested = [];
  const bank = questions => `window.questionBank = ${JSON.stringify(questions)};`;
  const files = { 'exams/original/x/a.js': bank(original), 'exams/similar/x/a_유사.js': bank(make(4, 'S')), 'exams/similar/x/a_유사2.js': bank(make(4, 'T')), 'exams/similar/x/a_유사3.js': 'oops(' };
  const fetchImpl = async url => {
    requested.push(decodeURIComponent(new URL(url).pathname.replace(/^.*\/archive\//, '')));
    const key = requested[requested.length - 1];
    return files[key] ? { ok: true, text: async () => files[key] } : { ok: false };
  };
  const loaded = await similar.loadSimilarSets(exam, map, { view, link, fetchImpl, baseUrl: 'https://school.test/AP------/apmath/student/index.html' });
  assert.equal(requested.length, 3, 'one past exam file + two similar papers');
  assert.ok(requested.every(item => /^exams\//.test(item)));
  assert.ok(!requested.some(item => /catalog|data\//.test(item)));
  const set = similar.buildSimilarSet({ ...loaded, wrongIds: [2] });
  assert.deepEqual(set.questions.map(q => q.content), ['S2', 'T2']);
  const none = await similar.loadSimilarSets({ ...exam, archive_file: 'exams/original/x/none.js' }, map, { view, link, fetchImpl });
  assert.deepEqual(none.similarSets, []);
});

test('the portal offers the similar button only with wrong numbers and a count-matching similar paper, next to the wrong-answer button', () => {
  const grab = name => html.match(new RegExp(`    function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n    \\}`))[0];
  const context = vm.createContext({
    globalThis: { StudentSelfStudyView: view, StudentSelfStudySimilar: similar, StudentSimilarLink: link },
    similarLinksMap: map,
    escapeHtml: value => String(value),
    isOmrReviewAvailable: item => Boolean(item.archive_file)
  });
  vm.runInContext(['normalizeOmrWrongIds', 'getStudentPortalRecordedSubmission', 'getSelfStudyWrongCount', 'canOfferSelfStudySimilar', 'selfStudyProgressText', 'renderSelfStudyWrongButton', 'renderSelfStudySimilarButton', 'renderSelfStudyActions'].map(grab).join('\n'), context);
  const both = context.renderSelfStudyActions(exam, 'list');
  assert.match(both, /has-two/);
  assert.match(both, /openSelfStudyWrong\('a1', 'list'\)/);
  assert.match(both, /openSelfStudySimilar\('a1', 'list'\)/);
  assert.doesNotMatch(context.renderSelfStudyActions({ ...exam, archive_file: 'exams/original/x/none.js' }, 'list'), /openSelfStudySimilar/, 'no similar paper: no similar button');
  assert.match(context.renderSelfStudyActions({ ...exam, archive_file: 'exams/original/x/none.js' }, 'list'), /openSelfStudyWrong/, 'the wrong-answer button stays');
  assert.doesNotMatch(context.renderSelfStudyActions({ ...exam, question_count: 9 }, 'list'), /openSelfStudySimilar/, 'count differs: not offered');
  assert.equal(context.renderSelfStudyActions({ ...exam, wrong_ids: [] }, 'result'), '', 'no wrong number: neither button');
  assert.equal(context.renderSelfStudyActions({ ...exam, archive_file: 'MIXED:k', mixed_payload_json: '{"questions":[{}]}' }, 'result').includes('openSelfStudySimilar'), false);
});

test('wiring: script loaded, bottom jump between the two screens, state remembers which one', () => {
  assert.match(html, /<script src="\.\/self-study-similar\.js\?v=[^"]+"><\/script>/);
  assert.match(html, /label: '유사 문항 풀어보기', onClick: \(\) => openSelfStudy\('similar'/);
  assert.match(html, /label: '오답 다시 풀기', onClick: \(\) => openSelfStudy\('wrong'/);
  assert.match(html, /state\.kind = selfStudyKind/);
  const source = fs.readFileSync(path.join(root, 'apmath/student/self-study-similar.js'), 'utf8');
  assert.doesNotMatch(source, /method:\s*['"](?:POST|PUT|PATCH|DELETE)|apiPost|localStorage\.setItem|archive2-catalog/, 'no writes, no catalog');
  assert.doesNotMatch(html, /self-study-similar\.js[^>]*async/);
});
