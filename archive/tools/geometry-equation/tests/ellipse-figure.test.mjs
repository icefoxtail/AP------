// Pure solver / composer / independent-observer tests for ellipse-figure-v1 (no Chrome here:
// composeEllipseFigure's rendered-layout pass is exercised by the real item renders).
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {solveEllipseFigure,composeEllipseFigure,renderEllipseSvg,auditEllipseSvg,ellipseFigureSize,ellipseFigureSpec,ellipseLabelObstacles,placeLabels,validateEllipseFigurePlan,FIGURE_CAPABILITY} from '../production/ellipse-figure-v1.mjs';

const identity=assetIdentity('22_매산고_1학기_중간_고2_기하와벡터_기출|18','SOLUTION_VISUAL','decisive-relation');
const policy={baseFontPx:15,displayScale:1,profile:'TEST'};
const base=()=>({capability:FIGURE_CAPABILITY,sourceConditions:[{id:'c1',condition:'c',mappedTo:['ellipse']}],newVisualInformation:['n'],caption:'c'});

// 22 매산고 q18: x^2/16+y^2/4=1, the diameter PQ through O with OP=5/2 and triangle PF'Q.
const chordPlan=()=>({...base(),
  ellipse:{center:['0','0'],semiAxisSquared:{major:'16',minor:'4'},majorAxis:'X'},
  points:[{id:'F',kind:'FOCUS',side:1},{id:"F'",kind:'FOCUS',side:-1},
    {id:'P',kind:'ON_ELLIPSE',x:'sqrt(3)',branch:'POS'},{id:'Q',kind:'OPPOSITE',of:'P'},{id:'O',kind:'ORIGIN'}],
  segments:[{id:'s1',from:'P',to:"F'"},{id:'s2',from:"F'",to:'Q'},{id:'s3',from:'P',to:'Q'}],
  polygons:[{id:'t1',points:['P',"F'",'Q'],fill:'LIGHT'}]});

// 22 매산고 q4: 3x^2+y^2=9 (major axis y), tangent at (-1,sqrt 6).
const tangentPlan=()=>({...base(),
  ellipse:{center:['0','0'],semiAxisSquared:{major:'9',minor:'3'},majorAxis:'Y'},
  points:[{id:'F',kind:'FOCUS',side:1},{id:"F'",kind:'FOCUS',side:-1},
    {id:'P',kind:'ON_ELLIPSE',x:'-1',branch:'POS',label:false},{id:'O',kind:'ORIGIN'}],
  lines:[{id:'l',slope:'sqrt(6)/2',intercept:'3*sqrt(6)/2',tangent:true}]});

// 22 매산고 q19: x^2/36+y^2/20=1, PF+PF' = 2PO.
const vectorPlan=()=>({...base(),
  ellipse:{center:['0','0'],semiAxisSquared:{major:'36',minor:'20'},majorAxis:'X'},
  points:[{id:'F',kind:'FOCUS',side:1},{id:"F'",kind:'FOCUS',side:-1},
    {id:'P',kind:'ON_ELLIPSE',x:'3',branch:'POS'},{id:'O',kind:'ORIGIN'}],
  segments:[{id:'s1',from:'P',to:'F'},{id:'s2',from:'P',to:"F'"},{id:'s3',from:'P',to:'O'}]});

// 26 제일고 q18: C' has foci F(0,2), F'(0,-10) and major axis 18 (centre (0,-4), a=9, b^2=45);
// Q=(sqrt(15)/2,-3/2) lies both on FP (FQ:QP=1:2) and on the second ellipse x^2/5+y^2/9=1,
// which shares the focus F.  Both ellipses have to stay on one shared coordinate plane.
const pairPlan=()=>({...base(),
  ellipses:[
    {id:'C1',center:['0','-4'],semiAxisSquared:{major:'81',minor:'45'},majorAxis:'Y'},
    {id:'C2',center:['0','0'],semiAxisSquared:{major:'9',minor:'5'},majorAxis:'Y'}],
  points:[
    {id:'F',kind:'FOCUS',side:1,ellipseId:'C1'},{id:"F'",kind:'FOCUS',side:-1,ellipseId:'C1'},
    {id:'P',kind:'ON_ELLIPSE',ellipseId:'C1',y:'-17/2',branch:'POS'},
    {id:'Q',kind:'ON_ELLIPSE',ellipseId:'C2',y:'-3/2',branch:'POS'},{id:'O',kind:'ORIGIN'}],
  segments:[{id:'s1',from:"F'",to:'F',label:'12'},{id:'s2',from:'F',to:'P',label:'12'}]});

const plans={'chord':chordPlan,'tangent':tangentPlan,'vector':vectorPlan};
const refused=(plan,expected)=>assert.throws(()=>validateEllipseFigurePlan(plan),error=>error.message===expected,expected);
const solverRefused=async(plan,expected)=>assert.rejects(()=>solveEllipseFigure(plan),error=>error.message===expected,expected);

