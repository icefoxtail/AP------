// Production HTML/Board, shell scene copies and common Player state transitions.
// These VM checks do not claim browser/mobile/independent visual approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { load } from './helpers/probability-lesson-runtime.mjs';
const lab=await load(),video=lab.video,plain=x=>JSON.parse(JSON.stringify(x));
const lessons=id=>video.lessonList(lab.def.lessons[id]),first=l=>l.chapters[0].cues[0].set;
const baseline=()=>({nums:{...lab.s},sets:{...lab.s},step:0,part:null});
const rawKeys=Object.keys(lab.api.initial()),manual=s=>Object.fromEntries(rawKeys.map(k=>[k,s[k]]));
const signature=f=>JSON.stringify({polygons:f.polygons,points:f.points,handles:f.handles.map(h=>[h.id,h.point]),segments:f.segments,texts:f.texts,canvas:f.canvas,focus:f.focus});
const packetSignature=p=>JSON.stringify(p,(_,v)=>Object.prototype.toString.call(v)==='[object Map]'?Array.from(v):v);
const near=(a,b,msg='')=>assert.ok(Math.abs(a-b)<1e-7,`${msg}: ${a} ≈ ${b}`);
function apply(cs,time,base,entry=false){const s=video.stateAt(cs,time,base);Object.assign(lab.s,s.nums,s.sets,{lessonOn:!entry,lessonEntry:entry,step:s.step,part:s.part});lab.tab='review';return lab.draw();}
function prepare(id,name){lab.go(id);const lesson=lessons(id).find(l=>l.label===name);assert.ok(lesson,`${id}/${name}`);return{lesson,cs:video.compileLesson(lesson),base:baseline()};}
const center=p=>({x:(p.points[0].x+p.points[2].x)/2,y:(p.points[0].y+p.points[2].y)/2});
const area=p=>Math.abs((p.points[1].x-p.points[0].x)*(p.points[2].y-p.points[0].y));
const textAt=(f,p)=>f.textItems.filter(t=>Math.abs(t.world.x-p.x)<1e-7&&Math.abs(t.world.y-p.y)<1e-7).map(t=>t.text);
function trellis(f){
  const rows=new Map(f.textItems.filter(t=>t.options.align==='right'&&/^[−-]?\d+$/.test(t.text)).map(t=>[Number(t.text.replace('−','-')),t.world.y]));
  const xs=[...new Set(f.polygons.map(p=>center(p).x))].sort((a,b)=>a-b);
  return{rows,xs,node:(t,k)=>f.polygons.find(p=>Math.abs(center(p).x-xs[t])<1e-7&&Math.abs(center(p).y-rows.get(k))<1e-7)};
}

test('five catalog scenes bind 10 registered source goals and 17 actual inquiry concepts',t=>{
  const context={window:{}};vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-catalog.js',import.meta.url),'utf8'),context);
  const cat=context.window.APLab.catalog.labs.find(x=>x.id==='prob-probability'),ids=Array.from(lab.list,s=>s.id);
  assert.equal(cat.sceneTotal,5);assert.deepEqual(ids,['grid','cond','rep-walk','rep-ball','rep-coin']);assert.deepEqual(Object.keys(lab.def.lessons).sort(),ids.toSorted());
  const goals={grid:['차가이인확률','합사건확률','여사건확률'],cond:['주머니역확률','열조건확률','행조건확률'],'rep-walk':['제자리이동','되돌아이동'],'rep-ball':['분수의합'],'rep-coin':['같은면조건']};
  let total=0,originals=0;
  for(const[i,id]of ids.entries()){
    assert.notEqual(lab.list[i],lab.def.scenes[i],'actual shell creates scene copies');assert.equal(lab.list[i].id,lab.def.scenes[i].id);
    assert.deepEqual(plain(video.validateLessonSet(lab.def.lessons[id])),{errors:[],warnings:[]},id);
    assert.deepEqual(plain(lessons(id).filter(l=>!first(l).lppConcept).map(l=>l.label)),goals[id]);
    for(const l of lessons(id)){
      total++;const init=first(l),cs=video.compileLesson(l);assert.ok(l.chapters.length>=5&&l.chapters.length<=6);assert.ok(cs.length>=60&&cs.length<=90);assert.equal(init.lppShowAnswer,false);
      if(!init.lppConcept){originals++;assert.equal(init.lppQuestion,lab.api.question(id,init.lppPacket));}
      assert.ok(cs.pins.length>=3);assert.ok(Object.keys(cs.tracks).every(k=>k.startsWith('lpp')));
      for(const k of Object.keys(cs.tracks))assert.ok(Number.isFinite(cs.start[k]));
      for(const txt of [l.answer,init.lppQuestion,...l.chapters.flatMap(ch=>ch.cues.map(c=>c.say||''))])for(const m of txt.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>lab.katex.renderToString(m[1],{throwOnError:true}),`${id}/${l.label}: ${m[1]}`);
    }
  }
  for(const src of ['../kit/apl-video-core.js','../kit/apl-player.js','../kit/apl-toc.js','prob-probability/lesson-core.js','prob-probability/lesson-a.js','prob-probability/lesson-b.js'])assert.ok(lab.loaded.includes(src));
  assert.equal(total,27);assert.equal(originals,10);assert.match(fs.readFileSync(new URL('../kit/apl-player.js',import.meta.url),'utf8'),/const DEFAULT_PLAYBACK_RATE = 2;/);
  t.diagnostic('5 scenes / 27 lessons = 10 source goals + 17 original inquiry concepts; validator errors/warnings 0');
});

