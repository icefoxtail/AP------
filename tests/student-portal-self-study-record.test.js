// Student portal: self-study record (풀고 나서 해설, 자동 저장·이어 풀기).
// Defect conditions only: judging, merge (later t wins), keys, counts, server off -> local only. No fixed operating counts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const rec = require('../apmath/student/self-study-record.js');
const similar = require('../apmath/student/self-study-similar.js');
const html = fs.readFileSync(path.join(root, 'apmath/student/index.html'), 'utf8');

const memoryStorage = (seed = {}) => {
  const data = new Map(Object.entries(seed));
  return { getItem: key => (data.has(key) ? data.get(key) : null), setItem: (key, value) => { data.set(key, String(value)); }, data };
};

test('a pick-one question is judged by choice number; typed or unreadable answers are judged by the student', () => {
  const mc = { choices: ['a', 'b', 'c', 'd', 'e'], answer: '③' };
  assert.equal(rec.questionMode(mc), 'mc');
  assert.equal(rec.judge(mc, 3), 'c');
  assert.equal(rec.judge(mc, 2), 'w');
  assert.equal(rec.judge(mc, 0), null);
  assert.equal(rec.judge(mc, 'x'), null);
  for (const answer of ['3', '③', '3번', '(3)', ' 3 ']) assert.equal(rec.answerIndex(answer, 5), 3, answer);
  for (const answer of ['', '12', '3, 5', '답은 3', '⑥', null]) assert.ok(Number.isNaN(rec.answerIndex(answer, 5)), String(answer));
  assert.equal(rec.questionMode({ choices: ['주관식'], answer: '12' }), 'sub');
  assert.equal(rec.questionMode({ choices: [], answer: '3' }), 'sub');
  assert.equal(rec.questionMode({ choices: ['a', 'b'], answer: '12, 13' }), 'sub', 'choices but an unreadable answer: no wrong grading');
  assert.equal(rec.questionMode({ choices: ['a', 'b'] }), 'sub', 'no answer: nothing to grade against');
  assert.equal(rec.questionMode({ choices: [], choicesEmbeddedInImage: true, answer: '④' }), 'mc');
  assert.equal(rec.judge({ choices: [], choicesEmbeddedInImage: true, answer: '④' }, 4), 'c');
  assert.equal(rec.judge({ choices: ['주관식'], answer: '12' }, 1), null);
});

test('record keys: the UID when the data has one, else a stable fallback; keys stay unique inside a set', () => {
  assert.equal(rec.wrongKey(7, { questionUid: 'qid_v1_x' }), 'qid_v1_x');
  assert.equal(rec.wrongKey(7, { source_question_uid: 'qid_v1_y' }), 'qid_v1_y');
  assert.equal(rec.wrongKey(7, { id: 'Q07' }), 'w:7');
  assert.equal(rec.wrongKey(7, undefined), 'w:7');
  assert.equal(rec.similarKey(3, 'similar/high/h1/25_가고_유사1.js', { id: 'Q03' }), 's:3:25_가고_유사1.js:Q03');
  assert.equal(rec.similarKey(3, 'x_유사1.js', { id: 1, questionUid: 'qid_v1_z' }), 'qid_v1_z');
  assert.deepEqual(rec.uniqueKeys(['a', 'b', 'a', 'a']), ['a', 'b', 'a#2', 'a#3']);
});

test('the similar set keeps which similar file a question came from in its key', () => {
  const originalQuestions = [{ id: 1, content: 'o1', answer: '1' }, { id: 2, content: 'o2', answer: '2' }];
  const mk = (tag, uid) => [{ id: 1, content: `${tag}1`, answer: '1' }, { id: 2, content: `${tag}2`, answer: '2', ...(uid ? { questionUid: uid } : {}) }];
  const set = similar.buildSimilarSet({
    originalQuestions, wrongIds: [2],
    similarSets: [{ file: 'similar/high/a_유사1.js', questions: mk('S') }, { file: 'similar/high/a_유사2.js', questions: mk('T', 'qid_v1_t2') }]
  });
  assert.deepEqual(set.questions.map(q => q.ssKey), ['s:2:a_유사1.js:2', 'qid_v1_t2']);
  assert.deepEqual(set.questions.map(q => q.ssSrc), [2, 2]);
  assert.deepEqual(set.questions.map(q => q.ssUid), [null, 'qid_v1_t2']);
  const same = similar.buildSimilarSet({ originalQuestions, wrongIds: [1, 2], similarSets: [{ file: 'a_유사1.js', questions: mk('S') }] });
  assert.equal(new Set(same.questions.map(q => q.ssKey)).size, same.questions.length);
});

