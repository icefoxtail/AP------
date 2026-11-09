// Production scene/Board regression checks. This VM checks math and drawing commands;
// it does not replace a real browser, layout audit, or physical-device review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const arg = name => {const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const plain=x=>JSON.parse(JSON.stringify(x));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labs = path.join(root, 'labs');
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  const context = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }), createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; } }, {
    get(target, key) {
      if (key in target) return target[key];
      return (...args) => {
        for (const index of numericArgs[key] || []) assert.ok(Number.isFinite(args[index]), `${String(key)} coordinate ${index} must be finite; got ${String(args[index])}`);
      };
    },
    set(target, key, value) { target[key] = value; return true; }
  });
  return { width: 1000, height: 650, getContext: () => context };
}

async function load(baseline) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    const source=baseline && el.src==='g7-solids/t4.js' ? execFileSync('git',['show',baseline+':apmath/playground/next/labs/'+el.src],{cwd:path.resolve(root,'../../..'),encoding:'utf8'}) : fs.readFileSync(path.join(labs,el.src),'utf8');
    vm.runInContext(source, context, { filename: el.src });
    el.onload?.();
  };
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: '', search: '', pathname: '/labs/g7-solids.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  let seed = 14791;
  sandbox.Math = Object.create(Math);
  sandbox.Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-solids.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const MODULES ='));
  vm.runInContext(script, context, { filename: 'g7-solids.html' });
  ready.forEach((fn) => fn());
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.ok(definition, 'production module loader creates the lab');
  // The real shell clones scene definitions while adding group metadata.
  const list = definition.groups.flatMap((group) => group.scenes.map((scene) => ({ ...scene })));
  const board = new context.APLab.Board(canvas(), { ...definition.board, interactive: false });
  board.resize(1000, 650);
  const lab = { def: definition, list, board, index: 0, tab: 'explore', s: { ...definition.state }, params: { ...definition.params }, refs: {}, invalidate() {}, _buildReview() {}, get scene() { return this.list[this.index]; } };
  for (const [key, param] of Object.entries(lab.params)) lab.s[key] = param.value;
  context.lab = lab;
  lab._answerOpen = () => lab.s.revealed || lab.s.step >= call(lab.scene.steps, lab.s).length;
  lab._measureFocus = (scene) => {
    const box = board.measure(() => scene.draw(board, lab.s, call(scene.view, lab.s, lab), lab));
    return box ? board.fitBox(box, { margin: 0.08, px: 12 }) : null;
  };
  lab.go = (id) => {
    lab.index = list.findIndex((scene) => scene.id === id);
    assert.ok(lab.index >= 0, `scene ${id} exists`);
    lab.tab = 'explore';
    Object.assign(lab.s, { step: lab.scene.startStep ?? (lab.scene.steps ? 1 : 0), revealed: false, playing: false });
    board.kind = lab.scene.boardKind || definition.board.kind;
    definition.enter?.(lab.s, lab.scene, lab);
    lab.scene.enter?.(lab.s, lab);
    board.setFocus(call(lab.scene.focus, lab.s) || { x: [-10, 40], y: [-20, 15] }, true);
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], paths = [], original = board._text, originalPath = board.path;
    board.path = function (points, options = {}) { paths.push({ points: points.map((p) => ({ x: p.x ?? p[0], y: p.y ?? p[1] })), options }); return originalPath.call(this, points, options); };
    board._text = function (x, y, text, options, screen) { if (text != null) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, paths, value }; }
    finally { board._text = original; board.path = originalPath; }
  };
  lab.api = context.APL_SO;
  return lab;
}

const questionKey = (scene, state) => scene.so.prob(scene.so.model(state), state).key;
const shownAnswer = (lab) => { lab.s.soPick = null; lab.s.revealed = true; lab.s.step = call(lab.scene.steps, lab.s).length; };

// Conservative text boxes in the production Board's screen coordinates. These
// numerical guards accompany, and do not replace, source-bound browser captures.
function labelBox(lab, item) {
  assert.ok(item, 'the required given label is present');
  const size = item.options.size * lab.board.fs * lab.board._ts();
  const width = lab.api.textW(item.text, size), align = item.options.align || 'center';
  const left = item.x - (align === 'right' ? width : align === 'left' ? 0 : width / 2);
  return { left, right: left + width, top: item.y - size / 2, bottom: item.y + size / 2 };
}
const labelGap = (a, b) => Math.max(a.left - b.right, b.left - a.right, a.top - b.bottom, b.top - a.bottom);
function labelInStage(lab, box, name) {
  assert.ok(box.left >= lab.board.insets.left + 2 && box.right <= lab.board.W - lab.board.insets.right - 2, `${name} remains horizontally visible`);
  assert.ok(box.top >= lab.board.insets.top + 2 && box.bottom <= lab.board.H - lab.board.insets.bottom - 2, `${name} remains above the toolbar reservation`);
}

