import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { createRequire } from 'node:module';

const katex = createRequire(import.meta.url)('../kit/vendor/katex/katex.min.js');
const close = (a, b, why = '', eps = 1e-8) => assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b)), `${why}: ${a} != ${b}`);
const pt = p => Array.isArray(p) ? { x: p[0], y: p[1] } : p;
const dist = (a, b) => Math.hypot(pt(a).x - pt(b).x, pt(a).y - pt(b).y);
const angle = (a, o, b) => {
  a = pt(a); o = pt(o); b = pt(b);
  return Math.acos(Math.max(-1, Math.min(1, ((a.x-o.x)*(b.x-o.x)+(a.y-o.y)*(b.y-o.y))/(dist(a,o)*dist(b,o)))));
};
const area = (a, b, c) => Math.abs((pt(b).x-pt(a).x)*(pt(c).y-pt(a).y)-(pt(c).x-pt(a).x)*(pt(b).y-pt(a).y))/2;
function load(name) {
  const html = fs.readFileSync(new URL(`../labs/${name}.html`, import.meta.url), 'utf8');
  let source = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('DOMContentLoaded'));
  const names = name === 'alg-sequence' ? 'OLDV,OVARY,OV_SPECS,hudOf,focusFor' : 'SPEC,PROBLEMS,RA,geomL,phiToT,tToPhi,dAngle,dSlider';
  source = source.replace('APLab.createLab({', `window.exports={${names}};APLab.createLab({`);
  const events = {};
  const ctx = { console, Math: Object.create(Math), setTimeout() {}, clearTimeout() {},
    window: { addEventListener: (_, fn) => fn() }, document: { addEventListener: (k, fn) => { events[k] = fn; } },
    APLab: { fmt: n => String(Math.round(n * 10000) / 10000), clamp: (n, a, b) => Math.max(a, Math.min(b, n)), stripEmoji: s => s, tex: s => `$${s}$`, toast() {}, createLab(d) { ctx.def = d; } } };
  vm.createContext(ctx); vm.runInContext(source, ctx, { filename: name, timeout: 10000 });
  const scenes = ctx.def.groups.flatMap(g => g.scenes);
  function state(sc) { const s = { step: 0, revealed: false, grid: false, ...ctx.def.state, ...Object.fromEntries(Object.entries(ctx.def.params).map(([k, p]) => [k, p.value])) }; sc.enter?.(s); return s; }
  return { def: ctx.def, scenes, exports: ctx.window.exports, events, ctx, state };
}
const seq = load('alg-sequence'), scl = load('alg-sine-cosine-law');
function board(W = 1024, H = 700) {
  const items = [], texts = [];
  const finite = (x, why) => { if (typeof x === 'number') assert.ok(Number.isFinite(x), why); else if (Array.isArray(x)) x.forEach(v => finite(v, why)); else if (x && typeof x === 'object') for (const [k,v] of Object.entries(x)) if (k !== 'drag') finite(v, why); };
  const b = { W, H, fs: 1, lw: 1, font: 'sans-serif', pad: .045, insets: { top: 0, bottom: 0, left: 0, right: 0 }, colors: { halo: '#fff' }, focus: { x: [0,W], y: [0,H] }, items, texts, color: c => c, _fracSplit: () => null, _area: () => ({ x: 0, y: 0, w: W, h: H }), k: 1,
    toS: (x,y) => typeof x === 'number' ? { x,y } : pt(x), toW: (x,y) => ({x,y}) };
  const ctxMethods = ['save','restore','setLineDash','beginPath','moveTo','lineTo','closePath','stroke','fill','fillRect','roundRect','arc','translate','rotate','rect','clip'];
  b.ctx = { measureText: t => ({ width: String(t).length * 6 }), fillText(t, x, y) { finite([x,y], 'canvas text'); texts.push(String(t)); } };
  for (const k of ctxMethods) b.ctx[k] = (...args) => { finite(args, `canvas ${k}`); };
  for (const k of ['point','handle','poly','seg','circle','right','angle','ticks','text','stext','grid','axes','line','arrow','dimension']) b[k] = (...args) => {
    finite(args, k); items.push({ kind:k, args });
    if (k === 'text') texts.push(String(args[1]));
    if (k === 'stext') texts.push(String(args[2]));
    const o = args.at(-1); if (o?.label) texts.push(String(o.label)); return b;
  };
  b.plot = (fn, o = {}) => { const lo=o.from??-1, hi=o.to??10; for(let i=0;i<=8;i++){ const y=fn(lo+(hi-lo)*i/8); assert.ok(Number.isFinite(y)||Number.isNaN(y)); } items.push({kind:'plot',fn,o}); return b; };
  return b;
}
function draw(L, sc, s, tab = 'review', W = 1024) {
  const b=board(W), lab={tab,scene:sc,s,params:L.def.params};
  const v=sc.view?.(s,lab)||{}; sc.draw(b,s,v,lab);
  assert.doesNotMatch(JSON.stringify(v), /NaN|undefined|Infinity/, `${sc.id} view`);
  assert.doesNotMatch(b.texts.join('\n'), /NaN|undefined|Infinity/, `${sc.id} labels`);
  return {b,v};
}
// Use the production pixel transforms and angle/point-label positioning for
// the observed bas-5 clipping. Text boxes here are conservative envelopes,
// not native-font or screenshot evidence.
const boardScope = { window: { APLab: { clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n)) } } };
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-board.js', import.meta.url), 'utf8'), boardScope);
function drawOrthicInquiry(t, W = 1039, H = 646, step = 3) {
  const proto = boardScope.window.APLab.Board.prototype, b = board(W, H), labels = [];
  delete b.k; delete b.toS; delete b.toW; delete b._area;
  Object.setPrototypeOf(b, proto);
  Object.assign(b, { kind: 'figure', aspect: '1:1', zoom: 1, panX: 0, panY: 0, panes: null, paneId: null,
    insets: { top: 0, bottom: 0, left: 8, right: 8 }, _P: pt, _em: () => 0 });
  b._text = (x, y, text, o = {}) => {
    const size = (o.size || 13) * b.fs * b._ts(), width = String(text).length * size;
    const height = /π\//.test(String(text)) ? size * 2.15 : size;
    const x0 = o.align === 'center' ? x - width / 2 : o.align === 'right' ? x - width : x;
    labels.push({ text, x0, x1: x0 + width, y0: y - height / 2, y1: y + height / 2 });
  };
  for (const kind of ['point', 'handle']) {
    const record = b[kind];
    b[kind] = (...args) => {
      record(...args);
      const p = args[kind === 'handle' ? 1 : 0], o = args.at(-1);
      if (o.label) proto._pointLabel.call(b, b.toS(pt(p)), o);
      return b;
    };
  }
  const recordAngle = b.angle;
  b.angle = (...args) => { recordAngle(...args); return proto.angle.call(b, ...args); };
  const sc = scl.scenes.find(x => x.id === 'bas-5'), s = scl.state(sc);
  Object.assign(s, { t, step });
  const lab = { tab: 'explore', scene: sc, s, params: scl.def.params }, v = sc.view(s, lab);
  sc.draw(b, s, v, lab);
  return { b, labels, s, v };
}
function vertices(b) {
  const out={};
  for(const x of b.items) if(x.kind==='point'||x.kind==='handle') {
    const o=x.args.at(-1), label=o?.label, p=pt(x.args[x.kind==='handle'?1:0]);
    if(label && /^[A-Z](?:$|[^A-Z])/.test(label)) out[label[0]]=p;
  }
  return out;
}
function checkMath(t) {
  if(typeof t!=='string') return;
  assert.doesNotMatch(t,/NaN|undefined|Infinity/);
  for(const [,tex] of t.matchAll(/\$([^$]+)\$/g)) katex.renderToString(tex,{throwOnError:true,strict:false});
}