test('merging a local and a server record keeps, per question, the later t', () => {
  const local = [
    { k: 'a', r: 'w', n: 1, t: '2026-11-23T10:00:00Z' },
    { k: 'b', r: 'c', n: 1, t: '2026-11-23T11:00:00Z' },
    { k: 'only-local', r: 'u', n: 1, t: '2026-11-23T09:00:00Z' }
  ];
  const remote = [
    { k: 'a', r: 'c', n: 2, t: '2026-11-23T12:00:00Z' },
    { k: 'b', r: 'w', n: 1, t: '2026-11-23T10:30:00Z' },
    { k: 'only-remote', r: 'c', n: 1, t: '2026-11-23T08:00:00Z' }
  ];
  const merged = rec.mergeItems(local, remote);
  const byKey = Object.fromEntries(merged.items.map(item => [item.k, item]));
  assert.equal(byKey.a.r, 'c', 'the server answered later');
  assert.equal(byKey.b.r, 'c', 'the device answered later');
  assert.equal(byKey['only-local'].r, 'u');
  assert.equal(byKey['only-remote'].r, 'c');
  assert.deepEqual(merged.remoteWon.sort(), ['a', 'only-remote']);
  assert.deepEqual(merged.localWon.sort(), ['b', 'only-local'], 'what only the device has must be sent back');
  const tie = rec.mergeItems([{ k: 'x', r: 'w', n: 1, t: '2026-11-23T10:00:00Z' }], [{ k: 'x', r: 'c', n: 2, t: '2026-11-23T10:00:00Z' }]);
  assert.equal(tie.items[0].n, 2, 'same time: more attempts wins');
  const noTime = rec.mergeItems([{ k: 'x', r: 'w', n: 1, t: '' }], [{ k: 'x', r: 'c', n: 1, t: '2026-11-23T10:00:00Z' }]);
  assert.equal(noTime.items[0].r, 'c', 'a missing time loses');
  const pick = rec.mergeItems([{ k: 'x', r: 'w', n: 1, p: 2, t: '2026-11-23T10:00:00Z' }], [{ k: 'x', r: 'w', n: 1, t: '2026-11-23T10:00:01Z' }]);
  assert.equal(pick.items[0].p, 2, 'the pick known only on this device is kept when the answer is the same');
});

test('counts and the two sentences', () => {
  const items = [{ k: 'a', r: 'c' }, { k: 'b', r: 'w' }, { k: 'c', r: 'u' }, { k: 'd', r: null }];
  const summary = rec.summarize(items, 5);
  assert.deepEqual([summary.total, summary.correct, summary.wrong, summary.unknown, summary.answered, summary.remaining, summary.retryable], [5, 1, 1, 1, 3, 4, 2]);
  assert.equal(rec.progressSentence(rec.summarize([{ r: 'c' }, { r: 'c' }, { r: 'c' }], 5)), '5문항 중 3개 맞음 · 2개 남음');
  assert.equal(rec.progressSentence(rec.summarize([{ r: 'c' }, { r: 'c' }], 2)), '2문항 모두 맞혔어요');
  assert.equal(rec.progressText('wrong', { total: 5, correct: 3, answered: 4 }), '오답 5개 중 3개 해결');
  assert.equal(rec.progressText('similar', { total: 4, correct: 3, answered: 4 }), '유사 4문항 중 3개 맞음');
  assert.equal(rec.progressText('wrong', { total: 5, correct: 0, answered: 0 }), '', 'nothing answered: the card keeps its existing text');
  assert.equal(rec.progressText('wrong', null), '');
});