test('all cue boundaries and numerical midpoints run the actual deterministic native figures',t=>{
  let frames=0;
  for(const sc of lab.list)for(const l of lessons(sc.id)){
    lab.go(sc.id);const cs=video.compileLesson(l),base=baseline(),packet=lab.api.first(sc.id,first(l).lppPacket),saved=packetSignature(packet),rng=lab.randomCalls,times=new Set([0,.9,cs.length]);
    for(const[i,ch]of cs.chapters.entries())for(const c of l.chapters[i].cues){times.add(ch.at+c.at);if(c.to)times.add(ch.at+c.at+c.dur/2);}
    for(const time of [...times].sort((a,b)=>a-b)){
      const f=apply(cs,time,base);frames++;assert.ok(f.polygons.length,`${sc.id}/${l.label}: native cells`);assert.ok(f.canvas.some(o=>o.name==='lineTo'));
      assert.ok(Object.values(f.focus).flat().every(Number.isFinite));assert.deepEqual(plain(f.value),{});assert.equal(lab.s.lppShowAnswer,time>=cs.chapters.at(-1).at);
      assert.deepEqual(manual(lab.s),manual(base.nums));assert.equal(lab.scene.tick(lab.s,1,lab),false);
    }
    assert.equal(lab.randomCalls,rng,'narrated exact counts and traces consume no simulation randomness');assert.equal(packetSignature(packet),saved,'source conditions and cached count maps remain intact');
    assert.ok(signature(apply(cs,0,base))!==signature(apply(cs,.99,base)),`${sc.id}/${l.label}: native opening motion before one second`);
  }
  t.diagnostic(`${frames} actual Board/canvas frames; full browser/mobile/independent visual checks NOT_RUN`);
});

test('manual values, arrays, selected packet and actual run/simulation histories survive sibling playback',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);Object.assign(lab.s,{gA:'sumEven',gB:'same',gMode:'I',sweep:19,tb:[3,7,8,4],cond:'A',view2:'table',names2:null,cnd:.35,cndShow:.35,nW:5,thW:2,wMove:'mult3',wOther:'back',nB:4,TB:6,bRule:2,h0:3,nC:3});
    if(sc.id.startsWith('rep-')){lab.draw();const preset=sc.presets(lab.s).find(p=>p.group.includes('직접'));preset.apply(lab.s);lab.draw();const kind=sc.id.slice(4);lab.api.math.simulate(lab.api.math.getM(JSON.parse(lab.s.runs[kind].sig)),lab.s.sims[kind].sim,7);}
    lab.tab='problem';lab.newProblem();lab.draw();const selected=sc.vary.cur(),sourceFirst=sc.vary.first(),firstSaved=packetSignature(sourceFirst),question=sc.problem.text(lab.s,lab),chosen=plain(manual(lab.s)),refs={tb:lab.s.tb,runs:lab.s.runs,sims:lab.s.sims},hist=plain({runs:lab.s.runs,sims:lab.s.sims}),params=plain(lab.params);
    Object.assign(lab.board,{zoom:1.25,panX:17,panY:-9});lab.draw();const focus=plain(lab.board.focus);
    for(const l of lessons(sc.id)){
      const cs=video.compileLesson(l),base=baseline(),initial=signature(apply(cs,0,base));apply(cs,cs.length,base);
      assert.deepEqual(plain(manual(lab.s)),chosen);assert.equal(signature(apply(cs,0,base)),initial,`${sc.id}/${l.label}: replay`);
      assert.equal(lab.s.tb,refs.tb);assert.equal(lab.s.runs,refs.runs);assert.equal(lab.s.sims,refs.sims);assert.deepEqual(plain({runs:lab.s.runs,sims:lab.s.sims}),hist);
    }
    Object.assign(lab.s,{lessonOn:false,lessonEntry:false,step:0});lab.tab='problem';lab.draw();
    assert.deepEqual(plain(manual(lab.s)),chosen);assert.equal(sc.vary.cur(),selected);assert.equal(sc.problem.text(lab.s,lab),question);assert.equal(packetSignature(sourceFirst),firstSaved);assert.deepEqual(plain(lab.params),params);
    assert.deepEqual(plain(lab.board.focus),focus);assert.equal(lab.board.zoom,1.25);assert.equal(lab.board.panX,17);assert.equal(lab.board.panY,-9);
  }
});