test('every sine/cosine variant agrees with independent Euclidean calculations', () => {
  for(const [id, sp] of Object.entries(scl.exports.SPEC)) for(let i=0;i<sp.list.length;i++) {
    const q=sp.list[i], v=sp.build(q,i); let expected;
    if(id==='bas-1') { close(q.AB**2,q.BH**2+q.AH**2); assert.ok(q.AH**2>q.BH*q.CH,'acute angle A'); expected=[q.BH+q.CH,(q.BH+q.CH)*q.AH/2]; }
    if(id==='bas-2') expected=[q.AH,(q.BH+q.CH)*q.AH/2];
    if(id==='bas-3') expected=[q.R2*q.q/q.p];
    if(id==='bas-4') { const chord=q.r1n*q.sbn/q.sbd; expected=[chord,chord/(2*q.R2)]; assert.ok(expected[1]>0&&expected[1]<1); }
    if(id==='bas-5') expected=[q.a/2,q.a*Math.cos(q.rad)];
    if(id==='bas-6') { const x=(q.c*q.c+q.a*q.a-q.b*q.b)/(2*q.a), y=Math.sqrt(q.c*q.c-x*x); expected=[Math.hypot(x-q.a/2,y)]; }
    if(id==='bas-7') { const x=(q.c*q.c+q.a*q.a-q.b*q.b)/(2*q.a), y=Math.sqrt(q.c*q.c-x*x), sem=(q.a+q.b+q.c)/2; expected=[sem-q.a,q.a*y/(2*sem)]; }
    if(id==='bas-8') expected=[(q.b+q.c)/2];
    if(id==='adv-1') expected=[q.a*q.cn/q.cd,(q.cn/q.cd)**2];
    if(id==='adv-2') { const x=(q.c*q.c+q.a*q.a-q.b*q.b)/(2*q.a), y2=q.c*q.c-x*x, d=q.a*q.m/(q.m+q.n); expected=[(x-d)**2+y2]; }
    if(id==='adv-3') expected=[Math.sqrt(q.PO*q.PO-q.R2),q.PO*q.PO-q.R2];
    if(id==='adv-4') expected=[q.PA*q.PB/q.PC,q.PA/q.PC];
    if(id==='adv-5') { const ac=Math.sqrt(q.pa*q.pa+q.pc*q.pc+q.pa*q.pc), x=(q.pa*q.pa+ac*ac-q.pc*q.pc)/(2*ac), y=-Math.sqrt(q.pa*q.pa-x*x); expected=[ac,Math.hypot(x-ac/2,y-ac*Math.sqrt(3)/2)]; }
    if(id==='adv-6') { const bx=(q.AB*q.AB+q.AC*q.AC-q.BC*q.BC)/(2*q.AC), by=Math.sqrt(q.AB*q.AB-bx*bx), dx=(q.DA*q.DA+q.AC*q.AC-q.CD*q.CD)/(2*q.AC), dy=-Math.sqrt(q.DA*q.DA-dx*dx); expected=[Math.hypot(bx-dx,by-dy)]; close((q.AB*q.AB+q.BC*q.BC-q.AC*q.AC)/(2*q.AB*q.BC),-(q.DA*q.DA+q.CD*q.CD-q.AC*q.AC)/(2*q.DA*q.CD),'cyclicity'); }
    if(id==='adv-7') { const x=(q.AC*q.AC-q.AB*q.AB-q.BC*q.BC)/(2*q.BC), y=Math.sqrt(q.AB*q.AB-x*x); expected=[Math.hypot(q.BC-x,y)]; }
    if(id==='adv-8') { const th={'π/3':Math.PI/3,'π/6':Math.PI/6,'π/4':Math.PI/4,'2π/3':2*Math.PI/3}[q.ang]; expected=[2*q.AB,area([0,0],[2*q.AB,0],[q.AB+q.AD*Math.cos(th),q.AD*Math.sin(th)])]; }
    assert.equal(v.val.length,expected.length,id);
    expected.forEach((x,j)=>close(v.val[j],x,`${id}/${i}/${j}`));
    for(const t of [v.text,v.ans,v.alg,v.aha,...v.steps,...v.names]) checkMath(t);
  }
});

