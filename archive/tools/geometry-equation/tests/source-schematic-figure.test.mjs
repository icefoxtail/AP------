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
