// basic 추가5장면·7해설: 원본 결속, 독립 기하, 공개 시점, 재생/재진입, 수동3탭 회귀.
// 실행: node --test apmath/playground/next/tools/lessons.g7-circle-sector-basic-more.test.mjs
// 이 파일의 draw명령 기록은 코드 근거이며 모바일 브라우저/픽셀/터치 PASS가 아닙니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { load as loadActualLab } from './helpers/circle-lesson-runtime.mjs';

const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SCENE_DIR = path.resolve(HERE, '../labs/g7-circle-sector');
const read = (file) => fs.readFileSync(path.join(SCENE_DIR, file), 'utf8');
const SCENE_SOURCE = read('basic.js');
const json = (x) => JSON.parse(JSON.stringify(x, (_key, value) => typeof value === 'function' ? '[function]' : value));
const norm = (x) => core.normAnswer(typeof x === 'string' ? x : JSON.stringify(x));
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;

function load(source = SCENE_SOURCE, more = true) {
  const sandbox = { window: {}, document: { getElementById: () => null, createElement: () => ({}), head: { append() {} } } };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'basic.js' });
  vm.runInContext(read('lesson.js'), sandbox, { filename: 'lesson.js' });
  if (more) vm.runInContext(read('lesson-basic-more.js'), sandbox, { filename: 'lesson-basic-more.js' });
  return sandbox.window;
}
const loaded = load();
const scenes = new Map(loaded.APL_CS_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s]));
const ids = ['1101', '1207', '1607', '1210', 'x01'];
const entries = ids.flatMap((id) => core.lessonList(loaded.APL_LESSONS['g7-circle-sector'][id]).map((lesson, k) => ({ id, k, lesson, key: id + ':' + k })));

function entered(scene) {
  const s = { step: 0, part: null, playing: false };
  const lab = { s, params: {}, board: { kind: 'figure' }, tab: 'explore', invalidate() {}, _buildReview() {} };
  scene.enter(s, lab);
  return { s, lab };
}
function state(e, time, baseState) {
  const { s, lab } = entered(scenes.get(e.id));
  if (baseState) Object.assign(s, baseState);
  const cs = core.compileLesson(e.lesson), value = core.stateAt(cs, time, { nums: s, sets: s, step: s.step, part: s.part });
  Object.assign(s, value.nums, value.sets, { step: value.step, part: value.part, lessonOn: true, lessonEntry: false });
  lab.tab = e.lesson.tab || 'explore';
  return { s, lab, cs };
}
// 실제 Canvas 픽셀을 대신하지 않습니다. 원본 draw 호출·수치·글자만 기록합니다.
function drawing(scene, s, lab) {
  const commands = [], texts = [];
  const record = (method, args) => commands.push([method, json(args)]);
  const xy = (p, y) => typeof p === 'number' ? { x: p, y } : Array.isArray(p) ? { x: p[0], y: p[1] } : p;
  const b = {
    kind: 'figure', W: 390, H: 640, insets: { top: 0, left: 0, right: 0, bottom: 60 }, thumb: false, pad: .07,
    focus: json(scene.focus(s)), _P: xy,
    get k() { return Math.min(this.W * (1 - 2 * this.pad) / (this.focus.x[1] - this.focus.x[0]), (this.H - this.insets.bottom) * (1 - 2 * this.pad) / (this.focus.y[1] - this.focus.y[0])); },
    toS(p, y) { p = xy(p, y); return { x: this.W / 2 + (p.x - (this.focus.x[0] + this.focus.x[1]) / 2) * this.k, y: (this.H - this.insets.bottom) / 2 + (p.y - (this.focus.y[0] + this.focus.y[1]) / 2) * this.k }; },
    toW(x, y) { return { x: (x - this.W / 2) / this.k + (this.focus.x[0] + this.focus.x[1]) / 2, y: (y - (this.H - this.insets.bottom) / 2) / this.k + (this.focus.y[0] + this.focus.y[1]) / 2 }; }
  };
  for (const method of ['arc', 'seg', 'circle', 'poly', 'path', 'point', 'angle', 'ticks', 'right', 'handle', 'text', 'stext']) b[method] = (...args) => {
    record(method, args);
    if (method === 'text') texts.push({ text: String(args[1]), at: args[0], options: args[2] || {} });
    if (method === 'stext') texts.push({ text: String(args[2]), options: args[3] || {} });
    if ((method === 'point' || method === 'handle') && args.at(-1)?.label) texts.push({ text: String(args.at(-1).label), options: args.at(-1) });
  };
  const view = scene.view(s, lab);
  scene.draw(b, s, view, lab);
  const finite = (x) => {
    if (typeof x === 'number') assert.ok(Number.isFinite(x), scene.id + ': finite draw value');
    else if (x && typeof x === 'object') Object.values(x).forEach(finite);
  };
  finite(commands);
  return { commands, texts: json(texts), view: json(view), focus: b.focus, emphasis: b.emph || null };
}
function frame(e, time) { const { s, lab } = state(e, time); return { ...drawing(scenes.get(e.id), s, lab), s }; }
function allText(f) { return f.texts.map((x) => x.text).concat(JSON.stringify(f.view)).join('|'); }
function manualDigest(scene) {
  const frames = [];
  for (const [tab, step, t] of [['explore', 0, 0], ['explore', 0, .26], ['explore', 0, .62], ['explore', 0, 1], ['review', 0, 0], ['review', 1, 0], ['review', 3, .38], ['review', 20, 1], ['problem', 0, 0]]) {
    const { s, lab } = entered(scene); lab.tab = tab; Object.assign(s, { step, ['b' + scene.id + '_t']: t });
    frames.push({ ...drawing(scene, s, lab), question: call(scene.question, s), steps: scene.steps(s), answer: scene.problem.answer(s) });
  }
  return crypto.createHash('sha256').update(JSON.stringify(frames)).digest('hex');
}

