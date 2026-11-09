// EXT-20261109-g: one face in a figure. Pure model/spec checks (no Chrome).
//  - a figure caption may hold a stacked fraction (frac command) and, opt-in, plain text in the weight of the math beside it (weight "MATH");
//  - a probability tree draws its Korean/plain node names in that weight when chart.labelWeight is "MATH" (without it the spec is exactly as before);
//  - a mapping column name such as f(f(x)) (7 characters) is a math label like f(x).
import test from 'node:test';
import assert from 'node:assert/strict';
import {expandNumberLineFigure,captionMathValid,captionValid} from '../production/number-line-v1.mjs';
import {solveStatChart,statChartSpec,FIGURE_CAPABILITY as STAT} from '../production/stat-chart-v1.mjs';
import {solveDiagram,setDiagramSpec,FIGURE_CAPABILITY as SET} from '../production/set-diagram-v1.mjs';

const B=String.fromCharCode(92);
const numberLine={rows:[{kind:'POINTS',band:false,points:[{id:'A',value:'-1',hideName:true},{id:'B',value:'1',hideName:true}],spans:[{from:'A',to:'B',label:'2A',side:'ABOVE'}]}],axisVariable:false};
const nlPlan=numberLineCaption=>({capability:'number-line-figure-v1',numberLine,...(numberLineCaption?{numberLineCaption}:{}),caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'numberLine'}],newVisualInformation:['n']});

test('caption math: stacked fractions are allowed, malformed ones are not',()=>{
  for(const ok of ['u=(X-m)/k','a=1/8','V=8a^5b^3','u='+B+'frac{X-m}{k}','x='+B+'frac{1}{2}'])assert.equal(captionMathValid(ok),true,ok);
  for(const bad of ['','u='+B+'frac','u='+B+'frac{X-m{k}','u='+B+'sqrt{2}','u='+B+'frac{X-m}{k}}','a b','x'.repeat(25)])assert.equal(captionMathValid(bad),false,bad);
  assert.equal(captionValid({text:'가',weight:'MATH'}),true);
  assert.equal(captionValid({math:'k=2',weight:'MATH'}),false,'weight needs text');
  assert.equal(captionValid({text:'가',weight:'BOLD'}),false);
  assert.equal(captionValid({text:'가',font:'x'}),false);
});
test('a number-line figure takes the frac caption and the weight, and still refuses a bad caption',()=>{
  const out=expandNumberLineFigure(nlPlan({math:'u='+B+'frac{X-m}{k}'}));
  assert.deepEqual(out.panels[0].caption,{math:'u='+B+'frac{X-m}{k}'});
  assert.deepEqual(expandNumberLineFigure(nlPlan({text:'가나',weight:'MATH'})).panels[0].caption,{text:'가나',weight:'MATH'});
  assert.deepEqual(expandNumberLineFigure(nlPlan()).panels[0].caption,{text:'수직선 위의 범위'});
  assert.throws(()=>expandNumberLineFigure(nlPlan({math:'k=2',weight:'MATH'})),error=>error.message==='CHAIN_CAPTION_INVALID');
  assert.throws(()=>expandNumberLineFigure(nlPlan({math:'u='+B+'frac{X'})),error=>error.message==='CHAIN_CAPTION_INVALID');
});

const statPlan=chart=>({capability:STAT,chart,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'chart'}],newVisualInformation:['n']});
const tree=extra=>({kind:'TREE',root:{label:'한 발',children:[{label:'+5점',p:'1/5'},{label:'\u22122점',p:'4/5'}]},...extra});
test('tree labelWeight MATH weights only the plain-text node names; the default spec is unchanged',()=>{
  const plain=statChartSpec(statPlan(tree()),solveStatChart(tree()),{fontPx:20});
  assert.equal(plain.labels.some(label=>Object.hasOwn(label,'weight')),false);
  const heavy=tree({labelWeight:'MATH'}),spec=statChartSpec(statPlan(heavy),solveStatChart(heavy),{fontPx:20});
  const nodes=spec.labels.filter(label=>label.role==='node'),probabilities=spec.labels.filter(label=>label.role==='branch-probability');
  assert.equal(nodes.length,3);assert.ok(nodes.every(label=>label.kind==='TEXT'&&label.weight==='MATH'));
  assert.ok(probabilities.length===2&&probabilities.every(label=>label.kind==='MATH'&&!Object.hasOwn(label,'weight')));
  assert.equal(solveStatChart(heavy).labelWeight,'MATH');assert.equal(Object.hasOwn(solveStatChart(tree()),'labelWeight'),false);
  const letters=tree({labelWeight:'MATH',root:{label:'A',children:[{label:'B',p:'1/2'},{label:'C',p:'1/2'}]}});
  assert.ok(statChartSpec(statPlan(letters),solveStatChart(letters),{fontPx:20}).labels.filter(label=>label.role==='node').every(label=>label.kind==='MATH'&&!Object.hasOwn(label,'weight')),'letter names stay math labels');
  for(const bad of ['BOLD','math',true])assert.throws(()=>solveStatChart(tree({labelWeight:bad})),error=>error.message==='STAT_TREE_LABEL_WEIGHT_INVALID');
});

