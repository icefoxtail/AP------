// Minimum release checks through the student HTML and actual source Board.
// Browser, mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/rational-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = { r1: 5, r2: 4, r3: 4, r4: 6 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} ≠ ${expected}`);
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.lrConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, plots: frame.plots, points: frame.points, handles: frame.handles });
const samePoint = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-8;
function currentCurve(id, s) {
  if (!s.lrExplore) {
    const v = lab.api.first(id);
    return { k: id === 'r4' ? v.K : v.k, p: v.p, q: v.q };
  }
  if (id === 'r1') return s.m1 === 1 ? { k: s.fb - s.fa * s.fc, p: -s.fc, q: s.fa } : { k: s.rk, p: s.rp, q: s.rq };
  if (id === 'r2') return { k: s.s2sg * s.s2k, p: s.s2p, q: s.s2q };
  return { k: id === 'r3' ? 4 : s.s4mode === 1 ? s.s4kl : s.s4k, p: 1, q: 1 };
}

test('production HTML registers four scenes and 19 valid lessons with first-source selection', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-rational');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), Object.keys(counts));
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Object.keys(counts));
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-rational/lesson-core.js', 'common-rational/lesson-a.js', 'common-rational/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id]);
    assert.equal(sourceLessons(scene.id).length, 1, 'only the first original is authored; random families remain manual');
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    assert.equal(lab.api.steps(scene.id).length, 4, 'the original four steps are preserved');
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lrConcept ? concepts++ : originals++;
      for (const key of ['lrQuestion', 'lrConcept', 'lrExplore', 'lrTarget', 'lrShowAnswer', 'lrLattice']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lrShowAnswer, false);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: initial numeric ${key}`);
    }
  }
  assert.equal(concepts, 15); assert.equal(originals, 4);
});

test('the four first originals agree with independent equations, distances and integer counts', () => {
  const get = id => { const scene = lab.go(id), v = lab.api.first(id); assert.equal(v, scene.vary.first()); return v; };
  {
    const v = get('r1');
    assert.equal(v.type, 'T'); assert.deepEqual(plain([v.p, v.q, v.pt]), [2, -2, [0, 0]]);
    const a = v.q, c = -v.p, [x, y] = v.pt, b = y * (x + c) - a * x;
    near(v.a, a, 'horizontal asymptote gives a'); near(v.c, c, 'denominator gives the excluded x');
    near(v.b, b, 'the given point gives b'); near(v.k, (x - v.p) * (y - v.q), 'shifted product');
    near(v.ans.val, a + b + c, 'coefficient sum'); near(v.ans.val, -4, 'first original sum');
    for (const t of [-3, 0, 1, 3]) near((a * t + b) / (t + c), v.k / (t - v.p) + v.q, 'fraction and translated graph agree');
  }
  {
    const v = get('r2');
    assert.equal(v.type, 'A'); assert.deepEqual([v.p, v.q, v.k], [1, 3, 8]);
    const u = Math.sqrt(v.k), A = { x: v.p - u, y: v.q - u }, B = { x: v.p + u, y: v.q + u };
    for (const P of [A, B]) {
      near((P.x - v.p) * (P.y - v.q), v.k, 'the intersection lies on the rational curve');
      near(P.y - P.x, v.q - v.p, 'the positive-slope symmetry axis contains the intersection');
    }
    near(v.ans.val, Math.hypot(B.x - A.x, B.y - A.y), 'distance from the two intersection coordinates');
    near(v.ans.val, 8, 'first original distance');
  }
  {
    const v = get('r3');
    assert.equal(v.type, 'R'); assert.deepEqual(plain([v.k, v.p, v.q, v.F]), [4, 1, 1, [2, 4]]);
    // Expand the equation in x rather than using the production discriminant helper.
    const coefficients = m => { const c = v.F[1] - m * v.F[0]; return [m, c - m * v.p - v.q, v.q * v.p - c * v.p - v.k]; };
    const noIntersection = m => { const [a, b, c] = coefficients(m); return a === 0 ? b === 0 && c !== 0 : b * b - 4 * a * c < 0; };
    const integers = Array.from({ length: 41 }, (_, i) => i - 20).filter(noIntersection);
    assert.deepEqual(integers, [-8, -7, -6, -5, -4, -3, -2]);
    assert.deepEqual(Array.from(v.ints), integers);
    for (const m of [-9, -1]) { const [a, b, c] = coefficients(m); near(b * b - 4 * a * c, 0, 'boundary is a tangent, not a missing intersection'); }
    assert.equal(noIntersection(0), false, 'the horizontal line is handled as a linear equation');
    near(v.ans.val, integers.length, 'first original integer slope count'); near(v.ans.val, 7, 'first original count');
  }
  {
    const v = get('r4');
    assert.equal(v.type, 'A'); assert.equal(v.ask, 'min');
    assert.deepEqual([v.p, v.q, v.s, v.t, v.m], [-1, 3, 0, 3, 4]);
    assert.ok(v.m > v.q && v.s > v.p, 'positive residual on the right branch makes the function decreasing');
    const k = v.m * (v.t - v.p) - v.q * v.t;
    const f = x => (v.q * x + k) / (x - v.p);
    assert.ok(-v.q * v.p - k < 0, 'the derivative numerator is negative throughout the interval');
    near(f(v.t), v.m, 'the minimum is attained at the right endpoint'); near(f(v.s), 7, 'the other endpoint is higher');
    near(v.K, k + v.p * v.q, 'the numerator constant differs from the shifted residual');
    near(v.ans.val, k, 'first original coefficient'); near(v.ans.val, 7, 'first original answer');
  }
});

test('all authored cues render finite source geometry and trace the actual rational graph', t => {
  let frames = 0;
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base); const first = lab.draw();
    apply(compiled, 0.8, base); const motion = lab.draw();
    assert.notEqual(signature(motion), signature(first), `${scene.id}/${lesson.label}: motion starts within one second`);
    const marker = motion.points.find(p => p.options.color === 'violet' && p.options.r === 4.5 && !p.options.label);
    assert.ok(marker, `${scene.id}/${lesson.label}: a visible curve marker is present`);
    const curve = currentCurve(scene.id, lab.s);
    assert.notEqual(marker.point.x, curve.p, 'the marker never lands at the excluded x');
    near(marker.point.y, curve.k / (marker.point.x - curve.p) + curve.q, 'the marker is on the selected original curve');
    const onSourcePlot = motion.plots.some(plot => plot.options.color !== 'violet' && marker.point.x >= plot.from - 1e-8 && marker.point.x <= plot.to + 1e-8 && Math.abs(plot.evaluate(marker.point.x) - marker.point.y) < 1e-8);
    const onConstantSource = curve.k === 0 && motion.paths.some(path => path.options.color !== 'violet' && path.points.slice(1).some((end, i) => {
      const start = path.points[i];
      return Math.abs(start.y - curve.q) < 1e-8 && Math.abs(end.y - curve.q) < 1e-8 && marker.point.x >= Math.min(start.x, end.x) && marker.point.x <= Math.max(start.x, end.x);
    }));
    assert.ok(onSourcePlot || onConstantSource, 'the trace uses a curve already drawn by the source');
    const times = new Set([0, 0.8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + cue.dur / 2)); }
    for (const time of times) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.plots.length || frame.paths.length, `${scene.id}/${lesson.label}@${time}: source geometry exists`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo'), 'the actual Board issues canvas line commands');
      assert.deepEqual(plain(frame.value), {}, 'legacy result cards stay hidden');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')), 'original numeric solution steps are not shown beside the lesson');
      assert.equal(scene.vary.cur(), packet, 'playback always selects the first source packet');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lrShowAnswer, false, 'the answer flag remains closed until the final chapter');
      if (time === compiled.length) assert.equal(lab.s.lrShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'source conditions are not mutated by playback');
  }
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; browser/mobile visual review NOT_RUN`);
});

