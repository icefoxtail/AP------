// 회전체 잔여 해설의 원본 계산·상태·라벨 공개 검사. 실제 모바일 시각검수는 별도입니다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const core = require('../kit/apl-video-core.js');
const dir = new URL('../labs/g7-surface-volume/', import.meta.url);
const source = name => fs.readFileSync(new URL(name + '.js', dir), 'utf8');
function load(beforeT4) {
  const document = { documentElement: { dataset: {} }, head: { append() {} }, getElementById() { return null; }, createElement() { return {}; }, addEventListener() {}, querySelector() { return null; } };
  const ctx = vm.createContext({ window: { innerWidth: 1000, matchMedia: () => ({ matches: false }) }, document });
  for (const name of ['solid3d', 'dims', 'core', 'net', 't4', 'lesson', 'lesson-more', 'lesson-remainder-c']) {
    if (name === 't4') beforeT4?.(ctx.window.APL_SV);
    vm.runInContext(source(name), ctx, { filename: name + '.js' });
  }
  const G = ctx.window.APL_SV, scenes = ctx.window.APL_SV_GROUPS.flatMap(g => g.scenes);
  return { G, bank: ctx.window.APL_LESSONS['g7-surface-volume'], scene: id => scenes.find(s => s.id === id).sv };
}
const U = load();
const list = id => core.lessonList(U.bank[id]);
const by = (id, label) => list(id).find(l => l.label === label);
const state = (lesson, t) => {
  const compiled = core.compileLesson(lesson), at = core.stateAt(compiled, t, { nums: compiled.start, sets: {}, step: 0 });
  return { ...compiled.start, ...at.nums, ...at.sets, step: at.step ?? 0, lessonOn: true, lessonEntry: false };
};
const length = lesson => lesson.chapters.reduce((n, c) => n + c.length, 0);

for (const id of ['sv4-2', 'sv4-3', 'sv4-4']) test(id + ': original lessons preserved, distinct buttons and reset contracts', () => {
  assert.deepEqual(core.validateLessonSet(U.bank[id]).errors, []);
  assert.ok(by(id, '겉넓이') && by(id, '부피'));
  for (const lesson of list(id)) {
    const check = core.validateLesson(lesson);
    assert.deepEqual(check.errors, [], check.errors.join('\n'));
    assert.deepEqual(check.warnings, [], check.warnings.join('\n'));
    assert.ok(lesson.chapters.every(c => c.length >= 8 && c.length <= 15));
    assert.equal(state(lesson, 0).svShowV, false);
  }
});

test('sv4-2: frustum answers agree with independent lateral-area and disk-volume formulas', () => {
  const surf = by('sv4-2', '겉넓이'), vol = by('sv4-2', '부피');
  const s = state(surf, 0), r = s.s42J, R = r + 3 * s.s42K, h = 4 * s.s42K;
  const slant = Math.hypot(R - r, h);
  const expectedArea = Math.PI * ((R + r) * slant + R * R + r * r);
  const expectedVolume = Math.PI * h * (R * R + R * r + r * r) / 3;
  const scene = U.scene('sv4-2');
  assert.equal(U.G.vnum(scene.model(s).ans), expectedArea);
  assert.equal(U.G.vnum(scene.model(state(vol, 0)).ans), expectedVolume);
  assert.equal(surf.answer, '$90\\pi$'); assert.equal(vol.answer, '$84\\pi$');
  assert.ok(Math.abs(expectedArea - 90 * Math.PI) < 1e-10);
  assert.ok(Math.abs(expectedVolume - 84 * Math.PI) < 1e-10);
  for (const lesson of [surf, vol]) {
    const result = scene.check(state(lesson, 0));
    assert.ok(Math.abs(result.ans - result.model) < 1e-5, 'source integration agrees');
  }
});

test('sv4-3 and sv4-4: new volume answers use the actual fixed original conditions', () => {
  for (const [id, expectedPi] of [['sv4-3', 24], ['sv4-4', 66]]) {
    const lesson = by(id, '부피'), s = state(lesson, 0), scene = U.scene(id), m = scene.model(s);
    const independent = id === 'sv4-3'
      ? Math.PI * m.r ** 2 * (m.h1 + m.h2) / 3
      : Math.PI * (m.r ** 2 * m.hc / 3 + m.r ** 2 * m.H + 2 * m.r ** 3 / 3);
    assert.ok(Math.abs(U.G.vnum(m.ans) - independent) < 1e-10);
    assert.ok(Math.abs(independent - expectedPi * Math.PI) < 1e-10);
    assert.equal(lesson.answer, `$${expectedPi}\\pi$`);
    const checked = scene.check(s);
    assert.ok(Math.abs(checked.ans - checked.model) < 1e-5);
  }
});

test('sv4-2: changing the axis changes to the real base-axis source model and replay resets it', () => {
  const lesson = by('sv4-2', '축 바꾸기'), start = state(lesson, 0), end = state(lesson, length(lesson));
  assert.equal(start.svAxis2, 'leg'); assert.equal(end.svAxis2, 'base');
  const m = U.scene('sv4-2').model(end);
  assert.equal(m.hh, 4); assert.equal(m.a, 3); assert.equal(m.p, 3); assert.equal(m.b, 6);
  assert.equal(state(lesson, 0).s42T, 0);
});