test('the drawn equilateral proof uses corresponding congruent triangles ABK and ACP', () => {
  const sc=scl.scenes.find(x=>x.id==='adv-5'), sp=scl.exports.SPEC[sc.id], s=scl.state(sc);s.step=3;
  for(let i=0;i<sp.list.length;i++) {
    sp.vary.set(i);const {b}=draw(scl,sc,s),{A,B,C,P,K}=vertices(b);
    close(dist(A,B),dist(A,C),'AB=AC');close(dist(A,K),dist(A,P),'AK=AP');close(angle(B,A,K),angle(C,A,P),'included angles');close(dist(B,K),dist(C,P),'BK=CP');close(dist(P,B),dist(P,A)+dist(P,C),'chord sum');
    const triangles=b.items.filter(x=>x.kind==='poly').map(x=>x.args[0]);
    assert.ok(triangles.some(t=>t.length===3&&dist(t[0],A)<1e-8&&dist(t[1],C)<1e-8&&dist(t[2],P)<1e-8),'highlight is ACP');
    assert.doesNotMatch(sp.vary.cur().steps.join(' '),/triangle CBP/);
  }
  sp.vary.set(0);
});

test('the two-secant proof compares equal inscribed angles, then their supplements', () => {
  const sc=scl.scenes.find(x=>x.id==='adv-4'), sp=scl.exports.SPEC[sc.id], s=scl.state(sc);s.step=3;
  for(let i=0;i<sp.list.length;i++) {
    sp.vary.set(i);const {A,B,C,D,P}=vertices(draw(scl,sc,s).b);
    close(angle(D,A,B),angle(D,C,B),'same arc DB');close(angle(P,A,D),angle(P,C,B),'equal supplements');close(dist(A,D)/dist(C,B),dist(P,A)/dist(P,C),'corresponding sides');
    assert.doesNotMatch(sp.vary.cur().steps[0],/DAB \+.*DCB/);
  } sp.vary.set(0);
});

test('every slider position keeps the Ptolemy quadrilateral convex, cyclic, and truthful', () => {
  const sc=scl.scenes.find(x=>x.id==='adv-6'),s=scl.state(sc);s.step=3;
  for(let k=0;k<=100;k++) {
    s.t=k/100;const {b}=draw(scl,sc,s,'explore'),{A,B,C,D,K}=vertices(b);
    const z=[A,B,C,D].map((p,i,ps)=>{const q=ps[(i+1)%4],r=ps[(i+2)%4];return (q.x-p.x)*(r.y-q.y)-(q.y-p.y)*(r.x-q.x);});
    assert.ok(z.every(x=>x>0)||z.every(x=>x<0),'strict convexity');
    close(dist(A,B)*dist(C,D)+dist(B,C)*dist(D,A),dist(A,C)*dist(B,D),'Ptolemy');
    close(angle(A,B,D),angle(K,B,C),'constructed angle');
    close(scl.exports.dSlider(scl.exports.dAngle(s.t)),s.t,'drag/slider inverse');
  }
  for(const [t,cd,da,bd] of [[.25,5,8,55/7],[.65,8,3,39/7]]) {
    s.t=t;const {A,B,C,D}=vertices(draw(scl,sc,s,'explore').b),scale=dist(A,B)/3;
    close(dist(C,D)/scale,cd);close(dist(D,A)/scale,da);close(dist(B,D)/scale,bd);
  }
});

test('exact special buttons and continuous dragging do not depend on the solution stage', () => {
  const targets={'bas-3':7/11,'bas-4':5/7,'bas-5':2/3,'bas-8':7/12,'adv-2':2/9,'adv-7':2/7};
  for(const p of scl.exports.PROBLEMS) {
    const sc=scl.scenes.find(x=>x.id===p.id),s=scl.state(sc);s.t=p.defaultT<.99?p.defaultT+.001:p.defaultT-.001;
    for(let step=0;step<=3;step++) {s.step=step;const before=s.t;sc.view(s,{tab:'explore'});scl.def.params.t.onInput(s);close(s.t,before,'no automatic target movement');}
    if(targets[p.id]!==undefined) close(p.defaultT,targets[p.id],'exact preset');
  }
  const sc=scl.scenes.find(x=>x.id==='ext-1'),s=scl.state(sc),g=scl.exports.geomL(5,6);
  s.t=scl.exports.phiToT(g,g.phC);
  const {v}=draw(scl,sc,s,'explore');assert.match(v.summary,/定|정의되지/);
  for(const [R,a] of scl.exports.RA) {const d=Math.sqrt(R*R-a*a/4);close(a/(a/(2*R)),2*R);close(a*(R+d)/2,Math.max(...Array.from({length:721},(_,i)=>a*Math.abs(R*Math.sin(i*Math.PI/360)+d)/2)));}
});

