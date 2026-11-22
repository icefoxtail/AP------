// R0-4: plan 작성 AI는 AUTHOR_GUIDE에서 plan 종류에 해당하는 절만 발췌(ds-plan-context.cjs 의 SECTIONS)해 읽는다.
// 절이 없거나 SECTIONS에 안 걸린 종류는 그 종류의 필드를 못 본 채 plan을 쓰게 된다(수직선이 그랬다: ### 절이 없고 SECTIONS 가 []).
// 이 테스트는 "엔진이 받는 종류"를 코드에서 읽어, 종류마다 (1) 안내의 ### 절 (2) SECTIONS 연결 (3) 실제 발췌에 절이 잘리지 않고 들어감
// (4) 안내의 예제 plan이 엔진 검증을 통과함을 검사한다. 브라우저·네트워크 없이 돈다(python 의존성이 있을 때만 그래프 종류의 plan-lint 검증을 더한다).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'../../../..');
const prod=path.join(here,'../production');
const require=createRequire(import.meta.url);
process.chdir(repo); // ds-plan-context.cjs 는 AUTHOR_GUIDE.md 를 저장소 기준 상대 경로로 읽는다
const ctx=require('../ops/claude-batch/ds-plan-context.cjs');
const imp=file=>import(pathToFileURL(path.join(prod,file)).href);
const read=file=>fs.readFileSync(path.join(prod,file),'utf8');

