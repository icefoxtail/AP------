// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,setDiagramSpec,composeSetDiagramFigure,checkSetDiagramPlan,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';
import {assertAccessibleNames} from './accessible-names.mjs';

const observer=fileURLToPath(new URL('../production/set-diagram-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(diagram,expected)=>assert.throws(()=>solveDiagram(diagram),code(expected),expected);
const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
// 23 강남여고 2학기 중간 중1 2: counts 9/9/10/12, shaded (A∩B)∪(A∪B)ᶜ
const venn2={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'9',in:['A']},{text:'9',in:['A','B']},{text:'10',in:['B']},{text:'12',in:[]}],shade:'(A∩B)∪(A∪B)ᶜ'};
// 24 금당고 2학기 중간 중1 11: B ⊂ A
const subset={kind:'VENN',sets:[{id:'A'},{id:'B'}],subset:['B','A'],shade:'B'};
// a three-set region with its elements in A∩B and outside
const venn3={kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],elements:[{text:'1',in:['A','B']},{text:'2',in:[]}],shade:'A∪B'};
// 19 매산여고 1학기 기말 고2 확률과통계 5: four events over {1,...,6}, shown as an explicit membership table
const table4={kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'},{id:'C'},{id:'D'}],
  elements:[{text:'1',in:['A','D']},{text:'2',in:['B','D']},{text:'3',in:['A','B','C']},{text:'4',in:['D']},{text:'5',in:['A','B']},{text:'6',in:['C']}]};
// 23 강남여고 2학기 중간 중1 7: 1→b, 2→b, 3→c
const map2={kind:'MAPPING',columns:[{id:'X',elements:['1','2','3']},{id:'Y',elements:['a','b','c']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:1}},{from:{column:0,element:1},to:{column:1,element:1}},{from:{column:0,element:2},to:{column:1,element:2}}],
  highlight:{arrows:[0],elements:[{column:1,element:0}]}};
// X→Y→Z with a dashed composite arrow
const map3={kind:'MAPPING',columns:[{id:'X',elements:['1','2','3']},{id:'Y',elements:['4','5','6']},{id:'Z',elements:['7','8','9']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:2}},{from:{column:1,element:2},to:{column:2,element:0},style:'DASHED'},
    {from:{column:0,element:2},to:{column:1,element:0}},{from:{column:1,element:0},to:{column:2,element:2}}]};
// 23 강남여고 2학기 중간 중1 9: f and its reverse g between the same two sets
const mapback={kind:'MAPPING',columns:[{id:'X',elements:['1','2','3','4']},{id:'Y',elements:['3','4','5','6']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:2}},{from:{column:0,element:1},to:{column:1,element:1}},
    {from:{column:0,element:2},to:{column:1,element:3}},{from:{column:0,element:3},to:{column:1,element:0}},
    {from:{column:1,element:0},to:{column:0,element:0},style:'DASHED'},{from:{column:1,element:1},to:{column:0,element:3},style:'DASHED'},
    {from:{column:1,element:2},to:{column:0,element:1},style:'DASHED'},{from:{column:1,element:3},to:{column:0,element:2},style:'DASHED'}]};
// G17: signed numbers, a fraction and a root as mapping elements (25 금당고 고1 q6 kind of figure): -2 is typed with a hyphen and shown with the real minus
const mapSigned={kind:'MAPPING',columns:[{id:'X',elements:['-2','-1','0','1/2','√2']},{id:'Y',elements:['-4','-1','1','2√3']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:0}},{from:{column:0,element:1},to:{column:1,element:1}},{from:{column:0,element:2},to:{column:1,element:2}},
    {from:{column:0,element:3},to:{column:1,element:2}},{from:{column:0,element:4},to:{column:1,element:3}}]};
// G17: columns of different lengths (24 매산여고 고1 q21: X has 5 elements, Y has 8), and X→Y→Z with 2, 4 and 3 elements
const mapUneven={kind:'MAPPING',columns:[{id:'X',elements:['1','2','3','4','5']},{id:'Y',elements:['2','3','4','5','6','7','8','9']}],
  arrows:[0,1,2,3,4].map(k=>({from:{column:0,element:k},to:{column:1,element:7-k}})),highlight:{arrows:[2]}};
