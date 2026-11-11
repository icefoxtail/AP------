// Run the production HTML, Board and native apl-space.js renderer.
// These are release checks, not a browser/mobile visual audit.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/poly-solid-lesson-runtime.mjs';

const lab = await load(), video = lab.video;
const counts = { sq: 3, cube: 3, box: 4, cut: 4, prism: 3 };
const plain = value => JSON.parse(JSON.stringify(value));
const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-8, `${message}: ${actual} ≠ ${expected}`);
const lessonsOf = id => video.lessonList(lab.def.lessons[id]);
const sourceLessons = id => lessonsOf(id).filter(lesson => !lesson.chapters[0].cues[0].set.lpsConcept);
const baseState = () => ({ nums: { ...lab.s }, sets: { ...lab.s }, step: 0, part: null });
function apply(compiled, time, base = baseState(), entry = false) {
  const state = video.stateAt(compiled, time, base);
  Object.assign(lab.s, state.nums, state.sets, { lessonOn: !entry, lessonEntry: entry, step: state.step });
  lab.tab = 'review';
  return state;
}
const signature = frame => JSON.stringify({ paths: frame.paths, points: frame.points, meshes: frame.meshes, spacePolys: frame.spacePolys, spaceLines: frame.spaceLines });
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
const norm = p => Math.hypot(p.x, p.y, p.z);
const pointKey = p => [p.x, p.y, p.z].join(',');
const unique = points => Array.from(new Map(points.map(p => [pointKey(p), p])).values());
const faceArea = points => points.slice(2).reduce((sum, p, i) => sum + norm(cross(sub(points[i + 1], points[0]), sub(p, points[0]))) / 2, 0);
const meshArea = faces => faces.reduce((sum, face) => sum + faceArea(face), 0);
function meshVolume(faces) {
  const points = unique(faces.flat());
  const center = points.reduce((c, p) => ({ x: c.x + p.x / points.length, y: c.y + p.y / points.length, z: c.z + p.z / points.length }), { x: 0, y: 0, z: 0 });
  return faces.reduce((sum, face) => sum + face.slice(2).reduce((v, p, i) => v + Math.abs(dot(sub(face[0], center), cross(sub(face[i + 1], center), sub(p, center)))) / 6, 0), 0);
}
function meshEdges(faces) {
  const edges = new Map();
  for (const face of faces) face.forEach((a, i) => { const b = face[(i + 1) % face.length], key = [pointKey(a), pointKey(b)].sort().join('|'); edges.set(key, [a, b]); });
  return Array.from(edges.values());
}
const edgeSum = faces => meshEdges(faces).reduce((sum, [a, b]) => sum + norm(sub(a, b)), 0);
const sideLengthsSquared = face => face.map((p, i) => { const d = sub(p, face[(i + 1) % face.length]); return dot(d, d); }).sort((a, b) => a - b);

