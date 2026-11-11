// Focused release safety for right triangles, applications and centroids.
// Numeric and geometric evidence uses production source questions and the Board.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/similarity-lesson-runtime.mjs';
const require = createRequire(import.meta.url);
const video = require('../kit/apl-video-core.js');
const lab = await load();
const ids = ['sm6-trio', 'sm6-ab2', 'sm6-ac2', 'sm6-ah2', 'sm6-area', 'sm7-shadow', 'sm7-river', 'sm8-proof', 'sm8-six', 'sm8-gg', 'sm8-chain'];
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const near = (a, b, why) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const cross = (a, b, c, d) => (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x);
const area = (a, b, c) => Math.abs(cross(a, b, a, c)) / 2;
const dot = (v, a, b) => (a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y);
const cosine = (v, a, b) => dot(v, a, b) / (distance(v, a) * distance(v, b));
function frame(id, index, time = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const lesson = video.lessonList(lab.def.lessons[id])[index];
  assert.ok(lesson, `${id}/${index} registered by the production HTML`);
  const timeline = video.compileLesson(lesson);
  const result = video.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, result.nums, result.sets, { lessonOn: !entry, lessonEntry: entry, step: result.step, dragging: true, playing: false });
  lab.tab = 'review';
  const source = lab.scene.sm, model = source.model(lab.s), question = source.questionOf(lab.s), solution = source.solution(lab.s), draw = lab.draw();
  return { lesson, timeline, source, model, question, solution, draw, state: { ...lab.s } };
}
const numericAnswer = result => Number(result.question.choices.find(c => c.ok).p);
function checkAnswer(result, expected) {
  near(numericAnswer(result), expected, 'original choice answer follows geometry');
  near(Number(result.solution.answer), expected, 'original solver follows geometry');
  const authored = Number(result.lesson.answer.split('=').at(-1));
  near(authored, expected, 'authored final answer follows geometry');
}

test('all eleven scenes cover concepts and each fixed source problem kind', t => {
  let count = 0, problems = 0;
  for (const id of ids) {
    const list = video.lessonList(lab.def.lessons[id]);
    assert.equal(list.length, ['sm8-proof', 'sm8-six'].includes(id) ? 4 : 3, id);
    assert.deepEqual(video.validateLessonSet(list), { errors: [], warnings: [] }, id);
    for (const [index, lesson] of list.entries()) {
      count++;
      const first = frame(id, index), end = frame(id, index, video.compileLesson(lesson).length);
      assert.equal(first.state.smSeed, 0); assert.equal(first.state.smShowAnswer, false);
      assert.equal(first.state.smCalculationReady, false); assert.equal(end.state.smShowAnswer, true);
      assert.equal(first.state.smCTrace, 0); assert.equal(end.state.smCTrace, 1);
      const reveals = first.timeline.cues.filter(c => c.set?.smShowAnswer);
      assert.equal(reveals.length, 1); assert.equal(reveals[0].ch, lesson.chapters.length - 1);
      assert.equal(first.question.key, end.question.key, `${id}: question remains fixed`);
      assert.equal(JSON.stringify(first.question.choices), JSON.stringify(end.question.choices));
      for (const chapter of lesson.chapters) for (const cue of chapter.cues) for (const key of Object.keys(cue.to || {})) {
        assert.equal(Object.hasOwn(lesson.chapters[0].cues[0].set, key), false, `${id}: sets must not freeze ${key}`);
        assert.ok(Number.isFinite(lesson.chapters[0].start[key]), `${id}: ${key} reset before playback`);
      }
      if (index > 0) {
        problems++;
        assert.equal(first.state.smLessonProblem, true); assert.equal(first.state.smPk.kind, index - 1);
        assert.equal(first.question.choices.length, 5); assert.equal(first.question.choices.filter(c => c.ok).length, 1);
        const questionText = lab.scene.question(first.state);
        for (const choice of first.question.choices) assert.ok(questionText.includes(choice.h ?? choice.t ?? choice.p), `${id}: original choice shown`);
      } else assert.equal(first.state.smLessonProblem, false);
    }
  }
  assert.equal(count, 35); assert.equal(problems, 24);
  t.diagnostic('11 scenes / 35 lessons / 24 distinct source problem kinds');
});