test('the engine derives the foci, the diameter chord and the tangent point exactly',async()=>{
  const chord=await solveEllipseFigure(chordPlan());
  assert.equal(chord.focalDistance.exact,'2*sqrt(3)');
  assert.equal(chord.focusSeparation.exact,'4*sqrt(3)');
  assert.equal(chord.foci[0].x.exact,'2*sqrt(3)');
  assert.equal(chord.foci[1].x.exact,'-2*sqrt(3)');
  const p=chord.points.find(row=>row.id==='P'),q=chord.points.find(row=>row.id==='Q');
  assert.equal(p.x.exact,'sqrt(3)');assert.equal(p.y.exact,'sqrt(13)/2');
  assert.equal(q.x.exact,'-sqrt(3)');assert.equal(q.y.exact,'-sqrt(13)/2');
  assert.ok(p.onEllipse&&q.onEllipse);
  assert.equal(Math.hypot(Number(p.x.value),Number(p.y.value)),2.5);

  const tangent=await solveEllipseFigure(tangentPlan());
  assert.equal(tangent.majorAxis,'Y');
  assert.equal(tangent.semiAxis.major.exact,'3');
  assert.equal(tangent.focalDistance.exact,'sqrt(6)');
  const line=tangent.lines[0];
  assert.equal(line.tangent,true);
  assert.equal(line.tangencyPointId,'P');
  assert.equal(line.tangencyPoint.x.exact,'-1');
  assert.equal(line.tangencyPoint.y.exact,'sqrt(6)');

  const vector=await solveEllipseFigure(vectorPlan());
  assert.equal(vector.focalDistance.exact,'4');
  assert.equal(vector.points.find(row=>row.id==='P').y.exact,'sqrt(15)');
});

// 22 금당고 q21: the tangent y=-x+sqrt(5) meets the axes at the named points A and B, and triangle OAB
// is filled, so a point name has to clear the tangent line and the polygon edges (a real render failed
// with LABEL_GEOMETRY_COLLISION:point-A:line-l1 before those strokes were layout obstacles).
test('point names clear the tangent line and polygon edges, not only the curve and segments',async()=>{
  const plan={...base(),
    ellipse:{center:['0','0'],semiAxisSquared:{major:'4',minor:'1'},majorAxis:'X'},
    points:[{id:'T',kind:'POINT',x:'4*sqrt(5)/5',y:'sqrt(5)/5'},
      {id:'A',kind:'POINT',x:'sqrt(5)',y:'0'},{id:'B',kind:'POINT',x:'0',y:'sqrt(5)'},{id:'O',kind:'ORIGIN'}],
    polygons:[{id:'t1',points:['O','A','B'],fill:'LIGHT'}],
    lines:[{id:'l1',slope:'-1',intercept:'sqrt(5)',tangent:true}]};
  const model=await solveEllipseFigure(plan);
  const spec=ellipseFigureSpec(plan,model);
  const obstacles=ellipseLabelObstacles(spec);
  const line=spec.prims.find(prim=>prim.role==='line'),polygon=spec.prims.find(prim=>prim.role==='polygon');
  assert.ok(line&&polygon);
  const has=segment=>obstacles.segments.some(row=>
    row.a[0]===segment[0]&&row.a[1]===segment[1]&&row.b[0]===segment[2]&&row.b[1]===segment[3]);
  assert.ok(has([line.x1,line.y1,line.x2,line.y2]),'tangent line is a label obstacle');
  for(let index=0;index<polygon.points.length;index++){
    const start=polygon.points[index],end=polygon.points[(index+1)%polygon.points.length];
    assert.ok(has([start[0],start[1],end[0],end[1]]),`polygon edge ${index} is a label obstacle`);
  }
  const entries=spec.labels.map(label=>({...label,width:15,height:15}));
  const placed=placeLabels(entries,{size:spec.size},obstacles);
  assert.equal(placed.length,entries.length);
  const inBox=(x,y,box,margin)=>x>=box.x-margin&&x<=box.x+box.width+margin&&y>=box.y-margin&&y<=box.y+box.height+margin;
  for(const item of placed){
    for(const segment of obstacles.segments){
      const length=Math.hypot(segment.b[0]-segment.a[0],segment.b[1]-segment.a[1]);
      const steps=Math.max(20,Math.ceil(length/2));
      for(let step=0;step<=steps;step++){
        const t=step/steps;
        const x=segment.a[0]+(segment.b[0]-segment.a[0])*t,y=segment.a[1]+(segment.b[1]-segment.a[1])*t;
        assert.ok(!inBox(x,y,item.box,2),`${item.key} overlaps a drawn stroke`);
      }
    }
  }
});

