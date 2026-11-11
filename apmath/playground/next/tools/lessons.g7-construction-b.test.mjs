// Minimum source math, cue and production Board safety. No browser visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/construction-lesson-runtime.mjs';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const lab = await load(), ids = ['c3-1', 'c3-2', 'c3-3', 'c3-4', 'c3-5', 'c5-1', 'c5-2', 'c5-3'];
const lessons = Object.fromEntries(ids.map(id => [id, lab.def.lessons[id]]));
const plain = x => JSON.parse(JSON.stringify(x));
const norm = x => String(x).replace(/\s/g, '');
const near = (a, b, message = '') => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} ≈ ${b}`);
const distance = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
const angle = (O, P, Q) => Math.acos(Math.max(-1, Math.min(1, ((P.x - O.x) * (Q.x - O.x) + (P.y - O.y) * (Q.y - O.y)) / (distance(O, P) * distance(O, Q))))) * 180 / Math.PI;
const sides = T => [distance(T[0], T[1]), distance(T[1], T[2]), distance(T[2], T[0])].sort((a, b) => a - b);
const congruent = (A, B) => sides(A).every((x, i) => Math.abs(x - sides(B)[i]) < 1e-7);
const visible = frame => frame.paths.some(p => (p.options.color !== null && (p.options.alpha ?? 1) > 0) || (p.options.fill && (p.options.fillAlpha ?? 1) > 0));
const signature = frame => JSON.stringify(frame.paths.filter(p => p.options.color !== null || p.options.fill).map(p => p.points));
function init(id, lesson) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id); lab.tab = 'review';
  return { scene: lab.scene, cs: core.compileLesson(lesson), s: { ...lab.s } };
}
function at(cs, s, time) {
  const state = core.stateAt(cs, time, { nums: { ...s }, sets: { ...s }, step: 0, part: null });
  return { ...s, ...state.nums, ...state.sets, step: state.step, part: state.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true };
}
function draw(state, width = 1000) {
  Object.assign(lab.s, state); lab.setViewportWidth(width); lab.board.resize(width, 650); return lab.draw();
}
function actualModel(scene, state) {
  const M = scene.cn.model(state);
  return scene.cn.lessonModel ? scene.cn.lessonModel(M, state) : state.cnLessonProblem && scene.cn.reviewModel ? scene.cn.reviewModel(M, state) : M;
}
const trianglePaths = frame => frame.paths.filter(p => p.options.close && p.options.color === 'ink' && p.points.length === 3).map(p => p.points);

test('eight original scenes register 23 valid explanations with fixed practice state and sibling resets', () => {
  assert.deepEqual(ids.map(id => lessons[id].length), [2, 3, 3, 4, 2, 4, 2, 3]);
  for (const [id, list] of Object.entries(lessons)) {
    const report = core.validateLessonSet(list); assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of list) {
      const first = lesson.chapters[0].cues[0].set, cs = core.compileLesson(lesson), conclusion = cs.cues.find(c => c.set?.cnShowAnswer === true);
      assert.equal(first.cnShowAnswer, false); assert.equal(typeof first.cnLessonProblem, 'boolean'); assert.equal(first.cnBStage, 0); assert.ok(first.cnPk);
      assert.ok(conclusion.at >= cs.chapters.at(-1).at, `${id}: answer remains in the last chapter`);
    }
  }
});

test('original generated decision questions retain their actual solution values and choice order', () => {
  for (const [id, expected, correct] of [['c3-1', { kind: 'sss', a: 6, b: 6, c: 4 }, 3], ['c3-2', { kind: 'sas', b: 6, c: 8, A: 90 }, 2], ['c3-3', { kind: 'asa', c: 5, A: 80, B: 40 }, 3]]) {
    const { cs, s, scene } = init(id, lessons[id].at(-1)), state = at(cs, s, 0), Q = scene.cn.prob(scene.cn.model(state));
    const solution = plain(Q.solution); delete solution.text; assert.deepEqual(solution, expected);
    assert.equal(Q.choices.length, 5); assert.equal(Q.choices.filter(q => q.ok).length, 1); assert.equal(Q.choices.findIndex(q => q.ok), correct);
    assert.equal(Q.sourceChoices.length, 5);
    const review = actualModel(scene, state);
    for (const [key, value] of Object.entries(expected)) if (key !== 'kind') assert.equal(review[key], value, `${id}: review uses the actual generated number`);
  }
});

test('every displayed decision candidate preserves the exact source side and angle conditions', () => {
  for (const id of ['c3-1', 'c3-2', 'c3-3']) {
    const { cs, s, scene } = init(id, lessons[id].at(-1));
    for (const chapter of cs.chapters) {
      const state = at(cs, s, chapter.at + 1), Q = scene.cn.prob(scene.cn.model(state)), d = Q.sourceChoices[state.cnBChoice], frame = draw(state), triangles = trianglePaths(frame);
      assert.ok(scene.question(state).includes(Q.choices[state.cnBChoice].h), `${id}: current question includes its actual source statement`);
      if (d.kind === 'sss' || d.kind === 'sssx') {
        const rods = frame.paths.filter(p => p.points.length === 2 && [6, 7].includes(p.options.width));
        assert.equal(rods.length, 3); const found = rods.map(p => distance(...p.points)).sort((a, b) => a - b), given = [d.a, d.b, d.c].sort((a, b) => a - b);
        found.forEach((v, i) => near(v, given[i]));
        assert.equal(given[2] < given[0] + given[1], d.kind === 'sss');
      } else if (d.kind === 'aaa') {
        assert.equal(triangles.length, 2);
        for (const T of triangles) { near(angle(T[0], T[1], T[2]), d.A); near(angle(T[1], T[0], T[2]), d.B); }
        assert.equal(congruent(...triangles), false);
      } else if (d.kind === 'ssa') {
        assert.equal(triangles.length, 2);
        for (const T of triangles) { near(distance(T[0], T[1]), d.adjacent); near(distance(T[1], T[2]), d.opposite); near(angle(T[0], T[1], T[2]), d.A); }
        assert.equal(congruent(...triangles), false, 'same SSA conditions genuinely produce noncongruent triangles');
        const rad = d.A * Math.PI / 180, disc = d.opposite ** 2 - (d.adjacent * Math.sin(rad)) ** 2;
        assert.ok(disc > 0); assert.ok(d.adjacent * Math.cos(rad) - Math.sqrt(disc) > 0, 'both SSA ray intersections are positive');
      } else {
        assert.equal(triangles.length, 1); const T = triangles[0]; near(distance(T[0], T[1]), d.c);
        if (d.b != null) near(distance(T[0], T[2]), d.b);
        if (d.A != null) near(angle(T[0], T[1], T[2]), d.A);
        if (d.B != null) near(angle(T[1], T[0], T[2]), d.B);
      }
    }
  }
});

test('concept examples keep the original 6/7/8, included 50°, and endpoint 55°/65° values', () => {
  const sss = init('c3-1', lessons['c3-1'][0]), M = actualModel(sss.scene, at(sss.cs, sss.s, 0));
  near(distance(M.Tr[1], M.Tr[2]), 6); near(distance(M.Tr[0], M.Tr[2]), 7); near(distance(M.Tr[0], M.Tr[1]), 8);
  for (const [id, length0, angleA, angleB] of [['c3-2', 7, 50, null], ['c3-3', 6, 55, 65]]) {
    const { cs, s } = init(id, lessons[id][0]), frame = draw(at(cs, s, 0)), Ts = trianglePaths(frame);
    assert.equal(Ts.length, 2); near(distance(Ts[0][0], Ts[0][1]), length0); near(angle(Ts[0][0], Ts[0][1], Ts[0][2]), angleA);
    if (angleB != null) { near(angle(Ts[0][1], Ts[0][0], Ts[0][2]), angleB); near(angle(Ts[0][2], Ts[0][0], Ts[0][1]), 60); }
    else near(distance(Ts[0][0], Ts[0][2]), 6);
    assert.ok(congruent(...Ts));
  }
});

test('extra-condition rejection is an actual SSA counterexample; the three accepted conditions have the correct endpoints', () => {
  const { cs, s, scene } = init('c3-5', lessons['c3-5'][1]), wrong = at(cs, s, 15), M = actualModel(scene, wrong), { base: A, candidate: B } = M.paired;
  near(distance(A[0], A[1]), distance(B[0], B[1])); near(distance(A[1], A[2]), distance(B[1], B[2])); near(angle(A[0], A[1], A[2]), angle(B[0], B[1], B[2]));
  assert.equal(congruent(A, B), false); assert.ok(Math.abs(distance(A[0], A[2]) - distance(B[0], B[2])) > .1);
  for (const time of [25, 35, 45]) {
    const st = at(cs, s, time), pair = actualModel(scene, st).paired;
    assert.ok(congruent(pair.base, pair.candidate)); pair.base.forEach((p, i) => near(distance(p, pair.image[i]), 0));
  }
  const Q = scene.cn.prob(scene.cn.model(wrong)); assert.equal(Q.choices.find(q => q.ok).p, '3개');
  assert.ok(Q.html.includes('㉠')); assert.ok(Q.html.includes('㉣'));
  // A and C determine B by the angle sum, so BC's opposite-angle trap is not
  // confused with adding a second known angle and a fixed side.
  near(angle(A[1], A[0], A[2]), 180 - angle(A[0], A[1], A[2]) - angle(A[2], A[0], A[1]));
});

test('original candidate sets have exactly one congruent triangle and rigid matching preserves every side', () => {
  for (const [index, expected] of [[0, 'ㅁ'], [1, 'ㄷ'], [2, 'ㅁ']]) {
    const { cs, s, scene } = init('c5-3', lessons['c5-3'][index]), st = at(cs, s, 0), source = scene.cn.model(st), original = plain(source.nums);
    const good = Array.from(source.set.cands, c => congruent(source.set.base.pts, c.dsc.pts));
    assert.equal(good.filter(Boolean).length, 1); assert.deepEqual(good, Array.from(source.set.cands, c => c.ok));
    assert.equal(scene.cn.prob(source).choices[good.indexOf(true)].p, expected);
    for (const t of [0, .2, .6, 1]) {
      const pair = actualModel(scene, { ...st, cnBT: t }).paired;
      assert.ok(congruent(pair.base, pair.image));
      if (t === 1) pair.base.forEach((p, i) => near(distance(p, pair.image[i]), 0, 'corresponding source points coincide'));
    }
    assert.deepEqual(plain(scene.cn.model(at(cs, s, cs.length)).nums), original);
  }
});

test('the nonincluded 50° candidate really has the original two lengths and the stated angle', () => {
  const { cs, s, scene } = init('c5-3', lessons['c5-3'][1]), M = scene.cn.model(at(cs, s, 0)), trap = M.set.cands[1].dsc, T = trap.pts;
  near(distance(T[0], T[1]), 6); near(distance(T[1], T[2]), 7); near(angle(T[0], T[1], T[2]), 50);
  assert.ok(Math.abs(angle(T[1], T[0], T[2]) - 50) > 1, 'the given 50° is not the angle between the two named sides');
  assert.equal(congruent(M.set.base.pts, T), false);
});

test('the numeric angle question is bound to current model values 55° and 65°, rather than stale pk.B', () => {
  const { cs, s, scene } = init('c5-2', lessons['c5-2'][0]), st = at(cs, s, 0), M = scene.cn.model(st), Q = scene.cn.prob(M);
  assert.equal(st.cnPk.B, 70, 'original stored seed is retained'); assert.equal(M.pk.B, 65, 'actual source model resolves the current angle');
  assert.ok(Q.stem.includes('65')); assert.equal(Q.choices.find(q => q.ok).p, '60°'); assert.equal(180 - st.cnEA - st.cnEB, 60);
});

for (const [id, list] of Object.entries(lessons)) for (const [index, lesson] of list.entries()) test(`${id}/${index + 1}: actual first-second drawing motion and last-cue answer`, () => {
  const { cs, s } = init(id, lesson), answerAt = cs.cues.find(c => c.set?.cnShowAnswer === true).at, target = norm(lesson.answerText);
  const first = at(cs, s, 0), moving = at(cs, s, .99), before = at(cs, s, answerAt - .01), end = at(cs, s, cs.length);
  for (const width of [390, 1000]) {
    const entry = draw({ ...first, lessonOn: false, lessonEntry: true, step: 99 }, width), motion = draw(moving, width), pre = draw(before, width), last = draw(end, width);
    assert.ok(visible(entry)); assert.ok(visible(last)); assert.notEqual(signature(entry), signature(motion));
    for (const key of ['card', 'formula', 'rule', 'status']) assert.equal(entry.value[key], null);
    assert.equal(entry.value.readouts.length, 0);
    for (const frame of [entry, motion, pre]) assert.ok(!norm(frame.texts.join('')).includes(target), `${width}: no early ${target}`);
    assert.ok(norm(last.texts.join('')).includes(target), `${width}: final ${target}`);
  }
});

test('angle calculation labels follow their matching cues', () => {
  for (const [id, index, time, target] of [['c3-3', 0, 15, '60°'], ['c5-2', 0, 15, '55° + 65° = 120°'], ['c5-2', 0, 25, '60°'], ['c5-2', 1, 15, '∠C = ∠F = 60°']]) {
    const { cs, s } = init(id, lessons[id][index]);
    assert.ok(!norm(draw(at(cs, s, time - .01)).texts.join('')).includes(norm(target)), `${id}: value remains hidden before its cue`);
    assert.ok(norm(draw(at(cs, s, time)).texts.join('')).includes(norm(target)), `${id}: value appears with its explanation`);
  }
});

test('old practice selections cannot reset the lesson and manual controls still work afterward', () => {
  for (const [id, index] of [['c3-2', 1], ['c3-5', 1], ['c5-1', 1], ['c5-2', 0], ['c5-3', 1]]) {
    const { cs, s, scene } = init(id, lessons[id][index]), fixed = at(cs, s, .99), original = draw(fixed), choice = { key: 'prior-practice', idx: 2 };
    const again = draw({ ...fixed, cnQuestionKey: 'old-question-key', cnPick: choice, revealed: true });
    assert.equal(signature(again), signature(original)); assert.deepEqual(again.texts, original.texts);
    assert.equal(lab.s.cnQuestionKey, 'old-question-key'); assert.equal(lab.s.cnPick, choice); assert.equal(lab.s.step, fixed.step);
    lab.s.playing = true; const snapshot = JSON.stringify(lab.s); assert.equal(scene.tick(lab.s, .5, lab), false); assert.equal(JSON.stringify(lab.s), snapshot);
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, playing: false }); lab.tab = 'explore'; const manual = lab.draw();
    assert.ok(manual.value.readouts.length > 0); assert.ok(visible(manual));
  }
});
