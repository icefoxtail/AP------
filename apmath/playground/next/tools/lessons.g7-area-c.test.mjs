// Minimal source-math and drawing-cue checks. These are not a full mobile or
// independent visual audit of the lessons.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/area-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['c1-trap', 'c2-frame', 'c3-road'];
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const area = polygon => Math.abs(polygon.reduce((total, p, i) => { const q = polygon[(i + 1) % polygon.length]; return total + p.x * q.y - p.y * q.x; }, 0)) / 2;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const point = (x, y) => ({ x, y });
function state(id, index = 0, time) {
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[index], compiled = core.compileLesson(lesson);
  const initial = { ...lab.s, ...compiled.start };
  const current = core.stateAt(compiled, time ?? compiled.length, { nums: initial, sets: {}, step: 0, part: 0 });
  const s = { ...initial, ...current.nums, ...current.sets, step: current.step, part: current.part, lessonOn: true, lessonEntry: false };
  return { lesson, compiled, s, source: lab.scene.ar, model: lab.scene.ar.model({ ...s }) };
}
function draw(id, index, time, { entry = false, width = 1000 } = {}) {
  const current = state(id, index, time);
  Object.assign(lab.s, current.s, { lessonOn: !entry, lessonEntry: entry });
  lab.tab = 'review';
  lab.setViewportWidth(width);
  lab.board.resize(width, width < 500 ? 420 : 650);
  return lab.draw();
}
const has = (frame, pattern) => frame.texts.some(text => pattern.test(text));
const signature = frame => JSON.stringify(frame.paths.map(path => path.points));

