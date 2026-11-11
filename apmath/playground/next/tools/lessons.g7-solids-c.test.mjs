// Independent checks of the fixed lesson conditions and their mathematical
// answers. Production registration/drawing checks live in the shared lab suite.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/solids-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['s3-1', 's3-2', 's3-3', 's3-4', 's3-5', 's4-1', 's4-2', 's4-3', 's4-4'];
const near = (a, b, why = '') => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const radius = p => Math.hypot(p.x, p.y);
const sectorArea = (r, angle) => Math.PI * r * r * angle / 360;
const O = { x: 0, y: 0 };

function state(id, index = 0, time) {
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[index];
  const compiled = core.compileLesson(lesson);
  const original = { ...lab.s, ...compiled.start };
  const current = core.stateAt(compiled, time ?? compiled.length, { nums: original, sets: {}, step: 0, part: 0 });
  const s = { ...original, ...current.nums, ...current.sets, step: current.step, part: current.part, lessonOn: true, lessonEntry: false };
  return { lesson, compiled, s, model: lab.scene.so.model({ ...s }), scene: lab.scene };
}

function closestToOrigin(a, b) {
  const vx = b.x - a.x, vy = b.y - a.y;
  const t = Math.max(0, Math.min(1, -(a.x * vx + a.y * vy) / (vx * vx + vy * vy)));
  return { x: a.x + t * vx, y: a.y + t * vy };
}

test('nine net/path scenes register seventeen valid lessons with final-chapter answers', () => {
  let count = 0;
  for (const id of ids) {
    const lessons = core.lessonList(lab.def.lessons[id]);
    count += lessons.length;
    const validation = core.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(validation.errors, [], id);
    assert.deepEqual(validation.warnings, [], id);
    assert.equal(lab.list.filter(scene => scene.id === id).length, 1);
    for (const [index, lesson] of lessons.entries()) {
      const first = state(id, index, 0), end = state(id, index);
      assert.equal(first.s.soShowAnswer, false);
      assert.equal(end.s.soShowAnswer, true);
      const answerCues = end.compiled.cues.filter(cue => cue.set?.soShowAnswer);
      assert.equal(answerCues.length, 1);
      assert.equal(answerCues[0].ch, lesson.chapters.length - 1);
      const stale = Object.fromEntries(end.compiled.setKeys.map(key => [key, 'previous lesson']));
      const rewind = core.stateAt(end.compiled, 0, { nums: first.s, sets: stale, step: 99, part: 99 });
      for (const key of end.compiled.setKeys) assert.deepEqual(rewind.sets[key], end.compiled.cues[0].set[key], `${id}: ${key}`);
    }
  }
  assert.equal(count, 17);
});

test('s3-1 cylinder net and lateral area use the original radius and height', () => {
  for (const index of [0, 1]) {
    const { model: m } = state('s3-1', index);
    near(m.r, 2); near(m.h, 4); near(m.t, 1);
    near(m.sol.rmax, m.r); near(m.sol.h, m.h);
    const width = 2 * Math.PI * m.r;
    near(width / Math.PI, 4);
    near(width * m.h / Math.PI, 16);
  }
  assert.equal(state('s3-1', 0).lesson.answer, '가로 4π, 세로 4');
  assert.equal(state('s3-1', 1).lesson.answer, '16π');
});

test('s3-2 cone arc, central angle and inverse slant all satisfy one circumference', () => {
  for (const index of [0, 1, 2]) {
    const { model: m } = state('s3-2', index);
    near(m.r, 3); near(m.R, 6); near(m.x, 180);
    const baseCircumference = 2 * Math.PI * m.r;
    const sectorArc = m.R * m.x * Math.PI / 180;
    near(baseCircumference, sectorArc);
    near(baseCircumference / Math.PI, 6);
    near(baseCircumference / (m.R * Math.PI / 180), m.x);
    near(baseCircumference / (m.x * Math.PI / 180), m.R);
  }
  assert.equal(state('s3-2', 1).lesson.answer, '180°');
  assert.equal(state('s3-2', 2).lesson.answer, 'R = 6 cm');
  assert.equal(state('s3-2', 2, 0).s.soAngleReady, true, 'inverse problem supplies the angle');
});

test('s3-3 both directions of the radius ratio agree with the sector fraction', () => {
  const direct = state('s3-3', 0), inverse = state('s3-3', 1);
  near(direct.model.r, 2); near(direct.model.R, 6);
  near(direct.model.r / direct.model.R, direct.model.x / 360);
  near(direct.model.x, 120); assert.equal(direct.lesson.answer, '120°');
  near(inverse.model.r, 2); near(inverse.model.R, 8);
  near(inverse.model.x / 360, 1 / 4);
  near(inverse.model.r / inverse.model.R, 1 / 4);
  assert.equal(inverse.lesson.answer, '1 : 4');
});

test('s3-4 exact sector area and one base give the lateral and total surface areas', () => {
  for (const index of [0, 1]) {
    const { model: m } = state('s3-4', index);
    near(m.r, 2); near(m.R, 6);
    const side = sectorArea(m.R, m.x), base = Math.PI * m.r * m.r;
    near(side, Math.PI * m.R * m.r);
    near(side / Math.PI, 12); near(base / Math.PI, 4);
    near((side + base) / Math.PI, 16);
  }
  assert.equal(state('s3-4', 0).lesson.answer, '12π');
  assert.equal(state('s3-4', 1).lesson.answer, '16π');
  const narration = state('s3-4', 0).compiled.says.map(cue => cue.text).join(' ');
  assert.match(narration, /직사각형에 가까워져요/, 'finite pieces are described as an approximation');
});

