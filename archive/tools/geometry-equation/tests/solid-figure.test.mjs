// Chrome-using (composes solid figure panels): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {compositePanels,compositePanelLayout,compositeStackSize,composeCompositeCandidate,isGridPanel,COMPOSITE_MAX_SOLID_GRID_PANELS} from '../production/composite-candidate-svg-v1.mjs';
import {solveSolidFigure,expandSolidFigure,solidFigureSpec,figurePanelSize,composeSolidFigurePanel,edgeRuns,lengthTex,labelNumber,countedEdges,circled,GRID_PANEL_WIDTH} from '../production/solid-figure-v1.mjs';

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

// --- E3: counting numbers on a polyhedron -----------------------------------------------------------------------------------------------------
const countedFrustum=(count={vertices:true,edges:true},over={})=>figure({solids:[{kind:'FRUSTUM',base:{kind:'RECT',width:6,depth:6},height:5,topScale:0.6,names:'........',count,...over}],solidCaption:{text:'사각뿔대'}});
test('counting numbers: edges are numbered around the base, up the sides, around the top; a plan without count has none',async()=>{
  const m=solveSolidFigure(countedFrustum());
  assert.deepEqual(m.solids[0].count,{vertices:true,edges:true});
  assert.deepEqual(countedEdges(m.solids[0]),[[0,1],[1,2],[2,3],[0,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,7]]);
  const pyramid=solveSolidFigure(figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'.....',count:{edges:true}}]}));
  assert.deepEqual(countedEdges(pyramid.solids[0]),[[0,1],[1,2],[2,3],[0,3],[0,4],[1,4],[2,4],[3,4]]);
  assert.equal(circled(1),'①');assert.equal(circled(12),'⑫');assert.equal(circled(20),'⑳');
  const plain=solveSolidFigure(figure({solids:[cuboid()]}));
  assert.equal('count' in plain.solids[0],false);
  const composed=await panel(figure({solids:[cuboid()]}));
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.doesNotMatch(composed.svg,/count-|data-count|data-text/);
});
test('a counted frustum numbers all 8 vertices and all 12 edges, hidden ones too, and the observer reads every number back',async()=>{
  const plan=countedFrustum();
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.equal((svg.match(/data-label-role="count-vertex"/g)??[]).length,8);
  assert.equal((svg.match(/data-label-role="count-edge"/g)??[]).length,12);
  for(let n=1;n<=12;n++)assert.ok(svg.includes(`id="count-e-s1-${n}"`)&&svg.includes(`data-text="${circled(n)}"`),'edge '+n);
  // the hidden edges (the back and left base edges, the back vertical) are numbered like the rest
  const hidden=[...svg.matchAll(/data-role="edge" data-solid="s1" data-edge="(v\d+v\d+)" data-vis="hidden"/g)].map(m=>m[1]);
  assert.deepEqual([...new Set(hidden)].sort(),['v0v3','v2v3','v3v7']);
  const failing=async(tampered,prefix)=>{const r=await audit(plan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  const group=id=>svg.match(new RegExp(`<g id="${id}"[^>]*>`))[0];
  const place=id=>group(id).match(/transform="translate\(([^)]+)\)"/)[1];
  const swap=(a,b)=>svg.replace(group(a),group(a).replace(/transform="translate\([^)]+\)"/,`transform="translate(${place(b)})"`)).replace(group(b),group(b).replace(/transform="translate\([^)]+\)"/,`transform="translate(${place(a)})"`));
  // two edge numbers exchanged: each is nearest to another edge now
  await failing(swap('count-e-s1-1','count-e-s1-11'),'SOLID_COUNT_LABEL_CONFUSED');
  await failing(swap('count-v-s1-1','count-v-s1-8'),'SOLID_COUNT_LABEL_CONFUSED');
  // a number written twice, one missing; a wrong glyph or text
  await failing(svg.replace(group('count-v-s1-3'),group('count-v-s1-3').replace('data-count-n="3"','data-count-n="4"')),'SOLID_COUNT_NUMBERS_NOT_COMPLETE');
  await failing(svg.replace(group('count-e-s1-2'),group('count-e-s1-2').replace(`data-text="${circled(2)}"`,`data-text="${circled(3)}"`)),'SOLID_COUNT_TEXT_MISMATCH');
  await failing(svg.replace(group('count-v-s1-5'),group('count-v-s1-5').replace('data-tex="5"','data-tex="6"')),'SOLID_COUNT_TEXT_MISMATCH');
  // counting numbers in a figure that asked for none, or for the other kind only
  const r=await audit(countedFrustum({edges:true},{names:'ABCDEFGH'}),svg);
  assert.equal(r.status,'FAIL');assert.ok(r.errors.some(e=>e.startsWith('SOLID_COUNT_LABEL_UNEXPECTED')),JSON.stringify(r.errors));
  const r2=await audit(figure({solids:[{kind:'FRUSTUM',base:{kind:'RECT',width:6,depth:6},height:5,topScale:0.6,names:'........'}],dims:[{height:true}]}),svg);
  assert.equal(r2.status,'FAIL');assert.ok(r2.errors.some(e=>e.startsWith('SOLID_COUNT_LABEL_UNEXPECTED')),JSON.stringify(r2.errors));
});
test('only edges or only vertices can be counted, beside letters or other lengths',async()=>{
  const edgesOnly=figure({solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:'ABCDEFGH',count:{edges:true}}],dims:[{edge:'AB'}]});
  const c1=await panel(edgesOnly);
  assert.equal(c1.status,'COMPOSED',JSON.stringify(c1.detail));assert.equal(c1.staticAudit.status,'PASS',JSON.stringify(c1.staticAudit.errors));
  assert.equal((c1.svg.match(/data-label-role="count-edge"/g)??[]).length,12);assert.doesNotMatch(c1.svg,/count-vertex/);
  const verticesOnly=figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'.....',count:{vertices:true,edges:false}}]});
  const c2=await panel(verticesOnly);
  assert.equal(c2.status,'COMPOSED',JSON.stringify(c2.detail));assert.equal(c2.staticAudit.status,'PASS',JSON.stringify(c2.staticAudit.errors));
  assert.equal((c2.svg.match(/data-label-role="count-vertex"/g)??[]).length,5);assert.doesNotMatch(c2.svg,/count-edge/);
});
test('a counted figure with no room for its numbers is refused, and counting is refused with explicit codes',async()=>{
  const bad=(solid,expected)=>assert.throws(()=>solveSolidFigure(figure({solids:[solid]})),code(expected),expected);
  const base={kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2};
  bad({...base,count:{vertices:true}},'SOLID_COUNT_NAMES_CONFLICT');// the default letters are names
  bad({...base,names:'ABCDEFGH',count:{vertices:true}},'SOLID_COUNT_NAMES_CONFLICT');
  bad({...base,names:'........',count:{faces:true}},'SOLID_COUNT_FACES_UNSUPPORTED');
  bad({...base,names:'........',count:{}},'SOLID_COUNT_REQUEST_INVALID');
  bad({...base,names:'........',count:{vertices:false}},'SOLID_COUNT_REQUEST_INVALID');
  bad({...base,names:'........',count:{vertices:1}},'SOLID_COUNT_REQUEST_INVALID');
  bad({...base,names:'........',count:{edges:true,colour:true}},'SOLID_COUNT_REQUEST_INVALID');
  bad({...base,names:'........',count:[true]},'SOLID_COUNT_REQUEST_INVALID');
  bad({kind:'CYLINDER',radius:2,height:3,count:{edges:true}},'SOLID_COUNT_UNSUPPORTED:CYLINDER');
  bad({kind:'SPHERE',radius:2,count:{vertices:true}},'SOLID_COUNT_UNSUPPORTED:SPHERE');
  bad({kind:'PRISM',base:{kind:'REGULAR',n:8,side:2},height:3,names:'.'.repeat(16),count:{edges:true}},'SOLID_COUNT_TOO_MANY:edges');
  // 6-gon prism: 18 edges are still countable
  assert.equal(solveSolidFigure(figure({solids:[{kind:'PRISM',base:{kind:'REGULAR',n:6,side:2},height:3,names:'.'.repeat(12),count:{edges:true}}]})).solids[0].count.edges,true);
  // a slender pillar: its 8 vertices and 12 edge midpoints lie only a few px apart, so no number can stay nearest to its own target
  const crowded=await panel(figure({solids:[{kind:'PRISM',base:{kind:'RECT',width:1,depth:1},height:30,names:'.'.repeat(8),count:{vertices:true,edges:true}}]}));
  assert.equal(crowded.status,'SOLID_LABELS_NO_ROOM',JSON.stringify([crowded.status,crowded.detail]).slice(0,300));
});

// --- E5: solid panels in a composite grid -------------------------------------------------------------------------------------------------------
const hexPrism=segments=>({capability:'solid-figure-v1',unit:'cm',solids:[{kind:'PRISM',base:{kind:'REGULAR',n:6,side:2},height:4,names:'IJKLGHCDEFAB'}],segments});
const seg=(from,to,role='ACCENT')=>({from,to,style:'AUTO',role});
const gridOf=(panels,extra={})=>({capability:'composite-panels-v1',panels,caption:'같은 육각기둥에서 모서리를 그룹별로 나눈 그림',...extra});
const solidPanel=(plan,text)=>({caption:{text},plan});
const triPlane=()=>({capability:'construction-spike-v1',
  mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},
    nodes:['A','B','C'].map((id,k)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[{kind:'integer',value:String([0,4,0][k])},{kind:'integer',value:String([0,0,4][k])}]},outputType:'POINT',factRole:'GIVEN'}))},
  axisTickValues:{x:[],y:[]},displayLines:[],displayCircles:[],displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']}],rightAngles:[],displayPoints:['A','B','C']});
