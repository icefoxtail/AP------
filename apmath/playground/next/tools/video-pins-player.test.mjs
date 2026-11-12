// Run the real Player, DOM helper, KaTeX and timeline with a small DOM/clock adapter.
// CSS selection checks below verify responsive rules, not browser pixel layout.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url), core = require('../kit/apl-video-core.js');
const katex = require('../kit/vendor/katex/katex.min.js');
const source = name => fs.readFileSync(new URL(`../kit/${name}`, import.meta.url), 'utf8');
const playerSource = source('apl-player.js'), domSource = source('apl-core.js'), css = source('apl-video.css');

function mediaMatches(query, viewport) {
  const { width, height, reduced = false } = viewport;
  return query.split(/\s+and\s+/).every(term => {
    const match = term.match(/^\((min|max)-(width|height):\s*(\d+)px\)$/);
    if (match) return match[1] === 'min' ? viewport[match[2]] >= +match[3] : viewport[match[2]] <= +match[3];
    if (/orientation:\s*portrait/.test(term)) return height >= width;
    if (/orientation:\s*landscape/.test(term)) return width > height;
    if (/prefers-reduced-motion:\s*reduce/.test(term)) return reduced;
    if (/pointer:\s*coarse/.test(term)) return width <= 1024;
    return false;
  });
}
function simpleMatch(element, selector) {
  if (!element || element.nodeType !== 1 || /::|:has\(|:focus-visible/.test(selector)) return false;
  let reject = false;
  selector = selector.replace(/:not\(([^)]+)\)/g, (_, inner) => { if (simpleMatch(element, inner)) reject = true; return ''; });
  if (reject) return false;
  const tag = selector.match(/^[a-z][\w-]*/i)?.[0];
  if (tag && element.tagName.toLowerCase() !== tag.toLowerCase()) return false;
  for (const match of selector.matchAll(/\.([\w-]+)/g)) if (!element.classList.contains(match[1])) return false;
  for (const match of selector.matchAll(/\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)) {
    const value = element.getAttribute(match[1]);
    if (value == null || match[2] != null && value !== match[2]) return false;
  }
  return true;
}
function matches(element, selector) {
  const tokens = selector.trim().replace(/\s*>\s*/g, ' > ').split(/\s+/);
  let index = tokens.length - 1, node = element;
  if (!simpleMatch(node, tokens[index--])) return false;
  while (index >= 0) {
    if (tokens[index] === '>') { index--; node = node.parentNode; if (!simpleMatch(node, tokens[index--])) return false; }
    else { const token = tokens[index--]; do { node = node.parentNode; } while (node && !simpleMatch(node, token)); if (!node) return false; }
  }
  return true;
}
class Element {
  constructor(tag) {
    this.nodeType = 1; this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
    this.attributes = new Map(); this.dataset = {}; this.className = ''; this.handlers = new Map(); this.replaceCount = 0;
    this.style = { setProperty(key, value) { this[key] = value; } };
    this.classList = {
      contains: name => this.className.split(/\s+/).includes(name),
      add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
      remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
      toggle: (name, force) => { const on = force ?? !this.classList.contains(name); this.classList[on ? 'add' : 'remove'](name); return on; }
    };
  }
  get hidden() { return this.attributes.has('hidden'); }
  set hidden(value) { if (value) this.attributes.set('hidden', ''); else this.attributes.delete('hidden'); }
  get childElementCount() { return this.children.length; }
  get firstElementChild() { return this.children[0] || null; }
  get offsetWidth() { return 200; }
  get offsetTop() { return 0; }
  setAttribute(name, value) {
    if (name === 'class') this.className = String(value);
    else if (name.startsWith('data-')) this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
    else this.attributes.set(name, String(value));
  }
  getAttribute(name) {
    if (name === 'class') return this.className;
    if (name.startsWith('data-')) return this.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] ?? null;
    return this.attributes.get(name) ?? null;
  }
  removeAttribute(name) { this.attributes.delete(name); }
  get innerHTML() { return this._html || ''; }
  set innerHTML(value) { this.replaceChildren(); this._html = String(value); }
  get textContent() { return this._text ?? this.innerHTML.replace(/<[^>]*>/g, ''); }
  set textContent(value) { this.replaceChildren(); this._text = String(value); }
  append(...children) { for (const child of children) { child.remove?.(); child.parentNode = this; this.children.push(child); } }
  prepend(...children) { for (const child of [...children].reverse()) this.insertBefore(child, this.firstElementChild); }
  insertBefore(child, before) { child.remove?.(); const at = before ? this.children.indexOf(before) : this.children.length; child.parentNode = this; this.children.splice(at, 0, child); }
  replaceChildren(...children) { this.replaceCount++; for (const child of this.children) child.parentNode = null; this.children = []; this._html = ''; this._text = undefined; this.append(...children); }
  remove() { if (this.parentNode) { const list = this.parentNode.children; list.splice(list.indexOf(this), 1); this.parentNode = null; } }
  addEventListener(name, fn) { const list = this.handlers.get(name) || []; list.push(fn); this.handlers.set(name, list); }
  dispatch(name, extra = {}) { for (const fn of this.handlers.get(name) || []) fn({ target: this, isTrusted: false, ...extra }); }
  matches(selector) { return selector.split(',').some(s => matches(this, s)); }
  querySelectorAll(selector) { const out = []; for (const child of this.children) if (child.nodeType === 1) { if (child.matches(selector)) out.push(child); out.push(...child.querySelectorAll(selector)); } return out; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
}
const chapter = (title, cues, first = false) => ({ title, length: 10, ...(first ? { start: { x: 0 } } : {}), cues });
function lessons() {
  const A = { label: 'A식', title: '식을 이어 보기', tab: 'review', summary: '양변에 같은 계산을 해요.', task: '다른 수를 넣고 같은 방법으로 풀어 보세요.',
    chapters: [chapter('조건과 식', [
      { at: 0, say: '주어진 조건을 확인해요.', step: 0 }, { at: .5, to: { x: 1 }, dur: 2 },
      { at: 4, say: '조건을 $x+2=5$로 나타내요.', pin: true }, { at: 7, say: '양변에서 2를 빼 $x=5-2$예요.', pin: true }
    ], true), chapter('계산과 결론', [
      { at: 0, say: '계산하면 $x=3$이에요.', pin: true }, { at: 4, say: '$y=x+1$에 대입하면 $y=4$예요.', pin: true }
    ])] };
  const B = { ...structuredClone(A), label: 'B식', chapters: [chapter('새 조건', [
    { at: 0, say: '$z=\\frac{1}{2}$에서 시작해요.', pin: true, step: 0 }, { at: .5, to: { x: 1 }, dur: 2 }, { at: 5, say: '분모가 같은 식을 연결해요.' }
  ], true), chapter('다른 계산', [{ at: 0, say: '$2z=1$이에요.', pin: true }, { at: 5, say: '처음 조건과 같은지 확인해요.' }])] };
  const plain = structuredClone(A); plain.label = '기본'; for (const c of plain.chapters) for (const cue of c.cues) delete cue.pin;
  return [A, B, plain];
}
function setup(width = 390, height = 844, reduced = false) {
  const viewport = { width, height, reduced }, frames = new Map(), timers = new Map(); let id = 0;
  const document = new Element('document'); document.body = new Element('body'); document.documentElement = new Element('html'); document.append(document.documentElement); document.documentElement.append(document.body);
  document.createElement = tag => new Element(tag); document.createTextNode = text => ({ nodeType: 3, textContent: text });
  const storage = new Map(), sandbox = { document, console, URLSearchParams, katex, performance: { now: () => 5000 },
    location: { search: '', hash: '', pathname: '/fixture.html' }, history: { replaceState() {} },
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    requestAnimationFrame: fn => { const key = ++id; frames.set(key, fn); return key; }, cancelAnimationFrame: key => frames.delete(key),
    setTimeout: fn => { const key = ++id; timers.set(key, fn); return key; }, clearTimeout: key => timers.delete(key),
    matchMedia: query => ({ get matches() { return mediaMatches(query, viewport); }, addEventListener() {} }), addEventListener() {}, scrollTo() {} };
  sandbox.window = sandbox; vm.createContext(sandbox); vm.runInContext(domSource, sandbox); sandbox.APLab.videoCore = core;
  vm.runInContext(playerSource, sandbox, { filename: 'apl-player.js' });
  const h = sandbox.APLab.h, ui = { stage: h('div', { class: 'apl-stage' }), canvasWrap: h('div', { class: 'apl-canvas-wrap' }), panelInner: h('div', { class: 'apl-panel-inner' }), main: h('div', { class: 'apl-main' }), panes: { explore: h('div', {}) } };
  document.body.append(ui.main); ui.main.append(ui.stage, ui.panelInner); ui.stage.append(ui.canvasWrap); ui.panelInner.append(ui.panes.explore);
  const counters = { resize: 0, ink: 0, panel: 0, invalidate: 0 };
  const lab = { id: 'pins-fixture', teach: false, index: 0, tab: 'explore', s: { x: 0, step: 0, part: null }, ui,
    list: [{ id: 'one', title: '한 장면' }, { id: 'short', title: '쇼츠' }, { id: 'empty', title: '직접 탐구' }],
    def: { lessons: { one: lessons() }, videos: { short: { title: '짧은 영상', length: 10, start: { x: 0 }, summary: '같은 값을 비교해요.', task: '값을 바꾸어 다시 확인해 보세요.', cues: [{ at: 0, say: '그림을 움직여요.', to: { x: 1 }, dur: 3 }, { at: 5, say: '변화를 확인해요.' }] } } },
    params: { x: { min: 0, max: 1, step: .01 } }, board: { resize() { counters.resize++; return true; } },
    invalidate() { counters.invalidate++; }, _sizeInk() { counters.ink++; }, _buildPanel() { counters.panel++; }, _saveHashSoon() {}, _tabAvailable: () => true,
    goScene(i) { this.index = i; this.tab = 'explore'; }, setTab(tab) { this.tab = tab; }, setTeach(on) { this.teach = on; }, togglePanel() { ui.main.classList.remove('panel-off'); }
  };
  const player = new sandbox.APLab.Player(lab);
  const flush = () => { const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(5000)); };
  return { player, lab, document, counters, viewport, flush, requestFrame: sandbox.requestAnimationFrame };
}
function pinTex(player) { return player.ui.pins.children.map(row => row.innerHTML.match(/<annotation encoding="application\/x-tex">([^<]*)<\/annotation>/)?.[1]); }
function start(player, index = 0, lesson = 0) { assert.equal(player.play(index, lesson), true); player.pause(); }