test('rotated ellipses, circles, hyperbola-like input and a false tangency are refused with explicit codes',async()=>{
  refused({...chordPlan(),ellipse:{...chordPlan().ellipse,majorAxis:'R'}},'ELLIPSE_MAJOR_AXIS_UNSUPPORTED');
  refused({...chordPlan(),ellipse:{...chordPlan().ellipse,rotation:'30'}},'ELLIPSE_PLAN_INVALID');
  refused({...chordPlan(),ellipse:{...chordPlan().ellipse,hyperbola:{major:'16',minor:'4'}}},'ELLIPSE_PLAN_INVALID');
  refused({...chordPlan(),capability:'construction-spike-v1'},'ELLIPSE_PLAN_INVALID');
  await solverRefused({...chordPlan(),ellipse:{center:['0','0'],semiAxisSquared:{major:'9',minor:'9'},majorAxis:'X'}},'ELLIPSE_AXES_INVALID');
  await solverRefused({...chordPlan(),ellipse:{center:['0','0'],semiAxisSquared:{major:'4',minor:'16'},majorAxis:'X'}},'ELLIPSE_AXES_INVALID');
  await solverRefused({...chordPlan(),points:[{id:'P',kind:'ON_ELLIPSE',x:'9'}],segments:[],polygons:[]},'ELLIPSE_POINT_NOT_ON_ELLIPSE');
  await solverRefused({...chordPlan(),points:[{id:'Q',kind:'OPPOSITE',of:'P'}],segments:[],polygons:[]},'ELLIPSE_POINT_UNKNOWN');
  await solverRefused({...tangentPlan(),lines:[{id:'l',slope:'1',intercept:'1',tangent:true}]},'ELLIPSE_LINE_NOT_TANGENT');
  await solverRefused({...tangentPlan(),lines:[{id:'l',slope:'1',intercept:'1',label:'l'}]},'ELLIPSE_LINE_LABEL_UNSUPPORTED');
  await solverRefused({...chordPlan(),segments:[{id:'s1',from:'P',to:'P'}]},'ELLIPSE_SEGMENT_INVALID');
  await solverRefused({...chordPlan(),polygons:[{id:'t1',points:['P','F']}]},'ELLIPSE_POLYGON_INVALID');
  await solverRefused({...chordPlan(),points:[{id:'p',kind:'ORIGIN'}]},'ELLIPSE_POINT_ID_INVALID');
  await solverRefused({...chordPlan(),points:[{id:'O',kind:'ORIGIN'},{id:'O',kind:'ORIGIN'}]},'ELLIPSE_POINT_ID_DUPLICATE');
  refused({...pairPlan(),ellipses:[pairPlan().ellipses[0]]},'ELLIPSE_PAIR_COUNT_INVALID');
  refused({...pairPlan(),ellipses:[...pairPlan().ellipses,pairPlan().ellipses[0]]},'ELLIPSE_PAIR_COUNT_INVALID');
  refused({...pairPlan(),ellipses:[pairPlan().ellipses[0],{...pairPlan().ellipses[1],id:'C1'}]},'ELLIPSE_ELLIPSE_ID_DUPLICATE');
  refused({...pairPlan(),ellipses:[pairPlan().ellipses[0],{...pairPlan().ellipses[1],id:'C 2'}]},'ELLIPSE_ELLIPSE_ID_INVALID');
  refused({...pairPlan(),points:[{id:'F',kind:'FOCUS',side:1}]},'ELLIPSE_POINT_ELLIPSE_ID_REQUIRED');
  refused({...pairPlan(),points:[{id:'F',kind:'FOCUS',side:1,ellipseId:'C9'}]},'ELLIPSE_POINT_ELLIPSE_ID_INVALID');
  refused({...pairPlan(),ellipse:pairPlan().ellipses[0]},'ELLIPSE_PLAN_INVALID');
  await solverRefused({...pairPlan(),points:[{id:'P',kind:'ON_ELLIPSE',ellipseId:'C2',y:'9/2'}],segments:[]},'ELLIPSE_POINT_NOT_ON_ELLIPSE');
});

