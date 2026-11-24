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
// Original PNG-linked stem from 615c166760816753965c0a396a39de7ef2a362cf. The published body now links the reviewed SVG.
const question={"id":17,"content":"$a > 1$인 실수 $a$에 대하여 직선 $y=-x+4$가 두 곡선 $y=a^{x-1}$, $y=\\log_a (x-1)$과 만나는 점을 각각 $A, B$라 하고, 곡선 $y=a^{x-1}$이 $y$축과 만나는 점을 $C$라 하자. $\\overline{AB} = 2\\sqrt{2}$일 때, 점 $C$의 $y$ 좌표는? [4.6점]<br><div class=\"exam-img-box\"><img src=\"assets/images/23_제일고_1학기_중간_고2_수학I/q17.png\" class=\"exam-img\"></div>"};
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
// Original PNG-linked stem from 59da8b9e6c7e757318781df326429fec30db8a42. The published body now links the reviewed SVG.
const palmaQuestion={"id":17,"content":"그림과 같이 직선 $y=-\\frac{1}{2}x+7$이 $y$축, $x$축과 만나는 점을 각각 $\\mathrm{A}, \\mathrm{B}$라 하고, 직선 $y=-\\frac{1}{2}x+7$이 두 함수 $y=\\log_a(x-1)$, $y=\\log_a(x-3)-1$의 그래프와 만나는 점을 각각 $\\mathrm{P}, \\mathrm{Q}$라 하자. $\\overline{\\mathrm{AP}}=2\\overline{\\mathrm{QB}}$일 때, 상수 $a^3$의 값은? (단, $a>1$) [4.6점]<br><br><div class=\"exam-img-box\"><img src=\"assets/images/23_팔마고_1학기_중간_고2_수학I/q17.png\" class=\"exam-img\"></div>"};
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

test('a published SVG link cannot provide authority to reuse the former PNG',()=>{
  for(const [testPlan,scope] of [[plan,context],[palmaPlan,palmaContext]]){
    const content=scope.question.content.replace('q17.png','q17-problem-v1.svg');
    assert.notEqual(content,scope.question.content);
    const question={...scope.question,content};
    assert.throws(()=>prepareSourceSchematic(testPlan,{...scope,question}),/SCHEMATIC_SOURCE_NOT_BOUND_TO_QUESTION/);
  }
});

const jeil22Title='22_제일고_1학기_중간_고2_수학I';
const jeil22Live=loadBank(fs.readFileSync(path.join(repoRoot,'archive/exams/original/high/h2/1mid',jeil22Title+'.js'),'utf8')).find(row=>row.id===18);
// The published question may carry a redrawn figure (its image field); this capability reads the ORIGINAL source raster, which the original stem embedded as its one <img>.
const jeil22Question={...jeil22Live,content:/<img\b/i.test(jeil22Live.content)?jeil22Live.content:jeil22Live.content+'<img src="assets/images/'+jeil22Title+'/q18.png" class="exam-img">'};
const jeil22Identity=assetIdentity(jeil22Title+'|18','PROBLEM_VISUAL','body');
const jeil22Context={repoRoot,question:jeil22Question,identity:jeil22Identity,typography:{baseFontPx:36,displayScale:350/960}};
const jeil22Plan={
  capability:"source-exp-log-orthogonal-guides-schematic-v1",
  sourceAsset:"archive/assets/images/22_제일고_1학기_중간_고2_수학I/q18.png",
  sourceSha256:"91340bda760e30191e4e71fdeb4aefc8128532789f0f119110e63c4891419339",
  view:{"width":960,"height":810},
  paths:{
    xAxis:[[12,741],[946,741]],
    yAxis:[[202,54],[202,747]],
    exponential:[
      [11,510],[40,506],[70,500],[100,495],[130,486],[160,476],[185,464],
      [202,455],[218,446],[240,432],[260,416],[280,399],[300,377],[320,352],
      [340,321],[350,308],[365,279],[380,254],[395,215],[415,168],[430,121],
      [442,86],[453,47],
    ],
    logarithm:[
      [346,741],[355,725],[367,707],[384,683],[405,657],[430,635],[460,608],
      [490,591],[520,577],[550,562],[590,545],[630,528],[680,510],[730,497],
      [780,484],[830,469],[870,460],[889,455],[914,452],[946,449],
    ],
  },
  labelOrigins:{"O":[184,760],"A":[158,407],"B":[333,760],"C":[889,469],"D":[308,266],"x":[925,759],"y":[167,31],"exp":[468,56],"log":[662,342],"schematic":[780,58]}
};