test('server answers: a list, a single set or aggregate rows are all read; the later note (server or local) is shown', () => {
  const aggregate = rec.parseAggregate({ ok: true, success: true, sets: [{ assignment_id: 'a1', kind: 'wrong', total: 5, correct: 3, wrong: 2, updated_at: '2026-11-23T10:00:00Z' }, { assignment_id: 'a1', kind: 'similar', total: 4, correct: 1, wrong: 0 }] });
  assert.equal(aggregate.get('a1|wrong').correct, 3);
  assert.equal(aggregate.get('a1|similar').total, 4);
  assert.equal(rec.extractSets({ ok: true, set: { assignment_id: 'a1', kind: 'wrong', items: [{ k: 'x', r: 'c' }] } })[0].items[0].k, 'x');
  assert.deepEqual(rec.extractSets({ ok: false }), []);
  assert.deepEqual(rec.extractSets(null), []);
  const server = { total: 5, correct: 3, answered: 4, updatedAt: '2026-11-23T10:00:00Z' };
  const local = { total: 5, correct: 4, answered: 5, updatedAt: '2026-11-23T11:00:00Z' };
  assert.equal(rec.pickProgress(server, local), local);
  assert.equal(rec.pickProgress(server, { ...local, updatedAt: '2026-11-23T09:00:00Z' }), server);
  assert.equal(rec.pickProgress(null, local), local);
  assert.equal(rec.pickProgress(server, null), server);
});

function setup({ remote = null, storage = memoryStorage(), keys = ['a', 'b', 'c'], clock = ['2026-11-23T10:00:00Z'] } = {}) {
  let tick = 0;
  const timers = [];
  const recorder = rec.createRecorder({
    studentId: 's1', assignmentId: 'a1', kind: 'wrong',
    entries: keys.map((key, index) => ({ key, uid: null, src: index + 1 })),
    storage, remote,
    now: () => { tick += 1; return new Date(Date.parse(clock[0]) + tick * 1000).toISOString(); },
    setTimer: fn => { timers.push(fn); return timers.length; },
    clearTimer: handle => { timers[handle - 1] = null; }
  });
  return { recorder, storage, timers, fire: async () => { for (const fn of timers.splice(0)) if (fn) await fn(); } };
}
const fakeRemote = (overrides = {}) => {
  const calls = { post: [], get: [] };
  return {
    calls,
    enabled: () => true,
    post: async body => { calls.post.push(body); return { ok: true }; },
    get: async () => { calls.get.push(1); return { ok: true, items: [] }; },
    ...overrides
  };
};

test('every change is saved locally at once and sent as one whole-set POST after a short pause', async () => {
  const remote = fakeRemote();
  const { recorder, storage, timers, fire } = setup({ remote });
  recorder.record('a', { r: 'w', p: 2, n: 1 });
  recorder.record('b', { r: 'c', n: 1 });
  assert.equal(remote.calls.post.length, 0, 'debounced: nothing sent yet');
  assert.equal(timers.filter(Boolean).length, 1, 'one pending timer, not one per change');
  const saved = JSON.parse(storage.getItem(rec.localKey('s1', 'a1', 'wrong')));
  assert.deepEqual(saved.items.map(item => [item.k, item.r]), [['a', 'w'], ['b', 'c']]);
  assert.equal(saved.total, 3);
  await fire();
  assert.equal(remote.calls.post.length, 1);
  const body = remote.calls.post[0];
  assert.deepEqual([body.assignment_id, body.kind], ['a1', 'wrong']);
  assert.deepEqual(body.items.map(item => item.k), ['a', 'b', 'c'], 'the whole set, unanswered questions included');
  assert.equal(body.items[2].r, null);
  assert.ok(Date.parse(body.items[2].t) < Date.parse(body.items[0].t), 'an unanswered placeholder never wins over a real answer');
  assert.ok(!('p' in body.items[0]), 'only contract fields go to the server');
  assert.deepEqual(Object.keys(body.items[0]).sort(), ['k', 'n', 'r', 'src', 't', 'u', 'why']);
  recorder.record('c', { r: 'u', n: 1 });
  await recorder.flush();
  assert.equal(remote.calls.post.length, 2);
  assert.deepEqual(remote.calls.post[1].items.map(item => item.k), ['a', 'b', 'c'], 'always the whole set, so a lost write is repaired by the next save');
  assert.equal(await recorder.flush(), false, 'nothing waiting: nothing sent');
  assert.equal(remote.calls.post.length, 2);
});

