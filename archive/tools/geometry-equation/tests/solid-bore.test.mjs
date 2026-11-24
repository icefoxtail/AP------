// solid-figure-v1: bore:{radius}, a hole bored through a CYLINDER or a PRISM (RECT / even REGULAR base) along its axis.
// Chrome-using (composes solid figure panels): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {solveSolidFigure,composeSolidFigurePanel} from '../production/solid-figure-v1.mjs';

const observer=fileURLToPath(new URL('../production/solid_figure_observer_worker.py',import.meta.url));
const code=expected=>error=>String(error.message).startsWith(expected);
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const meta={caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:['A']}],newVisualInformation:['n']};
const identity=assetIdentity('solid-fixture|1','SOLUTION_VISUAL','decisive-relation');
const pipe=(over={})=>({kind:'CYLINDER',id:'s1',radius:20,height:30,bore:{radius:10},...over});
const figure=(solid,dims)=>({capability:'solid-figure-v1',unit:'cm',solids:[solid],dims,solidCaption:{text:'구멍 뚫린 입체'},...meta});
const audit=async(plan,svg)=>{const r=await pythonWorker({solidFigure:plan,svg},{script:observer,timeoutMs:30000});assert.equal(r.status,'OK');return r.result;};
const panel=async plan=>{const model=solveSolidFigure(plan);const out=await composeSolidFigurePanel({plan,model,identity,typographyPolicy:policy});assert.equal(out.status,'COMPOSED',JSON.stringify(out.detail));return out.svg;};
const cylDims=[{solid:'s1',radius:'top',label:'20'},{solid:'s1',radius:'bore',label:'10'},{solid:'s1',height:true,label:'30'}];

test('a bore is a plain positive radius narrower than its host; only a cylinder or a rect/even-regular prism takes one',()=>{
  const bad=(solid,expected)=>assert.throws(()=>solveSolidFigure(figure(solid,undefined)),code(expected),expected);
  bad(pipe({bore:{radius:20}}),'SOLID_BORE_TOO_WIDE');
  bad(pipe({bore:{radius:0}}),'SOLID_BORE_INVALID');
  bad(pipe({bore:{radius:3,extra:1}}),'SOLID_BORE_INVALID');
  bad(pipe({bore:5}),'SOLID_BORE_INVALID');
  bad({kind:'CONE',radius:4,height:6,bore:{radius:1}},'SOLID_BORE_UNSUPPORTED:CONE');
  bad(pipe({axis:true}),'SOLID_BORE_UNSUPPORTED:COMBINATION');
  bad({kind:'PRISM',base:{kind:'REGULAR',n:5,side:4},height:30,bore:{radius:1}},'SOLID_BORE_UNSUPPORTED:BASE');
  bad({kind:'PRISM',base:{kind:'RECT',width:20,depth:20},height:30,bore:{radius:10}},'SOLID_BORE_TOO_WIDE');
  // a low prism would show its far edges through the hole: refused instead of drawn wrongly
  bad({kind:'PRISM',base:{kind:'RECT',width:20,depth:20},height:4,bore:{radius:5}},'SOLID_BORE_HOST_TOO_LOW');
  assert.throws(()=>solveSolidFigure(figure(pipe({bore:undefined}),[{solid:'s1',radius:'bore',label:'10'}])),code('SOLID_DIMS_INVALID'));
  assert.equal(solveSolidFigure(figure(pipe(),undefined)).solids[0].bore.radius,10);
  // a plan without bore is unchanged
  assert.equal('bore' in solveSolidFigure(figure(pipe({bore:undefined}),undefined)).solids[0],false);
});

test('a bored cylinder draws both rims of the hole and its two hidden generators, and the observer reads them back',async()=>{
  const plan=figure(pipe(),cylDims);
  const svg=await panel(plan);
  for(const id of ['s1-bore-top-back','s1-bore-top-front','s1-bore-bottom-back','s1-bore-bottom-front','s1-bore-side-left','s1-bore-side-right'])assert.ok(svg.includes(`id="${id}"`),id);
  assert.equal((await audit(plan,svg)).status,'PASS');
  // tampering: a missing generator, a solid stroke where the plan hides the far rim, a rim that is not the hole's radius
  const noEdge=svg.replace(/<path|<line/g,m=>m).replace(/<g data-layer="\d+"><line id="s1-bore-side-left"[^>]*\/><\/g>/,'');
  assert.notEqual(noEdge,svg);
  assert.ok((await audit(plan,noEdge)).errors.some(e=>e.startsWith('SOLID_BORE_EDGE_')));
  const solidFar=svg.replace(/(<path id="s1-bore-bottom-back"[^>]*?) stroke-dasharray="[^"]*"/,'$1');
  assert.notEqual(solidFar,svg);
  assert.ok((await audit(plan,solidFar)).errors.length>0);
  const missingRim=svg.replace(/<g data-layer="\d+"><path id="s1-bore-top-front"[^>]*\/><\/g>/,'');
  assert.notEqual(missingRim,svg);
  assert.ok((await audit(plan,missingRim)).errors.some(e=>e.startsWith('SOLID_BORE_RIM_INCOMPLETE')));
});

test('a wide hole in a low cylinder shows part of its far rim through the opening',async()=>{
  const plan=figure(pipe({radius:20,height:10,bore:{radius:16}}),[{solid:'s1',radius:'top',label:'20'},{solid:'s1',radius:'bore',label:'16'},{solid:'s1',height:true,side:'RIGHT',label:'10'}]);
  const svg=await panel(plan);
  assert.ok(svg.includes('id="s1-bore-bottom-seen"'),'the seen stretch of the lower rim is drawn solid');
  assert.match(/<path id="s1-bore-bottom-seen"[^>]*data-vis="solid"/.exec(svg)?.[0]??'',/data-vis="solid"/);
  assert.equal((await audit(plan,svg)).status,'PASS');
  // the same arc drawn dashed (as if it were behind the body) is refused
  const dashed=svg.replace(/(<path id="s1-bore-bottom-seen"[^>]*?) data-vis="solid"([^>]*?)>/,'$1 data-vis="hidden" stroke-dasharray="5 4"$2>');
  assert.notEqual(dashed,svg);
  assert.ok((await audit(plan,dashed)).errors.length>0);
});

test('a prism with a bore: the hole sits in the middle of both bases and its radius is a dimension',async()=>{
  const plan={capability:'solid-figure-v1',solids:[{id:'s1',kind:'PRISM',base:{kind:'RECT',width:20,depth:20},height:30,names:'ABCDEFGH',bore:{radius:5}}],dims:[{edge:'AB',label:'20'},{edge:'AE',label:'30'},{solid:'s1',radius:'bore',label:'5'}],...meta};
  const svg=await panel(plan);
  assert.ok(svg.includes('id="s1-bore-top-back"')&&svg.includes('id="s1-bore-side-right"'));
  assert.equal((await audit(plan,svg)).status,'PASS');
  const wrongRim=svg.replace(/(<path id="s1-bore-top-back"[^>]*? d="M [\d.]+ [\d.]+ A )([\d.]+)/,(m,a,rx)=>a+(Number(rx)*1.3));
  assert.notEqual(wrongRim,svg);
  assert.ok((await audit(plan,wrongRim)).errors.some(e=>e.startsWith('SOLID_ELLIPSE_AXES_MISMATCH')));
});
