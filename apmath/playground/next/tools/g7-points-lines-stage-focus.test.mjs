/** Stage size/inset changes must not make a fresh scene differ from re-entry.
 * Uses the production Board, Shell._measureFocus and all 24 scene renderers.
 * --baseline <SHA> runs the same contracts against the former unit source.
 * Actual browser screenshots separately verify fonts and student readability.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const baselineIndex = process.argv.indexOf('--baseline');
const baseline = baselineIndex < 0 ? null : process.argv[baselineIndex + 1];
const plain = value => JSON.parse(JSON.stringify(value));
const canon = { x: [-5, 5], y: [-4, 4] };
const sizes = [
  { name: 'pc', W: 1039, H: 656, right: 16, bottom: 56 },
  { name: 'tablet-portrait', W: 820, H: 461, right: 0, bottom: 58 },
  { name: 'tablet-landscape', W: 683, H: 488, right: 16, bottom: 56 },
  { name: 'mobile', W: 390, H: 411, right: 0, bottom: 58 },
  { name: 'small-mobile', W: 360, H: 387, right: 0, bottom: 58 }
];

function load() {
  const element = () => ({ style: { setProperty() {} }, dataset: {}, classList: { add() {}, remove() {}, toggle() {} }, append() {}, setAttribute() {}, addEventListener() {} });
  const document = { getElementById: () => null, createElement: element, createTextNode: text => ({ textContent: text }), addEventListener() {}, documentElement: element(), head: element() };
  const scope = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout,
    requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1,
    location: { search: '', hash: '', pathname: '/labs/g7-points-lines.html' },
    localStorage: { getItem() { return null; }, setItem() {} },
    getComputedStyle: () => ({ getPropertyValue: key => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#111111' }),
    matchMedia: () => ({ matches: false }), addEventListener() {} };
  scope.window = scope;
  const context = vm.createContext(scope);
  const read = relative => baseline && relative.includes('/g7-points-lines/')
    ? execFileSync('git', ['show', `${baseline}:${relative}`], { cwd: root, encoding: 'utf8' })
    : fs.readFileSync(path.join(root, relative), 'utf8');
  for (const name of ['apl-core.js', 'apl-board.js', 'apl-shell.js']) vm.runInContext(read(`apmath/playground/next/kit/${name}`), context, { filename: name });
  for (const name of ['common', 'solids', 'lines', 'mid', 'angles']) vm.runInContext(read(`apmath/playground/next/labs/g7-points-lines/${name}.js`), context, { filename: `${name}.js` });
  const scenes = context.APL_PL_GROUPS.flatMap(g => g.scenes);

  function create(id, size, initial = {}) {
    const stateStack = [], canvasState = { globalAlpha: 1, font: '16px sans-serif', textAlign: 'center', textBaseline: 'middle' };
    canvasState.measureText = value => {
      const size = Number(/([\d.]+)px/.exec(canvasState.font)?.[1] || 16);
      return { width: [...String(value)].reduce((sum, ch) => sum + size * (ch.charCodeAt(0) >= 0x1100 ? 1 : .6), 0) };
    };
    canvasState.save = () => stateStack.push({ ...canvasState });
    canvasState.restore = () => Object.assign(canvasState, stateStack.pop() || {});
    const ctx = new Proxy(canvasState, { get(target, key) { return key in target ? target[key] : (...args) => {
      for (const n of args) if (typeof n === 'number') assert.ok(Number.isFinite(n), `${String(key)}: finite drawing coordinates`);
    }; } });
    const board = new context.APLab.Board({ width: size.W, height: size.H, getContext: () => ctx }, { kind: 'figure', pad: .02, interactive: false });
    board.resize(initial.W || size.W, initial.H || size.H);
    board.setInsets({ top: 0, right: initial.right || 0, bottom: initial.bottom || 0, left: 0 });
    const lab = { scene: scenes.find(s => s.id === id), board, tab: 'explore', s: { step: 1, revealed: false, playing: false }, params: {}, refs: {}, invalidate() {}, _buildReview() {}, measurements: 0, maxMeasureDepth: 0 };
    let depth = 0;
    lab._measureFocus = function (scene) {
      lab.measurements++; depth++; lab.maxMeasureDepth = Math.max(lab.maxMeasureDepth, depth);
      assert.ok(depth <= 2, 'stage fitting must never recursively measure itself without a guard');
      try { return context.APLab.Lab.prototype._measureFocus.call(lab, scene); } finally { depth--; }
    };
    lab.enter = (next = id) => {
      lab.scene = scenes.find(s => s.id === next); lab.tab = 'explore';
      lab.s.step = 1; lab.s.revealed = false; lab.s.playing = false;
      board.setFocus(plain(canon), true); board.setPanes(null); board.onPanDrag = null;
      lab.scene.enter(lab.s, lab);
      board.setFocus(lab.scene.focus(lab.s) || lab._measureFocus(lab.scene), true);
    };
    const records = [];
    for (const method of ['path', 'seg', 'poly', 'circle', 'arc', 'point', 'handle']) {
      const original = board[method];
      board[method] = function (...args) {
        if (!this._bbox) records.push({ method, args: plain(args), focus: plain(this.focus), k: this.k, ox: this.ox, oy: this.oy });
        return original.apply(this, args);
      };
    }
    const text = board._text;
    board._text = function (x, y, value, options, ...rest) {
      if (!this._bbox) records.push({ method: 'text', x, y, text: String(value), options: plain(options || {}) });
      return text.call(this, x, y, value, options, ...rest);
    };
    lab.draw = () => {
      const v = lab.scene.view(lab.s, lab); records.length = 0;
      board.begin(); lab.scene.draw(board, lab.s, v, lab); board.end();
      return { commands: plain(records), focus: plain(board.focus), zoom: board.zoom, panX: board.panX, panY: board.panY };
    };
    lab.stabilize = () => { board.resize(size.W, size.H); board.setInsets({ top: 0, right: size.right, bottom: size.bottom, left: 0 }); return lab.draw(); };
    lab.enter();
    return lab;
  }
  return { scenes, create };
}

const runtime = load();

for (const id of ['ck1', 'ck2', 'bs']) test(`${id}: late toolbar/size layout has the same actual drawing as fresh re-entry`, () => {
  for (const size of sizes) {
    const lab = runtime.create(id, size, { H: size.H + 34 });
    lab.draw();
    const first = lab.stabilize();
    lab.enter(); const reselected = lab.draw();
    assert.deepEqual(first, reselected, `${id}/${size.name}: the same original shape and labels must not shift when reselected`);
    lab.enter(id === 'ck1' ? 'b1-2' : 'ck1'); lab.draw();
    lab.enter(id); const returned = lab.draw();
    assert.deepEqual(first, returned, `${id}/${size.name}: another scene must not supply this scene's initial framing`);
  }
});

test('all 24 points/lines scenes settle identically before/after re-entry in the five actual stage sizes', () => {
  assert.equal(runtime.scenes.length, 24);
  for (const scene of runtime.scenes) for (const size of sizes) {
    const lab = runtime.create(scene.id, size);
    const first = lab.stabilize(); lab.enter(); const again = lab.draw();
    assert.deepEqual(first, again, `${scene.id}/${size.name}: settled stage geometry must be entry independent`);
    assert.ok(first.commands.length > 0, 'stability cannot be obtained by removing the original picture');
    assert.ok(!lab.s.revealed && !lab.s.playing, 'fitting must not reveal a solution or start playback');
  }
});

test('refitting on resize preserves user parameters, question choices, reveal/step and pan/zoom', () => {
  for (const id of ['b1-2', 'm-ratio', 'ck1', 'ck2', 'bs']) {
    const lab = runtime.create(id, sizes[3]); lab.stabilize();
    if (lab.scene.__sv) {
      const q = lab.scene.__sv(lab.s); q.seed = 8;
      if (id.startsWith('ck')) { q.h = 7; q.m = 23; }
      lab.draw(); q.pk = 'saved-choice'; q.pi = 2;
    } else { lab.s.plSeed = 9; lab.draw(); lab.s.plPick = { key: 'saved-choice', idx: 2 }; }
    lab.tab = 'review'; lab.s.step = 2; lab.s.revealed = true; lab.s.playing = false;
    const state = plain(lab.s);
    lab.board.zoom = 1.7; lab.board.panX = 19; lab.board.panY = -23;
    lab.board.resize(820, 461); lab.board.setInsets({ top: 18, right: 16, bottom: 66, left: 7 });
    lab.draw();
    assert.deepEqual(plain(lab.s), state, `${id}: fitting must restore all learner state`);
    assert.equal(lab.tab, 'review');
    assert.deepEqual([lab.board.zoom, lab.board.panX, lab.board.panY], [1.7, 19, -23]);
    assert.equal(lab.maxMeasureDepth, 1, `${id}: fitting measurement must be guarded`);
  }
});

test('stable stage frames do not refit on each draw or when a learner pans/zooms', () => {
  for (const scene of runtime.scenes) {
    const lab = runtime.create(scene.id, sizes[4]); lab.stabilize();
    const count = lab.measurements;
    for (let i = 0; i < 4; i++) lab.draw();
    lab.board.zoom = 1.4; lab.board.panX = -31; lab.board.panY = 17; lab.draw();
    assert.equal(lab.measurements, count, `${scene.id}: an unchanged available area must not trigger repeated measurement`);
    assert.deepEqual([lab.board.zoom, lab.board.panX, lab.board.panY], [1.4, -31, 17]);
  }
});

test('each available-area dimension can change independently without stale framing', () => {
  for (const id of ['b1-2', 'ck2']) for (const patch of [{ W: 820 }, { H: 461 }, { top: 24 }, { right: 29 }, { bottom: 77 }, { left: 17 }]) {
    const lab = runtime.create(id, sizes[3]); lab.stabilize();
    if ('W' in patch || 'H' in patch) lab.board.resize(patch.W || lab.board.W, patch.H || lab.board.H);
    else lab.board.setInsets(patch);
    const resized = lab.draw(); lab.enter();
    assert.deepEqual(resized, lab.draw(), `${id}/${JSON.stringify(patch)}: stage refresh equals direct entry`);
  }
});

test('the mobile ray problem separates point names from the first line caption', () => {
  for (const [W,H] of [[360,291],[390,314]]) {
    const size={name:'mobile-problem',W,H,right:0,bottom:58};
    const lab=runtime.create('l-ray',size);lab.tab='problem';
    const commands=lab.stabilize().commands;
    const caption=commands.find(x=>x.method==='text'&&x.text==='직선 AB = 직선 BA');
    const names=commands.filter(x=>x.method==='text'&&['A','B'].includes(x.text));
    assert.equal(names.length,2);assert.ok(caption);
    const c=lab.board.annotationSize(caption.text,caption.options);
    for(const n of names){
      const m=lab.board.annotationSize(n.text,n.options);
      assert.ok(n.y+m.height/2+4<=caption.y-c.height/2,`${W}px: point ${n.text} is above the line caption`);
    }
    assert.equal(lab.s.lrA,3);assert.equal(lab.s.lrB,8);assert.equal(lab.s.revealed,false);
  }
});


test('the mobile three-lines problem keeps algebraic givens away from drag handles', () => {
  for (const [W,H] of [[360,291],[390,314]]) {
    const size={name:'mobile-problem',W,H,right:0,bottom:58};
    const lab=runtime.create('th',size);lab.tab='problem';
    const commands=lab.stabilize().commands;
    const givens=commands.filter(x=>x.method==='text'&&['(x+35)°','60°','(4x+60)°'].includes(x.text));
    assert.equal(givens.length,3);
    for(const label of givens){
      const m=lab.board.annotationSize(label.text,label.options);
      const rect={left:label.x-m.width/2,right:label.x+m.width/2,top:label.y-m.height/2,bottom:label.y+m.height/2};
      for(const handle of lab.board.handles){
        const dx=Math.max(rect.left-handle.x,0,handle.x-rect.right),dy=Math.max(rect.top-handle.y,0,handle.y-rect.bottom);
        assert.ok(Math.hypot(dx,dy)>=6.5*lab.board.hr+4,`${W}px: ${label.text} is clear of ${handle.id}`);
      }
    }
    const q=lab.scene.__sv(lab.s);
    assert.equal(q.a,40);assert.equal(q.bb,60);assert.equal(lab.s.revealed,false);
    assert.equal(lab.scene.__spec.problem(q).choices.find(x=>x.ok).v,5);
  }
});

test('midpoint part lengths remain below the complete AB dimension at mobile sizes', () => {
  for (const [W,exploreH,problemH] of [[360,387,291],[390,411,314]]) {
    for(const tab of ['explore','problem','review']) for(const plSeed of [0,1]) {
      const size={name:'midpoint-mobile',W,H:tab==='problem'?problemH:exploreH,right:0,bottom:58};
      const lab=runtime.create('m-mid',size);lab.tab=tab;
      for(let mL=6;mL<=20;mL+=2)for(let mC=2;mC<=mL-2;mC+=2){
        Object.assign(lab.s,{mL,mC,plSeed,step:1,revealed:false});
        const commands=lab.stabilize().commands;
        const parts=commands.filter(x=>x.method==='text'&&/^[○△]/.test(x.text));
        assert.equal(parts.length,4);
        const dimension=commands.find(x=>x.method==='seg'&&x.args[0].x===0&&x.args[1].x===12&&x.args[0].y<0&&x.args[0].y===x.args[1].y);
        assert.ok(dimension);
        const lineY=lab.board.toS(dimension.args[0]).y;
        for(const label of parts){
          const metrics=lab.board.annotationSize(label.text,label.options);
          assert.ok(lineY+1.7+5<=label.y-metrics.height/2,`${W}/${tab}/${plSeed}/${mL}/${mC}: ${label.text} is below the AB dimension, with visible space`);
        }
        const total=commands.find(x=>x.method==='text'&&/^AB =/.test(x.text));
        assert.ok(total.y-lab.board.annotationSize(total.text,total.options).height/2>=3,'AB caption stays inside the canvas');
        if(tab==='problem'){
          assert.ok(parts.every(x=>/^[○△]$/.test(x.text)),'the problem keeps part lengths concealed');
          const requested=commands.find(x=>x.method==='text'&&x.text===(plSeed?'AB = ?':'MN = ?'));
          assert.ok(requested,'the requested total is not revealed by the layout change');
        }
        assert.equal(lab.s.mL,mL);assert.equal(lab.s.mC,mC);assert.equal(lab.s.revealed,false);
      }
    }
  }
});
