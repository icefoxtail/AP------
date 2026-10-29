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
const cubeNet=(joins,over={})=>figure({net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:2,names:'........'},root:'side0',joins,dims:[{face:'side0',edge:0}],...over}});
test('a net is the solid unfolded along a tree of faces; bad trees and overlapping layouts are refused',()=>{
  const ok=cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']]);
  const m=solveSolidFigure(ok);
  assert.equal(m.faces.length,6);
  // all six faces are unit squares of side 2 in the net
  for(const face of m.faces){const [a,b]=[face.poly[0],face.poly[1]];assert.ok(Math.abs(Math.hypot(a[0]-b[0],a[1]-b[1])-2)<1e-5);}
  assert.throws(()=>solveSolidFigure(cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side1','top']])),code('SOLID_NET_NOT_A_TREE'));
  assert.throws(()=>solveSolidFigure(cubeNet([['side0','side1'],['side1','side2'],['side2','side3'],['side0','top'],['top','bottom']])),code('SOLID_NET_FACES_NOT_ADJACENT'));
  // a convex solid unfolds without overlap along every tree; a non-convex prism can fold a face back onto another
  const lPrism={kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[6,0],[6,1],[1,1],[1,6],[0,6]]},height:1,names:'ABCDEFGHIJKL'};
  assert.throws(()=>solveSolidFigure(figure({net:{solid:lPrism,root:'side0',dims:[{face:'side0',edge:0}],
    joins:[['side0','side1'],['side1','side2'],['side2','side3'],['side2','bottom'],['side3','side4'],['side0','top'],['side4','side5']]}})),code('SOLID_NET_FACES_OVERLAP'));
  assert.throws(()=>solveSolidFigure(cubeNet([['nope','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']])),code('SOLID_NET_FACE_UNKNOWN'));
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
test('a pyramid height keeps its dashed axis inside and moves the dimension line (and length) outside the silhouette',async()=>{
  const plan=figure({unit:'cm',solids:[{kind:'PYRAMID',base:{kind:'RECT',width:5,depth:5},height:9,names:'ABCDE'}],dims:[{edge:'AB'},{height:true}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  const axis=svg.match(/<line id="dim-2-axis"[^>]*\/>/)[0];
  assert.match(axis,/data-role="height-axis"/);assert.match(axis,/data-vis="hidden"/);
  const line=svg.match(/<line id="dim-2-line"[^>]*\/>/)[0];
  assert.match(line,/data-role="dim-line"/);assert.match(line,/data-vis="solid"/);
  const x=Number(/x1="([\d.]+)"/.exec(line)[1]);
  const edgeXs=[...svg.matchAll(/<line [^>]*data-edge="[A-Z]{2}"[^>]*x1="([\d.]+)"[^>]*x2="([\d.]+)"/g)].flatMap(m=>[Number(m[1]),Number(m[2])]);
  assert.ok(x<Math.min(...edgeXs)-6,`dimension line ${x} is left of the silhouette ${Math.min(...edgeXs)}`);
  assert.equal((await audit(plan,svg)).status,'PASS');
});

test('primed vertex names (A′) are solved, drawn and read back by the observer',async()=>{
  const plan=figure({unit:'cm',solids:[{kind:'PYRAMID',base:{kind:'POLYGON',points:[[0,0],[6,0],[4,3]]},height:5,names:'A′B′C′V′'}],dims:[{from:'A′',to:'B′'}]});
  const model=solveSolidFigure(plan);
  assert.deepEqual(model.solids[0].vertices.map(v=>v.name),['A′','B′','C′','V′']);
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  assert.match(composed.svg,/data-value="V′"/u);
  assert.equal((await audit(plan,composed.svg)).status,'PASS');
});

test('tamper: a hidden edge drawn solid, a visible edge drawn dashed, a moved vertex and a wrong label each fail the observer',async()=>{
  const plan=figure({solids:[cuboid()],dims:[{edge:'FG'}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED');
  const svg=composed.svg;
  assert.equal((await audit(plan,svg)).status,'PASS');
  // 1. the dashed back-bottom edge E-F drawn solid
  const hidden=svg.match(/<line [^>]*data-edge="FE"[^>]*\/>/)[0];
  const solidEdge=hidden.replace(/ stroke-dasharray="[^"]*"/,'').replace('data-vis="hidden"','data-vis="solid"');
  const r1=await audit(plan,svg.replace(hidden,solidEdge));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_EDGE_VISIBILITY_MISMATCH:FE')),JSON.stringify(r1.errors));
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

test('an apex-down cone holds a liquid level: the smaller vessel is filled and its two heights and radii are labelled',async()=>{
  const plan=figure({solids:[{kind:'CONE',radius:3,height:9,orientation:'APEX_DOWN'}],section:{kind:'LEVEL',at:'1/3'},
    dims:[{radius:'top',label:'r'},{radius:'level',label:'\\frac{1}{3}r'},{height:true,label:'h'},{level:true,label:'\\frac{1}{3}h'}]});
  const m=solveSolidFigure(plan);
  assert.equal(m.solids[0].r0,0);assert.equal(m.solids[0].r1,3);
  assert.deepEqual(m.section,{solid:'s1',kind:'LEVEL',at:'1/3',z:3,r:1});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.match(svg,/data-role="liquid-region"/);assert.match(svg,/data-role="liquid-edge"/);
  assert.match(svg,/data-dim="dim-2" data-kind="RADIUS"/);assert.match(svg,/data-dim="dim-3" data-kind="HEIGHT"/);
  assert.equal((await audit(plan,svg)).status,'PASS');
  // tamper: one boundary point of the filled liquid moves
  const liquid=svg.match(/<polygon id="s1-liquid"[^>]*\/>/)[0];
  const moved=liquid.replace(/points="([^"]+)"/,(all,pts)=>{const p=pts.split(' ');const [x,y]=p[3].split(',');p[3]=`${Number(x)+7},${Number(y)+5}`;return `points="${p.join(' ')}"`;});
  const r1=await audit(plan,svg.replace(liquid,moved));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_LIQUID_REGION_MISMATCH')),JSON.stringify(r1.errors));
  // tamper: the level ellipse flattened
  const ellipse=svg.match(/<ellipse id="level-s1"[^>]*\/>/)[0];
  const flat=ellipse.replace(/ ry="([\d.]+)"/,(a,v)=>` ry="${Number(v)*1.8}"`);
  const r2=await audit(plan,svg.replace(ellipse,flat));
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_LEVEL_ELLIPSE_MISMATCH')));
});
test('a cone cut by a level plane labels the height below and above the section and the section radius exactly',async()=>{
  const plan=figure({unit:'cm',solids:[{kind:'CONE',radius:10,height:18}],section:{kind:'LEVEL',at:'1/3'},
    dims:[{radius:'bottom'},{level:true},{level:'top'},{radius:'level'}]});
  const m=solveSolidFigure(plan);
  assert.equal(m.section.z,6);assert.ok(Math.abs(m.section.r-20/3)<1e-5);
  assert.deepEqual(m.dims.map(d=>d.type),['RADIUS','LEVEL','LEVEL','RADIUS']);
  assert.equal(m.dims[1].side,'BOTTOM');assert.equal(m.dims[1].value,6);
  assert.equal(m.dims[2].side,'TOP');assert.equal(m.dims[2].value,12);
  assert.equal(m.dims[3].tex,'\\frac{20}{3}\\,\\mathrm{cm}');
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.match(svg,/data-dim="dim-2" data-kind="LEVEL"/);assert.match(svg,/data-dim="dim-3" data-kind="LEVEL"/);
  assert.equal((await audit(plan,svg)).status,'PASS');
  // tamper: the dimension line above the section is shortened so it no longer reaches the apex
  const top=svg.match(/<line [^>]*data-dim="dim-3" data-kind="LEVEL"[^>]*\/>/)[0];
  const cut=top.replace(/y1="([\d.]+)"/,(all,v)=>`y1="${Number(v)+9}"`);
  const r=await audit(plan,svg.replace(top,cut));
  assert.equal(r.status,'FAIL');assert.ok(r.errors.some(e=>e.startsWith('SOLID_DIM_LINE_MISMATCH')),JSON.stringify(r.errors));
});
test('a sphere sits inscribed in a cylinder on the same axis; moving the inner curves off the axis fails',async()=>{
  const plan=figure({solids:[{id:'s1',kind:'CYLINDER',radius:3,height:6},{id:'s2',kind:'SPHERE',radius:3,inside:'s1'}],
    dims:[{solid:'s2',radius:'center',label:'r'},{solid:'s1',radius:'bottom',label:'r'},{solid:'s1',height:true,label:'2r'}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  const shift=(text,dx)=>text.replace(/<path ([^>]*data-solid="s2"[^>]*)>/g,(all,attrs)=>{
    const d=/ d="([^"]*)"/.exec(attrs)[1];
    const m=/^M (\S+) (\S+) A (\S+) (\S+) 0 (\d) (\d) (\S+) (\S+)$/.exec(d);
    if(!m)return all;
    return all.replace(d,`M ${Number(m[1])+dx} ${m[2]} A ${m[3]} ${m[4]} 0 ${m[5]} ${m[6]} ${Number(m[7])+dx} ${m[8]}`);
  });
  const moved=shift(svg,6);
  const r=await audit(plan,moved);
  assert.equal(r.status,'FAIL');assert.ok(r.errors.some(e=>e.startsWith('SOLID_NEST_AXIS_MISMATCH')),JSON.stringify(r.errors));
});
test('marks on solids: a right angle, equal-length ticks and angle arcs are drawn and independently checked',async()=>{
  const plan=figure({solids:[cuboid()],segments:[{from:'E',to:'G'},{from:'E',to:'C'}],
    marks:{rightAngles:[{at:'G',refs:['E','C']}],equalLengths:[{count:1,segments:['AB','CD']}],angles:[{refs:['B','A','D'],arcs:2,value:90}]}});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.match(svg,/data-role="right-angle-mark"/);assert.match(svg,/data-role="equal-mark"/);assert.match(svg,/data-role="angle-mark"/);
  const ra=svg.match(/<polyline id="ra1"[^>]*\/>/)[0];
  const bent=ra.replace(/points="([^"]+)"/,(all,pts)=>{const p=pts.split(' ');const [x,y]=p[1].split(',');p[1]=`${Number(x)+4},${Number(y)+4}`;return `points="${p.join(' ')}"`;});
  const r1=await audit(plan,svg.replace(ra,bent));
  assert.equal(r1.status,'FAIL');assert.ok(r1.errors.some(e=>e.startsWith('SOLID_RIGHT_ANGLE')),JSON.stringify(r1.errors));
  const tick=svg.match(/<line id="eq1-AB-1"[^>]*\/>/)[0];
  const off=tick.replace(/ y1="([\d.]+)"/,(all,v)=>` y1="${Number(v)+5}"`);
  const r2=await audit(plan,svg.replace(tick,off));
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_EQUAL_MARK')),JSON.stringify(r2.errors));
  const arc=svg.match(/<polyline id="an1-arc-2"[^>]*\/>/)[0];
  const bad=arc.replace(/points="([^"]+)"/,(all,pts)=>{const p=pts.split(' ');p.splice(6,1);return `points="${p.join(' ')}"`;});
  const r3=await audit(plan,svg.replace(arc,bad));
  assert.equal(r3.status,'FAIL');assert.ok(r3.errors.some(e=>e.startsWith('SOLID_ANGLE_MARK')),JSON.stringify(r3.errors));
  // the plan's facts are checked before drawing
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],marks:{rightAngles:[{at:'G',refs:['E','F']}]}})),code('SOLID_MARK_NOT_RIGHT_ANGLE'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],marks:{equalLengths:[{count:1,segments:['AB','CG']}]}})),code('SOLID_MARK_LENGTH_MISMATCH'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],marks:{equalLengths:[{count:1,segments:['AB','CD']},{count:1,segments:['EF','GH']}]}})),code('SOLID_MARK_GROUP_AMBIGUOUS'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],marks:{rightAngles:[{at:'G',refs:['E','C']}]}})),code('SOLID_MARK_RAY_NOT_DRAWN'));
});
test('the new capabilities refuse what they cannot draw with explicit codes',()=>{
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:1,height:2,orientation:'APEX_DOWN'}],dims:[{height:true}]})),code('SOLID_ORIENTATION_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CONE_FRUSTUM',radius:3,topRadius:2,height:2,orientation:'SIDEWAYS'}],dims:[{height:true}]})),code('SOLID_ORIENTATION_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'SPHERE',radius:2},{kind:'SPHERE',radius:1,inside:'s1'}],dims:[{radius:'center'}]})),code('SOLID_NEST_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{id:'s1',kind:'CYLINDER',radius:2,height:3},{id:'s2',kind:'SPHERE',radius:3,inside:'s1'}],dims:[{solid:'s2',radius:'center',label:'r'}]})),code('SOLID_NEST_DOES_NOT_FIT'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{id:'s1',kind:'CYLINDER',radius:4,height:4},{id:'s2',kind:'SPHERE',radius:1,inside:'s9'}],dims:[{solid:'s2',radius:'center',label:'r'}]})),code('SOLID_NEST_UNKNOWN'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CONE',radius:10,height:1,orientation:'APEX_DOWN'}],section:{kind:'LEVEL',at:'1/2'},dims:[{level:true}]})),code('SOLID_LEVEL_APEX_HIDDEN'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CONE',radius:3,height:9,orientation:'APEX_DOWN'}],dims:[{radius:'bottom'}]})),code('SOLID_DIMS_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],marks:{angles:[{refs:['B','A','D'],value:80}]}})),code('SOLID_MARK_ANGLE_MISMATCH'));
});

