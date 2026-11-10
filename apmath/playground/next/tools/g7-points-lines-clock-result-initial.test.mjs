/** A clock's angle result must not erase its twelve numerals on a small stage. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {loadAngles, overlap, plain} from './test-support/points-lines-figure.mjs';
const baselineAt=process.argv.indexOf('--baseline');
const runtime=loadAngles({ref:baselineAt<0?null:process.argv[baselineAt+1]});
const hasRef=(o,ref)=>Array.isArray(o.ref)?o.ref.includes(ref):o.ref===ref;
const visible=o=>o.color!=null&&(o.alpha??1)>.05&&(o.width??1)>0;
function clockReadable(p,expected,reason){
  const numerals=p.labels.filter(l=>/^(?:[1-9]|1[0-2])$/.test(l.text));assert.equal(numerals.length,12,`${reason}: twelve visible numerals`);
  const face=p.circles.find(c=>c.world[0]===0&&c.world[1]===0&&c.options.color&&c.options.alpha>0);assert.ok(face,`${reason}: original clock face`);
  for(const l of p.labels.filter(l=>l.text.includes('°')))for(const n of numerals)assert.ok(!overlap(l.box,n.box,2),`${reason}: ${l.text} overlaps clock numeral ${n.text}`);
  const result=p.labels.filter(l=>hasRef(l.options,'g'));
  assert.ok(result.some(l=>l.text.includes(`${expected}°`)),`${reason}: the exact angle remains explicitly readable`);
  assert.ok(p.arcs.some(a=>hasRef(a.options,'g'))||expected===0,`${reason}: visible smaller-angle arcs are retained`);
  for(const ref of ['h','m'])assert.ok(p.segments.some(s=>hasRef(s.options,ref)&&visible(s.options)),`${reason}: original hand ${ref}`);
  assert.equal(p.handles.filter(h=>h.draggable&&['hh','mh'].includes(h.id)).length,2);
}
for(const [W,H] of [[360,387],[390,411]])test(`ck1 ${W}px initial angle result stays clear of the clock face numerals`,()=>{
  const lab=runtime.create('ck1',W,H),p=lab.draw();clockReadable(p,124.5,`${W}/initial`);assert.equal(lab.s.revealed,false);assert.equal(lab.s.playing,false);
});
test('all720 hour/minute states retain correct readable results and the original hand directions',()=>{
  const lab=runtime.create('ck1',360,387),q=lab.scene.__sv(lab.s);
  for(let h=1;h<=12;h++)for(let m=0;m<60;m++){
    q.h=h;q.m=m;const hour=(h%12)*30+m/2,minute=6*m,raw=Math.abs(hour-minute),angle=Math.min(raw,360-raw);const p=lab.draw();clockReadable(p,angle,`${h}:${m}`);
    const face=p.circles.find(c=>c.world[0]===0&&c.world[1]===0);
    for(const [ref,a,length] of [['h',hour,.42],['m',minute,.63]]){const hand=p.segments.find(s=>hasRef(s.options,ref)&&!s.options.dash);assert.ok(Math.abs(hand.to.x-face.at.x-Math.sin(a*Math.PI/180)*face.radius*length)<1e-7);assert.ok(Math.abs(hand.to.y-face.at.y+Math.cos(a*Math.PI/180)*face.radius*length)<1e-7);}
    assert.equal(Number(lab.scene.__spec.problem(q).choices.find(c=>c.ok).t.replace('°','')),angle);
  }
});
test('clock review retains its ordered calculations and problem mode still withholds them',()=>{
  for(const [W,H,PH] of [[360,387,291],[390,411,309]]){
    const lab=runtime.create('ck1',W,H);for(let step=1;step<=3;step++){
      const p=lab.draw('review',step),refs=p.labels.filter(l=>l.text.includes('°')).map(l=>l.options.ref);
      assert.ok(refs.includes('h'));assert.equal(refs.includes('m'),step>=2);assert.equal(refs.includes('g'),step>=3);
      if(step===3)clockReadable(p,124.5,`${W}/final-review`);
    }
    const problem=lab.draw('problem',1,PH);assert.ok(!problem.labels.some(l=>l.text.includes('°')));assert.equal(lab.s.revealed,false);
    clockReadable(lab.draw('explore',1,H),124.5,`${W}/returned`);
  }
});
if(process.env.APMATH_POINTS_REPAIR_COMPARE_SOURCE)test('wide clock drawing and all ck2 modes remain exactly equal to the pre-repair source',()=>{
  const old=loadAngles({sourceFile:process.env.APMATH_POINTS_REPAIR_COMPARE_SOURCE});
  for(const id of ['ck1','ck2'])for(const [W,H] of [[360,387],[390,411],[683,490],[820,461],[1039,656]])for(const tab of ['explore','problem','review'])for(const step of tab==='review'?[1,2,3]:[1]){
    if(id==='ck1'&&W<560)continue;
    const a=runtime.create(id,W,H).draw(tab,step),b=old.create(id,W,H).draw(tab,step);assert.deepEqual(plain(a),plain(b),`${id}/${W}/${tab}/${step}`);
  }
});
