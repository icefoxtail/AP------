// Minimal math/registration/drawing safety checks; real mobile visual QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/parallel-lesson-runtime.mjs';
const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const box = { window: {} }; vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-parallel/lesson-b.js', import.meta.url), 'utf8'), box);
const lessons = box.window.APL_LESSONS['g7-parallel'];
const list = Object.entries(lessons).flatMap(([id, value]) => core.lessonList(value).map(l => [id, l]));
const lab = await load();
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} differs from ${b}`);
const norm = value => String(value).replace(/\s+/g, '');
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
function angle(p, o, q) {
  const ux = p.x - o.x, uy = p.y - o.y, vx = q.x - o.x, vy = q.y - o.y;
  return Math.acos(Math.max(-1, Math.min(1, (ux * vx + uy * vy) / Math.hypot(ux, uy) / Math.hypot(vx, vy)))) * 180 / Math.PI;
}
const right = p => ({ x: p.x + 1, y: p.y }), left = p => ({ x: p.x - 1, y: p.y });
function init(id, l) { lab.go(id); lab.tab = 'review'; const cs = core.compileLesson(l); return { scene: lab.scene, cs, s: { ...lab.s, ...cs.start, ...cs.cues[0].set } }; }
function at(cs, s, t) { const q = core.stateAt(cs, t, { nums: s, sets: s, step: 0, part: 0 }); return { ...s, ...cs.start, ...q.nums, ...q.sets, step: q.step, part: q.part, lessonOn: true, lessonEntry: false }; }
function draw(s, width = 1000) { Object.assign(lab.s, s); lab.setViewportWidth(width); lab.board.resize(width, width < 500 ? 440 : 650); return lab.draw(); }
const signature = d => JSON.stringify(d.paths.map(p => ({ points: p.points, options: p.options })));
const hasGeometry = d => d.paths.some(p => p.points.some(q => distance(q, p.points[0]) > 1e-5));
const question = (scene, s) => typeof scene.question === 'function' ? scene.question(s) : scene.question;

test('3 scenes register 6 independent lessons with complete reset sets', () => {
  assert.equal(Object.keys(lessons).length, 3); assert.equal(list.length, 6);
  for (const [id, value] of Object.entries(lessons)) {
    const result = core.validateLessonSet(value);
    assert.deepEqual(result.errors, [], id); assert.deepEqual(result.warnings, [], id);
    assert.equal(lab.list.filter(s => s.id === id).length, 1);
    assert.equal(core.lessonList(lab.def.lessons[id]).length, 2);
  }
});
for (const [id, l] of list) {
  const name = `${id}:${l.label}`;
  test(`${name}: fixed source givens and independent geometry agree`, () => {
    const { scene, cs, s } = init(id, l), end = at(cs, s, cs.length), M = scene.pa.model(end);
    const V = M.V || [M.B, M.C, M.A], n = V.length;
    for (let i = 0; i < n; i++) {
      near(distance(V[i], V[(i + 1) % n]), distance(V[0], V[1]));
      near(angle(V[(i + n - 1) % n], V[i], V[(i + 1) % n]), (n - 2) * 180 / n);
    }
    let actualA, actualB, total;
    if (id === 'p3-1') {
      near(M.B.y, -1.7); near(M.C.y, 1.7); assert.ok(M.A.y > M.B.y && M.A.y < M.C.y);
      actualA = angle(right(M.B), M.B, M.A); actualB = angle(right(M.C), M.C, M.A); total = 60;
      near(actualA, 24); near(actualB, 36); near(angle(M.B, M.A, M.C), 60);
    } else {
      const endIndex = id === 'p3-2' ? 2 : 3;
      near(V[0].y, -1.7); near(V[endIndex].y, 1.7);
      for (let i = 1; i < endIndex; i++) assert.ok(V[i].y > V[0].y && V[i].y < V[endIndex].y);
      actualA = angle(right(V[0]), V[0], V[1]); actualB = angle(right(V[endIndex]), V[endIndex], V[endIndex - 1]);
      near(M.I, (n - 2) * 180 / n); total = id === 'p3-2' ? 108 : 60;
      near(actualA, id === 'p3-2' ? 44 : 25); near(actualB, id === 'p3-2' ? 64 : 35);
      if (id === 'p3-3') {
        const c = angle(left(V[1]), V[1], V[2]), d = angle(left(V[2]), V[2], V[1]);
        near(c, 95); near(d, 85); near(c + d, 180); near(actualA + c, 120); near(d + actualB, 120);
      }
    }
    near(M.a, actualA); near(M.b, actualB); near(actualA + actualB, total);
    const Q = scene.pa.prob(M); near(Q.choices.find(c => c.ok).v, actualB);
    if (end.paBAsk === 'numeric') assert.equal(question(scene, end), Q.stem);
    for (const t of [0, .99, cs.length / 2, cs.length]) {
      const current = scene.pa.model(at(cs, s, t)); near(current.a, actualA); near(current.b, actualB);
    }
    for (const [key, tracks] of Object.entries(cs.tracks)) {
      assert.equal(typeof cs.start[key], 'number');
      for (const track of tracks) assert.ok(Number.isFinite(track.to) && track.to >= 0 && track.to <= 1);
    }
    const stale = Object.fromEntries(cs.setKeys.map(k => [k, 'stale'])), rewind = core.stateAt(cs, 0, { nums: s, sets: stale, step: 99, part: 99 });
    for (const key of cs.setKeys) assert.deepEqual(rewind.sets[key], cs.cues[0].set[key]);
    assert.equal(rewind.sets.paShowAnswer, false); assert.equal(end.paShowAnswer, true);
  });
  test(`${name}: real first-second line progress and final-only answer`, () => {
    const { cs, s } = init(id, l), first = at(cs, s, 0), moving = at(cs, s, .99), lastStart = l.chapters.slice(0, -1).reduce((sum, c) => sum + c.length, 0);
    const before = at(cs, s, lastStart - .01), end = at(cs, s, cs.length), needle = norm(l.answer);
    for (const width of [390, 1000]) {
      const entry = draw({ ...first, step: 0, lessonOn: false, lessonEntry: true }, width), motion = draw(moving, width), pre = draw(before, width), last = draw(end, width);
      assert.ok(hasGeometry(entry)); assert.ok(hasGeometry(last)); assert.notEqual(signature(entry), signature(motion));
      assert.ok(!entry.value.formula && !entry.value.card && (!entry.value.readouts || entry.value.readouts.length === 0));
      for (const frame of [entry, motion, pre]) assert.ok(!frame.texts.some(t => norm(t).includes(needle)), `${width}: no early ${needle}`);
      assert.ok(last.texts.some(t => norm(t).includes(needle)), `${width}: final ${needle}`);
      assert.ok(entry.texts.some(t => norm(t) === `a=${id === 'p3-1' ? 24 : id === 'p3-2' ? 44 : 25}°`), 'the given angle remains visible');
      if (id === 'p3-3') for (const frame of [entry, motion, pre]) assert.ok(!frame.texts.some(t => /(?:35|85|95)°/.test(t)), 'unknown-derived numeric values are not supplied early');
    }
  });
}

test('interior and sum calculations appear at their caption cues', () => {
  for (const [id, interior] of [['p3-2', 108], ['p3-3', 120]]) {
    const { cs, s } = init(id, lessons[id][1]);
    assert.ok(!draw(at(cs, s, 14.99)).texts.some(t => t.includes(interior + '°')));
    assert.ok(draw(at(cs, s, 15)).texts.some(t => t.includes(interior + '°')));
  }
  const { cs, s } = init('p3-3', lessons['p3-3'][1]);
  assert.ok(!draw(at(cs, s, 34.99)).texts.some(t => norm(t) === 'c+d=180°'));
  assert.ok(draw(at(cs, s, 35)).texts.some(t => norm(t) === 'c+d=180°'));
  assert.ok(!draw(at(cs, s, 44.99)).texts.some(t => norm(t) === '25°+x=60°'));
  assert.ok(draw(at(cs, s, 45)).texts.some(t => norm(t) === '25°+x=60°'));
});

test('manual practice state cannot replace the lesson or reset progress', () => {
  const { cs, s } = init('p3-3', lessons['p3-3'][1]), current = at(cs, s, 35), expected = draw(current);
  Object.assign(lab.s, current, { rReviewQuestion: true, paQuestionKey: 'stale', papick: 2, revealed: true });
  const actual = lab.draw(); assert.equal(signature(actual), signature(expected)); assert.deepEqual(actual.texts, expected.texts);
  assert.equal(lab.s.rReviewQuestion, true); assert.equal(lab.s.paQuestionKey, 'stale'); assert.equal(lab.s.papick, 2); assert.equal(lab.s.step, current.step);
  for (const id of Object.keys(lessons)) {
    const v = init(id, lessons[id][1]); lab.tab = 'explore';
    const manual = draw({ ...at(v.cs, v.s, v.cs.length), lessonOn: false, lessonEntry: false, rReviewQuestion: false });
    assert.ok(manual.handles.length > 0, `${id}: manual handles remain available`);
    assert.ok(manual.texts.some(t => norm(t).startsWith('b=')), `${id}: manual angle readout remains`);
  }
});
