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
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1']},{id:'Y',elements:['a']},{id:'Z',elements:['p']},{id:'W',elements:['q']}],arrows:[{from:{column:0,element:0},to:{column:1,element:0}}]},'MAPPING_COLUMN_COUNT_UNSUPPORTED');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1','2','3','4','5','6','7','8','9']},{id:'Y',elements:['a']}],arrows:[]},'MAPPING_TOO_MANY_ELEMENTS');
  refuse({kind:'MAPPING',columns:[{id:'X',elements:['1']},{id:'Y',elements:['a']}]},'MAPPING_NEEDS_ARROWS');
  refuse({...map2,arrows:[{from:{column:0,element:3},to:{column:1,element:0}}]},'MAPPING_ARROW_INVALID');
  refuse({...map2,arrows:[{from:{column:0,element:0},to:{column:0,element:1}}]},'MAPPING_ARROW_DIRECTION_UNSUPPORTED');
  refuse({...map2,arrows:[map2.arrows[0],map2.arrows[0]]},'MAPPING_ARROW_DUPLICATE');
  refuse({...map2,highlight:{arrows:[9]}},'MAPPING_HIGHLIGHT_INVALID');
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
