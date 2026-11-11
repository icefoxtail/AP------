// Source-bound math and production Board checks; no mobile visual-QA claim.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/pythagoras-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const pilotIds = ['py1-sq', 'py1-leg', 'py2-euclid'];
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

test('the three pilot explanations use fixed source conditions and valid complete timelines', () => {
  for (const id of pilotIds) {
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

test('new-question randomness, replay and switching cannot change the fixed pilot questions or resume legacy animation', () => {
  const expected = new Map();
  for (const id of pilotIds) for (const lesson of list(id)) {
    const initial = frame(id, lesson, 1);
    expected.set(id + '/' + lesson.label, { geometry: shape(initial), question: initial.question, q: JSON.stringify(lab.s.pyQ) });
  }
  for (const id of [...pilotIds, ...pilotIds.slice().reverse()]) for (const lesson of list(id)) {
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
