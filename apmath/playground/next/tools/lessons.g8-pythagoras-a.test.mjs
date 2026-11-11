// Source-bound math and production Board checks; no mobile visual-QA claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/pythagoras-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ownedIds = ['py1-sq', 'py1-leg', 'py1-rot', 'py1-grid', 'py1-chain', 'py1-perim', 'py2-euclid', 'py2-bhas1', 'py2-bhas2', 'py2-garf', 'py2-sim'];
const list = id => video.lessonList(lab.def.lessons[id]);
const find = (id, label) => list(id).find(l => l.label === label);
const area = points => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p[0] * q[1] - p[1] * q[0]; }, 0)) / 2;
const shape = f => JSON.stringify(f.paths.map(p => ({ points: p.points, options: p.options })));
const close = (a, b, note) => assert.ok(Math.abs(a - b) < 1e-7, `${note}: ${a} versus ${b}`);
function frame(id, lesson, time = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const timeline = video.compileLesson(lesson);
  const state = video.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0 });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, dragging: !entry, playing: false });
  lab.tab = entry ? 'explore' : 'review'; lab.scene.view(lab.s, lab); lab.s.step = entry ? 0 : state.step;
  const D = lab.scene.py, s = D.lessonState ? D.lessonState(lab.s) : lab.s.pyLessonProblem ? lab.api.qState(lab.s) : lab.s;
  const raw = D.model(s), M = D.lessonModel ? D.lessonModel(raw, lab.s) : raw;
  return { ...lab.draw(), M, D, timeline, state, question: lab.scene.question(lab.s), Q: D.prob(D.model(lab.api.qState(lab.s))) };
}
const end = (id, lesson) => frame(id, lesson, video.compileLesson(lesson).length);

test('all 11 owned scenes and 24 explanations use fixed source conditions and complete timelines', () => {
  assert.equal(ownedIds.reduce((n, id) => n + list(id).length, 0), 24);
  for (const id of ownedIds) {
    const report = video.validateLessonSet(lab.def.lessons[id]);
    assert.deepEqual(report.errors, [], id); assert.deepEqual(report.warnings, [], id);
    for (const lesson of list(id)) {
      const first = frame(id, lesson), moving = frame(id, lesson, .75);
      assert.equal(first.state.sets.pyShowAnswer, false);
      assert.equal(first.state.sets.pyCalculationReady, false);
      assert.equal(typeof first.state.sets.pyLessonProblem, 'boolean');
      assert.equal(first.state.sets.pySeed, 0);
      assert.equal(typeof first.state.sets.pyQ, 'object');
      assert.notEqual(shape(first), shape(moving), `${id}: actual line or rectangle moves before one second`);
      const final = end(id, lesson);
      assert.equal(lab.s.pyShowAnswer, true);
      assert.doesNotMatch(final.texts.join(' '), /√|\\sqrt|NaN|undefined|Infinity/);
      const entry = frame(id, lesson, 0, true);
      assert.equal(lab.s.pyShowAnswer, false);
      assert.equal(lab.s.pyCalculationReady, false);
      assert.ok(entry.paths.length > 0);
      assert.equal(entry.value.card, null);
      assert.doesNotMatch(entry.question, /undefined|NaN|Infinity/);
      if (lab.s.pyLessonProblem) {
        assert.ok(entry.question.includes(entry.Q.stem));
        for (const c of entry.Q.choices) assert.ok(entry.question.includes(c.h != null ? c.h : '$' + c.t + '$'));
      }
    }
  }
});

test('pilot answers agree with independent polygon areas, positive integer solutions and source choices', () => {
  const squares = end('py1-sq', find('py1-sq', '넓이관계'));
  const a = squares.M.a, b = squares.M.b;
  const areaA = area([[0, 0], [a, 0], [a, a], [0, a]]), areaB = area([[0, 0], [b, 0], [b, b], [0, b]]);
  assert.equal(areaA, 9); assert.equal(areaB, 16); assert.equal(areaA + areaB, squares.M.c2);
  const leg = end('py1-leg', find('py1-leg', '직각변'));
  const candidates = Array.from({ length: leg.M.c }, (_, i) => i + 1).filter(x => x * x + leg.M.a * leg.M.a === leg.M.c * leg.M.c);
  assert.deepEqual(candidates, [8]); assert.equal(leg.Q.choices.find(c => c.ok).p, String(candidates[0]));
  const euclid = end('py2-euclid', find('py2-euclid', '왼쪽넓이'));
  const { c, a: short, b: long } = euclid.M;
  assert.deepEqual([c, short, long], [20, 12, 16]);
  const foot = (c * c + long * long - short * short) / (2 * c);
  const left = area([[0, 0], [foot, 0], [foot, c], [0, c]]), right = area([[foot, 0], [c, 0], [c, c], [foot, c]]);
  assert.equal(left, 256); assert.equal(right, 144); assert.equal(left + right, 400);
  close(foot, euclid.M.p, 'perpendicular foot from the original side lengths');
  assert.equal(euclid.Q.choices.find(o => o.ok).p, String(left));
  const actualRectangles = euclid.paths.filter(p => p.options.fillAlpha === .3 && ['green', 'sky'].includes(p.options.fill));
  assert.equal(actualRectangles.length, 2);
  assert.deepEqual(actualRectangles.map(p => Math.round(area(p.points.map(q => [q.x, q.y])))).sort((x, y) => x - y), [144, 256]);
});