// 수정 전 basic-before-more-lessons.js의 18장면×9상태. 원본 탐구/정리/문제 draw/view/focus/질문/풀이/답입니다.
const MANUAL_BASELINE = {
  "1101": "d10fc02d02e41ac524b4fac8ebe384f1880e6ebfa197dc6a45e1ae78c7641879",
  "1102": "2b9d8acec85961d420af3b40ad46442047654f94cf11177736e8158a9c7570b1",
  "1103": "e483f3c30353a8c8186084480fec4ccb47f23d8e6c585f89a7908b1629e493cf",
  "1104": "367a2d3ff5d06b2944d16c345c90a8762e6113d4a7675bade5a5ca9aa8ceb1fc",
  "1105": "970e1ee6ef9d41a32636f1d4f23832625d7193a2807995557c94889906b161dd",
  "1106": "bd859cf26480989126dfdc5107f41726115ff8bb76f80d51b582a43974f43925",
  "1207": "59fb439d01402efe6e1fde41dcf6b952ba7bfab75a54d7ed4b04f633d7cdc57e",
  "1209": "3883f0b55153ded017fa70140ff39126e7d2a8f855fb275d6c2baad74a22b309",
  "1210": "e7d7e8586e693d21423f4f09e18c79d725df78a18843abbeaebe80a711926232",
  "1607": "44735749b0b9f93d57b9be411ab26ac7a2797a8aef21e55d690dd2be28427f4c",
  "1609": "d38650bd968e379047c748b0bcb86b99c61e135928288c52a896664830d2c91c",
  "1610": "f174ded297f4d1bb7b5b165f3a6c52b6fce92e838bf3eb96c401ef8f5090b07d",
  "1719": "d0105804da34d2e58f226f9430135e34c5089074dc9b237c033b5cd717704bd6",
  "1807": "f61838bdf6aae7c8d9094a3ae2920bd8210dbaa23fe76485db7df499aa6666e5",
  "1808": "206ea3f10dd1baa79b9726694f4d5ae375a83e181659d2c14e8942f03826d97c",
  "1809": "0e7c5dc4b97f3348910ad13a69cf31d64cabcb6f79df8bb28d990a441e757cf6",
  "x01": "b97f131676a1e22b73d177099356e83433c7bbc386f1a724a7626c2b33be9c32",
  "x02": "e577234b64e325474cc71d126882284462230bb8f627274659e7910ee88df171"
};