test('production HTML loads native Space and all five scenes / 17 valid lessons', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js', import.meta.url), 'utf8'), context);
  const catalog = context.window.APLab.catalog.labs.find(item => item.id === 'common-poly-solid');
  assert.equal(lab.list.length, catalog.sceneTotal);
  assert.deepEqual(Array.from(lab.list, scene => scene.id), Object.keys(counts));
  assert.deepEqual(Object.keys(lab.def.lessons).sort(), Object.keys(counts).sort());
  assert.ok(lab.api && lab.lessonApi && video);
  for (const file of ['../kit/apl-core.js', '../kit/apl-board.js', '../kit/apl-space.js', '../kit/apl-shell.js', '../kit/apl-video-core.js', '../kit/apl-player.js', '../kit/apl-toc.js', 'common-poly-solid/lesson-core.js', 'common-poly-solid/lesson-a.js', 'common-poly-solid/lesson-b.js']) assert.ok(lab.loaded.includes(file), file);
  assert.ok(lab.html.includes('../kit/apl-video.css'));
  let concepts = 0, originals = 0;
  for (const scene of lab.list) {
    assert.equal(lessonsOf(scene.id).length, counts[scene.id]);
    assert.equal(sourceLessons(scene.id).length, 1);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[scene.id])), { errors: [], warnings: [] }, scene.id);
    assert.equal(lab.api.steps(scene.id).length, 3, 'the three original solution steps are retained');
    for (const lesson of lessonsOf(scene.id)) {
      const first = lesson.chapters[0].cues[0];
      first.set.lpsConcept ? concepts++ : originals++;
      for (const key of ['lpsQuestion', 'lpsConcept', 'lpsExplore', 'lpsTarget', 'lpsShowAnswer', 'lpsCutMode', 'lpsDifference', 'lpsShowFaces']) assert.ok(Object.hasOwn(first.set, key), `${scene.id}/${lesson.label}: resets ${key}`);
      assert.equal(first.at, 0); assert.equal(first.set.lpsShowAnswer, false);
      assert.ok(lesson.chapters.length >= 4 && lesson.chapters.length <= 6);
      for (const chapter of lesson.chapters) assert.ok(chapter.length >= 8 && chapter.length <= 15);
      const compiled = video.compileLesson(lesson);
      assert.ok(compiled.length >= 60 && compiled.length <= 90);
      for (const key of Object.keys(compiled.tracks)) assert.ok(Number.isFinite(compiled.start[key]), `${scene.id}/${lesson.label}: numeric ${key} initialized`);
    }
  }
  assert.equal(concepts, 12); assert.equal(originals, 5);
});

test('the five first originals satisfy independent area, volume and polynomial calculations', () => {
  const get = id => { const scene = lab.go(id), v = lab.api.first(id); assert.equal(v, scene.vary.first()); return v; };
  for (const id of ['sq', 'cube']) {
    const v = get(id);
    assert.deepEqual([v.s, v.p], [5, 6]);
    const d = Math.sqrt(v.s * v.s - 4 * v.p), a = (v.s + d) / 2, b = (v.s - d) / 2;
    assert.deepEqual([a, b], [3, 2]);
    const answer = id === 'sq' ? a * a + b * b : a ** 3 + b ** 3;
    near(v.ans.val, answer, `${id}: sum of the two original squares/cubes`);
    near(answer, id === 'sq' ? 13 : 35, `${id}: first original answer`);
  }
  {
    const v = get('box'); assert.deepEqual([v.a, v.b, v.c], [1, 2, 3]);
    const faceAreas = [v.a * v.b, v.b * v.c, v.c * v.a];
    near(v.L, 4 * (v.a + v.b + v.c), 'all twelve edges');
    near(v.Vol, v.a * v.b * v.c, 'source volume');
    near(v.q, v.a ** 2 + v.b ** 2 + v.c ** 2, 'space diagonal squared');
    near(v.ans.val, faceAreas.reduce((sum, A) => sum + A * A, 0), 'sum of three face-area squares');
    near(v.ans.val, 49, 'first original face-area answer');
  }
  {
    const v = get('cut'); assert.deepEqual([v.a, v.b, v.c], [2, 3, 5]);
    const A = { x: v.a, y: 0, z: 0 }, C = { x: 0, y: v.b, z: 0 }, F = { x: 0, y: 0, z: v.c };
    const sum = sideLengthsSquared([A, C, F]).reduce((n, x) => n + x, 0);
    near(v.s, v.a + v.b + v.c, 'edge-difference half');
    near(v.S, v.a * v.b + v.b * v.c + v.c * v.a, 'surface-area difference');
    near(v.ans.val, sum, 'three cut-face edge squares from independent coordinates');
    near(v.ans.val, 76, 'first original cut answer');
  }
  {
    const v = get('prism'); assert.deepEqual([v.a, v.m, v.n, v.k], [2, 1, 3, 20]);
    const a = 2, length = v.m * a * a + (v.m + v.n) * a + v.n, ap = length / (a + 1);
    near(length, 15, 'the source cuboid is longer than the free exploration default');
    near(ap / (length - ap), 1 / a, 'the stated internal-division ratio');
    const V1 = (ap + length) * a * a / 2, V2 = (length - ap) * a * a / 2;
    near(V1 - V2, v.k, 'the two prism volumes have the stated difference');
    assert.ok(3 * v.m * a * a + 2 * v.n * a > 0 && v.m > 0 && v.n > 0, 'the volume equation is strictly increasing for positive a');
    near(v.ans.val, ap, 'first original AP'); near(v.ans.val, 5, 'first original length');
  }
});