test('full initial snapshots prevent final or sibling metadata from leaking into the entry picture',()=>{
  for(const sc of lab.list){
    lab.go(sc.id);lab.tab='problem';lab.newProblem();lab.draw();const chosen=plain(manual(lab.s));
    for(const l of lessons(sc.id)){
      const cs=video.compileLesson(l),base=baseline(),initial=signature(apply(cs,0,base,true));apply(cs,cs.length,base);Object.assign(lab.s,{lessonOn:false,lessonEntry:true});const held=plain(lab.s);
      assert.equal(signature(lab.draw()),initial,`${sc.id}/${l.label}: stale final entry`);assert.deepEqual(plain(lab.s),held);assert.deepEqual(plain(manual(lab.s)),chosen);
    }
  }
});

test('native grid cells and count labels follow the narrated event and disclosure stage',()=>{
  for(const[name,time,count]of [['합사건확률',18,21],['합사건확률',30,15],['합사건확률',42,7],['합사건확률',54,29],['차가이인확률',42,8],['여사건확률',30,27],['대칭과대각',54,21],['비대칭세기',54,15],['배반사건',54,12],['교집합확률',30,7]]){
    const{cs,base}=prepare('grid',name),f=apply(cs,time,base),cells=f.polygons.slice(0,36);assert.equal(cells.length,36);for(const p of cells)near(area(p),.92**2);
    assert.equal(cells.filter(p=>p.options.fillAlpha===.62).length,count,`${name}: highlighted cells`);
  }
  const{cs,base}=prepare('grid','합사건확률');assert.ok(!apply(cs,17.9,base).texts.some(s=>/^A 21/.test(s)));assert.ok(apply(cs,18,base).texts.includes('A 21칸'));
  assert.ok(!apply(cs,41.9,base).texts.some(s=>/^A∩B 7/.test(s)));assert.ok(apply(cs,42,base).texts.some(s=>/^A∩B 7/.test(s)));
});

test('conditional native mosaic changes the denominator while retaining the correct within-region ratio',()=>{
  for(const[name,time,ratio,den]of [['열조건확률',18,6/11,11],['행조건확률',18,6/10,10],['분모변화',18,6/9,9],['분모변화',42,6/12,12],['독립인표',30,1/2,8],['배반과독립',42,0,10],['주머니역확률',42,6/10,10]]){
    const{cs,base}=prepare('cond',name),f=apply(cs,time,base),outline=f.polygons.find(p=>p.options.width===2&&p.options.color==='ink'&&!p.options.fill),cells=f.polygons.slice(0,f.polygons.indexOf(outline));assert.ok(outline);
    near(cells.reduce((s,p)=>s+area(p),0),area(outline),name+' condition fills the new whole');
    const intersection=cells.find(p=>p.options.ref?.includes('I'));near(intersection?area(intersection)/area(outline):0,ratio,name+' conditional ratio');
    assert.ok(f.texts.some(s=>s.startsWith('분모 = ')&&s.includes(`인 ${den}칸`)),name+' actual denominator label');
  }
  const{cs,base}=prepare('cond','영확률조건'),f=apply(cs,30,base);assert.ok(f.texts.includes('조건 영역 0칸 → 조건부확률은 정의되지 않음'));
});

