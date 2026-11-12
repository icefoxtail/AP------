// stem-leaf classGroups[].color: the class bracket and its count in a palette colour. The model tests need no Chrome; the last two compose the golden figure
// (Chrome: run with --test-concurrency=1). The static observer reads the colours back from the final SVG (SC_CLASS_BRACKET_COLOR / SC_CLASS_COUNT_COLOR).
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {fileURLToPath} from 'node:url';
import {solveStatChart,composeStatChartFigure} from '../production/stat-chart-v1.mjs';
import {PALETTE,PALETTE_NAMES} from '../production/palette.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';

const golden=JSON.parse(fs.readFileSync(new URL('../ops/golden/item153stemleafclasscolor/plan.json',import.meta.url),'utf8'));
const observer=fileURLToPath(new URL('../production/stat-chart-observer-worker.py',import.meta.url));
const policy={baseFontPx:20,displayScale:1,fontFloorCssPx:11};
const refuse=(chart,expected)=>assert.throws(()=>solveStatChart(chart),error=>error.message===expected,expected);
const withColors=colors=>({...golden.chart,classGroups:golden.chart.classGroups.map((group,i)=>{const {color,...rest}=group;return colors[i]===undefined?rest:{...rest,color:colors[i]};})});
const luminance=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4);return 0.2126*r+0.7152*g+0.0722*b;};
const contrastOnWhite=hex=>1.05/(luminance(hex)+0.05);

test('the model keeps the colour on its class and adds no key when no colour is written',()=>{
  const model=solveStatChart(golden.chart);
  assert.deepEqual(model.classGroups.map(group=>group.color),['BLUE','WARM']);
  const plain=solveStatChart(withColors([]));
  assert.ok(plain.classGroups.every(group=>!('color' in group)),'a class without a colour keeps the model it had');
});

test('an unknown colour name (or lower case) is refused before anything is drawn',()=>{
  refuse(withColors(['TEAL']),'STAT_STEM_CLASS_COLOR_INVALID');
  refuse(withColors(['blue']),'STAT_STEM_CLASS_COLOR_INVALID');
  refuse(withColors([7]),'STAT_STEM_CLASS_COLOR_INVALID');
});

test('every palette line colour reads on a white page: at least 4.5:1, so the bracket line (3:1) and the count digit pass',()=>{
  for(const name of PALETTE_NAMES){
    const ratio=contrastOnWhite(PALETTE[name].line);
    assert.ok(ratio>=4.5,`${name} ${PALETTE[name].line} contrast ${ratio.toFixed(2)}`);
  }
});

test('the author guide states the option, its refusal and the colour-meaning rule',()=>{
  const guide=fs.readFileSync(new URL('../production/AUTHOR_GUIDE.md',import.meta.url),'utf8');
  for(const word of ['classGroups[].color','STAT_STEM_CLASS_COLOR_INVALID','색만으로 구별하지 않는다','item153stemleafclasscolor'])assert.ok(guide.includes(word),'guide lacks '+word);
});

test('q20 solution: the golden composes, each bracket and its count wear their class colour, and the observer catches a wrong one',{timeout:600000},async()=>{
  const browser=await launchBrowser();
  try{
    const composed=await composeStatChartFigure({plan:golden,model:solveStatChart(golden.chart),identity:assetIdentity('26_테스트|20','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.equal(composed.staticAudit.status,'PASS',JSON.stringify(composed.staticAudit));assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout).slice(0,500));
    const svg=composed.svg,audit=async(chart,text)=>(await pythonWorker({chart,svg:text},{script:observer})).result;
    const want={'class-g0-0-5':'BLUE','class-g0-30-35':'WARM'};
    for(const [id,name] of Object.entries(want)){
      const bracket=svg.match(new RegExp(`<polyline id="${id}"[^>]*/>`))?.[0];assert.ok(bracket,id);
      assert.ok(bracket.includes(`stroke="${PALETTE[name].line}"`),id+' stroke');assert.ok(bracket.includes(`data-color="${name}"`),id+' data-color');
      const count=svg.match(new RegExp(`<g id="${id}-count"[^>]*>`))?.[0];assert.ok(count,id+'-count');
      assert.ok(count.includes(` color="${PALETTE[name].line}"`),id+'-count colour');
    }
    const errors=async(chart,text)=>(await audit(chart,text)).errors;
    assert.ok((await errors(golden.chart,svg.replace(new RegExp(`(<polyline id="class-g0-0-5"[^>]*stroke=")${PALETTE.BLUE.line}`),'$1#111'))).some(e=>e.startsWith('SC_CLASS_BRACKET_COLOR:0-0-5')));
    assert.ok((await errors(golden.chart,svg.replace(new RegExp(`(<g id="class-g0-30-35-count"[^>]*?) color="${PALETTE.WARM.line}"`),'$1'))).some(e=>e.startsWith('SC_CLASS_COUNT_COLOR:0-30-35')));
    assert.ok((await errors(withColors(['WARM','WARM']),svg)).some(e=>e.startsWith('SC_CLASS_BRACKET_COLOR:0-0-5')),'a plan colour the picture does not wear is caught');
    assert.ok((await errors(withColors([]),svg)).some(e=>e.startsWith('SC_CLASS_BRACKET_COLOR')),'a coloured picture of an uncoloured plan is caught');
  }finally{await browser.close();}
});

test('without colours the figure is the plain one: black brackets, counts without a colour attribute',{timeout:600000},async()=>{
  const browser=await launchBrowser();
  try{
    const chart=withColors([]);
    const composed=await composeStatChartFigure({plan:{...golden,chart},model:solveStatChart(chart),identity:assetIdentity('26_테스트|20','SOLUTION_VISUAL','decisive-relation'),typographyPolicy:policy,browser});
    assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
    assert.ok(composed.svg.includes('<polyline id="class-g0-0-5" data-role="class-bracket" data-group="0" data-from="0" data-to="5" points='));
    assert.ok(!/ color="#/.test(composed.svg)&&!composed.svg.includes('data-color'));
  }finally{await browser.close();}
});
