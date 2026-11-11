// Independent geometry and essential lesson cues; not a mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/polygons-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['p1-one', 'p1-all', 'p1-find', 'p2-ext', 'p2-star', 'p2-bis', 'p2-chain', 'p2-iso'];
const items = ids.flatMap(id => video.lessonList(lab.def.lessons[id]).map(lesson => ({ id, lesson })));
const find = (id, label) => video.lessonList(lab.def.lessons[id]).find(l => l.label === label);
const close = (a, b, reason) => assert.ok(Math.abs(a - b) < 1e-8, `${reason}: ${a} versus ${b}`);
const angle = (v, a, b) => {
  const u = [a.x - v.x, a.y - v.y], w = [b.x - v.x, b.y - v.y];
  return Math.atan2(Math.abs(u[0] * w[1] - u[1] * w[0]), u[0] * w[0] + u[1] * w[1]) * 180 / Math.PI;
};
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = pts => Math.abs(pts.reduce((sum, p, i) => {
  const q = pts[(i + 1) % pts.length];
  return sum + p.x * q.y - p.y * q.x;
}, 0)) / 2;
function frame(id, lesson, time = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = video.compileLesson(lesson), state = video.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review';
  lab.scene.view(lab.s, lab); lab.s.step = state.step;
  return { model: lab.scene.pg.model(lab.s), timeline, ...lab.draw() };
}
const final = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);
const row = result => result.textItems.filter(x => x.screen && x.options?.color === 'green' && Math.abs(x.y - lab.board.insets.top - 17) < 1e-9);
const pairs = n => {
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (j - i !== 1 && !(i === 0 && j === n - 1)) out.push([i, j]);
  return out;
};

test('diagonal answers agree with enumerated nonadjacent pairs and an area-covering triangle fan', () => {
  const one = final('p1-one', find('p1-one', 'a+b')).model, vertices = lab.api.regUp(one.n, 1);
  const outgoing = pairs(one.n).filter(pair => pair.includes(one.v));
  const triangles = Array.from({ length: one.n - 2 }, (_, i) => [vertices[one.v], vertices[(one.v + i + 1) % one.n], vertices[(one.v + i + 2) % one.n]]);
  assert.equal(outgoing.length, 4); assert.equal(one.a, outgoing.length);
  assert.equal(triangles.length, 5); assert.equal(one.t, triangles.length);
  close(triangles.reduce((sum, tri) => sum + area(tri), 0), area(vertices), 'triangle fan covers the polygon');
  assert.equal(one.a + one.t, 9);
  const all = final('p1-all', find('p1-all', '전체개수')).model;
  assert.equal(pairs(all.n).length, 9); assert.equal(all.N, 9);
  assert.equal(all.tot, pairs(all.n).length * 2, 'each segment has two endpoints');
  const target = final('p1-find', find('p1-find', '몇각형')).model;
  assert.equal(target.T0, 27);
  const candidates = Array.from({ length: 10 }, (_, i) => i + 3).filter(n => pairs(n).length === target.T0);
  assert.deepEqual(candidates, [9]);
  assert.equal(target.n, candidates[0]); assert.equal(target.ns, candidates[0]);
});

test('exterior and both star lessons use actual coordinate angles, including an asymmetric star', () => {
  const exterior = final('p2-ext', find('p2-ext', '외각')).model, { A, B, C } = exterior.tri;
  close(angle(A, B, C), 50, 'given angle A'); close(angle(B, A, C), 60, 'given angle B');
  close(angle(C, A, { x: C.x + 1, y: C.y }), 110, 'exterior angle');
  for (const lesson of video.lessonList(lab.def.lessons['p2-star'])) {
    const M = final('p2-star', lesson).model, p = M.pts;
    const tips = [[p.A, p.D, p.C], [p.B, p.E, p.D], [p.C, p.A, p.E], [p.D, p.B, p.A], [p.E, p.C, p.B]].map(args => angle(...args));
    [M.a, M.b, M.c, M.d, M.e].forEach((value, i) => close(tips[i], value, `star tip ${i}`));
    close(tips.reduce((sum, x) => sum + x, 0), 180, 'five pointed angles');
    close(angle(p.P, p.A, p.S), tips[2] + tips[4], 'first exterior angle');
    close(angle(p.S, p.P, p.A), tips[1] + tips[3], 'second exterior angle');
    if (lesson.label === '빈각') {
      assert.deepEqual([M.a, M.b, M.c, M.d], [32, 36, 38, 34]);
      close(tips[4], 40, 'unknown asymmetric tip'); assert.equal(M.sum4, 140);
    }
  }
});

test('all three bisector buttons show the intended half-angles and distinct intersection angles', () => {
  const expected = [120, 60, 30];
  for (const [index, lesson] of video.lessonList(lab.def.lessons['p2-bis']).entries()) {
    const M = final('p2-bis', lesson).model, { A, B, C, X, extB, extC, F } = M.g;
    assert.equal(M.k, index + 1);
    close(angle(A, B, C), 60, 'given angle A');
    close(angle(X, B, C), expected[index], 'bisector intersection angle');
    if (M.k === 1) {
      close(angle(B, A, X), angle(B, X, C), 'internal angle at B is halved');
      close(angle(C, A, X), angle(C, X, B), 'internal angle at C is halved');
    } else if (M.k === 2) {
      close(angle(B, C, X), angle(B, X, extB), 'external angle at B is halved');
      close(angle(C, B, X), angle(C, X, extC), 'external angle at C is halved');
    } else {
      close(angle(B, A, X), angle(B, X, C), 'internal angle at B is halved');
      close(angle(C, A, X), angle(C, X, F), 'external angle at C is halved');
    }
    assert.equal(M.x, expected[index]);
  }
});

