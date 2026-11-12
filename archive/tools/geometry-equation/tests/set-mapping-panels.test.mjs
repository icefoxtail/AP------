// 대응도(MAPPING) panels in a composite, the four-column mapping (three functions), and the Venn complement shade whose joining line missed no label.
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,setDiagramSpec,routeShadeJumps,composeSetDiagramFigure,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {compositePanels,compositePanelLayout,composeCompositeCandidate,compositeStackSize} from '../production/composite-candidate-svg-v1.mjs';

const arrow=(a,b,c=0)=>({from:{column:c,element:a},to:{column:c+1,element:b}});
const mapPlan=(X,Y,arrows,highlight)=>({capability:FIGURE_CAPABILITY,diagram:{kind:'MAPPING',columns:[{id:'X',name:'X',elements:X},{id:'Y',name:'Y',elements:Y}],arrows,...(highlight?{highlight}:{})}});
const mapPanel=(caption,...args)=>({caption:{text:caption},plan:mapPlan(...args)});
const vennPanel=(shade,caption)=>({caption:{text:caption},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],shade}}});
const composite=(panels,extra={})=>({capability:'composite-panels-v1',panels,caption:'대응도 여러 개',...extra});
const five=[
  mapPanel('도식 1',['1','2','3'],['4','5','6'],[arrow(0,0),arrow(1,0),arrow(1,1),arrow(2,2)],{elements:[{column:0,element:1}]}),
  mapPanel('도식 2',['1','3','5','7'],['1','2'],[arrow(0,0),arrow(1,0),arrow(3,1)],{elements:[{column:0,element:2}]}),
  mapPanel('도식 3',['-1','0','1'],['1','3','5','7'],[arrow(0,0),arrow(1,2),arrow(2,3)]),
  mapPanel('도식 4',['1','2','3','4'],['2','4','6','8'],[arrow(0,0),arrow(0,1),arrow(1,2),arrow(2,3)],{elements:[{column:0,element:0},{column:0,element:3}]}),
  mapPanel('도식 5',['1','2','3','4','5'],['-1','0','1'],[arrow(0,0),arrow(2,1),arrow(4,2)],{elements:[{column:0,element:1},{column:0,element:3}]})];
const threeColumn={capability:FIGURE_CAPABILITY,diagram:{kind:'MAPPING',columns:[{id:'X',elements:['1','2']},{id:'Y',elements:['a','b']},{id:'Z',elements:['p','q']}],arrows:[arrow(0,0),arrow(1,1,1)]}};
const fourColumn={capability:FIGURE_CAPABILITY,diagram:{kind:'MAPPING',
  columns:[{id:'X',elements:['1','2','3']},{id:'Y',elements:['a','b','c']},{id:'Z',elements:['4','5','6']},{id:'W',elements:['7','8','9']}],
  arrows:[arrow(0,1),arrow(1,2),arrow(2,0),arrow(0,0,1),arrow(1,2,1),arrow(2,1,1),arrow(0,2,2),arrow(1,0,2),arrow(2,1,2)],
  arrowGroups:[{name:'f',from:'X',to:'Y',color:'BLUE'},{name:'g',from:'Y',to:'Z',color:'WARM'},{name:'h',from:'Z',to:'W',color:'GREEN'}]}};

test('mapping panels are accepted in a composite: two-column ones in the grid, three-column ones only with columns:1, never a table',()=>{
  const checked=compositePanels(composite(five));
  assert.equal(checked.length,5);
  const layout=compositePanelLayout(checked);
  assert.deepEqual([layout.kind,layout.columns,layout.rows],['GRID',2,3]);
  // mapping and Venn panels share the set grid
  assert.equal(compositePanels(composite([five[0],vennPanel('B','B')])).length,2);
  const stop=(panels,extra,code)=>assert.throws(()=>compositePanels(composite(panels,extra)),error=>error.message===code,code);
  stop([five[0],{caption:{text:'3열'},plan:threeColumn}],{},'PANEL_1:SET_PANEL_MAPPING_COLUMNS_UNSUPPORTED');
  assert.equal(compositePanels(composite([five[0],{caption:{text:'3열'},plan:threeColumn}],{columns:1})).length,2);
  stop([five[0],{caption:{text:'표'},plan:{capability:FIGURE_CAPABILITY,diagram:{kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:['A']}]}}}],{},'PANEL_1:SET_PANEL_KIND_UNSUPPORTED');
  // a panel is only capability+diagram; an error inside the mapping is named with its panel
  assert.throws(()=>compositePanels(composite([five[0],{caption:{text:'x'},plan:{...five[1].plan,caption:'c'}}])),error=>error.message==='PANEL_1:SET_PANEL_PLAN_INVALID');
  assert.throws(()=>compositePanels(composite([five[0],mapPanel('x',['1'],['a'],[arrow(0,0),arrow(0,0)])])),error=>error.message==='PANEL_1:MAPPING_ARROW_DUPLICATE');
});

