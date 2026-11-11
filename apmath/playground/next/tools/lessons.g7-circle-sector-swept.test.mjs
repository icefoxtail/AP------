// F06 신규 6장면: 실제 장면 결속·독립 계산·공개 순서·되감기·직접 해 보기 회귀.
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector-swept.test.mjs
// 아래 Canvas 명령 검사는 실제 브라우저의 모바일 화면/터치/잘림 검수를 대신하지 않습니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(HERE, '../labs/g7-circle-sector');
const read = (name) => fs.readFileSync(path.join(DIR, name), 'utf8');
const SOURCE = read('swept.js');
const clone = (value) => JSON.parse(JSON.stringify(value, (_key, x) => typeof x === 'function' ? '[function]' : x));
const norm = (value) => core.normAnswer(typeof value === 'string' ? value : JSON.stringify(value));
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-8, `${label}: ${a} ~= ${b}`);

function load(source = SOURCE, lessons = true) {
  const box = { window: {}, document: { createElement: () => ({}), head: { append() {} }, getElementById: () => null } };
  vm.createContext(box); vm.runInContext(source, box, { filename: 'swept.js' });
  if (lessons) for (const file of ['lesson.js', 'lesson-swept.js']) vm.runInContext(read(file), box, { filename: file });
  return box.window;
}
const loaded = load(), groups = loaded.APL_CS_GROUPS;
const scenes = new Map(groups.flatMap((group) => group.scenes).map((scene) => [scene.id, scene]));
const helpers = groups.find((group) => group.id === 'f06-swept')._test;
const ids = ['sw-rect', 'sw-tri', 'sw-center', 'sw-inside', 'gt-hex', 'gt-spiral'];
const lessons = Object.fromEntries(ids.map((id) => [id, loaded.APL_LESSONS['g7-circle-sector'][id]]));

function entered(scene) {
  const s = { step: 0, part: null }, lab = { s, params: {}, tab: 'explore', invalidate() {}, _buildReview() {} };
  scene.enter(s, lab); return { s, lab };
}
function state(id, t) {
  const lesson = lessons[id], cs = core.compileLesson(lesson), { s, lab } = entered(scenes.get(id));
  const value = core.stateAt(cs, t, { nums: s, sets: s, step: 0, part: null });
  Object.assign(s, value.nums, value.sets, { step: value.step, part: value.part, lessonOn: true, lessonEntry: false });
  lab.tab = lesson.tab || 'explore'; return { s, lab, cs };
}