const views=[[1039,656,16,56],[820,461,0,60],[683,452,16,56],[390,411,0,60],[360,387,0,60]];
function frame(lab,v,tab='explore',thumb=false){lab.tab=tab;lab.board.resize(v[0],v[1]);lab.board.setInsets({right:v[2],bottom:v[3]});lab.board.thumb=thumb;return lab.draw();}
const badgeFor=v=>v[2]?{left:v[0]-146,right:v[0]-12,top:12,bottom:42.1875}:{left:10,right:144,top:v[1]-40.1875,bottom:v[1]-10};
function visibleO(lab,d,v){const os=d.textItems.filter(t=>t.text==='O');assert.equal(os.length,2,'net O and cone O both remain visible');for(const o of os){const q=labelBox(lab,o);assert.ok(labelGap(q,badgeFor(v))>=6,`O clears status band ${v[0]}: ${JSON.stringify(q)}`);labelInStage(lab,q,'O');}return os;}
const picture=d=>plain({textItems:d.textItems,paths:d.paths});

test('native landscape cone O clears the status badge while the two original figures and conditions remain',async()=>{
 const lab=await load(arg('--baseline'));lab.go('s4-1');const d=frame(lab,views[2]);visibleO(lab,d,views[2]);
 assert.ok(d.texts.includes('R = 6'));assert.ok(d.texts.includes('120°'));assert.ok(d.texts.includes('M'));
 assert.ok(d.paths.filter(p=>p.options.fill==='sky'&&p.options.close).length>=1,'original sector remains filled');
 assert.equal(lab._answerOpen(),false);assert.equal(lab.s.playing,false);
});
test('all valid radius/slant pairs and string modes retain both O names and the same shortest-path mathematics',async t=>{
 const lab=await load(arg('--baseline')),sc=lab.go('s4-1');let count=0;
 for(let r=1;r<=7;r++)for(let R=2*r;R<=15;R++)if(Number.isInteger(360*r/R))for(const mode of ['rim','via','line'])for(const v of views){
  Object.assign(lab.s,{soTr:r,soTR:R,soMode:mode,soMs:.75*R,soMp:-90});const m=sc.so.model(lab.s),d=frame(lab,v);visibleO(lab,d,v);
  assert.equal(m.x,360*r/R);assert.ok(Math.abs(m.chord-2*R*Math.sin(Math.PI*r/R))<1e-9);assert.ok(Math.abs(m.rim-2*Math.PI*r)<1e-9);
  assert.ok(m.via+1e-9>=m.chord);assert.equal(m.cur,mode==='rim'?m.rim:mode==='line'?m.chord:m.via);assert.equal(lab.s.playing,false);count++;
 }
 t.diagnostic(`${count} valid condition/mode/native-viewport states`);
});
test('reentry restores the original r2/R6/M string and visible original figures',async()=>{
 const lab=await load(arg('--baseline'));lab.go('s4-1');const first=picture(frame(lab,views[2]));Object.assign(lab.s,{soTr:7,soTR:14,soMode:'line',playing:true});lab.go('s4-1');assert.deepEqual(picture(frame(lab,views[2])),first);assert.equal(lab.s.playing,false);
});
if(arg('--compare-scope'))test('only the s4-1 desktop net-and-cone framing changes; other scenes, problems, math and disclosure remain exact',async t=>{
 const a=await load(),z=await load(arg('--compare-scope'));let count=0;
 for(const sc of a.list){
  a.go(sc.id);z.go(sc.id);assert.deepEqual(plain(sc.so.model(a.s)),plain(z.scene.so.model(z.s)));assert.deepEqual(plain(sc.so.prob(sc.so.model(a.s),a.s)),plain(z.scene.so.prob(z.scene.so.model(z.s),z.s)));assert.deepEqual(plain(sc.steps(a.s)),plain(z.scene.steps(z.s)));
  for(const v of views)for(const tab of ['explore','problem','review'])for(const thumb of [false,true]){
   a.s.step=z.s.step=1;const ad=frame(a,v,tab,thumb),zd=frame(z,v,tab,thumb);
   if(sc.id==='s4-1'&&v[2]>0&&tab!=='problem'&&!thumb)assert.deepEqual(ad.texts,zd.texts);
   else assert.deepEqual(picture(ad),picture(zd),`${sc.id}/${v[0]}/${tab}/${thumb}`);count++;
  }
 }
 t.diagnostic(`${count} scope comparisons; all22 scene models/questions/steps`);
});
