/** Narrow initial problem diagrams must leave their given conditions legible. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {loadAngles, segmentHitsRect, overlap, plain} from './test-support/points-lines-figure.mjs';
const baselineAt=process.argv.indexOf('--baseline');
const runtime=loadAngles({ref:baselineAt<0?null:process.argv[baselineAt+1]});
const layouts=[[360,291],[390,309]];
const visible=o=>o.color!=null&&(o.alpha??1)>.05&&(o.width??1)>0;
function inside(p,l){assert.ok(l.box.left>=3&&l.box.right<=p.W-3&&l.box.top>=3&&l.box.bottom<=p.H-p.bottom-3,`${l.text} must stay fully within the usable problem stage: ${JSON.stringify(l.box)}`);}
function veContract(p){
  const rays=p.segments.filter(s=>s.options.color==='sky'&&s.options.width===4.5&&visible(s.options));
  assert.equal(rays.length,3,'the whole horizontal line and both opposite rays are painted');
  const horizontal=rays.find(s=>Math.abs(s.from.y-s.to.y)<1e-8);assert.ok(Math.abs(horizontal.from.x-horizontal.to.x)>=170,'the crossing lines have enough scale for both algebraic givens');
  const labels=p.labels.filter(l=>l.text.includes('x'));assert.equal(labels.length,2,'both original algebraic conditions remain visible');
  for(const l of labels){inside(p,l);for(const ray of rays)assert.ok(!segmentHitsRect(ray.from,ray.to,l.box,1),`${l.text} cannot cover either line defining its angle`);}
  assert.ok(!overlap(labels[0].box,labels[1].box,4));assert.ok(!p.labels.some(l=>/^x\s*=/.test(l.text)),'the solution x is not exposed on initial problem entry');
}
function trContract(p,expected){
  const poly=p.polygons.find(x=>x.points.length===3&&x.options.color==='sky'&&visible(x.options));assert.ok(poly,'the supplied right triangle remains painted');
  const [B,C,A]=poly.points,base=Math.hypot(C.x-B.x,C.y-B.y),height=Math.hypot(A.x-C.x,A.y-C.y);assert.ok(base>=80&&height>=80,`the original triangle needs room for all three givens: ${base}×${height}`);
  const [pb,ph,pab]=expected;assert.ok(Math.abs(base/height-pb/ph)<1e-8,'layout preserves the right-triangle side ratio');
  const conditions=p.labels.filter(l=>/^(AB|BC|CA) =/.test(l.text));assert.equal(conditions.length,3);
  for(const l of conditions){inside(p,l);for(let i=0;i<3;i++)assert.ok(!segmentHitsRect(poly.points[i],poly.points[(i+1)%3],l.box,1),`${l.text} must be outside the original triangle edges`);}
  const ab=conditions.find(l=>l.text.startsWith('AB ='));assert.equal(ab.text,`AB = ${pab} cm`);
  for(const l of p.labels)inside(p,l);
  for(let i=0;i<p.labels.length;i++)for(let j=i+1;j<p.labels.length;j++)assert.ok(!overlap(p.labels[i].box,p.labels[j].box,1),`${p.labels[i].text}/${p.labels[j].text} overlap`);
  assert.ok(!p.labels.some(l=>l.text.includes('거리 =')),'initial problem must not disclose the requested distance');
}
for(const [W,H] of layouts)test(`ve ${W}px first problem separates the two given expressions from the crossing lines`,()=>{
  const lab=runtime.create('ve',W,387);const p=lab.draw('problem',1,H);veContract(p);assert.equal(lab.s.ve_x,8);assert.equal(lab.s.revealed,false);assert.equal(lab.scene.__spec.problem(lab.scene.__sv(lab.s)).choices.find(x=>x.ok).v,15);
});
for(const [W,H] of layouts)test(`tr ${W}px first problem keeps all four supplied right-triangle families readable`,()=>{
  const lab=runtime.create('tr',W,387),q=lab.scene.__sv(lab.s);const triples=[[3,4,5],[4,3,5],[6,8,10],[8,6,10]];
  for(let ti=0;ti<triples.length;ti++){q.ti=ti;trContract(lab.draw('problem',1,H),triples[ti]);assert.equal(lab.scene.__spec.problem(q).choices.find(x=>x.ok).v,triples[ti][1]);assert.equal(lab.s.revealed,false);}
});
test('ve rerolled angle families keep labels clear and retain the same equation solution',()=>{
  let cases=0;
  for(const [W,H] of layouts){const lab=runtime.create('ve',W,387),q=lab.scene.__sv(lab.s);
    for(const a1 of [2,3,4,5,6])for(const a2 of [2,3,4,5,6])if(a1!==a2)for(const x of [8,15,23,30])for(const angle of [40,55,90,120,140]){
      const b1=angle-a1*x,b2=angle-a2*x;if(!b1||!b2||Math.abs(b1)>60||Math.abs(b2)>60)continue;
      Object.assign(q,{a1,a2,b1,b2,x:8,seed:0});veContract(lab.draw('problem',1,H));assert.equal(lab.scene.__spec.problem(q).choices.find(v=>v.ok).v,x);cases++;
    }
  }
  assert.ok(cases>=200,`meaningful changed-equation coverage, got${cases}`);
});
test('narrow problem framing restores the original exploration and preserves pan, zoom and learner state',()=>{
  for(const id of ['ve','tr'])for(const [W,H] of layouts){const lab=runtime.create(id,W,387);const before=lab.draw();const original=plain(lab.s);lab.board.zoom=1.4;lab.board.panX=17;lab.board.panY=-13;lab.draw('problem',1,H);assert.deepEqual([lab.board.zoom,lab.board.panX,lab.board.panY],[1.4,17,-13]);assert.deepEqual(plain(lab.s),original);lab.board.zoom=1;lab.board.panX=0;lab.board.panY=0;assert.deepEqual(lab.draw('explore',1,387),before);}
});
if(process.env.APMATH_POINTS_REPAIR_COMPARE_SOURCE)test('all unrelated scenes plus ve/tr wide, inquiry and review render exactly as before',()=>{
  const old=loadAngles({sourceFile:process.env.APMATH_POINTS_REPAIR_COMPARE_SOURCE});
  for(const scene of runtime.scenes)for(const [W,H] of [[360,387],[390,411],[683,490],[820,461],[1039,656]])for(const tab of ['explore','problem','review'])for(const step of tab==='review'?[1,2,3,4]:[1]){
    if(W<560&&(scene.id==='ck1'||(['ve','tr'].includes(scene.id)&&tab==='problem')))continue;
    const a=runtime.create(scene.id,W,H).draw(tab,step),b=old.create(scene.id,W,H).draw(tab,step);assert.deepEqual(plain(a),plain(b),`${scene.id}/${W}/${tab}/${step}`);
  }
});