test('the chain and attached-triangle lessons satisfy their equal-side conditions and derived angles', () => {
  for (const lesson of video.lessonList(lab.def.lessons['p2-chain'])) {
    const M = final('p2-chain', lesson).model, { A, B, C, D, E, F } = M.p;
    for (const [u, v] of [[A, B], [B, C], [C, D], [D, E], [E, F]]) close(distance(u, v), 1, 'equal consecutive side');
    close(angle(A, B, C), 18, 'initial angle x');
    close(angle(B, C, D), 36, '2x'); close(angle(C, D, E), 54, '3x'); close(angle(D, E, F), 72, '4x');
    close(angle(A, B, D), 0, 'A B D lie on one ray'); close(angle(C, A, E), 180, 'A C E are collinear');
    assert.equal(M.x, 72 / 4);
  }
  const M = final('p2-iso', find('p2-iso', '붙인삼각형')).model;
  close(distance(M.A, M.B), distance(M.A, M.C), 'first isosceles triangle');
  close(distance(M.A, M.C), distance(M.C, M.D), 'second isosceles triangle');
  close(angle(M.B, M.A, M.C), 70, 'given base angle');
  close(angle(M.C, M.A, M.B), 70, 'equal base angle');
  close(angle(M.D, M.A, M.C), 35, 'new triangle base angle');
  close(angle(M.A, M.C, M.D), 35, 'matching new base angle');
});

test('intermediate numbers appear when explained, while original given angles remain visible', () => {
  const diagonal = find('p1-one', '대각선');
  assert.ok(!frame('p1-one', diagonal, 10).texts.includes('4'), 'numbered final diagonal is not an early answer');
  const count = find('p1-all', '전체개수');
  assert.ok(!frame('p1-all', count, 4).texts.some(t => /6−3=3|6×3=18/.test(t)));
  assert.ok(frame('p1-all', count, 5.5).texts.includes('한 꼭짓점: 6−3=3개'));
  assert.ok(frame('p1-all', count, 17.5).texts.includes('6×3=18 (두 번씩 센 값)'));
  const ext = find('p2-ext', '외각'), first = frame('p2-ext', ext);
  assert.ok(first.texts.includes('50°') && first.texts.includes('60°') && first.texts.includes('x'));
  assert.ok(!frame('p2-ext', ext, 28).texts.includes('110°'));
  const star = find('p2-star', '빈각');
  assert.ok(!frame('p2-star', star, 16).texts.some(t => t.includes('140')));
  assert.ok(frame('p2-star', star, 17.5).texts.includes('주어진 네 각의 합 = 140°'));
  assert.ok(!frame('p2-star', star, 28).texts.includes('E 40°'));
  const iso = find('p2-iso', '붙인삼각형');
  assert.equal(frame('p2-iso', iso, 0).texts.filter(t => t === '70°').length, 1, 'only the given base angle at first');
  assert.equal(frame('p2-iso', iso, 5.5).texts.filter(t => t === '70°').length, 2, 'derived equal angle accompanies the caption');
});

test('fourteen registered lessons animate promptly and disclose their final result only at the final cue', t => {
  assert.equal(items.length, 14);
  let frames = 0;
  const geometry = result => JSON.stringify(result.paths.map(({ points, options }) => ({ points, options })));
  for (const { id, lesson } of items) {
    const validation = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], `${id} errors`); assert.deepEqual(validation.warnings, [], `${id} warnings`);
    const start = frame(id, lesson), moving = frame(id, lesson, .75);
    assert.ok(start.paths.length > 0, `${id}:${lesson.label} first figure`);
    assert.notEqual(geometry(start), geometry(moving), `${id}:${lesson.label} moves in first second`);
    const reveal = start.timeline.cues.find(c => c.set?.pgShowAnswer === true);
    assert.ok(reveal, `${id}:${lesson.label} has a final reveal`);
    const before = frame(id, lesson, reveal.at - .01), end = final(id, lesson);
    assert.equal(row(before).length, 0, `${id}:${lesson.label} hides final row`);
    assert.equal(row(end).length, 1, `${id}:${lesson.label} has final row`);
    assert.ok(video.normAnswer(row(end)[0].text).includes(video.normAnswer(lesson.answer)), `${id}:${lesson.label} agrees with the answer`);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: true });
    assert.equal(row(lab.draw()).length, 0, `${id}:${lesson.label} entry ignores stale answer flag`);
    const reset = video.stateAt(start.timeline, 0, { nums: lab.s, sets: lab.s, step: 0 });
    assert.equal(reset.sets.pgShowAnswer, false); assert.equal(reset.sets.pgSupportReady, false); assert.equal(reset.sets.pgSecondReady, false);
    for (const cue of start.timeline.cues) if (cue.say) assert.ok(!/[\t\r]/.test(cue.say), 'no malformed math-string escape');
    frames += 5;
  }
  t.diagnostic(`${frames} essential Board frames plus selected intermediate cues; physical mobile visual QA NOT_RUN`);
});
