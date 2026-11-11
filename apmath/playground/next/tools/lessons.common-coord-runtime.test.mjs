// Minimum release checks through the production HTML and native cartesian Board.
// Browser/mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/coord-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = { dist: 4, inner: 4, tri: 6, isos: 7, proof: 3, outer: 4 };
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
const sourceLessons = id => lessonsOf(id).filter(lesson => !firstSet(lesson).lccConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, circles: frame.circles, points: frame.points, handles: frame.handles });
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
  assert.ok(onPath || onCircle, `${label}: the marker belongs to actual source geometry`);
  return frame.arcs.some(arc => isTrace(arc.options)) ? 'circle' : 'path';
}
function named(frame, name) {
  const item = [...frame.handles, ...frame.points].find(item => item.options.label === name || item.options.label?.startsWith(name + '(') || item.options.label?.startsWith(name + ' (') || item.options.label?.startsWith(name + '≈') || item.options.label?.startsWith(name + ' ≈'));
  assert.ok(item, `the native figure contains point ${name}`);
  return item.point;
}
function concept(id, predicate) {
  const lesson = lessonsOf(id).find(item => firstSet(item).lccConcept && predicate(firstSet(item), item));
  assert.ok(lesson, `${id}: the authored concept is registered`);
  lab.go(id);
  const compiled = video.compileLesson(lesson), base = baseState();
  return { lesson, compiled, at(time) { apply(compiled, time, base); return lab.draw(); } };
}
function isoCandidates(A, B, y) {
  const d2 = length(A, B) ** 2, values = [];
  for (const center of [A, B]) {
    const radicand = d2 - (y - center.y) ** 2;
    if (radicand >= -1e-8) for (const sign of [-1, 1]) values.push(center.x + sign * Math.sqrt(Math.max(0, radicand)));
  }
  const coefficient = 2 * (B.x - A.x);
  const rhs = B.x ** 2 + B.y ** 2 - A.x ** 2 - A.y ** 2 - 2 * y * (B.y - A.y);
  if (Math.abs(coefficient) < 1e-8 && Math.abs(rhs) < 1e-8) return { infinite: true, excluded: A.x };
  if (Math.abs(coefficient) >= 1e-8) values.push(rhs / coefficient);
  const distinct = values.filter((value, i) => values.findIndex(other => Math.abs(value - other) < 1e-8) === i).sort((a, b) => a - b);
  return { infinite: false, good: distinct.filter(x => Math.abs(cross(A, B, { x, y })) > 1e-8), rejected: distinct.filter(x => Math.abs(cross(A, B, { x, y })) <= 1e-8) };
}

test('actual HTML registers six scenes and 28 valid lessons with one fixed first original per scene', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-coord');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ids);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-coord/lesson-core.js', 'common-coord/lesson-a.js', 'common-coord/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
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
      first.set.lccConcept ? concepts++ : originals++;
      for (const key of ['lccQuestion', 'lccConcept', 'lccExplore', 'lccTarget', 'lccShowAnswer', 'lccMode', 'lccStage', 'lccMovePoint']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: explicitly resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lccShowAnswer, false);
      assert.ok(Object.hasOwn(first, 'part') && (first.part === null || typeof first.part === 'string'));
      if (!first.set.lccConcept) {
        assert.equal(first.set.lccQuestion, lab.api.question(scene.id));
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
  assert.equal(concepts, 22); assert.equal(originals, 6); assert.equal(concepts + originals, 28);
});