const near = (a, b, why, eps = 1e-8) => assert.ok(Math.abs(a - b) < eps, why + ': ' + a + ' ~= ' + b);
const polar = (r, degrees) => [r * Math.cos(degrees * Math.PI / 180), r * Math.sin(degrees * Math.PI / 180)];
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const area = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const coefficient = (text) => {
  const m = String(text).match(/(\d+(?:\.\d+)?)?π(?:\/(\d+))?/);
  assert.ok(m, 'numeric pi text: ' + text);
  return Number(m[1] || 1) / Number(m[2] || 1);
};
const readout = (scene, s, lab, label) => scene.view(s, lab).readouts.find((x) => x.label === label).value;

for (const id of ids) test(id + ': 실제 validator·소스 상태 결속·허용 범위', () => {
  const data = loaded.APL_LESSONS['g7-circle-sector'][id], scene = scenes.get(id), initial = entered(scene);
  assert.deepEqual(core.validateLessonSet(data), { errors: [], warnings: [] });
  for (const lesson of core.lessonList(data)) {
    for (const [key, value] of Object.entries(lesson.chapters[0].start)) {
      assert.ok(key in initial.s, key + ' exists in real enter');
      if (initial.lab.params[key]) {
        assert.equal(value, initial.s[key], key + ' source default');
        assert.ok(value >= initial.lab.params[key].min && value <= initial.lab.params[key].max, key + ' source range');
      }
    }
    for (const chapter of lesson.chapters) for (const cue of chapter.cues) {
      for (const key of Object.keys(cue.set || {})) assert.ok(key in initial.s, 'actual set state ' + key);
      for (const [key, value] of Object.entries(cue.to || {})) {
        assert.ok(key in initial.s, 'actual numeric state ' + key);
        if (initial.lab.params[key]) assert.ok(value >= initial.lab.params[key].min && value <= initial.lab.params[key].max, key + ' motion range');
        else assert.equal(key, 'b1210_link', 'only declared relation animation is not a slider');
      }
    }
  }
});

for (const e of entries) {
  test(e.key + ': 진입·모든 cue·보간·끝에서 정답 공개를 검사한다', () => {
    const cs = core.compileLesson(e.lesson), last = cs.cues.filter((x) => x.say).at(-1).at;
    const samples = new Set([0, last - .001, last, cs.length]);
    for (const cue of cs.cues) { samples.add(cue.at); if (cue.at) samples.add(cue.at - .001); if (cue.to && cue.dur) { samples.add(cue.at + cue.dur / 2); samples.add(cue.at + cue.dur); } }
    for (const t of samples) {
      const f = frame(e, t), text = allText(f);
      assert.equal(f.s['b' + e.id + '_show'], t >= last, 'final state t=' + t);
      assert.equal(!!f.view.status, t >= last, 'result status t=' + t);
      if (['1101', '1207', '1607'].includes(e.id)) {
        assert.deepEqual(f.view.parts, [], 'no verdictParts before/after playback');
        assert.equal(/정답/.test(text), t >= last, 'choice answer t=' + t);
        if (t < last) assert.doesNotMatch(text, /옳음|옳지 않음|정답 [①②③④⑤]/);
      } else assert.equal(norm(text).includes(norm(e.lesson.answer)), t >= last, 'numeric answer t=' + t);
      assert.ok(f.commands.some(([method]) => ['arc', 'seg', 'poly', 'path'].includes(method)), 'geometry exists');
    }
    for (const tab of ['explore', 'review']) {
      const first = state(e, 0), end = state(e, cs.length);
      Object.assign(first.s, { lessonOn: false, lessonEntry: true }); Object.assign(end.s, { lessonOn: false, lessonEntry: true });
      first.lab.tab = end.lab.tab = tab;
      assert.deepEqual(drawing(scenes.get(e.id), first.s, first.lab), drawing(scenes.get(e.id), end.s, end.lab), tab + ' clean reentry');
      assert.equal(call(scenes.get(e.id).question, first.s), call(scenes.get(e.id).question, end.s), 'same question after reentry');
    }
  });
  test(e.key + ': 재생·되감기·다른 해설에서 돌아와도 같은 상태를 만든다', () => {
    const scene = scenes.get(e.id), cs = core.compileLesson(e.lesson), initial = state(e, 0), final = state(e, cs.length);
    for (const time of [0, cs.length / 2, cs.length]) {
      const direct = state(e, time), replay = state(e, time, final.s);
      assert.deepEqual(drawing(scene, direct.s, direct.lab), drawing(scene, replay.s, replay.lab), 'rewind to ' + time);
    }
    const { s, lab } = entered(scene); lab.tab = 'review'; Object.assign(s, { lessonEntry: true, lessonOn: false });
    const before = drawing(scene, s, lab), playing = frame(e, .9);
    assert.notDeepEqual(playing.commands.concat([playing.emphasis]), before.commands.concat([before.emphasis]), 'first second changes actual drawing or emphasis');
    if (e.id === 'x01') for (const other of entries.filter((x) => x.id === 'x01')) {
      const end = state(other, core.compileLesson(other.lesson).length), switched = state(e, 0, end.s);
      assert.deepEqual(drawing(scene, initial.s, initial.lab), drawing(scene, switched.s, switched.lab), other.key + ' -> ' + e.key);
    }
  });
}

