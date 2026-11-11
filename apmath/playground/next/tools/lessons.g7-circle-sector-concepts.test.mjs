// Actual scene/Board source contracts. These are not browser/mobile screenshots.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/circle-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const ids = ['z0-center', 'z0-diameter', 'z0-arc', 'z0-sector', 'z0-segment'];
const concepts = async () => {
  const lab = await load();
  return { lab, lessons: ids.flatMap(id => core.lessonList(lab.def.lessons[id]).map((lesson, k) => ({ id, k, lesson }))) };
};
function frame(lab, id, k, t, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false });
  lab.go(id);
  const lesson = core.lessonList(lab.def.lessons[id])[k], compiled = core.compileLesson(lesson);
  const state = core.stateAt(compiled, t, { nums: { ...lab.s }, sets: { ...lab.s }, step: lab.s.step, part: lab.s.part });
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, playing: false, dragging: !entry });
  lab.tab = entry ? 'explore' : compiled.tab;
  if (compiled.usesStep && !entry) lab.s.step = state.step;
  const result = lab.draw();
  return { ...result, text: result.texts.join('\n'), state: { ...lab.s }, compiled };
}

test('five actual scenes register seven separate concepts with no validator errors/warnings', async () => {
  const {lab, lessons} = await concepts();
  assert.equal(lessons.length, 7);
  assert.deepEqual(Array.from(core.lessonList(lab.def.lessons['z0-diameter']), l => l.label), ['지름', '원주율']);
  assert.deepEqual(Array.from(core.lessonList(lab.def.lessons['z0-sector']), l => l.label), ['호의 길이', '넓이']);
  for (const {id, lesson} of lessons) {
    assert.ok(lab.list.some(sc => sc.id === id));
    const validation = core.validateLesson(lesson);
    assert.deepEqual(validation.errors, [], id);
    assert.deepEqual(validation.warnings, [], id);
    for (const chapter of lesson.chapters) {
      assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const says = chapter.cues.filter(c => c.say);
      assert.ok(says.length >= 2 && says.length <= 3);
      for (const cue of says) assert.ok(core.plainLen(cue.say) <= 40, id + ': ' + cue.say);
      for (const numbers of [chapter.start || {}, ...chapter.cues.map(c => c.to || {})]) {
        for (const [key, value] of Object.entries(numbers)) {
          assert.ok(lab.params[key], id + ': actual state control ' + key);
          assert.ok(value >= lab.params[key].min && value <= lab.params[key].max, id + ':' + key);
        }
      }
    }
  }
});

test('radius and diameter are independently computed from endpoints at the scene state angles', async () => {
  const {lab} = await concepts(), r = 6;
  for (const t of [0, .2, 1, 4.2, 10, 15, 19]) {
    const point = frame(lab, 'z0-center', 0, t), a = point.state.csQ * Math.PI / 180;
    assert.equal(point.state.csR, r);
    const P = [r * Math.cos(a), r * Math.sin(a)];
    assert.ok(Math.abs(Math.hypot(...P) - r) < 1e-12);
    assert.match(point.text, /r = 6 cm/);
    assert.doesNotMatch(point.text, /12π|원주|지나간 길이|≈/);
  }
  const diameter = frame(lab, 'z0-diameter', 0, 15), a = diameter.state.csD * Math.PI / 50;
  const A = [r * Math.cos(a), r * Math.sin(a)], B = [-A[0], -A[1]];
  assert.ok(Math.abs(Math.hypot(A[0] - B[0], A[1] - B[1]) / r - 2) < 1e-12);
  assert.match(diameter.text, /지름 = 6 \+ 6 = 12 cm/);
  assert.doesNotMatch(frame(lab, 'z0-diameter', 0, 14.99).text, /지름 = 6 \+ 6 = 12/);
  assert.doesNotMatch(frame(lab, 'z0-diameter', 0, 18.99).text, /지름 = 2r/);
  assert.match(frame(lab, 'z0-diameter', 0, 19).text, /지름 = 2r/);
});

test('circumference ratio uses one full turn and withholds π and moving decimal distances', async () => {
  const {lab} = await concepts();
  const r = 6, theta = 2 * Math.PI, distance = r * theta, diameter = 2 * r;
  assert.equal(distance / diameter, Math.PI);
  const end = frame(lab, 'z0-diameter', 1, 31);
  assert.equal(end.state.csD, 100);
  assert.match(end.text, /원주 = 12π cm/);
  assert.match(end.text, /원주 ÷ 지름 = 12π ÷ 12 = π/);
  for (const t of [0, 5, 10, 10.3, 12.2, 16.7, 17.5, 18, 22, 26.99]) {
    const f = frame(lab, 'z0-diameter', 1, t);
    assert.doesNotMatch(f.text, /π|≈|\d+\.\d+\s*cm/, 'unexplained ratio or moving decimal at ' + t);
  }
  assert.match(frame(lab, 'z0-diameter', 1, 27).text, /원주 ÷ 지름 = π/);
  assert.doesNotMatch(frame(lab, 'z0-diameter', 1, 30.99).text, /12π/);
});

