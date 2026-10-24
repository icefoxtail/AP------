// Construction extension A: division point (internal/external m:n), centroid, point/line reflection,
// perpendicular through a point, translation. SymPy (exact) vs the Cindy peer, plus an independent
// formula written in this file, plus the final SVG of a real render.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {pythonWorker} from '../production/worker.mjs';
import {reconstruct,compareReconstruction} from '../production/cindy-observer.mjs';
import {renderPlan} from '../production/render-plan.mjs';

const int=n=>({kind:'integer',value:String(n)});
const frac=(n,d)=>({kind:'rational',numerator:String(n),denominator:String(d)});
const node=(id,op,inputs,outputType,args={})=>({id,op,inputs,outputType,args,factRole:inputs.length?'DERIVED_INTERMEDIATE':'GIVEN'});
const pt=(id,x,y)=>node(id,'SOURCE_POINT',[],'POINT',{coordinates:[int(x),int(y)]});
const graphOf=nodes=>({schemaVersion:'construction-spike-v1',nodes});
const run=async graph=>pythonWorker({action:'construction',graph});
const approx=(a,b,eps=1e-9)=>a.every((v,i)=>Math.abs(v-b[i])<=eps);

// independent formulas (not the engine's code)
const section=(A,B,m,n)=>[(n*A[0]+m*B[0])/(m+n),(n*A[1]+m*B[1])/(m+n)];
const outer=(A,B,m,n)=>[(m*B[0]-n*A[0])/(m-n),(m*B[1]-n*A[1])/(m-n)];

const A=[-2,1],B=[4,7],C=[1,-5];
const base=()=>[pt('A',...A),pt('B',...B),pt('C',...C)];

