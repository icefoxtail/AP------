import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import {specFor} from '../production/phase2.mjs';

// G bundle (2026-11-23), 2a-EQ: a figure drawn at a squeezed scale (the framer records axisRatio other than 1) keeps the window it was framed in.
// The engine widens a window by 8 % on each axis when the unit points (1,0) and (0,1) lie outside it, which breaks a recorded y/x ratio; viewport.declaredScale
// turns that widening off (visual_engine/engine.py reads it). phase2.mjs sets it for every squeezed figure, and only for those.
const quadratic=(extra={})=>({capability:'polynomial-spike-v1',caption:'이차함수',graphPlan:{
  family:'polynomial',coefficients:['5','8','2'],domain:[-4,0],viewport:[-4.43,0.43,-3.87,5.87],overviewFeatures:[],
  requiredPoints:[{id:'V',x:-2,y:-3}],equalUnits:true,plotCanvas:{width:448,height:448},...extra}});

test('a squeezed quadratic frame is declared, so the engine keeps its window',()=>{
  const spec=specFor(quadratic({axisRatio:0.5}),{},'squeezed-quadratic');
  assert.equal(spec.viewport.declaredScale,true);
  assert.equal(spec.viewport.equalUnits,undefined);
});

test('an equal-unit quadratic frame is as it was: equalUnits and no declaredScale',()=>{
  for(const extra of [{axisRatio:1},{}]){
    const spec=specFor(quadratic(extra),{},'equal-quadratic');
    assert.equal(spec.viewport.equalUnits,true);
    assert.equal(spec.viewport.declaredScale,undefined);
  }
});

// The python half of the bundle (framer and observer rules that need no browser). It needs the render dependencies (sympy, via PYTHONPATH),
// like the Chrome renders below: where they are not installed (the CI test shards) it is skipped, as the renders are without a browser.
const hasPythonDeps=(()=>{try{execFileSync(process.env.PYTHON||'python',['-c','import sympy'],{stdio:'ignore'});return true;}catch{return false;}})();
test('graph G bundle python tests pass',{skip:process.env.GEOMETRY_SKIP_PYTHON==='1'||!hasPythonDeps},()=>{
  const here=path.dirname(fileURLToPath(import.meta.url));
  try{
    execFileSync(process.env.PYTHON||'python',['-m','unittest','test_graph_g_bundle'],{cwd:here,stdio:'pipe',encoding:'utf8'});
  }catch(error){
    assert.fail(String(error.stderr||error.stdout||error.message).slice(-4000));
  }
});

// 2b: full renders (Chrome). Skipped when no browser is configured.
const hasBrowser=Boolean(process.env.GEOMETRY_BROWSER_EXECUTABLE)||fs.existsSync('C:/Program Files/Google/Chrome/Application/chrome.exe');
const ITEM={sourcePath:'archive/exams/original/high/h2/1mid/19_매산여고_1학기_중간_고2_수학I.js',ordinal:18};
const CAPTION='테스트 그림';
const wrap=(capability,graphPlan)=>({capability,graphPlan,caption:CAPTION,sourceConditions:[{id:'c1',condition:'t',mappedTo:'graphPlan'}],newVisualInformation:['t']});
async function renderFigure(name,plan){
  const {renderPlan}=await import('../production/render-plan.mjs');
  const {closeWorkers}=await import('../production/worker.mjs');
  const {closeSharedBrowser}=await import('../visual-browser-runtime.mjs');
  const outDir=fs.mkdtempSync(path.join(os.tmpdir(),'g-bundle-'));
  try{
    const result=await renderPlan({item:{dir:name,...ITEM},plan,outDir});
    const svgPath=path.join(outDir,name+'-solution.svg');
    return {result,svg:fs.existsSync(svgPath)?fs.readFileSync(svgPath,'utf8'):''};
  }finally{await closeSharedBrowser();closeWorkers();}
}

test('a band too thin for its name stands on a leader that starts on a dot inside the band',{skip:!hasBrowser,timeout:240000},async()=>{
  const plan=wrap('piecewise-polynomial-spike-v1',{family:'piecewise-polynomial',pieces:[{coefficients:['0','0','1']}],breakpoints:[],
    sourceDomain:{kind:'INTERVAL',range:['-2','2'],states:['CLOSED','CLOSED']},formula:'x^2',
    regions:[{id:'S1',upper:'f',lower:'axis',from:'1/5',to:'1',fill:'LIGHT',label:'S_1'},{id:'S2',upper:'f',lower:'axis',from:'1',to:'2',fill:'MEDIUM',label:'S_2'}],
    requiredPoints:[{id:'O',x:0,y:0}],axisTickValues:{x:[],y:[]}});
  const {result,svg}=await renderFigure('g-bundle-region',plan);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  const leaders=[...svg.matchAll(/<line [^>]*data-role="leader"[^>]*data-owner-label="(region-[^"]+)"/g)].map(match=>match[1]);
  assert.ok(leaders.length>=1,'the thin band S1 has a leader');
  for(const owner of leaders)assert.match(svg,new RegExp('<circle [^>]*data-role="leader-dot"[^>]*data-owner-label="'+owner+'"'),'a dot inside the band starts the leader of '+owner);
});