for (const [t, location] of [[0, 'left of H'], [0.3, 'at H'], [0.65, 'right of H']]) {
  test(`bas-2 labels the actual angle APB when P is ${location}`, () => {
    const sc = scl.scenes.find(x => x.id === 'bas-2');
    for (const step of [0, 3]) {
      const s = scl.state(sc); Object.assign(s, { t, step });
      const { b, v } = draw(scl, sc, s, 'explore'), { A, B, C, P } = vertices(b);
      // The independent expectation is the dot product of the two drawn rays
      // PA and PB. PB points towards B, not towards the opposite end C.
      const degrees = angle(A, P, B) * 180 / Math.PI, label = `∠APB ≈ ${degrees.toFixed(0)}°`;
      if (step < 3) assert.ok(v.summary.includes(label), `${location}: ${v.summary}; expected ${label}`);
      else assert.match(v.summary, /AH = 12, 넓이 = 84/, 'the final height/area explanation stays unchanged');
      const scale = dist(B, C) / 14;
      close(dist(A, B) / scale, 13, 'AB stays fixed');
      close(dist(A, C) / scale, 15, 'AC stays fixed');
      close(dist(B, P) / scale, 2 + 10 * t, 'P retains its input position');
      if (t === 0.3) {
        close(degrees, 90, 'the altitude makes a right angle');
        assert.ok(b.items.some(x => x.kind === 'right' && dist(x.args[0], P) < 1e-8), 'right angle remains marked at H');
      } else {
        assert.ok(t < 0.3 ? degrees > 90 : degrees < 90, 'obtuse/acute side of the altitude');
        const arc = b.items.find(x => x.kind === 'angle' && x.args.at(-1).label === label);
        assert.ok(arc, 'drawn arc carries the same angle as the inquiry metric');
        close(angle(arc.args[1], arc.args[0], arc.args[2]), degrees * Math.PI / 180, 'arc rays match APB');
      }
      assert.equal(s.t, t, 'drawing does not snap the slider');
      const drag = b.items.find(x => x.kind === 'handle' && x.args.at(-1).label.startsWith('P')).args.at(-1).drag;
      const desired = 0.47;
      drag({ x: B.x + (C.x - B.x) * (2 + 10 * desired) / 14, y: B.y });
      close(s.t, desired, 'the existing P drag inverse is unchanged');
    }
  });
}

for (const t of [0, 0.005]) {
  test(`the bas-5 triangle, diameter circle and labels fit at the reported t=${t}`, () => {
    // First size is the actual run42583866636 PC canvas (integer Board size);
    // the second retains a representative narrow stage for the same geometry.
    for (const [W, H] of [[1039, 646], [390, 420]]) for (const step of [0, 3]) {
      const { b, labels, s } = drawOrthicInquiry(t, W, H, step);
      const { A, B, C, D, E } = vertices(b), scale = dist(B, C) / 6;
      close(angle(B, A, C), (30 + 45 * t) * Math.PI / 180, 'angle remains the exact selected/input value');
      close(angle(A, D, B), Math.PI / 2, 'first perpendicular foot');
      close(angle(A, E, C), Math.PI / 2, 'second perpendicular foot');
      close(dist(D, E) / scale, 6 * Math.cos((30 + 45 * t) * Math.PI / 180), 'DE remains BC cos A');
      for (const p of [A, B, C, D, E].map(p => b.toS(p))) {
        assert.ok(p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H, `vertex ${JSON.stringify(p)} within ${W}×${H}`);
      }
      assert.ok(labels.some(x => x.text === 'A') && labels.some(x => x.text.startsWith('∠A')), 'vertex and angle remain labelled');
      for (const label of labels) assert.ok(label.x0 >= 0 && label.x1 <= W && label.y0 >= 0 && label.y1 <= H, JSON.stringify(label));
      for (const circle of b.items.filter(x => x.kind === 'circle')) {
        const c = b.toS(circle.args[0]), r = circle.args[1] * b.k;
        assert.ok(c.x - r >= 0 && c.x + r <= W && c.y - r >= 0 && c.y + r <= H, 'complete diameter circle fits');
      }
      assert.equal(s.t, t, 'drawing never snaps or changes the input');
    }
  });
}

test('bas-5 keeps a fixed inquiry scale and its height-drag inverse across exact positions', () => {
  const samples = [0, 1 / 3, 2 / 3, 1].map(t => {
    const { b } = drawOrthicInquiry(t), { A, B, C } = vertices(b);
    return { t, A, B, scale: dist(B, C) / 6 };
  });
  for (const sample of samples) {
    close(sample.scale, samples[0].scale, 'slider movement does not resize the triangle');
    close(sample.B.y, samples[0].B.y, 'base stays at a fixed height');
  }
  assert.ok(samples.every((sample, i) => !i || sample.A.y > samples[i - 1].A.y), 'A visibly moves down as its angle grows');
  const { b, s } = drawOrthicInquiry(2 / 3), { A, B, C } = vertices(b), scale = dist(B, C) / 6;
  const desired = 0.37, rad = (30 + 45 * desired) * Math.PI / 180;
  const height = 6 / (2 * Math.sin(rad)) * (Math.cos(rad) + Math.cos(0.12));
  b.items.find(x => x.kind === 'handle' && x.args.at(-1).label === 'A').args.at(-1).drag({ x: A.x, y: B.y - height * scale });
  close(s.t, desired, 'height drag retains the existing inverse', 2e-5);
});

