/** Production Board/scene contracts for the observed small clock problems.
 * Canvas commands and geometry are checked here; independent Chromium screen
 * review remains necessary for actual font rasterization and the page layout.
 * --baseline <SHA> checks the same contracts against the former scene source.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const sourcePath = 'apmath/playground/next/labs/g7-points-lines/angles.js';
const beforeAt = process.argv.indexOf('--baseline');
const before = beforeAt < 0 ? null : process.argv[beforeAt + 1];
const compareAt = process.argv.indexOf('--compare-scope');
const compare = compareAt < 0 ? null : process.argv[compareAt + 1];
const plain = x => JSON.parse(JSON.stringify(x));
const call = (x, ...args) => typeof x === 'function' ? x(...args) : x;
const modes = ['explore', 'review', 'problem'];

function canvas() {
  const stack = [], data = { globalAlpha: 1, font: '16px sans-serif', textAlign: 'center', textBaseline: 'middle' };
  data.measureText = text => {
    const size = Number(/([\d.]+)px/.exec(data.font)?.[1] || 16);
    return { width: [...String(text)].reduce((sum, ch) => sum + size * (ch.charCodeAt(0) >= 0x1100 ? 1 : .6), 0) };
  };
  data.save = () => stack.push({ ...data });
  data.restore = () => Object.assign(data, stack.pop() || {});
  const ctx = new Proxy(data, { get(target, key) {
    if (key in target) return target[key];
    return (...args) => { for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `${String(key)} must use finite coordinates`); };
  } });
  return { width: 360, height: 291, getContext: () => ctx };
}

function load(at = null) {
  const element = () => ({ dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, append() {}, setAttribute() {}, addEventListener() {} });
  const document = { getElementById: () => null, createElement: element, createTextNode: text => ({ textContent: text }), addEventListener() {}, documentElement: element(), head: element() };
  const scope = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout,
    requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1,
    location: { search: '', hash: '', pathname: '/labs/g7-points-lines.html' },
    localStorage: { getItem() { return null; }, setItem() {} },
    getComputedStyle: () => ({ getPropertyValue: key => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#111111' }),
    matchMedia: () => ({ matches: false }), addEventListener() {} };
  scope.window = scope;
  const context = vm.createContext(scope);
  for (const name of ['apl-core.js', 'apl-board.js', 'apl-shell.js']) vm.runInContext(fs.readFileSync(path.join(root, 'apmath/playground/next/kit', name), 'utf8'), context, { filename: name });
  const source = at ? execFileSync('git', ['show', `${at}:${sourcePath}`], { cwd: root, encoding: 'utf8' }) : fs.readFileSync(path.join(root, sourcePath), 'utf8');
  vm.runInContext(source, context, { filename: sourcePath });
  const scenes = context.APL_PL_GROUPS.flatMap(g => g.scenes);
  function create(id, W, H, initialBottom = 58) {
    const scene = scenes.find(s => s.id === id), b = new context.APLab.Board(canvas(), { kind: 'figure', pad: .02, interactive: false });
    const exploreH = W === 360 && H === 291 ? 387 : W === 390 && H === 309 ? 411 : H;
    b.resize(W, exploreH); b.setInsets({ top: 0, right: W >= 860 ? 16 : 0, bottom: initialBottom, left: 0 });
    const lab = { scene, board: b, tab: 'explore', s: { step: 1, revealed: false, playing: false }, params: {}, refs: {}, invalidate() {}, _buildReview() {} };
    lab._measureFocus = context.APLab.Lab.prototype._measureFocus;
    // Production g7-points-lines.html resets this canonical view on entry.
    b.setFocus({ x: [-5, 5], y: [-4, 4] }, true);
    scene.enter(lab.s, lab); b.setFocus(call(scene.focus, lab.s), true);
    const records = { circles: [], segments: [], labels: [] };
    const circle = b.circle, seg = b.seg, text = b._text;
    b.circle = function (p, r, o = {}) {
      if (!this._bbox) records.circles.push({ p: plain(p), at: this.toS(p[0] ?? p.x, p[1] ?? p.y), radius: r * this.k, options: plain(o) });
      return circle.call(this, p, r, o);
    };
    b.seg = function (p, q, o = {}) {
      if (!this._bbox) records.segments.push({ from: this.toS(p[0] ?? p.x, p[1] ?? p.y), to: this.toS(q[0] ?? q.x, q[1] ?? q.y), options: plain(o) });
      return seg.call(this, p, q, o);
    };
    b._text = function (x, y, value, o = {}, ...rest) {
      if (!this._bbox) {
        const size = (o.size || 13) * this.fs * this._ts();
        records.labels.push({ text: String(value), x, y, size, options: plain(o) });
      }
      return text.call(this, x, y, value, o, ...rest);
    };
    lab.draw = (tab = 'problem', step = 1) => {
      lab.tab = tab; lab.s.step = step;
      b.resize(W, tab === 'problem' ? H : exploreH);
      const value = scene.view(lab.s, lab);
      for (const list of Object.values(records)) list.length = 0;
      b.begin(); scene.draw(b, lab.s, value, lab); b.end();
      return { ...plain(records), W, H: b.H, bottom: b.insets.bottom, focus: plain(b.focus), value };
    };
    return lab;
  }
  return { scenes, create };
}
const runtime = load(before);
const visible = o => o.color != null && (o.alpha ?? 1) > .05 && (o.width ?? 1) > 0;
function clockContract(picture, reason) {
  const face = picture.circles.find(c => Math.abs(c.p[0] ?? c.p.x) < 1e-7 && Math.abs(c.p[1] ?? c.p.y) < 1e-7 && visible(c.options));
  assert.ok(face, `${reason}: the original clock contour must be painted`);
  assert.ok(face.radius * 2 >= 150, `${reason}: ${face.radius * 2}px clock leaves insufficient room for twelve numerals and both hands`);
  assert.ok(face.at.x - face.radius >= 0 && face.at.x + face.radius <= picture.W && face.at.y - face.radius >= 0 && face.at.y + face.radius <= picture.H - picture.bottom, `${reason}: clock contour stays above the toolbar`);
  const hands = ['h', 'm'].map(ref => picture.segments.find(s => s.options.ref === ref && visible(s.options) && !s.options.dash));
  assert.ok(hands.every(Boolean), `${reason}: both original clock hands must be painted`);
  assert.ok(Math.hypot(hands[0].to.x - hands[0].from.x, hands[0].to.y - hands[0].from.y) >= 31, `${reason}: the hour hand remains visible beyond its handle`);
  const numerals = picture.labels.filter(l => /^(?:[1-9]|1[0-2])$/.test(l.text));
  assert.equal(numerals.length, 12, `${reason}: all twelve numerals remain present`);
  for (const label of picture.labels) assert.ok(label.x >= 0 && label.x <= picture.W && label.y - label.size / 2 >= 0 && label.y + label.size / 2 <= picture.H - picture.bottom, `${reason}: ${label.text} must remain within the drawing area`);
  // Independent conservative width envelope; actual Chromium glyph metrics are
  // separately captured by the browser audit and reviewed in the screenshot.
  const box = l => ({ l: l.x - l.text.length * l.size * .32, r: l.x + l.text.length * l.size * .32, t: l.y - l.size / 2, b: l.y + l.size / 2 });
  for (let i = 0; i < numerals.length; i++) for (let j = i + 1; j < numerals.length; j++) {
    const a = box(numerals[i]), b = box(numerals[j]);
    assert.ok(!(a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t), `${reason}: numerals ${numerals[i].text}/${numerals[j].text} overlap`);
  }
  return { face, hands };
}

for (const id of ['ck1', 'ck2']) for (const [W, H] of [[390, 309], [360, 291]]) test(`${id} ${W}px first problem has a readable complete clock`, () => {
  const lab = runtime.create(id, W, H), p = lab.draw(); clockContract(p, `${id}/${W}`);
  assert.ok(!lab.s.revealed && !lab.s.playing);
  assert.ok(!p.labels.some(l => /°|=/.test(l.text)), 'the initial clock must not reveal angle values or solution calculations');
});

test('clock face, hands, problem arithmetic, and staged answers survive every hour/minute control value', () => {
  for (const id of ['ck1', 'ck2']) {
    const lab = runtime.create(id, 360, 291), q = lab.scene.__sv(lab.s), spec = lab.scene.__spec;
    for (let h = 1; h <= 12; h++) for (let m = 0; m < 60; m++) {
      q.h = h; q.m = m;
      const { face, hands } = clockContract(lab.draw(), `${id}/${h}:${m}`);
      const hour = (h % 12) * 30 + .5 * m, minute = 6 * m;
      const difference = Math.abs(hour - minute), expected = Math.min(difference, 360 - difference);
      const question = spec.problem(q), choices = question.choices.filter(c => c.ok);
      assert.equal(choices.length, 1); assert.equal(Number(choices[0].t.replace('°', '')), expected);
      for (const [i, degree, length] of [[0, hour, .42], [1, minute, .63]]) {
        const a = degree * Math.PI / 180;
        assert.ok(Math.abs(hands[i].to.x - face.at.x - Math.sin(a) * face.radius * length) < 1e-7);
        assert.ok(Math.abs(hands[i].to.y - face.at.y + Math.cos(a) * face.radius * length) < 1e-7);
      }
      assert.ok(!lab.s.revealed && !lab.s.playing);
    }
    q.h = 3; q.m = id === 'ck1' ? 39 : 20;
    const original = JSON.stringify([q.h, q.m]);
    lab.draw('review', 1);
    const final = lab.draw('review', lab.scene.steps(lab.s).length);
    assert.ok(final.labels.some(l => l.text.includes('°')), 'the final review still exposes its angle calculation');
    assert.equal(JSON.stringify([q.h, q.m]), original);
    const handles = lab.board.handles.filter(h => ['hh', 'mh'].includes(h.id));
    assert.equal(handles.length, 2, 'both original draggable hand controls remain registered');
  }
});

test('semantic negative controls reject a missing face or either missing hand despite the remaining clock ink', () => {
  for (const id of ['ck1', 'ck2']) {
    const picture = runtime.create(id, 360, 291).draw(); clockContract(picture, id);
    const noFace = plain(picture); noFace.circles.forEach(c => { c.options.alpha = 0; });
    assert.throws(() => clockContract(noFace, id), /clock contour/);
    for (const ref of ['h', 'm']) {
      const noHand = plain(picture); noHand.segments.filter(s => s.options.ref === ref).forEach(s => { s.options.alpha = 0; });
      assert.throws(() => clockContract(noHand, id), /both original clock hands/);
    }
  }
});

test('clock problem framing restores the same exploration and leaves wider or unrelated scene drawing intact', () => {
  const old = compare ? load(compare) : runtime;
  const geometry = p => plain({ circles: p.circles, segments: p.segments, labels: p.labels });
  for (const scene of runtime.scenes) for (const [W, H] of [[360, 291], [390, 309], [683, 476], [820, 530], [1040, 606]]) for (const mode of modes) {
    if (W < 560 && mode === 'problem' && ['ck1', 'ck2'].includes(scene.id)) continue;
    const current = runtime.create(scene.id, W, H), previous = old.create(scene.id, W, H);
    const actual = current.draw(mode), expected = previous.draw(mode);
    assert.deepEqual(geometry(actual), geometry(expected), `${scene.id}/${W}/${mode}: unrelated drawing must remain unchanged`);
    if (['ck1', 'ck2'].includes(scene.id)) {
      current.draw('problem');
      assert.deepEqual(geometry(current.draw(mode)), geometry(actual), `${scene.id}/${W}/${mode}: returning from the enlarged clock must restore its original framing`);
    }
  }
});
