// Minimum release checks through the production HTML and native cartesian Board.
// Browser/mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/transform-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = { shift: 6, reflect: 8, shortest: 5, compose: 6 };
const ids = Object.keys(counts), plain = value => JSON.parse(JSON.stringify(value));
const near = (a, b, why) => assert.ok(Math.abs(a - b) < 1e-8, `${why}: ${a} != ${b}`);
const sum = values => values.reduce((a, b) => a + b, 0);
const length = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const along = (a, b, t) => ({ x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) });
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const area = (a, b, c) => Math.abs(cross(a, b, c)) / 2;
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const firstSet = lesson => lesson.chapters[0].cues[0].set;
const sourceLessons = id => lessonsOf(id).filter(lesson => !firstSet(lesson).lctConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, circles: frame.circles, points: frame.points, handles: frame.handles, plots: frame.plots });
const isTrace = options => options.color === 'violet' && options.width === 4.2;
const isEmphasis = options => options.color === 'violet' && options.glow === false && (options.r === 4.5 || options.hollow && options.r >= 5 && options.r <= 9);
function answerValue(value) {
  const math = String(value).match(/^[^$]*\$([^$]+)\$[^$]*$/);
  return String(math ? math[1] : value).replace(/\$|\s/g, '').split('=').at(-1);
}
function onSegment(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy;
  const t = d2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / d2)) : 0;
  return length(p, along(a, b, t)) < 1e-7;
}
function traceOnSource(frame, label) {
  const marker = frame.points.find(item => isEmphasis(item.options));
  assert.ok(marker, `${label}: actual diagram emphasis starts within one second`);
  const p = marker.point;
  assert.ok(p.x >= frame.viewBox.x0 && p.x <= frame.viewBox.x1 && p.y >= frame.viewBox.y0 && p.y <= frame.viewBox.y1, `${label}: the first emphasis is inside the visible Board`);
  if (marker.options.hollow) {
    assert.ok([...frame.points, ...frame.handles].some(other => !isEmphasis(other.options) && length(other.point, p) < 1e-8), 'a pulse centers on an actual source point or handle');
    assert.ok(marker.options.r > 5 && marker.options.r <= 9);
    return 'point';
  }
  const onPath = frame.paths.some(path => {
    if (isTrace(path.options)) return false;
    const points = path.points.concat(path.options.close ? [path.points[0]] : []);
    return points.slice(1).some((b, i) => onSegment(p, points[i], b));
  });
  const onCircle = frame.circles.some(circle => !isTrace(circle.options) && Math.abs(length(p, circle.center) - circle.radius) < 1e-7);
  const onPlot = frame.plots.some(plot => !isTrace(plot.options) && p.x >= plot.from - 1e-8 && p.x <= plot.to + 1e-8 && Math.abs(plot.evaluate(p.x) - p.y) < 1e-7);
  assert.ok(onPath || onCircle || onPlot, `${label}: the marker belongs to an actual source curve, path or circle`);
  if (frame.plots.some(plot => isTrace(plot.options))) return 'plot';
  return frame.arcs.some(arc => isTrace(arc.options)) ? 'circle' : 'path';
}
function named(frame, name) {
  const item = [...frame.handles, ...frame.points].find(item => item.options.label === name || item.options.label?.startsWith(name + '(') || item.options.label?.startsWith(name + ' (') || item.options.label?.startsWith(name + '≈') || item.options.label?.startsWith(name + ' ≈'));
  assert.ok(item, `the native figure contains point ${name}`);
  return item.point;
}
function concept(id, predicate) {
  const lesson = lessonsOf(id).find(item => firstSet(item).lctConcept && predicate(firstSet(item), item));
  assert.ok(lesson, `${id}: the authored concept is registered`);
  lab.go(id);
  const compiled = video.compileLesson(lesson), base = baseState();
  return { lesson, compiled, at(time) { apply(compiled, time, base); return lab.draw(); } };
}
const reflect = { x: p => ({ x: p.x, y: -p.y }), y: p => ({ x: -p.x, y: p.y }), o: p => ({ x: -p.x, y: -p.y }), d: p => ({ x: p.y, y: p.x }) };