test('all cue frames render finite native geometry, move immediately and suppress old answer cards', t => {
  let frames = 0, nativeFrames = 0;
  function onSegment(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, length2 = dx * dx + dy * dy;
    if (length2 < 1e-10) return false;
    const u = ((p.x - a.x) * dx + (p.y - a.y) * dy) / length2;
    return u >= -1e-8 && u <= 1 + 1e-8 && Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) < 1e-7;
  }
  for (const scene0 of lab.list) for (const lesson of lessonsOf(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState(), packet = lab.api.first(scene.id), before = plain(packet);
    apply(compiled, 0, base); const first = lab.draw();
    apply(compiled, 0.8, base); const motion = lab.draw();
    assert.notEqual(signature(motion), signature(first), `${scene.id}/${lesson.label}: actual geometry moves within one second`);
    if (scene.id === 'sq') {
      const marker = motion.points.find(p => p.options.color === 'violet' && p.options.r === 4.5);
      assert.ok(marker, 'the flat square uses a visible outline trace');
      assert.ok(motion.paths.filter(path => !(path.options.color === 'violet' && path.options.width === 4)).some(path => path.points.slice(1).some((p, i) => onSegment(marker.point, path.points[i], p))), 'the trace lies on an actual rectangle edge');
    } else {
      assert.equal(first.cameras.length, 1); assert.equal(motion.cameras.length, 1);
      assert.notEqual(first.cameras[0].yaw, motion.cameras[0].yaw, 'the native camera changes the actual 3D projection');
    }
    const times = new Set([0, 0.8, compiled.length]);
    for (const cue of compiled.cues) { times.add(cue.at); times.add(Math.min(compiled.length, cue.at + cue.dur / 2)); }
    for (const time of times) {
      apply(compiled, time, base); const frame = lab.draw(); frames++;
      assert.ok(frame.paths.length, `${scene.id}/${lesson.label}@${time}: projected source geometry is present`);
      assert.ok(frame.canvas.some(op => op.name === 'lineTo'), 'the real Board draws on the canvas');
      if (scene.id !== 'sq') {
        nativeFrames++;
        assert.equal(frame.cameras.length, 1);
        assert.ok(frame.meshes.length || frame.spacePolys.length, 'native Space receives solid faces rather than empty stand-ins');
        assert.ok(frame.spaceLines.length || frame.spacePolys.length, 'native Space emits actual projected lines or faces');
      }
      assert.deepEqual(plain(frame.value), {}); assert.equal(scene.reviewTop(lab.s, lab), '');
      assert.ok(scene.steps(lab.s, lab).every(step => !step.includes('$')), 'old numeric solution steps remain isolated');
      assert.equal(scene.vary.cur(), packet, 'the first source packet remains selected');
      if (time < compiled.chapters.at(-1).at) assert.equal(lab.s.lpsShowAnswer, false);
      if (time === compiled.length) assert.equal(lab.s.lpsShowAnswer, true);
    }
    assert.deepEqual(plain(packet), before, 'source condition objects remain unchanged');
  }
  t.diagnostic(`${frames} production Board cue frames, including ${nativeFrames} native Space frames; browser/mobile visual review NOT_RUN`);
});

