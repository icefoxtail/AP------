// Chrome-using (composes solid figure panels): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {compositePanels} from '../production/composite-candidate-svg-v1.mjs';
import {solveSolidFigure,expandSolidFigure,solidFigureSpec,figurePanelSize,composeSolidFigurePanel,edgeRuns,lengthTex,labelNumber} from '../production/solid-figure-v1.mjs';

const observer=fileURLToPath(new URL('../production/solid_figure_observer_worker.py',import.meta.url));
const code=expected=>error=>String(error.message).startsWith(expected);
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const meta={caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'solids'}],newVisualInformation:['n']};
const figure=over=>({capability:'solid-figure-v1',...over,...meta});
const cuboid=(over={})=>({kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:{base:'FGHE',top:'BCDA'},...over});
const identity=assetIdentity('solid-fixture|1','SOLUTION_VISUAL','decisive-relation');
const audit=async(plan,svg)=>{const r=await pythonWorker({solidFigure:plan,svg},{script:observer,timeoutMs:30000});assert.equal(r.status,'OK');return r.result;};
const panel=async plan=>{const model=solveSolidFigure(plan);return composeSolidFigurePanel({plan,model,identity,typographyPolicy:policy});};
const hiddenEdges=solid=>solid.runs.flatMap(e=>e.runs.filter(r=>r.hidden).map(()=>solid.vertices[e.a].name+solid.vertices[e.b].name)).sort();

