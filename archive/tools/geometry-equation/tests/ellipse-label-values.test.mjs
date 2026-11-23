// ellipse-figure-v1, 2nd engine round (python worker, no Chrome):
//  B04  a segment or line label that states a number / an equation is read back by the independent observer and compared with the exact figure;
//  N06  coordinates:true on a point of a plain ellipse (the label ID(x,y) is read back numerically) and the frame widening that gives labels room.
import test from 'node:test';
import assert from 'node:assert/strict';
import {assetIdentity} from '../production/contracts.mjs';
import {solveEllipseFigure,renderEllipseSvg,auditEllipseSvg,ellipseFigureSize,setEllipseFrameExtra,ELLIPSE_FRAME_STEPS,FIGURE_CAPABILITY} from '../production/ellipse-figure-v1.mjs';

const identity=assetIdentity('22_매산고_1학기_중간_고2_기하와벡터_기출|19','SOLUTION_VISUAL','decisive-relation');
const policy={baseFontPx:15,displayScale:1,profile:'TEST'};
const base=()=>({capability:FIGURE_CAPABILITY,sourceConditions:[{id:'c1',condition:'c',mappedTo:['ellipse']}],newVisualInformation:['n'],caption:'c'});
// x^2/36+y^2/20=1, P=(3,y) on it: y^2=15, so PF=4 (F=(4,0)), PF'=8 (F'=(-4,0)) and PO=2*sqrt(6)
const vector=(segmentLabels={},extra={})=>({...base(),
  ellipse:{center:['0','0'],semiAxisSquared:{major:'36',minor:'20'},majorAxis:'X'},
  points:[{id:'F',kind:'FOCUS',side:1},{id:"F'",kind:'FOCUS',side:-1},{id:'P',kind:'ON_ELLIPSE',x:'3',branch:'POS'},{id:'O',kind:'ORIGIN'}],
  segments:[{id:'s1',from:'P',to:'F',...(segmentLabels.s1?{label:segmentLabels.s1}:{})},{id:'s2',from:'P',to:"F'",...(segmentLabels.s2?{label:segmentLabels.s2}:{})},{id:'s3',from:'P',to:'O',...(segmentLabels.s3?{label:segmentLabels.s3}:{})}],...extra});
const audit=async(plan,labelledSvgPlan=plan)=>{
  const model=await solveEllipseFigure(plan);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  return {rendered,audit:await auditEllipseSvg({plan:labelledSvgPlan,svg:rendered.svg})};
};
const has=(result,prefix)=>result.errors.some(error=>error.startsWith(prefix));

test('B04: the true lengths of the segments pass; a number that is not the length is refused; a name states no number',async()=>{
  const right=vector({s1:'4',s2:'8',s3:'2\\sqrt{6}'});
  const {audit:pass}=await audit(right);assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  const {audit:names}=await audit(vector({s1:'a',s2:'b',s3:'PO'}));assert.equal(names.status,'PASS',JSON.stringify(names.errors));
  const wrong=vector({s1:'4',s2:'8',s3:'99'});
  const {audit:bad}=await audit(wrong);
  assert.equal(bad.status,'FAIL');assert.ok(has(bad,'ELLIPSE_SEGMENT_LABEL_VALUE_MISMATCH:s3'),JSON.stringify(bad.errors));
  assert.ok(!has(bad,'ELLIPSE_SEGMENT_LABEL_VALUE_MISMATCH:s1')&&!has(bad,'ELLIPSE_SEGMENT_LABEL_VALUE_MISMATCH:s2'),'only the wrong label is named');
  // the same segment drawn with another true-looking value
  const {audit:swapped}=await audit(vector({s1:'8',s2:'4',s3:'2\\sqrt{6}'}));
  assert.ok(has(swapped,'ELLIPSE_SEGMENT_LABEL_VALUE_MISMATCH:s1')&&has(swapped,'ELLIPSE_SEGMENT_LABEL_VALUE_MISMATCH:s2'));
  // a fraction and a surd in the forms of the corpus
  const {audit:forms}=await audit(vector({s3:'\\frac{4\\sqrt{6}}{2}'}));assert.equal(forms.status,'PASS',JSON.stringify(forms.errors));
});

