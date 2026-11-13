import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the real learning navigation and persistence code before the native
// 250 ms URL debounce can run: this is the reload race observed in Chromium.
function fixture() {
  const storage = new Map(), location = { search: '', hash: '#s=a1-rect%400' };
  const A = { G7Shorts: {
    'g7-area/a2-para': (_lab, s) => [{ duration: 9, model: { w: s.a1W, h: s.a1H } }]
  } };
  const context = { window: { APLab: A }, location, URLSearchParams,
    sessionStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
    history: { state: null, replaceState: (_s, _t, url) => { location.hash = url; } },
    clearTimeout() {}, cancelAnimationFrame() {}, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-g7-learning.js', import.meta.url), 'utf8'), context);
  const list = [{ id: 'a1-rect', gi: 0 }, { id: 'a2-para', gi: 1 }];
  const lab = { id: 'g7-area', index: 0, list, scene: list[0], groups: [{}, {}],
    s: { a1W: 6, a1H: 4, playing: false }, tab: 'explore', teach: false,
    params: { a1W: { value: 6, step: 1 }, a1H: { value: 4, step: 1 } }, def: {},
    board: { focus: { x: [-1, 1], y: [-1, 1] }, zoom: 1, panX: 0, panY: 0 },
    _buildPanel() {}, invalidate() {} };
  const learning = Object.create(A.G7Learning.Learning.prototype);
  Object.assign(learning, { lab, player: { state: 'idle' }, records: new Map(),
    defaultState: { a1W: 6, a1H: 4, playing: false }, mode: 'explore', active: null,
    choice: 0, elapsed: 0, generation: 0, storageKey: 'learning-test',
    layout() {}, refresh() {}, schedule() {},
    originalGo(i, options) {
      lab.index = i; lab.scene = lab.list[i];
      Object.assign(lab.s, options.params || {});
      lab._hashT = 1; // Native URL update is still pending when go() returns.
    } });
  learning.current = learning.makeRecord();
  learning.records.set('a2-para@1', {
    explore: { s: { a1W: 9, a1H: 5, playing: false }, tab: 'explore' },
    mode: 'paused', choice: 0, elapsed: 3.8, visited: true, touched: 1
  });
  return { learning, lab, location, storage };
}

test('returning to a paused scene commits its URL and current input before immediate reload', () => {
  const { learning, lab, location, storage } = fixture();
  learning.go(1);
  const url = new URLSearchParams(location.hash.slice(1));
  assert.equal(url.get('s'), 'a2-para@1');
  assert.equal(url.get('a1W'), '9'); assert.equal(url.get('a1H'), '5');
  assert.equal(learning.mode, 'paused'); assert.equal(learning.elapsed, 3.8);
  assert.equal(learning.active.model.w, 9); assert.equal(lab.s.a1H, 5);
  const records = new Map(JSON.parse(storage.get('learning-test')).records);
  const resumed = records.get(url.get('s'));
  assert.equal(resumed.mode, 'paused'); assert.equal(resumed.elapsed, 3.8);
  assert.equal(String(resumed.explore.s.a1W), url.get('a1W'));
  assert.equal(String(resumed.explore.s.a1H), url.get('a1H'));
});

test('an explicit new input wins over a saved paused instance and is persisted on navigation', () => {
  const { learning, lab, location, storage } = fixture();
  learning.go(1, { params: { a1W: 11, a1H: 3 } });
  const url = new URLSearchParams(location.hash.slice(1));
  assert.equal(url.get('s'), 'a2-para@1');
  assert.equal(url.get('a1W'), '11'); assert.equal(url.get('a1H'), '3');
  assert.equal(learning.active, null); assert.equal(learning.mode, 'ready');
  assert.equal(lab.s.a1W, 11);
  const saved = new Map(JSON.parse(storage.get('learning-test')).records).get('a2-para@1');
  assert.equal(saved.mode, 'ready'); assert.equal(saved.elapsed, 0);
  assert.equal(saved.explore.s.a1W, 11);
});
