// Minimum release checks through the production HTML and actual figure Board.
// Full browser/mobile and independent visual review are NOT_RUN in this VM.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/lines-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = {
  divInternalExternal: 3, divExtendedLine: 2, pappusMedian: 2, centroidParaCoord: 4, distMinSumSq: 4,
  perpSlopeMinus1: 3, fixedPointPencil: 3, perpBisectorOrtho: 3, areaBisectLines: 4, threeLinesNoTri: 3,
  shoelaceArea: 3, pointLineDist: 3, parallelLineDist: 3, angleBisectorLine: 3, maxDistFromPt: 4,
  compositeStepByStep: 2, paradoxPointVsFig: 3, symmetry4Basic: 6, symPointAndLine: 4, lineSlideSame: 2,
  reflectTriPerim: 3, reflectSingleAxis: 2, reflectDoubleAxes: 2, billiardMirrorRoom: 2, diffMaxLine: 3,
  trapApollonius: 6, trapLineSegmentMeet: 3, trapInterceptZero: 4, trapPerpDivideZero: 4, trapCoordFold: 2
};
const ids = Object.keys(counts), plain = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected, why) => assert.ok(Math.abs(actual - expected) < 1e-8, `${why}: ${actual} != ${expected}`);
const sum = xs => xs.reduce((a, z) => a + z, 0);
const dist = (a, z) => Math.hypot(z[0] - a[0], z[1] - a[1]);
const mid = (a, z) => [(a[0] + z[0]) / 2, (a[1] + z[1]) / 2];
const along = (a, z, u) => [a[0] + u * (z[0] - a[0]), a[1] + u * (z[1] - a[1])];
const area = ps => Math.abs(sum(ps.map((p, i) => p[0] * ps[(i + 1) % ps.length][1] - p[1] * ps[(i + 1) % ps.length][0]))) / 2;
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.lclConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step, part: state.part });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, circles: frame.circles, points: frame.points, handles: frame.handles });
function solve2(a, b, c, d, e, f) {
  const determinant = a * e - b * d;
  assert.ok(Math.abs(determinant) > 1e-10, 'the two conditions determine one point');
  return [(c * e - b * f) / determinant, (a * f - c * d) / determinant];
}
function answerValue(value) {
  const math = String(value).match(/^[^$]*\$([^$]+)\$[^$]*$/);
  if (math) value = math[1];
  return String(value).replace(/\$|\s/g, '').split('=').at(-1)
    .replace(/\\dfrac/g, '\\frac').replace(/\\frac(\d)(\d)/g, '\\frac{$1}{$2}')
    .replace(/\\sqrt(\d)/g, '\\sqrt{$1}');
}
function numericAnswer(tex) {
  const s = answerValue(tex), fraction = s.match(/^(-?)\\frac\{(-?\d+)\}\{(\d+)\}$/), radical = s.match(/^(-?\d*)\\sqrt\{(\d+)\}$/);
  if (fraction) return (fraction[1] ? -1 : 1) * Number(fraction[2]) / Number(fraction[3]);
  if (radical) return (radical[1] === '' ? 1 : radical[1] === '-' ? -1 : Number(radical[1])) * Math.sqrt(Number(radical[2]));
  assert.match(s, /^-?\d+(?:\.\d+)?$/, 'the source conclusion is an exact number, fraction or radical');
  return Number(s);
}

