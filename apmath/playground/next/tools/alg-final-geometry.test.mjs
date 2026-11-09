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