test('pilot labels follow the numeric captions and final-answer cues', () => {
  const squares = find('py1-sq', '넓이관계');
  assert.ok(!frame('py1-sq', squares, 11.99).texts.includes('a²=9'));
  const firstSquare = frame('py1-sq', squares, 12);
  assert.ok(firstSquare.texts.includes('a²=9')); assert.ok(!firstSquare.texts.includes('b²=16'));
  assert.ok(frame('py1-sq', squares, 17.5).texts.includes('b²=16'));
  assert.ok(!frame('py1-sq', squares, 29.49).texts.includes('c²=25'));
  assert.ok(frame('py1-sq', squares, 29.5).texts.includes('c²=25'));
  const leg = find('py1-leg', '직각변');
  assert.ok(frame('py1-leg', leg, 12).texts.includes('c²=100'));
  assert.ok(!frame('py1-leg', leg, 17.49).texts.includes('a²=36'));
  assert.ok(frame('py1-leg', leg, 17.5).texts.includes('a²=36'));
  assert.ok(frame('py1-leg', leg, 24).texts.includes('b²=64'));
  assert.ok(!frame('py1-leg', leg, 41.49).texts.includes('b=x=8'));
  assert.ok(frame('py1-leg', leg, 41.5).texts.includes('b=x=8'));
  const euclid = find('py2-euclid', '왼쪽넓이');
  assert.ok(!frame('py2-euclid', euclid, 41.49).texts.includes('256'));
  assert.ok(frame('py2-euclid', euclid, 41.5).texts.includes('256'));
  const before = frame('py2-euclid', euclid, 0), moving = frame('py2-euclid', euclid, 2), final = end('py2-euclid', euclid);
  assert.notEqual(shape(before), shape(moving)); assert.equal(final.M.g, 1);
  assert.ok(!Object.hasOwn(lab.s.pyQ, 'pyG'), 'fixed question cannot override rectangle motion');
});

test('new-question randomness, replay and switching cannot change fixed questions or resume legacy animation', () => {
  const expected = new Map();
  for (const id of ownedIds) for (const lesson of list(id)) {
    const initial = frame(id, lesson, 1);
    expected.set(id + '/' + lesson.label, { geometry: shape(initial), question: initial.question, q: JSON.stringify(lab.s.pyQ) });
  }
  for (const id of [...ownedIds, ...ownedIds.slice().reverse()]) for (const lesson of list(id)) {
    const initial = frame(id, lesson, 1), previous = expected.get(id + '/' + lesson.label);
    assert.equal(shape(initial), previous.geometry); assert.equal(initial.question, previous.question); assert.equal(JSON.stringify(lab.s.pyQ), previous.q);
    const pick = { key: 'previous-manual-question', idx: 2 }; lab.s.pyPick = pick;
    lab.s.playing = true; lab.s.dragging = false;
    const state = JSON.stringify(lab.s);
    assert.equal(lab.scene.tick(lab.s, .5, lab), false);
    assert.equal(JSON.stringify(lab.s), state, 'legacy animation leaves authored state intact');
    assert.equal(lab.s.pyPick, pick, 'lesson leaves prior manual choice intact');
    Object.assign(lab.s, { lessonOn: false, lessonEntry: false, playing: false });
    lab.newProblem(); // actual data-py-new handler, including source gen and its state updates
    const replay = frame(id, lesson, 1);
    assert.equal(shape(replay), previous.geometry); assert.equal(replay.question, previous.question); assert.equal(JSON.stringify(lab.s.pyQ), previous.q);
  }
});