test('native trellis nodes retain exact count positions, highlighted endpoints and fixed actual traces',()=>{
  for(const id of ['rep-walk','rep-ball','rep-coin'])for(const l of lessons(id).filter(l=>!first(l).lppConcept)){
    const{cs,base}=prepare(id,l.label),f=apply(cs,cs.length,base),M=lab.api.first(id,first(l).lppPacket).M,g=trellis(f);assert.equal(g.xs.length,M.n+1);
    assert.equal(f.polygons.length,M.cnt.reduce((n,m)=>n+m.size,0));
    for(let t=0;t<=M.n;t++)for(const[k,n]of M.cnt[t]){const p=g.node(t,k);assert.ok(p,`${id}/${l.label}: actual state (${t},${k})`);assert.ok(textAt(f,center(p)).includes(String(n)),`${id}/${l.label}: count ${n}`);for(const q of p.points){assert.ok(q.x>=f.viewBox.x0&&q.x<=f.viewBox.x1&&q.y>=f.viewBox.y0&&q.y<=f.viewBox.y1);}}
    if(id==='rep-walk')assert.equal(f.polygons.filter(p=>p.options.fill==='green').length,2);
    if(id==='rep-ball'){assert.equal(f.polygons.filter(p=>p.options.fill==='red').length,1);assert.equal(f.polygons.filter(p=>p.options.color==='sky').length,4);}
    if(id==='rep-coin'){assert.equal(f.polygons.filter(p=>p.options.fill==='green').length,1);assert.equal(f.polygons.filter(p=>p.options.fill==='orange').length,1);}
  }
  for(const[id,name,time,expected]of [['rep-walk','끝상태기준',18,[0,1,2]],['rep-walk','끝상태기준',30,[0,1,2,1,0]],['rep-ball','방문경로곱',30,[0,1,2,2,3,4]],['rep-coin','동전재선택',30,[1,0,1]],['rep-coin','동전재선택',42,[1,0,1,2]]]){
    const{cs,base}=prepare(id,name),f=apply(cs,time,base),g=trellis(f);assert.equal(f.segments.filter(s=>s.options.color==='amber').length,expected.length-1,`${id}/${name}: fixed trace edges`);
    for(const[t,k]of expected.entries())assert.equal(g.node(t,k)?.options.color,'amber',`${id}/${name}: highlighted actual state (${t},${k})`);
  }
  const{cs,base}=prepare('rep-walk','경로수채우기'),before=apply(cs,42,base),bf=trellis(before);assert.ok(!textAt(before,center(bf.node(2,1))).includes('18'));
  const after=apply(cs,54,base),af=trellis(after);assert.ok(textAt(after,center(af.node(2,1))).includes('18'));
  const q=prepare('rep-coin','홀짝과조건'),odd=apply(q.cs,30,q.base),og=trellis(odd);assert.ok(!og.node(4,0)&&!og.node(4,4));assert.ok(og.node(4,1)&&og.node(4,3));
});

test('actual Player start/apply/settle/release keep native controls and histories intact',()=>{
  for(const sc of lab.list)for(const l of lessons(sc.id))for(const ended of [false,true]){
    lab.go(sc.id);lab.draw();const cs=video.compileLesson(l),base=baseline(),saved=plain(manual(lab.s)),hist=plain({runs:lab.s.runs,sims:lab.s.sims}),p=Object.create(lab.context.APLab.Player.prototype);
    Object.assign(p,{lab,cs,base,t:ended?cs.length:26,state:ended?'ended':'playing',_lessonOn:true,_pre:{step:0,part:null},_syncUi(){}});
    p._applyStart(cs);Object.assign(lab.s,{lessonOn:true,lessonEntry:false});lab.tab='review';p.apply();lab.draw();p._settle();p._release();lab.draw();
    assert.equal(lab.tab,'explore');assert.equal(lab.s.lessonOn,undefined);assert.deepEqual(plain(manual(lab.s)),saved);assert.deepEqual(plain({runs:lab.s.runs,sims:lab.s.sims}),hist);
  }
});