const mapUneven3={kind:'MAPPING',columns:[{id:'X',elements:['1','2']},{id:'Y',elements:['a','b','c','d']},{id:'Z',elements:['p','q','r']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:3}},{from:{column:0,element:1},to:{column:1,element:0}},{from:{column:1,element:3},to:{column:2,element:0}},{from:{column:1,element:0},to:{column:2,element:2}}]};
// G17: f∘g (25 순천여고 고1 q9 kind of figure): g and f named above their arrows in two colours, the path 3→1→4 heavy in a third
const mapFG={kind:'MAPPING',columns:[{id:'X',name:'X',elements:['1','2','3','4']},{id:'Y',name:'X',elements:['1','2','3','4']},{id:'Z',name:'X',elements:['1','2','3','4']}],
  arrows:[[0,0,1,2],[0,1,1,0],[0,2,1,0],[0,3,1,3],[1,0,2,3],[1,1,2,1],[1,2,2,2],[1,3,2,0]].map(([a,b,c,d])=>({from:{column:a,element:b},to:{column:c,element:d}})),
  arrowGroups:[{name:'g',from:'X',to:'Y',color:'BLUE'},{name:'f',from:'Y',to:'Z',color:'WARM'}],
  highlightPaths:[{path:['3','1','4'],color:'GREEN'},{path:['4','1'],startColumn:1,color:'VIOLET'}]};
// G17: sets drawn apart (25 금당고 고1 q21; 26 매산여고 고1 q13: A∩B=∅ among three sets) and the chain A⊂B⊂C of three sets (25 금당고 고1 q11)
const disjoint2={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:['A']},{text:'2',in:['A']},{text:'3',in:['B']},{text:'4',in:['B']}],disjoint:[['A','B']]};
const disjoint3={kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],elements:[{text:'x',in:['B']},{text:'y',in:['A','C']}],shade:'(A∪C)∩(B∪C)',disjoint:[['A','B']]};
const chain3={kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],elements:[{text:'1',in:['A','B','C']},{text:'2',in:['B','C']},{text:'3',in:['C']},{text:'4',in:[]}],subset:['A','B','C'],shade:'B-A'};

test('frameless Venn refuses outside information and preserves the default frame',()=>{
  const diagram={kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],shade:'A∪B'};
  const framed=setDiagramSpec(plan(diagram),solveDiagram(diagram));
  assert.deepEqual(framed,setDiagramSpec(plan({...diagram,showUniverse:true}),solveDiagram({...diagram,showUniverse:true})));
  const hide={...diagram,showUniverse:false};
  const plain=setDiagramSpec(plan(hide),solveDiagram(hide));
  assert.deepEqual(plain.prims,framed.prims.filter(prim=>prim.role!=='universal'));
  assert.deepEqual(plain.labels,framed.labels.filter(label=>label.role!=='universal-name'));
  refuse({...hide,showUniverse:'false'},'SET_SHOW_UNIVERSE_INVALID');
  refuse({...hide,universe:{name:'U'}},'SET_HIDDEN_UNIVERSE_DECLARED');
  refuse({...hide,elements:[{text:'5',in:[]}]},'SET_HIDDEN_UNIVERSE_OUTSIDE_ELEMENT');
  refuse({...hide,shade:'(A∪B∪C)^c'},'SET_HIDDEN_UNIVERSE_OUTSIDE_SHADE');
  assert.doesNotThrow(()=>solveDiagram({...hide,shade:'A∩(B^c)'}),'a complement can be used within a set');
});