test('actual HTML registers four scenes and 25 valid lessons with one fixed first original per scene', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-transform');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ids);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-transform/lesson-core.js', 'common-transform/lesson-a.js', 'common-transform/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id], scene.id);
    assert.equal(sourceLessons(scene.id).length, 1, `${scene.id}: only the first source problem is fixed`);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    assert.equal(lab.api.first(scene.id), scene.vary.first(), 'the original packet retains its object and function identity');
    assert.equal(lab.api.question(scene.id), scene.vary.first().text);
    assert.equal(lab.api.answer(scene.id), scene.vary.first().ansTex);
    assert.ok(!lab.api.question(scene.id).includes('data-cc-new'));
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lctConcept ? concepts++ : originals++;
      for (const key of ['lctQuestion', 'lctConcept', 'lctExplore', 'lctTarget', 'lctShowAnswer', 'lctMode', 'lctStage']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: explicitly resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lctShowAnswer, false);
      assert.ok(Object.hasOwn(first, 'part') && (first.part === null || typeof first.part === 'string'));
      if (!first.set.lctConcept) {
        assert.equal(first.set.lctQuestion, lab.api.question(scene.id));
        const expected = answerValue(lab.api.answer(scene.id));
        assert.equal(answerValue(lesson.answer), expected, `${scene.id}: authored answer matches the source`);
        const finalValues = lesson.chapters.at(-1).cues.flatMap(cue => Array.from((cue.say || '').matchAll(/\$([^$]+)\$/g), match => answerValue(match[1])));
        assert.ok(finalValues.includes(expected), `${scene.id}: the final chapter states the verified answer`);
      }
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: animated ${key} has an initial value`);
      assert.equal(video.stateAt(compiled, 0, { nums: {}, sets: {}, step: 99, part: 'stale' }).part, first.part);
    }
  }
  assert.equal(concepts, 21); assert.equal(originals, 4); assert.equal(concepts + originals, 25);
});

test('four first originals agree with independent translation, inverse reflection, shortest-path and tangency calculations', () => {
  const checked = [];
  const check = (id, expected, solve) => {
    const q = lab.api.first(id), result = solve(q);
    near(result, expected, `${id}: independent result`);
    near(q.ans, result, `${id}: original numeric answer`);
    near(Number(q.ansTex), result, `${id}: exact displayed answer`);
    checked.push(id);
  };
  check('shift', -2, q => {
    assert.equal(q.kind, 'find'); assert.equal(q.orig.t, 'para'); assert.equal(q.img.t, 'para');
    const a = q.img.vx - q.orig.vx, b = q.img.vy - q.orig.vy;
    near(q.a, a, 'horizontal displacement of the actual vertices'); near(q.b, b, 'vertical displacement');
    for (const x of [-2, 0, 2]) near((x + a - q.img.vx) ** 2 + q.img.vy, (x - q.orig.vx) ** 2 + q.orig.vy + b, 'translated points satisfy the translated parabola');
    return a + b;
  });
  check('reflect', 1, q => {
    assert.equal(q.kind, 'pt2'); assert.equal(q.m1, 'y'); assert.equal(q.m2, 'd');
    const Q = reflect[q.m2](q.fin), P = reflect[q.m1](Q);
    assert.deepEqual(plain(q.P1), Q); assert.deepEqual(plain(q.P0), P);
    assert.deepEqual(reflect[q.m2](reflect[q.m1](P)), plain(q.fin), 'the recovered point reaches the given final point in forward order');
    return P.x + P.y;
  });
  check('shortest', 5, q => {
    assert.equal(q.kind, 'pt'); assert.equal(q.m, 'x'); assert.ok(q.A.y * q.T.y > 0, 'the two endpoints lie on the same side');
    const R = reflect.x(q.A), t = -R.y / (q.T.y - R.y), P = along(R, q.T, t);
    assert.ok(t > 0 && t < 1, 'the unfolded segment crosses the required mirror');
    near(P.y, 0, 'reflection point lies on the x axis');
    near(length(q.A, P), length(R, P), 'reflection preserves the first leg');
    near(length(q.A, P) + length(P, q.T), length(R, q.T), 'the bound is attained by a valid broken path');
    near(q.Pstar.x, P.x, 'source optimum abscissa'); near(q.Pstar.y, P.y, 'source optimum ordinate');
    return length(R, q.T);
  });
  check('compose', 2, q => {
    assert.equal(q.kind, 'tan');
    const discriminant = a => q.m ** 2 - 4 * q.m * a + 4 * (q.bb - q.n);
    const a = -discriminant(0) / (discriminant(1) - discriminant(0));
    near(discriminant(a), 0, 'the intersection quadratic has a repeated root');
    const x = a - q.m / 2, y = q.m * x + q.n, difference = z => -((z - a) ** 2) + q.bb - q.m * z - q.n;
    near(difference(x), 0, 'the parabola and line meet at the maximum vertical difference');
    assert.ok(difference(x - 1) < 0 && difference(x + 1) < 0, 'the repeated intersection is tangential');
    near(q.xt, x, 'source tangent abscissa'); near(q.yt, y, 'source tangent ordinate');
    return a;
  });
  assert.deepEqual(checked, ids);
});

test('all authored cues render finite native geometry with visible first motion and isolated cards', t => {
  let frames = 0;
  const traced = { plot: 0, path: 0, circle: 0, point: 0 };
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet), initialBefore = lab.api.initial(scene.id);
    apply(compiled, 0, base); const first = lab.draw();
    apply(compiled, .8, base); const motion = lab.draw(), label = `${scene.id}/${lesson.label}`;
    assert.notEqual(signature(motion), signature(first), `${label}: native geometry moves within one second`);
    traced[traceOnSource(motion, label)]++;
    const times = new Set([0, .8, compiled.length, compiled.chapters.at(-1).at - .01]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + (cue.dur || 0) / 2)); }
    for (const time of times) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.paths.length || frame.plots.length || frame.circles.length || frame.points.some(p => !isEmphasis(p.options)), `${label}@${time}: real condition geometry exists`);
      for (const path of frame.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      for (const item of [...frame.points, ...frame.handles]) assert.ok(Number.isFinite(item.point.x) && Number.isFinite(item.point.y));
      for (const circle of frame.circles) assert.ok(Number.isFinite(circle.center.x) && Number.isFinite(circle.center.y) && Number.isFinite(circle.radius) && circle.radius >= 0);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), 'the actual Board paints into canvas');
      assert.deepEqual(plain(frame.value), {}, 'old formula and answer cards are isolated during playback');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')));
      assert.equal(scene.vary.cur(), packet, 'the source selector is fixed only during the lesson');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lctShowAnswer, false, `${label}: answer waits for the final chapter`);
      if (time === compiled.length) assert.equal(lab.s.lctShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'playback does not mutate original packets');
    assert.deepEqual(plain(lab.api.initial(scene.id)), plain(initialBefore), 'playback preserves the original scene initial objects');
  }
  assert.equal(sum(Object.values(traced)), 25);
  assert.ok(traced.plot > 0, 'the actual source function is exercised by the curve trace');
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; first emphasis: ${traced.plot} exact function plots, ${traced.path} native paths, ${traced.circle} exact circles, ${traced.point} condition-point pulses; full browser/mobile visual audit NOT_RUN`);
});