const reason=error=>error?.detail?.reason;
test('E5: two to four solid panels (and solids mixed with plane figures) are a two-column grid; the grid sets the panel width, idempotently',()=>{
  const three=gridOf([solidPanel(hexPrism([seg('B','H','REF'),seg('B','A')]),'만나는 모서리'),solidPanel(hexPrism([seg('B','H','REF'),seg('I','C')]),'평행한 모서리'),solidPanel(hexPrism([seg('B','H','REF'),seg('C','D')]),'꼬인 모서리')]);
  const checked=compositePanels(three);
  assert.equal(checked.length,3);
  assert.ok(checked.every(item=>isGridPanel(item.plan)&&item.plan.panelWidth===GRID_PANEL_WIDTH));
  assert.deepEqual(compositePanelLayout(checked),{kind:'GRID',columns:2,rows:2});
  // the width only narrows the figure; the author's own keys are kept
  assert.deepEqual(checked.map(item=>({...item.plan,panelWidth:undefined})),three.panels.map(item=>({...item.plan,panelWidth:undefined})));
  // checking the checked plans again changes nothing (the render path hands the checked panels back to the composer)
  const again=compositePanels({...three,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))});
  assert.deepEqual(again,checked);
  const model=solveSolidFigure(checked[0].plan);
  assert.equal(figurePanelSize(model).width,GRID_PANEL_WIDTH);
  assert.equal(figurePanelSize(solveSolidFigure(hexPrism([seg('B','H')]))).width,480);// a standalone solid keeps the 480 wide panel
  const stack=compositeStackSize(checked.map(item=>figurePanelSize(solveSolidFigure(item.plan))),0,compositePanelLayout(checked));
  assert.equal(stack.width,2*GRID_PANEL_WIDTH+8);assert.ok(stack.width<=776);
  // a solid next to a plane figure, and four panels
  const mixed=compositePanels(gridOf([{caption:{text:'오각형'},plan:triPlane()},solidPanel(hexPrism([seg('B','H')]),'육각기둥')]));
  assert.deepEqual(compositePanelLayout(mixed),{kind:'GRID',columns:2,rows:1});
  assert.equal(mixed[0].plan.panelWidth,undefined);assert.equal(mixed[1].plan.panelWidth,GRID_PANEL_WIDTH);
  assert.equal(COMPOSITE_MAX_SOLID_GRID_PANELS,4);
  assert.equal(compositePanels(gridOf(Array.from({length:4},()=>solidPanel(hexPrism([seg('B','H')]),'육각기둥')))).length,4);
  // a net is a solid panel too
  const netPanel={capability:'solid-figure-v1',net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:3},height:4,names:'........'},root:'side0',joins:[['side0','side1'],['side1','side2'],['side2','side3'],['side1','top'],['side3','bottom']],corners:{side0:['B','C','N','A']}}};
  assert.equal(compositePanels(gridOf([solidPanel(netPanel,'전개도'),solidPanel(hexPrism([seg('B','H')]),'육각기둥')])).length,2);
});
test('E5: solid panels are refused with explicit codes where the grid cannot hold them',()=>{
  const one=()=>solidPanel(hexPrism([seg('B','H')]),'육각기둥');
  assert.throws(()=>compositePanels(gridOf([one()])),error=>reason(error)==='PANELS');
  assert.throws(()=>compositePanels(gridOf(Array.from({length:5},one))),error=>reason(error)==='PANELS');
  assert.throws(()=>compositePanels(gridOf([one(),one()],{chain:'solid-figure-v1'})),error=>reason(error)==='SOLID_PANEL_PLACEMENT_0');
  const graph={caption:{text:'그래프'},plan:{capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['0','0','1']}}};
  assert.throws(()=>compositePanels(gridOf([one(),graph])),error=>reason(error)==='PANEL_SOLID_MIXED_0');
  assert.throws(()=>compositePanels(gridOf([graph,one()])),error=>reason(error)==='PANEL_SOLID_MIXED_1');
  const withKey=(key,value)=>gridOf([one(),solidPanel({...hexPrism([seg('B','H')]),[key]:value},'육각기둥')]);
  for(const [key,value] of [['caption','가'],['solidCaption',{text:'가'}],['sourceConditions',[]],['newVisualInformation',[]],['sourceQuote','가']])assert.throws(()=>compositePanels(withKey(key,value)),error=>reason(error)==='PANEL_SOLID_PLAN_1',key);
  assert.throws(()=>compositePanels(withKey('panelWidth',300)),error=>reason(error)==='PANEL_SOLID_PLAN_1');
  assert.throws(()=>compositePanels(gridOf([one(),{caption:{text:''},plan:hexPrism([seg('B','H')])}])),error=>reason(error)==='PANEL_CAPTION_1');
  // the width belongs to the grid: a standalone solid plan may not write it, and a bad value is refused by the solver
  assert.throws(()=>expandSolidFigure(figure({solids:[cuboid()],panelWidth:GRID_PANEL_WIDTH})),code('SOLID_PLAN_INVALID'));
  assert.throws(()=>solveSolidFigure(figure({solids:[cuboid()],panelWidth:300})),code('SOLID_PLAN_INVALID'));
});
test('E5: ten segments are allowed, eleven are not',()=>{
  const names='FGHEBCDA',edges=['FG','GH','HE','EF','BC','CD','DA','AB','FB','GC','HD','EA'];
  const withSegments=count=>figure({solids:[cuboid({names})],segments:edges.slice(0,count).map(pair=>seg(pair[0],pair[1]))});
  assert.equal(solveSolidFigure(withSegments(10)).segments.length,10);
  assert.throws(()=>solveSolidFigure(withSegments(11)),code('SOLID_SEGMENTS_INVALID'));
});
test('E5: three solid panels of one hexagonal prism compose in one grid, each panel passes its own observer',async()=>{
  const identityC=assetIdentity('solid-grid-fixture|1','SOLUTION_VISUAL','decisive-relation');
  const plan=gridOf([solidPanel(hexPrism([seg('B','H','REF'),seg('B','A'),seg('B','C'),seg('H','G'),seg('H','I')]),'만나는 모서리 4개'),
    solidPanel(hexPrism([seg('B','H','REF'),seg('I','C'),seg('J','D'),seg('K','E'),seg('L','F'),seg('G','A')]),'평행한 모서리 5개'),
    solidPanel(hexPrism([seg('B','H','REF'),seg('C','D'),seg('D','E'),seg('E','F'),seg('F','A'),seg('I','J'),seg('J','K'),seg('K','L'),seg('L','G')]),'꼬인 모서리 8개')]);
  const checked=compositePanels(plan),framed={...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))};
  const composed=await composeCompositeCandidate({plan:framed,panels:checked.map(item=>({plan:item.plan,model:solveSolidFigure(item.plan)})),identity:identityC,typographyPolicy:{baseFontPx:30,displayScale:0.375,fontFloorCssPx:11}});
  assert.equal(composed.status,'COMPOSED',JSON.stringify([composed.status,composed.detail]).slice(0,400));
  assert.deepEqual(composed.layout,{kind:'GRID',columns:2,rows:2});
  assert.equal(composed.panels.length,3);
  assert.ok(composed.panels.every(item=>item.status==='COMPOSED'&&item.staticAudit.status==='PASS'),JSON.stringify(composed.panels.map(item=>item.staticAudit)));
  assert.match(composed.svg,/<svg [^>]*width="776"/);
});

// --- E6: several names on one vertex, face diagonals of a net, sourceQuote ---------------------------------------------------------------------------
const foldedNames={base:['H,B','C,G','F,D','E'],top:['M,A,I','N','K','L,J']};
const foldedPlan=(over={})=>figure({unit:'cm',solids:[{kind:'PRISM',base:{kind:'RECT',width:3,depth:4},height:7,names:foldedNames}],
  segments:[seg('N','J','REF'),seg('A','H'),seg('G','F')],dims:[{from:'A',to:'B'}],...over});
test('E6: one vertex may carry several names ("M,A,I"): the first is its name, every name is usable, one label writes them all',async()=>{
  const plan=foldedPlan();
  const model=solveSolidFigure(plan),vertices=model.solids[0].vertices;
  assert.deepEqual(vertices.map(v=>v.name),['H','C','F','E','M','N','K','L']);
  assert.deepEqual(vertices.filter(v=>v.aliases).map(v=>v.aliases),[['H','B'],['C','G'],['F','D'],['M','A','I'],['L','J']]);
  assert.equal(vertices[3].aliases,undefined);// a single name has no aliases, so a plan without several names is unchanged
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.match(svg,/<g id="name-M"[^>]*data-value="M,A,I"[^>]*data-tex="M,A,I"/);
  assert.equal((svg.match(/data-label-role="vertex-name"/g)??[]).length,8);
  // the edges are keyed by the first name; a segment by any of the names it was written with
  assert.match(svg,/data-edge="HM"/);assert.match(svg,/id="segment-NJ"[^>]*data-edge="NJ"/);
  // the label must write exactly the names of the vertex
  const failing=async(tampered,prefix)=>{const r=await audit(plan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  const group=svg.match(/<g id="name-M"[^>]*>/)[0];
  await failing(svg.replace(group,group.replace('data-value="M,A,I"','data-value="M,A"')),'SOLID_NAME_MISMATCH:name-M');
  // a segment end that is not one of the vertex's names is an unknown segment
  const noseg=svg.match(/<line id="segment-NJ"[^>]*data-edge="NJ"/)[0];
  await failing(svg.replace(noseg,noseg.replace('data-edge="NJ"','data-edge="NQ"')),'SOLID_SEGMENT_NAME_UNKNOWN');
  // the commas of a letters string are still ignored, so "A,B,C,D,E,F,G,H" is eight single names as before
  const letters=solveSolidFigure(figure({solids:[cuboid({names:'A,B,C,D,E,F,G,H'})]}));
  assert.deepEqual(letters.solids[0].vertices.map(v=>v.name),[...'ABCDEFGH']);assert.ok(letters.solids[0].vertices.every(v=>v.aliases===undefined));
});
test('E6: several names are refused with explicit codes',()=>{
  const names=(base,top)=>figure({solids:[{kind:'PRISM',base:{kind:'RECT',width:3,depth:4},height:7,names:{base,top}}]});
  const ok=['A','B','C','D'],tops=['E','F','G','H'];
  assert.throws(()=>solveSolidFigure(names(['A,B','C,A','D','X'],tops)),code('SOLID_NAME_DUPLICATE:A'));
  assert.throws(()=>solveSolidFigure(names(['A,A','B','C','D'],tops)),code('SOLID_NAME_DUPLICATE:A'));
  assert.throws(()=>solveSolidFigure(names(['A,,B','B','C','D'],tops)),code('SOLID_NAMES_INVALID'));
  assert.throws(()=>solveSolidFigure(names(['A,b','B','C','D'],tops)),code('SOLID_NAMES_INVALID'));
  assert.throws(()=>solveSolidFigure(names(['A,B,C,D,E','X','Y','Z'],tops)),code('SOLID_NAMES_INVALID'));
  assert.throws(()=>solveSolidFigure(names(['A,','B','C','D'],tops)),code('SOLID_NAMES_INVALID'));
  assert.equal(solveSolidFigure(names(['A,B,C,D','X','Y','Z'],tops)).solids[0].vertices[0].aliases.length,4);
  assert.throws(()=>solveSolidFigure(foldedPlan({segments:[seg('N','Q')]})),code('SOLID_NAME_UNKNOWN'));
  // several names are for polyhedron vertices: a round solid keeps single names
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:2,height:3,names:{center:'O,P'}}]})),code('SOLID_NAMES_INVALID'));
  void ok;
});
const diagonalNet=(extra,over)=>emphasisNet({segments:extra},over);
test('E6: a face diagonal of a net is stressed by corner index or by its two names, and every tamper of the final SVG is read back',async()=>{
  const plan=diagonalNet([{from:'N',to:'L',role:'REF'},{face:'bottom',diagonal:[3,1]}]);
  const model=solveSolidFigure(plan);
  assert.deepEqual(model.segments,[{face:'top',diagonal:[1,3],role:'REF',from:'N',to:'L'},{face:'bottom',diagonal:[1,3],role:'ACCENT'}]);
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="net-diagonal"/g)??[]).length,2);
  const lineOf=id=>svg.match(new RegExp(`<line id="${id}"[^>]*\\/>`))[0];
  const ref=lineOf('net-diagonal-top-1-3'),accent=lineOf('net-diagonal-bottom-1-3');
  for(const part of [/data-face="top"/,/data-diagonal="1-3"/,/data-vis="solid"/,/stroke="#111" stroke-width="2.4"/,/data-accent="REF"/])assert.match(ref,part);
  assert.match(accent,/stroke="#c0392b"/);assert.match(accent,/data-accent="ACCENT"/);
  const failing=async(tampered,prefix)=>{const r=await audit(plan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  // a planned diagonal not drawn, drawn between other corners, in the wrong role or dashed, a diagonal nobody planned
  await failing(svg.replace(`<g data-layer="40">${ref}</g>`,''),'SOLID_NET_DIAGONAL_MISSING');
  const moved=ref.replace(/x2="[\d.]+"/,m=>`x2="${Number(m.slice(4,-1))+20}"`);
  await failing(svg.replace(ref,moved),'SOLID_NET_DIAGONAL_MISSING');
  await failing(svg.replace(ref,ref.replace('data-diagonal="1-3"','data-diagonal="0-2"')),'SOLID_NET_DIAGONAL_FACE_MISMATCH');
  await failing(svg.replace(accent,accent.replace('stroke="#c0392b"','stroke="#111"').replace('data-accent="ACCENT"','data-accent="REF"')),'SOLID_NET_DIAGONAL_ROLE_MISMATCH');
  await failing(svg.replace(accent,accent.replace(' fill="none"',' stroke-dasharray="5 4" fill="none"')),'SOLID_NET_DIAGONAL_STYLE_MISMATCH');
  await failing(svg.replace(accent,accent.replace(' data-accent="ACCENT"','')),'SOLID_NET_ACCENT_ATTRIBUTE_INCONSISTENT');
  const side=svg.match(/<polygon id="net-face-side0"[^>]*points="([^"]+)"/)[1].split(' ').map(q=>q.split(',').map(Number));
  const extra=`<g data-layer="40"><line id="net-diagonal-side0-0-2" data-role="net-diagonal" data-face="side0" data-diagonal="0-2" data-vis="solid" stroke="#c0392b" stroke-width="2.4" data-accent="ACCENT" fill="none" x1="${side[0][0]}" y1="${side[0][1]}" x2="${side[2][0]}" y2="${side[2][1]}"/></g>`;
  await failing(svg.replace('</svg>',extra+'</svg>'),'SOLID_NET_DIAGONAL_UNEXPECTED');
  // a plan without diagonals has none in its SVG, and the stressed edges are unchanged by the new element
  const plain=await panel(emphasisNet({segments:[{from:'B',to:'C'}]}));
  assert.equal(plain.status,'COMPOSED',JSON.stringify(plain.detail));assert.doesNotMatch(plain.svg,/net-diagonal/);
});
test('E6: net diagonals are refused with explicit codes',()=>{
  const bad=(segments,expected)=>assert.throws(()=>solveSolidFigure(diagonalNet(segments)),code(expected),expected);
  bad([{face:'top',diagonal:[0,1]}],'SOLID_NET_SEGMENT_INVALID');// neighbours are an edge, not a diagonal
  bad([{face:'top',diagonal:[3,0]}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'top',diagonal:[1,1]}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'top',diagonal:[0,4]}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'top',diagonal:[0]}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'top',diagonal:'02'}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'top',diagonal:[0,2],edge:1}],'SOLID_NET_SEGMENT_INVALID');
  bad([{diagonal:[0,2]}],'SOLID_NET_SEGMENT_INVALID');
  bad([{from:'N',to:'L',diagonal:[1,3],face:'top'}],'SOLID_NET_SEGMENT_INVALID');
  bad([{face:'nope',diagonal:[0,2]}],'SOLID_NET_FACE_UNKNOWN');
  bad([{face:'top',diagonal:[1,3]},{face:'top',diagonal:[3,1]}],'SOLID_NET_SEGMENT_DUPLICATE');
  bad([{from:'N',to:'L'},{from:'L',to:'N'}],'SOLID_NET_SEGMENT_DUPLICATE');
  bad([{from:'N',to:'L'},{face:'top',diagonal:[1,3]}],'SOLID_NET_SEGMENT_DUPLICATE');
  bad([{from:'B',to:'K'}],'SOLID_NET_EDGE_UNKNOWN');// two names that share no face
  // the two names at two different places of the net are ambiguous, as for an edge
  assert.throws(()=>solveSolidFigure(emphasisNet({segments:[{from:'N',to:'L'}],corners:{...cubeCorners,bottom:['N','F','L','H']}})),code('SOLID_NET_EDGE_AMBIGUOUS'));
  // a triangle has no diagonal
  assert.throws(()=>solveSolidFigure(figure({net:{solid:{kind:'PYRAMID',base:{kind:'RECT',width:2,depth:2},height:3,names:'.....'},root:'bottom',joins:[['bottom','side0'],['bottom','side1'],['bottom','side2'],['bottom','side3']],segments:[{face:'side0',diagonal:[0,2]}]}})),code('SOLID_NET_SEGMENT_INVALID'));
  // a cylinder or cone net takes neither
  assert.throws(()=>solveSolidFigure(figure({net:{kind:'CYLINDER',radius:3,height:5,dims:[{part:'rect-height'}],segments:[{face:'rect',diagonal:[0,2]}]}})),code('SOLID_NET_EMPHASIS_UNSUPPORTED:CYLINDER'));
});
test('E6: sourceQuote is provenance only: accepted by a solid and a net plan, carried to the composite, never drawn',()=>{
  const base=figure({solids:[cuboid()],dims:[{edge:'FG'}]}),quote='한 모서리와 평행한 모서리';
  assert.deepEqual(solveSolidFigure({...base,sourceQuote:quote}),solveSolidFigure(base));
  const expanded=expandSolidFigure({...base,sourceQuote:quote});
  assert.equal(expanded.sourceQuote,quote);assert.equal(Object.hasOwn(expanded.panels[0].plan,'sourceQuote'),false);
  assert.equal(Object.hasOwn(expandSolidFigure(base),'sourceQuote'),false);
  assert.equal(compositePanels(expanded).length,1);
  assert.deepEqual(solveSolidFigure(emphasisNet({},{sourceQuote:quote})),solveSolidFigure(emphasisNet()));
  for(const wrong of ['',' ',5,null,['가'],'가'.repeat(201)])assert.throws(()=>solveSolidFigure({...base,sourceQuote:wrong}),code('SOLID_SOURCE_QUOTE_INVALID'));
});