test('the engine derives every atomic region and the truth of the set expression itself',()=>{
  const m=solveDiagram(venn2);
  assert.deepEqual(m.cells.map(c=>[c.region,c.shade,c.elements]),[['OUTSIDE',true,[3]],['A',false,[0]],['B',false,[2]],['A∩B',true,[1]]]);
  assert.deepEqual(m.elements.map(e=>[e.text,e.in,e.cell]),[['9',['A'],1],['9',['A','B'],3],['10',['B'],2],['12',[],0]]);
  assert.deepEqual(solveDiagram({...venn2,shade:'A-B'}).shade.cells,[1]);
  assert.deepEqual(solveDiagram({...venn2,shade:'(A∪B)^c'}).shade.cells,[0]);
  const s=solveDiagram(subset);
  assert.equal(s.layout,'SUBSET');assert.deepEqual(s.cells.map(c=>c.region),['OUTSIDE','A','B','A∩B']);
  assert.equal(s.cells[2].elements.length,0);
  assert.deepEqual(solveDiagram({...subset,shade:'B'}).shade.cells,[2,3]);
  const map=solveDiagram(mapback);
  assert.equal(map.isFunction,true);assert.equal(map.arrows[4].style,'DASHED');
  assert.equal(solveDiagram({...map2,arrows:[...map2.arrows,{from:{column:0,element:0},to:{column:1,element:2}}]}).isFunction,false);
  const signed=solveDiagram(mapSigned);
  assert.deepEqual(signed.columns[0].elements.map(e=>[e.text,e.math,e.tex??null]),[['\u22122',true,'-2'],['\u22121',true,'-1'],['0',true,null],['1/2',true,'1/2'],['\u221a2',true,'\\sqrt{2}']]);
  assert.deepEqual(solveDiagram({...mapSigned,columns:[{id:'X',elements:['12','가나']},{id:'Y',elements:['ab']}],arrows:[{from:{column:0,element:0},to:{column:1,element:0}}]}).columns[0].elements.map(e=>e.math),[true,false]);   // EXT-20261109-c: 12 has no Korean letters so it is math like -2 and 0; 가나 stays text
  const uneven=solveDiagram(mapUneven),layout=setDiagramSpec(plan(mapUneven),uneven).layout;
  assert.deepEqual(setDiagramSize(uneven),{width:460,height:50+8*34+44+24});
  assert.equal(layout.columns[0].ry,layout.columns[1].ry);assert.equal(layout.columns[0].cy,layout.columns[1].cy);
  // equal columns keep their old element rows exactly
  assert.deepEqual(setDiagramSpec(plan(map2),solveDiagram(map2)).labels.filter(l=>l.role==='element'&&l.extra.column===0).map(l=>l.anchor.y),[89,123,157]);
  const fg=solveDiagram(mapFG);
  assert.deepEqual(fg.arrowGroups.map(g=>[g.name,g.from,g.to,g.color,g.arrows]),[['g',0,1,'BLUE',[0,1,2,3]],['f',1,2,'WARM',[4,5,6,7]]]);
  assert.deepEqual(fg.highlightPaths.map(p=>[p.cells,p.arrows,p.color]),[[[{column:0,element:2},{column:1,element:0},{column:2,element:3}],[2,4],'GREEN'],[[{column:1,element:3},{column:2,element:0}],[7],'VIOLET']]);
  assert.equal(solveDiagram(map2).arrowGroups,undefined);assert.equal(solveDiagram(map2).highlightPaths,undefined);
  const dj=solveDiagram(disjoint2),dj3=solveDiagram(disjoint3),ch=solveDiagram(chain3);
  assert.equal(dj.layout,'DISJOINT');assert.deepEqual(dj.disjoint,[0,1]);assert.equal(dj.subset,null);assert.deepEqual(dj3.disjoint,[0,1]);
  assert.equal(ch.layout,'CHAIN');assert.deepEqual(ch.chain,[0,1,2]);assert.deepEqual(ch.shade.cells,[2,6]);
  assert.equal(solveDiagram(venn2).disjoint,undefined);assert.equal(solveDiagram(subset).chain,undefined);
  const circlesOf=model=>setDiagramSpec(plan(model===dj?disjoint2:model===dj3?disjoint3:chain3),model).layout.circles;
  const dist=(a,b)=>Math.hypot(a.cx-b.cx,a.cy-b.cy);
  const [da,db]=circlesOf(dj);assert.ok(dist(da,db)>da.r+db.r+10);
  const [ta,tb,tc]=circlesOf(dj3);assert.ok(dist(ta,tb)>ta.r+tb.r+10&&dist(ta,tc)<ta.r+tc.r-20&&dist(tb,tc)<tb.r+tc.r-20);
  const [ca,cb,cc]=circlesOf(ch);assert.ok(dist(ca,cb)+ca.r<cb.r-10&&dist(cb,cc)+cb.r<cc.r-10);
  assert.deepEqual(setDiagramSize(solveDiagram(venn2)),{width:470,height:330});
  assert.deepEqual(setDiagramSize(solveDiagram(map2)),{width:460,height:220});
  // a four-set membership table keeps every declared membership as its own cell truth
  const table=solveDiagram(table4);
  assert.equal(table.kind,'MEMBERSHIP_TABLE');
  assert.deepEqual(table.elements.map(e=>[e.text,e.in]),[['1',['A','D']],['2',['B','D']],['3',['A','B','C']],['4',['D']],['5',['A','B']],['6',['C']]]);
  assert.deepEqual(setDiagramSize(table),{width:356,height:318});
  assert.deepEqual(setDiagramSpec(plan(table4),table).prims.filter(p=>p.role==='membership').map(p=>`${p.data.element}:${p.data.set}`),
    ['0:A','0:D','1:B','1:D','2:A','2:B','2:C','3:D','4:A','4:B','5:C']);
});