test('B04: a line label that states an equation is the equation of its line (the observer of conic figures)',async()=>{
  // the hyperbola x^2/(16/25)-y^2/16=1 has the asymptotes y=5x and y=-5x (a plan whose asymptote names do not fit the figure is drawn without them and observed against the labelled plan)
  const plain={...base(),conic:{kind:'HYPERBOLA',center:['0','0'],aSquared:'16/25',bSquared:'16',transverse:'X'},points:[{id:'O',kind:'ORIGIN'}],
    lines:[{id:'s1',role:'ASYMPTOTE',sign:1,dashed:true},{id:'s2',role:'ASYMPTOTE',sign:-1,dashed:true}]};
  const model=await solveEllipseFigure(plain),rendered=await renderEllipseSvg({plan:plain,model,identity,typographyPolicy:policy});
  const labelled=(first,second)=>({...plain,lines:[{...plain.lines[0],label:first},{...plain.lines[1],label:second}]});
  const mismatches=async(first,second)=>(await auditEllipseSvg({plan:labelled(first,second),svg:rendered.svg})).errors.filter(error=>error.startsWith('CONIC_LINE_LABEL_VALUE_MISMATCH'));
  assert.deepEqual(await mismatches('y=5x','y=-5x'),[]);
  assert.deepEqual(await mismatches('y=5x','y=-5x'.replace('-','−')),[],'the typographic minus reads as a minus');
  assert.deepEqual(await mismatches('y=3x','y=-5x'),['CONIC_LINE_LABEL_VALUE_MISMATCH:s1']);
  assert.deepEqual(await mismatches('y=5x','y=5x'),['CONIC_LINE_LABEL_VALUE_MISMATCH:s2']);
  assert.deepEqual(await mismatches('l_1','l_2'),[],'a name states no equation');
});

test('N06: a point of a plain ellipse written with its coordinates is read back numerically',async()=>{
  const plan=vector({},{points:[{id:'F',kind:'FOCUS',side:1,coordinates:true},{id:"F'",kind:'FOCUS',side:-1,coordinates:true},{id:'P',kind:'ON_ELLIPSE',x:'3',branch:'POS'},{id:'O',kind:'ORIGIN'}]});
  const model=await solveEllipseFigure(plan);
  assert.equal(model.points.filter(point=>point.coordinates===true).length,2);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  assert.match(rendered.svg,/data-tex="F\(4,0\)"/);assert.match(rendered.svg,/data-tex="F&apos;\(−4,0\)"|data-tex="F'\(-4,0\)"/);
  const pass=await auditEllipseSvg({plan,svg:rendered.svg});assert.equal(pass.status,'PASS',JSON.stringify(pass.errors));
  const wrong=rendered.svg.replace('data-tex="F(4,0)"','data-tex="F(5,0)"');assert.notEqual(wrong,rendered.svg);
  assert.ok(has(await auditEllipseSvg({plan,svg:wrong}),'LABEL_TEXT_MISMATCH:F'));
  // only a boolean is a flag
  await assert.rejects(()=>solveEllipseFigure(vector({},{points:[{id:'F',kind:'FOCUS',side:1,coordinates:'yes'},{id:'O',kind:'ORIGIN'}]})),error=>/ELLIPSE_POINT_INVALID/.test(error.message));
});

test('N06: the frame can be widened step by step, the first step is the frame the figure always had',async()=>{
  const plan=vector(),model=await solveEllipseFigure(plan);
  assert.deepEqual([...ELLIPSE_FRAME_STEPS],[0,24,48,80,120]);
  const size=ellipseFigureSize(model);
  assert.deepEqual(size,ellipseFigureSize(model),'asking again does not change it');
  setEllipseFrameExtra(model,48);
  const wide=ellipseFigureSize(model);
  assert.equal(wide.width,size.width+96);assert.equal(wide.height,size.height+96);
  const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy:policy});
  assert.deepEqual(rendered.spec.size,wide);
  assert.equal((await auditEllipseSvg({plan,svg:rendered.svg})).status,'PASS');
  setEllipseFrameExtra(model,0);assert.deepEqual(ellipseFigureSize(model),size);
  assert.throws(()=>setEllipseFrameExtra(model,7),/ELLIPSE_FRAME_EXTRA_INVALID/);
});
