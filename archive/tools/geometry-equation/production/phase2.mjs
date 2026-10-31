import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {invokeVisualContinuation,nativeImageInput} from '../../../../alive/runtime/provider-bridge/codex-appserver-adapter.mjs';
import {canonicalJson,objectSha,bytesSha,fileRef,readBoundFile} from '../../pipeline-core/canonical.mjs';
import {questionUidV2} from '../../pipeline-core/question-uid.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';
import {recordArchiveEvidence,measureArchiveDisplayEnvelope,normalizeArchiveImageUrlPath} from '../record-visual-browser-evidence.mjs';
import {assetIdentity,planHash} from './contracts.mjs';
import {commitStage,generatedPath,currentWorkRoot,bindRunWorkspace,withWorkRoot,isEngineOutputPath,calculationStage} from './store.mjs';
import {pythonWorker} from './worker.mjs';
import {pointNameModel} from './point-names.mjs';
import {readEquation,sameLine,frac} from './linear-text.mjs';
import {reconstruct,compareReconstruction} from './cindy-observer.mjs';
import {dependency,dependencyRoot} from './dependencies.mjs';
import {typesetter} from './typography.mjs';
import {scopeFingerprint,mathFingerprint} from './fingerprint.mjs';
import {quadraticVertexNotation} from './polynomial-notation.mjs';
import {bindNativeSolutionOverlayCandidate,compareSolutionTokenParity} from './native-solution-overlay.mjs';
import {validateSolutionEncodingAdjudication} from './encoding-adjudication.mjs';
import {captureDisplayProfiles} from './display-profile-audit.mjs';
import {planDisplayEnvelope,qualifyDisplayEnvelope,compareActualDisplayEnvelope,requestedProfileTypographyPolicy} from './display-envelope.mjs';
import {RepairBudget} from './repair-budget.mjs';
import {bindMeasuredOwnerSafeLabelRepair} from './layout-repair.mjs';
import {auditMeasuredOwnerSafeLabelRepair} from './layout-repair-audit.mjs';
import {SOURCE_REVIEW_INSTRUCTION,sourcePolicyFingerprint,verifiedSolutionPolicyFingerprint,sourceReviewClosed,verificationClosed} from './source-policy.mjs';
import {verifyConstructionConditionBindings} from './fact-display-map-v1.mjs';
export {verifyConstructionConditionBindings} from './fact-display-map-v1.mjs';

import {resolveQuestion,runQuestion} from './resolve-request.mjs';
import {blindThenCompare,reuseReviewAuthority,verificationBinding,conditionBinding,validateReviewLineage} from './blinded-review.mjs';
import {planeMarkSpec,planeMarkPointRefs,isPlaneFigure,isCoordinateFigure,unmarkedPointIds,planNameTexts,textNamesPoint,arcLabelFraming,dimensionFraming,traceJoinExtentPoints,textLabelExtentPoints,TEXT_LABEL_MATH,TEXT_LABEL_HANGUL,TEXT_LABEL_FUNCTIONS} from './plane-marks.mjs';
import {regionExtentPoints} from './plane-regions.mjs';
import {calloutEntries,calloutExtentPoints,calloutDimensionSites,calloutSpec} from './plane-callouts.mjs';

const GRAPH_OVERVIEW_CANVAS=Object.freeze({width:610,height:420,panel:140});
const QUADRATIC_OVERVIEW_CANVAS=Object.freeze({width:384,height:320,panel:140});
const QUADRATIC_HEADER_CANVAS=Object.freeze({width:512,height:400,panel:0,topInset:80});
// A panel of a three-panel composite: its formula and shared line rows sit outside the panel (composite-candidate-svg-v1), so no formula header.
const COMPOSITE_PANEL_CANVAS=Object.freeze({width:512,height:286,panel:0,topInset:0});
// A cubic/quartic panel of a two-panel composite keeps the overview plot and gains a header band above it for its (long) formula.
const CUBIC_COMPOSITE_PANEL_CANVAS=Object.freeze({width:610,height:480,panel:140,topInset:80});
// A quadratic framed at one scale (graph_framing equal_unit_frame) carries its plot size: the canvas is that plot plus the 32 px margins and,
// unless the composite writes the formula outside the panel, the 80 px formula header.
const equalUnitCanvas=p=>{
  const plot=p.plotCanvas,topInset=p.compositeHeader!==undefined?0:80;
  if(p.equalUnits!==true||!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640||p.overviewCanvasHeight!==undefined)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  return {width:512,height:plot.height+64+topInset,panel:0,topInset};
};
const RATIONAL_OVERVIEW_CANVAS=Object.freeze({width:520,height:420,panel:140});
// Band rows: 34 px apart, or 56 when a label in the row has a fraction (written at full text size, about 48 px high, plus the 6 px layout clearance).
const bandRowPitch=texts=>texts.some(text=>String(text).includes('/'))?56:34;
const bandRowCenters=(pitches,firstCenter)=>{let top=firstCenter-17;return pitches.map(pitch=>{const center=top+pitch/2;top+=pitch;return center;});};
const graphViewport=(values,canvas=GRAPH_OVERVIEW_CANVAS)=>({
  xMin:values[0],xMax:values[1],yMin:values[2],yMax:values[3],
  width:canvas.width,height:canvas.height,panel:canvas.panel
});
export function showConstructionCircles(plan){return plan?.mathPlan?.realization?.recipeId!=='SSS_POSITIVE_SIDE_v1';}
export function normalizeScalarLabelPrefix(value){
  if(typeof value!=='string')throw Error('SCALAR_LABEL_PREFIX_REQUIRED');
  const prefix=value.replace(/\s/g,'').replace(/=+$/,'').replaceAll('²','^2').replaceAll('³','^3');
  if(prefix&&!/^[A-Za-z]{1,2}(?:\^[23])?$/.test(prefix))throw Error('UNSUPPORTED_SCALAR_LABEL_PREFIX');
  return prefix;
}
const expLogDisplayBase=base=>base===undefined||base===null||base==='e'?'e':String(base);
const expLogPowerBase=base=>{const text=expLogDisplayBase(base);return text==='e'?'e':/^[0-9]+$/.test(text)?text:'('+text+')';};
const expLogExponentText=(k,shift)=>{
  const inner=!shift||shift==='0'?'x':shift.startsWith('-')?`x+${shift.slice(1)}`:`x-${shift}`;
  if(k==='1')return inner;
  if(k==='-1')return `-(${inner})`;
  return `(${k})*(${inner})`;
};
const expLogLinearText=(k,b)=>{
  const term=k==='1'?'x':k==='-1'?'-x':`(${k})*x`;
  if(b==='0')return term;
  return term+(b.startsWith('-')?b:'+'+b);
};
const expLogFormulaText=row=>{
  const base=expLogDisplayBase(row.base);
  if(row.family==='exponential-affine'){
    const [a,k,c]=row.coefficients;const prefix=a==='1'?'':a==='-1'?'-':a;
    const exponent=expLogExponentText(k,row.shiftX||'0');const power=`${expLogPowerBase(base)}^(${exponent})`;
    const tail=c==='0'?'':(c.startsWith('-')?c:'+'+c);
    return `y=${prefix}${power}${tail}`;
  }
  const [a,k,b,c]=row.coefficients;const prefix=a==='1'?'':a==='-1'?'-':a;
  const tail=c==='0'?'':(c.startsWith('-')?c:'+'+c);
  if(base==='e')return `y=${prefix}ln(${expLogLinearText(k,b)})${tail}`;
  return `y=${prefix}logb(${base},${expLogLinearText(k,b)})${tail}`;
};
const expLogExpression=row=>{
  const base=expLogDisplayBase(row.base);
  if(row.family==='exponential-affine'){
    const [a,k,c]=row.coefficients;const shift=row.shiftX||'0';
    if(base==='e'&&shift==='0')return `(${a})*exp((${k})*x)+(${c})`;
    const exponent=base==='e'?`(${k})*(x-(${shift}))`:`(${k})*ln(${base})*(x-(${shift}))`;
    return `(${a})*exp(${exponent})+(${c})`;
  }
  const [a,k,b,c]=row.coefficients;
  if(base==='e')return `(${a})*log((${k})*x+(${b}))+(${c})`;
  return `(${a})*log((${k})*x+(${b}))/ln(${base})+(${c})`;
};
function axisTickDisplayFacts(graphPlan){
  const values=graphPlan.axisTickValues;
  const facts={};
  if(values!==undefined){
    if(!values||Object.keys(values).sort().join(',')!=='x,y'||['x','y'].some(axis=>!Array.isArray(values[axis])))throw Error('INVALID_GRAPH_AXIS_TICK_VALUES');
    facts.axisTickValues=values;
  }
  if(graphPlan.tickLabelCallouts!==undefined){
    const callouts=graphPlan.tickLabelCallouts;
    if(!Array.isArray(callouts)||callouts.length!==1)throw Error('INVALID_TICK_LABEL_CALLOUTS');
    const callout=callouts[0];
    if(!callout||Object.keys(callout).sort().join(',')!=='axis,offsetUser,value'||callout.axis!=='x'||callout.value!=='-6'||!Array.isArray(callout.offsetUser)||callout.offsetUser.length!==2||callout.offsetUser[0]!==28||callout.offsetUser[1]!==-22)throw Error('INVALID_TICK_LABEL_CALLOUTS');
    facts.tickLabelCallouts=callouts;
  }
  return facts;
}
function exactFraction(value){
  const match=String(value).match(/^(-?)(\d+)(?:\/(\d+))?$/);
  if(!match)throw Error('INVALID_TRIG_PI_TICK_VALUE');
  const magnitude=Number(match[2])/(match[3]?Number(match[3]):1);
  return match[1]==='-'?-magnitude:magnitude;
}
function piTickText(value){
  let text=String(value),sign='';
  if(text.startsWith('-')){sign='−';text=text.slice(1);}
  const parts=text.split('/'),numerator=Number(parts[0]),denominator=parts[1]?Number(parts[1]):1;
  if(!Number.isSafeInteger(numerator)||!Number.isSafeInteger(denominator)||denominator<1)throw Error('INVALID_TRIG_PI_TICK_VALUE');
  const head=numerator===1?'π':numerator+'π';
  return sign+(denominator===1?head:head+'/'+denominator);
}
function trigTickFacts(p,axisUnit){
  if(p.axisTickPi!==true)return axisTickDisplayFacts(p);
  if(axisUnit!=='PI')throw Error('TRIG_TICK_PI_REQUIRES_PI_AXIS');
  const values=p.axisTickValues??{x:[],y:[]},rows=values.x.map(raw=>{const multiple=exactFraction(raw);return {multiple:String(raw),value:multiple*Math.PI,text:piTickText(raw)};});
  const facts=axisTickDisplayFacts({...p,axisTickValues:{x:rows.map(row=>String(row.value)),y:values.y}});
  return {...facts,tickPiLabels:rows.map(row=>({value:String(row.value),text:row.text,multiple:row.multiple}))};
}
function trigCoefficients(p){return p.ratePi!==undefined?[p.coefficients[0],p.coefficients[1]]:[p.coefficients[0],p.coefficients[2]];}
function trigExpression(p){
  const fn=p.function.toLowerCase(),[a,c]=trigCoefficients(p),rate=p.ratePi!==undefined?`(${p.ratePi})*pi`:`(${p.coefficients[1]})`,phase=p.phasePi!==undefined?`(${p.phasePi})*pi`:`(${p.phase})`;
  return `(${a})*${fn}((${rate})*x+(${phase}))+(${c})`;
}
function trigAxisX(value,axisUnit){const number=exactFraction(value);return axisUnit==='PI'?number*Math.PI:number;}

export function displayGeometryInventory(plan,model){
  const select=(field,available,type,defaults=null)=>{
    // The unit-axis helper (NORMALIZATION_AXIS) only fixes the scale in a source-coordinate frame; it is not drawn unless a plan lists it.
    const frameHelpers=new Set(plan.mathPlan.nodes.filter(n=>n.op==='NORMALIZATION_AXIS').map(n=>n.id));
    const ids=plan[field]??defaults??Object.keys(available||{}).filter(id=>!(type==='POINT'&&frameHelpers.has(id)));
    if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.some(id=>!Object.hasOwn(available||{},id)))throw Error('INVALID_DISPLAY_GEOMETRY_INVENTORY:'+field);
    const mandatory=plan.mathPlan.nodes.filter(n=>n.outputType===type&&!n.op.startsWith('NORMALIZATION_')&&(n.op==='SOURCE_POINT'||['GIVEN','CONCLUSION'].includes(n.factRole))).map(n=>n.id);
    if(mandatory.some(id=>!ids.includes(id)))throw Error('REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:'+field);
    return Object.fromEntries(ids.map(id=>[id,available[id]]));
  };
  const points=select('displayPoints',model.points,'POINT'),lines=select('displayLines',model.lines,'LINE');
  // With the axes drawn (SOURCE_COORDINATES) a line ax+by+c=0 that is x=0 or y=0 is the axis itself: every consumer leaves it out
  // of the drawing and of the expected geometry, and the spec records it as axisCoincidentLines.
  const onAxis=([a,b,c])=>{const eps=1e-9*Math.max(1,Math.hypot(a,b));return Math.abs(c)<=eps&&(Math.abs(a)<=eps||Math.abs(b)<=eps);};
  const axisCoincidentLines=model.coordinateMode==='SOURCE_COORDINATES'?Object.keys(lines).filter(id=>Array.isArray(lines[id]?.approximation)&&lines[id].approximation.length===3&&onAxis(lines[id].approximation)):[];
  for(const id of axisCoincidentLines)delete lines[id];
  for(const id of [...(plan.coordinateLabels||[]),...(plan.displaySegments||[]).flatMap(s=>s.refs),...(plan.rightAngles||[]).flatMap(a=>a.refs),...planeMarkPointRefs(plan)])if(!Object.hasOwn(points,id))throw Error('DISPLAY_ANNOTATION_POINT_NOT_VISIBLE:'+id);
  const axisHelperCircles=plan.mathPlan.realization?.recipeId==='SOURCE_COORDINATE_AXES_v1'?plan.mathPlan.nodes.filter(n=>n.outputType==='CIRCLE'&&['GIVEN','CONCLUSION'].includes(n.factRole)).map(n=>n.id):null;
  return {points,lines,circles:showConstructionCircles(plan)?select('displayCircles',model.circles,'CIRCLE',axisHelperCircles):{},axisCoincidentLines};
}
export function compileConstructionWirePlan(input){
  if(!input.mathPlan?.conditionAudits)return input;
  const plan=JSON.parse(JSON.stringify(input));
  plan.mathPlan.conditionAudits=plan.mathPlan.conditionAudits.map((audit,index)=>{
    if(!audit||typeof audit!=='object'||Array.isArray(audit))throw Error('CONDITION_AUDIT_INVALID');
    if(audit.type!==undefined&&audit.kind!==undefined&&audit.type!==audit.kind)throw Error('CONDITION_AUDIT_TYPE_ALIAS_CONFLICT');
    const kind=audit.kind??audit.type;
    if(typeof kind!=='string'||!kind)throw Error('CONDITION_AUDIT_KIND_REQUIRED');
    if(audit.id!==undefined&&(typeof audit.id!=='string'||!audit.id))throw Error('CONDITION_AUDIT_ID_INVALID');
    const normalized={...audit,id:audit.id??'conditionAudit'+(index+1),kind};delete normalized.type;return normalized;
  });
  if(new Set(plan.mathPlan.conditionAudits.map(audit=>audit.id)).size!==plan.mathPlan.conditionAudits.length)throw Error('CONDITION_AUDIT_ID_DUPLICATE');
  return plan;
}

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const schema={type:'object',properties:{status:{type:'string',enum:['PASS','FAIL','UNSUPPORTED']},payload:{type:'string'}},required:['status','payload'],additionalProperties:false};
const compilerContract=`Return payload as a JSON object. For geometry: {capability:'construction-spike-v1',mathPlan:{schemaVersion:'construction-spike-v1',nodes:[...]},displaySegments:[{id,refs:[pointId,pointId]}],coordinateLabels:[pointId],caption:string}. Each node has id (ASCII alphanumeric starts letter), op, inputs, args, outputType, factRole GIVEN/DERIVED_INTERMEDIATE/CONCLUSION. Supported ops SOURCE_POINT (args coordinates=[typedScalar,typedScalar]), NORMALIZATION_ORIGIN(args {}; the coordinate origin, optional in displayPoints: if it is shown, give the node the id O when the stored solution calls it O, because a displayed point is labelled with its node id; otherwise leave it out), NORMALIZATION_AXIS(args length=typedScalar; outputType POINT, the point (length,0) on the x-axis, not a scalar); SOURCE_POINT and NORMALIZATION_* nodes have inputs []. SOURCE_LINE (a line the problem gives only by its equation a x + b y + c = 0: args a,b,c = typedScalar, inputs [], outputType LINE, factRole GIVEN; the origin O, a displayed foot or an intersection point can mark where it is read, and a plan that shows several such lines lists them in displayLines; lineLabels:[{nodeId,form}] writes the equation of such a line beside it, form SLOPE_INTERCEPT (y=mx+n, only for a non-vertical line) or GENERAL (ax+by+c=0), built exactly from its coefficients, so give the form the problem uses), MIDPOINT, LINE_THROUGH, PERPENDICULAR_FOOT, CIRCLE_CENTER_RADIUS(args radius=typedScalar), INTERSECTION (POINT_SET; inputs are [line, circle] in that order, [circle, circle] or [line, line]), SELECT_POINT (a node-level branch field, not inside args: branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:[A,B],sign:1|-1}, sign a number). All other point outputs POINT, lines LINE, circles CIRCLE. Derived points must never have raw coordinates. typedScalar={kind:'integer',value:'decimal integer'} or {kind:'rational',numerator:'...',denominator:'...'} or {kind:'expression',op:'sqrt'|'add'|'sub'|'mul'|'div'|'neg'|'pow',args:[typedScalars]}. For coordinate-free SSS use realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true} inside mathPlan, A origin, B positive x at source AB distance, C selected positive side of two circles. The circles in this realization are construction aids and must not be rendered; render only explicitly listed display segments and source marks. Use source length values, and compute any necessary missing distance exactly from verified solution (e.g sqrt(34)). Explicitly state source bindings for each introduced normalization/label in conditions. For a polynomial source graph only: {capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['constant','x coefficient','x squared coefficient',...],domain:[lo,hi],viewport:[xmin,xmax,ymin,ymax]},caption:string}. Coefficients are exact integer or rational strings; max degree4. Domain/viewports must show the source's decisive structure. Put sourceDomain, requiredPoints and axisTickValues inside graphPlan, never at the top level. Always set graphPlan.axisTickValues to {x:[],y:[]}: every requiredPoint is drawn with its own coordinate label, so never choose tick values for a polynomial graph. When the stored solution substitutes a new variable (for example t=x^2-2x) and draws the graph in that variable, set graphPlan.axisVariable to its single lowercase letter (not y); the horizontal axis and the formula label are then written with it, and coefficients are the powers of that variable. Leave it out for an ordinary graph in x. A quadratic graph may also carry straight lines: graphPlan.lines:[{id,slope,intercept,through:[point IDs],tangentAt:point ID (optional)}] with exact value strings for y=slope*x+intercept (integers, fractions, sqrt(...), + - * / and parentheses, for example "4-2*sqrt(3)"). Points on the curve stay in requiredPoints; points that lie only on a line go to graphPlan.linePoints:[{id,x,y}]. through lists every key point the line passes through, and tangentAt names the requiredPoint where the line touches the curve; both are checked exactly. requiredPoints and linePoints keep numeric x,y; when a point's coordinates are not integers, give their exact values as graphPlan.exactCoordinates:{pointId:["-3/2","9/2"]} (same exact value strings) so the point gets a coordinate label; a point without integer or exact coordinates is drawn as a bare dot. A vertical line, a second curve or a shaded region is not supported. When the solution compares two or three cases or parameter values, each with one quadratic (and its lines), use {capability:'composite-panels-v1',panels:[{caption:{math:'k=-2',text:'일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{...}}},...],caption,sourceConditions,newVisualInformation}: 2 panels (3 only if the whole stack still fits one page; a stack taller than about 640 CSS px is refused) stacked top to bottom, each panel plan following the quadratic graph contract above, each caption a short math part (plain ASCII such as k=-2, a=1 or a=1/8, no TeX commands) and/or a short Korean text part naming its case. Two cubic/quartic cases are also a two-panel composite (for example a=-1 and a=1/8 cubics with repeated roots): each panel plan follows the cubic/quartic contract (sourceDomain ALL_REALS) and keeps its own formula in an 80 px header band above its plot; a three-panel stack stays quadratic-only. Declare sourceDomain:{kind:'ALL_REALS'} only when the source polynomial has no restriction; otherwise declare {kind:'INTERVAL',range:[lo,hi],states:[start,end]} (a quadratic only; lo and hi are exact numbers or fraction strings; each state is 'CLOSED' for ≤ or 'OPEN' for <, both 'CLOSED' when omitted). The curve is then drawn only on that interval, with a filled dot at a closed end and a hollow dot at an open end; every requiredPoint must lie in the interval and none on an open end.Preserve all source-required points/tangency anchors/intercepts as requiredPoints:[{id:string,x:number,y:number}]; these are independently reviewed source/solution features, never convenient invented points. The main overview must show the vertex and enough of both arms to make the opening and symmetry legible. A local detail cannot replace the overview. Do not guess symbolic coefficients. Reject unsupported source. caption is short student-facing Korean, with no internal/debug terms. Either plan must have sourceConditions:[{id:string,condition:string,mappedTo:string|string[]}]; mappedTo names one or more targets in the plan or PRESERVED_ARCHIVE_BANK. Include newVisualInformation:[string] and no unsupported source condition. No SVG, raw derived coordinates, or measurements.`;
const CUBIC_QUARTIC_CONTRACT=` IF AND ONLY IF the source visual is a polynomial graph of exact degree 3 or 4, apply this separate bounded contract; otherwise ignore this clause and follow the existing geometry/quadratic rules. Such cubic/quartic graph coefficients must have exact degree 3 or 4 and sourceDomain must be exactly {kind:'ALL_REALS'}; restricted intervals are unsupported in this slice. Do not apply quadratic vertex framing to these graphs. The overview framer derives and binds all real roots, derivative roots (extrema or stationary inflections), inflection points, multiplicities, and left/right tail directions from the exact coefficient strings. The independent observer must recompute this inventory from the source polynomial and check every feature and tail against the final rendered polyline. Repeated real roots keep their exact multiplicity: a double (even multiplicity) root is a tangency point where the curve touches the x-axis and stays on one side, a triple root crosses the axis with a flattening; overviewFeatures records the root multiplicity, and the observer recomputes it from the source polynomial and checks the final rendered polyline (it reaches the axis at each root, stays on one side at an even root, changes side at an odd root, and a multiplicity-3 root keeps a readable flat band). A repeated root of degree 3 or 4 is a root of a rational quadratic factor (rational or p+q*sqrt(r)), so it is representable; a repeat whose isolation cannot be pinned down is refused with UNSUPPORTED_CUBIC_QUARTIC_REPEATED_ROOT_IMPRECISE. Root/feature separations below one actual CSS pixel at the audited profile are unsupported (the observer returns UNSUPPORTED with OVERVIEW_ROOTS_BELOW_DISPLAY_RESOLUTION or OVERVIEW_FEATURES_BELOW_DISPLAY_RESOLUTION). For degree 3 or 4 the formula header writes the polynomial with stacked fractions (x^3-3/4*x-1/4), never parentheses around a fraction. Do not invent source-required points; preserve those separately in requiredPoints.`;
const RATIONAL_CONTRACT=` IF AND ONLY IF the source visual is a rational graph of capability 'rational-spike-v1', apply this separate bounded contract. graphPlan.family must be 'rational', numerator and denominator must each be exactly two integer/rational coefficient strings in ascending powers, the denominator's x coefficient must be nonzero, the numerator's x coefficient is nonzero (linear over linear) or zero with a nonzero constant (inverse proportion y=k/(d0+d1*x), described below), and sourceDomain must be exactly {kind:'ALL_REALS'} (meaning no additional interval restriction; natural denominator exclusions remain). The denominator therefore has exactly one simple real root. The numerator either does not vanish there (one vertical pole) or vanishes there (one removable hole); the overview must mark that pole or open hole and the exact horizontal asymptote y=numeratorLeading/denominatorLeading. Preserve the original denominator exclusion even when it cancels. The observer independently recomputes the singularity kind/location, horizontal asymptote, numerator zero, and visible branch coverage from exact coefficients, then checks pole-side separation, asymptote markers, and hole marker on the final SVG. Numerator/denominator degree above one, multiple denominator roots, nonreal denominator roots, oblique asymptotes, additional source intervals, and sub-resolution features are unsupported. INVERSE PROPORTION (nonzero constant numerator, middle school y=k/x or y=k/(d0+d1*x)): one vertical pole at x=-d0/d1 and the horizontal asymptote y=0, which is the x-axis; there is no x-intercept and no hole. An asymptote that coincides with a coordinate axis is the axis itself, so no dashed line is drawn over it (y=0 always; x=0 for y=k/x), and only a vertical asymptote off the y-axis is dashed and labelled x=p. The figure keeps one scale on both axes (a vertical squeeze of at most 1/2 only after a failure) and shows both branches. Optional graphPlan.formulaLabel (at most 40 characters of formula text such as y=b/x) replaces the printed formula for a symbolic constant; requiredPoints {id,x,y} are drawn as dots with their coordinates (exactCoordinates gives exact text). A zero numerator is refused with UNSUPPORTED_RATIONAL_NUMERATOR_ZERO and a pole too far from the origin to share one scale with it with EQUAL_UNIT_CURVE_TOO_NARROW. The observer recomputes the pole, the branch sides, which asymptotes are drawn (none on an axis) and every required point from the exact coefficients and reads the final SVG. No polynomial quadratic/cubic framing clause applies to this rational family.`;
const SQRT_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is the square root of an affine radicand, use the distinct capability 'sqrt-affine-spike-v1' and graphPlan.family 'sqrt-affine'. radicand must be exactly [constant,x coefficient] as exact integer/rational or p+q*sqrt(r) strings with a nonzero x coefficient. The general form y=q+s*k*sqrt(a*(x-p)) uses the same plan with optional exact amplitude k>0 (default 1), sign s in {1,-1} (default 1) and offset q (default 0); the starting point is (p,q) with p=-constant/a, a>0 opens the branch to the right (x>=p) and a<0 to the left (x<=p), and s*k>0 runs the tail upward while s*k<0 runs it downward. sourceDomain must be exactly {kind:'NATURAL_SQRT_AFFINE'} for the full natural domain on the branch side, or {kind:'CLOSED_INTERVAL',range:[exact lower,exact upper]} for a closed finite source interval inside the natural domain. For the natural mode the sampled domain starts exactly at that root; for CLOSED_INTERVAL the sampled domain must equal the source interval byte-for-byte in numeric value and must never be expanded. Open intervals, intervals outside the natural domain, a zero radicand slope, nonlinear or mixed radicands, and unreviewed compositions are unsupported. Derive and mark every closed source endpoint (both ends for CLOSED_INTERVAL). requiredPoints are {id,x,y} points on the curve; exactCoordinates {id:[exact x,exact y]} prints their exact coordinate labels; domainRangeLabels:true writes the domain and range inequalities. Independently verify the final curve begins/ends at the bound endpoint(s), contains no points outside the source domain, and moves in the single monotone direction implied by a*s*k. The viewport may have a display-only margin beyond the drawn domain, but that margin is not part of the sampled domain.`;
const ABSOLUTE_VALUE_CONTRACT=` IF AND ONLY IF the source graph is an absolute value of an affine function with an outer affine scale/offset, use the distinct capability 'absolute-value-spike-v1' and graphPlan.family 'absolute-value'. coefficients must be exactly [b,a,k,c] as rational strings for y=k*abs(a*x+b)+c; a and k must both be nonzero and sourceDomain must be exactly {kind:'ALL_REALS'}. Restricted source intervals, multiple absolute-value operators, mixed compositions, and a zero inner slope/outer scale are unsupported. Derive the exact corner, each real x-intercept when present, left/right branch slopes and tail directions. The final curve must keep two visible affine arms meeting at the exact corner; mark the corner with one closed outlined marker. The independent observer checks both one-sided slopes and actual-profile arm span/rise; do not smooth or bridge the corner with one chord.`;
const PIECEWISE_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly one two-branch piecewise-affine function on a finite closed interval, use the separate capability 'piecewise-affine-spike-v1' and graphPlan.family 'piecewise-affine'. sourceDomain must be exactly {kind:'CLOSED_INTERVAL',range:[lo,hi]} with canonical integer/rational strings and lo<hi. Include exactly one strict interior breakpoint and exactly two affine branches with rational coefficient strings; no nested cases, overlapping breakpoints, open outer domain, or unreviewed extra domains are supported. Set graphPlan.domain to the numeric values of the exact source interval without expansion. The piecewise field must declare {breakX,owner,left,right}; owner is LEFT or RIGHT and determines the function value at the breakpoint. Derive both one-sided limits exactly: if they differ, render a closed marker at the owner value and an open marker at the non-owner limit, with separate curves and no connecting segment; if they are equal, render one closed marker. Both outer source endpoints are closed and marked. The independent observer must recompute interval ownership and branch equations from exact coefficients, then verify each final polyline covers only its own interval, reaches its exact endpoint, and has no cross-break chord; overlapping or ambiguous ownership is unsupported.`;
const EXPONENTIAL_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly y=A*exp(k*x)+C with natural exponential (or the same shape with an explicit positive base and optional exponent shift, below), use the separate capability 'exponential-affine-spike-v1' and graphPlan.family 'exponential-affine'. coefficients must be exact rational strings [A,k,C], A and k nonzero, and sourceDomain exactly {kind:'ALL_REALS'}. The frozen overview binds the exact reference point at exponent zero, strict monotonicity sign(A*k), horizontal asymptote y=C and the side/approach direction, and growth-side direction. Keep x=0 visible, sample only a display overview that retains the original all-real source-domain meaning, and show the asymptote plus reference marker. Mixed exponents, non-natural bases, compositions, restricted source domains, and unsupported scale ranges are unsupported. The independent observer recomputes the function, monotonicity, reference and asymptote from exact coefficients, then checks the final curve and marker at the measured profile. BASE SUPPORT (exponential-affine-spike-v1): add graphPlan.base as an exact positive integer string ('2', '3'), fraction string ('1/2', '3/2') or 'sqrt(n)' (n a square-free integer > 1) and optionally graphPlan.shiftX (exact integer/fraction string, the horizontal shift p) for y=A*base^(k*(x-p))+C. The reference point is (p,A+C), the asymptote y=C, and for base<1 the growth side flips (k>0 with base<1 grows to the left). Natural base e is the omitted default. The formula label is typeset from the coefficients and base. A symbolic base, base<=0 or base=1, nested/unsimplified radicals, decimals and unsupported scale ranges are refused with an explicit base error code. TWO CURVES / INVERSE PAIR: use capability 'exp-log-pair-spike-v1' with graphPlan {family:'exp-log-pair',curves:[{id,family:'exponential-affine'|'logarithmic-affine',base,coefficients,sourceDomain,shiftX?},...],identityLine:true|false} (exactly two curves, at most one of each family is typical); the engine frames both curves and draws their asymptotes/boundaries, reference markers and the dashed identity line y=x. The observer recomputes each curve, its reference point and asymptote/boundary independently.`;
const LOGARITHMIC_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly y=A*ln(k*x+b)+C with natural logarithm, use the separate capability 'logarithmic-affine-spike-v1' and graphPlan.family 'logarithmic-affine'. coefficients must be exact rational strings [A,k,b,C], A and k nonzero, and sourceDomain exactly {kind:'NATURAL_LOG_AFFINE'} meaning k*x+b>0. The exact open boundary is x=-b/k; the reference point uses argument 1 at x=(1-b)/k and y=C. The overview samples only inside the natural domain and shows the boundary with a dashed vertical cue, the reference marker, strict monotonicity sign(A*k), and the correct one-sided unbounded trend. Restricted intervals and mixed compositions are unsupported. The independent observer recomputes boundary/reference/monotonicity from exact coefficients and checks the final curve stays on the valid side and approaches the boundary correctly at measured size. LOG BASE SUPPORT (logarithmic-affine-spike-v1): add graphPlan.base exactly as for the exponential family (integer, fraction or sqrt(n); natural e is the omitted default) for y=A*log_base(k*x+b)+C. The open boundary x=-b/k and the reference point argument 1 at x=(1-b)/k are unchanged; a base<1 reverses the increasing/decreasing direction. A symbolic base, base<=0 or base=1, nested radicals and decimals are refused with an explicit base error code.`;
const TRIGONOMETRIC_CONTRACT=` IF AND ONLY IF the source graph is one uncomposed sine, cosine, or tangent function y=A*F(k*x+phasePi*pi)+C, use the distinct capability 'trigonometric-spike-v1' and graphPlan.family 'trigonometric'. F is exactly SIN, COS, or TAN; coefficients are exact rational strings [A,k,C], A and k are nonzero, and phasePi is a canonical rational multiple of pi. SIN/COS require sourceDomain {kind:'ALL_REALS'} and the overview displays one full exact period, marking and independently checking both extrema and all midline crossings (including roots where y=0). TAN requires sourceDomain {kind:'ALL_REALS_WITH_TAN_POLES'} and displays exactly one complete branch between adjacent poles with both dashed pole cues, no cross-pole chord, and monotonic direction sign(A*k). Mixed identities, powers/compositions, restricted source intervals, and unsupported non-natural phase representations are unsupported. The independent observer recomputes period, phase, amplitude/midline, feature locations or poles and branch coverage from exact coefficients and verifies the final rendered SVG at measured profiles. SEVERAL PERIODS WITH REFERENCE LINES (SIN or COS only): for a solution that counts the crossings of y=A*F(k*x+phasePi*pi)+C with a horizontal or slanted line on an explicit interval, set graphPlan.sourceDomain:{kind:'INTERVAL_PI',rangePi:[lo,hi],states:[start,end]} (lo<hi exact canonical rational multiples of pi such as \"0\" and \"6\"; each state OPEN or CLOSED, CLOSED when omitted; from 1/4 to 12 periods) and graphPlan.referenceLines:[{id,y,intersectionCount}] for a horizontal line or [{id,slope,intercept,intersectionCount}] for a slanted one (at most three; id one letter then letters or digits; y, slope, intercept exact integer or fraction strings, slope not 0; a letter parameter is drawn at one sample value that the caption states). intersectionCount is the author's claim of how many times the line meets the curve inside the interval (a touching point counts once, an open end is not in the interval). The engine finds every crossing (closed form for a horizontal line, sign changes for a slanted one) and the independent observer finds them again with SymPy and 40-digit root scans of the gap and its derivative, then checks the final SVG: the curve over exactly the interval, both end markers (hollow for OPEN, filled for CLOSED, with the end label k*pi), each line and one dot per crossing. domain and viewport are reframed by the engine. Refused with a code: TRIG_LINE_INTERSECTION_COUNT_MISMATCH:<id>:engine finds N intersection(s) (wrong claim, or a slanted line that only touches the curve), TRIG_LINE_THROUGH_INTERVAL_END:<id> (a crossing at a closed end), TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED, INVALID_TRIG_INTERVAL, TRIG_LINE_FORM_INVALID:<id>, TRIG_LINE_SLOPE_ZERO:<id>, TRIG_LINE_COEFFICIENT_INVALID:<id>, TRIG_LINE_INTERSECTION_COUNT_INVALID:<id>, TRIG_REFERENCE_LINES_INVALID, TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI (lines on the one-period form), TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED (TAN or a malformed interval). GENERAL PARAMETERS (ratePi/phase) EXTEND THIS. graphPlan.ratePi carries the pi factor in the rate: when it is present the rate is ratePi*pi and coefficients are [A,C] (A amplitude, C midline); when it is absent the rate is coefficients[1] (plain, no pi) with coefficients [A,k,C]. The phase is exactly one of phasePi (a rational multiple of pi) or phase (radians). The period is 2/|rate| for SIN/COS and 1/|rate| for TAN. On an interval the sourceDomain is either {kind:'INTERVAL',range:[lo,hi],states:[start,end]} measured in plain x units, which requires ratePi, or {kind:'INTERVAL_PI',rangePi:[lo,hi],states:[start,end]} measured in pi units, which requires a plain rate and a pi-multiple phase; from 1/4 to 12 periods. keyPoints:true (SIN/COS with a pi-multiple phase only) marks every exact extremum and midline crossing inside the interval, at most 60. axisTickPi:true on a pi-unit interval relabels axisTickValues.x as exact nonzero multiples of pi (pi/2, pi, 3*pi/2) that must lie inside the view. TAN on an interval draws every branch between its poles with each pole dashed, requires at least one pole strictly inside, and refuses a pole at a closed end or any referenceLines. Refused with a code: TRIG_GRAMMAR_UNSUPPORTED, INVALID_TRIGONOMETRIC_RATE, TRIGONOMETRIC_COEFFICIENT_INVALID, INVALID_TRIGONOMETRIC_PHASE, TRIGONOMETRIC_NONZERO_SCALE_AND_RATE_REQUIRED, TRIG_INTERVAL_REQUIRES_RATE_PI, TRIG_RATE_PI_REQUIRES_PLAIN_INTERVAL, TRIG_INTERVAL_PI_PHASE_MUST_BE_PI, TRIG_PHASE_RATIONAL_REQUIRES_INTERVAL, TRIG_KEY_POINTS_REQUIRE_SIN_COS, TRIG_KEY_POINTS_REQUIRE_RATIONAL_PHASE, TRIG_KEY_POINTS_TOO_MANY, INVALID_TRIG_KEY_POINTS, TRIG_TAN_REFERENCE_LINES_UNSUPPORTED, TRIG_TAN_REQUIRES_PI_PHASE, TRIG_TAN_POLE_AT_INTERVAL_END, TRIG_TAN_INTERVAL_NO_POLE, TRIG_TICK_PI_REQUIRES_PI_AXIS, INVALID_TRIG_TICK_PI_FLAG, INVALID_TRIG_AXIS_TICK_VALUES, TRIG_PI_TICK_VALUE_INVALID, TRIG_PI_TICK_OUTSIDE_VIEW, UNSUPPORTED_TRIGONOMETRIC_NUMERIC_SCOPE. The independent observer recomputes the curve samples, key points, crossings, poles and pi tick labels from the same exact parameters and checks the final SVG.`;
const SOLID_FIGURE_CONTRACT=` SOLID FIGURES AND NETS (solid-figure-v1, middle school): when the stored solution needs a prism, pyramid, pyramid frustum, cylinder, cone, cone frustum, sphere or hemisphere drawn as a solid (hidden edges dashed, vertex names, lengths beside their edges), or the net of a prism, pyramid, cylinder or cone, use {capability:"solid-figure-v1",unit?:"cm",solids:[1 to 3 solids]|net:{...},dims?,highlights?,segments?,section?,solidCaption?:{text},caption,sourceConditions,newVisualInformation}. A solid is {kind:"PRISM",base,height,names?} (base {kind:"RECT",width,depth}|{kind:"REGULAR",n:3..8,side}|{kind:"POLYGON",points:[[u,v],...],plane?:"XY"|"XZ"} with at most 8 simple points; plane XZ makes the polygon a front face extruded by height along y, for a cuboid with a slanted cut), {kind:"PYRAMID",base,height,apex?:[x,y]} (convex base), {kind:"FRUSTUM",base,height,topScale:0..1,foot?}, {kind:"CYLINDER",radius,height}, {kind:"CONE",radius,height,orientation?}, {kind:"CONE_FRUSTUM",radius,topRadius,height,orientation?}, {kind:"SPHERE",radius}, {kind:"HEMISPHERE",radius}, {kind:"REGULAR_POLYHEDRON",faces:4|8|12|20,side} (the regular tetrahedron, octahedron, dodecahedron or icosahedron, every edge side long, standing on the floor; vertices in model order, faces f0, f1, ...; a cube is a PRISM over a RECT base) and {kind:"BIPYRAMID",base (convex),height} (two pyramids of that height on one base, vertices ring then upper apex then lower apex, faces top0.. and bottom0..; the apexes are #apex and #apex2); all lengths are real positive numbers and the figure is drawn to scale in one fixed projection. orientation is "APEX_UP" (default) or "APEX_DOWN": an apex-down cone/cone frustum is a vessel whose point (narrow end) rests on the base plane and whose wide circle is the rim at height h; radius is always the wide radius. A round solid may take inside:"s1" to sit on a cylinder s1's axis (a sphere, cone or cone frustum that fits inside it; a sphere inscribed in a cylinder of height 2r is the usual case). A SPHERE may take cut:{kind:"HALF"|"QUARTER"|"OCTANT"|"THREE_QUARTERS"|"SEVEN_EIGHTHS",facing?:"CUT"|"CURVED"}: the sphere cut by planes through its centre, only the piece that is left being drawn (a half with its flat disk, a quarter wedge between two perpendicular planes with its two half-disks, one eighth with its three quarter-disks, the sphere with a quarter wedge or one eighth taken out); the flat cut faces that face the viewer are shaded, edges behind the piece are dashed, a named centre (names:{center:"O"}) gets a dot, and dims:[{radius:"center"}] draws the radius along a half axis that is seen. facing CUT (default) turns the cut faces toward the viewer, CURVED turns the piece about its centre so that the curved surface faces the viewer and the cut faces are behind (a radius dim then has no seen radius and is refused); two pieces shown apart (a sphere cut in two) are two HALF solids side by side, and every piece keeps its own solid id for dims. cut is only for a SPHERE and does not combine with inside or count. names is a string of capital letters in the order base then top (or apex) ("ABCDEFGH", "." leaves a vertex unnamed) or {base,top,apex} (round solids {center,top,apex}); a list entry such as "M,A,I" (2 to 4 names) gives one polyhedron vertex several names, written as one label and usable in segments, dims and marks (a letters string ignores commas); without names the letters run A,B,C,... and a name is used once in the figure. A source figure that shows no vertex names keeps them unnamed (names all ".") and writes a vertex as a reference wherever a name is written (segments from/to, dims edge/from/to, highlights polygon, marks at/refs/segments): "#b0" the i-th vertex of the base ring (0-based, in the order of the base polygon), "#t2" the i-th of the top ring of a prism or frustum, "#apex" the apex of a pyramid, "#v5" the i-th vertex in model order (counting number k is #v(k-1)); with several polyhedra the solid id comes first ("s2#b0"), and a dims edge may be a list of two references ["#b1","#t1"]; a round solid or a solid with cuts takes no references. count:{vertices?:true,edges?:true} on a prism, pyramid or frustum writes counting numbers for a counting question: 1, 2, ... beside the vertices (in the order base ring then top ring or apex; the vertices must then be unnamed, names "........") and the circled numbers beside every edge midpoint, hidden edges too (around the base ring, up the sides, around the top ring; at most 20 edges); faces cannot be counted. dims draws a length beside its segment: {edge:"AB"} or {from,to} (a drawn edge or a segment of segments), {radius:"bottom"|"top"|"center"|"level"}, {height:true} (a pyramid, frustum, cylinder, cone), {slant:true} (cone, cone frustum), {level:true|"bottom"} (the height up to the LEVEL section) or {level:"top"} (the height from the LEVEL section up to the apex or top); an optional label (TeX) must equal the length when it is a number, otherwise it is a symbol such as r, h or 2r (symbols may use TeX commands such as the one for pi, written with one backslash); the engine writes exact lengths itself (5, 7.5, the square root form 5 times root 2, a multiple of pi) with the unit. cuts:[{through:[["AD","1/2","M"],["BC","1/2","N"],["CG","1/2","P"],["DH","1/2","Q"]],keep?:"F"}] on a PRISM, PYRAMID or FRUSTUM (one or two planes, one after the other, convex solids only) draws the solid that remains after a plane cuts a part off: through lists points, each [edge written as its two vertex names, "p/q" the fraction of the edge from the first named vertex (0<p/q<1), optional name of the new vertex ("." for none)], and vertices:["A","C","F"] lists corners of the solid (names, or in the first plane references "#b0" "#t2" "#apex" "#v5"), 3 to 6 points in all, in one plane (the plane through three corners next to B cuts the corner B off with no new vertex); the side with more vertices stays (equal numbers need keep, a vertex name that stays), a vertex on the plane stays, every edge crossing the plane gets a new vertex and the section becomes a face; names of removed vertices cannot be used afterwards, the second plane names edges of the solid left by the first, count and a height dim are not allowed with cuts. highlights:[{polygon:["E","G","C"]}] shades a planar polygon of drawn segments, and highlights:[{face:"side1",fill:"WARM"},{face:"top"},{face:"bottom",solid:"s1"}] shades a whole face of a prism, pyramid or frustum by its face name (bottom, top, side0, side1, ...: side i stands on the i-th edge of the base; no vertex names are needed, so a figure with unnamed vertices can be shaded; solid names the polyhedron when there are several; a hidden face is shaded through the faces in front of it; not on a solid with cuts or on a round solid), fill being LIGHT (default), MEDIUM, WARM, GREEN, ROSE or VIOLET, also on the polygon form, at most 8 highlights, an unknown face is SOLID_HIGHLIGHT_FACE_UNKNOWN and a bad tint SOLID_HIGHLIGHT_FILL_INVALID; segments:[{from,to,style:"SOLID"|"DASHED"|"AUTO",role:"REF"|"ACCENT"}] draws an extra segment (a diagonal, or an edge to emphasize; AUTO dashes it when the solid hides it). section:{kind:"AXIAL"} shades the plane through the axis of a cylinder, cone or frustum; section:{kind:"LEVEL",at:"1/3"} also cuts a whole sphere or a hemisphere (not nested, not cut) in the circle of radius sqrt(R^2-(z-zc)^2) at that fraction of its height (no AXIAL, fill or level dims there); it draws the horizontal plane at that fraction of the height and, on an apex-down vessel, fills the smaller similar vessel below the level and draws its two inner sides; on an apex-up cone, frustum or cylinder section:{kind:"LEVEL",at:"1/2",fill:"BOTTOM"|"TOP"} shades the body below the plane (a frustum cut off a cone) or above it (the small cone), its outline being the hull of the circles that bound that part (a fill on an apex-down vessel is SOLID_SECTION_FILL_UNSUPPORTED:APEX_DOWN, another value SOLID_SECTION_FILL_INVALID). marks:{rightAngles:[{at:"G",refs:["E","C"]}],equalLengths:[{count:1,segments:["AB","CD"]}],angles:[{refs:["B","A","D"],value?,arcs:1..3,equalGroup?}],equalSlant?:true|{solid?,count?}|[...]} draws right-angle squares, equal-length ticks and angle arcs on named points (equalSlant puts the same ticks on the left and the right slant of a cone or cone frustum, no names needed; its tick counts differ from those of every other group); the plan asserts a fact the engine checks in 3D (the two rays of a right angle are truly perpendicular, the equal group's segments truly have one length, the angle matches value within 0.5 degree) and both rays/segments must be drawn edges or segments; equalLengths groups have distinct counts 1..3 and equalGroup angles have one size and arc count. A net is {solid:{PRISM|PYRAMID|FRUSTUM},root:faceId,joins:[[parentFace,childFace],...],corners?:{faceId:[names]},dims?:[{face,edge,label?}],highlights?:[{face,fill?:"LIGHT"|"MEDIUM"}],segments?:[{face,edge,role?}|{face,diagonal:[i,j],role?}|{from,to,role?}]} with faces named bottom, top, side0, side1, ... (side i stands on base edge i); joins form a spanning tree of the faces (adjacent faces only) and the engine unfolds along it, refusing overlaps; highlights tints whole faces of the net and segments stresses one drawn edge in role "ACCENT" (red, default) or "REF" (bold black), either as the edge-th side of a face (cycle order, like dims) or as the two corner names written on the net (the same two names at two different drawn edges is refused; a fold written from both faces is one edge); {face,diagonal:[i,j]} (or the two corner names when no drawn edge carries them) draws and stresses the diagonal between two non-neighbouring corners i and j of one face, such as a diagonal the original net shows; a polyhedron net only; or {kind:"CYLINDER",radius,height,dims?:[{part:"rect-width"|"rect-height"|"radius-top"|"radius-bottom",label?}]}, or {kind:"CONE",radius,slant|height,dims?:[{part:"slant"|"arc"|"radius"|"angle",label?}]}. Any net may also carry faceLabels?:[{face,text?}] (one label in the middle of each listed face, wholly inside it: the exact area with the unit squared when text is omitted, a numeric text must equal that area, any other text is a symbol, or a face symbol that only numbers or names the face: one circled number (①-⑳), circled Hangul letter, Hangul letter or jamo (가, ㄴ), or such a letter in parentheses ((나)), no area is checked for it; a cylinder net has the faces rect, bottom and top, a cone net sector and base), a polyhedron net rightAngles?:[{face,corner}] (a small square at that corner of the face, counted in the face's cycle order, where the two edges are truly perpendicular; SOLID_NET_RIGHT_ANGLE_NOT_RIGHT lists the right corners), and a cylinder or cone net excluded?:["bottom","top"] or ["base"] (those circles are not part of the surface: drawn dashed and grey). A polyhedron net may carry edgeLabels?:[{face,edge,text?}] (at most 10, numbered after dims: no text writes the exact edge length, a TeX text a number that must equal it or a symbol, a text with Hangul (at most 12 characters, 밑변) a word that only names the edge; edge counts in the face's cycle order like dims). A rotation solid (CYLINDER, CONE, CONE_FRUSTUM, not nested) may carry axis:true or axis:{label:"회전축"}: its axis is drawn as a dash-dot line 14 percent of the height beyond both ends, with the word beside it. Any figure may carry labels:[{text,at}] (at most 6; text is a short Korean/English word of at most 12 characters copied from the source figure, never TeX; at is a vertex name or reference, {axis:true}, {slant:true}, {edge:[a,b]} or {face:"side0"} (a visible face of an uncut polyhedron), plus solid when several solids; one word per target; a net takes none). A figure needs at least one name, length or word (a face label counts), or something stressed (a shaded face, segments, a section, marks, a cut, an axis, or in a net a shaded face, a stressed edge, a right angle, an excluded circle), or a solidCaption, or to be a panel of a composite grid (the panel caption carries the text); only a bare, uncaptioned figure is SOLID_FIGURE_NEEDS_A_LABEL. segments takes at most 10 entries. The same solid can be shown in 2-4 panels with a different group of segments emphasized in each, and a solid can stand beside a plane figure: put each figure as a panel of composite-panels-v1 (see the multi-panel contract), a solid panel being a solid-figure-v1 plan (solids or net) without caption, solidCaption, sourceConditions, newVisualInformation or sourceQuote. A solid-figure-v1 plan may carry sourceQuote (a string copied from the item): it is provenance only and never drawn (a bad one is SOLID_SOURCE_QUOTE_INVALID). Not supported (answer UNSUPPORTED): a net, cuts or face counting numbers of a regular polyhedron or bipyramid, more than one non-sphere solid nested in a cylinder (several balls are fine: see stack), more than 3 solids, a solid nested in anything but a cylinder (a cube inside a sphere), a solid nested in a nested solid, cutting a cylinder, cone or hemisphere by a plane, cutting a sphere by a plane that misses its centre or into other pieces than the five named ones, an explode flag on a cut, more than two planes (cuts), a flat bowl, perspective views, marks with labels or parallel marks, and a name or length that finds no room (SOLID_LABELS_NO_ROOM: use fewer labels). Refusals: SOLID_PLAN_INVALID, SOLID_KIND_UNSUPPORTED, SOLID_ORIENTATION_UNSUPPORTED, SOLID_NEST_INVALID, SOLID_NEST_UNKNOWN, SOLID_NEST_UNSUPPORTED, SOLID_NEST_DOES_NOT_FIT, SOLID_NEST_CHAIN, SOLID_MARKS_INVALID, SOLID_MARK_ID_INVALID, SOLID_MARK_UNKNOWN, SOLID_MARK_RAY_NOT_DRAWN, SOLID_MARK_SEGMENT_NOT_DRAWN, SOLID_MARK_NOT_RIGHT_ANGLE, SOLID_MARK_LENGTH_MISMATCH, SOLID_MARK_GROUP_AMBIGUOUS, SOLID_MARK_GROUP_ARC_COUNT, SOLID_MARK_GROUP_MISMATCH, SOLID_MARK_ANGLE_MISMATCH, SOLID_MARK_ANGLE_DEGENERATE, SOLID_LEVEL_APEX_HIDDEN, SOLID_PARAM_INVALID, SOLID_BASE_INVALID, SOLID_BASE_NOT_SIMPLE, SOLID_BASE_NOT_CONVEX, SOLID_NAMES_INVALID, SOLID_NAME_DUPLICATE, SOLID_NAME_UNKNOWN, SOLID_DIMS_INVALID, SOLID_DIM_SEGMENT_NOT_DRAWN, SOLID_DIM_VALUE_MISMATCH, SOLID_DIM_NOT_EXPRESSIBLE, SOLID_HIGHLIGHT_NOT_PLANAR, SOLID_SECTION_UNSUPPORTED, SOLID_NET_NOT_A_TREE, SOLID_NET_FACES_NOT_ADJACENT, SOLID_NET_FACES_OVERLAP, SOLID_COUNT_REQUEST_INVALID, SOLID_COUNT_FACES_UNSUPPORTED, SOLID_COUNT_UNSUPPORTED, SOLID_COUNT_NAMES_CONFLICT, SOLID_COUNT_TOO_MANY, SOLID_NET_HIGHLIGHT_INVALID, SOLID_NET_SEGMENT_INVALID, SOLID_NET_SEGMENT_DUPLICATE, SOLID_NET_EDGE_UNKNOWN, SOLID_NET_EDGE_AMBIGUOUS, SOLID_NET_EMPHASIS_UNSUPPORTED, SOLID_FIGURE_NEEDS_A_LABEL, SOLID_SEGMENTS_INVALID, SOLID_SOURCE_QUOTE_INVALID, SOLID_CUT_COUNT_INVALID, SOLID_CUT_INVALID, SOLID_CUT_EDGE_UNKNOWN, SOLID_CUT_NOT_PLANAR, SOLID_CUT_DEGENERATE, SOLID_CUT_NO_EFFECT, SOLID_CUT_KEEP_AMBIGUOUS, SOLID_CUT_KEEP_INVALID, SOLID_CUT_NOT_CONVEX, SOLID_CUT_UNSUPPORTED, SOLID_SPHERE_CUT_INVALID, SOLID_SPHERE_CUT_KIND_UNSUPPORTED, SOLID_SPHERE_CUT_FACING_INVALID, SOLID_SPHERE_CUT_OFF_CENTRE, SOLID_SPHERE_CUT_EXPLODE_UNSUPPORTED, SOLID_SPHERE_CUT_UNSUPPORTED, SOLID_SPHERE_CUT_NEST_UNSUPPORTED, SOLID_SPHERE_CUT_RADIUS_HIDDEN, SOLID_HIGHLIGHT_INVALID, SOLID_HIGHLIGHT_FACE_UNKNOWN, SOLID_HIGHLIGHT_FACE_UNSUPPORTED, SOLID_HIGHLIGHT_FILL_INVALID, SOLID_SECTION_FILL_INVALID, SOLID_SECTION_FILL_UNSUPPORTED, SOLID_AXIS_INVALID, SOLID_AXIS_UNSUPPORTED, SOLID_LABELS_INVALID, SOLID_LABEL_TEXT_INVALID, SOLID_LABEL_AT_INVALID, SOLID_LABEL_AT_UNKNOWN, SOLID_LABEL_EDGE_NOT_DRAWN, SOLID_LABEL_FACE_UNKNOWN, SOLID_LABEL_FACE_HIDDEN, SOLID_LABEL_FACE_UNSUPPORTED, SOLID_LABEL_AXIS_UNSUPPORTED, SOLID_LABEL_SLANT_UNSUPPORTED, SOLID_LABEL_DUPLICATE_TARGET, SOLID_LABELS_UNSUPPORTED, SOLID_EDGE_LABEL_INVALID, SOLID_EDGE_LABEL_UNSUPPORTED, SOLID_MARK_SLANT_UNSUPPORTED, SOLID_CUT_VERTEX_UNKNOWN, SOLID_CUT_VERTEX_REF_UNSUPPORTED.`;
async function provider(purpose,packet,images,traceDir,allowFailure=false){
  const response=await invokeVisualContinuation({root,traceDir,purpose,input:[{type:'text',text:canonicalJson(packet)},...images.map(nativeImageInput)],outputSchema:schema});
  const payload=parseVisualProviderPayload(response,purpose);
  if(response.output.status!=='PASS'&&!allowFailure)throw Error(purpose+':'+response.output.status+':'+response.output.payload);
  return {...response,payload,inputPacket:packet,inputSha256:objectSha(packet),imageShas:images.map(i=>bytesSha(Buffer.from(i.split(',')[1],'base64')))};
}
export function parseVisualProviderPayload(response,purpose='UNKNOWN_PROVIDER_PURPOSE'){
  const text=typeof response?.output?.payload==='string'?response.output.payload:null;
  try{if(text===null)throw Error('VISUAL_PROVIDER_PAYLOAD_STRING_REQUIRED');return JSON.parse(text);}
  catch(error){
    const safeError=Error('VISUAL_PROVIDER_PAYLOAD_JSON_INVALID');
    safeError.code='VISUAL_PROVIDER_PAYLOAD_JSON_INVALID';
    safeError.providerParserErrorName=error?.name||'Error';
    safeError.providerParserErrorCode=error?.code||null;
    safeError.providerPurpose=purpose;
    safeError.providerPayloadSha256=text===null?null:bytesSha(Buffer.from(text,'utf8'));
    safeError.providerRawOutputSha256=typeof response?.rawOutput==='string'?bytesSha(Buffer.from(response.rawOutput,'utf8')):null;
    safeError.providerInvocationId=response?.providerInvocationId??null;
    safeError.providerContextId=response?.contextId??null;
    safeError.providerTerminalStatus=response?.providerTerminalStatus??null;
    safeError.providerProcessCleanup=response?.providerProcessCleanup??null;
    throw safeError;
  }
}
function receipt(stage,outputs,provenance){return commitStage(root,{stage,key:objectSha({outputsSha:Object.fromEntries(Object.entries(outputs).map(([k,v])=>[k,bytesSha(Buffer.from(v))])),invocation:crypto.randomUUID()}),outputs,provenance});}
function freeze(stage,value,provenance){return receipt(stage,{[stage.toLowerCase()+'.json']:canonicalJson(value)},provenance);}
async function worker(payload){const r=await pythonWorker(payload);if(r.status!=='OK')throw Error(r.result.code);return r.result;}
function envelopePolicyRefs(){
  return [
    {name:'archive-engine',ref:fileRef(root,'archive/engine.html')},
    {name:'archive-capture',ref:fileRef(root,'archive/tools/geometry-equation/record-visual-browser-evidence.mjs')},
    {name:'display-envelope-contract',ref:fileRef(root,'archive/tools/geometry-equation/production/display-envelope.mjs')},
    {name:'display-typography',ref:fileRef(root,'archive/tools/geometry-equation/production/typography.mjs')},
    {name:'rendered-layout-observer',ref:fileRef(root,'archive/tools/geometry-equation/verify-rendered-layout.mjs')},
    {name:'source-review-policy',ref:fileRef(root,'archive/tools/geometry-equation/production/source-policy.mjs')},
    {name:'verified-solution-policy',ref:fileRef(root,'archive/tools/geometry-equation/production/blinded-review.mjs')}
  ];
}
function pngSize(bytes){
  if(!Buffer.isBuffer(bytes)||bytes.length<24||bytes.toString('hex',0,8)!=='89504e470d0a1a0a'||bytes.toString('ascii',12,16)!=='IHDR')throw Error('ARCHIVE_SCREENSHOT_PNG_REQUIRED');
  return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
}
async function actualArchiveEnvelopePreflight({identity,folder,questionUid,sourcePath,ordinal,sourceRef,solutionRef,intrinsicSvg,sourceAuthorityStatus,signal,onProgress}){
  process.env.GEOMETRY_NODE_MODULES ||= path.join(dependencyRoot,'node_modules');
  const targetId=identity.assetId,preflightRun=path.join(folder,'display-envelope-preflight');fs.mkdirSync(preflightRun,{recursive:true});
  const measured=await measureArchiveDisplayEnvelope({run:preflightRun,sourceRef,sourceOrdinal:ordinal,targetId,questionUid,intrinsicSvg,sourceAuthorityStatus,signal,onProgress,blockExternalRequests:true});
  if(measured.status!=='PASS')throw Error('ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_PREFLIGHT_FAIL');
  const rowName=fs.readdirSync(measured.captureFolder).find(name=>name.endsWith('-sol-desktop-envelope.json'));
  const contextName=fs.readdirSync(measured.captureFolder).find(name=>name.endsWith('-'+targetId+'-envelope-context.png'));
  if(!rowName||!contextName)throw Error('ACTUAL_ARCHIVE_DISPLAY_ENVELOPE_RAW_CAPTURE_REQUIRED');
  const screenshotBytes=fs.readFileSync(path.join(measured.captureFolder,contextName));
  const captureReceipt=receipt('DISPLAY_ENVELOPE_CAPTURE',{
    'archive-row.json':fs.readFileSync(path.join(measured.captureFolder,rowName)),
    'archive-context.png':screenshotBytes,
    'archive-matrix.json':fs.readFileSync(path.join(preflightRun,'archive-render-matrix.json'))
  },{identity,questionUid,sourceRef,solutionRef,measurementOnly:true});
  const archiveRowRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/archive-row.json'));
  const screenshotRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/archive-context.png'));
  const policyRefs=envelopePolicyRefs(),archiveEngineSha256=policyRefs.find(item=>item.name==='archive-engine').ref.sha256;
  const measurement={schemaVersion:'DISPLAY_ENVELOPE_PREFLIGHT_v1',status:'PASS',synthetic:false,runtime:measured.observation.runtime,browserVersion:measured.observation.browserVersion,questionUid,targetId,sourceRef,solutionRef,candidateRef:measured.candidateRef,archiveRowRef,screenshotRef,screenshotViewport:pngSize(screenshotBytes),observation:measured.observation,sourceAuthorityStatus,matrixSha256:measured.matrixSha256};
  const measurementReceipt=receipt('DISPLAY_ENVELOPE_PREFLIGHT',{'preflight.json':canonicalJson(measurement)},{identity,questionUid,sourceRef,solutionRef,policyRefs,archiveEngineSha256,measurementOnly:true});
  const preflightEvidence={measurementRef:measurementReceipt.outputs[0],archiveRowRef,screenshotRef};
  return {status:'PASS',measurement,observation:measured.observation,preflightEvidence,policyRefs,archiveEngineSha256,stages:[captureReceipt,measurementReceipt]};
}
async function auditCandidateProfiles({svg,plan,candidateSvgRef,sourceRef,solutionRef,policyRefs,identity,provenance,graphPlan,geometryStaticAudit,coordinateModel,expectedPrimitiveIds}){
  const browserCaptures=await captureDisplayProfiles({svg,profiles:plan.profiles}),profileAudits=[],stageReceipts=[];
  for(const capture of browserCaptures.rows){
    const profile=plan.profiles.find(item=>item.sizeClass===capture.sizeClass),profileProvenance={...provenance,identity,candidateSvgRef,questionUid:identity.questionUid,sizeClass:profile.sizeClass,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale};
    const screenshotReceipt=receipt('DISPLAY_PROFILE_SCREENSHOT',{[profile.sizeClass+'.png']:capture.screenshot},profileProvenance);stageReceipts.push(screenshotReceipt);
    const screenshotRef=screenshotReceipt.outputs[0];let graphRequired=!!graphPlan,graphStatus='NOT_APPLICABLE',graphEvidenceRef=null,topologyStatus='FAIL',topologyEvidenceRef=null,topologyPayload;
    if(graphPlan){
      const graph=await workerGraphAudit(graphPlan,svg,{...coordinateModel,displayScale:profile.displayScale});
      graphStatus=graph.status==='PASS'?'PASS':'FAIL';
      const graphEvidence={schemaVersion:'DISPLAY_PROFILE_GRAPH_AUDIT_v1',status:graphStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,graph};
      const graphReceipt=receipt('DISPLAY_PROFILE_GRAPH',{[profile.sizeClass+'.json']:canonicalJson(graphEvidence)},profileProvenance);stageReceipts.push(graphReceipt);graphEvidenceRef=graphReceipt.outputs[0];
      const nonOverviewErrors=(graph.errors||[]).filter(error=>!String(error).startsWith('OVERVIEW_'));
      topologyStatus=graph.topology&&nonOverviewErrors.length===0?'PASS':'FAIL';
      topologyPayload={schemaVersion:'DISPLAY_PROFILE_TOPOLOGY_AUDIT_v1',status:topologyStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,graphStatus,overviewStatus:graph.overview?.status||'NOT_REPORTED',topologyErrors:nonOverviewErrors,topology:graph.topology||null,observedGraphSegments:graph.segments||[]};
    }else{
      const observedIds=new Set(capture.capture.geometry.map(item=>item.id)),missingPrimitiveIds=expectedPrimitiveIds.filter(id=>!observedIds.has(id));
      const validGeometry=capture.capture.geometry.length>0&&capture.capture.geometry.every(item=>item.id&&Number.isFinite(item.strokeWidthPx)&&item.strokeWidthPx>=0&&item.client&&['x','y','width','height'].every(key=>Number.isFinite(item.client[key])));
      topologyStatus=geometryStaticAudit.status==='PASS'&&validGeometry&&missingPrimitiveIds.length===0?'PASS':'FAIL';
      topologyPayload={schemaVersion:'DISPLAY_PROFILE_TOPOLOGY_AUDIT_v1',status:topologyStatus,questionUid:identity.questionUid,sizeClass:profile.sizeClass,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,displayScale:profile.displayScale,expectedPrimitiveIds,missingPrimitiveIds,geometry:capture.capture.geometry,svgRect:capture.capture.svg,viewBox:capture.capture.viewBox};
    }
    const topologyReceipt=receipt('DISPLAY_PROFILE_TOPOLOGY',{[profile.sizeClass+'.json']:canonicalJson(topologyPayload)},profileProvenance);stageReceipts.push(topologyReceipt);topologyEvidenceRef=topologyReceipt.outputs[0];
    const strokeMeasurements=capture.capture.geometry.map(item=>({id:item.id,sizeClass:profile.sizeClass,candidateSvgSha256:candidateSvgRef.sha256,inputIdentitySha256:plan.inputIdentitySha256,kind:item.kind,finalViewportCssStrokePx:item.strokeWidthPx,client:item.client,displayScale:profile.displayScale}));
    const strokeValid=strokeMeasurements.length>0&&strokeMeasurements.every(item=>Number.isFinite(item.finalViewportCssStrokePx)&&item.finalViewportCssStrokePx>=0);
    const errors=[...capture.layout.errors,...(topologyStatus==='PASS'?[]:['PROFILE_TOPOLOGY_INVENTORY_FAIL']),...(graphRequired&&graphStatus!=='PASS'?['PROFILE_GRAPH_AUDIT_FAIL']:[]),...(strokeValid?[]:['PROFILE_STROKE_MEASUREMENT_FAIL'])];
    const measurement={schemaVersion:'DISPLAY_PROFILE_AUDIT_v1',status:errors.length?'FAIL':'PASS',questionUid:identity.questionUid,sizeClass:profile.sizeClass,synthetic:false,runtime:capture.runtime,browserVersion:capture.browserVersion,candidateSvgRef,candidateSvgSha256:candidateSvgRef.sha256,naturalWidth:plan.intrinsicSvg.width,naturalHeight:plan.intrinsicSvg.height,sourceRef,solutionRef,policyRefs,inputIdentitySha256:plan.inputIdentitySha256,archiveEngineSha256:plan.archiveEngineSha256,imageRect:capture.imageRect,computedStyle:profile.computedStyle,profilePolicySha256:profile.profilePolicySha256,screenshotViewport:capture.screenshotViewport,screenshotRef,labelMeasurements:capture.layout.labelMeasurements.map(item=>({id:item.id,finalViewportCssFontPx:item.finalViewportCssFontPx,baseFontPx:item.baseFontPx,kind:item.kind,client:item.client,bbox:item.bbox})),layoutStatus:capture.layout.status,graphRequired,graphStatus,graphEvidenceRef,topologyRequired:true,topologyStatus,topologyEvidenceRef,strokeStatus:strokeValid?'PASS':'FAIL',strokeMeasurements,rawCapture:capture.capture,errors};
    const measurementReceipt=receipt('DISPLAY_PROFILE_MEASUREMENT',{[profile.sizeClass+'.json']:canonicalJson(measurement)},profileProvenance);stageReceipts.push(measurementReceipt);profileAudits.push({sizeClass:profile.sizeClass,measurementRef:measurementReceipt.outputs[0]});
  }
  const envelope=qualifyDisplayEnvelope(plan,{root,candidateSvgRef,profileAudits});
  const envelopeReceipt=freeze('DISPLAY_ENVELOPE_AUDIT',{schemaVersion:'DISPLAY_ENVELOPE_CANDIDATE_AUDIT_v1',classification:'ACTUAL_CANDIDATE_PROFILE_AUDITS',candidateSvgRef,planSha256:objectSha(plan),profileAudits,envelope},provenance);stageReceipts.push(envelopeReceipt);
  return {envelope,profileAudits,stageReceipts,browserCaptures:{status:browserCaptures.status,runtime:browserCaptures.runtime,synthetic:browserCaptures.synthetic,browserVersion:browserCaptures.browserVersion}};
}
// The coefficient list [c0,c1,...] of the rational family written as a polynomial in x (highest power first, zero terms dropped).
const rationalPolynomialText=values=>{
  const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
  return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');
};
// graphPlan.overlays (G1): one general overlay layer on any single-curve graph. graph_framing computed every overlay coordinate exactly
// (overlaysFeatures); this adds the final drawing objects (lines with equation labels, vertical lines, named points, segments, dashed
// guide segments to the axes, simple polygons) to whatever family spec was built. The independent observer recomputes all of it.
function overlayPointIds(plan){return (plan.graphPlan?.overlays?.points??[]).map(point=>point?.id).filter(id=>typeof id==='string');}
// The eight layout directions with the author's hint first (the layout still tries all of them).
const directionsFrom=first=>[first,...['N','NE','E','SE','S','SW','W','NW'].filter(direction=>direction!==first)];
function addGraphOverlays(plan,spec){
  const p=plan.graphPlan,features=p?.overlaysFeatures;
  if(!features)return spec;
  if(features.schemaVersion!=='GRAPH_OVERLAYS_FEATURES_v1')throw Error('OVERLAY_FEATURE_INVENTORY_REQUIRED');
  const requiredIds=(p.requiredPoints??[]).map(point=>point?.id),names=pointNameModel(plan,[...requiredIds,...features.points.map(point=>point.id)]);
  const points=new Map(features.points.map(point=>[point.id,point])),objects=[];
  // A plan that uses one of the newer overlay fields (a display window, coordinate or length labels, a lattice) has its line equations placed under
  // the line-owned rule from the start: beside its own line (clearly the nearest) or tied to it by a leader, best anchors on the line first. Every
  // other plan keeps its first anchor and the ordinary placement; only when that finds no room, the other anchors are tried (lineFallback).
  const ownedLabels=p.displayWindow!==undefined||features.points.some(point=>point.coordinates||point.unnamed)||features.segments.some(segment=>segment.length)||!!features.latticePoints;
  for(const line of features.lines){
    const lineId='overlay-line-'+line.id,anchors=ownedLabels&&line.labelAlternates?.length?[...line.labelAlternates,line.labelAt]:null;
    objects.push({id:lineId,kind:'LINE',coefficients:line.kind==='VERTICAL'?[1,0,-exactValue(line.x)]:[exactValue(line.slope),-1,exactValue(line.intercept)],...(line.style==='DASHED'?{dash:true}:{})});
    objects.push({id:lineId+'-equation',kind:'EQUATION_LABEL',target:lineId,text:line.text,at:anchors?anchors[0]:line.labelAt,priority:0,
      ...(line.lineAt!==undefined?{lineOwned:true,alternateAt:[],gaps:[8,6,10,20,32,48],collinearOwners:true,lineAt:line.lineAt}
        :anchors?{lineOwned:true,alternateAt:anchors.slice(1),gaps:[8,6,10,20,32,48],collinearOwners:true}:line.labelAlternates?.length?{alternateAt:line.labelAlternates,lineFallback:true}:{})});
  }
  for(const point of features.points){
    if(!point.coordinates){objects.push({id:point.id,kind:'POINT',at:[point.x,point.y],name:point.unnamed?null:names.tex(point.id),priority:0});continue;}
    // coordinates:true: the dot carries no separate name; a named point is written A(-6,-3), an unnamed one (-6,-3).
    objects.push({id:point.id,kind:'POINT',at:[point.x,point.y],name:null,priority:0});
    objects.push(names.has(point.id)&&!point.unnamed
      ?{id:point.id+'-coordinates',kind:'EQUATION_LABEL',target:point.id,text:names.expr(point.id)+'('+point.coordinates.join(',')+')',at:[point.x,point.y],priority:0,ringLeader:true,...(point.labelDirection?{directions:directionsFrom(point.labelDirection)}:{})}
      :{id:point.id+'-coordinates',kind:'COORDINATE_LABEL',target:point.id,exact:point.coordinates,priority:0,...(point.unnamed?{ringLeader:true}:{}),...(point.labelDirection?{preferred:point.labelDirection}:{})});
  }
  // circles (G6): a circle drawn at the plot's single scale (the observer refuses an ellipse).
  for(const circle of features.circles??[])objects.push({id:'overlay-circle-'+circle.id,kind:'CIRCLE',center:[circle.cx,circle.cy],radius:circle.r,...(circle.fill?{fill:circle.fill}:{})});
  // circleRegions (G6b): the circular segment between two points on a circle, a real SVG arc closed by the chord (a FILL_REGION of one arc and one straight edge).
  for(const region of features.circleRegions??[]){
    if(region.boundary){
      // boundary form (G6c): pieces of the drawn curve (one straight step through the sampled vertices) and circle arcs; every junction is a hidden point at the exact vertex.
      const junction=index=>'overlay-circle-region-'+region.id+'-v'+index,count=region.boundary.length;
      region.vertices.forEach((vertex,index)=>objects.push({id:junction(index),kind:'POINT',at:vertex,name:null,marker:'NONE'}));
      const steps=region.boundary.map((piece,index)=>{
        const to=junction((index+1)%count);
        if(piece.kind==='CURVE')return {to,via:piece.samples.slice(1,-1)};
        const centerId='overlay-circle-'+piece.circle+'-center';
        if(!objects.some(object=>object.id===centerId)){const ring=features.circles?.find(row=>row.id===piece.circle);if(!ring)throw Error('OVERLAY_CIRCLE_REGION_INVENTORY_REQUIRED');objects.push({id:centerId,kind:'POINT',at:[ring.cx,ring.cy],name:null,marker:'NONE'});}
        return {to,arc:{center:centerId,sweep:piece.sweep}};
      });
      objects.push({id:'overlay-circle-region-'+region.id,kind:'FILL_REGION',fill:region.fill,...(region.label?{labelText:region.label}:{}),loops:[{start:junction(0),steps}]});
      continue;
    }
    const circle=features.circles?.find(row=>row.id===region.circle),centerId='overlay-circle-'+region.circle+'-center';
    if(!circle||!points.has(region.from)||!points.has(region.to))throw Error('OVERLAY_CIRCLE_REGION_INVENTORY_REQUIRED');
    if(!objects.some(object=>object.id===centerId))objects.push({id:centerId,kind:'POINT',at:[circle.cx,circle.cy],name:null,marker:'NONE'});
    objects.push({id:'overlay-circle-region-'+region.id,kind:'FILL_REGION',fill:region.fill,loops:[{start:region.from,steps:[{to:region.to,arc:{center:centerId,sweep:region.sweep}},{to:region.from}]}]});
  }
  const at=ident=>{const point=points.get(ident);if(!point)throw Error('OVERLAY_POINT_UNKNOWN:'+ident);return [point.x,point.y];};
  for(const segment of features.segments){
    objects.push({id:'overlay-segment-'+segment.id,kind:'SEGMENT',from:at(segment.from),to:at(segment.to),...(segment.dashed?{dash:true}:{})});
    if(segment.length){
      // length:true: the exact length stands beside its own segment (leader lines tie it back when it has to move away).
      const a=at(segment.from),b=at(segment.to);
      objects.push({id:'overlay-segment-'+segment.id+'-length',kind:'EQUATION_LABEL',target:'overlay-segment-'+segment.id,text:segment.length.text,at:[(a[0]+b[0])/2,(a[1]+b[1])/2],lineOwned:true,collinearOwners:true,
        alternateAt:[.3,.7].map(t=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]),gaps:[8,6,10,20,32,48],priority:1,...(segment.labelDirection?{directions:directionsFrom(segment.labelDirection)}:{})});
    }
  }
  // names: a plain Korean name beside the segment or line it names (tied to it like a length label), or beside the drawn curve at its anchor
  // point (a free label: any side that has room, the author's side first).
  for(const name of features.names??[]){
    const base={id:'overlay-name-'+name.id,kind:'EQUATION_LABEL',...(name.labelKind==='MATH'?{}:{labelKind:'TEXT'}),text:name.text,at:name.at,priority:1,allowSuppress:false,...(name.labelDirection?{directions:directionsFrom(name.labelDirection)}:{})};
    objects.push(name.kind==='CURVE'?{...base,freeLabel:true}
      :{...base,target:(name.kind==='SEGMENT'?'overlay-segment-':'overlay-line-')+name.ref,lineOwned:true,collinearOwners:true,alternateAt:name.alternateAt,gaps:[8,6,10,20,32,48]});
  }
  // latticePoints: small unnamed dots (one per integer point the engine enumerated) and, optionally, one count label per column.
  const lattice=features.latticePoints;
  if(lattice){
    const token=value=>value<0?'n'+(-value):String(value),dotId=(x,y)=>'overlay-lattice-x'+token(x)+'y'+token(y);
    for(const dot of lattice.points)objects.push({id:dotId(dot.x,dot.y),kind:'POINT',at:[dot.x,dot.y],name:null,markerRadius:2.4,priority:2});
    // counts:true: the count of each column stands in a row just below the x-axis, under its column, when the window has room there (at least
    // 40 px below the axis); otherwise beside the column's top dot, on whichever side the layout finds free.
    const belowAxisPx=-p.viewport[2]*(448/(p.viewport[1]-p.viewport[0])),countsBelow=belowAxisPx>=40;
    if(lattice.counts)for(const column of lattice.columns)objects.push({id:'overlay-lattice-count-x'+token(column.x),kind:'EQUATION_LABEL',target:dotId(column.x,column.topY),text:String(column.count),
      ...(countsBelow?{at:[column.x,0],directions:['S'],gaps:[14,18,22,26]}:{at:[column.x,column.topY],directions:['W','E','N','S','NW','NE','SW','SE'],gaps:[6,10,14,20]}),priority:1});
  }
  for(const guide of features.guides){
    const start=at(guide.from);
    if(guide.axis==='x'||guide.axis==='BOTH')objects.push({id:'overlay-guide-'+guide.id+'-x',kind:'SEGMENT',from:start,to:[start[0],0],dash:true});
    if(guide.axis==='y'||guide.axis==='BOTH')objects.push({id:'overlay-guide-'+guide.id+'-y',kind:'SEGMENT',from:start,to:[0,start[1]],dash:true});
  }
  for(const polygon of features.polygons)objects.push({id:'overlay-polygon-'+polygon.id,kind:'POLYGON',refs:polygon.points,...(polygon.fill!=='NONE'?{fill:polygon.fill}:{}),...(polygon.label!==undefined?{labelText:polygon.label,labelKind:polygon.labelKind}:{})});
  // quadrants (E31): the tinted rectangle and the Korean name of a coordinate quadrant, last so the name finds its room among the strokes already drawn.
  for(const quadrant of features.quadrants??[])objects.push({id:'overlay-quadrant-'+quadrant.id,kind:'QUADRANT',quadrant:quadrant.quadrant,...(quadrant.fill?{fill:quadrant.fill}:{}),...(quadrant.label!==undefined?{labelText:quadrant.label}:{})});
  return {...spec,objects:[...spec.objects,...objects]};
}

// Inverse proportion y=k/(d0+d1*x) (rational family, nonzero constant numerator): one scale on both axes like every true-shape graph, the plot
// canvas from graph_framing. An asymptote that lies on a coordinate axis is the axis itself, so the only dashed asymptote is a vertical x=p with
// p!=0 (labelled x=p at the bottom, on the side where the curve is not); the formula label stands high in the empty upper quadrant (the curve fills
// the opposite pair); required points are dots with their coordinates (exactCoordinates gives exact text, as on the square-root family).
function rationalConstantNumeratorSpec(plan,id){
  const p=plan.graphPlan,v=p.viewport,features=p.rationalFeatures,plot=p.plotCanvas;
  if(!features||features.schemaVersion!=='RATIONAL_CONSTANT_OVER_LINEAR_FEATURES_v1'||!features.singularity||!features.asymptotes?.vertical||!features.poleDirection)throw Error('RATIONAL_FEATURE_INVENTORY_REQUIRED');
  if(p.equalUnits!==true||!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  const canvas={width:512,height:plot.height+64,panel:0,topInset:0};
  const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
  const spanX=v[1]-v[0],spanY=v[3]-v[2],xPole=exactNumber(features.singularity.x),upperSide=features.poleDirection.right==='UP'?-1:1;
  const denominator=rationalPolynomialText(p.denominator),constant=String(p.numerator[0]),magnitude=constant.startsWith('-')?constant.slice(1):constant;
  const denominatorForLabel=/[-+*]/.test(denominator)?'('+denominator+')':denominator;
  const formulaText=p.formulaLabel??'y='+(constant.startsWith('-')?'-':'')+(magnitude.includes('/')?'('+magnitude+')':magnitude)+'/'+denominatorForLabel;
  // The curve fills two opposite quadrants about the asymptotes; the label goes high in the free upper one, half way to the frame edge.
  const labelX=upperSide<0?xPole-.45*(xPole-v[0]):xPole+.45*(v[1]-xPole);
  // An author window (displayWindow) can be small and crowded: the formula then goes where the window is emptiest.
  const formulaAt=p.displayWindow!==undefined?(p.formulaAt??emptiestWindowSpot(p,v,xPole,exactNumber(p.numerator[0])/exactNumber(p.denominator[1]),[labelX,v[3]-spanY*.12])):[labelX,v[3]-spanY*.12];
  const objects=[
    {id:'f',kind:'FUNCTION_GRAPH',expression:'('+rationalPolynomialText(p.numerator)+')/('+denominator+')',domain:p.domain,breaks:[xPole]},
    {id:'formula',kind:'EQUATION_LABEL',text:formulaText,at:formulaAt,priority:0}
  ];
  if(features.asymptotes.vertical.drawn===true)objects.push({id:'vertical-asymptote-label',kind:'GRAPH_ANNOTATION',text:'x='+features.singularity.x,at:[xPole-upperSide*spanX*.09,v[2]+spanY*.08],math:true,priority:0});
  const required=p.requiredPoints||[],exactCoordinates=p.exactCoordinates??{};
  if(!exactCoordinates||typeof exactCoordinates!=='object'||Array.isArray(exactCoordinates))throw Error('EXACT_COORDINATES_INVALID');
  for(const [pointId,pair] of Object.entries(exactCoordinates)){
    const point=required.find(other=>other?.id===pointId);
    if(!point||!Array.isArray(pair)||pair.length!==2||[point.x,point.y].some((value,k)=>Math.abs(exactValue(pair[k])-value)>1e-9*Math.max(1,Math.abs(value))))throw Error('EXACT_COORDINATES_MISMATCH:'+pointId);
  }
  const coordinateText=point=>exactCoordinates[point?.id]??(Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y)?[String(point.x),String(point.y)]:null);
  for(const [index,point] of required.entries()){
    const markerId='required-point-'+(index+1),coordinates=coordinateText(point);
    objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],name:null});
    if(coordinates)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates});
  }
  // graphPlan.displayWindow: the frame is the author's window, so the engine must not widen it to reach the unit ticks (axes as an object) and,
  // unless the plan names its tick values, the ticks are a 1/2/5 grid with at most 8 labels per axis.
  const windowed=p.displayWindow!==undefined;
  const tickFacts=windowed&&p.axisTickValues===undefined?axisTickDisplayFacts({...p,axisTickValues:{x:niceAxisTicks(v[0],v[1]),y:niceAxisTicks(v[2],v[3])}}):axisTickDisplayFacts(p);
  return {id,visualType:'function_graph',viewport:{...graphViewport(v,canvas),...((p.axisRatio??1)===1?{equalUnits:true}:{})},axes:windowed?{x:true,y:true}:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...tickFacts,rationalGraphFeatures:features,rationalGraphPolicy:p.rationalFeaturePolicy},objects};
}
// The grid spot of an author window nearest its curve (28 to 120 px from it) that is farthest (in px) from the axes, the overlay points/lines/segments
// and the frame edge, for a label about 70 x 50 px; the default spot when nothing has at least 24 px of clearance. Deterministic: the highest spot wins a tie.
function emptiestWindowSpot(p,v,pole,residue,fallback){
  const scale=448/(v[1]-v[0]),samples=[],curve=[];
  for(let i=0;i<=800;i++){const x=v[0]+(v[1]-v[0])*i/800;if(Math.abs(x-pole)<1e-6)continue;const y=residue/(x-pole);if(y>=v[2]&&y<=v[3])curve.push([x,y]);}
  const features=p.overlaysFeatures;
  if(features){
    const byId=new Map(features.points.map(point=>[point.id,point]));
    for(const point of features.points){
      samples.push([point.x,point.y]);
      // a coordinate label (about 90 px wide) stands beside its point: keep that band free too
      if(point.coordinates)for(const dx of [-90,-60,-30,30,60,90,120])samples.push([point.x+dx/scale,point.y]);
    }
    for(const dot of features.latticePoints?.points??[])samples.push([dot.x,dot.y]);
    for(const segment of features.segments){const a=byId.get(segment.from),b=byId.get(segment.to);for(let i=0;i<=24;i++)samples.push([a.x+(b.x-a.x)*i/24,a.y+(b.y-a.y)*i/24]);}
    for(const line of features.lines){
      for(let i=0;i<=60;i++){
        if(line.kind==='VERTICAL')samples.push([line.xValue,v[2]+(v[3]-v[2])*i/60]);
        else{const x=v[0]+(v[1]-v[0])*i/60,y=line.slopeValue*x+line.interceptValue;if(y>=v[2]&&y<=v[3])samples.push([x,y]);}
      }
    }
  }
  for(const point of p.requiredPoints??[])samples.push([point.x,point.y]);
  let best=null,bestScore=-Infinity;
  for(const near of [true,false])if(!best||bestScore<24){
    best=null;bestScore=-Infinity;
    for(let gy=24;gy>=0;gy--)for(let gx=0;gx<=24;gx++){
      const x=v[0]+(v[1]-v[0])*(.05+.9*gx/24),y=v[2]+(v[3]-v[2])*(.05+.9*gy/24);
      let curveDistance=Infinity;
      for(const [sx,sy] of curve){const d=Math.hypot((sx-x)*scale,(sy-y)*scale);if(d<curveDistance)curveDistance=d;}
      if(curveDistance<28||(near&&curveDistance>120))continue;
      let score=Math.min(Math.abs(x)*scale,Math.abs(y)*scale,(x-v[0])*scale-38,(v[1]-x)*scale-38,(y-v[2])*scale-28,(v[3]-y)*scale-28);
      for(const [sx,sy] of samples){const d=Math.hypot((sx-x)*scale,(sy-y)*scale);if(d<score)score=d;}
      if(score>bestScore+1e-9){bestScore=score;best=[x,y];}
    }
  }
  return best&&bestScore>=24?[Number(best[0].toFixed(6)),Number(best[1].toFixed(6))]:fallback;
}
// Tick values for a window: the smallest 1/2/5 x 10^k step that leaves at most 8 nonzero labels, as exact decimal strings.
function niceAxisTicks(lo,hi){
  const limit=8;
  for(let power=-3;power<=6;power++){
    for(const unit of [1,2,5]){
      const step=unit*10**power,first=Math.ceil(lo/step-1e-9),last=Math.floor(hi/step+1e-9),values=[];
      for(let index=first;index<=last;index++){if(index!==0)values.push(Number((index*step).toFixed(6)));}
      if(values.length<=limit)return values.map(value=>String(value));
    }
  }
  return [];
}

export function specFor(plan,model,id){
  // planeMarks are facts read off named points and drawn segments, so they belong to the construction/plane-figure path only.
  if(plan.planeMarks!==undefined&&plan.capability!=='construction-spike-v1')throw Error('PLANE_MARKS_UNSUPPORTED_ON_GRAPH');
  const spec=specForFamily(plan,model,id);
  return addAxisTitles(plan,addGraphOverlays(plan,spec));
}
// graphPlan.axisTitles {x?,y?}: a short Korean title (with its unit, for example 시간(분) or 거리(km)) at the end of a drawn axis instead of the letter x or y.
const AXIS_TITLE_PATTERN=/^[가-힣A-Za-z0-9 ()·/.,%-]{1,10}$/;
function addAxisTitles(plan,spec){
  const titles=plan.graphPlan?.axisTitles;
  if(titles===undefined)return spec;
  if(!titles||typeof titles!=='object'||Array.isArray(titles)||!Object.keys(titles).length||Object.keys(titles).some(axis=>axis!=='x'&&axis!=='y'))throw Error('AXIS_TITLES_INVALID');
  for(const [axis,text] of Object.entries(titles)){
    if(typeof text!=='string'||text!==text.trim()||!AXIS_TITLE_PATTERN.test(text))throw Error('AXIS_TITLE_INVALID:'+axis);
    const shown=spec.axes===undefined||spec.axes===true||(typeof spec.axes==='object'&&spec.axes[axis]===true);
    if(!shown)throw Error('AXIS_TITLE_AXIS_HIDDEN:'+axis);
  }
  return {...spec,displayFacts:{...spec.displayFacts,axisTitles:{...titles}}};
}

// An exponential or logarithmic graph that carries a circle is framed at one scale (graph_framing _equalize_exp_log_for_circles): its plot size is the frame's.
const expLogEqualCanvas=p=>{
  const plot=p.plotCanvas;
  if(!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  return {width:512,height:plot.height+64,panel:0,topInset:0};
};
// graphPlan.coordinateBand {hide:[requiredPoint ids]} (G6b): the named required points keep their dot and their name in the figure but leave the coordinate band
// (a point already on the origin, whose name stands where the axes cross, needs no O(0,0) row). Positions stay exact and are still observed.
function coordinateBandHide(plan,required){
  const band=plan.coordinateBand;
  if(band===undefined)return new Set();
  if(!band||typeof band!=='object'||Array.isArray(band)||Object.keys(band).join(',')!=='hide'||!Array.isArray(band.hide)||band.hide.length<1||band.hide.length>8||new Set(band.hide).size!==band.hide.length)throw Error('COORDINATE_BAND_INVALID');
  for(const ident of band.hide)if(typeof ident!=='string'||!required.some(point=>point?.id===ident))throw Error('COORDINATE_BAND_HIDE_UNKNOWN:'+ident);
  return new Set(band.hide);
}
// graphPlan.hideLabels (G6b): the automatic labels of an exponential/logarithmic figure that the source figure does not show. 'formula' (a base
// exponential/logarithm writes its own formula, which can give away the base the question asks for), 'reference' (f(x0)=y0 at the reference
// point) and 'boundary' (x=root beside the dashed domain boundary of a logarithm). The dots and lines stay; only the text goes.
const EXP_LOG_HIDEABLE=['formula','reference','boundary'];
function expLogHidden(p,basePlan){
  if(p.hideLabels===undefined)return new Set();
  if(!Array.isArray(p.hideLabels)||!p.hideLabels.length||new Set(p.hideLabels).size!==p.hideLabels.length||p.hideLabels.some(name=>!EXP_LOG_HIDEABLE.includes(name))||(p.hideLabels.includes('formula')&&!basePlan))throw Error('HIDE_LABELS_INVALID');
  return new Set(p.hideLabels);
}
function specForFamily(plan,model,id){
  if(plan.capability==='absolute-value-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.absoluteFeatures;
    if(!features||features.schemaVersion!=='ABSOLUTE_VALUE_FEATURES_v1')throw Error('ABSOLUTE_VALUE_FEATURE_INVENTORY_REQUIRED');
    const [b,a,scale,offset]=p.coefficients,cornerX=Number(features.corner.x.split('/')[0])/(features.corner.x.includes('/')?Number(features.corner.x.split('/')[1]):1),cornerY=Number(features.corner.y.split('/')[0])/(features.corner.y.includes('/')?Number(features.corner.y.split('/')[1]):1);
    const gcd=(left,right)=>{let a0=left<0n?-left:left,b0=right<0n?-right:right;while(b0){const next=a0%b0;a0=b0;b0=next;}return a0||1n;};
    const rational=value=>{const [n,d='1']=String(value).split('/');let numerator=BigInt(n),denominator=BigInt(d);if(denominator<0n){numerator=-numerator;denominator=-denominator;}const divisor=gcd(numerator,denominator);return[numerator/divisor,denominator/divisor];};
    const format=([n,d])=>d===1n?String(n):String(n)+'/'+String(d),multiply=(x,y)=>rational(String(x[0]*y[0])+'/'+String(x[1]*y[1])),divide=(x,y)=>rational(String(x[0]*y[1])+'/'+String(x[1]*y[0]));
    const rb=rational(b),ra=rational(a),rk=rational(scale),exactCorner=divide([-rb[0],rb[1]],ra),exactScale=multiply(rk,[ra[0]<0n?-ra[0]:ra[0],ra[1]]),cornerText=format(exactCorner),inside='x'+(exactCorner[0]<0n?'+'+format([-exactCorner[0],exactCorner[1]]):'-'+cornerText),scaleText=format(exactScale),scalePrefix=scaleText==='1'?'':scaleText==='-1'?'-':scaleText+'*',offsetSuffix=offset==='0'?'':offset.startsWith('-')?offset:'+'+offset,expression=scalePrefix+'abs('+inside+')'+offsetSuffix,showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const criticalX=[cornerX,...features.xIntercepts.map(value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);})];
    const labelY=cornerY+(scale.startsWith('-')?-1:1)*(v[3]-v[2])*.08;
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'absolute-corner-label',kind:'EQUATION_LABEL',text:'V=('+features.corner.x+','+features.corner.y+')',at:[cornerX+(v[1]-v[0])*.07,labelY],math:true,priority:0}];
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{absoluteFeatures:features,absoluteFeaturePolicy:p.absoluteFeaturePolicy},objects};
  }
  if(plan.capability==='piecewise-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.piecewiseFeatures,policy=p.piecewiseFeaturePolicy;
    if(!features||features.schemaVersion!=='PIECEWISE_AFFINE_FEATURES_v1'||!policy||policy.schemaVersion!=='PIECEWISE_AFFINE_FEATURE_POLICY_v1')throw Error('PIECEWISE_FEATURE_INVENTORY_REQUIRED');
    const number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const linear=coefficients=>`(${coefficients[0]})*x+(${coefficients[1]})`;
    const linearLabel=([slope,intercept])=>{
      const xTerm=slope==='0'?'':slope==='1'?'x':slope==='-1'?'-x':`(${slope})x`;
      if(!xTerm)return 'y='+intercept;
      if(intercept==='0')return 'y='+xTerm;
      return 'y='+xTerm+(intercept.startsWith('-')?'':' + ')+intercept;
    };
    const breakX=number(features.breakpoint.x),lo=number(features.sourceInterval.lo),hi=number(features.sourceInterval.hi),showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0,yOffset=(v[3]-v[2])*.08;
    const objects=[
      {id:'f-left',kind:'FUNCTION_GRAPH',expression:linear(p.piecewise.left),domain:[lo,breakX],criticalX:[breakX],branch:'LEFT'},
      {id:'f-right',kind:'FUNCTION_GRAPH',expression:linear(p.piecewise.right),domain:[breakX,hi],criticalX:[breakX],branch:'RIGHT'},
      {id:'left-branch-equation',kind:'EQUATION_LABEL',text:linearLabel(p.piecewise.left),at:[(lo+breakX)/2,(number(features.breakpoint.leftLimitY)+number(features.markers[0].y))/2+yOffset],math:true,priority:0},
      {id:'right-branch-equation',kind:'EQUATION_LABEL',text:linearLabel(p.piecewise.right),at:[(breakX+hi)/2,(number(features.breakpoint.rightLimitY)+number(features.markers[1].y))/2+yOffset],math:true,priority:0}
    ];
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{piecewiseFeatures:features,piecewiseFeaturePolicy:policy},objects};
  }
  if(plan.capability==='exp-log-pair-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.expLogPairFeatures,policy=p.expLogPairPolicy;
    if(!features||features.schemaVersion!=='EXP_LOG_PAIR_FEATURES_v1'||!policy||policy.schemaVersion!=='EXP_LOG_PAIR_POLICY_v1')throw Error('EXP_LOG_PAIR_FEATURE_INVENTORY_REQUIRED');
    const number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);},showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0,objects=[];
    for(const [index,row] of features.curves.entries()){
      objects.push({id:'curve-'+row.id,kind:'FUNCTION_GRAPH',expression:expLogExpression(row),domain:row.domain,criticalX:[number(row.referencePoint.x)],branch:'REF_'+row.id});
      const formulaX=index===0?v[0]+(v[1]-v[0])*.12:v[0]+(v[1]-v[0])*.62;
      objects.push({id:'formula-'+row.id,kind:'EQUATION_LABEL',text:expLogFormulaText(row),at:[formulaX,v[3]-(v[3]-v[2])*.12],math:true,priority:0});
      const referenceX=number(row.referencePoint.x),referenceY=number(row.referencePoint.y),referenceAt=row.family==='exponential-affine'?[referenceX-(v[1]-v[0])*.18,referenceY+(v[3]-v[2])*.12]:[referenceX+(v[1]-v[0])*.18,referenceY-(v[3]-v[2])*.10];
      objects.push({id:'reference-'+row.id+'-value',kind:'EQUATION_LABEL',text:'('+row.referencePoint.x+','+row.referencePoint.y+')',at:referenceAt,math:true,priority:0});
    }
    if(features.identityLine===true){objects.push({id:'identity-line',kind:'AUXILIARY_LINE',coefficients:[1,-1,0]});objects.push({id:'identity-label',kind:'EQUATION_LABEL',text:'y=x',at:[v[1]-(v[1]-v[0])*.12,v[3]-(v[3]-v[2])*.18],math:true,priority:0});}
    return {id,visualType:'function_graph',viewport:{...graphViewport(v,{width:480,height:420,panel:140}),equalUnits:true},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts({...p,axisTickValues:p.axisTickValues??{x:[],y:[]}}),expLogPairFeatures:features,expLogPairPolicy:policy},objects};
  }
  if(plan.capability==='exponential-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.exponentialFeatures,policy=p.exponentialFeaturePolicy;
    const basePlan=features?.schemaVersion==='EXPONENTIAL_BASE_FEATURES_v1';
    if(expLogHidden(p,basePlan).size&&[...expLogHidden(p,basePlan)].some(name=>name!=='formula'))throw Error('HIDE_LABELS_INVALID');   // an exponential graph has only its formula to hide
    if(!features||!['EXPONENTIAL_AFFINE_FEATURES_v1','EXPONENTIAL_BASE_FEATURES_v1'].includes(features.schemaVersion)||!policy||!['EXPONENTIAL_AFFINE_FEATURE_POLICY_v1','EXPONENTIAL_BASE_FEATURE_POLICY_v1'].includes(policy.schemaVersion))throw Error('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED');
    const [a,k,c]=p.coefficients,expression=basePlan?expLogExpression({family:'exponential-affine',base:p.base,shiftX:p.shiftX,coefficients:p.coefficients}):`(${a})*exp((${k})*x)+(${c})`,showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0,refX=Number(String(features.referencePoint.x).split('/')[0])/(String(features.referencePoint.x).includes('/')?Number(String(features.referencePoint.x).split('/')[1]):1),refY=Number(features.referencePoint.y.split('/')[0])/(features.referencePoint.y.includes('/')?Number(features.referencePoint.y.split('/')[1]):1);
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX:[refX]},{id:'reference-value',kind:'EQUATION_LABEL',text:'f('+features.referencePoint.x+')='+features.referencePoint.y,at:[refX,refY+(v[3]-v[2])*.08],math:true,priority:0}];
    if(basePlan&&!expLogHidden(p,basePlan).has('formula'))objects.push({id:'formula',kind:'EQUATION_LABEL',text:expLogFormulaText({family:'exponential-affine',base:p.base,shiftX:p.shiftX,coefficients:p.coefficients}),at:[v[0]+(v[1]-v[0])*.12,v[2]+(v[3]-v[2])*.10],math:true,priority:0});
    return {id,visualType:'function_graph',viewport:p.equalUnits===true?{...graphViewport(v,expLogEqualCanvas(p)),equalUnits:true}:basePlan?graphViewport(v):{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{exponentialFeatures:features,exponentialFeaturePolicy:policy},objects};
  }
  if(plan.capability==='logarithmic-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.logarithmicFeatures,policy=p.logarithmicFeaturePolicy;
    const basePlan=features?.schemaVersion==='LOGARITHMIC_BASE_FEATURES_v1';
    if(!features||!['LOGARITHMIC_AFFINE_FEATURES_v1','LOGARITHMIC_BASE_FEATURES_v1'].includes(features.schemaVersion)||!policy||!['LOGARITHMIC_AFFINE_FEATURE_POLICY_v1','LOGARITHMIC_BASE_FEATURE_POLICY_v1'].includes(policy.schemaVersion))throw Error('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED');
    const [a,k,b,c]=p.coefficients,expression=basePlan?expLogExpression({family:'logarithmic-affine',base:p.base,coefficients:p.coefficients}):`(${a})*log((${k})*x+(${b}))+(${c})`,number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);},root=number(features.naturalDomainBoundaryX),ref=number(features.referencePoint.x),refY=number(features.referencePoint.y),showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const hidden=expLogHidden(p,basePlan);
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX:[ref]},...(hidden.has('reference')?[]:[{id:'reference-value',kind:'EQUATION_LABEL',text:'f('+features.referencePoint.x+')='+features.referencePoint.y,at:[ref,refY+(v[3]-v[2])*.08],math:true,priority:0}]),...(hidden.has('boundary')?[]:[{id:'log-domain-boundary-label',kind:'EQUATION_LABEL',text:'x='+features.naturalDomainBoundaryX,at:[root+(k.startsWith('-')?-1:1)*(v[1]-v[0])*.1,v[3]-(v[3]-v[2])*.2],math:true,priority:0}])];
    if(basePlan&&!expLogHidden(p,basePlan).has('formula'))objects.push({id:'formula',kind:'EQUATION_LABEL',text:expLogFormulaText({family:'logarithmic-affine',base:p.base,coefficients:p.coefficients}),at:[v[0]+(v[1]-v[0])*.55,v[2]+(v[3]-v[2])*.10],math:true,priority:0});
    return {id,visualType:'function_graph',viewport:p.equalUnits===true?{...graphViewport(v,expLogEqualCanvas(p)),equalUnits:true}:graphViewport(v),axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),logarithmicFeatures:features,logarithmicFeaturePolicy:policy},objects};
  }
  if(plan.capability==='trigonometric-spike-v1'&&plan.graphPlan?.trigIntervalFeatures?.schemaVersion==='TRIGONOMETRIC_INTERVAL_FEATURES_v2'){
    // General parameters (a rate or phase carrying pi, a plain or pi-unit x interval): the curve, reference lines and their curved crossings,
    // marked exact extrema/roots and dashed tan poles come from the frozen features; the engine draws the feature marks.
    const p=plan.graphPlan,v=p.viewport,features=p.trigIntervalFeatures,policy=p.trigIntervalPolicy;
    if(!policy||policy.schemaVersion!=='TRIGONOMETRIC_INTERVAL_POLICY_v2'||!p.intervalFeatures||!Array.isArray(features.lines))throw Error('TRIG_FEATURE_INVENTORY_REQUIRED');
    const factor=features.axisUnit==='PI'?Math.PI:1,expression=trigExpression(p);
    const criticalX=[...features.lines.flatMap(row=>row.intersections.map(point=>point.x)),...features.keyPoints.map(row=>exactFraction(row.x)*factor),...features.poles.map(row=>exactFraction(row.x)*factor)];
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX}];
    const lineText=row=>{const slope=exactValue(row.slope),h=row.kind==='HORIZONTAL';return 'y='+(h?row.intercept:(row.slope==='1'?'x':row.slope==='-1'?'-x':row.slope+'*x')+(row.intercept==='0'?'':row.intercept.startsWith('-')?row.intercept:'+'+row.intercept));};
    for(const row of features.lines){
      const slope=exactValue(row.slope),level=exactValue(row.intercept);
      objects.push({id:'line-'+row.id,kind:'LINE',coefficients:[slope,-1,level]});
      objects.push({id:'line-'+row.id+'-equation',kind:'EQUATION_LABEL',text:lineText(row),at:[v[1]-(v[1]-v[0])*.07,row.kind==='HORIZONTAL'?level+(v[3]-v[2])*.07:slope*(v[1]-(v[1]-v[0])*.07)+level+(v[3]-v[2])*.07],priority:0});
      for(const [i,point] of row.intersections.entries())objects.push({id:'intersection-'+row.id+'-'+(i+1),kind:'POINT',at:[point.x,point.y],name:null});
    }
    const ends=p.intervalFeatures.endpoints;
    const endText=text=>features.axisUnit==='PI'?piTickText(text):String(text).replace('-','−');
    if(features.sourceInterval.lo!=='0')objects.push({id:'interval-start-label',kind:'GRAPH_ANNOTATION',text:endText(features.sourceInterval.lo),at:[Number(ends[0].x),-(v[3]-v[2])*.07],math:features.axisUnit==='PI',priority:0});
    if(features.sourceInterval.hi!=='0')objects.push({id:'interval-end-label',kind:'GRAPH_ANNOTATION',text:endText(features.sourceInterval.hi),at:[Number(ends[1].x),-(v[3]-v[2])*.07],math:features.axisUnit==='PI',priority:0});
    return {id,visualType:'function_graph',viewport:graphViewport(v),axes:{x:v[2]<0&&v[3]>0,y:v[0]<=0&&v[1]>=0},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...trigTickFacts(p,features.axisUnit),intervalFeatures:p.intervalFeatures,intervalFeaturePolicy:p.intervalFeaturePolicy,trigIntervalFeatures:features,trigIntervalPolicy:policy},objects};
  }
  if(plan.capability==='trigonometric-spike-v1'&&plan.graphPlan?.trigIntervalFeatures!==undefined){
    // sine/cosine on an explicit interval of several periods (sourceDomain INTERVAL_PI) with horizontal or slanted reference lines: the curve, each
    // line with its equation, a dot at every crossing the framing found, the end markers (generic interval endpoints) and the end label k*pi.
    const p=plan.graphPlan,v=p.viewport,features=p.trigIntervalFeatures,policy=p.trigIntervalPolicy;
    if(features.schemaVersion!=='TRIGONOMETRIC_INTERVAL_FEATURES_v1'||!policy||policy.schemaVersion!=='TRIGONOMETRIC_INTERVAL_POLICY_v1'||!p.intervalFeatures||!Array.isArray(features.lines))throw Error('TRIG_FEATURE_INVENTORY_REQUIRED');
    const [a,k,c]=p.coefficients,fn=p.function.toLowerCase(),expression=`(${a})*${fn}((${k})*x+(${p.phasePi})*pi)+(${c})`;
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX:features.lines.flatMap(row=>row.intersections.map(point=>point.x))}];
    const lineText=row=>{const slope=exactValue(row.slope),h=row.kind==='HORIZONTAL';return 'y='+(h?row.intercept:(row.slope==='1'?'x':row.slope==='-1'?'-x':row.slope+'*x')+(row.intercept==='0'?'':row.intercept.startsWith('-')?row.intercept:'+'+row.intercept));};
    for(const row of features.lines){
      const slope=exactValue(row.slope),level=exactValue(row.intercept);
      objects.push({id:'line-'+row.id,kind:'LINE',coefficients:[slope,-1,level]});
      objects.push({id:'line-'+row.id+'-equation',kind:'EQUATION_LABEL',text:lineText(row),at:[v[1]-(v[1]-v[0])*.07,row.kind==='HORIZONTAL'?level+(v[3]-v[2])*.07:slope*(v[1]-(v[1]-v[0])*.07)+level+(v[3]-v[2])*.07],priority:0});
      for(const [i,point] of row.intersections.entries())objects.push({id:'intersection-'+row.id+'-'+(i+1),kind:'POINT',at:[point.x,point.y],name:null});
    }
    const ends=p.intervalFeatures.endpoints,piText=text=>{const [n,d='1']=String(text).split('/');return (d==='1'?(n==='1'?'':n==='-1'?'-':n):'\\frac{'+n+'}{'+d+'}')+'π';};
    if(features.sourceInterval.hiPi!=='0')objects.push({id:'interval-end-label',kind:'GRAPH_ANNOTATION',text:piText(features.sourceInterval.hiPi),at:[Number(ends[1].x),-(v[3]-v[2])*.07],math:true,priority:0});
    if(features.sourceInterval.loPi!=='0')objects.push({id:'interval-start-label',kind:'GRAPH_ANNOTATION',text:piText(features.sourceInterval.loPi),at:[Number(ends[0].x),-(v[3]-v[2])*.07],math:true,priority:0});
    return {id,visualType:'function_graph',viewport:graphViewport(v),axes:{x:v[2]<0&&v[3]>0,y:v[0]<=0&&v[1]>=0},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),intervalFeatures:p.intervalFeatures,intervalFeaturePolicy:p.intervalFeaturePolicy},objects};
  }
  if(plan.capability==='trigonometric-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.trigFeatures,policy=p.trigFeaturePolicy;
    if(!features||!['TRIGONOMETRIC_FEATURES_v1','TRIGONOMETRIC_FEATURES_v2'].includes(features.schemaVersion)||!policy||!['TRIGONOMETRIC_FEATURE_POLICY_v1','TRIGONOMETRIC_FEATURE_POLICY_v2'].includes(policy.schemaVersion))throw Error('TRIG_FEATURE_INVENTORY_REQUIRED');
    const general=features.schemaVersion==='TRIGONOMETRIC_FEATURES_v2',number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const expression=general?trigExpression(p):(()=>{const [a,k,c]=p.coefficients;return `(${a})*${p.function.toLowerCase()}((${k})*x+(${p.phasePi})*pi)+(${c})`;})();
    const criticalX=p.function==='TAN'?[number(general?features.referencePoint.x:features.cycleCenterPi)*Math.PI]:features.phasePoints.map(point=>number(general?point.x:point.xPiMultiple)*(general?1:Math.PI));
    const period=general?features.period:features.periodPiMultiple,periodLabel=general?`T=${period==='1'?'':period.includes('/')?'('+period+')':period}`:`T=${period==='1'?'':period.includes('/')?'('+period+')':period}π`,showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const periodLabelAt=p.function==='TAN'?[v[1],(v[2]+v[3])/2]:[(v[0]+v[1])/2,v[3]-(v[3]-v[2])*.08];
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'period-label',kind:'EQUATION_LABEL',text:periodLabel,at:periodLabelAt,math:true,priority:0}];
    return {id,visualType:'function_graph',viewport:graphViewport(v),axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...trigTickFacts(p,general?'ONE':'PI'),trigFeatures:features,trigFeaturePolicy:policy},objects};
  }
  if(plan.capability==='sqrt-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.sqrtFeatures;
    const general=features?.schemaVersion==='SQRT_AFFINE_GENERAL_FEATURES_v1';
    if(!features||(!general&&features.schemaVersion!=='SQRT_AFFINE_FEATURES_v1'))throw Error('SQRT_ENDPOINT_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const number=value=>general?exactValue(value):exactNumber(value);
    const polynomialText=values=>{const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');};
    const radicandText=polynomialText(p.radicand);
    let expression='sqrt('+radicandText+')',formulaText=expression,criticalX=features.sourceEndpoints.map(endpoint=>number(endpoint.x));
    const showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    if(general){
      const amplitude=p.amplitude??'1',sign=p.sign??1,offset=p.offset??'0',wrap=text=>/[+*/]/.test(text)&&!text.startsWith('(')?'('+text+')':text;
      const factor=sign===-1?(amplitude==='1'?'-':'-'+wrap(amplitude)+'*'):amplitude==='1'?'':wrap(amplitude)+'*';
      const offsetText=offset==='0'?'':(String(offset).startsWith('-')?offset:'+'+offset);
      formulaText=factor+'sqrt('+radicandText+')'+offsetText;
      expression='('+offset+')+('+sign+')*('+amplitude+')*sqrt('+radicandText+')';
      const boundary=number(features.radicandBoundaryX),slope=number(p.radicand[1]),scale=number(p.amplitude??'1')*(p.sign??1),plotSy=256/(v[3]-v[2]);
      const step=(1.2/(plotSy*Math.abs(scale)*Math.sqrt(Math.abs(slope))))**2;
      const boundaryProbe=boundary+(slope>0?step:-step);if(boundaryProbe>p.domain[0]&&boundaryProbe<p.domain[1])criticalX.push(boundaryProbe);
      criticalX.push(...(p.requiredPoints||[]).map(point=>point.x));
    }else{
      const boundary=exactNumber(features.radicandBoundaryX),start=exactNumber(features.sourceEndpoints[0].x),slope=exactNumber(p.radicand[1]),plotSy=256/(v[3]-v[2]);
      const boundaryStep=(1.2/(plotSy*Math.sqrt(slope)))**2;
      if(Math.abs(start-boundary)<1e-10&&boundary+boundaryStep<p.domain[1])criticalX.push(boundary+boundaryStep);
    }
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'formula',kind:'EQUATION_LABEL',text:'y='+formulaText,at:[v[0]+(v[1]-v[0])*(general?.72:.22),v[3]-(v[3]-v[2])*.12],priority:0}];
    if(features.sourceEndpoints.length>1){const end=features.sourceEndpoints[features.sourceEndpoints.length-1];objects.push({id:'sqrt-source-end-label',kind:'GRAPH_ANNOTATION',text:'x='+end.x,at:[number(end.x)-(v[1]-v[0])*.08,end.y+(v[3]-v[2])*.08],math:true,priority:0});}
    if(general&&p.domainRangeLabels===true){
      const text=value=>String(value),endpoint=features.endpoint,spanX=v[1]-v[0],spanY=v[3]-v[2];
      const domainText=features.sourceDomainMode==='CLOSED_INTERVAL'?text(features.sourceEndpoints[0].x)+'<=x<='+text(features.sourceEndpoints[1].x):(features.branchDirection==='RIGHT'?text(endpoint.x)+'<=x':'x<='+text(endpoint.x));
      const rangeText=features.rangeDirection==='ABOVE'?'y>='+text(endpoint.y):'y<='+text(endpoint.y);
      objects.push({id:'sqrt-domain-label',kind:'GRAPH_ANNOTATION',text:domainText,at:[v[0]+spanX*.06,v[3]-spanY*.21],math:true,priority:0});
      objects.push({id:'sqrt-range-label',kind:'GRAPH_ANNOTATION',text:rangeText,at:[v[0]+spanX*.06,v[3]-spanY*.30],math:true,priority:0});
    }
    if(general){
      const required=p.requiredPoints||[],exactCoordinates=p.exactCoordinates??{};
      if(!exactCoordinates||typeof exactCoordinates!=='object'||Array.isArray(exactCoordinates))throw Error('EXACT_COORDINATES_INVALID');
      for(const [pointId,pair] of Object.entries(exactCoordinates)){
        const point=required.find(other=>other?.id===pointId);
        if(!point||!Array.isArray(pair)||pair.length!==2||[point.x,point.y].some((value,k)=>Math.abs(exactValue(pair[k])-value)>1e-9*Math.max(1,Math.abs(value))))throw Error('EXACT_COORDINATES_MISMATCH:'+pointId);
      }
      const coordinateText=point=>exactCoordinates[point?.id]??(Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y)?[String(point.x),String(point.y)]:null);
      for(const [index,point] of required.entries()){
        if(!point||typeof point.id!=='string'||!point.id||!Number.isFinite(point.x)||!Number.isFinite(point.y))throw Error('SQRT_REQUIRED_POINT_INVALID');
        const markerId='required-point-'+(index+1),coordinates=coordinateText(point);
        objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],name:null});
        if(coordinates)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates});
      }
    }
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:general?610:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{sqrtFeatures:features,sqrtFeaturePolicy:p.sqrtFeaturePolicy,...(general?axisTickDisplayFacts(p):{})},objects};
  }
  if(plan.capability==='rational-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.rationalFeatures;
    if(features?.schemaVersion==='RATIONAL_CONSTANT_OVER_LINEAR_FEATURES_v1')return rationalConstantNumeratorSpec(plan,id);
    if(!features||features.schemaVersion!=='RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1')throw Error('RATIONAL_FEATURE_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const numerator=rationalPolynomialText(p.numerator),denominator=rationalPolynomialText(p.denominator),expression='('+numerator+')/('+denominator+')';
    const singularity=features.singularity,xSingularity=exactNumber(singularity.x),yAsymptote=exactNumber(features.horizontalAsymptoteY),objects=[
      {id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,breaks:[xSingularity],criticalX:features.xIntercept===null?[]:[exactNumber(features.xIntercept)]},
      {id:'formula',kind:'EQUATION_LABEL',text:'y='+expression,at:[v[0]+(v[1]-v[0])*.25,v[3]-(v[3]-v[2])*.12],priority:0},
      {id:'horizontal-asymptote-label',kind:'GRAPH_ANNOTATION',text:'y='+features.horizontalAsymptoteY,at:[v[0]+(v[1]-v[0])*.72,yAsymptote+(v[3]-v[2])*.07],math:true,priority:0}
    ];
    if(singularity.kind==='VERTICAL_POLE')objects.push({id:'vertical-asymptote-label',kind:'GRAPH_ANNOTATION',text:'x='+singularity.x,at:[xSingularity+(v[1]-v[0])*.07,v[3]-(v[3]-v[2])*.08],math:true,priority:0});
    else if(singularity.kind==='REMOVABLE_HOLE')objects.push({id:'removable-hole-label',kind:'GRAPH_ANNOTATION',text:'뚫린 점',at:[xSingularity+(v[1]-v[0])*.08,exactNumber(singularity.y)+(v[3]-v[2])*.08],priority:0});
    return {id,visualType:'function_graph',viewport:graphViewport(v,RATIONAL_OVERVIEW_CANVAS),axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),rationalGraphFeatures:features,rationalGraphPolicy:p.rationalFeaturePolicy},objects};
  }
  if(plan.capability==='piecewise-polynomial-spike-v1')return piecewisePolynomialSpec(plan,id);
  if(plan.capability==='piecewise-discontinuous-spike-v1')return piecewiseDiscontinuousSpec(plan,id);
  if(plan.capability==='multi-curve-figure-v1')return multiCurveSpec(plan,id);
  if(plan.capability==='polynomial-spike-v1'){
    const p=plan.graphPlan,v=p.viewport;const terms=p.coefficients.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    const expr=terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c;const coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join('');
    const degree=p.coefficients.reduce((highest,coefficient,index)=>coefficient==='0'?highest:index,0),cubicBand=degree>=3&&p.overviewHeaderBand===true&&p.plotHeightLimit!==undefined,canvas=degree>=3?(cubicBand?CUBIC_COMPOSITE_PANEL_CANVAS:GRAPH_OVERVIEW_CANVAS):p.plotCanvas!==undefined?equalUnitCanvas(p):p.compositeHeader!==undefined?COMPOSITE_PANEL_CANVAS:{...QUADRATIC_HEADER_CANVAS,...(p.overviewCanvasHeight!==undefined?{height:p.overviewCanvasHeight}:{})};
    // compositeHeader {formula:'CAPTION',sharedLines:[line IDs]} is set by composite-candidate-svg-v1 for a three-panel stack, never by an author: the
    // composite typesets the formula in the panel's caption row and the shared line equations once above the stack, so the panel leaves them out.
    const header=p.compositeHeader;
    if(header!==undefined&&(degree>2||p.overviewCanvasHeight!==undefined||!header||typeof header!=='object'||Object.keys(header).sort().join(',')!=='formula,sharedLines'||header.formula!=='CAPTION'||!Array.isArray(header.sharedLines)||header.sharedLines.some(id=>!(p.lines||[]).some(line=>line?.id===id))))throw Error('COMPOSITE_HEADER_INVALID');
    if(degree<=2&&header===undefined&&p.plotCanvas===undefined&&(!Number.isSafeInteger(canvas.height)||canvas.height<400||canvas.height>600))throw Error('POLYNOMIAL_OVERVIEW_CANVAS_HEIGHT_INVALID');
    const framedCriticalX=(p.overviewFeatures||[]).filter(feature=>feature.kind==='POLYNOMIAL_FEATURE').map(feature=>feature.x);
    const criticalX=[...new Set([...(p.requiredPoints||[]).map(point=>point.x),...framedCriticalX])];
    // Degree>=3 formula: an unparenthesised coefficient keeps a fraction stacked above the fraction bar (x^3-3/4*x-1/4 reads
    // x^3 - (3/4)x - 1/4); the sampling expression above stays fully parenthesised.
    const displayTerms=(degree>=3?[...p.coefficients.map((coefficient,index)=>({coefficient,index})).filter(({coefficient})=>coefficient!=='0').reverse()]:[]);
    const cubicDisplay=displayTerms.map(({coefficient,index},position)=>{const negative=coefficient.startsWith('-'),magnitude=negative?coefficient.slice(1):coefficient,body=index===0?magnitude:(magnitude==='1'?'':magnitude+'*')+'x'+(index>1?'^'+index:'');return (position===0?(negative?'-':''):negative?'-':'+')+body}).join('');
    const displayedExpression=degree>=3?cubicDisplay:quadraticVertexNotation(p.coefficients)?.expression??expr;
    if(p.tickLabelCallouts!==undefined){
      const q13Quadratic=p.family==='polynomial'&&p.coefficients.join(',')==='-1/2,3,1/2'&&p.overviewCanvasHeight===600&&(p.requiredPoints||[]).some(point=>point.x===-3&&point.y===-5);
      if(!q13Quadratic||!Array.isArray(p.tickLabelCallouts)||p.tickLabelCallouts.length!==1)throw Error('TICK_LABEL_CALLOUT_Q13_ONLY');
      const callout=p.tickLabelCallouts[0];
      if(!callout||Object.keys(callout).sort().join(',')!=='axis,offsetUser,value'||callout.axis!=='x'||callout.value!=='-6'||!Array.isArray(callout.offsetUser)||callout.offsetUser.length!==2||callout.offsetUser[0]!==28||callout.offsetUser[1]!==-22)throw Error('TICK_LABEL_CALLOUT_Q13_BINDING_INVALID');
    }
    const axisVariable=p.axisVariable??'x';
    if(typeof axisVariable!=='string'||!(p.applicationAxes===true?/^[A-XZa-xz]$/:/^[a-xz]$/).test(axisVariable))throw Error('INVALID_AXIS_VARIABLE');
    const shownExpression=axisVariable==='x'?displayedExpression:displayedExpression.replace(/x/g,axisVariable);
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression:expr,domain:p.domain,criticalX},...(header?[]:[{id:'formula',kind:'EQUATION_LABEL',text:'y='+shownExpression,at:[v[0]+(v[1]-v[0])*(degree>=3?.22:.3),v[3]-(v[3]-v[2])*.12]}])];
    // coordinatePlacement:'PANEL' / coordinatePanel:[required point IDs] (HEADER_BAND quadratics only): each listed integer key point is named by
    // its id at the dot and its coordinates go to rows under the formula as "P(x,y)", so crowded key points keep readable coordinates.
    if(plan.coordinatePlacement!==undefined&&plan.coordinatePlacement!=='PANEL')throw Error('UNSUPPORTED_COORDINATE_PLACEMENT');
    const required=p.requiredPoints||[],linePointList=p.linePoints??[],integerKey=point=>Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y);
    // graphPlan.exactCoordinates {pointId:[x text, y text]}: exact values (fractions, square roots) for key points or line points whose coordinates
    // are not integers; each must equal the point's x,y to 1e-9, and the engine re-checks the label against the drawn point.
    const exactCoordinates=p.exactCoordinates??{};
    if(!exactCoordinates||typeof exactCoordinates!=='object'||Array.isArray(exactCoordinates))throw Error('EXACT_COORDINATES_INVALID');
    for(const [pointId,pair] of Object.entries(exactCoordinates)){
      const point=[...required,...linePointList].find(other=>other?.id===pointId);
      if(!point||!Array.isArray(pair)||pair.length!==2||[point.x,point.y].some((value,k)=>Math.abs(exactValue(pair[k])-value)>1e-9*Math.max(1,Math.abs(value))))throw Error('EXACT_COORDINATES_MISMATCH:'+pointId);
    }
    const coordinateText=point=>exactCoordinates[point?.id]??(integerKey(point)?[String(point.x),String(point.y)]:null);
    const pointNames=pointNameModel(plan,[...required.map(point=>point?.id),...overlayPointIds(plan)]),nameLike=id=>pointNames.has(id)||/^[A-Z][0-9']?$/.test(id),graphPanel=new Set([...(plan.coordinatePlacement==='PANEL'?required.filter(point=>coordinateText(point)&&nameLike(point.id)).map(point=>point.id):plan.coordinatePanel||[]),...required.filter(point=>pointNames.has(point?.id)&&coordinateText(point)).map(point=>point.id)]);
    if(graphPanel.size&&degree>2)throw Error('COORDINATE_PANEL_NEEDS_HEADER_BAND');
    for(const pointId of graphPanel)if(!nameLike(pointId)||!coordinateText(required.find(point=>point.id===pointId)))throw Error('COORDINATE_PANEL_POINT_INVALID:'+pointId);
    // labelDirections {pointId: N|NE|E|SE|S|SW|W|NW}: first layout direction for a key point's coordinate label (not for band points).
    const graphDirections=plan.labelDirections??{};
    if(!graphDirections||typeof graphDirections!=='object'||Array.isArray(graphDirections)||Object.entries(graphDirections).some(([pointId,direction])=>!required.some(point=>point.id===pointId)||graphPanel.has(pointId)||!['N','NE','E','SE','S','SW','W','NW'].includes(direction)))throw Error('INVALID_LABEL_DIRECTIONS');
    const panelLabels=[];
    for(const [index,point] of (p.requiredPoints||[]).entries()){
      if(!point||typeof point.id!=='string'||!point.id||!Number.isFinite(point.x)||!Number.isFinite(point.y))throw Error('POLYNOMIAL_REQUIRED_POINT_INVALID');
      if(graphPanel.has(point.id)){
        const markerId='required-point-'+(index+1),labelId=markerId+'-coordinate-panel';panelLabels.push(labelId);
        objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],name:pointNames.tex(point.id)});
        objects.push({id:labelId,kind:'EQUATION_LABEL',target:markerId,text:pointNames.expr(point.id)+'('+coordinateText(point).map(unwrapParentheses).join(',')+')',at:[point.x,point.y],priority:0});
        continue;
      }
      // A marker id is internal: without an exact coordinate label the point is a bare dot (name null), never "required-point-N" text.
      const markerId='required-point-'+(index+1),coordinates=coordinateText(point);
      objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],...(coordinates?{}:pointNames.has(point.id)?{name:pointNames.tex(point.id)}:{name:null})});
      if(coordinates)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates,...(graphDirections[point.id]?{preferred:graphDirections[point.id]}:{})});
    }
    // graphPlan.lines (HEADER_BAND quadratics): exact lines y=slope*x+intercept with the points they pass through (checked here to 1e-9 of the
    // declared rationals; tangentAt also checks the curve's slope at that key point). graphPlan.linePoints are points on a line, off the curve.
    // Each line equation goes to the band under the formula; the lines themselves are audited in the final SVG by the primitive observer.
    const lines=p.lines??[],linePoints=p.linePoints??[];
    if(!Array.isArray(lines)||lines.length>4||!Array.isArray(linePoints)||linePoints.length>4)throw Error('GRAPH_LINES_INVALID');
    if((lines.length||linePoints.length)&&degree>2)throw Error('GRAPH_LINES_NEED_HEADER_BAND');
    const rationalNumber=text=>{if(typeof text!=='string'||!/^-?\d+(?:\/\d+)?$/.test(text))throw Error('GRAPH_LINE_COEFFICIENT_INVALID');const [n,d='1']=text.split('/');if(Number(d)===0)throw Error('GRAPH_LINE_COEFFICIENT_INVALID');return Number(n)/Number(d);};
    const curveCoefficients=p.coefficients.map(rationalNumber),curveSlope=x=>curveCoefficients.reduce((sum,c,i)=>i?sum+i*c*x**(i-1):sum,0);
    const pointsById=new Map([...required,...linePoints].map(point=>[point?.id,point]));
    for(const [index,point] of linePoints.entries()){
      if(!point||Object.keys(point).sort().join(',')!=='id,x,y'||typeof point.id!=='string'||!Number.isFinite(point.x)||!Number.isFinite(point.y)||required.some(other=>other.id===point.id))throw Error('GRAPH_LINE_POINT_INVALID');
      if(!(v[0]<point.x&&point.x<v[1]&&v[2]<point.y&&point.y<v[3]))throw Error('GRAPH_LINE_POINT_OUTSIDE_VIEW:'+point.id);
      const markerId='line-point-'+(index+1),coordinates=coordinateText(point);
      objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],...(coordinates?{}:pointNames.has(point.id)?{name:pointNames.tex(point.id)}:{name:null})});
      if(coordinates)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates});
    }
    const lineLabels=[];
    for(const line of lines){
      if(!line||Object.keys(line).some(key=>!['id','slope','intercept','through','tangentAt'].includes(key))||typeof line.id!=='string'||!/^[A-Za-z][A-Za-z0-9]{0,7}$/.test(line.id))throw Error('GRAPH_LINE_INVALID');
      const m=exactValue(line.slope),q=exactValue(line.intercept),through=line.through??[];
      if(!Array.isArray(through))throw Error('GRAPH_LINE_INVALID');
      for(const pointId of through){
        const point=pointsById.get(pointId);if(!point)throw Error('GRAPH_LINE_POINT_UNKNOWN:'+pointId);
        if(Math.abs(m*point.x+q-point.y)>1e-9*Math.max(1,Math.abs(point.y)))throw Error('GRAPH_LINE_INCIDENCE_FAIL:'+line.id+':'+pointId);
      }
      if(line.tangentAt!==undefined){
        const point=required.find(other=>other.id===line.tangentAt);
        if(!point||!through.includes(line.tangentAt)||Math.abs(curveSlope(point.x)-m)>1e-9*Math.max(1,Math.abs(m)))throw Error('GRAPH_LINE_TANGENCY_FAIL:'+line.id);
      }
      const lineId='line-'+line.id,labelId=lineId+'-equation',shared=header?.sharedLines.includes(line.id);if(!shared)lineLabels.push(labelId);
      objects.push({id:lineId,kind:'LINE',coefficients:[m,-1,q]});
      // A slope with a square root or several terms is bracketed before x; an intercept is appended as written (its own sign leads).
      const plainRational=/^-?\d+(?:\/\d+)?$/.test(line.slope);
      const slopeText=line.slope==='0'?'':line.slope==='1'?'x':line.slope==='-1'?'-x':plainRational?line.slope+'*x':'('+line.slope+')*x';
      const interceptText=line.intercept==='0'?(slopeText?'':'0'):line.intercept.startsWith('-')?line.intercept:(slopeText?'+':'')+line.intercept;
      if(!shared)objects.push({id:labelId,kind:'EQUATION_LABEL',text:'y='+slopeText+interceptText,at:[(v[0]+v[1])/2,v[3]],priority:0});
    }
    // The band rows (line equations first, then key point coordinates) extend the header band: two columns, 34 px rows; the canvas grows by as much.
    // Each line equation takes a whole row (it can be long); the key point coordinates follow in two columns, or one per row when any is long.
    const longCoordinate=objects.some(object=>panelLabels.includes(object.id)&&object.text.length>10),columns=longCoordinate?1:2;
    const coordinateRows=Math.ceil(panelLabels.length/columns),textOf=labelId=>objects.find(object=>object.id===labelId)?.text??'';
    const rows=[...lineLabels.map(labelId=>[labelId]),...Array.from({length:coordinateRows},(_,r)=>panelLabels.slice(r*columns,r*columns+columns))];
    const pitches=rows.map(row=>bandRowPitch(row.map(textOf)));
    const bandExtra=rows.length?26+pitches.reduce((sum,pitch)=>sum+pitch,0):0;// 14 px under the last row keeps the axis letter clear of it
    // The Archive solution image is at most 640 CSS px high at the 0.5823 display scale: 1099 intrinsic px for a figure at one scale.
    if(canvas.height+bandExtra>(p.plotCanvas!==undefined?1099:800))throw Error('COORDINATE_PANEL_TOO_TALL');
    // Without the formula header (a composite panel) the band rows move up by its 80 px.
    const firstRow=header?55:135;
    const rowCenters=bandRowCenters(pitches,firstRow);
    const bandCenters=Object.fromEntries(rows.flatMap((row,r)=>row.map((labelId,k)=>[labelId,[r<lineLabels.length||panelLabels.length===1||columns===1?canvas.width/2:canvas.width*(k?.72:.28),rowCenters[r]]])));
    return {id,visualType:'function_graph',viewport:{...graphViewport(v,{...canvas,height:canvas.height+bandExtra}),...(degree<=2||cubicBand?{topInset:canvas.topInset+bandExtra}:{}),...(p.equalUnits===true&&(p.axisRatio??1)===1?{equalUnits:true}:{})},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),...(axisVariable!=='x'?{axisVariable}:{}),...(degree<=2?{formulaPlacement:'HEADER_BAND',equationLabelCenters:{...(header?{}:{formula:[canvas.width/2,72]}),...bandCenters}}:cubicBand?{formulaPlacement:'HEADER_BAND',equationLabelCenters:{formula:[canvas.width/2,72]}}:{}),...(p.intervalFeatures?{intervalFeatures:p.intervalFeatures,intervalFeaturePolicy:p.intervalFeaturePolicy}:{})},objects};
  }
  const displayed=displayGeometryInventory(plan,model),points=displayed.points;const xs=Object.values(points).map(p=>p.approximation[0]),ys=Object.values(points).map(p=>p.approximation[1]);for(const q of [...regionExtentPoints(plan,points),...traceJoinExtentPoints(plan,points),...textLabelExtentPoints(plan)]){xs.push(q[0]);ys.push(q[1]);}   // a region's arc can bulge past the displayed points, and so can a joined trace arc
  // callouts (E37): the pulled-out copies stand beside the main figure's box, inside the same frame ([] without planeMarks.callouts: nothing below changes)
  const callouts=calloutEntries(plan,points,{xMin:Math.min(...xs),xMax:Math.max(...xs),yMin:Math.min(...ys),yMax:Math.max(...ys)},new Set(Array.isArray(plan.hiddenPointNames)?plan.hiddenPointNames:[]));
  for(const q of calloutExtentPoints(callouts)){xs.push(q[0]);ys.push(q[1]);}
  // A plane figure (no axes) is fitted tightly: the engine's own margin already leaves room for the point names.
  const span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1e-9),pad=span*(isPlaneFigure(plan)?.06:.35);
  // hiddenPointNames:[point IDs] draws derived helper points as bare dots: never a GIVEN/CONCLUSION point. (E31) A hidden point may also be listed in coordinateLabels: its name stays
  // unwritten and only its coordinates (1,-1) stand beside it (an unnamed intersection or intercept of the source figure).
  // A plane figure (axis-free PLANE_FIGURE_v1) or a coordinate figure with axes (SOURCE_COORDINATE_AXES_v1) may also list a SOURCE_POINT (a point the
  // source figure does not name): it is drawn without its name and is refused when pointNames, coordinateLabels or a caption/label text still names it.
  // hiddenPointStyle 'DOT' (default) draws the hidden point as a bare dot, 'NONE' (plane or coordinate figure only) draws no dot at all (a textbook line
  // crossing or polygon vertex, the foot of a perpendicular that only guides a dashed segment).
  const hiddenNames=new Set(plan.hiddenPointNames??[]),planeFigure=isPlaneFigure(plan),coordinateFigure=isCoordinateFigure(plan,model),markFigure=planeFigure||coordinateFigure;
  // (E31) a hidden point may write its coordinates only in a coordinate figure (axes); a plane figure or any other construction still refuses it.
  if(!Array.isArray(plan.hiddenPointNames??[])||[...hiddenNames].some(id=>{const node=plan.mathPlan.nodes.find(n=>n.id===id);return !Object.hasOwn(points,id)||!node||(node.op==='SOURCE_POINT'?!markFigure:node.factRole!=='DERIVED_INTERMEDIATE')||(!coordinateFigure&&(plan.coordinateLabels||[]).includes(id));}))throw Error('INVALID_HIDDEN_POINT_NAMES');
  if(plan.hiddenPointStyle!==undefined&&!['DOT','NONE'].includes(plan.hiddenPointStyle))throw Error('INVALID_HIDDEN_POINT_STYLE');
  if(plan.hiddenPointStyle==='NONE'){
    if(!markFigure)throw Error('HIDDEN_POINT_STYLE_REQUIRES_PLANE_FIGURE');
    if(!hiddenNames.size)throw Error('HIDDEN_POINT_STYLE_WITHOUT_HIDDEN_POINTS');
  }
  // unmarkedPointNames:[ids] (default style): those hidden points alone are drawn with no dot; the other hidden points keep their dot.
  if(plan.unmarkedPointNames!==undefined){
    if(!markFigure)throw Error('HIDDEN_POINT_STYLE_REQUIRES_PLANE_FIGURE');
    if(plan.hiddenPointStyle==='NONE')throw Error('UNMARKED_POINT_NAMES_WITH_STYLE_NONE');
    if(!Array.isArray(plan.unmarkedPointNames)||!plan.unmarkedPointNames.length||new Set(plan.unmarkedPointNames).size!==plan.unmarkedPointNames.length||plan.unmarkedPointNames.some(id=>!hiddenNames.has(id)))throw Error('INVALID_UNMARKED_POINT_NAMES');
  }
  if(markFigure)for(const id of hiddenNames)if(plan.mathPlan.nodes.find(n=>n.id===id)?.op==='SOURCE_POINT'&&planNameTexts(plan,id).some(text=>textNamesPoint(text,id)))throw Error('HIDDEN_POINT_NAMED_IN_TEXT:'+id);
  const unmarked=new Set(unmarkedPointIds(plan));
  const pointNames=pointNameModel(plan,Object.keys(points));
  for(const entry of pointNames.entries())if(hiddenNames.has(entry.id))throw Error('POINT_NAME_TARGET_HIDDEN:'+entry.id);
  const objects=Object.entries(points).map(([name,p])=>({id:name,kind:'POINT',at:p.approximation,...(hiddenNames.has(name)?{name:null,...(unmarked.has(name)?{marker:'NONE'}:{})}:pointNames.has(name)?{name:pointNames.tex(name)}:{})}));const notationByLabel={},factRolesByLabel={},axisCoincidentLines=displayed.axisCoincidentLines;
  for(const node of plan.mathPlan.nodes){
    if(node.outputType==='LINE'&&Object.hasOwn(displayed.lines,node.id)){
      const fact=model.lines?.[node.id];if(!fact||!Array.isArray(fact.approximation)||fact.approximation.length!==3)throw Error('CONSTRUCTION_LINE_FACT_REQUIRED:'+node.id);
      objects.push({id:node.id,kind:'LINE',coefficients:fact.approximation});
    }else if(node.outputType==='CIRCLE'&&Object.hasOwn(displayed.circles,node.id)){
      const fact=model.circles?.[node.id];if(!fact||!Array.isArray(fact.approximation)||fact.approximation.length!==3)throw Error('CONSTRUCTION_CIRCLE_FACT_REQUIRED:'+node.id);
      objects.push({id:node.id,kind:'CIRCLE',center:fact.approximation.slice(0,2),radius:fact.approximation[2]});
    }
  }
  for(const s of plan.displaySegments||[]){
    if(!points[s.refs[0]]||!points[s.refs[1]])throw Error('DISPLAY_SEGMENT_UNKNOWN_REF');
    if((s.dashed!==undefined&&typeof s.dashed!=='boolean')||(s.arrow!==undefined&&!['START','END','BOTH'].includes(s.arrow)))throw Error('DISPLAY_SEGMENT_STYLE_INVALID:'+s.id);
    // emphasis:'BOLD' (heavy stroke) or 'ACCENT' (heavy red stroke) singles out one displayed segment; every other segment keeps the default style.
    if(s.emphasis!==undefined&&!['BOLD','ACCENT'].includes(s.emphasis))throw Error('DISPLAY_SEGMENT_EMPHASIS_INVALID:'+s.id);
    // Dashed helper segments, arrows and emphasis are part of the same marking vocabulary and also work on a coordinate figure.
    if((s.dashed!==undefined||s.arrow!==undefined||s.emphasis!==undefined)&&!isPlaneFigure(plan)&&!isCoordinateFigure(plan,model))throw Error('DISPLAY_SEGMENT_STYLE_REQUIRES_PLANE_FIGURE:'+s.id);
    objects.push({id:s.id,kind:'SEGMENT',from:points[s.refs[0]].approximation,to:points[s.refs[1]].approximation,...(s.dashed?{dash:true}:{}),...(s.arrow?{arrow:s.arrow}:{}),...(s.emphasis?{emphasis:s.emphasis}:{})});
  }
  // coordinatePlacement:'PANEL' (도형추출.md 6-7-1): point names stay at their points and each exact coordinate moves to a band above the plot
  // as one "A(x,y)" label, so a crowded coordinate figure keeps every coordinate at the Archive font floor. Same exact source as below.
  if(plan.coordinatePlacement!==undefined&&plan.coordinatePlacement!=='PANEL')throw Error('UNSUPPORTED_COORDINATE_PLACEMENT');
  // coordinatePanel:[point IDs] moves only those coordinates to the band ('PANEL' moves all); labelDirections {pointId: N|NE|E|SE|S|SW|W|NW}
  // is the first direction the layout tries for that point's coordinate label at the point (the rest are still tried).
  const labelled=plan.coordinateLabels||[],labelDirections=plan.labelDirections??{};
  if(plan.coordinatePanel!==undefined&&(!Array.isArray(plan.coordinatePanel)||plan.coordinatePanel.some(id=>!labelled.includes(id))))throw Error('COORDINATE_PANEL_NOT_A_COORDINATE_LABEL');
  // A hidden point's coordinates stay at the point (the band writes name(x,y), and it has no name).
  if(plan.coordinatePanel!==undefined&&Array.isArray(plan.coordinatePanel)){const hiddenInBand=plan.coordinatePanel.find(id=>hiddenNames.has(id));if(hiddenInBand!==undefined)throw Error('COORDINATE_PANEL_HIDDEN_POINT:'+hiddenInBand);}
  const inPanel=new Set(plan.coordinatePlacement==='PANEL'?labelled.filter(id=>!hiddenNames.has(id)):plan.coordinatePanel||[]);
  if(!labelDirections||typeof labelDirections!=='object'||Array.isArray(labelDirections)||Object.entries(labelDirections).some(([id,direction])=>!labelled.includes(id)||inPanel.has(id)||!['N','NE','E','SE','S','SW','W','NW'].includes(direction)))throw Error('INVALID_LABEL_DIRECTIONS');
  const panelLabels=[];
  for(const id of plan.coordinateLabels||[]){
    const node=plan.mathPlan.nodes.find(n=>n.id===id),point=points[id];
    if(!node||node.outputType!=='POINT'||!point?.exact?.length)throw Error('VERIFIED_POINT_COORDINATE_REQUIRED:'+id);
    // Derived coordinates come exclusively from the independently rebuilt
    // exact model, never from planner-authored approximate coordinates.
    const coordinates=node.op==='SOURCE_POINT'?node.args.coordinates:point.exact;
    // A hidden point's coordinates are written beside its dot (the label is owned by that marker): the dot stays.
    if(hiddenNames.has(id)&&(plan.hiddenPointStyle==='NONE'||(plan.unmarkedPointNames||[]).includes(id)))throw Error('COORDINATE_LABEL_POINT_UNMARKED:'+id);
    if(!hiddenNames.has(id))objects.push({id:id+'-name',kind:'POINT_NAME',target:id,text:pointNames.tex(id),priority:0});
    if(inPanel.has(id)){
      const labelId=id+'-coordinate-panel';panelLabels.push(labelId);
      objects.push({id:labelId,kind:'EQUATION_LABEL',target:id,text:pointNames.expr(id)+'('+coordinates.map(value=>unwrapParentheses(scalarExpression(value))).join(',')+')',at:point.approximation,priority:0});
      factRolesByLabel[labelId]=node.factRole;
      continue;
    }
    objects.push({id:id+'-coordinate',kind:'COORDINATE_LABEL',target:id,exact:coordinates.map(scalarExpression),...(hiddenNames.has(id)?{ringLeader:true,lineBarrier:true}:{}),...(labelDirections[id]?{preferred:labelDirections[id]}:{})});
    factRolesByLabel[id+'-coordinate']=node.factRole;
  }
  // lineLabels:[{nodeId,form:'SLOPE_INTERCEPT'|'GENERAL'}] writes the equation of a displayed SOURCE_LINE beside it, built from its exact coefficients.
  const lineLabelIds=new Set();
  for(const label of plan.lineLabels||[]){
    const node=plan.mathPlan.nodes.find(n=>n.id===label.nodeId);
    if(!node||node.op!=='SOURCE_LINE'||!Object.hasOwn(displayed.lines,node.id)||lineLabelIds.has(node.id)||(label.text===undefined?!['SLOPE_INTERCEPT','GENERAL'].includes(label.form):label.form!==undefined)||Object.keys(label).some(key=>!['nodeId','form','labelAt','text','values'].includes(key))||(label.values!==undefined&&label.text===undefined))throw Error('INVALID_LINE_LABEL');
    if(label.labelAt!==undefined&&!lineAtValid(label.labelAt))throw Error('LINE_LABEL_AT_INVALID:'+label.nodeId);
    lineLabelIds.add(node.id);
    const [ca,cb,cc]=['a','b','c'].map(k=>exactSurd(node.args[k]));
    if(label.text!==undefined)freeLineTextOk(label,[ca,cb,cc]);
    const lo=[Math.min(...xs)-pad,Math.min(...ys)-pad],hi=[Math.max(...xs)+pad,Math.max(...ys)+pad],coef=[ca,cb,cc].map(v=>Number(v.p[0])/Number(v.p[1])+(v.q[0]===0n?0:Number(v.q[0])/Number(v.q[1])*Math.sqrt(Number(v.r))));
    // Anchor at the end of the drawn line: clip a x+b y+c=0 to the view, then take the end that is higher (steep line) or further right (flat line), just inside the frame.
    const ends=[];const [A,B,C]=coef;
    for(const x of [lo[0],hi[0]])if(B!==0){const y=-(A*x+C)/B;if(y>=lo[1]-1e-9&&y<=hi[1]+1e-9)ends.push([x,y]);}
    for(const y of [lo[1],hi[1]])if(A!==0){const x=-(B*y+C)/A;if(x>=lo[0]-1e-9&&x<=hi[0]+1e-9&&!ends.some(e=>Math.hypot(e[0]-x,e[1]-y)<1e-9))ends.push([x,y]);}
    if(ends.length<2)throw Error('LINE_LABEL_LINE_NOT_IN_VIEW');
    // Anchors on the line, preferred end first (higher for a steep line, further right for a flat one): near the end, a little in, further in; then the other end.
    const steep=Math.abs(A)>Math.abs(B),first=ends.reduce((p,q)=>(steep?q[1]>p[1]:q[0]>p[0])?q:p),second=ends.find(e=>e!==first),mid=[(first[0]+second[0])/2,(first[1]+second[1])/2];
    const anchors=[[first,.08],[first,.22],[first,.4],[second,.08],[second,.22],[second,.4]].map(([e,t])=>[e[0]+(mid[0]-e[0])*t*2,e[1]+(mid[1]-e[1])*t*2]),at=anchors[0];
    const id=node.id+'-equation';objects.push({id,kind:'EQUATION_LABEL',target:node.id,lineOwned:true,text:label.text!==undefined?label.text:lineEquationText(ca,cb,cc,label.form),at,alternateAt:anchors.slice(1),priority:1,...(label.labelAt!==undefined?{lineAt:label.labelAt}:{})});factRolesByLabel[id]=node.factRole;
  }
  for(const label of plan.scalarLabels||[]){
    const scalar=model.scalars[label.nodeId];if(!scalar)throw Error('SCALAR_LABEL_UNKNOWN_NODE');
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment)throw Error('SCALAR_LABEL_OWNER_MISSING');
    const [a,b]=segment.refs.map(r=>points[r].approximation);
    const scalarNode=plan.mathPlan.nodes.find(n=>n.id===label.nodeId),role=scalarNode.factRole;
    const sourceLength=(!!label.unit||(!label.prefix&&scalarNode.op==='SEGMENT_LENGTH'))&&role!=='CONCLUSION';
    const prefix=normalizeScalarLabelPrefix(label.prefix);
    // `value` (SEGMENT_LENGTH only): the author's exact text of a length whose construction has no closed form (a segment between intersection points).
    // It is parsed here and must equal the engine's own value, so a wrong text never reaches the picture; without it that length is UNSUPPORTED_SCALAR_NOTATION.
    let valueText;
    if(label.value!==undefined){
      if(scalarNode.op!=='SEGMENT_LENGTH')throw Error('SCALAR_LABEL_VALUE_REQUIRES_SEGMENT_LENGTH:'+label.nodeId);
      let declared;try{declared=exactValue(label.value);}catch{throw Error('SCALAR_LABEL_VALUE_INVALID:'+label.nodeId);}
      if(!(Math.abs(declared-scalar.approximation)<=1e-9))throw Error('SCALAR_LABEL_VALUE_MISMATCH:'+label.nodeId+':declared='+declared+':computed='+scalar.approximation);
      valueText=unwrapParentheses(label.value.replace(/\s+/g,''));
    }else valueText=unwrapParentheses(scalarExpression(scalar.exact));
    const id=label.nodeId+'-value';objects.push({id,kind:sourceLength?'LENGTH_LABEL':'EQUATION_LABEL',target:label.ownerSegment,...(sourceLength?{refs:[label.ownerSegment],value:scalar.approximation}:{}),text:(sourceLength||!prefix?'':prefix+'=')+valueText,at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[id]={...(!sourceLength&&/^[A-Z]{2}$/.test(label.prefix)?{entity:label.prefix}:{}),...(label.unit?{unit:label.unit}:{})};factRolesByLabel[id]=role;
  }
  for(const label of plan.segmentLabels||[]){
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment||!/^[A-Za-z]$/.test(label.variable))throw Error('UNSUPPORTED_SEGMENT_NOTATION');
    const [a,b]=segment.refs.map(r=>points[r].approximation);
    objects.push({id:label.id,kind:'EQUATION_LABEL',target:label.ownerSegment,text:label.variable,at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[label.id]=label.unit?{unit:label.unit}:{};factRolesByLabel[label.id]=label.factRole;
  }
  for(const angle of plan.rightAngles||[]){
    // label (E30): an expression written beside the right angle mark (3x, x+20°, 3x=90°): letters, digits, spaces and ( ) , < > = + - . ° only
    if(angle.label!==undefined&&(typeof angle.label!=='string'||!TEXT_LABEL_MATH.test(angle.label)||TEXT_LABEL_FUNCTIONS.test(angle.label)||TEXT_LABEL_HANGUL.test(angle.label)))throw Error('RIGHT_ANGLE_LABEL_INVALID:'+angle.id);
    objects.push({id:angle.id,kind:'ANGLE_MARK',refs:angle.refs,value:90,...(angle.label!==undefined?{labelText:angle.label,labelKind:'MATH'}:{})});
    if(angle.label!==undefined)factRolesByLabel[angle.id+'-label']=angle.factRole??'DERIVED_INTERMEDIATE';
  }
  // planeMarks (plane-marks.mjs): angle arcs, equal ticks, parallel arrows, expression labels, highlighted arcs; each is checked against the model here.
  const planeMarkFacts=planeMarkSpec(plan,model,points,new Set((plan.displaySegments||[]).map(s=>s.id)));
  objects.push(...planeMarkFacts.objects);Object.assign(factRolesByLabel,planeMarkFacts.factRolesByLabel);
  const calloutFacts=calloutSpec(plan,model,callouts,pointNames);objects.push(...calloutFacts.objects);Object.assign(factRolesByLabel,calloutFacts.factRolesByLabel);   // E37
  const coordinateCanvas=plan.coordinateCanvas??{width:384,height:320};
  if(plan.coordinateCanvas!==undefined&&model.coordinateMode!=='SOURCE_COORDINATES'&&!isPlaneFigure(plan))throw Error('COORDINATE_CANVAS_SOURCE_FRAME_REQUIRED');
  if(!Number.isSafeInteger(coordinateCanvas.width)||coordinateCanvas.width<384||coordinateCanvas.width>720||!Number.isSafeInteger(coordinateCanvas.height)||coordinateCanvas.height<320||coordinateCanvas.height>600)throw Error('COORDINATE_CANVAS_BOUNDS_INVALID');
  // The coordinate band adds height above the plot (two columns; 34 px rows, 56 with a fraction) instead of shrinking the plot.
  const textOf=labelId=>objects.find(object=>object.id===labelId)?.text??'',panelRows=Array.from({length:Math.ceil(panelLabels.length/2)},(_,r)=>panelLabels.slice(2*r,2*r+2));
  const panelPitches=panelRows.map(row=>bandRowPitch(row.map(textOf))),panelCenters=bandRowCenters(panelPitches,55);
  const topInset=panelLabels.length?26+panelPitches.reduce((sum,pitch)=>sum+pitch,0):0,height=coordinateCanvas.height+topInset;
  if(height>600)throw Error('COORDINATE_PANEL_TOO_TALL');
  const equationLabelCenters=Object.fromEntries(panelLabels.map((labelId,i)=>[labelId,[panelLabels.length===1?coordinateCanvas.width/2:coordinateCanvas.width*(i%2?.72:.28),panelCenters[Math.floor(i/2)]]]));
  // A plane figure with a label on a circular arc (outside its circle) widens its frame so the label has canvas room; every other figure keeps the tight frame.
  const frame=dimensionFraming(plan,model,points,arcLabelFraming(plan,model,points,{xMin:Math.min(...xs)-pad,xMax:Math.max(...xs)+pad,yMin:Math.min(...ys)-pad,yMax:Math.max(...ys)+pad},coordinateCanvas),coordinateCanvas,calloutDimensionSites(callouts));
  return {id,visualType:'line_circle_geometry',viewport:{xMin:frame.xMin,xMax:frame.xMax,yMin:frame.yMin,yMax:frame.yMax,width:coordinateCanvas.width,height,panel:0,...(topInset?{topInset}:{})},axes:model.coordinateMode==='SOURCE_COORDINATES',title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{notationByLabel,factRolesByLabel,squareAngleIds:(plan.rightAngles||[]).map(a=>a.id),...axisTickDisplayFacts(plan),...(panelLabels.length?{equationLabelCenters}:{}),...(axisCoincidentLines.length?{axisCoincidentLines}:{})},objects};
}

// piecewise-polynomial-spike-v1: one continuous function of up to three pieces (degree <= 2) framed at one scale by graph_framing
// (fit_piecewise_polynomial), which has already checked every claim (continuity, corners and vertices among requiredPoints, the exact
// intersections with each horizontal line, the display formula). The figure follows the HEADER_BAND quadratic layout: the formula (when the
// plan gives one) on top, then a band row per line (y=c) and the key point coordinates that go to the band, then the plot.
function piecewisePolynomialSpec(plan,id){
  const p=plan.graphPlan,v=p.viewport,features=p.piecewisePolynomialFeatures,plot=p.plotCanvas;
  if(p.family!=='piecewise-polynomial'||!features||features.schemaVersion!=='PIECEWISE_POLYNOMIAL_FEATURES_v1'||!Array.isArray(features.pieces)||!Array.isArray(features.intersections))throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
  if(p.equalUnits!==true||!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  if(p.formula!==undefined&&(typeof p.formula!=='string'||!p.formula))throw Error('PIECEWISE_POLY_FORMULA_INVALID');
  // functionName (one letter) names the function: with a formula the header reads f(x)=formula; without one (a function given only by
  // pieces) the name goes next to the curve itself, so the student can tell the two curves apart.
  const functionName=p.functionName;
  if(functionName!==undefined&&(typeof functionName!=='string'||!/^[a-hj-wz]$/.test(functionName)))throw Error('PIECEWISE_POLY_FUNCTION_NAME_INVALID');
  if(p.sampleNote!==undefined&&(typeof p.sampleNote!=='string'||!/^[0-9A-Za-z=+\-*/(). ]{1,32}$/.test(p.sampleNote)||!p.sampleNote.trim()))throw Error('PIECEWISE_POLY_SAMPLE_NOTE_INVALID');
  const headerText=p.formula!==undefined?(functionName?functionName+'(x)':'y')+'='+p.formula:null;
  const headerPx=headerText===null?0:80,canvas={width:512,height:plot.height+64+headerPx,panel:0,topInset:headerPx};
  const spanX=v[1]-v[0],spanY=v[3]-v[2],clampY=y=>Math.max(v[2]+spanY*.06,Math.min(v[3]-spanY*.06,y));
  const evalCoefficients=(values,x)=>values.reduce((sum,c,index)=>sum+exactValue(c)*x**index,0);
  const anchorOnRows=(rows,x)=>rows.find(row=>row.drawInterval[0]<=x&&x<=row.drawInterval[1])??rows[0];
  const polyText=values=>{
    const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    // An irrational coefficient (p+q*sqrt(r), written in the exact-value grammar) is one parenthesised factor with a plus sign.
    return terms.length?terms.map(({c,i},index)=>{const surd=c.includes('sqrt'),negative=!surd&&c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=surd||magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join(''):'0';
  };
  // A reference curve's equation as a person writes it: -x^2/2+x+1/2 (a fraction coefficient sits behind its x power); a surd coefficient keeps polyText.
  const readablePoly=values=>{
    if(values.some(c=>c.includes('sqrt')))return polyText(values);
    let out='';
    for(let i=values.length-1;i>=0;i--){
      const c=values[i];if(c==='0')continue;
      const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,[n,d='1']=magnitude.split('/');
      const term=i===0?(d==='1'?n:n+'/'+d):(n==='1'?'':n)+'x'+(i>1?'^'+i:'')+(d==='1'?'':'/'+d);
      out+=(negative?'-':out?'+':'')+term;
    }
    return out||'0';
  };
  const required=p.requiredPoints||[],crossX=features.intersections.flatMap(row=>row.points.map(point=>point.xValue));
  // Each piece is its own FUNCTION_GRAPH on its draw interval, tagged PIECE_n so the observer can check it against its own polynomial.
  const objects=features.pieces.map((piece,i)=>({id:'f-piece-'+(i+1),kind:'FUNCTION_GRAPH',expression:polyText(piece.coefficients),domain:piece.drawInterval,criticalX:[...new Set([...required.map(point=>point.x),...crossX])].filter(x=>piece.drawInterval[0]<=x&&x<=piece.drawInterval[1]),branch:'PIECE_'+(i+1)}));
  if(headerPx)objects.push({id:'formula',kind:'EQUATION_LABEL',text:headerText,at:[v[0]+(v[1]-v[0])*.3,v[3]-(v[3]-v[2])*.12]});
  if(headerText===null&&functionName!==undefined){
    const x=v[0]+spanX*.16,row=anchorOnRows(features.pieces,x);
    objects.push({id:'main-curve-name',kind:'GRAPH_ANNOTATION',text:functionName+'(x)',at:[x,clampY(evalCoefficients(row.coefficients,x)-spanY*.14)],math:true,priority:0});
  }
  // A sample-value note the author writes for a parameter case (for example "a=2"), shown inside the plot instead of only in the caption.
  if(p.sampleNote!==undefined)objects.push({id:'sample-note',kind:'GRAPH_ANNOTATION',text:p.sampleNote,at:[v[0]+spanX*.10,v[3]-spanY*.10],math:true,priority:0});
  // referenceCurves: a quadratic is one FUNCTION_GRAPH tagged REF_<id> over the draw interval; a piecewise curve is one per piece, tagged
  // REF_<id> (one piece) or REF_<id>_<n>, each only on its own draw interval. Its own label goes to the band.
  const refCurves=features.referenceCurves??[],curveRows=features.curveIntersections??[],curveLabels=[];
  if(!Array.isArray(refCurves)||!Array.isArray(curveRows)||refCurves.length!==(p.referenceCurves??[]).length||curveRows.length!==refCurves.length)throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
  const curveCrossX=curveRows.flatMap(row=>row.points.map(point=>point.xValue));
  for(const [index,curve] of refCurves.entries()){
    const source=p.referenceCurves[index];
    if(!source||source.id!==curve.id||curveRows[index]?.curveId!==curve.id)throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
    if(source.name!==undefined&&(typeof source.name!=='string'||!/^[a-hj-wz]$/.test(source.name)))throw Error('PIECEWISE_POLY_FUNCTION_NAME_INVALID');
    const curveKeyX=[...new Set([...required.map(point=>point.x),...curveCrossX])];
    if(Array.isArray(curve.pieces)){
      curve.pieces.forEach((piece,pieceIndex)=>{
        const branch=curve.pieces.length===1?'REF_'+curve.id:'REF_'+curve.id+'_'+(pieceIndex+1);
        objects.push({id:'f-ref-'+curve.id+'-'+(pieceIndex+1),kind:'FUNCTION_GRAPH',expression:polyText(piece.coefficients),domain:piece.drawInterval,criticalX:curveKeyX.filter(x=>piece.drawInterval[0]<=x&&x<=piece.drawInterval[1]),branch});
      });
    }else{
      if(!Array.isArray(curve.coefficients)||curve.coefficients.length!==3)throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
      objects.push({id:'f-ref-'+curve.id,kind:'FUNCTION_GRAPH',expression:polyText(curve.coefficients),domain:curve.drawInterval,criticalX:curveKeyX.filter(x=>curve.drawInterval[0]<=x&&x<=curve.drawInterval[1]),branch:'REF_'+curve.id});
    }
    const labelId='ref-curve-'+curve.id+'-equation';
    const labelText=curve.pieces?(source.formula!==undefined?(source.name?source.name+'(x)':'y')+'='+source.formula:source.name?source.name+'(x)':'y'):(source.name?source.name+'(x)':'y')+'='+readablePoly(curve.coefficients);
    if(curve.pieces){
      // The second piecewise curve is named next to its own drawing; a corner (or the middle of its widest piece) anchors the label.
      let at;
      if(Array.isArray(curve.corners)&&curve.corners.length)at=[exactValue(curve.corners[0].x)-spanX*.04,clampY(exactValue(curve.corners[0].y)+spanY*.10)];
      else{const widest=[...curve.pieces].sort((a,b)=>(b.drawInterval[1]-b.drawInterval[0])-(a.drawInterval[1]-a.drawInterval[0]))[0],x=(widest.drawInterval[0]+widest.drawInterval[1])/2;at=[x,clampY(evalCoefficients(widest.coefficients,x)+spanY*.10)];}
      objects.push({id:labelId,kind:'GRAPH_ANNOTATION',text:labelText,at,math:true,priority:0});
    }else{
      curveLabels.push(labelId);
      objects.push({id:labelId,kind:'EQUATION_LABEL',text:labelText,at:[(v[0]+v[1])/2,v[3]],priority:0});
    }
    for(const [k,point] of curveRows[index].points.entries()){
      if(point.keyPoint!==undefined){if(!required.some(other=>other.id===point.keyPoint))throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');continue;}
      objects.push({id:'intersection-'+curve.id+'-'+(k+1),kind:'POINT',at:[point.xValue,point.yValue],name:null});
    }
  }
  if(plan.coordinatePlacement!==undefined&&plan.coordinatePlacement!=='PANEL')throw Error('UNSUPPORTED_COORDINATE_PLACEMENT');
  const exactCoordinates=p.exactCoordinates??{};
  if(!exactCoordinates||typeof exactCoordinates!=='object'||Array.isArray(exactCoordinates))throw Error('EXACT_COORDINATES_INVALID');
  for(const [pointId,pair] of Object.entries(exactCoordinates)){
    const point=required.find(other=>other?.id===pointId);
    if(!point||!Array.isArray(pair)||pair.length!==2||[point.x,point.y].some((value,k)=>Math.abs(exactValue(pair[k])-value)>1e-9*Math.max(1,Math.abs(value))))throw Error('EXACT_COORDINATES_MISMATCH:'+pointId);
  }
  const integerKey=point=>Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y);
  const coordinateText=point=>exactCoordinates[point?.id]??(integerKey(point)?[String(point.x),String(point.y)]:null);
  const bandHidden=coordinateBandHide(p,required);
  const pointNames=pointNameModel(plan,[...required.map(point=>point?.id),...overlayPointIds(plan)]),nameLike=pointId=>pointNames.has(pointId)||/^[A-Z][0-9']?$/.test(pointId),graphPanel=new Set([...(plan.coordinatePlacement==='PANEL'?required.filter(point=>coordinateText(point)&&nameLike(point.id)).map(point=>point.id):plan.coordinatePanel||[]),...required.filter(point=>pointNames.has(point?.id)&&coordinateText(point)).map(point=>point.id)].filter(pointId=>!bandHidden.has(pointId)));
  for(const pointId of graphPanel)if(!nameLike(pointId)||!coordinateText(required.find(point=>point.id===pointId)))throw Error('COORDINATE_PANEL_POINT_INVALID:'+pointId);
  const graphDirections=plan.labelDirections??{};
  if(!graphDirections||typeof graphDirections!=='object'||Array.isArray(graphDirections)||Object.entries(graphDirections).some(([pointId,direction])=>!required.some(point=>point.id===pointId)||graphPanel.has(pointId)||!['N','NE','E','SE','S','SW','W','NW'].includes(direction)))throw Error('INVALID_LABEL_DIRECTIONS');
  const panelLabels=[];
  for(const [index,point] of required.entries()){
    if(!point||typeof point.id!=='string'||!point.id||!Number.isFinite(point.x)||!Number.isFinite(point.y))throw Error('POLYNOMIAL_REQUIRED_POINT_INVALID');
    const markerId='required-point-'+(index+1),coordinates=coordinateText(point);
    if(graphPanel.has(point.id)){
      const labelId=markerId+'-coordinate-panel';panelLabels.push(labelId);
      objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],name:pointNames.tex(point.id)});
      objects.push({id:labelId,kind:'EQUATION_LABEL',target:markerId,text:pointNames.expr(point.id)+'('+coordinates.map(unwrapParentheses).join(',')+')',at:[point.x,point.y],priority:0});
      continue;
    }
    const bandHide=bandHidden.has(point.id);
    objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],...(coordinates&&!bandHide?{}:pointNames.has(point.id)?{name:pointNames.tex(point.id)}:{name:null})});
    if(coordinates&&!bandHide)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates,...(graphDirections[point.id]?{preferred:graphDirections[point.id]}:{})});
  }
  // Horizontal lines y=c (a=0, b=-1, c) with a dot at every intersection the framing verified; the equation goes to the band.
  const lines=p.referenceLines??[],lineLabels=[];
  if(!Array.isArray(lines)||lines.length!==features.intersections.length)throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
  for(const [index,line] of lines.entries()){
    const row=features.intersections[index];
    if(!row||row.lineId!==line?.id||!Array.isArray(row.points))throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
    // A slanted line (slope + intercept, already checked as exact rationals by the framing) is y=m*x+q; its label is written as for a quadratic's line.
    const slanted=line.slope!==undefined,levelText=String(slanted?line.intercept:line.y),level=exactValue(levelText),slope=slanted?exactValue(String(line.slope)):0,lineId='line-'+line.id,labelId=lineId+'-equation';
    if(slanted&&(row.slope===undefined||row.points.some(point=>!Number.isFinite(point.yValue))))throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');
    objects.push({id:lineId,kind:'LINE',coefficients:[slope,-1,level]});
    const surdSlope=slanted&&String(line.slope).includes('sqrt'),surdIntercept=slanted&&String(line.intercept).includes('sqrt');
    const slopeText=!slanted?'':line.slope==='1'?'x':line.slope==='-1'?'-x':(surdSlope?'('+line.slope+')':line.slope)+'*x',interceptText=!slanted?levelText:line.intercept==='0'?'':surdIntercept?'+('+line.intercept+')':line.intercept.startsWith('-')?line.intercept:'+'+line.intercept;
    lineLabels.push(labelId);objects.push({id:labelId,kind:'EQUATION_LABEL',text:'y='+slopeText+interceptText,at:[(v[0]+v[1])/2,v[3]],priority:0});
    for(const [k,point] of row.points.entries()){
      // A crossing that is also a marked key point is drawn once, as that key point (framing names it in keyPoint).
      if(point.keyPoint!==undefined){if(!required.some(other=>other.id===point.keyPoint))throw Error('PIECEWISE_POLY_FEATURE_INVENTORY_REQUIRED');continue;}
      const markerId='intersection-'+line.id+'-'+(k+1);
      objects.push({id:markerId,kind:'POINT',at:[point.xValue,slanted?point.yValue:level],...(line.labelIntersections===true?{}:{name:null})});
      if(line.labelIntersections===true)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:[point.x,levelText]});
    }
  }
  // Shaded regions (graphPlan.regions): the boundary rows are the same exact polynomials the curves are drawn from, so the fill follows the
  // drawn strokes. The engine samples the rows (upper left to right, then lower right to left) and paints the even-odd path beneath the curves.
  const regions=features.regions??[];
  if(!Array.isArray(regions)||regions.length!==(p.regions??[]).length)throw Error('GRAPH_REGION_FEATURE_INVENTORY_REQUIRED');
  for(const region of regions){
    const declaration=(p.regions??[]).find(row=>row?.id===region.id);
    if(!declaration||region.upper!==declaration.upper||region.lower!==declaration.lower||region.fill!==(declaration.fill??'LIGHT'))throw Error('GRAPH_REGION_FEATURE_INVENTORY_REQUIRED');
    const rowsOf=key=>{
      const rows=region[key];
      if(!Array.isArray(rows)||rows.length<1)throw Error('GRAPH_REGION_FEATURE_INVENTORY_REQUIRED');
      return rows.map(row=>{
        if(!row||!Array.isArray(row.coefficients)||!Array.isArray(row.interval)||row.interval.length!==2)throw Error('GRAPH_REGION_FEATURE_INVENTORY_REQUIRED');
        return {expression:polyText(row.coefficients),domain:row.interval.map(value=>exactValue(value))};
      });
    };
    objects.push({id:'region-'+region.id,kind:'GRAPH_REGION',fill:region.fill??'LIGHT',domain:region.domain,upper:rowsOf('upperRows'),lower:rowsOf('lowerRows'),...(region.label!==undefined?{labelText:region.label}:{})});
  }
  // Band rows as for a HEADER_BAND quadratic: each line equation on its own row, then the band coordinates in two columns (one when long).
  const longCoordinate=objects.some(object=>panelLabels.includes(object.id)&&object.text.length>10),columns=longCoordinate?1:2;
  const coordinateRows=Math.ceil(panelLabels.length/columns),textOf=labelId=>objects.find(object=>object.id===labelId)?.text??'';
  lineLabels.push(...curveLabels);
  const rows=[...lineLabels.map(labelId=>[labelId]),...Array.from({length:coordinateRows},(_,r)=>panelLabels.slice(r*columns,r*columns+columns))];
  const pitches=rows.map(row=>bandRowPitch(row.map(textOf)));
  const bandExtra=rows.length?26+pitches.reduce((sum,pitch)=>sum+pitch,0):0;
  if(canvas.height+bandExtra>1099)throw Error('COORDINATE_PANEL_TOO_TALL');
  const rowCenters=bandRowCenters(pitches,headerPx?135:55);
  const bandCenters=Object.fromEntries(rows.flatMap((row,r)=>row.map((labelId,k)=>[labelId,[r<lineLabels.length||panelLabels.length===1||columns===1?canvas.width/2:canvas.width*(k?.72:.28),rowCenters[r]]])));
  // A piecewise reference curve's own domain ends are drawn as hollow/filled dots by the engine (their own ids, never the function's).
  const referenceIntervalFeatures=refCurves.filter(curve=>curve.sourceInterval).map(curve=>({id:curve.id,...curve.sourceInterval}));
  return {id,visualType:'function_graph',viewport:{...graphViewport(v,{...canvas,height:canvas.height+bandExtra}),topInset:canvas.topInset+bandExtra,...((p.axisRatio??1)===1?{equalUnits:true}:{})},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts({axisTickValues:p.axisTickValues??{x:[],y:[]}}),formulaPlacement:'HEADER_BAND',equationLabelCenters:{...(headerPx?{formula:[canvas.width/2,72]}:{}),...bandCenters},...(p.intervalFeatures?{intervalFeatures:p.intervalFeatures,intervalFeaturePolicy:p.intervalFeaturePolicy}:{}),...(referenceIntervalFeatures.length?{referenceIntervalFeatures,referenceIntervalFeaturePolicy:{schemaVersion:'REFERENCE_INTERVAL_POLICY_v1',markerRadiusIntrinsicPx:4}}:{})},objects};
}

// piecewise-discontinuous-spike-v1: one to six pieces of degree <= 2 on their own intervals with explicit OPEN/CLOSED ends, jumps and
// declared values (isolated points). graph_framing has already checked the endpoint states, every junction value and every crossing;
// the figure draws one FUNCTION_GRAPH per piece (never bridged), the endpoint/value dots and the band with the line equations.
function piecewiseDiscontinuousSpec(plan,id){
  const p=plan.graphPlan,v=p.viewport,features=p.piecewiseDiscontinuousFeatures,plot=p.plotCanvas;
  if(p.family!=='piecewise-discontinuous'||!features||features.schemaVersion!=='PIECEWISE_DISCONTINUOUS_FEATURES_v1'||!Array.isArray(features.pieces)||!Array.isArray(features.markers)||!Array.isArray(features.intersections))throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');
  if(p.equalUnits!==true||!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  const functionName=p.functionName;
  if(functionName!==undefined&&(typeof functionName!=='string'||!/^[a-hj-wz]$/.test(functionName)))throw Error('PIECEWISE_DISCONTINUOUS_FUNCTION_NAME_INVALID');
  const canvas={width:512,height:plot.height+64,panel:0,topInset:0};
  const spanX=v[1]-v[0],spanY=v[3]-v[2],clampY=y=>Math.max(v[2]+spanY*.06,Math.min(v[3]-spanY*.06,y));
  const evalCoefficients=(values,x)=>values.reduce((sum,c,index)=>sum+exactValue(c)*x**index,0);
  const anchorOnRows=(rows,x)=>rows.find(row=>row.drawInterval[0]<=x&&x<=row.drawInterval[1])??rows[0];
  const polyText=values=>{
    const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    return terms.length?terms.map(({c,i},index)=>{const surd=c.includes('sqrt'),negative=!surd&&c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=surd||magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join(''):'0';
  };
  const required=p.requiredPoints||[],crossX=features.intersections.flatMap(row=>row.points.map(point=>point.xValue));
  const objects=features.pieces.map((piece,i)=>({id:'f-piece-'+(i+1),kind:'FUNCTION_GRAPH',expression:polyText(piece.coefficients),domain:piece.drawInterval,criticalX:[...new Set([...required.map(point=>point.x),...crossX])].filter(x=>piece.drawInterval[0]<=x&&x<=piece.drawInterval[1]),branch:'PIECE_'+(i+1)}));
  if(functionName!==undefined){
    const x=v[0]+spanX*.16,row=anchorOnRows(features.pieces,x);
    objects.push({id:'main-curve-name',kind:'GRAPH_ANNOTATION',text:functionName+'(x)',at:[x,clampY(evalCoefficients(row.coefficients,x)-spanY*.14)],math:true,priority:0});
  }
  if(plan.coordinatePlacement!==undefined&&plan.coordinatePlacement!=='PANEL')throw Error('UNSUPPORTED_COORDINATE_PLACEMENT');
  const exactCoordinates=p.exactCoordinates??{};
  if(!exactCoordinates||typeof exactCoordinates!=='object'||Array.isArray(exactCoordinates))throw Error('EXACT_COORDINATES_INVALID');
  for(const [pointId,pair] of Object.entries(exactCoordinates)){
    const point=required.find(other=>other?.id===pointId);
    if(!point||!Array.isArray(pair)||pair.length!==2||[point.x,point.y].some((value,k)=>Math.abs(exactValue(pair[k])-value)>1e-9*Math.max(1,Math.abs(value))))throw Error('EXACT_COORDINATES_MISMATCH:'+pointId);
  }
  const integerKey=point=>Number.isSafeInteger(point?.x)&&Number.isSafeInteger(point?.y);
  const coordinateText=point=>exactCoordinates[point?.id]??(integerKey(point)?[String(point.x),String(point.y)]:null);
  const pointNames=pointNameModel(plan,required.map(point=>point?.id)),nameLike=pointId=>pointNames.has(pointId)||/^[A-Z][0-9']?$/.test(pointId),graphPanel=new Set([...(plan.coordinatePlacement==='PANEL'?required.filter(point=>coordinateText(point)&&nameLike(point.id)).map(point=>point.id):plan.coordinatePanel||[]),...required.filter(point=>pointNames.has(point?.id)&&coordinateText(point)).map(point=>point.id)]);
  for(const pointId of graphPanel)if(!nameLike(pointId)||!coordinateText(required.find(point=>point.id===pointId)))throw Error('COORDINATE_PANEL_POINT_INVALID:'+pointId);
  const graphDirections=plan.labelDirections??{};
  if(!graphDirections||typeof graphDirections!=='object'||Array.isArray(graphDirections)||Object.entries(graphDirections).some(([pointId,direction])=>!required.some(point=>point.id===pointId)||graphPanel.has(pointId)||!['N','NE','E','SE','S','SW','W','NW'].includes(direction)))throw Error('INVALID_LABEL_DIRECTIONS');
  const panelLabels=[];
  for(const [index,point] of required.entries()){
    if(!point||typeof point.id!=='string'||!point.id||!Number.isFinite(point.x)||!Number.isFinite(point.y))throw Error('POLYNOMIAL_REQUIRED_POINT_INVALID');
    const markerId='required-point-'+(index+1),coordinates=coordinateText(point);
    if(graphPanel.has(point.id)){
      const labelId=markerId+'-coordinate-panel';panelLabels.push(labelId);
      objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],name:pointNames.tex(point.id)});
      objects.push({id:labelId,kind:'EQUATION_LABEL',target:markerId,text:pointNames.expr(point.id)+'('+coordinates.map(unwrapParentheses).join(',')+')',at:[point.x,point.y],priority:0});
      continue;
    }
    objects.push({id:markerId,kind:'POINT',at:[point.x,point.y],...(coordinates?{}:pointNames.has(point.id)?{name:pointNames.tex(point.id)}:{name:null})});
    if(coordinates)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:coordinates,...(graphDirections[point.id]?{preferred:graphDirections[point.id]}:{})});
  }
  const lines=p.referenceLines??[],lineLabels=[];
  if(!Array.isArray(lines)||lines.length!==features.intersections.length)throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');
  for(const [index,line] of lines.entries()){
    const row=features.intersections[index];
    if(!row||row.lineId!==line?.id||!Array.isArray(row.points))throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');
    const levelText=String(line.y),level=exactValue(levelText),lineId='line-'+line.id,labelId=lineId+'-equation';
    objects.push({id:lineId,kind:'LINE',coefficients:[0,-1,level]});
    lineLabels.push(labelId);objects.push({id:labelId,kind:'EQUATION_LABEL',text:'y='+levelText,at:[(v[0]+v[1])/2,v[3]],priority:0});
    for(const [k,point] of row.points.entries()){
      if(point.keyPoint!==undefined){if(!required.some(other=>other.id===point.keyPoint))throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');continue;}
      if(point.marker===true)continue;
      const markerId='intersection-'+line.id+'-'+(k+1);
      objects.push({id:markerId,kind:'POINT',at:[point.xValue,level],...(line.labelIntersections===true?{}:{name:null})});
      if(line.labelIntersections===true)objects.push({id:markerId+'-coordinates',kind:'COORDINATE_LABEL',target:markerId,exact:[point.x,levelText]});
    }
  }
  // limitArrows: the engine computed each arrow ON the curve (tail and tip) and the dashed guides from the approached point to both axes; the figure only draws them.
  const limitArrows=features.limitArrows??[];
  if(!Array.isArray(limitArrows)||limitArrows.length!==(p.limitArrows??[]).length)throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');
  for(const arrow of limitArrows){
    if(typeof arrow?.id!=='string'||!Array.isArray(arrow.from)||!Array.isArray(arrow.to)||![arrow.atValue,arrow.toYValue,...arrow.from,...arrow.to].every(Number.isFinite))throw Error('PIECEWISE_DISCONTINUOUS_FEATURE_INVENTORY_REQUIRED');
    if(arrow.guideX)objects.push({id:arrow.id+'-guide-x',kind:'SEGMENT',from:[arrow.atValue,arrow.toYValue],to:[arrow.atValue,0],dash:true});
    if(arrow.guideY)objects.push({id:arrow.id+'-guide-y',kind:'SEGMENT',from:[arrow.atValue,arrow.toYValue],to:[0,arrow.toYValue],dash:true});
    objects.push({id:arrow.id,kind:'SEGMENT',from:arrow.from,to:arrow.to,arrow:'END'});
  }
  const longCoordinate=objects.some(object=>panelLabels.includes(object.id)&&object.text.length>10),columns=longCoordinate?1:2;
  const coordinateRows=Math.ceil(panelLabels.length/columns),textOf=labelId=>objects.find(object=>object.id===labelId)?.text??'';
  const rows=[...lineLabels.map(labelId=>[labelId]),...Array.from({length:coordinateRows},(_,r)=>panelLabels.slice(r*columns,r*columns+columns))];
  const pitches=rows.map(row=>bandRowPitch(row.map(textOf)));
  const bandExtra=rows.length?26+pitches.reduce((sum,pitch)=>sum+pitch,0):0;
  if(canvas.height+bandExtra>1099)throw Error('COORDINATE_PANEL_TOO_TALL');
  const rowCenters=bandRowCenters(pitches,55);
  const bandCenters=Object.fromEntries(rows.flatMap((row,r)=>row.map((labelId,k)=>[labelId,[panelLabels.length===1||columns===1?canvas.width/2:canvas.width*(k?.72:.28),rowCenters[r]]])));
  return {id,visualType:'function_graph',viewport:{...graphViewport(v,{...canvas,height:canvas.height+bandExtra}),topInset:canvas.topInset+bandExtra,...((p.axisRatio??1)===1?{equalUnits:true}:{})},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts({axisTickValues:p.axisTickValues??{x:[],y:[]}}),equationLabelCenters:bandCenters,discontinuousEndpointFeatures:{schemaVersion:'PIECEWISE_DISCONTINUOUS_ENDPOINTS_v1',markers:features.markers},discontinuousEndpointFeaturePolicy:{schemaVersion:'PIECEWISE_DISCONTINUOUS_ENDPOINT_POLICY_v1',markerRadiusIntrinsicPx:4}},objects};
}

// multi-curve-figure-v1: three to six independent nonlinear curves in one plane (source-first; for a figure bounded
// by THREE OR MORE distinct nonlinear curves). Each curve is one explicit quadratic arc and the independent observer
// recomputes every branch from the same coefficients.
function multiCurveSpec(plan,id){
  const p=plan.graphPlan,v=p.viewport,features=p.multiCurveFeatures,plot=p.plotCanvas;
  if(p.family!=='multi-curve'||!features||features.schemaVersion!=='MULTI_CURVE_FEATURES_v1'||!Array.isArray(features.curves))throw Error('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED');
  if(p.equalUnits!==true||!plot||typeof plot!=='object'||Object.keys(plot).sort().join(',')!=='height,width'||plot.width!==448||!Number.isSafeInteger(plot.height)||plot.height<120||plot.height>640)throw Error('EQUAL_UNIT_PLOT_CANVAS_INVALID');
  const canvas={width:512,height:plot.height+64,panel:0,topInset:0};
  const spanX=v[1]-v[0],spanY=v[3]-v[2],clampX=x=>Math.max(v[0]+spanX*.06,Math.min(v[1]-spanX*.06,x)),clampY=y=>Math.max(v[2]+spanY*.06,Math.min(v[3]-spanY*.06,y));
  const evalCoefficients=(values,x)=>values.reduce((sum,c,index)=>sum+exactValue(c)*x**index,0);
  const polyText=values=>{
    const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    return terms.length?terms.map(({c,i},index)=>{const surd=c.includes('sqrt'),negative=!surd&&c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=surd||magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join(''):'0';
  };
  const sourceLabels=new Map((p.curves??[]).map(curve=>[curve?.id,curve?.label]));
  const objects=[];
  for(const curve of features.curves){
    if(!curve||typeof curve.id!=='string'||!Array.isArray(curve.branches)||!curve.branches.length)throw Error('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED');
    if(curve.kind==='Y_OF_X'){
      if(curve.branches.length!==1||curve.branches[0].side!=='FUNCTION')throw Error('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED');
      const domain=curve.branches[0].xInterval.map(exactValue);
      objects.push({id:'f-'+curve.id,kind:'FUNCTION_GRAPH',expression:polyText(curve.coefficients),domain,criticalX:domain,branch:'CURVE_'+curve.id});
      const label=sourceLabels.get(curve.id);
      if(label!==undefined){
        if(typeof label!=='string'||!/^[0-9A-Za-z=+\-*/().\^ ]{1,40}$/.test(label))throw Error('MULTI_CURVE_LABEL_INVALID:'+curve.id);
        const x=domain[0]+(domain[1]-domain[0])*.62,outward=exactValue(curve.coefficients[2])<0?1:-1;
        objects.push({id:'curve-'+curve.id+'-equation',kind:'EQUATION_LABEL',text:label,at:[x,clampY(evalCoefficients(curve.coefficients,x)+outward*spanY*.06)],priority:0});
      }
      continue;
    }
    if(curve.kind!=='X_OF_Y')throw Error('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED');
    for(const branch of curve.branches){
      if(!branch||(branch.side!=='POSITIVE'&&branch.side!=='NEGATIVE')||typeof branch.expression!=='string'||!branch.expression)throw Error('MULTI_CURVE_FEATURE_INVENTORY_REQUIRED');
      const domain=branch.xInterval.map(exactValue);
      objects.push({id:'f-'+curve.id+'-'+branch.side.toLowerCase(),kind:'FUNCTION_GRAPH',expression:branch.expression,domain,criticalX:domain,branch:'CURVE_'+curve.id+(branch.side==='POSITIVE'?'_POS':'_NEG')});
    }
    const label=sourceLabels.get(curve.id);
    if(label!==undefined){
      if(typeof label!=='string'||!/^[0-9A-Za-z=+\-*/().\^ ]{1,40}$/.test(label))throw Error('MULTI_CURVE_LABEL_INVALID:'+curve.id);
      const [c0,c1,c2]=curve.coefficients.map(exactValue),vertexY=-c1/(2*c2),vertexX=c0+c1*vertexY+c2*vertexY*vertexY,outward=c2<0?1:-1;
      objects.push({id:'curve-'+curve.id+'-equation',kind:'EQUATION_LABEL',text:label,at:[clampX(vertexX+outward*spanX*.05),vertexY],priority:0});
    }
  }
  return {id,visualType:'function_graph',viewport:{...graphViewport(v,canvas),...((p.axisRatio??1)===1?{equalUnits:true}:{})},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts({axisTickValues:p.axisTickValues??{x:[],y:[]}})},objects};
}

export async function runPhase2(options){
  const {questionUid,sourcePath,ordinal,replayResultRef,runId}=options;
  const requestedUid=questionUid||(sourcePath&&ordinal!==undefined?questionUidV2(path.basename(sourcePath,'.js'),ordinal):null);
  const workspace=bindRunWorkspace(root,{questionUid:requestedUid,sourcePath,replayResultRef,runId});
  return withWorkRoot(workspace.workRoot,()=>runPhase2InWorkspace({...options,requestedUid,workspace}));
}

function readResultStage(root,result,stageName){
  const stages=(result.stages||[]).map(ref=>{
    const {receiptSha256,...manifest}=JSON.parse(readBoundFile(root,ref));
    if(objectSha(manifest)!==receiptSha256)throw Error('NATIVE_OVERLAY_STAGE_RECEIPT_INVALID:'+manifest.stage);
    for(const output of manifest.outputs||[])readBoundFile(root,output);
    return{ref,manifest};
  }).filter(row=>row.manifest.stage===stageName);
  if(!stages.length)throw Error('NATIVE_OVERLAY_BASE_STAGE_REQUIRED:'+stageName);
  return stages.at(-1);
}

// Re-review a native Archive solution text change while reusing the exact
// previously approved SVG bytes. This route never rebuilds or patches SVG.
export async function recordNativeSolutionOverlay({questionUid,sourceRegistryRef,baseResultRef,solutionPatchRef,runId,signal,onProgress}){
  if(!runId||!sourceRegistryRef||!baseResultRef||!solutionPatchRef)throw Error('NATIVE_SOLUTION_OVERLAY_INPUTS_REQUIRED');
  if(questionUid!=='24_제일고_1학기_중간_고1_기출|10')throw Error('NATIVE_SOLUTION_OVERLAY_Q10_ONLY');
  const workspace=bindRunWorkspace(root,{questionUid,runId});
  return withWorkRoot(workspace.workRoot,async()=>{
    const baseResult=JSON.parse(readBoundFile(root,baseResultRef)),authority=resolveQuestion(root,{questionUid,sourceRegistryRef});
    if(baseResult.status!=='UNRESOLVED'||baseResult.identity?.questionUid!==questionUid||baseResult.sourceRef?.sha256!==authority.sourceRef.sha256||!String(baseResult.error||'').includes('INDEPENDENT_VISUAL_REVIEW_FAIL')||!String(baseResult.error||'').includes('native 해설')||!String(baseResult.error||'').includes('한 줄'))throw Error('NATIVE_OVERLAY_BASE_FAILURE_SCOPE_INVALID');
    const ordinal=Number(questionUid.split('|').at(-1)),question=authority.question,patch=JSON.parse(readBoundFile(root,solutionPatchRef));
    if(patch.schemaVersion!=='PHASE5_NATIVE_SOLUTION_PATCH_v1'||patch.questionUid!==questionUid||patch.sourceRef?.path!==authority.sourceRef.path||patch.sourceRef?.sha256!==authority.sourceRef.sha256||patch.baseSolutionSha256!==bytesSha(Buffer.from(question.solution,'utf8')))throw Error('NATIVE_OVERLAY_PATCH_NOT_CURRENT');
    const tokenParity=compareSolutionTokenParity(question.solution,patch.patchedSolution);
    if(tokenParity.status!=='PASS')throw Error('NATIVE_OVERLAY_SOLUTION_TOKEN_PARITY_FAIL');
    const basePlanStage=readResultStage(root,baseResult,'PLAN'),frozenPlan=JSON.parse(readBoundFile(root,basePlanStage.manifest.outputs[0]));
    if(planHash(frozenPlan)!==frozenPlan.planSha256||frozenPlan.questionUid!==questionUid||frozenPlan.sourceRef?.sha256!==authority.sourceRef.sha256)throw Error('NATIVE_OVERLAY_BASE_PLAN_INVALID');
    const {schemaVersion:planVersion,questionUid:planUid,visualAssetKey,sourceRef:planSourceRef,solutionRef:planSolutionRef,verifiedSolutionRef,verifiedSolutionPolicySha256,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistryRef,planSha256,...semanticPlan}=frozenPlan;
    if(planUid!==questionUid||semanticPlan.capability!=='construction-spike-v1'||!semanticPlan.mathPlan)throw Error('NATIVE_SOLUTION_OVERLAY_PLAN_SCOPE_INVALID');
    const sourceOnly={content:question.content,choices:question.choices??null,sourceImageRequired:!!question.image};
    const images=[];for(const imagePath of [question.image].filter(Boolean)){const bytes=readBoundFile(root,fileRef(root,'archive/'+imagePath));images.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));}
    const overlayFolderRelative=currentWorkRoot()+'/native-solution-overlay';
    const overlayFolder=generatedPath(root,overlayFolderRelative);
    if(fs.existsSync(overlayFolder))throw Error('NATIVE_SOLUTION_OVERLAY_EXISTS');
    fs.mkdirSync(overlayFolder,{recursive:true});
    const reviewFreeze=(stage,value)=>freeze(stage,value,{identity:assetIdentity(questionUid,'SOLUTION_VISUAL'),sourceRef:authority.sourceRef,baseResultRef,solutionPatchRef});
    const verifyPolicy=verifiedSolutionPolicyFingerprint(root),verificationInputSha256=verificationBinding({sourceRef:authority.sourceRef,source:sourceOnly,images,answer:question.answer,solution:question.solution,policySha256:verifyPolicy});
    let verified=JSON.parse(readBoundFile(root,verifiedSolutionRef));
    if(verifiedSolutionPolicySha256!==verifyPolicy||!validateReviewLineage(root,verified,'SOLUTION',verifyPolicy,verificationInputSha256)){
      verified=await blindThenCompare({root,kind:'SOLUTION',source:sourceOnly,images,comparison:{answer:question.answer,solution:question.solution},policySha256:verifyPolicy,inputBindingSha256:verificationInputSha256,call:(purpose,packet,pixels)=>provider(purpose,packet,pixels,overlayFolder,true),freeze:reviewFreeze});
    }
    if(!verificationClosed(verified))throw Error('NATIVE_OVERLAY_VERIFIED_SOLUTION_NOT_CLOSED');
    const verifiedReceipt=reviewFreeze('NATIVE_OVERLAY_VERIFIED_SOLUTION',verified);
    const currentSourcePolicy=sourcePolicyFingerprint(root),currentConditionBinding=conditionBinding({sourceRef:authority.sourceRef,source:sourceOnly,images,plan:semanticPlan,policySha256:currentSourcePolicy});
    const currentSourceReview=await blindThenCompare({root,kind:'CONDITIONS',source:sourceOnly,images,comparison:{proposedPlan:semanticPlan},policySha256:currentSourcePolicy,inputBindingSha256:currentConditionBinding,call:(purpose,packet,pixels)=>provider(purpose,packet,pixels,overlayFolder,true),freeze:reviewFreeze});
    if(!sourceReviewClosed(currentSourceReview))throw Error('NATIVE_OVERLAY_CURRENT_SOURCE_REVIEW_NOT_CLOSED');
    const sourceReviewReceipt=reviewFreeze('NATIVE_OVERLAY_SOURCE_REVIEW',currentSourceReview);
    const currentPlanReceipt=receipt('NATIVE_OVERLAY_PLAN',{'plan.json':canonicalJson(semanticPlan)},{identity:assetIdentity(questionUid,'SOLUTION_VISUAL'),sourceRef:authority.sourceRef,baseResultRef});
    const currentFingerprint=scopeFingerprint(root,semanticPlan.capability);
    const currentMath=await worker({action:'construction',graph:semanticPlan.mathPlan});
    const currentPeer=reconstruct(semanticPlan.mathPlan),currentMathAudit={...compareReconstruction(currentMath,currentPeer),peer:currentPeer};
    if(currentMathAudit.status!=='PASS')throw Error('NATIVE_OVERLAY_CURRENT_MATH_NOT_CLOSED');
    const currentMathReceipt=reviewFreeze('NATIVE_OVERLAY_MATH_REVIEW',currentMathAudit);
    const archiveBankStage=readResultStage(root,baseResult,'ARCHIVE_BANK');
    const baseCandidateRef=archiveBankStage.manifest.outputs.find(ref=>ref.path.endsWith('/'+workspace.examUid+'.js'));
    if(!baseCandidateRef)throw Error('NATIVE_OVERLAY_BASE_CANDIDATE_REQUIRED');
    const baseCandidateCode=readBoundFile(root,baseCandidateRef).toString('utf8'),baseBank=loadBank(baseCandidateCode),baseQuestion=baseBank.find(item=>item.id===ordinal);
    if(!baseQuestion||baseQuestion.solution!==question.solution||baseQuestion.answer!==question.answer||baseQuestion.content!==question.content)throw Error('NATIVE_OVERLAY_BASE_CANDIDATE_SOURCE_PARITY_FAIL');
    const buildStage=readResultStage(root,baseResult,'BUILD'),svgRef=buildStage.manifest.outputs.find(ref=>ref.path.endsWith('.svg'));
    if(!svgRef)throw Error('NATIVE_OVERLAY_APPROVED_SVG_REF_MISMATCH');
    const actualStage=readResultStage(root,baseResult,'DISPLAY_ENVELOPE_ACTUAL'),actualBase=JSON.parse(readBoundFile(root,actualStage.manifest.outputs.find(ref=>ref.path.endsWith('/actual-archive.json'))));
    const archiveAssetPath=baseQuestion.solutionImage;
    if(!archiveAssetPath||actualBase.archiveAssetPath!==archiveAssetPath||actualBase.candidateSvgRef?.sha256!==svgRef.sha256)throw Error('NATIVE_OVERLAY_BASE_ASSET_BINDING_MISMATCH');
    const identity=assetIdentity(questionUid,'SOLUTION_VISUAL');
    const folderRelative=overlayFolderRelative,folder=overlayFolder;
    const candidateCode=baseCandidateCode+'\n;window.questionBank.find(q=>q.id==='+ordinal+').solution = '+JSON.stringify(patch.patchedSolution)+';\n';
    const candidateRelative=folderRelative+'/'+workspace.examUid+'.js',candidatePath=generatedPath(root,candidateRelative);
    fs.writeFileSync(candidatePath,candidateCode,{flag:'wx'});
    const candidateRef=fileRef(root,candidateRelative),candidateBank=loadBank(candidateCode),candidateQuestion=candidateBank.find(item=>item.id===ordinal);
    if(!candidateQuestion||candidateQuestion.solution!==patch.patchedSolution||candidateQuestion.answer!==question.answer||candidateQuestion.content!==question.content||candidateQuestion.solutionImage!==baseQuestion.solutionImage||candidateQuestion.solutionImageSize!==baseQuestion.solutionImageSize||candidateQuestion.solutionImageAlt!==baseQuestion.solutionImageAlt)throw Error('NATIVE_OVERLAY_CANDIDATE_PARITY_FAIL');
    for(let index=0;index<baseBank.length;index++){
      const before={...baseBank[index]},after={...candidateBank[index]};
      if(before.id===ordinal){delete before.solution;delete after.solution;}
      if(canonicalJson(before)!==canonicalJson(after))throw Error('NATIVE_OVERLAY_UNEXPECTED_CANDIDATE_FIELD_CHANGE');
    }
    const bankInfo={id:identity.assetId,sourcePath:authority.sourceRef.path,sourceSha256:authority.sourceRef.sha256.slice(7),candidatePath:candidateRef.path,candidateSha256:candidateRef.sha256.slice(7),questionCount:baseBank.length,protectedFieldParity:'PASS',assets:[{id:identity.assetId,path:svgRef.path,archivePath:archiveAssetPath,sha256:svgRef.sha256.slice(7),questionId:ordinal,sizeClass:baseQuestion.solutionImageSize}]};
    const engineRef=fileRef(root,'archive/engine.html');
    const matrix={schemaVersion:'GEOMETRY_ARCHIVE_RENDER_MATRIX_v1',runtime:'actual archive/engine.html',synthetic:false,engineSha256:engineRef.sha256.slice(7),sources:[bankInfo],rows:[{...bankInfo,mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(authority.sourceRef.path.replace(/^archive\//,''))}]};
    fs.writeFileSync(generatedPath(root,folderRelative+'/archive-render-matrix.json'),canonicalJson(matrix),{flag:'wx'});
    process.env.GEOMETRY_NODE_MODULES||=path.join(dependencyRoot,'node_modules');
    const archive=await recordArchiveEvidence({run:folder,attempt:'attempt-01',signal,onProgress,blockExternalRequests:true});
    const captureFolder=path.join(folder,'archive-render','attempt-01'),prefix=identity.assetId+'-sol-desktop';
    const rowRef=fileRef(root,path.relative(root,path.join(captureFolder,prefix+'.json')).replaceAll('\\','/'));
    const screenshotRef=fileRef(root,path.relative(root,path.join(captureFolder,prefix+'-'+identity.assetId+'.png')).replaceAll('\\','/'));
    const nativeContextScreenshotRef=fileRef(root,path.relative(root,path.join(captureFolder,prefix+'-'+identity.assetId+'-context.png')).replaceAll('\\','/'));
    const row=JSON.parse(readBoundFile(root,rowRef));
    if(row.synthetic!==false||row.runtime!=='playwright-chromium'||row.mode!=='sol'||row.viewport!=='desktop'||row.candidateSha256!==candidateRef.sha256.slice(7)||row.sourceSha256!==authority.sourceRef.sha256.slice(7)||row.engineSha256!==engineRef.sha256.slice(7))throw Error('NATIVE_OVERLAY_CAPTURE_BINDING_FAIL');
    const target=row.state?.targets?.find(value=>value.id===identity.assetId);
    if(!target?.loaded||normalizeArchiveImageUrlPath(target.src)!=='/archive/'+archiveAssetPath||row.status!=='PASS'||archive.status!=='PASS')throw Error('NATIVE_OVERLAY_ARCHIVE_CAPTURE_FAIL');
    const evidence=bindNativeSolutionOverlayCandidate({schemaVersion:'PHASE5_NATIVE_SOLUTION_PRESENTATION_OVERLAY_v1',status:'READY_FOR_R3_REVIEW',questionUid,sourceRef:authority.sourceRef,sourceRegistryRef,baseResultRef,baseResultStatus:baseResult.status,baseResultError:baseResult.error,basePlanRef:basePlanStage.manifest.outputs[0],baseCandidateRef,baseFinalSvgRef:svgRef,finalSvgRef:svgRef,finalSvgUnchanged:true,archiveAssetPath,solutionPatchRef,baseSolutionSha256:patch.baseSolutionSha256,patchedSolutionSha256:bytesSha(Buffer.from(patch.patchedSolution,'utf8')),tokenParity,currentScopeFingerprint:currentFingerprint,currentSourcePolicySha256:currentSourcePolicy,currentConditionBindingSha256:currentConditionBinding,currentPlanRef:currentPlanReceipt.outputs[0],currentSolutionReviewRef:verifiedReceipt.outputs[0],currentSourceReviewRef:sourceReviewReceipt.outputs[0],currentMathReviewRef:currentMathReceipt.outputs[0],archive:{status:archive.status,runtime:archive.runtime,synthetic:archive.synthetic,matrixSha256:archive.matrixSha256,engineRef,rowRef,screenshotRef,nativeContextScreenshotRef,target:{id:target.id,loaded:target.loaded,src:target.src,rect:target.rect,naturalWidth:target.naturalWidth,naturalHeight:target.naturalHeight}},r3ReviewRequired:true,productionAuthorized:false},candidateRef);
    const evidencePath=generatedPath(root,folderRelative+'/overlay.json');
    fs.writeFileSync(evidencePath,canonicalJson(evidence),{flag:'wx'});
    return{status:evidence.status,archiveStatus:archive.status,workspace:workspace.workRoot,overlayRef:fileRef(root,folderRelative+'/overlay.json'),candidateRef,finalSvgRef:svgRef,rowRef,screenshotRef,nativeContextScreenshotRef};
  });
}

async function runPhase2InWorkspace({questionUid,sourceRegistryRef=null,sourcePath,ordinal,replayResultRef=null,failedAttemptRef=null,encodingAdjudicationRef=null,experimentalLocator=false,requestedUid,workspace,signal,onArchiveProgress}){
  let authority=null;
  if(sourceRegistryRef){
    if(isEngineOutputPath(sourceRegistryRef.path))throw Error('ENGINE_SCOPED_REGISTRY_NOT_AUTHORITY');
    authority=resolveQuestion(root,{questionUid:requestedUid,sourceRegistryRef});
    sourcePath=authority.sourceRef.path;ordinal=authority.question.id;
  }else if(!experimentalLocator){
    return runQuestion(root,{questionUid:requestedUid});
  }

  const sourceRef=fileRef(root,sourcePath),raw=readBoundFile(root,sourceRef).toString('utf8'),bank=loadBank(raw),question=JSON.parse(JSON.stringify(bank.find(q=>q.id===ordinal)));
  if(!question)throw Error('SOURCE_QUESTION_NOT_FOUND');
  const uid=authority?.questionUid||requestedUid,identity=assetIdentity(uid,'SOLUTION_VISUAL');
  const journal=currentWorkRoot()+'/phase2/'+identity.assetId+'/'+crypto.randomUUID();const folder=generatedPath(root,journal);fs.mkdirSync(folder,{recursive:true});
  const provenance={identity,sourceRef};let stages=[],result,repairBudget=new RepairBudget(),recoveredPlanner=null;
  try{
    if(failedAttemptRef){
      const failed=JSON.parse(readBoundFile(root,failedAttemptRef));
      if(!['UNRESOLVED','UNSUPPORTED_DISPLAY_ENVELOPE'].includes(failed.status)||failed.identity?.questionUid!==uid||failed.sourceRef?.sha256!==sourceRef.sha256||!Array.isArray(failed.repairLedger))throw Error('FAILED_ATTEMPT_RECOVERY_MISMATCH');
      repairBudget=new RepairBudget(failed.repairLedger);
      const captured=failed.stages.map(ref=>({ref,value:JSON.parse(readBoundFile(root,ref))})).findLast(s=>s.value.stage==='PLANNER');
      if(captured){recoveredPlanner=JSON.parse(readBoundFile(root,captured.value.outputs[0]));stages.push(freeze('RECOVERED_PLANNER',{failedAttemptRef,capturedPlannerRef:captured.value.outputs[0],sourceRecheckRequired:true},provenance));}
      stages.push(freeze('FAILED_ATTEMPT_RECOVERY',{failedAttemptRef,preservedLedger:failed.repairLedger,currentSourceRef:sourceRef,currentProducerRef:fileRef(root,'archive/tools/geometry-equation/production/phase2.mjs'),budgetReset:false},provenance));
    }
    if(authority)stages.push(freeze('UID_AUTHORITY',{sourceRegistryRef,entry:authority.sourceRegistryEntry,status:'CANONICAL_CURRENT'},provenance));
    else stages.push(freeze('SOURCE_LOCATOR',{sourceRef,status:'EXPERIMENTAL_LOCATOR',authority:false},provenance));
    const images=[];for(const imagePath of [question.image].filter(Boolean)){const relative='archive/'+imagePath;const bytes=readBoundFile(root,fileRef(root,relative));images.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));}
    const sourceOnly={content:question.content,choices:question.choices??null,sourceImageRequired:!!question.image};
    const verifyPolicy=verifiedSolutionPolicyFingerprint(root);
    const verificationInputSha256=verificationBinding({sourceRef,source:sourceOnly,images,answer:question.answer,solution:question.solution,policySha256:verifyPolicy});
    const reviewCall=(purpose,packet,pixels)=>provider(purpose,packet,pixels,folder,true);
    const reviewFreeze=(stage,value)=>{const r=freeze(stage,value,provenance);stages.push(r);return r;};
    const verify=async()=>{
      if(encodingAdjudicationRef){
        const record=JSON.parse(readBoundFile(root,encodingAdjudicationRef));
        if(record.questionUid!==uid||record.sourceRef.sha256!==sourceRef.sha256||!validateSolutionEncodingAdjudication(root,record,verifyPolicy,verificationInputSha256))throw Error('ENCODING_ADJUDICATION_NOT_CURRENT');
        reviewFreeze('SOLUTION_ENCODING_ADJUDICATION',record);
        return{record,receipt:reviewFreeze('VERIFIED_SOLUTION',record)};
      }
      const record=await blindThenCompare({root,kind:'SOLUTION',source:sourceOnly,images,comparison:{answer:question.answer,solution:question.solution},policySha256:verifyPolicy,inputBindingSha256:verificationInputSha256,call:reviewCall,freeze:reviewFreeze});
      const r=reviewFreeze('VERIFIED_SOLUTION',record);
      if(!verificationClosed(record))throw Error('VERIFIED_SOLUTION_COMPARE_FAIL');
      return {record,receipt:r};
    };
    const reviewConditions=async proposedPlan=>{
      const policy=sourcePolicyFingerprint(root);
      const binding=conditionBinding({sourceRef,source:sourceOnly,images,plan:proposedPlan,policySha256:policy});
      return blindThenCompare({root,kind:'CONDITIONS',source:sourceOnly,images,comparison:{proposedPlan},policySha256:policy,inputBindingSha256:binding,call:reviewCall,freeze:reviewFreeze});
    };
    let frozen,plan,planReceipt,solutionRef,priorLayoutComposition=null,finalCompositionBinding=null;
    if(replayResultRef){
      const previous=JSON.parse(readBoundFile(root,replayResultRef));
      if(previous.identity.questionUid!==uid||previous.sourceRef.sha256!==sourceRef.sha256)throw Error('REPLAY_SOURCE_MISMATCH');
      if(!Array.isArray(previous.repairLedger))throw Error('REPLAY_REPAIR_LEDGER_REQUIRED');
      repairBudget=new RepairBudget(previous.repairLedger);
      const priorStages=previous.stages.map(ref=>({ref,value:JSON.parse(readBoundFile(root,ref))}));
      const plans=priorStages.filter(s=>s.value.stage==='PLAN');if(!plans.length)throw Error('REPLAY_PLAN_REQUIRED');
      const priorCompositions=priorStages.filter(s=>s.value.stage==='PROFILE_COMPOSITION');
      if(priorCompositions.length)priorLayoutComposition=JSON.parse(readBoundFile(root,priorCompositions.at(-1).value.outputs[0]));
      const ref=plans.at(-1).value.outputs[0];frozen=JSON.parse(readBoundFile(root,ref));
      if(planHash(frozen)!==frozen.planSha256)throw Error('REPLAY_PLAN_HASH_MISMATCH');
      const {schemaVersion,questionUid:planUid,visualAssetKey,sourceRef:sourceBinding,solutionRef:solutionBinding,verifiedSolutionRef,verifiedSolutionPolicySha256,verificationInputSha256:priorVerificationBinding,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistry,planSha256,...semantic}=frozen;plan=semantic;
      if(planUid!==uid||sourceBinding.sha256!==sourceRef.sha256)throw Error('REPLAY_PLAN_SOURCE_MISMATCH');
      stages.push(...priorStages.filter(s=>['PLAN','SOURCE_REVIEW','VERIFIED_SOLUTION','PLANNER','SOLUTION_BLIND_FREEZE','SOLUTION_COMPARE','CONDITIONS_BLIND_FREEZE','CONDITIONS_COMPARE'].includes(s.value.stage)).map(s=>({...s.value,manifestRef:s.ref})));
      const priorVerification=JSON.parse(readBoundFile(root,frozen.verifiedSolutionRef));
      const verificationReplay=await reuseReviewAuthority({root,record:priorVerification,kind:'SOLUTION',policySha256:verifyPolicy,inputBindingSha256:verificationInputSha256,closed:verificationClosed,refresh:verify});
      if(!verificationReplay.reused)frozen={...frozen,verifiedSolutionRef:verificationReplay.refreshResult.receipt.outputs[0]};
      solutionRef=receipt('SOLUTION_INPUT',{'solution.txt':question.solution},provenance).outputs[0];
      const currentPolicy=sourcePolicyFingerprint(root);
      const binding=conditionBinding({sourceRef,source:sourceOnly,images,plan,policySha256:currentPolicy});
      const reviews=priorStages.filter(s=>s.value.stage==='SOURCE_REVIEW').map(s=>JSON.parse(readBoundFile(root,s.value.outputs[0])));
      const priorSourceReview=reviews.find(r=>r.inputSha256===frozen.sourceReviewInputSha256);
      const sourceReviewReplay=await reuseReviewAuthority({root,record:priorSourceReview,kind:'CONDITIONS',policySha256:currentPolicy,inputBindingSha256:binding,closed:sourceReviewClosed,refresh:async()=>{const value=await reviewConditions(plan);reviewFreeze('SOURCE_REVIEW',value);return value;}});
      const sourceReview=sourceReviewReplay.record;
      frozen={...frozen,solutionRef,sourceRegistryRef,verifiedSolutionPolicySha256:verifyPolicy,verificationInputSha256,sourceReviewInputSha256:sourceReview.inputSha256,sourceReviewPolicySha256:currentPolicy};
      delete frozen.planSha256;frozen.planSha256=planHash(frozen);
      planReceipt=freeze('PLAN',frozen,provenance);stages.push(planReceipt);
      console.log(JSON.stringify({stage:'FROZEN_PLAN_REPLAY',uid}));
    }else{
    console.log(JSON.stringify({stage:'VERIFIED_SOLUTION',uid}));
    const verification=await verify();const verified=verification.record,verifiedReceipt=verification.receipt;
    solutionRef=receipt('SOLUTION_INPUT',{'solution.txt':question.solution},provenance).outputs[0];
    console.log(JSON.stringify({stage:'PLANNER',uid}));
    let extendedContract=compilerContract+' Also supported: SEGMENT_LENGTH(inputs two POINT, args{}, outputType SCALAR), SCALAR_SQUARE(inputs one SCALAR,args{},outputType SCALAR), and SCALAR_RATIO(inputs two SCALAR,args{},outputType SCALAR). Supported bounded construction operations: PARALLEL_THROUGH(inputs POINT,LINE), ANGLE_BISECTOR(inputs ordered points [A,V,B], args {mode:INTERNAL|EXTERNAL}), CIRCLE_THROUGH_3(inputs three non-collinear POINT), CIRCLE_THROUGH_POINT(inputs center,boundary POINT), TANGENT_AT_POINT(inputs CIRCLE,POINT on the circle), and LINE_INTERSECTION(inputs two nonparallel LINE) for a unique point. Use INTERSECTION plus SELECT_POINT for multiple circle-line/circle-circle roots and declare the oriented source branch. mathPlan.conditionAudits may contain only typed checks with exact refs and a required sourceConditionId that matches one top-level sourceConditions.id: INCIDENCE_POINT_ON_LINE(POINT,LINE), DISTANCE_EQUALS(POINT,POINT,expected:typedScalar), EQUAL_DISTANCE(POINT,POINT,POINT,POINT), MIDPOINT_RATIO(start,middle,end,expected:typedScalar), PERPENDICULAR(LINE,LINE), PARALLEL(LINE,LINE), CIRCLE_MEMBERSHIP(CIRCLE,POINT), TANGENCY_AT_POINT(CIRCLE,POINT,LINE), ORIENTED_SIDE(start,end,point,sign:+1|-1). Meanings: DISTANCE_EQUALS expected is the exact length |PQ|; EQUAL_DISTANCE means |PQ|=|RS|; MIDPOINT_RATIO requires middle on segment start-end and expected is the ratio of the two parts |start-middle| divided by |middle-end|, never a part divided by the whole (a midpoint has expected 1; the centroid on a median from vertex C to midpoint M has refs C,G,M and expected 2); CIRCLE_MEMBERSHIP means the point is on the circle; TANGENCY_AT_POINT means the point is on the circle and on the line and the line is perpendicular to the radius there. Each check is exactly {id,kind,refs,sourceConditionId} plus expected or sign where listed, with a unique id. Every check must bind to a stated source condition; do not invent coordinates or substitute general constraint solving. Geometry must calculate decisive lengths and relations using nodes when relevant; scalarLabels:[{nodeId,ownerSegment,prefix,unit?:string}] displays exact results near the owner segment. Also supported rightAngles:[{id,refs:[rayPoint,vertex,rayPoint],factRole:GIVEN|DERIVED_INTERMEDIATE}] and segmentLabels:[{id,ownerSegment,variable:single-letter,unit?:cm|m,factRole:GIVEN}]. Do not create duplicate labels with the same owner and content. Avoid unnecessary construction nodes when a display segment suffices. All scalar node dependencies may follow SELECT_POINT. Display segments use IDs distinct from mathPlan point/scalar IDs. Original question content, score, choices, answer and solution remain unchanged in the actual Archive bank; map these conditions to PRESERVED_ARCHIVE_BANK.';
    extendedContract+=CUBIC_QUARTIC_CONTRACT;
    extendedContract+=' In an explicitly supplied coordinate plane, NORMALIZATION_ORIGIN and unit NORMALIZATION_AXIS may be coordinate-axis references: declare mathPlan.realization:{recipeId:"SOURCE_COORDINATE_AXES_v1",unit:"source-coordinate",reflectionEquivalent:false}; axis length must be exactly 1. Retain every SOURCE_POINT in its original coordinate frame. This is not SSS normalization or a license to invent derived coordinates.';
    extendedContract+=' The mathematical DAG may contain internal axis/projection helpers. Explicit optional displayPoints:[point IDs], displayLines:[line IDs] and displayCircles:[circle IDs] select the final educational drawing (a displayed point is written with its node id, so use the names the stored solution uses as node ids, for example A, B, M, P, and never ids such as O0, Pp or C1 that the solution does not use; helper points the solution does not name should be DERIVED_INTERMEDIATE and listed in hiddenPointNames); they are top-level plan fields, never inside mathPlan, and when one is omitted every node of that type is drawn (circles made by CIRCLE_CENTER_RADIUS are drawn as geometry). Each list must retain all original SOURCE_POINT nodes, GIVEN/CONCLUSION geometry of its type and every annotation/segment endpoint. Optional top-level coordinatePlacement:"PANEL" keeps only the point names at the points and lists each coordinateLabels point as A(x,y) in a band above the figure; use it when several labelled points would crowd the figure, or set coordinatePanel:[point IDs] to move only those points; labelDirections:{pointId:"SE"} names the first direction (N, NE, E, SE, S, SW, W or NW) tried for a coordinate label that stays at its point. A displayed line that is the x-axis or the y-axis is not drawn again (the axis shows it); do not list it in displayLines. Optional top-level hiddenPointNames:[point IDs] draws derived helper points (DERIVED_INTERMEDIATE, not in coordinateLabels) as dots without a name; use it for helpers the solution never names. A PLANE_FIGURE_v1 plan may also list a SOURCE_POINT the source figure never names (it is drawn without a name; pointNames, coordinateLabels or a caption or label text that names it are refused with HIDDEN_POINT_NAMED_IN_TEXT), and the optional top-level hiddenPointStyle:"NONE" (default "DOT", a plane figure with hidden points only) then draws the hidden points with no dot at all. For a quadratic graph, coordinatePanel:[requiredPoint IDs] or coordinatePlacement:"PANEL" names those integer key points by their id (one capital letter, optionally a digit or prime) and lists P(x,y) under the formula. For the x-axis equidistance construction, show the source A,B and derived P, segments PA and PB and their equal lengths; axis/projection helper points and auxiliary lines may stay in the exact DAG without cluttering the drawing. Use short mathematical point IDs, and use prefix:"" for a pure length value without an equation prefix; any other prefix is one or two Latin letters, optionally followed by ^2 or ^3 (for example AB, r, S^2). A construction plan may set axisTickValues:{x:[numbers],y:[numbers]} to choose the axis ticks (a polynomial graphPlan always uses {x:[],y:[]}); use {x:[],y:[]} when every displayed key point already carries a coordinate label, and never put a tick at a value whose coordinate label is drawn next to that axis.';
    extendedContract+=' Also supported point/line construction operations: DIVISION_POINT(inputs [A,B] two different POINT, args {m:typedScalar,n:typedScalar,mode:INTERNAL|EXTERNAL}, outputType POINT; the point P with AP:PB=m:n, m and n positive numbers; INTERNAL lies between A and B, EXTERNAL needs m different from n and lies beyond B when m>n and beyond A when m<n), CENTROID(inputs three non-collinear POINT vertices, args {}, outputType POINT), POINT_REFLECTION(inputs [P,centre] POINT, args {}, outputType POINT; the image of P in the point centre, which must differ from P, and for a reflection in the origin the centre is the NORMALIZATION_ORIGIN node), LINE_REFLECTION(inputs [P,l] POINT then LINE, args {}, outputType POINT; the mirror image of P in l, P not on l), PERPENDICULAR_THROUGH(inputs [P,l] POINT then LINE, args {}, outputType LINE; the line through P perpendicular to l), TRANSLATE_POINT(inputs [P], args {dx,dy} typedScalar, outputType POINT) and TRANSLATE_LINE(inputs [l], args {dx,dy} typedScalar, outputType LINE), the image shifted by dx along x and dy along y. dx and dy are literal numbers from the stored solution, not both 0; a translation given by letters, by a vector between two points, a ratio with a letter, or a negative ratio is unsupported: answer UNSUPPORTED. The image of a point under these operations is a derived point and must never carry raw coordinates; name it with a single capital letter, and when the solution writes the image with a prime (A with a prime mark) use a plain id such as P and say so in a source condition.';
    extendedContract+=` Plane figures without axes (middle school): mathPlan.realization {recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false} with at least one SOURCE_POINT and no NORMALIZATION nodes. The same planeMarks and dashed/arrow display segments also work on a coordinate construction plan (mathPlan.realization {recipeId:'SOURCE_COORDINATE_AXES_v1',unit:'source-coordinate',reflectionEquivalent:false}, axes drawn); a graph plan refuses planeMarks with PLANE_MARKS_UNSUPPORTED_ON_GRAPH. POLAR_POINT(inputs [centre, reference] two different POINT, args {length: positive typedScalar, angleDeg: typedScalar 0<a<360, turn: 'CCW'|'CW'}, outputType POINT) places a point at that distance on the ray centre->reference turned by the angle; a non-special angle is computed to high precision. displaySegments entries may carry dashed:true, arrow:'START'|'END'|'BOTH' and emphasis:'BOLD'|'ACCENT' (heavy stroke / heavy red stroke on that one segment, every other segment keeps the default style: DISPLAY_SEGMENT_EMPHASIS_INVALID; the observer reads it back: SEGMENT_EMPHASIS_MISSING, SEGMENT_EMPHASIS_COLOR_MISMATCH, SEGMENT_EMPHASIS_UNDECLARED). planeMarks:{angles:[{id,refs:[A,V,C],value,label,side,arcs,ring,style,equalGroup,noLabel}],equalLengths:[{id,count,segments}],parallels:[{id,count,segments}],expressionLabels:[{id,ownerSegment,text}],arcs:[{id,circle,center,from,to,side,label}],facts:[{kind:'ON_CIRCLE'|'TANGENT_PERPENDICULAR',...}]} states facts the figure shows; each is checked against the points (0.5 degree tolerance) and read back from the final SVG by an independent observer. An angle mark is a small light grey sector with its boundary arcs by default (style SECTOR); style ARC draws the arcs alone (equalGroup members share their style). The sector observer checks the vertex, both rays, the radius against the outermost arc, the sweep and side of the fill and that it lies beneath every stroke and label. planeMarks.regions:[{id,fill:'LIGHT'|'MEDIUM',pattern:'HATCH',label,labelKind:'MATH'|'TEXT',factRole,shapes:[{polygon:[point IDs]}|{sector:{center,from,to,side}}|{segment:{center,from,to,side}}|{loop:{start,steps:[{to,arc:{center,side,full}}]}}],holes:[...]}] fills a region with an already drawn boundary, written as shapes minus holes: a polygon of displayed point IDs, a circular sector or segment (a sector/segment side is MINOR default, MAJOR, CCW or CW and the two points must lie on the center circle), or a loop mixing straight edges with exact circular arcs (side MINOR, MAJOR, CCW, CW or FULL, where a FULL whole circle repeats its start point); a hole must lie inside a shape and shapes must not overlap because the fill rule is even-odd. fill is LIGHT by default, the fill is painted beneath every stroke and label, and an optional label (math text, at most 40 characters) is placed inside the widest interior clearance, clear of other labels. pattern:'HATCH' is for a source that says 빗금친 (hatched): the engine paints the same light fill AND real evenly spaced diagonal strokes clipped exactly to that even-odd area (they never leave the region), so a hatched part is visibly hatched, not just a second grey. labelKind:'TEXT' writes the label as plain text in the Korean text font instead of math, which is how a visible region name such as (가) or (나) is drawn; the default 'MATH' writes an expression such as 8pir^2 or 16pi-32. A source that names its parts (가)/(나) must show those names on the matching regions, and a source that hatches a part must declare pattern:'HATCH' on exactly that region. Explicit codes: REGION_BOUNDARY_UNKNOWN (an unknown point or an edge no displayed segment, line, circle or arc draws), REGION_NOT_CLOSED, REGION_SELF_INTERSECTING, REGION_LOOPS_CROSS, REGION_SHAPES_OVERLAP, REGION_HOLE_OUTSIDE, REGION_ARC_SIDE_AMBIGUOUS (a half circle without side), REGION_ARC_ENDPOINT_NOT_ON_CIRCLE, REGION_DEGENERATE, REGION_DEGENERATE_EDGE, REGION_FILL_UNSUPPORTED, REGION_PATTERN_UNSUPPORTED, REGION_HATCH_TOO_DENSE, REGION_FIELD_UNKNOWN, REGION_FIELD_INVALID, REGION_ID_INVALID and REGION_ID_DUPLICATE. The region observer recomputes the boundary from the peer points and checks the final even-odd path vertex by vertex, arc by arc (centre, radius, sweep), that every edge is stroked, that the fill is beneath the strokes, that the label stays inside its own region and inside no other region, and for a hatched region that its diagonal strokes are evenly spaced, parallel, drawn above the fill and clipped inside that same even-odd area: REGION_VERTEX_MISMATCH, REGION_ARC_SIDE_MISMATCH, REGION_ARC_RADIUS_MISMATCH, REGION_BOUNDARY_NOT_DRAWN, REGION_NOT_BENEATH_STROKES, REGION_LABEL_OUTSIDE, REGION_LABEL_IN_OTHER_REGION, REGION_LABEL_CROWDS_LABEL, REGION_HATCH_MISSING, REGION_HATCH_OUTSIDE, REGION_HATCH_UNEVEN, REGION_HATCH_DASHED, REGION_HATCH_TOO_SPARSE, REGION_HATCH_COVERED_BY_FILL and UNDECLARED_MARK. The region area value itself is not verified by the observer. planeMarks.traces:[{id,center,radius:{point:pointId}|{segment:segmentId},through:[intersection point IDs],spanDeg?,label?}] draws the compass traces of a construction: for every declared intersection, a thin solid arc of the declared radius (a point distance or a segment length) spanning spanDeg degrees (default 24, 2 to 120) around that point; the stated intersections must lie exactly on that radius, and the independent observer checks each arc's centre, radius, span, that it passes through the declared point, and that it is thin (stroke width at most 1.2) and undashed. label is an optional construction order digit (1 to 99) written outside the arc; extra trace codes are TRACE_RADIUS_INVALID, TRACE_TARGET_NOT_ON_ARC, TRACE_TARGETS_DEGENERATE, TRACE_SPAN_INVALID and TRACE_LABEL_INVALID, and observer codes are TRACE_ARC_MISSING, TRACE_ARC_COUNT_MISMATCH, TRACE_ARC_RADIUS_MISMATCH, TRACE_ARC_DOES_NOT_PASS_THROUGH, TRACE_ARC_SPAN_MISMATCH, TRACE_ARC_DASHED, TRACE_ARC_TOO_THICK and TRACE_LABEL_MISMATCH. planeMarks.expressionLabels[], planeMarks.arcs[].label and planeMarks.traces[].label also take labelKind:'TEXT' (plain Korean text in the text font, at most 40 characters, never math: a construction order sign such as ㉠ or a name such as 반직선 AB; the default is the math label) and unit:'cm'|'m'|'mm' (written after a math label: attached to a number 3cm, one space after a letter x cm; an arc label then needs labelKind:'MATH' or none, and a trace label is then a positive number or one letter): codes MARK_UNIT_INVALID, MARK_UNIT_REQUIRES_MATH_LABEL (unit with a TEXT, DEGREE or NAME label) and MARK_UNIT_REQUIRES_LABEL; a plane figure with a label on a circular arc (outside its circle) widens its frame so the label has canvas room, no author action needed (a canvas still too small for the label gives LAYOUT_INVENTORY_INCOMPLETE: enlarge coordinateCanvas); the observer reads the text of a TEXT label (data-text) and the unit glyphs and spacing (data-tex) back from the final SVG: LABEL_TEXT_MISMATCH, LABEL_KIND_MISMATCH, LABEL_UNIT_MISMATCH, LABEL_UNIT_SPACING_MISMATCH, and an arc label must stand nearer its own arc than another arc of the same circle (ARC_LABEL_AMBIGUOUS_OWNER).`;
 extendedContract+=' PLANE MARKS 2 (E7, E8b, E12b): planeMarks.dimensions:[{id,from,to,label,unit?,labelKind?,side,style?,offset?,value?}] writes a length between two displayed points on a line parallel to them, outside the figure: side is the screen side ABOVE|BELOW|LEFT|RIGHT (the perpendicular of the two points that points that way; a segment nearly perpendicular to the named side is DIMENSION_SIDE_AMBIGUOUS), style BAR (default: thin extension lines, a dimension line, a short tick at each end), ARROW (arrowheads) or BRACE (a curly brace pointing outward), offset 1..3 stacks several on one side (24 px from the points, 44 px more per level), the label stands outside the line, centred; label is math (a trailing "\\,cm" is the unit cm), unit cm|mm|m, labelKind TEXT for plain text, value (optional) is the real distance (DIMENSION_FACT_MISMATCH); codes DIMENSION_SIDE_INVALID, DIMENSION_STYLE_INVALID, DIMENSION_OFFSET_INVALID, DIMENSION_LABEL_REQUIRED, DIMENSION_POINTS_COINCIDE, DIMENSION_TOO_SHORT; the observer recomputes the feet of the perpendiculars, offset, side, ticks, arrowheads, brace and label place (DIMENSION_OFFSET_MISMATCH, DIMENSION_SIDE_MISMATCH, DIMENSION_END_MISMATCH, DIMENSION_EXTENSION_MISMATCH, DIMENSION_TICK_MISMATCH, DIMENSION_ARROW_MISMATCH, DIMENSION_BRACE_MISMATCH, DIMENSION_PART_MISSING, DIMENSION_LABEL_NOT_OUTSIDE, DIMENSION_LABEL_OFF_CENTER, DIMENSION_LABEL_TOO_FAR, DIMENSION_LABEL_AMBIGUOUS_OWNER, DIMENSION_CROSSES_STROKE). planeMarks.pathLabels:[{id,points,label,unit?,labelKind?,value?}] writes ONE total length for a bent path: points are 3..8 distinct displayed points joined by drawn displaySegments, the label stands beside the path on a leader that starts on it (PATH_LABEL_POINTS_INVALID, PATH_LABEL_SEGMENT_NOT_DRAWN, PATH_LABEL_FACT_MISMATCH, PATH_LABEL_LABEL_REQUIRED; observer PATH_LABEL_LEADER_MISSING, PATH_LABEL_LEADER_CROSSES). angles[].labelPlacement "LEADER" puts that angle label outside its angle on a leader from its own arc even where it would fit inside (ANGLE_LABEL_PLACEMENT_INVALID, ANGLE_LABEL_PLACEMENT_NEEDS_LABEL; observer ANGLE_LABEL_LEADER_MISSING, ANGLE_LABEL_NOT_OUTSIDE_ANGLE). traces[].span "JOIN" draws one continuous arc through all stated intersections (spanDeg/2 past each end) instead of a short arc around each (TRACE_SPAN_INVALID, TRACE_JOIN_TOO_WIDE); traces[].labelAt START|MID|END (the counter-clockwise start, middle, end of the drawn arc) or a direction in degrees (0 right, 90 up) puts the label there (TRACE_LABEL_AT_INVALID, TRACE_LABEL_AT_NEEDS_LABEL, TRACE_LABEL_NOT_AT_ANCHOR); expressionLabels[].labelAt START|MID|END writes a segment label at its first end, middle or second end (SEGMENT_LABEL_AT_INVALID, SEGMENT_LABEL_NOT_AT_END). A composite panel caption of plain text wider than its cell now breaks into two lines and a caption taller than the standard row makes the caption rows taller; COMPOSITE_CAPTION_TOO_LARGE remains when it still does not fit.';
    extendedContract+=' For source-coordinate geometry only, coordinateCanvas:{width,height} may enlarge the composition with width 384–720 and height 320–600; this changes framing only and must preserve all source coordinates, exact derived coordinates, labels and their owners. For a quadratic overview only, overviewCanvasHeight may increase the plot height between 400 and 600 SVG units; keep all required roots, vertex, source ticks and both curve arms visible.';
    extendedContract+=' MULTI-PANEL PLANE FIGURES (composite-panels-v1): to compare several axis-free figures side by side (five option quadrilaterals, or two sub-items of one question) use {capability:"composite-panels-v1",panels:[{caption:{math?|text?},plan:PLANE_FIGURE_v1 plan},...],caption,sourceConditions,newVisualInformation}. Every panel must be a construction-spike-v1 PLANE_FIGURE_v1 plan (2 to 5 panels); a graph or number-line panel cannot be mixed in. A panel may instead be a solid-figure-v1 plan (solids or net, a prism, pyramid, net and so on, without caption, solidCaption, sourceConditions, newVisualInformation or sourceQuote), alone or beside plane figures: a grid with a solid panel has 2 to 6 panels (two columns, up to three rows: COMPOSITE_TOO_TALL when the page height is exceeded), the same solid may appear in each with a different group of segments emphasized, and the engine narrows each solid panel to 384 units so the two-column grid stays 776 units wide (a solid panel is refused with PANEL_SOLID_PLAN_<index>, a solid mixed with a graph or number line with PANEL_SOLID_MIXED_<index>, a bad panel count with PANELS). The engine builds a two-column grid (2 panels in one row, 3 or 5 panels in two columns over two or three rows, 4 a 2x2 grid), centres each audited panel SVG in an equal cell and writes one caption row per panel; it never uses three columns, because one 384-unit panel is the narrowest canvas and a 3*384 px row pushes the measured base font past the 32 px policy cap in the about 298 CSS px Archive solution column (UNSUPPORTED_DISPLAY_ENVELOPE:REQUESTED_PROFILE_FONT_SCALE). The two-column grid must keep the same envelope: the combined width should stay at or below about 848 SVG units for that measured column, so 384-420 wide panels pass while two 640-wide panels (1288) are refused at measure; narrow the canvas to 384-416 or use separate single plans when a wide figure is required. Each panel keeps the planeMarks/rightAngles/regions/displaySegments rules above with at least one SOURCE_POINT, no NORMALIZATION node and coordinateCanvas 384-720 by 320-600 (default 384x320); every point a mark or segment names must be in that panel displayPoints. Panel caption text is at most 24 characters; put the whole explanation in the top-level caption. A composite taller than the 640 CSS px page limit is refused (COMPOSITE_TOO_TALL), as are mixed panels (PANEL_PLANE_MIXED:<index>), 1 or 6+ panels, a wrong panel schema/canvas, and a caption wider than its cell (COMPOSITE_CAPTION_TOO_LARGE).';
    extendedContract+=RATIONAL_CONTRACT;
    extendedContract+=SQRT_AFFINE_CONTRACT;
    extendedContract+=ABSOLUTE_VALUE_CONTRACT;
    extendedContract+=PIECEWISE_AFFINE_CONTRACT;
    extendedContract+=EXPONENTIAL_AFFINE_CONTRACT;
    extendedContract+=LOGARITHMIC_AFFINE_CONTRACT;
    extendedContract+=TRIGONOMETRIC_CONTRACT;
    extendedContract+=' A function graph made of up to four polynomial pieces of degree at most 2 that join without a jump (for example the absolute value of a quadratic written as its pieces, or |x^2+x-6|+2x when the solution rewrites the equation as k=g(x)), drawn together with up to three horizontal lines y=c and their intersection points, is ONE curve and is supported: use {capability:"piecewise-polynomial-spike-v1",graphPlan:{family:"piecewise-polynomial",pieces:[{coefficients:[...]},...],breakpoints:[{x,y},...],sourceDomain,formula,referenceLines:[...],requiredPoints:[...],exactCoordinates:{...},axisTickValues:{x:[],y:[]}},caption,sourceConditions,newVisualInformation}; every field named here sits inside graphPlan except capability, caption, sourceConditions and newVisualInformation (and the optional top-level coordinatePlacement, coordinatePanel and labelDirections, which work as for a quadratic). pieces lists 1 to 4 pieces from left to right, each {coefficients:[constant, x coefficient, x squared coefficient]} with exact integer or fraction strings such as "-6", "3", "1/2" (degree at most 2; no decimals; an irrational coefficient is allowed only as described under IRRATIONAL COEFFICIENTS below). breakpoints has exactly one entry fewer than pieces: breakpoints[i].x (exact strings, strictly increasing) is where piece i ends and piece i+1 begins, and breakpoints[i].y is the common value there; both neighbouring pieces must give exactly that y (a jump is refused with PIECEWISE_POLY_DISCONTINUOUS, a wrong y with PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH). The first piece runs from the left end of the source domain to the first breakpoint, the last piece from the last breakpoint to the right end. sourceDomain is {kind:"ALL_REALS"} (the outer pieces continue without end; the engine draws them a little beyond the outermost marked point) or {kind:"INTERVAL",range:[lo,hi],states:[start,end]} as for a quadratic on an interval (each breakpoint strictly inside). requiredPoints:[{id,x,y}] with numeric x and y must contain every breakpoint (corner) and the vertex of every quadratic piece whose vertex lies strictly inside that piece; the engine recomputes both and refuses a plan that misses one (PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS, PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS) or a point off the curve; give non-integer coordinates in exactCoordinates {pointId:["1/2","25/4"]} so every such point gets its exact coordinate label, and use one capital letter as id (A, B, C) so a crowded label can move to the band. formula (optional) writes the header line y=... : the source function in x with digits, x, abs(...), + - * / ^ and parentheses only, implicit products such as 2x allowed (for example "abs(x^2+x-6)+2x"); it must be the same function as the pieces (PIECEWISE_POLY_FORMULA_MISMATCH otherwise); leave it out when the source gives the function only by its pieces. referenceLines:[{id,y,intersectionX,labelIntersections}] (at most 3): id is a short ASCII name starting with a letter (for example k), y the exact height as an integer or fraction string, and intersectionX the exact x of EVERY intersection of that line with the whole curve, each once (a touching point counts once), written with integers, fractions, sqrt(...), + - * / and parentheses (for example "(-3-sqrt(53))/2"); the engine solves every piece exactly and refuses a list that differs (PIECEWISE_POLY_INTERSECTION_MISMATCH says how many it finds). Each intersection is drawn as a dot; labelIntersections:true also writes its exact coordinates beside the dot (default false: dots only, which keeps a crowded figure readable). Each line is written as y=c in the band under the formula. When the solution counts intersections with a moving line y=k, draw one representative value strictly inside the answer range (for example y=5 for 4<k<25/4) and name that value in the caption. Do not give domain or viewport: the engine frames the figure at one scale on both axes. A referenceLines entry may instead be a SLANTED line y=m*x+c: {id,slope,intercept,intersectionX} with slope (not 0) and intercept exact integer, fraction or p+q*sqrt(r) strings; it is drawn across the figure with a dot at every intersection, its equation goes to the band, and intersectionX again lists EVERY intersection x with the whole curve (PIECEWISE_POLY_INTERSECTION_MISMATCH otherwise). A moving line (y=mx+12 with m asked for, y=x+k, y=p(x-3)+3) is drawn at ONE sample value of the parameter strictly inside the answer range or at the boundary case the solution discusses; name that value in the caption. labelIntersections is not available for a slanted line (PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED): to write the coordinates of an intersection with rational coordinates, list it in requiredPoints (id, x, y, exactCoordinates) and it is drawn once as that key point. Slope 0 with slope/intercept is refused (PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO: use y); a slope or intercept that is not an exact integer, fraction or p+q*sqrt(r) string (a decimal, a letter) is PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID; a line equal to a whole piece is PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE. A vertical line, a jump, or a piece of degree 3 or more is not supported; a second function that is itself piecewise is written in referenceCurves (see REFERENCE CURVES below).';
    extendedContract+=' A discontinuous function made of up to six polynomial pieces of degree at most 2, each on its own bounded or unbounded interval with OPEN or CLOSED ends, is supported: use {capability:"piecewise-discontinuous-spike-v1",graphPlan:{family:"piecewise-discontinuous",pieces:[{coefficients:[...],domain:[lo,hi],start:"OPEN"|"CLOSED",end:"OPEN"|"CLOSED"},...],jumpValues:[{x,y},...],referenceLines:[...],requiredPoints:[...],exactCoordinates:{...},axisTickValues:{x:[],y:[]}},caption,sourceConditions,newVisualInformation}. coefficients are the constant, x and x squared terms as exact integer, fraction or p+q*sqrt(r) strings (degree at most 2); domain holds the two ends of that piece, a number or exact string, or null for an unbounded end (only the first left end and the last right end may be null). start and end default CLOSED and say whether the piece includes that end; the piece is drawn only on its own interval, so pieces at a jump are never joined by a connecting segment. Pieces are listed left to right and must not overlap (PIECEWISE_DOMAIN_OVERLAP); more than six is PIECEWISE_TOO_MANY_PIECES; a bad coefficient or domain is PIECEWISE_DISCONTINUOUS_PIECE_INVALID and a bad state is PIECEWISE_ENDPOINT_STATE_INVALID. At a junction where the two pieces share an x, exactly one function value must be declared: either one of the two ends is CLOSED (a filled dot at that value) or jumpValues has {x,y} there; none gives PIECEWISE_DISCONTINUITY_UNDECLARED and a declared value that differs from the CLOSED end gives PIECEWISE_VALUE_CONFLICT. jumpValues also writes an isolated point f(a)=c where no piece is defined, and the engine draws a filled dot there; the value dots and the hollow dots at OPEN ends are computed and drawn by the engine, never listed by the author. A staircase is written instead as step:{values:[...],xFrom,xTo}: values[i] on the i-th equal subinterval (closed on the left, open on the right, the last closed at xTo), up to six steps, a bad interval is STEP_INTERVAL_INVALID (do not give pieces and step together). referenceLines (at most 3) are horizontal y=c exactly as for piecewise-polynomial-spike-v1: {id,y,intersectionX,labelIntersections}, and intersectionX lists EVERY crossing with the whole function including a declared value that lies on the line; an OPEN end is not a crossing and a piece equal to the line is PIECEWISE_REFERENCE_LINE_CONTAINS_A_PIECE; a differing list is PIECEWISE_INTERSECTION_MISMATCH. requiredPoints must contain the vertex of every quadratic piece that lies strictly inside its piece (PIECEWISE_DISCONTINUOUS_EXTREMUM_NOT_IN_REQUIRED_POINTS); a key point lies on a piece or on a declared value. Do not give formula or referenceCurves: a formula for a genuinely discontinuous function and a second piecewise curve are not supported. Do not give domain or viewport: the engine frames the figure at one scale on both axes.';
    extendedContract+=' IRRATIONAL COEFFICIENTS (piecewise-polynomial-spike-v1): when the figure needs a parabola or a line whose coefficient is irrational, for example a tangent condition k=-3+2*sqrt(3) in y=x^2+kx+5, a line of slope 6-2*sqrt(7), the line y=-11+4*sqrt(7), or a quadratic with a=2-sqrt(2) on [0,2], write that coefficient as an exact string p+q*sqrt(r) with p and q integers or fractions and r a positive integer: "-3+2*sqrt(3)", "3/2-sqrt(3)", "(1+sqrt(2))/2", "sqrt(7)/2". This works for pieces[].coefficients, breakpoints, referenceLines y, slope and intercept, and for the x and y of requiredPoints; use ONE piece (pieces has one entry, no breakpoints) for a plain quadratic. All irrational numbers of one plan use the same radical sqrt(r) (the engine computes in the field of p+q*sqrt(r)); a plan with sqrt(2) in one coefficient and sqrt(3) in another is PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED. Nested radicals such as sqrt(2+sqrt(3)), two radicals in one coefficient (sqrt(2)+sqrt(3)) and cube roots are PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED; a decimal such as 1.73 or a letter is PIECEWISE_POLY_COEFFICIENT_INVALID. A key point with irrational coordinates is given with exact strings, for example {id:"V",x:"3/2-sqrt(3)",y:"-1/4+3*sqrt(3)"}; the engine checks that it lies exactly on the curve (PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE), writes it as the exact coordinate label and keeps the float for the drawing. The vertex of the parabola, every breakpoint and every contact point must still be listed in requiredPoints. intersectionX may contain nested radicals when the crossing really is one (for example "(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2"); the engine and the independent observer both recompute it. The display formula cannot contain sqrt: a plan with an irrational piece and a formula is PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED, leave formula out and name the case (for example k=-3+2*sqrt(3)) in the caption. Two cases that the solution compares (k=-3+2*sqrt(3) and k=-3-2*sqrt(3)) are two separate figures; a composite panel needs polynomial-spike-v1 and cannot hold irrational coefficients.';
    extendedContract+=' When the stored solution solves a quadratic inequality (for example D/4=(a+3)(a-5)<0 for a parameter a, or x^2+4x+3<0 together with x>=-2), use {capability:"quadratic-inequality-chain-v1",inequality:{coefficients,comparator,variable,domain,adjoinedPoints,integerPoints},graphCaption,numberLineCaption,caption,sourceConditions,newVisualInformation}: the engine draws a fixed chain of two panels, the quadratic graph y=f(variable) with its real roots and vertex as key points, then the solution set as a number line headed by the interval (for example -3<=a<5 written with the inequality signs), with a filled dot at a closed end, a hollow dot at an open end and a thick band over the set. Give only the inequality f(variable) comparator 0: coefficients are exactly three exact integer or fraction strings [constant, linear, squared] of f with a nonzero squared coefficient (expand the factored form: (a+3)(a-5) is ["-15","-2","1"]); comparator is one of "<", "<=", ">", ">="; variable is the solution variable, one lowercase letter other than y (default x). Never give endpoints, dots or coordinates: the engine solves the inequality exactly (roots with square roots allowed) and an independent observer re-solves it and checks the drawing. domain (optional) {kind:"INTERVAL",range:[lo,hi],states:[start,end]} is a condition the solution imposes on the variable (for example a+3>0 or x>=-2): lo and hi are exact strings or null for no bound, each state OPEN or CLOSED; the set is intersected with it. adjoinedPoints (optional) lists exact values a separate case of the solution adds (for example ["-3"] when the solution checks a=-3 on its own and it satisfies the condition); each must close an open end of the set. integerPoints (optional) draws the integers of the set as dots above the line: true for a bounded set, or {range:["lo","hi"]} (integer strings) to count only integers in that range; use it when the solution counts or lists integers, natural numbers or their sum. graphCaption and numberLineCaption (optional) are panel captions {math,text} as for composite panels (math plain ASCII such as k>0; text short Korean without subscripts). The final set must be one interval, one point or all reals: a set of two pieces (INEQUALITY_SOLUTION_NOT_ONE_INTERVAL), an empty set (INEQUALITY_SOLUTION_EMPTY), an adjoined value that does not touch the set (INEQUALITY_ADJOINED_POINT_NOT_ADJACENT), integer points of an unbounded set without a range (INEQUALITY_INTEGER_POINTS_NEED_RANGE), more than 25 integer points, a linear inequality and a system of two quadratic inequalities are not supported; for a system, draw the one quadratic inequality and give the other condition as domain.';
    extendedContract+=' When the stored solution compares solution sets on a number line (the intersection of two or more inequality solution sets, a solution set whose end depends on a parameter such as a or n, integer solutions, or an internal division point on the line) and no quadratic graph is needed, use {capability:"number-line-figure-v1",numberLine:{variable,parameter,rows},numberLineCaption,caption,sourceConditions,newVisualInformation}: the engine draws one panel with a row per set on one shared scale and never draws a coordinate plane. rows (1 to 4) is a list of {kind:"SET",pieces:[{lo,hi}],integerPoints}, {kind:"RESULT",integerPoints} or {kind:"POINTS",points}. A SET row is the solution set of one inequality as one or two disjoint pieces (for example x<-1 or x>2 is two pieces); a piece is {lo,hi} where each end is null for a ray or {value:"exact integer or fraction string",state:"OPEN"|"CLOSED"} (OPEN for < and >, CLOSED for <= and >=) or {param:{mul:"exact",add:"exact"},state} for an end equal to mul*p+add with p the parameter (a-2 is mul "1" add "-2"; (a+2)/3 is mul "1/3" add "2/3"); the engine writes the end label itself, stacked fractions included. parameter:{name:"a",value:"exact"} is required exactly when some end uses param: name is one lowercase letter other than the variable and y, and value is the sample value of the parameter the figure is drawn at (the figure then says it is drawn for that value; give a value that shows the case the solution discusses, for example a boundary value, and state it in caption). RESULT (at most one, after at least two SET rows, last) is the exact intersection of every SET row above it, computed and checked by the engine: never give its ends. integerPoints on a SET or RESULT row draws the integers of that row as dots over the line: true for a bounded set, or {range:["lo","hi"]} (integer strings) for a ray or to count only integers in a range; at most 25. A POINTS row (2 to 8 points, ids one capital letter or one Hangul consonant letter each) marks points by {id,value:"exact"} or an internal division point {id,divides:{from:"A",to:"B",ratio:["m","n"]}} which the engine places at AP:PB=m:n and labels with m over AP and n over PB. A point may carry name (null, or one Hangul consonant letter such as ㄱ), hideName:true (no name is drawn) and showValue:false (its value is not written; the point and its name are still drawn). A POINTS row may carry band:false (no highlighted segment between the outermost points) and subdivisions:[{from,to,parts}] (integer strings with from<to, parts 2 to 10, at most 8 entries that do not overlap): every integer from the lowest to the highest of the points and subdivisions then gets a labelled tick, each unit between from and to is cut into parts equal parts by short ticks, and the values of the points that show one are written above their names. numberLine.axisVariable:false leaves out the variable written at the end of each axis. variable (default x, one lowercase letter other than y) names the axis. numberLineCaption is a panel caption {math,text} as for composite panels. Refused with a code: a RESULT that is empty (NUMBER_LINE_RESULT_EMPTY), a single point (NUMBER_LINE_RESULT_IS_A_POINT) or more than two pieces (NUMBER_LINE_TOO_MANY_PIECES); pieces that overlap or touch (NUMBER_LINE_PIECES_OVERLAP, NUMBER_LINE_PIECES_TOUCH); a point piece or reversed ends (NUMBER_LINE_PIECE_IS_A_POINT, NUMBER_LINE_PIECE_INVALID); a param end without parameter (NUMBER_LINE_PARAMETER_MISSING), a parameter no end uses (NUMBER_LINE_PARAMETER_UNUSED), a bad name or sample value (NUMBER_LINE_PARAMETER_INVALID) or mul 0 (NUMBER_LINE_PARAMETER_COEFFICIENT_ZERO); decimals or non-exact values (NUMBER_LINE_VALUE_INVALID); integerPoints of an unbounded row without a range (NUMBER_LINE_INTEGER_POINTS_NEED_RANGE) or more than 25 integers (NUMBER_LINE_TOO_MANY_INTEGER_POINTS); coinciding points or a division that names a missing point (NUMBER_LINE_POINTS_COINCIDE, NUMBER_LINE_DIVISION_INVALID); a name that is not one Hangul consonant letter or contradicts hideName (NUMBER_LINE_POINT_NAME_INVALID), two points with one Hangul name in a row (NUMBER_LINE_POINT_NAME_DUPLICATE), subdivisions that are not integer units with 2 to 10 parts, overlap, or sit on a SET or RESULT row (NUMBER_LINE_SUBDIVISIONS_INVALID), ticks closer than 6 px (NUMBER_LINE_TICKS_TOO_DENSE) and a non-boolean axisVariable (NUMBER_LINE_AXIS_VARIABLE_INVALID). A solution set that depends on the parameter in a way that changes the shape of the figure from case to case is drawn for one sample value only; never present one case as the whole answer. An external division point, a set of three or more pieces and a shaded plane region are not supported.';
    extendedContract+=' NUMBER LINE COMPASS ARCS AND LETTER POINTS (number-line-figure-v1): numberLine.constructions:[{id,center,radius:{value},arc:{side:"LEFT"|"RIGHT"|"BOTH"},hits:[{id,branch:"LEFT"|"RIGHT"}]}] (1 to 4; row:k only with two POINTS rows) draws a compass arc over the line round a drawn point of a POINTS row, with an exact radius (an exact string such as 3, 3/2, sqrt(5), 1+sqrt(5); one radical inside a value, but different points may use different radicals such as sqrt(2) and sqrt(3)), landing on the hit points; each hit is a point of the same row whose value must be exactly center+radius (branch RIGHT) or center-radius (LEFT); side RIGHT or LEFT lists one hit, BOTH lists two. An optional source:{grid:true,from:[x,0],to:[x,y],toName?} on a construction draws the segment whose length is the radius on a lattice of unit cells (one cell is one unit of the line) standing on the line: from is [the centre value (an integer), 0], to is a lattice point above and to one side of it (y from 1, x not the centre value), its length sqrt(dx^2+dy^2) must be the radius exactly, toName is an optional capital letter written at its end; the arc then runs from its hit up to that end. Chained constructions: source:{perpendicular:{at:"P",height:"1",toName?}} raises a perpendicular of an exact height on the line at the point at (usually the hit of an earlier arc) and draws the hypotenuse from the centre to its tip with a right angle mark; sqrt(|at-center|^2+height^2) must be the radius of that construction exactly (the spiral: radius sqrt(2) from the unit square diagonal, a perpendicular of height 1 at sqrt(2), the hypotenuse sqrt(3) is the next radius); the arc runs from its hit to the tip. A POINTS value may itself be such an exact surd string (for example "-5+2*sqrt(5)", whose label under the dot is written with a root sign), never a decimal. A POINTS point with neither value nor divides is a letter point: its id is one lowercase letter, optionally with a minus sign ("a", "-a", "n"), written under its dot in math italic and never with a number; its place comes only from constraints: between:[p,q] (ids of the row, or exact values such as "0" and "1"), mirrorOf:"a" (the reflection of the letter point a in 0; the two ids must be a and -a) and the row field order:[ids] left to right. The constraints must fix the order of every letter point (NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS otherwise); the engine then picks a place that satisfies them and writes none of it. A point style may also be "TICK" (a short vertical tick through the line, for an unknown such as n). Refused with a code: NUMBER_LINE_CONSTRUCTION_INVALID, _NEEDS_POINTS_ROW, _ROW_INVALID, _ROW_AMBIGUOUS, _POINT_UNKNOWN, _RADIUS_INVALID, _ARC_INVALID, _HIT_MISMATCH, _HITS_INCOMPLETE, _SPAN_ABOVE, _ARC_TOO_SMALL, _ARC_ON_LABEL, _ARC_ON_DOT, _SOURCE_INVALID, _SOURCE_LENGTH_MISMATCH, _SOURCE_TOO_TALL, _SOURCE_ON_LABEL; NUMBER_LINE_RADICALS_MIXED (inside one value, or a centre plus a radius with two radicals); NUMBER_LINE_SYMBOL_INVALID, _BETWEEN_INVALID, _ORDER_INVALID, _MIRROR_INVALID, _ORDER_AMBIGUOUS, _CONSTRAINT_CONTRADICTORY, _CONSTRAINT_UNSATISFIABLE, _UNSUPPORTED, _TOO_CLOSE.';
    extendedContract+=' When the stored solution reads or explains a statistics or probability picture of the problem (a histogram, a frequency polygon, a relative-frequency graph, a stem-and-leaf plot, a box plot, a scatter plot, the 6x6 table of two dice, a probability tree), use {capability:"stat-chart-figure-v1",chart:{kind,...},caption,sourceConditions,newVisualInformation}: the engine draws the chart in textbook form with Korean axis titles and derives every other number itself. Give only the data of the problem, exactly. kind HISTOGRAM or FREQUENCY_POLYGON: boundaries (n+1 class boundaries as exact strings, equal class width, at least 0, at most 12 classes), series [{name?,frequencies:[one integer per class]}] or [{name?,relativeFrequencies:["0.1","3/20"]}] (relative frequencies must add up to 1; a polygon may have two named series, a histogram one), yKind "FREQUENCY" or "RELATIVE" (RELATIVE with frequencies makes the engine divide by the total), polygon true on a HISTOGRAM to draw its frequency polygon over it, xTitle and yTitle (short Korean, for example "기록(회)" and "도수(명)"), grid, showValues, highlightClasses; the engine adds the polygon end classes of frequency zero and the class midpoints itself. kind STEM_LEAF: values [whole numbers 0-999] (or groups [{name,values},{name,values}] for a back-to-back plot), unitText such as "건", title, key {stem,leaf}, marks [{group?,ranks:[rank in ascending order]} or {group?,median:true}] to circle the leaves; the engine sorts, keeps empty stems and counts. kind BOX_PLOT: series [{name,values:[at least 4 numbers]}] or [{name,summary:{min,q1,median,q3,max}}] (1 to 3 boxes), xTitle, step, showValues; quartiles follow the curriculum (Q1 and Q3 are the medians of the lower and upper half, the middle value left out when n is odd). kind SCATTER: points [{x,y,name?}] (every plotted point, at most 40), xRange and yRange [lo,hi] (at least 0, ends multiples of the step), xStep, yStep, labelEvery, xTitle, yTitle, grid, diagonal true for the line y=x. kind DICE_TABLE: faces (default 6), cell PAIR, SUM, PRODUCT or NONE, highlight as a condition on the two dice a (across) and b (down): {expr:"a+b",in:[2,7]}, {expr,cmp:"<=",value}, combined with any, all or not (expr uses integers, a, b, + - * and parentheses, for example "b-2*a"); the engine colours exactly the cells that satisfy it. kind TREE: root {label?,children:[{label,p:"3/7",children:[...]}]} with 2 to 5 children per node, depth at most 3, at most 12 leaves, exact probabilities p on every branch or on none (the probabilities of the children of a node must add up to 1), showPathProbability to write the product along each path at its leaf. kind DOT_PLOT (a dot plot): values [whole numbers 0-9999] (or counts [{value,count}]), step, axisBreak {from,to} for an outlier far from the rest, xTitle: one dot per datum stacked over its value. Refused with a code: unequal class widths (STAT_CLASS_WIDTH_UNEQUAL), a frequency list of the wrong length (STAT_FREQUENCY_COUNT_MISMATCH), a stated total that is not the sum (STAT_FREQUENCY_TOTAL_MISMATCH), relative frequencies not adding up to 1 (STAT_RELATIVE_SUM_NOT_ONE), a leaf mark outside the data (STAT_STEM_MARK_INVALID), fewer than 4 box-plot values (STAT_BOX_NEEDS_FOUR_VALUES), a point outside the axis range (STAT_POINT_OUTSIDE_RANGE), an expression that uses another letter (STAT_DICE_EXPR_INVALID), branch probabilities not adding up to 1 (STAT_TREE_BRANCH_PROBABILITY_SUM) or given on only some branches (STAT_TREE_PROBABILITY_MIXED), a title or label that cannot be placed (STAT_LABEL_OUT_OF_BOUNDS, STAT_LABELS_TOO_CLOSE). A pie chart, a category bar chart and a cumulative graph are not supported.';
    extendedContract+=' kind NORMAL_CURVE (E36, inside stat-chart-figure-v1) draws a bell curve N(mean, sd^2) from the exact density: chart {kind:"NORMAL_CURVE",curves:[{id,mean,sd,label?,meanLine?}] (1 to 3, exact numbers, or letters "m","σ" for a problem that gives only letters: then one curve and z positions),ticks:["13",{x:"25",text:"k"},{z:"-1.5"}],shades:[{curve?,from:"13"|null,to:"20"|null,tone?}] (from and to name ticks by their text, null runs to the window end),areaLabels:[{shade,text:"0.4332"|"0.5+0.1915"|"p"|"?"}] (a number must equal the integrated area: use the problem table values, never the asked answer),symmetry:[{pair:["17","23"]}],zAxis,span}. SCATTER also takes refLines:[{type:"x=k"|"y=k",value}|{type:"y=x"}] and regions:[{xMin?,xMax?,yMin?,yMax?,markPoints?,countLabel?,countUnit?,tone?}] to mark the points of an area (countLabel only when the count is not the asked value). Refused with a code: STAT_NORMAL_SD_INVALID, STAT_NORMAL_AREA_LABEL_MISMATCH, STAT_NORMAL_BOUNDARY_NOT_TICKED, STAT_NORMAL_SYMMETRY_MISMATCH, STAT_NORMAL_WINDOW_TOO_WIDE, STAT_SCATTER_GUIDE_OUT_OF_RANGE, STAT_SCATTER_REGION_EMPTY.';
    extendedContract+=' APPLICATION AXES (polynomial-spike-v1, a quadratic on sourceDomain INTERVAL only): for a word problem whose two axes measure different quantities (a count 0..50 against a profit 0..45000, a perimeter against an area) set graphPlan.applicationAxes:true. Each axis then has its own scale (the plot is 448 by 360 and the figure is never drawn at one scale), the author gives the real tick values as graphPlan.axisTickValues:{x:[...],y:[...]} (2 to 8 values per axis, an arithmetic progression with step 1, 2 or 5 times a power of ten, every value a multiple of the step, nonzero, inside the framed view; pick values that stay clear of the curve and the key points), and graphPlan.axisVariable may be one letter other than y, lower or upper case (n, P), for the horizontal axis. domain, viewport and requiredPoints work as for an interval quadratic (key points on the curve, endpoint dots at the interval ends); straight lines are allowed. A pure mathematical graph must never use it: it keeps one scale. The independent observer re-checks the plot size against the viewport and each axis scale and re-validates the ticks. Refused with a code: APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL (any other family, ALL_REALS, cubic), INVALID_APPLICATION_AXES (the flag is not true, or axisSqueeze or plotCanvas is given), APPLICATION_AXES_TICKS_INVALID:x or :y (missing, empty, not 1-2-5 or outside the view), APPLICATION_AXES_CURVE_TOO_NARROW (the interval is under 48 px wide), APPLICATION_AXES_SCALE_MISMATCH (observer).';
    extendedContract+=' REFERENCE CURVES (piecewise-polynomial-spike-v1): when the solution needs a second function drawn with the first (f and g crossing, the solution of f(x)<=g(x)), add graphPlan.referenceCurves (at most two). Each entry is EITHER a quadratic {id,name?,coefficients:[constant, x coefficient, x squared coefficient],intersectionX:[...]} with a nonzero x squared coefficient, OR a piecewise function {id,name?,pieces:[{coefficients},...] (1 to 4, degree at most 2),breakpoints:[{x,y},...] (one fewer than pieces; the pieces must meet there, a jump is PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS),sourceDomain?,formula?,intersectionX:[...]}, where sourceDomain is omitted or {kind:"ALL_REALS"}, or {kind:"INTERVAL",range:[lo,hi],states:[start,end]} for its OWN domain (an OPEN end is drawn hollow and excluded as a crossing). id is a short ASCII name starting with a letter; name (optional) is one lowercase letter other than i, x and y and labels the curve in the band (name + "(x)=" + formula when formula is given, else name + "(x)"; without a name y=formula or y). All coefficients are exact integer, fraction or p+q*sqrt(r) strings (one radical for the whole plan). intersectionX lists EVERY x where BOTH functions are defined and equal (each once, integers, fractions and sqrt(...) allowed, at most 8); the engine and the independent observer solve it piece pair by piece pair, so a root outside either function piece interval, or at an OPEN end, is never a crossing (PIECEWISE_POLY_INTERSECTION_MISMATCH:<id>:engine finds N intersection(s) otherwise). Each crossing is a dot, or the key point it coincides with. The vertex of a quadratic reference curve, and every corner and every vertex strictly inside a piece of a piecewise one, must be listed in requiredPoints (PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS, PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS), and a requiredPoints entry may lie on the function or on a reference curve inside that reference own domain. graphPlan.functionName (one lowercase letter, same limits) writes the header as f(x)=formula, or the name f(x) next to the curve when the function is given only by pieces. The optional graphPlan.sampleNote (at most 32 characters of digits, letters, = + - * / ( ) . and spaces, for example "a=2") writes the parameter value the figure is drawn at inside the upper left of the plot (PIECEWISE_POLY_SAMPLE_NOTE_INVALID otherwise); name the same value in the caption. A piecewise reference curve is labelled next to its own drawing (its corner), not in the band, so the two curves are not confused. A quadratic reference curve whose x squared coefficient is 0 (PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC), a curve equal to a whole piece (PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE), a third curve or a malformed entry (PIECEWISE_POLY_REFERENCE_CURVES_INVALID), a bad letter (PIECEWISE_POLY_FUNCTION_NAME_INVALID), more than 4 reference pieces (PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID), a bad reference domain or breakpoint (PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID, PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID) or a reference formula that is not the pieces (PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH) is refused. A cubic or quartic second curve is written as pieces:[{coefficients:[c0,c1,c2,c3(,c4)]}] (rational coefficients, at most 5 per piece; the function pieces may be cubic or quartic too, with rational coefficients above degree 2): the engine finds every root and local extremum exactly by factoring over the rationals and refuses an irreducible factor of degree 3 or more (PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM, PIECEWISE_POLY_HIGH_DEGREE_IRRATIONAL_UNSUPPORTED), and every extremum of a cubic or quartic piece must be listed in requiredPoints (an inflection is not one); regions between a cubic and the x-axis, a line or a quadratic are supported; a vertical line is drawn with graphPlan.overlays (see GRAPH OVERLAYS). SHADED REGIONS: add graphPlan.regions (at most 4) to fill the band between two drawn boundaries. Each entry is {id,upper,lower,from,to,fill?,label?}: id is a short ASCII name starting with a letter; upper and lower are "f" (the function itself), "axis" (y=0), a referenceCurves id or a referenceLines id; from and to are exact integer, fraction or sqrt(...) strings (the same grammar as intersectionX) with from<to, and both boundaries must be defined over the whole closed interval (an interval end closes the band with a vertical side). The upper boundary must stay strictly above the lower one inside the interval: a boundary crossing or a zero-width touch means split it into one region per piece, while the endpoints may touch. fill is LIGHT (default) or MEDIUM (the same light greys as plane-figure regions); label is optional short math text (at most 40 characters) placed inside the band. A signed area is several regions declared side by side (one per sign piece), never one folded region. Refused with a code: GRAPH_REGION_COUNT_INVALID, GRAPH_REGION_FIELD_INVALID, GRAPH_REGION_FIELD_UNKNOWN, GRAPH_REGION_ID_INVALID, GRAPH_REGION_ID_DUPLICATE, GRAPH_REGION_BOUNDARY_UNKNOWN, GRAPH_REGION_BOUNDARY_UNDEFINED, GRAPH_REGION_DOMAIN_INVALID, GRAPH_REGION_BOUNDARIES_CROSS, GRAPH_REGION_EMPTY, GRAPH_REGION_FILL_UNSUPPORTED, GRAPH_REGION_LABEL_INVALID (graphPlan.regions belongs to piecewise-polynomial-spike-v1 only: on another family it is GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL). The engine samples the exact boundary rows (the same curves the strokes draw) and paints one even-odd path beneath every stroke; the independent observer rebuilds both boundaries from the plan, checks the fill path at nine sample x values, the exact x extent, the fill colour, the paint order, that points just inside/outside are inside/outside, that regions do not overlap and that the label box lies inside the band: GRAPH_REGION_INVENTORY_MISMATCH, GRAPH_REGION_MISSING, GRAPH_REGION_UNDECLARED, GRAPH_REGION_BOUNDARY_MISMATCH, GRAPH_REGION_OUTSIDE_INTERVAL, GRAPH_REGION_OUTSIDE_BOUNDARY, GRAPH_REGION_INTERIOR_MISSING, GRAPH_REGION_FILL_MISMATCH, GRAPH_REGION_FILL_RULE_MISMATCH, GRAPH_REGION_STROKE_PRESENT, GRAPH_REGION_NOT_BENEATH_STROKES, GRAPH_REGION_LABEL_MISSING, GRAPH_REGION_LABEL_OUTSIDE, GRAPH_REGION_OVERLAP.';
    extendedContract+=' GRAPH OVERLAYS (any single-curve graph: polynomial/quadratic/cubic-quartic, piecewise-polynomial, piecewise-affine, rational, sqrt, absolute value, exponential, logarithmic, trigonometric, exp-log pair): when the solution draws a second element ON TOP of the graph, add graphPlan.overlays. It is one general layer; every value is an exact integer, fraction or sqrt(...) string and every coordinate is recomputed exactly. overlays.lines:[{id,slope,intercept,label?}] is the straight line y=slope*x+intercept (slope may be 0) and {id,x,label?} is the vertical line x=a; each line is clipped to the plot and its equation (y=... or x=...) is written beside it (label overrides the text). overlays.points:[{id,...}] adds named points, one of: {id,curveX,curve?} a point ON the drawn curve at that x (y is computed exactly; for exp-log-pair the curve id is required), {id,intersect:[lineId,lineId]} the intersection of two overlay lines, {id,axis:"x"|"y",value} a point on an axis, or {id,x,y} an explicit point. A point id is one or two ASCII letters/digits and must not repeat a requiredPoints id; its display name comes from plan.pointNames as usual. overlays.segments:[{id,from,to,dashed?}] joins two overlay points; overlays.guides:[{id,from,axis:"x"|"y"|"BOTH"}] draws a dashed guide from a point to the axes; overlays.polygons:[{id,points:[3-6 point ids],fill?:"LIGHT"|"MEDIUM"|"NONE",label?,labelKind?:"MATH"|"TEXT"}] draws a simple closed polygon (for example the triangle OAB or the rectangle OAPB) with an optional light fill beneath the strokes; the optional label (at most 40 characters: a formula such as b for MATH, the default, or plain Korean text for TEXT) is written inside the polygon where it has the most room, and the observer refuses a label that is not wholly inside its polygon. At most 6 lines, 8 points, 6 segments, 4 guides and 2 polygons; every point and every polygon vertex must lie inside the framed viewport (the engine does not silently enlarge the frame), a point on a curve must be inside the drawn source domain, and for exp-log-pair a curve id is required on curve points. Refused with an explicit code: OVERLAY_PLAN_INVALID, OVERLAY_TOO_MANY:<kind>, OVERLAY_ID_INVALID:<kind>, OVERLAY_ID_DUPLICATE:<id>, OVERLAY_POINT_ID_CONFLICT:<id>, OVERLAY_POINT_INVALID:<id>, OVERLAY_POINT_UNKNOWN:<id>, OVERLAY_POINT_NOT_ON_CURVE:<id>, OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:<id>, OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>, OVERLAY_CURVE_REQUIRED:<id>, OVERLAY_CURVE_UNKNOWN:<id>, OVERLAY_LINE_INVALID:<id>, OVERLAY_LINE_PARALLEL:<id>, OVERLAY_LINE_OUTSIDE_VIEWPORT:<id>, OVERLAY_SEGMENT_INVALID:<id>, OVERLAY_SEGMENT_DEGENERATE:<id>, OVERLAY_GUIDE_INVALID:<id>, OVERLAY_POLYGON_INVALID:<id>, OVERLAY_POLYGON_DEGENERATE:<id>, OVERLAY_POLYGON_LABEL_INVALID:<id>, OVERLAY_POLYGON_LABEL_KIND_INVALID:<id>, OVERLAY_POLYGON_LABEL_KIND_WITHOUT_LABEL:<id>, OVERLAY_FILL_INVALID:<id>, OVERLAY_VALUE_INVALID:<id>, OVERLAY_LABEL_INVALID:<id> and OVERLAY_BASE_INVALID. The independent graph observer recomputes every overlay point, line, segment, guide, polygon and line label from the same exact inputs and reads the final SVG back; a shifted point, a moved line, a missing segment or polygon, an undeclared overlay element or a missing equation label is a FAIL.';
    extendedContract+=' OVERLAY LABELS AND LATTICE POINTS (graphPlan.overlays, any single-curve graph): points[].coordinates:true writes the point coordinates beside it (name(x,y), for example A(-6,-3), when plan.pointNames names the point, else (x,y); integer or fraction coordinates (3/2, -1/3), a radical is OVERLAY_COORDINATES_REQUIRE_RATIONALS:<id>, OVERLAY_COORDINATES_INVALID:<id>). segments[].length:true writes the exact length of the segment (an integer or p*sqrt(q), computed from its end points; OVERLAY_SEGMENT_LENGTH_UNSUPPORTED:<id>, OVERLAY_SEGMENT_LENGTH_INVALID:<id>) beside it. points[].unnamed:true draws a dot without a name letter (an unlabelled intersection; with coordinates:true only the (x,y) form is written; OVERLAY_POINT_UNNAMED_INVALID:<id>; the observer refuses a name label for it, OVERLAY_POINT_NAME_UNEXPECTED:<id>, OVERLAY_COORDINATES_LABEL_NAMED:<id>). A point with curveX on a trigonometric graph that uses ratePi (coefficients [A,C], the rate is ratePi*pi) or phase is evaluated on that grammar. points[].labelDirection and segments[].labelDirection (N NE E SE S SW W NW) is the side the layout tries first for that label (a hint, OVERLAY_LABEL_DIRECTION_INVALID:<id>; only with coordinates or length). The equation label of a line that found no room at its first place is tried at other places on the same line (with a leader line when it has to move away); the observer reads that every line equation, coordinate label and length label belongs to its own point, line or segment (OVERLAY_LINE_LABEL_NOT_NEAR_OWNER, OVERLAY_LINE_LABEL_AMBIGUOUS_OWNER, OVERLAY_LINE_LEADER_NOT_ON_OWNER, OVERLAY_LINE_LEADER_NOT_ON_LABEL, OVERLAY_COORDINATES_LABEL_TEXT_MISMATCH, OVERLAY_COORDINATES_LABEL_AMBIGUOUS_OWNER, OVERLAY_SEGMENT_LENGTH_LABEL_TEXT_MISMATCH, OVERLAY_SEGMENT_LENGTH_LABEL_NOT_NEAR_OWNER, OVERLAY_SEGMENT_LENGTH_LABEL_AMBIGUOUS_OWNER). overlays.latticePoints (one object): {region:BELOW_CURVE or ABOVE_CURVE,xRange:[lo,hi] integers (at most 12 columns),yMin (BELOW_CURVE) or yMax (ABOVE_CURVE) an integer,strict?:true (default, the points on the curve are left out; false keeps them),counts?:true,curve? (the curves id, exp-log-pair only)} draws every integer point under (or over) the drawn curve in those columns as a small unnamed dot (at most 40; the engine counts them exactly), and counts:true writes the number of points of each column (in a row under the x-axis when the window leaves 40 px there, otherwise beside the top dot of the column). Refused with: OVERLAY_LATTICE_INVALID, OVERLAY_LATTICE_REGION_INVALID, OVERLAY_LATTICE_RANGE_INVALID, OVERLAY_LATTICE_BOUND_INVALID, OVERLAY_LATTICE_TOO_MANY, OVERLAY_LATTICE_EMPTY, OVERLAY_LATTICE_COLUMN_UNDEFINED:<x>, OVERLAY_LATTICE_POINT_COINCIDES:<x,y>, OVERLAY_POINT_OUTSIDE_VIEWPORT:lattice, OVERLAY_POINT_OUTSIDE_SOURCE_DOMAIN:lattice. The observer enumerates the integer points again from the exact curve and compares them with the dots of the final SVG one by one (OVERLAY_LATTICE_POINT_MISSING:<x,y>, OVERLAY_LATTICE_POINT_UNEXPECTED:<id>, OVERLAY_LATTICE_DOT_SIZE:<id>, OVERLAY_LATTICE_COUNT_LABEL_MISSING, OVERLAY_LATTICE_COUNT_LABEL_TEXT_MISMATCH, OVERLAY_LATTICE_COUNT_LABEL_NOT_IN_COLUMN, OVERLAY_LATTICE_COUNT_LABEL_AMBIGUOUS_OWNER).';
    extendedContract+=' DISPLAY WINDOW (rational-spike-v1, inverse proportion y=k/(d0+d1*x) only): graphPlan.displayWindow:[xmin,xmax,ymin,ymax] makes the frame exactly that window at one scale on both axes (448 px wide, as tall as its aspect needs; the y range is widened by less than a pixel to a whole pixel height) instead of the automatic window around the pole; the curve is clipped to it and a branch or asymptote outside it is not drawn. The origin must be inside (DISPLAY_WINDOW_MUST_CONTAIN_ORIGIN); a window under 160 px (DISPLAY_WINDOW_TOO_FLAT) or over 640 px (DISPLAY_WINDOW_TOO_TALL) tall, a pole exactly on its edge (DISPLAY_WINDOW_POLE_ON_EDGE), a window with no curve in it (DISPLAY_WINDOW_CURVE_NOT_VISIBLE), a malformed list (DISPLAY_WINDOW_INVALID), axisSqueeze (DISPLAY_WINDOW_FORBIDS_AXIS_SQUEEZE), a required point outside (REQUIRED_GRAPH_POINT_OUTSIDE_DISPLAY_WINDOW:<id>), another family (DISPLAY_WINDOW_UNSUPPORTED_FAMILY) or a rational that is not an inverse proportion (DISPLAY_WINDOW_REQUIRES_INVERSE_PROPORTION) is refused; the engine never widens the window (an overlay point or line outside it is OVERLAY_POINT_OUTSIDE_VIEWPORT:<id>). Without axisTickValues the ticks are a 1/2/5 grid with at most 8 labels per axis, and formulaLabel goes where the window is emptiest near its curve (28 to 120 px from it); graphPlan.formulaAt:[x,y] (inside the window, only with displayWindow) names the spot yourself (FORMULA_AT_INVALID, FORMULA_AT_OUTSIDE_WINDOW, FORMULA_AT_REQUIRES_DISPLAY_WINDOW, FORMULA_AT_UNSUPPORTED_FAMILY; the observer reads that the label stands within 110 px of it, FORMULA_LABEL_NOT_AT_ANCHOR). In such a plan the line equation labels are placed under the line-owned rule from the start, like the labels of coordinates, lengths and lattice points. The independent observer re-validates the window against the viewport (DISPLAY_WINDOW_VIEWPORT_MISMATCH) and recomputes from the exact coefficients which branches the window must show (RATIONAL_WINDOW_BRANCH_MISSING:<left|right>, RATIONAL_WINDOW_BRANCH_UNEXPECTED:<left|right>, RATIONAL_WINDOW_SHOWS_NO_CURVE).';
    extendedContract+=' AXIS TITLES (any single-curve graph): graphPlan.axisTitles:{x?,y?} writes a short Korean title with its unit (at most 10 characters of Korean letters, ASCII letters, digits, space and ()/.,%-, for example 시간(분) or 거리(km)) at the end of that drawn axis instead of the letter x or y, as plain text that must find room (never dropped). Refused with AXIS_TITLES_INVALID (not an object with x and/or y), AXIS_TITLE_INVALID:<axis> (empty, padded, longer than 10 characters or any other character, TeX included), AXIS_TITLE_AXIS_HIDDEN:<axis> (that axis is not drawn). The observer reads the title from the final SVG (AXIS_TITLE_MISSING, AXIS_TITLE_TEXT_MISMATCH, AXIS_TITLE_NOT_AT_AXIS_END).';
    const MULTI_CURVE_CONTRACT=` MULTI-CURVE FIGURE (multi-curve-figure-v1): when one source figure genuinely needs THREE OR MORE distinct nonlinear curves at once (not two curves, not two curves plus a line, not one curve split into branches), use {capability:"multi-curve-figure-v1",graphPlan:{family:"multi-curve",curves:[...],axisTickValues:{x:[],y:[]}},caption,sourceConditions,newVisualInformation}. curves has 3 to 6 entries; each is {id,kind:"Y_OF_X"|"X_OF_Y",coefficients:[c0,c1,c2],domain:[lo,hi]} plus branch:"BOTH"|"POSITIVE"|"NEGATIVE" for X_OF_Y (default BOTH) and an optional label, an exact ASCII math string such as y=2-x^2 that is drawn beside that curve with the existing math-label machinery (bad text is MULTI_CURVE_LABEL_INVALID:<id>). graphPlan may also carry the same overlays layer as the other graph families (lines, points, segments, guides, polygons; every coordinate must lie inside the framed viewport and the frame is never silently enlarged) and axisTickValues may place exact unit ticks; when no point name, equation label or other counted label exists, give at least one exact axis tick value so the publication text gate has real text. Y_OF_X draws y=c0+c1*x+c2*x^2 on the closed x interval; X_OF_Y draws x=c0+c1*y+c2*y^2 on the closed y interval as its upper (POSITIVE) and/or lower (NEGATIVE) branch, which the engine converts to y(x) exactly. Every coefficient and end is an exact integer or fraction string (or one p+q*sqrt(r)); c2 must be nonzero. The engine frames all curves at one scale (vertical squeeze at most 1/2), gives every branch its own exact draw interval and tags it CURVE_<id> or CURVE_<id>_POS/_NEG, and the independent observer recomputes every curve and branch from the same coefficients, compares the frozen inventory, and reads the final SVG: a shifted point, a curve outside its interval or branch side, a wrong endpoint, a wrong interior arc or a missing/extra curve is a FAIL. Refused with an explicit code: MULTI_CURVE_COUNT_INVALID (fewer than 3 or more than 6), MULTI_CURVE_FIELD_UNKNOWN:<field>, MULTI_CURVE_CURVE_INVALID:<id>, MULTI_CURVE_ID_INVALID, MULTI_CURVE_KIND_INVALID:<id>, MULTI_CURVE_COEFFICIENT_INVALID:<id>, MULTI_CURVE_NOT_QUADRATIC:<id>, MULTI_CURVE_DOMAIN_INVALID:<id>, MULTI_CURVE_BRANCH_INVALID:<id>, MULTI_CURVE_BRANCH_EMPTY:<id>, MULTI_CURVE_LABEL_INVALID:<id>, MULTI_CURVE_FRAME_DEGENERATE, MULTI_CURVE_TOO_NARROW. This family is for three or more distinct curves; a single curve, two curves, two curves plus a line, or a curve with piecewise branches uses the existing family instead.`;
const SET_DIAGRAM_CONTRACT=` SET DIAGRAMS (set-diagram-figure-v1): when the stored solution needs a Venn diagram or a finite mapping diagram, use {capability:"set-diagram-figure-v1",diagram:{kind:"VENN"|"MAPPING"|"MEMBERSHIP_TABLE",...},caption,sourceConditions,newVisualInformation}; the engine derives every region, the truth of the set expression on each atomic cell, the shading geometry and the placement of each element itself, and an independent observer reads the final SVG back. VENN: sets is 1 to 3 entries {id:"A",name?} (one capital letter, not U), each with at most 12 elements [{text:"2",in:["A","B"],math?}] where in lists exactly the sets the element belongs to (empty in = outside every set); an element whose sets cannot occur in the drawn layout is refused (SET_ELEMENT_REGION_EMPTY), and a text that looks like an interval or an inequality is refused (SET_ELEMENT_TEXT_UNSUPPORTED). shade is a set expression over U and the set ids with union, intersection, difference and a postfix complement (for example "(A∩B)∪(A∪B)^c" or "A-B"); U itself may be written. An expression true on no cell is refused (SET_SHADE_EMPTY). For the standard inclusion B⊂A of two sets add subset:["B","A"] (inner first); the inner set is drawn wholly inside the outer one and only the nonempty cells are used. MAPPING: columns is 2 or 3 entries {id:"X",name?,elements:["1","2","3"]} with 1 to 8 distinct short element texts per column (the column id is a capital letter with an optional digit, the name defaults to the id; a self-map uses two columns with the same name and different ids). arrows is 1 to 24 entries {from:{column:0,element:0},to:{column:1,element:1},style?:"SOLID"|"DASHED"}; an arrow joins two adjacent columns in either direction (X->Y and Y->X both, so a function and its reverse can share one figure; X->Y->Z is also supported), no duplicate pair and no arrow between distant columns (MAPPING_ARROW_DIRECTION_UNSUPPORTED). Column and element indices are zero-based positions in the plan. highlight is optional: {arrows:[arrow indices]} thickens those arrows and {elements:[{column,element}]} puts a light box behind those elements. MEMBERSHIP_TABLE is the faithful figure when a finite universe is given with two to four sets and overlapping circles cannot show every membership combination: sets is 2 to 4 entries {id,name?} (one capital letter, not U), elements is 1 to 12 rows [{text,in,math?}] where in lists exactly the sets that contain the element, and element texts must be distinct. The engine draws one row per element, one column per set, and an exact membership mark in every cell the plan declares; it never adds or drops a mark. More than 3 sets for VENN, more than 4 sets for MEMBERSHIP_TABLE, more than 3 columns, an element text that is not a short value, more than 8 elements in a column, and more than 12 elements in a Venn diagram or membership table are refused (SET_COUNT_UNSUPPORTED, MAPPING_COLUMN_COUNT_UNSUPPORTED, MAPPING_TOO_MANY_ELEMENTS, SET_TOO_MANY_ELEMENTS). Sets written symbolically or as intervals (for example {x|x<=10}) are not Venn elements: draw only the finite elements the problem puts in the regions, or answer UNSUPPORTED. The observer checks by sampling the final shading path points against the expression, by recomputing each element label box membership from the drawn ellipses, and by tracing each arrow from its source label box to its target label box; an element label that does not fit inside its region is refused (SET_ELEMENT_NO_ROOM, SET_LABEL_NO_ROOM, SET_DIAGRAM_RENDERED_LAYOUT_FAIL) so draw fewer elements or fewer sets in one figure.`;
const LATTICE_PATH_CONTRACT=` LATTICE PATH FIGURES (lattice-path-figure-v1): when the stored solution counts shortest paths on a rectangular road network (grid of squares) from A to B, with roads that must not be used (forbidden) or must be used (via) or one example path, use {capability:"lattice-path-figure-v1",lattice:{grid:{cols,rows},points:{A:[0,0],B:[6,3],P:[4,1]},from?:"A",to?:"B",forbidden?:[["P","Q"]],via?:[[p,q]],counts?:true|false|[names],hideTargetCount?:true,highlightPath?:[names or [x,y]]},caption,sourceConditions,newVisualInformation}; cols 1-10, rows 1-8, [0,0] is the lower left crossing, a segment joins two neighbouring crossings (a name or [x,y]), forbidden roads are drawn broken and via roads bold. counts:true makes the engine count the shortest paths (moving only toward the target) from from to each crossing that can still be completed into a valid path and write those small numbers; the final count at the target (the answer) is hidden unless hideTargetCount is false, so never write counts values yourself. highlightPath is one example path (neighbouring crossings, no repeated or forbidden road; moving back is allowed and then no count is meaningful). A non-rectangular road network, diagonal roads or a count of paths that go back are UNSUPPORTED. An independent observer walks every valid path by brute force and reads the final SVG back (LATTICE_*, LP_* codes).`;
const CONTAINER_FILL_CONTRACT=` CONTAINER FILL FIGURES (container-fill-figure-v1): when the stored solution reads a vessel that is filled with water at a constant rate against the graph of the water height over time (matching vessels with their height-time graphs, choosing the graph of one vessel, explaining why a graph is steep or flat), use {capability:"container-fill-figure-v1",container:{pairs:[{vessel:{name?,profile:[...]},graphName?,segmentNotes?,flowPi?,xTicks?,yTicks?}],guides?,xTitle?,yTitle?,origin?},caption,sourceConditions,newVisualInformation}. The engine draws every vessel as its cross-section and computes the height-time graph itself (the time to reach a height is proportional to the volume below it, exact at every piece boundary, sampled densely inside a frustum): never describe or draw the curve yourself. profile is the vessel from the bottom up, 1 to 4 pieces on one vertical axis: {kind:"CYLINDER",radius,height} or {kind:"FRUSTUM",r0 (bottom radius),r1 (top radius),height}, all exact positive strings; r0 "0" is a cone with its point down and is allowed only for the first piece; the bottom radius of a piece may differ from the top radius of the piece below (a wide cylinder under a thin tube draws a step). pairs holds 1 to 3 rows, each a vessel with its own graph on one vertical scale; name (the vessel, such as "A" or "물컵") and graphName (such as "ㄱ" or the circled "㉠" the problem prints) are optional, at most 6 characters, and stand under the vessel and under the graph. Give the proportions of the picture (a cup that widens upward: r0 2, r1 4), not measured values the problem does not state. guides true draws a dotted level guide from the vessel at every piece boundary and at the top to its kink in the graph. segmentNotes [{segment (0 is the bottom piece),text (at most 16 characters)}] put a short Korean note beside that piece of the curve. xTitle and yTitle (at most 14 characters, defaults "시간" and "높이"; write units yourself, for example "시간(초)" and "높이(cm)"); origin false hides the O. Numeric ticks are drawn only where you give a value: yTicks (heights, increasing, at most the vessel height) and, when the problem states the inflow, flowPi (the water volume per time unit as a multiple of pi, for example "9" for 9 pi cubic cm per second) with xTicks (times, increasing, at most the total time). Never write the choice number the problem asks for. Refused with a code: more than 3 pairs or none (CONTAINER_PAIR_COUNT_INVALID), a malformed profile or more than 4 pieces (CONTAINER_PROFILE_INVALID), a piece kind other than CYLINDER or FRUSTUM (CONTAINER_PIECE_KIND_UNSUPPORTED), a sphere, hemisphere or other curved wall (CONTAINER_CURVED_PROFILE_UNSUPPORTED), a tilted, off-axis or lopsided vessel (CONTAINER_ASYMMETRIC_UNSUPPORTED), a pointed top or a cone point above the first piece (CONTAINER_APEX_UNSUPPORTED), a radius or height that is not a positive exact number (CONTAINER_DIMENSION_INVALID), xTicks without flowPi (CONTAINER_XTICKS_NEED_FLOW), proportions that cannot be drawn legibly (CONTAINER_PROPORTION_UNSUPPORTED: a piece under 12 px high, a part narrower than 6 px, two kinks under 8 px apart), a note with no room (CONTAINER_NOTE_NO_ROOM) or a label that cannot be placed (CONTAINER_LABEL_OUT_OF_BOUNDS, CONTAINER_LABELS_TOO_CLOSE, CONTAINER_LABEL_ON_LINE). A hemispherical or spherical vessel, an inflow that changes with time and a hand-drawn graph are not supported: answer UNSUPPORTED.`;
    extendedContract+=SOLID_FIGURE_CONTRACT;
    extendedContract+=SET_DIAGRAM_CONTRACT;
    extendedContract+=MULTI_CURVE_CONTRACT;
    extendedContract+=CONTAINER_FILL_CONTRACT;
    extendedContract+=LATTICE_PATH_CONTRACT;
    let planner=recoveredPlanner??await provider('PLAN_VISUAL',{instruction:extendedContract,source:sourceOnly,verifiedSolution:question.solution,verification:verified.payload},images,folder);
    plan=planner.payload;
    stages.push(freeze('PLANNER',planner,provenance));
    if(!plan.sourceConditions?.length||!plan.newVisualInformation?.length){
      const repair=repairBudget.consume('PLANNER_SCHEMA',objectSha(plan),'MISSING_COVERAGE_OR_BENEFIT');
      planner=await provider('REPAIR_PLAN_SCHEMA',{instruction:extendedContract+' REQUIRED TOP-LEVEL sourceConditions:[{id,condition,mappedTo}] AND newVisualInformation:[string]. No wrapper around plan. Include them in your full corrected output.',source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,defect:'PLANNER_SOURCE_COVERAGE_OR_BENEFIT_MISSING'},images,folder);plan=planner.payload;
      stages.push(freeze('PLANNER',planner,provenance));
      repairBudget.complete(repair,objectSha(plan));
      if(!plan.sourceConditions?.length||!plan.newVisualInformation?.length)throw Error('PLANNER_SOURCE_COVERAGE_OR_BENEFIT_MISSING');
    }
    if(!['construction-spike-v1','polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1','piecewise-discontinuous-spike-v1','exp-log-pair-spike-v1','trigonometric-spike-v1','piecewise-polynomial-spike-v1'].includes(plan.capability))throw Error('UNSUPPORTED_CAPABILITY');
    console.log(JSON.stringify({stage:'INDEPENDENT_SOURCE_CONDITIONS',uid}));
    let sourceReview;
    for(let revision=0;revision<=3;revision++){
      const wirePlan=compileConstructionWirePlan(plan);
      if(objectSha(wirePlan)!==objectSha(plan))stages.push(freeze('PLAN_WIRE_NORMALIZATION',{beforeSha256:objectSha(plan),afterSha256:objectSha(wirePlan),rule:'Condition audit type/kind aliases and technical IDs only; no mathematical input or condition changes.'},provenance));
      plan=wirePlan;
      stages.push(freeze('PLANNER',planner,provenance));
      if(plan.mathPlan){
        const normalized=await pythonWorker({action:'construction',graph:plan.mathPlan});
        if(normalized.status!=='OK'){
          stages.push(freeze('NORMALIZATION_REJECTION',normalized,provenance));
          if(revision===3)throw Error('NORMALIZATION_REPAIR_BUDGET_EXHAUSTED');
          const repair=repairBudget.consume('NORMALIZER',objectSha(plan),normalized.result.code);
          planner=await provider('REPAIR_TYPED_PLAN',{instruction:extendedContract+' IMPORTANT SELECT_POINT must have args:{} and branch:{kind,refs,sign} at the NODE TOP LEVEL. Never put branch inside args. Return full corrected plan.',source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,normalizerError:normalized.result},images,folder);plan=planner.payload;repairBudget.complete(repair,objectSha(plan));continue;
        }
        if(failedAttemptRef)for(const pending of repairBudget.ledger.filter(r=>r.stage==='NORMALIZER'&&r.outputSha===null&&r.reason==='REALIZATION_RECIPE_REQUIRED'))repairBudget.complete(pending,objectSha(plan));
      }
      sourceReview=await reviewConditions(plan);
      stages.push(freeze('SOURCE_REVIEW',sourceReview,provenance));
      if(sourceReviewClosed(sourceReview))break;
      if(revision===3)throw Error('SOURCE_REVIEW_REPAIR_BUDGET_EXHAUSTED');
      console.log(JSON.stringify({stage:'PLAN_REPAIR',uid,revision:revision+1}));
      const repair=repairBudget.consume('SOURCE_REVIEW',objectSha(plan),objectSha(sourceReview.payload));
      planner=await provider('REPAIR_VISUAL_PLAN',{instruction:extendedContract,source:sourceOnly,verifiedSolution:question.solution,previousPlan:plan,defects:sourceReview.payload},images,folder);plan=planner.payload;repairBudget.complete(repair,objectSha(plan));
    }
    if(!sourceReviewClosed(sourceReview))throw Error('SOURCE_REVIEW_NOT_CLOSED');
    frozen={...plan,schemaVersion:'VISUAL_PHASE2_PLAN_v1',questionUid:uid,visualAssetKey:identity.visualAssetKey,sourceRef,solutionRef,sourceRegistryRef,verifiedSolutionRef:verifiedReceipt.outputs[0],verifiedSolutionPolicySha256:verifyPolicy,verificationInputSha256,sourceReviewInputSha256:sourceReview.inputSha256,sourceReviewPolicySha256:sourcePolicyFingerprint(root)};
    frozen.planSha256=planHash(frozen);planReceipt=freeze('PLAN',frozen,provenance);stages.push(planReceipt);
    }
    verifyConstructionConditionBindings(plan);
    let materialPlan=plan;
    if(plan.graphPlan){
      const framing=await worker({action:'frame_graph',graphPlan:plan.graphPlan});
      stages.push(freeze('GRAPH_OVERVIEW_FRAME',framing,provenance));
      materialPlan={...plan,graphPlan:framing.graphPlan};
    }
    const fingerprint=scopeFingerprint(root,plan.capability);
    console.log(JSON.stringify({stage:'MATH',uid}));
    const action=plan.mathPlan?{action:'construction',graph:plan.mathPlan}:{action:'graph',graphPlan:materialPlan.graphPlan};
    const math=await calculationStage(root,{stage:'MATH',key:objectSha({action,implementation:mathFingerprint(root,plan.capability)}),provenance},async()=>({'model.json':canonicalJson(await worker(action))}));stages.push(math.receipt);
    const model=JSON.parse(readBoundFile(root,math.receipt.outputs[0]));
    let reconstruction;
    if(plan.mathPlan){const peer=reconstruct(plan.mathPlan);reconstruction={...compareReconstruction(model,peer),peer};}
    else reconstruction=await workerGraphAudit(materialPlan.graphPlan,model.svg,model.transform);
    stages.push(freeze('MATH_REVIEW',reconstruction,provenance));if(reconstruction.status!=='PASS')throw Error('MATH_RECONSTRUCTION_FAIL');
    if(materialPlan.graphPlan?.tickLabelCallouts!==undefined&&uid!=='25_연향중_1학기_기말_중3_기출c|13')throw Error('TICK_LABEL_CALLOUT_Q13_ONLY');
    let spec=specFor(materialPlan,model,identity.assetId);stages.push(freeze('NORMALIZE',spec,provenance));
    let prepared=await worker({action:'prepare',spec});
    const envelopePreflight=await actualArchiveEnvelopePreflight({identity,folder,questionUid:uid,sourcePath,ordinal,sourceRef,solutionRef,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},sourceAuthorityStatus:authority?'CANONICAL_CURRENT':'EXPERIMENTAL_LOCATOR',signal,onProgress:onArchiveProgress});
    stages.push(...envelopePreflight.stages);
    const sourceRequestedSizeClass=question.solutionImageSize||'medium';
    // Allocate actual space before choosing the glyph scale; preserve all
    // axis-normal ticks and owner-bound coordinate labels.
    const requestedSizeClass=model.coordinateMode==='SOURCE_COORDINATES'||spec.displayFacts.formulaPlacement==='HEADER_BAND'?'full':sourceRequestedSizeClass;
    stages.push(freeze('DISPLAY_REQUESTED_PROFILE',{sourceRequestedSizeClass,requestedSizeClass,reason:requestedSizeClass===sourceRequestedSizeClass?'SOURCE_PROFILE':'SOURCE_COORDINATE_GEOMETRY_SPACE'},provenance));
    const typographyPolicy=requestedProfileTypographyPolicy({requestedSizeClass,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},observation:envelopePreflight.observation,fontFloorCssPx:11,...(spec.displayFacts.formulaPlacement==='HEADER_BAND'?{minimumBaseFontPx:21}:{})});
    stages.push(freeze('DISPLAY_TYPOGRAPHY_POLICY',typographyPolicy,{...provenance,requestedSizeClass,preflightEvidence:envelopePreflight.preflightEvidence}));
    const candidateLabelInventory=prepared.labels.map(label=>({id:label.id,fontPx:typographyPolicy.baseFontPx}));
    const displayEnvelopePlan=planDisplayEnvelope({root,questionUid:uid,requestedSizeClass,intrinsicSvg:{width:spec.viewport.width,height:spec.viewport.height},candidateLabelInventory,observation:envelopePreflight.observation,preflightEvidence:envelopePreflight.preflightEvidence,archiveEngineSha256:envelopePreflight.archiveEngineSha256,sourceRef,solutionRef,policyRefs:envelopePreflight.policyRefs,fontFloorCssPx:11,typographyPolicy});
    const displayEnvelopeReceipt=freeze('DISPLAY_ENVELOPE',displayEnvelopePlan,{...provenance,preflightEvidence:envelopePreflight.preflightEvidence,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(displayEnvelopeReceipt);
    const t=typesetter(),fragments={};
    for(const label of prepared.labels){
      if(label.kind==='CONDITION_BOX')throw Error('UNSUPPORTED_MULTILINE_PHASE2_LABEL');
      const numericTick=label.kind==='GRAPH_ANNOTATION'&&/^[-−\d.]+$/.test(label.text);
      const role=spec.displayFacts.factRolesByLabel?.[label.id]||plan.mathPlan?.nodes.find(n=>n.id===label.target)?.factRole||'DERIVED_INTERMEDIATE';
      fragments[label.id]=t({id:label.id,owner:label.target||label.id,factRole:role,fontPx:typographyPolicy.baseFontPx,...(label.math||label.kind==='POINT_NAME'||numericTick?{kind:'MATH',tex:label.tex||label.text.replaceAll('−','-')}:{kind:'TEXT',text:label.text})},identity);
    }
    stages.push(freeze('TYPESET',fragments,provenance));
    const browser=await dependency('playwright').chromium.launch({channel:'chrome',headless:true});const measurements={};
    try{const page=await browser.newPage();for(const [id,fragment] of Object.entries(fragments)){await page.setContent(fragment.svg);const bbox=await page.locator('svg').first().evaluate(e=>{const b=e.getBBox(),r=e.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height,viewportWidth:r.width,viewportHeight:r.height};});if(bbox.width<=0||bbox.height<=0)throw Error('FRAGMENT_BROWSER_MEASUREMENT_MISSING');measurements[id]=[bbox.viewportWidth,bbox.viewportHeight];fragment.observedBBox=bbox;}}finally{await browser.close();}
    const measurementReceipt=freeze('MEASURE',{measurements,observedFragments:fragments,displayEnvelope:displayEnvelopePlan,preflightEvidence:envelopePreflight.preflightEvidence},provenance);stages.push(measurementReceipt);
    if(materialPlan.graphPlan&&spec.displayFacts.formulaPlacement!=='HEADER_BAND'){
      const formulaId=prepared.labels.find(label=>label.kind==='EQUATION_LABEL')?.id;
      const measuredFormula=measurements[formulaId];
      if(formulaId&&measuredFormula){
        const panelPaddingPx=24,maximumPanelPx=200,requiredPanelPx=Math.ceil((measuredFormula[0]+panelPaddingPx)*10)/10;
        if(requiredPanelPx>maximumPanelPx)throw Error('UNSUPPORTED_DISPLAY_ENVELOPE:GRAPH_FORMULA_PANEL_LIMIT');
        if(requiredPanelPx>spec.viewport.panel){
          const priorPanelPx=spec.viewport.panel,priorLabelInventory=prepared.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text,sourceMath:label.sourceMath??null}));
          const priorLabelInventorySha256=objectSha(priorLabelInventory),baseSpecSha256=objectSha(spec);
          const sourcePlanSha256=objectSha(plan),sourceConditionsSha256=objectSha(plan.sourceConditions||[]),graphPlanSha256=objectSha(materialPlan.graphPlan);
          const sourceFactSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],graphPlan:materialPlan.graphPlan});
          const baseSvgSha256=bytesSha(Buffer.from(model.svg));
          const requestedProfile=displayEnvelopePlan.profiles.find(profile=>profile.sizeClass===requestedSizeClass);
          const repairInput={schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_INPUT_v3',questionUid:uid,sourceSha256:sourceRef.sha256,solutionSha256:solutionRef.sha256,sourcePlanSha256,sourceConditionsSha256,sourceFactSha256,graphPlanSha256,baseSvgSha256,baseSpecSha256,priorLabelInventorySha256,formulaLabelId:formulaId,formulaFragmentSha256:fragments[formulaId].fragmentSha256,formulaText:prepared.labels.find(label=>label.id===formulaId)?.text,measuredFormula:{widthPx:measuredFormula[0],heightPx:measuredFormula[1]},requestedSizeClass,profilePolicySha256:requestedProfile.profilePolicySha256,typographyPolicySha256:objectSha(typographyPolicy),sourcePolicySha256:sourcePolicyFingerprint(root),verifiedSolutionPolicySha256:verifiedSolutionPolicyFingerprint(root),displayPolicyRefsSha256:objectSha(displayEnvelopePlan.policyRefs),currentPanelPx:priorPanelPx,panelPaddingPx,maximumPanelPx};
          const repairInputSha256=objectSha(repairInput),selectedPanelPx=requiredPanelPx;
          const adjustedSpec={...spec,viewport:{...spec.viewport,panel:requiredPanelPx}},adjustedSpecSha256=objectSha(adjustedSpec);
          const adjusted=await worker({action:'prepare',spec:adjustedSpec}),adjustedLabelInventory=adjusted.labels.map(label=>({id:label.id,kind:label.kind,target:label.target??null,text:label.text,sourceMath:label.sourceMath??null}));
          spec=adjustedSpec;
          const sourcePlanAfterSha256=objectSha(plan),sourceConditionsAfterSha256=objectSha(plan.sourceConditions||[]),graphPlanAfterSha256=objectSha(materialPlan.graphPlan);
          const sourceFactAfterSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],graphPlan:materialPlan.graphPlan});
          const adjustedLabelInventorySha256=objectSha(adjustedLabelInventory);
          const sourceConditionParity=sourceConditionsSha256===sourceConditionsAfterSha256;
          const sourceFactParity=sourceFactSha256===sourceFactAfterSha256&&graphPlanSha256===graphPlanAfterSha256;
          const semanticPlanParity=sourcePlanSha256===sourcePlanAfterSha256;
          const labelInventoryParity=canonicalJson(priorLabelInventory)===canonicalJson(adjustedLabelInventory);
          if(!sourceConditionParity||!sourceFactParity||!semanticPlanParity||!labelInventoryParity)throw Error('GRAPH_PANEL_COMPOSITION_SEMANTIC_PARITY_FAIL');
          const repairOutput={schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_OUTPUT_v3',repairInputSha256,sourcePlanSha256:sourcePlanAfterSha256,sourceConditionsSha256:sourceConditionsAfterSha256,sourceFactSha256:sourceFactAfterSha256,graphPlanSha256:graphPlanAfterSha256,baseSpecSha256,adjustedSpecSha256,labelInventorySha256:adjustedLabelInventorySha256,formulaLabelId:formulaId,formulaFragmentSha256:fragments[formulaId].fragmentSha256,formulaText:adjusted.labels.find(label=>label.id===formulaId)?.text,measuredFormulaWidthPx:measuredFormula[0],panelPaddingPx,priorPanelPx,selectedPanelPx};
          const repairOutputSha256=objectSha(repairOutput),repairAction=repairBudget.record('LAYOUT',repairInputSha256,'MEASURED_GRAPH_FORMULA_PANEL_OVERFLOW',repairOutputSha256);
          const priorCompositionCurrentSchema=['MEASURED_GRAPH_FORMULA_PANEL_v2','MEASURED_GRAPH_FORMULA_PANEL_v3'].includes(priorLayoutComposition?.schemaVersion);
          const samePriorRepairInput=priorCompositionCurrentSchema&&priorLayoutComposition.repairInputSha256===repairInputSha256;
          if(samePriorRepairInput&&(priorLayoutComposition.repairOutputSha256!==repairOutputSha256||priorLayoutComposition.selectedPanelPx!==selectedPanelPx))throw Error('LAYOUT_REPAIR_REPLAY_MISMATCH');
          if(priorCompositionCurrentSchema&&!samePriorRepairInput&&repairAction.replayed)throw Error('LAYOUT_REPAIR_REPLAY_MISMATCH');
          const repairReplayRelation=!priorCompositionCurrentSchema?'FIRST_BUDGETED_REPAIR':samePriorRepairInput?'EXACT_REPLAY':'NEW_INPUT_DISTINCT_BUDGET';
          prepared=adjusted;
          stages.push(freeze('PROFILE_COMPOSITION',{schemaVersion:'MEASURED_GRAPH_FORMULA_PANEL_v3',status:'PASS',compositionOnly:true,sourceRef,solutionRef,sourcePlanSha256,sourceConditionsSha256,sourceFactSha256,graphPlanSha256,baseSpecSha256,adjustedSpecSha256,labelInventoryBeforeSha256:priorLabelInventorySha256,labelInventoryAfterSha256:adjustedLabelInventorySha256,sourceConditionParity,sourceFactParity,semanticPlanParity,labelInventoryParity,requestedSizeClass,typographyPolicy,formulaLabelId:formulaId,fragmentRef:fragments[formulaId].fragmentSha256,measurementRef:measurementReceipt.outputs[0],formulaTextWidthPx:measuredFormula[0],panelPaddingPx,priorPanelPx,selectedPanelPx,repairInput,repairInputSha256,repairOutput,repairOutputSha256,repairIteration:repairAction.row.iteration,repairReplayed:repairAction.replayed,repairResumed:repairAction.resumed,repairReplayRelation,previousRepairInputSha256:priorLayoutComposition?.repairInputSha256??null,displayEnvelopeInputIdentitySha256:displayEnvelopePlan.inputIdentitySha256},provenance));
          finalCompositionBinding={repairInputSha256,repairOutputSha256};
          stages.push(freeze('NORMALIZE_FINAL',spec,{...provenance,compositionStage:'PROFILE_COMPOSITION',displayEnvelopeInputIdentitySha256:displayEnvelopePlan.inputIdentitySha256}));
        }
      }
    }
    const built=await worker({action:'build',spec,measurements,fragments});
    const layoutRepairBindings=[];
    const ownerPointMarkers=prepared.prepared.primitives.filter(value=>value.role==='point').map(value=>({id:value.id,geometry:[...value.at,value.radius]}));
    for(const repair of built.witness.layout.repairs||[]){
      const label=prepared.labels.find(value=>value.id===repair.labelId),fragment=fragments[repair.labelId],measurement=measurements[repair.labelId];
      if(!label||label.kind!==repair.labelKind||label.target!==repair.ownerId||!fragment||fragment.fragmentSha256!==repair.measuredFragmentSha256||!measurement||measurement.length!==2||measurement[0]!==repair.measuredBox.width||measurement[1]!==repair.measuredBox.height)throw Error('MEASURED_OWNER_LAYOUT_REPAIR_EVIDENCE_MISMATCH');
      const requestedProfile=displayEnvelopePlan.profiles.find(value=>value.sizeClass===requestedSizeClass);
      if(!requestedProfile)throw Error('MEASURED_OWNER_LAYOUT_PROFILE_REQUIRED');
      const sourceConditionsSha256=objectSha(plan.sourceConditions||[]);
      const sourceFactsSha256=objectSha({sourceConditions:plan.sourceConditions||[],newVisualInformation:plan.newVisualInformation||[],mathPlan:plan.mathPlan||null,graphPlan:materialPlan.graphPlan||null});
      const labelInventory=prepared.labels.map(value=>({id:value.id,kind:value.kind,target:value.target??null,text:value.text,sourceMath:value.sourceMath??null,factRole:spec.displayFacts.factRolesByLabel?.[value.id]??null}));
      const binding=bindMeasuredOwnerSafeLabelRepair({identity,sourceRef,solutionRef,planSha256:frozen.planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256:objectSha(labelInventory),baseMathSvgSha256:bytesSha(Buffer.from(model.svg)),measurementRef:measurementReceipt.outputs[0],policyRefsSha256:objectSha(displayEnvelopePlan.policyRefs),profilePolicySha256:requestedProfile.profilePolicySha256,requestedSizeClass,repair,candidateSvgBytes:Buffer.from(built.svg),expectedLabel:label,pointMarkers:ownerPointMarkers,measurement,fragment});
      const action=repairBudget.record('LAYOUT',binding.repairInputSha256,'MEASURED_OWNER_SAFE_LABEL_RELOCATION',binding.repairOutputSha256);
      const repairReceipt=freeze('LAYOUT_REPAIR',{schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_STAGE_v1',status:'PASS',sourceRef,solutionRef,planSha256:frozen.planSha256,sourceConditionsSha256,sourceFactsSha256,labelInventorySha256:objectSha(labelInventory),repairInput:binding.repairInput,repairInputSha256:binding.repairInputSha256,repairOutput:binding.repairOutput,repairOutputSha256:binding.repairOutputSha256,repairIteration:action.row.iteration,repairReplayed:action.replayed,repairResumed:action.resumed,repairReplayRelation:action.replayed?'EXACT_REPLAY':action.resumed?'RESUMED':'NEW_INPUT_DISTINCT_BUDGET',candidateSvgSha256:binding.candidateSvgSha256,selectedSizeClass:requestedSizeClass,profilePolicySha256:requestedProfile.profilePolicySha256,policyRefs:displayEnvelopePlan.policyRefs},provenance);
      stages.push(repairReceipt);layoutRepairBindings.push({binding,repairReceiptRef:repairReceipt.outputs[0]});
    }
    if(built.witness.layout.unresolved.length||built.witness.layout.suppressed.length)throw Error('LAYOUT_INVENTORY_INCOMPLETE:'+JSON.stringify(built.witness.layout));
    const solutionImageName=`q${String(ordinal).padStart(2,'0')}-solution.svg`;
    const archiveAssetRef=`assets/images/${workspace.examUid}/${solutionImageName}`;
    const builtReceipt=receipt('BUILD',{[solutionImageName]:built.svg,'witness.json':canonicalJson(built.witness)},provenance);stages.push(builtReceipt);const asset=builtReceipt.outputs.find(r=>r.path.endsWith('/'+solutionImageName));
    const measuredOwnerLayoutRepairAudits=[];
    if(layoutRepairBindings.length){
      let repairAuditBrowser;
      try{
        repairAuditBrowser=await dependency('playwright').chromium.launch({channel:'chrome',headless:true});
        const repairAuditPage=await repairAuditBrowser.newPage();
        for(const item of layoutRepairBindings){
          try{
            const audit=await auditMeasuredOwnerSafeLabelRepair({binding:item.binding,candidateSvgBytes:Buffer.from(built.svg),pointMarkers:ownerPointMarkers,page:repairAuditPage});
            if(audit.candidateSvgSha256!==asset.sha256)throw Error('LAYOUT_REPAIR_AUDIT_BUILD_ASSET_SHA_MISMATCH');
            measuredOwnerLayoutRepairAudits.push({...audit,candidateSvgRef:asset,repairReceiptRef:item.repairReceiptRef});
          }catch(error){measuredOwnerLayoutRepairAudits.push({schemaVersion:'MEASURED_OWNER_SAFE_LAYOUT_REPAIR_AUDIT_v1',status:'FAIL',candidateSvgRef:asset,repairReceiptRef:item.repairReceiptRef,error:error.message});}
        }
      }finally{if(repairAuditBrowser)await repairAuditBrowser.close();}
    }
    const displayedGeometry=plan.mathPlan?displayGeometryInventory(plan,model):null;
    const displayedCircles=displayedGeometry?.circles??null;
    const peerPoints=displayedGeometry?Object.fromEntries(Object.keys(displayedGeometry.points).map(id=>[id,reconstruction.peer.points[id]])):null;
    const peerLines=displayedGeometry?Object.fromEntries(Object.keys(displayedGeometry.lines).map(id=>[id,reconstruction.peer.lines[id]])):null;
    const peerCircles=displayedGeometry?Object.fromEntries(Object.keys(displayedGeometry.circles).map(id=>[id,reconstruction.peer.circles[id]])):null;
    const staticAudit=await workerPrimitiveAudit({svg:built.svg,points:peerPoints,lines:peerLines,circles:peerCircles,segments:plan.displaySegments||[],rightAngles:plan.rightAngles||[],transform:built.witness.coordinateModel,fragments,coordinateMode:model.coordinateMode??'FUNCTION_GRAPH',unmarkedPoints:unmarkedPointIds(plan)});
    staticAudit.measuredOwnerLayoutRepairAudits=measuredOwnerLayoutRepairAudits;
    if(measuredOwnerLayoutRepairAudits.some(value=>value.status!=='PASS')){staticAudit.status='FAIL';staticAudit.errors=[...(staticAudit.errors||[]),'MEASURED_OWNER_LAYOUT_REPAIR_AUDIT_FAIL'];}
    if(plan.graphPlan){
      staticAudit.graph=await workerGraphAudit(materialPlan.graphPlan,built.svg,{...built.witness.coordinateModel,displayScale:1});
      staticAudit.graphCompositionBinding={phase:'POST_COMPOSITION_BUILD',candidateSvgRef:asset,candidateSvgSha256:asset.sha256,graphPlanSha256:objectSha(materialPlan.graphPlan),...(finalCompositionBinding||{})};
    }
    stages.push(freeze('STATIC_AUDIT',staticAudit,provenance));if(staticAudit.status!=='PASS'||staticAudit.graph&&staticAudit.graph.status!=='PASS')throw Error('STATIC_AUDIT_FAIL:'+JSON.stringify(staticAudit.errors));
    const expectedPrimitiveIds=[...Object.keys(peerPoints||{}),...Object.keys(peerLines||{}),...Object.keys(displayedCircles||{}),...(plan.displaySegments||[]).map(value=>value.id),...(plan.rightAngles||[]).map(value=>value.id)];
    const profileAudit=await auditCandidateProfiles({svg:built.svg,plan:displayEnvelopePlan,candidateSvgRef:asset,sourceRef,solutionRef,policyRefs:displayEnvelopePlan.policyRefs,identity,provenance,graphPlan:materialPlan.graphPlan??null,geometryStaticAudit:staticAudit,coordinateModel:built.witness.coordinateModel,expectedPrimitiveIds});
    stages.push(...profileAudit.stageReceipts);
    const finalDisplayEnvelope=profileAudit.envelope;
    if(finalDisplayEnvelope.status!=='PASS')throw Error('UNSUPPORTED_DISPLAY_ENVELOPE:'+canonicalJson({sizeClassStatus:finalDisplayEnvelope.status,profiles:finalDisplayEnvelope.profiles.map(value=>({sizeClass:value.sizeClass,status:value.supportStatus,errors:value.finalAudit.errors}))}));
    console.log(JSON.stringify({stage:'ACTUAL_ARCHIVE',uid}));
    const patch={solutionImage:archiveAssetRef,solutionImageSize:finalDisplayEnvelope.sizeClass,solutionImageAlt:plan.caption};
    const candidate=raw+'\n;Object.assign(window.questionBank.find(q=>q.id==='+ordinal+'),'+JSON.stringify(patch)+');\n';
    const patched=JSON.parse(JSON.stringify(loadBank(candidate))),original=JSON.parse(JSON.stringify(bank));
    const touched=['solutionImage','solutionImageSize','solutionImageAlt'];
    for(let i=0;i<original.length;i++){const before={...original[i]},after={...patched[i]};if(before.id===ordinal)for(const field of touched){delete before[field];delete after[field];}if(canonicalJson(before)!==canonicalJson(after))throw Error('ARCHIVE_PROTECTED_FIELD_MUTATION');}
    const protectedParity={status:'PASS',sourceRef,originalQuestionSha256:objectSha(question),questionCount:bank.length,protectedFields:['content','choices','answer','solution','image'],changedFields:touched,targetOrdinal:ordinal};
    const examFileName=workspace.examUid+'.js';
    const candidateReceipt=receipt('ARCHIVE_BANK',{[examFileName]:candidate,'protected-parity.json':canonicalJson(protectedParity)},provenance);const candidateRef=candidateReceipt.outputs.find(o=>o.path.endsWith('/'+examFileName));stages.push(candidateReceipt);
    // Existing collector uses bare RAW-file hex, not the Python object hash.
    // This explicit adapter preserves that legacy meaning and keeps new refs intact.
    const rawHex=ref=>ref.sha256.slice(7);
    const bankInfo={id:identity.assetId,sourcePath,sourceSha256:rawHex(sourceRef),candidatePath:candidateRef.path,candidateSha256:rawHex(candidateRef),questionCount:bank.length,assets:[{id:identity.assetId,path:asset.path,archivePath:archiveAssetRef,sha256:rawHex(asset),questionId:ordinal}]};
    const matrix={synthetic:false,legacyHashAlgorithm:'SHA256_RAW_HEX_v1',engineSha256:rawHex(fileRef(root,'archive/engine.html')),sources:[{...bankInfo,assets:[{...bankInfo.assets[0],sizeClass:finalDisplayEnvelope.sizeClass}]}],rows:[{...bankInfo,assets:[{...bankInfo.assets[0],sizeClass:finalDisplayEnvelope.sizeClass}],mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:true,urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))}]};
    fs.writeFileSync(path.join(folder,'archive-render-matrix.json'),canonicalJson(matrix));
    process.env.GEOMETRY_NODE_MODULES ||= path.join(dependencyRoot,'node_modules');
    const archive=await recordArchiveEvidence({run:folder,signal,onProgress:onArchiveProgress,blockExternalRequests:true});
    const captureFolder=path.join(folder,'archive-render/attempt-01'),captureOutputs={};
    for(const name of fs.readdirSync(captureFolder))captureOutputs[name]=fs.readFileSync(path.join(captureFolder,name));
    const captureReceipt=receipt('CAPTURE',captureOutputs,provenance);stages.push(captureReceipt);
    const actualRowName=fs.readdirSync(captureFolder).find(name=>name===identity.assetId+'-sol-desktop.json');
    const actualScreenshotName=fs.readdirSync(captureFolder).find(name=>name.endsWith('-'+identity.assetId+'.png'));
    if(!actualRowName)throw Error('ACTUAL_DISPLAY_RAW_ARCHIVE_ROW_REQUIRED');
    const actualRowRef=captureReceipt.outputs.find(ref=>ref.path.endsWith('/'+actualRowName));
    const actualScreenshotRef=actualScreenshotName?captureReceipt.outputs.find(ref=>ref.path.endsWith('/'+actualScreenshotName)):null;
    const actualRow=JSON.parse(readBoundFile(root,actualRowRef).toString('utf8'));
    const actualTarget=actualRow.state?.targets?.find(target=>target.id===identity.assetId)||null;
    const actualScreenshotBytes=actualScreenshotRef?readBoundFile(root,actualScreenshotRef):null;
    const actualRecord={schemaVersion:'DISPLAY_ARCHIVE_ACTUAL_v1',status:archive.status==='PASS'&&actualRow.status==='PASS'?'PASS':'FAIL',synthetic:actualRow.synthetic,runtime:actualRow.runtime,browserVersion:actualRow.browserVersion,questionUid:uid,sizeClass:finalDisplayEnvelope.sizeClass,candidateSvgRef:asset,candidateSvgSha256:asset.sha256,naturalWidth:actualTarget?.naturalWidth??null,naturalHeight:actualTarget?.naturalHeight??null,sourceRef,solutionRef,policyRefs:displayEnvelopePlan.policyRefs,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256,screenshotRef:actualScreenshotRef,screenshotViewport:actualScreenshotBytes?pngSize(actualScreenshotBytes):null,archiveRowRef:actualRowRef,archiveAssetPath:archiveAssetRef,targetId:identity.assetId,qBoxRect:actualTarget?.qBoxRect??null,solutionMetaRect:actualTarget?.solutionMetaRect??null,solutionMetaContentWidth:actualTarget?.solutionMetaContentWidth??null,imageRect:actualTarget?.rect??null,computedStyle:actualTarget?.computedStyle??null,minimumCssFontPx:finalDisplayEnvelope.expectedMinimumCssFontPx};
    const actualReceipt=receipt('DISPLAY_ENVELOPE_ACTUAL',{'actual-archive.json':canonicalJson(actualRecord)},{...provenance,identity,candidateSvgRef:asset,displayEnvelopePlanSha256:objectSha(displayEnvelopePlan),inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(actualReceipt);
    const actualComparison=compareActualDisplayEnvelope(finalDisplayEnvelope,{root,actualRef:actualReceipt.outputs[0]});
    const displayFinalReceipt=freeze('DISPLAY_ENVELOPE_FINAL',{schemaVersion:'DISPLAY_ENVELOPE_FINAL_v1',status:actualComparison.status,selectedSizeClass:finalDisplayEnvelope.sizeClass,policyChange:finalDisplayEnvelope.policyChange,candidateSvgRef:asset,actualRef:actualReceipt.outputs[0],archiveRowRef:actualRowRef,screenshotRef:actualScreenshotRef,comparison:actualComparison},{...provenance,identity,candidateSvgRef:asset,inputIdentitySha256:displayEnvelopePlan.inputIdentitySha256});stages.push(displayFinalReceipt);
    if(archive.status!=='PASS')throw Error('ACTUAL_ARCHIVE_FAIL:'+JSON.stringify(archive.rows));
    if(actualComparison.status!=='PASS')throw Error('ACTUAL_DISPLAY_ENVELOPE_MISMATCH:'+canonicalJson(actualComparison.errors));
    if(plan.graphPlan){
      const rowFile=fs.readdirSync(captureFolder).find(n=>n.endsWith('desktop.json'));
      const row=JSON.parse(fs.readFileSync(path.join(captureFolder,rowFile),'utf8'));const rect=row.state.targets[0].rect;
      const observedScale=Math.min(rect.width/spec.viewport.width,rect.height/spec.viewport.height);
      const displayAudit=await workerGraphAudit(materialPlan.graphPlan,built.svg,{...built.witness.coordinateModel,displayScale:observedScale});
      stages.push(freeze('DISPLAY_GRAPH_REVIEW',displayAudit,provenance));if(displayAudit.status!=='PASS')throw Error('ACTUAL_DISPLAY_GRAPH_BOUND_FAIL');
    }
    const screenshotName=fs.readdirSync(captureFolder).find(n=>n.endsWith('-'+identity.assetId+'.png'));const screenshot=fs.readFileSync(path.join(captureFolder,screenshotName));
    const contextName=fs.readdirSync(captureFolder).find(n=>n.endsWith('-'+identity.assetId+'-context.png'));if(!contextName)throw Error('NATIVE_ARCHIVE_CONTEXT_SCREENSHOT_REQUIRED');
    const contextScreenshot=fs.readFileSync(path.join(captureFolder,contextName));
    console.log(JSON.stringify({stage:'INDEPENDENT_VISUAL_REVIEW',uid}));
    const visualReview=await provider('REVIEW_FINAL_VISUAL',{instruction:'Review the actual frozen Archive solution-image and native solution block screenshots against the supplied original source and verified solution. Check decisive relation, all geometry/curve/axis semantics, source names, owner ambiguity, Korean and math glyph readability, clipping/collision, density, integration with surrounding solution, and black-white meaning. Check the family-specific overview contract in publicationGraphPlan. For rational graphs, verify the pole or open hole, separated branches, exact horizontal asymptote and visible full-domain coverage. For polynomial graphs, verify every required root/extremum/inflection and the required tails. For square-root graphs, verify the exact radicand boundary, closed source endpoint marker, no curve points before the root, and an increasing right branch. For absolute-value graphs, verify the exact corner marker and both one-sided branch directions without a smoothed or crossed corner. A local detail cannot replace the required overview. The actual required mode is sol. Its native reminder deliberately omits answer choices and original problem images; those appear in exam mode and are supplied in the original source packet for this review. Original body/choices/answer/solution/image fields remain byte-equivalent in the candidate bank; do not require exam-mode content to appear in sol-mode screenshots. This is a candidate review, not engine qualification or publication authority. Return PASS only if satisfactory. payload {observations:[string],errors:[]}.',source:sourceOnly,solution:question.solution,archiveMode:'sol',protectedParity,finalSvgSha256:asset.sha256,screenshotSha256:bytesSha(screenshot),nativeContextScreenshotSha256:bytesSha(contextScreenshot),plan:frozen,publicationGraphPlan:materialPlan.graphPlan??null},[...images,'data:image/png;base64,'+screenshot.toString('base64'),'data:image/png;base64,'+contextScreenshot.toString('base64')],folder,true);
    stages.push(freeze('VISUAL_REVIEW',visualReview,provenance));
    if(visualReview.output.status!=='PASS')throw Error('INDEPENDENT_VISUAL_REVIEW_FAIL:'+canonicalJson(visualReview.payload));
    if(!Array.isArray(visualReview.payload.errors)||visualReview.payload.errors.length||!Array.isArray(visualReview.payload.observations)||!visualReview.payload.observations.length)throw Error('INDEPENDENT_VISUAL_REVIEW_FAIL');
    result={status:authority?'PHASE2_SLICE_COMPLETE':'EXPERIMENTAL_LOCATOR_COMPLETE',identityStatus:authority?'CANONICAL_CURRENT':'EXPERIMENTAL_LOCATOR',sourceRegistryRef,workRoot:workspace.workRoot,runId:workspace.runId,examUid:workspace.examUid,productionAuthorized:false,qualificationStatus:'NOT_QUALIFIED',identity,sourceRef,solutionRef,planRef:planReceipt.outputs[0],fingerprint,finalSvgRef:asset,displayEnvelopePlanRef:displayEnvelopeReceipt.outputs[0],displayEnvelopeAuditRef:profileAudit.stageReceipts.at(-1).outputs[0],displayEnvelopeFinalRef:displayFinalReceipt.outputs[0],selectedSizeClass:finalDisplayEnvelope.sizeClass,displayPolicyChange:finalDisplayEnvelope.policyChange,actualArchive:archive,independentVisualReviewRef:stages.at(-1).outputs[0],stages:stages.map(s=>s.manifestRef)};
  }catch(error){result={status:error.message.startsWith('UNSUPPORTED_CINDY_')?'UNSUPPORTED_NUMERIC_SCOPE':error.message.startsWith('UNSUPPORTED_DISPLAY_ENVELOPE:')?'UNSUPPORTED_DISPLAY_ENVELOPE':'UNRESOLVED',productionAuthorized:false,identity,sourceRef,error:error.message,errorCode:error.code||null,archiveAbortEvidenceRef:error.abortEvidenceRef||null,archiveCleanup:error.cleanup||null,providerProcessCleanup:error.providerProcessCleanup||null,providerRemoteCancellation:error.providerRemoteCancellation||null,providerPurpose:error.providerPurpose||null,providerParserErrorName:error.providerParserErrorName||null,providerParserErrorCode:error.providerParserErrorCode||null,providerPayloadSha256:error.providerPayloadSha256||null,providerRawOutputSha256:error.providerRawOutputSha256||null,providerInvocationId:error.providerInvocationId||null,providerContextId:error.providerContextId||null,providerTerminalStatus:error.providerTerminalStatus||null,stages:stages.map(s=>s.manifestRef)};}
  result.repairLedger=repairBudget.ledger;
  Object.assign(result,{schemaVersion:'VISUAL_RESULT_v1',phase:2,engineStatus:'EXPERIMENTAL',workRoot:workspace.workRoot,runId:workspace.runId,examUid:workspace.examUid});
  const final=freeze('RESULT',result,provenance);console.log(JSON.stringify({uid,status:result.status,error:result.error,resultRef:final.outputs[0]}));return {result,receipt:final};
}
// The numeric value of a plan's exact value text: integers, a/b, sqrt(...), + - * / and parentheses only (for example "-3/2", "4-2*sqrt(3)").
// A small recursive-descent parser, never eval; anything else is EXACT_VALUE_INVALID.
export function exactValue(text){
  const bad=()=>{throw Error('EXACT_VALUE_INVALID');};
  if(typeof text!=='string'||!text||text.length>64||!/^[0-9+\-*/()sqrt ]+$/.test(text))bad();
  const tokens=text.replace(/\s+/g,'').match(/sqrt|\d+|[+\-*/()]/g)||[];if(tokens.join('')!==text.replace(/\s+/g,''))bad();
  let i=0;const peek=()=>tokens[i],take=()=>tokens[i++];
  const factor=()=>{const t=take();if(t==='-')return -factor();if(t==='+')return factor();if(t==='sqrt'){if(take()!=='(')bad();const v=expr();if(take()!==')'||v<0)bad();return Math.sqrt(v);}if(t==='('){const v=expr();if(take()!==')')bad();return v;}if(/^\d+$/.test(t??''))return Number(t);return bad();};
  const term=()=>{let v=factor();while(peek()==='*'||peek()==='/'){const op=take(),w=factor();if(op==='/'&&w===0)bad();v=op==='*'?v*w:v/w;}return v;};
  const expr=()=>{let v=term();while(peek()==='+'||peek()==='-'){const op=take(),w=term();v=op==='+'?v+w:v-w;}return v;};
  const value=expr();if(i!==tokens.length||!Number.isFinite(value))bad();return value;
}
// One wrapping pair of parentheses around the whole expression is dropped ((4/3) -> 4/3); parentheses that are part of it stay (-(sqrt(2))).
// Exact rational [numerator,denominator] (BigInt) of an integer/rational typed scalar; anything else cannot be written as a line equation here.
function exactRational(v){
  if(v?.kind==='integer')return [BigInt(v.value),1n];
  if(v?.kind==='rational')return [BigInt(v.numerator),BigInt(v.denominator)];
  throw Error('LINE_LABEL_COEFFICIENT_NOT_RATIONAL');
}
const gcdBig=(x,y)=>{x=x<0n?-x:x;y=y<0n?-y:y;while(y){[x,y]=[y,x%y];}return x;};
const ratText=([n,d])=>{const g=gcdBig(n,d)||1n;n/=g;d/=g;if(d<0n){n=-n;d=-d;}return d===1n?String(n):n+'/'+d;};
// Exact p+q*sqrt(r) of a line coefficient (p, q rational [n,d] BigInt pairs, r a squarefree BigInt above 1, or q=0 and r=0n). Integers, rationals,
// sqrt(), neg, add, sub, mul and div by a rational are closed on it; two different radicals in one coefficient are LINE_LABEL_COEFFICIENT_NOT_RATIONAL.
export function exactSurd(v){
  const bad=()=>{throw Error('LINE_LABEL_COEFFICIENT_NOT_RATIONAL');};
  const Q0=[0n,1n],norm=([n,d])=>{if(d===0n)bad();if(d<0n){n=-n;d=-d;}const g=gcdBig(n,d)||1n;return [n/g,d/g];};
  const qadd=(a,b)=>norm([a[0]*b[1]+b[0]*a[1],a[1]*b[1]]),qmul=(a,b)=>norm([a[0]*b[0],a[1]*b[1]]),qneg=a=>[-a[0],a[1]],qinv=a=>a[0]===0n?bad():norm([a[1],a[0]]);
  const make=(p,q,r)=>q[0]===0n?{p:norm(p),q:Q0,r:0n}:{p:norm(p),q:norm(q),r};
  const isRat=a=>a.q[0]===0n;
  const sqrtOf=a=>{
    if(!isRat(a)||a.p[0]<0n)bad();
    let inner=a.p[0]*a.p[1],outer=1n;
    for(let f=2n;f*f<=inner;f++)while(inner%(f*f)===0n){inner/=f*f;outer*=f;}
    return inner===1n?make([outer,a.p[1]],Q0,0n):make(Q0,[outer,a.p[1]],inner);
  };
  const radical=(a,b)=>isRat(a)?b.r:isRat(b)?a.r:a.r===b.r?a.r:bad();
  const ev=t=>{
    if(t?.kind==='integer'||t?.kind==='rational')return make(exactRational(t),Q0,0n);
    if(t?.kind!=='expression'||!Array.isArray(t.args))bad();
    const a=t.args.map(ev);
    switch(t.op){
      case 'sqrt':return a.length===1?sqrtOf(a[0]):bad();
      case 'neg':return a.length===1?make(qneg(a[0].p),qneg(a[0].q),a[0].r):bad();
      case 'add':case 'sub':{if(a.length!==2)bad();const r=radical(a[0],a[1]),sg=t.op==='add'?1:-1;const q=qadd(a[0].q,sg===1?a[1].q:qneg(a[1].q));return make(qadd(a[0].p,sg===1?a[1].p:qneg(a[1].p)),q,q[0]===0n?0n:r);}
      case 'mul':{if(a.length!==2)bad();const [x,y]=a;if(isRat(x)||isRat(y)||x.r===y.r){const r=radical(x,y);const p=qadd(qmul(x.p,y.p),isRat(x)||isRat(y)?Q0:qmul(qmul(x.q,y.q),[r,1n]));const q=qadd(qmul(x.p,y.q),qmul(y.p,x.q));return make(p,q,q[0]===0n?0n:r);}return bad();}
      case 'div':{if(a.length!==2||!isRat(a[1]))bad();const inv=qinv(a[1].p);return make(qmul(a[0].p,inv),qmul(a[0].q,inv),a[0].r);}
      default:return bad();
    }
  };
  return ev(v);
}
const surdIsRational=s=>s.q[0]===0n;
const surdQ=(a,b)=>{const inv=b.p;if(!surdIsRational(b)||inv[0]===0n)throw Error('LINE_LABEL_COEFFICIENT_NOT_RATIONAL');const i=[inv[1],inv[0]],m=(x,y)=>{let n=x[0]*y[0],d=x[1]*y[1];const g=gcdBig(n,d)||1n;n/=g;d/=g;if(d<0n){n=-n;d=-d;}return [n,d];};return {p:m(a.p,i),q:m(a.q,i),r:a.r};};
const surdNeg=a=>({p:[-a.p[0],a.p[1]],q:[-a.q[0],a.q[1]],r:a.r});
// exact value text of p+q*sqrt(r) in the grammar of the plan strings: "6", "sqrt(3)", "-3+2*sqrt(3)", "3/2-sqrt(3)", "2*sqrt(3)/3"
function surdText(s){
  let out='';
  if(s.p[0]!==0n)out+=ratText(s.p);
  if(s.q[0]!==0n){const [n,d]=s.q,a=n<0n?-n:n;out+=(n<0n?'-':out?'+':'')+(a===1n?'':a+'*')+'sqrt('+s.r+')'+(d===1n?'':'/'+d);}
  return out||'0';
}
export function lineEquationText(ca,cb,cc,form){
  const sa=ca.p?ca:{p:ca,q:[0n,1n],r:0n},sb=cb.p?cb:{p:cb,q:[0n,1n],r:0n},sc=cc.p?cc:{p:cc,q:[0n,1n],r:0n};
  if([sa,sb,sc].some(x=>!surdIsRational(x)))return surdLineEquationText(sa,sb,sc,form);
  ca=sa.p;cb=sb.p;cc=sc.p;
  const term=([n,d],sym)=>{const g=gcdBig(n,d)||1n;let p=n/g,q=d/g;if(q<0n){p=-p;q=-q;}if(p===0n)return '';const neg=p<0n,abs=neg?-p:p,body=q===1n?(abs===1n?sym:abs+'*'+sym):abs+'/'+q+'*'+sym;return (neg?'-':'+')+body;};
  const join=parts=>{const s=parts.join('');return s.startsWith('+')?s.slice(1):s;};
  if(form==='GENERAL'){
    const constant=(()=>{const g=gcdBig(cc[0],cc[1])||1n;let p=cc[0]/g,q=cc[1]/g;if(q<0n){p=-p;q=-q;}return p===0n?'':(p<0n?'-':'+')+ratText([p<0n?-p:p,q]);})();
    return join([term(ca,'x'),term(cb,'y'),constant])+'=0';
  }
  if(cb[0]===0n)throw Error('LINE_LABEL_SLOPE_FORM_NEEDS_NONVERTICAL_LINE');
  const slope=[-ca[0]*cb[1],ca[1]*cb[0]],icept=[-cc[0]*cb[1],cc[1]*cb[0]];
  const constant=(()=>{const g=gcdBig(icept[0],icept[1])||1n;let p=icept[0]/g,q=icept[1]/g;if(q<0n){p=-p;q=-q;}return p===0n?'':(p<0n?'-':'+')+ratText([p<0n?-p:p,q]);})();
  return 'y='+(join([term(slope,'x'),constant])||'0');
}
// A line equation whose coefficients are p+q*sqrt(r): an irrational part is written in parentheses ((sqrt(3))*x, +(2-sqrt(3))) like the label of a slanted
// reference line of a piecewise graph. SLOPE_INTERCEPT needs a rational y coefficient (slope and intercept are then exact surds).
function surdLineEquationText(sa,sb,sc,form){
  const par=s=>surdIsRational(s)?ratText(s.p):'('+surdText(s)+')';
  const termOf=(s,sym)=>{
    if(surdIsRational(s)){const [n,d]=s.p;if(n===0n)return '';const neg=n<0n,a=neg?-n:n;return (neg?'-':'+')+(d===1n?(a===1n?sym:a+'*'+sym):a+'/'+d+'*'+sym);}
    return '+'+par(s)+'*'+sym;
  };
  const join=parts=>{const t=parts.join('');return t.startsWith('+')?t.slice(1):t;};
  const constOf=s=>{if(surdIsRational(s)){const [n,d]=s.p;if(n===0n)return '';return (n<0n?'-':'+')+ratText([n<0n?-n:n,d]);}return '+('+surdText(s)+')';};
  if(form==='GENERAL')return join([termOf(sa,'x'),termOf(sb,'y'),constOf(sc)])+'=0';
  if(!surdIsRational(sb))throw Error('LINE_LABEL_COEFFICIENT_NOT_RATIONAL');
  if(sb.p[0]===0n)throw Error('LINE_LABEL_SLOPE_FORM_NEEDS_NONVERTICAL_LINE');
  const slope=surdQ(surdNeg(sa),sb),icept=surdQ(surdNeg(sc),sb);
  const pureSurd=!surdIsRational(slope)&&slope.p[0]===0n&&slope.q[1]===1n,slopeText=surdIsRational(slope)?termOf(slope,'x'):pureSurd?surdText(slope).replace(/^(?!-)/,'+')+'x':'+'+par(slope)+'*x';
  return 'y='+(join([slopeText,constOf(icept)])||'0');
}
// lineAt / labelAt of a line label (E31): START, END or a fraction 0..1 of the drawn line counted from its left (lower) end.
// A free equation text on a displayed SOURCE_LINE (lineLabels[].text, E31): written as given (symbolic letters allowed), and when it can be read exactly (every letter other than
// x and y has a value in `values`) it must be the line itself; an irrational line is not compared.
function freeLineTextOk(label,coefficients){
  const id=label.nodeId;
  let equation;
  try{equation=readEquation(label.text,label.values);}
  catch(error){const code=String(error.message);throw Error((code==='LINE_TEXT_NOT_LINEAR'?'LINE_LABEL_TEXT_NOT_LINEAR':code==='LINE_TEXT_VALUES_INVALID'?'LINE_LABEL_TEXT_VALUES_INVALID':'LINE_LABEL_TEXT_INVALID')+':'+id);}
  if(equation===null){
    if(label.values&&Object.keys(label.values).every(letter=>!label.text.includes(letter)))throw Error('LINE_LABEL_TEXT_VALUES_UNUSED:'+id);
    return;
  }
  if(!coefficients.every(v=>v.q[0]===0n))return;
  const line={a:frac(coefficients[0].p[0],coefficients[0].p[1]),b:frac(coefficients[1].p[0],coefficients[1].p[1]),c:frac(coefficients[2].p[0],coefficients[2].p[1])};
  if(!sameLine(equation,line))throw Error('LINE_LABEL_TEXT_NOT_THE_LINE:'+id);
}
export const lineAtValid=value=>value==='START'||value==='END'||(typeof value==='number'&&Number.isFinite(value)&&value>=0&&value<=1);
function unwrapParentheses(text){
  if(!text.startsWith('(')||!text.endsWith(')'))return text;
  let depth=0;for(let i=0;i<text.length;i++){if(text[i]==='(')depth++;else if(text[i]===')'&&--depth===0&&i<text.length-1)return text;}
  return text.slice(1,-1);
}
function scalarExpression(v){
  if(v.kind==='integer')return v.value;if(v.kind==='rational')return '('+v.numerator+'/'+v.denominator+')';
  if(v.kind==='constant')return v.name;
  if(v.kind==='expression'){const a=v.args.map(scalarExpression);if(v.op==='sqrt')return 'sqrt('+a[0]+')';if(v.op==='neg')return '-('+a[0]+')';const ops={add:'+',sub:'-',mul:'*',div:'/',pow:'^'};if(ops[v.op])return '('+a.join(ops[v.op])+')';}
  throw Error('UNSUPPORTED_SCALAR_NOTATION');
}
async function workerGraphAudit(graphPlan,svg,transform){const {aspectPolicy,...frame}=transform;return (await pythonWorker({graphPlan,svg,transform:frame},{script:fileURLToPath(new URL('graph-observer-worker.py',import.meta.url))})).result;}
async function workerPrimitiveAudit(payload){return (await pythonWorker(payload,{script:fileURLToPath(new URL('primitive-observer-worker.py',import.meta.url))})).result;}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const index=process.argv.indexOf('--source'),ordinal=Number(process.argv[process.argv.indexOf('--ordinal')+1]);
  const resume=process.argv.indexOf('--resume');const output=await runPhase2({sourcePath:process.argv[index+1],ordinal,replayResultRef:resume>=0?fileRef(root,process.argv[resume+1]):null,experimentalLocator:process.argv.includes('--experimental-locator')});if(output.result.status!=='PHASE2_SLICE_COMPLETE')process.exitCode=1;
}