test('sequence diagrams use actual coordinates and preserve fractional values and domain boundaries', () => {
  const sc=seq.scenes.find(x=>x.id==='type1-0'),s=seq.state(sc);s.step=3;s.type1_dSlope=.5;s.type1_zeroN=4.5;
  const {b}=draw(seq,sc,s,'explore');
  const points=b.items.filter(x=>x.kind==='point'&&/^a_\d+=/.test(x.args[1]?.label));
  assert.equal(points.length,10);
  for(const p of points) {const n=pt(p.args[0]).x,y=pt(p.args[0]).y;close(y,.5*(n-4.5));close(Number(p.args[1].label.split('=')[1]),y,'displayed term');}
  assert.doesNotMatch(b.texts.join(' '),/a_4\.5/);
  for(const id of ['type2-0','type3-0','type4-0']) {const a=seq.scenes.find(x=>x.id===id),st=seq.state(a);st.step=3;const b=draw(seq,a,st,'explore').b;assert.ok(b.focus.y.every(Number.isFinite));}
  const t2=seq.scenes.find(x=>x.id==='type2-0'),s2=seq.state(t2);s2.type2_pIdx=5;s2.type2_qIdx=5;seq.def.params.type2_pIdx.onInput(s2);assert.ok(s2.type2_pIdx<s2.type2_qIdx);
  for(const kind of ['T8A','T8B']) for(const q of seq.exports.OLDV[kind].pool) {
    const v=seq.exports.OLDV[kind].build(q);assert.match(v.text,/첫 네 항/);assert.match(v.text,/n=1,2,3/);
    for(const a of seq.exports.OLDV[kind].solve(q).a1) {let x=a;for(let n=1;n<=4;n++){assert.ok(Number.isInteger(x)&&x>0);if(n<4)x=x<q.k?2*x:x-q.k;}assert.equal(x,q.t);}
  }
  for(const q of seq.exports.OLDV.T4B.pool) assert.match(seq.exports.OLDV.T4B.build(q).text,/수열 .*a_n.*첫째항부터/);
  for(const q of seq.exports.OLDV.T3B.pool) {
    const v=seq.exports.OLDV.T3B.build(q), target=Math.abs(q.r*(q.N-q.r));
    assert.ok(v.text.includes(`$r > ${q.N}$`),'the unknown r carries the lower bound');
    const candidates=Array.from({length:q.r+q.N+1},(_,r)=>r).filter(r=>r>q.N&&Math.abs(r*(q.N-r))===target);
    assert.deepEqual(candidates,[q.r]);
  }
});

test('signed-sum review HUD reveals only the current step and preserves the completed result', () => {
  const L = load('alg-sequence'), sc = L.scenes.find(x => x.id === 'type3-0');
  L.ctx.Math.random = () => 0; // visit each existing finite variant once
  for (let i = 0; i < L.exports.OLDV.T3A.pool.length; i++) {
    const q = sc.vary.cur(), s = L.state(sc), completed = L.exports.hudOf('type3', q.p);
    const N = q.p.zeroSumN, n = q.p.targetN, m = N / 2, sn = -n * (n - N);
    for (const step of [0, 1, 2, 3]) {
      s.step = step;
      const { b, v } = draw(L, sc, s, 'review'), hud = v.chips.map(x => x.html).join(' ');
      assert.ok(hud.includes(`S_n = -n(n-${N})`), 'the given sum remains visible');
      if (step < 3) {
        assert.doesNotMatch(hud, /\\sum|2S_/, `variant ${i}, step ${step}: final sum must wait`);
        assert.doesNotMatch(b.texts.join(' '), /∑\|a_k\|/, 'the drawing follows the same reveal boundary');
        assert.equal(v.readouts.length, 0, 'final numerical cards remain hidden');
      } else {
        assert.equal(hud, completed.eq, 'the final formula and answer are unchanged');
        assert.equal(v.readouts.length, completed.cards.length);
        assert.match(b.texts.join(' '), /∑\|a_k\|/, 'the completed sum is still labelled');
      }
      if (step === 0) assert.doesNotMatch(hud, /S_\{\\max\}|\\quad \|S_/, 'no derived vertex or absolute sum at the start');
      if (step >= 1) assert.ok(hud.includes(`S_{${m}}=${m * m}`), 'the opened vertex step is visible');
      if (step === 2) assert.ok(hud.includes(`|S_${n}|=${Math.abs(sn)}`), 'step 2 shows the absolute partial sum, not the sum of absolute terms');
    }
    const exploration = sc.view({ ...s, step: 0 }, { tab: 'explore' });
    assert.equal(exploration.chips[0].html, L.exports.hudOf('type3', {
      zeroSumN: s.type3_zeroSumN, targetN: s.type3_targetN
    }).eq, 'the live exploration HUD is unchanged');
    sc.vary.next();
  }
});