test('the six first-source answers agree with independent distance, division, area and locus calculations', () => {
  const checked = [];
  const check = (id, expected, solve) => {
    const q = lab.api.first(id), result = solve(q);
    near(result, expected, `${id}: independent result`);
    near(q.ans, result, `${id}: numeric source answer`);
    near(Number(q.ansTex), result, `${id}: exact displayed answer`);
    checked.push(id);
  };
  check('dist', 16, q => {
    const M = midpoint(q.A, q.B), distance = length(q.A, q.B);
    near(length(q.A, M), length(M, q.B), 'the calculated midpoint divides the actual segment equally');
    assert.deepEqual(plain(q.M), M); near(q.l, distance, 'source distance');
    return distance + M.x + M.y;
  });
  check('inner', 1, q => {
    const P = along(q.A, q.B, q.m / (q.m + q.n));
    near(length(q.A, P) / length(P, q.B), q.m / q.n, 'internal distance ratio');
    assert.deepEqual(plain(q.Pp), P);
    return P.x + P.y;
  });
  check('tri', 6, q => {
    assert.equal(q.kind, 'area');
    const P = along(q.A, q.B, q.m / (q.m + q.n));
    near(area(q.A, P, q.C) / area(P, q.B, q.C), q.m / q.n, 'the two triangles have the stated area ratio');
    assert.deepEqual(plain(q.Pp), P);
    return P.x + P.y; // The actual question asks a+b, not either triangle's area.
  });
  check('isos', 2, q => {
    const candidates = isoCandidates(q.A, q.B, 0);
    assert.equal(candidates.infinite, false);
    assert.deepEqual(candidates.good, [-3, -2, 1, 2]);
    assert.deepEqual(candidates.rejected, [-.5], 'the collinear perpendicular-bisector candidate is excluded');
    assert.deepEqual(Array.from(q.list.filter(item => !item.deg), item => item.t), candidates.good);
    assert.equal(q.m, candidates.good.length); near(q.sum, sum(candidates.good), 'sum of valid abscissae');
    return candidates.good.length + sum(candidates.good);
  });
  check('proof', 7, q => {
    assert.equal(q.kind, 'med'); assert.equal(q.ask, 'AM');
    const c = q.BC / 2, x = (q.AB ** 2 - q.AC ** 2) / (4 * c), y2 = q.AB ** 2 - (x + c) ** 2;
    assert.ok(y2 > 0, 'the original three lengths form a nondegenerate triangle');
    near(x, q.A.x, 'coordinate reconstructed from the two distance equations');
    near(y2, q.A.y ** 2, 'source height satisfies both distances');
    near((q.AB ** 2 + q.AC ** 2) / 2 - c ** 2, x ** 2 + y2, 'median identity agrees with the coordinate calculation');
    return Math.sqrt(x ** 2 + y2);
  });
  check('outer', 1, q => {
    const t = q.m / (q.m - q.n), P = along(q.A, q.B, t);
    assert.ok(t > 1, 'the original external point lies beyond B');
    near(length(q.A, P) / length(P, q.B), q.m / q.n, 'external distance ratio');
    assert.deepEqual(plain(q.Pp), P);
    return P.x + P.y;
  });
  assert.deepEqual(checked, ids);
});