test('manual new problems, view transforms and nested state resets survive first-original replay', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0], originalIndex = scene.vary.idx;
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3; lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab);
    assert.notEqual(manual, first); assert.notEqual(scene.vary.idx, originalIndex);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    lab.draw();
    Object.assign(lab.board, { zoom: 1.25, panX: 37, panY: -19 });
    const keep = { focus: lab.board.focus, zoom: lab.board.zoom, panX: lab.board.panX, panY: lab.board.panY, key: lab.board.__ccKey };
    const manualGeometry = signature(lab.draw()), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); const question = scene.question(lab.s, lab), initialGeometry = signature(lab.draw());
    assert.equal(question, lab.api.question(scene.id)); assert.equal(scene.vary.cur(), first);
    assert.ok(!question.includes('data-cc-new'));
    apply(compiled, compiled.length, base); lab.draw(); apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(signature(lab.draw()), initialGeometry, `${scene.id}: replay restores the first-source diagram`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual); assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.equal(signature(lab.draw()), manualGeometry, `${scene.id}: the manually selected packet remains available`);
    assert.equal(lab.board.focus, keep.focus, 'native focus object is restored');
    assert.equal(lab.board.zoom, keep.zoom); assert.equal(lab.board.panX, keep.panX); assert.equal(lab.board.panY, keep.panY); assert.equal(lab.board.__ccKey, keep.key);
    const copy = lab.api.initial(scene.id), untouched = plain(copy);
    for (const [key, value] of Object.entries(copy)) if (value && typeof value === 'object') {
      const coordinate = Object.keys(value)[0]; value[coordinate] = 999;
      assert.notDeepEqual(copy[key], untouched[key]);
    }
    assert.deepEqual(plain(lab.api.initial(scene.id)), untouched, 'source.initial returns independent nested data');
    for (const authored of lessonsOf(scene.id)) {
      const cs = video.compileLesson(authored), state = baseState();
      for (const [key, value] of Object.entries(firstSet(authored))) if (value && typeof value === 'object') lab.s[key] = { stale: 999 };
      apply(cs, 0, state);
      for (const [key, value] of Object.entries(firstSet(authored))) if (value && typeof value === 'object') assert.deepEqual(plain(lab.s[key]), plain(value), `${scene.id}: ${key} resets on entry`);
      apply(cs, cs.length, state); apply(cs, 0, state);
      for (const [key, value] of Object.entries(firstSet(authored))) if (value && typeof value === 'object') assert.deepEqual(plain(lab.s[key]), plain(value), `${scene.id}: ${key} resets on replay`);
    }
  }
});