test('set figures that cannot be drawn faithfully are refused with their codes',()=>{
  refuse({kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'},{id:'D'}]},'SET_COUNT_UNSUPPORTED');
  refuse({kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'},{id:'C'},{id:'D'},{id:'E'}],elements:[{text:'1',in:[]}]},'SET_COUNT_UNSUPPORTED');
  refuse({kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:['C']}]},'SET_ELEMENT_SET_UNKNOWN');
  refuse({kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'}],elements:[{text:'1',in:[]},{text:'1',in:['A']}]},'SET_ELEMENT_DUPLICATE');
  refuse({kind:'MEMBERSHIP_TABLE',sets:[{id:'A'},{id:'B'}],elements:Array.from({length:13},(_,i)=>({text:String(i),in:[]}))},'SET_TOO_MANY_ELEMENTS');
  refuse({kind:'MEMBERSHIP_TABLE',sets:[{id:'U'},{id:'B'}],elements:[{text:'1',in:[]}]},'SET_ID_INVALID');
  refuse({...table4,shade:'A'},'SET_DIAGRAM_PLAN_INVALID');
  refuse({kind:'VENN',sets:[{id:'A'},{id:'A'}]},'SET_ID_INVALID');
  refuse({kind:'VENN',sets:[{id:'U'}]},'SET_ID_INVALID');
  refuse({kind:'VENN',sets:[{id:'A'}],elements:[{text:'1',in:['B']}]},'SET_ELEMENT_SET_UNKNOWN');
  refuse({kind:'VENN',sets:[{id:'A'}],elements:[{text:'1≤x≤3',in:[]}]},'SET_ELEMENT_TEXT_UNSUPPORTED');
  refuse({kind:'VENN',sets:[{id:'A'}],elements:[{text:'1',in:[]},{text:'1',in:[]}]},'SET_ELEMENT_DUPLICATE');
  refuse({kind:'VENN',sets:[{id:'A'}],elements:Array.from({length:13},(_,i)=>({text:String(i),in:[]}))},'SET_TOO_MANY_ELEMENTS');
  refuse({...venn2,shade:'A∩D'},'SET_SHADE_INVALID');
  refuse({...venn2,shade:'A∩'},'SET_SHADE_INVALID');
  refuse({kind:'VENN',sets:[{id:'A'},{id:'B'}],shade:'A-B)'},'SET_SHADE_INVALID');
  refuse({...venn2,shade:'A∩B∩Aᶜ'},'SET_SHADE_EMPTY');
  refuse({kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'}],subset:['B','A']},'SET_LAYOUT_UNSUPPORTED');
  refuse({kind:'VENN',sets:[{id:'A'},{id:'B'}],subset:['B','A'],elements:[{text:'1',in:['B']}]},'SET_ELEMENT_REGION_EMPTY');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1']}]},'MAPPING_COLUMNS_INVALID');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1']},{id:'Y',elements:['a']},{id:'Z',elements:['p']},{id:'W',elements:['q']},{id:'V',elements:['r']}],arrows:[{from:{column:0,element:0},to:{column:1,element:0}}]},'MAPPING_COLUMN_COUNT_UNSUPPORTED');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1','2','3','4','5','6','7','8','9']},{id:'Y',elements:['a']}],arrows:[]},'MAPPING_TOO_MANY_ELEMENTS');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1']},{id:'Y',elements:['a']}]},'MAPPING_NEEDS_ARROWS');
  refuse({...map2,arrows:[{from:{column:0,element:3},to:{column:1,element:0}}]},'MAPPING_ARROW_INVALID');
  refuse({...map2,arrows:[{from:{column:0,element:0},to:{column:0,element:1}}]},'MAPPING_ARROW_DIRECTION_UNSUPPORTED');
  refuse({...map2,arrows:[map2.arrows[0],map2.arrows[0]]},'MAPPING_ARROW_DUPLICATE');
  refuse({...map2,highlight:{arrows:[9]}},'MAPPING_HIGHLIGHT_INVALID');
  for(const bad of ['--2','-','1/','1/2/3','-1.5','abcde','-12345','2√','-x'])refuse({...mapSigned,columns:[{id:'X',elements:[bad]},mapSigned.columns[1]],arrows:[mapSigned.arrows[0]]},'MAPPING_ELEMENT_TEXT_UNSUPPORTED');
  refuse({...mapSigned,columns:[{id:'X',elements:['-2','\u22122']},mapSigned.columns[1]],arrows:[mapSigned.arrows[0]]},'MAPPING_COLUMNS_INVALID');
  const withG=(arrowGroups)=>({...mapFG,arrowGroups}),withP=(highlightPaths)=>({...mapFG,highlightPaths});
  refuse(withG([{name:'g',from:'X',to:'W'}]),'MAPPING_ARROW_GROUP_INVALID');
  refuse(withG([{name:'g',from:'X',to:'Z'}]),'MAPPING_ARROW_GROUP_INVALID');
  refuse(withG([{name:'g',from:'X',to:'Y',color:'ORANGE'}]),'MAPPING_ARROW_GROUP_INVALID');
  refuse(withG([{name:'g',from:'X',to:'Y'},{name:'h',from:'Y',to:'X'}]),'MAPPING_ARROW_GROUP_INVALID');
  refuse(withG([{from:'X',to:'Y'}]),'MAPPING_ARROW_GROUP_INVALID');
  refuse(withG([{name:'g',from:'Y',to:'X'}]),'MAPPING_ARROW_GROUP_EMPTY');
  refuse(withP([{path:['3','1','4'],startColumn:1}]),'MAPPING_PATH_INVALID');
  refuse(withP([{path:['3','1'],startColumn:-1}]),'MAPPING_PATH_INVALID');
  assert.equal(solveDiagram(withP([{path:['3','3'],startColumn:1},{path:['3','1'],color:'GREEN'}])).highlightPaths.length,2);
  refuse(withP([1,2,3,4,5].map(()=>({path:['3','1']}))),'MAPPING_PATH_INVALID');
  refuse(withP([{path:['3','1'],color:'GREEN'},{path:['3','1'],color:'BLUE'}]),'MAPPING_PATH_INVALID');
  refuse(withP([{path:['3','2','4']}]),'MAPPING_PATH_ARROW_MISSING');
  refuse(withP([{path:['3','9']}]),'MAPPING_PATH_INVALID');
  refuse(withP([{path:['3']}]),'MAPPING_PATH_INVALID');
  refuse(withP([{path:['3','1'],color:'ORANGE'}]),'MAPPING_PATH_INVALID');
  refuse({...disjoint2,subset:['B','A']},'SET_LAYOUT_UNSUPPORTED');
  refuse({...disjoint2,disjoint:[['A','B'],['A','B']]},'SET_LAYOUT_UNSUPPORTED');
  refuse({...disjoint2,disjoint:[['A','C']]},'SET_LAYOUT_UNSUPPORTED');
  refuse({...disjoint2,disjoint:[['A','A']]},'SET_LAYOUT_UNSUPPORTED');
  refuse({...disjoint2,disjoint:['A','B']},'SET_LAYOUT_UNSUPPORTED');
  refuse({kind:'VENN',sets:[{id:'A'}],disjoint:[['A','A']]},'SET_LAYOUT_UNSUPPORTED');
  refuse({...disjoint2,elements:[{text:'1',in:['A','B']}]},'SET_ELEMENT_REGION_EMPTY');
  refuse({...disjoint2,elements:undefined,shade:'A∩B'},'SET_SHADE_EMPTY');
  refuse({...disjoint3,elements:[{text:'1',in:['A','B','C']}]},'SET_ELEMENT_REGION_EMPTY');
  refuse({...chain3,subset:['A','B']},'SET_LAYOUT_UNSUPPORTED');
  refuse({...chain3,subset:['A','B','B']},'SET_LAYOUT_UNSUPPORTED');
  refuse({...chain3,elements:[{text:'1',in:['A','C']}]},'SET_ELEMENT_REGION_EMPTY');
  refuse({...chain3,elements:[{text:'1',in:['B']}]},'SET_ELEMENT_REGION_EMPTY');
  refuse({...chain3,shade:'A∩Cᶜ'},'SET_SHADE_EMPTY');
  refuse({...chain3,sets:[{id:'A',count:'9'},{id:'B',count:'5'},{id:'C',count:'20'}]},'SET_COUNT_INVALID');
  refuse({kind:'PIE'},'SET_KIND_UNSUPPORTED');
  assert.throws(()=>checkSetDiagramPlan({...plan(venn2),extra:1}),code('SET_DIAGRAM_PLAN_INVALID'));
  assert.throws(()=>setDiagramSpec(plan(venn2),{...solveDiagram(venn2),shade:null}),code('SET_MODEL_MISMATCH'));
});

