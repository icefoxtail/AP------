// Minimal original-question math, cue and production Board safety; not visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/pythagoras-lesson-runtime.mjs';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load();
const counts = { 'py3-345': 3, 'py3-51213': 3, 'py3-8157': 4, 'py3-trap': 3, 'py4-hinge': 3, 'py4-acute': 1, 'py4-obtuse': 1, 'py4-orange': 2, 'py4-arange': 2, 'py5-tree': 2, 'py5-sqarea': 2, 'py5-rectsemi': 2, 'py5-hippo': 2, 'py5-semi': 3, 'py5-findhyp': 1 };
const lessons = Object.fromEntries(Object.keys(counts).map(id => [id, lab.def.lessons[id]]));
const plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} ≈ ${b}`);
const text = frame => frame.texts.join('\n');
const signature = frame => JSON.stringify(frame.paths.filter(p => p.options.color !== null || p.options.fill).map(p => [p.points, p.options]));
const visible = frame => frame.paths.some(p => p.options.color !== null && (p.options.alpha ?? 1) > 0 || p.options.fill && (p.options.fillAlpha ?? 1) > 0);
function init(id, index = 0) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  return { scene: lab.scene, lesson: lessons[id][index], cs: core.compileLesson(lessons[id][index]), s: { ...lab.s } };
}
function state(unit, time) {
  const v = core.stateAt(unit.cs, time, { nums: { ...unit.s }, sets: { ...unit.s }, step: 0, part: null });
  return { ...unit.s, ...v.nums, ...v.sets, step: v.step, part: v.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(s, width = 1000) {
  Object.assign(lab.s, s); lab.setViewportWidth(width); lab.board.resize(width, 650); return lab.draw();
}
function model(unit, s) {
  const D = unit.scene.py, source = D.lessonState ? D.lessonState(s) : s.pyLessonProblem ? lab.api.qState(s) : s;
  const M = D.model(source); return D.lessonModel ? D.lessonModel(M, s) : M;
}
const answer = unit => {
  const s = state(unit, 0), qs = lab.api.qState(s), Q = unit.scene.py.prob(unit.scene.py.model(qs), qs);
  assert.equal(Q.choices.length, 5); assert.equal(Q.choices.filter(c => c.ok).length, 1);
  const item = Q.choices.find(c => c.ok); return String(item.p ?? item.h ?? item.t);
};
const cueTime = (unit, key, value = true) => unit.cs.cues.find(c => c.set?.[key] === value).at;
function classify(a, b, c) {
  const [x, y, z] = [a, b, c].sort((m, n) => m - n);
  if (x + y <= z) return null;
  const delta = z * z - x * x - y * y;
  return delta < 0 ? 'acute' : delta > 0 ? 'obtuse' : 'right';
}

test('fifteen original scenes register 34 valid explanations and reset every sibling gate', () => {
  assert.equal(Object.values(counts).reduce((a, b) => a + b), 34);
  for (const [id, count] of Object.entries(counts)) {
    assert.equal(lessons[id].length, count, id);
    const report = core.validateLessonSet(lessons[id]); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of lessons[id]) {
      const first = lesson.chapters[0].cues[0].set, cs = core.compileLesson(lesson);
      assert.equal(first.pyShowAnswer, false); assert.equal(first.pyCalculationReady, false);
      assert.equal(typeof first.pyLessonProblem, 'boolean'); assert.ok(first.pyQ && typeof first.pyQ === 'object'); assert.equal(first.pySeed, 0);
      const final = cs.cues.find(c => c.set?.pyShowAnswer === true);
      assert.ok(final.at >= cs.chapters.at(-1).at, id + ': answer occurs in the final chapter');
      assert.doesNotMatch(JSON.stringify(lesson), /√|\\sqrt|NaN|undefined/);
    }
  }
});

for (const id of Object.keys(counts)) test(`${id}: actual figure moves during the first second with fixed question state`, () => {
  for (let index = 0; index < lessons[id].length; index++) {
    const unit = init(id, index), first = state(unit, 0), moving = state(unit, .75), a = draw(first), b = draw(moving);
    assert.ok(visible(a) && visible(b), `${id}/${index}: visible geometry`);
    assert.notEqual(signature(a), signature(b), `${id}/${index}: actual side, arc or hinge motion`);
    assert.deepEqual(plain(first.pyQ), plain(moving.pyQ), `${id}/${index}: unchanged question object`);
    assert.doesNotMatch(unit.scene.question(first), /undefined|NaN|√|\\sqrt/);
    if (first.pyLessonProblem) {
      const qs = lab.api.qState(first), Q = unit.scene.py.prob(unit.scene.py.model(qs), qs), question = unit.scene.question(first);
      for (const [i, choice] of Q.choices.entries()) {
        const display = choice.h != null ? choice.h : choice.t != null ? '$' + choice.t + '$' : lab.api.esc(choice.p);
        assert.ok(question.includes(`${lab.api.NUM[i]} ${display}`), `${id}/${index}: actual lesson question includes original choice ${i + 1}`);
      }
      const html = unit.scene.problem.text(first);
      assert.doesNotMatch(html, /undefined|NaN|√|\\sqrt/); assert.equal((html.match(/data-py-pick=/g) || []).length, 5);
    }
    assert.doesNotMatch(text(a) + text(b), /NaN|undefined|Infinity|√|\\sqrt/);
  }
});

test('Pythagorean families independently satisfy the square relation and actual original unknowns', () => {
  for (const id of ['py3-345', 'py3-51213', 'py3-8157']) for (let index = 0; index < lessons[id].length; index++) {
    const unit = init(id, index), s = state(unit, 0), M = model(unit, s);
    assert.equal(M.a * M.a + M.b * M.b, M.c * M.c);
    assert.equal(M.a / M.a0, 2); assert.equal(M.b / M.b0, 2); assert.equal(M.c / M.c0, 2);
    if (s.pyLessonProblem) { assert.equal(Number(answer(unit)), M[M.ask]); assert.equal(unit.lesson.answer, `x=${M[M.ask]}`); }
  }
});

test('the unspecified hypotenuse produces 25 and 7, while specified hypotenuses answer only one case', () => {
  for (const [index, expected] of [[0, 32], [1, 7], [2, 25]]) {
    const unit = init('py3-trap', index), M = model(unit, state(unit, 0));
    assert.equal(M.x1, 3 * 3 + 4 * 4); assert.equal(M.x2, 4 * 4 - 3 * 3); assert.equal(Number(answer(unit)), expected);
    const s = state(unit, unit.cs.length), final = text(draw(s));
    assert.match(final, index === 1 ? /x²=7/ : /x²=25/);
  }
});

test('hinge problems classify the specified angle rather than assuming it is the largest angle', () => {
  const unit = init('py4-hinge', 1), M = model(unit, state(unit, 0));
  near((M.A.x - M.B.x) ** 2 + (M.A.y - M.B.y) ** 2, 25);
  assert.equal(M.sum, 100); assert.equal(M.type, 'acute'); assert.equal(answer(unit), '예각');
  assert.equal(classify(8, 6, 5), 'obtuse', 'the whole triangle is obtuse while angle C is acute');
  const squared = init('py4-hinge', 2), N = model(squared, state(squared, 0));
  near(N.c2, 148); assert.equal(N.sum, 100); assert.equal(answer(squared), '둔각');
});

for (const [id, sides, expected, korean] of [['py4-acute', [5, 6, 7], 'acute', '예각삼각형'], ['py4-obtuse', [4, 5, 7], 'obtuse', '둔각삼각형']]) test(`${id}: longest-side comparison agrees with all original choices`, () => {
  const unit = init(id), M = model(unit, state(unit, 0));
  assert.equal(classify(...sides), expected); assert.equal(M.type, expected); assert.equal(answer(unit), korean);
  assert.deepEqual(plain(M.s), sides); assert.equal(M.zz, 49); assert.equal(M.sum, sides[0] ** 2 + sides[1] ** 2);
});

for (const [id, p, q, want, expected] of [['py4-orange', 4, 5, 'obtuse', [2, 7, 8]], ['py4-arange', 6, 8, 'acute', [6, 7, 8, 9]]]) test(`${id}: integer enumeration includes both longest-side cases and excludes right-angle boundaries`, () => {
  const values = []; for (let x = 1; x <= p + q; x++) if (classify(p, q, x) === want) values.push(x);
  assert.deepEqual(values, expected);
  for (let index = 0; index < 2; index++) {
    const unit = init(id, index), M = model(unit, state(unit, 0)); assert.deepEqual(plain(M[want]), values);
    assert.equal(parseInt(answer(unit), 10), values.length);
  }
});

test('tree branch motion preserves each paired square area and the selected pair count', () => {
  for (let index = 0; index < 2; index++) {
    const unit = init('py5-tree', index), initial = state(unit, 0), moving = state(unit, 2), A = model(unit, initial), B = model(unit, moving);
    assert.notEqual(A.th1, B.th1); assert.equal(A.p, B.p); assert.equal(A.q, B.q);
    for (const [length, theta] of [[B.p, B.th1], [B.q, B.th2]]) {
      const x = length * Math.cos(theta * Math.PI / 180), y = length * Math.sin(theta * Math.PI / 180);
      near(x * x + y * y, length * length);
    }
    assert.equal(Number(answer(unit)), index === 0 ? 12 ** 2 + 9 ** 2 : 12 ** 2);
  }
});

test('sqarea uses current 49/48 question and never substitutes the exploration 20/15 total', () => {
  for (const [index, expected] of [[0, 97], [1, 48]]) {
    const unit = init('py5-sqarea', index), s = state(unit, 0); s.pyS1 = 20; s.pyS2 = 15;
    const M = model(unit, s); assert.deepEqual(plain(M), { S1: 49, S2: 48, S3: 97, unk: index ? 'b' : 'c' });
    assert.equal(Number(answer(unit)), expected);
    const steps = unit.scene.steps(s).join('\n'); assert.match(steps, new RegExp(`x=${expected}`)); assert.doesNotMatch(steps, /x=35/);
    const prompt = unit.scene.question(s); assert.match(prompt, /49/); assert.match(prompt, index ? /97/ : /48/);
  }
});

test('four semicircles and the circumcircle have equal area before subtracting their common region', () => {
  for (let index = 0; index < 2; index++) {
    const unit = init('py5-rectsemi', index), M = model(unit, state(unit, 0));
    assert.equal(M.w, 12); assert.equal(M.h, 16); assert.equal(M.di, 20);
    near(2 * Math.PI * (12 / 2) ** 2 / 2 + 2 * Math.PI * (16 / 2) ** 2 / 2, Math.PI * (20 / 2) ** 2);
    assert.equal(20 ** 2 - 12 ** 2, 16 ** 2); assert.equal(Number(answer(unit)), 12 * 16);
  }
});

test('Hippocrates lunes use the area of a right triangle, including the missing-leg variant', () => {
  for (let index = 0; index < 2; index++) {
    const unit = init('py5-hippo', index), M = model(unit, state(unit, 0));
    assert.equal(M.ci, 10); assert.equal(10 ** 2 - 6 ** 2, 8 ** 2);
    near(Math.PI * 6 ** 2 / 8 + Math.PI * 8 ** 2 / 8, Math.PI * 10 ** 2 / 8);
    assert.equal(Number(answer(unit)), 6 * 8 / 2);
  }
});

test('semicircle areas retain exact coefficients of pi for addition and subtraction', () => {
  for (let index = 0; index < 3; index++) {
    const unit = init('py5-semi', index), M = model(unit, state(unit, 0));
    assert.equal(M.S1, 36 / 8); assert.equal(M.S2, 64 / 8); assert.equal(M.S3, 100 / 8);
    assert.equal(M.S1 + M.S2, M.S3);
    if (index) assert.equal(answer(unit), index === 1 ? '2분의 25π' : '2분의 9π');
  }
});

test('the 18pi area question gives radius 6 and hypotenuse diameter 12', () => {
  const unit = init('py5-findhyp'), M = model(unit, state(unit, 0));
  assert.equal(M.k, 18); assert.equal(M.r ** 2, 2 * 18); assert.equal(M.r, 6); assert.equal(M.c, 2 * M.r); assert.equal(Number(answer(unit)), 12);
});

test('squared intermediate lengths appear only after their calculation cue and the length answer remains last', () => {
  const unit = init('py3-345', 1), t = cueTime(unit, 'pyCalculationReady');
  assert.doesNotMatch(text(draw(state(unit, t - .01))), /c²=100/);
  assert.match(text(draw(state(unit, t))), /c²=100/);
  assert.equal(state(unit, t).pyShowAnswer, false);
});

test('trap branch values are distinct intermediate cues only in the two-case sum question', () => {
  const unit = init('py3-trap'), a = cueTime(unit, 'pyBFirstReady'), b = cueTime(unit, 'pyBSecondReady');
  assert.doesNotMatch(text(draw(state(unit, a - .01))), /x²=25/);
  assert.match(text(draw(state(unit, a))), /x²=25/); assert.doesNotMatch(text(draw(state(unit, b - .01))), /x²=7/);
  assert.match(text(draw(state(unit, b))), /x²=7/); assert.equal(state(unit, b).pyShowAnswer, false);
});

test('tree delays both intermediate square values and never exposes the single-pair answer early', () => {
  const all = init('py5-tree'), a = cueTime(all, 'pyBFirstReady'), b = cueTime(all, 'pyBSecondReady');
  assert.doesNotMatch(text(draw(state(all, a - .01))), /AB²=144/); assert.match(text(draw(state(all, a))), /AB²=144/);
  assert.doesNotMatch(text(draw(state(all, b - .01))), /AC²=81/); assert.match(text(draw(state(all, b))), /AC²=81/);
  const one = init('py5-tree', 1), t = cueTime(one, 'pyShowAnswer');
  assert.doesNotMatch(text(draw(state(one, t - .01))), /144|225/); assert.match(text(draw(state(one, t))), /AB²=144/);
});

test('the two missing-leg lune questions hide derived heights until the derivation cue', () => {
  for (const [id, expected] of [['py5-rectsemi', '16'], ['py5-hippo', '8']]) {
    const unit = init(id, 1), t = cueTime(unit, 'pyBFirstReady');
    assert.equal(draw(state(unit, t - .01)).texts.includes(expected), false, id);
    assert.equal(draw(state(unit, t)).texts.includes(expected), true, id);
  }
});

test('unknown square and semicircle areas are absent from figures until the final answer cue', () => {
  for (const [id, index, value] of [['py5-sqarea', 0, '97'], ['py5-sqarea', 1, '48'], ['py5-semi', 1, 'S₃=\\frac{25π}{2}'], ['py5-semi', 2, 'S₁=\\frac{9π}{2}']]) {
    const unit = init(id, index), t = cueTime(unit, 'pyShowAnswer');
    assert.equal(draw(state(unit, t - .01)).texts.includes(value), false, `${id}/${index}`);
    assert.equal(draw(state(unit, t)).texts.includes(value), true, `${id}/${index}`);
  }
});

test('the known semicircle total, radius and final diameter each follow their own cue', () => {
  const unit = init('py5-findhyp'), a = cueTime(unit, 'pyBFirstReady'), b = cueTime(unit, 'pyBSecondReady'), final = cueTime(unit, 'pyShowAnswer');
  assert.doesNotMatch(text(draw(state(unit, a - .01))), /S₃=18π/); assert.match(text(draw(state(unit, a))), /S₃=18π/);
  assert.doesNotMatch(text(draw(state(unit, b - .01))), /r=6/); assert.match(text(draw(state(unit, b))), /r=6/);
  assert.equal(draw(state(unit, final - .01)).texts.includes('12'), false); assert.equal(draw(state(unit, final)).texts.includes('12'), true);
});

test('a preceding random question and legacy tick cannot overwrite the fixed current lesson question', () => {
  const unit = init('py5-sqarea'), prior = { pyS1: 17, pyS2: 23, pyUnk: 'b' };
  unit.s.pyQ = prior; unit.s.pySeed = 8; unit.s.step = 4;
  const fixed = state(unit, 1); assert.deepEqual(plain(fixed.pyQ), { pyS1: 49, pyS2: 48, pyUnk: 'c' }); assert.equal(fixed.pySeed, 0);
  const before = JSON.stringify(fixed); assert.equal(unit.scene.tick(fixed, 1, lab), false); assert.equal(JSON.stringify(fixed), before);
  const q = unit.scene.question(fixed); assert.match(q, /\$49\$/); assert.match(q, /\$48\$/); assert.doesNotMatch(q, /\$17\$|\$23\$/);
  assert.deepEqual(prior, { pyS1: 17, pyS2: 23, pyUnk: 'b' }, 'the saved manual problem object was not mutated');
});