test('a compact two-column mapping fits the grid; standalone mappings keep their sizes; four columns are 816 wide',()=>{
  const two=solveDiagram(five[0].plan.diagram);
  assert.ok(setDiagramSize(two,{compact:true}).width<=420);
  assert.equal(setDiagramSize(two).width,460);
  assert.equal(setDiagramSize(two,{compact:false}).width,460);
  const three=solveDiagram(threeColumn.diagram);
  assert.equal(setDiagramSize(three).width,660);assert.equal(setDiagramSize(three,{compact:true}).width,660);
  assert.equal(setDiagramSize(solveDiagram(fourColumn.diagram)).width,816);
  const checked=compositePanels(composite(five)),sizes=checked.map(item=>setDiagramSize(solveDiagram(item.plan.diagram),{compact:true}));
  assert.ok(compositeStackSize(sizes,0,compositePanelLayout(checked)).width<=848);
  assert.throws(()=>solveDiagram({...fourColumn.diagram,columns:[...fourColumn.diagram.columns,{id:'V',elements:['r']}]}),error=>error.message==='MAPPING_COLUMN_COUNT_UNSUPPORTED');
});

test('routeShadeJumps moves the loop starts only when the unseen joining line crosses a label',()=>{
  const plan={capability:FIGURE_CAPABILITY,diagram:{kind:'VENN',sets:[{id:'A'},{id:'B'}],shade:'B^c'}};
  const model=solveDiagram(plan.diagram),spec=setDiagramSpec(plan,model,{compact:true});
  const before=spec.prims.find(prim=>prim.id==='shade-0').d;
  assert.ok((before.match(/M /g)||[]).length>=2,'the complement is an outer loop with a hole');
  // no label near the joining line: the path keeps its bytes
  routeShadeJumps(spec,[{box:{x:0,y:0,width:2,height:2}}]);
  assert.equal(spec.prims.find(prim=>prim.id==='shade-0').d,before);
  // a label on the line from the outer start to the hole start: the loops start elsewhere, and the new joining line misses the label
  const starts=d=>d.split(/ ?M /).filter(Boolean).map(loop=>loop.split(' L ')[0].split(' ').map(Number));
  const [a,b]=starts(before),box={x:(a[0]+b[0])/2-8,y:(a[1]+b[1])/2-8,width:16,height:16};
  routeShadeJumps(spec,[{box}]);
  const after=spec.prims.find(prim=>prim.id==='shade-0').d;
  assert.notEqual(after,before);
  const [a2,b2]=starts(after);
  const hit=(p,q)=>{for(let t=0;t<=1;t+=0.005){const x=p[0]+(q[0]-p[0])*t,y=p[1]+(q[1]-p[1])*t;if(x>=box.x-2&&x<=box.x+box.width+2&&y>=box.y-2&&y<=box.y+box.height+2)return true;}return false;};
  assert.equal(hit(a,b),true);assert.equal(hit(a2,b2),false);
  // the same cells are drawn: each loop holds the same points, only the start moves
  const sorted=d=>d.split(/ ?M /).filter(Boolean).map(loop=>loop.replace(/ Z.*/,'').split(' L ').sort().join('|')).join('/');
  assert.equal(sorted(after),sorted(before));
});

test('five mapping panels and a Venn complement pair compose; the mapping and the shade pass the set observer',async()=>{
  const browser=await launchBrowser();
  try{
    const run=async(panelPlans,extra={})=>{
      const plan=composite(panelPlans,extra),checked=compositePanels(plan);
      const panels=checked.map(item=>({plan:item.plan,model:solveDiagram(item.plan.diagram)}));
      const {width}=compositeStackSize(panels.map(panel=>setDiagramSize(panel.model,{compact:true})),0,compositePanelLayout(checked,plan));
      return composeCompositeCandidate({plan:{...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,
        identity:assetIdentity('22_테스트|1','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/width),fontFloorCssPx:11},browser});
    };
    const maps=await run(five);
    assert.equal(maps.status,'COMPOSED',JSON.stringify(maps.detail));
    assert.equal(maps.panels.length,5);
    assert.ok(maps.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
    const venn=await run([vennPanel('B','첫 괄호'),vennPanel('B^c','둘째 괄호')]);
    assert.equal(venn.status,'COMPOSED',JSON.stringify(venn.detail));
    assert.ok(venn.panels.every(item=>item.staticAudit.status==='PASS'&&item.renderedLayout.status==='PASS'));
    const mixed=await run([five[0],vennPanel('B^c','여집합')]);
    assert.equal(mixed.status,'COMPOSED',JSON.stringify(mixed.detail));
    // three functions in one four-column figure
    const one=await composeSetDiagramFigure({plan:fourColumn,model:solveDiagram(fourColumn.diagram),identity:assetIdentity('22_테스트|2','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:{baseFontPx:32,displayScale:Math.min(1,320/816),fontFloorCssPx:11},browser});
    assert.equal(one.status,'COMPOSED',JSON.stringify(one.detail));
    assert.equal(one.staticAudit.status,'PASS');
  }finally{await browser.close();}
});