test('right-triangle answers agree with coordinate lengths, angles and area', () => {
  for (const index of [1, 2]) {
    const r = frame('sm6-trio', index), g = lab.api.solutionGeometry('sm6-trio', r.model.pk);
    near(dot(g.A, g.B, g.C), 0, 'A is a right angle');
    near(cosine(g.A, g.B, g.H), cosine(g.C, g.A, g.B), 'BAH=C');
    near(distance(g.B, g.H) / distance(g.A, g.H), distance(g.A, g.H) / distance(g.C, g.H), 'BH:AH=AH:CH');
    assert.ok(r.question.choices.find(c => c.ok).h.includes(index === 1 ? 'angle C' : 'CH'));
  }
  for (const id of ['sm6-ab2', 'sm6-ac2', 'sm6-ah2']) for (const index of [1, 2]) {
    const r = frame(id, index), g = lab.api.solutionGeometry(id, r.model.pk);
    const endpoint = id === 'sm6-ab2' ? g.B : id === 'sm6-ac2' ? g.C : g.H;
    const expected = index === 1 ? distance(g.A, endpoint) ** 2 : id === 'sm6-ab2' ? distance(g.B, g.H) : distance(g.C, g.H);
    checkAnswer(r, expected);
    near(distance(g.A, g.H) ** 2, distance(g.B, g.H) * distance(g.H, g.C), 'height relation from coordinates');
    near(distance(g.A, g.B) ** 2 + distance(g.A, g.C) ** 2, distance(g.B, g.C) ** 2, 'right-triangle geometry');
  }
  for (const index of [1, 2]) {
    const r = frame('sm6-area', index), g = lab.api.solutionGeometry('sm6-area', r.model.pk);
    const S = area(g.A, g.B, g.C);
    near(distance(g.A, g.B) * distance(g.A, g.C) / 2, S, 'perpendicular-leg area');
    near(distance(g.B, g.C) * distance(g.A, g.H) / 2, S, 'hypotenuse-height area');
    checkAnswer(r, index === 1 ? distance(g.A, g.H) : distance(g.B, g.C));
  }
});

test('shadow and river problems keep the geometric measurement conditions', () => {
  for (const index of [1, 2]) {
    const r = frame('sm7-shadow', index), g = lab.api.solutionGeometry('sm7-shadow', r.model.pk);
    near(dot(g.A, g.Atop, g.Atip), 0, 'rod perpendicular to ground');
    near(dot(g.Bb, g.Btop, g.Btip), 0, 'tree perpendicular to ground');
    near(cross(g.Atop, g.Atip, g.Btop, g.Btip), 0, 'same parallel sunlight');
    near(distance(g.A, g.Atop) / distance(g.Bb, g.Btop), distance(g.A, g.Atip) / distance(g.Bb, g.Btip), 'corresponding height-shadow ratios');
    checkAnswer(r, index === 1 ? distance(g.Bb, g.Btop) : distance(g.A, g.Atip));
  }
  for (const index of [1, 2]) {
    const r = frame('sm7-river', index), g = lab.api.solutionGeometry('sm7-river', r.model.pk);
    near(cross(g.P, g.D, g.D, g.E), 0, 'P,D,E collinear');
    near(cross(g.Q, g.D, g.D, g.A), 0, 'Q,D,A collinear');
    near(dot(g.Q, g.P, g.D), 0, 'right angle Q'); near(dot(g.A, g.E, g.D), 0, 'right angle A');
    near(distance(g.P, g.Q) / distance(g.E, g.A), distance(g.Q, g.D) / distance(g.A, g.D), 'PQ:EA=QD:AD');
    checkAnswer(r, index === 1 ? distance(g.P, g.Q) : distance(g.A, g.D));
  }
});