test('division point internal and external, centroid, reflections, perpendicular, translation',async()=>{
  const nodes=[...base(),pt('Q',3,-2),
    node('l','LINE_THROUGH',['A','B'],'LINE'),
    node('D1','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'INTERNAL'}),
    node('D2','DIVISION_POINT',['A','B'],'POINT',{m:int(3),n:int(2),mode:'EXTERNAL'}),
    node('D3','DIVISION_POINT',['A','B'],'POINT',{m:int(1),n:int(3),mode:'EXTERNAL'}),
    node('G','CENTROID',['A','B','C'],'POINT'),
    node('R','POINT_REFLECTION',['Q','A'],'POINT'),
    node('S','LINE_REFLECTION',['Q','l'],'POINT'),
    node('m','PERPENDICULAR_THROUGH',['Q','l'],'LINE'),
    node('T','TRANSLATE_POINT',['Q'],'POINT',{dx:int(-3),dy:frac(5,2)}),
    node('t','TRANSLATE_LINE',['l'],'LINE',{dx:int(2),dy:int(-1)}),
    node('H','LINE_INTERSECTION',['l','m'],'POINT')];
  const graph=graphOf(nodes);
  const {status,result}=await run(graph);assert.equal(status,'OK');
  const P=id=>result.points[id].approximation;
  assert.ok(approx(P('D1'),section(A,B,2,1)));assert.ok(approx(P('D2'),outer(A,B,3,2)));assert.ok(approx(P('D3'),outer(A,B,1,3)));
  assert.ok(approx(P('G'),[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3]));
  assert.ok(approx(P('R'),[2*A[0]-3,2*A[1]+2]));
  // reflection of Q in line AB: the segment QS is bisected by H, the foot of the perpendicular through Q
  assert.ok(approx(P('S'),[2*P('H')[0]-3,2*P('H')[1]+2]));
  assert.ok(approx(P('T'),[0,0.5]));
  // m is perpendicular to l, translated line is parallel to l and moved by (2,-1)
  const [la,lb]=result.lines.l.approximation,[ma,mb]=result.lines.m.approximation,[ta,tb,tc]=result.lines.t.approximation;
  assert.ok(Math.abs(la*ma+lb*mb)<1e-9);assert.ok(Math.abs(la*tb-lb*ta)<1e-9);assert.ok(Math.abs(ta*(A[0]+2)+tb*(A[1]-1)+tc)<1e-9);
  // exact values stay exact
  assert.deepEqual(result.points.D1.exact,[{kind:'integer',value:'2'},{kind:'integer',value:'5'}]);
  assert.equal(compareReconstruction(result,reconstruct(graph)).status,'PASS');
});

test('the Cindy peer detects a wrong engine point for every new point op',async()=>{
  const nodes=[...base(),pt('Q',3,-2),node('l','LINE_THROUGH',['A','B'],'LINE'),
    node('D1','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'INTERNAL'}),node('G','CENTROID',['A','B','C'],'POINT'),
    node('R','POINT_REFLECTION',['Q','A'],'POINT'),node('S','LINE_REFLECTION',['Q','l'],'POINT'),node('T','TRANSLATE_POINT',['Q'],'POINT',{dx:int(1),dy:int(1)})];
  const graph=graphOf(nodes);
  for(const id of ['D1','G','R','S','T']){
    const {result}=await run(graph);result.points[id].approximation[1]+=0.05;
    const comparison=compareReconstruction(result,reconstruct(graph));
    assert.equal(comparison.status,'FAIL',id);assert.deepEqual(comparison.rows.filter(r=>!(r.delta<=comparison.tolerance)).map(r=>r.id),[id]);
  }
  const {result}=await run(graph);
  // swapping internal for external in the observer's input must not pass against the engine's internal result
  const swapped=structuredClone(graph);swapped.nodes.find(n=>n.id==='D1').args.mode='EXTERNAL';
  assert.equal(compareReconstruction(result,reconstruct(swapped)).status,'FAIL');
});

test('origin reflection with the coordinate frame nodes',async()=>{
  const graph=graphOf([node('O','NORMALIZATION_ORIGIN',[],'POINT'),node('X','NORMALIZATION_AXIS',[],'POINT',{length:int(1)}),pt('P',3,-2),pt('Z',0,1),
    node('Pp','POINT_REFLECTION',['P','O'],'POINT')]);
  graph.realization={recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false};
  const {status,result}=await run(graph);assert.equal(status,'OK');
  assert.ok(approx(result.points.Pp.approximation,[-3,2]));assert.equal(compareReconstruction(result,reconstruct(graph)).status,'PASS');
});

test('unsupported variants fail closed with explicit codes',async()=>{
  const lineGraph=extra=>graphOf([...base(),node('l','LINE_THROUGH',['A','B'],'LINE'),...extra]);
  const cases=[
    ['INVALID_DIVISION_RATIO',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(0),n:int(1),mode:'INTERNAL'})])],
    ['INVALID_DIVISION_RATIO',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(-2),n:int(1),mode:'EXTERNAL'})])],
    ['EXTERNAL_DIVISION_EQUAL_RATIO',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(2),mode:'EXTERNAL'})])],
    ['INVALID_DIVISION_MODE',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'MID'})])],
    ['DEGENERATE_DIVISION_SEGMENT',graphOf([pt('A',1,1),pt('B',1,1),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'INTERNAL'})])],
    ['UNSUPPORTED_NODE_ARGS',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1)})])],
    ['UNSUPPORTED_SCALAR_REF',graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:{ref:'A'},n:int(1),mode:'INTERNAL'})])],
    ['DEGENERATE_TRIANGLE',graphOf([pt('A',0,0),pt('B',1,1),pt('C',2,2),node('G','CENTROID',['A','B','C'],'POINT')])],
    ['INPUT_TYPE_MISMATCH',graphOf([...base(),node('G','CENTROID',['A','B'],'POINT')])],
    ['REFLECTION_POINT_AT_CENTER',graphOf([...base(),node('R','POINT_REFLECTION',['A','A'],'POINT')])],
    ['REFLECTION_POINT_ON_LINE',lineGraph([node('S','LINE_REFLECTION',['A','l'],'POINT')])],
    ['ZERO_TRANSLATION',graphOf([...base(),node('T','TRANSLATE_POINT',['A'],'POINT',{dx:int(0),dy:int(0)})])],
    ['UNSUPPORTED_NODE_ARGS',graphOf([...base(),node('T','TRANSLATE_POINT',['A'],'POINT',{dx:int(1)})])],
    ['INPUT_TYPE_MISMATCH',graphOf([...base(),node('m','PERPENDICULAR_THROUGH',['A','B'],'LINE')])],
    ['OUTPUT_TYPE_MISMATCH',lineGraph([node('m','PERPENDICULAR_THROUGH',['C','l'],'POINT')])],
  ];
  for(const [code,graph] of cases){
    const response=await run(graph);assert.equal(response.status,'ERROR',code);
    assert.match(JSON.stringify(response),new RegExp(code),code);
  }
});