test('the composed SVG passes the independent observer, and tampering fails it',async()=>{
  for(const [name,make] of Object.entries(plans)){
    const plan=make(),model=await solveEllipseFigure(plan);
    const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
    assert.deepEqual(rendered.spec.size,ellipseFigureSize(model));
    const audit=await auditEllipseSvg({plan,svg:rendered.svg});
    assert.equal(audit.status,'PASS',`${name}: ${JSON.stringify(audit.errors)}`);
    assert.equal(audit.finalSvgSha256,rendered.lineage.svgSha256);
    // a moved point marker
    const moved=rendered.svg.replace(/id="point-P" data-role="point"([^>]*?)cx="([0-9.]+)"/,
      (all,head,cx)=>all.replace(`cx="${cx}"`,`cx="${Number(cx)+6}"`));
    assert.notEqual(moved,rendered.svg);
    assert.equal((await auditEllipseSvg({plan,svg:moved})).status,'FAIL');
    // a wrong ellipse radius
    const squashed=rendered.svg.replace(/rx="([0-9.]+)" ry="([0-9.]+)"/,(all,rx,ry)=>`rx="${rx}" ry="${Number(ry)*0.8}"`);
    assert.notEqual(squashed,rendered.svg);
    assert.equal((await auditEllipseSvg({plan,svg:squashed})).status,'FAIL');
    // a missing name
    const unlabeled=rendered.svg.replace(/data-tex="O"/,'data-tex=""');
    assert.notEqual(unlabeled,rendered.svg);
    assert.equal((await auditEllipseSvg({plan,svg:unlabeled})).status,'FAIL');
    // a far name
    const far=rendered.svg.replace(/(data-point="O"[^>]*data-box=")([0-9.]+)/,(all,head,x)=>`${head}${Number(x)+400}`);
    assert.equal((await auditEllipseSvg({plan,svg:far})).status,'FAIL');
    // a moved segment end (only when the figure has segments)
    if((plan.segments??[]).length){
      const bend=rendered.svg.replace(/id="segment-s1" data-role="segment"([^>]*?)x2="([0-9.]+)"/,
        (all,head,x2)=>all.replace(`x2="${x2}"`,`x2="${Number(x2)+6}"`));
      assert.notEqual(bend,rendered.svg);
      assert.equal((await auditEllipseSvg({plan,svg:bend})).status,'FAIL');
    }
    // an undeclared extra point
    const extra=rendered.svg.replace('</svg>','<circle id="point-Z" data-role="point" data-point="Z" cx="40" cy="40" r="3" fill="#111"/></svg>');
    assert.equal((await auditEllipseSvg({plan,svg:extra})).status,'FAIL');
  }
  const plan=tangentPlan(),model=await solveEllipseFigure(plan);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  const skew=rendered.svg.replace(/id="line-l" data-role="line"([^>]*?)y2="([0-9.]+)"/,
    (all,head,y2)=>all.replace(`y2="${y2}"`,`y2="${Number(y2)+9}"`));
  const audit=await auditEllipseSvg({plan,svg:skew});
  assert.equal(audit.status,'FAIL');
  assert.ok(audit.errors.some(error=>error.startsWith('LINE_OFF_EQUATION:l')),JSON.stringify(audit.errors));
});

test('two axis-aligned ellipses derive exact shared-focus facts on one plane',async()=>{
  const plan=pairPlan(),model=await solveEllipseFigure(plan);
  assert.equal(model.mode,'PAIR');
  assert.equal(model.ellipses.length,2);
  assert.equal(model.ellipses[0].id,'C1');
  assert.equal(model.ellipses[0].semiAxis.major.exact,'9');
  assert.equal(model.ellipses[0].semiAxis.minor.exact,'3*sqrt(5)');
  assert.equal(model.ellipses[0].foci[0].y.exact,'2');
  assert.equal(model.ellipses[0].foci[1].y.exact,'-10');
  assert.equal(model.ellipses[1].id,'C2');
  assert.equal(model.ellipses[1].semiAxis.major.exact,'3');
  assert.equal(model.ellipses[1].semiAxis.minor.exact,'sqrt(5)');
  assert.equal(model.ellipses[1].foci[0].y.exact,'2');
  const p=model.points.find(row=>row.id==='P'),q=model.points.find(row=>row.id==='Q');
  assert.equal(p.x.exact,'3*sqrt(15)/2');assert.equal(p.y.exact,'-17/2');
  assert.equal(q.x.exact,'sqrt(15)/2');assert.equal(q.y.exact,'-3/2');
  assert.ok(p.onEllipse&&q.onEllipse);
  assert.equal(p.ellipseId,'C1');assert.equal(q.ellipseId,'C2');
  assert.equal(model.points.find(row=>row.id==='F').onEllipse,false);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  const ellipsePrims=rendered.spec.prims.filter(prim=>prim.role==='ellipse');
  assert.equal(ellipsePrims.length,2);
  assert.deepEqual(ellipsePrims.map(prim=>prim.data.ellipse),['C1','C2']);
  for(const id of ['s1','s2']){
    const line=rendered.svg.match(new RegExp(`<line id="leader-measure-${id}"[^>]+/>`))?.[0];
    assert.ok(line,`duplicate 12 on ${id} must have an owner leader`);
    assert.match(line,new RegExp(`data-owner-label="measure-${id}"`));
    assert.match(line,new RegExp(`data-owner-segment="${id}"`));
    const attrs=Object.fromEntries([...line.matchAll(/([\w-]+)="([^"]*)"/g)].map(match=>[match[1],match[2]]));
    const segment=rendered.spec.prims.find(prim=>prim.id===`segment-${id}`);
    const visible=(value)=>Math.round(value*100)/100;
    assert.ok(Math.abs(Number(attrs.x2)-(visible(segment.x1)+visible(segment.x2))/2)<1e-4,`${id} leader anchor x`);
    assert.ok(Math.abs(Number(attrs.y2)-(visible(segment.y1)+visible(segment.y2))/2)<1e-4,`${id} leader anchor y`);
  }
  const audit=await auditEllipseSvg({plan,svg:rendered.svg});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  assert.equal(audit.finalSvgSha256,rendered.lineage.svgSha256);
});

test('duplicate segment measure leaders fail closed when missing or rebound to another segment',async()=>{
  const plan=pairPlan(),model=await solveEllipseFigure(plan);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  const missing=rendered.svg.replace(/<g data-layer="50"><line id="leader-measure-s1"[^>]+\/><\/g>/,'');
  assert.equal((await auditEllipseSvg({plan,svg:missing})).status,'FAIL');
  const rebound=rendered.svg.replace('data-owner-segment="s2"','data-owner-segment="s1"');
  const result=await auditEllipseSvg({plan,svg:rebound});
  assert.equal(result.status,'FAIL');
  assert.ok(result.errors.some(error=>error.startsWith('MEASURE_LEADER_OWNER_MISMATCH:s2')),
    JSON.stringify(result.errors));
  const line=rendered.svg.match(/<line id="leader-measure-s2"[^>]+\/>/)?.[0];
  const label=rendered.svg.match(/<g id="measure-s2"[^>]*data-box="([^"]+)"/)?.[1].split(',').map(Number);
  assert.ok(line&&label,'test fixture exposes the owner label and box');
  const wrongStart=line.replace(/x1="[0-9.]+" y1="[0-9.]+"/,
    `x1="${label[0]}" y1="${label[1]+label[3]/2}"`);
  const ownBoxCrossing=rendered.svg.replace(line,wrongStart);
  const ownBoxResult=await auditEllipseSvg({plan,svg:ownBoxCrossing});
  assert.ok(ownBoxResult.errors.some(error=>error.startsWith('MEASURE_LEADER_CROSSES_OWN_LABEL:measure-s2')),
    JSON.stringify(ownBoxResult.errors));
  const leaderAttrs=Object.fromEntries([...line.matchAll(/([\w-]+)="([^"]*)"/g)].map(match=>[match[1],match[2]]));
  const midX=(Number(leaderAttrs.x1)+Number(leaderAttrs.x2))/2,midY=(Number(leaderAttrs.y1)+Number(leaderAttrs.y2))/2;
  const crossingStroke=`<g data-layer="30"><line id="intruder" data-role="line" x1="${midX}" y1="${midY-10}" x2="${midX}" y2="${midY+10}" fill="none" stroke="#111" stroke-width="1"/></g>`;
  const crossed=rendered.svg.replace('</svg>',crossingStroke+'</svg>');
  const crossingResult=await auditEllipseSvg({plan,svg:crossed});
  assert.ok(crossingResult.errors.some(error=>error.startsWith('MEASURE_LEADER_CROSSES_STROKE:measure-s2:intruder')),
    JSON.stringify(crossingResult.errors));
});

test('the pair observer rejects a moved second ellipse, a missing one and an undeclared one',async()=>{
  const plan=pairPlan(),model=await solveEllipseFigure(plan);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  const moved=rendered.svg.replace(/(id="ellipse-C2"[^>]*?cy=")([0-9.]+)"/,
    (all,head,cy)=>`${head}${Number(cy)+8}"`);
  assert.notEqual(moved,rendered.svg);
  assert.equal((await auditEllipseSvg({plan,svg:moved})).status,'FAIL');
  const squashed=rendered.svg.replace(/(id="ellipse-C2"[^>]*?ry=")([0-9.]+)"/,
    (all,head,ry)=>`${head}${Number(ry)*0.8}"`);
  assert.notEqual(squashed,rendered.svg);
  assert.equal((await auditEllipseSvg({plan,svg:squashed})).status,'FAIL');
  const removed=rendered.svg.replace(/<g data-layer="25"><ellipse id="ellipse-C2"[^>]*><\/g>/,'');
  assert.notEqual(removed,rendered.svg);
  assert.equal((await auditEllipseSvg({plan,svg:removed})).status,'FAIL');
  const extra=rendered.svg.replace('</svg>','<g data-layer="25"><ellipse id="ellipse-C3" data-role="ellipse" data-ellipse="C3" cx="40" cy="40" rx="10" ry="20" fill="none"/></g></svg>');
  assert.equal((await auditEllipseSvg({plan,svg:extra})).status,'FAIL');
});

// --- conic (parabola) plans: root field `conic`, same capability, own solver branch and observer ----------------------------------------------
// 26 제일고 q2: a focal chord with AF=AM=5, BF=BN=3 gives p=15/8; M, N are the feet on the directrix l.
const parabolaPlan=()=>({...base(),
  conic:{kind:'PARABOLA',vertex:['0','0'],p:'15/8',axis:'X'},
  points:[{id:'O',kind:'ORIGIN'},{id:'F',kind:'FOCUS'},{id:'A',kind:'ON_CONIC',x:'25/8',branch:'POS'},
    {id:'B',kind:'LINE_CONIC',line:'k1',which:1},
    {id:'M',kind:'FOOT',from:'A',onto:'l',rightAngle:true},{id:'N',kind:'FOOT',from:'B',onto:'l',rightAngle:true}],
  lines:[{id:'l',role:'DIRECTRIX',label:'l'},{id:'k1',through:['A','F'],hidden:true}],
  segments:[{id:'sAM',from:'A',to:'M',label:'5'},{id:'sBN',from:'B',to:'N',label:'3'},
    {id:'sAF',from:'A',to:'F',label:'5'},{id:'sBF',from:'B',to:'F',label:'3'}]});

test('a parabola plan derives the focus, directrix, intersection and feet exactly',async()=>{
  const model=await solveEllipseFigure(parabolaPlan());
  assert.equal(model.mode,'CONIC');
  assert.equal(model.conic.focus.x.exact,'15/8');
  assert.equal(model.conic.directrix.value.exact,'-15/8');
  const row=id=>model.points.find(point=>point.id===id);
  assert.equal(row('A').y.exact,'5*sqrt(15)/4');
  assert.equal(row('B').x.exact,'9/8');assert.equal(row('B').y.exact,'-3*sqrt(15)/4');
  assert.equal(row('M').x.exact,'-15/8');assert.equal(row('N').y.exact,'-3*sqrt(15)/4');
  assert.ok(row('A').onCurve&&row('B').onCurve&&!row('M').onCurve);
  // the definition: AF=AM and BF=BN
  const dist=(p,q)=>Math.hypot(p.x.value-q.x.value,p.y.value-q.y.value);
  assert.ok(Math.abs(dist(row('A'),model.conic.focus)-dist(row('A'),row('M')))<1e-9);
  assert.ok(Math.abs(dist(row('B'),model.conic.focus)-dist(row('B'),row('N')))<1e-9);
});

test('parabola plans refuse bad parameters, missing intersections and a second plane field',async()=>{
  const withConic=changes=>({...parabolaPlan(),conic:{...parabolaPlan().conic,...changes}});
  await solverRefused(withConic({p:'0'}),'CONIC_PARAMETER_INVALID');
  await solverRefused(withConic({kind:'SPIRAL'}),'CONIC_KIND_UNSUPPORTED');
  refused(withConic({kind:'SPIRAL'}),'CONIC_KIND_UNSUPPORTED');
  refused({...parabolaPlan(),ellipse:chordPlan().ellipse},'CONIC_PLAN_CONFLICT');
  refused({...chordPlan(),conic:parabolaPlan().conic},'CONIC_PLAN_CONFLICT');
  refused({...chordPlan(),lines:[{id:'l',slope:'1',intercept:'0',role:'DIRECTRIX'}]},'CONIC_DIRECTRIX_REQUIRES_PARABOLA');
  refused({...parabolaPlan(),lines:[{id:'l',role:'DIRECTRIX',label:'x'.repeat(41)}]},'CONIC_LINE_LABEL_INVALID');
  await solverRefused({...parabolaPlan(),points:[{id:'A',kind:'ON_CONIC',x:'-1',branch:'POS'}],lines:[],segments:[]},'CONIC_POINT_NOT_ON_CURVE');
  await solverRefused({...parabolaPlan(),points:[{id:'B',kind:'LINE_CONIC',line:'k',which:1}],lines:[{id:'k',x:'-3'}],segments:[]},'CONIC_LINE_NO_INTERSECTION');
  await solverRefused({...parabolaPlan(),points:[{id:'B',kind:'LINE_CONIC',line:'k',which:2}],lines:[{id:'k',y:'1'}],segments:[]},'CONIC_INTERSECTION_INDEX_INVALID');
  await solverRefused({...parabolaPlan(),points:[{id:'A',kind:'ON_CONIC',y:'2'},{id:'M',kind:'FOOT',from:'A',onto:'zz'}],lines:[],segments:[]},'CONIC_FOOT_INVALID');
  await solverRefused({...parabolaPlan(),points:[{id:'O',kind:'ORIGIN'},{id:'V',kind:'VERTEX'}],lines:[],segments:[]},'CONIC_POINT_COINCIDENT');
});

test('the parabola figure renders in real Chrome, passes its observer, and tampering fails it',async()=>{
  const plan=parabolaPlan(),model=await solveEllipseFigure(plan);
  const composed=await composeEllipseFigure({plan,model,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const svg=composed.svg;
  assert.match(svg,/<path id="curve" data-role="curve" data-curve="PARABOLA" d="M/);
  assert.match(svg,/data-conic="PARABOLA"/);
  assert.ok(!/<ellipse/.test(svg));
  for(const id of ['sAM','sBN','sAF','sBF'])assert.match(svg,new RegExp(`<line id="leader-measure-${id}"`),`${id}: a repeated value keeps its owner leader`);
  assert.match(svg,/data-label-role="line"[^>]*data-line="l"/);
  assert.equal((svg.match(/id="rightangle-/g)||[]).length,2);
  const audit=await auditEllipseSvg({plan,svg});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  const failsWith=async(tampered,prefix)=>{
    assert.notEqual(tampered,svg);
    const result=await auditEllipseSvg({plan,svg:tampered});
    assert.equal(result.status,'FAIL');
    assert.ok(result.errors.some(error=>error.startsWith(prefix)),`${prefix} in ${JSON.stringify(result.errors)}`);
  };
  await failsWith(svg.replace(/(id="curve"[^>]* d=")M([0-9.]+) ([0-9.]+)/,(all,head,x,y)=>`${head}M${Number(x)+9} ${y}`),'CONIC_CURVE_OFF_EQUATION');
  await failsWith(svg.replace(/(id="line-l" data-role="line"[^>]*?)x1="([0-9.]+)" y1="([0-9.]+)" x2="([0-9.]+)"/,
    (all,head,x1,y1,x2)=>`${head}x1="${Number(x1)+6}" y1="${y1}" x2="${Number(x2)+6}"`),'CONIC_DIRECTRIX_MISMATCH:l');
  await failsWith(svg.replace(/(id="point-M" data-role="point"[^>]*?)cy="([0-9.]+)"/,(all,head,cy)=>`${head}cy="${Number(cy)+12}"`),'CONIC_FOOT_MISMATCH:M');
  await failsWith(svg.replace(/<polyline id="rightangle-N"[^>]*\/>/,''),'CONIC_FOOT_MISMATCH:N:rightangle-missing');
  await failsWith(svg.replace(/(data-label-role="line"[^>]*data-line="l" data-tex=")l"/,'$1m"'),'CONIC_LINE_LABEL_MISMATCH:l:text');
  await failsWith(svg.replace(/(id="point-B" data-role="point"[^>]*?)cx="([0-9.]+)"/,(all,head,cx)=>`${head}cx="${Number(cx)+20}"`),'CONIC_POINT_OFF_CURVE:B');
});

test('a line name with no room beside its line gets a leader joined to the line',()=>{
  const layout={size:{width:200,height:200}};
  const owner={a:[100,20],b:[100,180]};
  const entry={key:'line-l',role:'line',lineId:'l',text:'l',width:8,height:12,ownerSegment:owner,
    pointX:100,pointY:100,centerX:100,centerY:100,candidates:[{dx:12,dy:0,distance:12}],
    fallbacks:[{pointX:100,pointY:60,centerX:100,centerY:60,candidates:[{dx:30,dy:0,distance:30}]}]};
  const obstacles={points:[{key:'P',x:112,y:100}],curve:[],segments:[{a:owner.a,b:owner.b}]};
  const [placed]=placeLabels([entry],layout,obstacles);
  assert.ok(placed.leader,'the near spot is blocked, so the name is led out');
  assert.deepEqual(placed.leader.b,[100,60]);
  const [near]=placeLabels([{...entry,candidates:[{dx:14,dy:0,distance:14}]}],layout,{points:[],curve:[],segments:[{a:owner.a,b:owner.b}]});
  assert.equal(near.leader,null,'a free spot beside the line needs no leader');
});

// 26 매산고 q13 (G2b): x^2-y^2=12, the line y=2x-6 through (4,2), both asymptotes, and the triangle they bound with it.
const hyperbolaPlan=()=>({...base(),
  conic:{kind:'HYPERBOLA',center:['0','0'],aSquared:'12',bSquared:'12',transverse:'X'},
  points:[{id:'O',kind:'ORIGIN'},{id:'P',kind:'ON_CONIC',x:'4',sign:'POS'},
    {id:'A',kind:'LINE_LINE',lines:['k1','s1']},{id:'B',kind:'LINE_LINE',lines:['k1','s2']}],
  lines:[{id:'s1',role:'ASYMPTOTE',sign:1,dashed:true,label:'y=x'},{id:'s2',role:'ASYMPTOTE',sign:-1,dashed:true,label:'y=-x'},
    {id:'k1',slope:'2',intercept:'-6'}],
  polygons:[{id:'tri',points:['O','A','B'],fill:'LIGHT'}]});

test('hyperbola plans derive exact points and refuse bad parameters, asymptote misuse and parallel lines',async()=>{
  const model=await solveEllipseFigure(hyperbolaPlan());
  const row=id=>model.points.find(point=>point.id===id);
  assert.equal(model.conic.kind,'HYPERBOLA');
  assert.equal(row('A').x.exact,'6');assert.equal(row('A').y.exact,'6');
  assert.equal(row('B').x.exact,'2');assert.equal(row('B').y.exact,'-2');
  assert.ok(row('P').onCurve&&!row('A').onCurve);
  const withConic=changes=>({...hyperbolaPlan(),conic:{...hyperbolaPlan().conic,...changes}});
  await solverRefused(withConic({aSquared:'0'}),'CONIC_PARAMETER_INVALID');
  refused(withConic({vertex:['0','0']}),'CONIC_PARAMETER_INVALID');
  await solverRefused({...hyperbolaPlan(),lines:[{id:'d',role:'DIRECTRIX'}],points:[],polygons:[]},'CONIC_DIRECTRIX_REQUIRES_PARABOLA');
  refused({...hyperbolaPlan(),lines:[{id:'d',role:'DIRECTRIX'}]},'CONIC_DIRECTRIX_REQUIRES_PARABOLA');
  refused({...parabolaPlan(),lines:[{id:'s',role:'ASYMPTOTE',sign:1}]},'CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA');
  await solverRefused({...parabolaPlan(),lines:[{id:'s',role:'ASYMPTOTE',sign:1}],points:[],segments:[]},'CONIC_ASYMPTOTE_REQUIRES_HYPERBOLA');
  await solverRefused({...hyperbolaPlan(),lines:[{id:'s',role:'ASYMPTOTE',sign:3}],points:[],polygons:[]},'CONIC_PARAMETER_INVALID');
  await solverRefused({...hyperbolaPlan(),points:[{id:'A',kind:'LINE_LINE',lines:['s1','m']}],polygons:[],
    lines:[{id:'s1',role:'ASYMPTOTE',sign:1},{id:'m',slope:'1',intercept:'1'}]},'CONIC_LINES_PARALLEL');
  await solverRefused({...hyperbolaPlan(),points:[{id:'A',kind:'ON_CONIC',x:'1',sign:'POS'}],polygons:[],lines:[]},'CONIC_POINT_NOT_ON_CURVE');
});

test('the hyperbola figure renders in real Chrome with both branches, passes its observer, and tampering fails it',async()=>{
  const plan=hyperbolaPlan(),model=await solveEllipseFigure(plan);
  const composed=await composeEllipseFigure({plan,model,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const svg=composed.svg;
  assert.match(svg,/data-curve="HYPERBOLA" data-branch="POS"/);
  assert.match(svg,/data-curve="HYPERBOLA" data-branch="NEG"/);
  assert.match(svg,/data-conic="HYPERBOLA"/);
  assert.ok(!/<ellipse/.test(svg));
  assert.match(svg,/data-label-role="line"[^>]*data-line="s2"/);
  const audit=await auditEllipseSvg({plan,svg});
  assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
  const failsWith=async(tampered,prefix)=>{
    assert.notEqual(tampered,svg);
    const result=await auditEllipseSvg({plan,svg:tampered});
    assert.equal(result.status,'FAIL');
    assert.ok(result.errors.some(error=>error.startsWith(prefix)),`${prefix} in ${JSON.stringify(result.errors)}`);
  };
  await failsWith(svg.replace(/(id="curve-neg"[^>]* d=")M([0-9.]+) ([0-9.]+)/,(all,head,x,y)=>`${head}M${Number(x)+9} ${y}`),'CONIC_CURVE_OFF_EQUATION');
  await failsWith(svg.replace(/<path id="curve-neg"[^>]*\/>/,''),'CONIC_HYPERBOLA_BRANCH_MISSING');
  await failsWith(svg.replace(/(id="line-s1" data-role="line"[^>]*?)y2="([0-9.]+)"/,(all,head,y2)=>`${head}y2="${Number(y2)+10}"`),'CONIC_ASYMPTOTE_MISMATCH:s1');
  await failsWith(svg.replace(/(id="point-A" data-role="point"[^>]*?)cx="([0-9.]+)"/,(all,head,cx)=>`${head}cx="${Number(cx)+9}"`),'CONIC_LINE_LINE_MISMATCH:A');
});

test('a line name beside a diagonal line is led out corner-first so the leader meets the line squarely',()=>{
  const layout={size:{width:300,height:300}};
  const owner={a:[20,20],b:[280,280]};
  const entry={key:'line-s',role:'line',lineId:'s',text:'y=-x',width:60,height:16,ownerSegment:owner,
    pointX:150,pointY:150,centerX:150,centerY:150,candidates:[{dx:10,dy:-10,distance:14}],
    fallbacks:[{pointX:150,pointY:150,centerX:150,centerY:150,candidates:[{dx:-34,dy:34,distance:48},{dx:34,dy:-34,distance:48}]}]};
  const [placed]=placeLabels([entry],layout,{points:[],curve:[],segments:[{a:owner.a,b:owner.b}]});
  assert.ok(placed.leader,'no spot beside the line, so it is led out');
  const [a,b]=[placed.leader.a,placed.leader.b];
  const lead=[a[0]-b[0],a[1]-b[1]],along=[1,1];
  const cos=Math.abs(lead[0]*along[0]+lead[1]*along[1])/(Math.hypot(...lead)*Math.hypot(...along));
  assert.ok(cos<0.2,'the leader runs close to perpendicular to the line');
});

// --- G2c: circle / ellipse kinds, two curves (`conics`), tangents --------------------------------------------------------------------------
const mixPlan=()=>({...base(),
  conics:[{id:'c1',kind:'ELLIPSE',center:['0','0'],aSquared:'36',bSquared:'16',major:'X'},{id:'c2',kind:'PARABOLA',vertex:['0','0'],p:'1',axis:'X'}],
  points:[{id:'O',kind:'ORIGIN'},{id:'P',kind:'CONIC_CONIC',curves:['c1','c2'],which:1}],
  lines:[{id:'t1',tangent:true,at:'P',curve:'c1'},{id:'t2',tangent:true,at:'P',curve:'c2'}]});

test('conics plans check their shape and the solver refuses bad curves, tangents and counts',async()=>{
  refused({...mixPlan(),conics:[...mixPlan().conics,{id:'c3',kind:'CIRCLE',center:['0','0'],rSquared:'1'}]},'CONIC_TOO_MANY_CURVES');
  refused({...mixPlan(),conic:mixPlan().conics[0]},'CONIC_PLAN_CONFLICT');
  refused({...mixPlan(),ellipse:{center:['0','0']}},'CONIC_PLAN_CONFLICT');
  await solverRefused({...mixPlan(),lines:[{id:'t',slope:'0',intercept:'3',tangent:true,curve:'c1'}]},'CONIC_TANGENT_CLAIM_FALSE');
  await solverRefused({...mixPlan(),points:[{id:'F',kind:'FOCUS',side:1}],lines:[]},'CONIC_CURVE_REQUIRED');
  await solverRefused({...mixPlan(),points:[{id:'P',kind:'CONIC_CONIC',curves:['c1','c2'],which:3}],lines:[]},'CONIC_INTERSECTION_INDEX_INVALID');
  await solverRefused({...base(),conic:{kind:'CIRCLE',center:['0','0'],rSquared:'25'},
    points:[{id:'Q',kind:'POINT',x:'1',y:'1'},{id:'A',kind:'TANGENT_FROM',from:'Q',which:1}]},'CONIC_TANGENT_FROM_INVALID');
  await solverRefused({...base(),conic:{kind:'CIRCLE',center:['0','0'],rSquared:'0'}},'CONIC_PARAMETER_INVALID');
});

test('an ellipse and a parabola meet at P with a tangent to each; the figure renders in Chrome and tampering fails the observer',async()=>{
  const plan=mixPlan(),model=await solveEllipseFigure(plan);
  const composed=await composeEllipseFigure({plan,model,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const svg=composed.svg;
  assert.match(svg,/data-curve="ELLIPSE" data-curve-id="c1"/);
  assert.match(svg,/data-curve="PARABOLA" data-curve-id="c2"/);
  assert.match(svg,/data-conic="ELLIPSE\+PARABOLA"/);
  assert.equal((await auditEllipseSvg({plan,svg})).status,'PASS');
  const failsWith=async(tampered,prefix)=>{
    assert.notEqual(tampered,svg);
    const result=await auditEllipseSvg({plan,svg:tampered});
    assert.equal(result.status,'FAIL');
    assert.ok(result.errors.some(error=>error.startsWith(prefix)),`${prefix} in ${JSON.stringify(result.errors)}`);
  };
  await failsWith(svg.replace(/(id="point-P" data-role="point"[^>]*?)cy="([0-9.]+)"/,(all,head,cy)=>`${head}cy="${Number(cy)-30}"`),'CONIC_CONIC_INTERSECTION_MISMATCH:P');
  await failsWith(svg.replace(/(id="line-t1" data-role="line"[^>]*?)y2="([0-9.]+)"/,(all,head,y2)=>`${head}y2="${Number(y2)+10}"`),'LINE_OFF_EQUATION');
  await failsWith(svg.replace(/<path id="curve-c2"[^>]*\/>/,''),'CONIC_CURVE_COUNT_INVALID');
});

test('a circle with tangents from an outside point renders and a lopsided circle fails the observer',async()=>{
  const circle={...base(),conic:{kind:'CIRCLE',center:['0','0'],rSquared:'25'},
    points:[{id:'Q',kind:'POINT',x:'7',y:'1'},{id:'A',kind:'TANGENT_FROM',from:'Q',which:1},{id:'B',kind:'TANGENT_FROM',from:'Q',which:2}],
    lines:[{id:'u',through:['Q','A'],tangent:true},{id:'w',through:['Q','B'],tangent:true}]};
  const model=await solveEllipseFigure(circle);
  const composed=await composeEllipseFigure({plan:circle,model,identity,typographyPolicy:policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.match(composed.svg,/data-conic="CIRCLE"/);
  const lopsided=composed.svg.replace(/(<path id="curve"[^>]* d=")M([0-9.]+) ([0-9.]+)/,(all,head,x,y)=>`${head}M${Number(x)+9} ${y}`);
  assert.notEqual(lopsided,composed.svg);
  assert.equal((await auditEllipseSvg({plan:circle,svg:lopsided})).status,'FAIL');
});