test('an overlay line that is the own asymptote of the curve does not write its value a second time',{skip:!hasBrowser,timeout:240000},async()=>{
  const plan=wrap('rational-spike-v1',{family:'rational',numerator:['1','1'],denominator:['-2','1'],sourceDomain:{kind:'ALL_REALS'},domain:[-3,7],viewport:[-3,7,-4,6],
    axisTickValues:{x:[],y:[]},overlays:{lines:[{id:'h',slope:'0',intercept:'1'},{id:'v',x:'2'}]}});
  const {result,svg}=await renderFigure('g-bundle-asymptote',plan);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  assert.doesNotMatch(svg,/id="overlay-line-h-equation"/);
  assert.doesNotMatch(svg,/id="overlay-line-v-equation"/);
  assert.match(svg,/id="overlay-line-h"/);   // the dashed lines themselves are still drawn
  assert.match(svg,/id="overlay-line-v"/);
});

// 2c: a branch equation stands beside its own branch. Piecewise-affine branches that meet at one point: each label keeps to its own side.
test('piecewise-affine branch equations each stand beside their own branch',{skip:!hasBrowser,timeout:240000},async()=>{
  const plan=wrap('piecewise-affine-spike-v1',{family:'piecewise-affine',sourceDomain:{kind:'CLOSED_INTERVAL',range:['-4','4']},domain:[-4,4],viewport:[-5,5,-8,8],
    piecewise:{breakX:'0',owner:'RIGHT',left:['1/2','3'],right:['-3/2','2']}});
  const {result,svg}=await renderFigure('g-bundle-pa-owner',plan);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  assert.match(svg,/id="left-branch-equation"/);
  assert.match(svg,/id="right-branch-equation"/);
});

test('an exp-log pair writes each formula beside its own curve',{skip:!hasBrowser,timeout:240000},async()=>{
  const plan=wrap('exp-log-pair-spike-v1',{family:'exp-log-pair',curves:[
    {id:'f',family:'logarithmic-affine',base:'3',coefficients:['2','1','0','0'],sourceDomain:{kind:'NATURAL_LOG_AFFINE'}},
    {id:'g',family:'exponential-affine',base:'sqrt(3)',coefficients:['1','1','0'],sourceDomain:{kind:'ALL_REALS'}}],identityLine:true});
  const {result}=await renderFigure('g-bundle-pair-owner',plan);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
});

// 2c: a value label f(a)=b stands at its own point (a,f(a)), not at another point of the curve.
test('an exponential value label f(0)=1 stands at its own point, not beside the point (2,4)',{skip:!hasBrowser,timeout:240000},async()=>{
  const plan=wrap('exponential-affine-spike-v1',{family:'exponential-affine',base:'2',coefficients:['1','1','0'],shiftX:'0',sourceDomain:{kind:'ALL_REALS'},domain:[-2,2],viewport:[-3,3,-1,5],
    overlays:{points:[{id:'A',curveX:'-2',coordinates:true},{id:'B',curveX:'2',coordinates:true}]}});
  const {result,svg}=await renderFigure('g-bundle-value-label',plan);
  assert.equal(result.status,'ARCHIVE_BOUND',JSON.stringify(result.detail));
  const dot=svg.match(/<circle id="exponential-reference-point"[^>]*cx="([0-9.]+)" cy="([0-9.]+)"/);
  const label=svg.match(/<g id="reference-value"[^>]*transform="translate\(([0-9.]+) ([0-9.]+)\)"[^>]*>\s*<svg[^>]*width="([0-9.]+)" height="([0-9.]+)"/);
  assert.ok(dot&&label,'reference dot and value label are drawn');
  const [cx,cy]=[Number(dot[1]),Number(dot[2])],[x,y,w,h]=label.slice(1).map(Number);
  const gap=Math.hypot(Math.max(x-cx,0,cx-(x+w)),Math.max(y-cy,0,cy-(y+h)));
  assert.ok(gap<=40,'the label stands within 40 px of the point (0,1), measured '+gap);
});