test('Cindy peer refuses nonsense ratios on its own',()=>{
  const bad=graphOf([...base(),node('D','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(2),mode:'EXTERNAL'})]);
  assert.throws(()=>reconstruct(bad),/INVALID_CINDY_DIVISION/);
});

// ---- final SVG of a real render (23_강남여고 q3): P and Q are re-derived here from the dots of A and B alone.
// Any affine map from the source plane to the page keeps ratios along a line, so P=(A+2B)/3 and Q=2B-A must hold in page pixels.
const svgItem={sourcePath:'archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js',ordinal:3,dir:'ext-a'};
const plan=()=>({
  capability:'construction-spike-v1',
  mathPlan:{schemaVersion:'construction-spike-v1',nodes:[pt('A',-5,2),pt('B',1,5),
    node('P','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'INTERNAL'}),
    node('Q','DIVISION_POINT',['A','B'],'POINT',{m:int(2),n:int(1),mode:'EXTERNAL'})].map((n,i)=>({...n,factRole:i<2?'GIVEN':'CONCLUSION'}))},
  displaySegments:[{id:'sAQ',refs:['A','Q']},{id:'sPQ',refs:['P','Q']}],coordinateLabels:['A','B','P','Q'],axisTickValues:{x:[],y:[]},
  sourceConditions:[{id:'s1',condition:'두 점 A(-5,2), B(1,5)가 주어진다.',mappedTo:['A','B']},
    {id:'s2',condition:'선분 AB를 2:1로 내분하는 점 P와 외분하는 점 Q를 구하며, 풀이에서 P(-1,4), Q(7,8)이다.',mappedTo:['P','Q','sAQ']},
    {id:'s3',condition:'두 점 P, Q 사이의 거리 PQ를 구한다.',mappedTo:['sPQ']},
    {id:'scBank',condition:'문제 본문, 배점, 보기, 정답, 풀이는 문제은행 원본을 그대로 유지한다.',mappedTo:'PRESERVED_ARCHIVE_BANK'}],
  newVisualInformation:['내분점 P는 선분 AB 안, 외분점 Q는 B쪽 선분 바깥에 있다는 위치 관계'],
  caption:'선분 AB의 2:1 내분점 P와 외분점 Q'});

test('real render: division points sit where the independent section formulas put them in the final SVG',{timeout:400000},async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'ext-a-'));
  const r=await renderPlan({item:svgItem,plan:plan(),outDir:out});
  assert.equal(r.status,'ARCHIVE_BOUND',JSON.stringify(r).slice(0,800));
  const svg=fs.readFileSync(path.join(out,'ext-a-solution.svg'),'utf8');
  const dot=id=>{const tag=svg.match(new RegExp(`<circle id="${id}"[^>]*>`))?.[0];assert.ok(tag,`${id} dot present in the final SVG`);
    return [+/cx="([-\d.]+)"/.exec(tag)[1],+/cy="([-\d.]+)"/.exec(tag)[1]];};
  const [a,b,p,q]=['A','B','P','Q'].map(dot);
  assert.ok(approx(p,[(a[0]+2*b[0])/3,(a[1]+2*b[1])/3],0.05),`P ${p}`);
  assert.ok(approx(q,[2*b[0]-a[0],2*b[1]-a[1]],0.05),`Q ${q}`);
});