const mapping=name=>({kind:'MAPPING',columns:[{id:'X',name:'x',elements:['u','v']},{id:'Y',name:'f(x)',elements:['u','v']},{id:'Z',name,elements:['u','v']}],
  arrows:[{from:{column:0,element:0},to:{column:1,element:1}},{from:{column:1,element:0},to:{column:2,element:1}}]});
test('a mapping column name of up to 8 letters, digits and parentheses is a math label',()=>{
  const kindOf=name=>{const diagram=mapping(name),plan={capability:SET,diagram,caption:'c',sourceConditions:[{id:'c1',condition:'c',mappedTo:'diagram'}],newVisualInformation:['n']};
    return setDiagramSpec(plan,solveDiagram(diagram)).labels.find(label=>label.id==='column-name-Z').kind;};
  assert.equal(kindOf('f(f(x))'),'MATH');assert.equal(kindOf('f(x)'),'MATH');assert.equal(kindOf('합성함수'),'TEXT');
});

// A surd coordinate or intercept from the construction engine never reads -1+(-1sqrt(10)), (0,(-1sqrt(10))) or y=x+(-sqrt(10)).
import {scalarExpression,lineEquationText} from '../production/phase2.mjs';
const I=value=>({kind:'integer',value:String(value)}),X=(op,...args)=>({kind:'expression',op,args}),R=(numerator,denominator)=>({kind:'rational',numerator:String(numerator),denominator:String(denominator)});
test('exact coordinates put the sign of a surd term outside the product and subtract a negated term',()=>{
  const s10=X('sqrt',I(10));
  assert.equal(scalarExpression(X('add',I(-1),X('mul',I(-1),s10))),'(-1-sqrt(10))');
  assert.equal(scalarExpression(X('mul',I(-1),s10)),'-sqrt(10)');
  assert.equal(scalarExpression(X('add',I(3),X('mul',I(-2),s10))),'(3-2*sqrt(10))','a negative integer coefficient: sign out, magnitude kept');
  assert.equal(scalarExpression(X('add',I(3),X('mul',I(2),s10))),'(3+(2*sqrt(10)))','a positive term is written as before');
  assert.equal(scalarExpression(X('mul',I(1),s10)),'sqrt(10)');
  assert.equal(scalarExpression(X('sub',I(1),X('mul',I(-1),s10))),'(1+sqrt(10))');
  assert.equal(scalarExpression(X('mul',R(8,5),s10)),'((8/5)*sqrt(10))','a rational factor is untouched');
  assert.equal(scalarExpression(X('neg',X('add',I(1),s10))),'-(1+sqrt(10))');
  assert.equal(scalarExpression(X('pow',X('neg',I(2)),I(3))),'((-2)^3)');
});
test('a line equation with a single negative surd intercept is written y=x-sqrt(10)',()=>{
  const surd=(p,q,r)=>({p:[BigInt(p),1n],q:[BigInt(q),1n],r:BigInt(r)});
  assert.equal(lineEquationText(surd(1,0,0),surd(-1,0,0),surd(0,-1,10),'SLOPE_INTERCEPT'),'y=x-sqrt(10)');
  assert.equal(lineEquationText(surd(1,0,0),surd(-1,0,0),surd(0,1,10),'SLOPE_INTERCEPT'),'y=x+sqrt(10)');
  assert.equal(lineEquationText(surd(1,0,0),surd(-1,0,0),surd(3,-2,3),'SLOPE_INTERCEPT'),'y=x+(3-2*sqrt(3))');
});