test('1101: 지름 최대·현과 호·반원의 두 영역은 별도 기하 계산과 실제 그림에 맞다', () => {
  const e = entries.find((x) => x.id === '1101'), scene = scenes.get(e.id);
  for (let r = 3; r <= 9; r++) for (let theta = 20; theta <= 340; theta += 10) {
    const P = polar(r, 20), Q = polar(r, 20 + theta), chord = distance(P, Q);
    assert.ok(chord <= 2 * r + 1e-10, 'no chord longer than diameter');
    if (theta === 180) near(chord, 2 * r, 'diameter equality');
    else assert.ok(chord < 2 * r, 'strictly shorter non-diameter');
  }
  const half = frame(e, 39), ordinary = frame(e, 25);
  const segment = (f) => f.commands.find(([method, args]) => method === 'path' && args[1].fill === 'green')[1][0];
  const atHalf = segment(half), atOrdinary = segment(ordinary);
  near(area(atHalf), area([[0, 0], ...atHalf]), 'semicircle sector and segment occupy equal area');
  assert.ok(area([[0, 0], ...atOrdinary]) > area(atOrdinary), 'non-semicircle sector includes the extra triangle');
  assert.ok(half.texts.some((x) => x.text === '부채꼴 = 활꼴'));
  assert.doesNotMatch(allText(frame(e, 38.999)), /부채꼴 = 활꼴/, 'coincidence appears with its explanation');
  const named = frame(e, 48);
  assert.ok(named.texts.some((x) => x.text === '호 PQ'));
  assert.ok(named.texts.some((x) => x.text === '현 PQ'));
  const { s } = entered(scene);
  assert.match(scene.problem.answer(s), /^②/);
  const question = call(scene.question, { ...s, lessonEntry: true });
  for (const option of ['①', '②', '③', '④', '⑤']) assert.ok(question.includes(option), 'all original options visible');
  assert.doesNotMatch(question, /정답|→ 옳|옳음|옳지 않음/);
});

test('1207: 반례의 두 현은 독립 좌표 거리로6/12이며 각3배와 다르다', () => {
  const e = entries.find((x) => x.id === '1207'), scene = scenes.get(e.id);
  const f = frame(e, 62), { s } = f, r = s.b1207_r, alpha = s.b1207_al, beta = s.b1207_be;
  assert.equal(alpha, 60); assert.equal(beta, 180);
  const a = distance(polar(r, 20), polar(r, 20 + alpha)), b = distance(polar(r, 200), polar(r, 200 + beta));
  near(a, 6, 'equilateral chord'); near(b, 12, 'diameter'); near(b / a, 2, 'chord ratio'); near(beta / alpha, 3, 'angle ratio');
  for (let radius = 3; radius <= 9; radius++) {
    near(distance(polar(radius, 20), polar(radius, 80)), radius, 'all supported radii:60° chord=r');
    near(distance(polar(radius, 200), polar(radius, 380)), 2 * radius, 'all supported radii:180° chord=2r');
  }
  const c50 = distance(polar(6, 20), polar(6, 70)), c100 = distance(polar(6, 200), polar(6, 300));
  assert.ok(c100 < 2 * c50, 'original50°/100° chord ratio also differs from2');
  const initial = entered(scene), view = scene.view(initial.s, initial.lab);
  assert.match(view.status.text, /2倍|2/);
  assert.match(scene.problem.answer(initial.s), /^③/);
  assert.doesNotMatch(allText(frame(e, 53.499)), /현 6 cm/, 'small chord value not early');
  assert.ok(frame(e, 53.5).texts.some((x) => x.text === '현 6 cm'));
  assert.doesNotMatch(allText(frame(e, 57.999)), /지름 12 cm/, 'diameter value not early');
  assert.ok(frame(e, 58).texts.some((x) => x.text === '지름 12 cm'));
  assert.doesNotMatch(allText(frame(e, 61.999)), /각 3배 · 현 2배/);
  assert.ok(frame(e, 61.999).texts.some((x) => x.text === '각 3배 · 현 2배') === false, 'ratio not until final chapter');
  assert.ok(frame(e, 62).texts.some((x) => x.text === '각 3배 · 현 2배'));
});