test('absolute-partial-sum review waits for the last step before showing the solved index', () => {
  const L = load('alg-sequence'), sc = L.scenes.find(x => x.id === 'type3-1');
  L.ctx.Math.random = () => 0;
  for (let i = 0; i < L.exports.OLDV.T3B.pool.length; i++) {
    const q = sc.vary.cur(), s = L.state(sc);
    for (const step of [0, 1, 2, 3]) {
      s.step = step;
      const { b, v } = draw(L, sc, s, 'review');
      if (step < 3) {
        assert.equal(v.chips.length, 0, `variant ${i}, step ${step}: the solved r must wait`);
        assert.ok(!b.texts.some(t => t.includes(`r=${q.p.targetN}`)), 'the drawing also waits for the solved index');
      } else {
        assert.equal(v.chips[0].html, q.ans, 'the completed answer is unchanged');
        assert.ok(b.texts.some(t => t.includes(`r=${q.p.targetN}`)), 'the completed index remains on the graph');
      }
    }
    s.step = 0;
    assert.equal(sc.view(s, { tab: 'problem' }).chips[0].html, q.ans, 'the existing problem reveal contract is unchanged');
    sc.vary.next();
  }
});

function eachSequenceVariant(ids, visit) {
  const L = load('alg-sequence');
  L.ctx.Math.random = () => 0;
  for (const sc of L.scenes.filter(x => ids.includes(x.id))) {
    const first = sc.vary.idx(); let visited = 0;
    do {
      visit(L, sc, L.state(sc), sc.vary.cur(), sc.vary.idx());
      sc.vary.next();
      assert.ok(++visited < 50, `${sc.id}: the finite variant cycle must close`);
    } while (sc.vary.idx() !== first);
  }
}
const chipText = v => (v.chips || []).map(x => x.html || x.tex || '').join(' ');