// ---- 엔진이 받는 종류(capability)를 코드에서 읽는다 -----------------------------------------------------------------------------------
const [contracts,comp,chain,nlf,sol,scf,sdg,ell,cfv,lpf]=await Promise.all(['contracts.mjs','composite-candidate-svg-v1.mjs','quadratic-inequality-chain-v1.mjs','number-line-v1.mjs','solid-figure-v1.mjs','stat-chart-v1.mjs','set-diagram-v1.mjs','ellipse-figure-v1.mjs','container-fill-v1.mjs','lattice-path-v1.mjs'].map(imp));
const graphKinds=[...read('construction-candidate-svg-v1.mjs').match(/const GRAPH_CAPABILITIES=new Set\(\[([^\]]*)\]\)/)[1].matchAll(/'([a-z0-9-]+)'/g)].map(m=>m[1]);
const renderPlanKinds=[...read('render-plan.mjs').matchAll(/capability===['"]([a-z0-9-]+-v1)['"]/g)].map(m=>m[1]);
const KINDS=[...new Set([...graphKinds,...Object.keys(contracts.CAPABILITIES),...renderPlanKinds,comp.COMPOSITE_CAPABILITY,chain.CHAIN_CAPABILITY,chain.NUMBER_LINE_CAPABILITY,nlf.FIGURE_CAPABILITY,sol.SOLID_CAPABILITY,scf.FIGURE_CAPABILITY,sdg.FIGURE_CAPABILITY,ell.FIGURE_CAPABILITY,cfv.FIGURE_CAPABILITY,lpf.FIGURE_CAPABILITY])].sort();

// ---- 안내(AUTHOR_GUIDE.md)의 절 ---------------------------------------------------------------------------------------------------------
const guideLines=fs.readFileSync(path.join(prod,'AUTHOR_GUIDE.md'),'utf8').split('\n');
const sections=new Map(); // 절 이름(### 뒤 첫 낱말, 끝의 .:, 제거) → {heading, body:[줄]}
{let cur=null;for(const line of guideLines){
  const h=/^### (\S+)/.exec(line);
  if(h){cur={heading:line,body:[]};const name=h[1].replace(/[.:,]+$/,'');if(!sections.has(name))sections.set(name,cur);continue;}
  if(/^## /.test(line)){cur=null;continue;}
  if(cur&&line.trim())cur.body.push(line);
}}
const sectionsOf=kind=>ctx.SECTIONS[kind]??(kind===comp.COMPOSITE_CAPABILITY?['3-16']:[]);
const named=line=>KINDS.filter(kind=>line.includes('`'+kind+'`')); // 줄이 `종류` 꼴로 이름을 부르는 종류

// 안내에 "예제 plan(단독|패널): `{...}`" 줄로 적은 예제: 종류별 최소 예제(이 테스트가 엔진 검증으로 통과시킨다)
const EXAMPLE=/^- 예제 plan\((단독|패널)\): `(\{.*\})`$/;
const examples=[];
for(const [name,section] of sections)for(const line of section.body){const m=EXAMPLE.exec(line);if(m)examples.push({section:name,mode:m[1],plan:JSON.parse(m[2])});}
const kindsIn=(value,out=new Set())=>{if(Array.isArray(value))value.forEach(item=>kindsIn(item,out));else if(value&&typeof value==='object'){if(typeof value.capability==='string')out.add(value.capability);Object.values(value).forEach(item=>kindsIn(item,out));}return out;};

// 이 목록의 종류는 예제를 문단 속에 적은 오래된 절을 쓴다(예제 줄 표지는 새로 채우는 절부터). 새 종류는 이 목록에 넣지 않는다: 절과 표지 예제를 함께 만든다.
const PROSE_EXAMPLE_KINDS=new Set(['composite-panels-v1','construction-spike-v1','container-fill-figure-v1','ellipse-figure-v1','lattice-path-figure-v1','multi-curve-figure-v1','piecewise-discontinuous-spike-v1','piecewise-polynomial-spike-v1','polynomial-spike-v1','rational-spike-v1','set-diagram-figure-v1','solid-figure-v1','sqrt-affine-spike-v1','stat-chart-figure-v1','trigonometric-spike-v1']);

test('the engine knows the kinds this test expects (a kind added to the engine shows up here)',()=>{
  assert.ok(KINDS.length>=23,'kinds read from the engine: '+KINDS.join(', '));
  for(const kind of ['number-line-figure-v1','number-line-v1','quadratic-inequality-chain-v1','exp-log-pair-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1'])assert.ok(KINDS.includes(kind),'engine kind missing: '+kind);
});

test('every kind the engine accepts has a SECTIONS entry whose guide sections exist, have a body and name the kind',()=>{
  for(const kind of KINDS){
    const names=sectionsOf(kind);
    assert.ok(names.length>0,`${kind}: no SECTIONS entry in ds-plan-context.cjs (the plan author would never see its fields)`);
    for(const name of names)assert.ok(sections.has(name)&&sections.get(name).body.length>0,`${kind}: SECTIONS names "${name}" but AUTHOR_GUIDE.md has no "### ${name}" section with a body`);
    assert.ok(names.some(name=>[sections.get(name).heading,...sections.get(name).body].some(line=>named(line).includes(kind))),`${kind}: none of its sections (${names.join(', ')}) names the kind`);
  }
  for(const kind of Object.keys(ctx.SECTIONS))assert.ok(KINDS.includes(kind),`SECTIONS has "${kind}" which the engine does not accept (stale entry)`);
});

test('every kind outside the old prose-example list has a marked example plan, and no new kind may skip it',()=>{
  const have=new Set();for(const example of examples)for(const kind of kindsIn(example.plan))have.add(kind);
  for(const kind of KINDS){
    if(PROSE_EXAMPLE_KINDS.has(kind))continue;
    assert.ok(have.has(kind),`${kind}: write a "- 예제 plan(단독): \`{...}\`" line (and a 패널 line when the kind can be a panel) in its guide section`);
  }
  for(const kind of PROSE_EXAMPLE_KINDS)assert.ok(KINDS.includes(kind),'stale PROSE_EXAMPLE_KINDS entry: '+kind);
  assert.ok(examples.some(example=>example.mode==='패널'&&kindsIn(example.plan).has('number-line-v1')),'the number-line panel example is missing');
});

test('in the real excerpt every line a kind needs from its new section is kept whole and the budget holds',()=>{
  const budget=Number(process.env.DS_GUIDE_BYTES)>0?Number(process.env.DS_GUIDE_BYTES):24000;
  const checked=new Set();
  for(const example of examples){
    const excerpt=ctx.guideExcerpt([example.plan]);
    assert.ok(excerpt.bytes<=budget,`${example.section} ${example.mode}: excerpt ${excerpt.bytes} bytes exceeds ${budget}`);
    const lines=new Set(excerpt.text.split('\n')),inPlan=kindsIn(example.plan);
    for(const kind of inPlan){
      if(PROSE_EXAMPLE_KINDS.has(kind))continue;
      for(const name of sectionsOf(kind)){
        const section=sections.get(name);
        if(!section.body.some(line=>EXAMPLE.test(line)))continue; // 오래된 절(문단 속 예제)은 건너뛴다
        assert.ok(lines.has(section.heading),`${kind}: excerpt for the ${example.mode} example lacks the heading of "${name}"`);
        for(const line of section.body){
          const names=named(line);
          // 필요한 줄: 이 plan의 종류를 이름으로 부르는 줄. 단독 예제는 종류를 부르지 않는 일반 줄도 모두 필요하다.
          // 패널 예제(그래프 절 여러 개와 예산 24000 바이트를 나눠 쓴다)는 패널 이름 `number-line-v1`을 부르는 줄(배치 규칙·키 목록)만 필요하다: 값·점 문법 줄은 점수가 낮으면 예산에서 밀릴 수 있다.
          const needed=names.some(k=>inPlan.has(k))||(example.mode==='단독'&&names.length===0);
          if(!needed)continue;
          assert.ok(line.length<=2900,`${name}: a needed line is ${line.length} chars; the excerpt cuts lines at 3000: split it`);
          assert.ok(lines.has(line),`${kind}: excerpt for the ${example.mode} example drops or cuts this line of "${name}": ${line.slice(0,80)}`);
        }
        checked.add(kind+'|'+name+'|'+example.mode);
      }
    }
  }
  assert.ok(checked.has('number-line-figure-v1|3-수직선|단독'),'the number-line section was not checked in an excerpt');
  assert.ok(checked.has('number-line-v1|3-수직선|패널'),'the number-line panel line was not checked in a composite excerpt');
});

test('example plans pass the engine validation that needs no python (number line, number-line panel, inequality chain)',()=>{
  let checked=0;
  for(const example of examples){
    const plan=example.plan;
    if(plan.capability===nlf.FIGURE_CAPABILITY){const expanded=nlf.expandNumberLineFigure(plan);for(const panel of comp.compositePanels(expanded))if(comp.isNumberLinePanel(panel.plan))chain.solveNumberLine(panel.plan.numberLine);checked++;}
    else if(plan.capability===chain.CHAIN_CAPABILITY){comp.compositePanels(chain.expandInequalityChain(plan));checked++;}
    else if(plan.capability===comp.COMPOSITE_CAPABILITY&&kindsIn(plan).has(chain.NUMBER_LINE_CAPABILITY)){for(const panel of comp.compositePanels(plan))if(comp.isNumberLinePanel(panel.plan))chain.solveNumberLine(panel.plan.numberLine);checked++;}
  }
  assert.ok(checked>=3,'expected the number-line, the number-line panel and the chain example to be checked, got '+checked);
});

// 그래프·작도 종류의 예제는 plan-lint(엔진의 frame_graph·모델·spec 검증을 그대로 부름)로 확인한다. 엔진의 python 의존성이 있어야 돈다.
const pythonDeps=fs.existsSync(path.join(repo,'.tmp/apmath-visual-engine/dependencies/python'));
test('every marked example plan passes plan-lint',{skip:pythonDeps?false:'NOT_RUN: the engine python dependencies (.tmp/apmath-visual-engine/dependencies/python) are not installed here'},async()=>{
  const {createLinter}=require('../ops/claude-batch/plan-lint.cjs');
  const linter=await createLinter({engine:repo});
  try{
    for(const example of examples){
      const result=await linter.lint(example.plan);
      assert.equal(result.status,'OK',`${example.section} ${example.mode} example (${[...kindsIn(example.plan)].join('+')}) failed plan-lint: ${result.code??''} ${result.reason??''}`);
    }
  }finally{await linter.close();}
});

// piecewise-affine 의 조각은 [기울기, 상수항]이다(graph_framing.py 의 left_m,left_c). plan-lint 는 두 수의 순서를 뒤집어도 통과시키므로 예제의 뜻(x=3에서 이어짐)으로 검사한다.
test('the piecewise-affine branch order in the guides is [slope, constant] like the engine',()=>{
  for(const file of [path.join(prod,'AUTHOR_GUIDE.md'),path.join(here,'../ops/svg-m1/guide/guide-graph.md')]){
    const text=fs.readFileSync(file,'utf8');
    assert.ok(text.includes('left:[m,b],right:[m,b]'),file+': the table must state left:[m,b],right:[m,b]');
    assert.ok(!text.includes('left:[b,m]'),file+': reversed branch order');
  }
  const found=examples.filter(example=>example.plan.capability==='piecewise-affine-spike-v1');
  assert.ok(found.length>0,'the piecewise-affine example is missing');
  for(const {plan} of found){
    const {breakX,left,right}=plan.graphPlan.piecewise,at=([m,b])=>Number(m)*Number(breakX)+Number(b);
    assert.equal(at(left),at(right),'the example is captioned as a joined bend, so both branches must meet at breakX');
  }
});
