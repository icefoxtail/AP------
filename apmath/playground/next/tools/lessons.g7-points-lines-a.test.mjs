// Source-bound mathematics and essential production Board cues; mobile QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/points-lines-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['l-ray', 'l-types', 'l-same', 'l-common', 'l-short', 'l-col', 'l-gen', 'l-mix'];
const list = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => list(id).find(l => l.label === label);
const items = ids.flatMap(id => list(id).map(lesson => ({ id, lesson })));
const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = video.compileLesson(lesson), state = video.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review'; lab.scene.view(lab.s, lab); lab.s.step = state.step;
  return { model: lab.scene._pl.model(lab.s), timeline, question: lab.scene.question(lab.s), ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const quiz = () => lab.scene._pl.quiz(lab.scene._pl.model(lab.s), lab.s, lab.api.rng(lab.api.hash(lab.scene.id) + ((lab.s.plSeed || 0) + 1) * 7919));
const round = x => Math.abs(x) < 1e-8 ? '0' : x.toFixed(7);
// Independent geometric deduplication, not the production counting formulas.
function counts(points) {
  const lines = new Set(), rays = new Set(), segments = new Set();
  points.forEach((a, i) => points.forEach((b, j) => {
    if (i === j) return;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    rays.add([i, round(dx / d), round(dy / d)].join('|'));
    if (i > j) return;
    segments.add(`${i}|${j}`);
    let A = -dy / d, B = dx / d, C = -(A * a.x + B * a.y);
    if (A < -1e-8 || (Math.abs(A) < 1e-8 && B < 0)) { A *= -1; B *= -1; C *= -1; }
    lines.add([A, B, C].map(round).join('|'));
  }));
  return { line: lines.size, ray: rays.size, seg: segments.size };
}
const pointsOf = (id, M) => id === 'l-col' ? M.xs.map(x => ({ x, y: 0 })) : id === 'l-gen' ? M.pts.slice(0, M.m) : [...M.on.map(x => ({ x, y: 0 })), ...M.off];

test('line names, ray directions and measured distances agree with fixed source coordinates', () => {
  const r = final('l-ray', find('l-ray', '공통부분'));
  assert.deepEqual([r.model.A, r.model.B, r.model.dir], [3, 8, 1]);
  assert.equal(Math.abs(r.model.B - r.model.A), 5);
  assert.ok(r.texts.some(t => t.includes('선분 AB') && t.includes('5 cm')));
  for (const lesson of list('l-types')) {
    const a = frame('l-types', lesson), z = final('l-types', lesson);
    assert.deepEqual([a.model.A, a.model.B], [z.model.A, z.model.B]);
    assert.equal(z.model.B - z.model.A, z.model.L); assert.equal(z.model.L, 5);
    assert.ok(z.question.includes(lesson.label));
  }
  const distance = final('l-short', find('l-short', '거리계산'));
  assert.deepEqual([distance.model.A, distance.model.B], [2, 9]);
  assert.equal(Math.hypot(distance.model.B - distance.model.A, 0), 7);
  assert.equal(quiz().choices.find(c => c.ok).v, 7);
  assert.ok(distance.question.includes('2') && distance.question.includes('9'));
  // The actual bent path is strictly longer than the straight segment.
  const M = distance.model, P = [{ x: M.A, y: 0 }, { x: M.A + M.d * .3, y: M.h * .9 }, { x: M.A + M.d * .62, y: M.h * .35 }, { x: M.B, y: 0 }];
  assert.ok(P.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - P[i].x, p.y - P[i].y), 0) > M.d);
});