test('pin region is built before captions, stays absent for existing lessons/videos and uses the existing math renderer', () => {
  const { player: p } = setup();
  assert.equal(p.ui.pins.hidden, true); assert.equal(p.ui.pins.children.length, 0); assert.equal(p.ui.bar.children[0], p.ui.pins); assert.equal(p.ui.bar.children[1], p.ui.cap);
  start(p, 0, 2); p.seek(14);
  assert.equal(p.ui.pins.hidden, true); assert.equal(p.ui.bar.classList.contains('has-pins'), false); assert.equal('pins' in p.cs, false);
  start(p, 1); p.seek(8); assert.equal(p.ui.pins.hidden, true); assert.equal(p.cs.kind, 'video');
  start(p, 0, 1); assert.deepEqual(pinTex(p), ['z=\\frac{1}{2}']);
  assert.match(p.ui.pins.children[0].innerHTML, /class="katex"/); assert.match(p.ui.pins.children[0].innerHTML, /<math/);
  assert.equal(p.rate, 1.5);
});

test('pins derive from current time, keep only three formulas and do not rebuild or append on unchanged frames', () => {
  const { player: p } = setup(); start(p);
  assert.equal(p.ui.pins.hidden, true); p.seek(3.9); assert.deepEqual(pinTex(p), []);
  p.seek(4); assert.deepEqual(pinTex(p), ['x+2=5']);
  const first = p.ui.pins.children[0], replacements = p.ui.pins.replaceCount;
  p.seek(4.5); p.seek(5.9); p._syncUi(); assert.equal(p.ui.pins.replaceCount, replacements); assert.equal(p.ui.pins.children[0], first);
  p.seek(14); assert.deepEqual(pinTex(p), ['x=3', 'y=x+1', 'y=4']);
  assert.deepEqual(p.ui.pins.children.map(row => row.classList.contains('latest')), [false, false, true]);
  p.ui.range.value = '250'; p.ui.range.dispatch('input'); assert.equal(p.t, 5); assert.deepEqual(pinTex(p), ['x+2=5']);
  p.seek(0); assert.equal(p.ui.pins.hidden, true); assert.equal(p.ui.pins.children.length, 0); assert.equal(p.ui.bar.classList.contains('has-pins'), false);
});

