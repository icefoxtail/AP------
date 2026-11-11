// Focused mathematical/disclosure checks for t1's new lessons.
// HTML loading, every entry/final Board frame and format validation are covered separately.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/polyhedra-lesson-runtime.mjs';
const core = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const G = lab.api;
const ids = Array.from({ length: 8 }, (_, i) => 'p1-' + i);
const all = ids.flatMap(id => core.lessonList(lab.def.lessons[id]).map(lesson => ({ id, lesson })));
const norm = core.normAnswer;
function frame(id, lesson, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const timeline = core.compileLesson(lesson), state = core.stateAt(timeline, time, { nums: lab.s, sets: lab.s, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: true, lessonEntry: false, dragging: true, playing: false });
  lab.tab = 'review';
  lab.scene.view(lab.s, lab);
  lab.s.step = state.step;
  return { model: lab.scene.ph.model(lab.s), ...lab.draw(), timeline };
}
const end = (id, lesson) => frame(id, lesson, core.compileLesson(lesson).length);
const number = lesson => Number(norm(lesson.answer).match(/^\d+/)?.[0]);

test('counting answers agree with independently counted mesh vertices, edges and faces', () => {
  for (const kind of ['prism', 'pyr', 'fr']) for (let n = 3; n <= (kind === 'fr' ? 8 : 12); n++) {
    const S = G.solidOfKind(kind, n, .5), c = G.countsOf(kind, n);
    const endpoints = new Set(S.E.map(e => [e.a, e.b].sort((a, b) => a - b).join(',')));
    assert.equal(endpoints.size, S.E.length, 'mesh has no double-counted edge');
    assert.deepEqual({ V: S.V.length, E: endpoints.size, F: S.F.length }, { V: c.V, E: c.E, F: c.F }, `${kind} ${n}`);
    assert.equal(S.V.length - endpoints.size + S.F.length, 2, `${kind} ${n}: Euler characteristic`);
  }
  for (const { id, lesson } of all.filter(x => ['p1-1', 'p1-2', 'p1-3'].includes(x.id))) {
    const { model: M } = end(id, lesson), target = lab.s.phTarget;
    const count = { F: M.S.F.length, E: M.S.E.length, V: M.S.V.length }[target];
    assert.equal(number(lesson), count, `${id}:${lesson.label}: stated answer`);
    assert.equal(M.c[target], count, `${id}:${lesson.label}: actual model`);
  }
});

test('side-shape and naming answers follow the displayed polygon geometry', () => {
  const sub = (a, b) => [a.x - b.x, a.y - b.y, a.z - b.z];
  const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  for (const lesson of core.lessonList(lab.def.lessons['p1-4'])) {
    const { model: M } = end('p1-4', lesson), points = M.S.F[M.fi].i.map(i => M.S.V[i]);
    assert.equal(lesson.answer, { prism: '직사각형', pyr: '삼각형', fr: '사다리꼴' }[M.kind]);
    assert.equal(points.length, M.kind === 'pyr' ? 3 : 4);
    if (M.kind === 'prism') assert.ok(Math.abs(dot(sub(points[1], points[0]), sub(points[3], points[0]))) < 1e-9, 'rectangle has a right angle');
    if (M.kind === 'fr') {
      const pairs = [[0, 1, 3, 2], [1, 2, 0, 3]];
      assert.ok(pairs.some(([a, b, c, d]) => {
        const u = sub(points[b], points[a]), v = sub(points[d], points[c]);
        return Math.hypot(...cross(u, v)) < 1e-9 && Math.abs(Math.hypot(...u) - Math.hypot(...v)) > .01;
      }), 'trapezoid has unequal parallel opposite edges');
    }
  }
  for (const lesson of core.lessonList(lab.def.lessons['p1-5'])) {
    const { model: M } = end('p1-5', lesson), kind = lab.s.phTarget, n = M.F - (kind === 'pyr' ? 1 : 2);
    assert.equal(G.solidOfKind(kind, n).F.length, M.F, 'named solid has the given face count');
    assert.equal(lesson.answer, G.nameOf(kind, n));
  }
  const faces = core.lessonList(lab.def.lessons['p1-0']).find(l => l.label === '몇면체');
  const M = end('p1-0', faces).model;
  assert.equal(faces.answer, `${G.solidOfKind(M.kd.id, M.n).F.length}면체`);
});

test('frustum trap and Euler application answers agree with actual conditions', () => {
  const area = (S, face) => {
    const p = face.i.map(i => S.V[i]), origin = p[0];
    let sum = 0;
    for (let i = 1; i < p.length - 1; i++) sum += G.len3(G.cross3(G.sub3(p[i], origin), G.sub3(p[i + 1], origin))) / 2;
    return sum;
  };
  for (const k of [.25, .5, .75]) {
    const S = G.frustumS(5, k), top = S.F.find(f => f.n.z > .999), bottom = S.F.find(f => f.n.z < -.999);
    assert.ok(Math.abs(G.dot3(top.n, bottom.n) + 1) < 1e-9, 'base planes are parallel');
    assert.ok(Math.abs(area(S, top) / area(S, bottom) - k ** 2) < 1e-9, 'parallel cut has the corresponding area ratio');
    assert.notEqual(area(S, top), area(S, bottom), 'different areas disprove congruence');
    assert.equal(S.F.filter(f => Math.abs(f.n.z) < .999).length, 5, 'one side face per base edge');
  }
  for (const lesson of core.lessonList(lab.def.lessons['p1-7'])) {
    const { model: M } = end('p1-7', lesson), expected = lesson.label === '공식확인' ? M.S.V.length - M.S.E.length + M.S.F.length : M.S.V.length + M.S.F.length - 2;
    assert.equal(number(lesson), expected);
    assert.deepEqual([M.V, M.E, M.F], [M.S.V.length, M.S.E.length, M.S.F.length]);
  }
});

test('intermediate frames withhold the requested answer and replay resets each sibling mode', () => {
  for (const { id, lesson } of all) {
    const cs = core.compileLesson(lesson), reveal = cs.cues.find(c => c.set?.phShowAnswer === true);
    assert.ok(reveal, `${id}:${lesson.label}: final cue exists`);
    const before = frame(id, lesson, reveal.at - .01), text = norm(before.texts.join('|'));
    assert.ok(!text.includes(norm(lesson.answer)), `${id}:${lesson.label}: no early result (${text})`);
    const final = end(id, lesson), complete = norm(final.texts.join('|'));
    assert.ok(complete.includes(norm(lesson.answer)), `${id}:${lesson.label}: caption result reaches drawing (${complete})`);
    const reset = core.stateAt(cs, 0, { nums: lab.s, sets: lab.s, step: lab.s.step });
    assert.equal(reset.sets.phShowAnswer, false);
    assert.equal(reset.sets.phSupportReady, false);
    assert.equal(reset.sets.phCountReady, false);
  }
});

test('random manual questions do not replace the lesson fixed drawing', () => {
  for (const id of ids) {
    const lesson = core.lessonList(lab.def.lessons[id])[0];
    const before = frame(id, lesson, 0);
    lab.scene.ph.reroll(lab.s);
    const after = lab.draw();
    assert.deepEqual(after.texts, before.texts, id + ': random problem does not replace lesson labels');
    // Compare actual projected geometry/styles; the legacy p1-5 draw fits its viewport after painting.
    const geometry = paths => JSON.stringify(paths.map(({ points, options }) => ({ points, options })));
    assert.ok(geometry(after.paths) === geometry(before.paths), id + ': random problem does not replace lesson geometry');
  }
});
