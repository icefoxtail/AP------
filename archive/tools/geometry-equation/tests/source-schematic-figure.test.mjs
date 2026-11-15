import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {prepareSourceSchematic} from '../production/source-schematic-figure.mjs';
import {auditSourceSchematic} from '../production/source-schematic-observer.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';

const repoRoot=fileURLToPath(new URL('../../../../',import.meta.url));
const title='23_제일고_1학기_중간_고2_수학I';
const question=loadBank(fs.readFileSync(path.join(repoRoot,'archive/exams/original/high/h2/1mid',title+'.js'),'utf8')).find(row=>row.id===17);
const identity=assetIdentity(title+'|17','PROBLEM_VISUAL','body');
const context={repoRoot,question,identity,typography:{baseFontPx:24,displayScale:.49}};
const plan={
  capability:'source-exp-log-schematic-v1',
  sourceAsset:'archive/assets/images/23_제일고_1학기_중간_고2_수학I/q17.png',
  sourceSha256:'764a0af57c63b9b4de08adff7a3a07f36c4845f87708e2dbba24dddf36ed4b73',
  paths:{
    xAxis:[[12,360],[562,360]],
    yAxis:[[56,11],[56,416]],
    secant:[[27,23],[453,413]],
    exponential:[
      [12,357],[30,355],[56,348],[68,345],[80,341],[95,332],[110,322],
      [125,307],[140,289],[150,269],[160,242],[168,220],[175,203],[181,180],
      [186,168],[191,138],[196,112],[200,88],[204,65],[208,31],[211,18],
    ],
    logarithm:[
      [168,413],[175,402],[190,386],[215,367],[252,348],[280,339],[315,329],
      [347,320],[375,315],[400,312],[450,304],[500,297],[550,291],[566,289],
    ],
  },
  labelOrigins:{"O":[28,373],"A":[207,143],"B":[361,291],"C":[28,322],"x":[566,368],"y":[63,12],"exp":[228,25],"log":[421,246],"line":[84,44],"schematic":[495,52]}
};
const change=fn=>{const clone=structuredClone(plan);fn(clone);return clone;};

test('the Q17 problem schematic is assembled from the linked raster and has all exact source label roles',()=>{
  const r=prepareSourceSchematic(plan,context);
  assert.equal(r.staticAudit.status,'PASS');
  assert.deepEqual([r.staticAudit.pathsVerified,r.staticAudit.pointsVerified,r.staticAudit.labelsVerified],[5,4,10]);
  assert.ok(Object.values(r.coverage).every(value=>value.ratio>=.93&&value.longestGap<=7));
  const {O,A,B,C}=r.points;
  assert.equal(O[0],C[0]);assert.ok(C[1]<O[1]&&A[0]<B[0]&&A[1]<B[1]);
  assert.match(r.svg,/data-scale-policy="SCHEMATIC_ALLOWED"/);
  assert.match(r.svg,/<title[^>]+>지수곡선과 로그곡선의 개형<\/title>/);
  assert.match(r.svg,/<g id="label-schematic"[^>]*data-fragment-sha="sha256:[a-f0-9]+"/);
  assert.equal((r.svg.match(/data-label-kind="EQUATION_LABEL"/g)??[]).length,3);
  assert.equal((r.svg.match(/data-label-kind="POINT_NAME"/g)??[]).length,4);
  assert.doesNotMatch(r.svg,/data-label-kind="(?:TICK_LABEL|COORDINATE_LABEL)"|<image\b|data:image|⑤|25\/4|4\/25/);
});

test('binding or provenance defects, invented data and off-ink traces fail closed',()=>{
  for(const [candidate,scope,reason] of [
    [change(p=>p.sourceSha256='0'.repeat(64)),context,/SCHEMATIC_SOURCE_SHA_MISMATCH/],
    [change(p=>p.sourceAsset=p.sourceAsset.replace('q17.png','q16.png')),context,/SCHEMATIC_SOURCE_NOT_BOUND_TO_QUESTION/],
    [change(p=>p.paths.exponential[10]=[160,105]),context,/SCHEMATIC_TRACE_WITHOUT_SOURCE_INK:exponential/],
    [change(p=>p.paths.exponential=p.paths.logarithm),context,/SCHEMATIC_CURVE_WRONG_BEND/],
    [change(p=>p.rawSvg='<svg/>'),context,/SCHEMATIC_INVALID_PLAN/],
    [change(p=>p.base='2'),context,/SCHEMATIC_INVALID_PLAN/],
    [change(p=>p.labelOrigins.C=[484,370]),context,/SCHEMATIC_POINT_LABEL_TOO_FAR:C/],
    [plan,{...context,question:{...question,id:18}},/SCHEMATIC_SOURCE_ORDINAL_MISMATCH/],
    [plan,{...context,identity:assetIdentity(title+'|17','SOLUTION_VISUAL','body')},/SCHEMATIC_PROBLEM_SURFACE_REQUIRED/]
  ])assert.throws(()=>prepareSourceSchematic(candidate,scope),reason);
});

