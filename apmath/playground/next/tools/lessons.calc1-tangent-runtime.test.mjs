// Focused release checks through the student HTML and actual source Board.
// Full browser, mobile and independent visual review remain outside this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/tangent-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = { secant: 4, mvt: 2, cusp: 4, normal: 4, common: 3, tanint: 4, mvtband: 5 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} ≠ ${expected}`);
const number = value => typeof value === 'number' ? value : value.v ?? value.val;
const polynomial = (co, x, den = 1) => co.reduce((value, c) => value * x + number(c), 0) / den;
const derivative = (co, x, den = 1) => polynomial(co.slice(0, -1).map((c, i) => number(c) * (co.length - i - 1)), x, den);
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, t, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, t, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step });
  lab.tab = 'review';
  return state;
}
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.ctExplore);
const drawingSignature = frame => JSON.stringify({ paths: frame.paths, points: frame.points, plots: frame.plots, handles: frame.handles });

test('actual inline HTML and deferred module register all seven scenes and 26 valid lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'calc1-tangent');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), Object.keys(counts));
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Object.keys(counts).sort());
  assert.ok(lab.api && lab.lessonApi && video, 'source, lesson factory and video core are loaded by the page');
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'calc1-tangent/lesson.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, examples = 0;
  for (const scene of lab.list) {
    const lessons = lessonsOf(scene.id);
    assert.equal(lessons.length, counts[scene.id]);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    for (const lesson of lessons) {
      const first = lesson.chapters[0].cues[0];
      first.set.ctConcept ? concepts++ : examples++;
      for (const key of ['ctQuestion', 'ctConcept', 'ctExplore', 'ctTarget', 'ctShowAnswer']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.set.ctShowAnswer, false);
      assert.equal(first.at, 0);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15, `${scene.id}: authored chapter is 8–15 seconds`);
      const compiled = video.compileLesson(lesson);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: ${key} has a numeric initial value`);
    }
  }
  assert.equal(concepts, 17);
  assert.equal(examples, 9);
});

test('the MVT concept leaves its preserved endpoint interval inside the active slider range', () => {
  lab.go('mvt');
  const compiled = video.compileLesson(lessonsOf('mvt')[0]);
  const state = video.stateAt(compiled, compiled.length, baseState());
  const end = { ...state.nums, ...state.sets }, control = lab.def.params.dx;
  assert.ok(end.dx > 0, 'the two endpoints remain distinct');
  assert.ok(end.dx >= control.min && end.dx <= control.max, 'closing preserves a value that the displayed slider can represent');
});

test('the seven original packets independently satisfy the stated polynomial and geometry conditions', () => {
  const get = id => { const scene = lab.go(id), packet = lab.api.first(id); assert.equal(packet, scene.vary.first()); return packet; };
  {
    const v = get('secant');
    assert.deepEqual(plain([v.co, v.den, v.x1, v.x2, v.a0, v.p, v.q]), [[1, 0, -3, 2], 2, 1, 3, 2, 3, -2]);
    const avg = (polynomial(v.co, v.x2, v.den) - polynomial(v.co, v.x1, v.den)) / (v.x2 - v.x1);
    const slope = derivative(v.co, v.a0, v.den);
    near(v.avg.v, avg, 'secant slope'); near(avg, 5, 'original average');
    near(v.fpq.v, slope, 'tangent slope'); near(v.lim.v, (v.p - v.q) * slope, 'two increments over h');
    assert.equal(v.lim.n, 45); assert.equal(v.lim.d, 2);
  }
  {
    const v = get('mvt');
    assert.deepEqual(plain([v.a, v.b]), [-1, 2]);
    const avg = (polynomial(v.co, v.b, v.den) - polynomial(v.co, v.a, v.den)) / (v.b - v.a);
    near(v.avg.v, avg, 'MVT average');
    const solutions = [-1, 1].filter(c => c > v.a && c < v.b && Math.abs(derivative(v.co, c, v.den) - avg) < 1e-9);
    assert.deepEqual(Array.from(v.inside, c => c.val), solutions);
    assert.deepEqual(solutions, [1], 'the endpoint −1 is excluded');
  }
  {
    const v = get('cusp');
    assert.equal(v.c, 1); assert.deepEqual(plain(v.co), [1, 0, 0]);
    near(v.p.v, derivative(v.co, v.c), 'same derivative at the join');
    near(v.p.v * v.c + v.q.v, polynomial(v.co, v.c), 'continuity at the join');
    near(v.p.v, 2, 'original p'); near(v.q.v, -1, 'original q');
  }
  {
    const v = get('normal');
    near(v.a.v, 1, 'minimum point x'); near(v.fa.v, 1, 'minimum point y');
    near(derivative(v.co, v.a.v), v.m, 'parallel tangent');
    near(v.H[1], v.m * v.H[0] + v.n.v, 'foot is on the given line');
    near((v.T[0] - v.H[0]) + v.m * (v.T[1] - v.H[1]), 0, 'TH is perpendicular to the line');
    near(Math.hypot(v.T[0] - v.H[0], v.T[1] - v.H[1]), Math.SQRT2, 'exact minimum distance');
    near(v.d.val, Math.SQRT2, 'source radical');
    for (const x of [-3, -1, 0, 1, 2, 4]) near(polynomial(v.co, x) - (v.m * x + v.n.v), v.u.v * (x - v.a.v) ** 2 + v.k, 'positive square establishes a global minimum');
  }
  {
    const v = get('common');
    near(v.ft.v, polynomial(v.co, v.t, v.den), 'contact value on f');
    near(v.g(v.t), v.ft.v, 'contact value on g');
    near(v.mq.v, derivative(v.co, v.t, v.den), 'slope on f');
    near(2 * v.u.v * v.t + v.p.v, v.mq.v, 'slope on g');
    near(v.n.v, v.ft.v - v.t * v.mq.v, 'common tangent intercept');
    near(v.mq.v, 1, 'original common slope'); near(v.n.v, 0, 'original tangent y=x');
  }
  {
    const v = get('tanint');
    assert.deepEqual(plain(v.co), [1, -3, 0, 2]);
    for (const t of [-1, 0, 0.5, 1, 1.5, 2]) near(v.g(t), polynomial(v.co, t) - t * derivative(v.co, t), 'y-intercept from the tangent equation');
    const gp = t => -t * (6 * v.co[0] * t + 2 * v.co[1]);
    assert.deepEqual([-0.5, 0.5, 1.5].map(t => Math.sign(gp(t))), [-1, 1, -1]);
    near(v.g(1), 3, 'local maximum'); near(v.g(0), 2, 'local minimum'); near(v.ans, 3, 'asked local maximum');
    assert.ok(lab.api.question('tanint').includes('극댓값'));
    assert.ok(v.g(-10) > v.ans, 'local maximum is not a global bound');
  }
  {
    const v = get('mvtband');
    assert.deepEqual(plain([v.a, v.fa, v.b, v.L, v.both, v.ask]), [1, 3, 4, 2, false, 'min']);
    const attained = x => v.fa + v.L * (x - v.a);
    near(v.ans, attained(v.b), 'MVT lower bound is attained by an allowed line');
    near(v.ans, 9, 'original f(4) minimum');
  }
});

test('all authored cue states render finite source geometry, suppress old cards and begin visible motion', t => {
  let frames = 0;
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState();
    const packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base);
    const first = lab.draw();
    apply(compiled, 0.8, base);
    const moving = lab.draw();
    assert.notEqual(drawingSignature(moving), drawingSignature(first), `${scene.id}/${lesson.label}: actual geometry moves within a second`);
    assert.ok(moving.points.some(p => p.options.color === 'violet' && p.options.r === 4.5 && !p.options.label), `${scene.id}/${lesson.label}: visible trace point is drawn`);
    const times = new Set([0, 0.8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + cue.dur / 2)); }
    for (const time of times) {
      apply(compiled, time, base);
      const frame = lab.draw();
      frames++;
      assert.ok(frame.paths.length || frame.plots.length, `${scene.id}/${lesson.label}@${time}: geometry exists`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo'), `${scene.id}/${lesson.label}@${time}: real Board issues drawing commands`);
      assert.deepEqual(plain(frame.value), {}, 'legacy result cards remain hidden during narration');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.equal(scene.panes(lab.s), null, 'lesson uses one synchronized board');
      assert.equal(scene.vary.cur(), packet, 'source original remains fixed');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.ctShowAnswer, false, 'answer is withheld until the last chapter');
      if (time === compiled.length) assert.equal(lab.s.ctShowAnswer, true, 'final chapter concludes the lesson');
    }
    assert.deepEqual(plain(packet), before, `${scene.id}: playback does not mutate the source original`);
  }
  t.diagnostic(`${frames} production Board cue frames; browser/mobile visual review NOT_RUN`);
});

test('source answers stay hidden before the final stage and on stale final entry previews', () => {
  const answerLabel = (id, target) => id === 'secant' ? (target === 'average' ? /^평균변화율 5$/ : /^f′\(2\)\s*=/)
    : id === 'mvt' ? /^c\s*=\s*1$/
      : id === 'cusp' ? /^(?:기울기 2|p\s*=\s*2,\s*q\s*=)/
        : id === 'normal' ? (target === 'point' ? /^T\(1,\s*1\)$/ : /^d\s*=/)
          : id === 'common' ? /^y\s*=\s*x$/
            : id === 'tanint' ? /^극대 3$/ : /^최솟값 9$/;
  for (const scene0 of lab.list) for (const lesson of sourceLessons(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const pattern = answerLabel(scene.id, lab.s.ctTarget);
    // Even a stale or externally high step cannot bypass the answer flag.
    lab.s.step = 99;
    assert.ok(!lab.draw().texts.some(text => pattern.test(text)), `${scene.id}/${lesson.label}: numeric answer gated before final`);
    apply(compiled, compiled.length, base);
    assert.ok(lab.draw().texts.some(text => pattern.test(text)), `${scene.id}/${lesson.label}: source conclusion is visible at the end`);
    lab.s.lessonOn = false; lab.s.lessonEntry = true;
    assert.ok(!lab.draw().texts.some(text => pattern.test(text)), `${scene.id}/${lesson.label}: entry ignores stale final flags`);
    assert.equal(scene.vary.cur(), lab.api.first(scene.id));
  }
});

test('actual manual new-problem clicks survive lesson first-packet playback and replay', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0];
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3;
    lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab);
    assert.notEqual(manual, first, `${scene.id}: actual click generated a manual variant`);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const question = scene.question(lab.s, lab), firstFrame = drawingSignature(lab.draw());
    assert.equal(scene.vary.cur(), first);
    assert.ok(question.includes(lab.api.question(scene.id)), `${scene.id}: original conditions retained`);
    assert.ok(!question.includes('data-ou-new') && !question.includes('data-cx-new'), 'lesson question has no manual new-problem button');
    lab.s.playing = true;
    if (scene.tick) { const before = plain(lab.s); assert.equal(scene.tick(lab.s, 1, lab), false); assert.deepEqual(plain(lab.s), before, 'legacy auto-animation cannot change lesson state'); }
    apply(compiled, compiled.length, base);
    apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(drawingSignature(lab.draw()), firstFrame, `${scene.id}: replay restores the same initial geometry`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual, `${scene.id}: direct exploration retains its manual problem`);
    assert.equal(scene.problem.text(lab.s, lab), manualText);
  }
});

test('source secant and intercept motions use the original function rather than an unrelated graph', () => {
  const scene = lab.go('secant'), v = lab.api.first(scene.id);
  Object.assign(lab.s, { lessonOn: true, lessonEntry: false, ctExplore: false, ctShowAnswer: false, ctTarget: 'limit', ctTrace: 0, step: 2 });
  for (const h of [0.12, 0.01]) {
    lab.s.ctH = h;
    const frame = lab.draw();
    for (const [label, coefficient] of [['a+ph', v.p], ['a+qh', v.q]]) {
      const drawn = frame.points.find(p => p.options.label === label)?.point;
      assert.ok(drawn, label + ' is drawn');
      near(drawn.x, v.a0 + coefficient * h, label + ' x');
      near(drawn.y, polynomial(v.co, drawn.x, v.den), label + ' remains on f');
    }
  }
  lab.go('tanint');
  const w = lab.api.first('tanint');
  Object.assign(lab.s, { lessonOn: true, lessonEntry: false, ctExplore: false, ctShowAnswer: false, ctTrace: 0, step: 2 });
  for (const t of [0.4, 1.3]) {
    lab.s.ctT = t;
    const frame = lab.draw(), expected = polynomial(w.co, t) - t * derivative(w.co, t);
    assert.ok(frame.points.some(p => Math.abs(p.point.x - t) < 1e-9 && Math.abs(p.point.y - polynomial(w.co, t)) < 1e-9), 'contact point moves on the source cubic');
    assert.ok(frame.points.some(p => Math.abs(p.point.x) < 1e-9 && Math.abs(p.point.y - expected) < 1e-9), 'intercept moves on the actual tangent');
  }
});