test('production HTML registers 30 scenes and 95 valid lessons with the original first problems', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-lines');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), ids);
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), ids.toSorted());
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-lines/lesson-core.js', 'common-lines/lesson-a.js', 'common-lines/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id], scene.id);
    assert.equal(sourceLessons(scene.id).length, 1, `${scene.id}: first original only`);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    assert.equal(lab.api.first(scene.id), scene.vary.first());
    assert.equal(lab.api.question(scene.id), scene.vary.first().text);
    assert.equal(lab.api.answer(scene.id), scene.vary.first().ans);
    assert.ok(!lab.api.question(scene.id).includes('data-cl-new'));
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lclConcept ? concepts++ : originals++;
      for (const key of ['lclQuestion', 'lclConcept', 'lclExplore', 'lclTarget', 'lclShowAnswer', 'lclMode']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lclShowAnswer, false);
      assert.ok(Object.hasOwn(first, 'part') && (first.part === null || typeof first.part === 'string'), 'initial emphasis is explicit');
      if (!first.set.lclConcept) {
        assert.equal(first.set.lclQuestion, lab.api.question(scene.id));
        const expected = answerValue(lab.api.answer(scene.id));
        assert.equal(answerValue(lesson.answer), expected, `${scene.id}: authored answer agrees with the verified source`);
        const finalSays = lesson.chapters.at(-1).cues.map(cue => cue.say || '');
        const finalValues = finalSays.flatMap(say => [say, ...Array.from(say.matchAll(/\$([^$]+)\$/g), match => match[1])]).map(answerValue);
        assert.ok(finalValues.includes(expected), `${scene.id}: the final chapter states the source answer`);
      }
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: ${key} starts explicitly`);
      assert.equal(video.stateAt(compiled, 0, { nums: {}, sets: {}, step: 99, part: 'previous-lesson' }).part, first.part);
    }
  }
  assert.equal(concepts, 65); assert.equal(originals, 30); assert.equal(concepts + originals, 95);
});

test('30 first originals agree with independent coordinate, distance, reflection and locus calculations', () => {
  const checked = [];
  const check = (id, expected, solve) => {
    const q = lab.api.first(id), value = solve(q.par, q);
    near(value, expected, `${id}: independently calculated result`);
    near(q.val, value, `${id}: source numeric result`);
    near(numericAnswer(q.ans), value, `${id}: exact displayed source answer`);
    checked.push(id);
  };
  check('divInternalExternal', 1, p => {
    assert.equal(p.kind, 'in');
    const P = [(p.n * p.A[0] + p.m * p.B[0]) / (p.m + p.n), (p.n * p.A[1] + p.m * p.B[1]) / (p.m + p.n)];
    near(dist(p.A, P) / dist(P, p.B), p.m / p.n, 'the point has the stated internal ratio');
    return sum(P);
  });
  check('divExtendedLine', 14, p => {
    const candidates = [-1, 1].map(sign => [p.B[0] + sign * p.k * (p.B[0] - p.A[0]), p.B[1] + sign * p.k * (p.B[1] - p.A[1])]);
    for (const C of candidates) near(dist(p.B, C), p.k * dist(p.A, p.B), 'both points meet the distance condition');
    return sum(candidates.sort((a, z) => z[0] - a[0])[0]);
  });
  check('pappusMedian', 7, p => Math.sqrt((p.ab ** 2 + p.ac ** 2) / 2 - (p.bc / 2) ** 2));
  check('centroidParaCoord', 4, p => {
    const M = mid(p.A, p.C), D = [2 * M[0] - p.B[0], 2 * M[1] - p.B[1]];
    assert.deepEqual(mid(p.B, D), M, 'both diagonals have the same midpoint');
    return sum(D);
  });
  check('distMinSumSq', 20, p => {
    const points = [p.A, p.B, p.C], G = [sum(points.map(q => q[0])) / 3, sum(points.map(q => q[1])) / 3];
    const f = P => sum(points.map(Q => dist(P, Q) ** 2));
    near(f([G[0] + 2, G[1] - 1]) - f(G), 3 * 5, 'moving from the centroid adds exactly three squared displacement terms');
    return f(G);
  });
  check('perpSlopeMinus1', 6, p => {
    const perpendicular = [-p.u, p.v], t = -p.A[0] / perpendicular[0];
    near(perpendicular[0] * p.v + perpendicular[1] * p.u, 0, 'the directions are perpendicular');
    return p.A[1] + t * perpendicular[1];
  });
  check('fixedPointPencil', 3, p => {
    const [a, b, c] = p.L1, [d, e, f] = p.L2, P = solve2(a, b, -c, d, e, -f);
    for (const k of [-3, 0, 2]) near((a + k * d) * P[0] + (b + k * e) * P[1] + c + k * f, 0, 'the recovered point lies on every selected family member');
    return sum(P);
  });
  check('perpBisectorOrtho', 5, p => {
    const dx = p.B[0] - p.A[0], dy = p.B[1] - p.A[1], c = (sum(p.B.map(x => x * x)) - sum(p.A.map(x => x * x))) / 2;
    return (c - dx) / dy; // y at x=1 is m+n in the equidistance line.
  });
  check('areaBisectLines', 1, p => {
    const center = mid(p.V[0], p.V[2]);
    assert.deepEqual(center, mid(p.V[1], p.V[3]), 'the rectangle has a common diagonal midpoint');
    const m = (center[1] - p.P[1]) / (center[0] - p.P[0]);
    // For the actual 8 by 4 rectangle, the line meets y=0 and y=4.
    const low = [(0 - p.P[1]) / m + p.P[0], 0], high = [(4 - p.P[1]) / m + p.P[0], 4];
    near(area([p.V[0], low, high, p.V[3]]), area(p.V) / 2, 'the chosen line bisects the actual rectangle area');
    return m;
  });
  check('threeLinesNoTri', 3, p => {
    const P = solve2(1, 1, p.s, -1, 1, p.t), concurrency = (P[1] - p.c) / P[0];
    const possibilities = new Set([-1, 1, concurrency]);
    assert.equal(possibilities.size, 3, 'two parallel cases and one concurrent case are distinct');
    return sum([...possibilities]);
  });
  check('shoelaceArea', 7, p => area([p.A, p.B, p.C]));
  check('pointLineDist', 2, p => {
    const H = solve2(p.a, p.b, -p.c, p.b, -p.a, p.b * p.P[0] - p.a * p.P[1]);
    near(p.a * H[0] + p.b * H[1] + p.c, 0, 'the perpendicular foot lies on the given line');
    return dist(p.P, H);
  });
  check('parallelLineDist', 4, p => {
    const slope = p.sgn0 * p.u / p.v, P = [0, p.n1];
    const H = solve2(-slope, 1, p.n2, 1, slope, slope * p.n1);
    return dist(P, H);
  });
  check('angleBisectorLine', 1 / 3, p => Math.tan(Math.atan2(p.u, p.v) / 2));
  check('maxDistFromPt', 5, p => {
    const bound = Math.hypot(...p.A);
    for (const angle of [0, .6, 1.5]) assert.ok(Math.abs(p.A[0] * Math.cos(angle) + p.A[1] * Math.sin(angle)) <= bound + 1e-8);
    return bound;
  });
  check('compositeStepByStep', 3, p => {
    assert.equal(p.F, 1);
    const Q = solve2(0, 1, p.a - p.c, -1, 0, p.b - p.d);
    near(Q[1] + p.c, p.a, 'first input returns to the original point');
    near(p.d - Q[0], p.b, 'second input returns to the original point');
    return sum(Q);
  });
  check('paradoxPointVsFig', -5, p => {
    const R = [p.p, p.n + p.q], S = [1 + p.p, p.m + p.n + p.q], slope = (S[1] - R[1]) / (S[0] - R[0]);
    return R[1] - slope * R[0];
  });
  check('symmetry4Basic', 24, p => area([[p.a, p.b], [p.a, -p.b], [-p.a, -p.b], [-p.a, p.b]]));
  check('symPointAndLine', 7, p => {
    assert.equal(p.kind, 'l1');
    const H = solve2(-1, 1, p.extra, 1, 1, sum(p.A)), Q = [2 * H[0] - p.A[0], 2 * H[1] - p.A[1]];
    near(dist(p.A, H), dist(Q, H), 'the mirror is the perpendicular bisector');
    return sum(Q);
  });
  check('lineSlideSame', 6, p => {
    const translatedPoint = [p.p, p.n], newIntercept = translatedPoint[1] - p.m * translatedPoint[0];
    return newIntercept - p.n;
  });
  check('reflectTriPerim', 2 * Math.sqrt(10), p => {
    const A = [p.a, p.b], R = [p.a, -p.b], S = [p.b, p.a];
    const t = -R[1] / (S[1] - R[1]), u = (R[0] - R[1]) / ((S[1] - R[1]) - (S[0] - R[0]));
    assert.ok(0 < t && t < u && u < 1, 'the unfolded segment meets the two mirrors in the required order');
    const P = along(R, S, t), Q = along(R, S, u), length = dist(A, P) + dist(P, Q) + dist(Q, A);
    near(length, dist(R, S), 'folding back preserves the three-piece perimeter');
    return length;
  });
  check('reflectSingleAxis', 10, p => {
    assert.equal(p.axis, 'x');
    const R = [p.B[0], -p.B[1]], t = -p.A[1] / (R[1] - p.A[1]);
    assert.ok(t > 0 && t < 1);
    const P = along(p.A, R, t);
    return dist(p.A, P) + dist(P, p.B);
  });
  check('reflectDoubleAxes', 13, p => {
    const R = [p.A[0], -p.A[1]], S = [-p.B[0], p.B[1]], t = -R[1] / (S[1] - R[1]), u = -R[0] / (S[0] - R[0]);
    assert.ok(0 < t && t < u && u < 1);
    const P = along(R, S, t), Q = along(R, S, u);
    return dist(p.A, P) + dist(P, Q) + dist(Q, p.B);
  });
  check('billiardMirrorRoom', 10, p => {
    const T = [2 * p.w - p.B[0], 2 * p.h - p.B[1]], t = (p.h - p.A[1]) / (T[1] - p.A[1]), u = (p.w - p.A[0]) / (T[0] - p.A[0]);
    assert.ok(0 < t && t < u && u < 1, 'top wall is reached before the right wall');
    const X = along(p.A, T, t), unfoldedY = along(p.A, T, u), Y = [unfoldedY[0], 2 * p.h - unfoldedY[1]];
    assert.ok(X[0] > 0 && X[0] < p.w && Y[1] > 0 && Y[1] < p.h, 'both reflection points lie on the actual walls');
    return dist(p.A, X) + dist(X, Y) + dist(Y, p.B);
  });
  check('diffMaxLine', 5, p => {
    assert.equal(p.kind, 'diff'); assert.equal(p.same, true);
    const t = -p.A[1] / (p.B[1] - p.A[1]), P = along(p.A, p.B, t);
    assert.ok(t < 0 || t > 1, 'equality in the reverse triangle inequality is reached on the extension');
    return Math.abs(dist(P, p.A) - dist(P, p.B));
  });
  check('trapApollonius', 16, p => {
    const a = p.n ** 2 - p.m ** 2, b = -2 * p.n ** 2 * p.xa + 2 * p.m ** 2 * p.xb, c = p.n ** 2 * p.xa ** 2 - p.m ** 2 * p.xb ** 2;
    const center = -b / (2 * a), r2 = center ** 2 - c / a, P = [center, Math.sqrt(r2)];
    near(dist(P, [p.xa, 0]) / dist(P, [p.xb, 0]), p.m / p.n, 'the recovered circle meets the original distance ratio');
    return r2;
  });
  check('trapLineSegmentMeet', 4.5, p => {
    const bounds = [p.A, p.B].map(Q => (Q[1] - p.P[1]) / (Q[0] - p.P[0])).sort((a, z) => a - z);
    const signed = (Q, slope) => Q[1] - p.P[1] - slope * (Q[0] - p.P[0]);
    const meets = slope => signed(p.A, slope) * signed(p.B, slope) <= 1e-8;
    assert.ok(meets(bounds[0]) && meets(bounds[1]) && meets(sum(bounds) / 2));
    assert.ok(!meets(bounds[0] - .01) && !meets(bounds[1] + .01));
    return sum(bounds);
  });
  check('trapInterceptZero', 1, p => {
    const equalNonzero = -1, bothZero = p.q / p.p;
    assert.ok(p.p + p.q !== 0 && equalNonzero !== bothZero);
    return equalNonzero + bothZero;
  });
  check('trapPerpDivideZero', 7 / 5, (p, q) => {
    assert.ok(q.text.includes('(k-1)x+2y+1=0') && q.text.includes('3x+(k-2)y-2=0'));
    const dot = k => 3 * (k - 1) + 2 * (k - 2), k = -dot(0) / (dot(1) - dot(0));
    near(dot(k), 0, 'the normal vectors are perpendicular without division by k-2');
    assert.notEqual(dot(2), 0, 'the vertical-line case is checked separately');
    return k;
  });
  check('trapCoordFold', 8, p => {
    const M = [p.w / 2, p.h / 2], yAt = x => (p.w ** 2 + p.h ** 2 - 2 * p.w * x) / (2 * p.h);
    near(yAt(M[0]), M[1], 'the fold passes through the midpoint of O and C');
    near(dist([1, yAt(1)], [0, 0]), dist([1, yAt(1)], [p.w, p.h]), 'every fold point is equidistant from the folded vertices');
    return yAt(1);
  });
  assert.deepEqual(checked, ids, 'all 30 current first originals are checked once');
});

const isTrace = options => options.color === 'violet' && options.width === 4.2 && options.alpha === .85;
const isEmphasis = options => options.color === 'violet' && options.glow === false && !options.label && (options.r === 4.5 || options.hollow);
function onSegment(p, a, z) {
  const dx = z.x - a.x, dy = z.y - a.y, d2 = dx * dx + dy * dy;
  const u = d2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / d2)) : 0;
  return Math.hypot(p.x - a.x - u * dx, p.y - a.y - u * dy) < 1e-7;
}
function traceOnSource(frame, label) {
  const marker = frame.points.find(p => isEmphasis(p.options));
  assert.ok(marker, `${label}: actual diagram emphasis starts within one second`);
  const p = marker.point;
  assert.ok(p.x >= frame.viewBox.x0 && p.x <= frame.viewBox.x1 && p.y >= frame.viewBox.y0 && p.y <= frame.viewBox.y1, `${label}: initial emphasis is visible in the Board`);
  if (marker.options.hollow) {
    assert.ok(frame.points.some(other => !isEmphasis(other.options) && Math.hypot(other.point.x - p.x, other.point.y - p.y) < 1e-8), 'the pulse centers on an actual condition point');
    assert.ok(marker.options.r > 5 && marker.options.r <= 9, 'the visible ring changes radius');
    return 'point';
  }
  const onPath = frame.paths.some(path => {
    if (isTrace(path.options)) return false;
    const ps = path.points.concat(path.options.close ? [path.points[0]] : []);
    return ps.slice(1).some((z, i) => onSegment(p, ps[i], z));
  });
  const onCircle = frame.circles.some(circle => !isTrace(circle.options) && Math.abs(Math.hypot(p.x - circle.center.x, p.y - circle.center.y) - circle.radius) < 1e-7);
  assert.ok(onPath || onCircle, `${label}: the marker lies on an actual source path or circle`);
  return frame.arcs.some(arc => isTrace(arc.options)) ? 'circle' : 'path';
}

test('every authored cue renders finite source geometry with visible first motion and isolated cards', t => {
  let frames = 0;
  const traced = { path: 0, circle: 0, point: 0 };
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base); const first = lab.draw();
    apply(compiled, .8, base); const motion = lab.draw(), label = `${scene.id}/${lesson.label}`;
    assert.notEqual(signature(motion), signature(first), `${label}: the actual diagram moves within one second`);
    traced[traceOnSource(motion, label)]++;
    const times = new Set([0, .8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + (cue.dur || 0) / 2)); }
    for (const time of times) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.paths.length || frame.circles.length || frame.points.some(p => !isEmphasis(p.options)), `${label}@${time}: the real condition geometry exists`);
      for (const path of frame.paths) for (const p of path.points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      for (const circle of frame.circles) assert.ok(Number.isFinite(circle.center.x) && Number.isFinite(circle.center.y) && Number.isFinite(circle.radius) && circle.radius >= 0);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo' || op.name === 'arc'), 'the native Board actually draws into canvas');
      assert.deepEqual(plain(frame.value), {}, 'legacy result/formula cards are hidden during the lesson');
      assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')), 'old solved numeric steps do not accompany the lesson');
      assert.equal(scene.vary.cur(), packet);
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lclShowAnswer, false, `${label}: answer stays closed until the final chapter`);
      if (time === compiled.length) assert.equal(lab.s.lclShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'source problem packets are not changed by playback');
  }
  assert.ok(traced.path > 0 && traced.circle > 0 && traced.point > 0, 'paths, exact circles and condition-point pulses all execute');
  assert.equal(sum(Object.values(traced)), 95);
  t.diagnostic(`${frames} production Board/raw-canvas cue frames; first emphasis: ${traced.path} native paths, ${traced.circle} exact circles, ${traced.point} condition-point pulses; full browser/mobile visual audit NOT_RUN`);
});

test('actual new-problem clicks preserve manual variants while first-original replay stays fixed', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0], originalIndex = scene.vary.idx;
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3; lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab), manualGeometry = signature(lab.draw());
    assert.notEqual(manual, first, `${scene.id}: the real button selects or regenerates a manual packet`);
    if (scene.vary.pool.length > 1) assert.notEqual(scene.vary.idx, originalIndex);
    assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); const question = scene.question(lab.s, lab), initial = signature(lab.draw());
    assert.equal(question, lab.api.question(scene.id)); assert.equal(scene.vary.cur(), first);
    assert.ok(!question.includes('data-cl-new'));
    apply(compiled, compiled.length, base); lab.draw(); apply(compiled, 0, base);
    assert.equal(scene.question(lab.s, lab), question);
    assert.equal(signature(lab.draw()), initial, `${scene.id}: replay restores the exact first-source diagram`);
    lab.s.lessonOn = false; lab.s.lessonEntry = false; lab.s.step = 0; lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual); assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.equal(signature(lab.draw()), manualGeometry, `${scene.id}: the manual problem diagram survives the lesson`);
  }
});

test('source conclusion labels wait for final, measurement passes are excluded and entry closes stale answers', () => {
  let nativeNumericLabels = 0;
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), lesson = sourceLessons(scene.id)[0], compiled = video.compileLesson(lesson), base = baseState();
    const finalAt = compiled.chapters.at(-1).at, q = lab.api.first(scene.id);
    const finalLabels = q.fig.items.filter(item => item.k === 'pt' || item.k === 'len')
      .map(item => item.k === 'len' ? item.str : item.upg && item.upg[0] <= 3 ? item.upg[1] : item.name)
      .filter(label => label != null && /\d/.test(String(label))).map(String);
    for (const time of new Set([0, finalAt - .01, ...compiled.cues.filter(cue => cue.at < finalAt).map(cue => cue.at)])) {
      apply(compiled, time, base); lab.s.step = 99;
      // Force the native stage-99 sizing pass. It must not become a visible frame.
      lab.board.__pk = null;
      const frame = lab.draw();
      assert.equal(lab.s.lclShowAnswer, false);
      assert.ok(frame.boardTexts.every(text => !/\d/.test(text)), `${scene.id}: no numeric review labels before the final chapter`);
      for (const text of finalLabels.filter(label => /[A-Z][^]*\(/.test(label))) assert.ok(!frame.texts.includes(text), `${scene.id}: a measurement-only final coordinate is not rendered`);
      assert.deepEqual(plain(frame.value), {});
    }
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lclShowAnswer, true);
    for (const text of finalLabels) { assert.ok(final.boardTexts.includes(text), `${scene.id}: original label ${text} is available at final`); nativeNumericLabels++; }
    apply(compiled, 0, base, true); const entry = signature(lab.draw());
    Object.assign(lab.s, { lclShowAnswer: true, step: 99 }); const stale = lab.draw();
    assert.equal(signature(stale), entry, `${scene.id}: entry forces the initial stage despite a stale final flag`);
    assert.ok(stale.boardTexts.every(text => !/\d/.test(text)));
    assert.equal(scene.vary.cur(), q);
  }
  assert.ok(nativeNumericLabels >= 30, 'native conditions and conclusion labels were restored across the actual problem bank');
});

test('lesson-only diagrams show the promised coordinate symmetries and boundary cases', () => {
  function atMode(id, mode) {
    lab.go(id);
    const lesson = lessonsOf(id).find(item => item.chapters[0].cues[0].set.lclConcept && item.chapters[0].cues[0].set.lclMode === mode);
    assert.ok(lesson, `${id}: authored mode ${mode} is registered`);
    const compiled = video.compileLesson(lesson); apply(compiled, 0, baseState());
    return lab.draw();
  }
  const mathPoint = p => [p.x / 36, -p.y / 36];
  const named = (frame, name) => {
    const item = frame.points.find(item => item.options.label === name || item.options.label?.startsWith(name + '('));
    assert.ok(item, `actual point ${name} exists`); return mathPoint(item.point);
  };
  atMode('centroidParaCoord', 'unordered');
  for (const [which, expected] of [[0, [9, 5]], [1, [-9, 3]], [2, [3, -5]]]) {
    lab.s.lclCase = which; const frame = lab.draw();
    assert.deepEqual(named(frame, 'D'), expected, 'each choice of the opposite vertex makes the correct parallelogram');
    const poly = frame.paths.find(path => path.options.close && path.options.color === 'rose');
    const pts = poly.points.map(mathPoint); assert.deepEqual(mid(pts[0], pts[2]), mid(pts[1], pts[3]));
  }
  atMode('distMinSumSq', 'sum'); lab.s.lclT = .4;
  {
    const frame = lab.draw(), A = named(frame, 'A'), B = named(frame, 'B'), P = named(frame, 'P');
    near(dist(A, P) + dist(P, B), dist(A, B), 'the moving point really stays on the shortest segment');
  }
  atMode('distMinSumSq', 'axis'); lab.s.lclX = 0;
  {
    const frame = lab.draw(), A = named(frame, 'A'), B = named(frame, 'B'), C = named(frame, 'C'), G = named(frame, 'G'), P = named(frame, 'P');
    assert.deepEqual(G, [sum([A[0], B[0], C[0]]) / 3, sum([A[1], B[1], C[1]]) / 3]);
    assert.deepEqual(P, [G[0], 0], 'the constrained minimizer is the centroid projection onto the axis');
  }
  atMode('threeLinesNoTri', 'regions');
  for (const [which, expected] of [[0, 4], [1, 6], [2, 6], [3, 7]]) {
    lab.s.lclCase = which; const frame = lab.draw();
    const lines = frame.paths.filter(path => path.points.length === 2 && path.options.width === 3.2 && ['sky', 'green', 'amber'].includes(path.options.color));
    assert.equal(lines.length, 3);
    const equations = lines.map(path => { const [P, Q] = path.points.map(mathPoint), a = Q[1] - P[1], b = P[0] - Q[0]; return [a, b, a * P[0] + b * P[1]]; });
    let regions = 1;
    equations.forEach(([a, b, c], i) => {
      const cuts = [];
      for (const [d, e, f] of equations.slice(0, i)) if (Math.abs(a * e - b * d) > 1e-8) {
        const P = solve2(a, b, c, d, e, f);
        if (!cuts.some(Q => dist(P, Q) < 1e-8)) cuts.push(P);
      }
      regions += cuts.length + 1;
    });
    assert.equal(regions, expected, 'count distinct intersections on each newly drawn line');
  }
  const symmetries = {
    'sym-x': ([x, y]) => [x, -y], 'sym-y': ([x, y]) => [-x, y], 'sym-origin': ([x, y]) => [-x, -y],
    'sym-diagonal': ([x, y]) => [y, x], 'sym-antidiagonal': ([x, y]) => [-y, -x]
  };
  for (const [mode, image] of Object.entries(symmetries)) {
    const frame = atMode('symmetry4Basic', mode);
    for (const name of ['A', 'B', 'C']) assert.deepEqual(named(frame, name + '′'), image(named(frame, name)), `${mode}: the actual image matches the coordinate transformation`);
  }
  {
    const frame = atMode('symPointAndLine', 'point-symmetry');
    assert.deepEqual(mid(named(frame, 'P'), named(frame, 'P′')), named(frame, 'M'));
  }
  {
    const frame = atMode('reflectTriPerim', 'angle'), A = named(frame, 'A₁'), B = named(frame, 'A₂');
    near(A[0] * B[0] + A[1] * B[1], 0, 'the two reflected radii form the marked right angle');
    near(Math.hypot(...A), Math.hypot(...B), 'reflection preserves the distance to the origin');
  }
  {
    const frame = atMode('diffMaxLine', 'sum'), A = named(frame, 'A'), B = named(frame, 'B'), R = named(frame, 'B′'), P = named(frame, 'P');
    near(dist(A, P) + dist(P, B), dist(A, R), 'the displayed point attains the unfolded sum minimum');
  }
  {
    const frame = atMode('trapLineSegmentMeet', 'open');
    for (const name of ['A', 'B']) assert.ok(frame.points.find(item => item.options.label === name).options.hollow, 'excluded segment endpoints are hollow');
  }
  for (const mode of ['intercept-nonzero', 'intercept-zero', 'intercept-absolute']) {
    const frame = atMode('trapInterceptZero', mode);
    const lines = frame.paths.filter(path => path.points.length === 2 && path.options.width === 3.2 && !isTrace(path.options));
    const slopes = lines.map(path => { const [A, B] = path.points.map(mathPoint); return (B[1] - A[1]) / (B[0] - A[0]); }).sort((a, z) => a - z);
    assert.deepEqual(slopes, mode === 'intercept-nonzero' ? [-1] : mode === 'intercept-zero' ? [2] : [-1, 1, 2]);
    if (mode === 'intercept-absolute') {
      const C = named(frame, 'C'), D = named(frame, 'D');
      near(Math.abs(C[0]), Math.abs(D[1]), 'equal absolute intercepts can have opposite signs');
      assert.ok(C[0] * D[1] < 0);
    }
  }
});
