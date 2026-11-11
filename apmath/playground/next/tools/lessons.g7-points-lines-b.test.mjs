// Source math and production Board checks; full browser/mobile visual QA is separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { load } from './helpers/points-lines-lesson-runtime.mjs';
const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const box = { window: {} }; vm.createContext(box);
vm.runInContext(fs.readFileSync(new URL('../labs/g7-points-lines/lesson-b.js', import.meta.url), 'utf8'), box);
const lessons = box.window.APL_LESSONS['g7-points-lines'], lab = await load();
const list = Object.entries(lessons).flatMap(([id, value]) => core.lessonList(value).map(l => [id, l]));
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} differs from ${b}`);
const norm = s => String(s).replace(/\s+/g, ''), mod = (x, n) => ((x % n) + n) % n;
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const slopeAngle = p => mod(Math.atan2(-p.y, p.x) * 180 / Math.PI, 360);
const clockAngle = p => mod(Math.atan2(p.x, -p.y) * 180 / Math.PI, 360);
const origin = { x: 0, y: 0 };
function init(id, l) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  const cs = core.compileLesson(l); return { scene: lab.scene, cs, s: { ...lab.s, ...cs.start, ...cs.cues[0].set } };
}
function at(cs, s, t) {
  const q = core.stateAt(cs, t, { nums: s, sets: s, step: 0, part: 0 });
  return { ...s, ...cs.start, ...q.nums, ...q.sets, step: q.step, part: q.part, lessonOn: true, lessonEntry: false };
}
function draw(s, width = 1000) {
  Object.assign(lab.s, s); lab.setViewportWidth(width); lab.board.resize(width, width < 500 ? 440 : 650);
  lab.board.setFocus(lab.scene.focus(lab.s), true);
  const arcs = [], arc = lab.board.arc;
  lab.board.arc = function (center, r, a0, a1, options = {}) { arcs.push({ center, r, a0, a1, options }); return arc.call(this, center, r, a0, a1, options); };
  try { return { ...lab.draw(), arcs }; } finally { lab.board.arc = arc; }
}
const visible = d => d.paths.some(p => p.options.color !== null && p.points.some(q => distance(q, p.points[0]) > 1e-6)) || d.arcs.some(a => a.r > 0 && a.a0 !== a.a1 && (a.options.color !== null || a.options.fill));
const signature = d => JSON.stringify({ paths: d.paths.map(p => ({ points: p.points, options: p.options })), arcs: d.arcs });
const question = (scene, s) => typeof scene.question === 'function' ? scene.question(s) : scene.question;
const endpoint = (d, color, width) => {
  const p = d.paths.find(p => p.options.color === color && p.options.width === width && p.points.length === 2);
  assert.ok(p, `${color} ${width} geometric segment exists`); return p.points[1];
};

test('8 angle scenes register 19 lessons with valid timing and resets', () => {
  assert.equal(Object.keys(lessons).length, 8); assert.equal(list.length, 19);
  for (const [id, value] of Object.entries(lessons)) {
    const result = core.validateLessonSet(value); assert.deepEqual(result.errors, [], id); assert.deepEqual(result.warnings, [], id);
    assert.equal(lab.list.filter(s => s.id === id).length, 1); assert.equal(core.lessonList(lab.def.lessons[id]).length, value.length);
  }
});

for (const [id, value] of Object.entries(lessons)) test(`${id}: source questions and independent figure math`, () => {
  for (const l of value) {
    const { scene, cs, s } = init(id, l), end = at(cs, s, cs.length), q = scene.__sv(end), D = scene.__spec, frame = draw(end), problem = D.problem(q), selected = problem.choices.find(c => c.ok);
    if (id === 'ck1' || id === 'ck2') {
      const shownMinute = q.plBAsk === 'speed' ? 1 : q.m;
      const hour = (q.h % 12) * 360 / 12 + shownMinute * 360 / 720, minute = shownMinute * 360 / 60;
      near(clockAngle(endpoint(frame, 'amber', 8)), hour); near(clockAngle(endpoint(frame, 'sky', 5)), minute);
      const raw = Math.abs((q.h % 12) * 30 + q.m / 2 - q.m * 6), gap = Math.min(raw, 360 - raw);
      near(selected.v, gap);
      if (id === 'ck1') { near(hour, 109.5); near(minute, 234); near(gap, 124.5); }
      else if (q.plBAsk === 'speed') { near(minute - 6 * q.m - (hour - (q.h % 12) * 30), 5.5); }
      else { near(5.5 * q.m, 110); near(gap, 20); }
    } else if (id === 'vt') {
      const n = q.plBAsk === 'count' ? 4 : 2, lines = frame.paths.filter(p => ['sky', 'muted'].includes(p.options.color) && [3, 4.5].includes(p.options.width) && p.points.length === 2 && distance(p.points[0], p.points[1]) > 3);
      assert.equal(lines.length, n); for (const line of lines) { near(line.points[0].x + line.points[1].x, 0); near(line.points[0].y + line.points[1].y, 0); }
      near(q.th, 55);
      let pairs = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs += 2;
      near(selected.v, q.plBAsk === 'count' ? pairs : q.plBAsk === 'c' ? 55 : 125);
    } else if (id === 've') {
      near((q.b2 - q.b1) / (q.a1 - q.a2), 15); near(q.a1 * 15 + q.b1, 55); near(q.a2 * 15 + q.b2, 55);
      const rays = frame.paths.filter(p => p.options.color === 'sky' && p.options.width === 4.5 && p.points.length === 2 && distance(p.points[0], origin) < 1e-9);
      assert.equal(rays.length, 2); near(slopeAngle(rays[0].points[1]), 55); near(slopeAngle(rays[1].points[1]), 235);
      near(selected.v, q.plBAsk === 'x' ? 15 : 55);
    } else if (id === 'th') {
      const angles = frame.paths.filter(p => p.options.color === 'sky' && p.options.width === 4.5 && p.points.length === 2).map(p => mod(slopeAngle(p.points[0]), 180)).sort((a, b) => a - b);
      assert.equal(angles.length, 3); near(angles[0], 0); near(angles[1], 40); near(angles[2], 100);
      near(angles[1] - angles[0], 40); near(angles[2] - angles[1], 60); near(180 - angles[2], 80);
      near((180 - 35 - 60 - 60) / (1 + 4), 5); near(selected.v, 5);
      if (q.plBAsk === 'x') assert.match(problem.stem, /x\+35.*60.*4x\+60/);
    } else if (id === 'pd') {
      const perpendicular = frame.paths.find(p => p.options.color === 'rose' && p.options.width === 5.5), slanted = frame.paths.find(p => p.options.color === 'violet' && p.options.width === 3.5);
      near(perpendicular.points[0].x, perpendicular.points[1].x); near(perpendicular.points[1].y, 0); near(distance(...perpendicular.points), 4); near(distance(...slanted.points), 5);
      if (q.plBAsk === 'foot') assert.match(selected.t, /점 H.*수선의 발/);
      if (q.plBAsk === 'distance') assert.match(selected.t, /거리는 4 cm/);
    } else if (id === 'bs') {
      const rays = frame.paths.filter(p => p.options.color === 'green' && p.options.width === 3.5), directions = rays.map(p => slopeAngle(p.points[1]));
      assert.equal(rays.length, 2); near(directions[0], 145); near(directions[1], q.T === 180 ? 55 : 85);
      near(Math.abs(directions[0] - directions[1]), q.T / 2); near(selected.v, q.T / 2);
      near(70 / 2, 35); near((q.T - 70) / 2, q.T === 180 ? 55 : 25);
    } else {
      const polygon = frame.paths.find(p => p.options.fill === 'sky' && p.points.length === 3); assert.ok(polygon);
      const [B, C, A] = polygon.points;
      if (q.plBAsk === 'height') { near(B.y, C.y); near(A.x, -2); assert.ok(A.x < B.x); near(Math.abs(A.y - B.y), 4); }
      else { near(distance(B, C), 3); near(distance(C, A), 4); near(distance(A, B), 5); near((B.x - C.x) * (A.x - C.x) + (B.y - C.y) * (A.y - C.y), 0); near(selected.v, 4); }
    }
    if (!['hour', 'minute', 'speed', 'sum', 'shortest', 'height'].includes(q.plBAsk)) assert.equal(question(scene, end), problem.stem);
    for (const [key, initial] of Object.entries(cs.start)) if (key !== 'plBMove') for (const time of [0, .99, cs.length / 2, cs.length]) near(at(cs, s, time)[key], initial);
    const stale = Object.fromEntries(cs.setKeys.map(k => [k, 'stale'])), reset = core.stateAt(cs, 0, { nums: s, sets: stale, step: 99, part: 99 });
    for (const key of cs.setKeys) assert.deepEqual(reset.sets[key], cs.cues[0].set[key]);
    assert.equal(reset.sets.plShowAnswer, false); assert.equal(end.plShowAnswer, true);
  }
});

for (const [id, l] of list) test(`${id}:${l.label}: first-second geometry, final-only answer and no lesson handles`, () => {
  const { cs, s } = init(id, l), first = at(cs, s, 0), moving = at(cs, s, .99), lastStart = l.chapters.slice(0, -1).reduce((sum, c) => sum + c.length, 0), before = at(cs, s, lastStart - .01), end = at(cs, s, cs.length), needle = norm(l.answer);
  for (const width of [390, 1000]) {
    const entry = draw({ ...first, lessonOn: false, lessonEntry: true, step: 99 }, width), motion = draw(moving, width), pre = draw(before, width), last = draw(end, width);
    assert.ok(visible(entry)); assert.ok(visible(last)); assert.notEqual(signature(entry), signature(motion));
    for (const key of ['card', 'formula', 'rule', 'status']) assert.equal(entry.value[key], null);
    assert.equal(entry.value.readouts.length, 0); assert.equal(entry.value.guide, ''); assert.equal(entry.handles.length, 0); assert.equal(last.handles.length, 0);
    for (const frame of [entry, motion, pre]) assert.ok(!frame.texts.some(t => norm(t).includes(needle)), `${width}: no early ${needle}`);
    assert.ok(last.texts.some(t => norm(t).includes(needle)), `${width}: final ${needle}`);
  }
});

test('numeric intermediate values follow the matching calculation cue', () => {
  const cases = [
    ['ck1', 0, 15, '30°×3=90°'], ['ck1', 0, 25, '0.5°×39=19.5°'],
    ['ck1', 2, 15, '=109.5°'], ['ck2', 1, 25, '=5.5°'], ['ck2', 1, 35, '=110°'],
    ['vt', 0, 15, '∠b=180°−55°=125°'], ['ve', 1, 35, 'x=15'],
    ['th', 1, 35, '5x=25'], ['bs', 0, 15, '●=70°÷2=35°'], ['bs', 0, 25, '×=(180°−70°)÷2=55°']
  ];
  for (const [id, index, time, target] of cases) {
    const { cs, s } = init(id, lessons[id][index]);
    assert.ok(!draw(at(cs, s, time - .01)).texts.some(t => norm(t).includes(target)), `${id}: hidden before ${time}`);
    assert.ok(draw(at(cs, s, time)).texts.some(t => norm(t).includes(target)), `${id}: appears at ${time}`);
  }
});

test('lesson wrapper preserves prefix practice state, avoids fit/review writes, and pauses manual tick', () => {
  const { scene, cs, s } = init('ck2', lessons.ck2[1]), current = at(cs, s, .99), expected = draw(current), originalBuild = lab._buildReview, originalMeasure = lab._measureFocus;
  let rebuilt = 0, measured = 0;
  lab._buildReview = () => { rebuilt++; }; lab._measureFocus = () => { measured++; throw new Error('lesson must not run the manual fit sweep'); };
  lab.refs.steps = { __sig: 'stale-review' };
  try {
    const state = { ...current, ck2_questionKey: 'previous-practice', ck2_pk: 'picked-key', ck2_pi: 3, revealed: true, playing: true };
    const actual = draw(state, 390); const aligned = draw(state, 1000);
    assert.equal(signature(aligned), signature(expected)); assert.equal(rebuilt, 0); assert.equal(measured, 0);
    assert.equal(lab.s.ck2_questionKey, 'previous-practice'); assert.equal(lab.s.ck2_pk, 'picked-key'); assert.equal(lab.s.ck2_pi, 3); assert.equal(lab.s.step, current.step);
    const minute = lab.s.ck2_m; assert.equal(scene.tick(lab.s, .5, lab), false); near(lab.s.ck2_m, minute);
    assert.equal(actual.value.formula, null);
  } finally { lab._buildReview = originalBuild; lab._measureFocus = originalMeasure; delete lab.refs.steps; }
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false, playing: true, ck2_acc: 0, ck2_m: 20 });
  assert.equal(scene.tick(lab.s, .2, lab), true); near(lab.s.ck2_m, 21);
  for (const id of Object.keys(lessons)) {
    const v = init(id, lessons[id][0]); lab.tab = 'explore';
    const manual = draw({ ...at(v.cs, v.s, v.cs.length), lessonOn: false, lessonEntry: false });
    assert.ok(manual.handles.length > 0, `${id}: original direct manipulation remains available`);
  }
});