// 실제 scene.draw에 전달하는 API의 명령·텍스트를 기록합니다. 픽셀을 렌더한 것으로 보고하지 않습니다.
function drawing(scene, s, lab) {
  const commands = [], texts = [], record = (method, args) => commands.push([method, clone(args)]);
  const b = {
    W: 390, H: 550, kind: 'figure', lw: 1, thumb: false, pad: .07,
    insets: { top: 48, bottom: 42, left: 4, right: 12 }, focus: { x: [-5, 5], y: [-4, 4] },
    get k() { return Math.min((this.W - this.insets.left - this.insets.right) * (1 - 2 * this.pad) / (this.focus.x[1] - this.focus.x[0]), (this.H - this.insets.top - this.insets.bottom) * (1 - 2 * this.pad) / (this.focus.y[1] - this.focus.y[0])); },
    toS(p) { return { x: (this.W + this.insets.left - this.insets.right) / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k, y: (this.H + this.insets.top - this.insets.bottom) / 2 + (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k }; },
    setFocus(f, animated) { this.focus = f; record('setFocus', [f, animated]); },
    color: (name, alpha) => `${name}:${alpha ?? 1}`,
    annotationSize: (text) => ({ width: String(text).length * 8, height: 18 })
  };
  b.ctx = new Proxy({}, { get: (_target, key) => (...args) => record('ctx.' + key, args), set: (target, key, value) => { target[key] = value; record('ctx.set.' + key, [value]); return true; } });
  for (const method of ['arc', 'seg', 'circle', 'path', 'poly', 'point', 'angle', 'ticks', 'right', 'handle', 'leader', 'text', 'stext']) {
    b[method] = (...args) => {
      record(method, args);
      if (method === 'text') texts.push({ text: String(args[1]), options: args[2] || {} });
      if (method === 'stext') texts.push({ text: String(args[2]), options: args[3] || {} });
      if ((method === 'angle' || method === 'point') && args.at(-1)?.label) texts.push({ text: String(args.at(-1).label), options: args.at(-1) });
    };
  }
  const view = scene.view(s, lab); scene.draw(b, s, view, lab);
  const finite = (x) => {
    if (typeof x === 'number') assert.ok(Number.isFinite(x), `${scene.id}: finite draw argument`);
    else if (x && typeof x === 'object') Object.values(x).forEach(finite);
  };
  finite(commands); return { commands, texts, view: clone(view), focus: clone(b.focus) };
}
function frame(id, t) { const { s, lab } = state(id, t); return { ...drawing(scenes.get(id), s, lab), s }; }
function manualDigest(scene) {
  const frames = [];
  for (const [tab, step, t] of [['explore', 0, 0], ['explore', 0, .3], ['explore', 0, .6], ['explore', 0, 1], ['review', 0, 0], ['review', 1, .6], ['review', 2, .6], ['review', 4, 1], ['problem', 0, 0]]) {
    const { s, lab } = entered(scene); lab.tab = tab; Object.assign(s, { step, swT: t, gtT: t });
    frames.push(drawing(scene, s, lab));
  }
  return crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex');
}
// 6533d858361540e1f5f4b2b57025fe5667892775 원본에서 만든 10장면 × 9상태의 명령·view·focus hash.
// Git 이력 접근 없이 CI에서도 직접 해 보기의 수정 전 그림과 대조합니다.
const MANUAL_BASELINE = {
  "sw-square": "171a61fbca82125077d71fbf5bec781630dfa6bc4b62f99e4ecb9631ef6098d7",
  "sw-rect": "74686a7229d79d7528e1b1fa1d07db2816a90800aecfad94b18c96830bdbeabd",
  "sw-tri": "3aef777902440a00c9bab80b5138ef0810d2e284f641ff6753dd9ccdc0a332f3",
  "sw-center": "f7481ae1175d6085404ff91d037303cd7c00446e157f3acac6cc5c40440b59f2",
  "sw-inside": "c759965883c47a51cb8276d2769b5191734e9371910f06f777e7d2a1194cbf59",
  "gt-kennel": "786dd6dc6c2d23ea3b28c032d899cac9f22010b26fbb29b1c8f8fe0aef75c8a2",
  "gt-warehouse": "9832f8a21e0a44e3a7321bf251ce658f0fedd27985c21dea239a28803d70c5e9",
  "gt-tri": "f73cea9e77bd9f8fa52707c5631de087bbf2e12bf668e2e341a118e02f511610",
  "gt-hex": "1d3dd2ab5356808c8516c386d5d989dc34a56346eea8e08233ffd53052ab21e6",
  "gt-spiral": "77d84750e33a4e4a3ac98756bc0338b6f4762e942a9d5e9f426696cbc0abc6a3"
};

function independent(id, s) {
  if (id === 'sw-inside') {
    const a = s.swI, r = s.swR, hole = a - 4 * r;
    // 바깥/안쪽 정사각형의 차에서 4개의 r×r 구석을 빼고 사분원 4개를 되돌립니다.
    const constant = a * a - hole * hole - 4 * r * r, pi = r * r;
    return { model: helpers.insideModel(a, r), constant, pi, hole,
      pieces: [a * a, hole * hole, a * a - hole * hole, 4 * r * r - Math.PI * r * r],
      numbers: [a, r, hole, 2 * r, a * a, hole * hole, a * a - hole * hole, 4 * r * r, constant, 2, 4, 90] };
  }
  if (id.startsWith('sw-')) {
    const shape = id === 'sw-rect' ? 'rect' : id === 'sw-tri' ? 'tri' : 'square';
    const a = shape === 'rect' ? s.swW : s.swA, b = shape === 'rect' ? s.swH : a, r = s.swR;
    const model = helpers.sweepModel(shape, a, b, r), vertices = model.V;
    const edgeLengths = vertices.map((p, i) => Math.hypot(p[0] - vertices[(i + 1) % vertices.length][0], p[1] - vertices[(i + 1) % vertices.length][1]));
    const angles = vertices.map((p, i) => {
      const before = vertices[(i + vertices.length - 1) % vertices.length], after = vertices[(i + 1) % vertices.length];
      const u = [before[0] - p[0], before[1] - p[1]], v = [after[0] - p[0], after[1] - p[1]];
      return 180 - Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI;
    });
    const perimeter = edgeLengths.reduce((x, y) => x + y, 0), pathMode = id === 'sw-center';
    const constant = perimeter * (pathMode ? 1 : 2 * r), pi = pathMode ? 2 * r : (2 * r) ** 2;
    return { model, constant, pi, edgeLengths, angles, pieces: edgeLengths.map((x) => x * (pathMode ? 1 : 2 * r)),
      numbers: [a, b, r, 2 * r, vertices.length, ...edgeLengths, ...edgeLengths.map((x) => x * 2 * r), constant, pi, 2, 4, 60, 90, 120, 180, 360] };
  }
  if (id === 'gt-hex') {
    const p = s.gtH, L = s.gtL, r = L - p, outer = 360 / 6, inner = 180 - outer;
    const parts = [r * r * outer / 360, L * L * (360 - inner) / 360, r * r * outer / 360];
    return { model: helpers.goatModel('hex', s), constant: 0, pi: parts.reduce((x, y) => x + y, 0), coefficients: parts,
      radii: [r, L, r], angles: [outer, 360 - inner, outer],
      numbers: [p, L, r, outer, inner, 180, 240, 360, 2, parts[1], parts.reduce((x, y) => x + y, 0)] };
  }
  const p = s.gtP, count = s.gtK, radii = Array.from({ length: count }, (_x, i) => (i + 1) * p);
  const coefficients = radii.map((r) => r * r / 6), pi = coefficients.reduce((x, y) => x + y, 0);
  return { model: helpers.spiralModel(s), constant: 0, pi, coefficients, radii, angles: Array(count).fill(60),
    numbers: [p, count, ...radii, 2, 6, 60, 360, 27, pi] };
}
function answerValue(text) {
  const normalized = norm(text), terms = normalized.split('+');
  return terms.reduce((value, term) => value + (term.endsWith('π') ? Number(term.slice(0, -1) || 1) * Math.PI : Number(term)), 0);
}

for (const id of ids) {
  test(id + ': 구조·원본 장면·기본 상태·범위가 결속된다', () => {
    const scene = scenes.get(id), lesson = lessons[id], { s, lab } = entered(scene);
    assert.ok(scene && lesson && scene.question && scene.steps(s).length);
    assert.deepEqual(core.validateLessonSet(lesson), { errors: [], warnings: [] });
    for (const [key, value] of Object.entries(lesson.chapters[0].start)) {
      assert.equal(value, s[key], 'actual enter default: ' + key);
      const p = lab.params[key]; assert.ok(p, 'actual parameter: ' + key);
      assert.ok(value >= p.min && value <= p.max, 'actual parameter range: ' + key);
      near((value - p.min) / p.step, Math.round((value - p.min) / p.step), 'parameter step: ' + key);
    }
    for (const chapter of lesson.chapters) {
      assert.ok(chapter.length >= 8 && chapter.length <= 15);
      for (const cue of chapter.cues) {
        assert.ok(core.plainLen(cue.say) <= 40, 'caption stays short before browser wrapping');
        for (const [key, value] of Object.entries(cue.to || {})) assert.ok(lab.params[key] && value >= lab.params[key].min && value <= lab.params[key].max, 'animated parameter range: ' + key);
      }
    }
  });

  test(id + ': 독립 기하 계산이 원본 계산·자막 수·최종 답과 일치한다', () => {
    const { s } = state(id, 0), result = independent(id, s), M = result.model;
    const expected = result.constant + result.pi * Math.PI;
    near(answerValue(lessons[id].answer), expected, 'independent final answer');
    if (id === 'sw-center') {
      near(M.Lc, expected, 'center path length');
      M.segs.forEach((piece, i) => near(piece.len, result.edgeLengths[i], 'straight piece'));
      M.arcs.forEach((arc, i) => near(arc.deg, result.angles[i], 'arc angle'));
    } else if (id.startsWith('sw-')) {
      near(M.area, expected, 'swept area');
      if (id === 'sw-inside') {
        near(M.hole, result.hole, 'inner side'); near(M.outerRing, result.pieces[2], 'ring'); near(M.corner4, result.pieces[3], 'four corner remnants');
      } else {
        near(M.rectArea, result.constant, 'rectangle area'); near(M.secArea, result.pi * Math.PI, 'corner area');
        M.rects.forEach((piece, i) => near(piece.len * piece.w, result.pieces[i], 'rectangle piece'));
        M.secs.forEach((sector, i) => near(sector.deg, result.angles[i], 'exterior angle'));
      }
    } else {
      near(M.area.n / M.area.d, result.pi, 'sector coefficient sum');
      M.secs.forEach((sector, i) => {
        near(sector.R, result.radii[i], 'sector radius'); near(sector.deg, result.angles[i], 'sector angle');
        near(sector.area.n / sector.area.d, result.coefficients[i], 'sector area');
      });
    }
    const allowed = result.numbers;
    for (const chapter of lessons[id].chapters) for (const cue of chapter.cues) for (const match of cue.say.matchAll(/\d+(?:\.\d+)?/g)) {
      assert.ok(allowed.some((n) => Math.abs(n - Number(match[0])) < 1e-8), 'caption number has independent meaning: ' + match[0] + ' in ' + cue.say);
    }
  });

  test(id + ': 진입·전 장·되감기에서 정답과 계산의 공개 순서를 지킨다', () => {
    const scene = scenes.get(id), cs = core.compileLesson(lessons[id]), finalCue = cs.cues.at(-1);
    const samples = new Set([0, cs.length, finalCue.at - .001, finalCue.at]);
    for (const cue of cs.cues) { samples.add(cue.at); if (cue.at) samples.add(cue.at - .001); if (cue.dur) { samples.add(cue.at + cue.dur / 2); samples.add(cue.at + cue.dur); } }
    for (const t of samples) {
      const result = frame(id, t), all = norm(result.texts.map((x) => x.text).concat([JSON.stringify(result.view)]));
      assert.equal(all.includes(norm(lessons[id].answer)), t >= finalCue.at, 'final answer at t=' + t);
      const text = result.texts.map((x) => x.text).join('|');
      if (id === 'sw-inside') {
        if (result.s.swRead < 1) assert.doesNotMatch(text, /2 × 2/, 'middle dimensions are not yet explained');
        if (result.s.swRead < 5) assert.doesNotMatch(text, /1×1|90°/, 'corner pieces are not yet explained');
        if (result.s.swRead < 7) assert.doesNotMatch(text, /4 − π/, 'corner result is not yet explained');
      } else if (id.startsWith('sw-')) {
        if (result.s.swRead < 1) assert.doesNotMatch(text, /(?:^|\|)= \d+|\d+ × \d+/, 'piece calculations are not yet explained');
        if (result.s.swRead < 3) assert.equal(result.texts.some((x) => /^(90|120)°$/.test(x.text)), false, 'corner angle not yet explained');
        if (result.s.swRead < 4) assert.doesNotMatch(text, /360°/, 'angle sum not yet explained');
        if (result.s.swRead < 5) assert.doesNotMatch(text, /π/, 'circle result not yet explained');
      } else {
        const M = independent(id, result.s).model;
        M.secs.forEach((sector, i) => {
          const ref = id === 'gt-spiral' ? 'S' + i : sector.id;
          const labels = result.texts.filter((x) => x.options.ref === ref).map((x) => x.text);
          if (i >= result.s.gtRead) assert.equal(labels.length, 0, 'unexplained sector labels');
          if (i >= result.s.gtCalc) assert.equal(labels.some((x) => x.includes('π')), false, 'unexplained sector calculation');
        });
      }
    }
    const initial = state(id, 0), end = state(id, cs.length);
    initial.s.lessonEntry = true; initial.s.lessonOn = false; end.s.lessonEntry = true; end.s.lessonOn = false;
    assert.deepEqual(drawing(scene, end.s, end.lab), drawing(scene, initial.s, initial.lab), 'entry ignores stale final/reveal state');
    const replay = core.stateAt(cs, 0, { nums: end.s, sets: end.s, step: end.s.step, part: end.s.part });
    const fresh = core.stateAt(cs, 0, { nums: initial.s, sets: initial.s, step: initial.s.step, part: initial.s.part });
    assert.deepEqual(clone(replay), clone(fresh), 'replay resets every written key');
  });

  test(id + ': 직접 해 보기에서는 해설의 공개 상태를 무시한다', () => {
    const scene = scenes.get(id);
    for (const tab of ['explore', 'review', 'problem']) {
      const { s, lab } = entered(scene); lab.tab = tab; Object.assign(s, { step: 2, swT: .6, gtT: .6 });
      const before = drawing(scene, s, lab);
      Object.assign(s, { lessonOn: false, lessonEntry: false, swRead: 99, swMeasure: 2, swInner: true, swShow: true, gtRead: 99, gtCalc: 99, gtInner: true, gtShow: true });
      assert.deepEqual(drawing(scene, s, lab), before, 'manual ' + tab);
    }
  });
}

test('swept 신규 6개가 기존 4개 해설을 그대로 보존한다', () => {
  const box = { window: {} }; vm.createContext(box); vm.runInContext(read('lesson.js'), box);
  const before = box.window.APL_LESSONS['g7-circle-sector'];
  for (const id of ['sw-square', 'gt-kennel', 'gt-warehouse', 'gt-tri']) assert.deepEqual(clone(loaded.APL_LESSONS['g7-circle-sector'][id]), clone(before[id]));
  assert.equal(Object.keys(loaded.APL_LESSONS['g7-circle-sector']).length, Object.keys(before).length + 6);
});

test('swept 전체 10장면의 탐구·정리·문제 명령은 원본과 같다', () => {
  assert.equal(Object.keys(MANUAL_BASELINE).length, scenes.size);
  for (const [id, scene] of scenes) assert.equal(manualDigest(scene), MANUAL_BASELINE[id], id + ': manual drawing/view/focus');
});

test('그림의 치수와 계산이 각각의 자막 시작 시점에 나타난다', () => {
  const checks = [
    ['sw-rect', 16.5, '폭 2 cm'], ['sw-rect', 21, '= 8'], ['sw-tri', 16.5, '폭 2 cm'],
    ['sw-tri', 34, '60°'], ['sw-tri', 38.5, '120°'], ['sw-center', 22, '90°'],
    ['sw-inside', 21, '2 × 2'], ['sw-inside', 43, '1×1'], ['sw-inside', 57, '4 − π'],
    ['gt-hex', 4.5, '120°'], ['gt-hex', 14, 'r = 9−6 = 3 m'], ['gt-spiral', 17, 'r = 3+3 = 6 cm'], ['gt-spiral', 27, 'r = 6+3 = 9 cm']
  ];
  for (const [id, t, text] of checks) {
    assert.equal(frame(id, t - .001).texts.some((x) => x.text === text), false, id + ': before ' + text);
    assert.equal(frame(id, t).texts.some((x) => x.text === text), true, id + ': caption matches ' + text);
  }
});
