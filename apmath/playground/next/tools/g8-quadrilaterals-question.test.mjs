import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=process.env.G8_QUADRILATERALS_SOURCE_ROOT||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../labs/g8-quadrilaterals');
const Math0=Object.create(Math);let seed=173;Math0.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const ctx=vm.createContext({window:{},Math:Math0,document:{documentElement:{dataset:{}},getElementById(){return null},createElement(){return{}},head:{append(){}},addEventListener(){}}});
for(const name of ['core','t1','t2','t3','t4','t5','t6','solutions']){const file=path.join(root,name+'.js');if(fs.existsSync(file))vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:name});}
const G=ctx.window.APL_QD,scenes=ctx.window.APL_QD_GROUPS.flatMap(g=>g.scenes),by=id=>scenes.find(s=>s.id===id);
const state=(id,patch={})=>{const s={step:1};by(id).enter(s);return Object.assign(s,patch);};
const get=(id,s)=>{const D=by(id).qd,m=D.model(s),q=D.prob(m,s);return {D,m,q,answer:q.choices.find(c=>c.ok)};};
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-7,`${message}: ${a} vs ${b}`);
const angle=(a,v,b)=>Math.acos(Math.max(-1,Math.min(1,((a.x-v.x)*(b.x-v.x)+(a.y-v.y)*(b.y-v.y))/(Math.hypot(a.x-v.x,a.y-v.y)*Math.hypot(b.x-v.x,b.y-v.y)))))*180/Math.PI;
const area=ps=>Math.abs(ps.reduce((n,p,i)=>{const q=ps[(i+1)%ps.length];return n+p.x*q.y-p.y*q.x;},0))/2;
const finite=x=>typeof x==='number'?Number.isFinite(x):Array.isArray(x)?x.every(finite):x&&typeof x==='object'?Object.values(x).every(finite):true;
function board(W=390,H=310){const calls=[],b={W,H,insets:{left:0,right:0,top:0,bottom:0},pad:.02,thumb:false,calls};Object.defineProperty(b,'k',{get(){if(!b.focus)return 40;return Math.min((W-2*b.pad*Math.min(W,H))/(b.focus.x[1]-b.focus.x[0]),(H-2*b.pad*Math.min(W,H))/(b.focus.y[1]-b.focus.y[0]));}});for(const method of ['path','seg','poly','text','point','arc','right','circle','ticks','handle'])b[method]=(...args)=>{calls.push({method,args});return b;};return b;}
function draw(id,s,tab,W=390,H=310){const sc=by(id),b=board(W,H),lab={tab,s,scene:sc};sc.draw(b,s,{},lab);return b;}
function labels(b){return b.calls.filter(c=>c.method==='text').map(({args:[p,text,o]})=>{const x=b.W/2+(p.x-(b.focus.x[0]+b.focus.x[1])/2)*b.k+(o.dx||0),y=b.H/2+(p.y-(b.focus.y[0]+b.focus.y[1])/2)*b.k+(o.dy||0),size=o.size||16,w=G.textW(text,size);return {text:String(text),x0:x-w/2,x1:x+w/2,y0:y-size/2,y1:y+size/2};});}
const overlap=(a,b)=>Math.min(a.x1,b.x1)>Math.max(a.x0,b.x0)&&Math.min(a.y1,b.y1)>Math.max(a.y0,b.y0);