test('numeric figure answers stay hidden before final and entry overrides stale stages and answer flags', () => {
  let finalNumericScenes = 0;
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), lesson = sourceLessons(scene.id)[0], compiled = video.compileLesson(lesson), base = baseState();
    const finalAt = compiled.chapters.at(-1).at;
    for (const time of new Set([0, finalAt - .01, ...compiled.cues.filter(cue => cue.at < finalAt).map(cue => cue.at)])) {
      apply(compiled, time, base); Object.assign(lab.s, { step: 99, lctStage: 3 });
      const frame = lab.draw();
      assert.equal(lab.s.lctShowAnswer, false);
      assert.ok(frame.boardTexts.every(text => !/\d/.test(text)), `${scene.id}: numeric source labels remain closed`);
      assert.deepEqual(plain(frame.value), {});
    }
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lctShowAnswer, true);
    if (final.boardTexts.some(text => /\d/.test(text))) finalNumericScenes++;
    for (const authored of lessonsOf(scene.id)) {
      const cs = video.compileLesson(authored), initial = baseState();
      apply(cs, 0, initial, true); const expected = signature(lab.draw());
      Object.assign(lab.s, { lctShowAnswer: true, lctStage: 3, step: 99 });
      const stale = lab.draw();
      assert.equal(signature(stale), expected, `${scene.id}/${authored.label}: entry forces stage zero despite stale values`);
      assert.ok(stale.boardTexts.every(text => !/\d/.test(text)));
    }
  }
  assert.equal(finalNumericScenes, 4, 'the existing numeric figure labels are available after the final chapter');
});