test('actual new-problem clicks and replay preserve manual packets and native geometry at the same camera', () => {
  for (const scene0 of lab.list) {
    const scene = lab.go(scene0.id), first = scene.vary.first(), lesson = sourceLessons(scene.id)[0];
    lab.tab = 'problem'; lab.s.revealed = true; lab.s.step = 3; lab.newProblem();
    const manual = scene.vary.cur(), manualText = scene.problem.text(lab.s, lab), manualSteps = Array.from(scene.steps(lab.s, lab));
    const camera = { yaw: lab.s.yaw, pitch: lab.s.pitch }, manualDrawing = signature(lab.draw());
    assert.notEqual(manual, first); assert.equal(lab.s.revealed, false); assert.equal(lab.s.step, 0);
    const compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); const firstDrawing = signature(lab.draw());
    assert.equal(scene.question(lab.s, lab), lab.api.question(scene.id));
    assert.ok(!scene.question(lab.s, lab).includes('data-ps-new'));
    assert.equal(scene.vary.cur(), first);
    if (scene.tick) {
      lab.s.playing = true; const before = plain(lab.s);
      assert.equal(scene.tick(lab.s, 0.2, lab), false);
      assert.deepEqual(plain(lab.s), before, 'legacy automatic spin cannot overwrite the lesson camera');
    }
    apply(compiled, compiled.length, base); apply(compiled, 0, base);
    assert.equal(signature(lab.draw()), firstDrawing, 'replay restores the same original model and camera');
    Object.assign(lab.s, camera, { lessonOn: false, lessonEntry: false, step: 0, playing: false }); lab.tab = 'problem';
    assert.equal(scene.vary.cur(), manual);
    assert.equal(scene.problem.text(lab.s, lab), manualText);
    assert.deepEqual(Array.from(scene.steps(lab.s, lab)), manualSteps);
    assert.equal(signature(lab.draw()), manualDrawing, 'the manual variant keeps its original source geometry at the same camera');
    if (scene.tick) { lab.s.playing = true; const yaw = lab.s.yaw; assert.equal(scene.tick(lab.s, 0.2, lab), true); near(lab.s.yaw, yaw + 6, 'manual automatic spin is preserved'); }
  }
});

test('the final numeric AP label and answer flags stay hidden before conclusion and on stale entry', () => {
  const numericAP = text => /^AP\s*=.*=\s*5$/.test(text);
  for (const scene0 of lab.list) for (const lesson of sourceLessons(scene0.id)) {
    const scene = lab.go(scene0.id), compiled = video.compileLesson(lesson), base = baseState();
    apply(compiled, 0, base); lab.s.step = 99;
    const early = lab.draw();
    assert.equal(lab.s.lpsShowAnswer, false); assert.deepEqual(plain(early.value), {});
    assert.ok(!early.texts.some(numericAP), 'a high legacy step cannot disclose the requested prism length');
    apply(compiled, compiled.length, base); const final = lab.draw();
    assert.equal(lab.s.lpsShowAnswer, true);
    if (scene.id === 'prism') assert.ok(final.texts.some(numericAP), 'the final native 3D label gives the original AP answer');
    lab.s.lessonOn = false; lab.s.lessonEntry = true; lab.s.step = 99;
    const entry = lab.draw();
    assert.ok(!entry.texts.some(numericAP), 'entry masks stale final AP labels');
    assert.deepEqual(plain(entry.value), {}); assert.equal(scene.reviewTop(lab.s, lab), '');
  }
});

