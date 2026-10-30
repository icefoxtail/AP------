// Composite panel captions that do not fit (E7): a plain-text caption wider than the width a grid caption may have breaks into two lines at a space, a caption block
// taller than the standard 44 px row makes the caption rows of that figure taller, and a figure whose captions fit keeps the old layout exactly. Real Chrome;
// run with --test-concurrency=1.
import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {pythonWorker} from '../production/worker.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {compositePanels,compositeStackSize,composeCompositeCandidate,COMPOSITE_CAPTION_ROW} from '../production/composite-candidate-svg-v1.mjs';
import {requestedProfileTypographyPolicy} from '../production/display-envelope.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';

const int=value=>({kind:'integer',value:String(value)});
const point=(id,x,y)=>({id,op:'SOURCE_POINT',inputs:[],args:{coordinates:[x,y]},outputType:'POINT',factRole:'GIVEN'});
const segment=(id,a,b)=>({id,refs:[a,b]});
const triangle=width=>({capability:'construction-spike-v1',
  mathPlan:{schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[point('A',int(0),int(0)),point('B',int(6),int(0)),point('C',int(0),int(4))]},
  axisTickValues:{x:[],y:[]},displayLines:[],displayCircles:[],displaySegments:[segment('sAB','A','B'),segment('sBC','B','C'),segment('sCA','C','A')],rightAngles:[],displayPoints:['A','B','C'],
  caption:'삼각형 ABC이다.',...(width?{coordinateCanvas:{width,height:320}}:{})});
const composite=(captions,width)=>({capability:'composite-panels-v1',panels:captions.map(text=>({caption:{text},plan:triangle(width)})),caption:'삼각형 두 개를 비교한 그림'});
// The typography policy measured for a figure `intrinsic` SVG units wide that the Archive shows `cssWidth` CSS px wide: a wider figure gets a bigger base font (up to 32 px).
const policyFor=(intrinsic,cssWidth)=>{
  const rect=(width,height)=>({x:20,y:30,width,height});
  const observation={status:'PASS',synthetic:false,runtime:'playwright-chromium',profiles:[['small',126,105],['medium',174,145],['large',216,180],['full',cssWidth,Math.round(cssWidth*intrinsic.height/intrinsic.width)]].map(([sizeClass,width,height])=>({sizeClass,status:'PASS',imageRect:rect(width,height),naturalWidth:intrinsic.width,naturalHeight:intrinsic.height}))};
  return requestedProfileTypographyPolicy({requestedSizeClass:'full',intrinsicSvg:intrinsic,observation});
};
const small=policyFor({width:776,height:396},384);                   // base font 20: a caption row of 44 holds one line
const large=policyFor({width:848,height:396},310);                   // a narrow Archive solution column: base font about 31, a line of text is taller than 44
const identity=assetIdentity('composite_caption_fit|1','SOLUTION_VISUAL','decisive-relation');
let browser;
before(async()=>{browser=await launchBrowser();});
after(async()=>{await browser?.close();});

const composeOf=async(captions,{policy=small,width}={})=>{
  const plan=composite(captions,width),checked=compositePanels(plan);
  const panels=[];
  for(const item of checked){
    const response=await pythonWorker({action:'construction',graph:item.plan.mathPlan},{timeoutMs:90000});assert.equal(response.status,'OK',JSON.stringify(response.result));
    panels.push({plan:item.plan,model:response.result});
  }
  return composeCompositeCandidate({plan:{...plan,panels:checked.map(item=>({caption:item.caption,plan:item.plan}))},panels,identity,typographyPolicy:policy,browser});
};
const heightOf=svg=>Number(/<svg [^>]*height="([\d.]+)"/.exec(svg)[1]);

test('E7: a stack or grid size follows the caption row it is given, and the default row is the old 44',()=>{
  const sizes=[{width:384,height:320},{width:384,height:320}],layout={columns:2};
  const standard=compositeStackSize(sizes,0,layout),same=compositeStackSize(sizes,0,layout,COMPOSITE_CAPTION_ROW),taller=compositeStackSize(sizes,0,layout,COMPOSITE_CAPTION_ROW+20);
  assert.deepEqual(standard,same);assert.equal(COMPOSITE_CAPTION_ROW,44);
  assert.equal(taller.height-standard.height,20,'one grid row: the caption row grew by 20');
  assert.equal(taller.width,standard.width);
  const stack=compositeStackSize(sizes,0,{columns:1}),tallStack=compositeStackSize(sizes,0,{columns:1},64);
  assert.equal(tallStack.height-stack.height,2*20,'a stack of two panels has two caption rows');
});

test('E7: captions that fit keep the one-line layout and the 44 px row (the same bytes as before)',async()=>{
  const composed=await composeOf(['ㄱ 삼각형','ㄴ 삼각형']);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.ok(composed.svg.includes('id="p1-p1-caption-text"')&&composed.svg.includes('id="p2-p2-caption-text"'));
  assert.ok(!composed.svg.includes('caption-text-1'));
  assert.equal(heightOf(composed.svg),32+44+320,'top margin + one caption row + one panel row');
});

test('E7: a text caption wider than a grid caption may be breaks into two lines at a space and the figure still composes',async()=>{
  // 23 characters, 325 px at this font: inside the 368 px the cell allows by its own padding but past the 320 px the figure edge margins leave (it used to fail as TEXT_CLIPPED)
  const composed=await composeOf(['한 변과 그 양 끝각이 주어진 삼각형 작도','ㄴ 삼각형']);
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  assert.ok(composed.svg.includes('caption-text-1')&&composed.svg.includes('caption-text-2'),'two caption lines for panel 1');
  assert.ok(composed.svg.includes('id="p2-p2-caption-text"'),'panel 2 keeps its one line');
  assert.ok(heightOf(composed.svg)>32+44+320,'the caption row of the figure grew to hold two lines');
  assert.equal(composed.lineage.captionFragmentSha256s[0].length,2);assert.equal(composed.lineage.captionFragmentSha256s[1].length,1);
});

test('E7: a caption that cannot be broken (no space) and does not fit is refused with the old code, naming the width it may have',async()=>{
  const composed=await composeOf(['한변과그양끝각이주어진삼각형작도하기이다입니다','ㄴ 삼각형']);
  assert.equal(composed.status,'COMPOSITE_CAPTION_TOO_LARGE',JSON.stringify(composed.detail));
  assert.equal(composed.detail.panel,0);assert.equal(composed.detail.limit,384-64);assert.ok(composed.detail.width>composed.detail.limit);
});

test('E7: at the Archive column font a line of caption text is taller than 44 px: the caption rows of that figure grow instead of failing',async()=>{
  const composed=await composeOf(['ㄱ 삼각형','ㄴ 삼각형'],{policy:large,width:420});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  assert.equal(composed.renderedLayout.status,'PASS',JSON.stringify(composed.renderedLayout.errors));
  assert.ok(large.baseFontPx>=30,'base font '+large.baseFontPx);
  assert.ok(heightOf(composed.svg)>32+44+320,'the caption row grew past 44 because the text fragment is taller');
});
