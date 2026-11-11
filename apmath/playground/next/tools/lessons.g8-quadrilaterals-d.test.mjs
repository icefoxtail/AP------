// Focused release safety for the nine recovered condition/counterexample scenes.
// Source geometry and problem choices are checked; mobile visual QA remains separate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/quadrilaterals-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const video = require('../kit/apl-video-core.js');
const lab = await load();
const ids = Array.from({ length: 9 }, (_, i) => 'q2-' + (i + 1));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (a, b, why) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const cross = (a, b, c, d) => (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
function frame(id, index, time = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const lesson = video.lessonList(lab.def.lessons[id])[index];
  assert.ok(lesson, id + '/' + index + ' is registered by HTML');
  const timeline = video.compileLesson(lesson);
  const result = video.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, result.nums, result.sets, { lessonOn: !entry, lessonEntry: entry, step: result.step, dragging: true, playing: false });
  lab.tab = 'review';
  const source = lab.scene.qd, model = source.model(lab.s), question = source.prob(model, lab.s), draw = lab.draw();
  return { lesson, timeline, source, model, question, draw, state: { ...lab.s } };
}

test('all missing condition scenes have valid lessons, fixed questions and last-chapter conclusions', t => {
  let count = 0;
  for (const id of ids) {
    const lessons = video.lessonList(lab.def.lessons[id]);
    assert.ok(lessons.length, id + ': no missing scene');
    assert.deepEqual(video.validateLessonSet(lessons), { errors: [], warnings: [] }, id);
    for (const [i, lesson] of lessons.entries()) {
      count++;
      const first = frame(id, i), end = frame(id, i, video.compileLesson(lesson).length);
      assert.equal(first.state.qdSeed, 0); assert.equal(first.state.qdShowAnswer, false);
      assert.equal(first.state.qdCalculationReady, false); assert.equal(end.state.qdShowAnswer, true);
      const reveals = first.timeline.cues.filter(c => c.set?.qdShowAnswer);
      assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, lesson.chapters.length - 1);
      assert.equal(first.question.key, end.question.key, id + ': fixed source problem');
      assert.equal(JSON.stringify(first.question.choices), JSON.stringify(end.question.choices));
      if (first.state.qdLessonProblem) {
        assert.equal(first.question.choices.length, 5); assert.equal(first.question.choices.filter(c => c.ok).length, 1);
        const visibleQuestion = lab.scene.question(first.state);
        for (const choice of first.question.choices) assert.ok(visibleQuestion.includes(choice.h ?? choice.t ?? choice.p), id + ': exact original choice');
        if (first.question.conditionId) {
          assert.equal(first.question.choices.findIndex(c => c.ok), 2, id + ': authored ③ matches original ordering');
          assert.equal(lesson.answer, '③');
        }
      }
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const key of Object.keys(cue.to || {}))
        assert.equal(Object.hasOwn(lesson.chapters[0].cues[0].set, key), false, `${id}/${i}: set cannot freeze ${key}`);
    }
  }
  t.diagnostic(`${ids.length} recovered scenes / ${count} registered explanations`);
});

test('numeric answers follow source lengths, angle sums and correspondence', () => {
  const angle = frame('q2-2', 1), perimeter = frame('q2-2', 2);
  near(angle.model.beta, 66, 'given opposite angle'); near(Number(angle.question.choices.find(c => c.ok).p.replace('°', '')), 66, 'opposite angle answer');
  const p = perimeter.model.pg;
  near(distance(p.A, p.B) + distance(p.B, p.C) + distance(p.C, p.D) + distance(p.D, p.A), 18, 'perimeter from coordinates');
  near(Number(perimeter.question.choices.find(c => c.ok).p), 18, 'perimeter answer');
  for (const [index, expected] of [[1, 2], [2, 8]]) {
    const h = frame('q2-3', index), m = h.model;
    near(distance(m.A, m.B), distance(m.C, m.D), 'RHA equal hypotenuses');
    near(cross(m.B, m.E, m.D, m.F), 0, 'two perpendiculars are parallel');
    near(distance(m.B, m.E), distance(m.D, m.F), 'RHA equal perpendiculars');
    near(distance(m.A, m.E), distance(m.C, m.F), 'RHA equal end segments');
    near(Number(h.question.choices.find(c => c.ok).p), expected, 'source length answer');
    near(m.L, 2 * m.e + m.ef, 'whole diagonal partition');
  }
  const exterior = frame('q2-4', 1), blank = frame('q2-4', 2);
  near(exterior.model.a + exterior.model.beta, 180, 'adjacent-angle sum');
  near(Number(exterior.question.choices.find(c => c.ok).p.replace('°', '')), 114, 'straight-angle subtraction');
  assert.equal(blank.question.choices.findIndex(c => c.ok), 2); assert.match(blank.question.choices[2].h, /EAD/);
});

