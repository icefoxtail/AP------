/** Actual ck2 360px followup:90° touches numeral2;25.5° is hidden by the minute handle.
 * Production Board/scene geometry contracts. Actual Chromium visual review remains separate.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {loadAngles, overlap, plain} from './test-support/points-lines-figure.mjs';
const arg=name=>{const i=process.argv.indexOf(name);return i<0?null:process.argv[i+1];};
const runtime=loadAngles({ref:arg('--baseline')});
const views=[[360,387,60,0],[390,411,60,0],[820,461,60,0],[683,528,56,16],[1039,652,56,16]];
const hasRef=(o,ref)=>Array.isArray(o.ref)?o.ref.includes(ref):o.ref===ref;
const close=(a,b,why)=>assert.ok(Math.abs(a-b)<1e-7,`${why}: ${a}/${b}`);
const visible=o=>o.color!=null&&(o.alpha??1)>.05&&(o.width??1)>0;
function clearClock(p,reason){
 const numerals=p.labels.filter(l=>/^(?:[1-9]|1[0-2])$/.test(l.text));assert.equal(numerals.length,12,`${reason}: twelve numerals`);
 const face=p.circles.find(c=>c.world[0]===0&&c.world[1]===0&&visible(c.options));assert.ok(face,`${reason}: clock contour`);
 const hands=p.handles.filter(h=>h.draggable&&['hh','mh'].includes(h.id));assert.equal(hands.length,2);
 for(const l of p.labels.filter(l=>l.text.includes('°'))){
  for(const n of numerals)assert.ok(!overlap(l.box,n.box,2),`${reason}: ${l.text} touches clock numeral${n.text}`);
  for(const h of hands)assert.ok(!overlap(l.box,{left:h.x-10,right:h.x+10,top:h.y-10,bottom:h.y+10},2),`${reason}: ${l.text} is hidden by ${h.id} handle`);
  assert.ok(l.box.left>=0&&l.box.right<=p.W&&l.box.top>=0&&l.box.bottom<=p.H-p.bottom,`${reason}: numeric condition stays in the usable stage`);
 }
 return face;
}
function directionAndAnswer(lab,p,h,m){
 const face=p.circles.find(c=>c.world[0]===0&&c.world[1]===0),q=lab.scene.__sv(lab.s);
 const hour=(h%12)*30+m/2,minute=6*m,raw=Math.abs(hour-minute),answer=Math.min(raw,360-raw);
 for(const[ref,a,length]of[['h',hour,.42],['m',minute,.63]]){
  const hand=p.segments.find(s=>hasRef(s.options,ref)&&visible(s.options)&&!s.options.dash);assert.ok(hand,`painted ${ref} hand`);
  close(hand.to.x-face.at.x,Math.sin(a*Math.PI/180)*face.radius*length,`${ref} x`);
  close(hand.to.y-face.at.y,-Math.cos(a*Math.PI/180)*face.radius*length,`${ref} y`);
 }
 assert.equal(Number(lab.scene.__spec.problem(q).choices.find(c=>c.ok).t.replace('°','')),answer);
 return answer;
}
test('native phone/portrait playback and first-review values stay clear of numerals and hand handles',()=>{
 for(const view of views.slice(0,3)){
  const lab=runtime.create('ck2',...view),q=lab.scene.__sv(lab.s);q.h=3;q.m=21;
  const moving=lab.draw();clearClock(moving,`${view[0]}/3:21 moving`);
  assert.ok(moving.labels.some(l=>hasRef(l.options,'g')&&l.text.includes('25.5°')),'angle25.5 remains explicitly readable');
  const first=lab.draw('review',1);clearClock(first,`${view[0]}/first-review`);
  assert.ok(first.labels.some(l=>hasRef(l.options,'h')&&l.text.includes('90°')),'original90degree starting condition remains explicit');
  assert.ok(first.arcs.some(a=>hasRef(a.options,'h')),'starting hour wedge remains painted');
 }
});
test('all720 times on each small actual stage retain readable exact angles and both mathematical hands',t=>{
 let count=0;
 for(const view of views.slice(0,3)){
  const lab=runtime.create('ck2',...view),q=lab.scene.__sv(lab.s);
  for(let h=1;h<=12;h++)for(let m=0;m<60;m++){
   q.h=h;q.m=m;const p=lab.draw();clearClock(p,`${view[0]}/${h}:${m}`);
   const answer=directionAndAnswer(lab,p,h,m);
   assert.ok(p.labels.some(l=>hasRef(l.options,'g')&&l.text.includes(`${answer}°`)),'exact smaller angle remains in its original calculation stage');
   assert.ok(p.arcs.some(a=>hasRef(a.options,'g'))||answer===0,'smaller-angle arc remains visible');count++;
  }
 }
 t.diagnostic(`${count} source-bound viewport/time states; no actual screenshot PASS inferred`);
});
test('question/review disclosure, animation, hand drag and return preserve the original state behavior',()=>{
 for(const view of views){
  const lab=runtime.create('ck2',...view),q=lab.scene.__sv(lab.s),spec=lab.scene.__spec;
  for(const[h,m]of[[3,21],[9,59]]){
   q.h=h;q.m=m;lab.draw();
   for(let step=1;step<=4;step++){
    const p=lab.draw('review',step);
    if(view[0]<=820&&view[0]!==683)clearClock(p,`${view[0]}/review${step}/${h}:${m}`);
    const values=p.labels.filter(l=>l.text.includes('°')&&hasRef(l.options,'g'));assert.equal(values.length>0,step>=4,'angle answer appears only at original final review');
    if(step>=3)assert.ok(p.labels.some(l=>hasRef(l.options,'m')&&l.text.includes('따라잡음')));
    directionAndAnswer(lab,p,h,m);
   }
   const height=view[0]===360?291:view[0]===390?309:view[1];const problem=lab.draw('problem',1,height);
   assert.ok(!problem.labels.some(l=>/°|=/.test(l.text)),'problem remains an unanswered clock');assert.equal(lab.s.revealed,false);
  }
  q.h=3;q.m=20;q.acc=0;lab.s.playing=true;assert.equal(spec.tick(q,.17),true);assert.equal(q.m,21);lab.s.playing=false;
  lab.draw();const handle=lab.board.handles.find(h=>h.id==='mh');assert.equal(typeof handle.drag,'function');handle.drag({x:Math.sin(84*Math.PI/180),y:-Math.cos(84*Math.PI/180)});assert.equal(q.m,14);
  lab.scene.enter(lab.s,lab);assert.equal(q.m,20);assert.equal(lab.s.playing,false);
 }
});
if(arg('--compare-scope'))test('normal initial clocks and all unrelated angle scenes remain exact',t=>{
 const old=loadAngles({ref:arg('--compare-scope')});let count=0;
 for(const scene of runtime.scenes)for(const v of views)for(const mode of ['explore','problem','review']){
  if(scene.id==='ck2'&&mode==='review')continue;
  const a=runtime.create(scene.id,...v),b=old.create(scene.id,...v),pa=a.draw(mode),pb=b.draw(mode);
  assert.deepEqual(plain(pa),plain(pb),`${scene.id}/${v[0]}/${mode}: initial/unrelated output`);count++;
 }
 for(const v of views.slice(3))for(let step=1;step<=4;step++)assert.deepEqual(plain(runtime.create('ck2',...v).draw('review',step)),plain(old.create('ck2',...v).draw('review',step)),`large original clock review${step}`);
 t.diagnostic(`${count} registered scene/view/tab comparisons plus8large-clock review states`);
});
