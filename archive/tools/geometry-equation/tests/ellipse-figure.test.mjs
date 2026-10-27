// Pure solver / composer / independent-observer tests for ellipse-figure-v1 (no Chrome here:
// composeEllipseFigure's rendered-layout pass is exercised by the real item renders).
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {solveEllipseFigure,renderEllipseSvg,auditEllipseSvg,ellipseFigureSize,ellipseFigureSpec,ellipseLabelObstacles,placeLabels,validateEllipseFigurePlan,FIGURE_CAPABILITY} from '../production/ellipse-figure-v1.mjs';

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