test('same-ray examples require both identical starting point and identical direction', () => {
  const other = { 같은반직선: 'BD', 시작점함정: 'CD', 방향함정: 'BA' };
  for (const lesson of list('l-same')) {
    const result = final('l-same', lesson), xs = result.model.xs, name = other[lesson.label], j = name.charCodeAt(0) - 65, k = name.charCodeAt(1) - 65;
    const equal = xs[1] === xs[j] && Math.sign(xs[2] - xs[1]) === Math.sign(xs[k] - xs[j]);
    assert.equal(equal, lesson.label === '같은반직선');
    assert.ok(result.texts.includes(`반직선 BC ${equal ? '=' : '≠'} 반직선 ${name}`));
    if (equal) { assert.ok(result.question.includes('반직선 BC')); assert.equal(quiz().choices.find(c => c.ok).t, '반직선 BD'); }
  }
});

test('all four source intersection cases match independent intervals, including the shared endpoint', () => {
  frame('l-common', list('l-common')[0]);
  const spec = lab.scene._pl;
  const expected = [
    { kind: 'seg', a: 1, c: 2 }, { kind: 'ray', s: 1, d: 1 }, { kind: 'none' }, { kind: 'point', p: 1 }
  ];
  for (let lcs = 0; lcs < 4; lcs++) {
    const M = spec.model({ ...spec.init, lcs });
    const ranges = [M.r1, M.r2].map(r => r.d > 0 ? [M.xs[r.s], Infinity] : [-Infinity, M.xs[r.s]]);
    const lo = Math.max(...ranges.map(x => x[0])), hi = Math.min(...ranges.map(x => x[1]));
    const kind = lo > hi ? 'none' : lo === hi ? 'point' : Number.isFinite(lo) && Number.isFinite(hi) ? 'seg' : 'ray';
    assert.equal(kind, expected[lcs].kind);
    assert.deepEqual(JSON.parse(JSON.stringify(M.sh)), expected[lcs]);
  }
  const ends = final('l-common', find('l-common', '끝점비교'));
  assert.ok(ends.texts.includes('공통부분 없음'));
  assert.ok(ends.texts.includes('공통부분: 점 B'));
  assert.ok(ends.question.includes('CD와 BA') && ends.question.includes('BA와 BD'));
});

test('line, ray and segment counts match independent coordinate sets and the actual quiz branches', () => {
  for (const id of ['l-col', 'l-gen', 'l-mix']) for (const lesson of list(id)) {
    const start = frame(id, lesson), end = final(id, lesson), M = end.model, P = pointsOf(id, M), measured = counts(P);
    assert.deepEqual(JSON.parse(JSON.stringify(pointsOf(id, start.model))), JSON.parse(JSON.stringify(P)), 'problem points do not move for animation');
    assert.deepEqual(measured, { line: M.line, ray: M.ray, seg: M.seg });
    if (id === 'l-mix') {
      for (let a = 0; a < P.length; a++) for (let b = a + 1; b < P.length; b++) for (let c = b + 1; c < P.length; c++) {
        const cross = (P[b].x - P[a].x) * (P[c].y - P[a].y) - (P[b].y - P[a].y) * (P[c].x - P[a].x);
        assert.equal(Math.abs(cross) < 1e-8, c < M.k, 'no unintended collinear triple');
      }
    }
    const expected = lesson.label === '개수의합' ? measured.seg + measured.ray : lesson.label === '반직선' ? measured.ray : lesson.label === '선분' ? measured.seg : measured.line;
    assert.ok(lesson.answer.includes(`${expected}개`));
    if (id === 'l-mix' && lesson.label === '선분') assert.ok(end.question.includes('서로 다른 선분'));
    else assert.equal(quiz().choices.find(c => c.ok).v, expected, `${id}/${lesson.label} source quiz`);
    assert.ok(end.question.includes(String(id === 'l-gen' ? M.m : M.n)), 'question includes actual point count');
  }
});