test('the read-back audit rejects an extra shape, detached point, remapped label or geometry transform',()=>{
  const {svg,points}=prepareSourceSchematic(plan,context);
  const labels=svg.split('<g id="schematic-labels">')[1].slice(0,-'</g></svg>'.length);
  const expected={paths:plan.paths,points,groups:[{group:labels}],sourceSha256:plan.sourceSha256,width:620,height:440,
    title:'지수곡선과 로그곡선의 개형',
    description:'좌표평면의 개형이다. 내림 직선이 지수곡선과 A에서, 로그곡선과 B에서 만난다. 지수곡선은 세로축과 C에서 만나며 O는 원점이다.'};
  assert.equal(auditSourceSchematic(svg,expected).status,'PASS');
  const probe=[
    svg.replace('<line id="secant"','<line transform="translate(1 0)" id="secant"'),
    svg.replace(/(<circle id="C"[^>]*cx=")[^"]+/,(_m,p)=>p+'65'),
    svg.replace(/(<g id="label-A"[^>]*data-owner=")A/,(_m,p)=>p+'B'),
    svg.replace('<g id="schematic-geometry">','<g id="schematic-geometry"><path d="M0 0" />')
  ];
  assert.ok(probe.every(m=>m!==svg));
  assert.ok(probe.every(m=>auditSourceSchematic(m,expected).status==='FAIL'));
});

const palmaTitle='23_팔마고_1학기_중간_고2_수학I';
const palmaQuestion=loadBank(fs.readFileSync(path.join(repoRoot,'archive/exams/original/high/h2/1mid',palmaTitle+'.js'),'utf8')).find(row=>row.id===17);
const palmaIdentity=assetIdentity(palmaTitle+'|17','PROBLEM_VISUAL','body');
const palmaContext={repoRoot,question:palmaQuestion,identity:palmaIdentity,typography:{baseFontPx:30,displayScale:.4375}};
const palmaPlan={
  capability:"source-log-translate-schematic-v1",
  sourceAsset:"archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q17.png",
  sourceSha256:"cca4259a2235c7feecbb34d4b290cba30454f9a5b9f815c2733bef2921019ed8",
  paths:{
    xAxis:[[12,388],[714,388]],
    yAxis:[[94,61],[94,540]],
    secant:[[12,99],[694,440]],
    logOriginal:[
      [145,485],[148,463],[153,433],[160,421],[168,401],[180,384],[195,366],
      [211,354],[227,341],[250,329],[275,317],[300,308],[325,298],[350,289],
      [375,283],[400,278],[425,273],[450,267],[475,262],[500,256],[525,251],
      [550,247],[575,244],[600,238],[625,235],[650,228],[675,224],[700,220],
      [725,214],
    ],
    logShifted:[
      [227,529],[229,506],[232,480],[239,454],[247,431],[257,413],[270,395],
      [282,388],[300,371],[325,359],[350,346],[375,338],[400,330],[425,321],
      [450,315],[475,307],[500,302],[525,294],[550,291],[575,286],[600,279],
      [625,272],[650,270],[675,264],[700,260],[725,256],
    ],
  },
  labelOrigins:{"O":[41,398],"A":[54,149],"B":[552,408],"P":[355,245],"Q":[425,338],"x":[719,399],"y":[60,40],"logOriginal":[490,165],"logShifted":[325,468],"line":[134,99],"schematic":[614,66]}
};

test('Palma Q17 preserves the translated curves and obtains all five point owners from raster intersections',()=>{
  const {svg,points,coverage,staticAudit,display}=prepareSourceSchematic(palmaPlan,palmaContext);
  const {O,A,B,P,Q}=points;
  assert.equal(A[0],O[0]);assert.equal(B[1],O[1]);
  assert.ok(A[0]<P[0]&&P[0]<Q[0]&&Q[0]<B[0]&&A[1]<P[1]&&P[1]<Q[1]&&Q[1]<B[1]);
  assert.ok(Object.values(coverage).every(row=>row.ratio>=.93));
  assert.deepEqual([staticAudit.status,staticAudit.pathsVerified,staticAudit.pointsVerified,staticAudit.labelsVerified],['PASS',5,5,11]);
  assert.equal(display.width,350);
  assert.match(svg,/data-scale-policy="SCHEMATIC_ALLOWED"/);
  for(const id of ['O','A','B','P','Q']){
    assert.match(svg,new RegExp('<g id="label-'+id+'" data-label-kind="POINT_NAME" data-owner="'+id+'"'));
  }
  const original=svg.slice(svg.indexOf('<g id="label-logOriginal"'),svg.indexOf('<g id="label-logShifted"'));
  assert.match(original,/data-owner="logOriginal"/);
  assert.equal([...original.matchAll(/data-c="([^"]+)"/g)].at(-1)[1],'29','the full original log label has its closing parenthesis');
  assert.doesNotMatch(svg,/data-label-kind="(?:TICK_LABEL|COORDINATE_LABEL)"|<image\b|⑤|①|a\^3\s*=\s*7/);
});

test('the translated-log author grammar rejects wrong source roles, different bases and a nonparallel shift',()=>{
  const changeStem=(old,updated)=>{
    const stem=palmaQuestion.content;
    assert.ok(stem.includes(old));
    return {...palmaContext,question:{...palmaQuestion,content:stem.replaceAll(old,updated)}};
  };
  for(const [context,err] of [
    [changeStem('$y$축, $x$축','$x$축, $y$축'),/SCHEMATIC_SOURCE_POINT_BINDING_UNSUPPORTED/],
    [changeStem('\\log_a(x-3)','\\log_b(x-3)'),/SCHEMATIC_SOURCE_STEM_UNSUPPORTED/],
    [changeStem('(x-3)-1','(x-3)-2'),/SCHEMATIC_TRANSLATION_NOT_PARALLEL/]
  ])assert.throws(()=>prepareSourceSchematic(palmaPlan,context),err);
});

test('the translated figure refuses unbound source, swapped traces, extra author data and edited point owners',()=>{
  for(const [mutate,error] of [
    [p=>p.sourceSha256='0'.repeat(64),/SCHEMATIC_SOURCE_SHA_MISMATCH/],
    [p=>p.paths.logOriginal[10]=[275,422],/SCHEMATIC_TRACE_WITHOUT_SOURCE_INK/],
    [p=>[p.paths.logOriginal,p.paths.logShifted]=[p.paths.logShifted,p.paths.logOriginal],/SCHEMATIC_CURVES_CROSS_OR_DO_NOT_OVERLAP/],
    [p=>p.points={P:[8,3]},/SCHEMATIC_INVALID_PLAN/]
  ]){
    const plan=structuredClone(palmaPlan);mutate(plan);
    assert.throws(()=>prepareSourceSchematic(plan,palmaContext),error);
  }
  const {svg,points}=prepareSourceSchematic(palmaPlan,palmaContext);
  const groups=svg.split('<g id="schematic-labels">')[1].slice(0,-'</g></svg>'.length);
  const expected={paths:palmaPlan.paths,points,groups:[{group:groups}],sourceSha256:palmaPlan.sourceSha256,width:800,height:740,
    title:'두 로그곡선과 직선의 개형',
    description:'좌표평면의 개형이다. 직선이 세로축과 A에서, 가로축과 B에서 만난다. 첫 로그곡선은 직선과 P에서 만나고 오른쪽 아래로 옮긴 둘째 로그곡선은 Q에서 만난다. O는 원점이다.'};
  assert.equal(auditSourceSchematic(svg,expected).status,'PASS');
  const bad=svg.replace('id="label-P" data-label-kind="POINT_NAME" data-owner="P"','id="label-P" data-label-kind="POINT_NAME" data-owner="Q"');
  assert.notEqual(bad,svg);
  assert.ok(auditSourceSchematic(bad,expected).errors.includes('SCHEMATIC_LABELS_CHANGED'));
  const detached=svg.replace(/(<circle id="Q"[^>]*cx=")[^"]+/,(_m,head)=>head+'450');
  assert.ok(auditSourceSchematic(detached,expected).errors.includes('SCHEMATIC_POINT_CHANGED:Q'));
});