test('replay, another lesson, direct exploration and scene changes cannot retain future formulas', () => {
  const { player: p, lab } = setup(); start(p); p.seek(14);
  p.ui.replay.dispatch('click'); p.pause(); assert.equal(p.t, 0); assert.deepEqual(pinTex(p), []);
  p.seek(14); start(p, 0, 1); assert.deepEqual(pinTex(p), ['z=\\frac{1}{2}']);
  start(p, 0, 2); assert.equal(p.ui.pins.hidden, true); assert.deepEqual(pinTex(p), []);
  start(p); p.seek(14); p.ui.close.dispatch('click');
  assert.equal(p.state, 'idle'); assert.equal(p.cs, null); assert.equal(p.ui.pins.hidden, true); assert.deepEqual(pinTex(p), []); assert.equal(lab.tab, 'explore');
  start(p); p.seek(14); lab.goScene(2); assert.equal(p.state, 'idle'); assert.deepEqual(pinTex(p), []); assert.equal(p.ui.entry.hidden, true);
});

test('phone lesson end card retains its final figure while clearing pins; desktop and shorts retain their existing exit policy', () => {
  const { player: p, lab, document } = setup(); start(p); p.seek(14); p.finish();
  assert.equal(p.state, 'ended'); assert.equal(p.ui.bar.dataset.mode, 'end'); assert.equal(p.ui.end.hidden, false);
  assert.equal(p.ui.bar.parentNode, lab.ui.stage); assert.equal(document.body.classList.contains('apl-vid'), true); assert.equal(lab.s.lessonOn, true); assert.equal(lab.tab, 'review');
  assert.equal(p.ui.pins.hidden, true); assert.deepEqual(pinTex(p), []); assert.equal(p.ui.bar.classList.contains('has-pins'), false);
  p.ui.endAgain.dispatch('click'); p.pause(); assert.equal(p.t, 0); assert.deepEqual(pinTex(p), []);
  p.seek(14); p.finish(); p.ui.endGo.dispatch('click'); assert.equal(p.state, 'idle'); assert.equal(lab.tab, 'explore'); assert.equal(lab.s.lessonOn, undefined);
  const desktop = setup(1440, 900); start(desktop.player); desktop.player.finish();
  assert.equal(desktop.player.ui.bar.parentNode, desktop.lab.ui.panelInner); assert.equal(desktop.document.body.classList.contains('apl-vid'), false);
  start(p, 1); p.finish(); assert.equal(p.ui.bar.parentNode, lab.ui.panelInner); assert.equal(document.body.classList.contains('apl-vid'), false);
});

