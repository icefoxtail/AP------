// G13b: headcount labels on a Venn diagram (sets and universe); the Venn panels of a composite are in set-diagram-panels.test.mjs.
// Chrome-using (composes the figures): run with --test-concurrency=1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {solveDiagram,setDiagramSize,composeSetDiagramFigure,FIGURE_CAPABILITY} from '../production/set-diagram-v1.mjs';

const observer=fileURLToPath(new URL('../production/set-diagram-observer-worker.py',import.meta.url));
const code=expected=>error=>error.message===expected;
const refuse=(diagram,expected)=>assert.throws(()=>solveDiagram(diagram),code(expected),expected);
const plan=diagram=>({capability:FIGURE_CAPABILITY,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']});
const without=(value,...keys)=>Object.fromEntries(Object.entries(value).filter(([key])=>!keys.includes(key)));
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};

// 26 팔마고 2학기 중간 고1 20: 전체 40명, 음악 M 19명, 미술 A 25명, 둘 다 선택하지 않은 5명, M∩A 색칠
const counted={kind:'VENN',universe:{name:'U',count:'40',countUnit:'명'},
  sets:[{id:'M',name:'M',count:'19',countUnit:'명'},{id:'A',name:'A',count:'25',countUnit:'명'}],
  elements:[{text:'5명',in:[]}],shade:'M∩A'};
const plain={kind:'VENN',sets:[{id:'A'},{id:'B'}],elements:[{text:'9',in:['A']}],shade:'A∩B'};

test('counts are an opt-in: a plan without them keeps its model and its size',()=>{
  const model=solveDiagram(plain);
  assert.deepEqual(model.sets,[{id:'A',name:'A'},{id:'B',name:'B'}]);
  assert.equal(Object.hasOwn(model,'universe'),false);assert.equal(Object.hasOwn(model,'countStyle'),false);
  assert.deepEqual(setDiagramSize(model),{width:470,height:330});
  const withCounts=solveDiagram(counted);
  assert.deepEqual(withCounts.sets.map(set=>[set.id,set.count,set.countUnit]),[['M','19','명'],['A','25','명']]);
  assert.deepEqual(withCounts.universe,{name:'U',count:'40',countUnit:'명'});
  assert.ok(setDiagramSize(withCounts).height>330,'room for the universe headcount above the circles');
  // a number is accepted as the same integer, a count without a unit is a bare number
  assert.equal(solveDiagram(without({...counted,sets:[{id:'M',count:19},{id:'A'}]},'universe')).sets[0].count,'19');
});

test('a count that is not a non-negative integer, a unit without a count, or a count above the whole is refused',()=>{
  refuse({...counted,sets:[{id:'M',count:'-1'},{id:'A'}]},'SET_COUNT_INVALID');
  refuse({...counted,sets:[{id:'M',count:'1.5'},{id:'A'}]},'SET_COUNT_INVALID');
  refuse({...counted,sets:[{id:'M',count:'1/2'},{id:'A'}]},'SET_COUNT_INVALID');
  refuse({...counted,sets:[{id:'M',count:'열'},{id:'A'}]},'SET_COUNT_INVALID');
  refuse({...counted,sets:[{id:'M',count:'007'},{id:'A'}]},'SET_COUNT_INVALID');
  refuse(without({...counted,sets:[{id:'M',countUnit:'명'},{id:'A'}]},'universe'),'SET_COUNT_INVALID');
  refuse({...counted,universe:{count:'10',countUnit:'명'}},'SET_COUNT_INVALID');// M is 19 but the whole is 10
  refuse({...counted,universe:{name:'V',count:'40'}},'SET_NAME_INVALID');
  refuse({...counted,universe:{count:'40',extra:1}},'SET_DIAGRAM_PLAN_INVALID');
  refuse({...counted,countStyle:'bold'},'SET_COUNT_INVALID');
  refuse({kind:'VENN',sets:[{id:'A'}],countStyle:'n'},'SET_COUNT_INVALID');
  refuse({kind:'VENN',sets:[{id:'A',name:'음악',count:'3'}],countStyle:'n'},'SET_COUNT_INVALID');
  refuse({kind:'VENN',sets:[{id:'A'},{id:'B'}],subset:['B','A'],universe:{count:'9'},...{sets:[{id:'A',count:'5'},{id:'B',count:'7'}]}},'SET_COUNT_INVALID');// the inner set larger than the outer one
});

test('headcount labels compose beside each set name, are read back by the observer, and a wrong or misplaced one is caught',async()=>{
  const browser=await launchBrowser();
  try{
    const compose=async(diagram,n)=>{
      const model=solveDiagram(diagram);
      const composed=await composeSetDiagramFigure({plan:plan(diagram),model,identity:assetIdentity('25_테스트|'+n,'SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
      assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
      assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit.errors));
      assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
      return composed.svg;
    };
    const audit=async(diagram,svg)=>(await pythonWorker({diagram,svg},{script:observer,timeoutMs:30000})).result;
    let svg=await compose(counted,1);
    assert.match(svg,/data-label-role="set-count"[^>]*data-text="\(19명\)"/);
    assert.match(svg,/data-label-role="universal-count"[^>]*data-text="\(40명\)"/);
    const ok=await audit(counted,svg);assert.equal(ok.status,'PASS',JSON.stringify(ok.errors));
    // the count text the plan states, not another
    assert.ok(has(await audit(without({...counted,sets:[{...counted.sets[0],count:'20'},counted.sets[1]]},'universe'),svg),'SD_SET_COUNT:M'));
    assert.ok(has(await audit({...counted,universe:{...counted.universe,count:'41'}},svg),'SD_UNIVERSAL_COUNT'));
    // a count label that is gone, or one for a set that states none
    assert.ok(has(await audit(counted,svg.replace(/(id="set-count-A"[^>]*?)data-label-role="set-count"/,'$1data-label-role="other"')),'SD_SET_COUNT:A'));
    assert.ok(has(await audit({...counted,sets:[counted.sets[0],{id:'A',name:'A'}]},svg),'SD_SET_COUNT_UNEXPECTED:A'));
    // moved onto the other set's side, far from its own circle
    const moved=svg.replace(/(id="set-count-M"[^>]*?transform="translate\()(-?[\d.]+) (-?[\d.]+)/,(m,head,x,y)=>`${head}${Number(x)+200} ${Number(y)+120}`);
    const movedAudit=await audit(counted,moved);
    assert.ok(movedAudit.errors.some(error=>/^SD_SET_COUNT_(GROUP|ON_CIRCLE)|^SD_SET_LABEL_OUTSIDE/.test(error)),JSON.stringify(movedAudit.errors));
    // the n(M)=19 style puts the count in the name label itself
    const nStyle={kind:'VENN',countStyle:'n',universe:{count:'40'},sets:[{id:'M',count:'19'},{id:'A',count:'25'}],shade:'M∩A'};
    svg=await compose(nStyle,2);
    assert.match(svg,/data-label-role="set-name"[^>]*data-tex="n\(M\)=19"/);
    const nAudit=await audit(nStyle,svg);assert.equal(nAudit.status,'PASS',JSON.stringify(nAudit.errors));
    assert.ok(has(await audit({...nStyle,countStyle:'paren'},svg),'SD_SET_LABEL_TEXT'));
    // three counted sets and a counted subset
    const three={kind:'VENN',universe:{count:'100',countUnit:'명'},sets:[{id:'A',count:'40',countUnit:'명'},{id:'B',count:'35',countUnit:'명'},{id:'C',count:'30',countUnit:'명'}],shade:'A∩B∩C'};
    svg=await compose(three,3);
    const threeAudit=await audit(three,svg);assert.equal(threeAudit.status,'PASS',JSON.stringify(threeAudit.errors));
    const sub={kind:'VENN',universe:{count:'30',countUnit:'명'},sets:[{id:'A',count:'20',countUnit:'명'},{id:'B',count:'8',countUnit:'명'}],subset:['B','A'],shade:'B'};
    svg=await compose(sub,4);
    const subAudit=await audit(sub,svg);assert.equal(subAudit.status,'PASS',JSON.stringify(subAudit.errors));
  }finally{await browser.close();}
});

test('a count label with no room beside its circle goes out on a leader that ends on its own circle; with no room at all the figure is refused',async()=>{
  const browser=await launchBrowser();
  try{
    const identity=assetIdentity('25_테스트|9','SOLUTION_VISUAL','decisive-relation');
    const big={baseFontPx:32,displayScale:0.8,fontFloorCssPx:11};
    const run=diagram=>composeSetDiagramFigure({plan:plan(diagram),model:solveDiagram(diagram),identity,typographyPolicy:big,browser});
    // three counted sets: B and C cannot stand beside their circles at this size, so each is led out to its own circle
    const crowded={kind:'VENN',universe:{count:'100',countUnit:'명'},
      sets:[{id:'A',count:'40',countUnit:'명'},{id:'B',count:'35',countUnit:'명'},{id:'C',count:'30',countUnit:'명'}],
      elements:[{text:'7',in:['A','B','C']},{text:'9',in:[]}],shade:'A∩B'};
    const composed=await run(crowded);
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.ok(composed.svg.includes('data-role="set-leader"'),'a group that could not sit beside its circle leans on a leader');
    const audit=async(diagram,svg)=>(await pythonWorker({diagram,svg},{script:observer,timeoutMs:30000})).result;
    const ok=await audit(crowded,composed.svg);assert.equal(ok.status,'PASS',JSON.stringify(ok.errors));
    // the leader's far end is the thing the observer follows: moved off the circle it is caught
    const bent=composed.svg.replace(/(<line id="set-leader-B"[^>]*? x2=")(-?[\d.]+)/,(m,head,x)=>`${head}${Number(x)-30}`);
    assert.notEqual(bent,composed.svg);
    assert.ok(has(await audit(crowded,bent),'SD_SET_LEADER_END:B'));
    // a leader for a set that states no count is not allowed either
    assert.ok(has(await audit({...crowded,sets:[crowded.sets[0],{id:'B'},crowded.sets[2]]},composed.svg),'SD_SET_LEADER_UNEXPECTED:B'));
    // names so long that three groups cannot fit even on leaders: refused, nothing is dropped
    const tooLong={kind:'VENN',universe:{count:'1000',countUnit:'명'},
      sets:[{id:'A',name:'독서동아리',count:'1000',countUnit:'명'},{id:'B',name:'수영동아리',count:'900',countUnit:'명'},{id:'C',name:'연극동아리',count:'800',countUnit:'명'}],shade:'A∩B'};
    await assert.rejects(run(tooLong),error=>error.message==='SET_COUNT_LABEL_NO_ROOM');
  }finally{await browser.close();}
});