test('s3-5 frustum net subtracts concentric sectors, consistent with the slant-side formula', () => {
  for (const index of [0, 1]) {
    const { model: m } = state('s3-5', index);
    near(m.r1, 2); near(m.r2, 4); near(m.R1, 6); near(m.R2, 12);
    near(m.R1 / m.R2, m.r1 / m.r2);
    const big = sectorArea(m.R2, m.x), small = sectorArea(m.R1, m.x);
    near(big / Math.PI, 48); near(small / Math.PI, 12);
    near((big - small) / Math.PI, 36);
    near(big - small, Math.PI * (m.r1 + m.r2) * (m.R2 - m.R1));
    near(m.area, (big - small) / Math.PI);
  }
  assert.equal(state('s3-5', 0).lesson.answer, '띠 모양');
  assert.equal(state('s3-5', 1).lesson.answer, '36π');
});

test('s4-1 the final straight segment is shorter than the rim and initial broken route', () => {
  const first = state('s4-1', 0, 0).model, end = state('s4-1').model;
  const direct = distance(end.A, end.A2);
  const broken = distance(first.A, first.M) + distance(first.M, first.A2);
  const rim = end.R * end.x * Math.PI / 180;
  assert.ok(direct < broken); assert.ok(direct < rim);
  near(distance(end.A, end.M) + distance(end.M, end.A2), direct);
  near(end.M.x, (end.A.x + end.A2.x) / 2);
  near(end.M.y, (end.A.y + end.A2.y) / 2);
  near(end.cur, direct); assert.equal(end.mode, 'line');
  // The 120-degree sector is convex: this straight route stays on its surface.
  for (let i = 0; i <= 20; i++) {
    const p = { x: end.A.x + (end.A2.x - end.A.x) * i / 20, y: end.A.y + (end.A2.y - end.A.y) * i / 20 };
    assert.ok(radius(p) <= end.R + 1e-8);
    const angle = Math.atan2(p.y, p.x) * 180 / Math.PI;
    assert.ok(angle >= end.a0 - 1e-8 && angle <= end.a1 + 1e-8);
  }
});

test('s4-2 distances follow actual endpoints; 180-degree route explicitly includes the apex', () => {
  for (const [index, expected] of [[0, 12], [1, 8]]) {
    const { model: m, compiled, lesson } = state('s4-2', index);
    near(m.r, 2); near(radius(m.A), m.R); near(radius(m.A2), m.R);
    near(distance(m.A, m.A2), expected); near(m.ans, expected);
    near(m.R * m.x * Math.PI / 180, 2 * Math.PI * m.r);
    assert.equal(lesson.answer, `AA′ = ${expected} cm`);
    if (m.ang === 60) {
      near(distance(m.A, m.A2), distance(O, m.A));
      near(distance(O, m.A), distance(O, m.A2));
    } else {
      near(radius(closestToOrigin(m.A, m.A2)), 0);
      near(distance(m.A, O) + distance(O, m.A2), expected);
      assert.ok(compiled.says.some(cue => /꼭짓점 O를 지나는 경로도 포함/.test(cue.text)));
    }
  }
});

test('s4-3 distances use OP instead of the complete slant length, including the apex case', () => {
  for (const index of [0, 1]) {
    const { model: m, compiled, lesson } = state('s4-3', index);
    assert.ok(m.p > 0 && m.p < m.R);
    near(radius(m.P1), m.p); near(radius(m.P2), m.p);
    near(distance(m.P1, m.P2), 6); near(m.ans, 6);
    assert.equal(lesson.answer, 'PP′ = 6 cm');
    assert.notEqual(distance(m.A, m.A2), m.ans, 'full-slant endpoints would give a different answer');
    if (m.ang === 60) near(distance(m.P1, m.P2), m.p);
    else {
      near(radius(closestToOrigin(m.P1, m.P2)), 0);
      near(distance(m.P1, O) + distance(O, m.P2), 6);
      assert.ok(compiled.says.some(cue => /꼭짓점 경유를 포함/.test(cue.text)));
    }
  }
});

test('s4-4 the full permitted frustum range keeps the chord outside the removed inner sector', () => {
  const { model: fixed, scene, s, lesson } = state('s4-4');
  near(fixed.r2, 4); near(fixed.r1, 2); near(fixed.R2, 24); near(fixed.R1, 12);
  near(distance(fixed.A, fixed.A2), 24); assert.equal(lesson.answer, 'AA′ = 24 cm');
  let pairs = 0;
  for (let outer = 2; outer <= 7; outer++) {
    for (let inner = 1; inner < outer; inner++) {
      const m = scene.so.model({ ...s, soTg: outer, soTf: inner });
      const closest = closestToOrigin(m.A, m.A2);
      assert.ok(radius(closest) > m.R1, `${inner}/${outer}: chord cannot cross removed sector`);
      near(distance(m.A, m.A2), m.R2, `${inner}/${outer}: equilateral chord`);
      near(m.ans, m.R2);
      // The radius along the segment is bounded below by its exact projection
      // minimum and above by its equal-radius endpoints. Thus the whole segment
      // lies in the annular sector and maps onto the actual frustum, not its cutout.
      assert.ok(radius(closest) <= m.R2);
      const highestMappedPoint = m.Hf * (1 - radius(closest) / m.R2);
      assert.ok(highestMappedPoint >= 0 && highestMappedPoint < m.hF);
      pairs++;
    }
  }
  assert.equal(pairs, 21);
});