test('P1: mobile 66/114 degree labels remain distinct',()=>{
 const b=draw('q1-1',state('q1-1'),'explore');const a=labels(b).filter(l=>/^\d+°$/.test(l.text));assert.equal(a.length,4);
 for(let i=0;i<a.length;i++)for(let j=i+1;j<a.length;j++)assert.ok(!overlap(a[i],a[j]),`${a[i].text} overlaps ${a[j].text}`);
 for(const l of a)assert.ok(l.x0>=0&&l.y0>=0&&l.x1<=b.W&&l.y1<=b.H,`clipped ${l.text}`);
});
test('whole-side dimensions above q1-3 remain inside short and portrait stages',()=>{
 for(const [W,H] of [[1440,610],[820,310],[684,420],[390,310]])for(const w of [6,8,10])for(const beta of [50,66,90,130])for(const tab of ['problem','review']){
  const s=state('q1-3',{qaK:0,qaW:w,qaS:4,qaB:beta,qaE:2});s.step=tab==='review'?by('q1-3').steps(s).length:1;
  const b=draw('q1-3',s,tab,W,H),dimension=labels(b).filter(l=>l.text===String(w));
  assert.ok(dimension.length,'the stated whole side is still displayed');
  for(const l of dimension)assert.ok(l.x0>=0&&l.y0>=0&&l.x1<=b.W&&l.y1<=b.H,`AD=${w}, angle=${beta}, ${tab}, ${W}×${H}: ${JSON.stringify(l)}`);
 }
});
test('mobile exploration separates angle values from captions and point names',()=>{
 const a=labels(draw('q1-1',state('q1-1'),'explore'));
 for(const angleLabel of a.filter(l=>/^\d+°$/.test(l.text)))for(const caption of a.filter(l=>/포개|돌려/.test(l.text)))assert.ok(!overlap(angleLabel,caption),angleLabel.text+' overlaps the rotation instruction');
 const b=labels(draw('q1-2',state('q1-2'),'explore')),selected=b.filter(l=>['57°','33°','90°','P','A','B'].includes(l.text));
 assert.equal(selected.filter(l=>/°/.test(l.text)).length,3);
 for(let i=0;i<selected.length;i++)for(let j=i+1;j<selected.length;j++)assert.ok(!overlap(selected[i],selected[j]),selected[i].text+' overlaps '+selected[j].text);
 const c=labels(draw('q6-4',state('q6-4'),'explore')),E=c.find(l=>l.text==='E'),small=c.find(l=>l.text==='15°');
 assert.ok(E&&small&&!overlap(E,small),'the 15-degree label must not merge with the name E');
});
test('the rotating triangle remains entirely visible between its start and finish',()=>{
 for(const [W,H] of [[1000,510],[820,310],[684,420],[390,310]])for(const t of [.25,.5,.75]){
  const b=draw('q1-1',state('q1-1',{qaT:t}),'explore',W,H);
  const polygon=b.calls.find(c=>c.method==='path'&&c.args[0].length===3&&c.args[1].color==='amber');assert.ok(polygon,'the moving triangle is drawn');
  for(const p of polygon.args[0]){const x=b.W/2+(p.x-(b.focus.x[0]+b.focus.x[1])/2)*b.k,y=b.H/2+(p.y-(b.focus.y[0]+b.focus.y[1])/2)*b.k;assert.ok(x>=0&&x<=W&&y>=0&&y<=H,`rotation ${t} at ${W}×${H}: ${x},${y}`);}
 }
});
test('diagonal targets and small trapezoid angles stay separate from adjacent labels',()=>{
 const a=labels(draw('q1-5',state('q1-5'),'explore')),caption=a.find(l=>l.text.includes('같은 표시의 각')),width=a.find(l=>l.text==='10');
 assert.ok(caption&&width&&!overlap(caption,width),'equal-angle caption overlaps the upper side length');
 for(const tab of ['problem','review']){
  const s=state('q1-4',{qaK:1});s.step=by('q1-4').steps(s).length;
  const b=labels(draw('q1-4',s,tab)),target=b.find(l=>l.text===(tab==='problem'?'x':'5')),diagonal=b.find(l=>l.text==='BD=12');
  assert.ok(target&&diagonal&&!overlap(target,diagonal),'AB target overlaps BD');
 }
 for(const [W,H] of [[1000,510],[820,310],[684,420],[390,310]])for(const tab of ['problem','review','explore']){
  const s=state('q4-1',{qdTa:7,qdTb:8,qdTt:51,qdK:0});s.step=by('q4-1').steps(s).length;
  const b=draw('q4-1',s,tab,W,H),a=labels(b),angles=a.filter(l=>/^(?:51°|129°|129|x)$/.test(l.text));
  assert.ok(angles.length>=2);for(let i=0;i<angles.length;i++)for(let j=i+1;j<angles.length;j++)assert.ok(!overlap(angles[i],angles[j]),`${tab}: shallow trapezoid angle overlap`);
  for(const l of angles)assert.ok(l.x0>=0&&l.y0>=0&&l.x1<=W&&l.y1<=H,`${tab}: clipped external trapezoid angle`);
 }
});
test('angle-bisector and extension questions no longer receive unrelated theory',()=>{
 const a=by('q1-2').steps(state('q1-2')).join(' ');assert.match(a,/∠AEB/);assert.match(a,/33/);assert.doesNotMatch(a,/∠APB/);
 const b=by('q1-5').steps(state('q1-5',{qaK:1,qaPa:3,qaPb:9})).join(' ');assert.match(b,/9−3=6/);assert.match(b,/C 바깥/);
});
test('square points E and F remain on the specified segments for every generated angle',()=>{
 const s=state('q6-5');for(let i=0;i<200;i++){const{D}=get('q6-5',s);D.reroll(s);s.qfK=0;const{m}=get('q6-5',s);assert.ok(m.g2.E.x>m.g2.B.x&&m.g2.E.x<m.g2.C.x);assert.ok(m.g2.F.y>m.g2.D.y&&m.g2.F.y<m.g2.C.y);close(angle(m.g2.B,m.g2.A,m.g2.E),m.th,'given angle');}
});
test('parallel-equal-side perimeter uses the stated AB=4, independent of exploration height or AD',()=>{
 for(const h of [3,5])for(const ad of [4,7]){
  const s=state('q2-2',{qbK:1,qbLen:ad,qbBc:7,qbH:h});const{m,q}=get('q2-2',s),steps=by('q2-2').steps(s).join(' ');
  assert.match(q.stem,/AB=4/);assert.ok(steps.includes(`2×(${m.bc}+4)=${2*(m.bc+4)}`));
 }
});
test('32 scenes retain five distinct choices and target-specific solutions over 120 variants each',()=>{
 assert.equal(scenes.length,32);const keyCounts={};for(const sc of scenes){const s=state(sc.id),seen=new Set();for(let i=0;i<120;i++){const{D,m,q,answer}=get(sc.id,s);assert.ok(finite(m),sc.id);assert.equal(q.choices.length,5);assert.equal(q.choices.filter(c=>c.ok).length,1);assert.equal(new Set(q.choices.map(c=>c.p)).size,5);assert.equal(typeof D.solve,'function',sc.id);const steps=sc.steps(s);assert.ok(steps.length>=4);assert.match(steps.at(-1),/따라서/);assert.ok(steps.at(-1).includes(answer.t??answer.h??answer.p));assert.doesNotMatch(steps.join(' '),/undefined|NaN|Infinity|√|\\sqrt/);seen.add(q.key);D.reroll(s);}keyCounts[sc.id]=seen.size;assert.ok(seen.size>=2,sc.id);}console.log('3840 current questions; scene/key coverage',JSON.stringify(keyCounts));
});
test('independent geometry oracles agree with answers for eight varied construction families',()=>{
 for(let i=0;i<40;i++)for(const id of ['q1-2','q1-5','q3-1','q3-2','q5-2','q5-4','q6-3','q6-5','q6-6']){const s=state(id);get(id,s).D.reroll(s);const{m,answer}=get(id,s);let expected;
 if(id==='q1-2')expected=m.K===0?angle(m.p.A,m.E0,m.p.B):angle(m.p.A,m.E1,m.p.B);
 if(id==='q1-5')expected=m.K?Math.hypot(m.Eq.x-m.pq.C.x,m.Eq.y-m.pq.C.y):Math.hypot(m.E.x-m.p.C.x,m.E.y-m.p.C.y);
 if(id==='q3-1')expected=m.K===0?2*m.th:m.acv/2;
 if(id==='q3-2')expected=m.K===0?(180-m.al)/2:90-m.th;
 if(id==='q5-2')expected=m.K===0?area([m.A,m.B,m.D]):area([m.A,m.D,m.C]);
 if(id==='q5-4')expected=m.K===0?area([m.P,m.C,m.D]):area([m.P,m.D,m.A]);
 if(id==='q6-3')expected=m.K===0?angle(m.A,m.D,m.E):angle(m.A,m.E,m.D);
 if(id==='q6-5')expected=m.K===0?angle(m.g2.B,m.g2.F,m.g2.C):Math.hypot(m.F.x-m.D.x,m.F.y-m.D.y);
 if(id==='q6-6')expected=m.K===0?area(m.over):area([m.A,m.B,m.C,m.D]);
 close(parseFloat(answer.p),expected,id);
 }
});
test('problem and step one have the same geometry; every step renders finite numbers at all stage sizes',()=>{
 for(const sc of scenes){const s=state(sc.id);for(let j=0;j<6;j++){const{D}=get(sc.id,s);if(j)D.reroll(s);s.step=1;const a=draw(sc.id,s,'problem').calls,b=draw(sc.id,s,'review').calls;assert.deepEqual(JSON.parse(JSON.stringify(b)),JSON.parse(JSON.stringify(a)),sc.id+' step1');for(const [W,H]of[[1000,700],[820,600],[684,500],[390,310]])for(let k=1;k<=sc.steps(s).length;k++){s.step=k;assert.ok(finite(draw(sc.id,s,'review',W,H).calls),`${sc.id} step${k} ${W}`);}}}
});
