// Source questions, independent geometry, and production Board/Player checks.
// Full browser/mobile visual QA is a later task, not certified by these tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/quadrilaterals-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const counts = { 'q5-1': 4, 'q5-2': 4, 'q5-3': 4, 'q5-4': 3, 'q5-5': 4, 'q6-1': 3, 'q6-2': 4, 'q6-3': 3, 'q6-4': 5, 'q6-5': 4, 'q6-6': 3 };
const expected = { 'q5-1': [null, 21, 9, 9], 'q5-2': [null, null, 4, 6], 'q5-3': [null, null, 4, 4], 'q5-4': [null, 8, 9], 'q5-5': [null, 12, 24, 8], 'q6-1': [null, 60, 30], 'q6-2': [null, null, 60, 120], 'q6-3': [null, 20, 115], 'q6-4': [null, 75, 150, 15, 75], 'q6-5': [null, null, 60, 4], 'q6-6': [null, 9, 36] };
const ids = Object.keys(counts);
const near = (a, b, why = '', tolerance = 1e-8) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < tolerance, `${why}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = points => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2;
function angle(v, a, b) { const x = a.x - v.x, y = a.y - v.y, u = b.x - v.x, w = b.y - v.y; return Math.acos(Math.max(-1, Math.min(1, (x * u + y * w) / (Math.hypot(x, y) * Math.hypot(u, w))))) * 180 / Math.PI; }
function foot(p, a, b) { const dx = b.x - a.x, dy = b.y - a.y, t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy); return { x: a.x + t * dx, y: a.y + t * dy }; }
function reflect(p, a, b) { const f = foot(p, a, b); return { x: 2 * f.x - p.x, y: 2 * f.y - p.y }; }
const clean = text => String(text).replace(/\s/g, '');
function state(id, index = 0, time) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const source = lab.scene.qd, lesson = video.lessonList(lab.def.lessons[id])[index], compiled = video.compileLesson(lesson), base = { ...lab.s, ...compiled.start };
  const value = video.stateAt(compiled, time ?? compiled.length, { nums: base, sets: {}, step: 0, part: null });
  const s = { ...base, ...value.nums, ...value.sets, step: value.step, part: value.part, lessonOn: true, lessonEntry: false };
  const model = source.model(s); return { source, lesson, compiled, s, model, quiz: source.prob(model, s) };
}
function draw(id, index = 0, time, entry = false) {
  const result = state(id, index, time);
  Object.assign(lab.s, result.s, { lessonOn: !entry, lessonEntry: entry });
  if (entry) Object.assign(lab.s, { step: 99, qdShowAnswer: true, qdCalculationReady: true });
  lab.tab = 'review'; return { ...result, frame: lab.draw() };
}

test('eleven scenes register forty-one distinct valid lessons with source choices and complete resets', () => {
  let total = 0;
  for (const id of ids) {
    const list = video.lessonList(lab.def.lessons[id]), validation = video.validateLessonSet(list);
    assert.equal(list.length, counts[id]); assert.deepEqual(validation.errors, [], id); assert.deepEqual(validation.warnings, [], id);
    for (const [i, lesson] of list.entries()) {
      total++; const first = state(id, i, 0), end = state(id, i), set = lesson.chapters[0].cues[0].set;
      assert.equal(typeof set.qdLessonProblem, 'boolean'); assert.equal(set.qdShowAnswer, false); assert.equal(set.qdCalculationReady, false); assert.equal(set.qdSeed, 0);
      assert.deepEqual(Array.from(set.qdOrd).sort(), [0, 1, 2, 3, 4]);
      const reveal = end.compiled.cues.filter(cue => cue.set?.qdShowAnswer === true);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, lesson.chapters.length - 1);
      assert.equal(/[√]|\\sqrt/.test(JSON.stringify(lesson)), false);
      const rewind = video.stateAt(end.compiled, 0, { nums: first.s, sets: Object.fromEntries(end.compiled.setKeys.map(k => [k, 'stale sibling'])), step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], set[key], `${id}/${i}: ${key}`);
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const key of Object.keys(cue.to || {})) assert.equal(Object.hasOwn(set, key), false, `${id}/${i}: set must not override animated ${key}`);
      if (first.s.qdLessonProblem) {
        near(Number.parseFloat(first.quiz.choices.find(c => c.ok).p), expected[id][i], `${id}/${i}`);
        assert.equal(first.quiz.key, end.quiz.key); assert.equal(first.quiz.stem, end.quiz.stem); assert.equal(JSON.stringify(first.quiz.choices), JSON.stringify(end.quiz.choices));
        assert.equal(first.quiz.choices.length, 5); assert.equal(first.quiz.choices.filter(c => c.ok).length, 1);
        const html = lab.scene.question(first.s); assert.ok(html.includes(first.quiz.stem)); assert.doesNotMatch(html, /undefined|NaN/);
        for (const choice of first.quiz.choices) assert.ok(html.includes(choice.h ?? choice.t ?? choice.p));
        for (const marker of '①②③④⑤') assert.equal(html.split(marker).length - 1, 1, `${id}/${i}: original choices exactly once`);
      } else assert.ok(first.s.qdCQuestion, `${id}/${i}: focused concept question`);
    }
  }
  assert.equal(total, 41);
});

test('equal-area replacements, parallel sliding, and area ratios agree with polygon determinants', () => {
  const q = state('q5-1', 1).model;
  near(area([q.A, q.B, q.C, q.D]), 21); near(area([q.A, q.B, q.E]), 21);
  near(area([q.A, q.C, q.D]), area([q.A, q.C, q.E])); near(area([q.A, q.C, q.E]), 9);
  const first = state('q5-2', 0, 0), last = state('q5-2', 0), m = last.model;
  assert.notEqual(first.model.A.x, m.A.x); near(first.model.A.y, m.A.y);
  near(area([first.model.A, m.B, m.C]), area([m.A, m.B, m.C])); near(area([m.A, m.B, m.C]), 10);
  near(area([m.A, m.B, m.D]), 4); near(area([m.A, m.D, m.C]), 6);
  near(area([m.A, m.B, m.D]) / area([m.A, m.D, m.C]), distance(m.B, m.D) / distance(m.D, m.C));
});

test('the trapezoid product uses two common-height pairs rather than claiming three equal heights', () => {
  const m = state('q5-3', 1).model;
  const u = area([m.A, m.O, m.D]), d = area([m.B, m.O, m.C]), l = area([m.A, m.B, m.O]), r = area([m.D, m.C, m.O]);
  near(l, r); near(u / l, distance(m.D, m.O) / distance(m.B, m.O)); near(r / d, distance(m.D, m.O) / distance(m.B, m.O)); near(u * d, l * r);
  near(u / d, 1 / 16); near(l / u, 4); near((l + d) / l, 5);
  assert.match(state('q5-3').source.steps(m)[2], /각각 비교/);
});

test('opposite triangle sums and an edge point preserve the correct half area', () => {
  const m = state('q5-4', 1).model, total = area([m.A, m.B, m.C, m.D]);
  const left = area([m.P, m.A, m.B]), right = area([m.P, m.C, m.D]), top = area([m.P, m.D, m.A]), bottom = area([m.P, m.B, m.C]);
  near(total, 24); near(left, 4); near(right, 8); near(top, 9); near(bottom, 3); near(left + right, total / 2); near(top + bottom, total / 2);
  const first = state('q5-5', 0, 0), last = state('q5-5', 0); assert.notEqual(first.model.E.x, last.model.E.x);
  for (const q of [first.model, last.model]) { near(area([q.E, q.B, q.C]), 12); near(area([q.A, q.B, q.E]) + area([q.E, q.C, q.D]), 12); }
  const p = state('q5-5', 2).model; near(area([p.A, p.B, p.E]), 4); near(area([p.E, p.C, p.D]), 8);
});

test('both folding constructions match independent reflection, isosceles, and perpendicular-bisector geometry', () => {
  const a = state('q6-1', 1).model;
  near(distance(reflect(a.D, a.A, a.C), a.Dp), 0); near(distance(a.E, a.A), distance(a.E, a.C));
  near(angle(a.A, a.D, a.C), 30); near(angle(a.E, a.A, a.B), 60);
  const b = state('q6-2', 2).model, middle = { x: (b.A.x + b.C.x) / 2, y: (b.A.y + b.C.y) / 2 };
  near(distance(reflect(b.C, b.E, b.F), b.A), 0); near(distance(foot(middle, b.E, b.F), middle), 0);
  near(angle(middle, b.A, b.E), 90); near(angle(b.E, b.A, b.F), 60); near(angle(b.F, b.E, b.D), 120);
  const lengths = [[b.A, b.E], [b.E, b.C], [b.C, b.F], [b.F, b.A]].map(([x, y]) => distance(x, y));
  lengths.forEach(value => near(value, lengths[0]));
});

test('folding lessons actually move original polygons continuously and finish at their reflected destinations', () => {
  for (const [id, index] of [['q6-1', 1], ['q6-2', 2]]) {
    const get = time => draw(id, index, time).frame.paths.find(path => path.options.color === 'amber' && path.options.width === 3.2 && path.options.close)?.points;
    const a = get(0), b = get(2.5), z = get(5); assert.ok(a && b && z); assert.notDeepEqual(a, b); assert.notDeepEqual(b, z);
    const m = state(id, index).model, endpoint = id === 'q6-1' ? m.Dp : m.G;
    near(distance(z[2], endpoint), 0); if (id === 'q6-2') near(distance(z[1], m.A), 0);
    const original = id === 'q6-1' ? m.D : m.D, axis = id === 'q6-1' ? [m.A, m.C] : [m.E, m.F];
    near(distance(b[2], foot(original, ...axis)), 0, 'half fold lies on its crease');
  }
});

test('square diagonal and equilateral combination answers agree with coordinate angles', () => {
  const d = state('q6-3', 1).model;
  near(distance(d.E, foot(d.E, d.A, d.C)), 0); near(distance(d.B, d.E), distance(d.D, d.E));
  near(angle(d.E, d.B, d.C), 65); near(angle(d.D, d.A, d.E), 20); near(angle(d.E, d.A, d.D), 115);
  const e = state('q6-4', 1).model;
  near(distance(e.B, e.E), distance(e.B, e.C), 'equilateral sides', 1e-6);
  near(angle(e.A, e.B, e.E), 75, 'BAE', 1e-5); near(angle(e.E, e.A, e.D), 150, 'AED', 1e-5);
  near(angle(e.A, e.E, e.D), 15, 'EAD', 1e-5); near(angle(e.E, e.A, e.B), 75, 'AEB', 1e-5);
});

test('square side matching proves equal perpendicular segments and uses the actual thirty-degree question geometry', () => {
  const base = state('q6-5', 0).model;
  near(distance(base.A, base.E), distance(base.B, base.F)); near(angle(base.Pp, base.A, base.B), 90);
  const m = state('q6-5', 2).model, q = m.g2;
  near(angle(q.A, q.B, q.E), 30); near(angle(q.F, q.B, q.C), 60); near(distance(q.B, q.E), distance(q.C, q.F));
  const path = draw('q6-5', 2, 2.5).frame.paths.find(p => p.options.color === 'green' && p.options.width === 4);
  assert.ok(path, 'first cue traces the question line'); near(distance(path.points[0], q.A), 0);
  near(distance(path.points[1], foot(path.points[1], q.A, q.E)), 0, 'trace stays on actual AE');
  const length = state('q6-5', 3).model; near(distance(length.F, length.D), 4);
});

test('rotated overlap stays one quarter while shape changes and quarter-turn copies tile the square', () => {
  const { source, s } = state('q6-6', 0), sizes = [4, 6, 8];
  for (const size of sizes) for (const phase of [0, .12, .28, .5, .62, 1]) {
    const m = source.model({ ...s, qfSp: size, qfRot: phase }), overlap = area(m.over), total = area([m.A, m.B, m.C, m.D]);
    near(total, size * size); near(overlap * 4, total); near(angle(m.O, m.sq2[1], m.sq2[3]), 90);
  }
  const a = source.model({ ...s, qfRot: 0 }), b = source.model({ ...s, qfRot: .28 });
  const perimeter = p => p.reduce((sum, v, i) => sum + distance(v, p[(i + 1) % p.length]), 0);
  assert.ok(Math.abs(perimeter(a.over) - perimeter(b.over)) > .01, 'different angles can give noncongruent overlap shapes');
  assert.match(source.steps(b)[1], /현재 두 경계 반직선/); assert.doesNotMatch(source.steps(b)[1], /잘라 내는 모양은 합동/);
});

for (const id of ids) test(`${id}: all authored cues draw real finite geometry and gate the final caption`, () => {
  for (const [i] of video.lessonList(lab.def.lessons[id]).entries()) {
    const end = state(id, i), reveal = end.compiled.cues.find(c => c.set?.qdShowAnswer === true), answer = clean(reveal.set.qdCCap);
    for (const time of [0, 2.5, ...end.compiled.cues.map(c => c.at), end.compiled.length]) {
      const result = draw(id, i, time), frame = result.frame;
      assert.ok(frame.paths.some(p => p.points.length > 1)); assert.doesNotMatch(frame.texts.join(' '), /undefined|NaN/);
      assert.equal(frame.value.readouts.length, 0); assert.equal(frame.value.formula, null); assert.equal(frame.value.rule, null);
      if (time < reveal.at) assert.equal(clean(frame.texts.join('')).includes(answer), false, `${id}/${i} at ${time}: target stays hidden`);
    }
    const entry = draw(id, i, end.compiled.length, true).frame;
    assert.equal(clean(entry.texts.join('')).includes(answer), false, `${id}/${i}: entry ignores stale answer and step`);
    assert.equal(clean(draw(id, i, reveal.at).frame.texts.join('')).includes(answer), true, `${id}/${i}: conclusion is present`);
  }
});

test('actual Player replay and release preserve fold/rotation manual controls and the original reroll handler', async () => {
  const runtime = await load(), environment = {
    window: { APLab: { videoCore: video, h() {}, labHooks: [] }, matchMedia: () => ({ matches: false }) },
    document: { body: { classList: { remove() {}, add() {}, toggle() {} } } },
    location: { pathname: '/', search: '', hash: '' }, history: { replaceState() {} }, performance, setTimeout, clearTimeout,
    cancelAnimationFrame() {}, requestAnimationFrame() { return 0; }, console
  };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-player.js', import.meta.url), 'utf8'), environment);
  for (const [id, index, key] of [['q6-1', 1, 'qfT'], ['q6-2', 2, 'qfT'], ['q6-6', 1, 'qfRot']]) {
    Object.assign(runtime.s, { lessonOn: false, lessonEntry: false }); runtime.go(id); runtime.draw(); runtime.newProblem();
    const player = Object.create(environment.window.APLab.Player.prototype);
    Object.assign(player, { lab: runtime, state: 'idle', _cache: new WeakMap(), _goScene: () => runtime.go(id), _clearTaskNote() {}, _renderTicks() {}, _layout() {}, _showTitle() {}, _syncUi() {}, ui: { end: {}, entry: {}, bar: { dataset: {} } }, rate: 1 });
    runtime._tabAvailable = () => true; runtime.ui = { stage: { append() {} } };
    let initial;
    for (const replay of [false, true]) {
      player.state = 'idle'; if (replay) player.replay(); else player.play(runtime.index, index);
      const question = runtime.scene.question(runtime.s); if (initial) assert.equal(question, initial); else initial = question;
      const pick = { key: 'manual choice', idx: 2 }; runtime.s.qdPick = pick; runtime.s.qdQuestionKey = 'manual question';
      player.t = player.cs.length; player.apply(); assert.equal(runtime.s.qdPick, pick); assert.equal(runtime.s.qdQuestionKey, 'manual question');
      player.state = 'ended'; player._release(); assert.equal(!!runtime.s.lessonOn, false); assert.equal(runtime.tab, 'explore');
      runtime.s[key] = 0; const a = runtime.draw(); runtime.s[key] = .5; const b = runtime.draw();
      assert.notDeepEqual(a.paths.map(p => p.points), b.paths.map(p => p.points), `${id}: manual movement remains active`);
      assert.ok(b.value.guide); runtime.newProblem();
      const d = runtime.scene.qd, quiz = d.prob(d.model(runtime.s), runtime.s);
      assert.equal(quiz.choices.length, 5); assert.equal(quiz.choices.filter(c => c.ok).length, 1); assert.equal(runtime.s.qdPick, null);
    }
  }
});