test('1207: 실제 Board의 두 각도 애니메이션은 원본5°눈금을 지켜 소수각도를 노출하지 않는다', async () => {
  const lab = await loadActualLab(); lab.go('1207');
  const lesson = core.lessonList(lab.def.lessons['1207'])[0], cs = core.compileLesson(lesson);
  const keys = ['b1207_al', 'b1207_be'];
  for (const key of keys) assert.equal(lab.params[key].step, 5, key + ': 원본 controls 눈금');
  const motions = cs.cues.filter((cue) => keys.some((key) => cue.to && key in cue.to));
  assert.equal(motions.length, 2, '같은 각으로 맞추기와60°/180°반례 만들기');
  const base = { nums: { ...lab.s }, sets: { ...lab.s }, step: lab.s.step, part: lab.s.part };
  for (const motion of motions) {
    for (const key of keys.filter((key) => key in motion.to)) assert.equal(motion.snap, lab.params[key].step, key + ': 재생 눈금이 실제 controls와 같음');
    const samples = new Set([motion.at, motion.at + .001, motion.at + motion.dur - .001, motion.at + motion.dur]);
    for (let i = 1; i < motion.dur * 10; i++) samples.add(motion.at + i / 10);
    for (const time of samples) {
      const current = core.stateAt(cs, time, base);
      Object.assign(lab.s, current.nums, current.sets, { step: current.step, part: current.part, lessonOn: true, lessonEntry: false, playing: false, dragging: true });
      lab.tab = cs.tab;
      const labels = lab.draw().texts.filter((text) => /^\d+(?:\.\d+)?°$/.test(text));
      assert.equal(labels.length, 2, '두 실제 중심각 라벨 t=' + time);
      for (const text of labels) {
        assert.match(text, /^\d+°$/, '부동소수 각도 문자열 없음 t=' + time);
        assert.equal(Number(text.slice(0, -1)) % 5, 0, '실제 라벨은5°눈금 t=' + time);
      }
      assert.deepEqual(labels.map((text) => Number(text.slice(0, -1))).sort((a, b) => a - b), keys.map((key) => lab.s[key]).sort((a, b) => a - b), '자막 상태와 두 각 라벨이 같음 t=' + time);
    }
  }
});

test('1607: 모든 허용각에서 등현과 삼각형 부등식·호/넓이 비2를 독립 검산한다', () => {
  const e = entries.find((x) => x.id === '1607'), scene = scenes.get(e.id);
  for (let r = 3; r <= 9; r++) for (let phi = 10; phi <= 85; phi += 5) {
    const A = polar(r, 110), B = polar(r, 110 + phi), C = polar(r, 110 + 2 * phi);
    const AB = distance(A, B), BC = distance(B, C), AC = distance(A, C);
    near(AB, BC, 'same central angles give equal chords');
    assert.ok(AC < AB + BC, 'strict triangle inequality');
    assert.ok(AC < 2 * BC, 'false choice③');
    const smallRadians = phi * Math.PI / 180, bigRadians = 2 * phi * Math.PI / 180;
    near(r * bigRadians / (r * smallRadians), 2, 'arc ratio');
    near((r * r * bigRadians / 2) / (r * r * smallRadians / 2), 2, 'sector area ratio');
  }
  const { s } = entered(scene);
  assert.match(scene.problem.answer(s), /^③/);
  assert.doesNotMatch(allText(frame(e, 19.999)), /80°/);
  assert.ok(frame(e, 20).texts.some((x) => x.text === '80°'));
  assert.doesNotMatch(allText(frame(e, 42.999)), /AB \+ BC > AC/);
  assert.ok(frame(e, 43).texts.some((x) => x.text === 'AB + BC > AC'));
  assert.doesNotMatch(allText(frame(e, 52.999)), /AC < 2 × BC/);
  assert.ok(frame(e, 53).texts.some((x) => x.text === 'AC < 2 × BC'));
});