test('the five counterexamples satisfy their given condition and violate parallelogram necessities', () => {
  const trap = frame('q2-5', 0).model;
  near(cross(trap.A, trap.D, trap.B, trap.C), 0, 'parallel bases');
  near(distance(trap.A, trap.B), distance(trap.D, trap.C), 'equal opposite legs');
  assert.notEqual(distance(trap.A, trap.D), distance(trap.B, trap.C), 'bases unequal');
  const kite = frame('q2-6', 0).model;
  const ac = { x: kite.C.x - kite.A.x, y: kite.C.y - kite.A.y }, bd = { x: kite.D.x - kite.B.x, y: kite.D.y - kite.B.y };
  near(ac.x * bd.x + ac.y * bd.y, 0, 'perpendicular diagonals');
  near(distance(kite.O, kite.B), distance(kite.O, kite.D), 'one diagonal bisected');
  assert.ok(Math.abs(distance(kite.O, kite.A) - distance(kite.O, kite.C)) > 1, 'other diagonal not bisected');
  const diag = frame('q2-7', 0).model;
  near(distance(diag.A, diag.C), distance(diag.B, diag.D), 'equal diagonal lengths');
  assert.ok(Math.abs(distance(diag.O, diag.A) - distance(diag.O, diag.C)) > 1, 'equal length is not bisection');
  const half = frame('q2-8', 0).model;
  near(distance(half.O, half.B), distance(half.O, half.D), 'BD bisected');
  assert.ok(Math.abs(distance(half.O, half.A) - distance(half.O, half.C)) > 1, 'AC not bisected');
  const adjacent = frame('q2-9', 0).model, opposite = frame('q2-9', 1).model;
  near(distance(adjacent.A, adjacent.B), distance(adjacent.B, adjacent.C), 'AB=BC');
  near(distance(adjacent.C, adjacent.D), distance(adjacent.D, adjacent.A), 'CD=DA');
  assert.ok(Math.abs(distance(adjacent.A, adjacent.B) - distance(adjacent.C, adjacent.D)) > 1, 'opposite sides unequal');
  near(distance(opposite.A, opposite.B), distance(opposite.C, opposite.D), 'AB=CD');
  near(distance(opposite.B, opposite.C), distance(opposite.D, opposite.A), 'BC=DA');
  near(cross(opposite.A, opposite.B, opposite.C, opposite.D), 0, 'opposite sides parallel');
});

test('entry, strategy and final cues draw finite visible geometry and actual first animation', t => {
  let checked = 0;
  for (const id of ids) for (const [i, lesson] of video.lessonList(lab.def.lessons[id]).entries()) {
    const timeline = video.compileLesson(lesson), first = frame(id, i, 0, true);
    assert.ok(first.draw.paths.some(p => p.options.color !== null));
    assert.doesNotMatch(first.draw.texts.join(' '), /NaN|undefined|Infinity|③|平行/);
    assert.ok(!first.draw.texts.includes(lesson.answer), 'no conclusion in entry caption');
    const moving = frame(id, i, 2), started = frame(id, i, 0);
    assert.notDeepEqual(moving.draw.paths.map(p => p.points), started.draw.paths.map(p => p.points), id + ': real first-cue trace changes drawing');
    for (const time of [...timeline.cues.map(c => c.at), timeline.length]) {
      const result = frame(id, i, time);
      assert.ok(result.draw.paths.length > 0, id + ': core geometry exists at cue ' + time);
      assert.doesNotMatch(result.draw.texts.join(' '), /NaN|undefined|Infinity/);
      if (result.state.qdCompare) assert.ok(result.draw.paths.filter(p => p.options.fillAlpha > 0).length >= 2, id + ': both compared triangles exist');
      checked++;
    }
  }
  t.diagnostic(`${checked} source cue frames; browser visual quality NOT_RUN`);
});