// --- E2: a net may tint faces and stress edges ------------------------------------------------------------------------------------------------
const cubeCorners={side0:['B','C','N','A'],side1:['C','D','K','N'],side2:['D','E','J','K'],side3:['E','H','I','J'],top:['M','N','K','L'],bottom:['E','F','G','H']};
const cubeJoins=[['side0','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']];
const emphasisNet=(extra={},over={})=>figure({net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:2,names:'........'},root:'side0',joins:cubeJoins,corners:cubeCorners,...extra},...over});
test('a net without highlights or segments has neither in its model nor in its SVG',async()=>{
  const plan=emphasisNet();
  const model=solveSolidFigure(plan);
  assert.equal('highlights' in model,false);assert.equal('segments' in model,false);
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.doesNotMatch(composed.svg,/net-highlight|data-accent/);
});
test('net highlights tint named faces and net segments stress named edges; every tamper of the final SVG is read back',async()=>{
  const plan=emphasisNet({highlights:[{face:'side2'},{face:'top',fill:'MEDIUM'}],segments:[{from:'B',to:'C'},{face:'side1',edge:2,role:'REF'}]});
  const model=solveSolidFigure(plan);
  assert.deepEqual(model.highlights,[{face:'side2',fill:'LIGHT'},{face:'top',fill:'MEDIUM'}]);
  assert.deepEqual(model.segments,[{face:'side0',edge:0,role:'ACCENT',from:'B',to:'C'},{face:'side1',edge:2,role:'REF'}]);
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="net-highlight"/g)??[]).length,2);
  assert.equal((svg.match(/data-accent="ACCENT"/g)??[]).length,1);
  const fold=svg.match(/<line [^>]*data-accent="REF"[^>]*\/>/)?.[0];
  assert.ok(fold&&/stroke-dasharray/.test(fold),'a stressed fold edge stays dashed');
  assert.ok(svg.indexOf('data-role="net-highlight"')<svg.indexOf('data-role="net-edge"'),'the tint lies under every line');
  const failing=async(tampered,prefix)=>{const r=await audit(plan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  // a tinted polygon that is another face
  const tint=svg.match(/<polygon id="net-highlight-side2"[^>]*\/>/)[0];
  const side0=svg.match(/<polygon id="net-face-side0"[^>]*points="([^"]+)"/)[1];
  await failing(svg.replace(tint,tint.replace(/points="[^"]+"/,`points="${side0}"`)),'SOLID_NET_HIGHLIGHT_FACE_MISMATCH');
  // a tint missing, an extra tint, a wrong strength
  const top=svg.match(/<g data-layer="20"><polygon id="net-highlight-top"[^>]*\/><\/g>/)[0];
  await failing(svg.replace(top,''),'SOLID_NET_HIGHLIGHT_SET_MISMATCH');
  const extra=`<g data-layer="20"><polygon id="net-highlight-bottom" data-role="net-highlight" data-face="bottom" data-fill="LIGHT" fill="#7fa6e8" fill-opacity="0.32" stroke="none" points="${svg.match(/<polygon id="net-face-bottom"[^>]*points="([^"]+)"/)[1]}"/></g>`;
  await failing(svg.replace(top,top+extra),'SOLID_NET_HIGHLIGHT_SET_MISMATCH');
  await failing(svg.replace(top,top.replace('fill-opacity="0.55"','fill-opacity="0.32"')),'SOLID_NET_HIGHLIGHT_FILL_MISMATCH');
  // the tint painted over the lines
  await failing(svg.replace(top,'').replace('</svg>',top+'</svg>'),'SOLID_NET_HIGHLIGHT_OVER_LINES');
  // another edge stressed, the planned edge not stressed, the wrong role
  const bc=svg.match(/<line [^>]*data-accent="ACCENT"[^>]*\/>/)[0];
  const plain=bc.replace(' data-accent="ACCENT"','').replace('stroke="#c0392b"','stroke="#111"').replace('stroke-width="2.4"','stroke-width="1.6"');
  await failing(svg.replace(bc,plain),'SOLID_NET_EMPHASIS_ROLE_MISMATCH');
  const other=svg.match(/<line id="net-edge-side0-2"[^>]*\/>/)[0];
  await failing(svg.replace(other,other.replace('stroke="#111"','stroke="#c0392b"').replace('stroke-width="1.6"','stroke-width="2.4"').replace(' fill="none"',' data-accent="ACCENT" fill="none"')),'SOLID_NET_EMPHASIS_UNEXPECTED');
  await failing(svg.replace(bc,bc.replace('stroke="#c0392b"','stroke="#111"').replace(' data-accent="ACCENT"',' data-accent="REF"')),'SOLID_NET_EMPHASIS_ROLE_MISMATCH');
  // a stressed look without its attribute
  await failing(svg.replace(bc,bc.replace(' data-accent="ACCENT"','')),'SOLID_NET_ACCENT_ATTRIBUTE_INCONSISTENT');
});
test('a corner-name edge on a fold is the same edge as its face and index; a segment is not repeated',()=>{
  const byName=solveSolidFigure(emphasisNet({segments:[{from:'N',to:'C'}]})).segments[0];
  assert.equal(byName.face,'side0');assert.equal(byName.edge,1);// the first face, in face order, that lists the fold
  assert.throws(()=>solveSolidFigure(emphasisNet({segments:[{face:'side0',edge:1},{face:'side1',edge:3}]})),code('SOLID_NET_SEGMENT_DUPLICATE'));
  assert.throws(()=>solveSolidFigure(emphasisNet({segments:[{from:'B',to:'C'},{from:'C',to:'B'}]})),code('SOLID_NET_SEGMENT_DUPLICATE'));
});
test('net highlights and segments are refused with explicit codes',()=>{
  const bad=(extra,expected)=>assert.throws(()=>solveSolidFigure(emphasisNet(extra)),code(expected),expected);
  bad({highlights:[{face:'nope'}]},'SOLID_NET_FACE_UNKNOWN');
  bad({highlights:[{face:'top',fill:'DARK'}]},'SOLID_NET_HIGHLIGHT_INVALID');
  bad({highlights:[{face:'top'},{face:'top'}]},'SOLID_NET_HIGHLIGHT_INVALID');
  bad({highlights:[]},'SOLID_NET_HIGHLIGHT_INVALID');
  bad({highlights:[{face:'top',colour:'red'}]},'SOLID_NET_HIGHLIGHT_INVALID');
  bad({segments:[{face:'side0',edge:4}]},'SOLID_NET_SEGMENT_INVALID');
  bad({segments:[{face:'side0',edge:0,role:'BOLD'}]},'SOLID_NET_SEGMENT_INVALID');
  bad({segments:[{face:'side0',edge:0,from:'B',to:'C'}]},'SOLID_NET_SEGMENT_INVALID');
  bad({segments:[{from:'B'}]},'SOLID_NET_SEGMENT_INVALID');
  bad({segments:[{face:'nope',edge:0}]},'SOLID_NET_FACE_UNKNOWN');
  bad({segments:[{from:'B',to:'F'}]},'SOLID_NET_EDGE_UNKNOWN');
  bad({segments:[]},'SOLID_NET_SEGMENT_INVALID');
  // the same two names at two different drawn edges are ambiguous
  bad({corners:{...cubeCorners,top:['B','C','K','L']},segments:[{from:'B',to:'C'}]},'SOLID_NET_EDGE_AMBIGUOUS');
  assert.throws(()=>solveSolidFigure(figure({net:{kind:'CYLINDER',radius:3,height:5,dims:[{part:'rect-height'}],highlights:[{face:'rect'}]}})),code('SOLID_NET_EMPHASIS_UNSUPPORTED:CYLINDER'));
  assert.throws(()=>solveSolidFigure(figure({net:{kind:'CONE',radius:3,slant:5,dims:[{part:'slant'}],segments:[{face:'sector',edge:0}]}})),code('SOLID_NET_EMPHASIS_UNSUPPORTED:CONE'));
});
test('the re-derived net layout holds for a pyramid, a triangular prism and a frustum net with tinted faces',async()=>{
  const nets=[
    {solid:{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'ABCDE'},root:'bottom',joins:[['bottom','side0'],['bottom','side1'],['bottom','side2'],['bottom','side3']],highlights:[{face:'side1'}],segments:[{face:'side0',edge:1,role:'REF'}]},
    {solid:{kind:'PRISM',base:{kind:'REGULAR',n:3,side:3},height:4,names:'ABCDEF'},root:'side0',joins:[['side0','side1'],['side1','side2'],['side0','bottom'],['side0','top']],highlights:[{face:'bottom',fill:'MEDIUM'}],segments:[{from:'A',to:'B'}]},
    {solid:{kind:'FRUSTUM',base:{kind:'RECT',width:4,depth:4},height:3,topScale:0.5,names:'ABCDEFGH'},root:'bottom',joins:[['bottom','side0'],['bottom','side1'],['bottom','side2'],['bottom','side3'],['side0','top']],highlights:[{face:'top'},{face:'side2'}],segments:[{face:'top',edge:0}]}
  ];
  for(const net of nets){
    const plan=figure({net});
    const composed=await panel(plan);
    assert.equal(composed.status,'COMPOSED',net.solid.kind+JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS',net.solid.kind+JSON.stringify(composed.staticAudit.errors));
  }
});