test('actual new-problem clicks, fixed first playback and replay preserve each manual variant', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0];
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 4;
    lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab), manualSteps = Array.from(scene.steps(lab.s, lab));
    assert.notEqual(manual, first, `${scene.id}: actual new-problem handler selects a manual variant`);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base);
    const question = scene.question(lab.s, lab), firstFrame = signature(lab.draw());
    assert.equal(question, lab.api.question(scene.id), 'the exact first-original question is selected');
    assert.ok(!question.includes('data-new-prob'), 'the lesson question omits the manual button');
    assert.equal(scene.vary.cur(), first);
    apply(compiled, compiled.length, base); apply(compiled, 0, base);
    assert.equal(signature(lab.draw()), firstFrame, `${scene.id}: replay restores the same initial graph`);
    assert.equal(scene.question(lab.s, lab), question);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual, 'manual selection survives lesson playback');
    assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.deepEqual(Array.from(scene.steps(lab.s, lab)), manualSteps, 'manual solution steps remain available');
  }
});

test('final-answer flags and source stages cannot leak through entry or a stale high step', () => {
  const v = lab.api.first('r2'), u = Math.sqrt(v.k), A = { x: v.p - u, y: v.q - u }, B = { x: v.p + u, y: v.q + u };
  const hasFinalAB = frame => frame.paths.some(path => path.options.color === 'amber' && path.options.width === 2.6 && path.points.length === 2 && ((samePoint(path.points[0], A) && samePoint(path.points[1], B)) || (samePoint(path.points[0], B) && samePoint(path.points[1], A))));
  for (const scene0 of lab.list) for (const lesson of sourceLessons(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); const initial = signature(lab.draw());
    lab.s.step = 99;
    const beforeFinal = lab.draw();
    assert.equal(lab.s.lrShowAnswer, false); assert.deepEqual(plain(beforeFinal.value), {});
    if (scene.id === 'r2') assert.equal(hasFinalAB(beforeFinal), false, 'final AB segment is capped even with an externally high step');
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lrShowAnswer, true);
    if (scene.id === 'r2') assert.equal(hasFinalAB(final), true, 'the final source stage draws AB');
    lab.s.lessonOn = false; lab.s.lessonEntry = true; lab.s.step = 99;
    assert.equal(signature(lab.draw()), initial, `${scene.id}: entry ignores stale final step, flag and trace`);
  }
  for (const lesson of lessonsOf('r4').filter(item => item.chapters[0].cues[0].set.lrConcept && !item.chapters[0].cues[0].set.lrLattice)) {
    lab.go('r4'); const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, compiled.length, base);
    lab.s.lessonOn = false; lab.s.lessonEntry = true;
    assert.ok(!lab.draw().texts.some(text => /^(?:최대|최소)\s/.test(text)), 'exploration extrema are also hidden on stale final entry');
  }
});

