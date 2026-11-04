// ROOT runs serially; the prism regression uses real observer/browser workers.
import test from 'node:test';
import assert from 'node:assert/strict';
import {calloutEntries,calloutSpec} from '../production/plane-callouts.mjs';
import {solveSolidFigure,solidFigureSpec,composeSolidFigurePanel} from '../production/solid-figure-v1.mjs';
import {assetIdentity} from '../production/contracts.mjs';
const points={G:{approximation:[1,5]},T:{approximation:[1,0]}};
const bounds={xMin:0,xMax:6,yMin:0,yMax:15};
const mixed=(extra={})=>({mathPlan:{realization:{recipeId:'PLANE_FIGURE_v1'},nodes:[{id:'G'},{id:'T'}]},hiddenPointNames:['T'],planeMarks:{callouts:[{id:'height',kind:'SEGMENT',path:['G','T'],link:'ENDS',nameMode:'SOURCE',...extra}]}});
test('SOURCE callout preserves named endpoint, unnamed foot, and mandatory owner links',()=>{
  const plan=mixed(),entries=calloutEntries(plan,points,bounds,new Set(['T']));
  const built=calloutSpec(plan,{},entries,{tex:id=>id});
  assert.equal(built.objects.find(o=>o.id==='height__G').name,'G');
  assert.equal(built.objects.find(o=>o.id==='height__T').name,null);
  assert.equal(entries[0].guides.length,2);
  assert.equal(built.factRolesByLabel['height__T-name'],undefined);
  assert.throws(()=>calloutEntries(mixed({link:'NONE'}),points,bounds,new Set(['T'])),/CALLOUT_UNNAMED_NEEDS_LINK/);
  assert.throws(()=>calloutEntries({...plan,hiddenPointStyle:'NONE'},points,bounds,new Set(['T'])),/CALLOUT_SOURCE_POINT_UNDRAWN/);
  assert.throws(()=>calloutEntries(mixed({nameMode:'HIDDEN'}),points,bounds,new Set(['T'])),/CALLOUT_UNNAMED_POINT_HAS_NAME/);
  const legacy=mixed();delete legacy.planeMarks.callouts[0].nameMode;
  assert.throws(()=>calloutEntries(legacy,points,bounds,new Set(['T'])),/CALLOUT_POINT_HIDDEN/);
});
const prism=(placement)=>({capability:'solid-figure-v1',unit:'cm',solids:[{kind:'PRISM',base:{kind:'POLYGON',points:[[0,0],[1.5,1.5*Math.sqrt(3)],[0,5]]},height:6,names:'D′E′F′A′B′C′'}],dims:[{from:'A′',to:'D′',label:'6'},{from:'A′',to:'C′',label:'5'}],marks:{angles:[{id:'angleA',refs:['B′','A′','C′'],arcs:1,label:'30^\\circ',value:30,...(placement?{labelPlacement:placement}:{})}]},segments:[{from:'A′',to:'D′',style:'AUTO',role:'ACCENT'},{from:'A′',to:'C′',style:'AUTO',role:'REF'}],caption:'삼각기둥의 대응하는 변과 각',sourceConditions:[{id:'c1',condition:'30°',mappedTo:'solids'}],newVisualInformation:['대응변']});
test('WEDGE leaves geometry and default label specification unchanged',()=>{
  const old=prism(),opt=prism('WEDGE');
  const a=solidFigureSpec(old,solveSolidFigure(old)),b=solidFigureSpec(opt,solveSolidFigure(opt));
  assert.deepEqual(a.prims,b.prims);
  assert.equal(a.labels.find(l=>l.role==='angle-label').wedge,undefined);
  assert.equal(b.labels.find(l=>l.role==='angle-label').wedge,true);
  assert.throws(()=>solveSolidFigure(prism('FREE')),/SOLID_MARK_ANGLE_LABEL_PLACEMENT_INVALID/);
});
test('exact 30° prism WEDGE passes independent solid observer and actual layout',async()=>{
  const plan=prism('WEDGE');
  const rendered=await composeSolidFigurePanel({plan,model:solveSolidFigure(plan),identity:assetIdentity('engine-close|1','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:20,displayScale:1,fontFloorCssPx:11}});
  assert.equal(rendered.status,'COMPOSED',JSON.stringify(rendered.detail));
  assert.equal(rendered.staticAudit.status,'PASS');
  assert.equal(rendered.renderedLayout.status,'PASS');
});