test('1210: 반지름·면적에서 구한 호는 원호의 독립 수치 적분과 일치한다', () => {
  const e = entries.find((x) => x.id === '1210'), scene = scenes.get(e.id), { s, lab } = entered(scene);
  const r = s.b1210_r, theta = s.b1210_th, N = 2400;
  const pts = Array.from({ length: N + 1 }, (_, i) => polar(r, theta * i / N));
  const polygonArea = area([[0, 0], ...pts]), arcLength = pts.slice(1).reduce((sum, p, i) => sum + distance(p, pts[i]), 0);
  const originalS = coefficient(readout(scene, s, lab, '넓이 S')) * Math.PI;
  const originalL = coefficient(readout(scene, s, lab, '호의 길이 l')) * Math.PI;
  near(originalS, 27 * Math.PI, 'given area'); near(2 * originalS / r, 6 * Math.PI, 'independent inversion');
  near(polygonArea, originalS, 'actual sector boundary area', .0001);
  near(arcLength, originalL, 'actual curved path length', .00001);
  near(2 * polygonArea / r, arcLength, 'independently approximated S=½rl', .00001);
  assert.match(scene.problem.answer(s), /6\\pi/);
  for (let radius = 3; radius <= 12; radius++) for (let degrees = 10; degrees <= 350; degrees += 5) {
    Object.assign(s, { b1210_r: radius, b1210_th: degrees });
    const S = coefficient(readout(scene, s, lab, '넓이 S')), l = coefficient(readout(scene, s, lab, '호의 길이 l'));
    near(2 * S / radius, l, 'all real parameter-grid coefficients');
  }
  const marks = [[10, '호와 넓이: 원의 같은 비율 k'], [14.5, 'S = πr² × k'], [14.5, 'l = 2πr × k'], [19, 'S/l = (πr² × k)/(2πr × k)'], [23, 'S/l = r/2'], [28, 'S = ½ × r × l'], [33, '27π = ½ × 9 × l'], [38, 'l = 27π × 2 ÷ 9']];
  for (const [time, text] of marks) {
    assert.ok(frame(e, time).texts.some((x) => x.text === text), 'caption equation appears: ' + text);
    assert.ok(!frame(e, time - .001).texts.some((x) => x.text === text), 'equation absent before explanation: ' + text);
  }
  for (const t of [0, 14.5, 23, 38, 48, 53]) assert.doesNotMatch(frame(e, t).texts.map((x) => x.text).join('|'), /120°|1\/3|81π|18π/, 'unused central angle and whole-circle numbers remain hidden');
});

test('x01: 실제 모인 조각이 원을 덮고 각·호·넓이의 합은 독립 합산과 같다', () => {
  for (const e of entries.filter((x) => x.id === 'x01')) {
    const f = frame(e, 30), sectors = f.commands.filter(([m, a]) => m === 'arc' && a[4]?.sector && a[4]?.fill).map(([, a]) => a);
    const R = Math.max(...sectors.map((a) => a[1])), arcs = sectors.filter((a) => a[1] === R); // 작은 중심각 표시는 부채꼴 조각에서 제외합니다.
    assert.equal(arcs.length, 4);
    const n = f.s.bx01_n, r = f.s.bx01_r, angles = arcs.map((a) => Math.abs(a[3] - a[2]));
    near(angles.reduce((sum, x) => sum + x, 0), 2 * Math.PI, 'arc angles add to one full turn');
    for (const a of arcs) { near(a[0][0], 0, 'shared center x'); near(a[0][1], 0, 'shared center y'); near(a[1], R, 'rigid equal radius'); }
    // 네 각 구간의 중앙은 서로 다른 사분면에 있고 경계만 공유합니다.
    assert.equal(new Set(arcs.map((a) => ((Math.round(((a[2] + a[3]) / 2) / (Math.PI / 2)) % 4) + 4) % 4)).size, n);
    const angleSum = angles.reduce((sum, x) => sum + x * 180 / Math.PI, 0);
    const arcSum = angles.reduce((sum, x) => sum + r * x, 0);
    const areaSum = angles.reduce((sum, x) => sum + r * r * x / 2, 0);
    near(angleSum, 360, 'angle sum'); near(arcSum, 12 * Math.PI, 'arc sum'); near(areaSum, 36 * Math.PI, 'area sum');
    const sum = e.k === 0 ? angleSum : e.k === 1 ? arcSum / Math.PI : areaSum / Math.PI;
    assert.equal(norm(e.lesson.answer), e.k === 0 ? sum + '°' : sum + 'π');
    const { s, lab } = state(e, 12), before = json(s);
    assert.equal(scenes.get('x01').tick(s, .5, lab), false, 'scene tick yields to lesson t');
    assert.deepEqual(json(s), before, 'no second animation overwrites playback');
    if (e.k !== 0) for (const time of [0, 5, 16, 25]) assert.ok(!frame(e, time).texts.some((x) => x.text === '90°'), 'other concept does not reveal the angle lesson');
  }
  const scene = scenes.get('x01');
  for (let n = 2; n <= 8; n++) for (let r = 3; r <= 9; r++) {
    const { s, lab } = entered(scene); Object.assign(s, { bx01_n: n, bx01_r: r });
    near(coefficient(readout(scene, s, lab, '조각 하나의 호')) * n, 2 * r, 'original arc/n source');
    near(coefficient(readout(scene, s, lab, '조각 하나의 넓이')) * n, r * r, 'original area/n source');
  }
});

