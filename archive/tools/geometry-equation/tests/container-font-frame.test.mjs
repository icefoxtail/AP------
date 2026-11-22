// container-fill: the room above the y axis, beside the x axis end, in the label rows and in the graph follows the policy font, only where the base room cannot hold the labels.
// At a font the base layout holds the figure is exactly the base figure (size 548 wide); at the Archive font (28.6) the golden figure composes and the independent observer passes. Chrome-using.
import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {assetIdentity} from '../production/contracts.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {checkContainerFillPlan,composeContainerFillFigure,containerFillSize,FIGURE_CAPABILITY} from '../production/container-fill-v1.mjs';

const observer=fileURLToPath(new URL('../production/container-fill-observer-worker.py',import.meta.url));
const identity=assetIdentity('25_연향중_2학기_중간_중1_기출|4','SOLUTION_VISUAL','decisive-relation');
const cyl=(radius,height)=>({kind:'CYLINDER',radius,height});
const fru=(r0,r1,height)=>({kind:'FRUSTUM',r0,r1,height});
// the golden item55: three vessels with notes
const golden={capability:FIGURE_CAPABILITY,container:{pairs:[
  {vessel:{name:'A',profile:[fru('2','3','4')]},graphName:'㉠',segmentNotes:[{segment:0,text:'점점 느려짐'}]},
  {vessel:{name:'B',profile:[cyl('3','2'),cyl('1','4')]},graphName:'㉢',segmentNotes:[{segment:0,text:'넓음 → 느림'},{segment:1,text:'좁음 → 빠름'}]},
  {vessel:{name:'C',profile:[cyl('5/2','5')]},graphName:'㉡',segmentNotes:[{segment:0,text:'일정한 비율'}]}],guides:true,xTitle:'시간(초)',yTitle:'높이(cm)'},
  caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'container'}],newVisualInformation:['n']};
const run=async(plan,font,scale,browser)=>composeContainerFillFigure({plan,model:checkContainerFillPlan(plan),identity,typographyPolicy:{baseFontPx:font,displayScale:scale,fontFloorCssPx:11},browser});

test('sizes: no font or a font the base layout holds gives the base size; the Archive font grows the frame',()=>{
  const model=checkContainerFillPlan(golden),base=containerFillSize(model);
  assert.equal(base.width,548);
  assert.deepEqual(containerFillSize(model,{fontPx:20}),base);
  const big=containerFillSize(model,{fontPx:28.6});
  assert.ok(big.width>548&&big.height>base.height,JSON.stringify(big));
});

test('the golden figure composes at font 20 (the base layout) and at the Archive font, the observer and the rendered layout passing',async()=>{
  const browser=await launchBrowser();
  try{
    const small=await run(golden,20,1,browser);
    assert.equal(small.status,'COMPOSED',JSON.stringify(small.detail));
    assert.match(small.svg,/viewBox="0 0 548 /);
    const big=await run(golden,28.6,0.4,browser),size=containerFillSize(checkContainerFillPlan(golden),{fontPx:28.6});
    assert.equal(big.status,'COMPOSED',JSON.stringify(big.detail));
    assert.equal(big.staticAudit.status,'PASS');assert.equal(big.renderedLayout.status,'PASS');
    assert.match(big.svg,new RegExp(`viewBox="0 0 ${size.width} ${size.height}"`));   // composing and the size the Archive measures agree
    const audit=(await pythonWorker({container:golden.container,svg:big.svg},{script:observer})).result;
    assert.equal(audit.status,'PASS',JSON.stringify(audit.errors));
    // the observer catches a title pushed off the figure
    const moved=big.svg.replace(/(<g id="y-title-0"[^>]*data-box=")([\d.]+),([\d.]+),/,'$1$2,0,');
    assert.equal((await pythonWorker({container:golden.container,svg:moved},{script:observer})).result.status,'FAIL');
  }finally{await browser.close();}
});

test('a vessel whose graph cannot hold its notes at the Archive font is refused with a layout code when no growth step makes room',async()=>{
  const browser=await launchBrowser();
  try{
    const plan={...golden,container:{pairs:[{vessel:{profile:[cyl('3','2'),cyl('1','4')]},segmentNotes:[{segment:0,text:'가'.repeat(16)}]}]}};
    const composed=await run(plan,28.6,0.4,browser);
    assert.ok(composed.status.startsWith('CONTAINER_'),composed.status);
    assert.notEqual(composed.status,'COMPOSED');
  }finally{await browser.close();}
});