test('the fixed lattice exploration reveals all 41 boundary-inclusive points and restores the manual view', () => {
  const scene = lab.go('r4'), lesson = lessonsOf('r4').find(item => item.chapters[0].cues[0].set.lrLattice);
  assert.ok(lesson); assert.equal(lesson.chapters[0].cues[0].set.lrConcept, true, 'lattice is a separate exploration, not the first coefficient problem');
  const compiled = video.compileLesson(lesson), base = baseState();
  const initial = lab.api.initial('r4');
  assert.deepEqual([initial.s4kl, initial.s4a, initial.s4b], [12, 2, 7]);
  const columns = Array.from({ length: 6 }, (_, i) => ({ x: i + 2, n: Math.floor(1 + 12 / (i + 1)) + 1 }));
  assert.deepEqual(columns.map(c => c.n), [14, 8, 6, 5, 4, 4]);
  const wanted = columns.flatMap(c => Array.from({ length: c.n }, (_, y) => ({ x: c.x, y })));
  assert.equal(wanted.length, 41);
  const dots = frame => frame.points.filter(p => p.options.color === 'green' && p.options.r === 3.6).map(p => p.point);
  const columnLabels = frame => frame.textItems.filter(item => item.options.color === 'green' && item.options.size === 12 && /^\d+$/.test(item.text)).map(item => Number(item.text));
  const focus = lab.board.focus;
  Object.assign(lab.board, { zoom: 1.2, panX: 19, panY: -11 });
  const manualView = { focus, zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY };
  apply(compiled, 0, base);
  assert.deepEqual([lab.s.s4mode, lab.s.s4kl, lab.s.s4a, lab.s.s4b], [1, 12, 2, 7]);
  for (const progress of [0, 0.9, 1, 2.8, 3.9, 5.9]) {
    lab.s.lrCols = progress;
    const frame = lab.draw(), visible = columns.slice(0, Math.floor(progress));
    assert.deepEqual(plain(dots(frame)), visible.flatMap(c => Array.from({ length: c.n }, (_, y) => ({ x: c.x, y }))), 'only the disclosed columns contain points');
    assert.deepEqual(columnLabels(frame), visible.map(c => c.n), 'future column counts stay hidden');
  }
  apply(compiled, compiled.length, base); const final = lab.draw();
  assert.deepEqual(plain(dots(final)), wanted);
  assert.deepEqual(columnLabels(final), columns.map(c => c.n));
  for (const P of dots(final)) {
    assert.ok(Number.isInteger(P.x) && Number.isInteger(P.y));
    assert.ok(P.y >= 0 && P.y <= 1 + 12 / (P.x - 1));
    const screen = lab.board.toS(P);
    assert.ok(screen.x >= 0 && screen.x <= lab.board.W && screen.y >= 0 && screen.y <= lab.board.H, `lattice point (${P.x},${P.y}) lies inside the drawing surface`);
  }
  for (const x of [2, 3, 4, 5, 6, 7]) assert.ok(dots(final).some(P => P.x === x && P.y === 0), 'the x-axis boundary is included');
  for (const x of [2, 3, 4, 5, 7]) assert.ok(dots(final).some(P => P.x === x && P.y === 1 + 12 / (x - 1)), 'integer points on the curve are included');
  assert.ok(dots(final).some(P => P.x === 2 && P.y === 13), 'the highest boundary point is retained');
  lab.s.lessonOn = false; lab.s.lessonEntry = true;
  assert.equal(dots(lab.draw()).length, 0, 'entry hides stale final lattice columns');
  lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.tab = 'explore';
  lab.draw();
  assert.equal(lab.board.focus, manualView.focus);
  assert.deepEqual([lab.board.zoom, lab.board.panX, lab.board.panY], [manualView.zoom, manualView.panX, manualView.panY]);
  assert.equal(lab.board._ratLessonView, undefined, 'the temporary focus snapshot is cleared');
  apply(compiled, 0, base); lab.draw();
  const next = lab.go('r1'), nextFocus = lab.board.focus;
  lab.draw();
  assert.equal(next.id, 'r1'); assert.equal(lab.board.focus, nextFocus, 'a scene change keeps the new scene focus');
  assert.deepEqual(plain(nextFocus), plain(lab.api.scenes.find(item => item.id === 'r1').focus));
});