test('intermediate totals are displayed at their captions and the final result waits for its cue', () => {
  const cases = [
    ['l-col', '선분', 12, /한 점에서 다른 4개/],
    ['l-col', '선분', 17.5, /5×4 = 20/],
    ['l-col', '선분', 29.5, /선분: 20÷2 = 10개/],
    ['l-col', '개수의합', 17.5, /선분: 5×4÷2 = 10개/],
    ['l-col', '개수의합', 29.5, /반직선: 2×\(5−1\) = 8개/],
    ['l-col', '개수의합', 41.5, /합: 10 \+ 8 = 18개/],
    ['l-gen', '반직선', 17.5, /반직선 20개/],
    ['l-mix', '직선', 12, /전체 두 점의 쌍: 6×5÷2 = 15/],
    ['l-mix', '직선', 17.5, /한 직선 위의 쌍: 4×3÷2 = 6/],
    ['l-mix', '직선', 24, /겹친 직선은 1개만/],
    ['l-mix', '직선', 29.5, /직선: 15−6\+1 = 10개/],
    ['l-mix', '반직선', 24, /실제 반직선: 2×\(4−1\) = 6/],
    ['l-mix', '반직선', 29.5, /반직선: 30−12\+6 = 24개/]
  ];
  for (const [id, label, time, pattern] of cases) {
    const lesson = find(id, label);
    assert.ok(!frame(id, lesson, time - .01).texts.some(t => pattern.test(t)), `${id}/${label} hides ${pattern}`);
    assert.ok(frame(id, lesson, time).texts.some(t => pattern.test(t)), `${id}/${label} reveals ${pattern}`);
  }
});

test('all line explanations have real initial geometry, first-second construction, and replay-safe results', t => {
  let frames = 0;
  for (const { id, lesson } of items) {
    const validation = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, []); assert.deepEqual(validation.warnings, []);
    const start = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(start.paths.some(p => p.options.color && p.points.length > 1), `${id}/${lesson.label} initial geometry`);
    assert.notEqual(geometry(start), geometry(moving), `${id}/${lesson.label} actual construction`);
    const reveal = start.timeline.cues.find(c => c.set?.plShowAnswer === true);
    assert.ok(reveal && reveal.at >= start.timeline.chapters.at(-1).at, 'answer occurs in last chapter');
    const before = frame(id, lesson, reveal.at - .01), end = final(id, lesson);
    const newResults = end.texts.filter(text => !before.texts.includes(text));
    assert.ok(newResults.length, `${id}/${lesson.label} final drawing gains a result`);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: true });
    const staleEntry = lab.draw();
    for (const text of newResults) assert.ok(!staleEntry.texts.includes(text), `${id}/${lesson.label} entry hides ${text}`);
    const reset = video.stateAt(start.timeline, 0, { nums: { ...lab.s, plSeed: 89 }, sets: { ...lab.s, lcx: [-100, 0, 1, 2, 999], lkx: [-10, 0, 1, 20] }, step: 99 });
    for (const key of ['plShowAnswer', 'plSupportReady', 'plOtherReady', 'plExtraReady']) assert.equal(reset.sets[key], false);
    assert.equal(reset.nums.plSeed, lesson.chapters[0].start.plSeed);
    if (id === 'l-col') assert.equal(reset.sets.lcx, null);
    if (id === 'l-mix') assert.equal(reset.sets.lkx, null);
    frames += 5;
  }
  t.diagnostic(`${items.length} explanations, ${frames} essential Board frames; physical mobile visual QA NOT_RUN`);
});

test('lesson flags leave manual geometry, drag handles and the original question unchanged', () => {
  for (const id of ids) {
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'explore';
    const before = lab.draw(), question = lab.scene.question(lab.s);
    Object.assign(lab.s, { plShowAnswer: true, plSupportReady: true, plOtherReady: true, plExtraReady: true, plLessonMode: 'unused-manual-mode', plTrace: .37 });
    const after = lab.draw();
    assert.equal(geometry(after), geometry(before), `${id} manual geometry preserved`);
    assert.ok(after.handles.length > 0, `${id} manual manipulation remains available`);
    assert.equal(lab.scene.question(lab.s), question, `${id} manual question preserved`);
  }
});