test('three source scenes register seven valid lessons with independent reset and final-answer contracts', () => {
  let count = 0;
  for (const id of ids) {
    const lessons = core.lessonList(lab.def.lessons[id]); count += lessons.length;
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    for (const [index, lesson] of lessons.entries()) {
      const first = state(id, index, 0), end = state(id, index);
      assert.equal(first.s.arShowAnswer, false); assert.equal(end.s.arShowAnswer, true);
      const reveal = end.compiled.cues.filter(cue => cue.set?.arShowAnswer);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}: ${key}`);
    }
  }
  assert.equal(count, 7);
});

test('the three trapezoid questions and both area methods agree with actual polygon coordinates', () => {
  for (const [index, expected] of [[0, 14], [1, 42], [2, 12]]) {
    const { model: m, source, lesson } = state('c1-trap', index), g = source.geo(m);
    near(m.a, 4); near(m.B, 10); near(m.H, 6); assert.equal(m.q, index);
    near(area(g.trap), 42);
    const lower = area([g.BL, g.BR, g.TL]), upper = area([g.TL, g.TR, g.BR]);
    near(lower, 30); near(upper, 12); near(lower + upper, area(g.trap));
    // A half-turn around the shared slanted-side midpoint gives the exact
    // second trapezoid; its bottom endpoint is a+B units from the original BL.
    const pivot = point((g.BR.x + g.TR.x) / 2, (g.BR.y + g.TR.y) / 2);
    const copy = g.trap.map(p => point(2 * pivot.x - p.x, 2 * pivot.y - p.y));
    near(area(copy), area(g.trap));
    near(distance(g.BL, copy[3]), 14);
    const parallelogram = [g.BL, copy[3], copy[0], g.TL];
    near(area(parallelogram), 84); near(area(parallelogram) / 2, 42);
    assert.equal(source.prob(m).choices.find(choice => choice.ok).v, expected);
    assert.equal(lesson.answer, String(expected));
  }
  assert.equal(state('c1-trap', 1, 0).model.mode, 1);
  assert.equal(state('c1-trap', 1, 23).model.mode, 0);
  near(state('c1-trap', 1, 28).s.c1T, 0);
  near(state('c1-trap', 1, 38.5).s.c1T, 1);
});

test('the grid triangle equals the rectangle minus its three coordinate-derived corners', () => {
  const { model: m, source } = state('c2-frame'), g = source.geo(m);
  near(m.W, 8); near(m.H, 6); near(m.a, 2); near(m.x, 3);
  const corners = [g.c1, g.c2, g.c3].map(area);
  [8, 6, 15].forEach((expected, i) => near(corners[i], expected));
  near(area(g.tri), 19);
  near(area(g.tri) + corners.reduce((sum, value) => sum + value, 0), m.W * m.H);
  near(m.A, area(g.tri)); near(m.R, 48);
  assert.equal(source.prob(m).choices.find(choice => choice.ok).v, 19);
});

test('straight and slanted road polygons preserve grass area and count the road intersection once', () => {
  for (const [index, mode] of [[0, 0], [1, 1], [2, 0]]) {
    const { model: m, source, lesson } = state('c3-road', index), p = source.pieces(m);
    near(m.W, 14); near(m.H, 8); near(m.x, 2); assert.equal(m.mode, mode);
    const grass = [p.UL, p.UR, p.LL, p.LR].reduce((sum, polygon) => sum + area(polygon), 0);
    near(grass, 72); near(m.A, grass);
    const vertical = [point(p.e(0), 0), point(p.e(0) + m.x, 0), point(p.e(m.H) + m.x, m.H), point(p.e(m.H), m.H)];
    const crossing = [point(p.e(m.h1), m.h1), point(p.e(m.h1) + m.x, m.h1), point(p.e(m.h1 + m.x) + m.x, m.h1 + m.x), point(p.e(m.h1 + m.x), m.h1 + m.x)];
    near(area(vertical), 16); near(area(crossing), 4);
    const road = area(vertical) + m.W * m.x - area(crossing);
    near(road, 40); near(road + grass, m.W * m.H);
    if (mode) {
      near(p.e(0) - p.e(m.H), 2);
      const perpendicularWidth = m.x / Math.hypot(1, m.sl / m.H);
      assert.ok(perpendicularWidth < m.x, 'the given width is horizontal, not perpendicular to the slanted road');
      assert.ok(lesson.chapters[0].cues.some(cue => /가로로 잰 폭/.test(cue.say)));
    }
    assert.equal(lesson.answer, index === 2 ? '40' : '72');
    assert.equal(source.prob(m).choices.find(choice => choice.ok).v, 72, 'original problem asks for grass');
  }
});

test('all seven lessons move actual source pieces within the first second', () => {
  for (const id of ids) for (const [index, lesson] of core.lessonList(lab.def.lessons[id]).entries()) {
    const entry = draw(id, index, 0, { entry: true }), moving = draw(id, index, 0.99), end = draw(id, index, core.compileLesson(lesson).length);
    assert.ok(entry.paths.length > 0 && end.paths.length > 0);
    assert.notEqual(signature(entry), signature(moving), `${id}/${lesson.label}: actual piece movement`);
    assert.ok(!entry.value.card && !entry.value.formula && entry.value.readouts.length === 0);
  }
});

test('trapezoid base, total area and partial area appear at their own stated cues', () => {
  assert.ok(!has(draw('c1-trap', 0, 26.9), /붙인 밑변.*14|밑변.*= 14/));
  assert.ok(has(draw('c1-trap', 0, 27), /붙인 밑변.*14cm/));
  assert.ok(has(draw('c1-trap', 1, 11), /붙인 밑변.*14cm/));
  assert.ok(!has(draw('c1-trap', 1, 16.9), /평행사변형.*84cm²/));
  assert.ok(has(draw('c1-trap', 1, 17), /평행사변형.*84cm²/));
  assert.ok(has(draw('c1-trap', 1, 39), /①.*30cm²/));
  assert.ok(!has(draw('c1-trap', 1, 42.9), /②.*12cm²/));
  assert.ok(has(draw('c1-trap', 1, 43), /②.*12cm²/));
  assert.ok(!has(draw('c1-trap', 1, 51.9), /42cm²/));
  assert.ok(has(draw('c1-trap', 1, 52), /42cm²/));
  assert.ok(!has(draw('c1-trap', 2, 26.9), /△ACD.*12cm²/));
  assert.ok(has(draw('c1-trap', 2, 27), /△ACD.*12cm²/));
  assert.ok(has(draw('c1-trap', 0, 27, { width: 390 }), /붙인 밑변.*14cm/), 'compact lesson no longer suppresses its answer');
});

test('grid-triangle givens and calculations remain available in the compact drawing branch', () => {
  const compact = { width: 390 }, entry = draw('c2-frame', 0, 0, { ...compact, entry: true });
  for (const given of [/가로 8칸/, /^6칸$/, /^2칸$/, /^3칸$/]) assert.ok(has(entry, given));
  assert.ok(!has(draw('c2-frame', 0, 10.9, compact), /직사각형.*48cm²/));
  assert.ok(has(draw('c2-frame', 0, 11, compact), /직사각형.*48cm²/));
  assert.ok(has(draw('c2-frame', 0, 22, compact), /①.*= 8cm²/));
  assert.ok(has(draw('c2-frame', 0, 28, compact), /②.*= 6cm²/));
  assert.ok(has(draw('c2-frame', 0, 34, compact), /③.*= 15cm²/));
  assert.ok(has(draw('c2-frame', 0, 40, compact), /①\+②\+③.*= 29/));
  assert.ok(!has(draw('c2-frame', 0, 49.9, compact), /△ABC.*19cm²/));
  assert.ok(has(draw('c2-frame', 0, 50, compact), /△ABC.*19cm²/));
});

test('grass and road lessons keep their different final answers separate', () => {
  for (const [index, widthTime, heightTime, finalTime] of [[0, 6, 17, 28], [1, 8, 18, 29]]) {
    assert.ok(!has(draw('c3-road', index, widthTime - 0.1), /남은 가로.*12m/));
    assert.ok(has(draw('c3-road', index, widthTime), /남은 가로.*12m/));
    assert.ok(!has(draw('c3-road', index, heightTime - 0.1), /남은 세로.*6m|직사각형 12m/));
    assert.ok(has(draw('c3-road', index, heightTime), /남은 세로.*6m/));
    assert.ok(!has(draw('c3-road', index, finalTime - 0.1), /잔디밭.*72m²/));
    assert.ok(has(draw('c3-road', index, finalTime), /잔디밭.*72m²/));
  }
  assert.ok(has(draw('c3-road', 2, 23), /잔디밭.*72m²/));
  assert.ok(!has(draw('c3-road', 2, 28.4), /땅 전체.*112m²/));
  assert.ok(has(draw('c3-road', 2, 28.5), /땅 전체.*112m²/));
  assert.ok(!has(draw('c3-road', 2, 38.9), /길 =.*40m²/));
  assert.ok(has(draw('c3-road', 2, 39), /길 =.*40m²/));
});
