// Production persistent-Board regression for seven rolling scenes.
// Negative control: node this-file --baseline <SHA>. This VM checks math and drawing commands;
// it does not replace a real browser, layout audit, or physical-device review.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const labs = path.join(root, 'labs');
const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
const numericArgs = { moveTo: [0, 1], lineTo: [0, 1], rect: [0, 1, 2, 3], fillRect: [0, 1, 2, 3], clearRect: [0, 1, 2, 3], arc: [0, 1, 2, 3, 4], ellipse: [0, 1, 2, 3, 4, 5, 6], fillText: [1, 2], strokeText: [1, 2], bezierCurveTo: [0, 1, 2, 3, 4, 5], quadraticCurveTo: [0, 1, 2, 3], setTransform: [0, 1, 2, 3, 4, 5] };
function canvas() {
  const context = new Proxy({ measureText: (text) => ({ width: String(text).length * 8 }) }, {
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

const flag = name => { const i=process.argv.indexOf(name); return i<0?null:process.argv[i+1]; };
const source = (file,revision) => revision && file.endsWith('/g7-circle-sector/rolling.js') ? execFileSync('git',['show',revision+':apmath/playground/next/labs/g7-circle-sector/rolling.js'],{encoding:'utf8'}) : fs.readFileSync(file,'utf8');
async function load(initialHash = '',revision=flag('--baseline')) {
  let context;
  const ready = [];
  const element = (tag) => tag === 'canvas' ? canvas() : { tagName: tag.toUpperCase(), dataset: {}, style: { setProperty() {} }, classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, append() {} };
  const document = { getElementById() { return null; }, querySelector() { return null; }, createElement: element, createTextNode: (text) => ({ textContent: text }), addEventListener() {}, documentElement: element('html'), body: element('body'), head: element('head') };
  document.head.append = (el) => {
    if (el.tagName !== 'SCRIPT') return;
    vm.runInContext(source(path.join(labs, el.src),revision), context, { filename: el.src });
    el.onload?.();
  };
  const sandbox = { document, console, Math, URLSearchParams, performance, setTimeout, clearTimeout, requestAnimationFrame: () => 0, cancelAnimationFrame() {}, devicePixelRatio: 1, location: { hash: initialHash, search: '', pathname: '/labs/g7-circle-sector.html' }, history: { replaceState() {} }, localStorage: { getItem() { return null; }, setItem() {} }, getComputedStyle: () => ({ getPropertyValue: (key) => key === '--font-ui' ? 'sans-serif' : key === '--m-glow' ? '0' : '#ffffff' }), matchMedia: () => ({ matches: false }), addEventListener: (event, fn) => { if (event === 'DOMContentLoaded') ready.push(fn); } };
  sandbox.window = sandbox;
  context = vm.createContext(sandbox);
  for (const filename of ['apl-core.js', 'apl-board.js']) vm.runInContext(fs.readFileSync(path.join(root, 'kit', filename), 'utf8'), context, { filename });
  let definition;
  context.APLab.createLab = (def) => { definition = def; };
  const html = fs.readFileSync(path.join(labs, 'g7-circle-sector.html'), 'utf8');
  const script = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map((x) => x[1]).find((x) => x.includes('const PI = Math.PI'));
  vm.runInContext(script, context, { filename: 'g7-circle-sector.html' });
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
    const value = call(scene.view, lab.s, lab), run = () => board.measure(() => scene.draw(board, lab.s, value, lab));
    let box = run(); if (!box) return null;
    const options = { margin: 0.08, px: 12 }, keep = { focus: board.focus, zoom: board.zoom, panX: board.panX, panY: board.panY };
    Object.assign(board, { focus: board.fitBox(box, options), zoom: 1, panX: 0, panY: 0 });
    box = run() || box; Object.assign(board, keep);
    return board.fitBox(box, options);
  };
  lab.go = (id) => {
    lab.index = list.findIndex((scene) => scene.id === id);
    assert.ok(lab.index >= 0, `scene ${id} exists`);
    // Match the real shell: the destination tab is set before enter/focus.
    lab.tab = 'explore';
    Object.assign(lab.s, { step: lab.scene.startStep ?? (lab.scene.steps ? 1 : 0), revealed: false, playing: false });
    board.kind = lab.scene.boardKind || definition.board.kind;
    definition.enter?.(lab.s, lab.scene, lab);
    lab.scene.enter?.(lab.s, lab);
    board.setFocus(call(lab.scene.focus, lab.s) || { x: [-10, 40], y: [-20, 15] }, true);
    lab.tab = 'explore';
    return lab.scene;
  };
  lab.draw = () => {
    const texts = [], textItems = [], original = board._text;
    board._text = function (x, y, text, options, screen) { if (text != null && !board._bbox) { texts.push(String(text)); textItems.push({ x, y, text: String(text), options, screen }); } return original.call(this, x, y, text, options, screen); };
    try { const value = call(lab.scene.view, lab.s, lab); board.begin(); lab.scene.draw(board, lab.s, value, lab); board.end(); return { texts, textItems, value }; }
    finally { board._text = original; }
  };
  return lab;
}

const ids=['rl-rect','rl-tri','rl-rtri','rl-turn60','rl-turn45','rl-semi','rl-square'];
const layouts=[{W:1039,H:569,activeH:536,problemH:741,top:57,right:16,bottom:56},
  {W:820,H:428,activeH:397,problemH:397,top:56,right:0,bottom:60},
  {W:683,H:411,activeH:378,problemH:613,top:57,right:16,bottom:56},
  {W:390,H:377,activeH:345,problemH:309,top:56,right:0,bottom:60},
  {W:360,H:354,activeH:323,problemH:291,top:56,right:0,bottom:60}];
const plain=value=>JSON.parse(JSON.stringify(value));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function setup(lab,view,H=view.H){lab.board.resize(view.W,H);lab.board.setInsets({top:view.top,right:view.right,bottom:view.bottom,left:0});}
function render(lab){
  const b=lab.board,poly=b.poly,shapes=[];
  b.poly=function(points,options={}){if(options.fill==='ink')shapes.push({world:plain(points),screen:points.map(p=>b.toS(p))});return poly.call(this,points,options);};
  try {const r=lab.draw();return {...r,shapes,focus:plain(b.focus),zoom:b.zoom,panX:b.panX,panY:b.panY};}finally{b.poly=poly;}
}
function signature(frame){return plain({focus:frame.focus,zoom:frame.zoom,panX:frame.panX,panY:frame.panY,shapes:frame.shapes,text:frame.textItems.map(t=>({text:t.text,x:t.x,y:t.y,options:t.options}))});}
function bounds(lab,frame,why){
  const b=lab.board;
  for(const item of frame.textItems){
    const size=(item.options?.size||13)*b.fs*b._ts(),width=[...item.text].reduce((n,ch)=>n+size*(ch.charCodeAt(0)>=0x1100?1:.65),0);
    const align=item.options?.align||'center',baseline=item.options?.baseline||'alphabetic';
    const l=item.x-(align==='center'?width/2:align==='right'?width:0),r=l+width;
    const t=item.y-(baseline==='middle'?size/2:baseline==='top'?0:size*.8),bot=t+size;
    assert.ok(l>=-1&&r<=b.W+1&&t>=-1&&bot<=b.H+1,`${why} text ${item.text} clipped [${l},${r},${t},${bot}]`);
    if(b.W<560)assert.ok(!(r>b.W-24&&l<b.W&&bot>50&&t<135),`${why} text ${item.text} covered by contents handle`);
    assert.ok(!(r>b.W-94&&l<b.W-10&&bot>b.H-56&&t<b.H-10),`${why} text ${item.text} covered by toolbar`);
  }
  for(const shape of frame.shapes)for(const p of shape.screen)assert.ok(p.x>=0&&p.x<=b.W-24&&p.y>=b.insets.top-1&&p.y<=b.H-b.insets.bottom+1,`${why} current figure must stay in unobscured stage (${p.x},${p.y})`);
}

await test('all seven rolling first pictures are identical after same-scene reselection and after visiting another scene',async()=>{
  const lab=await load();
  for(const view of layouts)for(const id of ids){
    lab.go(id);setup(lab,view);const first=render(lab);bounds(lab,first,`${id}/${view.W}/first`);
    assert.equal(lab.s.playing,false);assert.equal(lab.s.rlT,0);
    lab.go(id);setup(lab,view);assert.deepEqual(signature(render(lab)),signature(first),`${id}/${view.W}: persistent Board must not inherit a previous interpolation`);
    lab.go(ids[(ids.indexOf(id)+1)%ids.length]);setup(lab,view);render(lab);
    lab.go(id);setup(lab,view);assert.deepEqual(signature(render(lab)),signature(first),`${id}/${view.W}: return restores exact first framing`);
  }
});

await test('semicircle and square retain current shapes and complete labels through progress and every review step',async t=>{
  const lab=await load();let frames=0;
  for(const view of layouts)for(const id of ['rl-semi','rl-square']){
    lab.go(id);setup(lab,view,view.activeH);
    for(const progress of [0,.1,.25,1/3,.49,.5,.51,2/3,.75,.99,1]){
      lab.s.rlT=progress;lab.s.playing=false;const frame=render(lab);bounds(lab,frame,`${id}/${view.W}/t${progress}`);assert.ok(frame.shapes.length>0,'current moving figure is always drawn');frames++;
    }
    lab.tab='problem';setup(lab,view,view.problemH);bounds(lab,render(lab),`${id}/${view.W}/problem`);assert.equal(lab.s.revealed,false);frames++;
    lab.tab='review';setup(lab,view,view.activeH);const steps=call(lab.scene.steps,lab.s);
    for(let step=1;step<=steps.length;step++){lab.s.step=step;const frame=render(lab);bounds(lab,frame,`${id}/${view.W}/step${step}`);frames++;}
  }
  t.diagnostic(`${frames} complete progress/problem/review drawings`);
});

await test('rolling motion stays rigid and reset does not remove the original shape or start playback',async()=>{
  const lab=await load();
  for(const id of ids){
    lab.go(id);setup(lab,layouts.at(-1),323);const first=render(lab),shape=first.shapes[0].world;assert.ok(shape.length>=3);
    const question=lab.scene.problem.text(lab.s),answer=lab.scene.problem.answer(lab.s),steps=plain(call(lab.scene.steps,lab.s));
    for(const progress of [.1,.5,.9,1]){
      lab.s.rlT=progress;const frame=render(lab),moved=frame.shapes[0].world;
      assert.equal(moved.length,shape.length);
      for(let i=0;i<shape.length;i++)for(let j=i+1;j<shape.length;j++)assert.ok(Math.abs(distance(shape[i],shape[j])-distance(moved[i],moved[j]))<1e-7,'each moving polygon/semicircle preserves all pairwise distances');
    }
    assert.equal(lab.scene.problem.text(lab.s),question);assert.equal(lab.scene.problem.answer(lab.s),answer);assert.deepEqual(plain(call(lab.scene.steps,lab.s)),steps);
    call(lab.scene.actions,lab.s).find(action=>action.id==='reset').run(lab.s);assert.equal(lab.s.rlT,0);assert.equal(lab.s.playing,false);
    assert.deepEqual(signature(render(lab)),signature(first),'reset restores identical original figure, labels and framing');
    call(lab.scene.actions,lab.s).find(action=>action.id==='play').run(lab.s);assert.equal(lab.s.playing,true);
    assert.ok(lab.scene.tick(lab.s,.1,lab));assert.ok(lab.s.rlT>0&&lab.s.rlT<1,'animation still advances');const moving=render(lab);assert.notDeepEqual(moving.shapes[0].world,shape);
    lab.tab='problem';lab.scene.tick(lab.s,.1,lab);assert.equal(lab.s.playing,false,'problem does not autoplay');
  }
});

await test('the live camera keeps semicircle and square visible across rotation boundaries',async t=>{
  const lab=await load();let frames=0;
  for(const view of layouts)for(const id of ['rl-semi','rl-square']){
    lab.go(id);setup(lab,view,view.activeH);render(lab);
    call(lab.scene.actions,lab.s).find(action=>action.id==='play').run(lab.s);
    for(let frame=0;lab.s.playing&&frame<400;frame++){
      lab.scene.tick(lab.s,1/30,lab);
      bounds(lab,render(lab),`${id}/${view.W}/play-${frame}`);frames++;
    }
    assert.equal(lab.s.rlT,1,'the entire live animation reaches its final state');
  }
  t.diagnostic(`${frames} live animation frames checked`);
});

if(flag('--compare'))await test('focus repair preserves baseline geometry, problem conditions, answers and review content',async t=>{
  const current=await load(),previous=await load('',flag('--compare'));let frames=0;
  for(const id of ids){
    current.go(id);previous.go(id);
    const settings=[null];
    for(const name of call(current.scene.controls,current.s).filter(name=>name!=='rlT')){
      const param=current.params[name];
      for(const value of [param.min,param.max])settings.push({name,value});
    }
    for(const setting of settings){
      for(const lab of [current,previous]){
        lab.go(id);setup(lab,layouts.at(-1),323);
        if(setting){lab.s[setting.name]=setting.value;lab.params[setting.name].onInput(lab.s);}
      }
      assert.equal(current.scene.problem.text(current.s),previous.scene.problem.text(previous.s));
      assert.equal(current.scene.problem.answer(current.s),previous.scene.problem.answer(previous.s));
      assert.deepEqual(plain(call(current.scene.steps,current.s)),plain(call(previous.scene.steps,previous.s)));
      for(const progress of [0,.1,.49,.5,.51,.9,1]){
        current.s.rlT=previous.s.rlT=progress;
        const a=render(current),b=render(previous);
        assert.deepEqual(a.shapes.map(s=>s.world),b.shapes.map(s=>s.world),'only focus, never the moving geometry, changes');
        assert.deepEqual(plain(a.value),plain(b.value),'readouts and reveal behavior remain unchanged');frames++;
      }
    }
  }
  t.diagnostic(`${frames} source-comparison states across every scene and size-control endpoint`);
});