test('native transformation diagrams preserve coordinates, reflection conditions, route order and intersection cases', () => {
  {
    const shapes = new Set();
    for (const lesson of lessonsOf('shift').filter(item => firstSet(item).lctConcept)) {
      lab.go('shift'); const cs = video.compileLesson(lesson); apply(cs, cs.length, baseState());
      const frame = lab.draw(), Q = named(frame, 'Q'), R = named(frame, 'Q′');
      near(R.x - Q.x, lab.s.a, 'every point has the same horizontal displacement');
      near(R.y - Q.y, lab.s.b, 'every point has the same vertical displacement');
      shapes.add(lab.s.shape);
      if (lab.s.shape === 'para') {
        near(Q.y, Q.x ** 2, 'native point lies on the original parabola');
        near(R.y - lab.s.b, (R.x - lab.s.a) ** 2, 'image satisfies inverse substitution');
        const curve = frame.plots.find(plot => plot.options.color === 'amber' && !isTrace(plot.options));
        assert.ok(curve); near(curve.evaluate(R.x), R.y, 'the actual painted curve contains the image point');
      } else if (lab.s.shape === 'circle') {
        near(Q.x ** 2 + Q.y ** 2, 4, 'original radius is two');
        const image = frame.circles.find(circle => circle.options.color === 'amber');
        assert.ok(image); near(image.center.x, lab.s.a, 'translated center x'); near(image.center.y, lab.s.b, 'translated center y');
        near(image.radius, 2, 'translation preserves radius'); near(length(R, image.center), image.radius, 'image point belongs to the actual circle');
      } else {
        near(Q.y, 2 * Q.x, 'original line'); near(R.y - lab.s.b, 2 * (R.x - lab.s.a), 'translated line');
        const line = frame.paths.find(path => path.options.color === 'amber' && path.options.ref === 'img');
        assert.ok(line && onSegment(R, line.points[0], line.points.at(-1)), 'the native translated line contains Q′');
      }
    }
    assert.deepEqual([...shapes].sort(), ['circle', 'line', 'para']);
  }
  {
    const rules = new Set(); let fixedCases = 0;
    for (const lesson of lessonsOf('reflect').filter(item => firstSet(item).lctConcept && firstSet(item).lctMode !== 'parabola')) {
      lab.go('reflect'); const cs = video.compileLesson(lesson), base = baseState();
      for (const chapter of cs.chapters) {
        apply(cs, chapter.at, base); const frame = lab.draw(), P = named(frame, 'P'), Q = named(frame, 'P′'), expected = reflect[lab.s.ref](P);
        assert.deepEqual(Q, expected, 'the actual reflected point follows the selected coordinate rule');
        const circles = frame.circles.filter(circle => ['ink', 'amber'].includes(circle.options.color));
        assert.equal(circles.length, 2);
        const original = circles.find(circle => circle.options.color === 'ink'), image = circles.find(circle => circle.options.color === 'amber');
        assert.deepEqual(image.center, reflect[lab.s.ref](original.center)); near(image.radius, original.radius, 'reflection preserves the native circle radius');
        rules.add(lab.s.ref);
        if (length(P, Q) < 1e-8) fixedCases++;
        else if (lab.s.ref === 'o') assert.deepEqual(midpoint(P, Q), { x: 0, y: 0 }, 'the origin bisects a point-reflection pair');
        else {
          const M = midpoint(P, Q), direction = lab.s.ref === 'x' ? { x: 1, y: 0 } : lab.s.ref === 'y' ? { x: 0, y: 1 } : { x: 1, y: 1 };
          near((Q.x - P.x) * direction.x + (Q.y - P.y) * direction.y, 0, 'the mirror is perpendicular to the joining segment');
          near(lab.s.ref === 'x' ? M.y : lab.s.ref === 'y' ? M.x : M.y - M.x, 0, 'the midpoint is on the mirror');
        }
      }
    }
    assert.deepEqual([...rules].sort(), ['d', 'o', 'x', 'y']); assert.ok(fixedCases >= 4, 'the authored fixed-point comparisons execute');
    const play = concept('reflect', set => set.lctMode === 'parabola');
    for (const time of [0, 4.3]) {
      const frame = play.at(time), P = named(frame, 'P'), Q = named(frame, 'P′');
      near(P.y, P.x ** 2, 'original point is on y=x²'); assert.deepEqual(Q, reflect.d(P));
      near(Q.x, Q.y ** 2, 'reflected point is on x=y²');
      const original = frame.plots.find(plot => plot.options.ref === 'original'), image = frame.paths.find(path => path.options.ref === 'image');
      assert.ok(original && image && image.points.length > 2, 'both actual curved figures are drawn');
      near(original.evaluate(P.x), P.y, 'original function agrees with the moving point');
      for (const p of image.points) near(p.x, p.y ** 2, 'the inverse curve is the reflected set of points');
    }
  }
  {
    const direct = concept('shortest', set => set.lctMode === 'opposite'), f = direct.at(direct.compiled.length);
    const A = named(f, 'A'), B = named(f, 'B'), P = named(f, 'P');
    assert.ok(A.y * B.y < 0); assert.ok(onSegment(P, A, B)); near(length(A, P) + length(P, B), length(A, B), 'opposite-side endpoints use the direct segment');
    assert.ok(!f.points.some(item => item.options.label?.startsWith('A′')), 'the opposite-side construction does not substitute a reflected endpoint');
    const single = concept('shortest', set => set.mode === 'pt' && set.lctMode === ''), singleFrame = single.at(single.compiled.length);
    const a = named(singleFrame, 'A'), b = named(singleFrame, 'B'), p = named(singleFrame, 'P'), r = named(singleFrame, 'A′');
    assert.ok(a.y * b.y > 0 && onSegment(p, r, b)); near(length(a, p) + length(p, b), length(r, b), 'same-side reflection reaches its lower bound');
    const circle = concept('shortest', set => set.mode === 'circ'), cf = circle.at(circle.compiled.length);
    const ca = named(cf, 'A'), cp = named(cf, 'P'), cq = named(cf, 'Q'), center = named(cf, 'C'), reflected = named(cf, 'A′'), nativeCircle = cf.circles.find(item => item.options.color === 'rose');
    assert.ok(nativeCircle); near(length(cq, center), nativeCircle.radius, 'Q lies on the actual target circle');
    assert.ok(onSegment(cp, reflected, center) && onSegment(cq, cp, center), 'the unfolded route visits P then Q then the center');
    assert.ok(length(cp, center) > nativeCircle.radius, 'P is outside the circle');
    near(length(ca, cp) + length(cp, cq), length(reflected, center) - nativeCircle.radius, 'the circle path attains center distance minus radius');
    const twice = concept('shortest', set => set.mode === 'tri'), tf = twice.at(twice.compiled.length);
    const ta = named(tf, 'A'), tp = named(tf, 'P'), tq = named(tf, 'Q'), tx = named(tf, 'Aₓ'), td = named(tf, 'A_d');
    assert.ok(area(ta, tp, tq) > 0, 'the attained route still makes a nondegenerate triangle');
    assert.ok(onSegment(tp, tx, td) && onSegment(tq, tx, td));
    assert.ok(length(tx, tp) < length(tx, tq), 'the unfolded segment meets x-axis first and y=x second');
    near(length(ta, tp) + length(tp, tq) + length(tq, ta), length(tx, td), 'the two-reflection perimeter reaches its lower bound');
  }
  {
    const cases = new Set(); let shiftFirst = false, equalOrders = false;
    for (const lesson of lessonsOf('compose').filter(item => firstSet(item).lctConcept)) {
      lab.go('compose'); const cs = video.compileLesson(lesson), base = baseState();
      for (const chapter of cs.chapters) {
        apply(cs, chapter.at, base); const frame = lab.draw();
        if (lab.s.lctMode === 'shift-first') {
          const curve = frame.plots.find(plot => plot.options.ref === 'translated');
          assert.ok(curve); for (const x of [-1, 0, 1]) near(curve.evaluate(x), (x - lab.s.ca) ** 2 + lab.s.cb, 'translation-first intermediate has not yet been reflected');
          shiftFirst = true; continue;
        }
        for (const [which, color, sign] of [['1', 'amber', 1], ['2', 'violet', -1]]) {
          if (lab.s.cv !== 'both' && lab.s.cv !== which) continue;
          const curve = frame.plots.find(plot => plot.options.color === color && plot.options.width === 3.2);
          assert.ok(curve, 'the selected native composition is plotted');
          for (const x of [-1, 0, 1]) near(curve.evaluate(x), -((x - lab.s.ca) ** 2) + sign * lab.s.cb, 'actual function follows transformation order');
          const maxDifference = 1 - 2 * lab.s.ca + sign * lab.s.cb, expected = Math.abs(maxDifference) < 1e-8 ? 1 : maxDifference > 0 ? 2 : 0;
          const intersections = frame.points.filter(item => item.options.ref === 'c' + which && ['green', 'rose'].includes(item.options.color));
          assert.equal(intersections.length, expected, 'native intersection count follows the maximum signed vertical difference');
          for (const item of intersections) { near(item.point.y, 2 * item.point.x, 'intersection lies on the actual line'); near(item.point.y, curve.evaluate(item.point.x), 'intersection lies on the actual parabola'); }
          cases.add(expected);
        }
        if (lab.s.cv === 'both' && lab.s.cb === 0) equalOrders = true;
      }
    }
    assert.ok(shiftFirst && equalOrders, 'authored composition covers translation-first intermediate and commuting zero-vertical shift');
    assert.deepEqual([...cases].sort(), [0, 1, 2], 'all three actual intersection cases execute');
  }
});