function capturedDraw(id, s) {
  const seen = [], ops = [];
  const canvasCtx = { save() {}, restore() {}, measureText: text => ({ width: String(text).length * 7 }) };
  const b = { W: 900, H: 650, k: 40, fs: 1, _ts: () => 1, insets: { left: 0, right: 0, top: 0, bottom: 0 }, ctx: canvasCtx, font: 'sans-serif', stext(x, y, text) { seen.push(String(text)); } };
  // t4의 scene3는 모듈 로드 때 캡처되므로, 로드 전에 계측용 그림 API를 주입합니다.
  const local = load(G => {
  G.scene3 = () => {
    const d = { b, narrow: false, lessonHide: !!(s.lessonOn || s.lessonEntry) && (!s.svShowV || s.lessonEntry), cam: { sy: 0, cy: 1, sp: 0.3 },
      fs: x => x, hx: x => G.v3(x, 0, 0), P: p => ({ x: p.x, y: p.y }), px: p => ({ x: p.x, y: p.y }), rightFront: () => G.v3(1, 0, 0),
      circ(c, u, v, r) { return [c, G.add3(c, G.mul3(u, r))]; },
      fit() {}, body() { ops.push('body'); }, panel() { ops.push('panel'); }, line() {}, path() {}, right() {}, dot() {},
      areaLab(p, name, value) { seen.push(String(name)); if (value) seen.push(String(value)); },
      dim(a, z, text) { seen.push(String(text)); }, height(a, z, text) { seen.push(String(text)); }, radius(a, z, text) { seen.push(String(text)); },
      label(p, text) { seen.push(String(text)); }, edgeLab(a, z, text) { seen.push(String(text)); } };
    return d;
  };
  G.coneNet = (board, state, context, options) => { ops.push(options); return { D: G.scene3(), sn: { A: [G.v3(0, 0, 0)] } }; };
  });
  const scene = local.scene(id), m = scene.model(s);
  const C = { tab: 'review', review: true, problem: false, lesson: !!(s.lessonOn || s.lessonEntry), t: s[({ 'sv4-1': 's41T', 'sv4-2': 's42T', 'sv4-3': 's43T', 'sv4-4': 's44T' })[id]], step: s.step || 0 };
  scene.draw(b, s, m, C); return { seen, ops };
}

test('sv4-2: lesson entry draws original trapezoid and the net follows playback instead of jumping open', () => {
  const l = by('sv4-2', '겉넓이');
  const entry = capturedDraw('sv4-2', { ...state(l, 0), lessonOn: false, lessonEntry: true });
  assert.ok(entry.ops.includes('panel')); assert.ok(entry.seen.includes('높이 4'));
  assert.ok(entry.seen.includes('아랫변 6') && entry.seen.includes('윗변 3'));
  const moving = capturedDraw('sv4-2', state(l, 13));
  assert.ok(moving.ops.some(op => typeof op === 'object' && op.t > 0 && op.t < 1));
  const ready = capturedDraw('sv4-2', state(l, 24)).ops.find(op => typeof op === 'object');
  assert.equal(ready.simpleNet, false); assert.equal(ready.lessonReveal.big, true); assert.equal(ready.lessonReveal.small, false);
});

test('t4 volume labels stay hidden until their own numeric captions and reset on entry', () => {
  const double = by('sv4-3', '부피'), compound = by('sv4-4', '부피'), frustum = by('sv4-2', '부피');
  assert.ok(!capturedDraw('sv4-3', state(double, 15.1)).seen.includes('12π'));
  assert.ok(capturedDraw('sv4-3', state(double, 16.1)).seen.includes('12π'));
  const early44 = capturedDraw('sv4-4', state(compound, 16 - 0.1)).seen.join(' ');
  assert.doesNotMatch(early44, /12π|36π|18π|66π/);
  const cone44 = capturedDraw('sv4-4', state(compound, 16.1)).seen.join(' ');
  assert.match(cone44, /12π/); assert.doesNotMatch(cone44, /36π|18π|66π/);
  assert.match(capturedDraw('sv4-2', state(frustum, 23.1)).seen.join(' '), /96π/);
  assert.doesNotMatch(capturedDraw('sv4-2', state(frustum, 23.1)).seen.join(' '), /84π/);
  for (const [id, l] of [['sv4-2', frustum], ['sv4-3', double], ['sv4-4', compound]]) {
    const end = capturedDraw(id, state(l, length(l))).seen.join(' ');
    assert.ok(end.includes(l.answer.replace(/\$|\\/g, '').replace('pi', 'π')));
    assert.doesNotMatch(capturedDraw(id, { ...state(l, 0), lessonEntry: true, lessonOn: false }).seen.join(' '), /84π|24π|66π/);
  }
});

test('sv4-4 surface numbers are gated in both separated solid and final net; manual stays available', () => {
  const l = by('sv4-4', '겉넓이'), s = { ...state(l, 0), s44T: 0.5 };
  for (const t of [0.5, 1]) {
    const closed = capturedDraw('sv4-4', { ...s, s44T: t }).seen.join(' ');
    assert.doesNotMatch(closed, /15π|24π|18π|57π/);
    const cone = capturedDraw('sv4-4', { ...s, s44T: t, svSideReady: true }).seen.join(' ');
    assert.match(cone, /15π/); assert.doesNotMatch(cone, /24π|18π|57π/);
  }
  const manual = capturedDraw('sv4-4', { ...s, lessonOn: false, lessonEntry: false, s44T: 0.5 }).seen.join(' ');
  // 원래 수동 정리 화면은 simple 전개도이며, 기존처럼 숫자 해설을 강제하지 않습니다.
  assert.match(manual, /원뿔 옆면/);
});