test('arc/chord comparison is valid across the actual allowed angles and drawn equal-scale bars', async () => {
  const {lab} = await concepts();
  const param = lab.params.csS, r = 6;
  for (let d = param.min; d <= param.max; d += param.step) {
    const theta = d * Math.PI / 180;
    const A = [r, 0], B = [r * Math.cos(theta), r * Math.sin(theta)];
    const straight = Math.hypot(A[0] - B[0], A[1] - B[1]), curved = r * theta;
    assert.ok(straight < curved, d + ': Euclidean distance is shorter than the circular path');
    assert.ok(2 * Math.sin(theta / 2) * .64 < theta * .64, 'equal drawing scale preserves comparison');
  }
  assert.doesNotMatch(frame(lab, 'z0-arc', 0, 18.99).text, /현 AB가 더 짧아요/);
  assert.match(frame(lab, 'z0-arc', 0, 19).text, /현 AB가 더 짧아요/);
  for (const t of [0, 5, 10, 15, 19]) assert.doesNotMatch(frame(lab, 'z0-arc', 0, t).text, /π|\d+\s*cm/);
});

for (const [k, kind] of [[0, 'arc'], [1, 'area']]) test(kind + ': independent sector coefficients and given/calculate/compare gates', async () => {
  const {lab} = await concepts(), r = 6;
  const calc = angle => kind === 'arc' ? 2 * r * angle / 360 : r * r * angle / 360;
  const before = calc(90), after = calc(180);
  assert.equal(after / before, 2);
  assert.deepEqual([before, after], kind === 'arc' ? [3, 6] : [9, 18]);
  const a = new RegExp(before + 'π'), b = new RegExp(after + 'π');
  assert.doesNotMatch(frame(lab, 'z0-sector', k, 8.99).text, a);
  assert.match(frame(lab, 'z0-sector', k, 9).text, a);
  for (const t of [13, 13.2, 15, 17]) {
    const moving = frame(lab, 'z0-sector', k, t);
    assert.equal(moving.state.csR, r);
    assert.doesNotMatch(moving.text, /π|원 전체의/, 'new angle is shown before recalculation');
  }
  assert.doesNotMatch(frame(lab, 'z0-sector', k, 21.99).text, b);
  assert.match(frame(lab, 'z0-sector', k, 22).text, b);
  assert.doesNotMatch(frame(lab, 'z0-sector', k, 30.99).text, /도 2배/);
  assert.match(frame(lab, 'z0-sector', k, 31).text, kind === 'arc' ? /호의 길이도 2배/ : /넓이도 2배/);
  // A concept button never adds the other concept's derived result.
  for (const t of [0, 9, 22, 26, 31]) assert.doesNotMatch(frame(lab, 'z0-sector', k, t).text, kind === 'arc' ? /넓이 =/ : /호 AB =/);
});

test('segment definition follows the source boundary rather than counting the two radii', async () => {
  const {lab} = await concepts();
  const sc = lab.go('z0-segment');
  assert.match(sc.steps(lab.s)[0], /호 AB와 현 AB로 둘러싸인/);
  assert.doesNotMatch(frame(lab, 'z0-segment', 0, 4.99).text, /호 AB/);
  assert.match(frame(lab, 'z0-segment', 0, 5).text, /호 AB/);
  assert.doesNotMatch(frame(lab, 'z0-segment', 0, 9.99).text, /현 AB/);
  assert.match(frame(lab, 'z0-segment', 0, 10).text, /현 AB/);
  assert.doesNotMatch(frame(lab, 'z0-segment', 0, 18.99).text, /호와 현으로 둘러싸인 활꼴/);
  assert.match(frame(lab, 'z0-segment', 0, 19).text, /호와 현으로 둘러싸인 활꼴/);
});

test('all concept entries/replays withhold conclusions and every cue draws finite nonempty geometry', async () => {
  const {lab, lessons} = await concepts();
  for (const {id, k, lesson} of lessons) {
    const compiled = core.compileLesson(lesson);
    frame(lab, id, k, compiled.length);
    const entry = frame(lab, id, k, 0, true);
    assert.equal(entry.state.csConceptShow, false);
    assert.equal(entry.value.chips.length, 0);
    assert.equal(entry.value.readouts.length, 0);
    const lastChapter = compiled.chapters.at(-1).at;
    const cues = compiled.cues.map(c => c.at);
    for (const t of [...new Set([0, .75, compiled.length, ...cues, ...cues.filter(t => t > 0).map(t => t - .01)])]) {
      const f = frame(lab, id, k, t);
      assert.ok(f.commands.some(c => ['arc', 'lineTo'].includes(c[0])), id + ':' + t);
      if (t < lastChapter) assert.equal(f.state.csConceptShow, false, id + ': final stage gate');
    }
  }
});
