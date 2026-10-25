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
import {planeMarkSpec,planeMarkPointRefs,isPlaneFigure} from './plane-marks.mjs';
import {regionExtentPoints} from './plane-regions.mjs';

const GRAPH_OVERVIEW_CANVAS=Object.freeze({width:610,height:420,panel:140});
const QUADRATIC_OVERVIEW_CANVAS=Object.freeze({width:384,height:320,panel:140});
const QUADRATIC_HEADER_CANVAS=Object.freeze({width:512,height:400,panel:0,topInset:80});
// A panel of a three-panel composite: its formula and shared line rows sit outside the panel (composite-candidate-svg-v1), so no formula header.
const COMPOSITE_PANEL_CANVAS=Object.freeze({width:512,height:286,panel:0,topInset:0});
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
const compilerContract=`Return payload as a JSON object. For geometry: {capability:'construction-spike-v1',mathPlan:{schemaVersion:'construction-spike-v1',nodes:[...]},displaySegments:[{id,refs:[pointId,pointId]}],coordinateLabels:[pointId],caption:string}. Each node has id (ASCII alphanumeric starts letter), op, inputs, args, outputType, factRole GIVEN/DERIVED_INTERMEDIATE/CONCLUSION. Supported ops SOURCE_POINT (args coordinates=[typedScalar,typedScalar]), NORMALIZATION_ORIGIN(args {}; the coordinate origin, optional in displayPoints: if it is shown, give the node the id O when the stored solution calls it O, because a displayed point is labelled with its node id; otherwise leave it out), NORMALIZATION_AXIS(args length=typedScalar; outputType POINT, the point (length,0) on the x-axis, not a scalar); SOURCE_POINT and NORMALIZATION_* nodes have inputs []. SOURCE_LINE (a line the problem gives only by its equation a x + b y + c = 0: args a,b,c = typedScalar, inputs [], outputType LINE, factRole GIVEN; the origin O, a displayed foot or an intersection point can mark where it is read, and a plan that shows several such lines lists them in displayLines; lineLabels:[{nodeId,form}] writes the equation of such a line beside it, form SLOPE_INTERCEPT (y=mx+n, only for a non-vertical line) or GENERAL (ax+by+c=0), built exactly from its coefficients, so give the form the problem uses), MIDPOINT, LINE_THROUGH, PERPENDICULAR_FOOT, CIRCLE_CENTER_RADIUS(args radius=typedScalar), INTERSECTION (POINT_SET; inputs are [line, circle] in that order, [circle, circle] or [line, line]), SELECT_POINT (a node-level branch field, not inside args: branch:{kind:'SIDE_OF_ORIENTED_LINE',refs:[A,B],sign:1|-1}, sign a number). All other point outputs POINT, lines LINE, circles CIRCLE. Derived points must never have raw coordinates. typedScalar={kind:'integer',value:'decimal integer'} or {kind:'rational',numerator:'...',denominator:'...'} or {kind:'expression',op:'sqrt'|'add'|'sub'|'mul'|'div'|'neg'|'pow',args:[typedScalars]}. For coordinate-free SSS use realization:{recipeId:'SSS_POSITIVE_SIDE_v1',unit:'source-length',reflectionEquivalent:true} inside mathPlan, A origin, B positive x at source AB distance, C selected positive side of two circles. The circles in this realization are construction aids and must not be rendered; render only explicitly listed display segments and source marks. Use source length values, and compute any necessary missing distance exactly from verified solution (e.g sqrt(34)). Explicitly state source bindings for each introduced normalization/label in conditions. For a polynomial source graph only: {capability:'polynomial-spike-v1',graphPlan:{family:'polynomial',coefficients:['constant','x coefficient','x squared coefficient',...],domain:[lo,hi],viewport:[xmin,xmax,ymin,ymax]},caption:string}. Coefficients are exact integer or rational strings; max degree4. Domain/viewports must show the source's decisive structure. Put sourceDomain, requiredPoints and axisTickValues inside graphPlan, never at the top level. Always set graphPlan.axisTickValues to {x:[],y:[]}: every requiredPoint is drawn with its own coordinate label, so never choose tick values for a polynomial graph. When the stored solution substitutes a new variable (for example t=x^2-2x) and draws the graph in that variable, set graphPlan.axisVariable to its single lowercase letter (not y); the horizontal axis and the formula label are then written with it, and coefficients are the powers of that variable. Leave it out for an ordinary graph in x. A quadratic graph may also carry straight lines: graphPlan.lines:[{id,slope,intercept,through:[point IDs],tangentAt:point ID (optional)}] with exact value strings for y=slope*x+intercept (integers, fractions, sqrt(...), + - * / and parentheses, for example "4-2*sqrt(3)"). Points on the curve stay in requiredPoints; points that lie only on a line go to graphPlan.linePoints:[{id,x,y}]. through lists every key point the line passes through, and tangentAt names the requiredPoint where the line touches the curve; both are checked exactly. requiredPoints and linePoints keep numeric x,y; when a point's coordinates are not integers, give their exact values as graphPlan.exactCoordinates:{pointId:["-3/2","9/2"]} (same exact value strings) so the point gets a coordinate label; a point without integer or exact coordinates is drawn as a bare dot. A vertical line, a second curve or a shaded region is not supported. When the solution compares two or three cases or parameter values, each with one quadratic (and its lines), use {capability:'composite-panels-v1',panels:[{caption:{math:'k=-2',text:'일 때'},plan:{capability:'polynomial-spike-v1',graphPlan:{...}}},...],caption,sourceConditions,newVisualInformation}: 2 panels (3 only if the whole stack still fits one page; a stack taller than about 640 CSS px is refused) stacked top to bottom, each panel plan following the quadratic graph contract above, each caption a short math part (plain ASCII such as k=-2 or a=1, no TeX commands) and/or a short Korean text part naming its case. Declare sourceDomain:{kind:'ALL_REALS'} only when the source polynomial has no restriction; otherwise declare {kind:'INTERVAL',range:[lo,hi],states:[start,end]} (a quadratic only; lo and hi are exact numbers or fraction strings; each state is 'CLOSED' for ≤ or 'OPEN' for <, both 'CLOSED' when omitted). The curve is then drawn only on that interval, with a filled dot at a closed end and a hollow dot at an open end; every requiredPoint must lie in the interval and none on an open end.Preserve all source-required points/tangency anchors/intercepts as requiredPoints:[{id:string,x:number,y:number}]; these are independently reviewed source/solution features, never convenient invented points. The main overview must show the vertex and enough of both arms to make the opening and symmetry legible. A local detail cannot replace the overview. Do not guess symbolic coefficients. Reject unsupported source. caption is short student-facing Korean, with no internal/debug terms. Either plan must have sourceConditions:[{id:string,condition:string,mappedTo:string|string[]}]; mappedTo names one or more targets in the plan or PRESERVED_ARCHIVE_BANK. Include newVisualInformation:[string] and no unsupported source condition. No SVG, raw derived coordinates, or measurements.`;
const CUBIC_QUARTIC_CONTRACT=` IF AND ONLY IF the source visual is a polynomial graph of exact degree 3 or 4, apply this separate bounded contract; otherwise ignore this clause and follow the existing geometry/quadratic rules. Such cubic/quartic graph coefficients must have exact degree 3 or 4 and sourceDomain must be exactly {kind:'ALL_REALS'}; restricted intervals are unsupported in this slice. Do not apply quadratic vertex framing to these graphs. The overview framer derives and binds all real roots, derivative roots (extrema or stationary inflections), inflection points, multiplicities, and left/right tail directions from the exact coefficient strings. The independent observer must recompute this inventory from the source polynomial and check every feature and tail against the final rendered polyline. Repeated source roots and root/feature separations below one actual CSS pixel at the audited profile are unsupported. Do not invent source-required points; preserve those separately in requiredPoints.`;
const RATIONAL_CONTRACT=` IF AND ONLY IF the source visual is a rational graph of capability 'rational-spike-v1', apply this separate bounded contract. graphPlan.family must be 'rational', numerator and denominator must each be exactly two integer/rational coefficient strings in ascending powers, the x coefficient of each must be nonzero, and sourceDomain must be exactly {kind:'ALL_REALS'} (meaning no additional interval restriction; natural denominator exclusions remain). The denominator therefore has exactly one simple real root. The numerator either does not vanish there (one vertical pole) or vanishes there (one removable hole); the overview must mark that pole or open hole and the exact horizontal asymptote y=numeratorLeading/denominatorLeading. Preserve the original denominator exclusion even when it cancels. The observer independently recomputes the singularity kind/location, horizontal asymptote, numerator zero, and visible branch coverage from exact coefficients, then checks pole-side separation, asymptote markers, and hole marker on the final SVG. Numerator/denominator degree above one, multiple denominator roots, nonreal denominator roots, oblique asymptotes, additional source intervals, and sub-resolution features are unsupported. No polynomial quadratic/cubic framing clause applies to this rational family.`;
const SQRT_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is the square root of a positive-slope affine radicand, use the distinct capability 'sqrt-affine-spike-v1' and graphPlan.family 'sqrt-affine'. radicand must be exactly [constant,positive x coefficient] as integer/rational strings. sourceDomain must be exactly {kind:'NATURAL_SQRT_AFFINE'} for the full natural x>=root domain, or {kind:'CLOSED_INTERVAL',range:[exact lower,exact upper]} for a closed finite source interval at or above the exact radicand root. For the natural mode the sampled domain starts exactly at that root; for CLOSED_INTERVAL the sampled domain must equal the source interval byte-for-byte in numeric value and must never be expanded. Open intervals, intervals below the root, nonpositive slopes, nonlinear or mixed radicands, and unreviewed compositions are unsupported. Derive and mark every closed source endpoint. Independently verify the final curve begins/ends at the bound endpoint(s), contains no points before the radicand root, and increases rightward. The viewport may have a display-only left margin before the root, but that margin is not part of the sampled domain.`;
const ABSOLUTE_VALUE_CONTRACT=` IF AND ONLY IF the source graph is an absolute value of an affine function with an outer affine scale/offset, use the distinct capability 'absolute-value-spike-v1' and graphPlan.family 'absolute-value'. coefficients must be exactly [b,a,k,c] as rational strings for y=k*abs(a*x+b)+c; a and k must both be nonzero and sourceDomain must be exactly {kind:'ALL_REALS'}. Restricted source intervals, multiple absolute-value operators, mixed compositions, and a zero inner slope/outer scale are unsupported. Derive the exact corner, each real x-intercept when present, left/right branch slopes and tail directions. The final curve must keep two visible affine arms meeting at the exact corner; mark the corner with one closed outlined marker. The independent observer checks both one-sided slopes and actual-profile arm span/rise; do not smooth or bridge the corner with one chord.`;
const PIECEWISE_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly one two-branch piecewise-affine function on a finite closed interval, use the separate capability 'piecewise-affine-spike-v1' and graphPlan.family 'piecewise-affine'. sourceDomain must be exactly {kind:'CLOSED_INTERVAL',range:[lo,hi]} with canonical integer/rational strings and lo<hi. Include exactly one strict interior breakpoint and exactly two affine branches with rational coefficient strings; no nested cases, overlapping breakpoints, open outer domain, or unreviewed extra domains are supported. Set graphPlan.domain to the numeric values of the exact source interval without expansion. The piecewise field must declare {breakX,owner,left,right}; owner is LEFT or RIGHT and determines the function value at the breakpoint. Derive both one-sided limits exactly: if they differ, render a closed marker at the owner value and an open marker at the non-owner limit, with separate curves and no connecting segment; if they are equal, render one closed marker. Both outer source endpoints are closed and marked. The independent observer must recompute interval ownership and branch equations from exact coefficients, then verify each final polyline covers only its own interval, reaches its exact endpoint, and has no cross-break chord; overlapping or ambiguous ownership is unsupported.`;
const EXPONENTIAL_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly y=A*exp(k*x)+C with natural exponential (or the same shape with an explicit positive base and optional exponent shift, below), use the separate capability 'exponential-affine-spike-v1' and graphPlan.family 'exponential-affine'. coefficients must be exact rational strings [A,k,C], A and k nonzero, and sourceDomain exactly {kind:'ALL_REALS'}. The frozen overview binds the exact reference point at exponent zero, strict monotonicity sign(A*k), horizontal asymptote y=C and the side/approach direction, and growth-side direction. Keep x=0 visible, sample only a display overview that retains the original all-real source-domain meaning, and show the asymptote plus reference marker. Mixed exponents, non-natural bases, compositions, restricted source domains, and unsupported scale ranges are unsupported. The independent observer recomputes the function, monotonicity, reference and asymptote from exact coefficients, then checks the final curve and marker at the measured profile. BASE SUPPORT (exponential-affine-spike-v1): add graphPlan.base as an exact positive integer string ('2', '3'), fraction string ('1/2', '3/2') or 'sqrt(n)' (n a square-free integer > 1) and optionally graphPlan.shiftX (exact integer/fraction string, the horizontal shift p) for y=A*base^(k*(x-p))+C. The reference point is (p,A+C), the asymptote y=C, and for base<1 the growth side flips (k>0 with base<1 grows to the left). Natural base e is the omitted default. The formula label is typeset from the coefficients and base. A symbolic base, base<=0 or base=1, nested/unsimplified radicals, decimals and unsupported scale ranges are refused with an explicit base error code. TWO CURVES / INVERSE PAIR: use capability 'exp-log-pair-spike-v1' with graphPlan {family:'exp-log-pair',curves:[{id,family:'exponential-affine'|'logarithmic-affine',base,coefficients,sourceDomain,shiftX?},...],identityLine:true|false} (exactly two curves, at most one of each family is typical); the engine frames both curves and draws their asymptotes/boundaries, reference markers and the dashed identity line y=x. The observer recomputes each curve, its reference point and asymptote/boundary independently.`;
const LOGARITHMIC_AFFINE_CONTRACT=` IF AND ONLY IF the source graph is exactly y=A*ln(k*x+b)+C with natural logarithm, use the separate capability 'logarithmic-affine-spike-v1' and graphPlan.family 'logarithmic-affine'. coefficients must be exact rational strings [A,k,b,C], A and k nonzero, and sourceDomain exactly {kind:'NATURAL_LOG_AFFINE'} meaning k*x+b>0. The exact open boundary is x=-b/k; the reference point uses argument 1 at x=(1-b)/k and y=C. The overview samples only inside the natural domain and shows the boundary with a dashed vertical cue, the reference marker, strict monotonicity sign(A*k), and the correct one-sided unbounded trend. Restricted intervals and mixed compositions are unsupported. The independent observer recomputes boundary/reference/monotonicity from exact coefficients and checks the final curve stays on the valid side and approaches the boundary correctly at measured size. LOG BASE SUPPORT (logarithmic-affine-spike-v1): add graphPlan.base exactly as for the exponential family (integer, fraction or sqrt(n); natural e is the omitted default) for y=A*log_base(k*x+b)+C. The open boundary x=-b/k and the reference point argument 1 at x=(1-b)/k are unchanged; a base<1 reverses the increasing/decreasing direction. A symbolic base, base<=0 or base=1, nested radicals and decimals are refused with an explicit base error code.`;
const TRIGONOMETRIC_CONTRACT=` IF AND ONLY IF the source graph is one uncomposed sine, cosine, or tangent function y=A*F(k*x+phasePi*pi)+C, use the distinct capability 'trigonometric-spike-v1' and graphPlan.family 'trigonometric'. F is exactly SIN, COS, or TAN; coefficients are exact rational strings [A,k,C], A and k are nonzero, and phasePi is a canonical rational multiple of pi. SIN/COS require sourceDomain {kind:'ALL_REALS'} and the overview displays one full exact period, marking and independently checking both extrema and all midline crossings (including roots where y=0). TAN requires sourceDomain {kind:'ALL_REALS_WITH_TAN_POLES'} and displays exactly one complete branch between adjacent poles with both dashed pole cues, no cross-pole chord, and monotonic direction sign(A*k). Mixed identities, powers/compositions, restricted source intervals, and unsupported non-natural phase representations are unsupported. The independent observer recomputes period, phase, amplitude/midline, feature locations or poles and branch coverage from exact coefficients and verifies the final rendered SVG at measured profiles. SEVERAL PERIODS WITH REFERENCE LINES (SIN or COS only): for a solution that counts the crossings of y=A*F(k*x+phasePi*pi)+C with a horizontal or slanted line on an explicit interval, set graphPlan.sourceDomain:{kind:'INTERVAL_PI',rangePi:[lo,hi],states:[start,end]} (lo<hi exact canonical rational multiples of pi such as \"0\" and \"6\"; each state OPEN or CLOSED, CLOSED when omitted; from 1/4 to 12 periods) and graphPlan.referenceLines:[{id,y,intersectionCount}] for a horizontal line or [{id,slope,intercept,intersectionCount}] for a slanted one (at most three; id one letter then letters or digits; y, slope, intercept exact integer or fraction strings, slope not 0; a letter parameter is drawn at one sample value that the caption states). intersectionCount is the author's claim of how many times the line meets the curve inside the interval (a touching point counts once, an open end is not in the interval). The engine finds every crossing (closed form for a horizontal line, sign changes for a slanted one) and the independent observer finds them again with SymPy and 40-digit root scans of the gap and its derivative, then checks the final SVG: the curve over exactly the interval, both end markers (hollow for OPEN, filled for CLOSED, with the end label k*pi), each line and one dot per crossing. domain and viewport are reframed by the engine. Refused with a code: TRIG_LINE_INTERSECTION_COUNT_MISMATCH:<id>:engine finds N intersection(s) (wrong claim, or a slanted line that only touches the curve), TRIG_LINE_THROUGH_INTERVAL_END:<id> (a crossing at a closed end), TRIG_INTERVAL_PERIOD_COUNT_UNSUPPORTED, INVALID_TRIG_INTERVAL, TRIG_LINE_FORM_INVALID:<id>, TRIG_LINE_SLOPE_ZERO:<id>, TRIG_LINE_COEFFICIENT_INVALID:<id>, TRIG_LINE_INTERSECTION_COUNT_INVALID:<id>, TRIG_REFERENCE_LINES_INVALID, TRIG_REFERENCE_LINES_REQUIRE_INTERVAL_PI (lines on the one-period form), TRIGONOMETRIC_SOURCE_DOMAIN_UNSUPPORTED (TAN or a malformed interval). Tangent is not supported on an interval.`;
const SOLID_FIGURE_CONTRACT=` SOLID FIGURES AND NETS (solid-figure-v1, middle school): when the stored solution needs a prism, pyramid, pyramid frustum, cylinder, cone, cone frustum, sphere or hemisphere drawn as a solid (hidden edges dashed, vertex names, lengths beside their edges), or the net of a prism, pyramid, cylinder or cone, use {capability:"solid-figure-v1",unit?:"cm",solids:[1 to 3 solids]|net:{...},dims?,highlights?,segments?,section?,solidCaption?:{text},caption,sourceConditions,newVisualInformation}. A solid is {kind:"PRISM",base,height,names?} (base {kind:"RECT",width,depth}|{kind:"REGULAR",n:3..8,side}|{kind:"POLYGON",points:[[u,v],...],plane?:"XY"|"XZ"} with at most 8 simple points; plane XZ makes the polygon a front face extruded by height along y, for a cuboid with a slanted cut), {kind:"PYRAMID",base,height,apex?:[x,y]} (convex base), {kind:"FRUSTUM",base,height,topScale:0..1,foot?}, {kind:"CYLINDER",radius,height}, {kind:"CONE",radius,height}, {kind:"CONE_FRUSTUM",radius,topRadius,height}, {kind:"SPHERE",radius}, {kind:"HEMISPHERE",radius}; all lengths are real positive numbers and the figure is drawn to scale in one fixed projection. names is a string of capital letters in the order base then top (or apex) ("ABCDEFGH", "." leaves a vertex unnamed) or {base,top,apex} (round solids {center,top,apex}); without names the letters run A,B,C,... and a name is used once in the figure. dims draws a length beside its segment: {edge:"AB"} or {from,to} (a drawn edge or a segment of segments), {radius:"bottom"|"top"|"center"}, {height:true} (a pyramid, frustum, cylinder, cone), {slant:true} (cone, cone frustum), {level:true} (the water level of section LEVEL); an optional label (TeX) must equal the length when it is a number, otherwise it is a symbol such as r, h or 2r (symbols may use TeX commands such as the one for pi, written with one backslash); the engine writes exact lengths itself (5, 7.5, the square root form 5 times root 2, a multiple of pi) with the unit. highlights:[{polygon:["E","G","C"]}] shades a planar polygon of drawn segments; segments:[{from,to,style:"SOLID"|"DASHED"|"AUTO",role:"REF"|"ACCENT"}] draws an extra segment (a diagonal, or an edge to emphasize; AUTO dashes it when the solid hides it). section:{kind:"AXIAL"} shades the plane through the axis of a cylinder, cone or frustum; section:{kind:"LEVEL",at:"1/3"} draws the horizontal plane at that fraction of the height. A net is {solid:{PRISM|PYRAMID|FRUSTUM},root:faceId,joins:[[parentFace,childFace],...],corners?:{faceId:[names]},dims?:[{face,edge,label?}]} with faces named bottom, top, side0, side1, ... (side i stands on base edge i); joins form a spanning tree of the faces (adjacent faces only) and the engine unfolds along it, refusing overlaps; or {kind:"CYLINDER",radius,height,dims?:[{part:"rect-width"|"rect-height"|"radius-top"|"radius-bottom",label?}]}, or {kind:"CONE",radius,slant|height,dims?:[{part:"slant"|"arc"|"radius"|"angle",label?}]}. A figure needs at least one name or length. Not supported (answer UNSUPPORTED): regular polyhedra other than a cube or a square-based pyramid drawn by hand, more than 3 solids, a solid inside another, cutting a prism by a slanted plane, a flat bowl, an apex-down cone (a vessel filled from the point), perspective views, and a name or length that finds no room (SOLID_LABELS_NO_ROOM: use fewer labels). Refusals: SOLID_PLAN_INVALID, SOLID_KIND_UNSUPPORTED, SOLID_PARAM_INVALID, SOLID_BASE_INVALID, SOLID_BASE_NOT_SIMPLE, SOLID_BASE_NOT_CONVEX, SOLID_NAMES_INVALID, SOLID_NAME_DUPLICATE, SOLID_NAME_UNKNOWN, SOLID_DIMS_INVALID, SOLID_DIM_SEGMENT_NOT_DRAWN, SOLID_DIM_VALUE_MISMATCH, SOLID_DIM_NOT_EXPRESSIBLE, SOLID_HIGHLIGHT_NOT_PLANAR, SOLID_SECTION_UNSUPPORTED, SOLID_NET_NOT_A_TREE, SOLID_NET_FACES_NOT_ADJACENT, SOLID_NET_FACES_OVERLAP, SOLID_FIGURE_NEEDS_A_LABEL.`;
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
export function specFor(plan,model,id){
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
    if(!features||!['EXPONENTIAL_AFFINE_FEATURES_v1','EXPONENTIAL_BASE_FEATURES_v1'].includes(features.schemaVersion)||!policy||!['EXPONENTIAL_AFFINE_FEATURE_POLICY_v1','EXPONENTIAL_BASE_FEATURE_POLICY_v1'].includes(policy.schemaVersion))throw Error('EXPONENTIAL_FEATURE_INVENTORY_REQUIRED');
    const [a,k,c]=p.coefficients,expression=basePlan?expLogExpression({family:'exponential-affine',base:p.base,shiftX:p.shiftX,coefficients:p.coefficients}):`(${a})*exp((${k})*x)+(${c})`,showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0,refX=Number(String(features.referencePoint.x).split('/')[0])/(String(features.referencePoint.x).includes('/')?Number(String(features.referencePoint.x).split('/')[1]):1),refY=Number(features.referencePoint.y.split('/')[0])/(features.referencePoint.y.includes('/')?Number(features.referencePoint.y.split('/')[1]):1);
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX:[refX]},{id:'reference-value',kind:'EQUATION_LABEL',text:'f('+features.referencePoint.x+')='+features.referencePoint.y,at:[refX,refY+(v[3]-v[2])*.08],math:true,priority:0}];
    if(basePlan)objects.push({id:'formula',kind:'EQUATION_LABEL',text:expLogFormulaText({family:'exponential-affine',base:p.base,shiftX:p.shiftX,coefficients:p.coefficients}),at:[v[0]+(v[1]-v[0])*.12,v[2]+(v[3]-v[2])*.10],math:true,priority:0});
    return {id,visualType:'function_graph',viewport:basePlan?graphViewport(v):{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{exponentialFeatures:features,exponentialFeaturePolicy:policy},objects};
  }
  if(plan.capability==='logarithmic-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.logarithmicFeatures,policy=p.logarithmicFeaturePolicy;
    const basePlan=features?.schemaVersion==='LOGARITHMIC_BASE_FEATURES_v1';
    if(!features||!['LOGARITHMIC_AFFINE_FEATURES_v1','LOGARITHMIC_BASE_FEATURES_v1'].includes(features.schemaVersion)||!policy||!['LOGARITHMIC_AFFINE_FEATURE_POLICY_v1','LOGARITHMIC_BASE_FEATURE_POLICY_v1'].includes(policy.schemaVersion))throw Error('LOGARITHMIC_FEATURE_INVENTORY_REQUIRED');
    const [a,k,b,c]=p.coefficients,expression=basePlan?expLogExpression({family:'logarithmic-affine',base:p.base,coefficients:p.coefficients}):`(${a})*log((${k})*x+(${b}))+(${c})`,number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);},root=number(features.naturalDomainBoundaryX),ref=number(features.referencePoint.x),refY=number(features.referencePoint.y),showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX:[ref]},{id:'reference-value',kind:'EQUATION_LABEL',text:'f('+features.referencePoint.x+')='+features.referencePoint.y,at:[ref,refY+(v[3]-v[2])*.08],math:true,priority:0},{id:'log-domain-boundary-label',kind:'EQUATION_LABEL',text:'x='+features.naturalDomainBoundaryX,at:[root+(k.startsWith('-')?-1:1)*(v[1]-v[0])*.1,v[3]-(v[3]-v[2])*.2],math:true,priority:0}];
    if(basePlan)objects.push({id:'formula',kind:'EQUATION_LABEL',text:expLogFormulaText({family:'logarithmic-affine',base:p.base,coefficients:p.coefficients}),at:[v[0]+(v[1]-v[0])*.55,v[2]+(v[3]-v[2])*.10],math:true,priority:0});
    return {id,visualType:'function_graph',viewport:graphViewport(v),axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),logarithmicFeatures:features,logarithmicFeaturePolicy:policy},objects};
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
    if(!features||features.schemaVersion!=='TRIGONOMETRIC_FEATURES_v1'||!policy||policy.schemaVersion!=='TRIGONOMETRIC_FEATURE_POLICY_v1')throw Error('TRIG_FEATURE_INVENTORY_REQUIRED');
    const [a,k,c]=p.coefficients,fn=p.function.toLowerCase(),phase=p.phasePi,number=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);},expression=`(${a})*${fn}((${k})*x+(${phase})*pi)+(${c})`,criticalX=p.function==='TAN'?[number(features.cycleCenterPi)*Math.PI]:features.phasePoints.map(point=>number(point.xPiMultiple)*Math.PI),period=features.periodPiMultiple,periodLabel=`T=${period==='1'?'':period.includes('/')?'('+period+')':period}π`,showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const periodLabelAt=p.function==='TAN'?[v[1],(v[2]+v[3])/2]:[(v[0]+v[1])/2,v[3]-(v[3]-v[2])*.08];
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'period-label',kind:'EQUATION_LABEL',text:periodLabel,at:periodLabelAt,math:true,priority:0}];
    return {id,visualType:'function_graph',viewport:graphViewport(v),axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),trigFeatures:features,trigFeaturePolicy:policy},objects};
  }
  if(plan.capability==='sqrt-affine-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.sqrtFeatures;
    if(!features||features.schemaVersion!=='SQRT_AFFINE_FEATURES_v1')throw Error('SQRT_ENDPOINT_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const polynomialText=values=>{const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');};
    const expression='sqrt('+polynomialText(p.radicand)+')',showX=v[2]<0&&v[3]>0,showY=v[0]<=0&&v[1]>=0;
    const boundary=exactNumber(features.radicandBoundaryX),start=exactNumber(features.sourceEndpoints[0].x),slope=exactNumber(p.radicand[1]),plotSy=256/(v[3]-v[2]);
    const criticalX=features.sourceEndpoints.map(endpoint=>exactNumber(endpoint.x));
    if(Math.abs(start-boundary)<1e-10){const boundaryStep=(1.2/(plotSy*Math.sqrt(slope)))**2;if(boundary+boundaryStep<p.domain[1])criticalX.push(boundary+boundaryStep);}
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression,domain:p.domain,criticalX},{id:'formula',kind:'EQUATION_LABEL',text:'y='+expression,at:[v[0]+(v[1]-v[0])*.22,v[3]-(v[3]-v[2])*.12],priority:0}];
    if(features.sourceEndpoints.length>1){const end=features.sourceEndpoints[1];objects.push({id:'sqrt-source-end-label',kind:'GRAPH_ANNOTATION',text:'x='+end.x,at:[exactNumber(end.x)-(v[1]-v[0])*.08,exactNumber(end.y)+(v[3]-v[2])*.08],math:true,priority:0});}
    return {id,visualType:'function_graph',viewport:{xMin:v[0],xMax:v[1],yMin:v[2],yMax:v[3],width:384,height:320,panel:140},axes:{x:showX,y:showY},title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{sqrtFeatures:features,sqrtFeaturePolicy:p.sqrtFeaturePolicy},objects};
  }
  if(plan.capability==='rational-spike-v1'){
    const p=plan.graphPlan,v=p.viewport,features=p.rationalFeatures;
    if(!features||features.schemaVersion!=='RATIONAL_LINEAR_OVER_LINEAR_FEATURES_v1')throw Error('RATIONAL_FEATURE_INVENTORY_REQUIRED');
    const exactNumber=value=>{const parts=String(value).split('/');return Number(parts[0])/(parts.length===2?Number(parts[1]):1);};
    const polynomialText=values=>{
      const terms=values.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
      return terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c,coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude,term=i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient;return (negative?'-':index?'+':'')+term;}).join('');
    };
    const numerator=polynomialText(p.numerator),denominator=polynomialText(p.denominator),expression='('+numerator+')/('+denominator+')';
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
  if(plan.capability==='polynomial-spike-v1'){
    const p=plan.graphPlan,v=p.viewport;const terms=p.coefficients.map((c,i)=>({c,i})).reverse().filter(({c})=>c!=='0');
    const expr=terms.map(({c,i},index)=>{const negative=c.startsWith('-'),magnitude=negative?c.slice(1):c;const coefficient=magnitude.includes('/')?'('+magnitude+')':magnitude;return (negative?'-':index?'+':'')+(i?(magnitude==='1'?'':coefficient+'*')+'x'+(i>1?'^'+i:''):coefficient);}).join('');
    const degree=p.coefficients.reduce((highest,coefficient,index)=>coefficient==='0'?highest:index,0),canvas=degree>=3?GRAPH_OVERVIEW_CANVAS:p.plotCanvas!==undefined?equalUnitCanvas(p):p.compositeHeader!==undefined?COMPOSITE_PANEL_CANVAS:{...QUADRATIC_HEADER_CANVAS,...(p.overviewCanvasHeight!==undefined?{height:p.overviewCanvasHeight}:{})};
    // compositeHeader {formula:'CAPTION',sharedLines:[line IDs]} is set by composite-candidate-svg-v1 for a three-panel stack, never by an author: the
    // composite typesets the formula in the panel's caption row and the shared line equations once above the stack, so the panel leaves them out.
    const header=p.compositeHeader;
    if(header!==undefined&&(degree>2||p.overviewCanvasHeight!==undefined||!header||typeof header!=='object'||Object.keys(header).sort().join(',')!=='formula,sharedLines'||header.formula!=='CAPTION'||!Array.isArray(header.sharedLines)||header.sharedLines.some(id=>!(p.lines||[]).some(line=>line?.id===id))))throw Error('COMPOSITE_HEADER_INVALID');
    if(degree<=2&&header===undefined&&p.plotCanvas===undefined&&(!Number.isSafeInteger(canvas.height)||canvas.height<400||canvas.height>600))throw Error('POLYNOMIAL_OVERVIEW_CANVAS_HEIGHT_INVALID');
    const framedCriticalX=(p.overviewFeatures||[]).filter(feature=>feature.kind==='POLYNOMIAL_FEATURE').map(feature=>feature.x);
    const criticalX=[...new Set([...(p.requiredPoints||[]).map(point=>point.x),...framedCriticalX])];
    const displayedExpression=quadraticVertexNotation(p.coefficients)?.expression??expr;
    if(p.tickLabelCallouts!==undefined){
      const q13Quadratic=p.family==='polynomial'&&p.coefficients.join(',')==='-1/2,3,1/2'&&p.overviewCanvasHeight===600&&(p.requiredPoints||[]).some(point=>point.x===-3&&point.y===-5);
      if(!q13Quadratic||!Array.isArray(p.tickLabelCallouts)||p.tickLabelCallouts.length!==1)throw Error('TICK_LABEL_CALLOUT_Q13_ONLY');
      const callout=p.tickLabelCallouts[0];
      if(!callout||Object.keys(callout).sort().join(',')!=='axis,offsetUser,value'||callout.axis!=='x'||callout.value!=='-6'||!Array.isArray(callout.offsetUser)||callout.offsetUser.length!==2||callout.offsetUser[0]!==28||callout.offsetUser[1]!==-22)throw Error('TICK_LABEL_CALLOUT_Q13_BINDING_INVALID');
    }
    const axisVariable=p.axisVariable??'x';
    if(typeof axisVariable!=='string'||!(p.applicationAxes===true?/^[A-XZa-xz]$/:/^[a-xz]$/).test(axisVariable))throw Error('INVALID_AXIS_VARIABLE');
    const shownExpression=axisVariable==='x'?displayedExpression:displayedExpression.replace(/x/g,axisVariable);
    const objects=[{id:'f',kind:'FUNCTION_GRAPH',expression:expr,domain:p.domain,criticalX},...(header?[]:[{id:'formula',kind:'EQUATION_LABEL',text:'y='+shownExpression,at:[v[0]+(v[1]-v[0])*.3,v[3]-(v[3]-v[2])*.12]}])];
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
    const pointNames=pointNameModel(plan,required.map(point=>point?.id)),nameLike=id=>pointNames.has(id)||/^[A-Z][0-9']?$/.test(id),graphPanel=new Set([...(plan.coordinatePlacement==='PANEL'?required.filter(point=>coordinateText(point)&&nameLike(point.id)).map(point=>point.id):plan.coordinatePanel||[]),...required.filter(point=>pointNames.has(point?.id)&&coordinateText(point)).map(point=>point.id)]);
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
    return {id,visualType:'function_graph',viewport:{...graphViewport(v,{...canvas,height:canvas.height+bandExtra}),...(degree<=2?{topInset:canvas.topInset+bandExtra}:{}),...(p.equalUnits===true&&(p.axisRatio??1)===1?{equalUnits:true}:{})},axes:true,title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{...axisTickDisplayFacts(p),...(axisVariable!=='x'?{axisVariable}:{}),...(degree<=2?{formulaPlacement:'HEADER_BAND',equationLabelCenters:{...(header?{}:{formula:[canvas.width/2,72]}),...bandCenters}}:{}),...(p.intervalFeatures?{intervalFeatures:p.intervalFeatures,intervalFeaturePolicy:p.intervalFeaturePolicy}:{})},objects};
  }
  const displayed=displayGeometryInventory(plan,model),points=displayed.points;const xs=Object.values(points).map(p=>p.approximation[0]),ys=Object.values(points).map(p=>p.approximation[1]);for(const q of regionExtentPoints(plan,points)){xs.push(q[0]);ys.push(q[1]);}   // a region's arc can bulge past the displayed points
  // A plane figure (no axes) is fitted tightly: the engine's own margin already leaves room for the point names.
  const span=Math.max(Math.max(...xs)-Math.min(...xs),Math.max(...ys)-Math.min(...ys),1e-9),pad=span*(isPlaneFigure(plan)?.06:.35);
  // hiddenPointNames:[point IDs] draws derived helper points as bare dots: never a source point, a GIVEN/CONCLUSION point or a coordinate-labelled one.
  const hiddenNames=new Set(plan.hiddenPointNames??[]);
  if(!Array.isArray(plan.hiddenPointNames??[])||[...hiddenNames].some(id=>{const node=plan.mathPlan.nodes.find(n=>n.id===id);return !Object.hasOwn(points,id)||!node||node.op==='SOURCE_POINT'||node.factRole!=='DERIVED_INTERMEDIATE'||(plan.coordinateLabels||[]).includes(id);}))throw Error('INVALID_HIDDEN_POINT_NAMES');
  const pointNames=pointNameModel(plan,Object.keys(points));
  for(const entry of pointNames.entries())if(hiddenNames.has(entry.id))throw Error('POINT_NAME_TARGET_HIDDEN:'+entry.id);
  const objects=Object.entries(points).map(([name,p])=>({id:name,kind:'POINT',at:p.approximation,...(hiddenNames.has(name)?{name:null}:pointNames.has(name)?{name:pointNames.tex(name)}:{})}));const notationByLabel={},factRolesByLabel={},axisCoincidentLines=displayed.axisCoincidentLines;
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
    if((s.dashed!==undefined||s.arrow!==undefined)&&!isPlaneFigure(plan))throw Error('DISPLAY_SEGMENT_STYLE_REQUIRES_PLANE_FIGURE:'+s.id);
    objects.push({id:s.id,kind:'SEGMENT',from:points[s.refs[0]].approximation,to:points[s.refs[1]].approximation,...(s.dashed?{dash:true}:{}),...(s.arrow?{arrow:s.arrow}:{})});
  }
  // coordinatePlacement:'PANEL' (도형추출.md 6-7-1): point names stay at their points and each exact coordinate moves to a band above the plot
  // as one "A(x,y)" label, so a crowded coordinate figure keeps every coordinate at the Archive font floor. Same exact source as below.
  if(plan.coordinatePlacement!==undefined&&plan.coordinatePlacement!=='PANEL')throw Error('UNSUPPORTED_COORDINATE_PLACEMENT');
  // coordinatePanel:[point IDs] moves only those coordinates to the band ('PANEL' moves all); labelDirections {pointId: N|NE|E|SE|S|SW|W|NW}
  // is the first direction the layout tries for that point's coordinate label at the point (the rest are still tried).
  const labelled=plan.coordinateLabels||[],labelDirections=plan.labelDirections??{};
  if(plan.coordinatePanel!==undefined&&(!Array.isArray(plan.coordinatePanel)||plan.coordinatePanel.some(id=>!labelled.includes(id))))throw Error('COORDINATE_PANEL_NOT_A_COORDINATE_LABEL');
  const inPanel=new Set(plan.coordinatePlacement==='PANEL'?labelled:plan.coordinatePanel||[]);
  if(!labelDirections||typeof labelDirections!=='object'||Array.isArray(labelDirections)||Object.entries(labelDirections).some(([id,direction])=>!labelled.includes(id)||inPanel.has(id)||!['N','NE','E','SE','S','SW','W','NW'].includes(direction)))throw Error('INVALID_LABEL_DIRECTIONS');
  const panelLabels=[];
  for(const id of plan.coordinateLabels||[]){
    const node=plan.mathPlan.nodes.find(n=>n.id===id),point=points[id];
    if(!node||node.outputType!=='POINT'||!point?.exact?.length)throw Error('VERIFIED_POINT_COORDINATE_REQUIRED:'+id);
    // Derived coordinates come exclusively from the independently rebuilt
    // exact model, never from planner-authored approximate coordinates.
    const coordinates=node.op==='SOURCE_POINT'?node.args.coordinates:point.exact;
    objects.push({id:id+'-name',kind:'POINT_NAME',target:id,text:pointNames.tex(id),priority:0});
    if(inPanel.has(id)){
      const labelId=id+'-coordinate-panel';panelLabels.push(labelId);
      objects.push({id:labelId,kind:'EQUATION_LABEL',target:id,text:pointNames.expr(id)+'('+coordinates.map(value=>unwrapParentheses(scalarExpression(value))).join(',')+')',at:point.approximation,priority:0});
      factRolesByLabel[labelId]=node.factRole;
      continue;
    }
    objects.push({id:id+'-coordinate',kind:'COORDINATE_LABEL',target:id,exact:coordinates.map(scalarExpression),...(labelDirections[id]?{preferred:labelDirections[id]}:{})});
    factRolesByLabel[id+'-coordinate']=node.factRole;
  }
  // lineLabels:[{nodeId,form:'SLOPE_INTERCEPT'|'GENERAL'}] writes the equation of a displayed SOURCE_LINE beside it, built from its exact coefficients.
  const lineLabelIds=new Set();
  for(const label of plan.lineLabels||[]){
    const node=plan.mathPlan.nodes.find(n=>n.id===label.nodeId);
    if(!node||node.op!=='SOURCE_LINE'||!Object.hasOwn(displayed.lines,node.id)||lineLabelIds.has(node.id)||!['SLOPE_INTERCEPT','GENERAL'].includes(label.form)||Object.keys(label).length!==2)throw Error('INVALID_LINE_LABEL');
    lineLabelIds.add(node.id);
    const [ca,cb,cc]=['a','b','c'].map(k=>exactSurd(node.args[k]));
    const lo=[Math.min(...xs)-pad,Math.min(...ys)-pad],hi=[Math.max(...xs)+pad,Math.max(...ys)+pad],coef=[ca,cb,cc].map(v=>Number(v.p[0])/Number(v.p[1])+(v.q[0]===0n?0:Number(v.q[0])/Number(v.q[1])*Math.sqrt(Number(v.r))));
    // Anchor at the end of the drawn line: clip a x+b y+c=0 to the view, then take the end that is higher (steep line) or further right (flat line), just inside the frame.
    const ends=[];const [A,B,C]=coef;
    for(const x of [lo[0],hi[0]])if(B!==0){const y=-(A*x+C)/B;if(y>=lo[1]-1e-9&&y<=hi[1]+1e-9)ends.push([x,y]);}
    for(const y of [lo[1],hi[1]])if(A!==0){const x=-(B*y+C)/A;if(x>=lo[0]-1e-9&&x<=hi[0]+1e-9&&!ends.some(e=>Math.hypot(e[0]-x,e[1]-y)<1e-9))ends.push([x,y]);}
    if(ends.length<2)throw Error('LINE_LABEL_LINE_NOT_IN_VIEW');
    // Anchors on the line, preferred end first (higher for a steep line, further right for a flat one): near the end, a little in, further in; then the other end.
    const steep=Math.abs(A)>Math.abs(B),first=ends.reduce((p,q)=>(steep?q[1]>p[1]:q[0]>p[0])?q:p),second=ends.find(e=>e!==first),mid=[(first[0]+second[0])/2,(first[1]+second[1])/2];
    const anchors=[[first,.08],[first,.22],[first,.4],[second,.08],[second,.22],[second,.4]].map(([e,t])=>[e[0]+(mid[0]-e[0])*t*2,e[1]+(mid[1]-e[1])*t*2]),at=anchors[0];
    const id=node.id+'-equation';objects.push({id,kind:'EQUATION_LABEL',target:node.id,lineOwned:true,text:lineEquationText(ca,cb,cc,label.form),at,alternateAt:anchors.slice(1),priority:1});factRolesByLabel[id]=node.factRole;
  }
  for(const label of plan.scalarLabels||[]){
    const scalar=model.scalars[label.nodeId];if(!scalar)throw Error('SCALAR_LABEL_UNKNOWN_NODE');
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment)throw Error('SCALAR_LABEL_OWNER_MISSING');
    const [a,b]=segment.refs.map(r=>points[r].approximation);
    const scalarNode=plan.mathPlan.nodes.find(n=>n.id===label.nodeId),role=scalarNode.factRole;
    const sourceLength=(!!label.unit||(!label.prefix&&scalarNode.op==='SEGMENT_LENGTH'))&&role!=='CONCLUSION';
    const prefix=normalizeScalarLabelPrefix(label.prefix);
    const id=label.nodeId+'-value';objects.push({id,kind:sourceLength?'LENGTH_LABEL':'EQUATION_LABEL',target:label.ownerSegment,...(sourceLength?{refs:[label.ownerSegment],value:scalar.approximation}:{}),text:(sourceLength||!prefix?'':prefix+'=')+unwrapParentheses(scalarExpression(scalar.exact)),at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[id]={...(!sourceLength&&/^[A-Z]{2}$/.test(label.prefix)?{entity:label.prefix}:{}),...(label.unit?{unit:label.unit}:{})};factRolesByLabel[id]=role;
  }
  for(const label of plan.segmentLabels||[]){
    const segment=plan.displaySegments.find(s=>s.id===label.ownerSegment);if(!segment||!/^[A-Za-z]$/.test(label.variable))throw Error('UNSUPPORTED_SEGMENT_NOTATION');
    const [a,b]=segment.refs.map(r=>points[r].approximation);
    objects.push({id:label.id,kind:'EQUATION_LABEL',target:label.ownerSegment,text:label.variable,at:[(a[0]+b[0])/2,(a[1]+b[1])/2],priority:1});
    notationByLabel[label.id]=label.unit?{unit:label.unit}:{};factRolesByLabel[label.id]=label.factRole;
  }
  for(const angle of plan.rightAngles||[])objects.push({id:angle.id,kind:'ANGLE_MARK',refs:angle.refs,value:90});
  // planeMarks (plane-marks.mjs): angle arcs, equal ticks, parallel arrows, expression labels, highlighted arcs; each is checked against the model here.
  const planeMarkFacts=planeMarkSpec(plan,model,points,new Set((plan.displaySegments||[]).map(s=>s.id)));
  objects.push(...planeMarkFacts.objects);Object.assign(factRolesByLabel,planeMarkFacts.factRolesByLabel);
  const coordinateCanvas=plan.coordinateCanvas??{width:384,height:320};
  if(plan.coordinateCanvas!==undefined&&model.coordinateMode!=='SOURCE_COORDINATES'&&!isPlaneFigure(plan))throw Error('COORDINATE_CANVAS_SOURCE_FRAME_REQUIRED');
  if(!Number.isSafeInteger(coordinateCanvas.width)||coordinateCanvas.width<384||coordinateCanvas.width>720||!Number.isSafeInteger(coordinateCanvas.height)||coordinateCanvas.height<320||coordinateCanvas.height>600)throw Error('COORDINATE_CANVAS_BOUNDS_INVALID');
  // The coordinate band adds height above the plot (two columns; 34 px rows, 56 with a fraction) instead of shrinking the plot.
  const textOf=labelId=>objects.find(object=>object.id===labelId)?.text??'',panelRows=Array.from({length:Math.ceil(panelLabels.length/2)},(_,r)=>panelLabels.slice(2*r,2*r+2));
  const panelPitches=panelRows.map(row=>bandRowPitch(row.map(textOf))),panelCenters=bandRowCenters(panelPitches,55);
  const topInset=panelLabels.length?26+panelPitches.reduce((sum,pitch)=>sum+pitch,0):0,height=coordinateCanvas.height+topInset;
  if(height>600)throw Error('COORDINATE_PANEL_TOO_TALL');
  const equationLabelCenters=Object.fromEntries(panelLabels.map((labelId,i)=>[labelId,[panelLabels.length===1?coordinateCanvas.width/2:coordinateCanvas.width*(i%2?.72:.28),panelCenters[Math.floor(i/2)]]]));
  return {id,visualType:'line_circle_geometry',viewport:{xMin:Math.min(...xs)-pad,xMax:Math.max(...xs)+pad,yMin:Math.min(...ys)-pad,yMax:Math.max(...ys)+pad,width:coordinateCanvas.width,height,panel:0,...(topInset?{topInset}:{})},axes:model.coordinateMode==='SOURCE_COORDINATES',title:plan.caption,sourceFacts:{},derivedFacts:{},displayFacts:{notationByLabel,factRolesByLabel,squareAngleIds:(plan.rightAngles||[]).map(a=>a.id),...axisTickDisplayFacts(plan),...(panelLabels.length?{equationLabelCenters}:{}),...(axisCoincidentLines.length?{axisCoincidentLines}:{})},objects};
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
    extendedContract+=' The mathematical DAG may contain internal axis/projection helpers. Explicit optional displayPoints:[point IDs], displayLines:[line IDs] and displayCircles:[circle IDs] select the final educational drawing (a displayed point is written with its node id, so use the names the stored solution uses as node ids, for example A, B, M, P, and never ids such as O0, Pp or C1 that the solution does not use; helper points the solution does not name should be DERIVED_INTERMEDIATE and listed in hiddenPointNames); they are top-level plan fields, never inside mathPlan, and when one is omitted every node of that type is drawn (circles made by CIRCLE_CENTER_RADIUS are drawn as geometry). Each list must retain all original SOURCE_POINT nodes, GIVEN/CONCLUSION geometry of its type and every annotation/segment endpoint. Optional top-level coordinatePlacement:"PANEL" keeps only the point names at the points and lists each coordinateLabels point as A(x,y) in a band above the figure; use it when several labelled points would crowd the figure, or set coordinatePanel:[point IDs] to move only those points; labelDirections:{pointId:"SE"} names the first direction (N, NE, E, SE, S, SW, W or NW) tried for a coordinate label that stays at its point. A displayed line that is the x-axis or the y-axis is not drawn again (the axis shows it); do not list it in displayLines. Optional top-level hiddenPointNames:[point IDs] draws derived helper points (DERIVED_INTERMEDIATE, not SOURCE_POINT, not in coordinateLabels) as dots without a name; use it for helpers the solution never names. For a quadratic graph, coordinatePanel:[requiredPoint IDs] or coordinatePlacement:"PANEL" names those integer key points by their id (one capital letter, optionally a digit or prime) and lists P(x,y) under the formula. For the x-axis equidistance construction, show the source A,B and derived P, segments PA and PB and their equal lengths; axis/projection helper points and auxiliary lines may stay in the exact DAG without cluttering the drawing. Use short mathematical point IDs, and use prefix:"" for a pure length value without an equation prefix; any other prefix is one or two Latin letters, optionally followed by ^2 or ^3 (for example AB, r, S^2). A construction plan may set axisTickValues:{x:[numbers],y:[numbers]} to choose the axis ticks (a polynomial graphPlan always uses {x:[],y:[]}); use {x:[],y:[]} when every displayed key point already carries a coordinate label, and never put a tick at a value whose coordinate label is drawn next to that axis.';
    extendedContract+=' Also supported point/line construction operations: DIVISION_POINT(inputs [A,B] two different POINT, args {m:typedScalar,n:typedScalar,mode:INTERNAL|EXTERNAL}, outputType POINT; the point P with AP:PB=m:n, m and n positive numbers; INTERNAL lies between A and B, EXTERNAL needs m different from n and lies beyond B when m>n and beyond A when m<n), CENTROID(inputs three non-collinear POINT vertices, args {}, outputType POINT), POINT_REFLECTION(inputs [P,centre] POINT, args {}, outputType POINT; the image of P in the point centre, which must differ from P, and for a reflection in the origin the centre is the NORMALIZATION_ORIGIN node), LINE_REFLECTION(inputs [P,l] POINT then LINE, args {}, outputType POINT; the mirror image of P in l, P not on l), PERPENDICULAR_THROUGH(inputs [P,l] POINT then LINE, args {}, outputType LINE; the line through P perpendicular to l), TRANSLATE_POINT(inputs [P], args {dx,dy} typedScalar, outputType POINT) and TRANSLATE_LINE(inputs [l], args {dx,dy} typedScalar, outputType LINE), the image shifted by dx along x and dy along y. dx and dy are literal numbers from the stored solution, not both 0; a translation given by letters, by a vector between two points, a ratio with a letter, or a negative ratio is unsupported: answer UNSUPPORTED. The image of a point under these operations is a derived point and must never carry raw coordinates; name it with a single capital letter, and when the solution writes the image with a prime (A with a prime mark) use a plain id such as P and say so in a source condition.';
    extendedContract+=` Plane figures without axes (middle school): mathPlan.realization {recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false} with at least one SOURCE_POINT and no NORMALIZATION nodes. POLAR_POINT(inputs [centre, reference] two different POINT, args {length: positive typedScalar, angleDeg: typedScalar 0<a<360, turn: 'CCW'|'CW'}, outputType POINT) places a point at that distance on the ray centre->reference turned by the angle; a non-special angle is computed to high precision. displaySegments entries may carry dashed:true and arrow:'START'|'END'|'BOTH'. planeMarks:{angles:[{id,refs:[A,V,C],value,label,side,arcs,ring,style,equalGroup,noLabel}],equalLengths:[{id,count,segments}],parallels:[{id,count,segments}],expressionLabels:[{id,ownerSegment,text}],arcs:[{id,circle,center,from,to,side,label}],facts:[{kind:'ON_CIRCLE'|'TANGENT_PERPENDICULAR',...}]} states facts the figure shows; each is checked against the points (0.5 degree tolerance) and read back from the final SVG by an independent observer. An angle mark is a small light grey sector with its boundary arcs by default (style SECTOR); style ARC draws the arcs alone (equalGroup members share their style). The sector observer checks the vertex, both rays, the radius against the outermost arc, the sweep and side of the fill and that it lies beneath every stroke and label. planeMarks.regions:[{id,fill:'LIGHT'|'MEDIUM',label,factRole,shapes:[{polygon:[point IDs]}|{sector:{center,from,to,side}}|{segment:{center,from,to,side}}|{loop:{start,steps:[{to,arc:{center,side,full}}]}}],holes:[...]}] fills a region with an already drawn boundary, written as shapes minus holes: a polygon of displayed point IDs, a circular sector or segment (a sector/segment side is MINOR default, MAJOR, CCW or CW and the two points must lie on the center circle), or a loop mixing straight edges with exact circular arcs (side MINOR, MAJOR, CCW, CW or FULL, where a FULL whole circle repeats its start point); a hole must lie inside a shape and shapes must not overlap because the fill rule is even-odd. fill is LIGHT by default, the fill is painted beneath every stroke and label, and an optional label (math text, at most 40 characters) is placed inside the widest interior clearance, clear of other labels. Explicit codes: REGION_BOUNDARY_UNKNOWN (an unknown point or an edge no displayed segment, line, circle or arc draws), REGION_NOT_CLOSED, REGION_SELF_INTERSECTING, REGION_LOOPS_CROSS, REGION_SHAPES_OVERLAP, REGION_HOLE_OUTSIDE, REGION_ARC_SIDE_AMBIGUOUS (a half circle without side), REGION_ARC_ENDPOINT_NOT_ON_CIRCLE, REGION_DEGENERATE, REGION_DEGENERATE_EDGE, REGION_FILL_UNSUPPORTED, REGION_FIELD_UNKNOWN, REGION_FIELD_INVALID, REGION_ID_INVALID and REGION_ID_DUPLICATE. The region observer recomputes the boundary from the peer points and checks the final even-odd path vertex by vertex, arc by arc (centre, radius, sweep), that every edge is stroked, that the fill is beneath the strokes and that the label stays inside it: REGION_VERTEX_MISMATCH, REGION_ARC_SIDE_MISMATCH, REGION_ARC_RADIUS_MISMATCH, REGION_BOUNDARY_NOT_DRAWN, REGION_NOT_BENEATH_STROKES, REGION_LABEL_OUTSIDE, REGION_LABEL_CROWDS_LABEL and UNDECLARED_MARK. The region area value itself is not verified by the observer. planeMarks.traces:[{id,center,radius:{point:pointId}|{segment:segmentId},through:[intersection point IDs],spanDeg?,label?}] draws the compass traces of a construction: for every declared intersection, a thin solid arc of the declared radius (a point distance or a segment length) spanning spanDeg degrees (default 24, 2 to 120) around that point; the stated intersections must lie exactly on that radius, and the independent observer checks each arc's centre, radius, span, that it passes through the declared point, and that it is thin (stroke width at most 1.2) and undashed. label is an optional construction order digit (1 to 99) written outside the arc; extra trace codes are TRACE_RADIUS_INVALID, TRACE_TARGET_NOT_ON_ARC, TRACE_TARGETS_DEGENERATE, TRACE_SPAN_INVALID and TRACE_LABEL_INVALID, and observer codes are TRACE_ARC_MISSING, TRACE_ARC_COUNT_MISMATCH, TRACE_ARC_RADIUS_MISMATCH, TRACE_ARC_DOES_NOT_PASS_THROUGH, TRACE_ARC_SPAN_MISMATCH, TRACE_ARC_DASHED, TRACE_ARC_TOO_THICK and TRACE_LABEL_MISMATCH.`;
    extendedContract+=' For source-coordinate geometry only, coordinateCanvas:{width,height} may enlarge the composition with width 384–720 and height 320–600; this changes framing only and must preserve all source coordinates, exact derived coordinates, labels and their owners. For a quadratic overview only, overviewCanvasHeight may increase the plot height between 400 and 600 SVG units; keep all required roots, vertex, source ticks and both curve arms visible.';
    extendedContract+=RATIONAL_CONTRACT;
    extendedContract+=SQRT_AFFINE_CONTRACT;
    extendedContract+=ABSOLUTE_VALUE_CONTRACT;
    extendedContract+=PIECEWISE_AFFINE_CONTRACT;
    extendedContract+=EXPONENTIAL_AFFINE_CONTRACT;
    extendedContract+=LOGARITHMIC_AFFINE_CONTRACT;
    extendedContract+=TRIGONOMETRIC_CONTRACT;
    extendedContract+=' A function graph made of up to four polynomial pieces of degree at most 2 that join without a jump (for example the absolute value of a quadratic written as its pieces, or |x^2+x-6|+2x when the solution rewrites the equation as k=g(x)), drawn together with up to three horizontal lines y=c and their intersection points, is ONE curve and is supported: use {capability:"piecewise-polynomial-spike-v1",graphPlan:{family:"piecewise-polynomial",pieces:[{coefficients:[...]},...],breakpoints:[{x,y},...],sourceDomain,formula,referenceLines:[...],requiredPoints:[...],exactCoordinates:{...},axisTickValues:{x:[],y:[]}},caption,sourceConditions,newVisualInformation}; every field named here sits inside graphPlan except capability, caption, sourceConditions and newVisualInformation (and the optional top-level coordinatePlacement, coordinatePanel and labelDirections, which work as for a quadratic). pieces lists 1 to 4 pieces from left to right, each {coefficients:[constant, x coefficient, x squared coefficient]} with exact integer or fraction strings such as "-6", "3", "1/2" (degree at most 2; no decimals; an irrational coefficient is allowed only as described under IRRATIONAL COEFFICIENTS below). breakpoints has exactly one entry fewer than pieces: breakpoints[i].x (exact strings, strictly increasing) is where piece i ends and piece i+1 begins, and breakpoints[i].y is the common value there; both neighbouring pieces must give exactly that y (a jump is refused with PIECEWISE_POLY_DISCONTINUOUS, a wrong y with PIECEWISE_POLY_BREAKPOINT_VALUE_MISMATCH). The first piece runs from the left end of the source domain to the first breakpoint, the last piece from the last breakpoint to the right end. sourceDomain is {kind:"ALL_REALS"} (the outer pieces continue without end; the engine draws them a little beyond the outermost marked point) or {kind:"INTERVAL",range:[lo,hi],states:[start,end]} as for a quadratic on an interval (each breakpoint strictly inside). requiredPoints:[{id,x,y}] with numeric x and y must contain every breakpoint (corner) and the vertex of every quadratic piece whose vertex lies strictly inside that piece; the engine recomputes both and refuses a plan that misses one (PIECEWISE_POLY_CORNER_NOT_IN_REQUIRED_POINTS, PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS) or a point off the curve; give non-integer coordinates in exactCoordinates {pointId:["1/2","25/4"]} so every such point gets its exact coordinate label, and use one capital letter as id (A, B, C) so a crowded label can move to the band. formula (optional) writes the header line y=... : the source function in x with digits, x, abs(...), + - * / ^ and parentheses only, implicit products such as 2x allowed (for example "abs(x^2+x-6)+2x"); it must be the same function as the pieces (PIECEWISE_POLY_FORMULA_MISMATCH otherwise); leave it out when the source gives the function only by its pieces. referenceLines:[{id,y,intersectionX,labelIntersections}] (at most 3): id is a short ASCII name starting with a letter (for example k), y the exact height as an integer or fraction string, and intersectionX the exact x of EVERY intersection of that line with the whole curve, each once (a touching point counts once), written with integers, fractions, sqrt(...), + - * / and parentheses (for example "(-3-sqrt(53))/2"); the engine solves every piece exactly and refuses a list that differs (PIECEWISE_POLY_INTERSECTION_MISMATCH says how many it finds). Each intersection is drawn as a dot; labelIntersections:true also writes its exact coordinates beside the dot (default false: dots only, which keeps a crowded figure readable). Each line is written as y=c in the band under the formula. When the solution counts intersections with a moving line y=k, draw one representative value strictly inside the answer range (for example y=5 for 4<k<25/4) and name that value in the caption. Do not give domain or viewport: the engine frames the figure at one scale on both axes. A referenceLines entry may instead be a SLANTED line y=m*x+c: {id,slope,intercept,intersectionX} with slope (not 0) and intercept exact integer, fraction or p+q*sqrt(r) strings; it is drawn across the figure with a dot at every intersection, its equation goes to the band, and intersectionX again lists EVERY intersection x with the whole curve (PIECEWISE_POLY_INTERSECTION_MISMATCH otherwise). A moving line (y=mx+12 with m asked for, y=x+k, y=p(x-3)+3) is drawn at ONE sample value of the parameter strictly inside the answer range or at the boundary case the solution discusses; name that value in the caption. labelIntersections is not available for a slanted line (PIECEWISE_POLY_SLANTED_LINE_LABELS_UNSUPPORTED): to write the coordinates of an intersection with rational coordinates, list it in requiredPoints (id, x, y, exactCoordinates) and it is drawn once as that key point. Slope 0 with slope/intercept is refused (PIECEWISE_POLY_SLANTED_LINE_SLOPE_ZERO: use y); a slope or intercept that is not an exact integer, fraction or p+q*sqrt(r) string (a decimal, a letter) is PIECEWISE_POLY_SLANTED_LINE_COEFFICIENT_INVALID; a line equal to a whole piece is PIECEWISE_POLY_REFERENCE_LINE_CONTAINS_A_PIECE. A vertical line, a jump, or a piece of degree 3 or more is not supported; a second function that is itself piecewise is written in referenceCurves (see REFERENCE CURVES below).';
    extendedContract+=' IRRATIONAL COEFFICIENTS (piecewise-polynomial-spike-v1): when the figure needs a parabola or a line whose coefficient is irrational, for example a tangent condition k=-3+2*sqrt(3) in y=x^2+kx+5, a line of slope 6-2*sqrt(7), the line y=-11+4*sqrt(7), or a quadratic with a=2-sqrt(2) on [0,2], write that coefficient as an exact string p+q*sqrt(r) with p and q integers or fractions and r a positive integer: "-3+2*sqrt(3)", "3/2-sqrt(3)", "(1+sqrt(2))/2", "sqrt(7)/2". This works for pieces[].coefficients, breakpoints, referenceLines y, slope and intercept, and for the x and y of requiredPoints; use ONE piece (pieces has one entry, no breakpoints) for a plain quadratic. All irrational numbers of one plan use the same radical sqrt(r) (the engine computes in the field of p+q*sqrt(r)); a plan with sqrt(2) in one coefficient and sqrt(3) in another is PIECEWISE_POLY_IRRATIONAL_RADICANDS_MIXED. Nested radicals such as sqrt(2+sqrt(3)), two radicals in one coefficient (sqrt(2)+sqrt(3)) and cube roots are PIECEWISE_POLY_IRRATIONAL_FORM_UNSUPPORTED; a decimal such as 1.73 or a letter is PIECEWISE_POLY_COEFFICIENT_INVALID. A key point with irrational coordinates is given with exact strings, for example {id:"V",x:"3/2-sqrt(3)",y:"-1/4+3*sqrt(3)"}; the engine checks that it lies exactly on the curve (PIECEWISE_POLY_REQUIRED_POINT_NOT_ON_CURVE), writes it as the exact coordinate label and keeps the float for the drawing. The vertex of the parabola, every breakpoint and every contact point must still be listed in requiredPoints. intersectionX may contain nested radicals when the crossing really is one (for example "(10-2*sqrt(7)-sqrt(216-72*sqrt(7)))/4-2"); the engine and the independent observer both recompute it. The display formula cannot contain sqrt: a plan with an irrational piece and a formula is PIECEWISE_POLY_FORMULA_IRRATIONAL_UNSUPPORTED, leave formula out and name the case (for example k=-3+2*sqrt(3)) in the caption. Two cases that the solution compares (k=-3+2*sqrt(3) and k=-3-2*sqrt(3)) are two separate figures; a composite panel needs polynomial-spike-v1 and cannot hold irrational coefficients.';
    extendedContract+=' When the stored solution solves a quadratic inequality (for example D/4=(a+3)(a-5)<0 for a parameter a, or x^2+4x+3<0 together with x>=-2), use {capability:"quadratic-inequality-chain-v1",inequality:{coefficients,comparator,variable,domain,adjoinedPoints,integerPoints},graphCaption,numberLineCaption,caption,sourceConditions,newVisualInformation}: the engine draws a fixed chain of two panels, the quadratic graph y=f(variable) with its real roots and vertex as key points, then the solution set as a number line headed by the interval (for example -3<=a<5 written with the inequality signs), with a filled dot at a closed end, a hollow dot at an open end and a thick band over the set. Give only the inequality f(variable) comparator 0: coefficients are exactly three exact integer or fraction strings [constant, linear, squared] of f with a nonzero squared coefficient (expand the factored form: (a+3)(a-5) is ["-15","-2","1"]); comparator is one of "<", "<=", ">", ">="; variable is the solution variable, one lowercase letter other than y (default x). Never give endpoints, dots or coordinates: the engine solves the inequality exactly (roots with square roots allowed) and an independent observer re-solves it and checks the drawing. domain (optional) {kind:"INTERVAL",range:[lo,hi],states:[start,end]} is a condition the solution imposes on the variable (for example a+3>0 or x>=-2): lo and hi are exact strings or null for no bound, each state OPEN or CLOSED; the set is intersected with it. adjoinedPoints (optional) lists exact values a separate case of the solution adds (for example ["-3"] when the solution checks a=-3 on its own and it satisfies the condition); each must close an open end of the set. integerPoints (optional) draws the integers of the set as dots above the line: true for a bounded set, or {range:["lo","hi"]} (integer strings) to count only integers in that range; use it when the solution counts or lists integers, natural numbers or their sum. graphCaption and numberLineCaption (optional) are panel captions {math,text} as for composite panels (math plain ASCII such as k>0; text short Korean without subscripts). The final set must be one interval, one point or all reals: a set of two pieces (INEQUALITY_SOLUTION_NOT_ONE_INTERVAL), an empty set (INEQUALITY_SOLUTION_EMPTY), an adjoined value that does not touch the set (INEQUALITY_ADJOINED_POINT_NOT_ADJACENT), integer points of an unbounded set without a range (INEQUALITY_INTEGER_POINTS_NEED_RANGE), more than 25 integer points, a linear inequality and a system of two quadratic inequalities are not supported; for a system, draw the one quadratic inequality and give the other condition as domain.';
    extendedContract+=' When the stored solution compares solution sets on a number line (the intersection of two or more inequality solution sets, a solution set whose end depends on a parameter such as a or n, integer solutions, or an internal division point on the line) and no quadratic graph is needed, use {capability:"number-line-figure-v1",numberLine:{variable,parameter,rows},numberLineCaption,caption,sourceConditions,newVisualInformation}: the engine draws one panel with a row per set on one shared scale and never draws a coordinate plane. rows (1 to 4) is a list of {kind:"SET",pieces:[{lo,hi}],integerPoints}, {kind:"RESULT",integerPoints} or {kind:"POINTS",points}. A SET row is the solution set of one inequality as one or two disjoint pieces (for example x<-1 or x>2 is two pieces); a piece is {lo,hi} where each end is null for a ray or {value:"exact integer or fraction string",state:"OPEN"|"CLOSED"} (OPEN for < and >, CLOSED for <= and >=) or {param:{mul:"exact",add:"exact"},state} for an end equal to mul*p+add with p the parameter (a-2 is mul "1" add "-2"; (a+2)/3 is mul "1/3" add "2/3"); the engine writes the end label itself, stacked fractions included. parameter:{name:"a",value:"exact"} is required exactly when some end uses param: name is one lowercase letter other than the variable and y, and value is the sample value of the parameter the figure is drawn at (the figure then says it is drawn for that value; give a value that shows the case the solution discusses, for example a boundary value, and state it in caption). RESULT (at most one, after at least two SET rows, last) is the exact intersection of every SET row above it, computed and checked by the engine: never give its ends. integerPoints on a SET or RESULT row draws the integers of that row as dots over the line: true for a bounded set, or {range:["lo","hi"]} (integer strings) for a ray or to count only integers in a range; at most 25. A POINTS row (2 to 4 points, ids one capital letter each) marks points by {id,value:"exact"} or an internal division point {id,divides:{from:"A",to:"B",ratio:["m","n"]}} which the engine places at AP:PB=m:n and labels with m over AP and n over PB. variable (default x, one lowercase letter other than y) names the axis. numberLineCaption is a panel caption {math,text} as for composite panels. Refused with a code: a RESULT that is empty (NUMBER_LINE_RESULT_EMPTY), a single point (NUMBER_LINE_RESULT_IS_A_POINT) or more than two pieces (NUMBER_LINE_TOO_MANY_PIECES); pieces that overlap or touch (NUMBER_LINE_PIECES_OVERLAP, NUMBER_LINE_PIECES_TOUCH); a point piece or reversed ends (NUMBER_LINE_PIECE_IS_A_POINT, NUMBER_LINE_PIECE_INVALID); a param end without parameter (NUMBER_LINE_PARAMETER_MISSING), a parameter no end uses (NUMBER_LINE_PARAMETER_UNUSED), a bad name or sample value (NUMBER_LINE_PARAMETER_INVALID) or mul 0 (NUMBER_LINE_PARAMETER_COEFFICIENT_ZERO); decimals or non-exact values (NUMBER_LINE_VALUE_INVALID); integerPoints of an unbounded row without a range (NUMBER_LINE_INTEGER_POINTS_NEED_RANGE) or more than 25 integers (NUMBER_LINE_TOO_MANY_INTEGER_POINTS); coinciding points or a division that names a missing point (NUMBER_LINE_POINTS_COINCIDE, NUMBER_LINE_DIVISION_INVALID). A solution set that depends on the parameter in a way that changes the shape of the figure from case to case is drawn for one sample value only; never present one case as the whole answer. An external division point, a set of three or more pieces and a shaded plane region are not supported.';
    extendedContract+=' When the stored solution reads or explains a statistics or probability picture of the problem (a histogram, a frequency polygon, a relative-frequency graph, a stem-and-leaf plot, a box plot, a scatter plot, the 6x6 table of two dice, a probability tree), use {capability:"stat-chart-figure-v1",chart:{kind,...},caption,sourceConditions,newVisualInformation}: the engine draws the chart in textbook form with Korean axis titles and derives every other number itself. Give only the data of the problem, exactly. kind HISTOGRAM or FREQUENCY_POLYGON: boundaries (n+1 class boundaries as exact strings, equal class width, at least 0, at most 12 classes), series [{name?,frequencies:[one integer per class]}] or [{name?,relativeFrequencies:["0.1","3/20"]}] (relative frequencies must add up to 1; a polygon may have two named series, a histogram one), yKind "FREQUENCY" or "RELATIVE" (RELATIVE with frequencies makes the engine divide by the total), polygon true on a HISTOGRAM to draw its frequency polygon over it, xTitle and yTitle (short Korean, for example "기록(회)" and "도수(명)"), grid, showValues, highlightClasses; the engine adds the polygon end classes of frequency zero and the class midpoints itself. kind STEM_LEAF: values [whole numbers 0-999] (or groups [{name,values},{name,values}] for a back-to-back plot), unitText such as "건", title, key {stem,leaf}, marks [{group?,ranks:[rank in ascending order]} or {group?,median:true}] to circle the leaves; the engine sorts, keeps empty stems and counts. kind BOX_PLOT: series [{name,values:[at least 4 numbers]}] or [{name,summary:{min,q1,median,q3,max}}] (1 to 3 boxes), xTitle, step, showValues; quartiles follow the curriculum (Q1 and Q3 are the medians of the lower and upper half, the middle value left out when n is odd). kind SCATTER: points [{x,y,name?}] (every plotted point, at most 40), xRange and yRange [lo,hi] (at least 0, ends multiples of the step), xStep, yStep, labelEvery, xTitle, yTitle, grid, diagonal true for the line y=x. kind DICE_TABLE: faces (default 6), cell PAIR, SUM, PRODUCT or NONE, highlight as a condition on the two dice a (across) and b (down): {expr:"a+b",in:[2,7]}, {expr,cmp:"<=",value}, combined with any, all or not (expr uses integers, a, b, + - * and parentheses, for example "b-2*a"); the engine colours exactly the cells that satisfy it. kind TREE: root {label?,children:[{label,p:"3/7",children:[...]}]} with 2 to 5 children per node, depth at most 3, at most 12 leaves, exact probabilities p on every branch or on none (the probabilities of the children of a node must add up to 1), showPathProbability to write the product along each path at its leaf. Refused with a code: unequal class widths (STAT_CLASS_WIDTH_UNEQUAL), a frequency list of the wrong length (STAT_FREQUENCY_COUNT_MISMATCH), a stated total that is not the sum (STAT_FREQUENCY_TOTAL_MISMATCH), relative frequencies not adding up to 1 (STAT_RELATIVE_SUM_NOT_ONE), a leaf mark outside the data (STAT_STEM_MARK_INVALID), fewer than 4 box-plot values (STAT_BOX_NEEDS_FOUR_VALUES), a point outside the axis range (STAT_POINT_OUTSIDE_RANGE), an expression that uses another letter (STAT_DICE_EXPR_INVALID), branch probabilities not adding up to 1 (STAT_TREE_BRANCH_PROBABILITY_SUM) or given on only some branches (STAT_TREE_PROBABILITY_MIXED), a title or label that cannot be placed (STAT_LABEL_OUT_OF_BOUNDS, STAT_LABELS_TOO_CLOSE). A pie chart, a category bar chart and a cumulative graph are not supported.';
    extendedContract+=' APPLICATION AXES (polynomial-spike-v1, a quadratic on sourceDomain INTERVAL only): for a word problem whose two axes measure different quantities (a count 0..50 against a profit 0..45000, a perimeter against an area) set graphPlan.applicationAxes:true. Each axis then has its own scale (the plot is 448 by 360 and the figure is never drawn at one scale), the author gives the real tick values as graphPlan.axisTickValues:{x:[...],y:[...]} (2 to 8 values per axis, an arithmetic progression with step 1, 2 or 5 times a power of ten, every value a multiple of the step, nonzero, inside the framed view; pick values that stay clear of the curve and the key points), and graphPlan.axisVariable may be one letter other than y, lower or upper case (n, P), for the horizontal axis. domain, viewport and requiredPoints work as for an interval quadratic (key points on the curve, endpoint dots at the interval ends); straight lines are allowed. A pure mathematical graph must never use it: it keeps one scale. The independent observer re-checks the plot size against the viewport and each axis scale and re-validates the ticks. Refused with a code: APPLICATION_AXES_REQUIRES_QUADRATIC_INTERVAL (any other family, ALL_REALS, cubic), INVALID_APPLICATION_AXES (the flag is not true, or axisSqueeze or plotCanvas is given), APPLICATION_AXES_TICKS_INVALID:x or :y (missing, empty, not 1-2-5 or outside the view), APPLICATION_AXES_CURVE_TOO_NARROW (the interval is under 48 px wide), APPLICATION_AXES_SCALE_MISMATCH (observer).';
    extendedContract+=' REFERENCE CURVES (piecewise-polynomial-spike-v1): when the solution needs a second function drawn with the first (f and g crossing, the solution of f(x)<=g(x)), add graphPlan.referenceCurves (at most two). Each entry is EITHER a quadratic {id,name?,coefficients:[constant, x coefficient, x squared coefficient],intersectionX:[...]} with a nonzero x squared coefficient, OR a piecewise function {id,name?,pieces:[{coefficients},...] (1 to 4, degree at most 2),breakpoints:[{x,y},...] (one fewer than pieces; the pieces must meet there, a jump is PIECEWISE_POLY_REFERENCE_CURVE_DISCONTINUOUS),sourceDomain?,formula?,intersectionX:[...]}, where sourceDomain is omitted or {kind:"ALL_REALS"}, or {kind:"INTERVAL",range:[lo,hi],states:[start,end]} for its OWN domain (an OPEN end is drawn hollow and excluded as a crossing). id is a short ASCII name starting with a letter; name (optional) is one lowercase letter other than i, x and y and labels the curve in the band (name + "(x)=" + formula when formula is given, else name + "(x)"; without a name y=formula or y). All coefficients are exact integer, fraction or p+q*sqrt(r) strings (one radical for the whole plan). intersectionX lists EVERY x where BOTH functions are defined and equal (each once, integers, fractions and sqrt(...) allowed, at most 8); the engine and the independent observer solve it piece pair by piece pair, so a root outside either function piece interval, or at an OPEN end, is never a crossing (PIECEWISE_POLY_INTERSECTION_MISMATCH:<id>:engine finds N intersection(s) otherwise). Each crossing is a dot, or the key point it coincides with. The vertex of a quadratic reference curve, and every corner and every vertex strictly inside a piece of a piecewise one, must be listed in requiredPoints (PIECEWISE_POLY_REFERENCE_CURVE_VERTEX_NOT_IN_REQUIRED_POINTS, PIECEWISE_POLY_REFERENCE_CURVE_CORNER_NOT_IN_REQUIRED_POINTS), and a requiredPoints entry may lie on the function or on a reference curve inside that reference own domain. graphPlan.functionName (one lowercase letter, same limits) writes the header as f(x)=formula, or the name f(x) next to the curve when the function is given only by pieces. The optional graphPlan.sampleNote (at most 32 characters of digits, letters, = + - * / ( ) . and spaces, for example "a=2") writes the parameter value the figure is drawn at inside the upper left of the plot (PIECEWISE_POLY_SAMPLE_NOTE_INVALID otherwise); name the same value in the caption. A piecewise reference curve is labelled next to its own drawing (its corner), not in the band, so the two curves are not confused. A quadratic reference curve whose x squared coefficient is 0 (PIECEWISE_POLY_REFERENCE_CURVE_NOT_QUADRATIC), a curve equal to a whole piece (PIECEWISE_POLY_REFERENCE_CURVE_CONTAINS_A_PIECE), a third curve or a malformed entry (PIECEWISE_POLY_REFERENCE_CURVES_INVALID), a bad letter (PIECEWISE_POLY_FUNCTION_NAME_INVALID), more than 4 reference pieces (PIECEWISE_POLY_REFERENCE_CURVE_PIECE_COUNT_INVALID), a bad reference domain or breakpoint (PIECEWISE_POLY_REFERENCE_CURVE_SOURCE_DOMAIN_INVALID, PIECEWISE_POLY_REFERENCE_CURVE_BREAKPOINT_INVALID) or a reference formula that is not the pieces (PIECEWISE_POLY_REFERENCE_CURVE_FORMULA_MISMATCH) is refused. A cubic or higher curve, a vertical line and a shaded region are still not supported.';
    extendedContract+=SOLID_FIGURE_CONTRACT;
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
    if(!['construction-spike-v1','polynomial-spike-v1','rational-spike-v1','sqrt-affine-spike-v1','absolute-value-spike-v1','piecewise-affine-spike-v1','exponential-affine-spike-v1','logarithmic-affine-spike-v1','trigonometric-spike-v1','piecewise-polynomial-spike-v1','exp-log-pair-spike-v1'].includes(plan.capability))throw Error('UNSUPPORTED_CAPABILITY');
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
    const staticAudit=await workerPrimitiveAudit({svg:built.svg,points:peerPoints,lines:peerLines,circles:peerCircles,segments:plan.displaySegments||[],rightAngles:plan.rightAngles||[],transform:built.witness.coordinateModel,fragments,coordinateMode:model.coordinateMode??'FUNCTION_GRAPH'});
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