// --- E4: a convex polyhedron cut by planes through edge points ------------------------------------------------------------------------------------
const cutCube=(cuts,over={},solidOver={})=>figure({solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:4},height:4,names:'FGHEBCDA',cuts,...solidOver}],...over});
const midCut=[['AD','1/2','M'],['BC','1/2','N'],['CG','1/2','P'],['DH','1/2','Q']];
const hexCut=[['GH','1/2','P'],['GC','1/2','Q'],['BC','1/2','R'],['BA','1/2','S'],['EA','1/2','T'],['EH','1/2','U']];
test('E4: a cube cut through four edge midpoints M, N, P, Q loses an edge-side prism and gains the rectangle MNPQ; hidden edges follow the depth test',()=>{
  const model=solveSolidFigure(cutCube([{through:midCut}]));
  const solid=model.solids[0];
  assert.deepEqual(solid.vertices.map(v=>v.name),['F','G','H','E','B','A','P','Q','N','M']);// the 6 kept corners, then the new ones by their edge
  assert.deepEqual(solid.faces.map(f=>f.id),['bottom','top','side0','side1','side2','side3','cut1']);
  assert.equal(solid.edges.length,15);assert.equal(solid.vertices.length-solid.edges.length+solid.faces.length,2);// Euler: a closed polyhedron
  const at=name=>solid.vertices.find(v=>v.name===name).p,dist=(a,b)=>Math.hypot(...at(a).map((x,i)=>x-at(b)[i]));
  assert.ok(Math.abs(dist('M','N')-4)<1e-5&&Math.abs(dist('P','Q')-4)<1e-5&&Math.abs(dist('N','P')-2*Math.SQRT2)<1e-5&&Math.abs(dist('M','Q')-dist('N','P'))<1e-5);
  assert.deepEqual(hiddenEdges(solid),['EA','FE','HE']);
  assert.equal(solid.cuts.length,1);assert.equal(solid.cuts[0].removed,2);assert.equal(solid.cuts[0].added,4);
  // the unnamed model is untouched by the new field: a plan without cuts has no cuts in its model
  assert.equal('cuts' in solveSolidFigure(figure({solids:[cuboid()]})).solids[0],false);
});
test('E4: six edge midpoints give the regular hexagon of a cube; equal halves need keep, which may name either side',()=>{
  assert.throws(()=>solveSolidFigure(cutCube([{through:hexCut}])),code('SOLID_CUT_KEEP_AMBIGUOUS'));
  for(const [keep,names] of [['F',['F','G','E','B']],['H',['H','C','D','A']]]){
    const solid=solveSolidFigure(cutCube([{through:hexCut,keep}])).solids[0];
    assert.deepEqual(solid.vertices.slice(0,4).map(v=>v.name),names);
    assert.equal(solid.vertices.length,10);assert.equal(solid.edges.length,15);
    const section=solid.faces.at(-1).idx.map(i=>solid.vertices[i].p),sides=section.map((p,i)=>Math.hypot(...p.map((x,c)=>x-section[(i+1)%6][c])));
    assert.equal(section.length,6);assert.ok(sides.every(l=>Math.abs(l-sides[0])<1e-5),'a regular hexagon');
  }
  assert.throws(()=>solveSolidFigure(cutCube([{through:hexCut,keep:'Z'}])),code('SOLID_NAME_UNKNOWN'));
  // three of the six points fix the same plane (the new vertices are then unnamed)
  const three=solveSolidFigure(cutCube([{through:hexCut.slice(0,3),keep:'F'}])).solids[0];
  assert.equal(three.vertices.length,10);assert.equal(three.vertices.filter(v=>v.name===null).length,3);
});
test('E4: a vertex on the plane stays and is a corner of the section; an edge that lies in the plane cannot carry a through point',()=>{
  const through=[['FG','1/4'],['GH','1/4'],['CD','1/3']];// the plane also passes through the vertex B
  const solid=solveSolidFigure(cutCube([{through}])).solids[0];
  assert.equal(solid.vertices.length,9);assert.equal(solid.edges.length,14);
  const b=solid.vertices.findIndex(v=>v.name==='B');
  assert.ok(b>=0&&solid.faces.at(-1).idx.includes(b));
  assert.throws(()=>solveSolidFigure(cutCube([{through,keep:'B'}])),code('SOLID_CUT_KEEP_INVALID'));
  assert.throws(()=>solveSolidFigure(cutCube([{through:[['FG','1/4'],['HE','3/4'],['CD','1/4']]}])),code('SOLID_CUT_INVALID'));// C and D lie in this plane
});
test('E4: a corner cut by three midpoints, a pyramid cut parallel to its base and a prism cut twice are solved',()=>{
  const corner=solveSolidFigure(cutCube([{through:[['AD','1/2','M'],['DC','1/2','N'],['DH','1/2','P']]}])).solids[0];
  assert.equal(corner.vertices.length,10);assert.equal(corner.faces.length,7);assert.equal(corner.faces.at(-1).idx.length,3);
  // the apex side has one vertex against four: the base side stays unless keep names the apex
  const pyramid=(keep)=>solveSolidFigure(figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:4,names:'ABCDV',cuts:[{through:[['VA','1/2'],['VB','1/2'],['VC','1/2']],...(keep?{keep}:{})}]}]})).solids[0];
  assert.deepEqual(pyramid().vertices.slice(0,4).map(v=>v.name),['A','B','C','D']);assert.equal(pyramid().vertices.length,8);assert.equal(pyramid().faces.length,6);
  assert.deepEqual(pyramid('V').vertices.map(v=>v.name).slice(0,1),['V']);assert.equal(pyramid('V').vertices.length,5);assert.equal(pyramid('V').faces.length,5);
  // a frustum, cut in a plane through three of its slanted edges
  const frustum=solveSolidFigure(figure({solids:[{kind:'FRUSTUM',base:{kind:'RECT',width:6,depth:6},height:4,topScale:0.5,names:'ABCDEFGH',cuts:[{through:[['AE','1/2'],['BF','1/2'],['CG','1/2']],keep:'A'}]}]})).solids[0];
  assert.equal(frustum.vertices.length,8);// the mid-level plane halves the frustum: the 4 bottom corners and 4 new ones
  // a second plane is made on the solid the first one left, and may name the vertices the first one made
  const twice=solveSolidFigure(cutCube([{through:midCut},{through:[['FG','1/2','R'],['FE','1/2','S'],['FB','1/2','T']]}])).solids[0];
  assert.equal(twice.cuts.length,2);assert.ok(['R','S','T','M','N','P','Q'].every(name=>twice.vertices.some(v=>v.name===name))&&!twice.vertices.some(v=>v.name==='F'));
  assert.equal(twice.vertices.length-twice.edges.length+twice.faces.length,2);
  assert.ok(twice.faces.some(f=>f.id==='cut1')&&twice.faces.some(f=>f.id==='cut2'));
});
test('E4: cuts are refused with explicit codes',()=>{
  const bad=(cuts,expected,solidOver)=>assert.throws(()=>solveSolidFigure(cutCube(cuts,{},solidOver)),code(expected),expected+' '+JSON.stringify(cuts));
  bad([],'SOLID_CUT_COUNT_INVALID');
  bad([{through:midCut},{through:midCut},{through:midCut}],'SOLID_CUT_COUNT_INVALID');
  bad('x','SOLID_CUT_COUNT_INVALID');
  bad(['x'],'SOLID_CUT_INVALID');
  bad([{through:midCut,colour:'red'}],'SOLID_CUT_INVALID');
  bad([{through:midCut.slice(0,2)}],'SOLID_CUT_INVALID');
  bad([{through:[...midCut,...hexCut]}],'SOLID_CUT_INVALID');// more than six points
  bad([{through:[['AD','1/2'],['AD','1/3'],['BC','1/2']]}],'SOLID_CUT_INVALID');// two points on one edge
  bad([{through:[['AD','1/2'],['DA','1/3'],['BC','1/2']]}],'SOLID_CUT_INVALID');
  for(const at of ['0/2','2/2','3/2','1/0','half','1/2 ','0.5'])bad([{through:[['AD',at],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_INVALID');
  bad([{through:[['AD',0.5],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_INVALID');
  bad([{through:[['A','1/2'],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_INVALID');
  bad([{through:[['ADB','1/2'],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_INVALID');
  bad([{through:[['AD','1/2','MM'],['BC','1/2'],['CG','1/2']]}],'SOLID_NAMES_INVALID');
  bad([{through:[['AD','1/2','m'],['BC','1/2'],['CG','1/2']]}],'SOLID_NAMES_INVALID');
  bad([{through:[['AC','1/2'],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_EDGE_UNKNOWN:AC');// a face diagonal is no edge
  bad([{through:[['AZ','1/2'],['BC','1/2'],['CG','1/2']]}],'SOLID_CUT_EDGE_UNKNOWN:AZ');
  bad([{through:[['AD','1/2'],['BC','1/2'],['CG','1/2'],['FE','1/4']]}],'SOLID_CUT_NOT_PLANAR');
  bad([{through:[['FG','1/2'],['GC','1/2'],['CB','1/2']]}],'SOLID_CUT_NO_EFFECT');// the plane of the front face
  bad([{through:[['AD','1/2'],['BC','1/2'],['FG','1/2']]}],'SOLID_CUT_KEEP_AMBIGUOUS');// a plane through the middle: four corners on each side
  bad([{through:midCut,keep:5}],'SOLID_CUT_INVALID');
  // a second plane may not name a vertex the first one removed
  bad([{through:midCut},{through:[['CD','1/2'],['MA','1/2'],['NB','1/2']]}],'SOLID_CUT_EDGE_UNKNOWN:CD');
  // not every solid is cut
  bad([{through:midCut}],'SOLID_CUT_NOT_CONVEX',{base:{kind:'POLYGON',points:[[0,0],[4,0],[4,2],[2,2],[2,4],[0,4]]},names:'ABCDEFGHIJKL'});
  bad([{through:midCut}],'SOLID_COUNT_UNSUPPORTED:CUT',{names:'.'.repeat(8),count:{vertices:true}});
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'CYLINDER',radius:2,height:3,cuts:[{through:midCut}]}]})),code('SOLID_CUT_UNSUPPORTED:CYLINDER'));
  assert.throws(()=>solveSolidFigure(figure({net:{solid:{kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:2,names:'........',cuts:[{through:midCut}]},root:'side0',joins:cubeJoins}})),code('SOLID_NET_UNSUPPORTED:CUT'));
  // a height line has no apex to hang on once a plane has cut the solid
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:4,names:'ABCDV',cuts:[{through:[['VA','1/2'],['VB','1/2'],['VC','1/2']]}]}],dims:[{height:true}]})),code('SOLID_DIMS_INVALID'));
});
test('E4: a cut cube is drawn with names, a shaded section and emphasized edges, and the independent observer re-derives the cut',async()=>{
  const plan=cutCube([{through:midCut}],{unit:'cm',highlights:[{polygon:['M','N','P','Q']}],segments:[seg('M','Q','REF'),seg('A','B'),seg('B','N'),seg('B','F'),seg('E','F'),seg('F','G'),seg('G','P'),seg('G','H')],dims:[{from:'M',to:'N'},{from:'M',to:'Q'}]});
  const composed=await panel(plan);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  const svg=composed.svg;
  assert.equal((svg.match(/data-role="edge"/g)??[]).length>=15,true);
  assert.equal((svg.match(/data-label-role="vertex-name"/g)??[]).length,10);
  assert.match(svg,/data-role="highlight-face" data-polygon="MNPQ"/);
  // the lengths are exact: MN is the cube's side, MQ the diagonal of a half face
  const tex=[...svg.matchAll(/data-dim="dim-(\d)"[^>]*data-tex="([^"]+)"/g)].map(m=>m[2]);void tex;
  assert.match(svg,/data-tex="4\\,\\mathrm\{cm\}"/);assert.match(svg,/data-tex="2\\sqrt\{2\}\\,\\mathrm\{cm\}"/);
  const failing=async(wrongPlan,prefix,drawn=svg)=>{const r=await audit(wrongPlan,drawn);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  // a figure drawn for another cut: the uncut cube, another fraction, another plane
  const uncut=await panel(figure({solids:[cuboid({base:{kind:'RECT',width:4,depth:4},height:4,names:{base:'FGHE',top:'BCDA'}})]}));
  assert.equal(uncut.status,'COMPOSED',JSON.stringify(uncut.detail));
  await failing(plan,'SOLID_EDGE_MISSING',uncut.svg);
  await failing(figure({solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:4},height:4,names:{base:'FGHE',top:'BCDA'}}]}),'SOLID_EDGE_UNKNOWN');
  const quarter=cutCube([{through:[['AD','1/4','M'],['BC','1/4','N'],['CG','1/4','P'],['DH','1/4','Q']]}],{unit:'cm',highlights:[{polygon:['M','N','P','Q']}],segments:plan.segments,dims:plan.dims.slice(0,1)});
  const wrong=await audit(quarter,svg);
  assert.equal(wrong.status,'FAIL',JSON.stringify(wrong.errors));
  // a section edge drawn solid where the depth test makes it hidden is read back as before
  const hidden=svg.match(/<line id="s1-edge-[A-Z]+-\d+"[^>]*data-vis="hidden"[^>]*\/>/)[0];
  await failing(plan,'SOLID_EDGE_VISIBILITY_MISMATCH',svg.replace(hidden,hidden.replace(' stroke-dasharray="5 4"','').replace('data-vis="hidden"','data-vis="solid"')));
});
test('E4: a cut solid sits beside another in a grid and in an unnamed-vertex figure',async()=>{
  // two cut cubes in one grid; the new vertices of the second are unnamed and read back by their index names
  const named=cutCube([{through:midCut}],{unit:'cm'}).solids[0];
  const plan=gridOf([solidPanel({capability:'solid-figure-v1',solids:[named],segments:[seg('M','Q','REF')]},'MQ의 위치'),
    solidPanel({capability:'solid-figure-v1',solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:4},height:4,names:'FGHEBCDA',cuts:[{through:[['AD','1/2'],['BC','1/2'],['CG','1/2'],['DH','1/2']]}]}],segments:[seg('A','B','REF')]},'이름 없는 점')]);
  const checked=compositePanels(plan),framed={...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))};
  const small={baseFontPx:16,displayScale:0.7,fontFloorCssPx:11};
  const composed=await composeCompositeCandidate({plan:framed,panels:checked.map(item=>({plan:item.plan,model:solveSolidFigure(item.plan)})),identity:assetIdentity('solid-cut-grid|1','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:small});
  assert.equal(composed.status,'COMPOSED',JSON.stringify([composed.status,composed.detail]).slice(0,500));
  assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'),JSON.stringify(composed.panels.map(item=>item.staticAudit)));
});

// --- E27: a sphere cut by planes through its centre (cut:{kind,facing?}) ---------------------------------------------------------------------------
// (an `over` value of undefined drops that key: the plan is JSON)
const sphereCut=(cut,over={},solidOver={})=>Object.fromEntries(Object.entries(figure({unit:'cm',solids:[{id:'s1',kind:'SPHERE',radius:5,names:{center:'O'},cut,...solidOver}],dims:[{solid:'s1',radius:'center'}],...over})).filter(([,value])=>value!==undefined));
// The pieces worked out by hand (viewer at +x, -y, +z; CUT facing turns the cut faces toward the viewer): the boundary quarter-disks as plane+signs of the two
// in-plane axes, the radii where two cut faces meet at an angle, the half axis a radius label lies on, and how many stretches of the limb circle are drawn.
const CUT_PIECES={
  HALF:{faces:['Y++','Y+-','Y-+','Y--'],creases:[],radius:{axis:0,sign:1},limb:3,fills:1},
  QUARTER:{faces:['X++','X+-','Y-+','Y--'],creases:['+Z','-Z'],radius:{axis:0,sign:-1},limb:1,fills:2},
  OCTANT:{faces:['X+-','Y--','Z-+'],creases:['-X','+Y','-Z'],radius:{axis:0,sign:-1},limb:0,fills:3},
  THREE_QUARTERS:{faces:['X-+','X--','Y++','Y+-'],creases:['+Z','-Z'],radius:{axis:0,sign:1},limb:5,fills:2},
  SEVEN_EIGHTHS:{faces:['X-+','Y++','Z+-'],creases:['+X','-Y','+Z'],radius:{axis:0,sign:1},limb:6,fills:3}
};
const sphereSvg=async(plan,expectStatus='COMPOSED')=>{
  const composed=await panel(plan);
  assert.equal(composed.status,expectStatus,JSON.stringify([composed.status,composed.detail,composed.staticAudit?.errors]).slice(0,600));
  if(expectStatus==='COMPOSED')assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  return composed.svg;
};
test('E27: a sphere cut by planes through its centre keeps the piece that is left: seen faces, rim arcs, radii and limb as worked out by hand',()=>{
  for(const [kind,want] of Object.entries(CUT_PIECES)){
    const model=solveSolidFigure(sphereCut({kind}));
    const cut=model.solids[0].cut;
    assert.equal(cut.kind,kind);assert.equal(cut.facing,'CUT');
    assert.deepEqual(cut.faces.map(f=>f.id).sort(),[...want.faces].sort(),kind+' faces');
    assert.ok(cut.faces.every(f=>f.visible),kind+': every cut face faces the viewer');
    assert.deepEqual(cut.arcs.map(a=>a.id).sort(),[...want.faces].sort(),kind+' rim arcs are the rims of the faces');
    assert.deepEqual(cut.creases.map(c=>c.id).sort(),[...want.creases].sort(),kind+' radii');
    assert.deepEqual(cut.radiusAxis,want.radius,kind+' radius axis');
    assert.equal(cut.limb.length,want.limb,kind+' limb stretches');
    // turned to the viewer, nothing of the piece hides its own cut faces: every rim arc and radius is one solid run
    assert.ok([...cut.arcs,...cut.creases].every(item=>item.runs.length===1&&!item.runs[0].hidden),kind+' no hidden edges');
    // the same piece turned about its centre: the curved surface faces the viewer, the cut faces and radii are behind, no radius is seen
    const back=solveSolidFigure(sphereCut({kind,facing:'CURVED'},{dims:undefined})).solids[0].cut;
    assert.ok(back.faces.every(f=>!f.visible),kind+' CURVED: no cut face is seen');
    assert.equal(back.radiusAxis,null);
    assert.ok([...back.arcs,...back.creases].some(item=>item.runs.some(run=>run.hidden)),kind+' CURVED: some edge is behind the surface');
  }
  // the eighths: a seven-eighths sphere shows its whole limb circle, a single octant none of it (its outline is made by its three rims)
  assert.deepEqual(Object.fromEntries(Object.entries(CUT_PIECES).map(([k,v])=>[k,v.limb])),{HALF:3,QUARTER:1,OCTANT:0,THREE_QUARTERS:5,SEVEN_EIGHTHS:6});
  // the drawn extent is the piece, not the whole sphere: a quarter wedge is narrower and an octant lower than the sphere they were cut from
  const scaleOf=plan=>solidFigureSpec(plan,solveSolidFigure(plan)).frame.scale;
  const whole=figure({unit:'cm',solids:[{kind:'SPHERE',radius:5,names:{center:'O'}}],dims:[{radius:'center'}]});
  assert.ok(scaleOf(sphereCut({kind:'OCTANT'}))>scaleOf(whole),'an octant is drawn larger than the sphere it came from');
  assert.equal(scaleOf(sphereCut({kind:'SEVEN_EIGHTHS'})),scaleOf(whole),'seven eighths keep the whole limb circle');
  // a plan without cut has no cut model: the plain sphere and hemisphere are what they were
  for(const kind of ['SPHERE','HEMISPHERE'])assert.equal('cut' in solveSolidFigure(figure({solids:[{kind,radius:3,names:{center:'O'}}]})).solids[0],false);
});
test('E27: a cut sphere is refused with explicit codes where the engine cannot draw it',()=>{
  const bad=(cut,expected,over,solidOver)=>assert.throws(()=>solveSolidFigure(sphereCut(cut,over,solidOver)),code(expected),expected);
  bad({kind:'CAP'},'SOLID_SPHERE_CUT_KIND_UNSUPPORTED:CAP');
  bad({kind:'HALF',offset:1},'SOLID_SPHERE_CUT_OFF_CENTRE');
  bad({kind:'HALF',offset:0.5,facing:'CUT'},'SOLID_SPHERE_CUT_OFF_CENTRE');
  bad({kind:'HALF',explode:true},'SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED');
  bad({kind:'HALF',facing:'BACK'},'SOLID_SPHERE_CUT_FACING_INVALID');
  bad({kind:'HALF',colour:'red'},'SOLID_SPHERE_CUT_INVALID');
  bad({},'SOLID_SPHERE_CUT_INVALID');bad('HALF','SOLID_SPHERE_CUT_INVALID');bad(['HALF'],'SOLID_SPHERE_CUT_INVALID');bad({kind:3},'SOLID_SPHERE_CUT_INVALID');
  // a radius needs a seen radius
  bad({kind:'HALF',facing:'CURVED'},'SOLID_SPHERE_CUT_RADIUS_HIDDEN');
  // only a SPHERE is cut, and a cut sphere does not nest or count
  for(const solid of [{kind:'HEMISPHERE',radius:3},{kind:'CYLINDER',radius:3,height:4},{kind:'CONE',radius:3,height:4}])
    assert.throws(()=>solveSolidFigure(figure({solids:[{...solid,cut:{kind:'HALF'}}],dims:[{height:true}]})),code('SOLID_SPHERE_CUT_UNSUPPORTED:'+solid.kind));
  assert.throws(()=>solveSolidFigure(figure({solids:[{id:'s1',kind:'CYLINDER',radius:4,height:8},{id:'s2',kind:'SPHERE',radius:3,inside:'s1',cut:{kind:'HALF'}}],dims:[{solid:'s1',height:true}]})),code('SOLID_SPHERE_CUT_NEST_UNSUPPORTED'));
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'SPHERE',radius:3,cut:{kind:'HALF'},count:{vertices:true}}]})),code('SOLID_COUNT_UNSUPPORTED:SPHERE'));
  // planes cutting a polyhedron stay `cuts`; a sphere does not take them
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'SPHERE',radius:3,cuts:[{through:[['AB','1/2'],['BC','1/2'],['CD','1/2']]}]}],dims:[{radius:'center'}]})),code('SOLID_CUT_UNSUPPORTED:SPHERE'));
  // no other section on a sphere
  assert.throws(()=>solveSolidFigure(figure({solids:[{kind:'SPHERE',radius:3,cut:{kind:'HALF'}}],section:{kind:'AXIAL'},dims:[{radius:'center'}]})),code('SOLID_SECTION_UNSUPPORTED'));
});
test('E27: every piece and both facings are composed, read back by the independent observer, with the cut faces filled and hidden edges dashed',async()=>{
  for(const [kind,want] of Object.entries(CUT_PIECES)){
    const svg=await sphereSvg(sphereCut({kind}));
    assert.equal((svg.match(/data-role="cut-face"/g)??[]).length,want.fills,kind+' fills');
    assert.equal((svg.match(/data-role="sphere-limb"/g)??[]).length,want.limb,kind+' limb stretches');
    assert.equal((svg.match(/data-role="cut-crease"/g)??[]).length,want.creases.length,kind+' radii');
    assert.equal((svg.match(/data-role="cut-arc"/g)??[]).length,want.faces.length,kind+' rim arcs (one piece each when nothing is hidden)');
    assert.doesNotMatch(svg,/stroke-dasharray/,kind+': nothing is behind the piece');
    assert.match(svg,/data-role="center-dot"/);assert.match(svg,/data-kind="RADIUS"/);
    // the fill lies beneath every stroke
    assert.ok(svg.indexOf('data-role="cut-face"')<svg.indexOf('data-role="cut-arc"'));
    const back=await sphereSvg(sphereCut({kind,facing:'CURVED'},{dims:undefined}));
    assert.doesNotMatch(back,/data-role="cut-face"/,kind+' CURVED has no seen cut face');
    assert.match(back,/stroke-dasharray/,kind+' CURVED shows its far edges dashed');
  }
});
test('E27: the observer reads a quarter wedge back and catches a figure that disagrees with its plan',async()=>{
  const plan=sphereCut({kind:'QUARTER'});
  const svg=await sphereSvg(plan);
  const failing=async(tampered,prefix,againstPlan=plan)=>{const r=await audit(againstPlan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  const element=pattern=>svg.match(pattern)[0];
  // a radius drawn solid where it is behind, a fill missing, a fill with a moved corner, a fill painted over the strokes
  const crease=element(/<line id="s1-crease-\+Z-1"[^>]*\/>/);
  await failing(svg.replace(crease,crease.replace(' stroke-width',' stroke-dasharray="5 4" stroke-width')),'SOLID_EDGE_VISIBILITY_MISMATCH');
  const fills=[...svg.matchAll(/<g data-layer="20"><path id="cut-face-[^>]*\/><\/g>/g)].map(m=>m[0]);
  assert.equal(fills.length,2);
  await failing(svg.replace(fills[0],''),'SOLID_SPHERE_CUT_FACE_SET_MISMATCH');
  await failing(svg.replace(fills[0],fills[0].replace(/data-faces="([^"]+)"/,'data-faces="$1 Z++"')),'SOLID_SPHERE_CUT_FACE');
  const moved=fills[0].replace(/ d="M ([\d.]+) ([\d.]+) L ([\d.]+) ([\d.]+)/,(all,a,b,c,d)=>` d="M ${a} ${b} L ${Number(c)+9} ${d}`);
  await failing(svg.replace(fills[0],moved),'SOLID_SPHERE_CUT_FACE_SHAPE_MISMATCH');
  await failing(svg.replace(fills[0],'').replace('</svg>',fills[0]+'</svg>'),'SOLID_SPHERE_CUT_FACE_NOT_BENEATH');
  // a rim arc that stops short of its end, one drawn as another quadrant, one missing
  const rim=element(/<path id="s1-rim-X\+\+-1"[^>]*\/>/);
  await failing(svg.replace(rim,rim.replace(/ ([\d.]+) ([\d.]+)"\/>$/,(all,x,y)=>` ${Number(x)+7} ${y}"/>`)),'SOLID_SPHERE_CUT_ARC_ENDPOINT_OFF');
  await failing(svg.replace(rim,rim.replace('data-arc="X++"','data-arc="X-+"')),'SOLID_SPHERE_CUT_ARC');
  await failing(svg.replace(`<g data-layer="40">${rim}</g>`,''),'SOLID_SPHERE_CUT_ARC_SET_MISMATCH');
  // the limb circle: a stretch removed, or the dot of the centre
  const limb=element(/<path id="s1-limb-1"[^>]*\/>/);
  await failing(svg.replace(`<g data-layer="40">${limb}</g>`,''),'SOLID_SPHERE_CUT_LIMB_MISMATCH');
  const dot=element(/<circle id="centre-s1"[^>]*\/>/);
  await failing(svg.replace(`<g data-layer="45">${dot}</g>`,''),'SOLID_SPHERE_CUT_CENTRE_DOT_MISMATCH');
  await failing(svg.replace(dot,dot.replace(/ cx="([\d.]+)"/,(all,x)=>` cx="${Number(x)+6}"`)),'SOLID_SPHERE_CUT_CENTRE_DOT_OFF');
  // the radius dimension line: moved off its radius
  const dim=element(/<line id="dim-1-line"[^>]*\/>/);
  await failing(svg.replace(dim,dim.replace(/ y2="([\d.]+)"/,(all,y)=>` y2="${Number(y)+9}"`)),'SOLID_SPHERE_CUT_RADIUS_LINE_MISMATCH');
  // the figure against the plan of another piece, and of the other facing
  await failing(svg,'SOLID_SPHERE_CUT',sphereCut({kind:'OCTANT'}));
  await failing(svg,'SOLID_SPHERE_CUT',sphereCut({kind:'QUARTER',facing:'CURVED'},{dims:undefined}));
  // an element of the solid the plan knows nothing about
  await failing(svg.replace('</svg>','<circle id="x" data-role="mystery" data-solid="s1" cx="5" cy="5" r="2"/></svg>'),'SOLID_SPHERE_CUT_ELEMENT_UNKNOWN');
});
test('E27: the observer checks the stretches of dashed edges behind a curved-side piece',async()=>{
  const plan=sphereCut({kind:'QUARTER',facing:'CURVED'},{dims:undefined});
  const svg=await sphereSvg(plan);
  const failing=async(tampered,prefix)=>{const r=await audit(plan,tampered);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
  const dashed=svg.match(/<path id="s1-rim-[^"]*"[^>]*data-vis="hidden"[^>]*\/>/)[0];
  await failing(svg.replace(dashed,dashed.replace(' stroke-dasharray="5 4"','').replace('data-vis="hidden"','data-vis="solid"')),'SOLID_SPHERE_CUT_BREAK_MISMATCH');
  const solid=svg.match(/<path id="s1-rim-[^"]*"[^>]*data-vis="solid"[^>]*\/>/)[0];
  await failing(svg.replace(solid,solid.replace(' stroke-width',' stroke-dasharray="5 4" stroke-width')),'SOLID_EDGE_VISIBILITY_MISMATCH');
  // a stretch whose break is moved: split a solid rim piece at the wrong place
  const pieces=[...svg.matchAll(/<path id="(s1-rim-[^"]*-\d)"[^>]*data-t0="([\d.]+)" data-t1="([\d.]+)"[^>]*\/>/g)].filter(m=>m[2]!=='0'||m[3]!=='1');
  assert.ok(pieces.length>0,'a rim arc is cut where the depth test changes');
  const piece=svg.match(new RegExp(`<path id="${pieces[0][1]}"[^>]*\\/>`))[0];
  await failing(svg.replace(piece,piece.replace(/data-t1="[\d.]+"/,`data-t1="${(Number(pieces[0][3])+0.2).toFixed(3)}"`)),'SOLID_SPHERE_CUT_');
});
test('E27: cut spheres beside other solids share one scale, and a cut-sphere panel joins a grid',async()=>{
  // two halves side by side (each shows its own disk) and an octant beside a cylinder
  const halves=figure({unit:'cm',solids:[{id:'s1',kind:'SPHERE',radius:3,cut:{kind:'HALF'}},{id:'s2',kind:'SPHERE',radius:3,cut:{kind:'HALF'}}],dims:[{solid:'s1',radius:'center'},{solid:'s2',radius:'center'}]});
  const svg=await sphereSvg(halves);
  assert.equal((svg.match(/data-role="cut-face"/g)??[]).length,2);assert.equal((svg.match(/data-kind="RADIUS"/g)??[]).length,2);
  const mixed=figure({unit:'cm',solids:[{id:'s1',kind:'SPHERE',radius:3,cut:{kind:'OCTANT'}},{id:'s2',kind:'CYLINDER',radius:3,height:5}],dims:[{solid:'s1',radius:'center'},{solid:'s2',height:true}]});
  await sphereSvg(mixed);
  // the octant's radius dimension is the radius that is seen; the other solid's dimensions are untouched
  const plan=gridOf([solidPanel({capability:'solid-figure-v1',unit:'cm',solids:halves.solids,dims:halves.dims},'한 번 자른 두 조각'),
    solidPanel({capability:'solid-figure-v1',unit:'cm',solids:[{id:'s1',kind:'SPHERE',radius:3,cut:{kind:'OCTANT'}}],dims:[{solid:'s1',radius:'center'}]},'8조각 중 한 조각')]);
  const checked=compositePanels(plan),framed={...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))};
  const small={baseFontPx:16,displayScale:0.7,fontFloorCssPx:11};
  const composed=await composeCompositeCandidate({plan:framed,panels:checked.map(item=>({plan:item.plan,model:solveSolidFigure(item.plan)})),identity:assetIdentity('solid-cut-sphere-grid|1','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:small});
  assert.equal(composed.status,'COMPOSED',JSON.stringify([composed.status,composed.detail]).slice(0,500));
  assert.ok(composed.panels.every(item=>item.staticAudit.status==='PASS'),JSON.stringify(composed.panels.map(item=>item.staticAudit)));
});

// --- E28: faces shaded by name (no vertex names), edge numbers in a narrow panel at the large grid font, the body of a level section -------------------
const frustum5=(over={})=>figure({unit:'cm',solids:[{kind:'FRUSTUM',base:{kind:'REGULAR',n:5,side:4},height:6,topScale:0.6,names:'..........'}],dims:[{height:true}],...over});
const failingAudit=async(plan,svg,prefix)=>{const r=await audit(plan,svg);assert.equal(r.status,'FAIL',prefix);assert.ok(r.errors.some(e=>e.startsWith(prefix)),prefix+' in '+JSON.stringify(r.errors));};
test('E28: faces are shaded by their face name with no vertex names, each in its own tint, and the observer reads every face back',async()=>{
  const faces=[{face:'top',fill:'MEDIUM'},{face:'bottom',fill:'MEDIUM'},{face:'side0',fill:'WARM'},{face:'side1',fill:'GREEN'},{face:'side2',fill:'ROSE'},{face:'side3',fill:'VIOLET'},{face:'side4'}];
  const plan=frustum5({highlights:faces});
  const model=solveSolidFigure(plan);
  assert.deepEqual(model.highlights.map(h=>h.face),faces.map(f=>f.face));
  assert.equal('fill' in model.highlights[6],false,'the default tint is not recorded');
  const svg=await sphereSvg(plan);
  assert.equal((svg.match(/data-role="highlight-face"/g)??[]).length,7);
  for(const f of faces)assert.match(svg,new RegExp(`<polygon id="highlight-s1-${f.face}" data-role="highlight-face" data-solid="s1" data-face="${f.face}"${f.fill?` data-fill="${f.fill}"`:''} fill=`));
  assert.match(svg,/data-face="side0" data-fill="WARM" fill="#f2a65a" fill-opacity="0.42"/);
  assert.match(svg,/data-face="side4" fill="#7fa6e8" fill-opacity="0.32"/);
  assert.match(svg,/data-face="top" data-fill="MEDIUM" fill="#7fa6e8" fill-opacity="0.55"/);
  assert.ok(svg.lastIndexOf('data-role="highlight-face"')<svg.indexOf('data-role="edge"'),'the fills lie beneath the strokes');
  // a pyramid has bottom and side faces only; the faces of a named solid can be shaded too, and the polygon form takes a tint as well
  const pyramid=figure({solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'ABCDE'}],highlights:[{face:'bottom'},{face:'side1',fill:'WARM'}]});
  await sphereSvg(pyramid);
  const poly=figure({solids:[cuboid()],segments:[{from:'E',to:'G'},{from:'G',to:'C'},{from:'E',to:'C'}],highlights:[{polygon:['E','G','C'],fill:'GREEN'}]});
  const polySvg=await sphereSvg(poly);
  assert.match(polySvg,/data-role="highlight-face" data-polygon="EGC" data-fill="GREEN" fill="#6fcf97"/);
  // tampering: a tint changed, a corner moved, a shaded face missing, a face shaded twice or another face drawn
  const element=name=>svg.match(new RegExp(`<polygon id="highlight-s1-${name}"[^>]*\\/>`))[0];
  await failingAudit(plan,svg.replace(element('side0'),element('side0').replace('data-fill="WARM"','data-fill="GREEN"')),'SOLID_HIGHLIGHT_FILL_MISMATCH');
  await failingAudit(plan,svg.replace(element('side4'),element('side4').replace('data-face="side4"','data-face="side4" data-fill="ROSE"')),'SOLID_HIGHLIGHT_FILL_MISMATCH');
  await failingAudit(plan,svg.replace(element('side1'),element('side1').replace(/points="([\d.]+),([\d.]+)/,(all,x,y)=>`points="${Number(x)+8},${y}`)),'SOLID_HIGHLIGHT_FACE_VERTEX_OFF');
  await failingAudit(plan,svg.replace(`<g data-layer="20">${element('side3')}</g>`,''),'SOLID_HIGHLIGHT_FACE_SET_MISMATCH');
  await failingAudit(plan,svg.replace(element('side3'),element('side3').replace('data-face="side3"','data-face="side2"')),'SOLID_HIGHLIGHT_FACE_SET_MISMATCH');
  await failingAudit(plan,svg.replace(element('top'),element('top').replace('data-face="top"','data-face="bottom"')),'SOLID_HIGHLIGHT_FACE');
  // the figure against a plan that shades other faces
  await failingAudit(frustum5({highlights:faces.slice(0,6)}),svg,'SOLID_HIGHLIGHT_FACE_SET_MISMATCH');
});
test('E28: a face highlight that names no face of the solid, or two things at once, or a tint that does not exist, is refused',()=>{
  const bad=(highlights,expected,over)=>assert.throws(()=>solveSolidFigure(frustum5({highlights,...over})),code(expected),expected);
  bad([{face:'side9'}],'SOLID_HIGHLIGHT_FACE_UNKNOWN:side9');
  bad([{face:'bottom'},{face:'bottom'}],'SOLID_HIGHLIGHT_INVALID');
  bad([{face:'top',polygon:['A','B','C']}],'SOLID_HIGHLIGHT_INVALID');
  bad([{}],'SOLID_HIGHLIGHT_INVALID');
  bad([{face:'top',fill:'PINK'}],'SOLID_HIGHLIGHT_FILL_INVALID');
  bad([{face:3}],'SOLID_HIGHLIGHT_INVALID');
  bad([{face:'top',colour:'red'}],'SOLID_HIGHLIGHT_INVALID');
  bad([{face:'top',solid:'s9'}],'SOLID_HIGHLIGHT_INVALID');
  bad(Array.from({length:9},(_,k)=>({face:'side'+(k%5)})),'SOLID_HIGHLIGHT_INVALID');
  // several polyhedra need the solid id; a round solid has no named faces; a cut polyhedron's faces are not named
  const two=highlights=>figure({solids:[{id:'s1',kind:'PYRAMID',base:{kind:'RECT',width:3,depth:3},height:4,names:'ABCDE'},{id:'s2',kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:3,names:'FGHIJKLM'}],highlights});
  assert.throws(()=>solveSolidFigure(two([{face:'bottom'}])),code('SOLID_HIGHLIGHT_INVALID'));
  assert.equal(solveSolidFigure(two([{solid:'s2',face:'top'},{solid:'s1',face:'side0'}])).highlights.length,2);
  assert.throws(()=>solveSolidFigure(figure({solids:[{id:'s1',kind:'CYLINDER',radius:2,height:4}],dims:[{height:true}],highlights:[{solid:'s1',face:'top'}]})),code('SOLID_HIGHLIGHT_INVALID'));
  assert.throws(()=>solveSolidFigure(cutCube([{through:midCut}],{unit:'cm',highlights:[{face:'cut1'}]})),code('SOLID_HIGHLIGHT_FACE_UNSUPPORTED:CUT'));
  // eight highlights are allowed
  assert.equal(solveSolidFigure(frustum5({highlights:[{face:'top'},{face:'bottom'},...[0,1,2,3,4].map(k=>({face:'side'+k}))]})).highlights.length,7);
});
test('E28: edge numbers of a pyramid in a narrow grid panel at the large font each find a place: a squeezed-out number goes first on the next try',async()=>{
  const plan={capability:'solid-figure-v1',panelWidth:GRID_PANEL_WIDTH,solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'ABCDE',count:{edges:true}}],...meta};
  const composed=await composeSolidFigurePanel({plan,model:solveSolidFigure(plan),identity,typographyPolicy:{baseFontPx:29.3,displayScale:1,fontFloorCssPx:11}});
  assert.equal(composed.status,'COMPOSED',JSON.stringify([composed.status,composed.detail]).slice(0,400));
  assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
  assert.equal((composed.svg.match(/data-label-role="count-edge"/g)??[]).length,8);
  // with room for nothing there is still an explicit refusal, not a figure with a number far away
  const crowded={...plan,solids:[{kind:'PRISM',base:{kind:'RECT',width:1,depth:1},height:30,names:'.'.repeat(8),count:{vertices:true,edges:true}}]};
  const refused=await composeSolidFigurePanel({plan:crowded,model:solveSolidFigure(crowded),identity,typographyPolicy:{baseFontPx:29.3,displayScale:1,fontFloorCssPx:11}});
  assert.equal(refused.status,'SOLID_LABELS_NO_ROOM');
});
const levelPlan=(solid,section,dims)=>figure({unit:'cm',solids:[solid],section:{kind:'LEVEL',...section},dims});
test('E28: a level section can shade the body below or above its plane (a frustum below a cone, the small cone above), read back as the hull of its circles',async()=>{
  const cases=[
    [{kind:'CONE',radius:6,height:8},{at:'1/2',fill:'BOTTOM'},[{radius:'bottom'},{level:'bottom'},{level:'top'},{radius:'level'}]],
    [{kind:'CONE',radius:6,height:8},{at:'1/3',fill:'TOP'},[{level:'top'}]],
    [{kind:'CONE_FRUSTUM',radius:6,topRadius:3,height:6},{at:'1/2',fill:'BOTTOM'},[{level:true}]],
    [{kind:'CONE_FRUSTUM',radius:6,topRadius:3,height:6},{at:'1/2',fill:'TOP'},[{level:'top'}]],
    [{kind:'CYLINDER',radius:4,height:7},{at:'2/3',fill:'BOTTOM'},[{level:true}]]
  ];
  for(const [solid,section,dims] of cases){
    const plan=levelPlan(solid,section,dims);
    const model=solveSolidFigure(plan);
    assert.equal(model.section.fill,section.fill);
    const svg=await sphereSvg(plan);
    assert.equal((svg.match(/data-role="body-fill"/g)??[]).length,1,solid.kind+section.fill);
    assert.match(svg,new RegExp(`data-role="body-fill" data-solid="s1" data-side="${section.fill}"`));
    assert.ok(svg.indexOf('data-role="body-fill"')<svg.indexOf('data-role="level-fill"'),'the body is shaded beneath the section');
  }
  // without fill the figure is what it was: no body polygon
  assert.doesNotMatch(await sphereSvg(levelPlan({kind:'CONE',radius:6,height:8},{at:'1/2'},[{radius:'bottom'},{level:'bottom'}])),/body-fill/);
  // tampering: the polygon's corner moved in, a circle of the body left outside it, the wrong side, no polygon at all
  const plan=levelPlan({kind:'CONE',radius:6,height:8},{at:'1/2',fill:'BOTTOM'},[{radius:'bottom'},{level:'bottom'},{level:'top'},{radius:'level'}]);
  const svg=await sphereSvg(plan);
  const body=svg.match(/<polygon id="body-s1"[^>]*\/>/)[0];
  await failingAudit(plan,svg.replace(body,body.replace(/points="([\d.]+),([\d.]+)/,(all,x,y)=>`points="${Number(x)+30},${y}`)),'SOLID_BODY_FILL_MISMATCH');
  await failingAudit(plan,svg.replace(body,body.replace('data-side="BOTTOM"','data-side="TOP"')),'SOLID_BODY_FILL_MISMATCH:attributes');
  await failingAudit(plan,svg.replace(`<g data-layer="20">${body}</g>`,''),'SOLID_BODY_FILL_SET_MISMATCH');
  await failingAudit(levelPlan({kind:'CONE',radius:6,height:8},{at:'1/2'},[{radius:'bottom'},{level:'bottom'}]),svg,'SOLID_BODY_FILL_SET_MISMATCH');
  const flat=body.replace(/points="[^"]*"/,(all)=>{const pts=all.slice(8,-1).split(' ').map(p=>p.split(',').map(Number));const top=Math.min(...pts.map(p=>p[1]));return `points="${pts.map(([x,y])=>`${x},${Math.max(y,top+40)}`).join(' ')}"`;});
  await failingAudit(plan,svg.replace(body,flat),'SOLID_BODY_FILL_MISMATCH');
});
test('E28: a level fill is refused where it has no body to shade',()=>{
  const bad=(solid,section,expected)=>assert.throws(()=>solveSolidFigure(figure({unit:'cm',solids:[solid],section,dims:[{level:true}]})),code(expected),expected);
  bad({kind:'CONE',radius:4,height:6,orientation:'APEX_DOWN'},{kind:'LEVEL',at:'1/2',fill:'BOTTOM'},'SOLID_SECTION_FILL_UNSUPPORTED:APEX_DOWN');
  bad({kind:'CONE',radius:4,height:6},{kind:'LEVEL',at:'1/2',fill:'MIDDLE'},'SOLID_SECTION_FILL_INVALID');
  bad({kind:'CONE',radius:4,height:6},{kind:'AXIAL',fill:'BOTTOM'},'SOLID_SECTION_INVALID');
  bad({kind:'CONE',radius:4,height:6},{kind:'LEVEL',at:'1/2',colour:'blue'},'SOLID_SECTION_INVALID');
});

// --- E28b: the vertices of a solid with no names are written by reference (#b0, #t2, #apex, #v5) -------------------------------------------------
const bare=(over={})=>figure({unit:'cm',solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:4},height:4,names:'........'}],...over});
const segmentLines=(plan)=>solidFigureSpec(plan,solveSolidFigure(plan)).prims.filter(p=>p.role==='segment').map(p=>[p.x1,p.y1,p.x2,p.y2]);
test('E28b: a reference is the same vertex as its name; the model keys an unnamed vertex "<solid>.<slot>" and a named one by its name',()=>{
  const byName=figure({unit:'cm',solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:4},height:4,names:'ABCDEFGH'}],segments:[{from:'B',to:'E',style:'SOLID'},{from:'C',to:'H',style:'SOLID'}],dims:[{edge:'AB'}]});
  const byRef=bare({segments:[{from:'#b1',to:'#t0',style:'SOLID'},{from:'#b2',to:'#v7',style:'SOLID'}],dims:[{edge:['#b0','#b1']}]});
  assert.deepEqual(segmentLines(byRef),segmentLines(byName));
  const model=solveSolidFigure(byRef);
  assert.deepEqual(model.segments.map(s=>[s.from,s.to]),[['s1.b1','s1.t0'],['s1.b2','s1.t3']]);// #v7 is the 8th vertex: the top ring's last
  assert.deepEqual([model.dims[0].from,model.dims[0].to,model.dims[0].tex],['s1.b0','s1.b1','4\\,\\mathrm{cm}']);
  // a name and a reference may be mixed, and a named vertex written by reference keeps its name as its key
  const mixed=figure({unit:'cm',solids:[cuboid()],segments:[{from:'#b0',to:'#t2'}],dims:[{edge:['F','#b1']},{from:'#t0',to:'C'}]});// base FGHE, top BCDA
  const m=solveSolidFigure(mixed);
  assert.deepEqual(m.segments.map(s=>[s.from,s.to]),[['F','D']]);
  assert.deepEqual(m.dims.map(d=>[d.from,d.to]),[['F','G'],['B','C']]);
  // a pyramid has #b<i> and #apex (and #v<i> in model order); a frustum, like a prism, has two rings
  const pyramid=figure({unit:'cm',solids:[{kind:'PYRAMID',base:{kind:'RECT',width:4,depth:4},height:5,names:'.....'}],dims:[{edge:['#b0','#apex']},{edge:['#v4','#v1']}]});
  assert.deepEqual(solveSolidFigure(pyramid).dims.map(d=>[d.from,d.to]),[['s1.b0','s1.apex'],['s1.apex','s1.b1']]);
  const frustum=frustum5({segments:[{from:'#b0',to:'#t0',style:'AUTO'}]});
  assert.deepEqual(solveSolidFigure(frustum).segments.map(s=>[s.from,s.to]),[['s1.b0','s1.t0']]);
});
test('E28b: references name the solid when there are several, and each refusal has its own code',()=>{
  const bad=(over,expected,solids)=>assert.throws(()=>solveSolidFigure(solids?figure({unit:'cm',solids,...over}):bare(over)),code(expected),expected);
  bad({segments:[{from:'#x0',to:'#b1'}]},'SOLID_VREF_INVALID');
  bad({segments:[{from:'b0',to:'#b1x'}]},'SOLID_NAME_UNKNOWN');// a plain word is a name, and no such name exists
  bad({segments:[{from:'#b0#',to:'#b1'}]},'SOLID_VREF_INVALID');
  bad({segments:[{from:'#b4',to:'#b1'}]},'SOLID_VREF_UNKNOWN:#b4');
  bad({segments:[{from:'#t4',to:'#b1'}]},'SOLID_VREF_UNKNOWN:#t4');
  bad({segments:[{from:'#v8',to:'#b1'}]},'SOLID_VREF_UNKNOWN:#v8');
  bad({segments:[{from:'#apex',to:'#b1'}]},'SOLID_VREF_UNKNOWN:#apex');// a prism has no apex
  bad({segments:[{from:'#b1',to:'#b1'}]},'SOLID_NAME_UNKNOWN');
  bad({dims:[{edge:['#b0','#t2']}]},'SOLID_DIM_SEGMENT_NOT_DRAWN:s1.b0-s1.t2');// a face diagonal is no drawn edge
  bad({dims:[{edge:['#b0']}]},'SOLID_DIMS_INVALID');
  bad({dims:[{edge:5}]},'SOLID_DIMS_INVALID');
  bad({marks:{rightAngles:[{at:'#b0',refs:['#b1','#b1']}]}},'SOLID_MARKS_INVALID');
  bad({marks:{equalLengths:[{segments:[['#b0','#b1'],['#b0','#t0','#t1']]}]}},'SOLID_MARKS_INVALID');
  bad({marks:{rightAngles:[{at:'#b0',refs:['#b1','#b9']}]}},'SOLID_VREF_UNKNOWN:#b9');
  bad({highlights:[{polygon:['#b0','#b1','#b2','#t0']}]},'SOLID_HIGHLIGHT_NOT_PLANAR');
  bad({highlights:[{polygon:['#b0','#b1','#b2']}]},'SOLID_HIGHLIGHT_EDGE_NOT_DRAWN:s1.b2-s1.b0');
  // two polyhedra: an unprefixed reference that fits both is ambiguous; the solid id settles it, and a missing solid or a round one is refused
  const two=[{id:'s1',kind:'PRISM',base:{kind:'RECT',width:2,depth:2},height:3,names:'........'},{id:'s2',kind:'PYRAMID',base:{kind:'RECT',width:2,depth:2},height:3,names:'.....'},{id:'s3',kind:'CYLINDER',radius:1,height:2}];
  bad({segments:[{from:'#b0',to:'#b1'}]},'SOLID_VREF_AMBIGUOUS:#b0',two);
  bad({segments:[{from:'#apex',to:'#b1'}]},'SOLID_VREF_AMBIGUOUS:#b1',two);
  bad({segments:[{from:'s9#b0',to:'s1#b1'}]},'SOLID_VREF_SOLID_UNKNOWN:s9',two);
  bad({segments:[{from:'s3#b0',to:'s1#b1'}]},'SOLID_VREF_UNSUPPORTED:CYLINDER',two);
  const model=solveSolidFigure(figure({unit:'cm',solids:two,segments:[{from:'#t0',to:'s1#b1'},{from:'#apex',to:'s2#b1'}],dims:[{edge:['s1#b0','s1#b1']}]}));
  assert.deepEqual(model.segments.map(s=>[s.from,s.to]),[['s1.t0','s1.b1'],['s2.apex','s2.b1']]);// #t0 and #apex fit one solid each
  // a solid with cuts has no base ring any more: its vertices are named or nothing
  const cut=cutCube([{through:midCut}],{unit:'cm',segments:[{from:'#b0',to:'#b1'}]});
  assert.throws(()=>solveSolidFigure(cut),code('SOLID_VREF_UNKNOWN'));
  assert.throws(()=>solveSolidFigure(cutCube([{through:midCut}],{unit:'cm',segments:[{from:'s1#b0',to:'F'}]})),code('SOLID_VREF_UNSUPPORTED:CUT'));
});
test('E28b: an unnamed cube with a corner pyramid composes with every reference kind and the observer reads each back',async()=>{
  const plan=bare({
    segments:[{from:'#b1',to:'#b3',style:'AUTO',role:'REF'},{from:'#b1',to:'#t0',style:'AUTO',role:'REF'},{from:'#b3',to:'#t0',style:'AUTO',role:'REF'}],
    highlights:[{polygon:['#b0','#b1','#b3'],fill:'WARM'}],
    marks:{rightAngles:[{at:'#b0',refs:['#b1','#b3']}],equalLengths:[{count:1,segments:[['#b0','#b1'],['#b0','#b3'],['#b0','#t0']]}],angles:[{refs:['#b1','#b3','#t0'],arcs:1}]},
    dims:[{edge:['#b0','#t0'],label:'a'},{edge:['#b0','#b1'],label:'a'}]
  });
  const svg=await sphereSvg(plan);
  assert.match(svg,/<line id="segment-s1\.b1-s1\.b3" data-role="segment" data-edge="s1\.b1-s1\.b3"/);
  assert.match(svg,/id="highlight-s1\.b0-s1\.b1-s1\.b3" data-role="highlight-face" data-polygon="s1\.b0-s1\.b1-s1\.b3"/);
  assert.match(svg,/data-role="right-angle-mark" data-mark="ra1" data-at="s1\.b0" data-refs="s1\.b1-s1\.b3"/);
  assert.match(svg,/data-mark="eq1" data-edge="s1\.b0-s1\.b1" data-mark-index="1"/);
  assert.match(svg,/data-segment="s1\.b0-s1\.t0"/);
  // tampering: an end of a segment moved, a segment named after other vertices, a shaded corner moved, a right angle at another vertex
  const seg=svg.match(/<line id="segment-s1\.b1-s1\.b3"[^>]*\/>/)[0];
  await failingAudit(plan,svg.replace(seg,seg.replace(/x2="([\d.]+)"/,(all,v)=>`x2="${Number(v)+8}"`)),'SOLID_SEGMENT_ENDPOINT_OFF');
  await failingAudit(plan,svg.replace(seg,seg.replace('data-edge="s1.b1-s1.b3"','data-edge="s1.b1-s1.t3"')),'SOLID_SEGMENT_');
  const poly=svg.match(/<polygon id="highlight-s1\.b0-s1\.b1-s1\.b3"[^>]*\/>/)[0];
  await failingAudit(plan,svg.replace(poly,poly.replace(/points="([\d.]+),([\d.]+)/,(all,x,y)=>`points="${Number(x)+9},${y}`)),'SOLID_HIGHLIGHT_VERTEX_OFF');
  const ra=svg.match(/<polyline id="ra1"[^>]*\/>/)[0];
  await failingAudit(plan,svg.replace(ra,ra.replace('data-at="s1.b0"','data-at="s1.b1"')),'SOLID_RIGHT_ANGLE_MARK_OWNER');
  // the same figure against a plan that points at other vertices
  await failingAudit({...plan,segments:[{from:'#b1',to:'#b3',style:'AUTO',role:'REF'},{from:'#b2',to:'#t0',style:'AUTO',role:'REF'},{from:'#b3',to:'#t0',style:'AUTO',role:'REF'}]},svg,'SOLID_SEGMENT_');
  // the lengths are read back too: a plan that swaps two dimensioned edges of different length fails against the figure it did not make
  const box=dims=>figure({unit:'cm',solids:[{kind:'PRISM',base:{kind:'RECT',width:4,depth:3},height:2,names:'........'}],dims});
  const boxSvg=await sphereSvg(box([{edge:['#b0','#b1']},{edge:['#b1','#b2']},{edge:['#b1','#t1']}]));
  assert.match(boxSvg,/data-tex="4\\,\\mathrm\{cm\}"/);assert.match(boxSvg,/data-segment="s1\.b1-s1\.t1"/);
  await failingAudit(box([{edge:['#b0','#b1']},{edge:['#b1','#t1']},{edge:['#b1','#b2']}]),boxSvg,'SOLID_DIM_VALUE_MISMATCH');
});

// --- E28b: net face labels, right angles at net corners, circles left out of a cylinder / cone net -----------------------------------------------------
const triPrismNet=(net={},over={})=>figure({unit:'cm',net:{solid:{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[4,0],[0,3]]},height:6,names:'......'},root:'side2',
  joins:[['side2','side1'],['side1','side0'],['side1','top'],['side1','bottom']],dims:[{face:'side2',edge:0}],...net},...over});
test('E28b: net face labels write a face area exactly, a number is checked against it, a symbol is not; right angles need a true right corner',()=>{
  const m=solveSolidFigure(triPrismNet({faceLabels:[{face:'top'},{face:'bottom',text:'6'},{face:'side1',text:'S'},{face:'side0',text:'2\\pi r h'}],rightAngles:[{face:'top',corner:0},{face:'bottom',corner:2}]}));
  assert.deepEqual(m.faceLabels.map(f=>[f.face,f.tex,f.numeric]),[['top','6\\,\\mathrm{cm}^2',true],['bottom','6\\,\\mathrm{cm}^2',true],['side1','S',false],['side0','2\\pi r h',false]]);
  assert.deepEqual(m.rightAngles,[{face:'top',corner:0},{face:'bottom',corner:2}]);
  assert.equal(labelNumber('6\\,\\mathrm{cm}^2'),6);assert.ok(Math.abs(labelNumber('48\\pi\\,\\mathrm{cm}^2')-48*Math.PI)<1e-9);
  // a net with no dims and no names is readable text when it carries face labels; without them it is refused
  assert.throws(()=>solveSolidFigure(figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6}})),code('SOLID_FIGURE_NEEDS_A_LABEL'));
  assert.equal(solveSolidFigure(figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6,faceLabels:[{face:'rect'}]}})).faceLabels[0].tex,'48\\pi\\,\\mathrm{cm}^2');
  assert.equal(solveSolidFigure(figure({unit:'cm',net:{kind:'CONE',radius:3,slant:5,faceLabels:[{face:'sector'},{face:'base',text:'9\\pi'}]}})).faceLabels.map(f=>f.tex).join('|'),'15\\pi\\,\\mathrm{cm}^2|9\\pi\\,\\mathrm{cm}^2');
  // the plan without the new fields has none of them in its model
  assert.deepEqual(['faceLabels','rightAngles','excluded'].map(k=>k in solveSolidFigure(triPrismNet())),[false,false,false]);
});
test('E28b: net face labels, right angles and excluded circles are refused with explicit codes',()=>{
  const bad=(net,expected,over)=>assert.throws(()=>solveSolidFigure(triPrismNet(net,over)),code(expected),expected);
  bad({faceLabels:'top'},'SOLID_FACE_LABEL_INVALID');
  bad({faceLabels:[]},'SOLID_FACE_LABEL_INVALID');
  bad({faceLabels:[{face:'top',tone:'x'}]},'SOLID_FACE_LABEL_INVALID');
  bad({faceLabels:[{face:3}]},'SOLID_FACE_LABEL_INVALID');
  bad({faceLabels:[{face:'top'},{face:'top'}]},'SOLID_FACE_LABEL_INVALID');
  bad({faceLabels:[{face:'nope'}]},'SOLID_NET_FACE_UNKNOWN');
  bad({faceLabels:[{face:'top',text:'7'}]},'SOLID_FACE_LABEL_VALUE_MISMATCH:f1');
  bad({faceLabels:[{face:'top',text:'6 cm²'}]},'SOLID_FACE_LABEL_INVALID:f1');
  bad({faceLabels:[{face:'top',text:5}]},'SOLID_FACE_LABEL_INVALID:f1');
  bad({solid:{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[2,0],[0,Math.E]]},height:6,names:'......'},dims:[{face:'side2',edge:0,label:'a'}],faceLabels:[{face:'top'}]},'SOLID_FACE_LABEL_NOT_EXPRESSIBLE:f1');// an area with no short exact form
  bad({rightAngles:[]},'SOLID_NET_RIGHT_ANGLE_INVALID');
  bad({rightAngles:[{face:'top',corner:3}]},'SOLID_NET_RIGHT_ANGLE_INVALID');
  bad({rightAngles:[{face:'top',corner:0.5}]},'SOLID_NET_RIGHT_ANGLE_INVALID');
  bad({rightAngles:[{face:'top',corner:0},{face:'top',corner:0}]},'SOLID_NET_RIGHT_ANGLE_INVALID');
  bad({rightAngles:[{face:'top',corner:0,size:2}]},'SOLID_NET_RIGHT_ANGLE_INVALID');
  bad({rightAngles:[{face:'nope',corner:0}]},'SOLID_NET_FACE_UNKNOWN');
  bad({rightAngles:[{face:'top',corner:1}]},'SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:top:1:right_at=0');// the message names the corner that is right
  bad({rightAngles:[{face:'bottom',corner:0}]},'SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:bottom:0:right_at=2');
  bad({excluded:['bottom']},'SOLID_NET_EXCLUDED_UNSUPPORTED:POLYHEDRON');
  const round=(net,expected)=>assert.throws(()=>solveSolidFigure(figure({unit:'cm',net:{...net}})),code(expected),expected);
  round({kind:'CYLINDER',radius:4,height:6,excluded:['rect'],faceLabels:[{face:'rect'}]},'SOLID_NET_EXCLUDED_INVALID');
  round({kind:'CYLINDER',radius:4,height:6,excluded:['top','top'],faceLabels:[{face:'rect'}]},'SOLID_NET_EXCLUDED_INVALID');
  round({kind:'CYLINDER',radius:4,height:6,excluded:[],faceLabels:[{face:'rect'}]},'SOLID_NET_EXCLUDED_INVALID');
  round({kind:'CONE',radius:3,slant:5,excluded:['bottom'],faceLabels:[{face:'sector'}]},'SOLID_NET_EXCLUDED_INVALID');
  round({kind:'CYLINDER',radius:4,height:6,rightAngles:[{face:'rect',corner:0}],faceLabels:[{face:'rect'}]},'SOLID_NET_RIGHT_ANGLE_UNSUPPORTED:CYLINDER');
  round({kind:'CYLINDER',radius:4,height:6,faceLabels:[{face:'side0'}]},'SOLID_NET_FACE_UNKNOWN');
  round({kind:'CONE',radius:3,slant:5,faceLabels:[{face:'rect'}]},'SOLID_NET_FACE_UNKNOWN');
});
const textOf=(svg,id)=>svg.match(new RegExp(`<g data-layer="90"><g id="${id}"[^>]*>`))[0];
test('E28b: a prism net with face areas and right-angle squares composes, and the observer reads each label and square back',async()=>{
  const plan=triPrismNet({highlights:[{face:'top'},{face:'bottom'}],faceLabels:[{face:'top'},{face:'bottom',text:'6'},{face:'side1',text:'S'}],rightAngles:[{face:'top',corner:0},{face:'bottom',corner:2}]});
  const svg=await sphereSvg(plan);
  assert.equal((svg.match(/data-label-role="face-label"/g)??[]).length,3);
  assert.match(svg,/<g id="face-label-top" data-label-kind="AREA_LABEL" data-label-role="face-label"/);
  assert.match(svg,/data-face-of="bottom" data-tex="6\\,\\mathrm\{cm\}\^2"/);
  assert.match(svg,/<polyline id="net-ra-top-0" data-role="net-right-angle" data-face="top" data-corner="0" stroke="#111"/);
  // tampering: a number that is not the area, a label moved out of its face, a missing label, a square moved, wrongly placed, missing or extra
  const top=textOf(svg,'face-label-top');
  await failingAudit(plan,svg.replace(top,top.replace('data-tex="6\\,\\mathrm{cm}^2"','data-tex="7\\,\\mathrm{cm}^2"')),'SOLID_FACE_LABEL_VALUE_MISMATCH');
  await failingAudit(plan,svg.replace(top,top.replace('data-tex="6\\,\\mathrm{cm}^2"','data-tex="6"')),'SOLID_FACE_LABEL_UNIT_MISSING');
  await failingAudit(plan,svg.replace(top,top.replace(/translate\(([\d.]+) ([\d.]+)\)/,(all,x,y)=>`translate(${Number(x)+110} ${y})`)),'SOLID_FACE_LABEL_OUTSIDE_FACE');
  const side=textOf(svg,'face-label-side1');
  await failingAudit(plan,svg.replace(side,'<g data-layer="90"><g id="face-label-side1x" data-label-role="face-label" data-face-of="side1x">'),'SOLID_FACE_LABEL_');
  await failingAudit(triPrismNet({highlights:[{face:'top'},{face:'bottom'}],faceLabels:[{face:'top'},{face:'bottom',text:'6'}],rightAngles:[{face:'top',corner:0},{face:'bottom',corner:2}]}),svg,'SOLID_FACE_LABEL_SET_MISMATCH');
  const ra=svg.match(/<polyline id="net-ra-top-0"[^>]*\/>/)[0];
  await failingAudit(plan,svg.replace(ra,ra.replace(/points="([\d.]+),([\d.]+) ([\d.]+),([\d.]+)/,(all,a,b,c,d)=>`points="${a},${b} ${Number(c)+5},${Number(d)+3}`)),'SOLID_NET_RIGHT_ANGLE_GEOMETRY');
  await failingAudit(plan,svg.replace(ra,ra.replace('data-corner="0"','data-corner="1"')),'SOLID_NET_RIGHT_ANGLE_');
  await failingAudit(plan,svg.replace(`<g data-layer="55">${ra}</g>`,''),'SOLID_NET_RIGHT_ANGLE_SET_MISMATCH');
  await failingAudit(triPrismNet({highlights:[{face:'top'},{face:'bottom'}],faceLabels:[{face:'top'},{face:'bottom',text:'6'},{face:'side1',text:'S'}],rightAngles:[{face:'top',corner:0}]}),svg,'SOLID_NET_RIGHT_ANGLE_SET_MISMATCH');
  // the observer re-derives the right corner from the 3D solid: a plan that names a corner that is no right angle fails against this figure
  await failingAudit(triPrismNet({highlights:[{face:'top'},{face:'bottom'}],faceLabels:[{face:'top'},{face:'bottom',text:'6'},{face:'side1',text:'S'}],rightAngles:[{face:'top',corner:1},{face:'bottom',corner:2}]}),svg,'SOLID_NET_RIGHT_ANGLE_NOT_RIGHT:top:1');
});
test('E28b: a cylinder net and a cone net leave out the circles that are not part of the surface; face labels sit inside their faces',async()=>{
  const cyl=figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6,dims:[{part:'rect-width',label:'8\\pi'},{part:'rect-height'}],excluded:['bottom','top'],faceLabels:[{face:'rect',text:'S'}]}});
  const svg=await sphereSvg(cyl);
  assert.equal((svg.match(/data-excluded="1"/g)??[]).length,2);
  assert.match(svg,/<circle id="net-circle-top" data-role="net-circle" data-part="top" data-excluded="1" fill="#fff" stroke="#888" stroke-width="1.6" stroke-dasharray="5 4"/);
  const one=figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6,dims:[{part:'rect-width',label:'8\\pi'},{part:'rect-height'}],excluded:['top'],faceLabels:[{face:'rect',text:'S'},{face:'bottom'}]}});
  const oneSvg=await sphereSvg(one);
  assert.equal((oneSvg.match(/data-excluded="1"/g)??[]).length,1);
  assert.match(oneSvg,/<circle id="net-circle-bottom" data-role="net-circle" data-part="bottom" fill="#f4f6fa" stroke="#111"/);
  assert.match(oneSvg,/data-face-of="bottom" data-tex="16\\pi\\,\\mathrm\{cm\}\^2"/);
  // a net without the field keeps its bytes: plain circles, no data-excluded
  const plainSvg=await sphereSvg(figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6,dims:[{part:'rect-height'}]}}));
  assert.doesNotMatch(plainSvg,/data-excluded|#888|data-face-of/);
  // tampering: a circle drawn solid again, a circle dashed that the plan keeps, a face label moved into the neighbouring circle
  const circle=svg.match(/<circle id="net-circle-top"[^>]*\/>/)[0];
  await failingAudit(cyl,svg.replace(circle,circle.replace(' stroke-dasharray="5 4"','')),'SOLID_NET_EXCLUDED_STYLE_MISMATCH:top');
  await failingAudit(cyl,svg.replace(circle,circle.replace(' data-excluded="1"','')),'SOLID_NET_EXCLUDED_SET_MISMATCH:top');
  await failingAudit(figure({unit:'cm',net:{kind:'CYLINDER',radius:4,height:6,dims:[{part:'rect-width',label:'8\\pi'},{part:'rect-height'}],excluded:['bottom'],faceLabels:[{face:'rect',text:'S'}]}}),svg,'SOLID_NET_EXCLUDED_SET_MISMATCH');
  const label=textOf(svg,'face-label-rect');
  await failingAudit(cyl,svg.replace(label,label.replace(/translate\(([\d.]+) ([\d.]+)\)/,(all,x,y)=>`translate(${x} ${Number(y)-95})`)),'SOLID_FACE_LABEL_OUTSIDE_FACE');
  // a cone: the base is left out, both faces are labelled (the sector area is exact: pi r l)
  const cone=figure({unit:'cm',net:{kind:'CONE',radius:3,slant:5,dims:[{part:'slant'},{part:'radius'}],excluded:['base'],faceLabels:[{face:'sector'},{face:'base',text:'\\pi r^2'}]}});
  const coneSvg=await sphereSvg(cone);
  assert.match(coneSvg,/data-part="base" data-excluded="1"/);assert.match(coneSvg,/data-face-of="sector" data-tex="15\\pi\\,\\mathrm\{cm\}\^2"/);
  const baseCircle=coneSvg.match(/<circle id="net-circle-base"[^>]*\/>/)[0];
  await failingAudit(cone,coneSvg.replace(baseCircle,baseCircle.replace('stroke="#888"','stroke="#111"')),'SOLID_NET_EXCLUDED_STYLE_MISMATCH:base');
  const sector=textOf(coneSvg,'face-label-sector');
  await failingAudit(cone,coneSvg.replace(sector,sector.replace('data-tex="15\\pi\\,\\mathrm{cm}^2"','data-tex="16\\pi\\,\\mathrm{cm}^2"')),'SOLID_FACE_LABEL_VALUE_MISMATCH');
});