test('the server being off (FEATURE_UNAVAILABLE / 404) never breaks the screen: local record only, and no further calls', async () => {
  const remote = fakeRemote({ post: async body => { remote.calls.post.push(body); return { unavailable: true }; }, get: async () => ({ unavailable: true }) });
  const { recorder, storage, fire } = setup({ remote });
  recorder.record('a', { r: 'c', n: 1 });
  await fire();
  assert.equal(remote.calls.post.length, 1);
  recorder.record('b', { r: 'w', n: 1 });
  await fire();
  await recorder.flush();
  assert.equal(remote.calls.post.length, 1, 'unavailable is not retried by the same screen');
  assert.equal(recorder.summary().correct, 1);
  assert.equal(JSON.parse(storage.getItem(rec.localKey('s1', 'a1', 'wrong'))).items.length, 2, 'the local record has everything');
  const loaded = await recorder.load();
  assert.deepEqual(loaded, { changed: [], remote: false });
  // No remote at all (teacher preview): works in memory, nothing stored.
  const preview = setup({ remote: null, storage: null });
  preview.recorder.record('a', { r: 'w', n: 1 });
  assert.equal(preview.recorder.summary().wrong, 1);
  assert.equal(preview.timers.length, 0, 'nothing is scheduled to send');
});

test('a network failure keeps the change waiting for the next save', async () => {
  let fail = true;
  const remote = fakeRemote({ post: async body => { remote.calls.post.push(body); return fail ? { error: true } : { ok: true }; } });
  const { recorder, fire } = setup({ remote });
  recorder.record('a', { r: 'c', n: 1 });
  await fire();
  assert.equal(remote.calls.post.length, 1);
  fail = false;
  assert.equal(await recorder.flush(), true, 'leaving the screen sends it again');
  assert.equal(remote.calls.post.length, 2);
  const thrown = fakeRemote({ post: async () => { throw new Error('offline'); } });
  const second = setup({ remote: thrown });
  second.recorder.record('a', { r: 'w', n: 1 });
  assert.equal(await second.recorder.flush(), false, 'a throwing adapter is contained');
});

test('reopening continues: the server and the device record are merged per question, and the device-only part is sent back', async () => {
  const storage = memoryStorage({
    [rec.localKey('s1', 'a1', 'wrong')]: JSON.stringify({ v: 1, total: 3, updatedAt: '2026-11-23T11:00:00Z', items: [
      { k: 'a', u: null, src: 1, r: 'w', why: 'calc', n: 1, t: '2026-11-23T10:00:00Z', p: 2 },
      { k: 'b', u: null, src: 2, r: 'c', why: null, n: 1, t: '2026-11-23T11:00:00Z' },
      { k: 'gone', u: null, src: 9, r: 'c', why: null, n: 1, t: '2026-11-23T11:00:00Z' }
    ] })
  });
  const remote = fakeRemote({ get: async () => ({ ok: true, items: [
    { k: 'a', r: 'c', why: null, n: 2, t: '2026-11-23T12:00:00Z' },
    { k: 'c', r: 'u', why: 'concept', n: 1, t: '2026-11-23T08:00:00Z' },
    { k: 'not-in-this-set', r: 'c', n: 1, t: '2026-11-23T08:00:00Z' }
  ] }) });
  const { recorder, fire } = setup({ remote, storage });
  assert.equal(recorder.get('a').r, 'w', 'the device record is there before the server answers');
  assert.equal(recorder.get('gone'), null, 'a question that is no longer in the set is ignored');
  const loaded = await recorder.load();
  assert.deepEqual(loaded.changed.sort(), ['a', 'c'], 'the screen redraws what the server changed');
  assert.equal(recorder.get('a').r, 'c');
  assert.equal(recorder.get('b').r, 'c');
  assert.equal(recorder.get('c').why, 'concept');
  assert.equal(recorder.get('not-in-this-set'), null);
  await fire();
  assert.equal(remote.calls.post.length, 1, 'b only the device had: sent back once');
  assert.deepEqual(remote.calls.post[0].items.map(item => item.k).sort(), ['a', 'b', 'c']);
  // What the student changed on this screen is never overwritten by a late server answer.
  const late = setup({ remote: fakeRemote({ get: async () => ({ ok: true, items: [{ k: 'a', r: 'w', n: 5, t: '2099-01-01T00:00:00Z' }] }) }) });
  late.recorder.record('a', { r: 'c', n: 1 });
  const result = await late.recorder.load();
  assert.deepEqual(result.changed, []);
});