test('arithmetic review keeps givens, then slope and symmetry, before completed sums', () => {
  eachSequenceVariant(['type1-0', 'type1-1'], (L, sc, s, q) => {
    for (let step = 0; step <= 3; step++) {
      const { v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      if (step === 0) {
        assert.doesNotMatch(hud, /a_n\s*=|대칭 중심|\\sum|S_/, 'no solved line or sum before the first step');
        if (q.g.A != null) assert.ok(hud.includes(`a_1=${q.g.A}`), 'the given first term remains');
        else assert.ok(hud.includes(`d=${q.g.d}`), 'the given common difference remains');
      }
      if (step === 1) {
        assert.ok(hud.includes(`d=${q.p.dSlope.toFixed(1)}`), 'step 1 derives the common difference');
        assert.doesNotMatch(hud, /대칭 중심|\\sum|S_/, 'later symmetry and sum conclusions wait');
      }
      if (step >= 2) assert.ok(hud.includes(`m = ${q.p.zeroN.toFixed(1)}`), 'opened symmetry is retained');
      if (step < 3) assert.equal(v.readouts.length, 0);
      checkMath(hud);
    }
  });
});

test('partial-sum review derives origin and symmetry before labelling the other zero', () => {
  eachSequenceVariant(['type2-0', 'type2-1'], (L, sc, s, q) => {
    const p = q.g.p, r = q.g.q, zero = p + r;
    for (let step = 0; step <= 3; step++) {
      const { b, v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      assert.ok(hud.includes(`S_${p}`) || hud.includes(`S_{${p}}`), 'given equal sums remain');
      if (step === 0) assert.doesNotMatch(hud, /S_0\s*=|대칭축|S_n=/);
      if (step === 1) { assert.match(hud, /S_0=0/); assert.doesNotMatch(hud, /대칭축|S_n=/); }
      if (step === 2) assert.ok(hud.includes((zero / 2).toFixed(1)), 'the numerical symmetry axis is now available');
      if (step < 3) assert.ok(!b.texts.some(t => t === `S_${zero}=0` || t.startsWith('x절편:')), 'drawn zero label waits too');
      else assert.ok(b.texts.some(t => t === `S_${zero}=0`));
      checkMath(hud);
    }
  });
});

test('first-term review distinguishes a given C from the unknown C without early a1 labels', () => {
  eachSequenceVariant(['type4-0', 'type4-1'], (L, sc, s, q) => {
    const { pCoeff: p, qCoeff: r, constC: c } = q.p, unknown = q.g.C == null;
    for (let step = 0; step <= 3; step++) {
      const { b, v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      if (step === 0) { assert.match(hud, /S_n/); assert.doesNotMatch(hud, /\\implies|a_n\s*=|a_1\s*=/); }
      if (step === 1) { assert.ok(hud.includes(`a_n=${2 * p}n`)); assert.doesNotMatch(b.texts.join(' '), /a₁=S₁=/); }
      if (step === 2) {
        assert.ok(hud.includes('a_1=S_1='), 'step 2 retains the first-term calculation');
        assert.ok(hud.includes(unknown ? `${p + r}+C` : String(p + r + c)));
      }
      if (unknown && step < 3) assert.doesNotMatch(hud, /C=0|C\(0\)|\+ \(0\)/, 'unknown C is not silently replaced by its solution');
      checkMath(hud);
    }
  });
});

test('geometric-block review reveals P2, then R and P3, then the cumulative third sum', () => {
  eachSequenceVariant(['type5-0', 'type5-1'], (L, sc, s, q) => {
    const P1 = q.p.block1, R = q.p.blockRatio, P2 = P1 * R, P3 = P2 * R, S3 = P1 + P2 + P3;
    for (let step = 0; step <= 3; step++) {
      const { b, v } = draw(L, sc, { ...s, step }); const hud = chipText(v), labels = b.texts.join(' ');
      if (step === 0) { assert.ok(hud.includes(`S_{2n}=${P1 + P2}`)); assert.doesNotMatch(hud, /P_2|P_3|R=/); }
      if (step === 1) { assert.ok(hud.includes(P2.toFixed(1))); assert.doesNotMatch(hud, /R=/); }
      if (step === 2) { assert.ok(hud.includes(`R=${R.toFixed(1)}`)); assert.ok(hud.includes(P3.toFixed(1))); }
      if (step < 2) assert.ok(!labels.includes(`구간의 합 = ${P3.toFixed(1)}`), 'third block value must wait for the ratio');
      else assert.ok(labels.includes(`구간의 합 = ${P3.toFixed(1)}`));
      if (step < 3) assert.ok(!labels.includes(`누적 S_3n = ${S3.toFixed(1)}`), 'cumulative answer is not drawn before step 3');
      else assert.ok(labels.includes(`누적 S_3n = ${S3.toFixed(1)}`));
      checkMath(hud);
    }
  });
});

test('telescoping review shows the split and cancellation before the endpoint answer', () => {
  eachSequenceVariant(['type6-0', 'type6-1'], (L, sc, s, q) => {
    const { termCountN: n, firstA1: a, diffD: d } = q.p;
    for (let step = 0; step <= 3; step++) {
      const { v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      if (step === 0) {
        assert.ok(hud.includes(`a_1=${a}`) && hud.includes(`d=${d}`) && hud.includes(`n=${n}`));
        assert.doesNotMatch(hud, /\\frac|\\sum/);
        assert.equal(v.tape, undefined, 'a split-sum tape cannot precede splitting');
      } else if (step < 3) {
        assert.match(hud, /a_k a_\{k\+1\}/);
        assert.ok(hud.includes(`\\frac{1}{${d}}`));
        assert.doesNotMatch(hud, /\\sum/, 'the evaluated total is still unopened');
      } else assert.ok(hud.includes(`\\frac{${n}}{${a * (a + n * d)}}`));
      checkMath(hud);
    }
  });
});

test('piecewise-cycle review follows terms before giving the period and total', () => {
  eachSequenceVariant(['type7-0', 'type7-1'], (L, sc, s, q) => {
    const a = q.p.startA1, next = x => x < 4 ? x + 2 : x - 4, a2 = next(a), a3 = next(a2);
    for (let step = 0; step <= 3; step++) {
      const { v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      assert.ok(hud.includes(`a_1=${a.toFixed(1)}`));
      if (step < 3) assert.doesNotMatch(hud, /반복|\\sum/, 'period and total belong to step 3');
      if (step < 2) assert.doesNotMatch(hud, /\\to/);
      if (step === 2) assert.ok(hud.includes(`${a.toFixed(1)} \\to ${a2.toFixed(1)} \\to ${a3.toFixed(1)}`));
      checkMath(hud);
    }
  });
});

test('backward-tree review retains inverse rules while withholding the final leaf set', () => {
  eachSequenceVariant(['type8-0', 'type8-1'], (L, sc, s, q) => {
    for (let step = 0; step <= 3; step++) {
      const { v } = draw(L, sc, { ...s, step }); const hud = chipText(v);
      assert.ok(hud.includes(`a_4 = ${q.p.targetA4}`) || hud.includes(`a_4=${q.p.targetA4}`));
      if (step < 3) assert.doesNotMatch(hud, /생존 자연수|\\sum a_1|a_1 \\in/);
      if (step === 0) assert.doesNotMatch(hud, /\\frac|y\+/);
      if (step >= 1 && step < 3) assert.match(hud, /\\frac\{y\}\{2\}/);
      if (step === 2) assert.match(hud, /자연수/);
      checkMath(hud);
    }
  });
});

test('extra sequence review panels follow their own derivation stages', () => {
  eachSequenceVariant(['br-tree', 'cyc-table', 'pt-tri-diff', 'pt-tri-sum', 'fig-repeat'], (L, sc, s, q) => {
    const steps = sc.steps(s), last = steps.length;
    for (let step = 0; step <= last; step++) {
      const { b, v } = draw(L, sc, { ...s, step });
      if (step === 0) {
        assert.equal(v.formula, '', `${sc.id}: derivation panel starts closed`);
        if (sc.id === 'pt-tri-diff' || sc.id === 'pt-tri-sum') assert.equal(v.chips.length, 0, 'coordinates are a step-1 result');
        if (sc.id === 'cyc-table') assert.ok(b.texts.filter(x => x === '?').length >= 13, 'the table starts with only given a1');
      } else if (step < last) {
        if (sc.id === 'br-tree') assert.ok(v.formula.length > 0, 'inverse branches accompany the opened candidate step');
        else assert.equal(v.formula, steps[step - 1], `${sc.id}: formula matches the currently opened derivation`);
      }
      if ((sc.id === 'pt-tri-diff' || sc.id === 'pt-tri-sum') && step >= 1) assert.ok(v.chips.length > 0, 'derived coordinates remain visible');
      if (sc.id !== 'fig-repeat' && sc.id !== 'br-tree' && step < last) assert.equal(v.notes, '', 'later endpoint/counting advice waits');
      if (step < last) assert.equal(v.tape, undefined, 'final answer tape is still closed');
      for (const text of [chipText(v), v.formula, v.notes]) checkMath(text);
    }
  });
});

test('the three-term cycle counts remainder terms for integer and fractional starts', () => {
  const L = load('alg-sequence'), sc = L.scenes.find(x => x.id === 'type7-0');
  const next = x => (x + 2) % 6;
  for (const a of [.5, 1, 2, 3.5, 4, 5.5]) for (const N of [6, 7, 8, 100]) {
    const cycle = [a, next(a), next(next(a))], total = Math.floor(N / 3) * cycle.reduce((x,y) => x+y,0) + cycle.slice(0, N % 3).reduce((x,y) => x+y,0);
    const s = { ...L.state(sc), step: 3, type7_startA1: a, type7_limitN: N }, v = sc.view(s, { tab: 'explore' });
    assert.ok(chipText(v).includes(`= ${total.toFixed(1)}$`), `a1=${a}, N=${N}: remainder contributes`);
    assert.match(v.formula, /나머지/);
    assert.match(v.notes, /이 모델.*a_1.*반복/);
    assert.match(v.notes, /다른 점화식/);
    checkMath(v.formula); checkMath(v.notes);
  }
});

test('initial disclosure and new questions reset across both complete scene registries', () => {
  for(const L of [seq,scl]) {
    assert.equal(L.def.stagedReveal,true);
    for(const sc of L.scenes) {
      const s=L.state(sc);s.step=3;s.revealed=true;
      const before=sc.problem.text(), lab={s,scene:sc,setStep(n){s.step=n;},_buildReview(){},invalidate(){}};
      L.ctx.window.lab=lab;
      L.events.click({target:{closest:()=>({})}});
      assert.equal(s.step,0,sc.id);assert.equal(s.revealed,false,sc.id);assert.notEqual(sc.problem.text(),before,sc.id);
      draw(L,sc,s,'problem');
      for(const t of [sc.problem.text(),sc.problem.answer(),...(typeof sc.steps==='function'?sc.steps(s):sc.steps||[])])checkMath(t);
    }
  }
});

test('all registered scenes draw all stages, endpoint exploration and generated geometry without nonfinite coordinates', () => {
  for(const L of [seq,scl]) for(const sc of L.scenes) {
    const s=L.state(sc);
    for(const width of [390,1440]) for(const tab of ['explore','review','problem']) for(const step of [0,1,2,3]) {
      s.step=step;try{draw(L,sc,s,tab,width);}catch(e){e.message=`${sc.id}/${tab}/${step}/${width}: ${e.message}`;throw e;}
    }
    const controls=typeof sc.controls==='function'?sc.controls(s):sc.controls||[];
    for(const id of controls) for(const edge of ['min','max']) {const st={...s,[id]:L.def.params[id][edge]};L.def.params[id].onInput?.(st);draw(L,sc,st,'explore',390);}
  }
  for(const [id,sp] of Object.entries(scl.exports.SPEC)) {
    const sc=scl.scenes.find(x=>x.id===id),s=scl.state(sc);
    for(let i=0;i<sp.list.length;i++){sp.vary.set(i);for(let step=0;step<=3;step++){s.step=step;draw(scl,sc,s,'review',390);}}
    sp.vary.set(0);
  }
});


test('reported proof, exploration and cross-scene state regressions stay resolved', () => {
  const bas=scl.scenes.find(x=>x.id==='bas-1'),bs=scl.state(bas);bs.step=3;bs.t=1;
  const ex=bas.view(bs,{tab:'explore'}),fixed=bas.view(bs,{tab:'review'});
  assert.match(ex.formula,/현재 탐구/);assert.match(ex.formula,/BC=BH\+CH/);assert.doesNotMatch(ex.formula,/3 \+ 2|= 10|= 5/);assert.notEqual(ex.formula,fixed.formula);
  for(const sc of scl.scenes) if(sc.id!=='ext-1'&&sc.id!=='ext-2') for(const t of [0,.5,1]) for(const step of [1,2,3]) {
    const st={...scl.state(sc),t,step};const before=JSON.stringify(st);checkMath(sc.view(st,{tab:'explore'}).formula);assert.equal(JSON.stringify(st),before,'view never changes the exploration state');
  }
  const adv=scl.scenes.find(x=>x.id==='adv-8'),sp=scl.exports.SPEC[adv.id];
  for(let i=0;i<sp.list.length;i++) {sp.vary.set(i);const st=scl.state(adv);st.step=2;const {B,C,D,E}=vertices(draw(scl,adv,st).b);close(area(B,C,D),area(B,C,E),'diagonal BC bisects DBEC');assert.match(sp.vary.cur().steps[1],/평행사변형.*DBEC.*대각선.*BC/);}sp.vary.set(0);
  const one=seq.scenes.find(x=>x.id==='type1-0'),three=seq.scenes.find(x=>x.id==='type3-1'),st=seq.state(one);st.abs=true;st.step=3;
  assert.ok(draw(seq,one,st,'explore').b.texts.some(t=>t.startsWith('|a_1|=')),'absolute-value labels identify transformed data');
  three.enter(st);assert.equal(st.abs,false,'unsupported scene clears inherited abs');st.abs=true;st.step=1;
  const plots=draw(seq,three,st,'explore').b.items.filter(x=>x.kind==='plot');assert.ok(plots.some(p=>p.fn(10)<0),'raw S_n remains negative even with an injected stale flag');
  const neg=seq.exports.OLDV.T1B.build(seq.exports.OLDV.T1B.pool.find(q=>q.A<0));neg.p=neg.params;
  assert.ok(seq.exports.focusFor(0,neg,'problem').y[0]<neg.g.A,'negative given term stays in view');
  const diff=seq.scenes.find(x=>x.id==='pt-tri-diff'),ds=seq.state(diff);ds.step=3;
  for(let i=0;i<5;i++){diff.vary.set(i);const q=diff.vary.cur(),out=draw(seq,diff,ds).b.texts.join(' '),sub=n=>String(n).replace(/\d/g,d=>'₀₁₂₃₄₅₆₇₈₉'[+d]);assert.ok(out.includes(`S${sub(q.N)} − S${sub(q.j)}`),'shaded endpoints follow generated question');}
  diff.vary.set(0);
});