test('rotated lengths, grid area, shared-height chain and perimeter answers have independent geometric checks', () => {
  const correct = f => f.Q.choices.find(c => c.ok).p;
  const integerSolutions = square => Array.from({ length: 30 }, (_, i) => i + 1).filter(n => n * n === square);
  for (const [label, expected] of [['빗변문제', 10], ['직각변', 6]]) {
    const L = find('py1-rot', label), first = frame('py1-rot', L), moving = frame('py1-rot', L, 2), final = end('py1-rot', L);
    for (const f of [first, moving, final]) {
      const triangle = f.paths.find(p => p.options.fill === 'ink' && p.options.fillAlpha === .06).points;
      const lengths = triangle.map((p, i) => { const q = triangle[(i + 1) % 3]; return Math.hypot(p.x - q.x, p.y - q.y); }).sort((a, b) => a - b);
      [6, 8, 10].forEach((n, i) => close(lengths[i], n, 'rotation preserves original side length'));
      close(area(triangle.map(p => [p.x, p.y])), 24, 'rotation preserves triangle area');
    }
    assert.equal(correct(final), String(expected));
    assert.deepEqual(integerSolutions(label === '직각변' ? 10 * 10 - 8 * 8 : 6 * 6 + 8 * 8), [expected]);
  }
  const square = end('py1-sq', find('py1-sq', '제곱으로')), leg = end('py1-leg', find('py1-leg', '제곱으로'));
  assert.equal(2 * 2 + 3 * 3, 13); assert.deepEqual(integerSolutions(13), []); assert.ok(square.texts.includes('c²=13'));
  assert.equal(5 * 5 - 2 * 2, 21); assert.deepEqual(integerSolutions(21), []); assert.ok(leg.texts.includes('b²=21'));
  const grid = end('py1-grid', find('py1-grid', '넓이문제'));
  const drawnSquare = grid.paths.find(p => p.options.fill === 'amber' && p.options.fillAlpha === .26).points;
  assert.equal(area(drawnSquare.map(p => [p.x, p.y])), 13); assert.equal(correct(grid), '13');
  assert.equal(area([[2, 0], [5, 2], [3, 5], [0, 3]]), 25 - 4 * (2 * 3 / 2));
  const chain = end('py1-chain', find('py1-chain', '길이의합'));
  const x2 = 17 * 17 - (6 + 9) ** 2, x = integerSolutions(x2)[0], y = integerSolutions(x * x + 6 * 6)[0];
  assert.deepEqual([x2, x, y, x + y], [64, 8, 10, 18]); assert.equal(correct(chain), String(x + y));
  for (const label of ['둘레', '넓이']) {
    const f = end('py1-perim', find('py1-perim', label));
    const triangle = f.paths.find(p => p.options.fill === 'ink' && p.options.fillAlpha === .06).points;
    const perimeter = triangle.reduce((n, p, i) => { const q = triangle[(i + 1) % 3]; return n + Math.hypot(p.x - q.x, p.y - q.y); }, 0);
    close(perimeter, 24, 'three boundary lengths');
    close(area(triangle.map(p => [p.x, p.y])), 24, 'shoelace triangle area');
    assert.equal(correct(f), '24');
  }
});

test('the proof diagrams independently conserve areas and retain the original exact rational length', () => {
  const points = p => p.points.map(q => [q.x, q.y]);
  const first = end('py2-bhas1', find('py2-bhas1', '가운데넓이'));
  const tilted = first.paths.find(p => p.options.fill === 'amber' && p.options.fillAlpha === .18);
  const four = first.paths.filter(p => p.options.fill === 'ink' && p.options.fillAlpha === .1);
  assert.equal(four.length, 4); assert.equal(four.reduce((n, p) => n + area(points(p)), 0), 24);
  assert.equal(area(points(tilted)), 25); assert.equal(25 + 24, 7 * 7);
  assert.equal(first.Q.choices.find(c => c.ok).p, '25');
  const rearranged = end('py2-bhas1', find('py2-bhas1', '배치증명'));
  const remaining = rearranged.paths.filter(p => p.options.fillAlpha === .3 && ['sky', 'green'].includes(p.options.fill));
  assert.deepEqual(remaining.map(p => area(points(p))).sort((a, b) => a - b), [9, 16]);
  const inner = end('py2-bhas2', find('py2-bhas2', '안쪽넓이'));
  const inside = inner.paths.find(p => p.options.fill === 'rose' && p.options.fillAlpha === .22), outside = inner.paths.find(p => p.options.fill === 'amber');
  close(area(points(inside)), 4, 'inner square shoelace area'); close(area(points(outside)), 34, 'outer square shoelace area');
  inside.points.forEach((p, i, ps) => {
    const q = ps[(i + 1) % 4], r = ps[(i + 2) % 4];
    close(Math.hypot(q.x - p.x, q.y - p.y), 2, 'each inner side is long leg minus short leg');
    close((q.x - p.x) * (r.x - q.x) + (q.y - p.y) * (r.y - q.y), 0, 'adjacent inner sides are perpendicular');
  });
  const triangles = inner.paths.filter(p => p.options.fill === 'sky' && p.options.fillAlpha === .22);
  assert.equal(triangles.length, 4); close(triangles.reduce((n, p) => n + area(points(p)), 0), 30, 'four triangles leave area four');
  assert.equal(inner.Q.choices.find(c => c.ok).p, '4');
  const trapezoid = end('py2-garf', find('py2-garf', '넓이문제'));
  const outer = trapezoid.paths.find(p => p.options.fill === 'ink' && p.options.fillAlpha === .05);
  assert.equal(area(points(outer)), 32); assert.equal(trapezoid.Q.choices.find(c => c.ok).p, '32');
  const L = [0, -3], X = [5, 0], R = [8, -5];
  assert.equal((L[0] - X[0]) * (R[0] - X[0]) + (L[1] - X[1]) * (R[1] - X[1]), 0);
  assert.equal(area([L, X, R]), 17); assert.equal(3 * 5 / 2 + 3 * 5 / 2 + 17, 32);
  const similar = end('py2-sim', find('py2-sim', '수선과길이'));
  const foot = (5 * 5 + 4 * 4 - 3 * 3) / (2 * 5);
  close(foot, 16 / 5, 'projection from three independently fixed sides');
  close(5 / 4, 4 / foot, 'corresponding hypotenuse ratio');
  close(5 * foot, 16, 'left similarity product'); close(5 * (5 - foot), 9, 'right similarity product');
  assert.equal(similar.Q.choices.find(c => c.ok).t, '\\frac{16}{5}');
  assert.equal(similar.Q.choices.find(c => c.ok).p, '5분의 16');
  assert.ok(similar.texts.includes('x=\\frac{16}{5}'));
  assert.ok(!similar.texts.some(t => /3\.2|√|\\sqrt/.test(t)), 'rendered answer remains the exact source fraction');
});