const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const bumpLabel=(svg,id,dx,dy)=>{const re=new RegExp(`(id="${id}"[^>]*?transform="translate\\()(-?[\\d.]+) (-?[\\d.]+)`);assert.ok(re.test(svg),id);return svg.replace(re,(m,head,x,y)=>`${head}${Number(x)+dx} ${Number(y)+dy}`);};
test('every figure composes, the independent observer passes it, and it catches a wrong shading, element, arrow or label',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(diagram,n)=>{
      const p=plan(diagram),model=solveDiagram(diagram);
      const composed=await composeSetDiagramFigure({plan:p,model,identity:assetIdentity('25_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assertAccessibleNames(composed.svg);
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
      assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
      assert.equal(composed.schemaVersion,'construction-candidate-svg-v1');
      return composed.svg;
    };
    const audit=async(diagram,svg)=>(await pythonWorker({diagram,svg},{script:observer,timeoutMs:30000})).result;
    // two sets with the outside and the intersection shaded
    let svg=await compose(venn2,1);
    assert.equal((await audit(venn2,svg)).status,'PASS');
    const extra=svg.replace('</svg>','<g data-layer="24"><path id="shade-extra" data-role="shade" data-cell="X" fill="#cfcfcf" d="M 60 60 L 410 60 L 410 286 L 60 286 Z"/></g></svg>');
    assert.ok(has(await audit(venn2,extra),'SD_SHADE_MISMATCH'));
    const stripped=svg.replace(/<g data-layer="24"><path id="shade-[^"]*"[^>]*\/><\/g>/g,'');
    assert.ok(has(await audit(venn2,stripped),'SD_SHADE_MISSING'));
    const moved=svg.replace(/(id="element-3"[^>]*?transform="translate\()(-?[\d.]+) (-?[\d.]+)/,(m,head,x,y)=>`${head}${Number(x)} ${Number(y)-110}`);
    assert.ok(has(await audit(venn2,moved),'SD_ELEMENT_REGION:3'));
    assert.ok(has(await audit({...venn2,shade:'A'},svg),'SD_SHADE_MISMATCH'));
    // B inside A
    svg=await compose(subset,2);
    const subAudit=await audit(subset,svg);assert.equal(subAudit.status,'PASS',JSON.stringify(subAudit.errors));
    // three sets
    svg=await compose(venn3,3);
    const three=await audit(venn3,svg);assert.equal(three.status,'PASS',JSON.stringify(three.errors));
    assert.ok(has(await audit({...venn3,shade:'A'},svg),'SD_SHADE_MISMATCH'));
    // four sets as an explicit membership table (no four-circle claim)
    svg=await compose(table4,7);
    const tableAudit=await audit(table4,svg);assert.equal(tableAudit.status,'PASS',JSON.stringify(tableAudit.errors));
    assert.equal(tableAudit.observed.marks,11);
    const movedMark=svg.replace(/(id="mark-0-A"[^>]*?cx=")(-?[\d.]+)/,(m,head,x)=>`${head}${198}`);
    assert.ok(has(await audit(table4,movedMark),'SD_TABLE_MARK_PLACE:0:A'));
    assert.ok(has(await audit(table4,svg.replace(/<circle id="mark-5-C"[^>]*\/>/,'')),'SD_TABLE_MARK_SET'));
    assert.ok(has(await audit(table4,svg.replace('</svg>','<circle id="mark-extra" data-role="membership" data-element="0" data-set="B" cx="198" cy="80" r="5" fill="#111"/></svg>')),'SD_TABLE_MARK_SET'));
    assert.ok(has(await audit(table4,svg.replace('data-tex="D"','data-tex="X"')),'SD_TABLE_HEADER_TEXT:D'));
    assert.ok(has(await audit(table4,svg.replaceAll('data-role="grid-v"','data-role="grid"')),'SD_TABLE_GRID'));
    // two columns, highlight
    svg=await compose(map2,4);
    const mapped=await audit(map2,svg);assert.equal(mapped.status,'PASS',JSON.stringify(mapped.errors));
    const wrongEnd=svg.replace(/(id="arrow-0"[^>]*points="[^"]*?)(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)(")/,(m,a,x,y,z)=>`${a}${x},${Number(y)-34}${z}`);
    assert.ok(has(await audit(map2,wrongEnd),'SD_ARROW_END:0'));
    const missingHead=svg.replace('<polygon id="arrow-head-0" data-role="arrow-head"','<polygon id="arrow-head-0" data-role="head"');
    assert.ok(has(await audit(map2,missingHead),'SD_ARROW_HEAD:0'));
    const outside=svg.replace(/(id="element-1-0"[^>]*?transform="translate\()(-?[\d.]+) (-?[\d.]+)/,(m,head,x,y)=>`${head}${Number(x)} 30`);
    assert.ok(has(await audit(map2,outside),'SD_ELEMENT_NOT_IN_OVAL:1:0'));
    // three columns with a dashed composite arrow
    svg=await compose(map3,5);
    const composite=await audit(map3,svg);assert.equal(composite.status,'PASS',JSON.stringify(composite.errors));
    // signed numbers, a fraction and a root: the observer reads each element's math label back and fails on a wrong value
    svg=await compose(mapSigned,8);
    const signedAudit=await audit(mapSigned,svg);assert.equal(signedAudit.status,'PASS',JSON.stringify(signedAudit.errors));
    assert.ok(svg.includes('data-tex="-2"')&&svg.includes('data-tex="\\sqrt{2}"'));
    assert.ok(has(await audit(mapSigned,svg.replace('data-tex="-2"','data-tex="2"')),'SD_ELEMENT_TEXT:0:0'));
    assert.ok(has(await audit({...mapSigned,columns:[{id:'X',elements:['-3','-1','0','1/2','√2']},mapSigned.columns[1]]},svg),'SD_ELEMENT_TEXT:0:0'));
    // columns of different lengths: equal ovals, the shorter column centred, observer passes; a block moved off centre is caught
    svg=await compose(mapUneven,9);
    const unevenAudit=await audit(mapUneven,svg);assert.equal(unevenAudit.status,'PASS',JSON.stringify(unevenAudit.errors));
    svg=await compose(mapUneven3,10);
    const uneven3Audit=await audit(mapUneven3,svg);assert.equal(uneven3Audit.status,'PASS',JSON.stringify(uneven3Audit.errors));
    assert.ok(has(await audit(mapUneven3,svg.replace(/(id="oval-X"[^>]*ry=")([\d.]+)/,(m,head,ry)=>`${head}${Number(ry)-30}`)),'SD_OVAL_HEIGHT'));
    // f∘g: group names and colours, a coloured heavy path; the observer reads every stroke, head fill and name back
    svg=await compose(mapFG,11);
    const fgAudit=await audit(mapFG,svg);assert.equal(fgAudit.status,'PASS',JSON.stringify(fgAudit.errors));
    assert.ok(svg.includes('stroke="#1f5fa8" stroke-width="1.8"')&&svg.includes('stroke="#2e7d32" stroke-width="2.4"')&&svg.includes('data-label-role="arrow-group-name"'));
    assert.ok(has(await audit(mapFG,svg.replace(/(<polyline id="arrow-0"[^>]*stroke=")#1f5fa8/,'$1#b85c00')),'SD_ARROW_COLOUR:0'));
    assert.ok(has(await audit(mapFG,svg.replace(/(<polygon id="arrow-head-2"[^>]*fill=")#2e7d32/,'$1#111')),'SD_ARROW_COLOUR:2'));
    assert.ok(has(await audit({...mapFG,arrowGroups:[{name:'h',from:'X',to:'Y',color:'BLUE'},mapFG.arrowGroups[1]]},svg),'SD_ARROW_GROUP_TEXT:0'));
    assert.ok(has(await audit(mapFG,svg.replace('id="arrow-group-1" data-label-kind="COORDINATE_LABEL" data-label-role="arrow-group-name"','id="arrow-group-1" data-label-kind="COORDINATE_LABEL" data-label-role="column-note"')),'SD_ARROW_GROUP_LABEL_SET'));
    // sets drawn apart, and the three-level chain: the observer reads the circles back and catches a pair drawn touching or an inner circle poking out
    svg=await compose(disjoint2,12);
    const djAudit=await audit(disjoint2,svg);assert.equal(djAudit.status,'PASS',JSON.stringify(djAudit.errors));
    const touching=svg.replace(/(id="set-B"[^>]*cx=")[\d.]+/,'$1230');
    assert.ok(has(await audit(disjoint2,touching),'SD_DISJOINT_GEOMETRY:A:B'));
    svg=await compose(disjoint3,13);
    const dj3Audit=await audit(disjoint3,svg);assert.equal(dj3Audit.status,'PASS',JSON.stringify(dj3Audit.errors));
    svg=await compose(chain3,14);
    const chainAudit=await audit(chain3,svg);assert.equal(chainAudit.status,'PASS',JSON.stringify(chainAudit.errors));
    assert.ok(has(await audit(chain3,svg.replace(/(id="set-A"[^>]*cx=")[\d.]+/,'$1370')),'SD_SUBSET_GEOMETRY:A:B'));
    assert.ok(has(await audit(chain3,svg.replace(/(id="set-C"[^>]*cx=")[\d.]+/,'$1100')),'SD_SET_OUTSIDE_UNIVERSAL:C'));
    // f and its reverse g between the same two sets
    svg=await compose(mapback,6);
    const reverse=await audit(mapback,svg);assert.equal(reverse.status,'PASS',JSON.stringify(reverse.errors));
    assert.ok(has(await audit(mapback,svg.replace('data-from-column="1" data-from-element="0" data-to-column="0" data-to-element="0"','data-from-column="1" data-from-element="0" data-to-column="0" data-to-element="1"')),'SD_ARROW_DECLARATION'));
  }finally{await browser.close();}
});

test('render-plan routes a set-diagram plan and reports an unfaithful one at its stage with the engine code',async()=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'set-diagram-'));
  const r=await renderPlan({item:{sourcePath:'archive/exams/test-exam.js',ordinal:3,dir:'t'},plan:plan({kind:'VENN',sets:[{id:'A'},{id:'B'},{id:'C'},{id:'D'}]}),outDir:out});
  assert.equal(r.status,'FAILED');assert.equal(r.stage,'set-diagram');assert.equal(r.capability,FIGURE_CAPABILITY);assert.match(r.detail,/SET_COUNT_UNSUPPORTED/);
});