test('pin changes coalesce board/ink size updates and reduced-motion seeks use the same pin timeline', () => {
  const { player: p, counters, flush } = setup(); start(p); flush(); const before = { ...counters };
  p.seek(4); p.seek(7); p.seek(14); assert.equal(counters.resize, before.resize);
  flush(); assert.equal(counters.resize, before.resize + 1); assert.equal(counters.ink, before.ink + 1);
  p.seek(14.5); flush(); assert.equal(counters.resize, before.resize + 1);
  p.seek(0); flush(); assert.equal(counters.resize, before.resize + 2);
  const reduced = setup(768, 1024, true).player; reduced.play(0, 0);
  assert.equal(reduced.stepMode, true); assert.equal(reduced.state, 'paused'); assert.deepEqual(pinTex(reduced), []);
  reduced.skip(1); assert.deepEqual(pinTex(reduced), ['x+2=5']); reduced.skip(1); assert.deepEqual(pinTex(reduced), ['x+2=5', 'x=5-2']); reduced.skip(-1); assert.deepEqual(pinTex(reduced), ['x+2=5']);
});

test('closing an ended lesson measures the canvas after rebuilt controls render, without a ResizeObserver retry', () => {
  const { player: p, lab, flush, requestFrame } = setup(1440, 900);
  start(p); p.seek(14); p.finish(); flush(); flush();
  // Shell panel reconstruction temporarily removes the control dock. Its next
  // render restores it. The final host size can equal the last observed size,
  // so an extra ResizeObserver callback is not a reliable repair mechanism.
  let hostHeight = 566, bitmapHeight = 566, renderPending = false;
  const measured = [];
  lab._buildPanel = () => { hostHeight = 844; };
  lab.invalidate = () => {
    if (renderPending) return;
    renderPending = true;
    requestFrame(() => { renderPending = false; hostHeight = 566; });
  };
  lab.board.resize = () => {
    const previous = bitmapHeight;
    measured.push(hostHeight); bitmapHeight = hostHeight;
    return previous !== bitmapHeight;
  };
  p.close();
  assert.equal(hostHeight, 844, 'panel rebuild has temporarily removed the dock');
  flush();
  assert.equal(hostHeight, 566, 'scheduled render restores the controls');
  assert.equal(bitmapHeight, hostHeight, 'explicit player resize uses the restored host height');
  assert.deepEqual(measured, [566], 'the temporary dock-free height is never copied to the bitmap');
  assert.equal(p.state, 'idle'); assert.equal(lab.tab, 'explore');
  assert.equal(lab.s.lessonOn, undefined); assert.equal(p.rate, 1.5);
  flush();
  assert.equal(bitmapHeight, hostHeight, 'correct aspect persists without a resize observer');
});