test('native models contain eight cube pieces, the two common cut faces and the original prism volumes', () => {
  const originalFrame = id => { lab.go(id); const lesson = sourceLessons(id)[0], compiled = video.compileLesson(lesson), base = baseState(); apply(compiled, 0, base); return lab.draw(); };
  {
    const frame = originalFrame('sq'), squares = frame.paths.filter(path => path.options.fill && path.points.length === 4);
    assert.equal(squares.length, 4, 'four actual flat pieces are drawn once, excluding the fit measurement');
    const areas = squares.map(path => Math.abs(path.points.reduce((sum, p, i) => { const q = path.points[(i + 1) % path.points.length]; return sum + p.x * q.y - p.y * q.x; }, 0)) / 2).sort((a, b) => a - b);
    assert.deepEqual(areas, [4, 6, 6, 9]);
  }
  {
    const frame = originalFrame('cube');
    assert.equal(frame.fitPoints.length, 1); assert.equal(frame.fitPoints[0].length, 64, 'the native model supplies eight sets of eight corners');
    assert.equal(frame.spacePolys.length, 24, 'three visible faces for each of the eight pieces');
    const volumes = [];
    for (let i = 0; i < 64; i += 8) {
      const points = frame.fitPoints[0].slice(i, i + 8);
      volumes.push(['x', 'y', 'z'].reduce((V, key) => V * (Math.max(...points.map(p => p[key])) - Math.min(...points.map(p => p[key]))), 1));
    }
    const expected = [8, 12, 12, 12, 18, 18, 18, 27];
    volumes.sort((a, b) => a - b).forEach((volume, i) => near(volume, expected[i], 'native cube-piece volume'));
    near(volumes.reduce((V, n) => V + n, 0), 125, 'the eight pieces fill the original cube');
    const polygon = frame.spacePolys[0], camera = frame.cameras[0], P = polygon.vertices[0];
    const x = P.x * Math.cos(camera.yaw) - P.z * Math.sin(camera.yaw), z = P.x * Math.sin(camera.yaw) + P.z * Math.cos(camera.yaw);
    near(polygon.projected[0].x, x, 'native projected x'); near(polygon.projected[0].y, P.y * Math.cos(camera.pitch) - z * Math.sin(camera.pitch), 'native projected y');
    assert.ok(frame.paths.some(path => path.points.length === 4 && path.points.every((p, i) => Math.hypot(p.x - polygon.projected[i].x, p.y - polygon.projected[i].y) < 1e-8)), 'the native projected face reaches Board.path');
  }
  {
    const frame = originalFrame('box'); assert.equal(frame.meshes.length, 1);
    assert.equal(frame.meshes[0].length, 6); assert.equal(meshEdges(frame.meshes[0]).length, 12);
    near(meshVolume(frame.meshes[0]), 6, 'source box uses 1×2×3 rather than exploration defaults');
    near(meshArea(frame.meshes[0]), 22, 'source box has the six correct face areas');
  }
  {
    const frame = originalFrame('cut'); assert.equal(frame.meshes.length, 2);
    const [remainder, tetrahedron] = frame.meshes;
    assert.equal(meshEdges(remainder).length, 12); assert.equal(meshEdges(tetrahedron).length, 6);
    near(edgeSum(remainder) - edgeSum(tetrahedron), 20, 'native shared edges cancel in the difference');
    near(meshArea(remainder) - meshArea(tetrahedron), 31, 'native shared face cancels in the surface difference');
    const shared = mesh => mesh.find(face => face.length === 3 && sideLengthsSquared(face).every((n, i) => Math.abs(n - [13, 29, 34][i]) < 1e-8));
    assert.ok(shared(remainder) && shared(tetrahedron), 'both solids retain the same cut-face geometry');
    near(faceArea(shared(remainder)), faceArea(shared(tetrahedron)), 'the two translated cut faces have equal area');
    near(meshVolume(remainder) + meshVolume(tetrahedron), 30, 'both solids retain the 2×3×5 source volume');
  }
  {
    const frame = originalFrame('prism'); assert.equal(frame.meshes.length, 2);
    const [V1, V2] = frame.meshes.map(meshVolume);
    near(V1, 40, 'source quadrilateral-prism volume'); near(V2, 20, 'source triangular-prism volume');
    near(V1 + V2, 60, 'source L=15 and a=2 give total volume 60');
    near(V1 - V2, 20, 'the original volume difference is retained while pieces separate');
  }
});
