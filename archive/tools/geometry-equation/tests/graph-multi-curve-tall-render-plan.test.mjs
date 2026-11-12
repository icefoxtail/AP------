// multi-curve-figure-v1, MULTI_CURVE_TOO_NARROW: a tall narrow figure keeps one scale on a taller plot and is requested at size class full. Rendered end to end
// through renderPlan (Chrome: run with --test-concurrency=1). Framing and observer tests without Chrome: test_graph_multi_curve_tall_plot.py.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';
import {contractText} from '../production/build-author-guide.mjs';

const manifest=JSON.parse(fs.readFileSync(new URL('../ops/golden.manifest.json',import.meta.url),'utf8'));
const goldenPlan=dir=>JSON.parse(fs.readFileSync(new URL(`../ops/golden/${dir}/plan.json`,import.meta.url),'utf8'));
const goldenItem=dir=>{const meta=manifest.items.find(value=>value.dir===dir);return {sourcePath:meta.sourcePath,ordinal:meta.ordinal,dir:'tn'};};

const render=async(item,plan,name)=>{
  const out=fs.mkdtempSync(path.join(os.tmpdir(),`multi-tall-${name}-`));
  const result=await renderPlan({item,plan,outDir:out});
  return {result,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,'tn-solution.svg'),'utf8'):''};
};
const viewBox=svg=>svg.match(/<svg [^>]*viewBox="0 0 (\d+) (\d+)"/).slice(1).map(Number);

test('the contract text and the guide name the taller plot of a narrow multi-curve figure',()=>{
  const text=contractText();
  assert.ok(text.includes('MULTI_CURVE_TOO_NARROW (a tall narrow figure first gets a taller plot'));
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  assert.ok(guide.includes('좁고 긴 그림(2026-11-12)')&&guide.includes('1064'));
});

test('20 효천고 q15: two parabolas and the boundary x=2 are ARCHIVE_BOUND at full, and f(5) is not printed',{timeout:600000},async()=>{
  const {result,svg}=await render(goldenItem('item154toonarrowq15'),goldenPlan('item154toonarrowq15'),'q15');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  assert.equal(result.sizeClass,'full');
  const title=svg.match(/<title id="visual-title">([^<]*)<\/title>/)[1];
  assert.ok(!/16/.test(title)&&!title.includes('(2,1)'),'no answer value in the figure text');
});

test('20 복성고 q14: a window 6 wide and 54 high renders at full (it was medium)',{timeout:600000},async()=>{
  const {result,svg}=await render(goldenItem('item155toonarrowq14'),goldenPlan('item155toonarrowq14'),'q14');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  assert.equal(result.sizeClass,'full');
  assert.ok(viewBox(svg)[1]<=704);
});

test('y=30x² and y=20x² on 0..1 (refused as MULTI_CURVE_TOO_NARROW before) render on a 1064 px high canvas at full',{timeout:600000},async()=>{
  const curve=(id,a)=>({id,kind:'Y_OF_X',coefficients:['0','0',String(a)],domain:['0','1'],color:id==='a'?'BLUE':'WARM',label:`y=${a}x^2`});
  const plan={capability:'multi-curve-figure-v1',graphPlan:{family:'multi-curve',curves:[curve('a',30),curve('b',20)],axisTickValues:{x:['1'],y:[]}},
    caption:'x가 0에서 1까지일 때 두 포물선의 모양을 한 배율로 비교한다.',
    sourceConditions:[{id:'source',condition:'두 이차함수의 그래프를 비교한다.',mappedTo:'PRESERVED_ARCHIVE_BANK'},{id:'solution',condition:'좁고 긴 그림의 틀 확인',mappedTo:'graphPlan'}],
    newVisualInformation:['좁고 긴 두 포물선']};
  const {result,svg}=await render(goldenItem('item155toonarrowq14'),plan,'tall');
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result).slice(0,600));
  assert.equal(result.sizeClass,'full');
  const [width,height]=viewBox(svg);
  assert.equal(width,512);assert.ok(height>704&&height<=1064,String(height));
  // the figure is one scale on both axes
  assert.equal(result.fallback?.some(step=>step.to==='AXIS_SQUEEZE')??false,false);
});