test('retrying a question clears its result and counts a new attempt; a broken stored record is ignored', () => {
  const { recorder } = setup();
  recorder.record('a', { r: 'w', why: 'calc', p: 2, n: 1 });
  recorder.record('a', { r: null, why: null, p: null, n: 2 });
  const item = recorder.get('a');
  assert.deepEqual([item.r, item.why, item.n, 'p' in item], [null, null, 2, false]);
  assert.equal(recorder.summary().answered, 0);
  assert.equal(recorder.record('not-a-key', { r: 'c' }), null);
  const broken = memoryStorage({ [rec.localKey('s1', 'a1', 'wrong')]: '{nope' });
  assert.equal(setup({ storage: broken }).recorder.items().length, 0);
  const blocked = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const safe = setup({ storage: blocked });
  assert.doesNotThrow(() => safe.recorder.record('a', { r: 'c', n: 1 }));
  assert.equal(safe.recorder.summary().correct, 1, 'blocked storage: still works in memory');
  assert.equal(rec.cleanItem({ k: 'a', r: 'x', why: 'nope', n: -3 }).r, null, 'values outside the contract are dropped');
  assert.equal(rec.cleanItem({ r: 'c' }), null, 'k is required');
});

test('the local key is per student, assignment and kind', () => {
  assert.equal(rec.localKey('s1', 'a1', 'wrong'), 'APMATH_SELFSTUDY_s1_a1_wrong');
  assert.equal(rec.localKey('s1', 'a1', 'similar'), 'APMATH_SELFSTUDY_s1_a1_similar');
  assert.notEqual(rec.localKey('s1', 'a1', 'wrong'), rec.localKey('s2', 'a1', 'wrong'));
  const storage = memoryStorage();
  rec.writeLocal(storage, 's1', 'a1', 'similar', { total: 4, updatedAt: '2026-11-23T10:00:00Z', items: [{ k: 'x', r: 'c', n: 1, t: 't' }, { k: 'y', r: 'w', n: 1, t: 't' }] });
  const note = rec.readLocalSummary(storage, 's1', 'a1', 'similar');
  assert.deepEqual([note.total, note.correct, note.answered], [4, 1, 2]);
  assert.equal(rec.readLocalSummary(storage, 's1', 'a1', 'wrong'), null);
  assert.equal(rec.readLocalSummary(null, 's1', 'a1', 'wrong'), null);
});

test('portal wiring: contract paths, silent off-switch, no saving in the teacher preview', () => {
  assert.match(html, /student-portal\/self-study/);
  assert.match(html, /'X-Student-Token'\] = ctx\.studentToken/, 'GET carries the student token like apiGet');
  assert.match(html, /FEATURE_UNAVAILABLE/);
  assert.match(html, /response\.status === 404/);
  assert.match(html, /function selfStudyStorage\(\) \{\s*if \(isTeacherPreview\) return null;/, 'teacher preview never touches the student\'s local record');
  assert.match(html, /remote: isTeacherPreview \? null : makeSelfStudyRemote\(\)/);
  assert.match(html, /ensureSelfStudyAggregate\(\);\s*await Promise\.all\(\[loadOmrExams\(true\), loadSimilarLinks\(\)\]\)/, 'one aggregate GET when the exam list opens');
  assert.match(html, /<script src="\.\/self-study-record\.js\?v=[^"]+"><\/script>\s*<script src="\.\/self-study-view\.js/, 'the record loads before the view');
  const recordSource = fs.readFileSync(path.join(root, 'apmath/student/self-study-record.js'), 'utf8');
  assert.doesNotMatch(recordSource, /\bfetch\(|XMLHttpRequest|apiPost/, 'the record module has no network code of its own');
});