test('native scene navigation cannot apply the previous lesson packet to the destination problem panel',async t=>{
  const rt=await load(),call=(v,...args)=>typeof v==='function'?v(...args):v;
  let rendered,transitions=0;
  Object.assign(rt,{
    _tabAvailable:()=>true,_timerStop(){},_buildRail(){},_announce(){},_saveHashSoon(){},
    _measureFocus:rt.measureFocus,
    _buildPanel(){const sc=this.scene;rendered={question:call(sc.question,this.s,this),tag:call(sc.problem.tag,this.s),text:call(sc.problem.text,this.s),answer:call(sc.problem.answer,this.s)};}
  });
  for(const from of rt.list)for(const lesson of video.lessonList(rt.def.lessons[from.id]).toSorted((a,b)=>Number(first(a).lppPacket==='first')-Number(first(b).lppPacket==='first')))for(const to of rt.list.filter(sc=>sc.id!==from.id)){
    rt.go(to.id);rt.tab='problem';rt.newProblem();
    const selected=to.vary.cur(),saved=packetSignature(selected),question=call(to.question,rt.s,rt),text=call(to.problem.text,rt.s),answer=call(to.problem.answer,rt.s);
    rt.go(from.id);
    const cs=video.compileLesson(lesson),base={nums:{...rt.s},sets:{...rt.s},step:0,part:null},at=video.stateAt(cs,cs.length,base);
    Object.assign(rt.s,at.nums,at.sets,{lessonOn:false,lessonEntry:true,step:0,part:null});
    // Player navigation releases playback, then the native shell builds the new
    // panel before _syncEntry(true) installs the destination's first cue.
    const held=plain(manual(rt.s));
    rt.context.APLab.Lab.prototype.goScene.call(rt,rt.list.indexOf(to));
    assert.equal(to.vary.cur(),selected,`${from.id}/${lesson.label} → ${to.id}: manual destination packet`);
    assert.equal(packetSignature(selected),saved,'navigation cannot mutate problem conditions or count maps');
    assert.equal(rendered.question,question);assert.equal(rendered.text,text);assert.equal(rendered.answer,answer);
    assert.deepEqual(plain(manual(rt.s)),held,'navigation retains the manual controls and arrays');
    const next=video.compileLesson(video.lessonList(rt.def.lessons[to.id])[0]);
    rt.context.APLab.Player.prototype._applyStart.call({lab:rt},next);
    assert.equal(to.vary.cur(),rt.api.first(to.id,first(video.lessonList(rt.def.lessons[to.id])[0]).lppPacket),'destination entry selects its own authored packet');
    assert.doesNotThrow(()=>rt.draw());transitions++;
  }
  assert.equal(transitions,108);t.diagnostic(`${transitions} actual shell navigation calls, original manual packets preserved`);
});

test('source-only loading retains original dragging, presets, new problems and zero-condition handling',async()=>{
  const source=await load({sourceOnly:true});assert.deepEqual(plain(source.def.lessons),{});
  for(const sc of source.list){source.go(sc.id);source.draw();source.tab='problem';const first=sc.vary.first(),saved=packetSignature(first);for(let i=0;i<3;i++){const prev=sc.vary.cur();source.newProblem();assert.notEqual(sc.vary.cur(),prev);source.draw();source.tab='review';source.s.step=4;source.draw();source.tab='problem';}assert.equal(packetSignature(first),saved);}
  source.go('grid');source.scene.presets(source.s).find(p=>p.label==='배반인 두 사건').apply(source.s);assert.equal(source.s.gA,'sum7');assert.equal(source.s.gB,'same');source.s.sweep=36;source.scene.actions[0].run(source.s);source.scene.tick(source.s,.5);assert.equal(source.s.sweep,3);source.draw();
  source.go('cond');for(const name of ['div','h0','h1']){source.s.cnd=0;source.s.cndShow=0;const f=source.draw(),h=f.handles.find(h=>h.id===name),before=source.s.tb.slice();assert.ok(h?.options.drag);h.options.drag({x:h.point.x+.7,y:h.point.y+.7});assert.notDeepEqual(plain(source.s.tb),plain(before));assert.equal(source.s.tb.reduce((a,b)=>a+b,0),20);source.draw();}
  source.scene.actions[0].run(source.s);assert.equal(source.s.cnd,1);assert.equal(source.scene.tick(source.s,.1,source),true);
  Object.assign(source.s,{tb:[0,0,8,12],cond:'A',cnd:1,cndShow:1});assert.match(source.draw().value.status.text,/정의/);
  for(const kind of ['walk','ball','coin']){source.go('rep-'+kind);const sc=source.scene,face=sc.presets(source.s).find(p=>p.group.includes('직접'));source.draw();face.apply(source.s);assert.equal(source.s.runs[kind].path.length,2);sc.actions.find(a=>a.id==='reset').run(source.s);assert.equal(source.s.runs[kind].path.length,1);sc.actions.find(a=>a.id==='full').run(source.s);assert.equal(source.s.runs[kind].path.length,JSON.parse(source.s.runs[kind].sig).n+1);source.draw();}
  source.go('rep-coin');Object.assign(source.s,{h0:1,nC:4});const zero=source.draw();assert.ok(zero.value.readouts.some(r=>r.value==='정의되지 않음'));assert.ok(zero.texts.includes('조건에 맞는 경우가 없음'));
});