test('a cuboid shows 9 edges and hides the 3 at its back-bottom-left corner; a pyramid hides what its base hides',()=>{
  const m=solveSolidFigure(figure({solids:[cuboid()]}));
  const solid=m.solids[0];
  assert.equal(solid.edges.length,12);
  assert.deepEqual(hiddenEdges(solid),['EA','FE','HE']);// an edge is named by its two vertices in index order
  assert.equal(hiddenEdges(solid).length,3);
  assert.ok(hiddenEdges(solid).every(name=>name.includes('E')));
  // every edge is one whole solid or hidden run for a convex solid
  assert.ok(solid.runs.every(e=>e.runs.length===1));
  const pyramid=solveSolidFigure(figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:5,depth:5},height:9,names:'ABCDE'}]}));
  assert.deepEqual(hiddenEdges(pyramid.solids[0]),['AD','CD','DE']);
});
test('a prism over a trapezoid in the front plane hides the three edges at its far corner',()=>{
  const m=solveSolidFigure(figure({solids:[{kind:'PRISM',base:{kind:'POLYGON',plane:'XZ',points:[[0,0],[6,0],[4,4],[0,4]]},height:3,names:{base:'FGCB',top:'EHDA'}}]}));
  assert.equal(m.solids[0].edges.length,12);
  assert.deepEqual(hiddenEdges(m.solids[0]),['EA','EH','FE']);
});
test('a non-convex prism (L-shaped base) gets partial hiding from the depth test, never from face normals alone',()=>{
  const l=solveSolidFigure(figure({solids:[{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[4,0],[4,2],[2,2],[2,4],[0,4]]},height:2,names:'ABCDEFGHIJKL'}]}));
  const solid=l.solids[0];
  assert.equal(solid.edges.length,18);
  assert.ok(hiddenEdges(solid).length>=3);
  assert.equal(edgeRuns(solid).length,18);
});
test('the frustum of a cone and the cone have tangent silhouettes: model builds and the panel is sized',()=>{
  for(const [solids,dims] of [[[{kind:'CONE_FRUSTUM',radius:6,topRadius:3,height:4}],[{height:true}]],[[{kind:'CYLINDER',radius:4,height:10}],[{height:true}]],[[{kind:'CONE',radius:4,height:6},{kind:'SPHERE',radius:2}],[{solid:'s1',height:true}]],[[{kind:'HEMISPHERE',radius:3}],[{radius:'center'}]]]){
    const model=solveSolidFigure(figure({solids,dims}));
    const size=figurePanelSize(model);
    assert.equal(size.width,480);assert.ok(size.height>150&&size.height<420);
  }
});
test('lengths are written exactly and numeric labels are read back',()=>{
  assert.equal(lengthTex(5),'5');assert.equal(lengthTex(7.5),'7.5');assert.equal(lengthTex(5*Math.SQRT2),'5\\sqrt{2}');assert.equal(lengthTex(Math.sqrt(3)),'\\sqrt{3}');
  assert.equal(lengthTex(10/3),'\\frac{10}{3}');assert.equal(lengthTex(8*Math.PI),'8\\pi');assert.equal(lengthTex(Math.PI),'\\pi');
  assert.equal(lengthTex(Math.E),null);
  assert.ok(Math.abs(labelNumber('5\\sqrt{3}\\,\\mathrm{cm}')-5*Math.sqrt(3))<1e-12);
  assert.equal(labelNumber('2\\pi r'),null);assert.equal(labelNumber('144^\\circ'),144);
});
test('the engine refuses what it cannot draw with explicit codes',()=>{
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'TORUS',radius:1}]})),code('SOLID_KIND_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:-1,height:2}]})),code('SOLID_PARAM_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CONE_FRUSTUM',radius:3,topRadius:3,height:2}]})),code('SOLID_FRUSTUM_TOP_NOT_SMALLER'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid({names:{base:'ABCD',top:'ABCD'}})]})),code('SOLID_NAME_DUPLICATE'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[2,2],[2,0],[0,2]]},height:1}]})),code('SOLID_BASE_NOT_SIMPLE'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'PYRAMID',base:{kind:'POLYGON',points:[[0,0],[4,0],[4,2],[2,2],[2,4],[0,4]]},height:2}]})),code('SOLID_BASE_NOT_CONVEX'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid(),cuboid({names:'ABCDEFGH'}),cuboid({names:'IJKLMNOP'}),cuboid({names:'QRSTUVWX'})]})),code('SOLID_COUNT_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],dims:[{edge:'AG'}]})),code('SOLID_DIM_SEGMENT_NOT_DRAWN'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],dims:[{edge:'FG',label:'5'}]})),code('SOLID_DIM_VALUE_MISMATCH'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],dims:[{edge:'ZZ'}]})),code('SOLID_NAME_UNKNOWN'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],highlights:[{polygon:['A','B','G']}]})),code('SOLID_HIGHLIGHT_EDGE_NOT_DRAWN'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:1,height:2}],dims:[{slant:true}]})),code('SOLID_DIMS_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'SPHERE',radius:1}],section:{kind:'AXIAL'}})),code('SOLID_SECTION_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure({capability:'solid-figure-v1',...meta}),code('SOLID_PLAN_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:1,height:2}]})),code('SOLID_FIGURE_NEEDS_A_LABEL'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],unit:'furlong'})),code('SOLID_UNIT_INVALID'));
});
const cubeNet=(joins,over={})=>figure({net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:2,names:'........'},root:'side0',joins,...over}});
test('a net is the solid unfolded along a tree of faces; bad trees and overlapping layouts are refused',()=>{
  const ok=cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']]);
  const m=solveSolidFigure(ok);
  assert.equal(m.faces.length,6);
  // all six faces are unit squares of side 2 in the net
  for(const face of m.faces){const [a,b]=[face.poly[0],face.poly[1]];assert.ok(Math.abs(Math.hypot(a[0]-b[0],a[1]-b[1])-2)<1e-5);}
  assert.throws(()=>solveSolidFigure(cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side1','top']])),code('SOLID_NET_NOT_A_TREE'));
  assert.throws(()=>solveSolidFigure(cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side0','top'],['top','bottom']])),code('SOLID_NET_FACES_NOT_ADJACENT'));
  // top and bottom both hanging off side1 / side3 on the same side overlap nothing; side faces joined around the top overlap
  assert.throws(()=>solveSolidFigure(cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side0','top'],['side3','bottom']],{})),code('SOLID_NET_FACES_OVERLAP'));
  assert.throws(()=>solveSolidFigure(cubeNet([['nope','side1']])),code('SOLID_NET_FACE_UNKNOWN'));
  assert.throws(()=>solveSolidFigure(figure({net:{kind:'PRISM'}})),code('SOLID_NET_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({net:{kind:'CONE',radius:5,slant:4}})),code('SOLID_CONE_SLANT_TOO_SHORT'));
});
test('the plan stands for a one-panel composite; the panel placement is checked',()=>{
  const expanded=expandSolidFigure(figure({solids:[cuboid()]}));
  assert.equal(expanded.capability,'composite-panels-v1');assert.equal(expanded.chain,'solid-figure-v1');
  assert.equal(compositePanels(expanded).length,1);
  assert.throws(()=>compositePanels({...expanded,panels:[...expanded.panels,...expanded.panels]}),error=>error.status==='COMPOSITE_PLAN_INVALID');
});

test('a composed cuboid passes its independent observer; hidden edges are dashed',async()=>{
  const plan=figure({solids:[cuboid()],dims:[{edge:'FG'},{edge:'GH'},{edge:'GC'}],unit:'cm'});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  assert.equal((composed.svg.match(/data-vis="hidden"/g)||[]).length>=3,true);
  assert.match(composed.svg,/data-solid-figure="solid-figure-v1"/);
});
test('tamper: a hidden edge drawn solid, a visible edge drawn dashed, a moved vertex and a wrong label each fail the observer',async()=>{
  const plan=figure({solids:[cuboid()],dims:[{edge:'FG'}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED');
  const svg=composed.svg;
  assert.equal((await audit(plan,svg)).status,'PASS');
  // 1. the dashed back-bottom edge E-F drawn solid
  const hidden=svg.match(/<line [^>]*data-edge="EF"[^>]*\/>/)[0];
  const solidEdge=hidden.replace(/ stroke-dasharray="[^"]*"/,'').replace('data-vis="hidden"','data-vis="solid"');
  const r1=await audit(plan,svg.replace(hidden,solidEdge));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_EDGE_VISIBILITY_MISMATCH:EF')),JSON.stringify(r1.errors));
  // 2. only the dash attribute changed (the data attribute still says solid)
  const front=svg.match(/<line [^>]*data-edge="FG"[^>]*\/>/)[0];
  const r2=await audit(plan,svg.replace(front,front.replace('stroke="#111"','stroke="#111" stroke-dasharray="5 4"')));
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_EDGE_VISIBILITY_MISMATCH:FG')||e.startsWith('SOLID_VIS_ATTRIBUTE_INCONSISTENT:FG')));
  // 3. a vertex moved: the top front edge B-C shifted down by 6 px
  const top=svg.match(/<line [^>]*data-edge="BC"[^>]*\/>/)[0];
  const moved=top.replace(/y1="([\d.]+)"/,(m,v)=>`y1="${Number(v)+6}"`);
  const r3=await audit(plan,svg.replace(top,moved));
  assert.equal(r3.status,'FAIL');assert.ok(r3.errors.length>0);
  // 4. a dimension label that no longer matches the edge length
  const r4=await audit(plan,svg.replace('data-tex="4"','data-tex="5"'));
  assert.equal(r4.status,'FAIL');assert.ok(r4.errors.some(e=>e.startsWith('SOLID_DIM_VALUE_MISMATCH')),JSON.stringify(r4.errors));
});
test('a cylinder with its axial section and a cone frustum pass; tamper: a flattened ellipse and a non-tangent silhouette fail',async()=>{
  const plan=figure({unit:'cm',solids:[{kind:'CYLINDER',radius:4,height:10}],section:{kind:'AXIAL'},dims:[{radius:'bottom'},{height:true}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  const arc=svg.match(/<path id="s1-top-back"[^>]*\/>/)[0];
  const flat=arc.replace(/ d="M ([\d.]+) ([\d.]+) A ([\d.]+) ([\d.]+)/,(m,x,y,rx,ry)=>` d="M ${x} ${y} A ${rx} ${Number(ry)*1.6}`);
  const r1=await audit(plan,svg.replace(arc,flat));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_ELLIPSE_AXES_MISMATCH')),JSON.stringify(r1.errors));
  // the back half of the base ellipse drawn solid
  const back=svg.match(/<path id="s1-base-back"[^>]*\/>/)[0];
  const r2=await audit(plan,svg.replace(back,back.replace(/ stroke-dasharray="[^"]*"/,'').replace('data-vis="hidden"','data-vis="solid"')));
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_EDGE_VISIBILITY_MISMATCH')),JSON.stringify(r2.errors));
  const fr=await panel(figure({solids:[{kind:'CONE_FRUSTUM',radius:6,topRadius:3,height:4}],dims:[{slant:true}]}));
  assert.equal(fr.status,'COMPOSED',JSON.stringify(fr.detail));
  const side=fr.svg.match(/<line id="s1-side-right"[^>]*\/>/)[0];
  const skew=side.replace(/x2="([\d.]+)"/,(m,v)=>`x2="${Number(v)+7}"`);
  const r3=await audit(figure({solids:[{kind:'CONE_FRUSTUM',radius:6,topRadius:3,height:4}],dims:[{slant:true}]}),fr.svg.replace(side,skew));
  assert.equal(r3.status,'FAIL');assert.ok(r3.errors.some(e=>e.startsWith('SOLID_SILHOUETTE')),JSON.stringify(r3.errors));
});
test('a cuboid net passes; tamper: one net side stretched breaks congruence and the shared edge',async()=>{
  const plan=figure({net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:3},height:4,names:'........'},root:'side0',joins:[['side0','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']],
    corners:{side0:['B','C','N','A'],side1:['C','D','K','N'],side2:['D','E','J','K'],side3:['E','H','I','J'],top:['M','N','K','L'],bottom:['E','F','G','H']},dims:[{face:'side1',edge:0}]}});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  const face=svg.match(/<polygon id="net-face-side2"[^>]*\/>/)[0];
  const stretched=face.replace(/points="([^"]+)"/,(m,pts)=>{const p=pts.split(' ');const [x,y]=p[1].split(',');p[1]=`${Number(x)+9},${y}`;return `points="${p.join(' ')}"`;});
  const r1=await audit(plan,svg.replace(face,stretched));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_NET_FACE_NOT_CONGRUENT')||e.startsWith('SOLID_NET_JOIN_EDGE_MISMATCH')),JSON.stringify(r1.errors));
  // a fold edge drawn solid
  const fold=svg.match(/<line id="net-edge-side1-1"[^>]*\/>/)?.[0];
  assert.ok(fold,'a fold edge exists');
  const r2=await audit(plan,svg.replace(fold,fold.replace(/ stroke-dasharray="[^"]*"/,'')));
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_NET_EDGE_STYLE_MISMATCH')),JSON.stringify(r2.errors));
});
test('cylinder and cone nets pass and a wrong sector angle fails',async()=>{
  const cyl=figure({net:{kind:'CYLINDER',radius:3,height:5,dims:[{part:'rect-width',label:'2\\pi r'},{part:'rect-height',label:'h'}]}});
  const c1=await panel(cyl);
  assert.equal(c1.status,'COMPOSED',JSON.stringify(c1.detail));assert.equal(c1.staticAudit.status,'PASS',JSON.stringify(c1.staticAudit.errors));
  const cone=figure({unit:'cm',net:{kind:'CONE',radius:8,slant:20,dims:[{part:'slant'},{part:'arc'},{part:'angle'}]}});
  const c2=await panel(cone);
  assert.equal(c2.status,'COMPOSED',JSON.stringify(c2.detail));assert.equal(c2.staticAudit.status,'PASS',JSON.stringify(c2.staticAudit.errors));
  const sector=c2.svg.match(/<path id="net-sector"[^>]*\/>/)[0];
  const wrong=sector.replace(/ d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)/,(m,a,b,x,y)=>` d="M ${a} ${b} L ${Number(x)-20} ${y}`);
  const r=await audit(cone,c2.svg.replace(sector,wrong));
  assert.equal(r.status,'FAIL');assert.ok(r.errors.some(e=>e.startsWith('SOLID_NET_SECTOR')||e.startsWith('SOLID_NET_ARC')),JSON.stringify(r.errors));
});
test('spec is deterministic and bound to its model',()=>{
  const plan=figure({solids:[cuboid()],dims:[{edge:'FG'}]});
  const model=solveSolidFigure(plan);
  assert.deepEqual(solidFigureSpec(plan,model),solidFigureSpec(plan,solveSolidFigure(plan)));
  const other=solveSolidFigure(figure({solids:[cuboid({height:3})]}));
  assert.throws(()=>solidFigureSpec(plan,other),code('SOLID_MODEL_MISMATCH'));
});
