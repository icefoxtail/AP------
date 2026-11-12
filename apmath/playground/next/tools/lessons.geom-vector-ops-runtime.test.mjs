import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {load} from './helpers/vector-ops-lesson-runtime.mjs';
const lab=await load(),video=lab.video,plain=x=>JSON.parse(JSON.stringify(x));
const lessons=id=>video.lessonList(lab.def.lessons[id]),base=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const sig=f=>createHash('sha256').update(JSON.stringify({paths:f.paths,points:f.points,canvas:f.canvas})).digest('hex');
function apply(c,t,b,entry=false){const s=video.stateAt(c,t,b);Object.assign(lab.s,s.nums,s.sets,{lessonOn:!entry,lessonEntry:entry,step:s.step,part:s.part});lab.tab='review';return lab.draw();}
function select(id,label){lab.go(id);const q=lessons(id).find(x=>x.label===label);assert.ok(q);return {q,c:video.compileLesson(q),b:base()};}

test('all twelve catalog scenes bind 54 valid independent buttons and load the shared Player',t=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),ctx);
 assert.equal(ctx.window.APLab.catalog.labs.find(x=>x.id==='geom-vector-ops').sceneTotal,12);
 assert.equal(lab.list.length,12);assert.deepEqual(Object.keys(lab.def.lessons).sort(),Array.from(lab.list,x=>x.id).sort());
 let count=0,originals=0,concepts=0;
 for(const sc of lab.list){
  assert.notEqual(sc,lab.api.scenes.find(x=>x.id===sc.id),'real shell copies scenes');
  assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[sc.id])),{errors:[],warnings:[]});
  for(const q of lessons(sc.id)){
   count++;const start=q.chapters[0].cues[0].set,c=video.compileLesson(q);start.lvoConcept?concepts++:originals++;
   if(!start.lvoConcept)assert.equal(start.lvoQuestion,lab.api.question(sc.id,start.lvoIndex,start.lvoAsk));
   assert.equal(c.length,60);assert.ok(Object.keys(c.tracks).every(k=>k.startsWith('lvo')));
   for(const ch of q.chapters)for(const cue of ch.cues)for(const m of String(cue.say||'').matchAll(/\$([^$]+)\$/g))lab.katex.renderToString(m[1],{throwOnError:true});
  }
 }
 assert.equal(count,54);assert.equal(originals,28);assert.equal(concepts,26);assert.ok(lab.loaded.includes('../kit/apl-player.js'));assert.deepEqual(lab.missing,[]);
 t.diagnostic('12 scenes / 54 lessons = 28 source/type goals + 26 concepts; validator0/0');
});
test('all cue/movement boundaries replay finite native geometry and preserve manual controls',t=>{
 let frames=0;
 for(const sc of lab.list)for(const q of lessons(sc.id)){
  lab.go(sc.id);Object.assign(lab.s,{slideT:.37,th3:77,hx_t:.43,rg_t:.28});
  const nativeKeys=Object.keys(lab.api.initial(sc.id)),saved=Object.fromEntries(nativeKeys.map(k=>[k,lab.s[k]]));
  const c=video.compileLesson(q),b=base(),times=new Set([0,.9,c.length]);
  c.chapters.forEach((ch,i)=>q.chapters[i].cues.forEach(cue=>{times.add(ch.at+cue.at);if(cue.to){times.add(ch.at+cue.at+cue.dur/2);times.add(ch.at+cue.at+cue.dur);}}));
  let first,moving;
  for(const t of [...times].sort((a,b)=>a-b)){
   const f=apply(c,t,b);frames++;assert.ok(f.canvas.some(x=>x.name==='lineTo'||x.name==='arc'),sc.id+'/'+q.label);
   assert.ok(f.points.length+f.circles.length+f.paths.length>0,'actual native geometry');assert.deepEqual(plain(f.value),{tape:null});
   if(t===0)first=sig(f);if(t===.9)moving=sig(f);
   for(const [k,v]of Object.entries(saved))assert.deepEqual(lab.s[k],v,'preserved '+sc.id+'/'+k);
   assert.equal(lab.s.lvoShowAnswer,t>=48);
  }
  assert.notEqual(first,moving,sc.id+'/'+q.label+' first-second motion');
  assert.equal(sig(apply(c,60,b,true)),first,'entry resets native picture');
 }
 t.diagnostic(frames+' native Board/canvas cue states; browser/mobile/independent visual NOT_RUN');
});
test('first original problems and actual new-problem selections survive play/replay/exit',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);lab.tab='problem';lab.newProblem();const picked=plain(sc.vary.cur()),n=sc.vary.n,q=sc.problem.text(lab.s);
  const c=video.compileLesson(lessons(sc.id)[0]),b=base(),f=apply(c,0,b);apply(c,60,b);assert.equal(sig(apply(c,0,b)),sig(f));
  assert.deepEqual(plain(sc.vary.cur()),picked);assert.equal(sc.vary.n,n);
  lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.tab='problem';lab.draw();assert.equal(sc.problem.text(lab.s),q);
 }
});
test('answers and unrelated native numeric labels stay closed until their caption',()=>{
 let {c,b}=select('hex5','합의크기');
 assert.ok(!apply(c,36,b).texts.some(x=>/AO\s*=/.test(x)));assert.ok(apply(c,48,b).texts.some(x=>/AO/.test(x)));
 ({c,b}=select('4-A','넓이비'));assert.ok(!apply(c,36,b).texts.some(x=>/Sₐ=|Sᵦ=|Sᵧ=/.test(x)));
 ({c,b}=select('3-C','교차하는원'));assert.ok(apply(c,48,b).points.some(x=>Math.abs(x.point.x)<1e-7&&Math.abs(x.point.y-Math.sqrt(4-1.3**2))<1e-7));
});
test('external Player state drives the original renderer without changing the live state',()=>{
 const {c,b}=select('3-A','원안의점'),s=video.stateAt(c,60,b),external={...lab.s,...s.nums,...s.sets,lessonOn:true,lessonEntry:false,step:s.step};
 const before=plain(lab.s),seen=[],circle=lab.board.circle;lab.board.circle=function(p,r,o){seen.push({p:{...p},r});return circle.call(this,p,r,o);};
 try{lab.board.begin();lab.scene.draw(lab.board,external,{},lab);lab.board.end();}finally{lab.board.circle=circle;}
 assert.ok(seen.some(x=>Math.abs(x.p.x-1)<1e-8&&Math.abs(x.p.y)<1e-8&&x.r===2.5));assert.deepEqual(plain(lab.s),before);
});
test('viewport and original native drag controls remain functional after playback',()=>{
 lab.go('1-A');lab.draw();Object.assign(lab.board,{zoom:1.4,panX:13,panY:-8});
 const before={zoom:lab.board.zoom,panX:lab.board.panX,panY:lab.board.panY},c=video.compileLesson(lessons('1-A')[0]),b=base();apply(c,60,b);
 lab.s.lessonOn=false;lab.s.lessonEntry=false;lab.tab='explore';const f=lab.draw();for(const k of Object.keys(before))assert.equal(lab.board[k],before[k]);
 const handle=f.handles.find(x=>x.id==='A');assert.ok(handle);handle.options.drag({x:3,y:5});assert.equal(lab.s.Ax,3);assert.equal(lab.s.Ay,5);
});
test('source-only fallback still loads and draws all twelve original scenes',async()=>{
 const standalone=await load({sourceOnly:true});assert.deepEqual(plain(standalone.def.lessons),{});
 for(const sc of standalone.list){standalone.go(sc.id);standalone.draw();}
});

test('actual Player settle and release preserve manual values on stop and completion',()=>{
 for(const sc of lab.list){
  lab.go(sc.id);Object.assign(lab.s,{slideT:.31,th3:71,hx_t:.29,rg_t:.43});lab.draw();
  const saved=Object.fromEntries(Object.keys(lab.api.initial(sc.id)).map(k=>[k,lab.s[k]]));
  for(const q of lessons(sc.id))for(const ended of [false,true]){
   const c=video.compileLesson(q),b=base(),time=ended?c.length:26,player=Object.create(lab.aplab.Player.prototype);
   Object.assign(player,{lab,cs:c,base:b,t:time,state:ended?'ended':'playing',_lessonOn:true,_pre:{step:0,part:null}});
   apply(c,time,b);player._settle();player._release();lab.draw();
   assert.equal(lab.tab,'explore');assert.equal(lab.s.lessonOn,undefined);
   for(const [k,v]of Object.entries(saved))assert.deepEqual(lab.s[k],v,'Player exit preserves '+sc.id+'/'+k);
  }
 }
});