test('모든 기존 해설을 보존하고 원본18장면×9수동상태가 전후 동등하다', () => {
  const original = load(SCENE_SOURCE, false).APL_LESSONS['g7-circle-sector'];
  for (const [id, data] of Object.entries(original)) assert.deepEqual(json(loaded.APL_LESSONS['g7-circle-sector'][id]), json(data), id + ' existing lesson');
  assert.equal(Object.keys(loaded.APL_LESSONS['g7-circle-sector']).length, Object.keys(original).length + 5);
  assert.equal(entries.length, 7);
  assert.equal(scenes.size, 18); assert.equal(Object.keys(MANUAL_BASELINE).length, 18);
  for (const [id, scene] of scenes) assert.equal(manualDigest(scene), MANUAL_BASELINE[id], id);
  for (const id of ids) for (const tab of ['explore', 'review', 'problem']) {
    const scene = scenes.get(id), { s, lab } = entered(scene); lab.tab = tab; s.step = 3;
    const before = drawing(scene, s, lab);
    Object.assign(s, { lessonOn: false, lessonEntry: false, ['b' + id + '_read']: 99, ['b' + id + '_show']: true, ['b' + id + '_kind']: 2, ['b' + id + '_link']: 1 });
    assert.deepEqual(drawing(scene, s, lab), before, id + '/' + tab + ' ignores leftover lesson flags');
  }
});

test('모든 자막 숫자는 원본 조건 또는 별도 계산에서 도출되고 최종 식이 맞다', () => {
  for (const e of entries) {
    const { s } = state(e, 0);
    let values;
    if (e.id === '1101') values = [180]; // 정의 해설에서는 반원의 평각 이외의 계산값을 쓰지 않습니다.
    if (e.id === '1207') {
      const r = s.b1207_r, a = s.b1207_al, b = s.b1207_be;
      values = [r, a, b, b / a, 1, 60, 180, 180 / 60, r + r, (r + r) / r, (180 - 60) / 2];
    }
    if (e.id === '1607') values = [s.b1607_ph, s.b1607_ph + s.b1607_ph, 2];
    if (e.id === '1210') {
      const r = s.b1210_r, radians = s.b1210_th * Math.PI / 180;
      const S = r * r * radians / 2 / Math.PI, l = 2 * S / r;
      values = [r, S, 1, 2, l];
    }
    if (e.id === 'x01') {
      const r = s.bx01_r, n = s.bx01_n;
      values = [r, n, 2, 360 / n, 360, 2 * r, r * r];
    }
    for (const chapter of e.lesson.chapters) for (const cue of chapter.cues) if (cue.say) {
      for (const token of cue.say.matchAll(/\d+(?:\.\d+)?/g)) assert.ok(values.some((v) => Math.abs(v - Number(token[0])) < 1e-8), e.key + ': independent number ' + token[0] + ' in ' + cue.say);
    }
  }
});