test('Jeil 2022 Q18 derives the quadrilateral and its perpendicular guides and restores B in the output padding',()=>{
  const {svg,points,coverage,staticAudit,display}=prepareSourceSchematic(jeil22Plan,jeil22Context);
  const {O,A,B,C,D}=points;
  assert.equal(A[0],O[0]);assert.equal(B[1],O[1]);assert.equal(C[1],A[1]);assert.equal(D[0],B[0]);
  assert.ok(D[1]<A[1]&&A[1]<B[1]&&A[0]<B[0]&&B[0]<C[0]);
  assert.deepEqual([staticAudit.status,staticAudit.pathsVerified,staticAudit.pointsVerified,staticAudit.labelsVerified],['PASS',10,5,10]);
  assert.equal(display.width,350);
  assert.ok(coverage.CD.ratio>=.8&&coverage.CD.longestGap<=36);
  assert.match(svg,/viewBox="0 0 960 810"/);
  assert.match(svg,/id="label-B" data-label-kind="POINT_NAME" data-owner="B"[^>]*transform="translate\(333 760\)"/);
  assert.equal((svg.match(/data-label-kind="EQUATION_LABEL"/g)??[]).length,2);
  assert.doesNotMatch(svg,/data-label-kind="(?:TICK_LABEL|COORDINATE_LABEL)"|정답|②|a=\\sqrt/);
});

test('the author path refuses wrong source relations, invalid frames, off-ink traces and extra derived edges',()=>{
  const stem=jeil22Question.content;
  assert.ok(stem.includes('$y$축에 수직인'));
  const incorrect={...jeil22Context,question:{...jeil22Question,content:stem.replace('$y$축에 수직인','$y$축에 평행인')}};
  assert.throws(()=>prepareSourceSchematic(jeil22Plan,incorrect),/SCHEMATIC_SOURCE_POINT_BINDING_UNSUPPORTED/);
  for(const [change,error] of [
    [p=>p.sourceSha256='0'.repeat(64),/SCHEMATIC_SOURCE_SHA_MISMATCH/],
    [p=>p.view.width=800,/SCHEMATIC_INVALID_OUTPUT_FRAME/],
    [p=>p.view.width=900,/SCHEMATIC_TRACE_OUTSIDE_OUTPUT_FRAME/],
    [p=>p.view.height=751,/SCHEMATIC_INVALID_LABEL_POSITIONS/],
    [p=>p.paths.logarithm[7]=[490,622],/SCHEMATIC_TRACE_WITHOUT_SOURCE_INK:logarithm/],
    [p=>p.paths.AC=[[202,455],[889,455]],/SCHEMATIC_INVALID_TRACE/]
  ]){
    const plan=structuredClone(jeil22Plan);change(plan);
    assert.throws(()=>prepareSourceSchematic(plan,jeil22Context),error);
  }
});

test('the quadrilateral readback rejects altered guides and point ownership',()=>{
  const {svg,points}=prepareSourceSchematic(jeil22Plan,jeil22Context);
  const groups=svg.split('<g id="schematic-labels">')[1].slice(0,-'</g></svg>'.length);
  const paths={...jeil22Plan.paths,...Object.fromEntries(['AC','BD','AB','BC','CD','DA'].map(id=>[id,[points[id[0]],points[id[1]]]]))};
  const expected={paths,points,groups:[{group:groups}],sourceSha256:jeil22Plan.sourceSha256,width:960,height:810,
    title:'지수곡선과 로그곡선이 만드는 사각형의 개형',
    description:'좌표평면의 개형이다. 세로축과 지수곡선의 교점은 A이고, 가로축과 로그곡선의 교점은 B이다. A에서 옮긴 수평선은 C에서 로그곡선과 만나고, B에서 세운 수직선은 D에서 지수곡선과 만난다. 네 점이 사각형을 이룬다.'};
  assert.equal(auditSourceSchematic(svg,expected).status,'PASS');
  const diagonal=svg.replace(/(<line id="AC"[^>]*y2=")[^"]+/,(_m,head)=>head+'500');
  assert.ok(auditSourceSchematic(diagonal,expected).errors.includes('SCHEMATIC_PATH_CHANGED:AC'));
  const owner=svg.replace('id="label-B" data-label-kind="POINT_NAME" data-owner="B"','id="label-B" data-label-kind="POINT_NAME" data-owner="D"');
  assert.ok(auditSourceSchematic(owner,expected).errors.includes('SCHEMATIC_LABELS_CHANGED'));
});
