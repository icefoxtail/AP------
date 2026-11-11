// Focused source, calculation and production-Board safety for similarity t1–t3.
// This does not claim mobile or independent visual QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { load } from './helpers/similarity-lesson-runtime.mjs';
const video = createRequire(import.meta.url)('../kit/apl-video-core.js');
const lab = await load();
const ids = ['sm1-corr', 'sm1-solid', 'sm1-len', 'sm1-always', 'sm2-tile', 'sm2-cube', 'sm2-solid', 'sm2-cone',
  'sm3-par', 'sm3-flip', 'sm3-rot', 'sm3-sas', 'sm3-multi', 'sm3-ssa', 'sm3-foldrect', 'sm3-foldequi', 'sm3-trap'];
const list = id => Array.from(video.lessonList(lab.def.lessons[id]));
const near = (actual, expected, why) => assert.ok(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-8, `${why}: ${actual} != ${expected}`);
const length = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const area = (a, b, c) => Math.abs((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) / 2;
const dot = (v, a, b) => (a.x - v.x) * (b.x - v.x) + (a.y - v.y) * (b.y - v.y);
const normalize = value => String(value).replace(/\s|\$|개|닮음/g, '');
function frame(id, index, time = 0, entry = false) {
  Object.assign(lab.s, { lessonOn: false, lessonEntry: false }); lab.go(id);
  const lesson = list(id)[index], timeline = video.compileLesson(lesson);
  const result = video.stateAt(timeline, time, { nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
  Object.assign(lab.s, result.nums, result.sets, { lessonOn: !entry, lessonEntry: entry, step: result.step, dragging: true, playing: false });
  lab.tab = 'review';
  const source = lab.scene.sm;
  return { lesson, timeline, source, state: { ...lab.s }, model: source.model(lab.s),
    question: source.questionOf(lab.s), solution: source.solution(lab.s), draw: lab.draw() };
}
function problemFrames(id) {
  return list(id).flatMap((lesson, index) => lesson.chapters[0].cues[0].set.smLessonProblem ? [frame(id, index)] : []);
}
const fixtures = {
  'sm1-corr': [4, 32], 'sm1-solid': [25, 8, 8], 'sm1-len': [6, 6], 'sm1-always': ['정사각형', '직각삼각형'],
  'sm2-tile': [108, '1:4', '3:4'], 'sm2-cube': [64, '1:4', '1:9'], 'sm2-solid': [198, 384, '1:8', '9:25'], 'sm2-cone': ['1:7:19', 38],
  'sm3-par': [12, 12, 3, 6], 'sm3-flip': [12, 15], 'sm3-rot': [4, 15], 'sm3-sas': ['SAS', 15], 'sm3-multi': [6, 8, 21],
  'sm3-ssa': [0, 2, 1, 6], 'sm3-foldrect': [3, 5], 'sm3-foldequi': [9, 21], 'sm3-trap': [15, 9]
};

test('17 source scenes have 21 concepts and 44 fixed original problem examples', t => {
  let concepts = 0, problems = 0;
  for (const id of ids) {
    assert.deepEqual(video.validateLessonSet(list(id)), { errors: [], warnings: [] }, id);
    const answers = [];
    for (const [index, lesson] of list(id).entries()) {
      const first = frame(id, index), end = frame(id, index, first.timeline.length), pk = first.state.smPk;
      assert.equal(first.state.smSeed, 0); assert.equal(first.state.smShowAnswer, false);
      assert.equal(first.state.smCalculationReady, false); assert.equal(end.state.smShowAnswer, true);
      assert.ok(Object.isFrozen(pk), `${id}: fixed source inputs cannot be replaced by exploration`);
      assert.equal(JSON.stringify(pk), JSON.stringify(first.source.gen(pk.seed)), `${id}: original generator inputs`);
      assert.equal(first.question.key, end.question.key);
      assert.equal(JSON.stringify(first.question.choices), JSON.stringify(end.question.choices));
      const reveal = first.timeline.cues.filter(cue => cue.set?.smShowAnswer);
      assert.equal(reveal.length, 1); assert.equal(reveal[0].ch, lesson.chapters.length - 1);
      if (first.state.smLessonProblem) {
        problems++;
        const correct = first.question.choices.filter(choice => choice.ok);
        assert.equal(correct.length, 1); assert.equal(first.question.choices.length, 5);
        assert.equal(lesson.answer, lab.api.NUM[first.question.choices.indexOf(correct[0])]);
        assert.ok(normalize(lesson.answerText).includes(normalize(correct[0].p)));
        const expected = fixtures[id][answers.length];
        assert.equal(normalize(correct[0].p), normalize(expected), `${id}: source answer agrees with checked fixture`);
        assert.equal(normalize(first.solution.answer), normalize(expected), `${id}: source solution agrees with checked fixture`);
        const finalSay = lesson.chapters.at(-1).cues.at(-1).say;
        assert.ok(normalize(finalSay).includes(normalize(expected)), `${id}: authored final calculation gives the same answer`);
        answers.push(expected);
      } else concepts++;
    }
    assert.equal(answers.length, fixtures[id].length, `${id}: every intended problem example registered`);
  }
  assert.equal(concepts, 21); assert.equal(problems, 44);
  // corr generator kind 0/1 both enter the same length-question branch.
  assert.deepEqual(problemFrames('sm1-corr').map(r => r.state.smPk.kind === 2 ? 'perimeter' : 'length'), ['length', 'perimeter']);
  assert.deepEqual(problemFrames('sm1-solid').map(r => r.state.smPk.type), ['tet', 'box', 'cyl']);
  for (const [id, kinds] of Object.entries({ 'sm2-tile': [0, 1, 2], 'sm2-cube': [0, 1, 2], 'sm2-solid': [0, 1, 2, 3], 'sm2-cone': [0, 1],
    'sm3-par': [0, 1, 2, 3], 'sm3-flip': [0, 1], 'sm3-rot': [0, 1], 'sm3-sas': [0, 1], 'sm3-multi': [0, 1, 2], 'sm3-ssa': [0, 0, 0, 1],
    'sm3-foldrect': [0, 1], 'sm3-foldequi': [0, 1], 'sm3-trap': [0, 1] })) {
    assert.deepEqual(problemFrames(id).map(r => r.state.smPk.kind), kinds, `${id}: source problem kinds`);
  }
  t.diagnostic('17 scenes / 65 lessons: 21 concepts, 44 source examples; corr kinds 0/1 share one question family');
});

test('area, surface and volume answers agree with direct geometric measurements', () => {
  const answer = r => Number(r.solution.answer);
  const ratio = (a, b) => { const d = lab.api.gcd(a, b); return `${a / d}:${b / d}`; };
  for (const r of problemFrames('sm2-tile')) {
    const p = r.state.smPk, small = Math.sqrt(3) * p.p ** 2 / 4, large = Math.sqrt(3) * p.q ** 2 / 4;
    if (p.kind === 0) near(answer(r), p.p ** 2 * p.c * large / small, 'area scaling from triangle areas');
    else assert.equal(r.solution.answer, p.kind === 1 ? ratio(p.p ** 2, p.q ** 2) : ratio(p.p, p.q));
  }
  const cube = problemFrames('sm2-cube')[0], p = cube.state.smPk;
  near(answer(cube), (p.a * p.k) ** 3 / p.a ** 3, 'block count from actual volumes');
  for (const r of problemFrames('sm2-solid').slice(0, 2)) {
    const p = r.state.smPk, a = p.n, b = 2 * p.n, c = 3 * p.n;
    near(answer(r), p.kind === 0 ? 2 * (a * b + b * c + c * a) : a * b * c, 'box faces/volume');
  }
  for (const r of problemFrames('sm2-cone')) {
    const p = r.state.smPk, h = [p.h1, p.h1 + p.h2, p.h1 + p.h2 + p.h3];
    const volume = height => Math.PI * (height / 2) ** 2 * height / 3;
    const pieces = [volume(h[0]), volume(h[1]) - volume(h[0]), volume(h[2]) - volume(h[1])];
    if (p.kind === 0) for (const [i, n] of r.solution.answer.split(':').map(Number).entries()) near(pieces[i] / pieces[0], n, 'cone piece ratio');
    else near(answer(r), pieces[1] / pieces[0] * h[0] ** 3 * p.c, 'middle frustum volume from given top cone');
  }
  for (const r of problemFrames('sm3-trap')) {
    const p = r.state.smPk, g = lab.api.geo.trapGeo(p.a, p.bb, p.c);
    near(area(g.A, g.O, g.D), g.S1, 'upper triangle area');
    near(area(g.C, g.O, g.D), area(g.A, g.O, g.B), 'equal side areas');
    near(answer(r), p.kind === 0 ? area(g.C, g.O, g.D) : area(g.C, g.O, g.B), 'requested trapezoid piece');
  }
});

test('triangle correspondence, paper folds and SSA counts follow the actual coordinates', () => {
  for (const id of ['sm3-par', 'sm3-flip', 'sm3-sas', 'sm3-multi']) for (const r of problemFrames(id)) {
    const g = lab.api.solutionGeometry(id, r.state.smPk), flipped = id === 'sm3-flip';
    const scale = length(g.A, g.D) / length(g.A, flipped ? g.C : g.B);
    near(length(g.A, g.E) / length(g.A, flipped ? g.B : g.C), scale, `${id}: first two side ratios`);
    near(length(g.D, g.E) / length(g.B, g.C), scale, `${id}: third side ratio`);
  }
  for (const r of problemFrames('sm3-foldrect')) {
    const p = r.state.smPk, g = lab.api.geo.foldGeo(p.typ, p.j, 1);
    near(length(g.Dt, g.F), 0, 'folded D lands on F'); near(dot(g.F, g.A, g.E), 0, 'folded corner is right');
    near(length(g.A, g.B) / length(g.F, g.C), length(g.B, g.F) / length(g.C, g.E), 'AB:FC = BF:CE');
    near(Number(r.solution.answer), p.kind === 0 ? length(g.C, g.E) : length(g.D, g.E), 'queried folded rectangle segment');
  }
  for (const r of problemFrames('sm3-foldequi')) {
    const p = r.state.smPk, original = lab.api.geo.eqGeo('off', 30, 1), g = p.flip ? lab.api.geo.mirrorEq(original) : original;
    near(length(g.At, g.F), 0, 'folded A lands on F');
    near(length(g.B, g.D) / length(g.F, g.C), length(g.B, g.F) / length(g.C, g.E), 'BD:FC = BF:CE');
    near(length(g.F, g.E), length(g.A, g.E), 'fold preserves EF=EA');
    near(Number(r.solution.answer), p.kind === 0 ? length(g.C, g.E) : length(g.F, g.E), 'queried folded equilateral segment');
  }
  for (const r of problemFrames('sm3-ssa')) {
    const p = r.state.smPk, roots = radius => {
      const projection = p.c * Math.cos(Math.PI / 6), discriminant = radius ** 2 - (p.c / 2) ** 2;
      return discriminant < 0 ? [] : [...new Set([projection - Math.sqrt(discriminant), projection + Math.sqrt(discriminant)])].filter(x => x > 1e-9);
    };
    const count = p.kind === 0 ? roots(p.a).length : Array.from({ length: 2 * p.c }, (_, i) => i + 1).filter(radius => roots(radius).length === 2).length;
    near(Number(r.solution.answer), count, 'positive circle/ray intersections');
  }
});

test('65 lessons draw finite source geometry at entry and every cue with visible first motion', t => {
  let checked = 0;
  for (const id of ids) for (const [index, lesson] of list(id).entries()) {
    const timeline = video.compileLesson(lesson), entry = frame(id, index, 0, true), start = frame(id, index), moving = frame(id, index, 2);
    assert.ok(entry.draw.paths.length > 0, `${id}: core figure exists before playback`);
    assert.notEqual(JSON.stringify(moving.draw.paths), JSON.stringify(start.draw.paths), `${id}/${index}: first cue changes actual source geometry`);
    assert.equal(entry.draw.handles.length, 0);
    for (const time of [...timeline.cues.map(cue => cue.at), timeline.length]) {
      const r = frame(id, index, time);
      assert.ok(r.draw.paths.length > 0); assert.doesNotMatch(r.draw.texts.join(' '), /NaN|undefined|Infinity/);
      assert.equal(r.draw.handles.length, 0); assert.equal(r.draw.value.formula, null); assert.equal(r.draw.value.rule, null);
      checked++;
    }
  }
  t.diagnostic(`${checked} production cue frames; full mobile/visual QA NOT_RUN`);
});

test('rotation, answer labels and SSA counted intersections follow the authored reveal cue', () => {
  for (let index = 0; index < 3; index++) {
    const before = frame('sm3-rot', index), mid = frame('sm3-rot', index, 2), after = frame('sm3-rot', index, 6);
    assert.equal(before.state.smOt, 0); assert.ok(mid.state.smOt > 0 && mid.state.smOt < 1); assert.equal(after.state.smOt, 1);
    assert.notEqual(JSON.stringify(before.draw.paths), JSON.stringify(mid.draw.paths));
    assert.notEqual(JSON.stringify(mid.draw.paths), JSON.stringify(after.draw.paths));
    const p = before.state.smLessonProblem ? before.state.smPk : { m: before.model.m, n: before.model.n };
    for (const t of [0, mid.state.smOt, 1]) {
      const g = lab.api.geo.rotGeo(p.m, p.n, 210, t);
      near(length(g.A, g.D), 3 * p.m, 'rotating AD preserves length'); near(length(g.A, g.E), 4 * p.m, 'rotating AE preserves length');
      near(dot(g.A, g.D, g.E), 0, 'rotation preserves the included right angle');
    }
  }
  for (const index of [1, 2, 3]) {
    const before = frame('sm3-ssa', index, 24), after = frame('sm3-ssa', index, 30);
    assert.equal(before.state.smShowAnswer, false); assert.equal(after.state.smShowAnswer, true);
    assert.ok(!before.draw.texts.includes('C') && !before.draw.texts.includes('C′'), 'counted points hidden until the final answer cue');
    assert.ok(before.draw.texts.includes('H'), 'perpendicular comparison remains available');
    if (Number(after.solution.answer) > 0) assert.ok(after.draw.texts.includes('C'), 'constructed point appears with the answer');
  }
  for (const id of ids) for (const [index, lesson] of list(id).entries()) {
    if (!lesson.chapters[0].cues[0].set.smLessonProblem) continue;
    const before = frame(id, index, 24), after = frame(id, index, 30);
    if (Object.hasOwn(before.solution.targets, 'x')) {
      assert.ok(before.draw.texts.some(text => /\bx\b/.test(text)), `${id}: unknown stays unknown until reveal`);
      assert.ok(!after.draw.texts.some(text => /\bx\b/.test(text)), `${id}: final drawing resolves the unknown`);
    }
  }
});