test('new numerical labels wait for their matching captions and each conclusion waits for the final chapter', () => {
  const has = (id, label, time, text) => frame(id, find(id, label), time).texts.includes(text);
  const at = (id, label, time, text) => { assert.equal(has(id, label, time - .01, text), false, `${id}/${label}: hidden before ${time}`); assert.equal(has(id, label, time, text), true, `${id}/${label}: spoken label appears at ${time}`); };
  at('py1-rot', '빗변문제', 17.5, 'x²=36+64=100');
  at('py1-rot', '직각변', 17.5, 'x²=100−64=36');
  at('py1-perim', '둘레', 12, 'c²=36+64=100');
  at('py1-perim', '넓이', 12, 'b²=100−36=64');
  at('py1-chain', '길이의합', 17.5, 'x=8'); at('py1-chain', '길이의합', 24, 'y²=100');
  at('py1-chain', '길이의합', 29.5, 'y=10'); at('py1-chain', '길이의합', 41.5, 'x+y=8+10=18');
  at('py2-bhas1', '가운데넓이', 12, '큰 정사각형 7²=49');
  at('py2-bhas1', '가운데넓이', 17.5, '큰 넓이 49 − 삼각형 넷 24');
  at('py2-bhas1', '가운데넓이', 29.5, 'c²=25');
  at('py2-bhas1', '배치증명', 29.5, 'a²=9'); at('py2-bhas1', '배치증명', 29.5, 'b²=16');
  at('py2-bhas2', '안쪽한변', 29.5, '한 변 2');
  assert.equal(has('py2-bhas2', '안쪽한변', 36, '4'), false, 'side lesson does not disclose an unasked area');
  at('py2-bhas2', '안쪽넓이', 12, '가운데 한 변 5−3=2');
  at('py2-bhas2', '안쪽넓이', 29.5, '4');
  at('py2-bhas2', '넓이증명', 17.5, '넓이 4');
  at('py2-bhas2', '넓이증명', 24, '삼각형 넷: 4×3×5÷2=30');
  at('py2-bhas2', '넓이증명', 29.5, 'c²=30+4=34');
  at('py2-garf', '사다리증명', 29.5, '\\frac{c²}{2}');
  at('py2-garf', '넓이문제', 29.5, '사다리꼴 넓이 (3+5)×8÷2=32');
  at('py2-sim', '수선과길이', 24, '5x=4²=16');
  at('py2-sim', '수선과길이', 41.5, 'x=\\frac{16}{5}');
  for (const id of ownedIds) for (const lesson of list(id)) {
    const finalStart = lesson.chapters.slice(0, -1).reduce((n, ch) => n + ch.length, 0);
    const state = frame(id, lesson, finalStart - .01).state;
    assert.equal(state.sets.pyShowAnswer, false, `${id}/${lesson.label}: no conclusion before final chapter`);
  }
});