test('all authored cues render finite native geometry with visible first motion and isolated cards', t => {
  let frames = 0;
  const traced = { path: 0, circle: 0, point: 0 };
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
      assert.ok(frame.paths.length || frame.circles.length || frame.points.some(p => !isEmphasis(p.options)), `${label}@${time}: real condition geometry exists`);
      for (const path of frame.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      for (const item of [...frame.points, ...frame.handles]) assert.ok(Number.isFinite(item.point.x) && Number.isFinite(item.point.y));
      for (const circle of frame.circles) assert.ok(Number.isFinite(circle.center.x) && Number.isFinite(circle.center.y) && Number.isFinite(circle.radius) && circle.radius >= 0);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), 'the actual Board paints into canvas');
      assert.deepEqual(plain(frame.value), {}, 'old formula and answer cards are isolated during playback');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')));
      assert.equal(scene.vary.cur(), packet, 'the source selector is fixed only during the lesson');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lccShowAnswer, false, `${label}: answer waits for the final chapter`);
      if (time === compiled.length) assert.equal(lab.s.lccShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'playback does not mutate original packets');
    assert.deepEqual(plain(lab.api.initial(scene.id)), plain(initialBefore), 'clone-only moving point aliases preserve native initial objects');
  }
  assert.equal(sum(Object.values(traced)), 28);
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; first emphasis: ${traced.path} native paths, ${traced.circle} exact circles, ${traced.point} condition-point pulses; full browser/mobile visual audit NOT_RUN`);
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
      apply(compiled, time, base); Object.assign(lab.s, { step: 99, lccStage: 3 });
      const frame = lab.draw();
      assert.equal(lab.s.lccShowAnswer, false);
      assert.ok(frame.boardTexts.every(text => !/\d/.test(text)), `${scene.id}: numeric source labels remain closed`);
      assert.deepEqual(plain(frame.value), {});
    }
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lccShowAnswer, true);
    if (final.boardTexts.some(text => /\d/.test(text))) finalNumericScenes++;
    for (const authored of lessonsOf(scene.id)) {
      const cs = video.compileLesson(authored), initial = baseState();
      apply(cs, 0, initial, true); const expected = signature(lab.draw());
      Object.assign(lab.s, { lccShowAnswer: true, lccStage: 3, step: 99 });
      const stale = lab.draw();
      assert.equal(signature(stale), expected, `${scene.id}/${authored.label}: entry forces stage zero despite stale values`);
      assert.ok(stale.boardTexts.every(text => !/\d/.test(text)));
    }
  }
  assert.equal(finalNumericScenes, 6, 'the existing numeric figure labels are available after the final chapter');
});

test('native concept figures implement the authored midpoint, area, incenter, locus and proof cases', () => {
  {
    const play = concept('dist', set => set.lccTarget === 'axis-distance');
    const horizontal = play.at(0), vertical = play.at(play.compiled.chapters[2].at);
    near(length(named(horizontal, 'A'), named(horizontal, 'B')), 9, 'horizontal distance');
    near(length(named(vertical, 'A'), named(vertical, 'B')), 9, 'vertical distance');
    near(named(horizontal, 'A').y, named(horizontal, 'B').y, 'horizontal preset');
    near(named(vertical, 'A').x, named(vertical, 'B').x, 'vertical preset');
    const mid = concept('dist', set => set.lccTarget === 'midpoint');
    const frame = mid.at(mid.compiled.chapters[1].at);
    assert.equal(lab.s.lccShowAnswer, false); assert.equal(lab.s.lccStage, 3);
    assert.deepEqual(named(frame, 'M'), midpoint(named(frame, 'A'), named(frame, 'B')), 'construction stage three is available without revealing numeric labels');
    assert.ok(frame.boardTexts.every(text => !/\d/.test(text)));
  }
  {
    const play = concept('inner', set => set.lccTarget === 'internal-coordinate');
    const frame = play.at(play.compiled.chapters[3].at), A = named(frame, 'A'), B = named(frame, 'B'), P = named(frame, 'P');
    near(length(A, P) / length(P, B), 2, 'native internal division ratio');
    assert.ok(frame.paths.some(path => path.options.ref === 'my'), 'the vertical projection accompanies the authored explanation');
    const mid = concept('inner', set => set.lccTarget === 'ratio-midpoint');
    const final = mid.at(mid.compiled.length);
    assert.deepEqual(named(final, 'P'), midpoint(named(final, 'A'), named(final, 'B')));
  }
  {
    const play = concept('tri', set => set.lens3 === 'G');
    const frame = play.at(0), A = named(frame, 'A'), B = named(frame, 'B'), C = named(frame, 'C'), G = named(frame, 'G');
    near(G.x, (A.x + B.x + C.x) / 3, 'centroid abscissa'); near(G.y, (A.y + B.y + C.y) / 3, 'centroid ordinate');
    for (const [V, X, Y] of [[A, B, C], [B, C, A], [C, A, B]]) {
      const M = midpoint(X, Y); assert.ok(onSegment(G, V, M)); near(length(V, G) / length(G, M), 2, 'each actual median is divided two to one');
    }
    const split = concept('tri', (set, lesson) => set.lens3 === 'P' && lesson.label === '넓이비');
    for (const time of [0, 16.2, split.compiled.length]) {
      const f = split.at(time), a = named(f, 'A'), b = named(f, 'B'), c = named(f, 'C'), p = named(f, 'P');
      near(area(a, p, c) / area(p, b, c), length(a, p) / length(p, b), 'actual moving subtriangles share the same height');
    }
    for (const lesson of lessonsOf('tri').filter(item => firstSet(item).lccConcept && firstSet(item).lens3 === 'I')) {
      lab.go('tri'); const cs = video.compileLesson(lesson); apply(cs, cs.length, baseState());
      const f = lab.draw(), A = named(f, 'A'), B = named(f, 'B'), C = named(f, 'C'), I = named(f, 'I');
      const a = length(B, C), b = length(C, A), c = length(A, B), perimeter = a + b + c;
      near(I.x, (a * A.x + b * B.x + c * C.x) / perimeter, 'incenter x uses opposite-side weights');
      near(I.y, (a * A.y + b * B.y + c * C.y) / perimeter, 'incenter y uses opposite-side weights');
      const circle = f.circles.find(item => length(item.center, I) < 1e-8);
      assert.ok(circle, 'the actual native incircle exists');
      for (const [X, Y] of [[A, B], [B, C], [C, A]]) near(Math.abs(cross(X, Y, I)) / length(X, Y), circle.radius, 'all three side distances equal the native radius');
    }
  }
  {
    const seen = new Set();
    for (const lesson of lessonsOf('isos').filter(item => firstSet(item).lccConcept)) {
      lab.go('isos'); const cs = video.compileLesson(lesson); apply(cs, cs.length, baseState());
      if (lab.s.lccStage >= 0 && lab.s.lccStage < 3) continue;
      const frame = lab.draw(), A = named(frame, 'A'), B = named(frame, 'B'), candidates = isoCandidates(A, B, lab.s.k4);
      if (candidates.infinite) {
        const exclusion = frame.points.find(item => item.options.hollow && item.options.color === 'red' && item.options.label === '중점 제외');
        assert.ok(exclusion, 'the coincident bisector excludes the midpoint');
        near(exclusion.point.x, candidates.excluded, 'excluded abscissa');
        assert.ok(frame.paths.some(path => path.options.color === 'green' && path.options.width === 4), 'the entire equidistance line is drawn');
        seen.add('infinite');
      } else {
        const shown = frame.points.filter(item => item.options.hollow && item.options.r === 6 && /^C[₁₂₃₄₅]/.test(item.options.label)).map(item => item.point.x).sort((a, b) => a - b);
        assert.equal(shown.length, candidates.good.length);
        shown.forEach((x, i) => near(x, candidates.good[i], 'actual finite locus candidates'));
        for (const rejected of candidates.rejected) assert.ok(frame.points.some(item => item.options.hollow && item.options.color === 'red' && Math.abs(item.point.x - rejected) < 1e-8), 'a collinear candidate is visibly excluded');
        seen.add(candidates.good.length);
      }
    }
    for (const kind of [5, 4, 'infinite']) assert.ok(seen.has(kind), `authored locus coverage includes ${kind}`);
  }
  {
    const median = concept('proof', set => set.pf === 'median');
    const f = median.at(median.compiled.length), A = named(f, 'A'), B = named(f, 'B'), C = named(f, 'C'), M = named(f, 'M');
    assert.deepEqual(M, midpoint(B, C));
    near(length(A, B) ** 2 + length(A, C) ** 2, 2 * (length(A, M) ** 2 + length(B, M) ** 2), 'native median identity');
    const rect = concept('proof', set => set.pf === 'rect');
    const frames = [rect.at(0), rect.at(rect.compiled.length)];
    const positions = [];
    for (const frame of frames) {
      const a = named(frame, 'A'), b = named(frame, 'B'), c = named(frame, 'C'), d = named(frame, 'D'), p = named(frame, 'P');
      near(length(p, a) ** 2 + length(p, c) ** 2, length(p, b) ** 2 + length(p, d) ** 2, 'rectangle distance identity holds at the actual animated point');
      positions.push(p.x >= a.x && p.x <= b.x && p.y >= a.y && p.y <= d.y);
    }
    assert.ok(positions.includes(true) && positions.includes(false), 'the authored point visits both inside and outside the rectangle');
  }
  {
    for (const [target, ratio] of [['external-b', 3], ['external-a', 1 / 3]]) {
      const play = concept('outer', set => set.lccTarget === target), frame = play.at(play.compiled.length);
      const A = named(frame, 'A'), B = named(frame, 'B'), P = named(frame, 'P');
      near(length(A, P) / length(P, B), ratio, 'native external division ratio');
      near(Math.abs(length(A, P) - length(P, B)), length(A, B), 'outside distances differ by AB');
    }
    const equal = concept('outer', set => set.lccTarget === 'equal-external-ratio');
    const frame = equal.at(equal.compiled.chapters[2].at), A = named(frame, 'A'), B = named(frame, 'B'), P = named(frame, 'P');
    assert.deepEqual(P, midpoint(A, B), 'equal distances in the comparison produce an internal midpoint');
    assert.ok(onSegment(P, A, B));
  }
});