test('centroid lengths and area ratios agree with the drawn coordinates', () => {
  for (const index of [1, 2, 3]) {
    const r = frame('sm8-proof', index), g = lab.api.solutionGeometry('sm8-proof', r.model.pk);
    near((g.A.x + g.B.x + g.C.x) / 3, g.G.x, 'centroid x');
    near((g.A.y + g.B.y + g.C.y) / 3, g.G.y, 'centroid y');
    near(distance(g.A, g.G) / distance(g.G, g.D), 2, 'AG:GD');
    near(distance(g.B, g.G) / distance(g.G, g.E), 2, 'BG:GE');
    near(distance(g.D, g.E) / distance(g.A, g.B), .5, 'midpoint segment ratio');
    checkAnswer(r, index === 2 ? distance(g.G, g.E) : distance(g.G, g.D));
  }
  for (const index of [1, 2, 3]) {
    const r = frame('sm8-six', index), g = lab.api.solutionGeometry('sm8-six', r.model.pk), total = area(g.A, g.B, g.C);
    const pieces = [[g.A, g.F, g.G], [g.F, g.B, g.G], [g.B, g.D, g.G], [g.D, g.C, g.G], [g.C, g.E, g.G], [g.E, g.A, g.G]];
    for (const triangle of pieces) near(area(...triangle) / total, 1 / 6, 'six equal areas from coordinates');
    const smallRatio = area(g.G, g.B, g.D) / total, quadRatio = (area(g.A, g.F, g.G) + area(g.A, g.G, g.E)) / total;
    const expected = index === 1 ? 6 * g.u * smallRatio : index === 2 ? g.u / smallRatio : 6 * g.u * quadRatio;
    checkAnswer(r, expected);
  }
  for (const index of [1, 2]) {
    const r = frame('sm8-gg', index), g = lab.api.solutionGeometry('sm8-gg', r.model.pk);
    near(distance(g.G, g.Gq) / distance(g.B, g.C), 1 / 3, 'centroid distance ratio');
    near(distance(g.P, g.Q) / distance(g.B, g.C), 1 / 2, 'midpoint distance ratio');
    near(cross(g.G, g.Gq, g.B, g.C), 0, 'centroid segment parallel to BC');
    checkAnswer(r, index === 1 ? distance(g.G, g.Gq) : distance(g.B, g.C));
  }
  for (const index of [1, 2]) {
    const r = frame('sm8-chain', index), g = lab.api.solutionGeometry('sm8-chain', r.model.pk), total = area(g.A, g.B, g.C);
    near((g.G.x + g.B.x + g.C.x) / 3, g.Gq.x, 'second centroid x');
    near((g.G.y + g.B.y + g.C.y) / 3, g.Gq.y, 'second centroid y');
    const ratio = area(g.Gq, g.B, g.D) / total;
    near(area(g.G, g.B, g.C) / total, 1 / 3, 'first area reduction');
    near(area(g.Gq, g.B, g.C) / total, 1 / 9, 'second area reduction');
    near(ratio, 1 / 18, 'final midpoint reduction');
    checkAnswer(r, index === 1 ? 18 * g.c * ratio : g.c / ratio);
  }
});

test('lesson cues draw finite geometry, visible traces and the original centroid rotation', t => {
  let checked = 0;
  for (const id of ids) for (const [index, lesson] of video.lessonList(lab.def.lessons[id]).entries()) {
    const timeline = video.compileLesson(lesson), entry = frame(id, index, 0, true), started = frame(id, index), moving = frame(id, index, 2);
    assert.ok(entry.draw.paths.length > 0); assert.equal(entry.draw.handles.length, 0);
    assert.notDeepEqual(moving.draw.paths.map(p => p.points), started.draw.paths.map(p => p.points), `${id}: real first-cue trace`);
    for (const time of [...timeline.cues.map(cue => cue.at), timeline.length]) {
      const result = frame(id, index, time);
      assert.ok(result.draw.paths.length > 0, `${id}: core geometry exists at ${time}`);
      assert.doesNotMatch(result.draw.texts.join(' '), /NaN|undefined|Infinity/);
      assert.equal(result.draw.handles.length, 0, `${id}: no extra required manipulation`);
      assert.equal(result.draw.value.formula, null); assert.equal(result.draw.value.rule, null);
      checked++;
    }
  }
  const proofEntry = frame('sm8-proof', 0, 0, true), proofBefore = frame('sm8-proof', 0, 24), proofMoving = frame('sm8-proof', 0, 26), proofEnd = frame('sm8-proof', 0, 36);
  assert.ok(proofEntry.draw.texts.includes('AG') && proofEntry.draw.texts.includes('GD'));
  assert.ok(!proofEntry.draw.texts.includes('4') && !proofEntry.draw.texts.includes('2'), 'derived segment examples hidden at entry');
  assert.notDeepEqual(proofBefore.draw.paths.map(p => p.points), proofMoving.draw.paths.map(p => p.points), 'original smGr rotation changes the comparison triangle');
  assert.equal(proofEnd.state.smGr, 1); assert.ok(proofEnd.draw.texts.includes('4') && proofEnd.draw.texts.includes('2'));
  const areaEntry = frame('sm6-area', 0, 0, true);
  assert.ok(areaEntry.draw.texts.includes('AH')); assert.ok(!areaEntry.draw.texts.includes('12'), 'derived AH hidden at entry');
  t.diagnostic(`${checked} source cue frames; browser visual quality NOT_RUN`);
});