test('closing mid-lesson with visible pins reschedules the pending resize after the control-restoration render', () => {
  const { player: p, lab, flush, requestFrame } = setup(1440, 900);
  start(p); p.seek(14); flush(); flush();
  assert.equal(p.ui.pins.children.length, 3, 'the lesson has visible pinned formulas before close');
  let hostHeight = 650, bitmapHeight = 650, renderPending = false;
  const measured = [];
  lab._buildPanel = () => { hostHeight = 844; };
  lab.invalidate = () => {
    if (renderPending) return;
    renderPending = true;
    requestFrame(() => { renderPending = false; hostHeight = 566; });
  };
  lab.board.resize = () => {
    const previous = bitmapHeight;
    measured.push(hostHeight); bitmapHeight = hostHeight;
    return previous !== bitmapHeight;
  };
  p.close();
  assert.equal(p.ui.pins.hidden, true); assert.equal(p.ui.pins.children.length, 0);
  flush();
  assert.equal(hostHeight, 566, 'the exploration controls have rendered');
  assert.equal(bitmapHeight, hostHeight, 'clearing pins must not resize before the restored controls');
  assert.deepEqual(measured, [566], 'one final resize replaces the earlier pin-removal request');
  assert.equal(p.state, 'idle'); assert.equal(lab.s.lessonOn, undefined); assert.equal(p.rate, 1.5);
  flush();
  assert.equal(bitmapHeight, hostHeight, 'no ResizeObserver retry is needed');
});

// Parse stylesheet block nesting and select the actual responsive declarations.
// This intentionally makes no claim about glyph measurement, clipping or pixels.
function cssRules(input, media = []) {
  const rules = []; let start = 0;
  while (start < input.length) {
    const open = input.indexOf('{', start); if (open < 0) break;
    const header = input.slice(start, open).trim(); let depth = 1, end = open + 1;
    while (end < input.length && depth) { if (input[end] === '{') depth++; if (input[end] === '}') depth--; end++; }
    const body = input.slice(open + 1, end - 1);
    if (header.startsWith('@media ')) rules.push(...cssRules(body, [...media, header.slice(7).trim()]));
    else if (!header.startsWith('@')) for (const selector of header.split(',')) rules.push({ selector: selector.trim(), media, values: Object.fromEntries(body.split(';').map(line => line.trim()).filter(Boolean).map(line => { const i = line.indexOf(':'); return [line.slice(0, i).trim(), line.slice(i + 1).trim()]; })) });
    start = end;
  }
  return rules;
}
const rules = cssRules(css.replace(/\/\*[\s\S]*?\*\//g, ''));
function styleFor(element, viewport) {
  const values = {};
  for (const rule of rules) if (rule.media.every(q => mediaMatches(q, viewport)) && matches(element, rule.selector)) Object.assign(values, rule.values);
  return values;
}
test('only portrait tablets with current pins use two columns; formula overflow stays in its own row and end cards hide pins', () => {
  const { player: p } = setup(); start(p);
  const tablet = { width: 768, height: 1024 };
  assert.equal(styleFor(p.ui.bar, tablet)['grid-template-columns'], undefined);
  assert.equal(styleFor(p.ui.pins, tablet).display, 'none');
  p.seek(14);
  for (const [width, height] of [[700, 1000], [768, 1024], [820, 1180], [1024, 1366]]) {
    const v = { width, height };
    assert.equal(styleFor(p.ui.bar, v)['grid-template-columns'], 'minmax(0, 1fr) minmax(0, 1fr)');
    assert.equal(styleFor(p.ui.pins, v)['grid-column'], '1'); assert.equal(styleFor(p.ui.cap, v)['grid-column'], '2');
    assert.equal(styleFor(p.ui.prog, v)['grid-column'], '1 / -1'); assert.equal(styleFor(p.ui.live, v)['grid-column'], '1 / -1');
  }
  for (const [width, height] of [[390, 844], [699, 1000], [844, 390], [1024, 768], [1440, 900], [1025, 1400]])
    assert.equal(styleFor(p.ui.bar, { width, height })['grid-template-columns'], undefined, `${width}×${height}: existing one-column bar`);
  const old = styleFor(p.ui.pins.children[0], tablet), latest = styleFor(p.ui.pins.children.at(-1), tablet);
  assert.equal(old['overflow-x'], 'auto'); assert.equal(old['white-space'], 'nowrap'); assert.equal(old['min-width'], '0');
  assert.equal(old.opacity, '.62'); assert.equal(latest.opacity, '1'); assert.equal(latest['font-weight'], '800');
  p.finish(); assert.equal(styleFor(p.ui.pins, tablet).display, 'none !important'); assert.equal(styleFor(p.ui.bar, tablet)['grid-template-columns'], undefined);
});
